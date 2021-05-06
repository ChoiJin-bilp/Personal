<template>
	<div>
		<div class="login">
			<div class="login-top">
				<img :src="DataURL+'/images/logo-ykcy.png'"></img>
			</div>
			<div>
				<div class="adddvice-s-s">
					<div>
						<a>账</a>
						<a>号</a>
					</div>
					<input @input='changeValueMainData()' v-model="accountName"></input>
				</div>
				<div class="adddvice-s-s">
					<div>
						<a>密</a>
						<a>码</a>
					</div>
					<input type="password" @input='changeValueMainData()' v-model="accountPwd"></input>
				</div>
			</div>
			<div class="anniu" @click.stop="submitLoginInfo()">登录</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	//引入外用js
	import MD5JS from '../utils/md5.js';
	//引入外用js
	import Utils from '../utils/util.js';
	//引入封装好的vuex
	import {mapGetters} from 'vuex';
	//引入封装好的Cookie
	import {setCookie,getCookie,removeCookie} from '@/utils/support.js';
	export default {
		name: 'Mymain',
		data: function() {
			var that = this; 
			const interfacePart = that.$store.getters.sidebar.interfacePart,
			smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart,
			srvDevTest = that.$store.getters.sidebar.smurl;
			return {
				isLoad: false, //是否已经加载
				DataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload', //远程资源路径
				accountName: "",
				accountPwd: "",
			}
		},
		mounted: function() {
			this.accountName = getCookie('accountName')
			this.accountPwd = getCookie('accountPwd')
			//创建swiper对象
			// var swiper = new Swiper('.swiper-container', {
			// 	loop: true,
			// 	autoplay: 2000, //自动轮播切换图的速度
			// 	speed: 1000,
			// 	observer: true, //配置swiper兼容异步操作
			// 	observerParents: true, //配置swiper兼容异步操作
			// 	pagination: '.swiper-pagination',
			// 	paginationClickable: true
			// });
		},
		computed:{
			...mapGetters(['sidebar'])
		},
		methods: {
			//输入事件
			changeValueMainData() {},
			//登录
			submitLoginInfo: function() {
				let that = this;
				that.validLoginDataInfo();
			},
			//方法：验证登录账户
			validLoginDataInfo: function() {
				if(this.accountName == '' || this.accountPwd == ''){
					this.$message({
						type: 'error',
						message: '请输入账号密码!'
					});
					return
				}
				var appid = 1;
				var KEY = "amj_b5e9sdfd6ws325"; //接口key
				var that = this,
					accountName = that.accountName,
					accountPwd = that.accountPwd;
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				let timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var URL = srvDevTest + interfacePart;
				var cashId = that.$store.getters.sidebar.cashId
				let urlParam = "",
					sign = "";
				urlParam = "cls=main_companyAndUser&action=companyAndUserList&appId=" + appid + "&timestamp=" + timestamp;
				sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				console.log('sign:' + urlParam + "&key=" + KEY)
				urlParam = urlParam + "&userName=" + encodeURIComponent(accountName) + "&sign=" + sign+"&cashId="+cashId+"&password="+accountPwd;
				console.log(URL + urlParam)
				console.log('~~~~~~~~~~~~~~~~~~~')

				axios.get(URL + urlParam).then(res => {
					console.log(res);
					if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
						let mainData = res.data.data,
							userId = 0,
							user_roleId = 0,
							accountRecordId = 0,
							accountCompanyIdList = "",
							firstCompanyId = 0;
						if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
							let oldPwd = "";
							accountRecordId = mainData.dataList[0].id;
							if (Utils.isNotNull(mainData.dataList[0].password) && Utils.myTrim(mainData.dataList[0].password + "") !=
								"null") {
								oldPwd = Utils.myTrim(mainData.dataList[0].password);
							}
							if (oldPwd != Utils.myTrim(accountPwd)) {
								this.$message({
									type: 'error',
									message: '密码错误！'
								});
								return;
							}
							if (Utils.isNotNull(mainData.dataList[0].userId) && Utils.myTrim(mainData.dataList[0].userId + "") != "null") {
								try {
									userId = parseInt(mainData.dataList[0].userId);
									userId = isNaN(userId) ? 0 : userId;
									console.log(userId)
								} catch (err) {}
							}
							if (Utils.isNotNull(mainData.dataList[0].user_roleId) && Utils.myTrim(mainData.dataList[0].user_roleId + "") != "null") {
							  try {
								user_roleId = parseInt(mainData.dataList[0].user_roleId);
								user_roleId = isNaN(user_roleId) ? 0 : user_roleId;
							  } catch (err) { }
							}
							if (user_roleId > 0) {
								that.gotoMyPersonCenter(userId);
								setCookie('accountName',accountName,15);
								setCookie('accountPwd',accountPwd,15);
							} else {
								this.$message({
									type: 'error',
									message: '无效账户！'
								});
							}
						}
					}
				})
			},
			gotoMyPersonCenter(userId){
				var that =this;
				//跳转页面
				that.$router.push('/Itemlist');
				//储存userId
				that.$store.dispatch('toggleDusk',userId)
			},
		}

	}
</script>

<style scoped lang="scss">
	/* pages/userLogin/userLogin.wxss */
	.login {
		width: 100%;
		position: fixed;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
		padding-bottom: 100px;
	}

	.login-top {
		width: 100%;
		padding-left: 30px;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 50px;
	}

	.login-top img {
		width: 800px;
		height: 444px;
		transform: scale(0.8, 0.9);
	}

	.adddvice-s-s {
		width: 100%;
		display: flex;
		justify-content: center;
		/* justify-content: flex-start; */
		color: #999;
		font-size: 2.8rem;
		align-items: center;
		padding: 10px;
	}

	.adddvice-s-s input {
		border: #e5e5e5 solid 1px;
		box-sizing: border-box;
		border-radius: 10px;
		color: #333;
		width: 70%;
		height: 76px;
		padding-left: 20px;
		font-size: 2.8rem;
	}

	.adddvice-s-s div {
		display: flex;
		justify-content: space-between;
		padding: 0 20px;
		width: 20%;
	}

	.anniu {
		background: #0066EB;
		padding: 5px 30px;
		box-sizing: border-box;
		border-radius: 20px;
		width: 40%;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		color: #fff;
		margin: 0px auto;
		margin-top: 80px;
		margin-left: 50%;
		transform: translateX(-50%);
	}
</style>

<template>
	<div class="findCon">
		<template v-if="shopsistListtype">
			<div class="RightTop">
				<div class="RightList">
					<a class="ListTile">订单列表</a>
				</div>
				<div class="el-heavy-rain">
					<div class="RightItem" v-for="(item,index) in shopsistList" :key="index">
						<img class="diancanimg" :src="item.image" />
						<div class="diancanItem">
							<div class="bank-num" style="font-size: 20px">
								<div style="font-size: 24px;color: #FF3333;">
									￥{{item.amount}}
								</div>
								×{{item.num}}</div>
							<div class="diancanName">{{item.productName}}</div>
							<div class="diancanpeiLiao">
								<div style="margin-bottom: 6px;display: flex;">
									<div v-for="(labitem,id) in item.showLabels" :key="id" :style="id>0?'margin-left:6px;margin-top:6px;':'margin-top:6px;'">
										<a class="selectqian" v-if="id<=2">
											{{labitem}}
										</a>
									</div>
								</div>
								<a class="selecthou" v-for="(labitem,id) in item.showLabels" :key="id">
									<template v-if="id!=undefined">
										{{ id>2? "+"+labitem:''}}
									</template>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="RightPay">
				<div class="mllt">
					<div class="butgtou">
						<a>数量:</a>
						<a class="focolor" style="margin-right:20px;margin-left: 6px;">{{shoppingCartCnt}}</a>
						<a>合计:</a>
						<a class="focolor">￥</a>
						<a class="fokuput">{{shoppingCartAmount}}</a>
					</div>
				</div>
			</div>
		</template>
		<template v-if="!shopsistListtype">
		<div v-if="!shopsistListtype" class="swiper-container2">
			<div class="swiper-container">
			    <div class="swiper-wrapper">
			        <div class="swiper-slide" v-for="item in swiperList">
						<img :src="item.img" :style="'width:100%;height:'+h+'px;'"/>
					</div>
			    </div>
				<div class="swiper-pagination"></div>
			</div>
		</div>
		</template>
		<!--弹窗阴影-->
		<div class="windowBackgroud" v-if="DfrType"></div>
		<div class="windowitem" v-if="DfrType">
			<img :src="MSJreurl" />
		</div>
	</div>
</template>

<script>
	//引入cookie
	import {setCookie,getCookie,removeCookie} from '@/utils/support.js';
	//引入外用js
	import MD5JS from '../../utils/md5.js';
	
	import {getShoppingCartData,doGetData} from "../../utils/axaj.js"
	
	import axios from 'axios';
	//引入轮播图
	import Swiper from 'swiper';
	//引入轮播的样式
	import "swiper/dist/css/swiper.min.css";
	
	export default{
		name:'Mymain',
		data:function(){
			return {
				// 购物车的商品列表
				shopCarList: [],
				//购物车数量
				shoppingCartCnt: 0,
				shoppingCartAmount: 0,
				swiperList:[],
				h:'',
				DfrType:"",
				MSJreurl:''
			}
		},
		computed:{
			shopsistList: function() {
				var that = this;
				let bbtlist = JSON.parse(JSON.stringify(that.shopCarList));
				for (let i = 0; i < bbtlist.length; i++) {
					let buss = bbtlist[i].showLabels.split('/')
					bbtlist[i].showLabels = buss
					bbtlist[i].image = bbtlist[i].labList[0].photos.split(',')[0]
				}
				console.log(that.shopCarList)
				return bbtlist
			},
			shopsistListtype(){
				console.log(this.shopsistList.length)
				var type
				if(this.shopsistList.length>0){
					var type = true
				}else{
					var type = false
				}
				return type
			},
			
		},
		watch:{
			DfrType(val, oldVal){
				var that = this;
				if(val){
					setTimeout(()=>{
						removeCookie('ChangeDfrType');
					},10000)
				}
			},
			shoppingCartCnt(val, oldVal){
				var that = this;
				if(val>0){
					
				}else{
					that.huoQuhbt2()
				}
			},
		},
		mounted:function(){
			var that = this
			//获取购物车数据
			setInterval(() => {
				that.getShopCar()
				that.ShoppingCartData()
			}, 4000);
			//获取轮播图片
			setTimeout(()=>{
				that.huoQuhbt2()
			},500)
			var h = window.innerHeight
			this.h = h
			//获取二维码
			setInterval(() => {
				that.DfrTypefuc()
			}, 2000);
		},
		methods: {
			DfrTypefuc(){
				var DfrType = getCookie('ChangeDfrType');
				var MSJreurl = getCookie('MSJreurl');
				this.DfrType = DfrType
				this.MSJreurl = MSJreurl
			},
			huoQuhbt2(){
				var that = this
				var srvDevTest = this.$store.getters.sidebar.smurl; 
				var cashId = that.$store.getters.sidebar.cashId
				var appId = that.$store.getters.sidebar.appId;
				var KEY = "amj_b5e9sdfd6ws325"; //测试接口key
				var smallInterfacePart = that.$store.getters.sidebar.interfacePart;
				var URL = srvDevTest + smallInterfacePart;
				let timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				let urlParam = "",
					sign = "";
				urlParam = "cls=main_gbanner&action=gbannerList&appId=" + appId+ "&timestamp=" + timestamp;
				sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				console.log('sign:' + urlParam + "&key=" + KEY)
				urlParam = urlParam +"&sign=" + sign+"&urltype=" + 2;
				console.log(URL + urlParam)
				console.log('~~~~~~~~~~~~~~~~~~~')
				axios.get(URL + urlParam).then(res => {
					console.log(res)
					that.swiperList = res.data.data.dataList;
					//创建swiper对象
					setTimeout(()=>{
						var swiper = new Swiper('.swiper-container',{
							loop:true,
							autoplay:10000,//自动轮播切换图的速度
							speed:1000,
							observer:true,//配置swiper兼容异步操作
							observerParents:true,//配置swiper兼容异步操作
							pagination: '.swiper-pagination',
							paginationClickable: true
						});
					},1000)
				}).catch(()=>{
					that.$message({
						type: 'info',
						message: '网络错误'
					});
				})
			},
			ShoppingCartData: function() {
				var that = this;
				//公司id
				var agentCompanyId = this.$store.getters.sidebar.CompanyId
				var otherParam = "&shopType=3&companyId=" + agentCompanyId
				getShoppingCartData(that, otherParam);
			},
			getShopCar() {
				// var userId = appUserInfo.userId
				//用户id
				var userId = this.$store.getters.sidebar.userId
				console.log(userId)
				//公司id
				var agentCompanyId = this.$store.getters.sidebar.CompanyId
				let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId;
				var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + agentCompanyId;
				var srvDevTest = this.$store.getters.sidebar.smurl
				var smallInterfacePart = this.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				doGetData(this, smurl, signParam, otherParam, 5, "用戶购物车列表")
			},
			getRuslt: function(data, code, error, tag) {
				let that = this;
				switch (code) {
					case 1:
						console.log(data)
						var content = ""
						switch (tag) {
							case 5:
								that.dealData5(data)
								break
						}
						break;
					default:
						console.log(error)
					break
				}
			},
			//获取当前机器使用userId
			// huoQuhbt(){
			// 	var that = this
			// 	var srvDevTest = this.$store.getters.sidebar.smurl; 
			// 	var cashId = that.$store.getters.sidebar.cashId
			// 	var appId = that.$store.getters.sidebar.appId;
			// 	var KEY = "amj_b5e9sdfd6ws325"; //测试接口key
			// 	var smallInterfacePart = that.$store.getters.sidebar.interfacePart;
			// 	var URL = srvDevTest + smallInterfacePart;
			// 	let timestamp = Date.parse(new Date());
			// 	timestamp = timestamp / 1000;
			// 	let urlParam = "",
			// 		sign = "";
			// 	urlParam = "cls=main_companyAndUser&action=getCashUser&appId=" + appId+ "&timestamp=" + timestamp;
			// 	sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
			// 	console.log('sign:' + urlParam + "&key=" + KEY)
			// 	urlParam = urlParam +"&cashId="+cashId+"&sign=" + sign;
			// 	console.log(URL + urlParam)
			// 	console.log('~~~~~~~~~~~~~~~~~~~')
			// 	axios.get(URL + urlParam).then(res => {
			// 		console.log(res)
			// 		that.$store.dispatch('toggleDusk',res.data.data.userId)
			// 		// that.$store.dispatch('toggleDusk',10510)
			// 	})
			// },
			dealData5(data) {
				var that = this
				let shopCarList = data.shopCarList
				if (shopCarList.length > 0) {
				  for (let i = 0; i < shopCarList.length; i++) {
					const shopCar = shopCarList[i];
					var showLabelList = []
					var labels = shopCar.labList
					for (let j = 0; j < labels.length; j++) {
					  const label = labels[j];
					  showLabelList = showLabelList.concat(label.lblname)
					}
					shopCar.showLabels = showLabelList.join("/")
					if (shopCar.synimage_price > 0) {
					  shopCar.amount += shopCar.synimage_price
					}
				  }
				  that.shopCarList= shopCarList
				} else {
					// wx.showToast({
					//   title: "购物车里是空的",
					//   icon: 'none',
					//   duration: 1500
					// })
					this.shopCarList = []
				}
			},
		}
	}
</script>

<style lang="scss">
	.RightTop {
		padding-top: 30px;
		box-sizing: border-box;
		width: 100%;
	}
	
	.RightList {
		width: 96%;
		height: 36px;
		font-size: 1.4rem;
		color: #333;
		border-bottom: 2px solid #E3E3E3;
		margin: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.RightList button {
		height: 88%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.RightItem {
		display: flex;
		float: left;
		padding: 20px;
		box-sizing: border-box;
		margin: auto;
		border-radius: 10px;
		position: relative;
		align-items: center;
	}
	.RightItem::after {
		clear: both;
	}
	.RightItem:active {
		transform: scale(0.95);
		box-shadow: 0px 0px 6px #CCD1D4;
	}
	
	.RightItem:hover {}
	
	.dateButton {
		position: absolute;
		font-size: 14px;
		color: #FFF;
		background-color: #FFCC66;
		border-radius: 4px;
		padding: 4px 6px;
		right: 4px;
		top: 4px;
	}
	
	.dateButton:active {
		box-shadow: 0px 0px 6px #aa2e22;
	}
	
	.diancanimg {
		width: 126px;
		height: 126px;
		border-radius: 10px;
	}
	
	.diancanItem {
		margin-left: 10px;
		min-width: 140px;
		height: 150px;
		position: relative;
		padding-bottom: 36px;
		box-sizing: border-box;
	}
	
	.diancanName {
		font-size: 20px;
		color: #333;
		font-weight: 600;
		max-width: 140px;
	}
	
	.selectqian {
		font-size: 14px;
		color: #37689F;
		background-color: #F3EFED;
		padding: 2px 6px;
		border-radius: 4px;
		margin-bottom: 6px;
	}
	
	.selecthou {
		font-size: 12px;
		color: #F78329;
		margin-bottom: 6px;
	}
	
	.el-heavy-rain {
		max-height: 530px;
		overflow-y: auto;
		padding: 10px 0;
		box-sizing: border-box;
	}
	
	.RightPay {
		background-color: #E3E3E3;
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 10px;
		height: 100px;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
	}
	
	.mllt {
		    display: flex;
		    justify-content: space-between;
		    align-items: center;
		    width: 100%;
		    height: 100%;
	}
	
	.unselectPaymay {
		background-color: #fff;
		color: #B3B3B3;
		padding: 6px 20px;
		border-radius: 4px;
	}
	
	.selectPaymay {
		background-color: #059837;
		color: #fff;
	}
	
	.PaymayTo {
		background-color: #F68329;
		color: #fff;
		padding: 6px 20px;
		border-radius: 4px;
	}
	
	.butgtou {
		font-size: 18px;
		color: #333;
		width: 76%;
		margin-bottom: 10px;
	}
	
	.focolor {
		color: #FF3333;
	}
	
	.fokuput {
		color: #FF3333;
		font-size: 26px;
	}
	.bank-num{
		position: absolute;
		color: #333;
		font-size: 14px;
		bottom: 0px;
		right: 0px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.swiper-container{
		.swiper-wrapper{
			.swiper-slide{
				img{width: 100%; height:360px;}
			}
		}
	}
	.swiper-container2{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 18;
		width: 100%;
		height: 100%;
	}
	.swiper-container2::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 0px;
	}
	.swiper-container2::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.swiper-container2::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	.sdkj{
		width: 100%;
		height: 100%;
	}
	/*公共背景css*/
	.windowBackgroud {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #070707;
		opacity: 0.6;
		z-index: 20;
	}
	/*规格选择css*/
	.windowitem {
		position: fixed;
		left: 50%;
		bottom: 50%;
		z-index: 25;
		background: #eff0f2;
		transform: translateX(-50%) translateY(50%);
		border-radius: 14px;
		padding: 30px;
		box-sizing: border-box;
	}
</style>

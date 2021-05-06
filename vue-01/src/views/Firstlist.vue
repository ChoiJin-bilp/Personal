<template>
	<div class="bossback" id="Fistlist">
		<!--头顶部分-->
		<div class="yuntop">
			<div class="yunlogo">
				<img :src="SMDataURL+'/images/alittleLogo.png'"></img>
				<a>云客茶语（海岸城店）</a>
			</div>
			<div class="yuntime">
				<a class="timety">{{Minute}}</a>
				<a class="timety">{{HourTime}}</a>
			</div>
			<ul class="personalDetail">
				<li>
					<div class="huJiao" @click="gotocallBack()">
					<img :src="SMDataURL+'/images/PC-ling.png'"></img>
					<div class="huJiao-ve" v-if="Arraynum>0">{{Arraynum}}</div>
					</div>
					<div class="pouts">
						<p>
							<a>海岸城区</a>
							<a>{{cashId}}</a>
						</p>
						<el-dropdown @command="tclogin">
							<span class="el-dropdown-link">
								<img :src="SMDataURL+'/images/qqzhi.jpg'"></img>
							</span>
							<el-dropdown-menu slot="dropdown" v-if="xialatype">
								<el-dropdown-item command="c">交班</el-dropdown-item>
								<el-dropdown-item command="a">切换账号</el-dropdown-item>
								<el-dropdown-item command="b">退出登录</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<el-dropdown @command="gotoPage">
						<span class="el-dropdown-link">
							<img class="imhty" :src="SMDataURL+'/images/alittleZezhi.png'"></img>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="send3">标签</el-dropdown-item>
							<el-dropdown-item command="send4">关闭</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-dropdown @command="gotoPage">
						<span class="el-dropdown-link">
							<img class="imhty" :src="SMDataURL+'/images/alittlecaidan.png'"></img>
						</span>
						<el-dropdown-menu slot="dropdown" v-if="mengtype">
							<el-dropdown-item command="a">订单管理</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</li>
			</ul>
		</div>
		<!--中间部分-->
		<div class="forTime">
			<!--中间左部-->
			<div class="forTimeLeft">
				<div class="LeftTop">
					<div class="yuew">
						<div class="lpoi" v-for="(item,index) in selProcuctTypeListont" :key="index">
							<div :style="index==0?'padding-left:0;':''" class='unselect link' v-if="item.name!='团购'&&item.name!='智能按摩'"
							 @click.stop="selectCatalog(index)">
								<a :class="index == item.type ?'selectFenlei':''">{{item.name}}</a>
							</div>
						</div>
					</div>
				</div>
				<div class="line-bot"></div>
				<div class="LeftItem">
					<div class="zanwu" v-if="Mistletype != false">
						~暂无此类商品😭
					</div>
					<div class="naichaItem link" v-if="item.productTypeName!='智能按摩'" v-for="(item,index) in dataArray" :key="index"
					 @click="addProcuctnum(index)" :style="index==0?'margin-left:0;':''">
						<img class="naichaimg" :src="item.photo" />
						<a class="naichaprice">￥{{item.showprice}}</a>
						<div class="naichaname">{{item.productName}}</div>
						<template v-if="item.num>0">
							<div class="naichanum">{{item.num}}</div>
						</template>
					</div>
				</div>
			</div>
			<!--中间右部-->
			<div class="forTimeRight">
				<div class="RightTop">
					<div class="RightList">
						<a class="ListTile">订单列表</a>
						<div class="bntpwe link" @click.stop="clearShopCar()" type="warning" plain>清空</div>
					</div>
					<div class="el-heavy-rain">
						<div class="RightItem link" v-for="(item,index) in shopsistList" :key="index" @click.stop="changeNickNum(item.num,item.productName,item.detailLabelId,item.id,item.synimage)">
							<div class="dateButton" @click.stop='delmoel(item.id,item.num,item.productName)'>删除</div>
							<img class="diancanimg" :src="item.image" />
							<div class="diancanItem">
								<div class="diancanName">{{item.productName}}</div>
								<div class="diancanpeiLiao">
									<div style="margin-bottom: 6px;display: flex;">
										<div v-for="(labitem,id) in item.showLabels" :key="id" :style="id>0?'margin-left:6px;':''">
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
									<div id="">
										￥{{item.amount}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="RightPay">
					<div class="butgtou">
						<a>数量:</a>
						<a class="focolor" style="margin-right:20px;margin-left: 6px;">{{shoppingCartCnt}}</a>
						<a>合计:</a>
						<a class="focolor">￥</a>
						<a class="fokuput">{{shoppingCartAmount}}</a>
					</div>
					<div class="mllt">
						<!-- 						<div>						
							<a style="margin-left:0;" class="unselectPaymay selectPaymay">微信</a>
							<a class="unselectPaymay">支付宝</a> 
							<a class="unselectPaymay">现金</a>
						</div> -->
						<a></a>
						<a @click="gotopage()" class="PaymayTo link">去结算</a>
					</div>
				</div>
			</div>
		</div>
		<!--弹窗阴影-->
		<div class="windowBackgroud" v-if="chilType||ListmbykeType" @click="emptyType()"></div>


		<!--规格选择弹窗-->
		<div class="windowitem" v-if="chilType">
			<template v-if="peilList">
				<div class="Xuantop">规格选择</div>
				<div class="ComeItem">
					<div class="Bxkashanx">
						<div class="Bxkashanx-item" v-for="(item,index) in peilList.detail" :key="index" :style="index==0?'margin-top: 0;':''">
							<div class="kashTitle">
								{{item.attributeOne}}
							</div>
							<div class="kstylerice ">
								<div v-for="(labelitem,id) in item.labels" :key="id" @click.stop="labelitem.available>0?selectProductLabels(index,id):''"
								 :class="labelitem.checked?'kashprice selectkashprice link':'kashprice link'">
									<a>{{labelitem.lblname}}</a>
									<a v-if="labelitem.lblsingle==0" class="msduskprice">￥{{labelitem.lblprice}}</a>
									<div v-if="labelitem.available==0" class="pomilk"></div>
								</div>
							</div>
						</div>
						<template v-if="peilList.photoType==2">
							<div class="Bxkashanx-item">
								<div class="kashTitle" style="width: 16%;">
									云客图库
								</div>
								<div class="kstylerice ">
									<div v-for="(imageitem,key) in customizeImgList" :key="key" :class="selectCustomizeImgIndex==key?'kashprice selectkashprice ':'kashprice'"
									 style="width: 190px" @click.stop="selectCustomizeImg(key)">
										<a>{{imageitem.name}}</a>
									</div>
								</div>
							</div>
						</template>
					</div>
					<div class="Bxkachanx">
						<img class="Guigeimg" :src="peilList.photo" />
						<div class="vuguofont">{{peilList.productName}}</div>
						<div class="vuguoprice">￥{{peilList.surice}}</div>
						<div class="jouse">
							<img class="link" @click.stop="increase(0)" :src="SMDataURL+'/images/amtedel.png'" />
							<a>{{peilList.pusteh}}</a>
							<img class="link" @click.stop="increase(1)" :src="SMDataURL+'/images/amteput.png'" />
						</div>
						<div class="qingkong" v-if="!chilType">删除</div>
						<div class="qingkong quxiao link" @click.stop="emptyType()">取消</div>
						<div class="qingkong queren link" @click.stop="selectOK(peilList.pusteh)">确认</div>
					</div>
				</div>
			</template>
		</div>
		<!--修改弹窗-->
		<div class="windowitem" v-if="ListmbykeType">
			<template v-if="shopchiooseList">
				<div class="Xuantop">规格选择</div>
				<div class="ComeItem">
					<div class="Bxkashanx">
						<div class="Bxkashanx-item" v-for="(item,index) in shopchiooseList.detail" :key="index" :style="index==0?'margin-top: 0;':''">
							<div class="kashTitle">
								{{item.attributeOne}}
							</div>
							<div class="kstylerice ">
								<div v-for="(labelitem,id) in item.labels" :key="id" @click.stop="labelitem.available>0?selectProductLabels2(index,id):''"
								 :class="labelitem.checked?'kashprice selectkashprice link':'kashprice link'">
									<a>{{labelitem.lblname}}</a>
									<a v-if="labelitem.lblsingle==0" class="msduskprice">￥{{labelitem.lblprice}}</a>
									<div v-if="labelitem.available==0" class="pomilk"></div>
								</div>
							</div>
						</div>
						<template v-if="shopchiooseList.photoType==2">
							<div class="Bxkashanx-item">
								<div class="kashTitle" style="width: 16%;">
									云客图库
								</div>
								<div class="kstylerice">
									<div v-for="(imageitem,key) in customizeImgList" 
									:key="key" :class="selectCustomizeImgIndex==key?'kashprice selectkashprice link':'kashprice link'"
									 style="width: 190px" @click.stop="selectCustomizeImg(key)">
										<a>{{imageitem.name}}</a>
									</div>
								</div>
							</div>
						</template>
					</div>
					<div class="Bxkachanx">
						<img class="Guigeimg" :src="shopchiooseList.photo" />
						<div class="vuguofont">{{shopchiooseList.productName}}</div>
						<div class="vuguoprice">￥{{shopchiooseList.surice}}</div>
						<div class="jouse">
							<img class="link" @click.stop="increase(0,0)" :src="SMDataURL+'/images/amtedel.png'" />
							<a>{{shopchiooseList.pusteh}}</a>
							<img class="link" @click.stop="increase(1,0)" :src="SMDataURL+'/images/amteput.png'" />
						</div>
						<div class="qingkong link" @click.stop="delelttype(shopchiooseList.productName)">删除</div>
						<div class="qingkong quxiao link" @click.stop="emptyType()">取消</div>
						<div class="qingkong queren link" @click.stop="selectOK2(shopchiooseList.pusteh,shopchiooseList.productName)">确认</div>
					</div>
				</div>
			</template>
		</div>
		<template v-if="poryow">
			<div class="windowBackgroud"></div>
			<div class="ploeryt">
				<div class="ploerytdiv">
					<div class="text-p">即将交班</div>
					<input type="password" v-model="plrut" placeholder='请输入当前账号的输入密码' />
					<div class="kdpor">
						<div class="kdpor-z" @click.stop="passWork(1)">取消</div>
						<div class="kdpor-z kdpor-o"@click.stop="passWork()">确认交班</div>
					</div>
					<!-- <img class="kdpor-img" :src="SMDataURL+'/images/cleardel.png'" /> -->
					    <div class="poete" @click.stop="passWork(1)">
					      <div class="ete" catchtap="changechilType"></div>
					    </div>
				</div>
			</div>
		</template>
		
	</div>
</template>

<script>
	import {
		setCookie,
		getCookie,
		removeCookie
	} from '@/utils/support.js';
	import MD5JS from '../utils/md5.js';
	//引入vuex
	import {
		mapGetters
	} from 'vuex';
	//引入element-ui message方法
	import {
		Message,MessageBox
	} from 'element-ui';
	import {
		fetchProductList
	} from '@/api/product.js';
	import Utils from '../utils/util.js';
	import {
		doGetData,
		getShoppingCartData,
		getProductTypeList,
		dowithGetProductTypeList,
		signMessage,
	} from "../utils/axaj.js"
	import axios from 'axios';
	//引入轮播图
	import Swiper from 'swiper';
	//引入轮播的样式
	import "swiper/dist/css/swiper.min.css";



	export default {
		name: 'Myme',
		data: function() {
			var that = this, interfacePart = that.$store.getters.sidebar.interfacePart,smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart
			return {
				//A套/B套地址
				interfacePart:interfacePart,
				smallInterfacePart:smallInterfacePart,
				top5: [],
				swiperList: [],
				iconTextList: [],
				DataURL: 'https://e.amjhome.com/baojiayou/tts_upload',
				SMDataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
				randomNum: Math.random() / 9999,
				selProcuctTypeList: [],
				selProductTypeIndex: 0,
				//是否开放商户平台
				isOpenMerchantPlatform: false,
				// 店内饮品商品 方便兼容以前下单页面
				isShop: true,
				currentPage: 1,
				selectProductIndex: 0,
				dataArray: [],
				// 临时缓存数组
				tempDataArray: [],
				//购物车数量
				shoppingCartCnt: 0,
				shoppingCartAmount: 0,
				// 购物车的商品列表
				shopCarList: [],
				isReData: true,
				//配料数据列表

				//是否开放商户平台
				isOpenMerchantPlatform: false,
				//选择杯型/冰度/糖度/配料弹窗
				chilType: false,
				//饮品介绍弹窗
				detailType: false,
				//购买时调整数量弹窗
				judgment: false,
				//获取时间的值
				NowTime: "",
				//添加时增加删除
				pustehnum: 1,
				//获取到的修改数据是id一个列表
				chern: 0,
				//选中时的数量
				sckynum: 0,
				//修改弹窗
				ListmbykeType: false,
				//修改弹窗配料id
				meny: [],
				//修改添加、除弹窗id
				cskindex: 0,
				//修改时减少的数量
				xiugainum: 0,
				//判断是否显示 为空
				Mistletype: false,
				//公司酒店列表
				CompanydataList: [],
				concat: false,
				// 系统默认图案
				customizeImgList: [],
				// 选中了哪个图案
				selectCustomizeImgIndex: 0,
				//自定义价格
				customizeImgPrice: 0,
				//隐藏下拉框
				xialatype:true,
				//输入框内容
				plrut:"",
				//交班弹窗
				poryow:false,
				//打印图片
				printImgList:[],
				//呼叫未解决数量
				Arraynum:0,
				path:"ws://192.168.1.23:80/websocket",
                socket:""
			}
		},
		beforeRouteLeave(to, from, next) {
			if (to.name == 'milte') {
				to.meta.isBack = true;
				to.meta.keepAlive = true;
			}
			from.meta.isBack = false;
			next();
		},
		activated(){
			var that = this
			this.xialatype = true;
			if(this.$route.meta.isBack){
				this.ShoppingCartData()
				this.getShopCar()
				that.isReData = false
				// 提交订单后 刷新数据 把界面数字清0
				that.setProductNumData(that, 0)
			}
			setInterval(()=>{
				that.queryOrderDetail()
			},3000)
		},
		mounted: function() {
			this.getShopCar()
			//获取图片 叶志球
			// this.getDefImgPriceList()
			var that = this
			if (that.isReData) {
				that.isReData = false
				that.ShoppingCartData()
				setTimeout(function() {
					// 提交订单后 刷新数据 把界面数字清0
					let dataArray = that.dataArray
					let shoppingCartCnt = that.shoppingCartCnt
					if (dataArray.length > 0 && shoppingCartCnt == 0) {
						that.setProductNumData(that, 0)
					}
				}, 1500)
			}
			that.getPrintImgList()
			//获取呼叫未完成数量
			setInterval(()=>{
				that.queryOrderDetail()
			},3000)
			this.init()
		},
		computed: {
			//收银机号
			cashId(){
				return this.$store.getters.sidebar.cashId
			},
			mengtype(){
				var tyep = this.$route.fullPath
				if(tyep=="/Itemlist"){
					var sspae =true
				}else{
					var sspae =false
					}
				return sspae
			},
			//用戶名
			accountName: function() {
				return getCookie('accountName')
			},
			peilList: function() {
				var kmfgt = this.pliy
				var Arrty = this.dataArray[this.selectProductIndex];
				Arrty.pusteh = this.pustehnum;
				Arrty.surice = Arrty.sumprice * Arrty.pusteh;
				Arrty.surice = Arrty.surice.toFixed(2);
				return Arrty;
			},
			selProcuctTypeListont: function() {
				console.log(this.selProcuctTypeList)
				for (let i = 0; i < this.selProcuctTypeList.length; i++) {
					this.selProcuctTypeList[i].type = null
					if (this.selProductTypeIndex == i) {
						this.selProcuctTypeList[i].type = this.selProductTypeIndex
					}
				}
				return this.selProcuctTypeList;
			},
			//现在时间时分
			Minute: function() {
				var that = this;
				var Minute = this.NowTime.split(' ');
				setTimeout(() => {
					if (that) {
						that.GetTime();
					}
				}, 1000);
				return Minute[1]
			},
			//现在时间时分
			HourTime: function() {
				var Time = this.NowTime.split(' ')
				return Time[0]
			},
			//订单列表
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
			//修改订单列表
			shopchiooseList() {
				var that = this;
				let cholist = JSON.parse(JSON.stringify(that.dataArray[that.chern]));
				cholist.pusteh = that.pustehnum;
				cholist.cskindex = that.cskindex;
				cholist.surice = cholist.sumprice * cholist.pusteh;
				cholist.surice = cholist.surice.toFixed(2);
				return cholist
			}
		},
		watch: {
		},
		methods: {
			init: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
            console.log(msg.data)
        },
        // send3: function () {
		// 	this.socket.send("print3")
        // },
		// send4: function () {
		// 	this.socket.send("close/all")
        // },		
        close: function () {
            console.log("socket已经关闭")
        },
			//页面跳转
			gotoPage(e) {
				switch (e) {
					case 'a':
						//跳转订单列表界面
						this.$router.push('/Milte');
						break
					case 'b':
						break
					case 'send3':
						this.socket.send("/print3")
						break
					case 'send4':
						this.socket.send("close/all")
						console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
						break
					default:
						console.log(error)
						break
				}
			},
			//退出登录
			tclogin(a) {
				switch (a) {
					case 'a':
						this.$router.push('/');
						break
					case 'b':
						this.$router.push('/');
						this.$store.dispatch('Logout')
						break
					case 'c':
						this.open();
						break
					default:
						console.log(error)
						break
				}
				this.xialatype = false
			},
			
			//提交交班记录
			open() {
				var accountPwd = getCookie('accountPwd');
				var that =this;
				that.poryow = true;
			},
			//交班方法
			 passWork(e){
				 var that =this;
				if(e==1){
					that.plrut = '';
					that.poryow = false;
					that.xialatype = true
					return
				}
				var accountPwd = getCookie('accountPwd');
				var accountName = getCookie('accountName')
				var plrut = that.plrut;
				that.poryow = true;
				if(plrut.replace(/\s/g,"")==accountPwd){
						signMessage(that,accountName)
				}else{
						that.$message({
							type: 'info',
							message: '密码错误'
						});
						that.plrut = '';
						that.xialatype = true
						return
				}
			 },
			//item删除键
			delelttype(name) {
				this.delmoel(this.cskindex, this.xiugainum, name)
				this.emptyType()
			},
			//删除键
			delmoel(ids, num, name) {
				var that =this;
				var userId = this.$store.getters.sidebar.userId;
				let signParam = 'cls=product_shopCar&action=deleteShopCarProduct&ids=' + ids + "&userId=" + userId
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var that = this,
					data = that.dataArray;
				for (let g = 0; g < data.length; g++) {
					if (data[g].productName == name) {
						data[g].num = data[g].num - num;
					}
				}
				doGetData(this, smurl, signParam, "", 7, "移除购物车中的商品")
			},
			//修改商品数量
			changeNickNum(num, name, meny, id, amg) {
				var that = this,
					data = that.dataArray;
				for (let g = 0; g < data.length; g++) {
					if (data[g].productName == name) {
						that.chern = g;
					}
				}
				//图片
				for (let n = 0; n < that.customizeImgList.length; n++) {
					if (that.customizeImgList[n].img == amg) {
						that.selectCustomizeImgIndex = n
					}
				}
				var meny = meny.split(',')
				let cholist = JSON.parse(JSON.stringify(that.dataArray[that.chern]));
				for (let i = 0; i < cholist.detail.length; i++) {
					// 	var detail = cholist.detail[i]
					for (let k = 0; k < cholist.detail[i].labels.length; k++) {
						// 		var labe =detail.labels[k]
						// 		for(let j= 0;j<that.meny.length;j++ ){
						// 			if(that.meny[j]==labe.id){
						var dataArray = that.dataArray;
						var index = i;
						var labelindex = k;
						var data = dataArray[that.chern]
						var labels = data.detail[index].labels
						for (let i = 0; i < labels.length; i++) {
							const label = labels[i];
							// 0多选 1单选
							if (label.lblsingle == 1) {
								label.checked = false;
								for (let m = 0; m < meny.length; m++) {
									if (meny[m] == label.id) {
										label.checked = true
									}
								}
							} else {
								var labelstype = false
								for (let m = 0; m < meny.length; m++) {
									if (meny[m] == label.id) {
										label.checked = true
										labelstype = true
									} else {
										label.checked = false
										if (labelstype) {
											label.checked = true
										}
									}
								}
							}
						}

						// 弹窗显示选择的最终价格
						var sumprice = 0
						// 显示选择了哪些规格
						var showSelectLabelList = []
						var details = data.detail
						// 重新汇总所选择的商品规格
						for (let i = 0; i < details.length; i++) {
							const detail = details[i];
							var labels = detail.labels
							for (let i = 0; i < labels.length; i++) {
								const label = labels[i];
								if (label.checked) {
									sumprice = sumprice + label.lblprice
									showSelectLabelList = showSelectLabelList.concat(label.lblname)
								}
							}
						}
						data.sumprice = sumprice.toFixed(2)
						data.showSelectLabels = showSelectLabelList.join("/")
						// }
						// 		}
					}
				}
				that.collectPrice2()
				that.pustehnum = num;
				that.xiugainum = num;
				that.ListmbykeType = true;
				that.cskindex = id;
			},
			//页面跳转
			gotopage() {
				var that = this
				if (that.shopsistList.length == 0) {
					this.$message({
						type: 'warning',
						message: '请添加饮品！'
					});
				} else {
					that.$router.push("/amited")
				}

			},
			//页面跳转
			gotocallBack() {
				var that = this
				that.$router.push("/Callback")
			},
			//获取现在时间
			GetTime() {
				this.NowTime = Utils.getDateTimeStr(new Date(), "/", 1)
			},
			change() {
				console.log(this.$store.getters.sidebar)
			},
			onchangedetailType(e) {
				var index = e;
				this.detailType = !this.detailType;
				this.selectProductIndex = index
			},
			addProcuctnum(e) {
				var index = e
				this.chilType = !this.chilType;
				this.selectProductIndex = index;
				this.detailType = false;
			},
			emptyType() {
				this.chilType = false;
				//饮品介绍弹窗
				this.detailType = false;
				//购买时调整数量弹窗
				this.judgment = false;
				this.pustehnum = 1;
				this.ListmbykeType = false;
				var that = this
				let cholist = JSON.parse(JSON.stringify(that.dataArray[that.chern]));
				for (let i = 0; i < cholist.detail.length; i++) {
					for (let k = 0; k < cholist.detail[i].labels.length; k++) {
						var dataArray = that.dataArray;
						var index = i;
						var labelindex = k;
						var data = dataArray[that.chern]
						var labels = data.detail[index].labels
						for (let i = 0; i < labels.length; i++) {
							const label = labels[i];
							// 0多选 1单选
							if (label.lblsingle == 1) {} else {
								label.checked = false
							}
						}
					}
				}
			},
			deletetype() {
				this.chilType = false;
			},
			deletetypey() {
				this.detailType = false;
			},
			selectCatalog: function(e) {
				var index = e
				this.concat = true;
				this.sCatalog(index);
			},
			sCatalog: function(i) {
				var that = this,
					index = 0,
					selProcuctTypeList = that.selProcuctTypeList
				try {
					index = parseInt(i);
					index = isNaN(index) ? 0 : index;
				} catch (err) {}
				if (selProcuctTypeList != null && selProcuctTypeList != undefined && selProcuctTypeList.length > 0 &&
					selProcuctTypeList[index] != null && selProcuctTypeList[index] != undefined) {
					that.selProductTypeIndex = index,
						that.loadInitData();
				}
			},
			//添加商品数量
			increase(tag) {
				//减少数量
				if (tag == 0) {
					if (this.pustehnum > 1) {
						this.pustehnum = this.pustehnum - 1
					} else {
						return;
					}
				} else {
					this.pustehnum = this.pustehnum + 1
				}
			},


			//清空购物车
			clearShopCar() {
				var that = this
				var shopCarList = that.shopCarList
				if (shopCarList.length == 0) {
					this.$message('购物车是空的');
					return
				}
				this.$confirm('确定清空购物车, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var shopCarId = []
					for (let i = 0; i < shopCarList.length; i++) {
						const shopCar = shopCarList[i];
						shopCarId = shopCarId.concat(shopCar.id)
					}
					that.deleteShopCarProduct(shopCarId.join(","))
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//修改訂單
			selectOK2(num, name) {
				var that = this
				//如果传送数量为零
				if (num == 0) {
					that.delelttype(name)
					return
				}
				//清空提交数量
				var dataArray = that.dataArray
				var data = dataArray[that.chern]
				//数量

				// 所选中的LabelId
				var labelIdList = []
				// var detailIdList = []

				var details = data.detail
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					// 判断每个分类有没有选中一个的
					var isHaveSelect = false
					// 是否默认选中了 单选默认选中 多选不需要
					let isSelect = false
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						// if (label.checked) {
						//   labelIdList = labelIdList.concat(label.id)
						//   isHaveSelect = true
						//   label.num++
						// }
						if (label.checked) {
							labelIdList = labelIdList.concat(label.id)
							isHaveSelect = true
							label.num++
						}
						// 多选可以不用选
						if (label.lblsingle == 0) {
							isHaveSelect = true
						}
						// 加入购物车后恢复默认选中 有货 单选默认选中
						if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
							label.checked = true
							isSelect = true
						} else {
							// 多选不需要默认选中
							label.checked = false
						}

					}
					if (!isHaveSelect) {
						this.$message({
							type: 'info',
							message: '商品规格存在缺货,请重新选择!'
						});
						return;
					}
				}
				console.log("加入后购物车", dataArray)
				that.tempDataArray = dataArray
				var detailLabelId = labelIdList.join(",")

				// that.addShopCar(detailLabelId, 0, 1, e)
				data.num = data.num - that.xiugainum + that.pustehnum
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
					let synimage = ''
					let synimage_price = 0
					if (that.selectCustomizeImgIndex >= 0) {
						synimage = that.customizeImgList[that.selectCustomizeImgIndex].img
						synimage_price = that.customizeImgList[that.selectCustomizeImgIndex].price
					}
					detailLabelId = detailLabelId + "&synimage=" + synimage + "&synimage_price=" + synimage_price
				}


				let userId = this.$store.getters.sidebar.userId;
				let signParam = 'cls=product_shopCar&action=updateShopCarProductNum&id=' + this.cskindex + '&userId=' + userId +
					"&num=" + that.pustehnum
				let otherParam = "&detailLabelId=" + detailLabelId
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				doGetData(this, smurl, signParam, otherParam, 8, "加减购物车")
				that.selectCustomizeImgIndex = 0;
			},

			//添加数量
			selectOK(e) {
				if (e == 0) {
					this.$message({
						type: 'warning',
						message: '请先添加数量！'
					});
					return
				}
				var that = this
				//清空提交数量
				var dataArray = that.dataArray
				var data = dataArray[that.selectProductIndex]

				// 所选中的LabelId
				var labelIdList = []
				// var detailIdList = []

				var details = data.detail
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					// 判断每个分类有没有选中一个的
					var isHaveSelect = false
					// 是否默认选中了 单选默认选中 多选不需要
					let isSelect = false
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						// if (label.checked) {
						//   labelIdList = labelIdList.concat(label.id)
						//   isHaveSelect = true
						//   label.num++
						// }
						if (label.checked) {
							labelIdList = labelIdList.concat(label.id)
							isHaveSelect = true
							label.num++
						}
						// 多选可以不用选
						if (label.lblsingle == 0) {
							isHaveSelect = true
						}
						// 加入购物车后恢复默认选中 有货 单选默认选中
						if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
							label.checked = true
							isSelect = true
						} else {
							// 多选不需要默认选中
							label.checked = false
						}
					}
					if (!isHaveSelect) {
						this.$message({
							type: 'info',
							message: '商品规格不完整'
						});
						return;
					}
				}
				data.num = data.num + e
				console.log("加入后购物车", dataArray)
				that.tempDataArray = dataArray
				var detailLabelId = labelIdList.join(",")
				// var productDetailId = detailIdList.join(",")
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
					let synimage = ''
					let synimage_price = 0
					if (that.selectCustomizeImgIndex >= 0) {
						synimage = that.customizeImgList[that.selectCustomizeImgIndex].img
						synimage_price = that.customizeImgList[that.selectCustomizeImgIndex].price
					}
					detailLabelId = detailLabelId + "&synimage=" + synimage + "&synimage_price=" + synimage_price
				}
				that.selectCustomizeImgIndex = 0;
				if (e) {
					that.addShopCar(detailLabelId, 0, 1, e)
				} else {
					that.addShopCar(detailLabelId, 0, 1)
				}
			},
			/**
			 * 移除购物车中的商品 
			 */
			deleteShopCarProduct(ids) {
				var userId = this.$store.getters.sidebar.userId
				let signParam = 'cls=product_shopCar&action=deleteShopCarProduct&ids=' + ids + "&userId=" + userId
				var that =this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				doGetData(this, smurl, signParam, "", 6, "移除购物车中的商品")
			},
			selectProductLabels(index, id) {
				var that = this;
				var dataArray = that.dataArray;
				var index = index;
				var labelindex = id;
				var data = dataArray[that.selectProductIndex]
				var labels = data.detail[index].labels
				for (let i = 0; i < labels.length; i++) {
					const label = labels[i];
					// 0多选 1单选
					if (label.lblsingle == 1) {
						if (i == labelindex) {
							label.checked = true;
						} else {
							label.checked = false;
						}
					}
					// 多选 
					else {
						if (i == labelindex) {
							label.checked = !label.checked
							break
						}
					}
				}

				// 弹窗显示选择的最终价格
				var sumprice = 0
				// 显示选择了哪些规格
				var showSelectLabelList = []
				var details = data.detail
				// 重新汇总所选择的商品规格
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						if (label.checked) {
							sumprice = sumprice + label.lblprice
							showSelectLabelList = showSelectLabelList.concat(label.lblname)
						}
					}
				}
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
				  if (that.selectCustomizeImgIndex >= 0) {
					sumprice = sumprice + that.customizeImgList[that.selectCustomizeImgIndex].price
				  } else {
					sumprice = sumprice + that.customizeImgPrice
				  }
				}
				data.sumprice = sumprice.toFixed(2)
				data.showSelectLabels = showSelectLabelList.join("/")

				that.dataArray = dataArray;
			},

			//修改时
			selectProductLabels2(index, id) {
				var that = this;
				var dataArray = that.dataArray;
				var index = index;
				var labelindex = id;
				var data = dataArray[that.chern]
				var labels = data.detail[index].labels
				for (let i = 0; i < labels.length; i++) {
					const label = labels[i];
					// 0多选 1单选
					if (label.lblsingle == 1) {
						if (i == labelindex) {
							label.checked = true;
						} else {
							label.checked = false;
						}
					}
					// 多选 
					else {
						if (i == labelindex) {
							label.checked = !label.checked
							break
						}
					}
				}

				// 弹窗显示选择的最终价格
				var sumprice = 0
				// 显示选择了哪些规格
				var showSelectLabelList = []
				var details = data.detail
				// 重新汇总所选择的商品规格
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						if (label.checked) {
							sumprice = sumprice + label.lblprice
							showSelectLabelList = showSelectLabelList.concat(label.lblname)
						}
					}
				}
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
				  if (that.selectCustomizeImgIndex >= 0) {
					sumprice = sumprice + that.customizeImgList[that.selectCustomizeImgIndex].price
				  } else {
					sumprice = sumprice + that.customizeImgPrice
				  }
				}
				data.sumprice = sumprice.toFixed(2)
				data.showSelectLabels = showSelectLabelList.join("/")
				that.dataArray = dataArray;
			},


			onChagejudgment() {
				this.judgment = !this.judgment
				if (this.judgment) {
					this.getShopCar()
				}
			},
			getShopCar() {
				//用户id
				var userId = this.$store.getters.sidebar.userId
				//公司id
				var agentCompanyId = this.$store.getters.sidebar.CompanyId
				let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId;
				var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + agentCompanyId;
				var that =this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
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
							case 0:
								that.setProductList(data)
								break
							case 1:
								content = "加入购物车成功";
								that.chilType = false;
								that.dataArray = that.tempDataArray;
								that.pustehnum = 1;
								that.getShopCar();
								that.ShoppingCartData()

								//恢复默认显示价格
								setTimeout(function() {
									var DataArray = that.dataArray;
									that.concat = true;
									that.setProductList(DataArray, 0);
								}, 1000)

								/*------------------------------------*/
								break
							case 2:
								that.dataArray = that.tempDataArray,
									that.ShoppingCartData()
								break
							case 3:
								that.dataArray = that.tempDataArray,
									that.ShoppingCartData()
								that.getShopCar()
								break
							case 4:
								break
							case 5:
								that.dealData5(data)
								if (that.selProcuctTypeList.length == 0) {
									that.ProductTypeList()
								}
								break
							case 6:
								content = "清空购物车成功"
								that.dealData6()
								break
							case 7:
								that.getShopCar();
								that.ShoppingCartData();
								break
							case 8:
								console.log("修改成功")
								that.getShopCar();
								that.ShoppingCartData();
								that.emptyType();
								break
							case 10:
								that.dealData7(data)
								break
							case 9:
								if (data.CompanydataList.length == 0) {
									this.$message({
										type: 'info',
										message: '暂无绑定酒店'
									});
									return
								}
								that.CompanydataList = data.CompanydataList,
									// if (that.data.CompanydataList.length > 0) {
									//   that.getProductTypeList()
									// }
									console.log(that.CompanydataList);
								break
						}
						if (!Utils.isNull(content)) {
							// wx.showToast({
							//   title: content,
							//   icon: 'none',
							//   duration: 1500
							// })
						}
						break;
					default:
						console.log(error)
						break
				}
			},
			dealData6() {
				var that = this
				that.setProductNumData(that, 0)
				that.shopCarList = [];
				that.judgment = false;
				that.ShoppingCartData()
			},
			setProductList(data, tag) {
				let that = this;
				var currentPage = that.currentPage;
				if (data.length > 0) {
					// 购物车列表的数据
					var shopCarList = that.shopCarList
					// 设置标题 获取饮品详情中的公司名
					// if (1 == currentPage) {
					//   that.setTitle(data[0].companyName)
					// }
					var defaultItemImgSrc = this.$store.getters.sidebar.smurl + "/baojiayou/tts_upload/images/dnewsimg.png"
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						if (Utils.isNull(element.photos)) {
							element.photo = defaultItemImgSrc
						} else {
							let photos = element.photos.split(",");
							element.photo = photos[0]
						}
						if (Utils.isNull(element.detailPhotos)) {
							var dPhotos = []
							dPhotos.push(defaultItemImgSrc)
							element.dPhotos = dPhotos
						} else {
							let dPhotos = element.detailPhotos.split(",");
							element.dPhotos = dPhotos
						}

						//显示的最低价
						element.minprice = 10000
						// 选择的数量
						element.num = 0
						// 弹窗显示选择的最终价格
						element.sumprice = 0
						// 显示选择了哪些规格
						element.showSelectLabels = ""
						var showSelectLabelList = []

						let details = element.detail
						for (let j = 0; j < details.length; j++) {
							const detail = details[j];
							let labels = detail.labels
							//显示第一选择价格
							if (element.showprice > detail.price) {
											element.showprice = detail.price
										  }
							// 是否默认选中了 单选默认选中 多选不需要
							let isSelect = false
							
							for (let k = 0; k < labels.length; k++) {
								const label = labels[k];
								if (label.lblprice != 0 && element.minprice > label.lblprice) {
									element.minprice = label.lblprice
								}
								if (0 == k && j == 0) {
								              element.showprice = label.lblprice
								}
								label.checked = false
								// 选择该规格的数量
								label.num = 0
								// 有货 单选默认选中
								if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
									label.checked = true
									element.sumprice = element.sumprice + label.lblprice
									showSelectLabelList = showSelectLabelList.concat(label.lblname)
									isSelect = true
								}
								// 查询购物车中label选的数量
								for (let a = 0; a < shopCarList.length; a++) {
									const shopCar = shopCarList[a];
									var labList = shopCar.labList
									for (let b = 0; b < labList.length; b++) {
										const lab = labList[b];
										if (lab.id == label.id) {
											label.num = shopCar.num
											break
										}
									}
								}

							}
						}
						// 查询购物车中product选的数量
						for (let a = 0; a < shopCarList.length; a++) {
							const shopCar = shopCarList[a];
							if (shopCar.productId == element.id) {
								element.num = element.num + shopCar.num
							}
						}
						element.sumprice = element.sumprice.toFixed(2)
						element.showSelectLabels = showSelectLabelList.join("/")
					}
					if (this.concat) {
						that.dataArray = data
					} else {
						that.dataArray = that.dataArray.concat(data)
						this.concat = false
					}
					this.Mistletype = false
				} else {
					if (1 == currentPage) {
						// console.log("暂无商品！")
						this.Mistletype = true
					} else {
						that.currentPage = --currentPage;
						this.$message({
							type: 'success',
							message: '商品加载完毕！'
						});
					}
				}
			},
			ShoppingCartData: function() {
				var that = this;
				//公司id
				var agentCompanyId = this.$store.getters.sidebar.CompanyId

				var otherParam = "&shopType=3&companyId=" + agentCompanyId
				getShoppingCartData(that, otherParam);
			},
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
					that.shopCarList = shopCarList
				} else {
					// wx.showToast({
					//   title: "购物车里是空的",
					//   icon: 'none',
					//   duration: 1500
					// })
					this.shopCarList = []
				}
			},
			ProductTypeList: function() {
				var that = this
				var companyId = this.$store.getters.sidebar.CompanyId
				// companyId = 5919
				var otherParamCom = that.isOpenMerchantPlatform ? "" : "&companyId=" + companyId;
				// 5是饮品 1是不区分
				otherParamCom += "&typeId=1";
				getProductTypeList(that, otherParamCom);
			},
			setProductNumData(mainThis, num) {
				var that = mainThis
				var dataArray = that.dataArray
				// 把商品所显示的数量清空
				for (let i = 0; i < dataArray.length; i++) {
					const data = dataArray[i];
					data.num = num
					var details = data.detail
					for (let j = 0; j < details.length; j++) {
						const detail = details[j];
						var labels = detail.labels
						for (let k = 0; k < labels.length; k++) {
							const label = labels[k];
							label.num = num
						}
					}
				}
				that.dataArray = dataArray
			},
			withGetProductTypeList: function(dataList, tag, errInfo) {
				let that = this;
				dowithGetProductTypeList(that, dataList, tag, errInfo);

				var selProcuctTypeList = that.selProcuctTypeList
				// 先把全部去掉，添加新元素
				selProcuctTypeList.splice(0, 1)
				// var listItem = {
				//   id: -1,
				//   name: "推荐",
				//   mold: "706,716,806,816",
				// }
				// // 头部追加元素
				// selProcuctTypeList.unshift(listItem)
				// listItem = {
				//   id: -2,
				//   name: "活动",
				//   mold: "705,715,805,815",
				// }
				// selProcuctTypeList.unshift(listItem)
				var listItem = {
					id: 0,
					name: "全部",
				}
				selProcuctTypeList.unshift(listItem)
				that.selProcuctTypeList = selProcuctTypeList;
				console.log("分类列表:", that.selProcuctTypeList)

				that.loadInitData();
			},
			/**
			 * 加载第一页数据
			 */
			loadInitData: function() {
				var that = this
				var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
				var tips = "加载第" + (currentPage + 1) + "页";
				console.log("load page " + (currentPage + 1));
				// wx.showLoading({
				//   title: tips,
				// })
				//是否清空所有已选数据
				// 刷新时，清空dataArray，防止新数据与原数据冲突
				that.dataArray = [];
				var pageSize = 6
				// 获取第一页列表信息
				that.queryProducts(pageSize, 1);
			},
			/**
			 * 获取饮品商品
			 */
			queryProducts(pageSize, pageIndex) {
				var that = this;

				var companyId = this.$store.getters.sidebar.CompanyId
				// companyId = 5919
				var otherParam = that.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + companyId;
				var typeId = ""
				// var mold = "9,70,80,71,81,705,706,715,716,805,806,815,816"
				var mold = "9"
				var selProductTypeIndex = that.selProductTypeIndex
				// 活动和推荐
				// if (selProductTypeIndex == 1 || selProductTypeIndex == 2) {
				// 	// mold = that.data.selProcuctTypeList[selProductTypeIndex].mold
				// 	mold = "9"
				// } else if (selProductTypeIndex > 0) {
				// 	typeId = that.selProcuctTypeList[that.selProductTypeIndex].id
				// }
				// 去掉活动和推荐
				if (selProductTypeIndex > 0) {
					typeId = that.selProcuctTypeList[that.selProductTypeIndex].id
				}
				// 5是饮品 1不区分饮品
				otherParam = otherParam + "&status=0&typeflag=1&typeId=" + typeId + "&mold=" + mold + "&pSize=" + 399 +
					"&pIndex=" + pageIndex
				let signParam = 'cls=product_goodtype&action=QueryProducts';
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				doGetData(this, smurl, signParam, otherParam, 0, "获取饮品商品")
			},
			//减去数量
			changeCut(e) {
				var that = this
				var index = e
				var dataArray = that.dataArray
				var data = dataArray[index]

				// 所选中的LabelId
				var labelIdList = []
				// var detailIdList = []
				// 判断是否可以直接减 多规格不支持直接减
				var isCanCut = false

				var details = data.detail
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					isCanCut = false
					var labels = detail.labels
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						if (label.num > 0) {
							if (label.num == data.num) {
								isCanCut = true
								labelIdList = labelIdList.concat(label.id)
								// detailIdList = detailIdList.concat(label.detailId)
								label.num--
							} else {
								// 发现多种规格 不能直接减
								isCanCut = false
								break
							}
						}
					}
					if (!isCanCut) {
						// wx.showToast({
						//   title: "多规格商品请去购物车删除哦",
						//   icon: 'none',
						//   duration: 2500
						// })
						that.judgment = true;
						that.detailType = false;
						return;
					}
				}
				data.num--
				var detailLabelId = labelIdList.join(",")
				// var productDetailId = detailIdList.join(",")
				that.tempDataArray = dataArray
				that.addShopCar(detailLabelId, 1, 2)
			},
			addShopCar(detailLabelId, carStatus, tag, newNum) {
				if (newNum) {
					let userId = this.$store.getters.sidebar.userId;
					let companyId = this.$store.getters.sidebar.CompanyId
					let signParam = 'cls=product_shopCar&action=addShopCar&userId=' + userId + "&productDetailId=0"
					//  carStatus  0 加 1減  （从商品处进行加减 用于餐馆/饮品）       非必填参数 默认为0
					//  1:餐馆 2:便利店 3饮品（不传值则为商城的购物车）     非必填参数   
					let otherParam = "&detailLabelId=" + detailLabelId + "&shopType=3&carStatus=" + carStatus + "&companyId=" +
						companyId + "&num=" + newNum
					var that = this;
					var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
					let smurl = srvDevTest + smallInterfacePart;
					doGetData(this, smurl, signParam, otherParam, tag, "加减购物车")
					return
				} else {
					var userId = this.$store.getters.sidebar.userId
					var companyId = this.$store.getters.sidebar.CompanyId
					let signParam = 'cls=product_shopCar&action=addShopCar&userId=' + userId + "&productDetailId=0"
					//  carStatus  0 加 1減  （从商品处进行加减 用于餐馆/饮品）       非必填参数 默认为0
					//  1:餐馆 2:便利店 3饮品（不传值则为商城的购物车）     非必填参数   
					var otherParam = "&detailLabelId=" + detailLabelId + "&shopType=3&carStatus=" + carStatus + "&companyId=" +
						companyId
					var that = this;
					var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
					var smurl = srvDevTest + smallInterfacePart;
					doGetData(this, smurl, signParam, otherParam, tag, "加减购物车")
				}
			},
			//购物商品加减操作
			changeDrinkNum(tag, index) {
				var that = this;
				var tag = tag;
				var index = index;
				var dataArray = that.dataArray;
				var shopCarList = that.shopCarList[index]
				console.log(shopCarList)
				var labList = shopCarList.labList

				for (let i = 0; i < dataArray.length; i++) {
					const data = dataArray[i];
					if (data.id == shopCarList.productId) {
						if (tag == 0) {
							data.num++
						} else {
							data.num--
						}
					}

					var details = data.detail
					for (let j = 0; j < details.length; j++) {
						const detail = details[j];
						var labels = detail.labels
						for (let k = 0; k < labels.length; k++) {
							const label = labels[k];
							for (let a = 0; a < labList.length; a++) {
								const lab = labList[a];
								if (lab.id == label.id) {
									if (tag == 0) {
										label.num++
										this.pustehnum++
									} else {
										label.num--
										this.pustehnum--
									}
									break
								}
							}
						}
					}
				}
				that.tempDataArray = dataArray
				that.addShopCar(shopCarList.detailLabelId, tag, 3)
			},
			//获取打印图杯信息
			getDefImgPriceList() {
				var that =this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + interfacePart;
				let signParam = 'cls=main_imgPrice&action=imgPriceList'
				doGetData(this, smurl, signParam, "", 10, "获取打印杯子图案默认图片")
			},
			dealData7(data) {
				var that = this
				console.log(data)
				if (!Utils.isNull(data) && data.length > 0) {
					let customizeImgList = []
					let customizeImgPrice = that.customizeImgPrice
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						// 默认
						// if (element.imgtype == 0) {
							var customizeImg = {
								id: element.id,
								img: element.path,
								price: element.price,
								name: element.name,
								serial: element.name,
							}
							customizeImgList.push(customizeImg)
						// }
						// // 自定义的
						// else {
						// 	customizeImgPrice = element.price
						// }
					}
					that.customizeImgList = customizeImgList;
					console.log('customizeImgList图案列表:')
					console.log(that.customizeImgList)
					that.customizeImgPrice = customizeImgPrice;
				}
			},
			//选择图案
			selectCustomizeImg(key,lpi) {
				var that = this
				var index = key
				var selectCustomizeImgIndex = that.selectCustomizeImgIndex
				if (selectCustomizeImgIndex == index) {
					return
				}
				that.selectCustomizeImgIndex = index
				if(that.ListmbykeType || lpi==0){
					that.collectPrice2()
				}else{
					that.collectPrice()
				}
			},
			
			collectPrice() {
				var that = this
				var dataArray = that.dataArray
				var data = dataArray[that.selectProductIndex]
				// 弹窗显示选择的最终价格
				var sumprice = 0
				// 显示选择了哪些规格
				var showSelectLabelList = []
				var details = data.detail
				// 重新汇总所选择的商品规格
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						if (label.checked) {
							sumprice = sumprice + label.lblprice
							showSelectLabelList = showSelectLabelList.concat(label.lblname)
						}
					}
				}
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
					if (that.selectCustomizeImgIndex >= 0) {
						sumprice = sumprice + that.customizeImgList[that.selectCustomizeImgIndex].price
					} else {
						sumprice = sumprice + that.customizeImgPrice
					}
				}
				data.sumprice = sumprice.toFixed(2)
				data.showSelectLabels = showSelectLabelList.join("/")

				that.dataArray = dataArray
			}, 
			collectPrice2() {
				var that = this
				var dataArray = that.dataArray
				var data = dataArray[that.chern]
				// 弹窗显示选择的最终价格
				var sumprice = 0
				// 显示选择了哪些规格
				var showSelectLabelList = []
				var details = data.detail
				// 重新汇总所选择的商品规格
				for (let i = 0; i < details.length; i++) {
					const detail = details[i];
					var labels = detail.labels
					for (let i = 0; i < labels.length; i++) {
						const label = labels[i];
						if (label.checked) {
							sumprice = sumprice + label.lblprice
							showSelectLabelList = showSelectLabelList.concat(label.lblname)
						}
					}
				}
				// 判断是否是打印图案的商品
				if (data.photoType == 2) {
					if (that.selectCustomizeImgIndex >= 0) {
						sumprice = sumprice + that.customizeImgList[that.selectCustomizeImgIndex].price
					} else {
						sumprice = sumprice + that.customizeImgPrice
					}
				}
				data.sumprice = sumprice.toFixed(2)
				data.showSelectLabels = showSelectLabelList.join("/")
			
				that.dataArray = dataArray
			}, 
			  //方法：获取主完整URL路径
			  getSysImgUrl: function (src) {
			    var result = "",
			      app = this;
			    var DataURL = this.$store.getters.sidebar.dataUrl;
			    if (src != null && src != undefined && Utils.myTrim(src) != "") {
			      if (src.toUpperCase().indexOf("HTTP") >= 0)
			        result = src;
			      else
			        result = DataURL + (src.substr(0, 1) == "/" ? src : "/" + src);
			    }
				
			    return result;
			  },
			  //获取数据信息
			  queryOrderDetail: function() {
			  	var that = this;
			  	var srvDevTest = that.$store.getters.sidebar.smurl,
			  	interfacePart = that.$store.getters.sidebar.interfacePart,
			  	smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
			  	var URL = srvDevTest + smallInterfacePart;
			  	var appId = that.$store.getters.sidebar.appId
			  	var timestamp = Date.parse(new Date());
			  	timestamp = timestamp / 1000;
			  	var KEY = that.$store.getters.sidebar.KEY
			  	var urlParam = 'cls=product_custservice&action=QueryService&appId='+ appId +'&timestamp='+ timestamp +'&userId='
			  	var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				urlParam = urlParam+'&sign='+sign+"&status=0&mold=3"
			  	// console.log('查询订单详情:', URL + urlParam)
			  	axios.get(URL + urlParam).then(res => {
			  		// console.log(res.data)
			  		if(res.data.rspCode==0){
						var data = res.data.data
			  			that.Arraynum = data.length;
			  		}else{
			  			that.$message({
			  				type: 'info',
			  				message: res.data.rspMsg
			  			});
			  		}
			  	}).catch(()=>{
			  		that.$message({
			  			type: 'info',
			  			message: "网络错误！"
			  		});
			  	})
			  },
			  //----------打印图片部分------------------------------------------------------------------
			  //方法：获取打印图片相关信息
			  getPrintImgList: function () {
			    var that =this;
			    var srvDevTest = that.$store.getters.sidebar.smurl,
			    interfacePart = that.$store.getters.sidebar.interfacePart,
			    smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var URL = srvDevTest + interfacePart
				var KEY = that.$store.getters.sidebar.KEY
				var CompanyId = that.$store.getters.sidebar.CompanyId
			    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
			    timestamp = timestamp / 1000;
			    urlParam = "cls=main_gimage&action=gimageList&appId=" + that.$store.getters.sidebar.appId + "&timestamp=" + timestamp;
			    
			    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
			    console.log('sign:' + urlParam + "&key=" + KEY)
			    urlParam = urlParam + "&companyId=" + CompanyId + "&xcxAppId=" + "&sign=" + sign;
			    console.log('获取打印图片信息：'+URL + urlParam)
			    console.log('~~~~~~~~~~~~~~~~~~~')
				axios.get(URL + urlParam).then(res=>{
			        console.log('获取打印图片信息结果')
			        console.log(res)
			        if (res.data.rspCode == 0) {
					   let pSysImgList = [],pMyImgList=[],pOtherImgList=[];
					            if(Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.dataList) && res.data.data.dataList.length>0){
					              let data = res.data.data.dataList, dataItem = null, listItem = null
					              var id = 0, name = "",path="",serial = "",price=0.00,print_num=0,userId=0;
					              for (var i = 0; i < data.length; i++) {
					                id = 0; name = "";path="";serial = "";price=0.00;print_num=0;userId=0;
					                dataItem = null; listItem = null; dataItem = data[i];
					                id = dataItem.id;
					                if (Utils.isDBNotNull(dataItem.name)){
					                  name = dataItem.name;
					                }
					                if (Utils.isDBNotNull(dataItem.path)){
					                  path = dataItem.path;
					                  path = that.getSysImgUrl(path);
					                }
					                if (Utils.isDBNotNull(dataItem.serial)){
					                  serial = dataItem.serial;
					                }
					                if (Utils.isDBNotNull(dataItem.price)){
					                  try{
					                    price = parseFloat(dataItem.price);
					                    price = isNaN(price) ? 0.00 : price;
					                    price = parseFloat(price.toFixed(2));
					                  }catch(e){}
					                }   
					                if (Utils.isDBNotNull(dataItem.print_num))
					                {
					                  try{
					                    print_num = parseInt(dataItem.print_num);
					                    print_num = isNaN(print_num) ? 0 : print_num;
					                  }catch(e){}
					                }
					                if (Utils.isDBNotNull(dataItem.userId))
					                {
					                  try{
					                    userId = parseInt(dataItem.userId);
					                    userId = isNaN(userId) ? 0 : userId;
					                  }catch(e){}
					                }
					                listItem = {
					                  id: id, name : name,path:path,serial,price:price,print_num:print_num,userId:userId,
					                }
					                if(userId==0){
					                  pSysImgList.push(listItem);
					                }else if(userId== that.$store.getters.sidebar.userId){
					                  pMyImgList.push(listItem);
					                }else{
					                  pOtherImgList.push(listItem);
					                }              
					              }
					            }
					            
					  
					            that.pSysImgList = pSysImgList;
					            that.pMyImgList = pMyImgList;
					            that.pOtherImgList = pOtherImgList;
					            //selPImgItem
					            if(Utils.isNotNull(that.selPImgItem)){
					              let selPImgItem=that.selPImgItem, selSysImgIndex=-1,pImgList=[];
					              switch(selPImgItem.stype){
					                case 0:
					                  pImgList=pSysImgList;
					                  break;
					                case 1:
					                  pImgList=pOtherImgList;
					                  break;
					                case 2:
					                  pImgList=pMyImgList;
					                  break;
					              }
					              if(Utils.isNotNull(pImgList) && pImgList.length>0){
					                for(let i=0;i<pImgList.length;i++){
					                  if(pImgList[i].id==selPImgItem.id){
					                    selSysImgIndex=i;
					                  }
					                }
					              }
					              that.selSysImgIndex = selSysImgIndex;
					              that.sIndexType = selPImgItem.stype;
					            }
					  console.log()
					  that.dealData7(pSysImgList)
			        } else {
					  that.$message({
					  	type: 'error',
					  	message: '获取打印图片信息错误'
					  });
			        }
				});
			  },
		},
		destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
	}
</script>

<style scoped>
	@import "../css/little.css";

	.bossback {
		background: #244A77;
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		box-sizing: border-box;
		padding: 30px;
	}

	/*头部css*/
	.yuntop {
		background: #3768A0;
		padding: 10px 30px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px 10px 0px 0px;
	}

	.yunlogo {
		display: flex;
	}

	.yunlogo a {
		margin-left: 30px;
		font-size: 20px;
		color: #FFF;
		line-height: 30px;
	}

	.yunlogo img {
		width: 126px;
		height: 41px;
	}

	.yuntime {
		font-family: "DIN1";
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 30%;
	}

	.yuntime .timety:nth-of-type(1) {
		font-size: 24px;
	}

	.yuntime .timety:nth-of-type(2) {
		font-size: 14px;
	}

	.personalDetail {
		height: 40px;
	}

	.personalDetail li {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.personalDetail li .pouts {
		height: 30px;
		display: flex;
		align-items: center;
	}

	.personalDetail li .pouts p {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 14px;
	}

	.personalDetail li .pouts p a:nth-last-of-type(1) {
		font-size: 16px;
		color: #FFF;
		font-family: "DIN1";
	}

	.personalDetail li .pouts p a:nth-last-of-type(2) {
		font-size: 18px;
		color: #FFF;
	}

	.personalDetail li .pouts img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.personalDetail li .imhty {
		width: 40px;
		height: 40px;
		margin-left: 20px;
	}

	/*主题循环类型*/
	.forTime {
		width: 100%;
		height: 87%;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	/*左边样式*/
	.forTime .forTimeLeft {
		width: 68%;
		height: 100%;
		background: #fff;
		padding: 26px 30px;
		box-sizing: border-box;
		border-radius: 0 0 10px 10px;
	}

	.LeftTop {
		width: 100%;
		overflow: hidden;
		/* display: flex; */
		align-items: center;
		/* white-space: nowrap; */
		height: 50px;
		position: relative;
		padding-right: 20px;
		box-sizing: border-box;
	}

	.yuew{
		width: 100%;
		overflow-x: auto; overflow-y: hidden;
		display: flex;
		align-items: center;
		white-space: nowrap;
		height: 50px;
		padding-right: 20px;
		position: relative;
		}
	/*修改滚动条样式*/
	.yuew::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 2px;
	}
	.yuew::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.yuew::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	.jiapoi{
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 100%;
		width: 20px;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.jiazaiimg {
		width: 12px;
		height: 16px;
	}

	.unselect {
		font-size: 16px;
		color: #333333;
		padding: 6px 32px;
	}

	.selectFenlei {
		line-height: 34px;
		font-size: 22px;
		color: #37689F;
		border-bottom: 2px solid #37689F;
	}

	.line-bot {
		border-bottom: #E3E3E3 solid 1px;
		margin: 10px 0;
	}

	.LeftItem {
	overflow-y: auto;
    height: 88%;
    display: grid;
    grid-template-columns: repeat(auto-fill,160px);/*div宽度*/
    grid-template-rows: repeat(auto-fill,220px);/*div长度*/
    grid-gap: 20px 20px;/*上下间距 左右间距*/
    justify-content: space-between;/*布局*/
	    /* grid-auto-rows: auto; *//*div自适应高度*/
		/* grid-auto-columns: auto; */
	}
	/*修改滚动条样式*/
	.LeftItem::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 2px;
	}
	.LeftItem::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.LeftItem::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	.naichaItem {
		width: 157px;
		box-sizing: border-box;
		border-radius: 6px;
		position: relative;
	}

	.naichaItem:hover {
		box-shadow: 0px 0px 6px #CCD1D4;
	}

	.naichaItem::after {
		clear: both;
	}

	.naichaItem:active {
		transform: scale(0.95);
	}

	.naichaimg {
		width: 160px;
		height: 160px;
		border-radius: 6px;
	}

	.naichaprice {
		color: #FF3333;
		margin-top: 8px;
		margin-bottom: 6px;
		font-size: 18px;
		font-family: "DIN1";
	}

	.naichaname {
		font-size: 16px;
		color: #333;
		height: 2.3rem;
	}

	.naichanum {
		position: absolute;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F3842D;
		font-size: 16px;
		color: #FFF;
		height: 20px;
		width: 20px;
		right: 12px;
		top: 12px;
	}

	/*右边样式*/
	.forTime .forTimeRight {
		width: 31%;
		height: 100%;
		background: #fff;
		border-radius: 0 0 10px 10px;
		position: relative;
	}

	.RightTop {
		padding-top: 30px;
		box-sizing: border-box;
		width: 100%;
	}

	.RightList {
		width: 92%;
		height: 36px;
		font-size: 20px;
		color: #333;
		border-bottom: 2px solid #E3E3E3;
		margin: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.RightList button {
		height: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 36px;
	}

	.RightItem {
		display: flex;
		width: 97%;
		padding: 20px;
		box-sizing: border-box;
		margin: auto;
		border-radius: 10px;
		position: relative;
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
		width: 94px;
		height: 94px;
		border-radius: 10px;
	}

	.diancanItem {
		margin-left: 6px;
	}

	.diancanName {
		font-size: 16px;
		color: #333;
		margin-bottom: 6px;
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
		overflow-y: auto;
		padding: 10px 0;
		box-sizing: border-box;
		padding-bottom: 40px;
		position: absolute;
		height: 70%;
		width: 98%;
	}

	.RightPay {
		background-color: #E3E3E3;
		border-radius: 0 0 10px 10px;
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
		width: 100%;
	}

	.unselectPaymay {
		background-color: #fff;
		color: #B3B3B3;
		padding: 6px 20px;
		border-radius: 4px;
		margin-right: 10px;
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
		width: 100%;
		margin-bottom: 10px;
	}

	.focolor {
		color: #FF3333;
	}

	.fokuput {
		color: #FF3333;
		font-size: 26px;
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
		width: 57%;
		height: 620px;
		background: #eff0f2;
		transform: translateX(-50%) translateY(50%);
		border-radius: 14px;
		padding: 30px;
		box-sizing: border-box;
	}

	.Xuantop {
		font-size: 18px;
		color: #000;
		font-weight: bold;
		margin-bottom: 34px;
	}

	.ComeItem {
		display: flex;
		justify-content: space-between;
	}

	.Bxkashanx {
		width: 72%;
		height: 506px;
		overflow-y: auto;
	}
	/*修改滚动条样式*/
	.Bxkashanx::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 2px;
	}
	.Bxkashanx::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.Bxkashanx::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	.kashTitle {
		width: 10%;
		height: 100%;
		font-size: 1.1rem;
	}

	.kashprice {
		width: 136px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #999;
		border: solid #999 1px;
		border-radius: 6px;
		margin-left: 10px;
		position: relative;
		margin-top:10px;
	}

	.selectkashprice {
		background-color: #36679F;
		color: #fff;
	}

	.msduskprice {
		margin-left: 10px;
	}

	.Bxkashanx-item {
		display: flex;
		margin-top: 30px;
	}

	.kstylerice {
		width: 90%;
		display: flex;
		flex-wrap: wrap;
	}

	.pomilk {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		border-radius: 4px;
		background: #a8a6a6;
		opacity: 0.7;
	}

	.Bxkachanx {
		width: 22%;
		display: flex;
		flex-direction: column;
	}

	.Guigeimg {
		width: 138px;
		height: 138px;
		border-radius: 6px;
	}

	.jouse {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30px;
		font-size: 22px;
		color: #333;
		align-items: center;
	}

	.jouse img {
		width: 26px;
		height: 26px;
	}

	.jouse img:active {
		transform: scale(0.95);
	}

	.vuguofont {
		font-size: 16px;
		color: #333;
		margin: 10px 0;
		font-weight: bold;
	}

	.vuguoprice {
		font-size: 24px;
		color: #FF3333;
		margin-bottom: 30px;
	}

	.qingkong {
		width: 100%;
		height: 48px;
		border-radius: 6px;
		background-color: #FFCC66;
		margin-bottom: 20px;
		color: #FFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		margin-right: auto;
	}

	.qingkong:active {
		transform: scale(0.95);
	}

	.quxiao {
		background-color: #999;
	}

	.queren {
		background-color: #FF6666;
	}

	.zanwu {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mitmen {
		width: auto;
		padding: 0 20px;
	}

	.bntpwe {
		background-color: #FDF6EC;
		color: #E6A23C;
		border: 1px solid #FBECD8;
		width: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		height: 28px;
	}
	div /deep/ .el-message-box__title{
		text-align: center;}
	.ploeryt{
			    position: fixed;
			    left: 50%;
			    bottom: 50%;
			    z-index: 25;
			    width: 33%;
			    background: #fff;
			    transform: translateX(-50%) translateY(50%);
			    border-radius: 5px;
			    padding: 26px;
			    box-sizing: border-box;
		}
		.ploerytdiv{
			position: relative;
			}
		.ploeryt input{
			    width: 100%;
			    border: #ccc solid 1px;
			    border-radius: 5px;
			    height: 38px;
			    font-size: 16px;
			    padding-left: 10px;
			    box-sizing: border-box;
			    margin-top: 30px;
		}
		.text-p{
			font-size: 20px;
			text-align: center;
			
		}
		.kdpor{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 30px;
		}
		.kdpor .kdpor-z:nth-of-type(1){
			margin-left: 0px;
		}
		.kdpor .kdpor-z{
			padding: 10px 20px;
			border: #ccc solid 1px;
			border-radius: 4px;
			color: #333;
			margin-left: 10px;
		}
		.kdpor .kdpor-o{
			color: #fff;
			background-color: #409EFF;
			border: #ccc solid 0px;
		}
		.kdpor-img{
			    right: -7%;
			    position: absolute;
			    width: 9%;
			    height: 18%;
			    top: -40%;
		}
		.poete{
		  position: absolute;
		  top: -24px;
		  right: -24px;
		  opacity: 0.4;
		}
		.ete{
		  width: 50px;
		  height: 50px;
		  border-radius: 50%;
		  box-sizing: border-box;
		  position: relative;
		}
		.ete::after {
		  content: "";
		  width: 60%;
		  border-bottom: 2px #333 solid;
		  position: absolute;
		  top: 50%;
		  left: 50%;
		  transform: translateX(-50%) translateY(-50%) rotate(45deg);
		}
		
		.ete::before {
		  content: "";
		  width: 60%;
		  border-bottom: 2px #333 solid;
		  position: absolute;
		  top: 50%;
		  left: 50%;
		  transform: translateX(-50%) translateY(-50%) rotate(-45deg);
		}
		.huJiao{
			margin-right:20px;
			position: relative;
		}
		.huJiao-ve{
			position: absolute;
			top: -6px;
			right: -6px;
			border-radius: 50%;
			width: 20px;
			height: 20px;
			opacity: 1;
			background: #fa4343;
			font-size: 14px;
			font-family: DIN, DIN-Regular;
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.huJiao img{
    width: 40px;
    height: 40px;
		}
</style>

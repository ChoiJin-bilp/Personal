<template>
	<div>
		<div class="page">
			<div class="goback">
				<div @click="goback()" class="kj">
					<img :src="DataURL+'/images/yk001-goback.png'"></img>
					返回
				</div>
			</div>
			<div class="sitdown">
				<div class="eat-sit">
					<div>
						<input class="sit-o" v-model="agentPutAddress"></input>
						<div class="sit-t">请确定下单位置是否正确</div>
					</div>
					<div>
						<a class="link" @click.stop="paywaytype(2)" style="margin-left:12px;" :class="payfont=='验券收款'?'unselectPaymay selectPaymay':'unselectPaymay'">验券收款</a>
						<a class="link" @click.stop="paywaytype(3)" :class="payfont=='商家收款'?'unselectPaymay selectPaymay':'unselectPaymay'">商家收款</a>
					</div>
				</div>
				<div class="hoput">
					<div>
						<a class="link" @click.stop="paywaytype(1)" style="margin-left:0;" :class="payfont=='微信'?'unselectPaymay selectPaymay':'unselectPaymay'">微信</a>
						<!-- <a class="unselectPaymay">支付宝</a> -->
						<a class="link" @click.stop="paywaytype(0)" :class="payfont=='现金'?'unselectPaymay selectPaymay':'unselectPaymay'">现金</a>
					</div>
					<div class="pat-t">
						<!-- 71堂食 70外带 -->
						<div style="left:0;" :class="isHot==1? 'sbye colortype link':'sbye link'" @click.stop="isHottype(1)">堂食</div>
						<div style="right:0;" :class="isHot==0? 'sbye colortype link':'sbye link' " @click.stop="isHottype(0)">外带</div>
						<div :class="isHot==1? 'pat-s-g cost':'pat-s-g'"></div>
					</div>
				</div>
			</div>
			<div class="mainPortion">
				<div class="adressTitle">云客茶语(海岸城店)</div>
				<div class="drinkItem" v-for="(item,index) in shopCarList" :key="index">
					<img :src="item.photos[0]"></img>
					<div style="width: 85%;">
						<div class="itemconse">
							<a>{{item.productName}}</a>
							<a>￥{{item.amount+(item.synimage_price*item.num)}}</a>
						</div>
						<div class="itself">
							<a>{{item.showLabels}}</a>
							<a>×{{item.num}}</a>
						</div>
					</div>
				</div>
				<div class="totalny">小计<a>￥{{totalDouble}}</a></div>
			</div>
			<div class="amitedO" style="margin-top:10px;">
				<div class="remark">备注</div>
				<input placeholder="备注说明" v-model="remarks" @input="getInput(0)"></input>
			</div>

			<div class="pobottom">
				<div>待支付<a>￥{{totalDouble}}</a></div>
				<div v-if="moutetype" @click.once="submitOrder()">提交订单</div>
				<div v-if="!moutetype" @click.stop="submitOrder2()">重新支付</div>
			</div>
		</div>
		<div v-if="kbqtype" class="mabt link" @click.stop="buytoCancel">取消</div>
	</div>
</template>

<script>
	import Utils from '../utils/util.js';
	//引入轮播图
	import Swiper from 'swiper';
	//引入轮播的样式
	import "swiper/dist/css/swiper.min.css";
	//引入axios
	import {
		doGetData,
		addSMOrderInfo,
		geterWeima
	} from "../utils/axaj.js"
	export default {
		name: 'Mymain',
		data: function() {
			return {
				item: '',
				DataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
				totalDouble: 0,
				shopCarList: [],
				companyName: "",
				// 排队进度 前面还有多少单
				orderNum: 0,
				//当前设备投放位置
				agentPutAddress: "",
				//堂食外带 
				isHot: 1,
				remarks: "",
				// 显示多少张按摩券
				numAnMoCoupon: 0,
				orderId: "",
				payNo: "",
				//二维码地址
				qrUrl: '',
				//计时器计时判断
				timeoutType: false,
				//用户返回的订单id
				userdId: 0,
				//支付失败返回缓存
				orderDatas: '',
				//显示“重新支付”判断
				moutetype: true,
				//支付取消判断
				kbqtype: false,
				//支付方式
				payway: false,
				//支付显示
				payfont: "微信",
				path:"",
                socket:"",
				aaaa:''
			}
		},
		// 异步加载，先加载出player再使用 
		async mounted() {
			var that = this;
			this.mainCompanyData = '云客智能'
			this.getShopCar()
			this.path=this.$store.state.websk
			this.init()
			setTimeout(() => {
				if (that.shopCarList.length == 0) {
					that.$router.go(-1);
					return
				}
			}, 500)
			// geterWeima(this)
		},
		beforeRouteLeave(to, from, next) {
			var that = this;
			if (to.name == 'Firstlist' && that.userdId != 0) {
				to.meta.isBack = true;
			} else {
				to.meta.isBack = false;
			}
			next();
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
			this.init()
        },
        getMessage: function (msg) {
			// console.log(msg.data)
			// console.log(JSON.parse(msg.data))
			var that=this
			that.aaaa=JSON.parse(msg.data)
			var mesCode = JSON.parse(msg.data)
			//获取现在时间戳
			// var Timeskt = new Date().getTime()
			
			console.log("Websoter数据:",mesCode)
			//判断执行动作 'pay/cancel' 取消支付、'订单号/pay' 支付发起
			if(mesCode.req == 'pay/cancel'){
				return
			}else{
				if(mesCode.code == -1){
					that.$message({
						type: 'error',
						message: mesCode.msg,
						duration:2000
					});
					// that.delemunse()
					that.moutetype = false;
				}else if(mesCode.code == 0){
					//删除支付弹窗
					// that.delemunse()
					that.$message({
						type: 'success',
						message: '支付成功!'
					});
					that.moutetype = true;
					that.$router.go(-1);
				}
			}
        },
        // send: function () {
        //     this.socket.send("B202104290004/print")
        // },
        // send2: function () {
        //     this.socket.send("B202104290004/pay")
        // },		
        close: function () {
            console.log("socket已经关闭")
        },
		
			//支付方式
			paywaytype(e) {
			var that = this
				switch (e) {
					case 0:
					that.payway = true
					that.payfont = '现金'
						break
					case 1:
					that.payway = false
					that.payfont = '微信'
						break
					case 2:
					that.payway = true
					that.payfont = '验券收款'
						break
					case 3:
					that.payway = true
					that.payfont = '商家收款'
						break
					default:
						console.log(error)
						break
				}
			},
			//取消查询接口
			buytoCancel() {
				//关闭弹窗
				var that = this
				// that.delemunse()
				that.timeoutType = 0;
				that.moutetype = false;
				if(this.socket.readyState===1){
                this.socket.send("pay/cancel");
			}else if(this.socket.readyState===3){
				this.init()
				this.socket.send("pay/cancel");
			}
			},
			//获取订单是否付款接口
			queryOrders(id) {
				var that = this;
				var timestamp = Date.parse(new Date());
				var id = id
				var id2 = id.toString();
				timestamp = timestamp / 1000;
				let signParam = 'cls=product_order&action=QueryOrders&appId=' + 1 + "&timestamp=" + timestamp +
					'&userId=&orderId=' + id2;
				//A202101120001
				console.log(signParam)
				// 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
				// 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败 12已支付定金
				var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var agentCompanyId = this.$store.getters.sidebar.CompanyId;
				var otherParam = "&pageIndex=1&pageSize=99&companyId=" + agentCompanyId
				doGetData(this, smurl, signParam, otherParam, 5, "订单状态")
			},
			//获取二维码回调函数
			peomose(e, orderId, amount) {
				console.log("获取二维码回调函数")
				this.qrUrl = e;
				console.log(this.$store.getters.sidebar.smurl + "/baojiayou" + this.qrUrl)
				this.updateOrderStatus(orderId, amount)
			},
			//重新提交方法
			submitOrder2() {
				var that = this;
				if (that.payway) {
					that.updateOrderStatus(that.userdId, '现金')
					return
				}
				that.timeoutType = new Date().getTime() + 60000;
				// that.openFullScreen2()
				if(this.socket.readyState===1){
                that.socket.send(that.userdId+"/pay")
			}else if(this.socket.readyState===3){
				this.init()
				that.socket.send(that.userdId+"/pay")
			}
			},
			//获取生成数据
			getRuslt: function(data, code, error, tag) {
				let that = this;
				switch (code) {
					case 1:
						console.log(data)
						var content = ""
						switch (tag) {
							case 0:
								that.dealData(data)
								break
							case 1:
								that.orderNum = data.length
								console.log(that.orderNum)
								break
							case 2:
								//提交订单后获取订单号
								that.userdId = data.id
								that.getCanCoupons()
								
								break
							case 3:
								break
							case 4:
								var other = ""
								//查询订单状态
								that.queryOrders(that.userdId)
								// that.timeoutType = new Date().getTime() +  60000;
								// that.timeoutType = new Date().getTime() + 10000;
								break
							case 5:
								//判断是否为扫码支付
								if (data[0].status == 0) {
									if(this.socket.readyState===1){
										this.socket.send(that.userdId+"/pay")
									}else if(this.socket.readyState===3){
										this.init()
										this.socket.send(that.userdId+"/pay")
									}
								} else {
									//删除支付弹窗
									// this.delemunse()
									this.$message({
										type: 'success',
										message: '支付成功!'
									});
									that.moutetype = true;
									this.$router.go(-1);
								}
								break
						}
						if (!Utils.isNull(content)) {
							// wx.showToast({
							//   title: content,
							//   icon: 'none',
							//   duration: 1500
							// })
						}
						break
					default:
						console.log(error)
						break
				}
			},
			//支付中
			openFullScreen2() {
				const loading = this.$loading({
					lock: true,
					text: '支付中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.kbqtype = true;
			},
			//删除支付状态
			delemunse() {
				const loading = this.$loading({
					lock: true,
					text: '支付中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.kbqtype = false;
				loading.close();
			},
			/**
			 * 用戶购物车列表
			 */
			getShopCar() {
				var that = this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var agentCompanyId = this.$store.getters.sidebar.CompanyId;
				var userId = this.$store.getters.sidebar.userId
				let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId
				var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + agentCompanyId
				doGetData(this, smurl, signParam, otherParam, 0, "用戶购物车列表")
			},
			/**
			 * 购物车列表数据
			 * @param {*} data 
			 */
			dealData(data) {
				var that = this
				let shopCarList = data.shopCarList
				// 显示多少张按摩券
				let numAnMoCoupon = 0
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
						numAnMoCoupon += shopCar.num
					}
					that.shopCarList = shopCarList;
					that.totalDouble = data.totalDouble;
					that.companyName = shopCarList[0].companyName;
					that.numAnMoCoupon = numAnMoCoupon;
				} else {
					that.shopCarList = [];
				}
			},
			/**
			 * 切换堂食/外带
			 */
			isHottype(e) {
				this.isHot = e;
			},
			getInput(e) {
				// console.log(this.remarks)
			},
			submitOrder() {
				var that = this;
				if (!Utils.isNull(that.orderId)) {
					console.log("订单已提交,请勿重复提交")
					return
				}
				// 打印图案图片
				var synimages = []
				var cashId = that.$store.getters.sidebar.cashId
				let shopCarList = that.shopCarList
				var detail = []
				for (let i = 0; i < shopCarList.length; i++) {
					const shopCar = shopCarList[i];
					synimages.push(shopCar.synimage)
					var LabelIds = shopCar.detailLabelId.split(",")
					var detailListItem = {
						product_id: shopCar.productId,
						// detail_id: "",
						lbl_ids: LabelIds.join("-"),
						number: shopCar.num,
						price: shopCar.price,
						amount: shopCar.amount,
						// 0原价, 1优惠价, 2套装价, 3特价
						priceflag: 0,
					}
					detail = detail.concat(detailListItem)
				}
				var userId = that.$store.getters.sidebar.userId
				// var mobile = appUserInfo.userMobile
				if (synimages != []) {
					synimages = synimages.join(",")
				}
				var listItem = [{
					linkNo: 8,
					amount: that.totalDouble,
					companyId: this.$store.getters.sidebar.CompanyId,

					// giftdetail: proDataInfo.giftId,
					userId: userId,

					// shareuserId: shareUserId,
					mobile: '',

					//设备或来源id
					sourceId: "",

					//收银机门店ID
					cashId: cashId,

					//二维码地址
					// "qrUrl": that.$store.getters.sidebar.smurl +"/baojiayou"+ that.qrUrl,

					deliveryId: 0,
					//立即送出 1 预订 0
					deliveryflag: 1,

					detail: detail,
					//外帶/堂食
					way: "7" + that.isHot,
					remarks: that.remarks,
					//号牌手动输入
					addr: that.agentPutAddress,
					//图片上传
					synimage: synimages,
				}]
				that.orderDatas = listItem
				addSMOrderInfo(this, listItem);
			},

			gotoOrderDetailPage: function(orderId, tag, payNo) {
				var that = this;
				that.orderId = orderId;
				that.payNo = payNo;
				var amount = that.totalDouble
				// 方便测试使用
				// amount = 0
				//0元支付直接更新订单状态
				geterWeima(that, orderId, amount)
			},
			//
			updateOrderStatus(orderId, amount) {
				var that = this;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var appid = '1';
				var payfont = encodeURIComponent(that.payfont)
				var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var signParam = 'cls=product_order&action=UpdateCashOrders&appId=' + appid + "&timestamp=" + timestamp +
					"&orderId=" +
					orderId;
				var qrUrl = that.$store.getters.sidebar.smurl + "/baojiayou" + that.qrUrl
				console.log("判断时是否需要支付:" + this.payway)
				//判断时支付方式是否为现金、验券收款、商家收款  不需要/true 需要/false
				if (this.payway) {
					//现金
					if (amount == '现金') {
						var otherParam = "&trade_no="+ payfont +"&status=1&payamount=" + that.totalDouble + '&qrUrl=' + qrUrl
					} else {
						var otherParam = "&trade_no="+ payfont +"&status=1&payamount=" + amount + '&qrUrl=' + qrUrl
					}
				} else {
					var otherParam = '&qrUrl=' + qrUrl
				}
				console.log(signParam)
				doGetData(this, smurl, signParam, otherParam, 2, "更新订单状态")
			},
			getCanCoupons() {
				var that = this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
					interfacePart = that.$store.getters.sidebar.interfacePart,
					smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var orderId = that.orderId;
				var agentCompanyId = this.$store.getters.sidebar.CompanyId;
				var userId = this.$store.getters.sidebar.userId
				var urlParam = "cls=product_coupons&action=QueryCanCoupons"
				var otherParam = "&userId=" + userId + "&companyId=" + agentCompanyId + "&orderId=" + orderId + "&flag=0&mold=20"
				doGetData(this, smurl, urlParam, otherParam, 4, "获取饮品支付成功按摩的优惠券")
			},
			goback() {
				this.$router.push('/Itemlist');
			}
		},
		close(){
			this.socket.onclose()
		},
		destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    }
	}
</script>

<style scoped lang="scss">
	.page {
		background: #F0F1F3;
		padding-bottom: 120px;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		overflow-y: auto;
	}

	.amitedO {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 20px 40px;
		box-sizing: border-box;
	}

	.amitedTime {
		font-weight: bold;
	}

	.amitedcommit {
		color: #36A3F9;
		font-size: 28px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 160px;
	}

	.amitedcommit img {
		width: 40px;
		height: 40px;
	}

	.schedule {
		font-size: 28px;
		color: #000;
	}

	.schedule a {
		color: #008665;
	}

	.adressTitle {
		color: #7C8186;
		padding: 10px 40px;
		box-sizing: border-box;
		font-size: 30px;
		font-weight: 400;
	}

	.drinkItem {
		display: flex;
		align-items: center;
		background: #F7F7F7;
		box-sizing: border-box;
		padding: 20px 40px;
	}

	.drinkItem img {
		width: 13%;
		height: 130px;
		padding: 10px 20px;
		box-sizing: border-box;
		margin-top: 20px;
	}

	.mainPortion {
		margin-top: 10px;
		background: #fff;
	}

	.itemconse {
		display: flex;
		justify-content: space-between;
		font-size: 30px;
		align-items: center;
	}

	.itself {
		display: flex;
		justify-content: space-between;
		line-height: 40px;
		color: #959A9E;
		font-size: 24px;
		margin-top: 30px;
	}

	.totalny {
		display: flex;
		justify-content: flex-end;
		padding: 20px 40px;
		font-size: 30px;
	}

	.totalny a {
		color: #9B6032;
		font-family: 'DIN';
	}

	.remark {
		width: 20%;
		font-size: 28px;
		color: #333;
	}

	.amitedO input {
		width: 100%;
		font-size: 28px;
		border: #ccc solid 1px;
		padding: 10px;
	}

	.pobottom {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100px;
		width: 100%;
		background: #fff;
		color: #333;
		z-index: 10;
	}

	.pobottom a {
		color: #9B6032;
		font-size: 32px;
		margin-left: 10px;
	}

	.pobottom div:nth-of-type(1) {
		padding: 10px 20px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24px;
	}

	.pobottom div:nth-of-type(2) {
		background: #008665;
		font-size: 34px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 100%;
		width: 200px;
	}

	/*共用弹窗*/
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

	/*选择取餐时间弹窗*/
	.takeFoodtime {
		position: fixed;
		bottom: 0px;
		left: 0;
		z-index: 25;
		width: 100%;
		background: #eff0f2;
		transition: bottom 0.4s;
	}

	.takeFoodtimeout {
		bottom: -600px;
	}

	.sroll {
		max-height: 320px;
		overflow: auto;
	}

	.sroll div {
		width: 100%;
		text-align: center;
		line-height: 80px;
		font-size: 26px;
	}

	.srollcolor {
		color: #2FA1FC;
		position: relative;
	}

	.srollcolor a {
		position: absolute;
		right: 200px;
		top: 0px;
		font-size: 28px;
	}

	.del {
		height: 80px;
		font-size: 34px;
		color: #333;
		border-top: 2px solid #999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.distribution {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30px;
		padding: 20px 40px;
		border-bottom: #F7F7F7 2px solid;
	}

	.delivery {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 40px;
		background: #fff;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.delivery img {
		width: 40px;
		height: 40px;

	}

	.wehtFont {
		font-weight: bold;
		width: 100%;
		text-align: center;
		font-size: 30px;
	}

	.dressItem {
		width: 100%;
		font-size: 30px;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.dressItem div:nth-of-type(1) {
		font-weight: bold;
	}

	.dressItem div:nth-of-type(1) a {
		margin-left: 20px;
	}

	.dressItem div:nth-of-type(2) {
		color: #999;
		font-size: 28px;
		margin-top: 20px;
	}

	.sitdown {
		display: flex;
		justify-content: space-between;
		background: #fff;
		margin: 0 auto;
		width: 100%;
		padding: 0.4% 2%;
		box-sizing: border-box;
	}

	.sit-o {
		display: flex;
		height: 56px;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		box-sizing: border-box;
		background: #F2F2F2;
		color: #2687e2;
		margin: 6px auto;
		margin-top: 0px;
		font-weight: bold;
		padding: 0 20px;
		max-width: 360px;
		font-size: 32px;
		text-align: center;
	}

	.sit-t {
		font-size: 22px;
		color: #ccc;
	}

	.pat-t {
		display: flex;
		border: #CECECE solid 2px;
		width: 220px;
		justify-content: space-around;
		align-items: center;
		border-radius: 36px;
		box-sizing: border-box;
		position: relative;
		height: 40px;
	}

	.sbye {
		width: 50%;
		height: 100%;
		text-align: center;
		position: absolute;
		top: 0;
		z-index: 6;
		line-height: 40px;
		color: #ccc;
	}

	.pat-s-g {
		z-index: 4;
		position: absolute;
		width: 50%;
		border-radius: 36px;
		height: 100%;
		background: #44A6EF;
		left: 50%;
		top: 0;
		box-shadow: 2px 2px 10px #050404;
		transition: left 0.2s;
	}

	.colortype {
		color: #fff;
	}

	.cost {
		left: 0;
	}

	.usenote {
		width: 94%;
		font-size: 28px;
		color: #000;
		padding: 10px;
		background: #fff;
		margin: 0 auto;
		margin-bottom: 16px;
		box-sizing: border-box;
		border-radius: 12px;
	}

	.note-o {
		color: #eb3e3e;
	}

	.note-t {
		margin-top: 10px;
		color: #7F7F7F;
		font-size: 26px;
	}

	.note-t a:nth-of-type(1) {
		font-size: 34px;
		color: #7F7F7F;
		font-weight: bold;
	}

	.note-t a:nth-of-type(2) {
		font-size: 30px;
		margin-left: 20px;
	}

	.topbusty {
		width: 100%;
		height: 50px;
		text-align: left;
		padding: 10px 20px;
		font-size: 50px;
		background: #FFF;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.mabt {
		display: flex;
		position: fixed;
		height: 36px;
		width: 100px;
		left: 50%;
		top: 74%;
		transform: translate(-50%, -50%);
		justify-content: center;
		align-items: center;
		z-index: 10000;
		background: #fff;
		color: #333;
		border-radius: 4px;
		font-size: 18px;
		box-shadow: 0px 1px 0 rgba($color: #000000, $alpha: 0.5);
		font-weight: bold;
	}

	.mabt:active {
		background: rgba($color: #ccc, $alpha: 1);
	}

	.unselectPaymay {
		background-color: #fff;
		color: #B3B3B3;
		padding: 6px 30px;
		border-radius: 4px;
		margin-right: 10px;
		border: solid #ccc 1px;
		font-size: 24px;
	}

	.selectPaymay {
		background-color: #059837;
		color: #fff;
	}

	.hoput {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.goback {
		background-color: #fff;
		padding: 0.8% 2%;
		box-sizing: border-box;
		margin-bottom: 10px;
	}

	.goback img {
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}

	.kj {
		width: 120px;
		display: flex;
		align-items: center;
		font-size: 24px;
		border-right: solid 1px #000;
	}

	.eat-sit {
		display: flex;
		align-items: center;
	}
</style>

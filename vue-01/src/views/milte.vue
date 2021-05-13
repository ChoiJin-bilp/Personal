<template>
	<div class="bossback" id="milte">
		<div class="mesItme"  ref="element">
			<div class="mesItem-Top"  ref="element1">
				<div class="mesItem-Topone link" @click.stop="goBack">
					<img class="mesItem-Topimg" :src="SMDataURL+'/images/al-fh.png'" />
					<a class="mesItem-Top-f">返回</a>
				</div>
				<div class="mesItem-Toptwo">
					<img class="Top-img" :src="SMDataURL+'/images/al-rq.png'" />
					<a class="mesItem-Top-g">订单管理</a>
				</div>
			</div>
			<div class="mesItem-Item" ref="element2">
				<div class="markdown">
					<input class="gmk" placeholder="订单ID/订单号/牌号" onkeyup="this.value=this.value.replace(/[^\w_]/g,'');" v-model="textValue">
					<el-date-picker :blur="ondata()" v-model="value1" type="daterange" style="font-size: 18px;" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
					<div class="plyuwenhgt">
					<div v-if="!xialatype" @click="xipotypa()" class="plyuwenhgr"></div>
					<el-dropdown :hide-on-click="true" class="dropd" style="font-size: 18px;" @command="onchanstatus">
						<div class="el-dropdown-link ">
							{{status}}<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
						<el-dropdown-menu slot="dropdown" v-if="xialatype">
							<el-dropdown-item command="全部">全部</el-dropdown-item>
							<el-dropdown-item command="已支付">已支付</el-dropdown-item>
							<el-dropdown-item command="已完成">已完成</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					</div>
					<el-button class="mhe" type="primary" @click="chdp()">一键确认</el-button>
					<div class="fthu">共<a>{{timeValue.length}}</a>单</div>
					<div class="search link" @click.stop="Check()"><img :src="SMDataURL+'/images/al-cx.png'" />搜索</div>
				</div>
				<div class="selCup">
					<div :class="msjtIndex == 0?'selCup-chioce selCup-select link':'selCup-chioce link'" @click.stop="magChange(0)">
						<div style="display: flex;align-items: center;"><img :src="msjtIndex == 0?SMDataURL+'/images/al-sc2.png':SMDataURL+'/images/al-sc1.png'" />全部订单</div>
						<a v-if="msjtIndex == 0 && zsnum!=''">{{zsnum}}单</a>
					</div>
					<div :class="msjtIndex == 1?'selCup-chioce selCup-select link':'selCup-chioce link'" @click.stop="magChange(1)">
						<div style="display: flex;align-items: center;"><img :src="msjtIndex == 1?SMDataURL+'/images/al-ts2.png':SMDataURL+'/images/al-ts1.png'" />堂食</div>
						<a v-if="msjtIndex == 1 && tsnum!=''">{{tsnum==null?0:tsnum}}单</a>
					</div>
					<div :class="msjtIndex == 2?'selCup-chioce selCup-select link':'selCup-chioce link'" @click.stop="magChange(2)">
						<div style="display: flex;align-items: center;"><img :src="msjtIndex == 2?SMDataURL+'/images/al-wd2.png':SMDataURL+'/images/al-wd1.png'" />外带</div>
						<a v-if="msjtIndex == 2 && wdnum!=''">{{wdnum==null?0:wdnum}}单</a>
					</div>
					<div :class="msjtIndex == 3?'selCup-chioce selCup-select link':'selCup-chioce link'" @click.stop="magChange(3)">
						<div style="display: flex;align-items: center;"><img :src="msjtIndex == 3?SMDataURL+'/images/al-wm2.png':SMDataURL+'/images/al-wm1.png'" />外卖</div>
						<a v-if="msjtIndex == 3 && wmnum!=''">{{wmnum==null?0:wmnum}}单</a>
					</div>
					<div :class="msjtIndex == 4?'selCup-chioce selCup-select link':'selCup-chioce link'" @click.stop="magChange(4)">
						<div style="display: flex;align-items: center;"><img :src="msjtIndex == 4?SMDataURL+'/images/al-yd2.png':SMDataURL+'/images/al-yd1.png'" />预订</div>
						<a v-if="msjtIndex == 4 && ydnum!=''">{{ydnum==null?0:ydnum}}单</a>
					</div>
				</div>
				<div class="ComeItemtitle">
					<div>号牌</div>
					<div>桌号</div>
					<div>商品名称/规格</div>
					<div>数量</div>
					<div>支付时间</div>
					<div>取餐时间
						<!-- <a  style="color: #ff3333;">(超时99单)</a> -->
					</div>
					<div>就餐方式</div>
					<!-- <div>备注</div> -->
					<div>操作</div>
				</div>
				<!--时间搜索界面-->
				<div class="burdeningout infinite-list-wrapper" :style="'overflow:auto;height:'+itemHeight+'px;width:'+itemWind+'px;'" ref='gundong'>
					<ul class="list" v-infinite-scroll="load" infinite-scroll-delay="500" :infinite-scroll-disabled="disabled">
						<li class="list-item bg-navy" v-for="(item,index) in timeValue" :key="index">
							<div class="bg-navy-z">{{item.sn}}
								<div v-if="item.synimage" style="margin-top: 10px; color: #FF3333; font-size: 13px;white-space: nowrap;margin-left: -6px;">(需打印图片)</div>
							</div>
							<div class="bg-navy-o">
								<template v-if="item.linkNo == 8">
									{{item.addr}}
								</template>
							</div>
							<div class="bg-navy-t">
								<div class="bgitem">
									<div>
										<div class="potu" style="margin-bottom: 10px;">{{item.productName}}</div>
										<div class="potu2" style="color: #F26426;font-size: 16px;">{{item.lblnames}}</div>
									</div>
									<div class="bar">×{{item.num}}</div>
								</div>
							</div>
							<div class="bg-navy-f">
								{{item.busty_date}}
							</div>
							<div class="bg-navy-f">
								<div style="margin-bottom: 10px;">{{item.leve_date}}</div>
								<!-- <div style="color: #ff3333;">59:59</div> -->
							</div>
							<div class="bg-navy-w">
								<template v-if="item.linkNo == 8">
									<div class="mkjh" :style="item.way == 71?'':'color: #ff6633;'">{{item.way == 71?"堂食":'外带'}}</div>
								</template>
								<template v-if="item.linkNo == 9">
									<div class="mkjh" style="color: #28B228;">外买</div>
								</template>
								<div style="color: #666666;">{{item.deliveryflag==0?"预订":''}}</div>
							</div>
							<div class="bg-navy-x">
								{{item.remarks}}
							</div>
							<template v-if="item.status == 1">
								<div class="bg-navy-v">
									<button class="butback" @click="send(item.orderId)">标签</button>
									<button class="butback" @click="send2(item.orderId)">小票</button>
									<button class="butback link" @click.stop="updateOrderStatus(item.orderId,item.id)">确认送出</button>
									<button class="butback" @click.stop="gotoPage(item,item.orderId)">查看详情</button>
								</div>
							</template>
							<template v-if="item.status != 1">
								<div class="bg-navy-v">
									<button class="butback" @click="send(item.orderId)">标签</button>
									<button class="butback" @click="send2(item.orderId)">小票</button>
									<button class="butback" @click.stop="gotoPage(item,item.orderId)">查看详情</button>
									<button v-if="item.status == 0" class="butgound">未支付</button>
									<button v-if="item.status == 2" class="butgound">已完成</button>
									<button v-if="item.status == 3" class="butgound">已取消</button>
									<button v-if="item.status == 4" class="butgound">已退款</button>
									<button v-if="item.status == 9" class="butgound">退款中</button>
								</div>
							</template>
						</li>
					</ul>
					<p v-if="loading" class="jobuz">加载中...</p>
					<p v-if="touse" class="jobuz">没有更多了</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	//引入外用js
	import MD5JS from '../utils/md5.js';
	import Utils from '../utils/util.js';
	import {
		doGetData
	} from "../utils/axaj.js"
	export default {
		data() {
			return {
				SMDataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
				value1: "",
				// value2: '',
				currentData: 5,
				pIndex: 1,
				pSize: 5,
				//订单列表
				orderList: [],
				//应用列表
				bustyList: [],
				//搜索全部/已支付/未支付状态
				payto: 0,
				//msjtIndex判断显示的主题
				msjtIndex: 0,
				//判断转态
				status: "全部",
				//输入框内容
				textValue: '',
				//下拉刷新
				loading: false,
				//判断是否能重新下拉
				touse: false,
				//数据
				zsnum: 0,
				tsnum: 0,
				wdnum: 0,
				wmnum: 0,
				ydnum: 0,
				//时间搜索
				datatime: [],
				//状态搜索
				datastatus: '',
				//时间判断
				time1: '',
				time2: '',
				//下拉隐藏
				xialatype:true,
				//下拉栏的高度
				itemHeight:'',
				//下拉栏的宽度
				itemWind:'',
				path:'',
                socket:"",
				scroll: "",
			};
		},
		beforeRouteLeave(to, from, next) {
			if (to.name == 'Firstlist') {
				console.log("出来了!")
				from.meta.keepAlive = false;
			} else if (to.name == 'Orderdetail') {
				from.meta.isBack = false;
				from.meta.keepAlive = true;
			}
			next();
		},
		activated() {
			//监听滚动条
			if(this.scroll > 0){
			this.$refs.gundong.scrollTo(0, this.scroll);
			this.scroll = 0;
			this.$refs.gundong.addEventListener('scroll', this.handleScroll);
		    }
			if (this.$route.meta.isBack) {
				//重置数据
				this.SMDataURL = 'https://bjy.51yunkeyi.com/baojiayou/tts_upload'
				this.value1 = "";
				// this.value2= '';
				this.currentData = 5;
				this.pIndex = 1;
				this.pSize = 5;
				//订单列表
				this.orderList = [];
				//应用列表
				this.bustyList = [];
				//搜索全部/已支付/未支付状态
				this.payto = 0;
				//msjtIndex判断显示的主题
				this.msjtIndex = 0;
				//判断转态
				this.status = "全部";
				//输入框内容
				this.textValue = '';
				//下拉刷新
				this.loading = false;
				//判断是否能重新下拉
				this.touse = false;
				//加载前工作
				// this.queryOrderDetail()
				this.onchanstatus('已支付')
			}
		},
		// created() {
        //     window.addEventListener('beforeunload', e => {
        //     window.scrollTo(0,0)
        //     });
        // },
		mounted: function() {
			//监听滚动条
			// window.addEventListener('scroll', this.handleScroll)
			this.$refs.gundong.addEventListener('scroll', this.handleScroll)
			//websock地址
			this.path=this.$store.state.websk
			this.onchanstatus('已支付')
			//获取高度实现自适应
			this.nbfHeight()
			this.init()
		},
		watch: {},
		computed: {
			disabled() {
				return this.loading || this.touse
			},
			//搜索显示内容
			timeValue() {
				var bus = []
				for (let i = 0; i < this.BustyList.length; i++) {
					var hastime = new Date(this.BustyList[i].create_date).getTime();
					var payto = this.BustyList[i].status;
					var synimage = this.BustyList[i].synimage.split(",")
					this.BustyList[i].synimage = synimage[0]
					bus.push(this.BustyList[i])
				}
				console.log(bus)
				return bus
			},
			//文本显示内容
			BustyList() {
				var that = this;
				that.bustyList = JSON.parse(JSON.stringify(that.orderList))
				var tag = this.msjtIndex
				switch (tag) {
					case 0:
						for (let i = 0; i < that.bustyList.length; i++) {
							that.bustyList[i].busty_date = that.bustyList[i].create_date.substring(5);
							that.bustyList[i].productName = that.bustyList[i].productNames;
							if (that.bustyList[i].deliverytime != null) {
								that.bustyList[i].leve_date = that.bustyList[i].deliverytime.substring(5)
							}
						}
						break
					case 1:
						var skt = [];
						for (let i = 0; i < that.bustyList.length; i++) {
							that.bustyList[i].busty_date = that.bustyList[i].create_date.substring(5);
							that.bustyList[i].productName = that.bustyList[i].productNames;
							if (that.bustyList[i].deliverytime != null) {
								that.bustyList[i].leve_date = that.bustyList[i].deliverytime.substring(5)
							}
							var bsty = that.bustyList[i]
							if (bsty.linkNo == 8 && bsty.way == 71) {
								skt.push(bsty)
							}
						}
						that.bustyList = skt
						break
					case 2:
						var skt = [];
						for (let i = 0; i < that.bustyList.length; i++) {
							that.bustyList[i].busty_date = that.bustyList[i].create_date.substring(5);
							that.bustyList[i].productName = that.bustyList[i].productNames;
							if (that.bustyList[i].deliverytime != null) {
								that.bustyList[i].leve_date = that.bustyList[i].deliverytime.substring(5)
							}
							var bsty = that.bustyList[i]
							if (bsty.linkNo == 8 && bsty.way == 70) {
								skt.push(bsty)
							}
						}
						that.bustyList = skt
						break
					case 3:
						var skt = [];
						for (let i = 0; i < that.bustyList.length; i++) {
							that.bustyList[i].busty_date = that.bustyList[i].create_date.substring(5);
							that.bustyList[i].productName = that.bustyList[i].productNames;
							if (that.bustyList[i].deliverytime != null) {
								that.bustyList[i].leve_date = that.bustyList[i].deliverytime.substring(5)
							}
							var bsty = that.bustyList[i]
							if (bsty.linkNo == 9) {
								skt.push(bsty)
							}
						}
						that.bustyList = skt
						break
					case 4:
						var skt = [];
						for (let i = 0; i < that.bustyList.length; i++) {
							that.bustyList[i].busty_date = that.bustyList[i].create_date.substring(5);
							that.bustyList[i].productName = that.bustyList[i].productNames;
							if (that.bustyList[i].deliverytime != null) {
								that.bustyList[i].leve_date = that.bustyList[i].deliverytime.substring(5)
							}
							var bsty = that.bustyList[i]
							if (bsty.deliveryflag == 0) {
								skt.push(bsty)
							}
						}
						that.bustyList = skt
						break
					default:
						break
				}
				return that.bustyList
			},

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
            console.log(msg.data)
        },
        send: function (orderId) {
			if(this.socket.readyState===1){
				this.socket.send(orderId+"/print")
			}else if(this.socket.readyState===3){
				this.init()
				this.socket.send(orderId+"/print")
			}
        },
        send2: function (orderId) {
			if(this.socket.readyState===1){
				this.socket.send(orderId+"/print2")
			}else if(this.socket.readyState===3){
				this.init()
				this.socket.send(orderId+"/print2")
			}
        },			
        close: function () {
            console.log("socket已经关闭")
        },
			//一键确认
			chdp(){
				var that = this;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var appid = that.$store.getters.sidebar.appId;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				for (let i = 0; i < this.orderList.length; i++) {
					var orderId = this.orderList[i].orderId
					let signParam = 'cls=product_order&action=UpdateOrders&appId=' + appid + "&timestamp=" + timestamp + "&orderId=" +
						orderId;
					var otherParam = '&status=2'
					doGetData(this, smurl, signParam, otherParam, 0, "更新订单状态")
				}
				setTimeout(()=>{
					that.pIndex = 1;
						if (this.payto == 0) {
							that.queryOrderDetail()
						} else if (this.payto == 1) {
							that.queryOrderDetail(0, this.datatime)
						} else if (this.payto == 2) {
							that.queryOrderDetail(1, this.datastatus)
						} else if (this.payto == 3) {
							that.queryOrderDetail()
							return
						}
						that.loading = false;
						that.touse = false;
				},500)
			},
			//获取元素高度
			nbfHeight(){
				let height= this.$refs.element.offsetHeight;
				let height1= this.$refs.element1.offsetHeight;
				let height2= this.$refs.element2.offsetHeight;
				let width2= this.$refs.element2.offsetWidth;
				let itemHeight = height-height1-height2-20
				this.itemHeight = itemHeight
				this.itemWind = width2
			},
			//下拉刷新
			load() {
				var that = this;
				that.loading = true;
				setTimeout(() => {
					that.num++;
					that.pIndex = that.pIndex + 1
					if (that.payto == 0) {
						that.queryOrderDetail()
					} else if (that.payto == 1) {
						that.queryOrderDetail(0, that.datatime)
					} else if (that.payto == 2) {
						that.queryOrderDetail(1, that.datastatus)
					}
					that.loading = false
				}, 2000)
			},
			//隐藏弹窗
			xipotypa(){
				console.log(123)
					this.xialatype =true;
			},
			//跳转内容详情界面
			gotoPage(item, orderId) {
				this.$router.push({
					"path": "/Orderdetail",
					query: {
						"item": item,
						"orderId": orderId
					}
				});
			},
			//搜索内容
			Check() {
				if (this.textValue == "") {
					// this.$message({
					// 	type: 'info',
					// 	message: "请输入搜索内容"
					// });
					this.pIndex = 1;
					this.queryOrderDetail();
					return
				}
				console.log("搜索字符");
				var data = this.textValue;
				this.pIndex = 1;
				this.msjtIndex = 0;
				this.textValue2 = data;
				this.queryOrderDetail(2, data);
				this.textValue = "";
			},
			//更改订单状态
			updateOrderStatus(orderId, id) {
				var that = this;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var appid = that.$store.getters.sidebar.appId;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				let signParam = 'cls=product_order&action=UpdateOrders&appId=' + appid + "&timestamp=" + timestamp + "&orderId=" +
					orderId;
				var otherParam = '&status=2'
				doGetData(this, smurl, signParam, otherParam, 0, "更新订单状态")
				for (let i = 0; i < this.orderList.length; i++) {
					if (this.orderList[i].id == id) {
						this.orderList[i].status = 2
					}
				}
				that.pIndex = 1;
					if (this.payto == 0) {
						that.queryOrderDetail()
					} else if (this.payto == 1) {
						that.queryOrderDetail(0, this.datatime)
					} else if (this.payto == 2) {
						that.queryOrderDetail(1, this.datastatus)
					} else if (this.payto == 3) {
						that.queryOrderDetail()
						return
					}
					that.loading = false;
					that.touse = false;
				
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
								console.log("更改訂單状态成功！")
								break
						}
						if (!Utils.isNull(content)) {
							this.$message({
								type: 'error',
								message: content
							});
						}
						break
					default:
						console.log(error)
						break
				}
			},
			//搜索支付状态
			onchanstatus(e) {
				this.status = e
				var data;
				switch (e) {
					case '全部':
						data = '';
						break
					case '已完成':
						data = 2;
						break
					case '已支付':
						data = '1';
						break
					case '未支付':
						data = 0;
						break
					default:
						console.log(error)
						break
				}
				this.pIndex = 1;
				this.payto = 2;
				this.touse = false;
				this.datastatus = data
				this.msjtIndex = 0;
				this.value1 = "";
				this.xialatype =false;
				this.queryOrderDetail(1, data)
				var that =this;
			},
			//日期搜索
			ondata() {
				if (this.value1 == "" || this.value2 == "") {
					return
				} else {
					if (this.value2 != "" && this.value1 == this.value2) {
						return
					}
					this.value2 = this.value1
				}
				this.pIndex = 1
				var d = new Date(this.value1[0]);
				d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
					':' + d.getSeconds();
				var c = new Date(this.value1[1]);
				c = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' ' + c.getHours() + ':' + c.getMinutes() +
					':' + c.getSeconds();
				var c = new Date(c).getTime();
				c += 86400000
				var c = new Date(c);
				c = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' ' + c.getHours() + ':' + c.getMinutes() +
					':' + c.getSeconds();
				var data = []
				data.push(d)
				data.push(c)
				this.payto = 1;
				this.datatime = data;
				this.msjtIndex = 0;
				this.touse = false;
				this.status ="全部";
				this.queryOrderDetail(0, data)
			},
			//搜索堂食外卖之类的东西
			magChange(e) {
				this.msjtIndex = e;
				var that = this;
				that.pIndex = 1;
				// that.loading=true;
				setTimeout(() => {
					if (this.payto == 0) {
						that.queryOrderDetail()
					} else if (this.payto == 1) {
						that.queryOrderDetail(0, this.datatime)
					} else if (this.payto == 2) {
						that.queryOrderDetail(1, this.datastatus)
					} else if (this.payto == 3) {
						that.loading = true;
						that.touse = false;
						that.queryOrderDetail()
						return
					}
					that.loading = false;
					that.touse = false;
				}, 500)
			},
			//返回上一级
			goBack() {
				this.$router.push("/Itemlist")
			},
			//获取整体信息
			queryOrderDetail: function(tag, item) {
				var that = this;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var URL = srvDevTest + smallInterfacePart;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var KEY = this.$store.getters.sidebar.KEY
				// var userId = app.globalData.userTotalInfo.id
				var urlParam = "cls=product_order&action=QueryOrdersNew&appId=1" + "&timestamp=" + timestamp;
				console.log('sign:', urlParam + "&key=" + KEY)
				var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				// 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败 12已支付定金
				var status = 0;
				// 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
				var linkNo = "8,9,11";
				var msjtIndex = that.msjtIndex;
				switch (that.currentData) {
					case 0:
						status = 0;
						break;
					case 1:
						status = 1;
						break;
					case 2:
						status = 6;
						break;
					case 3:
						status = 2;
						break;
					case 4:
						status = 5;
						break;
					case 5:
						status = "1,2,6,11";
						break;
					default:
						linkNo = ""
						break
				}
				let s = status == 0 ? ' 0,12' : status;

				if (tag == 0) {
					//根据时间搜索
					urlParam = urlParam + "&status=" + s + "&pIndex=" + that.pIndex + "&sField=" + "id" + '&pSize=20' +
						"&sOrder=desc" + "&startDate=" + item[0] + "&endDate=" + item[1] + "&sign=" + sign;
				} else if (tag == 1) {
					//根据状态
					urlParam = urlParam + "&status=" + item + "&pIndex=" + that.pIndex + "&sField=" + "id" + '&pSize=20' +
						"&sOrder=desc" + "&sign=" + sign;
				} else if (tag == 2) {
					//根据文字
					urlParam = urlParam + "&status=" + s +"&pIndex=" + that.pIndex + "&sField=id" + '&pSize=99' +
						"&sOrder=desc" + "&key=" + item + "&sign=" + sign;
				} else {
					urlParam = urlParam + "&status=" + s + "&pIndex=" + that.pIndex + "&sField=" + "id" + '&pSize=10' +
						"&sOrder=desc" + "&sign=" + sign;
				}
				if (status == 0) {
					urlParam = urlParam + "&isGroup=1";
				}
				//判断页面现在状况
				if (msjtIndex == 0) {
					urlParam = urlParam + "&linkNo=" + linkNo;
				} else if (msjtIndex == 1) {
					urlParam = urlParam + "&linkNo=8" + "&way=71"
				} else if (msjtIndex == 2) {
					urlParam = urlParam + "&linkNo=8" + "&way=70"
				} else if (msjtIndex == 3) {
					urlParam = urlParam + "&linkNo=9"
				} else if (msjtIndex == 4) {
					urlParam = urlParam + "&deliveryflag=0"
				}
				urlParam = urlParam + "&companyId=" + that.$store.getters.sidebar.CompanyId;
				console.log('查询订单详情:', URL + urlParam)
				axios.get(URL + urlParam).then(res => {
					console.log(res)
					console.log('查询订单:', res)
					if (res.data.rspCode == 0) {

						var data = res.data.list,
							imagesArray = null,
							detailDataItem = null;
						if (data.length > 0 && status == 0) {

							for (let i = 0; i < data.length; i++) {
								var orders = data[i].orders;
								// 多个商品合计
								data[i].amount = 0;

								// 处理多件商品待付款订单
								if (data[i].cnt == 1) {
									data[i].orderId = orders[0].orderId;
								} else {
									data[i].detailPhotos = [];
								}
								for (let k = 0; k < orders.length; k++) {
									var order = orders[k];
									// 订单状态
									data[i].state = order.status;
									//规格列表处理
									var detail = order.detail

									for (let j = 0; j < detail.length; j++) {
										detailDataItem = null;
										detailDataItem = detail[j];
										if (detailDataItem.linkNo == 4 && detailDataItem.orderstatus == 12) {
											// 算出总尾款
											data[i].amount = data[i].amount + (detailDataItem.productprice - detailDataItem.deposit) * detailDataItem
												.number;
										} else {
											data[i].amount = data[i].amount + detailDataItem.amount;
										}
										// 团拼超时 订单失效
										if (!Utils.isNull(detailDataItem.groupDay) &&
											nowTimestamp > create_date + ((24 * 60 * 60 * 1000) * detailDataItem.groupDay)) {
											data[i].status = -1 //团拼超时 失败
											console.log('团拼超时 订单失效')
										}
										//图片处理
										if (detailDataItem.detailPhotos != null && detailDataItem.detailPhotos != undefined) {
											imagesArray = null;
											imagesArray = detailDataItem.detailPhotos.split(",");
											if (data[i].cnt == 1) {
												detail[j].detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] :
													defaultItemImgSrc;
											} else {
												if (data[i].detailPhotos.length < 3) {
													data[i].detailPhotos[k] = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] :
														defaultItemImgSrc;
												}
											}
										}

										if (Utils.isNull(detailDataItem.attributeOne)) {
											detailDataItem.attributeOne = ""
										}
										if (Utils.isNull(detailDataItem.attributeTwo)) {
											detailDataItem.attributeTwo = ""
										}
									}
									order.detail = detail;
									try {
										order.linkNo = parseInt(order.linkNo);
									} catch (e) {}
									console.log(' order.linkNo:', order.linkNo)
									var create_date = order.create_date;
									data[i].create_date = order.create_date;
									data[i].linkNo = order.linkNo;
									create_date = Date.parse(new Date(create_date.replace(/\-/g, '/')));
									var nowTimestamp = Date.parse(new Date());
									// 已付定金
									if (order.linkNo == 4 && order.status == 12) {
										for (let l = 0; l < order.detail.length; l++) {
											// 0=尾款支付没开始
											if (order.detail[l].finalStartExpire == 0) {
												data[i].status = -2 //尾款未开始
											}
											// // 售定金到期状态presellstatus和预售尾款到期状态finalPaystatu，为1没到期，0为未开始或已到期
											else if (order.detail[l].finalPaystatus == 0) {
												// 没支付尾款过期了
												data[i].status = -3 //已取消
												break;
											}
										}
									} else if (nowTimestamp > create_date + (30 * 60 * 1000)) {
										data[i].status = -1 //已失效
										continue
									}
								}
							}
						} else if (data.length > 0 && status == 5) {
							for (let i = 0; i < data.length; i++) {
								var create_date = data[i].create_date;
								create_date = Date.parse(new Date(create_date.replace(/\-/g, '/')));
								var nowTimestamp = Date.parse(new Date());

								//规格列表处理
								var detail = data[i].detail
								for (let j = 0; j < detail.length; j++) {
									detailDataItem = null;
									detailDataItem = detail[j];
									if (nowTimestamp > create_date + ((24 * 60 * 60 * 1000) * detailDataItem.groupDay)) {
										data[i].status = -1 //团拼超时  失败
									}
								}
								data[i].detail = detail;
							}
						}

						console.log("订单数据集——")
						console.log(data)
						if (that.pIndex > 1) {
							if (data.length > 0) {
								data = that.orderList.concat(data);
								that.orderList = data
								that.touse = false;
							} else {
								that.loading = false
								that.touse = true;
								that.pIndex = that.pIndex - 1;
							}
							console.log('pIndex', that.pIndex)
							var cnt = res.data.cash.cnt;
							var innum = res.data.cash.innum;
							var outnum = res.data.cash.outnum;
							var salenum = res.data.cash.salenum;
							var prenum = res.data.cash.prenum;
							if (msjtIndex == 0) {
								that.zsnum = cnt;
								that.tsnum = '';
								that.wdnum = '';
								that.wmnum = '';
								that.ydnum = '';
							} else if (msjtIndex == 1) {
								that.zsnum = '';
								that.tsnum = innum;
								that.wdnum = '';
								that.wmnum = '';
								that.ydnum = '';
							} else if (msjtIndex == 2) {
								that.zsnum = '';
								that.tsnum = '';
								that.wdnum = outnum;
								that.wmnum = '';
								that.ydnum = '';
							} else if (msjtIndex == 3) {
								that.zsnum = '';
								that.tsnum = '';
								that.wdnum = '';
								that.wmnum = salenum;
								that.ydnum = '';
							} else if (msjtIndex == 4) {
								that.zsnum = '';
								that.tsnum = '';
								that.wdnum = '';
								that.wmnum = '';
								that.ydnum = prenum;
							}
							return;
						}
						var cnt = res.data.cash.cnt;
						var innum = res.data.cash.innum;
						var outnum = res.data.cash.outnum;
						var salenum = res.data.cash.salenum;
						var prenum = res.data.cash.prenum;
						that.orderList = data;
						if(tag == 2){
							that.loading = false
							that.touse = true;
							}
						if (msjtIndex == 0) {
							that.zsnum = cnt;
							that.tsnum = '';
							that.wdnum = '';
							that.wmnum = '';
							that.ydnum = '';
						} else if (msjtIndex == 1) {
							that.zsnum = '';
							that.tsnum = innum;
							that.wdnum = '';
							that.wmnum = '';
							that.ydnum = '';
						} else if (msjtIndex == 2) {
							that.zsnum = '';
							that.tsnum = '';
							that.wdnum = outnum;
							that.wmnum = '';
							that.ydnum = '';
						} else if (msjtIndex == 3) {
							that.zsnum = '';
							that.tsnum = '';
							that.wdnum = '';
							that.wmnum = salenum;
							that.ydnum = '';
						} else if (msjtIndex == 4) {
							that.zsnum = '';
							that.tsnum = '';
							that.wdnum = '';
							that.wmnum = '';
							that.ydnum = prenum;
						}
						console.log('处理完数据', data)
						if (that.orderList.length == 0) {
							this.$message({
								type: 'info',
								message: "查无数据"
							});
						}
					} else {
						this.$message({
							type: 'error',
							message: res.data.rspMsg
						});
					}
				})
			},
			//监听滚动条
			handleScroll() {
			let scrolled = this.$refs.gundong.scrollTop
			// console.log(scrolled)
			this.scroll=scrolled
		},
		},
		// 滚动条
		deactivated(){
            this.$refs.gundong.addEventListener('scroll', this.handleScroll)
        },
		destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
	};
</script>

<style scoped>
	.bossback {
		background: #244A77;
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mesItme {
		width: 96%;
		height: 96%;
		background: #ffffff;
		border-radius: 10px;
		position: relative;
	}

	.mesItem-Top {
		width: 100%;
		height: 64px;
		background: #e5ebf2;
		border-radius: 10px 10px 0px 0px;
		display: flex;
		align-items: center;
		position: relative;
		padding: 30px;
		box-sizing: border-box;
	}

	.mesItem-Top-f {
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: center;
		color: #2c2c2c;
		margin-left: 10px;
	}

	.mesItem-Topimg {
		width: 14px;
		height: 20px;
	}

	.Top-img {
		width: 22px;
		height: 22px;
	}

	.mesItem-Top-g {
		font-size: 24px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: center;
		color: #2c2c2c;
		margin-left: 15px;
	}

	.mesItem-Toptwo {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
	}

	.mesItem-Topone {
		width: 80px;
		height: 60px;
		display: flex;
		align-items: center;
	}

	.mesItem-Item {
		padding: 10px 30px;
		box-sizing: border-box;
	}

	/*头部样式*/
	.markdown {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
	}

	.gmk {
		width: 228px;
		height: 42px;
		background: #ffffff;
		border: 1px solid #cccccc;
		border-radius: 4px;
		font-size: 18px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		padding-left: 20px;
		box-sizing: border-box;
		margin-right: 30px;
	}

	.el-dropdown {
		margin-left: 30px;
	}

	.el-dropdown-link {
		width: 130px;
		height: 42px;
		background: #ffffff;
		border: 1px solid #cccccc;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
	}

	.fthu {
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: center;
		color: #666666;
		display: inline-block;
		margin-left: 20px;
		min-width: 120px;
	}

	.fthu a {
		color: #333;
		font-size: 24px;
	}

	.search {
		width: 104px;
		height: 40px;
		background: #3399cc;
		border-radius: 4px;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 20px;
		font-size: 18px;
	}

	.search img {
		width: 18px;
		height: 18px;
		margin-right: 10px;
	}

	/*立即送出选择样式*/
	.selCup {
		display: flex;
		align-items: flex-end;
		margin-bottom: 20px;
	}

	.selCup .selCup-chioce:nth-of-type(1) {
		margin-left: 0;
	}

	.selCup-chioce {
		width: 208px;
		height: 42px;
		font-size: 18px;
		background: #f8f8f8;
		border: 1px solid #999999;
		border-radius: 4px;
		color: #333333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		box-sizing: border-box;
		margin-left: 10px;
	}

	.selCup-chioce img {
		width: 30px;
		height: 30px;
		margin-right: 4px;
	}

	.selCup-select {
		height: 52px;
		background: #098ed0;
		color: #fff;
	}

	/*循环主题标题*/
	.ComeItemtitle {
		display: flex;
		align-items: center;
		font-size: 18px;
		color: #666666;
		text-align: center;
		padding: 0 22px;
		box-sizing: border-box;
		margin-bottom: 10px;
	}

	.ComeItemtitle div:nth-of-type(1) {
		width: 5%;
	}

	.ComeItemtitle div:nth-of-type(2) {
		width: 7%;
	}

	.ComeItemtitle div:nth-of-type(3) {
		text-align: left;
		width: 20%;
	}

	.ComeItemtitle div:nth-of-type(4) {
		width: 5%;
	}

	.ComeItemtitle div:nth-of-type(5) {
		width: 15%;
	}

	.ComeItemtitle div:nth-of-type(6) {
		width: 15%;
	}

	.ComeItemtitle div:nth-of-type(7) {
		width: 10%;
	}

	.ComeItemtitle div:nth-of-type(8) {
		width: 23%;
	}

	/* .ComeItemtitle div:nth-of-type(9) {
		width: 9%;
	} */

	/*循环主题内容*/
	/* .burdeningout {
		height: 430px;
		padding-bottom: 20px;
		box-sizing: border-box;
	} */
	.burdeningout{
		padding: 0px 30px;;
		padding-bottom: 20px;
		box-sizing: border-box;
		position: absolute;
		left: 0;
	}
	.burdeningout .bg-navy:nth-of-type(1) {
		margin-top: 0;
	}
	/*修改滚动条样式*/
	.burdeningout::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 2px;
	}
	.burdeningout::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.burdeningout::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	.bg-navy {
		background: #f3f6f7;
		border-radius: 10px;
		padding: 20px 22px;
		box-sizing: border-box;
		display: flex;
		margin-top: 10px;
	}

	.bg-navy-z {
		font-size: 18px;
		color: #2c2c2c;
		font-weight: 400;
		text-align: center;
		width: 5%;
	}

	.bg-navy-o {
		font-size: 18px;
		font-weight: 400;
		color: #2c2c2c;
		text-align: center;
		width: 7%;
	}

	.bg-navy-t {
		font-size: 18px;
		color: #2c2c2c;
		width: 25%;
		display: flex;
		flex-direction: column;
	}

	.bg-navy-t .bgitem:nth-of-type(1) {
		margin-top: 0;
	}

	.bgitem {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	.bar {
		color: #2c2c2c;
		width: 25%;
		text-align: center;
		font-size: 18px;
	}

	.bg-navy-s {
		color: #2c2c2c;
		width: 5%;
		text-align: center;
		font-size: 18px;
	}

	.bg-navy-f {
		width: 15%;
		text-align: center;
	}

	.bg-navy-w {
		width: 10%;
		text-align: center;
		font-size: 20px;
	}

	/* .bg-navy-x {
		width: 12%;
		text-align: center;
	} */

	.bg-navy-v {
		width: 18%;
		/* text-align: center;
		padding: 0 10px; */
		display: flex;
		flex-wrap: wrap;
		/* flex-direction: column; */
		box-sizing: border-box;
		margin-left: 70px;
		/* border: 1px solid red; */
	}

	.bg-navy-v button {
		width: 80px;
		height: 40px;
		border-radius: 4px;
		color: #fff;
		border: none;
		margin: 8px;
	}

	/* .bg-navy-v button:nth-of-type(2) {
		background: #58AED6;
		margin-top: 16px;
	} */

	.buttuo {
		width: 104px;
		height: 40px;
		border-radius: 4px;
		color: #fff;
		background: #58AED6;
		margin-top: 16px;
		border: none;
	}

	.butback {
		background: #309ACD;
	}

	.butgound {
		background: #58AED6;
	}

	.mkjh {
		color: #098ed0;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.list {
		width: 100%;
	}

	.jobuz {
		width: 100%;
		display: flex;
		height: 60px;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		font-family: cursive;
	}

	.potu {
		text-overflow: ellipsis;
		width: 250px;
		overflow: hidden;
		white-space: nowrap;
	}

	.potu2 {
		text-overflow: ellipsis;
		width: 250px;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.plyuwenhgt{
		position: relative;
	}
	.plyuwenhgr{
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    left: 0%;
    top: 0;
    background-color: transparent;
    z-index: 6;
	}
	.mhe{
		margin-left: 20px;
	}
</style>

<template>
	<div class="container">
		<div class="pagecontainer">
			<div class="mesItem-Top">
				<div class="mesItem-Topone" @click.stop="goBack()">
					<img class="mesItem-Topimg" :src="SMDataURL+'/images/al-fh.png'" />
					<a class="mesItem-Top-f">返回</a>
				</div>
				<div class="mesItem-Toptwo">
					<img class="Top-img" :src="SMDataURL+'/images/al-rq.png'" />
					<a class="mesItem-Top-g">订单详情</a>
				</div>
			</div>

			<div class="mibutlst">
				<div class="border-gray">
					<div class="gray-z">
						<div class="gray-o">
							<a>订单ID</a>
							<a>{{OredrList.id}}</a>
						</div>
						<div class="gray-o">
							<a>订单号</a>
							<a>{{OredrList.orderId}}</a>
						</div>
						<!-- <div class="gray-o">
							<a>支付方式</a>
							<a>{{OredrList.oug_trade_no != "cash" ? '微信':'现金' }}</a>
						</div> -->
						<div class="gray-o">
							<a>桌号</a>
							<a>
								<template v-if="OredrList.linkNo == 8">
									{{OredrList.addr}}
								</template></a>
						</div>
						
						<div class="gray-o">
							<a>号牌</a>
							<a>
								{{OredrList.sn}}
							</a>
						</div>
					</div>
					<div class="gray-z">
						<div class="gray-o">
							<a>应付金额</a>
							<a>{{OredrList.amount}}</a>
						</div>
						<div class="gray-o">
							<a>实付金额</a>
							<a>{{OredrList.payamount}}</a>
						</div>
						<div class="gray-o">
								<a>支付方</a>
								<a>{{OredrList.cashId!=''?'收银端':'手机'}}</a>
						</div>
					</div>
					<div class="gray-z">
						<div class="gray-o">
							<a>下单时间</a>
							<a>{{OredrList.create_date}}</a>
						</div>
						<div class="gray-o">
							<a>支付单号</a>
							<a>{{OredrList.oug_trade_no}}</a>
						</div>
						<div class="gray-o">
							<a>生成二维码</a>
							<el-button style="margin-left:20px;" v-if="!type" @click.stop="phryt()" type="primary">显示<i class="el-icon-upload el-icon--right"></i></el-button>
							<el-button style="margin-left:20px;" v-if="type" @click.stop="phrytclear()" type="primary">隐藏<i class="el-icon-upload el-icon--right"></i></el-button>
						</div>
					</div>
					<div class="gray-z">
						<div class="gray-o">
							<a>公司名称</a>
							<a>云客茶语</a>
						</div>
						<div class="gray-o">
							<a>公司ID</a>
							<a>{{OredrList.companyId}}</a>
						</div>
						<div class="gray-o">
							<a>退款</a>
							<el-button @click.stop="Arreppsyu()" type="primary">退款<i class="el-icon-upload el-icon--right"></i></el-button>
						</div>
					</div>
					<div class="gray-z">
						<div class="gray-o">
							<a>订单状态</a>
							<a v-if="OredrList.status==2">已完成</a>
							<a v-if="OredrList.status==1">已支付</a>
							<a v-if="OredrList.status==4">已退款</a>
						</div>
						<div class="gray-o">
							<a>下单用户</a>
							<a>{{OredrList.userId}}</a>
						</div>
						<div class="gray-o">
							<a>打印</a>
							<!-- <el-button @click.stop="PrintIamge()" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button> -->
							<el-button @click.stop="See()" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
						</div>
					</div>
				</div>
				<div class="bore"></div>
				<div class="ComeItemtitle">
					<div>图片</div>
					<div></div>
					<div>商品名称/规格</div>
					<div>价格</div>
					<div>数量</div>
					<div>支付时间</div>
					<div>取餐时间</div>
					<div>就餐方式</div>
					<div>备注</div>
				</div>
				<div class="burdeningout">
					<div class="bg-navy">
						<!-- <div class="bg-navy-z">
							<div v-for="(item,index) in synimage2" :key="index" @click.stop="downs(item)">
								<img alt class="el-groupimg"  v-if="item!=''" :src="item" />
								<div class="el-groupimg" v-if="item ==''"></div>
							</div>
						</div> -->
						<!-- <div class="bg-navy-o">
							<template v-if="OredrList.linkNo == 8">
								{{OredrList.addr}}
							</template>
						</div> -->
						<div class="bg-navy-t">
							<div class="bgitem" v-for="(item,index) in detail" :key="index">
									<div  class="br">
										<template v-if="item.synimage2">
										<img alt class="el-groupimg" @click.stop="downs(item.synimage2)" v-if="item.synimage2 != ''" :src="item.synimage2" />
										<div class="el-groupimg" v-if="item.synimage2 ==''"></div>
										</template>
									</div>
								<div class="bt">
									<div style="margin-bottom: 10px;">{{item.productName}}</div>
									<div style="color: #F26426;font-size:16px;">{{item.lblnames}}</div>
								</div>
								<div class="bar">{{item.amount}}</div>
								<div class="bar">{{item.number}}</div>
							</div>
						</div>
						<div class="bg-navy-f">
							{{OredrList.busty_date}}
						</div>
						<div class="bg-navy-f">
							<div style="margin-bottom: 10px;">{{OredrList.leve_date}}</div>
						</div>
						<div class="bg-navy-w">
							<template v-if="OredrList.linkNo == 8">
								<div :style="OredrList.way == 71?'color: #098ed0;font-weight: bold;margin-bottom: 10px;':'color: #ff6633;font-weight: bold;margin-bottom: 10px;'">{{OredrList.way == 71?"堂食":'外带'}}</div>
								<div style="color: #666666;">{{OredrList.deliveryflag == 0?"预订":''}}</div>
							</template>
							<template v-if="OredrList.linkNo == 9">
								<div style="color: #28B228;font-weight: bold;margin-bottom: 10px;">外卖</div>
								<div style="color: #666666;">{{OredrList.deliveryflag == 0?"预订":''}}</div>
							</template>
						</div>
						<div class="bg-navy-x">
							{{OredrList.remarks}}
						</div>
					</div>
				</div>
				<div class="bore"></div>
				<div class="RightItem" v-if="OredrList.linkNo == 9 && OredrList.name !=null">
					<div>订单位置信息:{{OredrList.addr}}</div>
					<div>{{OredrList.Name}}({{OredrList.Xing}}){{OredrList.tele}}</div>
				</div>
				<!--<div class="amap-page-container" style="height: 230px;">
				  <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
						  <el-amap-circle v-for="(circle,index) in circles" :key="index" :center="circle.center" icon='../assets/icon/1.png' :radius="circle.radius" :fill-opacity="circle.fillOpacity" :events="circle.events"></el-amap-circle>
				  </el-amap>
				</div> -->
			</div>
			<!-- <Card shadow v-if="PrintIamgetype"> -->
			<div v-if="PrintIamgetype" >
				<div class="windowBackgroud" @click="PrintIamge()"></div>
				<div class="iframeDiv">
					<iframe class="iframe"
					 marginwidth="0" :src="printurl" marginheight="0" width="100%" name="i" id="urlIframe" frameborder="0" scrolling="no">
					</iframe>
				</div>
				</div>
			<!-- </Card> -->
		</div>
	</div>
</template>


<script>
	//引入cookie
	import {setCookie,getCookie,removeCookie} from '@/utils/support.js';
	import axios from 'axios';
	import MD5JS from '../utils/md5.js';
	import {doGetData,backReimburse,geterUserWeima} from '../utils/axaj.js'
	export default {
		data() {
			return {
				OredrList: {},
				detail: [],
				SMDataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
				zoom: 16,
				center: [121.5273285, 31.21515044],
				circles: [{
					center: [121.5273285, 31.21515044],
					radius: 10,
					fillOpacity: 0.4,
					events: {
						click: (o) => {
							console.log(o);
							alert('click');
						}
					},
				}],
				synimage2:[],
				//显示图片上传页面
				PrintIamgetype:false,
				printurl: 'http://fw.evebot.cn/#/zh/select_ws?id=206737',
				
				//判断是否更新
				typew:false,
				//判断页面是否是显示二维码状态
				type:'',
				//倒计时
				typetime:0
			}
		},
		//离开前
		beforeRouteLeave(to, from, next) {
			var typew = this.typew;
			//需要刷新
			if (to.name == 'milte'&& typew) {
				to.meta.isBack = true;
			} 
			next();
		},
		async mounted() {
			var that = this
			//上页面赋值
			if(that.$route.query.item == {}){
				that.goBack()
				return
			}
			that.OredrList = that.$route.query.item
			if (that.OredrList.linkNo == 9 && that.OredrList.name != null) {
				that.OredrList.Name = that.OredrList.name.split(",")[0];
				that.OredrList.Xing = that.OredrList.name.split(",")[1];
			}
			var srvDevTest = that.$store.getters.sidebar.smurl,
			interfacePart = that.$store.getters.sidebar.interfacePart,
			smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
			var URL = srvDevTest + smallInterfacePart;
			var orderId = that.$route.query.orderId
			var timestamp = Date.parse(new Date());
			timestamp = timestamp / 1000;
			var KEY = that.$store.getters.sidebar.KEY
			var urlParam = "cls=product_order&action=QueryOrdersDetailNew&appId=1" + "&timestamp=" + timestamp;
			console.log('sign:', urlParam + "&key=" + KEY)
			var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
			urlParam = urlParam + "&orderId=" + orderId + "&sign=" + sign;
			console.log('查询订单详情:', URL + urlParam)
			axios.get(URL + urlParam).then(res => {
				console.log(res)
				if (res.data.rspCode == 0) {
					that.detail = res.data.data
				}
				that.synimage(that.OredrList.synimage)
			})
		},
		watch:{
			typetime(val, oldVal){
				var that = this;
				setTimeout(()=>{
					if(val>=1){
						that.typetime = that.typetime-1
					}else{
						that.type =false
					}
				},1000)
			},
		},
		methods: {
			//生成二维码
			phryt(){
				var that = this,OredrList = that.OredrList,orderId = OredrList.orderId;
				// if(that.poytimg == ''){
				// 	that.$message({
				// 		message:"该单没有可上传图片",
				// 		type:"error"
				// 	})
				// 	return
				// }
				geterUserWeima(that,orderId)
			},
			phrytclear(){
				var that = this,type = false;
				this.$confirm('请确认是否隐藏二维码')
				          .then(_ => {
							  removeCookie('ChangeDfrType');
							  that.type = type
							  that.$message({
							  	message:"隐藏成功",
							  	type:"success"
							  })
				          })
				          .catch(_ => {
							  	that.$message({
							  		message:"取消隐藏",
							  		type:"error"
							  	})
						  });
			},
			//生成二维码回调函数
			motepryu(url){
				var that = this,url= url,type = true;
				console.log(url)
				setCookie('ChangeDfrType',type,15);
				setCookie('MSJreurl',url,15);
				that.type = type
				that.typetime = 10
			},
			//退款
			Arreppsyu(){
			var that = this,OredrList = that.OredrList,orderId =OredrList.orderId,Trade = OredrList.oug_trade_no;
				//判断当前订单状态
				if(OredrList.status==4){
					that.$message({
						message:"此单已退款",
						type:"success"
					})
					return
				}
				//判断是否微信支付还是其它支付
				if(Trade == "现金" || Trade == "验券收款" || Trade == "商家收款"||Trade=="cash"){
					this.$confirm('请确认是否现金退款')
					          .then(_ => {
								  console.log("成功")
								    that.payCash(orderId)
					          })
					          .catch(_ => {
								  console.log("取消")
								  	that.$message({
								  		message:"取消退款",
								  		type:"error"
								  	})
							  });
					return
				}
				//判断是否微信是否后台修改无支付
				if(Trade == ""){
					that.$message({
						message:"该单未真正支付！",
						type:"error"
					})
					return
				}
				that.posyu()
			},
			//现金退款
			payCash(orderId){
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
				var otherParam = '&status=4'
				doGetData(this, smurl, signParam, otherParam, 0, "更新订单状态")
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
								that.$message({
									message:"退款成功",
									type:"success"
								})
								that.OredrList.status = 4;
								that.typew = true;
								break
						}
						break
					default:
						console.log(error)
						break
				}
			},
			//微信退款
			posyu(){
				var that = this,OredrList = that.OredrList,orderId =OredrList.orderId,appId=that.$store.getters.sidebar.appId,KEY=that.$store.getters.sidebar.KEY
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var urlParam = "cls=wxRefund_wxRefund&action=wxRefund&orderId="+ orderId + "&appId="+ appId + "&timestamp=" + timestamp;
				var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				var listItem = [{
					//订单号
					 orderId :orderId,
					//appId
					appId : appId,
					//时间戳
					timestamp :timestamp ,
					//0 传递wxAppId  1不传递wxAppId
					type : 1,
					//解析码
					sign :sign ,
				}];
				backReimburse(that,listItem,orderId)
			},
			//更改订单状态
			posyu2(){
				this.OredrList.status = 4;
				this.typew = true;
			},
			//打开页面
			See () {
			     // window.location.href ='http://fw.evebot.cn/#/zh/select_ws?id=206737'; //  跳转链接在当前界面
				 window.open("http://fw.evebot.cn/#/zh/select_ws?id=206737");  // 跳转链接在其它界面
			 },
			 //IE浏览器
			/**
			 * [getBlob 获取二进制流]
			 * @param  {[String]}     url     [url]
			 * @param  {[Blob]}               [文件二进制]
			 */
			getBlob(url) {
			    return new Promise(resolve => {
			        const xhr = new XMLHttpRequest();
			        xhr.open('GET', url, true);
			        xhr.responseType = 'blob';
			        xhr.onload = () => {
			            if (xhr.status === 200) {
			                resolve(xhr.response);
			            }
			        };
			        xhr.send();
			    });
			},
			//IE浏览器
			/**
			 * [saveAs 下载保存文件]
			 * @param  {[type]} fileUrl [文件地址]
			 */
			saveAs(fileUrl) {
			    if (window.navigator.msSaveOrOpenBlob) {
			        // 兼容IE11 发现在微软在ie10 和ie11中有两个特有的方法：window.navigator.msSaveBlob和window.navigator.msSaveOrOpenBlob 方法，
			        // 这两个方法的区别在于，前者只有保存，后者有保存和打开两个选项，按个人喜好使用就行
			        this.getBlob(fileUrl).then(blob => {
			            window.navigator.msSaveBlob(blob, 'pmh.png');
			        });
			    }
			},
			//判断浏览器类型
			myBrowser() {
			    var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
			    var isOpera = userAgent.indexOf('OPR') > -1
			    if (isOpera) { return 'Opera' } // 判断是否Opera浏览器 OPR/43.0.2442.991
			    // if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) { return 'IE' } // 判断是否IE浏览器
			    if (userAgent.indexOf('Firefox') > -1) { return 'FF' } // 判断是否Firefox浏览器Firefox/51.0
			    if (userAgent.indexOf('Trident') > -1) { return 'IE' } // 判断是否IE浏览器  Trident/7.0; rv:11.0
			    if (userAgent.indexOf('Edge') > -1) { return 'Edge' } // 判断是否Edge浏览器  Edge/14.14393
			    if (userAgent.indexOf('Chrome') > -1) { return 'Chrome' }// Chrome/56.0.2924.87
			    if (userAgent.indexOf('Safari') > -1) { return 'Safari' } // 判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
			},
			synimage(synimage){
				var that = this;
				var poytimg = synimage.split(",")
				that.poytimg =poytimg.toString()
				console.log("图片数组:",poytimg)
				console.log("图片数组:",this.poytimg)
				if(synimage){
					var detail = that.detail
					for (var i = 0; i < detail.length; i++) { 
						detail[i].synimage2 = poytimg[i]
					}
				}
			},
			goBack() {
				this.$router.go(-1);
			},
			queryOrderDetail: function() {

			},
			//显示页面
			PrintIamge(){
				this.PrintIamgetype = !this.PrintIamgetype
			},
			// downs(shoppic_url) {
			// var alink = document.createElement("a");
			// alink.href = shoppic_url;
			// alink.download = ""; //图片名
			// alink.click();
			// },
			downs(url) {
			      //下载链接图片
			      this.downloadIamge(url);
			      // //下载base64格式图片
			      // this.downloadFile("测试.png", this.baseUrl);
			},
			
			
			
			dataURLtoBlob(dataurl) {
			        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			        while(n--){
			          u8arr[n] = bstr.charCodeAt(n);
			        }
			        return new Blob([u8arr], {type:mime});
			      },
			
			//图片下载
			downloadIamge(imgsrc, name) {
				console.log('图片地址:'+imgsrc)
				  //下载图片地址和图片名
				  var that = this;
				  var image = new Image();
					// 判断ie浏览器
					if (that.myBrowser() === 'IE' || that.myBrowser() === 'Edge') {
						that.saveAs(imgsrc)
						return
					}
				  // 解决跨域 Canvas 污染问题
				  image.setAttribute("crossOrigin", "anonymous");
				  image.crossOrigin = "anonymous";
				  //支持所有跨域图片
				  // image.crossOrigin = "*";
				  image.onload = function() {
					var canvas = document.createElement("canvas");
					canvas.width = image.width;
					canvas.height = image.height;
					var context = canvas.getContext("2d");
					context.drawImage(image, 0, 0, image.width, image.height);
					var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
					
					//图片太大需要转换编译模式
					var strDataURI = url.substr(22, url.length);
					var blob = that.dataURLtoBlob(url);
					var objurl = URL.createObjectURL(blob);
					
					
					var a = document.createElement("a"); // 生成一个a元素
					var event = new MouseEvent("click"); // 创建一个单击事件
					a.download = name || "photo"; // 设置图片名称
					a.href = objurl; // 将生成的URL设置为a.href属性
					a.dispatchEvent(event); // 触发a的单击事件
				  };
				  image.src = imgsrc + "?timeStamp=" + Date.parse(new Date());
				},
		},
		
	};
</script>

<style scoped>
	.container {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		right: 0;
		background: #1F4878;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pagecontainer {
		width: 96%;
		height: 96%;
		background: #ffffff;
		border-radius: 10px;
		overflow-y: auto;
	}
	.pagecontainer::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 2px;
	}
	.pagecontainer::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background: rgba(0,0,0,0.2);
	}
	.pagecontainer::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    border-radius: 0;
	    background: rgba(0,0,0,0.1);
	}
	/*头部*/
	.mesItem-Top {
		width: 96%;
		background: #e5ebf2;
		height: 64px;
		border-radius: 10px 10px 0px 0px;
		display: flex;
		align-items: center;
		position: absolute;
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

	/*主题内容*/
	.mibutlst {
		padding: 30px;
		box-sizing: border-box;
		    padding-top: 64px;
	}

	.bore {
		height: 1px;
		background: #cccccc;
	}

	.border-gray {
		display: flex;
		padding: 10px 0;
	}

	.border-gray .gray-z:nth-of-type(1) {
		width: 20%;
	}

	.border-gray .gray-z:nth-of-type(2) {
		width: 12%;
	}

	.border-gray .gray-z:nth-of-type(3) {
		width: 34%;
	}

	.border-gray .gray-z:nth-of-type(4) {
		width: 16%;
	}

	.border-gray .gray-z:nth-of-type(5) {
		width: 18%;
	}

	.gray-z {}

	.gray-z .gray-o:nth-of-type(2) {
		margin-top: 10px;
	}

	.gray-z .gray-o:nth-of-type(3) {
		margin-top: 10px;
	}
	.gray-z .gray-o:nth-of-type(4) {
		margin-top: 10px;
	}
	.gray-o {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gray-o a:nth-of-type(1) {
		font-size: 18px;
		color: #165eb6;
		width: 80px;
		display: inline-block;
	}

	.gray-o a:nth-of-type(2) {
		font-size: 20px;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		margin: 10px 0;
	}

	.ComeItemtitle div:nth-of-type(1) {
		width: 10%;
	}

	.ComeItemtitle div:nth-of-type(2) {
		width: 0%;
	}

	.ComeItemtitle div:nth-of-type(3) {
		text-align: center;
		width: 20%;
	}

	.ComeItemtitle div:nth-of-type(4) {
		width: 5%;
	}

	.ComeItemtitle div:nth-of-type(5) {
		width: 5%;
	}

	.ComeItemtitle div:nth-of-type(6) {
		width: 15%;
	}

	.ComeItemtitle div:nth-of-type(7) {
		width: 15%;
	}

	.ComeItemtitle div:nth-of-type(8) {
		width: 10%;
	}

	.ComeItemtitle div:nth-of-type(9) {
		width: 20%;
	}

	/*循环主题内容*/
	.burdeningout .bg-navy:nth-of-type(1) {
		margin-top: 0;
	}

	.bg-navy {
		border-radius: 10px;
		padding: 10px 22px;
		box-sizing: border-box;
		display: flex;
		margin-top: 10px;
	}

	.bg-navy-z{
		font-size: 18px;
		color: #2c2c2c;
		font-weight: 400;
		width: 0%;
		text-align: center;
	}

	.bg-navy-o {
		font-size: 18px;
		font-weight: 400;
		color: #2c2c2c;
		text-align: center;
		width: 5%;
	}

	.bg-navy-t {
		font-size: 18px;
		color: #2c2c2c;
		width: 40%;
		display: flex;
		flex-direction: column;
	}

	.bg-navy-t .bgitem:nth-of-type(1) {
		margin-top: 0;
	}

	.bt {
		width: 40%;
	}
	.br{
		width: 36%;
	}
	.br	.el-groupimg:nth-of-type(1){
		margin-top: 0px;
	}
	.br	.el-groupimg{
		width: 70px;
		height: 70px;
		margin-top: 10px;
	}
	.bgitem {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		border: #ccc 1px solid;
		padding: 0px 10px;
		padding-top: 6px;
		border-radius: 4px;
	}

	.bar {
		color: #2c2c2c;
		width: 12%;
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

	.bg-navy-x {
		width: 20%;
		text-align: center;
	}

	.RightItem {
		margin: 14px 0;
		font-size: 18px;
		color: #333333;
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
	.iframeDiv{
		position: fixed;
		left: 50%;
		bottom: 50%;
		z-index: 25;
		transform: translateX(-50%) translateY(50%);
    width: 70%;
    height: 80%;
	}
	.iframe{
		width: 100%;
		height: 100%;
	}
</style>

<template>
	<div class="bossback" id="milte">
		<div class="mesItme"  ref="element">
			<div class="mesItem-Top"  ref="element1">
				<div class="mesItem-Topone link" @click.stop="goBack()">
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
					<input class="gmk" placeholder="桌号" onkeyup="this.value=this.value.replace(/[^\w_]/g,'');" v-model="textValue">
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
							<el-dropdown-item command="已处理">已处理</el-dropdown-item>
							<el-dropdown-item command="未处理">未处理</el-dropdown-item>
						</el-dropdown-menu>
						<!-- <el-dropdown-menu slot="dropdown" v-if="!xialatype">
						</el-dropdown-menu> -->
					</el-dropdown>
					</div>
					<div class="plyuwenhgt">
					<div v-if="!xialatype" @click="xipotypa()" class="plyuwenhgr"></div>
					<el-dropdown :hide-on-click="true" class="dropd" style="font-size: 18px;" @command="onChangetitle">
						<div class="el-dropdown-link ">
							{{moldTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="item.mainType" v-for="(item,index) in normalQuestionList" :key="index">{{item.mainType}}</el-dropdown-item>
							<el-dropdown-item command="其他问题">其他问题</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					</div>
					<div class="fthu">共<a>{{ArrayList.length}}</a>条</div>
					<div class="search link" @click.stop="Check()"><img :src="SMDataURL+'/images/al-cx.png'" />搜索</div>
				</div>
				<div class="ComeItemtitle">
					<div>桌号</div>
					<div>设备问题</div>
					<div>具体事件</div>
					<div>用户id</div>
					<div>手机号</div>
					<div>呼叫时间</div>
					<div>处理时间</div>
					<div>操作</div>
				</div>
				<!--时间搜索界面-->
				<div class="burdeningout infinite-list-wrapper" :style="'overflow:auto;height:'+itemHeight+'px;width:'+itemWind+'px;'">
					<ul class="list" v-infinite-scroll="load" infinite-scroll-delay="500" :infinite-scroll-disabled="disabled">
						<li class="list-item bg-navy" v-for="(item,index) in ArrayList" :key="index">
							<div class="bg-navy-z">{{item.place}}号位
							</div>
							<div class="bg-navy-o">
								{{item.title}}
							</div>
							<div class="bg-navy-t">
								{{item.reason}}
							</div>
							<div class="bg-navy-s">
								{{item.userId}}
							</div>
							<div class="bg-navy-f">
								{{item.mobile}}
							</div>
							<div class="bg-navy-w">
								{{item.create_date}}
							</div>
							<div class="bg-navy-x">
								<div>{{item.update_date}}</div>
							</div>
							<div class="bg-navy-v">
								<!--修改信息状态-->
								<button v-if="item.status == 0" class="butback link" @click.stop="updateOrderStatus(item.id,1,index)" >处理</button>
								<button v-if="item.status == 1" class="butback" >已处理</button>
							</div>
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
	import MD5JS from '../../utils/md5.js';
	import Utils from '../../utils/util.js';
	export default {
		data() {
			return {
				//下拉的div高度
				itemHeight:'',
				//下拉的div宽度
				itemWind:'',
				//下拉框隐藏
				xialatype:false,
				//图片地址
				SMDataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
				//搜索内容
				textValue:'',
				//时间
				value1:"",
				// value2:'',
				//开始时间
				startime:'',
				//结束时间
				endtime:'',
				//分页
				pIndex:1,
				//列表数组
				ArrayList:[],
				//现在的状态
				status:'全部',
				//现在的字符
				statusIndex:'',
				//判断是否能重新下拉
				touse: false,				
				//下拉刷新
				loading : false,
				//设备问题
				normalQuestionList:[],
				//title当前名字
				moldTitle:'全部'
			}
		},
		mounted() {
			setTimeout(()=>{
				this.onchanstatus("未处理")
			},100)
			this.nbfHeight()
			this.getNormalQuestion()
		},
		watch: {},
		computed: {
			//是否下拉刷新
			disabled() {
				return this.loading || this.touse
			},
		},
		methods: {
			//方法：查询常规问题
			getNormalQuestion: function (){
				  var that = this;
				  var timestamp = Date.parse(new Date());
				  timestamp = timestamp / 1000;
				  var appid = that.$store.getters.sidebar.appId;
				  var srvDevTest = that.$store.getters.sidebar.smurl,
				  interfacePart = that.$store.getters.sidebar.interfacePart,
				  smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				  var smurl = srvDevTest + smallInterfacePart;
				  var KEY = that.$store.getters.sidebar.KEY
				  var CompanyId = that.$store.getters.sidebar.CompanyId
				  let signParam = 'cls=product_custservice&action=QueryService&appId='+appid+'&timestamp='+timestamp+'&userId='
				  var sign = MD5JS.hexMD5(signParam + "&key=" + KEY);
				  signParam = signParam +'&sign='+sign + "&mold=4&companyId="+CompanyId
				  console.log('查询订单详情:', smurl + signParam)
				  axios.get(smurl + signParam).then(res => {
					  console.log(res.data)
					  if (res.data.rspCode == 0) {
						 let normalQuestionList=[];
						   if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
							 let data = res.data.data, dataItem = null, listItem = null;
							 let mainId=0,detailId=0, mainType="",questionList=[],questionListStr="",tempArray=null;
							 for(let i=0;i<data.length;i++){
							   dataItem = null; listItem = null;dataItem=data[i];
							   mainType="";questionList=[];questionListStr="";tempArray=null;
							   if (Utils.isDBNotNull(dataItem.title)){
								 mainType = dataItem.title;
							   }
							   if (Utils.isDBNotNull(dataItem.reason)){
								 questionListStr = dataItem.reason;
							   }
							   if(Utils.myTrim(questionListStr) != ""){
								 tempArray=questionListStr.split("|");
								 if(Utils.isNotNull(tempArray) && tempArray.length>0){
								   for(let j=0;j<tempArray.length;j++){
									 detailId++;
									 questionList.push({id:detailId,content:tempArray[j],checked:false});
								   }
								 }
							   }
							   if(questionList.length>0){
								 mainId++;
								 normalQuestionList.push({id:mainId,mainType:mainType,questionList:questionList})
							   }
							 }
						   }
						   if(normalQuestionList.length>0){
							 that.normalQuestionList = normalQuestionList
						   }
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
			//返回上一页
			goBack(){
				this.$router.go(-1);
			},
			//搜索
			Check(){
				var that =this;
				//设置默认页数为一
				that.pIndex = 1;
				//设置重新下拉
				that.touse = false;
				this.queryOrderDetail()
				that.textValue = ''
			},
			//更改订单状态
			updateOrderStatus(id,status,index) {
				var that = this;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var appid = that.$store.getters.sidebar.appId;
				var srvDevTest = that.$store.getters.sidebar.smurl,
				interfacePart = that.$store.getters.sidebar.interfacePart,
				smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
				var smurl = srvDevTest + smallInterfacePart;
				var KEY = that.$store.getters.sidebar.KEY
				let signParam = 'cls=product_custservice&action=SaveService&appId='+appid+'&timestamp='+timestamp+'&userId='
				var sign = MD5JS.hexMD5(signParam + "&key=" + KEY);
				signParam = signParam + "&sign=" + sign 
				var itemList = [{
						"id":id,
						"status": status,
					}];
				var data = JSON.stringify(itemList);
				var params = new URLSearchParams();
				params.append('data',data)
				console.log(smurl+signParam)
				axios.post(smurl+signParam,params).then(res=>{
					console.log(res.data)
				   if (res.data.rspCode == 0) {
					 that.ArrayList[index].status = status
					 that.$message({
					 	type: 'success',
					 	message: "修改状态成功"
					 });
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
			//下拉刷新
			load() {
				var that = this;
				that.loading = true;
				setTimeout(() => {
					that.pIndex = that.pIndex + 1
					that.queryOrderDetail()
					that.loading = false
				}, 2000)
			},
			//搜索title
			onChangetitle(e){
				var that =this;
				//设置当前状态显示的中文
				that.moldTitle = e;
				//设置默认页数为一
				that.pIndex = 1;
				//设置重新下拉
				that.touse = false;
				//设置时间清空
				that.value1 = "";
				//设置下拉隐藏
				that.xialatype =false;
				//重新获取数据
				that.queryOrderDetail()
			},
			//搜索支付状态
			onchanstatus(e) {
				var that =this;
				var data;
				switch (e) {
					case '全部':
						data = '';
						break
					case '已处理':
						data = 1;
						break
					case '未处理':
						data = 0;
						break
					default:
						console.log(error)
						break
				}
				//设置当前状态显示的中文
				that.status = e;
				//设置当前状态字符
				that.statusIndex = data;
				//设置默认页数为一
				that.pIndex = 1;
				//设置重新下拉
				that.touse = false;
				//设置时间清空
				that.value1 = "";
				//设置下拉隐藏
				that.xialatype =false;
				//重新获取数据
				that.queryOrderDetail()
			},
			//时间搜索方法
			ondata() {
				var that = this;
				if (that.value1 == "" || that.value2 == "") {
					return
				} else {
					if (that.value2 != "" && that.value1 == that.value2) {
						return
					}
					that.value2 = that.value1
				}
				var d = new Date(that.value1[0]);
				d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				var c = new Date(that.value1[1]);
				c = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' ' + c.getHours() + ':' + c.getMinutes() +
					':' + c.getSeconds();
				var c = new Date(c).getTime();
				c += 86400000
				var c = new Date(c);
				c = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() ;
				//赋值开始时间,结束时间
				that.startime = d;
				that.endtime = c;
				setTimeout(()=>{
					that.pIndex = 1;
					that.queryOrderDetail()
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
			//隐藏弹窗
			xipotypa(){
				this.xialatype =true;
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
				//分页
				var pIndex = that.pIndex
				//状态mold(类型0:退货1投诉,2留言3呼叫)
				var mold = 3
				//每頁獲取的数量
				var pSize = 20
				var urlParam = 'cls=product_custservice&action=QueryService&appId='+ appId +'&timestamp='+ timestamp +'&userId='
				console.log('sign:', urlParam + "&key=" + KEY)
				var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
				//判断时间是否存在
				if(that.value1 != ''){
					var startime = that.startime
					var endtime = that.endtime
					urlParam = urlParam + "&startDate=" + startime + " 00:00:00&endDate=" + endtime+" 00:00:00"
				}
				//判断是否有title内容
				console.log(encodeURIComponent(that.moldTitle))
				if(that.moldTitle != '全部' ){
					urlParam = urlParam + "&title="+encodeURIComponent(that.moldTitle)
				}
				//判断是否有搜索内容
				if(that.textValue != '' ){
					urlParam = urlParam + "&place="+that.textValue
				}
				//判断是否需要获取状态
				if(that.statusIndex != '' || that.statusIndex == 0 ){
					var statusIndex = that.statusIndex
					urlParam = urlParam + "&status="+statusIndex
				}
				urlParam = urlParam + "&sign=" + sign + "&pIndex=" + pIndex+'&mold='+ mold + '&pSize='+ pSize +
						"&sOrder=desc"
				console.log('域名:', smallInterfacePart)
				console.log('查询订单详情:', URL + urlParam)
				axios.get(URL + urlParam).then(res => {
					console.log(res.data)
					if(res.data.rspCode==0){
						var data = res.data.data
						console.log(data)
						if (that.pIndex > 1) {
							if (data.length > 0) {
								data = that.ArrayList.concat(data);
								that.ArrayList = data
								that.touse = false;
							} else {
								that.loading = false
								that.touse = true;
								that.pIndex = that.pIndex - 1;
							}
							console.log('pIndex页数:', that.pIndex)
							return;
						}
						if (data.length == 0) {
							that.$message({
								type: 'info',
								message: "查无数据"
							});
						}
						that.ArrayList = data;
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
			}
		}
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
		margin-left: 30px;
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
		margin-left: 30px;
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
		width: 14%;
	}

	.ComeItemtitle div:nth-of-type(3) {
		text-align: left;
		width: 20%;
	}

	.ComeItemtitle div:nth-of-type(4) {
		width: 5%;
	}

	.ComeItemtitle div:nth-of-type(5) {
		width: 14%;
	}

	.ComeItemtitle div:nth-of-type(6) {
		width: 16%;
	}

	.ComeItemtitle div:nth-of-type(7) {
		width: 16%;
	}

	.ComeItemtitle div:nth-of-type(8) {
		width: 10%;
	}

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
		width: 14%;
	}

	.bg-navy-t {
		font-size: 18px;
		color: #2c2c2c;
		width: 20%;
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
		width: 14%;
		text-align: center;
	}

	.bg-navy-w {
		width: 16%;
		text-align: center;
		color: #666666;
	}

	.bg-navy-x {
		width: 16%;
		text-align: center;
		color: #666666;
	}

	.bg-navy-v {
		width: 10%;
		text-align: center;
		padding: 0 10px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.bg-navy-v button {
		width: 104px;
		height: 40px;
		border-radius: 4px;
		color: #fff;
		border: none;
	}

	.bg-navy-v button:nth-of-type(2) {
		background: #58AED6;
		margin-top: 16px;
	}

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
</style>

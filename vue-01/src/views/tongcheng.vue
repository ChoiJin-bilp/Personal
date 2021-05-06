<template>
	<div>
		<!-- <div id="print" v-for="(item,index) in 2" > -->
<!-- 		<div id="print"  class="pliy">
			<template  v-for="(item,index) in 2">
				<p class="top-sopNum poltu" >A0003</p>
				<p class="top-sopNum2 poltu2">草莓奶昔</p>
				<p class="top-sopNum2">牛奶/小杯/正常</p>
				<p class="top-sopNum2">2021-01-14 15:31:20 ￥0.12</p>
				<p class="top-sopNum2 poltu3">(越快喝完越好喝)</p>
			</template>

		</div> 
		<el-button  type="primary" v-print="printObj">打印标签</el-button>
		<aplayer ref="player" :music="videoUpload.music"></aplayer> -->
		<Card shadow v-if="false">
		    <div style="min-height: 500px;width: 100%;">
		        <iframe 
					id="iframeId" :src="url" frameborder="0" class="pc iframe"  scrolling="auto">
				</iframe>
		    </div>
		</Card>
	</div>
	


</template>

<script>
	import Utils from '../utils/util.js';
	import aplayer from 'vue-aplayer'
	export default {
		components: {
		      aplayer
		    },
	    data() {
	        return {
	            printObj: {
	              id: "print",  //打印标签的id
	              popTitle: 'Document',  //文件标题
	              // extraCss: 'https://www.google.com,https://www.google.com',
	              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
	            },
				 videoUpload: {
				                    progress: false,
				                    progressPercent: 0,
				                    successPercent: 0,
				                    music: {
				                       title: '你好',
				                       author: '林俊杰',
				                       // url: '../music/ykOrder.mp3',
				                       url: 'https://bjy.51yunkeyi.com/baojiayou/media/ykOrder.mp3',
				                       lrc: ''
				                   }
				                },
								url: 'http://www.baidu.com/',
								//获取时间的值
								NowTime: "",
								//结束时间
								NowTime2:''
	        };
	    },
// async mounted () { 
//   // 异步加载，先加载出player再使用 
//   var aplayer = this.$refs.player;
// 	aplayer.play();
//  }, 
 mounted(){
	 this.GetTime()
 },
 computed:{
	 //现在时间时分
	 // Minute: function() {
	 // 	var that = this;
	 // 	var Minute = this.NowTime.split(' ');
	 // 	setTimeout(() => {
	 // 		if (that) {
	 // 			that.GetTime();
	 // 		}
	 // 	}, 1000);
	 // 	return Minute[1]
	 // },
	 // //现在时间时分
	 // HourTime: function() {
	 // 	var Time = this.NowTime.split(' ')
	 // 	return Time[0]
	 // },
 },
		 methods: {
		            printContext () {
		                this.$print(this.$refs.print)
		            },
		            // 不打印方法1. 添加no-print样式类
		            // 不打印方法2. this.$print(this.$refs.print,{'no-print':'.do-not-print-div'})
				GetTime() {
					this.NowTime = Utils.getDateTimeStr(new Date(), "-", 1)
					this.NowTime2 = Utils.getDateTimeStr(new Date(), "-", 1,1)
					console.log(this.NowTime);
					console.log(this.NowTime2);
				},
		        }
	  }
</script>

<style scoped>
	.pliy{
		position: relative;
		width: 220px;
	}
	.top-sopNum{
		text-align: center;
	}
	.top-sopNum2{
		text-align: left;
		font-size: 15px;
	}
	.poltu{
		color: #333;
		font-weight: bold;
		font-size: 22px;
	}
	.poltu2{
		color: #333;
		font-size: 22px;
	}
	.poltu3{
		font-weight: bold;
		font-size: 20px;
/* 		position: absolute;
		bottom: 20px;
		left: 6%; */
		}
	iframe{
		position: fixed;
		width: 520px;
		height: 400px;
		}
</style>











<!-- <template> 
 <div> 
  <div style="padding:10px 0;"> 
   <a-player :music="songList" :showlrc="3" :narrow="false" theme="#b7daff" mode="circulation" v-if="flag" listmaxheight='96px' ref="player"></a-player> 
  </div> 
   
 </div> 
</template> 
 
<script> 
import axios from 'axios' 
import VueAplayer from 'vue-aplayer' 
 
export default { 
 components: { 
  //别忘了引入组件 
  'a-player': VueAplayer 
 }, 
 data () { 
  return { 
   flag:false, 
   musicList:'', 
   songList:[] 
  } 
 }, 
 async mounted () { 
  //异步加载，先加载出player再使用 
  await this.init(); 
  let aplayer = this.$refs.player.control; 
  aplayer.play(); 
 }, 
 methods:{ 
  async init () { 
   //这边是引入了axios然后使用的get请求的一个音乐列表接口 
   const getMusicList = url => axios.get(url); 
   //这边url随大家更改了 
   let url = ''; 
   let data = await getMusicList(url); 
   //以下就是这边对请求的一个处理，看接口了 
   if(data && data.data.showapi_res_code==0){ 
    this.musicList = data.data.showapi_res_body.pagebean.songlist; 
     
    for(let i=0;i<=this.musicList.length;i++){ 
     if(i<=9){ 
      let obj={}; 
      //url=>歌曲地址 title=>头部 author=>歌手 pic=>写真图片 lrc=>歌词 
      //其中url必须有，其他的都是非必须 
      obj.title = this.musicList[i].songname; 
      obj.author = this.musicList[i].singername; 
      obj.url = this.musicList[i].url; 
      obj.pic = this.musicList[i].albumpic_small; 
      obj.lrc = this.musicList[i].irl; 
      //把数据一个个push到songList数组中，在a-player标签中使用 :music="songList" 就OK了 
      this.songList.push(obj); 
     } 
    } 
    //因为是异步请求，所以一开始播放器中是没有歌曲的，所有给了个v-if不然会插件默认会先生成播放器，导致报错(这个很重要) 
    this.flag = true; 
   }; 
  } 
 } 
} 
</script> 
 
<style scoped> 
</style> -->
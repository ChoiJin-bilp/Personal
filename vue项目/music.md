vue-aplayer 用法

###1.在main.js引入 npm install vue-aplayer --save
```
// 语音插件
import vueAplayer from 'vue-aplayer'
Vue.use(vueAplayer)
```
###2.在使用页面script引入 
```
import aplayer from 'vue-aplayer'

	export default {
		//引入组件***********************
		components: {
		      aplayer
		    },
			data() {
			    return {
					videoUpload: {
							   progress: false,
							   progressPercent: 0,
							   successPercent: 0,
							   music: {
								  title: '你好',
								  author: '林俊杰',
								  url: 'https://bjy.51yunkeyi.com/baojiayou/media/ykOrder.mp3',
								  lrc: ''
							  }
					},
				}
			},
			async mounted () {
			  // 异步加载，先加载出player再使用
			  var aplayer = this.$refs.player;
				//调用播放器触发播放方法
				aplayer.play();
			},
		}
```
###3.在使用页面template引入 
```
<aplayer ref="player" :music="videoUpload.music"></aplayer>
```
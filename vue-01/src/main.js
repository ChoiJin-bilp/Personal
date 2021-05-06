//js的入口文件
//引入 vue的包
import Vue from 'vue'
//引入App页面
import App from './App.vue'
//引入 router 包
import router from './router'
//环境配置 ，默认 开发环境
import store from './store'
//引入 v-charts
// import VCharts from 'v-charts';

//引入element ui样式库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
//element插件需要使用
Vue.use(ElementUI);
Vue.config.productionTip = false;

//使用VCharts插件
// Vue.use(VCharts);

// 语音插件
import vueAplayer from 'vue-aplayer'
Vue.use(vueAplayer)


// 打印插件
import Print from "vue-print-nb"
Vue.use(Print);

//引入AMapJS 高德地图
import AMap from 'vue-amap';
// 初始化vue-amap
Vue.use(AMap);
AMap.initAMapApiLoader({
	key: '206d31363907e0d75e775f4282652c26',
	//plugin  所用到的插件
	plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar',
		'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictSearch', 'AMap.Geocoder'
	],
})

  //引入公共
  import globalVariable from '@/utils/globalVariable'
  Vue.prototype.GLOBAL = globalVariable

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

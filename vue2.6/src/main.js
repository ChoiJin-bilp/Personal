import Vue from 'vue';
import Element from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles';
// import './mock'
import UseDate from './utils/usedate';
//引入 v-charts
import VCharts from 'v-charts';
//使用VCharts插件
Vue.use(VCharts);
import echarts from 'echarts'

//引入小图标
import '@/fonts/iconfont.css';

Vue.use(Element, { size: 'mini' });
Vue.prototype.$date = UseDate;
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts 


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

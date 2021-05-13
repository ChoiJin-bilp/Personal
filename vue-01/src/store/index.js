import Vue from 'vue'
import Vuex from 'vuex'
//引入 左侧菜单的模块
import app from './modules/app.js';
// //引入登陆的模块
// import user from './modules/user.js';
//将 getters引入 
import getters from './getters'; 

//配置 vuex的日志插件
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {//状态
    websk:'ws://192.168.1.23:80/websocket'
  },
  mutations: {//使用 mutation ，修改状态值， 做同步操作
  },
  actions: {//使用 commit 将状态值提交到 mutation   动作，做异步操作，大数据量的处理逻辑
  },
  getters,
  modules: {//模块
	app
  }
})


/*
vuex:统一状态管理器，将公共的状态做统一管理的
vuex流程：在组件中dispatch 发送动作到 action，在action 中 commit 提交到mutation，在mutation中修改store
中的state的值，当这个值发生变化时，会自动触发渲染函数重新渲染页面
action 和mutation的区别：action 做异步操作和大量的逻辑
						mutation 同步操作，更改状态值
vuex什么时候使用 :
	一般比较大型的，比较复杂的项目使用，或者多组件间传参，多个组件共用一种状态，使用 websocket的数据的					
vuex的辅助函数：
	mapState      computed
	mapGetters    computed
	mapMutations  methods
	mapActions    methods
vuex 和缓存的区别：
	vuex 刷新时数据会重置，缓存不会重置
	vuex 状态发生变化，会自动触发渲染，缓存如果发生变化需要手动去调用
*/
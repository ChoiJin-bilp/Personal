//引入 vue包
import Vue from 'vue'
//引入路由
import VueRouter from 'vue-router'
//引入 首页的页面
import Home from '../views/Mymain.vue'
// import Home from '../views/callBack/callBack.vue'
// import Home from '../views/Exhibition/Exhibition.vue'
//使用路由插件
Vue.use(VueRouter)

//定义路由表
const routes = [{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	// {
	//   path: '/',
	//   name: 'Home',
	//   component: Home
	// },
	{
		path: '/find',
		name: 'find',
		component: () => import( /* webpackChunkName: "find" */ '../views/Myfind.vue'),
		children: [{
				path: "tuijian",
				name: "tuijian",
				component: () => import( /* webpackChunkName: "tuijian" */ '../views/tuijian.vue')
			},
			{
				path: "guanzhu",
				name: "guanzhu",
				component: () => import( /* webpackChunkName: "guanzhu" */ '../views/guanzhu.vue')
			},
			{
				path: "tongcheng",
				name: "tongcheng",
				component: () => import( /* webpackChunkName: "tongcheng" */ '../views/tongcheng.vue')
			},
		],
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/Milte',
		name: 'milte',
		component: () => import( /* webpackChunkName: "message" */ '../views/milte.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/Exhibition',
		name: 'exhibition',
		component: () => import( /* webpackChunkName: "message" */ '../views/Exhibition/Exhibition.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/Callback',
		name: 'callback',
		component: () => import( /* webpackChunkName: "message" */ '../views/callBack/callBack.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/Orderdetail',
		name: 'Orderdetail',
		component: () => import( /* webpackChunkName: "message" */ '../views/Orderdetail.vue'),
		meta: {
			keepAlive: false,
			isBack: false
		}
	},
	{
		path: '/Itemlist',
		name: 'Firstlist',
		component: () => import( /* webpackChunkName: "message" */ '../views/Firstlist.vue'),
		meta: {
			keepAlive: true, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/message',
		name: 'message',
		component: () => import( /* webpackChunkName: "message" */ '../views/Mymessage.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/me',
		name: 'me',
		component: () => import( /* webpackChunkName: "me" */ '../views/Myme.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/amited',
		name: 'amited',
		component: () => import( /* webpackChunkName: "amited" */ '../views/amited.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	},
	{
		path: '/item/:pro_id',
		name: 'item',
		component: () => import( /* webpackChunkName: "item" */ '../views/Myitem.vue'),
		meta: {
			keepAlive: false, // 不需要缓存
			isBack: false
		}
	}
]

//创建路由对象
const router = new VueRouter({
	mode: 'hash', //设置路由的模式 history 
	base: process.env.BASE_URL, //环境设置 ，默认的环境设置是 开发环境
	routes //注册路由
})

//输出路由表
export default router

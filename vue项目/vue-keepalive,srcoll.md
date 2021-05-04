################################################

vue keep-alive 用法
###1.在App.vue 在路由显示界面判断是否缓存
```
		    <keep-alive>
		      <router-view v-if="$route.meta.keepAlive"></router-view>
		    </keep-alive>
		    <!-- 不可以被缓存的视图组件 -->
		         <router-view v-if="!$route.meta.keepAlive"></router-view>
```
###2.在路由页面修改页面默认的meta的值
```
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
		path: '/Orderdetail',
		name: 'Orderdetail',
		component: () => import( /* webpackChunkName: "message" */ '../views/Orderdetail.vue'),
		meta: {
			keepAlive: false,
			isBack: false
		}
	},
```


###3.在列表页面修改页面的keepAlive值
```
		//离开路由页面执行
		beforeRouteLeave(to,from,next){
			console.log(to,from)
			if(to.name == 'Firstlist'){
				console.log("出来了!")
			    from.meta.isBack = false;
			    from.meta.keepAlive = false;
			}else if(to.name == 'Orderdetail'){
				from.meta.isBack = true;
				from.meta.keepAlive = true;
			}
			next();
		},
```

##2.sroll vue 缓存
```
//使用方法：
 
    1. 安装vue-keep-scroll-position：
        
        npm i -S vue-keep-scroll-position
    
    2. main.js中引入
 
        import VueKeepScrollPosition from 'vue-keep-scroll-position'
 
        Vue.use(VueKeepScrollPosition)
 
    3. app.vue使用
 
        <router-view v-keep-scroll-position></router-view>
```
##1.cnpm install vue-amap --save 在文件根目錄下面
##1.在main.js文件下面
```
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
```
##2.在public/index.html文件根目錄下面
````
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>./favicon.ico">
    <title>云客茶语</title>
+-	<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=206d31363907e0d75e775f4282652c26&plugin=AMap.CircleEditor"></script>
																					KEY指的是網上申請高德地圖的key       plugin配置所要使用的插件
  </head>
````
##3.在显示界面
````
<template>
 			<div class="amap-page-container" style="height: 230px;">
				  <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
						  <el-amap-circle v-for="(circle,index) in circles" :key="index" :center="circle.center" icon='../assets/icon/1.png' :radius="circle.radius" :fill-opacity="circle.fillOpacity" :events="circle.events"></el-amap-circle>
				  </el-amap>
				</div> 
<template>
<script>
	
export default {
      data () {
        return {
          zoom: 16,
          center: [121.5273285, 31.21515044],
          circles: [
            {
              center: [121.5273285, 31.21515044],
              radius: 10,
              fillOpacity: 0.4,
              events: {
                click: (o) => {
					console.log(o);
                  alert('click');
                }
              },
            }
          ]
        }
      }
    };
</script>
````
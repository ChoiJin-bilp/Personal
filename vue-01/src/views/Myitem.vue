<template>
	<div class="itemCon">
		<div v-if="itemObj.pro_imglist != undefined">
			<img :src="itemObj.pro_imglist[0].url" />
		</div>
	</div>
</template>

<script>
	//引入 axios 
	// import axios from 'axios';
	export default{
		name:"myitem",
		data:function(){
			return {
				itemObj:{}
			}
		},
		mounted:function(){
			var params = new URLSearchParams();
			params.append('pro_id',this.$route.params.pro_id);
			params.append('fid','');
			console.log(params)
			//获取数据
			// axios.post("https://www.jvhv.com/siteindex.php/Lesson/Detail.html",params).then(res=>{
			// 	console.log(res);
			// 	this.itemObj = res.data.data;
			// })
		}
	}
</script>

<style scoped lang="scss">
	.itemCon{
		img{width: 100%;height:175px;}
	}
</style>

<template>
	<div class="findCon">
		<h3>发现</h3>
		<div class="nav">
			<router-link to="/find/tuijian">推荐</router-link>
			<router-link to="/find/guanzhu">关注</router-link>
			<router-link to="/find/tongcheng">同城</router-link>
		</div>
		<!--子页的路由出口-->
		<router-view></router-view>
	</div>
</template>

<script>
</script>

<style scoped lang="scss">
	.findCon{
		h3{font-size:16px; height:50px; line-height:50px; border-bottom: 1px solid #ccc;}
		.nav{
			display: flex; flex-wrap: nowrap; 
			flex-direction: row; justify-content: space-around;
			a{
				color:#999;font-size:16px;
				&.router-link-exact-active{
					color:#004B9E;
					border-bottom:2px solid #004B9E;
				}
			}
		}
	}
</style>

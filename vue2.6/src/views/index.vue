<template>
  <el-container class="nstc-main">
    <el-header class="nstc-header"
               height="52px">
      <!-- <NavBar></NavBar> -->
    </el-header>
    <el-container class="nstc-content">
      <el-aside class="nstc-aside">
        <el-scrollbar style="height:100%">
          <!-- <Sidebar></Sidebar> -->
        </el-scrollbar>
      </el-aside>
      <el-main class="nstc-view">
        <!-- <HeadeTags></HeadeTags> -->
        <el-scrollbar style="height:calc(100% - 32px)">
          <router-view class="nstc-router-view"
                       :key='key'></router-view>
          <!-- <keep-alive>
            <router-view class="nstc-router-view"
                         :key='key'></router-view>
          </keep-alive> -->
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// import NavBar from '@/components/NavBar.vue';
// import Sidebar from '@/components/Sidebar.vue';
// import HeadeTags from '@/components/HeadeTags.vue';
import { loadUserButton } from '@/views/api.js';
import _ from "lodash";
export default {
  computed: {
    key () {
      return this.$route.fullPath
    },
  },
  watch: {
    // 监听路由鉴权
    $route: {
      handler (route) {
        const fullPath = route.fullPath.split('/pms/')[1]
        const toPer = _.find(this.$store.state.FourData, (el) => {
          return fullPath == el.fullPath;
        });
        if (toPer) {
          this.getButton(toPer)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async getButton ({ id }) {  //获取当前菜单按钮权限
      try {
        let { success, data, message } = await loadUserButton({ menuId: id })
        if (success) {
          this.$store.dispatch("updateButtonData", data);
        } else {
          this.$message.error(message);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.nstc-main {
  height: 100%;
  width: 100%;
  /deep/ .el-header {
    padding: 0 18px;
    box-shadow: 0px 2px 6px 0px rgba(126, 92, 92, 0.1);
    z-index: 9;
  }
  .nstc-header {
    background: #fff;
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nstc-content {
    height: calc(100% - 60px);
    .nstc-aside {
      width: 172px !important;
      height: 100%;
      background: url(../assets/bk-prices.png) no-repeat;
      color: white;
      background-size: 100% 100%;
    }
    .nstc-view {
      background: #f7f6fb;
      padding: 0;
      .nstc-router-view {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        padding: 8px 12px 12px;
      }
    }
  }
}
</style>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState } from "vuex";
// import { User } from "@/mixins";
export default {
  // mixins: [User],
  computed: {
    ...mapState({
      routerTabs: "openedRouterList",
    }),
  },
  created() {
    //刷新不丢失store状态在页面加载时, 读取sessionStorage里的状态信息
    if (localStorage.getItem("store")) {
      let storeState = localStorage.getItem("store");
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(storeState)));
    }
    //在页面刷新时,将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      let storeData = JSON.stringify(this.$store.state);
      localStorage.setItem("store", storeData);
    });
  },
  watch: {
    // 解决新开浏览器tab store丢失问题
    routerTabs: {
      handler() {
        let storeData = JSON.stringify(this.$store.state);
        localStorage.setItem("store", storeData);
      },
      deep: true,
    },
  },
};
</script>

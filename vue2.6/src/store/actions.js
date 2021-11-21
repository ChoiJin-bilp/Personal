export default {
  //设置已打开路由集合
  updateRouters ({ commit }, data) {
    commit("setOpenedRouters", data);
  },
};

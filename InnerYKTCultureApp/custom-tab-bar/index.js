const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#333",
    list: [] //tabBar的数据
  },
  lifetimes: {
    //组件的生命周期函数
    attached() {
      this.setData({
        list: app.globalData.tabBarList
      })
    },
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      switch(url){
        case "/pages/alittle/alittle":
          //wx.reLaunch每次点击都会加载，调用onLoad事件处理
          wx.reLaunch({ url })
          break;
        default:
          //wx.switchTab如果已经加载，只调用onShow事件处理；没有加载才调用onLoad事件处理
          wx.switchTab({ url })
          break;
      }
    }
  }
})
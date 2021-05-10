// components/protocol/protocol.js
const app = getApp();
var Ballheight = app.globalData.ballheight, mainPackageUrl = "../../pages";
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollX: 400,
    scrollY: 120,
    ballheight: Ballheight, //悬浮球移动面积
    isDeviceMyUsing:app.data.isDeviceMyUsing,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      var that =this
      that.moveSet()
      that.time()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideModalserve() {
      const myEventDetail = { myNum: false };
      //主动触发事件
      this.triggerEvent('myevent', myEventDetail);
    },
    changeball(e) {
      clearInterval(this.data.start_timer);
      this.setData({
        ball: !this.data.ball,
      })
    },
    changeba(e) {
      if (e.changedTouches[0].clientX > 200) {
        this.setData({
          ball: !this.data.ball,
          scrollX: 400,
          scrollY: e.changedTouches[0].clientY - 45
        })
      } else {
        this.setData({
          ball: !this.data.ball,
          scrollX: 0,
          scrollY: e.changedTouches[0].clientY - 45
        })
      }
      console.log(this.data.scrollY)
      app.setCacheValue("suspendballX-" + app.data.version + "-" + app.data.wxAppId, this.data.scrollX);
      app.setCacheValue("suspendballY-" + app.data.version + "-" + app.data.wxAppId, this.data.scrollY);
      var that = this
      that.time()
    },
    //事件：返回按摩使用界面
    returnCheirapsisPage: function () {
      let that = this, url = "";
      //url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?did=" + app.data.agentDeviceId;
      url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork";
      console.log("gotoCheirapsisPage:" + url)
      wx.navigateTo({
        url: url
      });
    },
    moveSet(){
      var ScrollX = app.getCacheValue("suspendballX-" + app.data.version + "-" + app.data.wxAppId), ScrollY = app.getCacheValue("suspendballY-" + app.data.version + "-" + app.data.wxAppId)
      this.setData({
        scrollX: ScrollX,
        scrollY: ScrollY,
      })
    },
    time(){
      var that = this
      that.setData({
        start_timer: setInterval(function () { that.moveSet() }, 1000)
      })
    }
  },
  pageLifetimes: {
    show: function() {
      let that=this;
      
      // 页面被展示
      console.log("components floatinball is onShow ......")
      that.setData({
        isDeviceMyUsing:app.data.isDeviceMyUsing,
      })
    },
  }
})

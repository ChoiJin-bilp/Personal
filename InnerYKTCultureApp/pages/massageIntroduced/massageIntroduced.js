// pages/massageIntroduced/massageIntroduced.js
const app = getApp();
var DataURL = app.getUrlAndKey.dataUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    numType: 0,
    flexType:false,
    gaiyaoTop:0,
  },
  gotoBackPage: function () {
    let that = this;
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.createSelectorQuery().select(".foot").boundingClientRect(rect => {
      this.setData({
        gaiyaoTop: rect.top
      })
    }).exec();
  },
  changeNumType(e) {
    var gaiyaoTop = this.data.gaiyaoTop
    if (e.currentTarget.dataset.num==1){
      wx.pageScrollTo({
        scrollTop: gaiyaoTop,//滚动到页面节点的上边界坐标
        duration: 100   // 滚动动画的时长
      });
    }else{
      wx.pageScrollTo({
        scrollTop: 0,//滚动到页面节点的上边界坐标
        duration: 100   // 滚动动画的时长
      });
    }
    this.setData({
      numType: e.currentTarget.dataset.num
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll: function (res) {
    console.log("滚动运行了");
    console.log(res);
    if (res.scrollTop >= 45 && 449 >= res.scrollTop){
      this.setData({
        flexType: true,
        numType: 0
      })
    }else if(res.scrollTop >= 449){
      this.setData({
        numType: 1,
        flexType: true
      })
    }else{
      this.setData({
        flexType: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
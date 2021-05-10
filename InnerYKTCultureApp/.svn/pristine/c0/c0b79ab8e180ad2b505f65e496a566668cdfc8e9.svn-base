// pages/operation/operation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sityfirt: 20,
    sitysceond: 20,
    sitythree: 20,
    sitythree: 20,
    sityfour: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
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
  sliderchange(e) {
    var sity = e.currentTarget.dataset.num
    console.log(sity)
    switch (parseInt(sity)){
      case 0:
        break;
      case 1:
        var speed = 'sityfirt'
        console.log('sityfirt')
        break;
      case 2:
        var speed = 'sitysceond'
        break;
      case 3:
        var speed = 'sitythree'
        break;
      case 4:
        var speed = 'sityfour'        
    }
    console.log(speed)
    this.setData({
      [speed]: e.detail.value
    })
  },
  slbindchange(e) {
    this.setData({
      speed: e.detail.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
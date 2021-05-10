// pages/testaddress/testaddress.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var LOGUtils = require('../../utils/logutils.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upDataTime:"时间",
    deviceAddress:"设备地址",
    version:"设备版本"
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
    let that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },

  cleanAddress:function(){
    let that=this
    that.setData({
      upDataTime:"时间",
      deviceAddress:"设备地址",
      version:"设备版本"
    })
  },

  checkAddress:function(){
    let that=this;
    var urlTop = "https://bjy.51yunkeyi.com/baojiayou/webAPI.jsp?";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = ""
    urlParam = "cls=main_devicesTest&action=devicesTestList&appId=1"+ "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    LOGUtils.logI('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&pageSize=99&pageIndex=1&sign=" + sign;
    LOGUtils.logI(urlTop + urlParam)
    wx.request({
      url: urlTop + urlParam,
      success: function (res) {
        LOGUtils.logI(res)
        var dataList=[]
        dataList=res.data.data.dataList
        if(dataList!=null&&dataList.length){
          that.setData({
            upDataTime:dataList[0].receivedTime,
            deviceAddress:dataList[0].deviceAddress,
            version:dataList[0].version,
          })
          dataList=null
        }
      },fail:function(res){
         wx.showToast({
           title: '访问接口失败',
           icon:none,
           duration:2000
         })
      }
    })
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
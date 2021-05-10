// packageVP/pages/callwww/callwww.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var defaultProImg = "noimg.png", lastSort = 0, saveProData = [], patchCnt = 8;
var URL = app.getUrlAndKey.url,SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Domain:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this,Domain="";
    switch(app.data.version){
      case "online":
        Domain=app.getUrlAndKey.srvOnLine;
        break;
      default:
        Domain=app.getUrlAndKey.srvDevTest;
        break;
    }
    this.setData({
      ["Domain"]: Domain,
    })
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
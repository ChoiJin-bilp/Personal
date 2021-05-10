// packageVP/pages/mkghetrs/mkghetrs.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    appUserInfo = app.globalData.userInfo;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //事件：跳转扫码核销界面
  gotoSCanQRCodeRCVPage:function(e){
    let that=this,url="";
    url="/pages/scanCode/scanCode?login=2&alt="+encodeURIComponent("请扫码做充值核销");
    wx.navigateTo({
      url: url
    })
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
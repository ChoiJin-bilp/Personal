// pages/about/about.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,
    DataURL: DataURL,
    PublishVersion: "",     //发布的版本号
    randomNum: Math.random() / 9999,
    showrecordbox: false,

    userLoginImgUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    that.setData({
      PublishVersion: app.data.publishVersion,
      userLoginImgUrl: DataURL+"/images/" + app.data.userLoginImgUrl
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    app.viewImg(e);
  },
  hiderecordbox: function () {
    this.setData({
      showrecordbox: false
    })
  },
  showrecordbox: function () {
    this.setData({
      showrecordbox: true
    })
  },
})
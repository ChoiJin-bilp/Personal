// pages/safetyguideline/safetyguideline.js
const app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var LOGUtils = require('../../utils/logutils.js');

var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, getDeviceTag = 0;
var mainPackageUrl = "../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    showCheckbox:false,
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
    let that=this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //事件：点击勾选框
  clickCheckbox: function () {
    this.setData({
      showCheckbox: !this.data.showCheckbox
    })
  },
  //事件：提交申请分销商
  sureYKSmartNotice: function (e) {
    var that = this, showCheckbox = that.data.showCheckbox;
    // if (!showCheckbox) {
    //   wx.showToast({
    //     title: '请阅读并同意安全指引！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return;
    // }
    app.setCacheValue("noticeview-" + app.data.version + "-" + app.data.wxAppId,"1");
    wx.switchTab({
      url: mainPackageUrl + "/alittle/alittle"
    });
  },
})
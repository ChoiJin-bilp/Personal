// packageSMall/pages/infor/infor.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.smurl, OURL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl, isFromSApp = app.data.isFromSApp;
var pageSize = app.data.pageSize, defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../packageOther/pages", packComPageUrl = "../../packageCommercial/pages", packSMPageUrl = "../../packageSMall/pages", packTempPageUrl = "../../packageTemplate/pages", packYKPageUrl = "../../packageYK/pages", mainPackageUrl = "../../pages";
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isFromSApp: app.data.isFromSApp,
    randomNum: Math.random() / 9999,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log("参数信息：")
    
    console.log(options)
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo==undefined) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        that.setData({
          isOpenLiveBroadCast: app.data.isOpenLiveBroadCast,
        })
        console.log("登录成功！")
        break;
    }
  },

  //事件：取消注册
  cancelRegAuthorization: function (e) {
    var that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    var that = this;
    app.getAuthorizeUserInfo(that, e);
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
    var that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo == undefined) {
      app.getLoginUserInfo(that);
    }
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
  //事件：根据所给目录类型、页面名称、页面类型跳转页面操作
  gotoSubPage: function (e) {
    var that = this, stype = e.currentTarget.dataset.stype, pagename = e.currentTarget.dataset.pagename, tUrl = "", pageType = 0;
    //pageType：0普通页面，1底部菜单导航页
    switch (stype) {
      //酒店类页面
      case "1":
        tUrl = packTempPageUrl + "/" + pagename + "/" + pagename;
        break;
      //商城类页面
      case "2":
        tUrl = packSMPageUrl + "/" + pagename + "/" + pagename;
        break;
      case "3":
        tUrl = packYKPageUrl + "/" + pagename + "/" + pagename;
        break;
      default:
        pageType = 9;
        wx.showToast({
          title: "正在建设中...",
          icon: 'none',
          duration: 2000
        })
        break;
    }
    switch (pageType) {
      case 1:
        wx.switchTab({
          url: tUrl
        });
        break;
      case 0:
        wx.navigateTo({
          url: tUrl
        });
        break;
    }
  },
  //方法：跳转微官网
  returnMicroSiteApp:function(e){
    var that = this;
    app.returnSiteApp(that);
  },
})
// pages/release/release.js
const app = getApp();
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    // 角色 2平台 4酒店
    user_roleId: app.data.user_roleId,
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
    this.setData({
      // 角色 2平台 4酒店
      user_roleId: app.data.user_roleId,
      version2: app.data.version2,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
      userId: appUserInfo.userId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
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
  gotoSource(e) {

    var accountBindUserId = this.data.accountBindUserId
    if (Utils.isNull(accountBindUserId) || accountBindUserId == 0) {
      wx.showModal({
        title: '提示',
        content: '登录账号没有绑定用户ID',
        confirmText: "去绑定",
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../../../pages/personal/personal',
            })
          } else if (res.cancel) {}
        }
      })
      return
    }

    var pagetype = e.currentTarget.dataset.pagetype
    if (3 == pagetype) {
      wx.reLaunch({
        url: '../../../pages/doorway/doorway',
      })
      return
    }
    wx.navigateTo({
      url: '../source/source?pagetype=' + pagetype,
    })
  }
})
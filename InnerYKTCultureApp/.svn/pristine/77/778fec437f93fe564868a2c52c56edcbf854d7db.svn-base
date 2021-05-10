// pages/selectStore/selectStore.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    curlocation: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pagetype = options.pagetype
    if (!Utils.isNull(pagetype)) {
      this.data.pagetype = pagetype
    }
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location)
    if (!Utils.isNull(location)) {
      this.setData({
        curlocation: location,
      })
    }
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
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

  goToShop() {
    var that = this
    wx.reLaunch({
      url: '/pages/alittle/alittle?pagetype=' + that.data.pagetype
    })
  },
  goToMap() {
    const key = app.data.qqMapSDKKey; //使用在腾讯位置服务申请的key
    const referer = app.data.sysName; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
})
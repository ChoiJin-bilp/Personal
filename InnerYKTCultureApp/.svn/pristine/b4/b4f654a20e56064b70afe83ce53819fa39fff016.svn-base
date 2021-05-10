// packageSMall/pages/exchannge/exchannge.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    money: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money,
    })
  },

  /**
   * 我的钱包
   */
  goWallet() {
    wx.navigateTo({
      url: '../../../packageVP/pages/remaining/remaining',
    })
  },
})
// pages//addressDelivery/addressDelivery.js
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    addressList: [],
    isReData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isReData) {
      this.getAddress()
      this.data.isReData = false
    }
  },

  /**
   * 获取收货地址
   */
  getAddress() {
    var userId = appUserInfo.userId
    let signParam = 'cls=product_address&action=selectAddress&userId=' + userId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, "", 0, "获取收货地址")
  },
  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              var names = element.name.split(",")
              element.name = names[0]
              element.sex = names[1]
            }
            that.setData({
              addressList: data,
            })
            break
        }
        break
      default:
        console.log(error)
        break
    }
  },

  //跳转
  gotoPage() {
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },

  /**
   * 修改地址
   * @param {*} e 
   */
  changeAddress: function (e) {
    var index = e.currentTarget.dataset.index;
    var address = this.data.addressList[index];
    wx.navigateTo({
      url: "../newAddress/newAddress?type=0",
      // 通过eventChannel向被打开页面传送数据
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          address: address
        })
      }
    });
  },
  /**
   * 选中地址返回
   */
  selectAddress(e) {
    var index = e.currentTarget.dataset.index;
    var address = this.data.addressList[index];
    app.data.lastAddressId = address.id
    wx.navigateBack({
      delta: 1,
    })
  },
})
// pages/feedback/feedback.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  sOptions = null,
  scanQrTag = 0;
var pageSize = 20,
  defaultItemImgSrc = DataURL + app.data.defaultImg,
  packMainPageUrl = "../../../pages",
  packYKPageUrl = "../../../packageYK/pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    messList: [],
    pIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
    this.getUserLotteryRecordt()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pIndex: ++this.data.pIndex
    })
    this.getUserLotteryRecordt()
  },
  /**
   * 按摩消费订单申请和查询
   */
  getUserLotteryRecordt() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId = 8033
    let signParam = 'cls=main_lotteryActivityProduct&action=UserLotteryRecord&appId=' + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId + "&id="
    // status(状态0未支付；1已支付；2退款申请；3退款申请不通过；4退款成功；5退款失败),
    //mode模式a添加,q查询默认
    var otherParam = "&pSize=10&mode=q&pstatus=3,4,5&pIndex=" + this.data.pIndex
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "按摩消费订单申请和查询")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            if (data.length == 0) {
              if (that.data.pIndex == 1) {
                wx.showToast({
                  title: '暂无消息',
                  icon: 'none',
                  duration: 1500
                })
              } else {
                this.setData({
                  pIndex: --this.data.pIndex
                })
                wx.showToast({
                  title: '已全部加载',
                  icon: 'none',
                  duration: 1500
                })
              }
            } else {
              that.setData({
                messList: that.data.messList.concat(data)
              })
            }

            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  gotoPage: function (e) {
    var id = e.currentTarget.dataset.id
    let that = this
    var url = "../../../packageYK/pages/refund/refund?id=" + id+"&type=1";
    console.log(url)
    wx.navigateTo({
      url: url
    });
  },
})
// pages/business/business.js
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
    teamtype:false,//显示合伙人下拉框
    divtype:false,//显示分成统计类型下拉框

    sstype:false,//搜索拉长
    useInoftype:false,//客户与游客显示金额页面

    consto:"分成统计类型",
    SMDataURL: SMDataURL,
    DataURL: DataURL,

  },
  //点击“分成统计类型”传参
  onchangeCS(e){
    if (e.currentTarget.dataset.id == "设备使用率"){
      this.setData({
        consto: e.currentTarget.dataset.id,
        usagetype: true,
        divtype: false,//显示设备使用率版面
      })
    }else{
      this.setData({
        consto: e.currentTarget.dataset.id,
        divtype: false,
        usagetype: false,//隐藏设备使用率版面
      })
    }
  },
  //显示搜索长条
  onChangesstype(){
    this.setData({
      sstype: true
    })
  },
  //显示隐藏下拉框
  onChangeteamtype(){
    this.setData({
      teamtype: !this.data.teamtype
    })
  },
  //显示隐藏下拉框
  onChangedivtype(){
    this.setData({
      divtype: !this.data.divtype
    })
  },
  //隐藏所有显示
  ondelteamtype(){
    this.setData({
      teamtype: false,
      divtype: false,
      sstype: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})
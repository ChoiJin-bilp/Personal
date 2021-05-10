// pages/hotelintroduce/hotelintroduce.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../../packageOther/pages", packTempPageUrl = "../../../packageTemplate/pages", packSMPageUrl = "../../../packageTemplate/pages", mainPackageUrl = "../../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    isLoad: false,         //是否已经加载
    DataURL: DataURL,      //远程资源路径
    randomNum: Math.random() / 9999,

    companyId:0,           //公司ID
    companyDataInfo:null,

    indicatorDot: true,
    autoplays: true,
    intervals: 5000,
    durations: 1000,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this, companyId=0;
    try {
      companyId = parseInt(options.companyId);
      companyId = isNaN(companyId) ? 0 : companyId;
    } catch (e) { }
    that.setData({
      companyId: companyId,
    })
    that.getMainDataInfo(companyId);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad) {
      that.data.isLoad = true;
    } else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.getMainDataInfo(that.data.companyId);
        }
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh=false;
  },
  //方法：获取信息
  getMainDataInfo: function (companyId) {
    let that = this, otherParam = "&id=" + companyId;
    app.getCompanyMainDataInfo(that,otherParam);
  },
  //方法：获取公司信息结果处理函数
  dowithGetCompanyMainDataInfo: function (dataList, tag, errorInfo) {
    let that = this, noDataAlert = "暂无酒店详情信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        app.dowithCompanyMainDataInfo(that, dataList);
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无酒店详情！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：IntersectionObserver 对象懒加载图片
  lazyLoadImg: function () {
    let that = this;
    if (that.data.companyDataInfo != null && that.data.companyDataInfo!=undefined && that.data.companyDataInfo.photoList != null && that.data.companyDataInfo.photoList != undefined && that.data.companyDataInfo.photoList.length>0){
      app.lazyLoadImgList(that, that.data.companyDataInfo.photoList, "tbannerimg", "companyDataInfo.photoList");
    }
  },
  //事件：我要导航
  navigateTo: function (e) {
    let that = this, companyDataInfo = that.data.companyDataInfo;
    if (companyDataInfo.longitude < 0 || companyDataInfo.latitude < 0) {
      app.navigateToMap(that, companyDataInfo.address);
    } else {
      try {
        wx.openLocation({
          latitude: companyDataInfo.latitude,
          longitude: companyDataInfo.longitude,
          name: companyDataInfo.address,
          scale: 15
        })
      } catch (e) {
        wx.showToast({
          title: "无效地址不能导航！",
          icon: 'none',
          duration: 1500
        })
        console.log(e)
      }
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
})
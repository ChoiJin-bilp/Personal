// pages/comphoto/comphoto.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.murl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.mdataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = app.data.mPageSize;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,     //是否已经加载

    totalDataCount: 0, //总数据条数
    currentPage: 0,    //当前页码
    articles: [],      //存放所有的页记录

    array: [
      { image: '../../images/Background2.png'}, //公司相册 图片路径 
      { image: '../../images/Background2.png' },
      { image: '../../images/Background2.png' },
      { image: '../../images/Background2.png' },
      { image: '../../images/Background2.png' },
      { image: '../../images/Background2.png' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载：......");

    that.loadInitData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
  
    console.log("onShow ...")
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData(false);
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //获取报价列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this, noDataAlert ="暂无公司相册图片！";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=home_home&action=companyPhoto&companyId=" + app.data.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&pageSize=" + pageSize + "&currentPage=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data!=undefined) {
          var data = res.data.data;
          var photos = "", photosList=[], src = "";
          if (data.photos != null && data.photos != undefined && Utils.myTrim(data.photos + "") != "") {
            photos = data.photos;
            if (Utils.myTrim(photos) != "") {
              photosList = photos.split(",");
              for (let n = 0; n < photosList.length; n++) {
                photosList[n] = app.getSysImgUrl(photosList[n]);
              }
            }
          }
          if (photosList.length>0){
            that.setData({
              photosList: photosList
            })
          }else{
            wx.showToast({
              title: "暂无相册信息！",
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取公司相册图片列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取公司相册图片列表失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取公司相册图片列表接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：查看图片详情
  viewImg: function (e) {
    app.viewImg(e);
  }
})
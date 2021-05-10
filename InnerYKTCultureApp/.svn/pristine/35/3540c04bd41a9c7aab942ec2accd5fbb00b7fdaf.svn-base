// pages/ccompany/ccompany.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.murl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var mType = 0;//0=发展历程 1=愿景 2=团队成员
var appUserInfo = app.globalData.muserInfo,sOptions=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    companyData: {
      cName: "",
      cLogoUrl: DataURL+'/images/logo.png',
      cSummary: "",
      cPhone: "",
      cEmail: "",
      cWebSite: "",
      cAddr: "",
    },

    tag:0,                //0酒店简介，1联系我们
    historyDataList: [],
    visionDataList:[],
    teamDataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载：......");
    console.log(options);
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this, paramShareUId=0, isShare = true;
    console.log("参数信息-------------")
    console.log(options);
    
    var isScene = false, dOptions = null;
    if (options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    if (isScene) {
      sOptions = dOptions;
    } else {
      sOptions = options;
    }
    
    //1、分享人获取
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    that.data.paramShareUId = paramShareUId;
    appUserInfo = app.globalData.muserInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
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
        var tag = 0, pageTitle = "";
        appUserInfo = app.globalData.muserInfo;
        console.log('处理加载参数：')
        console.log(sOptions);
        try {
          //1报价，2询价，3订单
          if (sOptions.tag != null && sOptions.tag != undefined) {
            tag = parseInt(sOptions.tag);
            tag = isNaN(tag) ? 0 : tag;
          }
        } catch (e) { }

        if (app.data.mainCompanyData == null) {
          wx.showToast({
            title: "无法获取酒店信息",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        pageTitle = tag == 0 ? "酒店简介" : "联系我们";
        if (tag == 0) {
          that.getMainDataList(0);
          that.getMainDataList(1);
          that.getMainDataList(2);
        }
        that.setData({
          tag: tag,
          companyData: app.data.mainCompanyData,
        })
        console.log(that.data.companyData)
        //重新设置页面标题
        wx.setNavigationBarTitle({
          title: pageTitle
        })
        if (app.data.mainCompanyData.mapLocation.longitude < 0 || app.data.mainCompanyData.mapLocation.latitude < 0) {
          app.getMapLALInfo(that, app.data.mainCompanyData.cAddr);
        }
        break;
    }
  },
  //方法：获取经纬度方法结果处理函数
  dowithGetMapLALInfo: function (dataInfo, tag, errorInfo) {
    let that = this;
    //1成功，0失败
    switch (tag) {
      case 1:
        try {
          if (dataInfo != null && dataInfo != undefined) {
            let companyData = that.data.companyData, markers = [], markerItem = null;
            companyData.mapLocation.longitude = dataInfo.Longitude;
            companyData.mapLocation.latitude = dataInfo.Latitude;

            markerItem = {
              iconPath: DataURL + "/images/markicon.png",
              id: 0,
              latitude: dataInfo.Latitude,
              longitude: dataInfo.Longitude,
              width: 20,
              height: 28,
              callout: {
                content: companyData.cName
              }
            }
            markers.push(markerItem);
            companyData.mapLocation.markers = markers;

            that.data.companyData = companyData;
            app.data.mainCompanyData = companyData;
          }
        } catch (e) { }

        break;
      default:
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

  },
  //事件：查看酒店相册列表
  comphoto: function () {
    wx.navigateTo({
      url: "../comphoto/comphoto"
    });
  },
  //事件：查看图片详情
  viewImg:function(e){
    app.viewImg(e);
  },
  //事件：我要导航
  navigateToHere: function (e) {
    // var that = this, address = "";
    // try {
    //   address = e.currentTarget.dataset.addr;
    // } catch (e) { }
    // app.navigateToMap(that, address);
    let that = this, companyData = that.data.companyData;
    if (companyData.mapLocation.longitude < 0 || companyData.mapLocation.latitude < 0) {
      app.navigateToMap(that, companyData.cAddr);
    } else {
      try {
        wx.openLocation({
          latitude: companyData.mapLocation.latitude,
          longitude: companyData.mapLocation.longitude,
          name: companyData.cAddr,
          scale: 15
        })
      } catch (e) {
        wx.showToast({
          title: "无效地址不能导航！",
          icon: 'none',
          duration: 1500
        })
      }
    }
  },
  //获取信息列表
  getMainDataList: function (mType) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=home_home&action=companyHistroy&companyId=" + app.data.companyId + "&type=" + mType + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data);
        that.data.isLoad = true;
        wx.hideLoading();
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var mainDataList = res.data.data;
          //0=发展历程 1=愿景 2=团队成员
          switch (mType){
            case 0:
              that.setData({
                historyDataList: mainDataList,
              })
              break;
            case 1:
              that.setData({
                visionDataList: mainDataList,
              })
              break;
            case 2:
              that.setData({
                teamDataList: mainDataList,
              })
              break;
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取信息接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
})
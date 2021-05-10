// packageOther/pages/Collarcenter/Collarcenter.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null;
var defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../../packageOther/pages", isDowithing = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,                //是否已经加载
    isForbidRefresh: false,        //是否禁止刷新
    pageName:"Collarcenter",      //当前页面名称

    mallChannelId: 0,              //渠道ID

    couponData:null,
    totalDataCount: 0, //总数据条数
    currentPage: 0,    //当前页码
    articles: [],      //存放所有的页记录

    isGetCouponIdStrList:"",//已领取优惠价ID序列
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this, mallChannelId = 0, isScene=false;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }
    //获取分享人ID
    if (isScene) {
      sOptions = dOptions;
    } else {
      sOptions = options;
    }
    console.log("加载参数：");
    console.log(sOptions);
    try {
      if (sOptions.channelId != null && sOptions.channelId != undefined)
        mallChannelId = parseInt(sOptions.channelId);
      mallChannelId = isNaN(mallChannelId) ? 0 : mallChannelId;
    } catch (e) { }
    that.data.mallChannelId = mallChannelId;

    appUserInfo = app.globalData.userInfo;
    that.data.loginAction = 0;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        //0：加载信息
        switch (that.data.loginAction) {
          //0：加载信息
          case 0:
            console.log("登录后加载：......");
            that.data.isGetCouponIdStrList="";
            app.queryCanCoupons(that);
            break;
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    that.data.isGetCouponIdStrList = "";
    if (!that.data.isLoad) {
      that.data.isLoad = true;
    } else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        app.queryCanCoupons(that);
        console.log("onShow")
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：处理优惠劵列表
  dowithCoupunData: function (couponData){
    var that = this, articles = [], dataTem = {};

    if (couponData != null && couponData != undefined && couponData.length>0){
      for (var i = 0; i < couponData.length; i++) {
        dataTem = {};
        dataTem.activityId = couponData[i].activityId;
        dataTem.userId = app.globalData.userInfo.userId;
        dataTem.couponid = couponData[i].id;
        dataTem.sn = couponData[i].sn;

        dataTem.discount = couponData[i].discount;
        dataTem.mold = couponData[i].mold;
        dataTem.validday = couponData[i].validday;
        dataTem.full = couponData[i].full;
        dataTem.productNames = couponData[i].productNames;
        dataTem.typename = couponData[i].typename;
        dataTem.isGet = false;
        articles.push(dataTem);
      }
    }else{
      wx.showToast({
        title: "暂无可领优惠券！",
        icon: 'none',
        duration: 2000
      })
    }
    that.data.isLoad = true;
    that.setData({
      articles: articles
    })
    that.getHaveUsedCoupons(articles);
  },
  //方法：获取已领取劵
  getHaveUsedCoupons: function (articles) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryUserCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.userInfo.userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.data.companyId +  "&isUsed=0&sign=" + sign;
    console.log(SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('查询优惠券', res);
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var dataTem = {}, couponData = res.data.data;
            for (var i = 0; i < couponData.length; i++) {
              dataTem = {};
              dataTem.activityId = couponData[i].activityId;
              dataTem.userId = app.globalData.userInfo.userId;
              dataTem.couponid = couponData[i].id;
              dataTem.sn = couponData[i].sn;

              dataTem.discount = couponData[i].discount;
              dataTem.mold = couponData[i].mold;
              dataTem.validday = couponData[i].validday;
              dataTem.full = couponData[i].full;
              dataTem.productNames = couponData[i].productNames;
              dataTem.typename = couponData[i].typename;
              dataTem.isGet = true;
              articles.push(dataTem);
            }

            that.setData({
              articles: articles
            })
          }
        } else {
          app.setErrorMsg2(that, "查询已领取劵！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "无法获取已领取劵！",
            icon: 'none',
            duration: 1500
          })
        }
        if (articles.length<=0){
          wx.showToast({
            title: "暂无可领取优惠券！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询已领取劵！失败信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '无法获取已领取劵！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //事件：领取优惠券
  getCoupon:function(e){
    var that=this,id=0;
    try{
      id = parseInt(e.currentTarget.dataset.id);
      id=isNaN(id)?0:id;
    }catch(e){}
    if(id<=0){
      wx.showToast({
        title: "无效优惠券！",
        icon: 'none',
        duration: 1500
      })
    }
    that.saveCoupons(id);
  },
  //领取优惠券
  saveCoupons: function (id) {
    var that = this, couponData = that.data.couponData, isGetCouponIdStrList = that.data.isGetCouponIdStrList;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=SaveCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.data.companyId +  "&sign=" + sign;
    console.log('领取优惠券：', SMURL + urlParam)
    var couponDataTem = [];
    for (let i = 0; i < couponData.length; i++) {
      if (id == couponData[i].id){
        let dataTem = {};
        dataTem.activityId = couponData[i].activityId;
        dataTem.userId = app.globalData.userInfo.userId;
        dataTem.couponid = couponData[i].id;
        dataTem.sn = couponData[i].sn;
        couponDataTem = couponDataTem.concat(dataTem);
        break;
      }
    }
    console.log(JSON.stringify(couponDataTem));
    wx.request({
      url: SMURL + urlParam,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        data: JSON.stringify(couponDataTem)
      },
      success: function (res) {
        console.log("领取优惠券", res.data)
        if (res.data.rspCode == 0) {
          // isGetCouponIdStrList += Utils.myTrim(isGetCouponIdStrList) == ""?""+id:","+id;
          // that.setData({
          //   isGetCouponIdStrList: isGetCouponIdStrList
          // })
          // that.dowithCoupunData(couponData);
          app.queryCanCoupons(that);
          wx.showToast({
            title: "领取成功！",
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: "领取优惠券失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '领取优惠券失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "领取优惠券接口调用失败！出错信息：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
})
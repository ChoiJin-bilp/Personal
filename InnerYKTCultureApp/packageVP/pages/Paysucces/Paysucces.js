// packageVP/pages/Paysucces/Paysucces.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo, sOptions = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,

    rechargeOrderId:"",   //当前充值订单号
    curRcId:0,            //当前充值套餐ID
    curRPrice:0.00,
    curRInt:0,
    payPrice:0.00,
    upGradeInt:0,
    allInt:0,
    payPrice:0.00,

    curUserId:0,
    curMobile:"",

    welfareList:[],   //充值福利列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载：......");
    console.log(options);
    appUserInfo = app.globalData.userInfo;
    sOptions=options;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null) {
          wx.showToast({
            title: "获取用户失败！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let curRcId = 0,curRPrice=0.00,curRInt=0,payPrice=0.00,upGradeInt=0,allInt=0,rechargeOrderId="";
        if (Utils.isDBNotNull(sOptions.oid)){
          try{
            rechargeOrderId = Utils.myTrim(sOptions.oid);
          }catch(e){}
        }
        if (Utils.isDBNotNull(sOptions.rprice)){
          try{
            curRPrice = parseFloat(sOptions.rprice);
            curRPrice = isNaN(curRPrice) ? 0.00 : curRPrice;
            curRPrice=parseFloat(curRPrice.toFixed(app.data.limitQPDecCnt))
          }catch(e){}
        }  
        if (Utils.isDBNotNull(sOptions.pprice)){
          try{
            payPrice = parseFloat(sOptions.pprice);
            payPrice = isNaN(payPrice) ? 0.00 : payPrice;
            payPrice=parseFloat(payPrice.toFixed(app.data.limitQPDecCnt))
          }catch(e){}
        }  
        try {
          if (Utils.isNotNull(sOptions.id)){
            curRcId = parseInt(sOptions.id);
            curRcId = isNaN(curRcId) ? 0 : curRcId;
          }      
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.rint)){
            curRInt = parseInt(sOptions.rint);
            curRInt = isNaN(curRInt) ? 0 : curRInt;
          }      
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.uint)){
            upGradeInt = parseInt(sOptions.uint);
            upGradeInt = isNaN(upGradeInt) ? 0 : upGradeInt;
          }      
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.aint)){
            allInt = parseInt(sOptions.aint);
            allInt = isNaN(allInt) ? 0 : allInt;
          }      
        } catch (e) {}
        if(curRcId<=0){
          wx.showToast({
            title: "充值套餐ID无效！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        that.setData({
          ["rechargeOrderId"]:rechargeOrderId,
          ["curRcId"]: curRcId,
          ["curRPrice"]:curRPrice,
          ["curRInt"]:curRInt,
          ["payPrice"]:payPrice,
          ["upGradeInt"]:upGradeInt,
          ["allInt"]:allInt,
          ["payPrice"]:payPrice,

          ["curUserId"]:appUserInfo.userId,
          ["curMobile"]:appUserInfo.userMobile,
        })
        that.getRechargeWelfareInfo(curRcId);
        that.createWXQRCodeImg();
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //事件：生成小程序二维码
  createWXQRCodeImg: function () {
    let that = this, rechargeOrderId = that.data.rechargeOrderId;
    let page = "packageVP/pages/mkghetrstwo/mkghetrstwo", pageData = "oid=" + rechargeOrderId+"|uid="+appUserInfo.userId;
    app.createWXQRCodeImg(that, page, pageData);
  },
  //方法：生成代理公司小程序二维码结果处理函数
  setWXQRCodeImg: function (imgSrc) {
    let that = this, otherParams = "&companyId="+app.data.companyId;
    console.log("小程序二维码图片生成结果：" + imgSrc)
    that.setData({
      ["rcQRImgUrl"]: imgSrc,
    })
    otherParams+="&isverify=0&orImgUrl="+encodeURIComponent(imgSrc);
    app.saveMemberRechargeDetail(that,appUserInfo.userId,that.data.rechargeOrderId,otherParams,1);
  },
  //方法：获取充值福利
  getRechargeWelfareInfo: function (curRcId) {
    var that = this;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=userRights&appId=" + app.data.appid + "&pid=" + curRcId + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log('获取充值福利：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取充值福利结果')
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let welfareList=[],mainData=null,dataItem = null, listItem = null;
          if(Utils.isNotNull(res.data.data.dataList) && res.data.data.dataList.length>0){
            let id=0,name="",productName="",coupon_id=0,frequency=0,invalid=0;
            mainData=res.data.data.dataList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;coupon_id=0;frequency=0;name="";productName="";invalid=0;
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.productName)){
                productName = dataItem.productName;
              }
              name=Utils.myTrim(name) != ""?name:productName;
              if (Utils.isDBNotNull(dataItem.coupon_id)) {
                try {
                  coupon_id = parseInt(dataItem.coupon_id);
                  coupon_id = isNaN(coupon_id) ? 0 : coupon_id;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.frequency)) {
                try {
                  frequency = parseInt(dataItem.frequency);
                  frequency = isNaN(frequency) ? 1 : frequency;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.invalid)) {
                try {
                  invalid = parseInt(dataItem.invalid);
                  invalid = isNaN(invalid) ? 0 : invalid;
                } catch (e) { }
              }
              if(invalid!=0)continue;
              
              listItem={id:id,name:name,coupon_id:coupon_id,frequency:frequency,invalid:invalid,}
              welfareList.push(listItem);
            }
          }
          console.log(welfareList)
          that.setData({
            ["welfareList"]: welfareList,
          })
          that.receiveWelfareList(welfareList);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取充值福利：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取充值福利接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取充值福利接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：领取充值福利动作
  receiveWelfareList:function(welfareList){
    let that=this;
    if(Utils.isNotNull(welfareList) && welfareList.length>0){
      for(let i=0;i<welfareList.length;i++){
        if(welfareList[i].coupon_id>0){
          //领劵操作
          app.receiveRechargeWelfareInfo(that,welfareList[i].coupon_id,welfareList[i].frequency);
        }
      }
    }
  },
  //方法：领取充值福利操作结果回调处理方法
  dowithReceiveRechargeWelfareInfo(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('领取充值福利操作结果：')
        console.log(dataList)
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取充值福利失败！";
        wx.showToast({
          title: res.data.errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },

  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
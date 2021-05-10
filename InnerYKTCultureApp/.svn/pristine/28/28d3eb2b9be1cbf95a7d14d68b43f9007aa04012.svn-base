// pages/mypoints/mypoints.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.smurl, OURL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = app.data.pageSize, defaultItemImgSrc = DataURL + "/images/noimg.png", isDowithing = false, mQRType = app.data.mQRType;
var appUserInfo = app.globalData.userInfo;
Page({
  data: {
    DataURL: DataURL,
    isLoad: false,        //是否已经加载
    isShowQRCode: false,
    isShowhint: false,

    myAllPoints:0,        //我的总积分
    myPointActivity:[],   //我的活动

    qrShowImgSrc:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    console.log("加载：......");
    that.getMainData();
  },
  onShow() {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        isDowithing = false;
        that.getMainData();
        console.log("onShow getMainData...")
      }
    }
  },
  //获取积分信息
  getMainData: function () {
    var that = this, noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    noDataAlert = "暂无任务信息！";
    urlParam = "cls=product_score&action=QueryUserScore&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&mold=3,4&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data, dataItem = null, listItem = null, myAllPoints = 0, myPointActivity = [];
          var sortNo = 0, activityId = 0, activityName = "", allCnt = 0, finishedCnt = 0, percentage = 0.00, product_id = "", detail_id = "", number = 0, companyId = 0, isFinish = false, isUsed=0;
          if (data.score != null && data.score != undefined && data.score.length>0){
            for (var i = 0; i < data.score.length; i++) {
              dataItem = null; dataItem = data.score[i];
              console.log(dataItem.userId);
              if (dataItem.userId != null && dataItem.userId != undefined && Utils.myTrim(dataItem.userId + "") == Utils.myTrim(appUserInfo.userId + "")) {
                console.log(dataItem.score);
                try {
                  myAllPoints = parseInt(dataItem.score);
                  myAllPoints = isNaN(myAllPoints) ? 0 : myAllPoints;
                } catch (err) { }
                break;
              }
            }
          }
          
          if (data.activity != null && data.activity != undefined && data.activity.length > 0) {
            var detailDataItem=null,productList=[],productListItem=null;
            for (var i = 0; i < data.activity.length; i++) {
              dataItem = null; listItem = null; dataItem = data.activity[i];
              activityId = 0; activityName = ""; allCnt = 0; finishedCnt = 0; percentage = 0.00; isUsed=0;
              if (dataItem.mold != null && dataItem.mold != undefined && Utils.myTrim(dataItem.mold + "") != "1" && Utils.myTrim(dataItem.mold + "") != "3") continue;
              activityId=dataItem.id;
              if (dataItem.name != null && dataItem.name != undefined && Utils.myTrim(dataItem.name + "") != "")
                activityName = dataItem.name;
              if (dataItem.num != null && dataItem.num != undefined && Utils.myTrim(dataItem.num + "") != "") {
                try {
                  allCnt = parseFloat(dataItem.num);
                  allCnt = isNaN(allCnt) ? 0.00 : allCnt;
                } catch (err) { }
              }
              if (dataItem.tally != null && dataItem.tally != undefined && Utils.myTrim(dataItem.tally + "") != "") {
                try {
                  finishedCnt = parseFloat(dataItem.tally);
                  finishedCnt = isNaN(finishedCnt) ? 0.00 : finishedCnt;
                } catch (err) { }
              }
              //isUsed
              if (dataItem.isUsed != null && dataItem.isUsed != undefined && Utils.myTrim(dataItem.isUsed + "") != "") {
                try {
                  isUsed = parseInt(dataItem.isUsed);
                  isUsed = isNaN(isUsed) ? 0 : isUsed;
                } catch (err) { }
              }
              //领奖商品信息
              if (dataItem.product != null && dataItem.product != undefined && dataItem.product.length>0){
                productList = [];
                for (var n = 0; n < dataItem.product.length;n++){
                  detailDataItem = null; detailDataItem = dataItem.product[n]; productListItem=null;
                  product_id = ""; detail_id = ""; number = 0; companyId = 0;
                  if (detailDataItem.productId != null && detailDataItem.productId != undefined && Utils.myTrim(detailDataItem.productId + "") != "") product_id = detailDataItem.productId;
                  if (detailDataItem.detailId != null && detailDataItem.detailId != undefined && Utils.myTrim(detailDataItem.detailId + "") != "") detail_id = detailDataItem.detailId;
                  if (detailDataItem.number != null && detailDataItem.number != undefined && Utils.myTrim(detailDataItem.number + "") != "") {
                    try {
                      number = parseInt(detailDataItem.number);
                      number = isNaN(number) ? 1 : number;
                    } catch (err) { }
                  }
                  if (detailDataItem.companyId != null && detailDataItem.companyId != undefined && Utils.myTrim(detailDataItem.companyId + "") != "") {
                    try {
                      companyId = parseInt(detailDataItem.companyId);
                      companyId = isNaN(companyId) ? 0 : companyId;
                    } catch (err) { }
                  }
                  productListItem={
                    product_id: product_id, detail_id: detail_id, number: number, companyId: companyId,
                  }
                  productList.push(productListItem);
                }
              } else {
                continue;
              }
              
              if(allCnt>0 && finishedCnt>0){
                percentage = finishedCnt / allCnt;
                isFinish = allCnt == finishedCnt ? true : isFinish;
              }

              sortNo++;
              listItem={
                sortNo: sortNo, activityId: activityId, activityName: activityName, allCnt: allCnt, finishedCnt: finishedCnt, percentage: percentage, productList: productList, isFinish: isFinish, isUsed: isUsed,
              }
              myPointActivity.push(listItem);
            }
          }
          if (myPointActivity.length<=0){
            // wx.showToast({
            //   title: noDataAlert,
            //   icon: 'none',
            //   duration: 222000
            // })
          }
          that.setData({
            myAllPoints: myAllPoints,
            myPointActivity: myPointActivity,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取积分活动信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取积分活动信息调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取积分活动信息：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取二维码
  getQRCode: function (page, param) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=qrCode_qrCode&action=getMallProductCode&page=" + page + "&pagedata=" + param + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&type=" + mQRType + "&pId=0&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      dataType: "json",
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("生成二维码成功！")
          if (res.data.data != null && res.data.data != undefined && res.data.data.imageAddress != null && res.data.data.imageAddress != undefined && Utils.myTrim(res.data.data.imageAddress) != "") {
            var qrsrc = app.getSysImgUrl(res.data.data.imageAddress.replace('/tts_upload', ''));
            console.log(qrsrc);
            app.data.qrImgSMPageSrc=qrsrc;
            that.setData({
              qrShowImgSrc: qrsrc,
              isShowQRCode: true
            })
            //保存二维码信息
            //app.saveCurProductInfo(mainObj, proData);
          } else {
            wx.showToast({
              title: "生成二维码失败！",
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "生成二维码接口失败！",
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：新增领奖订单
  addSMRewardOrderInfo: function (e) {
    var that = this, item=null;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中...",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    try {
      item = e.currentTarget.dataset.item;
    } catch (err) { }
    if (item.productList == null || item.productList == undefined || item.productList.length<=0){
      wx.showToast({
        title: "该活动没有设置奖品！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (item.isUsed == null || item.isUsed == undefined || item.isUsed == 1) {
      wx.showToast({
        title: "已领过奖，不能重复领取！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    isDowithing = true;

    var productDataInfo = null, itemList = [], listItem = null, detailList = [], detailListItem = null, userId = appUserInfo.userId, mobile = appUserInfo.userMobile, activityId = item.activityId,oldProduct_id="";
    for (var i = 0; i < item.productList.length;i++){
      if (Utils.myTrim(oldProduct_id) == "") oldProduct_id = Utils.myTrim(item.productList[i].product_id);
      if (Utils.myTrim(oldProduct_id) != Utils.myTrim(item.productList[i].product_id)){
        console.log(oldProduct_id + ":" + Utils.myTrim(item.productList[i].product_id))
        listItem = {
          linkNo: 2,
          activityId: activityId,
          amount: 0,
          companyId: productDataInfo.companyId,
          userId: userId,
          mobile: mobile,
          deliveryId: 0,
          detail: detailList
        }
        itemList.push(listItem);
        oldProduct_id = Utils.myTrim(item.productList[i].product_id);
      }
     
      detailListItem = null; listItem=null; productDataInfo = null; productDataInfo = item.productList[i];
      
      detailListItem = {
        product_id: productDataInfo.product_id,
        detail_id: productDataInfo.detail_id,
        number: productDataInfo.number,
        price: 0,
        amount: 0,
      }
      detailList.push(detailListItem);
    }
    listItem = {
      linkNo: 2,
      activityId: activityId,
      amount: 0,
      companyId: productDataInfo.companyId,
      userId: userId,
      mobile: mobile,
      deliveryId: 0,
      detail: detailList
    }
    itemList.push(listItem);
    that.addSMOrderInfo(itemList);
  },
  //方法：新增订单
  addSMOrderInfo: function (itemList) {
    app.addSMOrderInfo(this, itemList);
  },
  //方法：跳转订单详情页面
  gotoOrderDetailPage: function (orderId, tag) {
    var that = this, vtype = that.data.vtype, url = vtype == 0 ? "../shoporder/shoporder?orderid=" + orderId : "../smorderdetail/smorderdetail?otype=2&orderid=" + orderId;
    if (tag == 0) {
      console.log("订单跳转：" + url)
      wx.navigateTo({
        url: url,
        fail: function (e) {
          console.log("设置：isDowithing = false")
          isDowithing = false;
        }
      });
    } else
      isDowithing = false;
  },
  //事件：商城二维码弹窗显示
  showModalQRcode: function () {
    var that = this, qrShowImgSrc = that.data.qrShowImgSrc;
    if (Utils.myTrim(qrShowImgSrc) != ""){
      that.setData({
        isShowQRCode: true
      })
    }else{
      that.getQRCode(app.data.storeShareMainPage,"kk=0")
    }
  },
  //事件：商城二维码弹窗隐藏
  hideModalQRcode: function () {
    this.setData({
      isShowQRCode: false
    })
  },

  //事件：帮助提示弹窗显示
  showModalhint: function () {
    this.setData({
      isShowhint: true
    })
  },
  //事件：帮助提示弹窗隐藏
  hideModalhint: function () {
    this.setData({
      isShowhint: false
    })
  },
  // 我要兑换
  gotoExchange:function(e){
    var that=this;
    wx.navigateTo({
      url: "../conversion/conversion?points=" + that.data.myAllPoints
    });
  },
  gotoExchange1:function(e){
    var that = this;
    wx.navigateTo({
      url: "../smorderdetail/smorderdetail?otype=1&orderid=391493a0778f403a917ca31c2351fe79"
    });
  }
})
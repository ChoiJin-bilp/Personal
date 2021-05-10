// packageOther/pages/fenxiao/fenxiao.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var PYTool = require('../../../utils/pinyin.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../packageOther/pages", homePageUrl = "../../../" + app.data.sysMainPage, sOptions = null, timeOutMainDescribe = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    isDowithing:false,
    showView: true,
    consumptionAmount:0.00,            //消费总金额
    resellerConsumptionMin: 100,       //分销商申请——最低消费金额条件
    resellerDeposit: 50,               //分销商申请——不满足消费条件押金金额
    revokeReturnDepositDays: 0,        //撤销分销返佣身份押金回退天数

    refundAmount:0.00,                 //退款金额
    refundDateTime:"",                 //退款时间
    isShowRefundAlert:0,               //是否显示退款页面：0不显示，1显示
    isShowRefundFinishAlert:0,         //是否显示退款完成提示：0不显示，1显示

    showCheckbox: false,

    paramShareUId: 0,  //分享人

    mainDescribeType: 0,               //0：分享返佣说明 1：代理介绍 2：定制介绍
    mainDescribeInfo: null,            //描述信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;

    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this, paramShareUId = 0, isScene = false, dOptions = null;
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
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    that.data.paramShareUId = paramShareUId;

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
   //查看更多
  checkmore: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },


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
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null || appUserInfo==undefined){
          wx.showToast({
            title: '获取登录信息失败！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if (appUserInfo.isDistributor){
          wx.showToast({
            title: '您已经是分销商！',
            icon: 'none',
            duration: 2000
          })
          setTimeout(that.gotoMyDistributorPage, 2000);
          return;
        }
        that.getMyConsumptionAmount();
        timeOutMainDescribe = setTimeout(that.getMainDescribe, 500)
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    that.data.isDowithing = false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        that.getMyConsumptionAmount();
        timeOutMainDescribe = setTimeout(that.getMainDescribe, 500);
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    try {
      if (timeOutMainDescribe != null && timeOutMainDescribe != undefined) clearTimeout(timeOutMainDescribe);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    try {
      if (timeOutMainDescribe != null && timeOutMainDescribe != undefined) clearTimeout(timeOutMainDescribe);
    } catch (err) { }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：获取分销返佣押金信息
  getDistributeDepositRecord: function () {
    let that = this;
    wx.showLoading({
      title: "数据加载中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //status状态：0: 未支付，1: 已支付（待取货），2: 已完成，3: 退款待审核，4: 退款完成，5退款失败，6: 商城支付成功待送货，7: 申诉待审核，8: 申诉已处理，9: 申诉已驳回，10: 退款处理中
    let urlParam = "", sign = "", otherParam ="&paySubjectType=5&status=3,4,5,10";
    urlParam = "cls=product_business&action=QueryVenderFlow&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        wx.hideLoading();
        console.log('获取押金记录：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined && res.data.data.length>0){
            let dataItem = res.data.data[0],id=0, refundAmount = 0.00, refundDateTime = "", isShowRefundAlert = 0, isShowRefundFinishAlert = 0, revokeReturnDepositDays = that.data.revokeReturnDepositDays, refundDt = new Date(), status = 0, isAlert=0;
            if (dataItem.id != null && dataItem.id != undefined && Utils.myTrim(dataItem.id + "") != "null") {
              try {
                id = parseInt(dataItem.id);
                id = isNaN(id) ? 0 : id;
              } catch (err) { }
            }
            if (dataItem.price != null && dataItem.price != undefined && Utils.myTrim(dataItem.price + "") != "null") {
              try {
                refundAmount = parseFloat(dataItem.price);
                refundAmount = isNaN(refundAmount) ? 0.00 : refundAmount;
              } catch (err) { }
            }
            if (dataItem.status != null && dataItem.status != undefined && Utils.myTrim(dataItem.status + "") != "null") {
              try {
                status = parseInt(dataItem.status);
                status = isNaN(status) ? 0 : status;
              } catch (err) { }
            }
            if (dataItem.isAlert != null && dataItem.isAlert != undefined && Utils.myTrim(dataItem.isAlert + "") != "null") {
              try {
                isAlert = parseInt(dataItem.isAlert);
                isAlert = isNaN(isAlert) ? 0 : isAlert;
              } catch (err) { }
            }
            if (dataItem.applyRefundTime != null && dataItem.applyRefundTime != undefined) {
              try {
                let dateTime = new Date(dataItem.applyRefundTime.replace(/\-/g, "/"));
                let dt_milliseconds = dateTime.getTime() + 1000 * 60 * 60 * 24 * revokeReturnDepositDays;

                dateTime.setTime(dt_milliseconds);  
                refundDateTime = Utils.getDateTimeStr(dateTime, "/", false);
              } catch (e) { }
            }
            //status状态：0: 未支付，1: 已支付（待取货），2: 已完成，3: 退款待审核，4: 退款完成，5退款失败，6: 商城支付成功待送货，7: 申诉待审核，8: 申诉已处理，9: 申诉已驳回，10: 退款处理中
            let alertFinishContent="";
            switch(status){
              case 4:
                isShowRefundAlert=0;
                isShowRefundFinishAlert = isAlert == 0 && refundAmount>0.00?1:0;
                alertFinishContent = "你的" + refundAmount +"元押金已退回到微信“零钱”，请查收！";
                break;
              case 5:
                isShowRefundAlert = 0;
                isShowRefundFinishAlert = isAlert == 0 && refundAmount > 0.00 ? 1 : 0;
                alertFinishContent = "你的" + refundAmount + "元押金退款失败，请联系系统管理员处理！";
                break;
              default:
                isShowRefundAlert=refundAmount>0.00?1:0;
                break;
            }
            that.setData({
              refundAmount: refundAmount,
              refundDateTime: refundDateTime,

              isShowRefundAlert: isShowRefundAlert,
              isShowRefundFinishAlert: isShowRefundFinishAlert,
            })
            if (isShowRefundFinishAlert==1){
              wx.showModal({
                title: '提示',
                content: alertFinishContent,
                showCancel:false,
                confirmText:"知道了",
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }                 }
              })
              that.cancelDistributeDepositRefundFinishAlert(id);
            }
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取押金记录：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取押金记录接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取押金记录接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //事件：跳转申请分销返佣界面
  gotoApplyDistributor:function(e){
    let that=this;
    that.setData({
      isShowRefundAlert: 0,
    })
  },
  //方法：取消退款完成提醒
  cancelDistributeDepositRefundFinishAlert: function (id) {
    let that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //status状态：0: 未支付，1: 已支付（待取货），2: 已完成，3: 退款待审核，4: 退款完成，5退款失败，6: 商城支付成功待送货，7: 申诉待审核，8: 申诉已处理，9: 申诉已驳回，10: 退款处理中
    let urlParam = "", sign = "", otherParam = "&paySubjectType=5&id="+id;
    urlParam = "cls=product_business&action=CancelVenderFlowAlert&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('取消押金退款完成提示：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("取消押金退款完成提示成功！")
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取押金记录：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "取消押金退款完成提示失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "取消押金退款完成提示：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取我的消费总金额
  getMyConsumptionAmount: function () {
    var that = this;
    wx.showLoading({
      title: "数据加载中......",
    })
    app.getApplyDistributorInfo(that);
  },
  //方法：获取分销申请信息结果处理函数
  dowithGetApplyDistributorInfo:function(data,tag,errorInfo){
    var that=this;
    wx.hideLoading();
    that.data.isDowithing = false;
    errorInfo = Utils.myTrim(errorInfo)==""?"获取分销申请信息失败！":errorInfo;
    //1成功，0失败
    switch(tag){
      case 1:
        var consumptionAmount = that.data.consumptionAmount, resellerConsumptionMin = 0.00, resellerDeposit = 0.00, revokeReturnDepositDays = 0;
        try {
          consumptionAmount = parseFloat(data.cnt);
          consumptionAmount = isNaN(consumptionAmount) ? 0.00 : consumptionAmount;
        } catch (e) { }
        try {
          resellerConsumptionMin = parseFloat(data.customerMoney);
          resellerConsumptionMin = isNaN(resellerConsumptionMin) ? 0.00 : resellerConsumptionMin;
        } catch (e) { }
        try {
          resellerDeposit = parseFloat(data.paymentMoney);
          resellerDeposit = isNaN(resellerDeposit) ? 0.00 : resellerDeposit;
        } catch (e) { }
        try {
          revokeReturnDepositDays = parseInt(data.day);
          revokeReturnDepositDays = isNaN(revokeReturnDepositDays) ? 0 : revokeReturnDepositDays;
        } catch (e) { }
        consumptionAmount = parseFloat(consumptionAmount.toFixed(app.data.limitQPDecCnt));
        resellerConsumptionMin = parseFloat(resellerConsumptionMin.toFixed(app.data.limitQPDecCnt));
        resellerDeposit = parseFloat(resellerDeposit.toFixed(app.data.limitQPDecCnt));
        that.setData({
          consumptionAmount: consumptionAmount,
          resellerConsumptionMin: resellerConsumptionMin,
          resellerDeposit: resellerDeposit,
          revokeReturnDepositDays: revokeReturnDepositDays,
        })
        that.getDistributeDepositRecord();
        break;

      default:
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：保存个人信息
  savePersonInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&shareUser=1&sign=" + sign;
    console.log("我的资料保存URL:", URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log('保存个人资料信息')
        console.log(res)
        if (res.data.rspCode == 0) {
          var mainData = res.data.data.userMap, isDistributor = that.data.isDistributor;
          if (mainData.shareUser != null && mainData.shareUser != undefined && Utils.myTrim(mainData.shareUser + "") != "null") {
            isDistributor = mainData.shareUser;
          }
          app.globalData.userInfo.isDistributor = isDistributor;
          appUserInfo = app.globalData.userInfo;
          console.log("我的资料保存成功————————————")
          that.setData({
            isDistributor: isDistributor,
          })
          that.data.isDowithing = false;
          if (isDistributor) {
            wx.showToast({
              title: "申请成功！",
              mask: true,
              duration: 3000
            })
            setTimeout(that.gotoMyDistributorPage, 3000);
          } else {
            wx.showToast({
              title: "申请失败！",
              mask: true,
              duration: 1500
            })
          }
        } else {
          app.setErrorMsg2(that, "我的资料保存：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          that.data.isDowithing = false;
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "我的资料保存接口调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '申请接口调用失败！',
          icon: 'none',
          duration: 1500
        })
        that.data.isDowithing = false;
      }
    })
  },
  //事件：点击勾选框
  clickCheckbox: function () {
    this.setData({
      showCheckbox: !this.data.showCheckbox
    })
  },
  //事件：提交申请分销商
  submitApplyDistributor:function(e){
    var that = this, showCheckbox = that.data.showCheckbox, resellerDeposit = that.data.resellerDeposit, resellerConsumptionMin = that.data.resellerConsumptionMin, consumptionAmount = that.data.consumptionAmount,isNeedPay=false;
    if (!showCheckbox){
      wx.showToast({
        title: '请阅读协议并同意！',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    //判断是否需要支付：
    //押金条件小于等于0：无须支付
    //押金条件大于0，且消费总金额大于等于限定最低消费金额：无须支付
    //其他情况，需要支付
    isNeedPay = resellerDeposit <= 0 ? false : (consumptionAmount >= resellerConsumptionMin?false:true);
    if (isNeedPay){
      that.setData({
        isShowPayPop: true
      })
    }else{
      //如果无须支付
      if (that.data.isDowithing) {
        wx.showToast({
          title: "操作进行中...",
          icon: 'none',
          duration: 2000
        })
      } else {
        that.data.isDowithing = true;
        that.savePersonInfo();
      }
    }
  },
  //方法：跳转我的分销页面
  gotoMyDistributorPage:function(){
    var that=this;
    wx.redirectTo({
      url: "../myfenxiao/myfenxiao"
    });
  },
  //事件：返回主页
  gotoHomePage: function (e) {
    wx.reLaunch({
      url: homePageUrl
    });
  },
  hideShowPayPop: function () {
    this.setData({
      isShowPayPop: false
    })
  },
  //事件：支付押金
  payDeposit:function(e){
    var that = this, attach = "13_0_" + app.data.hotelId +"_3", resellerDeposit = that.data.resellerDeposit;
    if (Utils.myTrim(app.data.version) =="online")
      app.getPrePayId(that, attach, resellerDeposit);
    else
      app.getPrePayId(that, attach, 0.01);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.data.isDowithing = false;
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "支付成功！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        that.savePersonInfo();
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "支付失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：获取特定描述信息
  getMainDescribe: function () {
    var that = this, mainDescribeType = that.data.mainDescribeType;
    app.getMainDescribe(that, mainDescribeType);
  },
  //方法：获取特定描述信息结果处理函数
  dowithGetMainDescribe: function (dataItem, tag, errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        var mainDescribeInfo = null, agreement = "", describes = "";
        if (dataItem.agreement != null && dataItem.agreement != undefined && Utils.myTrim(dataItem.agreement + "") != "" && Utils.myTrim(dataItem.agreement + "") != "null" && Utils.myTrim(dataItem.agreement + "") != "undefined")
          agreement = dataItem.agreement;
        if (dataItem.describes != null && dataItem.describes != undefined && Utils.myTrim(dataItem.describes + "") != "" && Utils.myTrim(dataItem.describes + "") != "null" && Utils.myTrim(dataItem.describes + "") != "undefined")
          describes = dataItem.describes;

        agreement = Utils.myTrim(agreement) != "" ? Utils.replaceHtmlChar(agreement) : "";
        describes = Utils.myTrim(describes) != "" ? Utils.replaceHtmlChar(describes) : "";

        agreement = '<div class="div_class">' + agreement + "</div>";
        describes = '<div class="div_class">' + describes + "</div>"

        mainDescribeInfo = { agreement: agreement, describes: describes }
        console.log(mainDescribeInfo)
        that.setData({
          mainDescribeInfo: mainDescribeInfo,
        })
        break;
      default:
        break;
    }
  },
})
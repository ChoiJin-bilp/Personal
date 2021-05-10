// pages/remaining/remaining.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var defaultProImg = "noimg.png", lastSort = 0, saveProData = [], patchCnt = 8;
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize = app.data.pageSize, mainPackageDir = "../../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    funId:6,
    DataURL: DataURL,          //资源地址前缀
    isLoad: false,             //是否已经加载
    isDowithing:false,
    isShowRegGuider: false,
    regGuiderMsg: app.data.regGuideMsg,

    isShowReCharge: false,
    isShowWithDraw: false,

    remainingSum: 0.00,        //剩余余额
    withdrawableSum:0.00,      //可提现余额
    nowithdrawalSum:0.00,      //不可提现余额
    serviceCharge:0.00,        //手续费

    initWithdrawSum: 0.00,     //初始提现金额

    withdrawSum: 0.00,         //提现金额
    reChargeSum:0.00,          //充值金额

    initWithdrawSumStr:"",
    reChargeSumStr:"",

    withdrawOrderNo:"",        //提现订单号

    srcOptions:null,       //保存加载信息
  },
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    that.data.srcOptions=options;
    that.getMainDataInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      else
        that.getMainDataInfo();
    }
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;

    console.log("表单取值事件changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "rechargesum":
        that.setData({
          reChargeSumStr: Utils.restrictAmountValue(value,false)
        })
        break;

      case "withdrawsum":
        let initWithdrawSum=0.00;
        try{
          initWithdrawSum=parseFloat(value);
          initWithdrawSum=isNaN(initWithdrawSum)?0.00:initWithdrawSum;
        }catch(e){}
        that.calculateWithdrawSum(initWithdrawSum);
        break;
    }
  },
  //事件：全部提现
  withdrawAllCash:function(e){
    let that=this,initWithdrawSum=0.00;
    try{
      initWithdrawSum=parseFloat(e.currentTarget.dataset.sum);
      initWithdrawSum=isNaN(initWithdrawSum)?0.00:initWithdrawSum;
    }catch(e){}
    that.calculateWithdrawSum(initWithdrawSum);
  },
  //方法：计算提现金额
  calculateWithdrawSum:function(initWithdrawSum){
    let that=this, initWithdrawSumStr="",withdrawSum=0.00,serviceCharge=that.data.serviceCharge,withdrawableSum=that.data.withdrawableSum;
    withdrawSum=initWithdrawSum - serviceCharge;

    that.setData({
      ["initWithdrawSumStr"]: initWithdrawSum.toFixed(app.data.limitQPDecCnt),
      ["initWithdrawSum"]:parseFloat(initWithdrawSum.toFixed(app.data.limitQPDecCnt)),
      ["withdrawSum"]:parseFloat(withdrawSum.toFixed(app.data.limitQPDecCnt)),
      ["isShowWithDraw"]:withdrawSum>0.00?true:false,
    })
  },
  //方法：获取信息
  getMainDataInfo:function(){
    console.log("getMainDataInfo")
    var that = this;
    wx.showLoading({
      title: "加载中......",
    })
    app.getNewMyRemainingSum(that);
  },
  //方法：获取我的余额结果处理函数
  dowithGetNewMyRemainingSum: function (dataList, tag, errorInfo) {
    let that = this;
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("我的余额获取结果：");
        console.log(dataList);
        let mainData = dataList, remainingSum = 0.00,withdrawableSum=0.00,nowithdrawalSum=0.00,serviceCharge=0.00;
        if (Utils.isNotNull(mainData) && Utils.isNotNull(mainData.balance)){
          if (Utils.isNotNull(mainData.balance.totalmoney)) {
            remainingSum = parseFloat(mainData.balance.totalmoney);
            remainingSum = isNaN(remainingSum) ? 0 : remainingSum;
          }
          if (Utils.isNotNull(mainData.balance.money)) {
            withdrawableSum = parseFloat(mainData.balance.money);
            withdrawableSum = isNaN(withdrawableSum) ? 0 : withdrawableSum;
          }
          if (Utils.isNotNull(mainData.balance.nomoney)) {
            nowithdrawalSum = parseFloat(mainData.balance.nomoney);
            nowithdrawalSum = isNaN(nowithdrawalSum) ? 0 : nowithdrawalSum;
          }
          remainingSum = parseFloat(remainingSum.toFixed(app.data.limitQPDecCnt));
          withdrawableSum = parseFloat(withdrawableSum.toFixed(app.data.limitQPDecCnt));
          nowithdrawalSum = parseFloat(nowithdrawalSum.toFixed(app.data.limitQPDecCnt));
        }
        
        that.setData({
          ["remainingSum"]: remainingSum,
          ["withdrawableSum"]:withdrawableSum,
          ["nowithdrawalSum"]:nowithdrawalSum,
          ["serviceCharge"]:serviceCharge,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取余额失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：查看零钱明细
  viewWalletDetail: function () {
    var that=this;
    wx.navigateTo({
      url: "../../../packageOther/pages/walletdetail/walletdetail?rmsum=" + that.data.remainingSum
    });
  },
  /////////////////////////////////////////////////////
  //----充值-------------------------------------------
  //方法：获取预支付ID
  getPrePayId: function () {
    var that = this, attach = "6_0_" + app.data.hotelId + "_3", reChargeSum = that.data.reChargeSum;
    app.getPrePayId(that, attach, reChargeSum);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.data.isDowithing = false;
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;
        that.setData({
          isShowReCharge: false
        })
        console.log("支付发起成功！")
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },

  //事件：显示充值弹窗
  showReChargePop: function () {
    var that = this;
    //权限检测：做功能权限检测
    if (!app.checkFunctionRights(that, that.data.funId, 0)) return;

    this.setData({
      isShowReCharge: true,
      reChargeSum: 0.00, 
      reChargeSumStr: "",         
    })
  },
  //事件：隐藏充值弹窗
  hideReChargePop: function () {
    this.setData({
      isShowReCharge: false
    })
  },
  //事件：确定充值
  submitPayInfo:function(e){
    var that = this, reChargeSum = 0.00, reChargeSumStr = that.data.reChargeSumStr;
    console.log("按钮确定充值。。。");
    if (that.data.isDowithing){
      wx.showToast({
        title: "支付进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    try{
      reChargeSum=parseFloat(reChargeSumStr);
      reChargeSum=isNaN(reChargeSum)?0.00:reChargeSum;
    }catch(err){}
    if (reChargeSum<=0){
      wx.showToast({
        title: "充值金额必须大于0！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.setData({
      reChargeSum: reChargeSum
    })
    that.data.isDowithing=true;
    that.getPrePayId();
  },

  /////////////////////////////////////////////////////
  //----提现-------------------------------------------
  //方法：获取提现订单号
  getwithdrawCashOrderNo: function () {
    console.log("getwithdrawCashOrderNo")
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=redEnvelope_withdrawDeposit&action=placeAnOrder&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;

    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&wxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined && res.data.data.partner_trade_no != null && res.data.data.partner_trade_no != undefined && Utils.myTrim(res.data.data.partner_trade_no)!="") {
          that.setData({
            ["withdrawOrderNo"]: res.data.data.partner_trade_no,
          })
          console.log("提现订单号生成成功！")
          that.withdrawCash();
        } else {
          that.data.isDowithing=false;
          var rspMsg = res.data.rspMsg;
          wx.showToast({
            title: rspMsg,
            icon: 'none',
            duration: 4000
          })
          app.setErrorMsg2(that, "提现订单号生成：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        that.data.isDowithing = false;
        wx.showToast({
          title: "提现订单号生成接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "提现订单号生成接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：提现
  withdrawCash: function () {
    console.log("withdrawCash")
    var that = this;
    wx.showLoading({
      title: '提现处理中......',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=redEnvelope_withdrawDeposit&action=WithdrawDeposit&userId=" + appUserInfo.userId + "&partner_trade_no=" + that.data.withdrawOrderNo + "&depositMoney=" + that.data.withdrawSum +  "&appId=" + app.data.appid + "&timestamp=" + timestamp;

    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&wxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('提现~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          var alertContent = "现金2小时内到帐微信零钱！"
          
          that.setData({
            ["withdrawOrderNo"]:'',
            ["isShowWithDraw"]: false,
            ["initWithdrawSum"]:0.00,
            ["withdrawSum"]:0.00,
            ["initWithdrawSumStr"]:"",
          })
          
          wx.showToast({
            title: alertContent,
            icon: 'none',
            duration: 4000
          })
          console.log("余额提现：成功！")
          setTimeout(function(){
            wx.redirectTo({
              url: '/packageVP/pages/remaining/remaining',
            })
          }, 4000)          
        } else {
          var rspMsg = res.data.rspMsg;
          wx.showToast({
            title: rspMsg,
            icon: 'none',
            duration: 4000
          })
          app.setErrorMsg2(that, "余额提现：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
        that.data.isDowithing=false;
      },
      fail: function (err) {
        that.data.isDowithing=false;
        wx.hideLoading();
        wx.showToast({
          title: "余额提现接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "余额提现接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：确定提现
  submitWithDrawInfo: function (e) {
    var that = this,initWithdrawSum=that.data.initWithdrawSum, withdrawSum = that.data.withdrawSum,withdrawableSum=that.data.withdrawableSum, remainingSum = that.data.remainingSum;

    //注册用户检测
    if(Utils.isNotNull(app.globalData.userInfo) && (Utils.isNull(app.globalData.userInfo.userMobile) || app.globalData.userInfo.userMobile.indexOf("u_")>=0)){
      wx.showModal({
        title: '提示',
        content: '该功能需要注册用户，您是否继续？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //app.data.curPageDataOptions对象属性说明：
            //package：源页面所在分包名称
            //page：源页面所在分包路径，例如：/pages/remaining/remaining
            //options：源页面的加载参数
            app.data.curPageDataOptions={
              package:"packageVP",page:"/pages/remaining/remaining",options: that.data.srcOptions,
            }
            wx.redirectTo({
              url: '/packageYK/pages/tiedaphone/tiedaphone?lgt=2'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')   
          }
        }
      })
      
      return;
    }

    console.log("isDowithing:")
    console.log(that.data.isDowithing)
    if (that.data.isDowithing) {
      wx.showToast({
        title: "提现进行中......",
        icon: 'none',
        duration: 2000
      })
    }else{
      if (withdrawableSum<=0.00) {
        wx.showToast({
          title: "可提现余额不能小于0.00元！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (initWithdrawSum > withdrawableSum) {
        wx.showToast({
          title: "提现金额不能大于可提现余额！",
          icon: 'none',
          duration: 2000
        })
        return;
      }      
      if (withdrawSum < 0.3) {
        wx.showToast({
          title: "实际提现金额必须大于0.3元！",
          icon: 'none',
          duration: 2000
        })
        return;
      }

      that.data.isDowithing = true;
      that.getwithdrawCashOrderNo();     
    }
  },
  ////////////////////////////////////////////////////////
  
  onchangedetailType(){
    this.setData({
      detailType: !this.data.detailType,
    })
  },
  //退出弹窗
  emptyType(){
    this.setData({
      detailType:false,
    })
  },
    //显示通知弹窗
    showout() {
      this.setData({
        productType: !this.data.productType
      })
    },
})
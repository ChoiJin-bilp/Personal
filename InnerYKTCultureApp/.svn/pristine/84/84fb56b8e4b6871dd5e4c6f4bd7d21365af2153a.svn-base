// components/payModeChosePop/payModeChosePop.js
var app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,isTestPrice =false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    DataURL: DataURL,          //资源地址前缀
    isLoad: false,             //是否已经加载
    isDowithing:false,         //支付是否正在操作

    isShowPop:false,           //是否显示支付弹窗

    orderId:"",                //支付订单号
    orderAmount:0.00,          //支付金额
    srcOrderAmount:0.00,       //原支付金额

    attach:"",                 //支付附加参数
    describe:"",               //支付描述

    selPayType:0,              //0公众号支付，1App支付，2支付宝支付，3小程序支付，4零元支付，5余额支付
    paymentData:null,          //获取预支付ID返回结果
  },

  /**
   * 组件的方法列表
   */
  methods: {
    testAlert:function(content){
      let that=this;

      wx.showToast({
        title: content,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        ["isShowPop"]: true,
      })
    },
    //方法：显示弹窗
    //参数：
    //orderAmount：支付金额
    //attach：支付附加参数
    showPayForPop:function(orderId,orderAmount,attach,describe){
      let that=this;
      that.setData({
        ["orderId"]:orderId,
        ["orderAmount"]:orderAmount,
        ["srcOrderAmount"]:orderAmount,
        ["attach"]:attach,
        ["describe"]:describe,
      })
      app.getNewMyRemainingSum(that);    
    },
    //事件：隐藏弹窗
    hidePayforPop:function(e){
      let that=this;
      that.setData({
        ["isShowPop"]: false,
      })
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
          let mainData = dataList,remainDiscount=1, remainingSum = 0.00,withdrawableSum=0.00,nowithdrawalSum=0.00,serviceCharge=0.00;
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
          if (Utils.isNotNull(mainData) && Utils.isNotNull(mainData.subscription)){
            if (Utils.isNotNull(mainData.subscription.discount)) {
              remainDiscount = parseFloat(mainData.subscription.discount);
              remainDiscount = isNaN(remainDiscount) ? 1 : remainDiscount;
            }
            remainDiscount = parseFloat(remainDiscount.toFixed(app.data.limitQPDecCnt));
          }
          let srcOrderAmount=that.data.srcOrderAmount,orderAmount=that.data.orderAmount,selPayType=remainingSum>0.00 && remainingSum>=that.data.orderAmount?5:3;
          //如果为余额支付，且折扣小于1
          if(selPayType==5 && remainDiscount<1){
            orderAmount=srcOrderAmount*remainDiscount;
            orderAmount = parseFloat(orderAmount.toFixed(app.data.limitQPDecCnt));
          }
          that.setData({
            ["isShowPop"]: true,
            ["remainingSum"]: remainingSum,
            ["remainDiscount"]:remainDiscount,

            ["selPayType"]: remainingSum>0.00 && remainingSum>=that.data.orderAmount?5:3,
            ["orderAmount"]:orderAmount,
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
    //事件：选择支付类型
    chosePayforType:function(e){
      let that=this,ptype=0,srcOrderAmount=that.data.srcOrderAmount,orderAmount=that.data.orderAmount,remainingSum=that.data.remainingSum,remainDiscount=that.data.remainDiscount;
      
      try {
        ptype = parseInt(e.currentTarget.dataset.ptype);
        ptype = isNaN(ptype) ? 0 : ptype;
      } catch (e) { }
      switch(ptype){
        //微信支付
        case 3:
          //微信支付不打折扣
          orderAmount=srcOrderAmount;
          break;
        //余额支付
        case 5:
          //如果为余额支付，且折扣小于1
          if(ptype==5 && remainDiscount<1){
            orderAmount=srcOrderAmount*remainDiscount;
            orderAmount = parseFloat(orderAmount.toFixed(app.data.limitQPDecCnt));
          }
          if(orderAmount>remainingSum){
            wx.showToast({
              title: "余额不足，无法使用余额支付！",
              icon: 'none',
              duration: 2000
            })
            return;
          }
          break;
      }
      that.setData({
        ["selPayType"]: ptype,
        ["orderAmount"]:orderAmount,
      })
    },

    //事件：立即支付
    payforSubmit:function(e){
      let that=this,orderAmount=that.data.orderAmount;
      if(that.data.isDowithing){
        wx.showToast({
          title: "支付进行中......",
          icon: 'none',
          duration: 2000
        })
        return
      }
      let attach=that.data.attach,selPayType=that.data.selPayType,tmpArray=[];
      if (Utils.myTrim(attach) == "") {
        wx.showToast({
          title: "支付附加参数为空！",
          icon: 'none',
        })
        return;
      }
      //如果支付金额不大于0则按“零元支付”处理
      selPayType=orderAmount>0?selPayType:"4";
      tmpArray = attach.split(",");
      let sunArray=tmpArray[0].split("_");
      if(sunArray.length<4){
        wx.showToast({
          title: "支付附加参数格式不正确！",
          icon: 'none',
        })
        return;
      }
      tmpArray[0]=sunArray[0]+"_"+sunArray[1]+"_"+sunArray[2]+"_"+selPayType;
      attach=tmpArray.join(",");
      that.data.attach=attach;
      console.log("构造支付附加参数："+attach)
      that.data.isDowithing=true;
      that.getPayPreId(attach);
    },
    ///////////////////////////////////////////////////////////////////////////////////////////
    //--------支付部分-------------------------------------------------------------------------
    getPayPreId: function (attach) {
      let that = this,price=that.data.orderAmount,describe=that.data.describe;
      wx.showLoading({
        title: '支付进行中......',
      })
      //支付是否为测试价格1分钱
      price=isTestPrice?0.01:price;
      console.log('attach:', attach)
      app.getPrePayId10(that, attach, price, describe)
    },
    //方法：获取预支付ID结果处理函数
    dowithGetPrePayId10:function (dataList, tag, errorInfo) {
      let that = this;
      wx.hideLoading();
      switch (tag) {
        case 1:
          console.log("获取预支付ID结果：");
          console.log(dataList);
          if (Utils.isNotNull(dataList.data)) {
            let appid="";
            if(Utils.isNotNull(dataList.data.appid) && Utils.myTrim(dataList.data.appid) != ""){
              appid=Utils.myTrim(dataList.data.appid);
            }
            switch(appid){
              //0元支付或余额支付
              case "AppID":
                let success=0;
                if(Utils.isNotNull(dataList.data.success)){
                  try{
                    success=parseInt(dataList.data.success);
                    success=isNaN(success)?-1:success;
                  }catch(e){}
                }
                if(success>=0){
                  //支付完成后的处理方法
                  that.dowithAfterPayfor();
                }else{
                  wx.showToast({
                    title: "支付失败，请重试！",
                    icon: 'none',
                    duration: 1500
                  })
                }
                break;
              //其他支付
              default:
                that.data.paymentData=dataList.data;
                app.requestPayment(that, dataList.data);
                break;
            }
          }
          break;
        default:
          that.data.isDowithing = false;
          wx.showToast({
            title: "支付失败！",
            icon: 'none',
            duration: 1500
          })
          break;
      }
    },
    //方法：支付结束处理方法
    dowithPayment: function (tag, alertContent) {
      var that = this;
      wx.hideLoading();
      //1支付成功，0支付失败
      switch (tag) {
        case 1:
          //支付完成后的处理方法
          that.dowithAfterPayfor();
          break;

        default:
          that.data.isDowithing = false;
          alertContent = Utils.myTrim(alertContent) == "" ? "支付失败！" : alertContent;
          wx.showToast({
            title: alertContent,
            icon: 'none',
            duration: 1500
          })
          break;
      }
    },
    //方法：支付完成处理方法
    dowithAfterPayfor:function(){
      let that=this;
      that.setData({
        ["isShowPop"]: false,
      })
      that.data.isDowithing = false;
      that.triggerEvent('onDowithAfterPayfor', { orderId:that.data.orderId,orderAmount: that.data.orderAmount});
    }
  },
  pageLifetimes: {
    show: function() {
      let that=this;
      appUserInfo = app.globalData.userInfo;
      isTestPrice =appUserInfo.userId ==13118 || appUserInfo.userId ==6900?true:false;
      // 页面被展示
      console.log("components cheirapsisAlert is onShow ......"+appUserInfo.userId)
      //that.triggerEvent('exePageMethod', { content: '我是谁'});
    },
  }
})

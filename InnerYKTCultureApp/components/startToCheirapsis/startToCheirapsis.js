// components/startToCheirapsis/startToCheirapsis.js
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
    id:0, minuteCnt:0, cashback_price:0.00, pfTag:0,chDeviceTag:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //方法：判断是否需要扫码开启按摩器
    //说明：需要开启扫码按摩器条件：1、暂无设备；2、02以下款确定开启新的按摩；3、02以上款不做延时操作
    //deviceId：设备ID
    checkCheirapsisCondition:function(deviceId,id, minuteCnt, cashback_price, pfTag,chDeviceTag){
      let that=this;
      that.setData({
        id: id,
        minuteCnt: minuteCnt,
        cashback_price: cashback_price,
        pfTag:pfTag,
        chDeviceTag:chDeviceTag,
      })
      
      if(deviceId<=0){
        app.data.agentDeviceId=0;
        that.dowithAfterCheckCondition();
      }else{
        that.analysisDeviceBluetoothAddress("", deviceId, 1);
      }
    },

    //方法：后续调起按摩处理方法
    dowithAfterCheckCondition:function(){
      let that=this;
      that.triggerEvent('onDowithAfterCheckCondition', { id:that.data.id,minuteCnt:that.data.minuteCnt,cashback_price:that.data.cashback_price,pfTag:that.data.pfTag,chDeviceTag: that.data.chDeviceTag});
    },

    //方法：分析蓝牙地址
    //tag:0分析地址，1分析ID
    analysisDeviceBluetoothAddress: function (deviceBlueAddress,deviceId,tag) {
      let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
      if(tag==0){
        otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceBlueAddress);
      }else{
        otherParamCon += "&id=" + deviceId;
      }
      
      otherParamCon += "&pageSize=99&pageIndex=1";
      app.getDeviceList(that, otherParamCon);
    },
    //方法：获取设备结果处理函数
    dowithGetDeviceList: function (dataList, tag, errorInfo) {
      let that = this, deviceId = 0, companyId = 0, deviceBlueAddress = "", address = "", status = 1, dtNowStr = "", dtDeviceStr = "", isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date(), userId = 0, isDeviceUsing = false,isDeviceOtherUsing=true;
      
      switch (tag) {
        case 1:
          console.log("获取设备结果：");
          console.log(dataList);
          let dataItem = null;
          if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.companyMsgList) && dataList.companyMsgList.length > 0){
            dataItem=null;dataItem = dataList.companyMsgList[0];
            let isShowAward=0,isSetFreeCheirapsis=0,freeCheirapsisMode=0,storePageLayout=1;//freeMassage
            if (Utils.isNotNull(dataItem.orientation) && Utils.myTrim(dataItem.orientation + "") != "null") {
              try {
                storePageLayout = parseInt(dataItem.orientation);
                storePageLayout = isNaN(storePageLayout) ? 1 : storePageLayout;
              } catch (e) { }
              app.data.storePageLayout=storePageLayout;
            }
            if (Utils.isNotNull(dataItem.showLuck) && Utils.myTrim(dataItem.showLuck + "") != "null") {
              try {
                isShowAward = parseInt(dataItem.showLuck);
                isShowAward = isNaN(isShowAward) ? 0 : isShowAward;
              } catch (e) { }
              app.data.isShowAward=isShowAward;
            }
            if (Utils.isNotNull(dataItem.freeMassage) && Utils.myTrim(dataItem.freeMassage + "") != "null") {
              try {
                isSetFreeCheirapsis = parseInt(dataItem.freeMassage);
                isSetFreeCheirapsis = isNaN(isSetFreeCheirapsis) ? 0 : isSetFreeCheirapsis;
              } catch (e) { }
              app.data.isSetFreeCheirapsis=isSetFreeCheirapsis;
            }
            if (Utils.isNotNull(dataItem.freeType) && Utils.myTrim(dataItem.freeType + "") != "null") {
              try {
                freeCheirapsisMode = parseInt(dataItem.freeType);
                freeCheirapsisMode = isNaN(freeCheirapsisMode) ? 0 : freeCheirapsisMode;
              } catch (e) { }
              app.data.freeCheirapsisMode=freeCheirapsisMode;
            }
          }
          if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            dataItem = dataList.dataList[0];
            deviceId = dataItem.id;
            try {
              userId = parseInt(dataItem.userId);
              userId = isNaN(userId) ? 0 : userId;
            } catch (e) { }
            isUsed = Utils.isNull(dataItem.isUsed) ? "00" : dataItem.isUsed;
            //倒计时 时间
            if (Utils.myTrim(isUsed) != "") {
              time = parseInt(isUsed, 16); //16进制转10进制
            }
            dataUpdateTime = Utils.isNull(dataItem.dataUpdateTime) ? "" : dataItem.dataUpdateTime;
            try {
              dtUpdate = new Date(dataUpdateTime.replace(/\-/g, "/"));
            } catch (e) { }
            //判断当前设备是否被其他人所用
            if (userId == app.globalData.userInfo.userId || time <= 0) {
              //没有被用——
              //1、使用者是自己；
              //2、剩余时间为0;
              isDeviceOtherUsing = false;
            } else if(userId != app.globalData.userInfo.userId && time>0){
              //3、如果设备超过指定秒数没有更新“dataUpdateTime”则判定为没有被用
              try {
                interval = Utils.getTimeInterval(dtUpdate, (new Date()), 0);
                //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
                if (interval >= (app.data.isUsedInterval * 1000)) {
                  //设备已经在用
                  isDeviceOtherUsing = false;
                }
              } catch (e) { }
            }
            //判断当前设备是否在用
            if (time > 0) {
              dtNowStr = Utils.myTrim(Utils.getDateTimeStr((new Date()), "-", false));
              dtDeviceStr = Utils.myTrim(Utils.getDateTimeStr(dtUpdate, "-", false));
              isDeviceUsing = dtNowStr == dtDeviceStr?true:isDeviceUsing;
            }
            app.data.isDeviceMyUsing=isDeviceUsing;
            if (Utils.isNotNull(dataItem.status)) {
              try {
                status = parseInt(dataItem.status);
                status = isNaN(status) ? 1 : status;
              } catch (e) { }
            }
            
            //0已经绑定1解绑
            if (status == 0){
              if (Utils.isNotNull(dataItem.companyId)) {
                try {
                  companyId = parseInt(dataItem.companyId);
                  companyId = isNaN(companyId) ? 1 : companyId;
                } catch (e) { }
              }
              address = Utils.isNotNull(dataItem.address) ? dataItem.address : "";
            }
            deviceBlueAddress = Utils.isNotNull(dataItem.deviceAddress) ? dataItem.deviceAddress : "";
          }
          break;
        default:
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
          break;
      }
      
      if(app.data.agentDeviceSoftVersion!=0 && userId==app.globalData.userInfo.userId && app.data.isDeviceMyUsing){
        //如果当前按摩器版本为02款以上，且当前用户正在使用则提示是否延时：延时则不做扫码操作，不延时则做扫码开启按摩操作
        wx.showModal({
          title: '提示',
          content: '按摩器正在运行，您需要加时还是返回“扫码”页面开启新的按摩器',
          confirmText:"加时",   //最多 4 个字符
          cancelText:"另启按摩",//最多 4 个字符
          success (res) {
            if (res.confirm) {
              //默认延时处理
              that.dowithAfterCheckCondition();
            } else if (res.cancel) {
              console.log('用户点击取消')
              app.data.agentDeviceId=0;
              that.dowithAfterCheckCondition();
            }
          }
        })
      }else if(app.data.agentDeviceSoftVersion==0 && userId==app.globalData.userInfo.userId && app.data.isDeviceMyUsing){
        //如果当前按摩器版本为02款以下，且当前用户正在使用则提示是否开启新的按摩
        wx.showModal({
          title: '提示',
          content: '按摩器正在运行，您确定“扫码”另外开启新的按摩器吗？',
          confirmText:"另启按摩",   //最多 4 个字符
          cancelText:"取消",//最多 4 个字符
          success (res) {
            if (res.confirm) {
              app.data.agentDeviceId=0;
              that.dowithAfterCheckCondition();
            } else if (res.cancel) {
              console.log('用户点击取消')  
            }
          }
        })       
      }else{
        app.data.agentDeviceId=0;
        that.dowithAfterCheckCondition();
      }
    },
  },
  pageLifetimes: {
    show: function() {
      let that=this;
      appUserInfo = app.globalData.userInfo;
      // 页面被展示
      console.log("components startToCheirapsis is onShow ......"+appUserInfo.userId)
      //that.triggerEvent('exePageMethod', { content: '我是谁'});
    },
  }
})

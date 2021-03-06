// pages/scanCode/scanCode.js
const app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var LOGUtils = require('../../utils/logutils.js');

var SMURL = app.getUrlAndKey.smurl,URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,getDeviceTag=0;
var mainPackageUrl = "../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    deviceNo:"",              //设备编号
    deviceId:0,
    deviceBlueAddress:"",         //当前设备蓝牙地址

    isShowSCCompontent:false,     //是否显示扫码控件
    roleStatus: 0,                //0为普通1角色管理员(平台)2合作商
    loginMode:0,                  //登录模式：0默认登录，1更换设备登录，2扫码后自动跳转原页面

    user_roleId: app.data.user_roleId,
    scrollX: 400,
    scrollY: 200,

    curPageDataOptions:null,
  },
  gotoIndex() {
    let isHaveViewAlert="0";
    isHaveViewAlert = app.getCacheValue("noticeview-" + app.data.version + "-" + app.data.wxAppId);
    if (Utils.isNotNull(isHaveViewAlert) && Utils.myTrim(isHaveViewAlert)=="1"){
      wx.switchTab({
        url: mainPackageUrl + "/alittle/alittle",
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.navigateTo({
        url: mainPackageUrl + "/safetyguideline/safetyguideline"
      });
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let strScene = decodeURIComponent('packageYK/pages/Myprize/Myprize?id%3D304%26ctype%3D1');
    console.log("strScene:"+strScene)
    let kkk = "[{ \"cid\": \"5918\", \"pageUrl\": \"pages/store/store\" }, { \"cid\": \"-2\", \"pageUrl\": \"pages/store/store\" }]";
    console.log(JSON.parse(kkk))
    
    that.dowithParam(options);   
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0;
    console.log("加载参数：");
    console.log(options)
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this, isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })
        break;

      default:
        appUserInfo = app.globalData.userInfo;
        let loginMode = 0, deviceBlueAddress = "", deviceId=0, isShowSCCompontent = that.data.isShowSCCompontent,curPageDataOptions=null,alertContent="扫描按摩器二维码开始享受";
        try {
          if (Utils.isNotNull(sOptions.login))
            loginMode = parseInt(sOptions.login);
            loginMode = isNaN(loginMode) ? 0 : loginMode;
        } catch (e) { }
        try {
          if (Utils.isNotNull(sOptions.adid))
            deviceId = parseInt(sOptions.adid);
            deviceId = isNaN(deviceId) ? 0 : deviceId;
        } catch (e) { }
        try {
          if (Utils.isNotNull(sOptions.daddr))
            deviceBlueAddress = Utils.myTrim(sOptions.daddr);
        } catch (e) { }
        try {
          if (Utils.isNotNull(sOptions.alt))
            alertContent = Utils.myTrim(decodeURIComponent(sOptions.alt));
        } catch (e) { }
        if(loginMode==2){
          curPageDataOptions=app.data.curPageDataOptions;
        }
        isShowSCCompontent = Utils.myTrim(deviceBlueAddress)=="" && deviceId==0?true:false;
        that.getCurDeviceStat(appUserInfo.userId);
        that.setData({
          ["roleStatus"]: appUserInfo.roleStatus,
          ["loginMode"]: loginMode,
          ["deviceBlueAddress"]: deviceBlueAddress,
          ["deviceId"]: deviceId,
          ["isShowSCCompontent"]: isShowSCCompontent,
          ["user_roleId"]: app.data.user_roleId,

          ["curPageDataOptions"]:curPageDataOptions,
          ["alertContent"]:alertContent,
        })
        if(loginMode==0){
          app.data.isShowHomeCheirapsisAlert=true;
        }
        wx.setNavigationBarTitle({
          title: app.data.sysName
        })
        let myComponent = that.selectComponent('#myComponent');
        try{
          myComponent.setAlertContent(alertContent);
        }catch(e){}
        if (deviceId>0){
          that.analysisDeviceBluetoothAddress("", deviceId, 1);
        }else if (Utils.myTrim(deviceBlueAddress)!=""){
          that.analysisDeviceBluetoothAddress(deviceBlueAddress,0,0);
        }
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
    let that=this;
    app.data.pageLayerTag = "../../";
    that.setData({
      ["user_roleId"]: app.data.user_roleId,
    })
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        that.setData({
          ["isShowSCCompontent"]: true,
        })
        console.log("onShow ...")
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：分析蓝牙地址
  //tag:0分析地址，1分析ID
  analysisDeviceBluetoothAddress: function (deviceBlueAddress,deviceId,tag) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    getDeviceTag=tag;
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
    let that = this, deviceId = 0, companyId = 0, deviceBlueAddress = that.data.deviceBlueAddress, address = "", status = 1, dtNowStr = "", dtDeviceStr = "", isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date(), userId = 0, isDeviceUsing = false,isDeviceOtherUsing=true;
    
    that.data.isLoad=true;
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
    //getDeviceTag
    that.gotoNextPage2(deviceId, companyId, deviceBlueAddress, address, status, isDeviceUsing, time);
  },
  //方法：跳转下一页面
  gotoNextPage2: function (deviceId, companyId, deviceBlueAddress, address, status, isDeviceUsing, time) {
    console.log("gotoNextPage2:" + deviceId + "," + companyId + ",'" + address + "'," + status + "," + isDeviceUsing + "," + time)
    let that = this, loginMode = that.data.loginMode;
    let url = "";
    that.setData({
      ["deviceBlueAddress"]: deviceBlueAddress,
      ["agentDeviceId"]: deviceId,
    })
    //获取tabbar内容
    app.getTabBarList(that,app.data.companyId,true);
   
    if (Utils.isNotNull(app.data.timeInternelQueryDevice)) clearInterval(app.data.timeInternelQueryDevice);
    switch (loginMode) {
      //切换设备
      case 1:
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 2];   //上个页面
        if (app.data.agentDeviceId > 0 && status== 1) {
          wx.showModal({
            title: '提示',
            content: '该设备未绑定，您确定切换吗？',
            success(res) {
              if (res.confirm) {
                app.data.agentDeviceId = deviceId;
                app.data.agentDeviceStatus = status;
                app.data.agentCompanyId = companyId;
                app.data.agentPutAddress = address;
                app.data.agentDeviceAddress=deviceBlueAddress;
                // 直接给上一个页面赋值
                prevPage.setData({
                  deviceId: deviceId,
                  deviceAddress: deviceBlueAddress,
                });
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          app.data.agentDeviceId = deviceId;
          app.data.agentDeviceStatus = status;
          app.data.agentCompanyId = companyId;
          app.data.agentPutAddress = address;
          app.data.agentDeviceAddress=deviceBlueAddress;
          
          url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork";
          console.log("gotoCheirapsisPage:" + url)
          wx.redirectTo({
            url: url
          });
        }
        break;
      //扫码后自动跳转原页面
      case 2:
        app.data.agentDeviceId = deviceId;
        app.data.agentDeviceStatus = status;
        app.data.agentCompanyId = companyId;
        app.data.agentPutAddress = address;
        app.data.agentDeviceAddress=deviceBlueAddress;
        that.setData({
          ["deviceId"]: deviceId,
        })
        app.gotoBackRegPage(that);
        break;

      //首页登录
      default:
        app.data.agentDeviceId = deviceId;
        app.data.agentDeviceStatus = status;
        app.data.agentCompanyId = companyId;
        app.data.agentPutAddress = address;
        app.data.agentDeviceAddress=deviceBlueAddress;
        that.setData({
          ["deviceId"]: deviceId,
        })
        //如果：【1】当前用户正在使用该设备；【2】设备未绑定公司非线上运营状态；则跳转操控界面
        if (time>0 || app.data.agentDeviceStatus ==1){
          let url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?blueaddr=" + encodeURIComponent(deviceBlueAddress);
          console.log("gotoNextPage:" + url);
          wx.navigateTo({
            url: url
          });
        }else {
          app.getDeviceCompanyPageUrl(that,companyId);
        }
        break;
    }
  },
  //方法：获取设备公司默认跳转页结果处理函数
  dowithGetDeviceCompanyPageUrl: function (dataList, tag, errorInfo) {
    let that = this,isHaveDefaultPageUrl=false,defaultPageUrl="";;
    switch (tag) {
      case 1:
        console.log("获取设备公司默认跳转页结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let data = dataList.dataList, dataItem = null;
          for (let i = 0; i < data.length; i++) {
            dataItem = null; dataItem = data[i]; 
            if (dataItem.pageUrl != null && dataItem.pageUrl != undefined && Utils.myTrim(dataItem.pageUrl + "") != "null" && Utils.myTrim(dataItem.pageUrl + "") != "") {
              defaultPageUrl=Utils.myTrim(dataItem.pageUrl);isHaveDefaultPageUrl=true;break;
            }
          }
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无设备公司默认跳转页信息！";
        break;
    }
    
    //如果设备归属公司有设备默认跳转页面
    if(isHaveDefaultPageUrl){
      wx.reLaunch({
        url: "../../" + defaultPageUrl,
        fail:function(res){
          if (Utils.isNotNull(isHaveViewAlert) && Utils.myTrim(isHaveViewAlert) == "1") {
            wx.switchTab({
              url: mainPackageUrl + "/alittle/alittle"
            });
          } else {
            wx.navigateTo({
              url: mainPackageUrl + "/safetyguideline/safetyguideline"
            });
          } 
        }
      });
    }else{
      let isHaveViewAlert = "0";
      isHaveViewAlert = app.getCacheValue("noticeview-" + app.data.version + "-" + app.data.wxAppId);
      if (Utils.isNotNull(isHaveViewAlert) && Utils.myTrim(isHaveViewAlert) == "1") {
        wx.switchTab({
          url: mainPackageUrl + "/alittle/alittle"
        });
      } else {
        wx.navigateTo({
          url: mainPackageUrl + "/safetyguideline/safetyguideline"
        });
      } 
    }
  },
  //事件：首页扫码跳转事件
  onScanOnIndex: function (e) {
    let that = this, deviceId = 0, companyId = 0, deviceBlueAddress = "", address = "", status = 1, isDeviceUsing = false, time=0;
    try {
      time = parseInt(e.detail.time);
      time = isNaN(time) ? 0 : time;
    } catch (e) { }
    try {
      deviceId = parseInt(e.detail.did);
      deviceId = isNaN(deviceId) ? 0 : deviceId;
    } catch (e) { }
    try {
      status = parseInt(e.detail.status);
      status = isNaN(status) ? 1 : status;
    } catch (e) { }
    try {
      companyId = parseInt(e.detail.dcid);
      companyId = isNaN(companyId) ? 0 : companyId;
    } catch (e) { }
    try {
      deviceBlueAddress = Utils.myTrim(decodeURIComponent(e.detail.daddr));
    } catch (e) { }
    try {
      address = Utils.myTrim(decodeURIComponent(e.detail.address));
    } catch (e) { }
    try {
      isDeviceUsing = e.detail.isDeviceUsing;
    } catch (e) { }
    
    that.gotoNextPage2(deviceId, companyId, deviceBlueAddress, address, status, isDeviceUsing, time);
  },
  //事件：其他页扫码跳转事件
  onScanOnOther: function (e) {
    let that = this, deviceId = 0, companyId = 0, deviceBlueAddress = "", address = "", status = 1, isDeviceUsing = false, time = 0;
    try {
      time = parseInt(e.detail.time);
      time = isNaN(time) ? 0 : time;
    } catch (e) { }
    try {
      deviceId = parseInt(e.detail.did);
      deviceId = isNaN(deviceId) ? 0 : deviceId;
    } catch (e) { }
    try {
      status = parseInt(e.detail.status);
      status = isNaN(status) ? 1 : status;
    } catch (e) { }
    try {
      companyId = parseInt(e.detail.dcid);
      companyId = isNaN(companyId) ? 0 : companyId;
    } catch (e) { }
    try {
      deviceBlueAddress = Utils.myTrim(decodeURIComponent(e.detail.daddr));
    } catch (e) { }
    try {
      address = Utils.myTrim(decodeURIComponent(e.detail.address));
    } catch (e) { }
    try {
      isDeviceUsing = e.detail.isDeviceUsing;
    } catch (e) { }

    that.gotoNextPage2(deviceId, companyId, deviceBlueAddress, address, status, isDeviceUsing, time);
  },
  //事件：跳转页面处理
  onGotoPage:function(e){
    let that = this, loginMode = that.data.loginMode, url = "", paramList = "";
    console.log(e);
    try {
      url = Utils.myTrim(decodeURIComponent(e.detail.path));
    } catch (e) { }
    if (Utils.myTrim(url)!="" && url.indexOf("?scene=")>=0){
      let pathArray = url.split("?"),path="";
      path=pathArray[0];
      if(pathArray.length>1){
        paramList=pathArray[1];
        paramList = decodeURIComponent(paramList);
        paramList = Utils.myTrim(paramList) != "" ? paramList.replace("scene=",""):"";
      }
    }
    console.log(paramList)
    if (Utils.myTrim(paramList) != "") {
      let paramArray = paramList.split("=");
      if (paramArray.length >= 2) {
        switch (Utils.myTrim(paramArray[0])) {
          case "adid":
            let deviceId=0;
            try{
              deviceId=parseInt(paramArray[1]);
              deviceId=isNaN(deviceId)?0:deviceId;
            }catch(e){}
            that.analysisDeviceBluetoothAddress("", deviceId, 1);
            break;

          case "daddr":
            that.analysisDeviceBluetoothAddress(paramArray[1], 0, 0);
            break;
        }
      }
    }
  },
  kkk:function(){
    let that=this;
    wx.switchTab({
      url: '../../pages/store/store',
    })
  },
  changeball(e) {
    this.setData({
      ball: !this.data.ball,
    })
  },
  changeba(e) {
    if (e.changedTouches[0].clientX > 200) {
      this.setData({
        ball: !this.data.ball,
        scrollX: 400,
        scrollY: e.changedTouches[0].clientY - 45
      })
    } else {
      this.setData({
        ball: !this.data.ball,
        scrollX: 0,
        scrollY: e.changedTouches[0].clientY - 45
      })
    }
  },
  returnCheirapsisPage: function () {
    let that = this,
      url = "";
    url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?did=" + app.data.agentDeviceId;
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },

  //方法：获取当前所使用设备
  getCurDeviceStat: function (userId) {
    let that = this, otherConParams = "&userId=" + userId;
    app.getSyncDeviceStatusInfo(that, otherConParams, -1);
  },
  //方法：获取同步设备状态信息结果处理函数
  dowithGetSyncDeviceStatusInfo: function (dataList, tag, operateTag, errorInfo) {
    let that = this, viewOTTag = 2, dtNowStr = "", dtDeviceStr = "", address = "", deviceId = 0, deviceCompanyId = app.data.agentCompanyId, status = 1;
    dtNowStr = Utils.myTrim(Utils.getDateTimeStr((new Date()), "-", false));
    switch (tag) {
      case 1:
        console.log("获取同步设备状态信息结果");
        console.log(dataList)

        if (Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let deviceStatusArray = dataList.dataList,dataItem=null;
          let isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date();
          for (let i = 0; i < deviceStatusArray.length;i++){
            dataItem = null; dataItem = deviceStatusArray[i];
            isUsed = ""; dataUpdateTime = ""; time = 0; dtUpdate = new Date();
            isUsed = Utils.isNull(dataItem.isUsed) ? "00" : dataItem.isUsed; 
            dataUpdateTime = Utils.isNull(dataItem.dataUpdateTime) ? "" : dataItem.dataUpdateTime;

            if (Utils.myTrim(isUsed) != "" && Utils.myTrim(dataUpdateTime) != ""){
              try {
                dtUpdate = new Date(dataUpdateTime.replace(/\-/g, "/"));
              } catch (e) { }
              dtDeviceStr = Utils.myTrim(Utils.getDateTimeStr(dtUpdate, "-", false));
              //倒计时 时间
              if (Utils.myTrim(isUsed) != "") {
                time = parseInt(isUsed, 16); //16进制转10进制
              }

              if (time > 0 && dtNowStr == dtDeviceStr){
                if (Utils.isNotNull(dataItem.status)) {
                  try {
                    status = parseInt(dataItem.status);
                    status = isNaN(status) ? 1 : status;
                  } catch (e) { }
                }
                deviceId = dataItem.id;
                //0已经绑定1解绑
                if (status == 0) {
                  if (Utils.isNotNull(dataItem.companyId) && Utils.myTrim(dataItem.companyId + "") != "null") {
                    try {
                      deviceCompanyId = parseInt(dataItem.companyId);
                      deviceCompanyId = isNaN(deviceCompanyId) ? 0 : deviceCompanyId;
                    } catch (e) { }
                  }
                  address = Utils.isNotNull(dataItem.address) ? dataItem.address : "";

                  app.data.agentCompanyId = deviceCompanyId;
                  app.data.agentPutAddress = address;
                }
                app.data.agentDeviceId = deviceId;
                app.data.agentDeviceStatus = status;

                viewOTTag = 1;
                break;
              } 
            }
          }
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "同步失败！";
        break;
    }
    that.setData({
      ["viewOTTag"]: viewOTTag,
    })
    let myComponent = that.selectComponent('#myComponent');
    try{
      myComponent.setViewOTTag(viewOTTag);
    }catch(e){}
    
  },
})
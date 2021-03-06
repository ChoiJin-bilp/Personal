// components/scanCode/scanCode.js
var app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var packMainPageUrl = "../../pages";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    DataURL: {
      type: String,
      value: ""
    },
    deviceNo: {
      type: String,
      value: ""
    },
    loginMode:{
      type:Number,
      value:0
    },
    roleStatus: {
      type:Number,
      value: 0
    },
    user_roleId: {
      type: Number,
      value: 0
    },
    osTag: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    deviceBlueAddress:"",
    tabBar: [
      {
        "current": 0,
        "selectedIconPath": "../../images/curstore.png",
        "iconPath": "../../images/store.png",
        "pagePath": "../../"+app.data.storeShareMainPage,
        "text": "购物"
      },
      {
        "current": 0,
        "selectedIconPath": "../../images/mine.png",
        "iconPath": "../../images/nomine.png",
        "pagePath": "../../pages/mine/mine",
        "text": "我的"
      }
    ],
    viewOTTag:0,
    alertContent:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //事件：扫码操作
    //说明：扫到设备二维码赋予变量deviceCheirapsisCode（同时保存到APP公共变量“deviceCheirapsisCode”），并且切换界面到按摩器运作界面
    scanQRCode: function (e) {
      let that = this, osTag = that.data.osTag, deviceBlueAddress = "",pathUrl="";
      wx.scanCode({
        success: (res) => {
          console.log("扫描获取信息===>", res)
          console.log("地址字符串：", res.result)//地址字符窜
          
          if (Utils.isNotNull(res.path) && Utils.myTrim(res.path) != ""){
            let packageName="", pageUrl="", posStart = 0, posEnd = res.path.length;
            try {
              posEnd = res.path.indexOf("/");
            } catch (e) { }
            packageName = res.path.substring(posStart, posEnd);
            if (packageName == "pages" || packageName == "packageCommercial" || packageName == "packageOther" || packageName == "packageSMall" || packageName == "packageYK" || packageName == "packageVP"){
              let noSceneUrl = res.path;
              noSceneUrl = noSceneUrl.replace("scene=", "")
              noSceneUrl = decodeURIComponent(noSceneUrl);
              posEnd = res.path.length;
              try {
                posEnd = res.path.indexOf("?");
              } catch (e) { }
              pageUrl = res.path.substring(posStart, posEnd);
              switch (Utils.myTrim(pageUrl)) {
                case "pages/scanCode/scanCode":
                  that.triggerEvent('gotoPage', { path: encodeURIComponent(res.path) });
                  break;
                case "pages/luckdraw/luckdraw":
                case "pages/alittle/alittle":
                case app.data.storeShareMainPage:
                case "pages/reservehotel/reservehotel":
                case "pages/mine/mine":
                  wx.reLaunch({
                    url: "../../" + noSceneUrl,
                  })
                  break;
                default:
                  wx.navigateTo({
                    url: "../../" + noSceneUrl,
                  })
                  break;
              }
            }else{
              wx.showToast({
                title: "无效二维码！",
                icon: 'none',
                duration: 1500
              })
            }
          }else{
            deviceBlueAddress = app.getDeviceAddressByQRCode(res.result, 0);

            if (Utils.myTrim(deviceBlueAddress) != "") {
              console.log("获取设备地址===>", deviceBlueAddress)
              that.setData({
                ["deviceBlueAddress"]: deviceBlueAddress,
              })

              //下一步分析蓝牙地址
              that.analysisDeviceBluetoothAddress(deviceBlueAddress);
            } else {
              wx.showToast({
                title: "无效二维码！",
                icon: 'none',
                duration: 1500
              })
            }
          }
        }
      })
    },
    //事件：页面控件值变更事件
    changeValueMainData: function (e) {
      var that = this;

      console.log("changeValueMainData----------")
      var cid = e.currentTarget.dataset.cid;
      // 获取输入框的内容
      var value = e.detail.value;
      // 获取输入框内容的长度
      var len = Utils.getStrlengthB(value);
      switch (cid) {
        case "keyword":
          that.setData({
            ["deviceNo"]: value
          })
          break;
      }
    },
    //事件：确定输入设备编号
    submitInputDeviceAddress: function (e) {
      let that = this, deviceNo = that.data.deviceNo;
      if (Utils.isNull(deviceNo)) {
        wx.showToast({
          title: "设备编号不能为空！",
          icon: 'none',
          duration: 1500
        })
        return;
      }

      let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
      otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceNo);
      otherParamCon += "&pageSize=99&pageIndex=1";
      app.getDeviceList(that, otherParamCon);
    },
    //方法：分析蓝牙地址
    analysisDeviceBluetoothAddress: function (deviceBlueAddress) {
      let that = this, osTag = that.data.osTag, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
      switch (app.data.communicationType){
        case 0:
          switch (osTag) {
            case 1:
              otherParamCon += "&bluetoothAddress=" + encodeURIComponent(deviceBlueAddress);
              break;
            case 2:
              otherParamCon += "&iosBluetoothAddress=" + encodeURIComponent(deviceBlueAddress);
              break;
          }
          break;

        case 1:
          otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceBlueAddress);
          break;
      }
      
      otherParamCon += "&pageSize=99&pageIndex=1";
      app.getDeviceList(that, otherParamCon);
    },
    //方法：获取设备结果处理函数
    dowithGetDeviceList: function (dataList, tag, errorInfo) {
      let that = this, osTag = that.data.osTag, deviceId = 0, companyId = 0, deviceBlueAddress = that.data.deviceBlueAddress, address = "", status = 1, dtNowStr = "", dtDeviceStr = "", isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date(), userId=0,isDeviceUsing=false,isDeviceOtherUsing=true;
      if(osTag<=0){
        osTag = Utils.isNotNull(app.data.currentOS) && app.data.currentOS.osTag >= 1 ? app.data.currentOS.osTag : 1;
      }
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
            if (Utils.isNotNull(dataItem.status)){
              try{
                status = parseInt(dataItem.status);
                status=isNaN(status)?1:status;
              }catch(e){}
            }
            
            //0已经绑定1解绑
            if(status==0){
              if (Utils.isNotNull(dataItem.companyId)) {
                try {
                  companyId = parseInt(dataItem.companyId);
                  companyId = isNaN(companyId) ? 1 : companyId;
                } catch (e) { }
              }
              address = Utils.isNotNull(dataItem.address) ? dataItem.address : "";
            }
            deviceBlueAddress = Utils.isNotNull(dataItem.deviceAddress) ? dataItem.deviceAddress : "";

            that.setData({
              ["deviceBlueAddress"]: deviceBlueAddress,
            })
          }
          break;
        default:
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
          break;
      }
      that.gotoNextPage(deviceId, companyId, address, status, isDeviceUsing, time);
    },
    //方法：跳转下一页面
    gotoNextPage: function (deviceId, companyId, address, status,isDeviceUsing,time) {
      let that = this, loginMode = that.data.loginMode, deviceBlueAddress = that.data.deviceBlueAddress;
      switch (loginMode) {
        //切换设备
        case 1:
          that.triggerEvent('scanOnOther', { did: deviceId, dcid: companyId, daddr: encodeURIComponent(deviceBlueAddress), address: encodeURIComponent(address), status: status, isDeviceUsing: isDeviceUsing, time: time });
          break;

        //首页登录
        default:
          let url = "";
          app.data.agentDeviceId = deviceId;
          app.data.agentCompanyId=companyId;
          app.data.agentPutAddress = address;
          app.data.agentDeviceStatus = status;
          that.triggerEvent('scanOnIndex', { did: deviceId, dcid: companyId, daddr: encodeURIComponent(deviceBlueAddress), address: encodeURIComponent(address), status: status, isDeviceUsing: isDeviceUsing, time: time});
          break;
      }
    },
    //事件：跳转页面
    gotoPage: function (e) {
      //pagetype：0普通页面，1tabbar页面
      //package：包名简写
      //pagename：页面名称
      let that = this, pagetype = 0, isCheckAuditStat = 0, packageName = e.currentTarget.dataset.package, pagename = e.currentTarget.dataset.page, url = "";
      try {
        pagetype = parseInt(e.currentTarget.dataset.pagetype);
        pagetype = isNaN(pagetype) ? 0 : pagetype;
      } catch (e) { }
      try {
        isCheckAuditStat = parseInt(e.currentTarget.dataset.isaudit);
        isCheckAuditStat = isNaN(isCheckAuditStat) ? 0 : isCheckAuditStat;
      } catch (e) { }
      app.gotoPage(that, "../../", 0, pagetype, packageName, pagename, 0);
    },
    
    setViewOTTag: function (viewOTTag){
      let that=this;
      that.setData({
        ["viewOTTag"]: viewOTTag,
      })
    },
    setAlertContent: function (alertContent){
      let that=this;
      that.setData({
        ["alertContent"]: alertContent,
      })
    }
  }
})

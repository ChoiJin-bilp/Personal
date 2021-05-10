// packageYK/pages/deviceAdmin/deviceAdmin.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  Differenheight = app.globalData.differenheight,
  SMDataURL = app.getUrlAndKey.dataUrl; 
var appUserInfo = app.globalData.userInfo, timeOutRefresh = null, scanQrTag = 0,pageSize = 20;
var packMainPageUrl = "../../../pages", packYKPageUrl = "../../../packageYK/pages",testNum=0;
Page({
  /**
   * 页面的初始数据
  */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    Differenheight: Differenheight,
    communicationType: app.data.communicationType,
    curAccountRecordId:0,

    deviceCount: 0,
    onlineCount: 0,

    mainDataInfo: null,
    agentUserCompanyList: [],

    isShowDeviceDetailPop: false,      //是否显示设备详情弹窗
    isShowSelectCompanyList: false,    //是否显示公司下拉选择

    number_max: 30,
    model_max: 50,
    bluetoothAddress_max: 100,
    deviceAddress_max: 100,
    address_max:100,

    selDeviceCompanyName: "",
    selDeviceCompanyId:0,

    scanDeviceAddress:"",    //当前扫码设备地址
    tmpDeviceAddress:"",     //临时设备地址

    roleStatus:0,

    searchKeyword:"",               //搜索关键字
    searchDeviceId:0,               //搜索设备ID
    searchQRCodeId:0,               //搜索小程序二维码记录ID
    searchQRCodeDeviceAddress: "",  //搜索二维码设备地址

    searchAdminUserId:1,            //针对平台用户：0查看所有设备，1查看自己绑定的设备

    isSetupDeviceClass:false,       //是否设置设备分类
    isShowDClassEditPop:false,          //是否显示设备分类编辑弹窗
    titleDClassEditPop:"分类新增",
    deviceClass_max:40,
    dClassData:null,
    dClassDataList:[],
    curDClassIndex:-1,
    searchDClassId:0,                //搜索设备分类ID

    selDeviceClass:"",
    isShowSelectClassList:false,

    isAdminRole:false,               //是否平台用户
    lastMRecordId:0,                 //上次修改或新增记录ID
    curUserId:0,                     //当前用户ID

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    appUserInfo = app.globalData.userInfo;
    that.setData({
      ["curAccountRecordId"]: app.data.accountRecordId,
      ["curUserId"]: appUserInfo.userId,
      ["agentUserCompanyList"]: app.data.agentUserCompanyList,
      ["roleStatus"]: appUserInfo.roleStatus,
      ["isAdminRole"]: app.data.user_roleId == 2 || app.data.user_roleId == 5,
    })
    that.loadInitData();
    
    that.getDeviceClassList();
  },
  //方法：格式化设备详情
  formatMainDataInfo: function (data,isBindCompany) {
    let that = this, mainDataInfo = null;
    let agentUserCompanyList = that.data.agentUserCompanyList, selDeviceCompanyName = "", selDeviceCompanyId = 0, dClassDataList = that.data.dClassDataList, selDeviceClass = "";
    if (Utils.isNotNull(data)) {
      mainDataInfo = {
        id: data.id,
        deviceNo: Utils.isNotNull(data.deviceNo) ? data.deviceNo : "",
        number: Utils.isNotNull(data.number) ? data.number : "",
        model: Utils.isNotNull(data.model) ? data.model : "",
        bluetoothAddress: Utils.isNotNull(data.bluetoothAddress) ? data.bluetoothAddress : "",
        iosBluetoothAddress: Utils.isNotNull(data.iosBluetoothAddress) ? data.iosBluetoothAddress : "",
        deviceAddress: Utils.isNotNull(data.deviceAddress) ? data.deviceAddress : "",
        address: Utils.isNotNull(data.address) ? data.address : "",
        // 0上线1下线
        status: Utils.isNotNull(data.status) ? data.status : 0,
        adminUserId: Utils.isNotNull(data.adminUserId) ? data.adminUserId : that.data.curAccountRecordId,
        contact: Utils.isNotNull(data.contact) ? data.contact : appUserInfo.userName,
        companyId: Utils.isNotNull(data.companyId) ? data.companyId : 0,
        companyName: Utils.isNotNull(data.companyName) ? data.companyName : "",
        devicesClassId: Utils.isNotNull(data.devicesClassId) ? data.devicesClassId : 0,
        updateDate: Utils.getDateTimeStr2((new Date()),"-",true),
        updateBy: appUserInfo.userId,
      }
     
      if (agentUserCompanyList.length > 0) {
        if (Utils.isNotNull(mainDataInfo)) {
          for (let i = 0; i < agentUserCompanyList.length; i++) {
            if (agentUserCompanyList[i].id == mainDataInfo.companyId) {
              selDeviceCompanyName = agentUserCompanyList[i].companyName;
              selDeviceCompanyId = agentUserCompanyList[i].id;
              break;
            }
          }
        } else {
          selDeviceCompanyName = agentUserCompanyList[0].companyName;
          selDeviceCompanyId = agentUserCompanyList[0].id;
        }
      }
      if (dClassDataList.length > 0 && mainDataInfo.devicesClassId > 0) {
        for (let i = 0; i < dClassDataList.length; i++) {
          if (dClassDataList[i].id == mainDataInfo.devicesClassId) {
            selDeviceClass = dClassDataList[i].title;
            break;
          }
        }
      }
    } else {
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      
      mainDataInfo = {
        id: 0,
        deviceNo: timestamp,
        number: "",
        model: "",
        bluetoothAddress: "",
        iosBluetoothAddress:"",
        deviceAddress: "",
        address:"",
        // 0上线1下线
        status: 0,
        adminUserId: that.data.curAccountRecordId,
        contact: appUserInfo.userName,
        companyId: 0,
        companyName:"",
        devicesClassId:0,
      }
      if (agentUserCompanyList.length > 0) {
        selDeviceCompanyName = agentUserCompanyList[0].companyName;
        selDeviceCompanyId = agentUserCompanyList[0].id;
      }
      mainDataInfo.companyId = selDeviceCompanyId;
      mainDataInfo.companyName = selDeviceCompanyName;
    }
    if (isBindCompany) {
      that.setData({
        ["selDeviceCompanyName"]: selDeviceCompanyName,
        ["selDeviceCompanyId"]: selDeviceCompanyId,

        ["selDeviceClass"]: selDeviceClass,
      })
    } else {
      that.setData({
        ["selDeviceClass"]: selDeviceClass,
      })
    }
    return mainDataInfo;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo == undefined) {
      return;
    } else {
      if (!that.data.isLoad)
        that.data.isLoad = true;
      else {
        that.setData({
          ["agentUserCompanyList"]: app.data.agentUserCompanyList
        })
        console.log("onShow")
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutRefresh != null && timeOutRefresh != undefined) clearTimeout(timeOutRefresh);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutRefresh != null && timeOutRefresh != undefined) clearTimeout(timeOutRefresh);
    } catch (err) { }
  },
  //事件：扫码搜索
  scanQRCodeSearchEvent:function(e){
    let that = this, searchQRCodeId = 0, searchQRCodeDeviceAddress="";
    wx.scanCode({
      success: (res) => {
        console.log("扫描获取信息===>", res)
        console.log("地址字符串：", res.result)//地址字符窜

        if (Utils.isNotNull(res.path)) {
          if (res.path.indexOf("scanCode/scanCode") >= 0) {
            if (res.path.indexOf("?scene=") >= 0) {
              let pathArray = res.path.split("?"), path = "", paramList = "";
              path = pathArray[0];
              if (pathArray.length > 1) {
                paramList = pathArray[1];
                paramList = decodeURIComponent(paramList);
                paramList = Utils.myTrim(paramList) != "" ? paramList.replace("scene=", "") : "";
              }
              if (Utils.myTrim(paramList) != "") {
                let paramArray = paramList.split("=");
                if (paramArray.length >= 2 && Utils.myTrim(paramArray[0]) == "adid") {
                  try {
                    searchQRCodeId = parseInt(paramArray[1]);
                    searchQRCodeId = isNaN(searchQRCodeId) ? 0 : searchQRCodeId;
                  } catch (e) { }
                }
              }
            }
          }

          if (searchQRCodeId > 0) {
            that.setData({
              ["searchQRCodeId"]: searchQRCodeId,
            })
            that.searchMainDataInfo();
          } else {
            wx.showToast({
              title: "无效小程序码！",
              icon: 'none',
              duration: 1500
            })
          }
        }else{
          searchQRCodeDeviceAddress = app.getDeviceAddressByQRCode(res.result, 0);

          if (Utils.myTrim(searchQRCodeDeviceAddress) != "") {
            console.log("获取设备地址===>", searchQRCodeDeviceAddress)
            that.setData({
              ["searchQRCodeDeviceAddress"]: searchQRCodeDeviceAddress,
            })
            that.searchMainDataInfo();
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
  //事件：扫码添加设备
  scanQRCodeAddDeviceEvent() {
    let that = this, bluetoothAddress = "";
    wx.scanCode({
      success: (res) => {
        console.log("扫描获取信息===>", res)
        console.log("地址字符串：", res.result)//地址字符窜

        if (Utils.isNotNull(res.path)) {
          if (res.path.indexOf("scanCode/scanCode") >= 0 && res.path.indexOf(" ? scene =") >= 0) {
            let url = res.path, pathArray = url.split("?"), path = "", paramList = "";
            path = pathArray[0];
            if (pathArray.length > 1) {
              paramList = pathArray[1];
              paramList = decodeURIComponent(paramList);
              paramList = Utils.myTrim(paramList) != "" ? paramList.replace("scene=", "") : "";
            }
            if (Utils.myTrim(paramList) != "") {
              let paramArray = paramList.split("=");
              if (paramArray.length >= 2) {
                switch (Utils.myTrim(paramArray[0])) {
                  case "adid":
                    let deviceId = 0;
                    try {
                      deviceId = parseInt(paramArray[1]);
                      deviceId = isNaN(deviceId) ? 0 : deviceId;
                    } catch (e) { }
                    that.getDeviceInfo("", deviceId, 1);
                    break;

                  case "daddr":
                    that.setData({
                      ["scanDeviceAddress"]: paramArray[1],
                    })
                    that.getDeviceInfo(paramArray[1], 0, 0);
                    break;
                }
              }
            }
          } else {
            wx.showToast({
              title: "无效二维码！",
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          let deviceBlueAddress = app.getDeviceAddressByQRCode(res.result, 0);

          if (Utils.myTrim(deviceBlueAddress) != "") {
            console.log("获取设备地址===>", deviceBlueAddress)
            that.setData({
              ["scanDeviceAddress"]: deviceBlueAddress,
            })
            that.getDeviceInfo(deviceBlueAddress, 0, 0);
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
  //事件：扫码事件
  scanQRCodeEvent: function (e) {
    let that = this, tag = 0, scanQRDeviceId = 0, scanQRDeviceAddress = "";
    //tag：0扫码搜索，1扫码添加设备，2设备绑定扫码小程序码，3设备绑定扫码设备码
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    scanQrTag = tag;
    wx.scanCode({
      success: (res) => {
        console.log("扫描获取信息===>", res)
        console.log("地址字符串：", res.result)//地址字符窜

        if (Utils.isNotNull(res.path)) {
          let isValidAppQRCode=false;
          if (res.path.indexOf("scanCode/scanCode") >= 0) {
            if (res.path.indexOf("?scene=") >= 0) {
              let pathArray = res.path.split("?"), path = "", paramList = "";
              path = pathArray[0];
              if (pathArray.length > 1) {
                paramList = pathArray[1];
                paramList = decodeURIComponent(paramList);
                paramList = Utils.myTrim(paramList) != "" ? paramList.replace("scene=", "") : "";
              }
              if (Utils.myTrim(paramList) != "") {
                let paramArray = paramList.split("=");
                if (paramArray.length >= 2) {
                  switch (Utils.myTrim(paramArray[0])) {
                    case "adid":
                      isValidAppQRCode=true;
                      try {
                        scanQRDeviceId = parseInt(paramArray[1]);
                        scanQRDeviceId = isNaN(scanQRDeviceId) ? 0 : scanQRDeviceId;
                      } catch (e) { }

                      //tag：0扫码搜索，1扫码添加设备，2设备绑定扫码小程序码，3设备绑定扫码设备码
                      switch(tag){
                        //扫码搜索
                        case 0:
                          if (scanQRDeviceId > 0) {
                            that.setData({
                              ["searchQRCodeId"]: scanQRDeviceId,
                            })
                            that.searchMainDataInfo();
                          } else {
                            wx.showToast({
                              title: "无效小程序码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码添加设备
                        case 1:
                          if (scanQRDeviceId > 0) {
                            that.getDeviceInfo("", scanQRDeviceId, 1);
                          } else {
                            wx.showToast({
                              title: "无效小程序码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码设备绑定小程序码
                        case 2:
                          if (scanQRDeviceId > 0) {
                            that.getDeviceInfo("", scanQRDeviceId, 1);
                          } else {
                            wx.showToast({
                              title: "无效小程序码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码设备绑定设备码
                        case 3:
                          wx.showToast({
                            title: "无效二维码！",
                            icon: 'none',
                            duration: 1500
                          })
                          break;
                      }
                      break;

                    case "daddr":
                      isValidAppQRCode=true;
                      scanQRDeviceAddress = Utils.myTrim(paramArray[1]);
                      //tag：0扫码搜索，1扫码添加设备，2设备绑定扫码小程序码，3设备绑定扫码设备码
                      switch (tag) {
                        //扫码搜索
                        case 0:
                          if (Utils.myTrim(scanQRDeviceAddress) != "") {
                            console.log("获取设备地址===>", scanQRDeviceAddress)
                            that.setData({
                              ["searchQRCodeDeviceAddress"]: scanQRDeviceAddress,
                            })
                            that.searchMainDataInfo();
                          } else {
                            wx.showToast({
                              title: "无效二维码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码添加设备
                        case 1:
                          if (Utils.myTrim(scanQRDeviceAddress) != "") {
                            that.setData({
                              ["scanDeviceAddress"]: scanQRDeviceAddress,
                            })
                            that.getDeviceInfo(scanQRDeviceAddress, 0, 0);
                          } else {
                            wx.showToast({
                              title: "无效二维码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码设备绑定小程序码
                        case 2:
                          if (Utils.myTrim(scanQRDeviceAddress) != "") {
                            that.setData({
                              ["scanDeviceAddress"]: scanQRDeviceAddress,
                            })
                            that.getDeviceInfo(scanQRDeviceAddress, 0, 0);
                          } else {
                            wx.showToast({
                              title: "无效二维码！",
                              icon: 'none',
                              duration: 1500
                            })
                          }
                          break;
                        //扫码设备绑定设备码
                        case 3:
                          wx.showToast({
                            title: "无效二维码！",
                            icon: 'none',
                            duration: 1500
                          })
                          break;
                      }
                      break;
                  }
                }
              }
            }
          }

          if (!isValidAppQRCode) {
            wx.showToast({
              title: "无效小程序码！",
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          scanQRDeviceAddress = app.getDeviceAddressByQRCode(res.result, 0);
          //tag：0扫码搜索，1扫码添加设备，2设备绑定扫码小程序码，3设备绑定扫码设备码
          switch (tag) {
            //扫码搜索
            case 0:
              if (Utils.myTrim(scanQRDeviceAddress) != "") {
                console.log("获取设备地址===>", scanQRDeviceAddress)
                that.setData({
                  ["searchQRCodeDeviceAddress"]: scanQRDeviceAddress,
                })
                that.searchMainDataInfo();
              } else {
                wx.showToast({
                  title: "无效二维码！",
                  icon: 'none',
                  duration: 1500
                })
              }
              break;
            //扫码添加设备
            case 1:
              if (Utils.myTrim(scanQRDeviceAddress) != "") {
                that.setData({
                  ["scanDeviceAddress"]: scanQRDeviceAddress,
                })
                that.getDeviceInfo(scanQRDeviceAddress, 0, 0);
              } else {
                wx.showToast({
                  title: "无效二维码！",
                  icon: 'none',
                  duration: 1500
                })
              }
              break;
            //扫码设备绑定小程序码
            case 2:
              wx.showToast({
                title: "无效二维码！",
                icon: 'none',
                duration: 1500
              })
              break;
            //扫码设备绑定设备码
            case 3:
              if (Utils.myTrim(scanQRDeviceAddress) != "") {
                console.log("获取设备地址===>", scanQRDeviceAddress)
                that.setData({
                  ["curDeviceAddress"]: scanQRDeviceAddress,
                })
                //下一步分析蓝牙地址
                that.getDeviceInfo(scanQRDeviceAddress, 0, 0);
              } else {
                wx.showToast({
                  title: "无效二维码！",
                  icon: 'none',
                  duration: 1500
                })
              }
              break;
          }
        }
      }
    })
  },
  //事件：添加设备
  addDeviceInfoEvent:function(e){
    let that = this, mainDataInfo=null;
    mainDataInfo = that.formatMainDataInfo(null,true);
    that.setData({
      ["mainDataInfo"]: mainDataInfo,

      ["isShowDeviceDetailPop"]:true,
    })
  },
  
  //方法：分析蓝牙地址
  getDeviceInfo: function (deviceBlueAddress, deviceId, tag) {
    let that = this, osTag = that.data.osTag, otherParamCon = "&xcxAppId=" + app.data.wxAppId;

    if (Utils.myTrim(deviceBlueAddress)!=""){
      that.data.scanDeviceAddress = Utils.myTrim(deviceBlueAddress);
    }
    if (tag == 0) {
      otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceBlueAddress);
    } else {
      otherParamCon += "&id=" + deviceId;
    }

    otherParamCon += "&pageSize=99&pageIndex=1";
    app.getDeviceList(that, otherParamCon);
  },
  //方法：获取设备结果处理函数
  dowithGetDeviceList: function (dataList, tag, errorInfo) {
    let that = this, deviceId = 0, deviceCompanyId = 0, deviceGprsAddress = "", number = "", status = 1, userId = 0;
    switch (tag) {
      case 1:
        console.log("获取设备结果222：");
        console.log(dataList);
        console.log("1")
        let mainDataInfo = that.data.mainDataInfo, dataItem=null,isExistRecord=false,modelId=-1,modelName="",isCanOperate=true;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          //数据库已有记录
          isExistRecord=true;
          dataItem = dataList.dataList[0];
          that.data.scanDeviceAddress = deviceGprsAddress;
          deviceId = dataItem.id;
          if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress) != "null") {
            deviceGprsAddress = Utils.myTrim(dataItem.deviceAddress);
          }
          if (Utils.isNotNull(dataItem.number) && Utils.myTrim(dataItem.number) != "null") {
            number = Utils.myTrim(dataItem.number);
          }
          if (Utils.isNotNull(dataItem.status)) {
            try {
              status = parseInt(dataItem.status);
              status = isNaN(status) ? 1 : status;
            } catch (e) { }
          }
          if (Utils.isNotNull(dataItem.adminUserId)) {
            try {
              userId = parseInt(dataItem.adminUserId);
              userId = isNaN(userId) ? 0 : userId;
            } catch (e) { }
          }
          isCanOperate = status == 0 && userId != that.data.curAccountRecordId?false:true;
        }
        console.log("2")
        console.log("scanQrTag:" + scanQrTag)
        let agentUserCompanyList = that.data.agentUserCompanyList, selDeviceCompanyName = "", selDeviceCompanyId = 0;
        //scanQrTag：0扫码搜索，1扫码添加设备，2设备绑定扫码小程序码，3设备绑定扫码设备码
        switch (scanQrTag){
          //扫码添加设备
          case 1:
            scanQrTag = 0;
            if(isExistRecord){
              //0已经绑定，1解绑
              if (status == 0) {
                if (userId == that.data.curAccountRecordId) {
                  //二维码已经被当前用户绑定——直接获取该设备信息
                  wx.showToast({
                    title: "此设备你已经绑定！",
                    icon: 'none',
                    duration: 2000
                  })
                  mainDataInfo = that.formatMainDataInfo(dataItem,true);
                } else {
                  //二维码已经被其他用户绑定——【1】管理员直接查询该设备；【2】普通用户将二维码字段赋予空值
                  //如果是平台用户或系统管理员则可以查询其他人绑定的设备
                  if (app.data.user_roleId == 2) {
                    //管理员用户
                    wx.showModal({
                      title: '提示',
                      content: '该设备已被其他人绑定，是否查询此设备？',
                      success(res) {
                        if (res.confirm) {
                          console.log('用户点击确定');
                          that.setData({
                            ["isShowDeviceDetailPop"]: false,
                            ["searchDeviceId"]:deviceId,
                          })
                          that.loadInitData();
                          return;
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                          mainDataInfo.deviceAddress = "";
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: "该设备已被其他人绑定！",
                      icon: 'none',
                      duration: 2000
                    })
                    mainDataInfo.deviceAddress = "";
                  }
                }
              } else {
                let oldMainDataInfo = mainDataInfo;
                mainDataInfo = that.formatMainDataInfo(dataItem,false);
                //将已解绑的记录相关信息更改为自己的
                mainDataInfo.number = Utils.isNull(mainDataInfo.number) ? oldMainDataInfo.number : mainDataInfo.number;
                mainDataInfo.model = Utils.isNull(mainDataInfo.model) ? oldMainDataInfo.model : mainDataInfo.model;
                mainDataInfo.address = Utils.isNull(mainDataInfo.address) ? oldMainDataInfo.address : mainDataInfo.address;

                mainDataInfo.adminUserId = that.data.curAccountRecordId;
                mainDataInfo.contact = appUserInfo.userName;
                mainDataInfo.companyId=0;
                mainDataInfo.status = 0;
              }
            }else{
              //数据库没有记录
              mainDataInfo.deviceAddress = deviceGprsAddress;
            }
            //如果没有设置型号，且系统允许根据设备地址来判断型号
            if (Utils.myTrim(mainDataInfo.model) == "" && Utils.myTrim(mainDataInfo.deviceAddress) != "" && app.data.isSetDefaultDeviceModel && Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
              try {
                modelId = parseInt(mainDataInfo.deviceAddress.substr(0, 1));
                modelId = isNaN(modelId) ? -1 : modelId;
              } catch (e) { }
              for (let n = 0; n < app.data.defaultDeviceModels.length; n++) {
                if (app.data.defaultDeviceModels[n].id == modelId) {
                  modelName = app.data.defaultDeviceModels[n].name;
                  break;
                }
              }
              mainDataInfo.model = modelName;
            }
            
            if (agentUserCompanyList.length > 0 && mainDataInfo.companyId<=0) {
              if (Utils.isNotNull(mainDataInfo) && mainDataInfo.companyId > 0) {
                for (let i = 0; i < agentUserCompanyList.length; i++) {
                  if (agentUserCompanyList[i].id == mainDataInfo.companyId) {
                    selDeviceCompanyName = agentUserCompanyList[i].companyName;
                    selDeviceCompanyId = agentUserCompanyList[i].id;
                    break;
                  }
                }
              } else {
                selDeviceCompanyName = agentUserCompanyList[0].companyName;
                selDeviceCompanyId = agentUserCompanyList[0].id;
              }
              mainDataInfo.companyId = selDeviceCompanyId;
            }
            that.setData({
              ["mainDataInfo"]: mainDataInfo,

              ["selDeviceCompanyName"]: selDeviceCompanyName,
              ["selDeviceCompanyId"]: selDeviceCompanyId,
            })
            break;
          //扫码设备绑定小程序码
          case 2:
            scanQrTag = 0;
            if (isExistRecord) {
              if(isCanOperate){
                that.setData({
                  ["curRecordId"]: deviceId,
                })
                mainDataInfo = that.formatMainDataInfo(dataItem, true);
                mainDataInfo.adminUserId = that.data.curAccountRecordId;
                //默认设置为运营模式
                mainDataInfo.status = 0;
                that.setData({
                  ["mainDataInfo"]: mainDataInfo,
                  ["curWXNumber"]: number + "【" + deviceId + "】",
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: '对不起，该设备为运营模式状态无法添加！',
                  showCancel:false,
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }else{
              wx.showToast({
                title: "记录不存在！",
                icon: 'none',
                duration: 1500
              })
              return;
            }
            break;
          //扫码设备绑定设备码
          case 3:
            console.log("3")
            scanQrTag = 0;
            if (isExistRecord && that.data.curRecordId > 0 && that.data.curRecordId != deviceId) {
              let mainDataInfoOld = {
                id: deviceId,
                deviceAddress: "",
              }
              that.savePartner(mainDataInfoOld, 5);
              // wx.showModal({
              //   title: '提示',
              //   content: '设备地址已绑定，您是否需要解绑原记录？',
              //   success(res) {
              //     if (res.confirm) {
              //       console.log('用户点击确定')
              //       let mainDataInfoOld = {
              //         id: deviceId,
              //         deviceAddress: "",
              //       }
              //       that.savePartner(mainDataInfoOld,5);
              //     } else if (res.cancel) {
              //       console.log('用户点击取消')
              //       that.setData({
              //         ["curDeviceAddress"]: "",
              //       })
              //       return;
              //     }
              //   }
              // })
            } else {
              console.log("saoma")
              console.log(that.data.curDeviceAddress)
              mainDataInfo.deviceAddress = that.data.curDeviceAddress;
              //如果没有设置型号，且系统允许根据设备地址来判断型号
              if (Utils.myTrim(mainDataInfo.model) == "" && Utils.myTrim(mainDataInfo.deviceAddress) != "" && app.data.isSetDefaultDeviceModel && Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
                let modelId = -1, modelName = "";
                try {
                  modelId = parseInt(mainDataInfo.deviceAddress.substr(0, 1));
                  modelId = isNaN(modelId) ? -1 : modelId;
                } catch (e) { }
                for (let n = 0; n < app.data.defaultDeviceModels.length; n++) {
                  if (app.data.defaultDeviceModels[n].id == modelId) {
                    modelName = app.data.defaultDeviceModels[n].name;
                    break;
                  }
                }
                mainDataInfo.model = modelName;
              }
              that.setData({
                ["mainDataInfo"]: mainDataInfo,
              })
            }
            break;
        }

        
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
        break;
    }
  },
  //事件：隐藏设备详情弹窗
  hideDeviceDetailPop() {
    let that = this;
    that.setData({
      ["isShowDeviceDetailPop"]: false,
    })
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    let value = e.detail.value, setKey = "";
    value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    let len = Utils.getStrlengthB(value);
    switch (cid) {
      case "deviceClass":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.deviceClass_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.deviceClass_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "dClassData.title";
        that.setData({
          [setKey]: value
        })
        break;
      case "number":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.number_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.number_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.number";
        that.setData({
          [setKey]: value
        })
        break;
      case "model":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.model_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.model_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.model";
        that.setData({
          [setKey]: value
        })
        break;
      case "bluetoothAddress":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.bluetoothAddress_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.bluetoothAddress_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.bluetoothAddress";
        that.setData({
          [setKey]: value
        })
        break;
      case "iosBluetoothAddress":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.bluetoothAddress_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.bluetoothAddress_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.iosBluetoothAddress";
        that.setData({
          [setKey]: value
        })
        break;
      case "deviceAddress":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.deviceAddress_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.deviceAddress_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.deviceAddress";
        that.setData({
          [setKey]: value
        })
        if(value.length>=16){
          that.getDeviceInfo(value, 0, 0);
        }
        break;
      case "address":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.address_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.address_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "mainDataInfo.address";
        that.setData({
          [setKey]: value
        })
        break;

      case "keyword":
        that.setData({
          searchKeyword: value
        })
        break;
      case "tmpDeviceAddress":
        that.setData({
          tmpDeviceAddress: value
        })
        break;
    }
  },
  //事件：显示代理公司下拉选择框
  showSelectCompanyList() {
    this.setData({
      isShowSelectCompanyList: !this.data.isShowSelectCompanyList,
    })
  },
  //事件：选择代理公司事件
  selCompanyListItem: function (e) {
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        ["mainDataInfo.companyId"]: item.id,
        ["mainDataInfo.companyName"]: item.companyName,
        ["selDeviceCompanyName"]: item.companyName,
        ["selDeviceCompanyId"]: item.id,

        ["isShowSelectCompanyList"]: false,
      })
    }
  },
  //事件：提交设备详情
  submitDeviceDetailInfo() {
    let that = this, mainDataInfo = that.data.mainDataInfo;
    let modelId = -1, modelName="";
    //如果没有设置型号，且系统允许根据设备地址来判断型号
    if (Utils.myTrim(mainDataInfo.model) == "" && Utils.myTrim(mainDataInfo.deviceAddress) != "" && app.data.isSetDefaultDeviceModel && Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
      try {
        modelId = parseInt(mainDataInfo.deviceAddress.substr(0, 1));
        modelId = isNaN(modelId) ? -1 : modelId;
      } catch (e) { }
      for (let n = 0; n < app.data.defaultDeviceModels.length; n++) {
        if (app.data.defaultDeviceModels[n].id == modelId) {
          modelName = app.data.defaultDeviceModels[n].name;
          break;
        }
      }
      mainDataInfo.model = modelName;
    }
    mainDataInfo.companyId = mainDataInfo.companyId != that.data.selDeviceCompanyId ? that.data.selDeviceCompanyId : mainDataInfo.companyId;
    // //如果是平台用户或系统管理员则可以查询其他人绑定的设备
    // if (app.data.user_roleId == 2) {
    //   //如果为平台管理员则必须填写相关信息：编号、型号
    //   if (Utils.isNull(mainDataInfo.number) || Utils.isNull(mainDataInfo.model)) {
    //     wx.showToast({
    //       title: '请填写完整设备信息！',
    //       icon: "none",
    //       duration: 1500
    //     })
    //     return
    //   }
    // }else{
    //   //如果非平台管理员则必须填写相关信息：编号、型号，投放地址，所属公司
    //   if (Utils.isNull(mainDataInfo.number) || Utils.isNull(mainDataInfo.model) || Utils.isNull(mainDataInfo.deviceAddress)) {
    //     wx.showToast({
    //       title: '请填写完整设备信息！',
    //       icon: "none",
    //       duration: 1500
    //     })
    //     return
    //   }

      // if (mainDataInfo.companyId<=0) {
      //   wx.showToast({
      //     title: '请选择设备所属公司！',
      //     icon: "none",
      //     duration: 1500
      //   })
      //   return
      // }
    //}
    
    that.savePartner(mainDataInfo, 0)
  },
  //事件：修改设备
  editDetailEvent: function (e) {
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      let mainDataInfo = null;
      mainDataInfo = that.formatMainDataInfo(item,true);
      
      that.setData({
        ["mainDataInfo"]: mainDataInfo,
        ["isShowDeviceDetailPop"]: true,
      })
    }
  },
  //事件：删除设备
  delDetailEvent:function(e){
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      wx.showModal({
        title: '提示',
        content: '您确定要删除该设备吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            let mainDataInfo = {
              id: item.id,
              // 0已经绑定1解绑
              status: 1,
            }
            that.savePartner(mainDataInfo, 3)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  ////////////////////////////////////////////////////////////////////////////
  //-------------设备列表------------------------------------------------------
  //////////////////////////////////////////////////////////////////////
  //----资讯/商品信息列表---------------------------------------------------------
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData();
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this
    let currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    let that = this
    let currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this, searchKeyword = that.data.searchKeyword, searchDeviceId = that.data.searchDeviceId, roleStatus = that.data.roleStatus, searchDClassId = that.data.searchDClassId, searchAdminUserId = that.data.searchAdminUserId, isAdminRole = that.data.isAdminRole;
    var otherParam = isAdminRole && searchAdminUserId == 0 ? "" : "&adminUserId=" + that.data.curAccountRecordId;

    if (Utils.myTrim(searchKeyword) != "") {
      otherParam += "&kword=" + encodeURIComponent(searchKeyword);
    }
    if (searchDeviceId > 0) {
      otherParam += "&id=" + searchDeviceId;
    }
    if (that.data.searchQRCodeId > 0) {
      otherParam += "&id=" + that.data.searchQRCodeId;
    }
    if (Utils.myTrim(that.data.searchQRCodeDeviceAddress) != "") {
      otherParam += "&deviceAddress=" + encodeURIComponent(that.data.searchQRCodeDeviceAddress);
    }

    if (searchDClassId > 0) {
      otherParam += "&devicesClassId=" + searchDClassId;
    }
    otherParam += "&orderfield=updateDate&ordertype=desc";
    //单个设备查询条件置空
    that.setData({
      ["searchQRCodeId"]: 0,
      ["searchQRCodeDeviceAddress"]: "",
      ["searchDeviceId"]:0,
    })
    app.getDevicePageData(that, otherParam, pageSize, pageIndex);
  },
  //方法：获取资讯信息列表结果处理函数
  dowithGetDevicePageData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无设备信息！";
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取设备结果：");
        console.log(dataList);
        let articles = [], deviceCount = that.data.deviceCount, onlineCount = that.data.onlineCount;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          if (pageIndex==1){
            deviceCount = Utils.isNotNull(dataList.deviceCount) ? dataList.deviceCount : 0;
            onlineCount = Utils.isNotNull(dataList.onlineCount) ? dataList.onlineCount : 0; 
          }

          let data = dataList.dataList, dataItem = null, listItem = null, online = 0, dtDate = new Date(), interval = 0;
          for (let i = 0; i < data.length; i++) {
            dataItem = null; dataItem = data[i]; listItem = dataItem;
            online = 0; interval = 0;
            if (dataItem.online != null && dataItem.online != undefined && Utils.myTrim(dataItem.online + "") != "null") {
              try {
                online = parseInt(dataItem.online);
                online = isNaN(online) ? 0 : online;
              } catch (err) { }
            }
            if (online > 0) {
              online = 0;
              if (dataItem.onLineTime != null && dataItem.onLineTime != undefined) {
                try {
                  dtDate = new Date(Date.parse((dataItem.onLineTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtDate = new Date();
                }
                try {
                  interval = Math.abs(Utils.getTimeInterval(dtDate, (new Date()), 0));
                  //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
                  if (interval <= (120 * 1000)) {
                    //设备已经在用
                    online = 1;
                  }
                } catch (e) { }
              }
            }
            listItem.online = online;
            articles.push(listItem);
          }
        }
        
        if (articles.length > 0) {
          // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
          var totalDataCount = that.data.totalDataCount;
          totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
          console.log("totalDataCount:" + totalDataCount);

          // 直接将新一页的数据添加到数组里
          that.setData({
            ["dataArray[" + pageIndex + "]"]: articles,
            currentPage: articles.length > 0 ? pageIndex : that.data.currentPage,
            totalDataCount: totalDataCount,

            ["deviceCount"]: deviceCount,
            ["onlineCount"]: onlineCount,
          })
        } else if (pageIndex == 1) {
          wx.showToast({
            title: noDataAlert,
            icon: 'none',
            duration: 2000
          })
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无设备信息！";
        break;
    }
  },
  //事件：搜索设备
  searchMainDataInfo() {
    let that = this;
    that.loadInitData();
  },

  //方法：保存设备信息
  //参数：
  //tag：0添加，1内测模式设置，2运营模式设置，3删除，4解绑，5解绑原记录
  savePartner: function (mainDataInfo, tag) {
    var signParam = 'cls=main_devices&action=saveDevices&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId,otherParam="";
    if(tag==3){
      otherParam ="&operation=3&id="+mainDataInfo.id;
      app.doPostData(this, app.getUrlAndKey.url, signParam, "", null, otherParam, tag, "操作设备");
    }else{
      app.doPostData(this, app.getUrlAndKey.url, signParam, "datajson", mainDataInfo, "", tag, "操作设备");
    }
  },

  postRuslt: function (data, code, error, tag) {
    var that = this, item = that.data.deviceItem, deviceDataList = that.data.deviceDataList;

    switch (code) {
      case 1:
        console.log(data)
        let msg = "",lastMRecordId=0;
        if (Utils.isNotNull(data) && Utils.isNotNull(data.dataModel)){
          try{
            lastMRecordId = parseInt(data.dataModel.id);
            lastMRecordId=isNaN(lastMRecordId)?0:lastMRecordId;
          }catch(e){}
        }
        switch (tag) {
          case 0:
            msg = "添加设备成功"
            that.setData({
              isShowDeviceDetailPop: false,
              ["lastMRecordId"]: lastMRecordId,
            })
            that.loadInitData();
            break
          case 1:
            msg = "设备设置内测模式成功"
            for (let i = 0; i < deviceDataList.length; i++) {
              if (item.id == deviceDataList[i].id) {
                deviceDataList[i].status = 1
                break
              }
            }
            that.setData({
              deviceDataList: deviceDataList,
              ["lastMRecordId"]: lastMRecordId,
            })
            break
          case 2:
            msg = "设备设置运营模式成功"
            item.status = 0
            for (let i = 0; i < deviceDataList.length; i++) {
              if (item.id == deviceDataList[i].id) {
                deviceDataList[i] = item
                break
              }
            }
            that.setData({
              deviceDataList: deviceDataList,
              ["lastMRecordId"]: lastMRecordId,
            })
            break
          case 3:
            msg = "设备删除成功"
            that.loadInitData();
            break
          case 4:
            msg = "设备移除成功"
            that.loadInitData();
            break;
          case 5:
            msg = "原设备解绑成功"
            let mainDataInfo = that.data.mainDataInfo;
            mainDataInfo.deviceAddress = that.data.curDeviceAddress;

            
            //如果没有设置型号，且系统允许根据设备地址来判断型号
            if (Utils.myTrim(mainDataInfo.model) == "" && Utils.myTrim(mainDataInfo.deviceAddress) != "" && app.data.isSetDefaultDeviceModel && Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
              let modelId = -1, modelName = "";
              try {
                modelId = parseInt(mainDataInfo.deviceAddress.substr(0, 1));
                modelId = isNaN(modelId) ? -1 : modelId;
              } catch (e) { }
              for (let n = 0; n < app.data.defaultDeviceModels.length; n++) {
                if (app.data.defaultDeviceModels[n].id == modelId) {
                  modelName = app.data.defaultDeviceModels[n].name;
                  break;
                }
              }
              mainDataInfo.model = modelName;
            }
            that.setData({
              ["mainDataInfo"]: mainDataInfo,
            })
            break;
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1500
        })
        break;
      default:
        console.log(error)
        break
    }
  },

  /**
   * 获取设备列表
   */
  getDevicesList(kword,id) {
    let that = this, roleStatus = that.data.roleStatus, searchDClassId = that.data.searchDClassId, searchAdminUserId = that.data.searchAdminUserId, isAdminRole = that.data.isAdminRole;
    var signParam = 'cls=main_devices&action=devicesList'
    var otherParam = isAdminRole && searchAdminUserId == 0 ? "" : "&adminUserId=" + that.data.curAccountRecordId;
    
    if (Utils.myTrim(kword)!=""){
      otherParam += "&kword=" + encodeURIComponent(kword);
    }
    if(id>0){
      otherParam+="&id="+id;
    }
    if (that.data.searchQRCodeId>0){
      otherParam += "&id=" + that.data.searchQRCodeId;
    }
    if (Utils.myTrim(that.data.searchQRCodeDeviceAddress) != "") {
      otherParam += "&deviceAddress=" + encodeURIComponent(that.data.searchQRCodeDeviceAddress);
    }

    if (searchDClassId>0) {
      otherParam += "&devicesClassId=" + searchDClassId;
    }
    otherParam +="&orderfield=updateDate&ordertype=desc"
    otherParam += "&pageSize=99&pageIndex=1";
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取设备列表")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this, deviceDataList = [], deviceCount = 0, onlineCount=0;
    that.setData({
      ["searchQRCodeId"]: 0,
      ["searchQRCodeDeviceAddress"]: "",
    })
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            if (Utils.isNotNull(data)){
              deviceDataList = Utils.isNotNull(data.dataList) && data.dataList.length > 0 ? data.dataList:[];
              deviceCount = Utils.isNotNull(data.deviceCount) ? data.deviceCount:0; 
              onlineCount = Utils.isNotNull(data.onlineCount) ? data.onlineCount : 0; 
            }
            if (deviceDataList.length <= 0) {
              wx.showToast({
                title: '暂无设备',
                icon: "none",
                duration: 1500
              })
            }else{
              let dataItem = null, online = 0, dtDate = new Date(), interval=0;
              for (let i = 0; i < deviceDataList.length;i++){
                dataItem = deviceDataList[i]; online = 0; interval = 0;
                if (dataItem.online != null && dataItem.online != undefined && Utils.myTrim(dataItem.online + "") != "null") {
                  try {
                    online = parseInt(dataItem.online);
                    online = isNaN(online) ? 0 : online;
                  } catch (err) { }
                }
                if(online>0){
                  online=0;
                  if (dataItem.onLineTime != null && dataItem.onLineTime != undefined) {
                    try {
                      dtDate = new Date(Date.parse((dataItem.onLineTime + "").replace(/-/g, "/")))
                    } catch (e) {
                      dtDate = new Date();
                    }
                    try {
                      interval = Math.abs(Utils.getTimeInterval(dtDate, (new Date()), 0));
                      //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
                      if (interval <= (120 * 1000)) {
                        //设备已经在用
                        online = 1;
                      }
                    } catch (e) { }
                  }
                }
                deviceDataList[i].online = online;
              }
            }


            that.setData({
              ["deviceDataList"]: deviceDataList,
              ["deviceCount"]: deviceCount,
              ["onlineCount"]: onlineCount,
            })
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  //事件：上线设备
  onBindDevice(e) {
    var that=this,item = e.currentTarget.dataset.item
    var mainDataInfo = {
      id: item.id,
      // 0上线1下线
      status: 0,
    }
    that.data.deviceItem = item;
    that.savePartner(mainDataInfo, 2)
  },
  //事件：下线设备
  onUnBindDevice(e) {
    let that = this, item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '您确定变更为内测模式吗？它将无法使用在线支付等功能',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let mainDataInfo = {
            id: item.id,
            // 0上线1下线
            status: 1,
          }
          that.data.deviceItem = item;
          that.savePartner(mainDataInfo, 1)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //事件：移除设备
  moveDeviceAddressEvent: function (e) {
    let that = this, item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '您确定要移除该设备吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let mainDataInfo = {
            id: item.id,
            adminUserId:0,
            status:1,
          }
          that.data.deviceItem = item;
          that.savePartner(mainDataInfo, 4)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //事件：跳转测试页面
  gotoTestPage: function (e) {
    let that = this, url = "", deviceAddress = "", minutes = 0;
    try {
      deviceAddress = Utils.myTrim(e.currentTarget.dataset.dvaddr);
    } catch (e) { }
    try {
      minutes = parseInt(e.currentTarget.dataset.min);
      minutes = isNaN(minutes) ? 1 : minutes;
    } catch (e) { }
    if (Utils.myTrim(deviceAddress)==""){
      wx.showToast({
        title: "设备地址无效，无法测试！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    url = packMainPageUrl + "/cheirapsisWork/cheirapsisWork?test=1&blueaddr=" + encodeURIComponent(deviceAddress) + "&mcnt=" + minutes;
    console.log("gotoTestPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
  //事件：跳转费用设置页面
  gotoCostSetupPage:function(e){
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      let url="";
      url = packYKPageUrl + "/costSetup/costSetup?id=" + item.id + "&cid=" + item.companyId + "&name=" + encodeURIComponent(item.number);
      console.log("gotoCostSetupPage:" + url)
      wx.navigateTo({
        url: url
      });
    }
  },
  //事件：跳转管理页面
  gotoAdminPage: function (e) {
    let that = this;
    wx.showToast({
      title: "开发中！",
      icon: 'none',
      duration: 2000
    })
  },
  creatTmpDeviceQRImg:function(e){
    let that = this, tmpDeviceAddress = that.data.tmpDeviceAddress;
    //0868540050013644
    if(tmpDeviceAddress.length>16){
      wx.showToast({
        title: "地址长度超长！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let page = "pages/scanCode/scanCode", pageData = "daddr=" + tmpDeviceAddress;
    app.createWXQRCodeImg(that, page, pageData);
  },
  //事件：生成代理公司小程序二维码
  createWXQRCodeImg: function (e) {
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      let page = "pages/scanCode/scanCode", pageData = "adid=" + item.id;
      app.createWXQRCodeImg(that, page, pageData);
    }
  },
  //方法：生成代理公司小程序二维码结果处理函数
  setWXQRCodeImg: function (imgSrc) {
    let that = this, urls = [];
    console.log("小程序二维码图片生成结果：" + imgSrc)
    urls.push(imgSrc);
    wx.previewImage({
      current: imgSrc, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
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

    app.gotoPage(that, "../../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },
  
  test: Utils.debounceStart(function(e){
    let that=this;
    testNum = testNum+1;
    console.log("test..."+testNum)
    console.log(that)
  },1000, this),

  ////////////////////////////////////////////////////////////////////////////////
  //方法：获取设备分类
  getDeviceClassList: function () {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&userId=" + appUserInfo.userId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_devicesClass&action=devicesClassList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("设备分类获取结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data, dClassDataList = [], dataItem = null, listItem = null;
          if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length>0) {
            let id = 0, title = "", userId=0;
            for (let i = 0; i < mainData.dataList.length;i++){
              dataItem = null; dataItem = mainData.dataList[i];listItem=null;
              id=dataItem.id;
              if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "null") {
                try {
                  userId = parseInt(dataItem.userId);
                  userId = isNaN(userId) ? 0 : userId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.title) && Utils.myTrim(dataItem.title + "") != "null") {
                title = Utils.myTrim(dataItem.title);
              }
              listItem={id:id,userId:userId,title:title}
              dClassDataList.push(listItem);
            }
          }
          listItem=null;
          listItem = { id: 0, userId: 0, title: "所有分类" }
          dClassDataList.splice(0, 0, listItem);
          that.setData({
            ["dClassDataList"]: dClassDataList,
          })
        } else {
          app.setErrorMsg(that, "设备分类获取失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "设备分类获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：操作设备分类记录
  operateDeviceClass: function (dClassData,tag) {
    let that = this, otherParamCon = "";
    if(tag==0){
      otherParamCon += "&datajson=" + JSON.stringify(dClassData);
    }else{
      otherParamCon += "&operation=3&id=" + dClassData.id;
    }
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_devicesClass&action=saveDevicesClass&userId=" + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("设备分类操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            ["isShowDClassEditPop"]: false,
          })
          timeOutRefresh = setTimeout(that.getDeviceClassList, 2000);
          wx.showToast({
            title: tag==0?"分类信息提交成功！":"分类删除成功！",
            icon: 'none',
            duration: 2000
          })
        } else {
          app.setErrorMsg(that, "设备分类获取失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "设备分类获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：切换设置分类编辑状态
  onChangeSetupDClass:function(e){
    let that = this, isSetupDeviceClass = that.data.isSetupDeviceClass;
    that.setData({
      ["isSetupDeviceClass"]: !isSetupDeviceClass,
    })
  },
  //事件：按设备分类搜索
  searchDClass:function(e){
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (err) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        ["searchDClassId"]: item.id,
      })
      that.searchMainDataInfo();
    } else {
      wx.showToast({
        title: "无效分类！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //事件：编辑设备分类
  editDClassInfo:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (err) { }
    if (Utils.isNotNull(item)){
      let dClassData=item;
      that.setData({
        ["dClassData"]: dClassData,
        ["titleDClassEditPop"]:"分类编辑",
        ["isShowDClassEditPop"]: true,
      })
    }else{
      wx.showToast({
        title: "无效分类！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //事件：添加设备分类
  newDClassInfo:function(e){
    let that = this, dClassData=null;
    dClassData = { id: 0, userId: appUserInfo.userId,title:""}
    that.setData({
      ["dClassData"]: dClassData,
      ["titleDClassEditPop"]: "分类添加",
      ["isShowDClassEditPop"]: true,
    })
  },
  //事件：提交设备分类信息
  submitDClassInfo:function(e){
    let that = this, dClassData = that.data.dClassData;
    if (Utils.myTrim(dClassData.title)==""){
      wx.showToast({
        title: "分类名称不能为空！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.operateDeviceClass(dClassData,0);
  },
  //事件：删除设备分类信息
  delDClassInfo:function(e){
    let that = this, dClassData = that.data.dClassData;
    wx.showModal({
      title: '提示',
      content: '您确定要删除该设备分类吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.operateDeviceClass(dClassData, 1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //事件：取消设备分类编辑弹窗
  hideDClassEditPop:function(e){
    let that=this;
    that.setData({
      ["isShowDClassEditPop"]: false,
    })
  },
  //事件：设备弹窗选择设备分类下拉框
  showSelectClassList:function(e){
    let that = this, isShowSelectClassList = that.data.isShowSelectClassList;
    that.setData({
      ["isShowSelectClassList"]: !isShowSelectClassList,
    })
  },
  //事件：设备弹窗选择设备分类
  selDClassListItem:function(e){
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        ["mainDataInfo.devicesClassId"]: item.id,
        ["selDeviceClass"]: item.title,

        ["isShowSelectClassList"]: false,
      })
    }
  },
  //事件：设置查看设备宿主
  setViewAdminUserId:function(e){
    let that = this, tag = 1;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag=isNaN(tag)?1:tag;
    } catch (e) { }
    that.setData({
      ["searchAdminUserId"]: tag,
    })
    that.searchMainDataInfo();
  },
  kkk:function(){
    let that=this;
    let page = "packageYK/pages/Myprize/Myprize", pageData = "oid=B202103290015";
    app.createWXQRCodeImg(that, page, pageData);
  }
})
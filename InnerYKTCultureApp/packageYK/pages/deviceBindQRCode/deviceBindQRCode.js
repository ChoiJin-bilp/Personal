// packageYK/pages/deviceBindQRCode/deviceBindQRCode.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions=null,scanQrTag=0;
var pageSize = 20, defaultItemImgSrc = DataURL + app.data.defaultImg, packMainPageUrl = "../../../pages", packYKPageUrl = "../../../packageYK/pages",saveTag=0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,          //是否已经加载
    isForbidRefresh: false, //是否禁止刷新
    curAccountRecordId: 0,

    curRecordId:0,          //当前扫码设备记录ID
    curWXNumber:"",
    curDeviceAddress:"",    //当前扫码设备地址

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
        that.setData({
          ["curAccountRecordId"]: app.data.accountRecordId,
        })
        that.loadInitData();
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
    let that = this;
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
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
        }
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //事件：扫码事件
  scanQRCodeEvent:function(e){
    let that=this,tag=0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    scanQrTag=tag;
    that.data.isForbidRefresh=true;
    wx.scanCode({
      success: (res) => {
        console.log("扫描获取信息===>", res)
        console.log("地址字符串：", res.result)//地址字符窜

        //0扫小程序码，1扫设备地址码
        switch(tag){
          case 0:
            let curRecordId=0;
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
                    if (paramArray.length >= 2 && Utils.myTrim(paramArray[0]) =="adid") {
                      try {
                        curRecordId = parseInt(paramArray[1]);
                        curRecordId = isNaN(curRecordId) ? 0 : curRecordId;
                      } catch (e) { }
                    }
                  }
                }
              }
            }
            if(curRecordId>0){
              that.getDeviceInfo("", curRecordId, 1);
            }else{
              wx.showToast({
                title: "无效小程序码！",
                icon: 'none',
                duration: 1500
              })
            }
            break;

          case 1:
            let curDeviceAddress="";
            curDeviceAddress = app.getDeviceAddressByQRCode(res.result, 0);

            if (Utils.myTrim(curDeviceAddress) != "") {
              console.log("获取设备地址===>", curDeviceAddress)
              
              //下一步分析蓝牙地址
              that.getDeviceInfo(curDeviceAddress, 0, 0);
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
    })
  },
  //方法：分析蓝牙地址
  //tag:0分析地址，1分析ID
  getDeviceInfo: function (deviceAddress, deviceId, tag) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    if (tag == 0) {
      that.setData({
        ["curDeviceAddress"]: deviceAddress,
      })
      otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceAddress);
    } else {
      that.setData({
        ["curRecordId"]: deviceId,
      })
      otherParamCon += "&id=" + deviceId;
    }

    otherParamCon += "&pageSize=99&pageIndex=1";
    app.getDeviceList(that, otherParamCon);
  },
  //方法：获取设备结果处理函数
  dowithGetDeviceList: function (dataList, tag, errorInfo) {
    let that = this, curRecordId = 0, curWXNumber = 0, deviceAddress = "", number = "";
    switch (tag) {
      case 1:
        console.log("获取设备结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let dataItem = dataList.dataList[0];

          curRecordId = dataItem.id;
          if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress) != "null") {
            deviceAddress = Utils.myTrim(dataItem.deviceAddress);
          }
          if (Utils.isNotNull(dataItem.number) && Utils.myTrim(dataItem.number) != "null") {
            number = Utils.myTrim(dataItem.number);
          }
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
        break;
    }
    switch (scanQrTag){
      //小程序码扫描处理
      case 0:
        scanQrTag=0;
        that.setData({
          ["curRecordId"]: curRecordId,
        })
        if(curRecordId<=0){
          wx.showToast({
            title: "记录不存在！",
            icon: 'none',
            duration: 1500
          })
          return;
        }
        if (Utils.myTrim(deviceAddress)!="") {
          wx.showModal({
            title: '提示',
            content: '记录已绑定设备地址，您是否需要解绑？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                let mainDataInfo = {
                  id: curRecordId,
                  deviceAddress: "",
                  adminUserId: that.data.curAccountRecordId,
                }
                that.setData({
                  ["curWXNumber"]: number + "【" + curRecordId + "】",
                })
                saveTag=1;
                that.saveDeviceInfo(mainDataInfo);
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.setData({
                  ["curRecordId"]: 0,
                })
                return;
              }
            }
          })
        }
        that.setData({
          ["curWXNumber"]: number + "【" + curRecordId +"】",
        })
        break;

      //设备地址码扫描
      case 1:
        scanQrTag=0;
        if (curRecordId > 0) {
          wx.showModal({
            title: '提示',
            content: '设备地址已绑定，您是否需要解绑原记录？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                let mainDataInfo = {
                  id: curRecordId,
                  deviceAddress: "",
                  adminUserId: that.data.curAccountRecordId,
                }
                saveTag = 2;
                that.saveDeviceInfo(mainDataInfo);
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.setData({
                  ["curDeviceAddress"]: "",
                })
                return;
              }
            }
          })
        }
        break;
    }
  },
  bindWXQRAndDeviceAddress:function(e){
    let that = this, curRecordId = that.data.curRecordId, curDeviceAddress = that.data.curDeviceAddress, modelId = -1, modelName = "";
    if(curRecordId<=0){
      wx.showToast({
        title: "请扫描有效小程序码！",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (Utils.myTrim(curDeviceAddress) == "") {
      wx.showToast({
        title: "请扫描有效设备地址码！",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    //如果没有设置型号，且系统允许根据设备地址来判断型号
    if (Utils.myTrim(curDeviceAddress) != "" && app.data.isSetDefaultDeviceModel && Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
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

    let mainDataInfo = {
      id: curRecordId,
      deviceAddress: curDeviceAddress,
      model: modelName,
      adminUserId: that.data.curAccountRecordId,
    }
    that.saveDeviceInfo(mainDataInfo);
  },
  saveDeviceInfo: function (mainDataInfo) {
    var signParam = 'cls=main_devices&action=saveDevices&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId, otherParam = "";
    app.doPostData(this, app.getUrlAndKey.url, signParam, "datajson", mainDataInfo, "", 0, "设备地址绑定");
  },

  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (saveTag){
          case 1:
            wx.showToast({
              title: "解绑成功！",
              icon: 'none',
              duration: 1500
            })
            saveTag=0;
            break;
          case 2:
            wx.showToast({
              title: "解绑成功！",
              icon: 'none',
              duration: 1500
            })
            saveTag=0;
            break;
          default:
            that.setData({
              ["curRecordId"]: 0,
              ["curWXNumber"]: "",
              ["curDeviceAddress"]: "",
            })
            that.loadInitData();
            break;
        }
        break;
      default:
        error = Utils.myTrim(error)==""?"设备地址绑定失败！":error;
        switch (saveTag) {
          case 1:
            that.setData({
              ["curRecordId"]: 0,
              ["curWXNumber"]: "",
              ["curDeviceAddress"]: "",
            })
            wx.showToast({
              title: "解绑失败！",
              icon: 'none',
              duration: 1500
            })
            saveTag=0;
            break;
          case 2:
            that.setData({
              ["curDeviceAddress"]: "",
            })
            wx.showToast({
              title: "解绑失败！",
              icon: 'none',
              duration: 1500
            })
            saveTag=0;
            break;
          default:
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 1500
            })
            break;
        }
        console.log(error)
        break
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----设备信息列表---------------------------------------------------------
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
    let tips = "加载第" + (currentPage) + "页";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&adminUserId=" + that.data.curAccountRecordId;
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getDevicePageData(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取设备列表结果处理函数
  dowithGetDevicePageData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无设备信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取设备列表信息：")
        console.log(dataList);
        let articles = [];
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
          let dataItem = null, listItem = null;
          let id = 0, number = "", deviceAddress="";
          for (let i = 0; i < dataList.dataList.length;i++){
            dataItem = null; dataItem = dataList.dataList[i];listItem=null;
            id=0;number="";deviceAddress="";
            id=dataItem.id;
            if (Utils.isNotNull(dataItem.number) && Utils.myTrim(dataItem.number) != "null"){
              number = Utils.myTrim(dataItem.number);
            }
            if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress) != "null") {
              deviceAddress = Utils.myTrim(dataItem.deviceAddress);
            }
            listItem={
              id:id,number:number,deviceAddress:deviceAddress,
            }
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
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : noDataAlert;
        break;
    }
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
    url = packMainPageUrl + "/cheirapsisWork/cheirapsisWork?blueaddr=" + encodeURIComponent(deviceAddress) + "&mcnt=" + minutes;
    console.log("gotoTestPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
})
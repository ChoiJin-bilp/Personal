//index.js
//获取应用实例cls=product_goods&action=productDetail
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.url, MURL = app.getUrlAndKey.murl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  UploadURL = app.getUrlAndKey.uploadUrl;
var appUserInfo = null,
  js_code = "";
var defaultProImg = DataURL + '/images/dproduct.png',
  defaultBusImg = DataURL + '/images/dproduct.png',
  packageUrl = "../../../packageAsite/pages/", packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", sOptions=null;
Page({
  data: {
    isLoad: false, //是否已经加载
    DataURL: DataURL,
    companyId:0,
    roomSellType: app.data.roomSellType,

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    checkPageName:"siteindex",

    indexLogoWidth: app.data.indexLogoWidth,
    
    topBanners: [],
    newsList: [],
    productTypeList: [],
    productList: [{
        id: 0,
        imgSrc: '../../../images/Profiles.png',
        title: '遥控器',
        tag: 0
      },
      {
        id: 0,
        imgSrc: '../../../images/Profiles1.png',
        title: '智能家居',
        tag: 1
      },
    ],
    catalogs: [
      {
        "catalogName": "酒店图片",
        "select": 1
      },
      {
        "catalogName": "内部",
        "select": 2
      },
      {
        "catalogName": "外部",
        "select": 3
      },
      {
        "catalogName": "周围",
        "select": 4
      }, 
    ],
    catalogSelect: 1,//判断是否选中

    companyData: {
      cName: "",
      cLogoUrl: '', //'../../../images/logo.png',
      cSummary: "",
      cPhone: "",
      cEmail: "",
      cWebSite: "",
      cAddr: "",
      cPhotos: [],
      mapLocation: {
        longitude: -1,
        latitude: -1,
        markers: [],
      }
    },
    isShowProductMenu: false,
    isShowAboutMenu: false,

    //产品信息
    productTypeCnt:0,          //产品分类数量
    productCnt:0,              //产品数量

    //加载相关参数
    paramShareType: 0,//参数分享类型：0微官网首页，1报价，2产品库，4二维码报价，99公司简介

    paramShareQuoteId: 0,//参数分享报价ID
    paramShareQuoteUserId: 0,//参数分享报价ID
    paramShareCompanyId: 0,//参数分享公司ID

    paramShareQTag: "",
    paramShareQIds: "",
    paramShareCardStatus: 0,//名片状态
    paramShareCardCId: 0,   //名片CID
    paramShareUId: 0,       //分享用户ID
    isShare: false,         //是否分享转发进入
  },

  onLoad: function(options) {
    var that = this;
    if (URL.toLowerCase().indexOf("https://") < 0) {
      wx.setEnableDebug({
        enableDebug: true
      })
    }
    that.setData({
      logoBGColorIndex: app.data.logoBGColorIndex,
    })
    if (that.dowithParam(options)) return;
    //版本检查
    app.checkAndUpdateVersion();
    console.log(DataURL)
    var uSysData = null,
      ostype = "";
    try {
      const res = wx.getSystemInfoSync();
      uSysData = {
        userId: 0,
        brand: res.brand,
        model: res.model,
        pixelRatio: res.pixelRatio,
        screenWidth: res.screenWidth,
        screenHeight: res.screenHeight,
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        statusBarHeight: res.statusBarHeight,
        language: res.language,
        version: res.version,
        system: res.system,
        platform: res.platform,
        fontSizeSetting: res.fontSizeSetting,
        SDKVersion: res.SDKVersion,
        benchmarkLevel: "",
      }
      var brand = (res.brand != null && res.brand != undefined) ? res.brand : "",
        model = (res.model != null && res.model != undefined) ? res.model : "",
        system = (res.system != null && res.system != undefined) ? res.system : "";
      ostype = brand + "/" + model + "/" + system;
    } catch (e) {}
    that.data.uSysData = uSysData;
    app.data.ostype = ostype;
    //app.selectTabBar(0);
    // 生命周期函数--监听页面加载
    // isShowProductMenu: (options.isShowProductMenu == "true" ? true : false)
    // isShowAboutMenu: (options.isShowProductMenu == "true" ? true : false)
    //app.getLoginUserInfo(that);
  },
  onShow: function(e) {
    let that = this;
    app.data.pageLayerTag = "../../../";
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.muserInfo;
      if (appUserInfo == null || appUserInfo == undefined)
        that.getLoginUserInfo();
      else {
        //版本检查
        app.checkAndUpdateVersion();
        that.getMainDataInfo();
        console.log("onShow")
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "精品好店推荐，快来看看吧",
      path: "pages/asite/index/index",
      success: (res) => { // 成功后要做的事情
        console.log("分享成功")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this, shareType = 0, mallChannelId = 0, shareQuoteId = 0, shareCompanyId = 0, shareQuoteUserId = 0, shareQTag = "", shareQIds = "", paramShareUId = 0, tempInt = 0, isShare = true;
    console.log("参数信息-------------")
    console.log(options);
    //处理岳翔过来的路径
    try {
      if (options.sType != null && options.sType != undefined)
        shareType = parseInt(options.sType);
      shareType = isNaN(shareType) ? 0 : shareType;
    } catch (e) { }
    if (shareType == 20) {
      that.directToYXPart(shareType, options);
      return;
    }
    var isScene = false, dOptions = null;
    if (options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    //1、获取参数类型：1报价，2产品库，4二维码报价
    if (isScene) {
      sOptions = dOptions;
    } else {
      sOptions = options;
    }
    try {
      if (sOptions != null && sOptions != undefined && sOptions.sType != null && sOptions.sType != undefined)
        shareType = parseInt(sOptions.sType);
      shareType = isNaN(shareType) ? 0 : shareType;
    } catch (e) { }

    //1、分享人获取
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    
    that.data.paramShareType = shareType;
    that.data.paramShareUId = paramShareUId;

    isShare = shareType == 0 ? false : true;
    that.data.isShare = isShare;

    //参数分类处理
    //shareType:
    //表单分享：1普通分享，4名片二维码分享
    //产品分享：2普通分享，5名片二维码分享
    //商机分享：10普通分享
    //商城分享：11
    //学生扫码进入：12
    //名片分享：13
    //招商信息分享：14
    switch (shareType) {
      case 1:
        try {
          if (sOptions.qid != null && sOptions.qid != undefined)
            shareQuoteId = parseInt(sOptions.qid);
          shareQuoteId = isNaN(shareQuoteId) ? 0 : shareQuoteId;
          if (sOptions.uid != null && sOptions.uid != undefined)
            shareQuoteUserId = parseInt(sOptions.uid);
          shareQuoteUserId = isNaN(shareQuoteUserId) ? 0 : shareQuoteUserId;
          if (sOptions.batch != null && sOptions.batch != undefined)
            shareQTag = sOptions.batch;
          that.data.paramShareQTag = shareQTag;
          that.data.paramShareQuoteId = shareQuoteId;
          that.data.paramShareQuoteUserId = isNaN(shareQuoteUserId) ? 0 : shareQuoteUserId;
        } catch (e) { }
        that.checkLoginStatus();
        break;
      case 4:
        try {
          if (sOptions != null && sOptions != undefined && sOptions.q != null && sOptions.q != undefined)
            shareQuoteId = parseInt(sOptions.q);
          shareQuoteId = isNaN(shareQuoteId) ? 0 : shareQuoteId;
          that.data.paramShareQuoteId = shareQuoteId;
          that.getQParam(shareQuoteId, 0);
        } catch (e) {
          that.checkLoginStatus();
        }

        break;

      case 2:
        try {
          if (sOptions.qTag != null && sOptions.qTag != undefined)
            shareQTag = sOptions.qTag;
          if (sOptions.qIds != null && sOptions.qIds != undefined)
            shareQIds = sOptions.qIds;
          that.data.paramShareQTag = shareQTag;
          that.data.paramShareQIds = shareQIds;
        } catch (e) { }
        that.checkLoginStatus();
        break;
      case 5:
        try {
          if (sOptions != null && sOptions != undefined && sOptions.q != null && sOptions.q != undefined)
            shareQuoteId = parseInt(sOptions.q);
          shareQuoteId = isNaN(shareQuoteId) ? 0 : shareQuoteId;

          if (sOptions != null && sOptions != undefined && sOptions.c != null && sOptions.c != undefined)
            shareCompanyId = parseInt(sOptions.c);
          shareCompanyId = isNaN(shareCompanyId) ? 0 : shareCompanyId;
          that.data.paramShareQuoteId = shareQuoteId;
          that.data.paramShareCompanyId = shareCompanyId;

          that.getQParam(shareQuoteId, 1);
        } catch (e) {
          that.checkLoginStatus();
        }
        break;

      case 10:
        try {
          if (sOptions.btype != null && sOptions.btype != undefined)
            tempInt = parseInt(sOptions.btype);
          tempInt = isNaN(tempInt) ? 1 : tempInt;
          that.data.paramShareQTag = tempInt + "";
        } catch (e) { }
        that.checkLoginStatus();
        break;

      case 11:
        that.checkLoginStatus();
        break;
      case 12:
        that.checkLoginStatus();
        break;
      case 13:
        try {
          if (sOptions.cId != null && sOptions.cId != undefined) {
            var shareCardId = parseInt(sOptions.cId);
            shareCardId = isNaN(shareCardId) ? 0 : shareCardId;
            that.data.paramShareCardCId = shareCardId;
          }
        } catch (e) { }
        that.checkLoginStatus();
        break;

      default:
        let companyId = 0;
        try {
          companyId = parseInt(sOptions.id);
          companyId = isNaN(companyId) ? 0 : companyId;
        } catch (e) { }
        that.setData({
          companyId: companyId,
        })
        //版本检查
        app.checkAndUpdateVersion();

        that.checkLoginStatus();
        break;
    }
  },
  //方法：检查是否需要登录
  checkLoginStatus: function () {
    var that = this;
    if (app.globalData.userInfo == null || app.globalData.userInfo == undefined)
      that.getLoginUserInfo();
    else {
      that.dowithAppRegLogin(9);
    }
  },
  //ssss
  directToYXPart: function (shareType, options) {
    var that = this;
    switch (shareType) {
      case 20:
        wx.navigateTo({
          url: packComPageUrl + "/perfectCo/perfectCo?vtype=5&receiveId=" + options.receiveId + "&batch=" + options.batch + "&companyId=" + options.companyId + "&userId=" + options.userId,
        })
        break;
    }
  },
  //方法：登录用户信息获取
  getLoginUserInfo: function () {
    console.log("getLoginUserInfo")
    var that = this;
    if (app.data.isCheckPWRight && !app.data.isPasswordRight) {
      that.setData({
        isShowLoginPop: true,
      })
      return;
    } else {
      that.setData({
        isShowLoginPop: false,
      })
    }
    app.getLoginUserInfo(this);
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
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
        var tag = 0, pageTitle = "";
        appUserInfo = app.globalData.muserInfo;
        console.log('处理加载参数：')
        console.log(sOptions);
        that.directToContent(that.data.paramShareType);
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
    app.getAuthorizeUserInfo(that,e);
  },
  
  //方法：登录或注册成功后的操作
  directToContent: function(shareType) {
    var that = this;
    if (app.globalData.muserInfo == null || app.globalData.muserInfo == undefined) return;
    appUserInfo = app.globalData.muserInfo;
    console.log("Index 1 App.Data[userInfo]:id:" + appUserInfo.userId + "  userName:" + appUserInfo.userName + " companyId:" + appUserInfo.companyId + " companyName:" + appUserInfo.companyName);


    // if (that.data.uSysData != null) {
    //   that.data.uSysData.userId = appUserInfo.userId;
    //   app.setUserSysInfo(that, that.data.uSysData);
    // }
    //shareType:
    //表单分享：1普通分享，4名片二维码分享
    //产品分享：2普通分享，5名片二维码分享
    //商机分享：10普通分享
    //学生扫码进入：12
    switch (shareType) {
      case 2:
      case 5:
        if (appUserInfo != null || appUserInfo != undefined) {
          that.shareProductList(appUserInfo.userId);
        }
        break;

      case 10:
        var tUrl = "";
        switch (that.data.paramShareQTag) {
          case "1":
            app.setFunctionModuleInfo(that, 7);
            tUrl = "../chance/chance?btype=1";
            break;
          case "2":
            app.setFunctionModuleInfo(that, 8);
            tUrl = "../chance/chance?btype=2";
            break;
        }
        wx.navigateTo({
          url: tUrl
        });
        break;
      case 11:
        var channelParam = mallChannelId > 0 ? "?channelId=" + mallChannelId : "";
        wx.reLaunch({
          url: "/" + app.data.storeShareMainPage + channelParam
        });
        break;
      case 12:
        if (appUserInfo != null || appUserInfo != undefined) {
          if (Utils.isNull(app.globalData.userInfo.userMobile)) {//未注册 直接跳转注册页面
            wx.navigateTo({
              url: "../login/login"
            });
          }
        }
        break;
      case 13:
        var url = packComPageUrl + "/carddetails/carddetails?status=10&cid=" + that.data.paramShareCardCId + "&uid=" + that.data.paramShareUId;
        console.log("跳转：" + url)
        wx.navigateTo({
          url: url
        });
        break;
      
      default:
        that.getMainDataInfo();
        break;
    }
    that.data.isLoad = true;
  },
  //方法：查看分享产品库
  shareProductList: function (receiveId) {
    var that = this;
    var qTag = that.data.paramShareQTag, qUserId = 0;
    var qTagArray = qTag.split("|");
    if (qTagArray.length >= 3) {
      qUserId = parseInt(qTagArray[0]); qUserId = isNaN(qUserId) ? 0 : qUserId;
    }
    console.log("查看分享产品库：" + packComPageUrl + "/shareproduct/shareproduct?tag=index&type=3&qTag=" + that.data.paramShareQTag + "&qIds=" + that.data.paramShareQIds)
    if (receiveId == qUserId) {
      wx.navigateTo({
        url: packComPageUrl + "/shareproduct/shareproduct?tag=index&type=3&qTag=" + that.data.paramShareQTag + "&qIds=" + that.data.paramShareQIds
      });
      return;
    }


    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //cls=main_shareProduct&action=saveShareProduct&companyId=" + companyId+ "&userId=" + userId+ "&productIds=" + productIds+ "&appId=" + appId+ "&timestamp=" + timestamp

    var urlParam = "cls=main_shareProduct&action=saveShareProduct&companyId=" + appUserInfo.companyId + "&userId=" + qUserId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&receiveId=" + receiveId + "&batch=" + that.data.paramShareQIds + "&folderType=3&shareType=2&saveProductFolderId=0&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("分享产品成功！")
          wx.navigateTo({
            url: packComPageUrl + "/shareproduct/shareproduct?tag=index&type=3&qTag=" + that.data.paramShareQTag + "&qIds=" + that.data.paramShareQIds
          });
        } else {
          app.setErrorMsg(that, "分享产品保存失败！出错信息：" + JSON.stringify(res), URL + urlParam);
        }
      },
      fail: function (err) {
        app.setErrorMsg(that, "分享产品保存接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  onChangeShowState: function() {
    var that = this;
    that.setData({
      isShowProductMenu: (!that.data.isShowProductMenu)
    })
  },
  onChangeShowabout: function() {
    var that = this;
    that.setData({
      isShowAboutMenu: (!that.data.isShowAboutMenu)
    })
  },
  

  //事件：公司信息
  viewCompanyInfo: function(e) {
    var that = this,
      tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: packageUrl + "ccompany/ccompany?tag=" + tag,
      success: function(e) {
        that.setData({
          isShowAboutMenu: false,
        })
      }
    });
  },

  //方法：获取数据信息
  getMainDataInfo: function() {
    var that = this, companyId = that.data.companyId,companyData = that.data.companyData;
    if(companyId>0){
      that.setData({
        companyData: app.data.tempCompanyData,
      }, that.lazyLoadImg);
      WxParse.wxParse('introduction', 'html', app.data.tempCompanyData.introduction, that, 5);
    }else{
      wx.showLoading({
        title: "加载中......",
      })
      app.getCompanyDataInfo(that, 0);
    }
  },
  //方法：获取公司信息结果回调方法
  dowithGetCompanyDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          let mainObject = app.dowithSingleCompanyDataInfo(that, dataList);
          app.data.companyId = mainObject.companyId;
          app.globalData.userInfo.companyId = app.globalData.userInfo.companyId <= 0 ? app.data.companyId : app.globalData.userInfo.companyId;
          console.log("公司ID：" + app.data.companyId);

          app.getPaySourceData(that, app.data.companyId, app.data.wxAppId)

          app.data.productTypeList = mainObject.productTypeList;
          app.data.mainCompanyData = mainObject.companyData;
          app.data.sysLogoUrl = mainObject.companyData.cLogoUrl;
          switch (that.data.paramShareType) {
            case 99:
              that.setData({
                paramShareType: 0,
              })
              wx.navigateTo({
                url: packageUrl + "ccompany/ccompany"
              });
              break;
            default:
              that.setData({
                topBanners: mainObject.topBanners,
                newsList: mainObject.newsList,
                companyData: mainObject.companyData,
                productTypeList: mainObject.productTypeList,
                productList: mainObject.productList,
                productTypeCnt: mainObject.productTypeCnt,          //产品分类数量
                productCnt: mainObject.productCnt,                  //产品数量
              }, that.lazyLoadImg)
              if (mainObject.companyData.mapLocation.longitude < 0 || mainObject.companyData.mapLocation.latitude < 0) {
                app.getMapLALInfo(that, mainObject.companyData.cAddr);
              }
              break;
          }
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "收藏操作失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：IntersectionObserver 对象懒加载图片
  lazyLoadImg: function () {
    var that = this;
    app.lazyLoadImgList(that, that.data.companyData.photos, "img_toplist", "companyData.photos");
    app.lazyLoadImgList(that, that.data.companyData.innerPhotos, "img_toplist", "companyData.innerPhotos");
    app.lazyLoadImgList(that, that.data.companyData.exteriorPhotos, "img_toplist", "companyData.exteriorPhotos");
    app.lazyLoadImgList(that, that.data.companyData.aroundPhotos, "img_toplist", "companyData.aroundPhotos");
  },
  //方法：获取经纬度方法结果处理函数
  dowithGetMapLALInfo: function (dataInfo, tag, errorInfo) {
    let that = this;
    //1成功，0失败
    switch (tag) {
      case 1:
        try {
          if (dataInfo != null && dataInfo != undefined) {
            let companyData = that.data.companyData, markers = [], markerItem = null;
            companyData.mapLocation.longitude = dataInfo.Longitude;
            companyData.mapLocation.latitude = dataInfo.Latitude;

            markerItem = {
              iconPath: DataURL + "/images/markicon.png",
              id: 0,
              latitude: dataInfo.Latitude,
              longitude: dataInfo.Longitude,
              width: 20,
              height: 28,
              callout: {
                content: companyData.cName
              }
            }
            markers.push(markerItem);
            companyData.mapLocation.markers = markers;

            that.setData({
              companyData: companyData,
            })
            app.data.mainCompanyData = companyData;
          }
        } catch (e) { }

        break;
      default:
        break;
    }
  },
  //事件：我要导航
  navigateToHere: function(e) {
    let that = this, companyData = that.data.companyData;
    if (companyData.mapLocation.longitude < 0 || companyData.mapLocation.latitude < 0) {
      app.navigateToMap(that, companyData.cAddr);
    }else{
      try {
        wx.openLocation({
          latitude: companyData.mapLocation.latitude,
          longitude: companyData.mapLocation.longitude,
          name: companyData.cAddr,
          scale: 15
        })
      } catch (e) {
        wx.showToast({
          title: "无效地址不能导航！",
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  chooseCatalog: function (data) {
    var that = this;
    that.setData({//把选中值放入判断值
      catalogSelect: data.currentTarget.dataset.select
    })
  },


  //事件：电话咨询
  callTelephone: function (e) {
    let that = this, companyData = that.data.companyData;
    if (companyData != null && companyData != undefined && Utils.myTrim(companyData.cPhone) != "") {
      try {
        wx.makePhoneCall({
          phoneNumber: companyData.cPhone
        })
      } catch (e) {
        wx.showToast({
          title: "暂无联系电话！",
          icon: 'none',
          duration: 1500
        })
        console.log('电话咨询失败！')
        console.log(e)
      }
    } else {
      wx.showToast({
        title: "暂无联系电话！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
})
// pages/chainhotel/chainhotel.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.url, MURL = app.getUrlAndKey.murl, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutRegAlert = null, timeOutPersonLocation=null;
var pageSize = 5, defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../packageOther/pages", packTempPageUrl = "../../packageTemplate/pages", packSMPageUrl = "../../packageSMall/pages", mainPackageUrl = "../../pages", isDowithing = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    isLoad: false,         //是否已经加载
    DataURL: DataURL,      //远程资源路径
    isForbidRefresh: false, //是否禁止刷新
    randomNum: Math.random() / 9999,
    defaultItemImgSrc: defaultItemImgSrc,
    roomSellType: app.data.roomSellType,

    logoBGColorIndex: app.data.logoBGColorIndex,
    indexLogoWidth: app.data.indexLogoWidth,

    imgUrls: [],
    imgUrlsCnt: 0,
    middleADImgUrls:[],

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    isQRScene: false,       //是否二维码分享

    indicatorDot: true,
    autoplays: true,
    intervals: 5000,
    durations: 1000,

    dtCheckInStart: "",             //入住时间
    dtCheckInEnd: "",               //退房时间
    checkInDays: 0,                 //入住天数

    curPersonLocation: null,     //个人位置信息
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
      },
      showView:true,
    },
    selSearchLabels:"",
    searchKeyword:"",

    imageUrl: [
      '../../images/banner1.png',
      '../../images/banner2.png'
    ],
    curTabIdx: 0,
    tabListInfo: [
      {
        title: '酒店介绍',
        imgUrl: DataURL + '/images/hotelicon2.2.png',
        curUrl: DataURL + '/images/hotelicon2.1.png',
      },
      {
        title: '附近的酒店',
        imgUrl: DataURL + '/images/hotelicon1.1.png',
        curUrl: DataURL + '/images/hotelicon1.png',
      }
    ],
  },
  //方法：设置完善个人信息向导显示与否
  setPerfectGuiderShow: function () {
    var that = this, isShowRegGuider = false, isShowPerfectGuider = false;
    if (appUserInfo == null) return;
    //获取向导参数
    var nowDate = new Date(), nowDateStr = "";
    nowDateStr = Utils.getDateTimeStr(nowDate, "-", false) + " 00:00:00";
    nowDate = new Date(Date.parse(nowDateStr.replace(/-/g, '/')));
    var regguidance = null;
    //第一步：检查是否注册
    if (Utils.myTrim(appUserInfo.userMobile) == "") {
      isShowRegGuider = true;

      try {
        var regguidanceObj = wx.getStorageSync('indexregister_guidance' + app.data.wxAppId);
        if (regguidanceObj != null && Utils.myTrim(regguidanceObj + "") != "") {
          regguidance = JSON.parse(regguidanceObj + "");
        }
      } catch (err) { }
      if (regguidance != null && Utils.myTrim(regguidance.alertDate) == nowDateStr) {
        //如果已经超过规定提示次数则不再显示
        if (regguidance.count >= 1) {
          isShowRegGuider = false;
        } else {
          try {
            isShowRegGuider = true;
            regguidance.alertDate = nowDateStr;
            regguidance.count = regguidance.count + 1;

            wx.setStorageSync('indexregister_guidance' + app.data.wxAppId, JSON.stringify(regguidance));
          } catch (err) { }
        }
      } else {
        //如果是第一次进入则初始化缓存信息
        regguidance = { alertDate: nowDateStr, count: 1 }

        wx.setStorageSync('indexregister_guidance' + app.data.wxAppId, JSON.stringify(regguidance));
      }
    }
    that.setData({
      isShowRegGuider: isShowRegGuider,
    })
    if (isShowRegGuider) {
      wx.showModal({
        title: '系统消息',
        content: "请到“注册资料”注册会员，后续可享受本店相关优惠",
        icon: 'none',
        duration: 1500,
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            console.log("cancel")
            return;
          } else {
            //点击确定
            console.log("sure")
            that.perfectUserInfo();
          }
        },
      })
    }
  },
  //事件：打开完善页面*/
  perfectUserInfo: function () {
    wx.navigateTo({
      url: "../login/login"
    });
  },
  onLoad: function (options) {
    let that = this;
    // console.log("视频图片判断结果：")
    // console.log(app.operateVideoAndImg("aa.ram,bb.jpg,kk.ra,gg.png",21))
    // if (URL.toLowerCase().indexOf("https://") < 0) {
    //   wx.setEnableDebug({
    //     enableDebug: true
    //   })
    // }
    //版本检查
    app.checkAndUpdateVersion();

    that.dowithParam(options);
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
    } catch (e) { }
    that.data.uSysData = uSysData;
    app.data.ostype = ostype;
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
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

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    let that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        that.getMainDataInfo();
        timeOutPersonLocation = setTimeout(that.getPersonLocation, 300);
        break;
    }
  },
  //方法：获取当前位置
  getPersonLocation:function(){
    let that=this;
    app.getPersonLocation(that);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "精品好店推荐，快来看看吧",
      path: "pages/chainhotel/chainhotel",
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../";
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
          that.getMainDataInfo();
        }
        console.log("onShow ...")

        let tag = -1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        if (tag >= 0) {
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) { }
          let selDTStartValue = "", selDTEndValue = "";
          try {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            selDTStartValue = currPage.data.paramstart;
            selDTEndValue = currPage.data.paramend;
          } catch (err) { }
          app.computeCheckInDaysCount(that, selDTStartValue, selDTEndValue);
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutRegAlert != null && timeOutRegAlert != undefined) clearTimeout(timeOutRegAlert);
      if (timeOutPersonLocation != null && timeOutPersonLocation != undefined) clearTimeout(timeOutPersonLocation);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutRegAlert != null && timeOutRegAlert != undefined) clearTimeout(timeOutRegAlert);
      if (timeOutPersonLocation != null && timeOutPersonLocation != undefined) clearTimeout(timeOutPersonLocation);
    } catch (err) { }
  },
  //方法：获取个人位置操作结果回调处理方法
  dowithGetPersonLocation: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          console.log('获取个人位置信息返回结果：')
          console.log(dataList)
          let setKey = "curPersonLocation";
          that.setData({
            [setKey]: dataList
          })
          if (!app.globalData.isGetCurCity)
            app.getMapCityInfo(that, dataList.latitude, dataList.longitude);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "收藏操作失败！";
        break;
    }
  },
  //方法：入住时段判断及入住天数计算结果回调方法
  dowithComputeCheckInDaysCount: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          let dtShortCheckInStart = "", dtShortCheckInEnd = "";
          dtShortCheckInStart = Utils.getMDStrDateByTimeStr(dataList.dtCheckInStart, false);
          dtShortCheckInEnd = Utils.getMDStrDateByTimeStr(dataList.dtCheckInEnd, false);
          that.setData({
            dtCheckInStart: dataList.dtCheckInStart,
            dtCheckInEnd: dataList.dtCheckInEnd,

            dtShortCheckInStart: dtShortCheckInStart,
            dtShortCheckInEnd: dtShortCheckInEnd,
            checkInDays: dataList.checkInDays,
          })
          app.data.dtCheckInStart = dataList.dtCheckInStart;
          app.data.dtCheckInEnd = dataList.dtCheckInEnd;
          app.data.checkInDays = dataList.checkInDays;
        }
        break;
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    let that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    let that = this;
    app.getAuthorizeUserInfo(that, e);
  },
  //方法：获取公司数据信息
  getMainDataInfo: function () {
    let that = this;
    wx.showLoading({
      title: "加载中......",
    })

    app.getCompanyDataInfo(that,0);
  },
  //方法：获取公司信息结果回调方法
  dowithGetCompanyDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        if (dataList != null && dataList!=undefined){
          let mainObject = app.dowithSingleCompanyDataInfo(that,dataList);
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
              that.getMainOtherDataInfo();
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
  //方法：获取公司信息之外的信息
  getMainOtherDataInfo:function(){
    let that=this;
    let dtStartValue = new Date(), dtEndValue = new Date(), dtStart = "", dtEnd = "", dtShortCheckInStart = "", dtShortCheckInEnd="";

    app.getBannerList(that)
      .then(function (data) {
        console.log(data);
        if (Utils.myTrim(app.data.dtCheckInStart) == "" || Utils.myTrim(app.data.dtCheckInEnd) == "") {
          try {
            dtEndValue = Utils.getDateTimeAddDays(dtStartValue, 1);
          } catch (e) { }
          dtStart = Utils.getDateTimeStr(dtStartValue, "-", false); dtEnd = Utils.getDateTimeStr(dtEndValue, "-", false);
          app.computeCheckInDaysCount(that, dtStart, dtEnd);
        } else {
          dtShortCheckInStart = Utils.getMDStrDateByTimeStr(app.data.dtCheckInStart, false);
          dtShortCheckInEnd = Utils.getMDStrDateByTimeStr(app.data.dtCheckInEnd, false);

          that.setData({
            dtBegin: app.data.dtCheckInStart,               //入住时间
            dtEnd: app.data.dtCheckInEnd,                   //退房时间
            dtShortCheckInStart: dtShortCheckInStart,
            dtShortCheckInEnd: dtShortCheckInEnd,
            checkInDays: app.data.checkInDays,
          })
        }
        timeOutRegAlert = setTimeout(that.setPerfectGuiderShow, 500);
      }, function (data) {
        console.log(data);
        if (Utils.myTrim(app.data.dtCheckInStart) == "" || Utils.myTrim(app.data.dtCheckInEnd) == "") {
          try {
            dtEndValue = Utils.getDateTimeAddDays(dtStartValue, 1);
          } catch (e) { }
          dtStart = Utils.getDateTimeStr(dtStartValue, "-", false); dtEnd = Utils.getDateTimeStr(dtEndValue, "-", false);
          app.computeCheckInDaysCount(that, dtStart, dtEnd);
        } else {
          dtShortCheckInStart = Utils.getMDStrDateByTimeStr(app.data.dtCheckInStart, false);
          dtShortCheckInEnd = Utils.getMDStrDateByTimeStr(app.data.dtCheckInEnd, false);

          that.setData({
            dtBegin: app.data.dtCheckInStart,               //入住时间
            dtEnd: app.data.dtCheckInEnd,                   //退房时间
            dtShortCheckInStart: dtShortCheckInStart,
            dtShortCheckInEnd: dtShortCheckInEnd,
            checkInDays: app.data.checkInDays,
          })
        }
        timeOutRegAlert = setTimeout(that.setPerfectGuiderShow, 500);
      })
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
  ///////////////////////////////////////////////////////////////////
  //---获取首页banner-------------------------------------------------
  //方法：获取Banner方法结果处理函数
  dowithGetBannerList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined && dataList.length > 0) {
          let dataItem = null, detailItem = null, listItem = null, imgUrls = [], middleADImgUrls = [], distributionADUrl = [];
          var location = 0, order = 0, src = "", url = "";
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null; listItem = null; dataItem = dataList[i];
            location = 0; src = ""; url = ""; order = 0;
            if (dataItem.img != null && dataItem.img != undefined && Utils.myTrim(dataItem.img + "") != "null" && Utils.myTrim(dataItem.location + "") != "")
              src = dataItem.img;
            else
              continue;
            if (dataItem.url != null && dataItem.url != undefined && Utils.myTrim(dataItem.url + "") != "null" && Utils.myTrim(dataItem.url + "") != "")
              url = dataItem.url;
            if (dataItem.location != null && dataItem.location != undefined && Utils.myTrim(dataItem.location + "") != "null") {
              try {
                location = parseInt(dataItem.location);
                location = isNaN(location) ? 0 : location;
              } catch (err) { }
            }
            if (dataItem.order != null && dataItem.order != undefined && Utils.myTrim(dataItem.order + "") != "null") {
              try {
                order = parseInt(dataItem.order);
                order = isNaN(order) ? 0 : order;
              } catch (err) { }
            }
            listItem = {
              src: app.getSysImgUrl(src),
              url: url,
              order: order,
              isShow: false,
            }
            switch (location) {
              case 0:
                imgUrls.push(listItem);
                break;
              case 1:
                middleADImgUrls.push(listItem);
                break;
              case 2:
                distributionADUrl.push(listItem);
                break;
            }
          }
          app.data.distributionADUrl = distributionADUrl;
          if (imgUrls != null && imgUrls != undefined && imgUrls.length > 0)
            imgUrls[0].isShow = true;
          imgUrls = imgUrls.length > 0 ? imgUrls.sort(that.sortBanner) : imgUrls;
          middleADImgUrls = middleADImgUrls.length > 0 ? middleADImgUrls.sort(that.sortBanner) : middleADImgUrls;
          that.setData({
            imgUrls: imgUrls,
            imgUrlsCnt: imgUrls.length,

            middleADImgUrls: middleADImgUrls,
          }, that.lazyLoadBannerImg)
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  sortBanner: function (a, b) {
    return a.order - b.order;
  },
  //方法：Banner IntersectionObserver 对象懒加载图片
  lazyLoadBannerImg: function () {
    let that = this;
    app.lazyLoadImgList(that, that.data.imgUrls, "tbannerimg", "imgUrls");
    app.lazyLoadImgList(that, that.data.middleADImgUrls, "tbannerimg", "middleADImgUrls");
  },
  //////////////////////////////////////////////////////////////////////
  //----商品列表---------------------------------------------------------
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData(false);
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
  //方法：获取小区列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId + "&pid=" + app.data.companyId;
    let selSearchLabels = that.data.selSearchLabels, labelValues = "", curPersonLocation = that.data.curPersonLocation;

    let searchKeyword = that.data.searchKeyword, ifOMPParam = "";
    //商品关键字
    if (Utils.myTrim(searchKeyword) != '') {
      otherParamCon += "&keyword=" + encodeURIComponent(searchKeyword);
    }
    otherParamCon += Utils.myTrim(ifOMPParam) != '' ? ifOMPParam : "";
    if (Utils.myTrim(selSearchLabels) != '') {
      otherParamCon += "&label=" + encodeURIComponent(selSearchLabels);
    }
    if (curPersonLocation != null && curPersonLocation != undefined && curPersonLocation.latitude > -1 && curPersonLocation.longitude > -1){
      otherParamCon += "&latitude=" + curPersonLocation.latitude + "&longitude=" + curPersonLocation.longitude;
    }
    app.getCompanyListDataInfo(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取公司信息结果处理函数
  dowithGetCompanyListDataInfo: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无店铺信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取店铺列表信息：")
        console.log(dataList);
        let data = dataList != null && dataList != undefined ? dataList : null, dataItem = null, listItem = null, articles = [];
        let id = 0, companyName = "", companyLogo = "", levelValue = 0, levelName = "", telephone = "", address = "", longitude = -1, latitude = -1, describe = "", photo = "", photoList = [], distance = 0, city = "", area = "", lable = "", lableList = [], originalPrice = 0.00, currentPrice=0.00;
        let photosTemp = [], photosString = "", lcdistince = 0, lcdunite = "米", curPersonLocation = that.data.curPersonLocation;
        if (data != null && data != undefined && data.companyMsg != null && data.companyMsg != undefined && data.companyMsg.length > 0) {
          for (let i = 0; i < data.companyMsg.length; i++) {
            id = 0; companyName = ""; companyLogo = ""; levelValue = 0; levelName = ""; telephone = ""; address = ""; longitude = -1; latitude = -1; describe = ""; photoList = []; lcdistince = -1; lcdunite = "米"; distance = 0; city = ""; area = ""; lable = ""; lableList = []; originalPrice = 0.00; currentPrice = 0.00;
            dataItem = null; listItem = null; dataItem = data.companyMsg[i];
            id = dataItem.id;
            if (dataItem.originalPrice != null && dataItem.originalPrice != undefined && Utils.myTrim(dataItem.originalPrice + "") != "") {
              try {
                originalPrice = parseFloat(dataItem.originalPrice);
                originalPrice = isNaN(originalPrice) ? 0.00 : originalPrice;
                originalPrice = parseFloat(originalPrice.toFixed(app.data.limitQPDecCnt))
              } catch (err) { }
            }
            if (dataItem.currentPrice != null && dataItem.currentPrice != undefined && Utils.myTrim(dataItem.currentPrice + "") != "") {
              try {
                currentPrice = parseFloat(dataItem.currentPrice);
                currentPrice = isNaN(currentPrice) ? 0.00 : currentPrice;
                currentPrice = parseFloat(currentPrice.toFixed(app.data.limitQPDecCnt))
              } catch (err) { }
            }
            if (dataItem.distance != null && dataItem.distance != undefined && Utils.myTrim(dataItem.distance + "") != "") {
              try {
                lcdistince = parseInt(dataItem.distance);
                lcdistince = isNaN(lcdistince) ? 0 : lcdistince;
              } catch (err) { }
            }
            if (lcdistince > 1000) {
              lcdunite = "km";
              lcdistince = lcdistince / 1000;
            }
            lcdistince = Math.round(lcdistince);

            if (dataItem.city != null && dataItem.city != undefined && Utils.myTrim(dataItem.city + "") != "")
              city = dataItem.city;
            if (dataItem.area != null && dataItem.area != undefined && Utils.myTrim(dataItem.area + "") != "")
              area = dataItem.area;
            if (dataItem.lable != null && dataItem.lable != undefined && Utils.myTrim(dataItem.lable + "") != "")
              lable = dataItem.lable;
            if (dataItem.lable1 != null && dataItem.lable1 != undefined && Utils.myTrim(dataItem.lable1 + "") != ""){
              lable = Utils.myTrim(lable) != "" ? lable + "," + dataItem.lable1 : dataItem.lable1;
            }
            if (dataItem.lable2 != null && dataItem.lable2 != undefined && Utils.myTrim(dataItem.lable2 + "") != "") {
              lable = Utils.myTrim(lable) != "" ? lable + "," + dataItem.lable2 : dataItem.lable2;
            } 
            if (Utils.myTrim(lable) != "") {
              lableList = lable.split(",");
            }

            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              companyName = dataItem.companyName;
            //companyLogo
            if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
              companyLogo = dataItem.companyLogo;
            if (dataItem.companyPhone != null && dataItem.companyPhone != undefined && Utils.myTrim(dataItem.companyPhone + "") != "")
              telephone = dataItem.companyPhone;
            if (dataItem.companySite != null && dataItem.companySite != undefined && Utils.myTrim(dataItem.companySite + "") != "")
              address = dataItem.companySite;
            if (dataItem.companyProfile != null && dataItem.companyProfile != undefined && Utils.myTrim(dataItem.companyProfile + "") != "")
              describe = dataItem.companyProfile;
            if (dataItem.longitude != null && dataItem.longitude != undefined && Utils.myTrim(dataItem.longitude + "") != "") {
              try {
                longitude = parseInt(dataItem.longitude);
                longitude = isNaN(longitude) ? -1 : longitude;
              } catch (err) { }
            }
            if (dataItem.latitude != null && dataItem.latitude != undefined && Utils.myTrim(dataItem.latitude + "") != "") {
              try {
                latitude = parseInt(dataItem.latitude);
                latitude = isNaN(latitude) ? -1 : latitude;
              } catch (err) { }
            }
            //levelName levelValue
            if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "") {
              try {
                levelValue = parseInt(dataItem.companyLevel);
                levelValue = isNaN(levelValue) ? 0 : levelValue;
              } catch (err) { }
            }
            levelName = levelValue == 0 ? "旗舰" : "普通";

            if (dataItem.photos != null && dataItem.photos != undefined && dataItem.photos.length > 0) {
              photosTemp = []; photosString = "";
              photosString = dataItem.photos;
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    photoList.push(app.getSysImgUrl(photosTemp[n]));
                  }
                }
              }
            }
            photo = Utils.myTrim(companyLogo) != "" ? companyLogo : (photoList.length > 0 ? photoList[0] : defaultItemImgSrc);

            listItem = {
              id: id, companyName: companyName, companyLogo: companyLogo, levelName: levelName, telephone: telephone, address: address, longitude: longitude, latitude: latitude, describe: describe, photoList: photoList, photo: photo, lcdistince: lcdistince, lcdunite: lcdunite, city: city, area: area, lableList: lableList, originalPrice: originalPrice, currentPrice: currentPrice,
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
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无酒店详情！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //事件：跳转选择日期页面
  chooseDateTime: function (e) {
    let that = this, tag = 0, stag = "s", url = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, tag);
    } catch (e) { }
    that.data.isForbidRefresh = true;
    stag = tag == 0 ? "s" : "e";
    url = packOtherPageUrl + "/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择入住时段") + "&edtname=" + encodeURIComponent("离店时间") + "&tag=" + stag;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
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
  //事件：切换TabPage页
  chooseTabPage: function (e) {
    let that = this, setKey = "curTabIdx", curTabIdx=0;
    try{
      curTabIdx = parseInt(e.currentTarget.dataset.current);
      curTabIdx=isNaN(curTabIdx)?0:curTabIdx;
    }catch(e){}
    that.setData({
      [setKey]: curTabIdx
    })
    if (curTabIdx == 1 && that.data.totalDataCount<=0){
      that.loadInitData();
    }
  },
  //事件：跳转酒店详情
  viewDetail:function(e){
    let that = this, id = e.currentTarget.dataset.id, url = "";
    if (Utils.myTrim(id) != "") {
      that.data.isForbidRefresh = true;
      url = mainPackageUrl + "/chainhoteldetail/chainhoteldetail?id=" + encodeURIComponent(id);
      console.log("viewDetail:" + url)
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无效酒店！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //事件：跳转地图订房
  gotoMapHotelReservation:function(e){
    let that = this, curPersonLocation = that.data.curPersonLocation, url = packTempPageUrl + "/hotelmaplist/hotelmaplist?scity=" + encodeURIComponent("全国") + "&scounty=";
    url = curPersonLocation != null && curPersonLocation != undefined ? url + "&lon=" + curPersonLocation.longitude + "&lat=" + curPersonLocation.latitude : url;
    console.log("viewDetail:" + url)
    wx.navigateTo({
      url: url
    });
  },
  //查看更多
  checkmore: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  gotoLuckDraw:function(){
    let that=this,url="";
    url = mainPackageUrl + "/luckdraw/luckdraw";
    //url = mainPackageUrl + "/choujiang/choujiang";
    wx.switchTab({
      url: url
    });
  }
})
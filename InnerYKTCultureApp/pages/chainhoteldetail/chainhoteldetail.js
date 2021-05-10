// pages/chainhoteldetail/chainhoteldetail.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutRegAlert = null;;
var pageSize = app.data.pageSize, defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../packageOther/pages", packTempPageUrl = "../../packageTemplate/pages", packSMPageUrl = "../../packageSMall/pages", mainPackageUrl = "../../pages", isDowithing = false;
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

    companyId:0,
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
    companyData:null,
    imageUrl: [
      '../../images/banner1.png',
      '../../images/banner2.png'
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
    if (URL.toLowerCase().indexOf("https://") < 0) {
      wx.setEnableDebug({
        enableDebug: true
      })
    }
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0,companyId=0;
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
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    try {
      if (sOptions.id != null && sOptions.id != undefined)
        companyId = parseInt(sOptions.id);
      companyId = isNaN(companyId) ? 0 : companyId;
    } catch (e) { }
    that.setData({
      companyId: companyId,
      paramShareUId: paramShareUId,
    })
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
        app.getPersonLocation(that);
        break;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this, companyId = that.data.companyId;
    return {
      title: "精品好店推荐，快来看看吧",
      path: "pages/chainhoteldetail/chainhoteldetail?id=" + companyId,
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
          that.getMainDataInfo(that.data.companyId);
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
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutRegAlert != null && timeOutRegAlert != undefined) clearTimeout(timeOutRegAlert);
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
          that.getMainDataInfo(that.data.companyId);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "收藏操作失败！";
        //即使获取个人位置失败也返回酒店列表
        that.getMainDataInfo(that.data.companyId);
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
  getMainDataInfo: function (companyId) {
    let that = this;
    wx.showLoading({
      title: "加载中......",
    })

    app.getCompanyDataInfo(that, companyId);
  },
  //方法：获取公司信息结果回调方法
  dowithGetCompanyDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          let mainObject = app.dowithSingleCompanyDataInfo(that, dataList), curPersonLocation = that.data.curPersonLocation, lcdistince = 0.00, lcdunite="米";
          //计算距离
          if (curPersonLocation != null && curPersonLocation != undefined && mainObject.companyData.mapLocation.latitude >= 0 && mainObject.companyData.mapLocation.longitude >= 0) {
            lcdistince = Utils.getLocationDistance(curPersonLocation.latitude, curPersonLocation.longitude, mainObject.companyData.mapLocation.latitude, mainObject.companyData.mapLocation.longitude);
            lcdistince = isNaN(lcdistince) ? -1 : lcdistince;
            if (lcdistince > 1000) {
              lcdunite = "km";
              lcdistince = lcdistince / 1000;
            }
            lcdistince = Math.round(lcdistince);
          }
          mainObject.companyData.lcdistince = lcdistince;
          mainObject.companyData.lcdunite = lcdunite;
          if (mainObject.companyData.photos == null || mainObject.companyData.photos== undefined || mainObject.companyData.photos.length <= 0)
            mainObject.companyData.photos = mainObject.companyData.cmphotoList;

          app.data.tempCompanyData = mainObject.companyData;
          that.setData({
            companyData: mainObject.companyData,
          }, that.lazyLoadImg)
          if (mainObject.companyData.mapLocation.longitude < 0 || mainObject.companyData.mapLocation.latitude < 0) {
            app.getMapLALInfo(that, mainObject.companyData.cAddr);
          }
          that.getMainOtherDataInfo();
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
  },
  //方法：获取公司信息之外的信息
  getMainOtherDataInfo: function () {
    let that = this;
    let dtStartValue = new Date(), dtEndValue = new Date(), dtStart = "", dtEnd = "", dtShortCheckInStart = "", dtShortCheckInEnd = "";

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
    that.loadInitData();
    timeOutRegAlert = setTimeout(that.setPerfectGuiderShow, 500);
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
            app.data.tempCompanyData = companyData;
          }
        } catch (e) { }

        break;
      default:
        break;
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----商品列表---------------------------------------------------------
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
  //获取商品列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this, otherParamCon = "&typeflag=2";
    let selProductKeyParam = that.data.selProductKeyParam, selProductTypeIDParam = that.data.selProductTypeIDParam, selProductTypeNameParam = that.data.selProductTypeNameParam, selPriceConParam = that.data.selPriceConParam, ifOMPParam = "&companyId=" + that.data.companyId, channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "", detailOrderParam = "&sDetail=price,updateDate"; //, detailOrderParam ="&sDetail=price asc,updateDate desc"
    //商品关键字
    if (Utils.myTrim(selProductKeyParam) != '') {
      otherParamCon += "&productName=" + encodeURIComponent(selProductKeyParam);
    }
    //商品分类
    if (selProductTypeIDParam > 0 && Utils.myTrim(selProductTypeNameParam) != '') {
      otherParamCon += "&typeName=" + encodeURIComponent(selProductTypeNameParam);
    }
    //价格排序
    if (selPriceConParam >= 0 || that.data.isSelFPrice) {
      if (selPriceConParam == 1)
        otherParamCon += "&sField=price&sOrder=desc";
      else
        otherParamCon += "&sField=price";
    }

    otherParamCon += Utils.myTrim(ifOMPParam) != '' ? ifOMPParam : "";
    otherParamCon += Utils.myTrim(channelParam) != '' ? channelParam : "";
    otherParamCon += Utils.myTrim(detailOrderParam) != '' ? detailOrderParam : "";
    app.getSoftSrvProduct(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取代理商品结果处理函数
  dowithGetSoftSrvProduct: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无房型信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined && dataList.length > 0) {
          app.dowithProductList(that, dataList, pageIndex, noDataAlert);
        } else if (pageIndex == 1) {
          wx.showToast({
            title: noDataAlert,
            icon: 'none',
            duration: 1500
          })
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无房型！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：热销商品 IntersectionObserver 对象懒加载图片
  lazyLoadProductImg: function () {
    let that = this, currentPage = that.data.currentPage;
    app.lazyLoadImgList(that, that.data.dataArray[currentPage], "product_img", "dataArray[" + currentPage + "]");
  },
  //事件：浏览房型详情
  viewProductDetail: function (e) {
    let that = this, id = e.currentTarget.dataset.id, url = "";
    if (Utils.myTrim(id) != "") {
      that.data.isForbidRefresh = true;
      url = packTempPageUrl + "/hoteldetails/hoteldetails?isnv=1&pid=" + encodeURIComponent(id) + "&companyId=" + that.data.companyId + "&channelid=" + that.data.mallChannelId;
      console.log("viewProductDetail:" + url)
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无效房型！",
        icon: 'none',
        duration: 2000
      })
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
    url = packOtherPageUrl + "/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择时段") + "&edtname=" + encodeURIComponent("离店时间") + "&tag=" + stag;
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
  //事件：我要导航
  navigateToHere: function (e) {
    let that = this, companyData = that.data.companyData;
    if (companyData.mapLocation.longitude < 0 || companyData.mapLocation.latitude < 0) {
      app.navigateToMap(that, companyData.cAddr);
    } else {
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
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：跳转酒店详情
  gotoHotelDetail:function(e){
    let that = this, companyId = that.data.companyId,url="";
    url = mainPackageUrl +"/asite/index/index?id="+companyId;
    app.data.tempCompanyData = that.data.companyData;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
  },
  //方法：返回
  gotoBackPage: function () {
    let that = this;

    wx.navigateBack({
      delta: 1
    })
  },
})
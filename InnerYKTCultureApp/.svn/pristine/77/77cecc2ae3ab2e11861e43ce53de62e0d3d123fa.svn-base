// pages/reservehotel/reservehotel.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.url, MURL = app.getUrlAndKey.murl, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null;
var pageSize = 20, defaultItemImgSrc = DataURL + app.data.defaultImg, packOtherPageUrl = "../../packageOther/pages", packTempPageUrl = "../../packageTemplate/pages", packSMPageUrl = "../../packageSMall/pages", mainPackageUrl = "../../pages", isDowithing = false;
var Ballheight = app.globalData.ballheight;
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
    isShowMapHotelInfoPop:false,  //地图订房酒店休息弹窗
    roomSellType: app.data.roomSellType,
    
    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    dtCheckInStart: "",             //入住时间
    dtCheckInEnd: "",               //退房时间
    checkInDays: 0,                 //入住天数

    curPersonLocation: null,     //个人位置信息

    selCity: app.globalData.defaultCity,     //搜索城市
    selCounty: app.globalData.defaultCounty, //搜索区域
    selAreaLocation:null,                    //搜索区域位置信息
    sortby:0,                       //检索排序条件
    distancelen:0,                  //检索位置区域
    scIndex:0,
    dcIndex:0,
    conDataSortList: [{name:'综合排序',id:0}, {name:'距离优先',id:1},{name:'价格最低',id:2},{name:'价格最高',id:3}],
    conDataDistanceList: [{ name: '位置距离', id: 0 }, { name: '1公里', id: 1000 }, { name: '3公里', id: 3000 }, { name: '5公里', id: 5000 }, { name: '10公里', id: 10000 }],

    tabIndex:0,
    hotelMarkers:[],
    selMarkerItem:null,

    isViewPersonArea:true,
    isHaveSelArea:false,

    mapScale:9,
    isOperationByExchangeMap:false,
    ballheight: Ballheight, //悬浮球移动面积
  },
  onLoad: function (options) {
    let that = this;
    that.dowithParam(options);
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
        let tag = -1;
        try {
          let tagObj = wx.getStorageSync('isShowMapTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        let tabIndex = tag==1 ? 1 : 0, selAreaLocation = that.data.selAreaLocation;
        if (tabIndex == 1) {
          selAreaLocation = { longitude: 106.47647370312498, latitude: 32.90316560417314 }
          that.setData({
            tabIndex: tabIndex,
            ["selCity"]: "全国",
            ["selCounty"]: "",
            ["selAreaLocation"]: selAreaLocation,
            ["mapScale"]: 1,
          })
        }
        that.getMainDataInfo();
        break;
    }
  },
  //方法：
  getMainDataInfo:function(){
    let that=this;

    app.getPersonLocation(that);
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
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "精品好店推荐，快来看看吧",
      path: "pages/reservehotel/reservehotel",
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
          //tag:0日期选择，1城市区域选择
          switch(tag){
            case 0:
              let selDTStartValue = "", selDTEndValue = "";
              try {
                let pages = getCurrentPages();
                let currPage = pages[pages.length - 1];
                selDTStartValue = currPage.data.paramstart;
                selDTEndValue = currPage.data.paramend;
              } catch (err) { }
              app.computeCheckInDaysCount(that, selDTStartValue, selDTEndValue);
              break;
            
            case 1:
              that.setData({ 
                ["selCity"]: Utils.myTrim(app.globalData.defaultCity) == "" ? "全国" : app.globalData.defaultCity,
                ["selCounty"]: app.globalData.defaultCounty,
              })
              that.loadInitData();
              break;
          }
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) { }
          
        }
      }
    }
    that.data.isForbidRefresh = false;
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
  //方法：获取个人位置操作结果回调处理方法
  dowithGetPersonLocation: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          console.log('获取个人位置信息返回结果：')
          console.log(dataList)
          let setKey = "curPersonLocation", setAreaKey = "selAreaLocation", selAreaLocation = that.data.selAreaLocation == null || that.data.selAreaLocation == undefined ? dataList: that.data.selAreaLocation;
          that.setData({
            [setKey]: dataList,
            [setAreaKey]: selAreaLocation
          })
          that.loadInitData();
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "收藏操作失败！";
        //即使获取个人位置失败也返回酒店列表
        that.loadInitData();
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
      hotelMarkers:[],
    })
    // 获取第一页列表信息
    if (that.data.tabIndex==1)
      that.getMainDataList(-1, 1);
    else
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
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId + "&pid=" + app.data.agentCompanyId;
    let selSearchLabels = that.data.selSearchLabels, labelValues = "", curPersonLocation = that.data.curPersonLocation, selCity = that.data.selCity, selCounty = that.data.selCounty;
    selCity = Utils.myTrim(selCity) == '全国'?'':selCity;

    let searchKeyword = that.data.searchKeyword, ifOMPParam = "";
    //商品关键字
    if (Utils.myTrim(searchKeyword) != '') {
      otherParamCon += "&keyword=" + encodeURIComponent(searchKeyword);
    }
    otherParamCon += Utils.myTrim(ifOMPParam) != '' ? ifOMPParam : "";
    if (Utils.myTrim(selSearchLabels) != '') {
      otherParamCon += "&label=" + encodeURIComponent(selSearchLabels);
    }
    if (curPersonLocation != null && curPersonLocation!=undefined && curPersonLocation.latitude > -1 && curPersonLocation.longitude > -1) {
      otherParamCon += "&latitude=" + curPersonLocation.latitude + "&longitude=" + curPersonLocation.longitude;
    }
    if (that.data.sortby>0){
      otherParamCon += "&sortby=" + that.data.sortby;
    }
    if (that.data.distancelen > 0) {
      otherParamCon += "&distancelen=" + that.data.distancelen;
    }
    if (that.data.isViewPersonArea){
      if (Utils.myTrim(selCity) != '') {
        selCity = selCity.replace("市", "");
        otherParamCon += "&city=" + encodeURIComponent(selCity);
      }
      if (Utils.myTrim(selCounty) != '') {
        selCounty = selCounty.replace("区", "").replace("县", "");
        otherParamCon += "&area=" + encodeURIComponent(selCounty);
      }
    }
    
    app.getCompanyListDataInfo(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取公司信息结果处理函数
  dowithGetCompanyListDataInfo: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无酒店信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取酒店列表信息：")
        console.log(dataList);
        let data = dataList != null && dataList != undefined ? dataList : null, dataItem = null, listItem = null, articles = [], hotelMarkers = that.data.hotelMarkers, markerItem=null;
        let id = 0, companyName = "", companyLogo = "", levelValue = 0, levelName = "", telephone = "", address = "", longitude = -1, latitude = -1, describe = "", photo = "", photoList = [], distance = 0, city = "", area = "", lable = "", lableList = [], originalPrice = 0.00, currentPrice = 0.00;
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
            if (dataItem.lable1 != null && dataItem.lable1 != undefined && Utils.myTrim(dataItem.lable1 + "") != "") {
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
                longitude = parseFloat(dataItem.longitude);
                longitude = isNaN(longitude) ? -1 : longitude;
              } catch (err) { }
            }
            if (dataItem.latitude != null && dataItem.latitude != undefined && Utils.myTrim(dataItem.latitude + "") != "") {
              try {
                latitude = parseFloat(dataItem.latitude);
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
            if (latitude > -1 && longitude>-1){
              markerItem=null;
              markerItem = {
                iconPath: DataURL + "/images/markicon2.png", id: id, latitude: latitude, longitude: longitude, width: 20, height: 28,lable:companyName,
                callout: {
                  content: companyName
                }
              }
              hotelMarkers.push(markerItem);
            }

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

            ["hotelMarkers"]: hotelMarkers,
          })
        } else if (pageIndex == 1) {
          //如果当前页面尚未选择区域，且当前区域酒店为0，则默认取全国区域酒店
          if (!that.data.isHaveSelArea && that.data.isViewPersonArea){
            let selAreaLocation = that.data.selAreaLocation;
            that.data.isViewPersonArea = false;
            selAreaLocation={longitude : 116.40811432812498,latitude : 39.903886391216886}
            that.setData({
              ["selCity"]: "全国",
              ["selCounty"]: "",
              ["selAreaLocation"]: selAreaLocation,
            })
            that.loadInitData();
          }else{
            wx.showToast({
              title: noDataAlert,
              icon: 'none',
              duration: 2000
            })
          }
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
  //事件：选择搜索条件
  bindConPickerChange: function (e) {
    let that=this,tag=0,index=0,setKey="",setValue=0,setIndexKey="";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    try {
      index = parseInt(e.detail.value);
      index = isNaN(index) ? 0 : index;
    } catch (e) { }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    switch(tag){
      case 0:
        let conDataSortList = that.data.conDataSortList;
        setValue=conDataSortList[index].id;
        setKey = "sortby"; setIndexKey ="scIndex";
        break;
      case 1:
        let conDataDistanceList = that.data.conDataDistanceList;
        setValue = conDataDistanceList[index].id;
        setKey = "distancelen"; setIndexKey = "dcIndex";
        break;
    }
    that.setData({
      [setKey]: setValue,
      [setIndexKey]:index,
    })
    that.loadInitData();
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
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：跳转酒店详情
  viewDetail: function (e) {
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
  gotoMapHotelReservation: function (e) {
    let that = this, curPersonLocation = that.data.curPersonLocation, url = packTempPageUrl + "/hotelmaplist/hotelmaplist?scity=" + encodeURIComponent(that.data.selCity) + "&scounty=" + encodeURIComponent(that.data.selCounty);
    url = curPersonLocation != null && curPersonLocation != undefined ? url + "&lon=" + curPersonLocation.longitude + "&lat=" + curPersonLocation.latitude:url;
    console.log("viewDetail:" + url)
    wx.navigateTo({
      url: url
    });
  },
  //事件：切换TabPage
  exchangeTabPage:function(e){
    let that = this, tabIndex = 0, stag = "s", url = "";
    try {
      tabIndex = parseInt(e.currentTarget.dataset.tindex);
      tabIndex = isNaN(tabIndex) ? 0 : tabIndex;
    } catch (err) { }

    tabIndex = tabIndex == 0 ? 1 : 0;
    that.setData({
      tabIndex: tabIndex,
    })
    if(tabIndex==1){
      if (Utils.myTrim(that.data.selCity)=="全国"){
        let selAreaLocation = that.data.selAreaLocation;
        selAreaLocation = { longitude: 106.47647370312498, latitude: 32.90316560417314}
        that.setData({
          ["selAreaLocation"]: selAreaLocation,
          ["mapScale"]: 1,
        })
      }else{
        that.setData({
          ["mapScale"]: 9,
        })
        app.getMapLALInfo(that, that.data.selCity);
      }
    }
    that.loadInitData();
  },
  //方法：获取经纬度方法结果处理函数
  dowithGetMapLALInfo: function (dataInfo, tag, errorInfo) {
    let that = this;
    //1成功，0失败
    switch (tag) {
      case 1:
        try {
          if (dataInfo != null && dataInfo != undefined) {
            let selAreaLocation = that.data.selAreaLocation;
            selAreaLocation ={longitude:dataInfo.Longitude,latitude:dataInfo.Latitude}

            that.setData({
              ["selAreaLocation"]: selAreaLocation,
            })
          }
        } catch (e) { }

        break;
      default:
        break;
    }
  },
  //事件：地图Mark点击事件
  viewMapDetail:function(e){
    let that = this, id = 0, url = "", selMarkerItem = null;
    try {
      id = parseInt(e.markerId);
      id = isNaN(id) ? 0 : id;
    } catch (err) { }
    console.log(e)
    if (id>0) {
      that.data.isForbidRefresh = true;
      let dataArray = that.data.dataArray;
      if (dataArray != null && dataArray != undefined && dataArray.length>0){
        for(let i=1;i<=dataArray.length;i++){
          if (dataArray[i] != null && dataArray[i] != undefined && dataArray[i].length>0){
            for (let j = 0; j < dataArray[i].length;j++){
              if (dataArray[i][j].id==id){
                selMarkerItem = dataArray[i][j];
                break;
              }
            }
          }
        }
      }
    } 
    
    if(selMarkerItem!=null){
      that.setData({
        ["selMarkerItem"]: selMarkerItem,
        isShowMapHotelInfoPop: true,
      })
    }else {
      wx.showToast({
        title: "无效酒店！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  showSelAreaPop: function (e) {
    let that = this, url = "";
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, 1);
    } catch (e) { }
    url = packOtherPageUrl + "/switchcity/switchcity";
    //设置选区域标志以及是否只查看当前区域酒店
    that.data.isHaveSelArea=true;
    that.data.isViewPersonArea=true;
    console.log("viewDetail:" + url)
    wx.navigateTo({
      url: url
    });
    // this.setData({
    //   isShowArearPop: true,
    // })
  },
  //事件：跳转页面
  gotoSubPage: function (e) {
    var that = this, stype = e.currentTarget.dataset.stype, pagename = e.currentTarget.dataset.pagename, tUrl = "", pageType = 0;
    //pageType：0普通页面，1底部菜单导航页
    switch (stype) {
      //主目录类页面
      case "0":
        tUrl = mainPackageUrl + "/" + pagename + "/" + pagename;
        break;
      //酒店类页面
      case "1":
        tUrl = packTempPageUrl + "/" + pagename + "/" + pagename;
        break;
      //商城类页面
      case "2":
        tUrl = packSMPageUrl + "/" + pagename + "/" + pagename;
        break;
      //其他类页面
      case "3":
        tUrl = packOtherPageUrl + "/" + pagename + "/" + pagename;
        break;
      default:
        pageType = 9;
        wx.showToast({
          title: "正在建设中...",
          icon: 'none',
          duration: 2000
        })
        break;
    }
    switch (pageType) {
      case 1:
        wx.switchTab({
          url: tUrl
        });
        break;
      case 0:
        wx.navigateTo({
          url: tUrl
        });
        break;
    }
  },
  // 酒店信息弹窗事件
  hideShowMapHotelInfoPop: function () {
    this.setData({
      isShowMapHotelInfoPop: false,
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

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  }
})
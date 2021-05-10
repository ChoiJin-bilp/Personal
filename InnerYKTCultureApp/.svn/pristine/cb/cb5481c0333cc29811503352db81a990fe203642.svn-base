// pages/doorway/doorway.js
const app = getApp();

var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var packSMPageUrl = "../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,
  sOptions = null;
var Ballheight = app.globalData.ballheight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    isLoad: false, //是否已经加载
    randomNum: Math.random() / 9999,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1500,

    gwItemList: [],
    gwProductList: [],
    ballheight: Ballheight, //悬浮球移动面积
    scrollX: 400,
    scrollY: 150,
    productType: app.data.isShowSigninPop,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      productType: app.data.isShowSigninPop,
    })
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this,
      paramShareUId = 0,
      isScene = false,
      dOptions = null;
    console.log(options)
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
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
    console.log("加载参数：");
    console.log(sOptions);
    // 扫码进入设备id
    var deviceid = sOptions.deviceid;
    if (!Utils.isNull(deviceid)) {
      console.log("设备id..onLoad", deviceid);
      that.data.deviceid = deviceid;
      //如果为扫码设备进入，则默认显示可用按摩劵提示
      app.data.isShowHomeCheirapsisAlert = true;

      // 获取设备绑定相关信息
      app.getSingleDeviceInfo(that, deviceid)
      that.data.isFirstScanCode = true
    } else if (!Utils.isNull(app.data.agentDeviceId) && app.data.agentDeviceId != 0) {
      that.data.deviceid = app.data.agentDeviceId
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) {}
    that.data.paramShareUId = paramShareUId;

    appUserInfo = app.globalData.userInfo;

    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },

  dowithGetSingleDeviceInfo(dataList, tag, errorInfo) {},
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;

        let otherParam = "&status=0&companyId=" + app.data.companyId;
        otherParam += app.data.agentCompanyId > 0 && app.data.agentCompanyId != app.data.companyId ? "," + app.data.agentCompanyId : "";
        app.getGroupWorkItemList(that, otherParam);
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1];
    console.log("onShow", currentPage.options)
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
    //导航条相关处理操作
    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) {
      //设置tabbar导航条当前索引位置
      app.setTabBarSelIndex(that);
    } else {
      //获取导航条
      app.getTabBarList(that, app.data.companyId, false);
    }

    // 第2次扫码进去
    if (!that.data.isFirstScanCode && !Utils.isNull(that.data.deviceid) && !Utils.isNull(currentPage.options)) {
      console.log("设备id..onShow", that.data.deviceid);
      // 获取设备绑定相关信息
      app.getSingleDeviceInfo(that, that.data.deviceid)
      // that.dowithParam(currentPage.options);
    }
    app.data.pageLayerTag = "../../";

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      let otherParam = "&status=0&companyId=" + app.data.companyId;
      otherParam += app.data.agentCompanyId > 0 && app.data.agentCompanyId != app.data.companyId ? "," + app.data.agentCompanyId : "";
      app.getGroupWorkItemList(that, otherParam);
    }

    that.data.isForbidRefresh = false;
  },
  //方法：获取导航条回调方法
  dowithGetTabBarList: function () {
    let that = this;
    app.setTabBarSelIndex(that);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：获取拼团组合项列表结果处理函数
  dowithGetGroupWorkItemList: function (dataList, tag, errorInfo) {
    let that = this,
      otherParam = "&type=1&companyId=" + app.data.companyId;
    otherParam += app.data.agentCompanyId > 0 && app.data.agentCompanyId != app.data.companyId ? "," + app.data.agentCompanyId : "";
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        console.log("团组合项列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.data) && dataList.data.length > 0) {
          let dataItem = null,
            listItem = null,
            gwItemList = [];
          let num = 0,
            picName = "";
          for (var i = 0; i < dataList.data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = dataList.data[i];
            num = 0;
            if (Utils.isNotNull(dataItem.totalNum) && Utils.myTrim(dataItem.totalNum + "") != "") {
              try {
                num = parseInt(dataItem.totalNum);
                num = isNaN(num) ? 0 : num;
              } catch (err) {}
            }

            switch (i) {
              case 0:
                picName = "tenpeople";
                break;
              case 1:
                picName = "fifteenpeople";
                break;
              case 2:
                picName = "twentypeople";
                break;
              case 3:
                picName = "thirtypeople";
                break;
            }
            listItem = {
              xvHao: i,
              name: num + "人团",
              num: num,
              picName: picName,
            }
            gwItemList.push(listItem);
          }
          that.setData({
            ["gwItemList"]: gwItemList,
          });
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
    // otherParams+="&status=0";
    app.getGWProductList(that,false, otherParam, 100, 1);
  },
  //方法：获取拼团商品列表结果处理函数
  dowithGetGWProductList: function (dataList, tag, errorInfo, pageIndex) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团商品列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,
            listItem = null,
            gwProductList = [];
          let id = "",
            pid = 0,
            sid = 0,
            companyId = 0,
            couponMoney = 0.00,
            name = "",
            photo = defaultItemImgSrc,
            photosString = "",
            photosTemp = [];
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = dataList[i];
            couponMoney = 0.00;
            name = "";
            photo = defaultItemImgSrc;
            sid = 0;
            id = dataItem.id;
            pid = dataItem.pid;
            companyId = dataItem.companyId;
            name = dataItem.productName;
            if (Utils.isNotNull(dataItem.sid) && Utils.myTrim(dataItem.sid + "") != "") {
              try {
                sid = parseInt(dataItem.sid);
                sid = isNaN(sid) ? 0 : sid;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.couponMoney) && Utils.myTrim(dataItem.couponMoney + "") != "") {
              try {
                couponMoney = parseFloat(dataItem.couponMoney);
                couponMoney = isNaN(couponMoney) ? 0.00 : couponMoney;
              } catch (err) {}
            }
            //商品图片
            if (Utils.isNotNull(dataItem.photos) && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = "";
              photosString = dataItem.photos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (let n = 0; n < photosTemp.length; n++) {
                  photosString = photosTemp[n].toLowerCase();
                  if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                    photo = app.getSysImgUrl(photosTemp[n]);
                    break;
                  }
                }
              }
            }

            listItem = {
              id: id,
              pid: pid,
              sid: sid,
              companyId: companyId,
              couponMoney: couponMoney,
              name: name,
              photo: photo,
            }
            gwProductList.push(listItem);
          }
          that.setData({
            ["gwProductList"]: gwProductList,
          });
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团产品列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },

  gotopage(e) {
    var pagetype = e.currentTarget.dataset.pagetype
    wx.reLaunch({
      // url: '../selectStore/selectStore?pagetype=' + pagetype
      url: '/pages/alittle/alittle?pagetype=' + pagetype
    })
  },
  gotoGWProductPage(e) {
    var that = this
    var item = e.currentTarget.dataset.item

    if (Utils.isNotNull(item)) {
      var id = item.id
      var sid = item.sid
      var url = "";
      url = "../../packageYK/pages/detailsgood/detailsgood?isnv=1&pid=" + encodeURIComponent(id) + "&sid=" + sid;
      console.log("viewProductDetail:" + url)
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无效商品！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  gotoGWListPage(e) {
    let that = this,
      item = null;
    item = e.currentTarget.dataset.item;
    if (Utils.isNotNull(item) && Utils.isNotNull(item.num)) {
      wx.reLaunch({
        url: '/pages/alittle/alittle?gwn=' + item.num
      })
    }
  },
  gotoGWCouponListPage: function (e) {
    let that = this;
    wx.navigateTo({
      url: '../../packageYK/pages/seniority/seniority'
    })
  },
  //退出弹窗
  emptyType() {
    app.data.isShowSigninPop = false
    this.setData({
      productType: false
    })
  },
  //显示提示弹窗
  showout() {
    app.data.isShowSigninPop = false
    this.setData({
      productType: false
    })

  },
  /**
   * 签到
   */
  goSignin() {
    wx.navigateTo({
      url: '../../packageYK/pages/signin/signin',
    })
    this.setData({
      productType: false,
    })
    app.data.isShowSigninPop = false
  },
  //悬浮球事件
  changeba(e) {
    if (e.changedTouches[0].clientX > 200) {
      this.setData({
        ball: !this.data.ball,
        scrollX: 400,
        scrollY: e.changedTouches[0].clientY - 24
      })
    } else {
      this.setData({
        ball: !this.data.ball,
        scrollX: 0,
        scrollY: e.changedTouches[0].clientY - 24
      })
    }
  },
})
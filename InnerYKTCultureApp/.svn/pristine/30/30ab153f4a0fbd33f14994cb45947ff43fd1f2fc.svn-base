// packageOther/pages/myfenxiao/myfenxiao.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var PYTool = require('../../../utils/pinyin.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize = 5, defaultItemImgSrc = DataURL + app.data.defaultImg, packSMPageUrl = "../../../packageSMall/pages", packOtherPageUrl = "../../packageOther/pages", homePageUrl = "../../../" + app.data.sysMainPage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,     //是否已经加载
    isForbidRefresh: false,        //是否禁止刷新
    isOpenMerchantPlatform: false, //是否开放商户平台
    mallChannelId:0,

    totalDataCount: 0, //总数据条数
    currentPage: 0,    //当前页码
    articles: [],      //存放所有的页记录

    distributionADUrl:[],     //顶部滚动分销广告图片
    distributionADUrlCnt: 0,  //顶部滚动分销广告图片数量
    //商品过滤
    isSelFAll: true,
    isSelFCommission: false,
    isSelFPrice: false,
    selPriceConParam: -1,            //筛选价格排序：-1默认，0从低到高，1从高到低
    selCommissionConParam: -1,       //筛选价格排序：-1默认，0从低到高，1从高到低

    currentData: 0,

    //分销统计
    commissionAmount:0.00,
    personApplyDeposit:0.00,          //个人申请所付押金
    revokeReturnDepositDays:0,        //撤销分销返佣身份押金回退天数

    //顶部滚动广告Banner
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    //分享
    shareWXAlert: "", //分享提示信息
    shareWXImg: "",//DataURL + "/images/productshare01.jpg?" + (Math.random() / 9999),

    mainDescribeType: 0,   //0：分享返佣说明 1：代理介绍 2：定制介绍

    mainDescribeInfo: null, //描述信息
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
    console.log('获取当前滑块的index')
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    var that = this, current=0;
    try{
      current = parseInt(e.target.dataset.current);
      current=isNaN(current)?0:current;
    }catch(e){}
    
    if (that.data.currentData === current) {
      return false;
    } else {
      that.setData({
        currentData: current
      })
    }
    switch(current){
      case 1:
        that.getCommissionInfo();
        break;
      case 2:
        if (that.data.mainDescribeInfo == null || that.data.mainDescribeInfo==undefined){
          that.getMainDescribe();
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log('登录时间：')
    // console.log((new Date()))
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight - 40
        });
      }
    })

    appUserInfo = app.globalData.userInfo;
    that.loginAction = 0;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
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
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null || appUserInfo == undefined) {
          wx.showToast({
            title: '获取登录信息失败！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        var distributionADUrl = [], distributionADUrlCnt=0;
        if (app.data.distributionADUrl != null && app.data.distributionADUrl != undefined && app.data.distributionADUrl.length>0){
          distributionADUrl = app.data.distributionADUrl;
          distributionADUrlCnt = app.data.distributionADUrl.length;
        }
        that.setData({
          isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
          distributionADUrl: distributionADUrl,
          distributionADUrlCnt: distributionADUrlCnt,
        })
        that.loadInitData();
        break;
    }
  },
  /* 关于 */
  wallet: function () {
    wx.navigateTo({
      url: "../wallet/wallet"
    });
  },
  fxorder: function () {
    wx.navigateTo({
      url: "../fxorder/fxorder"
    });
  },
  fxdata: function () {
    wx.navigateTo({
      url: "../fxdata/fxdata"
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
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
        that.data.isForbidRefresh = false;
        console.log("onShow ...")
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this, shareWXImg = that.data.shareWXImg, shareAlert = that.data.shareWXAlert, url = "";
    shareAlert = Utils.myTrim(shareAlert) == "" ? app.data.alertSStoredistributor : shareAlert;
    console.log(shareWXImg);
    url = "/packageOther/pages/fenxiao/fenxiao?suid=" + appUserInfo.userId;
    console.log("分销分享：" + url)

    if (Utils.myTrim(shareWXImg) == ""){
      return {
        title: shareAlert,
        path: url,
        success: (res) => { // 成功后要做的事情
          console.log("分销分享成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    }else{
      return {
        title: shareAlert,
        path: url,
        imageUrl: shareWXImg,
        success: (res) => { // 成功后要做的事情
          console.log("分销分享成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
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
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
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
    var that = this;
    // console.log('加载数据时间：')
    // console.log((new Date()))
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //获取商品列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this, noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "", otherParamCon = "";
    
    noDataAlert = "暂无商品信息！";
    var selPriceConParam = that.data.selPriceConParam, selCommissionConParam = that.data.selCommissionConParam, isSelFAll = that.data.isSelFAll, isSelFCommission = that.data.isSelFCommission, isSelFPrice = that.data.isSelFPrice, ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.companyId, channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "", detailOrderParam = "&sDetail=price,updateDate", distributorParam ="&commission=1";
    //价格排序
    if (isSelFPrice) {
      if (selPriceConParam == 1)
        otherParamCon += "&sField=price&sOrder=desc";
      else
        otherParamCon += "&sField=price";
    }
    //佣金排序
    if (isSelFCommission) {
      if (selCommissionConParam == 1)
        otherParamCon += "&sField=commission&sOrder=desc";
      else
        otherParamCon += "&sField=commission";
    }

    //CH接口
    urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + ifOMPParam + channelParam + otherParamCon + detailOrderParam + "&userId=" + appUserInfo.userId + distributorParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var data = res.data.data, dataItem = null, detailItem = null, listItem = null, articles = [];
          var pid = 0, productDetailId = "", shopType = "", shopName = "", productId = "", productName = "", status = 0, statusId = 0, photoType = 0, photosString = "", photos = "", remark = "", sourcePrice = 0.00, sellPrice = 0.00, photosList = [], discountPrice = 0.00, couponpriceDecrement = 0.00, couponPrice = 0.00, channelPrice = 0.00, isShowPrice1 = true, isShowPrice2 = true, discountType = 0, couponMold = 0, couponfull = 0.00, isHideGroup = true, groupmold = 0, detailPhoto = [], coupondist = 0.00, commission=0.00;
          for (var i = 0; i < data.length; i++) {
            dataItem = null; listItem = null; dataItem = data[i];
            productDetailId = ""; shopType = ""; shopName = ""; productId = ""; productName = ""; status = 0; statusId = 0; photoType = 0; photos = ""; remark = ""; sourcePrice = 0.00; sellPrice = 0.00; discountPrice = 0.00; couponpriceDecrement = 0.00; couponPrice = 0.00; isShowPrice1 = false; isShowPrice2 = false; discountType = 0; channelPrice = 0.00; isHideGroup = true; groupmold = 0; coupondist = 0.00; commission = 0.00;
            //佣金
            if (dataItem.commission != null && dataItem.commission != undefined && Utils.myTrim(dataItem.commission + "") != "null") {
              try {
                commission = parseFloat(dataItem.commission);
                commission = isNaN(commission) ? 0.00 : commission;
              } catch (err) { }
            }
            commission = parseFloat((commission).toFixed(app.data.limitQPDecCnt));
            //团购标识
            if (dataItem.groupmold != null && dataItem.groupmold != undefined && Utils.myTrim(dataItem.groupmold + "") != "") {
              try {
                groupmold = parseInt(dataItem.groupmold);
                groupmold = isNaN(groupmold) ? 0 : groupmold;
              } catch (err) { }
            }
            isHideGroup = groupmold == 8 ? false : true;
            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            //
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              shopName = dataItem.companyName;
            if (dataItem.LevelName != null && dataItem.LevelName != undefined && Utils.myTrim(dataItem.LevelName + "") != "")
              shopType = dataItem.LevelName;
            if (dataItem.id != null && dataItem.id != undefined && Utils.myTrim(dataItem.id + "") != "")
              productId = dataItem.id;
            if (dataItem.photoType != null && dataItem.photoType != undefined && Utils.myTrim(dataItem.photoType + "") != "") {
              try {
                photoType = parseInt(dataItem.photoType);
                photoType = isNaN(photoType) ? 0 : photoType;
              } catch (err) { }
            }
            if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
              if (dataItem.detail[0].photos != null && dataItem.detail[0].photos != undefined && Utils.myTrim(dataItem.detail[0].photos + "") != "" && Utils.myTrim(dataItem.detail[0].photos + "") != "null") {
                photosString = ""; photosString = dataItem.detail[0].photos;
                detailPhoto = [];
                detailPhoto = photosString.split(",");
                if (detailPhoto.length > 0) photos = app.getSysImgUrl(detailPhoto[0]);
              }
            }
            if (Utils.myTrim(photos) == "" || Utils.myTrim(photos) == defaultItemImgSrc) {
              if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
                photosString = ""; photosString = dataItem.photos;
                photosList = [];
                photosList = photosString.split(",");
                if (photosList.length > 0) photos = photosList[0];
              }
            }

            if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
              remark = dataItem.remark;


            //重新设置的价格
            if (dataItem.minprice != null && dataItem.minprice != undefined && Utils.myTrim(dataItem.minprice + "") != "") {
              try {
                sourcePrice = parseFloat(dataItem.minprice);
                sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
              } catch (err) { }
            }
            sellPrice = sourcePrice;
            //渠道价 
            if (dataItem.channelPrice != null && dataItem.channelPrice != undefined && Utils.myTrim(dataItem.channelPrice + "") != "") {
              try {
                channelPrice = parseFloat(dataItem.channelPrice);
                channelPrice = isNaN(channelPrice) ? 0.00 : channelPrice;

                if (channelPrice > 0.00) {
                  sourcePrice = channelPrice;
                  sellPrice = sourcePrice;
                }
              } catch (err) { }
            }
            //劵后价
            if (dataItem.coupondist != null && dataItem.coupondist != undefined && Utils.myTrim(dataItem.coupondist + "") != "null") {
              try {
                coupondist = parseFloat(dataItem.coupondist);
                coupondist = isNaN(coupondist) ? 0 : coupondist;
              } catch (err) { }
            }
            if (coupondist > 0.00 && coupondist < sellPrice) {
              couponPrice = sellPrice - coupondist;
              if (couponPrice > 0.00) {
                isShowPrice1 = true;
                couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
              }
            }

            //特惠价或套装价
            if (dataItem.way != null && dataItem.way != undefined && Utils.myTrim(dataItem.way + "") != "") {
              try {
                discountType = parseInt(dataItem.way);
                discountType = isNaN(discountType) ? 0 : discountType;

                if (dataItem.discount != null && dataItem.discount != undefined && Utils.myTrim(dataItem.discount + "") != "") {
                  try {
                    discountPrice = parseFloat(dataItem.discount);
                    discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                    discountPrice = sellPrice - discountPrice;
                    discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                    isShowPrice2 = discountPrice < 0.00 ? false : true;
                  } catch (err) { }
                }
              } catch (err) { }
            }
            shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
            listItem = {
              pid: dataItem.pid, shopType: shopType, shopName: shopName, productId: productId, productName: Utils.myTrim(productName) != "" ? productName : remark, photoType: photoType, photos: app.getSysImgUrl(photos), remark: remark, sourcePrice: sourcePrice, sellPrice: sellPrice, couponPrice: couponPrice, discountPrice: discountPrice, channelPrice: channelPrice, isShowPrice1: isShowPrice1, isShowPrice2: isShowPrice2, discountType: discountType, mallChannelId: that.data.mallChannelId, isHideGroup: isHideGroup, commission: commission,
            }
            articles.push(listItem);
          }
          if (articles.length > 0) {
            // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
            var totalDataCount = that.data.totalDataCount;
            totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
            console.log("totalDataCount:" + totalDataCount);
            console.log(articles)
            // 直接将新一页的数据添加到数组里
            that.setData({
              ["dataArray[" + pageIndex + "]"]: articles,
              currentPage: pageIndex,
              totalDataCount: totalDataCount
            })
            // console.log('数据加载完成时间：')
            // console.log((new Date()))
          } else if (pageIndex == 1) {
            wx.showToast({
              title: noDataAlert,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取商品列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品列表接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //事件：浏览商品详情
  viewProductDetail: function (e) {
    var that = this, item = null,id=0, url = "";
    try{
      item = e.currentTarget.dataset.item;
      if(item!=null && item!=undefined){
        id = parseInt(item.pid);
        id=isNaN(id)?0:id;
      }
    }catch(err){}
    if (id != 0) {
      that.data.isForbidRefresh = true;
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + id + "&distributorid=" + appUserInfo.userId;
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
  //////////////////////////////////////////////////////////////////
  //----商品过滤-----------------------------------------------------
  filterSearch: function (e) {
    var that = this, tag = 0, isSelFAll = that.data.isSelFAll, isSelFCommission = that.data.isSelFCommission, isSelFPrice = that.data.isSelFPrice, selPriceConParam = that.data.selPriceConParam, selCommissionConParam = that.data.selCommissionConParam;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    //tag:0全部，1佣金，2价格
    switch (tag) {
      case 0:
        isSelFAll = true; isSelFCommission = false; isSelFPrice = false; selPriceConParam = -1; selCommissionConParam=-1;
        break;
      case 1:
        isSelFAll = false; isSelFCommission = true; selCommissionConParam = selCommissionConParam == -1 || selCommissionConParam == 1 ? 0 : 1; 
        isSelFPrice = false;selPriceConParam = -1;
        break;
      case 2:
        isSelFAll = false; isSelFPrice = true; selPriceConParam = selPriceConParam == -1 || selPriceConParam == 1 ? 0 : 1; 
        isSelFCommission = false;selCommissionConParam = -1;
        break;
    }

    that.setData({
      isSelFAll: isSelFAll,
      isSelFCommission: isSelFCommission,
      isSelFPrice: isSelFPrice,
      selPriceConParam: selPriceConParam,
      selCommissionConParam: selCommissionConParam,
    })
    that.loadInitData();
  },

  //////////////////////////////////////////////////////////////////
  //----分销统计-----------------------------------------------------
  //获取分销统计信息
  getCommissionInfo: function () {
    var that = this, noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    noDataAlert = "暂无分销统计信息！";
    urlParam = "cls=product_activity&action=QueryDistribute&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('分销统计信息：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var commissionAmount = 0.00;
          try{
            commissionAmount = parseFloat(res.data.total);
            commissionAmount = isNaN(commissionAmount) ? 0.00 : commissionAmount;
            commissionAmount = parseFloat((commissionAmount).toFixed(app.data.limitQPDecCnt));
          }catch(err){}
          that.setData({
            commissionAmount: commissionAmount,
          })
          that.getMyApplyDistributorInfo();
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取商品分类列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品分类接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品分类接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取我的分销申请信息
  getMyApplyDistributorInfo: function () {
    var that = this;
    app.getApplyDistributorInfo(that);
  },
  //方法：获取分销申请信息结果处理函数
  dowithGetApplyDistributorInfo: function (data, tag, errorInfo) {
    var that = this;
    errorInfo = Utils.myTrim(errorInfo) == "" ? "获取分销申请信息失败！" : errorInfo;
    //1成功，0失败
    switch (tag) {
      case 1:
        var personApplyDeposit = 0.00,revokeReturnDepositDays = 0;
        try {
          personApplyDeposit = parseFloat(data.payYJ);
          personApplyDeposit = isNaN(personApplyDeposit) ? 0.00 : personApplyDeposit;
        } catch (e) { }
        try {
          revokeReturnDepositDays = parseInt(data.day);
          revokeReturnDepositDays = isNaN(revokeReturnDepositDays) ? 0 : revokeReturnDepositDays;
        } catch (e) { }
        personApplyDeposit = parseFloat(personApplyDeposit.toFixed(app.data.limitQPDecCnt));
        that.setData({
          personApplyDeposit: personApplyDeposit,
          revokeReturnDepositDays: revokeReturnDepositDays,
        })
        break;

      default:
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //事件：跳转导航页面
  gotoSMGuidePage: function (e) {
    var that = this, pagename = e.currentTarget.dataset.pagename, url = "";
    
    if (Utils.myTrim(pagename) == "smqrcode") {
      that.showStoreMainPageQRCode();
    } else {
      url = "../" + pagename + "/" + pagename;
      wx.navigateTo({
        url: url
      });
    }
  },
  //事件：打开广告图片链接页面
  viewADPage: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url, m = 0;
    if (Utils.myTrim(url) == "") {
      var src = e.currentTarget.dataset.src;
      if (Utils.myTrim(src) != ""){
        that.data.isForbidRefresh = true;
        app.viewImg(e);
      } 
      return
    };
    wx.navigateTo({
      url: url
    });
  },
  //方法：获取特定描述信息
  getMainDescribe: function () {
    var that = this, mainDescribeType = that.data.mainDescribeType;
    app.getMainDescribe(that, mainDescribeType);
  },
  //方法：获取特定描述信息结果处理函数
  dowithGetMainDescribe: function (dataItem, tag, errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        var mainDescribeInfo = null, agreement = "", describes = "";
        if (dataItem.agreement != null && dataItem.agreement != undefined && Utils.myTrim(dataItem.agreement + "") != "" && Utils.myTrim(dataItem.agreement + "") != "null" && Utils.myTrim(dataItem.agreement + "") != "undefined")
          agreement = dataItem.agreement;
        if (dataItem.describes != null && dataItem.describes != undefined && Utils.myTrim(dataItem.describes + "") != "" && Utils.myTrim(dataItem.describes + "") != "null" && Utils.myTrim(dataItem.describes + "") != "undefined")
          describes = dataItem.describes;

        agreement = Utils.myTrim(agreement) != "" ? Utils.replaceHtmlChar(agreement) : "";
        describes = Utils.myTrim(describes) != "" ? Utils.replaceHtmlChar(describes) : "";
        
        agreement = '<div class="div_class">' + agreement + "</div>";
        describes = '<div class="div_class">' + describes + "</div>"

        mainDescribeInfo = { agreement: agreement, describes: describes }
        console.log(mainDescribeInfo)
        that.setData({
          mainDescribeInfo: mainDescribeInfo,
        })
        break;
      default:
        break;
    }
  },
  //////////////////////////////////////////////////////////////////
  //----退出分销-----------------------------------------------------
  //事件：返回主页
  gotoHomePage: function (e) {
    wx.reLaunch({
      url: homePageUrl
    });
  },
  //方法：退出分销返佣
  quitDistributionRole: function () {
    var that = this, noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_activity&action=CancelDistribute&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('退出分享返佣身份：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          appUserInfo.isDistributor=false;
          wx.showToast({
            title: "退出分享返佣成功！",
            icon: 'none',
            duration: 2000
          })
          setTimeout(that.gotoHomePage, 2000);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "退出分享返佣：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "退出分享返佣接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "退出分享返佣接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //事件：退出分销返佣
  quitDistributionEvent: function (e) {
    var that=this;
    wx.showModal({
      title: '系统消息',
      content: "您确定退出分享返佣吗？退出后您的商品返佣数据和返佣订单数据将会被清空。",
      icon: 'none',
      duration: 1500,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          console.log("cancel del")
          return;
        } else {
          //点击确定
          console.log("sure del")
          that.quitDistributionRole();
        }
      },
    })
  },
})
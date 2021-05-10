// pages/conversion/conversion.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.smurl, OURL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = app.data.pageSize, defaultItemImgSrc = DataURL + "/images/noimg.png", packTempPageUrl = "../../../packageTemplate/pages", packSMPageUrl = "../../../packageSMall/pages";
var appUserInfo = app.globalData.userInfo;

Page({
  data: {
    DataURL: DataURL,
    isLoad: false,        //是否已经加载
    isForbidRefresh: false,     //是否禁止刷新
    points: 0,             //商品ID

    totalDataCount: 0, //总数据条数
    currentPage: 0,    //当前页码
    articles: [],      //存放所有的页记录

    randomNum: Math.random() / 9999,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    console.log(options);
    var points=0;
    try {
      if (options.points != null && options.points != undefined)
        points = parseInt(options.points);
      points = isNaN(points) ? 0 : points;
    } catch (e) { }
    that.setData({
      points: points
    })
    that.loadInitData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) {
        return;
      } else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          // 加载页面初始化时需要的数据
          that.loadInitData();
        }
      }
    }
    that.data.isForbidRefresh = false;
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
    var that = this
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
    var urlParam = "", sign = "", otherParamCon = "&score=0", ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.companyId, detailOrderParam = "&sDetail=score,updateDate";
    noDataAlert = "暂无商品信息！";

    //CH接口
    urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + ifOMPParam + otherParamCon + detailOrderParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var data = res.data.data, dataItem = null, detailItem = null, listItem = null, articles = [];
          var pid = 0, productDetailId = "", shopType = "", shopName = "", productId = "", productName = "", status = 0, statusId = 0, photoType = 0, photos = "", remark = "", price = 0.00, sprice = 0.00, tprice = 0.00, cprice = 0.00, mprice = 0.00, aprice = 0.00, sourcePrice = 0.00, sellPrice = 0.00, sourcePrice0 = 0.00, sellPrice0 = 0.00, sellScore = 0, dScore = 0, photosString = "", detailPhoto = [], photosList = [], dSort = 0, productType=0;
          for (var i = 0; i < data.length; i++) {
            dataItem = null; listItem = null; dataItem = data[i];
            productDetailId = ""; shopType = ""; shopName = ""; productId = ""; productName = ""; status = 0; statusId = 0; photoType = 0; photos = ""; remark = ""; price = 0.00; sprice = 0.00; tprice = 0.00; cprice = 0.00; mprice = 0.00; aprice = 0.00; sourcePrice = 0.00; sellPrice = 0.00; sellScore = 0; dSort = 0; productType = 0;
            // if (dataItem.minscore != null && dataItem.minscore != undefined && Utils.myTrim(dataItem.minscore + "") != "") {
            //   try {
            //     sellScore = parseInt(dataItem.minscore);
            //     sellScore = isNaN(sellScore) ? 0 : sellScore;
            //   } catch (err) { }
            // }
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
            if (dataItem.productType != null && dataItem.productType != undefined && Utils.myTrim(dataItem.productType + "") != "") {
              try {
                productType = parseInt(dataItem.productType);
                productType = isNaN(productType) ? 0 : productType;
              } catch (err) { }
            }
            
            if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
              remark = dataItem.remark;
            //----------
            if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
              for (var n = 0; n < dataItem.detail.length; n++) {
                detailItem = null; detailItem = dataItem.detail[n]; sourcePrice0 = 0.00; sellPrice0 = 0.00; dScore = 0; 
                if (detailItem.score != null && detailItem.score != undefined && Utils.myTrim(detailItem.score + "") != "") {
                  try {
                    dScore = parseInt(detailItem.score);
                    dScore = isNaN(dScore) ? 0 : dScore;
                  } catch (err) { }
                }
                if(dScore<=0)continue;
                if (dSort == 0) {
                  if (detailItem.photos != null && detailItem.photos != undefined && Utils.myTrim(detailItem.photos + "") != "" && Utils.myTrim(detailItem.photos + "") != "null") {
                    photosString = ""; photosString = detailItem.photos;
                    detailPhoto = [];
                    detailPhoto = photosString.split(",");
                    if (detailPhoto.length > 0) photos = app.getSysImgUrl(detailPhoto[0]);
                  }
                }
                dSort=dSort+1;
                if ((dScore > 0 && sellScore > 0 && dScore < sellScore) || (dScore > 0 && sellScore <= 0)) sellScore=dScore;
                
                if (detailItem.aprice != null && detailItem.aprice != undefined && Utils.myTrim(detailItem.aprice + "") != "") {
                  try {
                    aprice = parseFloat(detailItem.aprice);
                    aprice = isNaN(aprice) ? 0.00 : aprice;
                  } catch (err) { }
                }
                if (detailItem.cprice != null && detailItem.cprice != undefined && Utils.myTrim(detailItem.cprice + "") != "") {
                  try {
                    cprice = parseFloat(detailItem.cprice);
                    cprice = isNaN(cprice) ? 0.00 : cprice;
                  } catch (err) { }
                }
                if (detailItem.mprice != null && detailItem.mprice != undefined && Utils.myTrim(detailItem.mprice + "") != "") {
                  try {
                    mprice = parseFloat(detailItem.mprice);
                    mprice = isNaN(mprice) ? 0.00 : mprice;
                  } catch (err) { }
                }

                if (detailItem.price != null && detailItem.price != undefined && Utils.myTrim(detailItem.price + "") != "") {
                  try {
                    price = parseFloat(detailItem.price);
                    price = isNaN(price) ? 0.00 : price;
                  } catch (err) { }
                }
                if (detailItem.sprice != null && detailItem.sprice != undefined && Utils.myTrim(detailItem.sprice + "") != "") {
                  try {
                    sprice = parseFloat(detailItem.sprice);
                    sprice = isNaN(sprice) ? 0.00 : sprice;
                  } catch (err) { }
                }
                if (detailItem.tprice != null && detailItem.tprice != undefined && Utils.myTrim(detailItem.tprice + "") != "") {
                  try {
                    tprice = parseFloat(detailItem.tprice);
                    tprice = isNaN(tprice) ? 0.00 : tprice;
                  } catch (err) { }
                }

                if (detailItem.pstatus != null && detailItem.pstatus != undefined && Utils.myTrim(detailItem.pstatus + "") != "") {
                  try {
                    status = parseInt(detailItem.pstatus);
                    status = isNaN(status) ? 0 : status;
                  } catch (err) { }
                }
                if (detailItem.statusId != null && detailItem.statusId != undefined && Utils.myTrim(detailItem.statusId + "") != "") {
                  try {
                    statusId = parseInt(detailItem.statusId);
                    statusId = isNaN(statusId) ? 0 : statusId;
                  } catch (err) { }
                }
                sourcePrice0 = price;
                //0原价1销售价2特价3活动4会员5成本
                switch (status) {
                  case 1:
                    sellPrice0 = sprice;
                    break;
                  case 2:
                    sellPrice0 = tprice;
                    break;
                  case 3:
                    sellPrice0 = aprice;
                    break;
                  case 4:
                    sellPrice0 = mprice;
                    break;
                  case 5:
                    sellPrice0 = cprice;
                    break;
                  default:
                    sellPrice0 = price;
                    break;
                }
                if (sellPrice <= 0 || (sellPrice > 0 && sellPrice > sellPrice0)) {
                  sellPrice = sellPrice0;
                  sourcePrice = sourcePrice0;
                }
              }
            }
            if (Utils.myTrim(photos) == "" || Utils.myTrim(photos) == defaultItemImgSrc) {
              if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
                photosString = ""; photosString = dataItem.photos;
                photosList = [];
                photosList = photosString.split(",");
                if (photosList.length > 0) {
                  for (var n = 0; n < photosList.length; n++) {
                    photosString = photosList[n].toLowerCase();
                    if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                      photos = app.getSysImgUrl(photosList[n]);
                      break;
                    }
                  }
                } 
              }
            }
            
            shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
            listItem = {
              pid: dataItem.pid, shopType: shopType, shopName: shopName, productId: productId, productName: Utils.myTrim(productName) != "" ? productName : remark, photoType: photoType, photos: app.getSysImgUrl(photos), remark: remark, sourcePrice: sourcePrice, sellPrice: sellPrice, sellScore: sellScore, productType: productType,
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
    var that = this, id = e.currentTarget.dataset.id, ptype=0, url="";
    
    if (Utils.myTrim(id) != "") {
      try {
        ptype = parseInt(e.currentTarget.dataset.ptype);
        ptype = isNaN(ptype) ? 0 : ptype;
      } catch (err) { }
      switch (ptype) {
        case 2:
          url = packTempPageUrl + "/hoteldetails/hoteldetails?isnv=1&vtype=1&pid=" + encodeURIComponent(id);
          break;
        default:
          url = packSMPageUrl + "/storedetails/storedetails?isnv=1&vtype=1&pid=" + encodeURIComponent(id);
          break;
      }
      that.data.isForbidRefresh = true;
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
})
// pages/conversionorder/conversionorder.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = app.data.pageSize, defaultItemImgSrc = DataURL + "/images/noimg.png", isDowithing = false, isFirstLoad = true;
var appUserInfo = app.globalData.userInfo;

Page({
  data: {
    DataURL: DataURL,
    isLoad: false,     //是否已经加载

    otype:0,           //订单类型：1积分兑换，2领奖
    mainId:'',
    activityId:0,      //对应活动ID
    isHaveData:false,  //是否有数据

    carts: [],               // 默认收货地址
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    console.log("加载：......");
    console.log(options);
    var orderid = '', otype=0;
    try {
      if (options.orderid != null && options.orderid != undefined && Utils.myTrim(options.orderid + "") != "") orderid = options.orderid;
    } catch (e) { }
    try {
      if (options.otype != null && options.otype != undefined && Utils.myTrim(options.otype + "") != "") {
        otype = parseInt(options.otype);
        otype = isNaN(otype) ? 0 : otype;
      }
    } catch (e) { }
    isDowithing=false;
    that.setData({
      mainId: orderid,
      otype: otype,
    })
    that.getMainData();
    if (!Utils.isNull(app.data.updateCartsData) && app.data.updateCartsData.id != that.data.carts.id) {
      console.log('有选择')
      this.setData({
        carts: app.data.updateCartsData,
        showAddess: true,
      })
    } else {
      console.log('没选择')
      that.selectAddress();
    }
  },
  onShow() {
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
        that.getMainData();
      }
    }
    // yzq 修改选中非默认地址多次去选地址界面 来回切换
    // if (!Utils.isNull(app.data.updateCartsData) && app.data.updateCartsData.id != this.data.carts.id) {
    if (!Utils.isNull(app.data.updateCartsData)) {
      console.log('有选择')
      this.setData({
        carts: app.data.updateCartsData,
        showAddess: true,
      })
    } else {
      console.log('没选择')
      this.selectAddress();
    }
    console.log("onShow ...")
  },
  //方法：获取订单详情
  getMainData: function (id) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_order&action=QueryOrders" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId + "&orderId=" + that.data.mainId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad=true;
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined) {
            var data = res.data.data[0], activityId = 0, goodsList=null;
            if (data.activityId != null && data.activityId != undefined && Utils.myTrim(data.activityId + "") != "") {
              try {
                activityId = parseInt(data.activityId);
                activityId = isNaN(activityId) ? 0 : activityId;
              } catch (err) { }
            }
            data.paymentPrice = -1;
            goodsList = data.detail;
            if (goodsList != null && goodsList != undefined && goodsList.length>0){
              var datailDataItem = null, photos = [], photosString = "", productPhotosValue="";
              for(var i=0;i<goodsList.length;i++){
                datailDataItem = goodsList[i]; photosString = ""; productPhotosValue = "";
                if (datailDataItem.productPhotos != null && datailDataItem.productPhotos != undefined && Utils.myTrim(datailDataItem.productPhotos + "") != "") {
                  photosString = ""; photosString = datailDataItem.productPhotos; photos = [];
                  photos = photosString.split(",");
                  if (photos.length > 0) {
                    for (var n = 0; n < photos.length; n++) {
                      // 判断是否是视频地址
                      photosString = photos[n].toLowerCase();
                      if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                        productPhotosValue = app.getSysImgUrl(photos[n]);
                        break;
                      }
                    }
                    goodsList[i].productPhotos = productPhotosValue;
                  }
                }
              }
            }
            that.setData({
              orderList: data,
              goodsList: goodsList,

              activityId: activityId,
              isHaveData:true,
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取订单详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取订单详情接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取订单详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：查询默认收货地址
  selectAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_address&action=selectAddress&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (data.length > 0) {
            var defaultIndex = 0;
            for (let i = 0; i < data.length; i++) {
              data[i].area = data[i].area.split(',');
              if (data[i].selected) defaultIndex = i;
            }
            that.setData({
              carts: data[defaultIndex],
              showAddess: true
            })
          } else {
            that.setData({
              carts: [],
              showAddess: false
            })
          }
          console.log("查询默认收货地址：", that.data.carts)
        } else {
          app.setErrorMsg2(that, "查询默认收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //方法：更新订单信息
  updateOrderInfo: function () {
    var that = this;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中...",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.carts.length == 0) {
      wx.showModal({
        title: '提示',
        content: '您暂未添加收货地址，请先添加收货地址',
        confirmText: '添加',
        success(res) {
          if (res.confirm) {
            that.navigateNewAddress();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    isDowithing=true;
    wx.showLoading({
      title: '正在操作中...',
    })
    var timestamp = Date.parse(new Date()), urlParam = "", sign="";
    timestamp = timestamp / 1000;
    //订单类型：1积分兑换，2领奖
    switch(that.data.otype){
      case 1:
        var score=0;
        try{
          score = that.data.orderList.amount;
        }catch(err){}
        urlParam = "cls=product_score&action=UseScore&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId + "&orderId=" + that.data.mainId;
        sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
        console.log('sign:' + urlParam + "&key=" + KEY)
        urlParam = urlParam + "&mold=1&status=1&score=" + score + "&deliveryId=" + that.data.carts.id + "&sign=" + sign;
        console.log(URL + urlParam)
        console.log('~~~~~~~~~~~~~~~~~~~')
        wx.request({
          url: URL + urlParam,
          success: function (res) {
            console.log('更新订单 地址', res)
            if (res.data.rspCode == 0) {
              that.dowithAfterSuccess();
            } else {
              wx.showToast({
                title: res.data.rspMsg,
                icon: 'none',
                duration: 2000
              })
              app.setErrorMsg2(that, "更新订单：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
              isDowithing = false;
            }
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: "更新订单接口失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "更新订单接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
            isDowithing = false;
          }
        })
        break;
      
      case 2:
        urlParam = "cls=product_score&action=UseScore&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId + "&orderId=" + that.data.mainId;
        sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
        console.log('sign:' + urlParam + "&key=" + KEY)
        urlParam = urlParam + "&linkNo=2&activityId=" + that.data.activityId + "&deliveryId=" + that.data.carts.id + "&sign=" + sign;
        console.log(URL + urlParam)
        console.log('~~~~~~~~~~~~~~~~~~~')
        wx.request({
          url: URL + urlParam,
          success: function (res) {
            console.log('更新订单 地址', res)
            if (res.data.rspCode == 0) {
              that.dowithAfterSuccess();
            } else {
              wx.showToast({
                title: res.data.rspMsg,
                icon: 'none',
                duration: 2000
              })
              app.setErrorMsg2(that, "更新订单：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
              isDowithing = false;
            }
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: "更新订单接口失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "更新订单接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
            isDowithing = false;
          }
        })
        break;
    }
    
  },
  //方法：订单处理成功后续操作
  dowithAfterSuccess:function(){
    var that = this, alertMsg = "", otype = that.data.otype;
    //订单类型：1积分兑换，2领奖
    switch (otype){
      case 1:
        alertMsg ="积分兑换";
        break;
      case 1:
        alertMsg = "领奖";
        break;
      default:
        alertMsg = "领奖";
        break;
    }
    alertMsg+="成功！"
    setTimeout(that.gotoNoReceivedOrderPage, 2000);
    wx.showToast({
      title: alertMsg,
      icon: 'none',
      duration: 2000
    })
  },
  //方法：跳转待收货页面
  gotoNoReceivedOrderPage:function(){
    wx.navigateTo({
      url: "../mypoints/mypoints"
    });
  },
  //事件：跳转收货地址页面
  navigateAddress: function (scene) {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=1"
    });
  },
  //事件：跳转新建收货地址页面
  navigateNewAddress: function () {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=2"
    });
  },
})
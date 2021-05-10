// packageSMall/pages/shoplogistics/shoplogistics.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
var BJYURL = app.getUrlAndKey.url
Page({
  data: {
    DataURL: DataURL,
    order: "",
    expressInformation: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //getOpenerEventChannel()微信系统方法，需调试库2.9.2 ,在json文件中加个"usingComponents": {} ,
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
      var order = data.order

      //算出运费
      var productLists = order.detail
      var expressFee = 0;
      var sum = 0
      for (let i = 0; i < productLists.length; i++) {
        var product = productLists[i];
        expressFee = expressFee + product.expressFee
        if (Utils.isNull(product.payamount)) {
          product.payamount = 0
        }
        sum += product.payamount

        if (Utils.isNull(product.attributeOne)) {
          product.attributeOne = ""
        }
        if (Utils.isNull(product.attributeTwo)) {
          product.attributeTwo = ""
        }
      }
      order.detail = productLists
      order.expressFee = expressFee
      // 合计总价
      order.sum = parseFloat(sum).toFixed(2)

      if (Utils.isNull(order.name)) {
        order.name = ""
      }
      if (Utils.isNull(order.ophone)) {
        order.ophone = ""
      }
      if (Utils.isNull(order.area)) {
        order.area = ""
      }
      if (Utils.isNull(order.address)) {
        order.address = ""
      }
      if (Utils.isNull(order.oaddr)) {
        order.oaddr = ""
      }
      if (Utils.isNull(order.mold)) {
        order.couponname = ""
      } else {
        if (order.mold == 0) {
          order.couponname = "满减券(满" + order.full + "元可用)"
        } else {
          order.couponname = order.discount + "元抵扣券"
        }
      }
      if (Utils.isNull(order.expressName)) {
        order.expressName = ""
      }
      if (Utils.isNull(order.remarks) || order.remarks == "undefined") {
        order.remarks = ""
      }

      that.setData({
        order: order
      })
    })

    that.showlogistics()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  showlogistics: function () {
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_delivery&action=QueryExpress&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&orderId=" + that.data.order.orderId + "&sign=" + sign;
    console.log('查看物流详情:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        var data = res.data
        if (Utils.isNull(data.com)) {
          wx.showToast({
            title: '物流信息暂未更新',
            icon: 'none',
            duration: 2000
          })
          return
        }

        var list = data.data
        for (var i = 0; i < list.length; i++) {
          list[i].date = list[i].time.substring(0, 10)
          list[i].ttime = list[i].time.substring(11, list[i].time.length)
        }

        that.setData({
          expressInformation: data,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 赠品 事件
   */
  showpopgigt: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var item = e.currentTarget.dataset.item;
    var detail = this.data.order.detail[item];

    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_goodtype&action=QueryProductGift&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&detailId=" + detail.gdetailId + "&sign=" + sign;
    console.log('查询赠品信息:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        // 格式化赠品商品图片
        for (let i = 0; i < data.length; i++) {
          var photoData = data[i];
          if (!Utils.isNull(photoData.detailPhotos)) {
            var images = photoData.detailPhotos.split(",");
            data[i].detailPhotos = images;
          }
          if (!Utils.isNull(photoData.productphotos)) {
            var images = photoData.productphotos.split(",");
            data[i].productphotos = images;
          }
        }

        that.setData({
          // 赠品商品详情
          giftDetail: data,
          showpopgift: true,
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    var that = this;
    app.viewImg(e);
  },
  hidepopgigt: function () {
    this.setData({
      showpopgift: false
    })
  },

  /**
   * 取消订单进行退款
   */
  refund: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: "您确定取消该订单吗?货款将在24小时内退款至您的账户。",
      success(res) {
        if (res.confirm) {
          // 判断实际支付
          if (that.data.order.payamount > 0) {
            that.sureRefund();
          } else {
            // 0元下单。直接取消订单
            that.requestUpdateOrderStatus(3);
          }
        } else if (res.cancel) {}
      }
    })
  },

  /**
   *  0元下单。直接更新订单取消状态
   */
  requestUpdateOrderStatus: function (status) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("id", that.data.order.orderId)
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + that.data.order.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&status=" + status + "&sign=" + sign;
    console.log('更新订单 URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更新订单', res)
        if (res.data.rspCode == 0) {
          if (status == 3) {
            wx.showToast({
              title: "取消订单成功",
              icon: 'none',
              duration: 2000
            })
            that.finshUpdate();
          } else {
            that.queryOrderDetail();
          }
        } else {
          app.setErrorMsg2(that, "更新订单 地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.setData({
          paymentdisabled: false
        })
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })

        console.log("接口失败：" + err)
      }
    })
  },

  /**
   * 确定取消订单进行退款
   */
  sureRefund: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var order = that.data.order;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=wxRefund_wxRefund&action=wxRefund&orderId=" + order.orderId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&wxAppId=" + app.data.wxAppId;;
    console.log('取消订单进行退款:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        if (data.code == 0) {
          wx.showToast({
            title: "退款申请成功",
            icon: 'none',
            duration: 2000
          })
          that.finshUpdate();
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 结束当前页面 并通知上一级页面更新数据
   */
  finshUpdate: function () {
    setTimeout(function () {
      let pages = getCurrentPages();
      //  是上一页
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        isReData: true,
      })
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  },
})
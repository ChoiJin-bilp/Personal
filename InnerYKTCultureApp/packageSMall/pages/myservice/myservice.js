// packageSMall/pages/myservice/myservice.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    pIndex: 1,
    pSize: 6,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryOrderDetail()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  /**
   * 上拉触底
   */
  onReachBottom: function() {
    console.log('上拉触底')
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pIndex: this.data.pIndex + 1
    })
    console.log("加载第" + this.data.pIndex + "页")
    this.queryOrderDetail();
  },

  /**
   * 查询售后订单
   */
  queryOrderDetail: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.muserInfo.userId + "&orderId=";
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败
    urlParam = urlParam + "&status=2&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign;
    console.log('查询售后订单:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('查询售后订单:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (that.data.pIndex == 1 && data.length == 0) {
            wx.showToast({
              title: '暂无售后',
              icon: 'none',
              duration: 1500,
            })
            return;
          }
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              var orderData = data[i];
              if (Utils.isNull(orderData.servicestatus)) {
                data.splice(i, 1);
                continue
              }
              //算出实际支付的钱，给予退款显示
              var payamount = 0
              for (let j = 0; j < orderData.detail; j++) {
                payamount = payamount + orderData.detail[j].payamount;
              }
              data[i].payamount = payamount;
            }
          }
          wx.hideLoading()
          if (that.data.pIndex > 1) {
            if (data.length > 0) {
              data = that.data.orderList.concat(data);
              that.setData({
                orderList: data,
              })
            } else {
              that.setData({
                pIndex: that.data.pIndex - 1,
              })
            }
            console.log('pIndex', that.data.pIndex)
            return;
          }
          that.setData({
            orderList: data,
          })
          console.log('处理完数据', data)
        } else {
          wx.hideLoading()
          app.setErrorMsg2(that, "查询售后订单！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 售后详情
   */
  servicedetail: function(e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index];
    wx.navigateTo({
      url: "../servicedetail/servicedetail",
      // 通过eventChannel向被打开页面传送数据
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order
        })
      }
    });
  },
})
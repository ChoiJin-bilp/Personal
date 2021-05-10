// packageSMall/pages/servicedetail/servicedetail.js
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
    //订单
    order: "",
    array: ['7天无理由', '发货慢', '货物损坏', '其它'],
    // 售后服务记录
    service: "",
    sellerRemarks: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //getOpenerEventChannel()微信系统方法，需调试库2.9.2 ,在json文件中加个"usingComponents": {} ,
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        order: data.order,
        // 是否是管理员
        admin: data.admin,
      })
    })
  },

  /**
   * 页面显示/切入前台时触发
   */
  onShow: function() {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    this.queryService()
  },
  inputReason: function(e) {
    // 获取输入框的内容
    this.setData({
      sellerRemarks: e.detail.value
    })
  },
  /**
   * 查询售后服务记录
   */
  queryService: function() {
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var appUserInfo = app.globalData.muserInfo;
    var urlParam = "cls=product_custservice&action=QueryService&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&orderId=" + that.data.order.orderId + "&sign=" + sign;
    console.log('查询售后服务记录:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: res => {
        console.log(res)
        var data = res.data
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].photoArray = data.data[i].photos.split(",");
        }
        var admin;
        // 已经处理的 隐藏拒绝同意按钮
        if (data.data[0].status != 0) {
          admin = false
        }
        that.setData({
          service: data,
          admin: admin,
        })
      },
      fail: err => {
        console.log(res)
      }
    })
  },
  sureService: function(e) {
    var type = e.currentTarget.dataset.type
    var that = this
    var content
    if (type == 1) {
      content = "同意该售后,支付金额将原路退还给用户"
    } else {
      content = "确定拒绝该售后?"
    }
    this.setData({
      changeinfor: false
    })
    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          that.saveService(type);
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 拒绝同意售后
   */
  saveService: function(status) {
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var appUserInfo = app.globalData.muserInfo;
    var urlParam = "cls=product_custservice&action=SaveService&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&orderId=" + that.data.order.orderId + "&sign=" + sign;
    console.log('拒绝同意售后:', URL + urlParam)
    var serviceData = [{
      id: that.data.service.data[0].id,
      mold: that.data.service.data[0].mold,
      companyId: that.data.service.data[0].companyId,
      status: status,
      sellerRemarks: that.data.sellerRemarks,
      description: "aaaaaaa",
    }]
    console.log(JSON.stringify(serviceData));
    wx.request({
      url: URL + urlParam,
      method: "POST",
      data: {
        data: JSON.stringify(serviceData)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res)
        var data = res.data
        wx.showToast({
          title: data.rspMsg,
          icon: "none",
          duration: 1500,
        })
        // 同意并退款
        if (that.data.order.payamount > 0 && status == 1) {
          that.sureRefund(that.data.order)
        } else if (data.rspCode == 0) {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1600)
        }
      },
      fail: err => {
        console.log(res)
      }
    })
  },
  /**
   * 确定取消订单进行退款
   */
  sureRefund: function(order) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=wxRefund_wxRefund&action=wxRefund&orderId=" + order.orderId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&wxAppId=" + app.data.wxAppId;;
    console.log('取消订单进行退款:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        if (data.code == 0) {
          wx.showToast({
            title: "退款成功",
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1600)
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(res) {
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
   * 重新申请售后
   */
  reapplyService: function() {
    var order = this.data.order;
    wx.navigateTo({
      url: "../service/service",
      // 通过eventChannel向被打开页面传送数据
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order
        })
      }
    });
  },

  hidechangeinfor: function() {
    this.setData({
      changeinfor: false
    })
  },
  showchangeinfor: function() {
    this.setData({
      changeinfor: true
    })
  },
})
// packageSMall/pages/merchant/merchant.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
var BJYURL = app.getUrlAndKey.url
//是否需要刷新数据，待付款中 继续支付完成返回需刷新
var isReData = false,
  defaultItemImgSrc = DataURL + app.data.defaultImg
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0

    select: false,
    grade_name: '全部',
    grades: ['全部', '待审核', '已同意', '已拒绝'],
    status: "",
    pIndex: 1,
    pSize: 4,
    smKey: "",
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
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    var index = e.currentTarget.dataset.index
    var status = 1;
    switch (index) {
      case 0:
        status = "0,1,2";
        break;
      case 1:
        status = 0;
        break;
      case 2:
        status = 1;
        break;
      case 3:
        status = 2;
        break;
    }
    this.setData({
      grade_name: name,
      select: false,
      status: status,
      pIndex: 1,
      orderList: "",
    })
    this.queryOrderDetail()
  },
  /**
   * 监听输入
   */
  changeValueMainData: function(e) {
    this.setData({
      smKey: e.detail.value
    })
  },

  /**
   * 确定搜索
   */
  gotoSMallPage: function() {
    if (Utils.isNull(this.data.smKey)) {
      this.setData({
        smKey: ""
      })
    }
    this.queryOrderDetail()
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
    urlParam = urlParam + "&status=2&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign + "&addit=" + that.data.smKey + "&servicestatus=" + that.data.status;
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
               //没有售后状态   
              // if (Utils.isNull(orderData.servicestatus)) {
              //   data.splice(i, 1);
              //   continue
              // }
              //算出实际支付的钱，给予退款显示
              var payamount = 0
              for (let j = 0; j < orderData.detail.length; j++) {              
                var detailDataItem = orderData.detail[j]
                payamount = payamount + orderData.detail[j].payamount;         
                //图片处理
                if (!Utils.isNull(detailDataItem.detailPhotos)) {
                  var imagesArray = detailDataItem.detailPhotos.split(",");
                  detailDataItem.detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
                }
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
   * 删除售后
   */
  removeService: function(e) {
    var orders = e.currentTarget.dataset.item;
    console.log(orders)
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除该售后记录?',
      success(res) {
        if (res.confirm) {
          that.updateService(orders);
        }
      },
    })
  },
  /**
   * 删除售后
   */
  updateService: function(orders) {
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var appUserInfo = app.globalData.muserInfo;
    var urlParam = "cls=product_custservice&action=SaveService&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&orderId=" + orders.orderId + "&sign=" + sign;
    console.log('删除售后:', URL + urlParam)
    var serviceData = [{
      id: orders.serviceid,
      companyId: orders.companyId,
      status: -1,
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
        if (data.rspCode == 0) {
          wx.showToast({
            title: "删除成功",
            icon: "none",
            duration: 1500,
          })
          setTimeout(function() {
            that.queryOrderDetail()
          }, 1600)
        } else {
          wx.showToast({
            title: data.rspMsg,
            icon: "none",
            duration: 1500,
          })
        }
      },
      fail: err => {
        console.log(res)
      }
    })
  },

  /**
   * 售后详情
   */
  servicedetail: function(e) {
    var order = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "../servicedetail/servicedetail",
      // 通过eventChannel向被打开页面传送数据
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order,
          admin: true,
        })
      }
    });
  },
})
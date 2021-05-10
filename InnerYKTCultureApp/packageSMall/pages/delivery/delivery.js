// pages/delivery/delivery.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl
var BJYURL = app.getUrlAndKey.url
Page({
  DataURL: DataURL,
  data: {
    carts: [],               // 购物车列表
    logistics:false,
    exitlogin:false,
    pIndex:1,
    pSize:20,
    status:null,
  },
  onLoad: function (options){
    var that = this;
    console.log("onLoad:", options)
    var otype = options.otype;
    var titleName = '';
    if (otype == 1){
      titleName = '待收货'
    } else if (otype == 0) {
      titleName = '待付款'
    } else if (otype == 2) {
      titleName = '已完成'
    }
    wx.setNavigationBarTitle({
      title: titleName
    });
    that.setData({
      status: options.otype
    })
    that.queryOrderDetail();
  },
  onShow() {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    this.setData({
      carts: [
        { id: 1, title: '华为HUAWEI note 5i四摄极点全面屏仅售1999元', image: '../../images/Profiles1.png', norms: '150*68*80mm', num: 4, price: 0.01, selected: true },
        { id: 2, title: '华为HUAWEI note 5i四摄极点全面屏仅售1999元', image: '../../images/Profiles1.png', num: 1, price: 0.03, selected: true }
      ]
    });
  },
  onReachBottom: function () {
    console.log('上拉触底')
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pIndex: this.data.pIndex + 1
    })
    console.log("加载第" + this.data.pIndex +"页")
    this.queryOrderDetail();
  },
  hidelogistics: function () {
    this.setData({
      logistics: false
    })
  },
  showlogistics: function (e) {
    var index = e.currentTarget.dataset.index;
    if (Utils.isNull(this.data.orderList[index].expressNo)){
      wx.showToast({
        title:  '物流信息暂未更新',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      logistics: true,
      orderIndex: index
    })
  },
  hideexitlogin: function () {
    this.setData({
      exitlogin: false
    })
  },
  showexitlogin: function () {
    this.setData({
      exitlogin: true
    })
  },
  //查询订单
  queryOrderDetail: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.muserInfo.userId + "&orderId=";
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&status=" + that.data.status + "&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign;
    console.log('查询订单详情:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询订单:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if(data.length >0){
            for(let i = 0; i < data.length;i++){
              var create_date = data[i].create_date;
                  create_date = Date.parse(new Date(create_date.replace(/\-/g, '/')));
              var nowTimestamp = Date.parse(new Date());
              if (nowTimestamp > create_date + (30 * 60 * 1000)) {
                 data[i].status = -1 //已失效
              }
            }
          }
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
          app.setErrorMsg2(that, "查询订单！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
      },complete:function(){
        wx.hideLoading()
      }
    })
  },
  //确认收货
  updateOrderStatus: function (e) {
    var that = this;
    console.log('e',e)
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    var content = "";
    if(status == 2){
      content = "确定已经收到货了吗";
    } else if (status == 3) {
      content = "确定要取消订单吗";
    } else if (status == 5) {
      content = "确定要删除订单吗";
    }
    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          that.requestUpdateOrderStatus(status, index);
        } else if (res.cancel) {
        }
      }
    })
  },
  //确认收货
  requestUpdateOrderStatus: function (status, index) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("index", index)
    console.log("that.data.orderList", that.data.orderList)
    console.log("id", that.data.orderList[index].orderId)
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + that.data.orderList[index].orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&status=" + status+ "&sign=" + sign;
    console.log('更新订单 URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更新订单', res)
        if (res.data.rspCode == 0) {
          that.queryOrderDetail();
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
  toDelivery:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "../shoporder/shoporder?orderid=" + this.data.orderList[index].orderId
    });
  }
})
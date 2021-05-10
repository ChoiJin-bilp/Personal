// pages/shopcar/shopcar.js
// pages/storedetails/storedetails.js
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
    carts: [], // 默认收货地址
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    showprivilege: false,
    showAddess: false,
    paymentdisabled: false,
    checkboxArr: [{
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      },
      {
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      },
      {
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      }

    ],
    showRemarkTeLabel: true,
    id: 0,
    couponsList: [], //订单可使用优惠券
    selectCoupons: null, //选中优惠券
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      orderId: options.orderid,
    })
  },
  onShow: function() {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
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
    this.queryOrderDetail();
  },
  onUnload: function() {
    console.log('页面卸载')
    app.data.updateCartsData = null;
  },
  //点击优惠劵显示隐藏
  showprivilege: function() {
    this.setData({
      showRemarkTeLabel: true
    })
    var that = this;
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
    that.queryUserCoupons(false);
  },
  /**
   * 显示默认选中的最大优惠卷
   */
  showMaxCoupons: function(data) {

    var couponsList = this.data.couponsList

    for (let i = 0; i < couponsList.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (couponsList[i].checked && data[j].keyid == couponsList[i].keyid) {
          data[j].checked = true
          break;
        }
      }
    }
    
    this.setData({     
      couponsList: data,
      showprivilege: true
    })
  },
  hideModaltip: function() {
    var couponsList = this.data.couponsList;
    var selectCoupons = this.data.selectCoupons;
    if (selectCoupons != null) {
      for (let i = 0; i < couponsList.length; i++) {
        if (couponsList[i].keyid == selectCoupons.keyid) {
          couponsList[i].checked = true;
        } else if (couponsList[i].checked) {
          couponsList[i].checked = false;
        }
      }
    }
    this.setData({
      couponsList: couponsList,
      showprivilege: false
    })
  },
  /**
   *  默认使用最大额度优惠卷
   */
  useCoupons: function(data) {
    if (data.length == 0) {
      return
    }
    // 优惠卷额度
    var discount = 0.0;
    var index = -1;
    for (let i = 0; i < data.length; i++) {
      if (discount < data[i].discount) {
        index = i;
        discount = data[i].discount;
      }
    }
    if (index == -1) {
      return
    }
    data[index].checked = true;
    this.setData({
      couponsList: data
    })
  },
  /**
   * 使用优惠卷
   */
  determineModaltip: function() {
    this.setData({
      showRemarkTeLabel: true
    })

    var couponsList = this.data.couponsList;
    var orderList = this.data.orderList;

    //算出总原价，然后使用优惠卷
    var sumPaymentPrice = 0
    //多件商品
    var productLists = orderList.detail
    for (let i = 0; i < productLists.length; i++) {
      var product = productLists[i];
      sumPaymentPrice = sumPaymentPrice + product.productprice * product.number
    }

    //初始化合计金额(没有使用优惠卷金额)
    orderList.paymentPrice = (parseFloat(orderList.amount) + parseFloat(orderList.expressFee)).toFixed(2);

    for (let i = 0; i < couponsList.length; i++) {
      if (couponsList[i].checked) {
        this.setData({
          selectCoupons: couponsList[i]
        })
        console.log("selectCoupons=", this.data.selectCoupons)
        // if (couponsList[i].mold == 0) { //目前只有满减和现金没有打折 直接减价格
        // }

        // yzq 使用优惠卷不分套装价和原价
        // orderList.paymentPrice = (orderList.amount - couponsList[i].discount).toFixed(2);
        // 解决有套装价时，使用优惠卷要用原价-优惠卷
        orderList.paymentPrice = (sumPaymentPrice - couponsList[i].discount).toFixed(2);

        console.log("使用优惠卷后:", orderList.paymentPrice)
        if (orderList.paymentPrice < 0) {
          orderList.paymentPrice = 0;
        }
        // 加运费
        orderList.paymentPrice = (parseFloat(orderList.paymentPrice) + parseFloat(orderList.expressFee)).toFixed(2);
        console.log("加运费:" + orderList.expressFee + "后", orderList.paymentPrice)
        this.setData({
          orderList: orderList,
          showprivilege: false
        })
        return;
      }
    }
    // orderList.paymentPrice = -1;
    this.setData({
      orderList: orderList,
      selectCoupons: null,
      showprivilege: false
    })
  },
  navigateNewAddress: function() {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=2"
    });
  },
  navigateAddress: function(scene) {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=1"
    });
  },
  //查询默认收货地址
  selectAddress: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_address&action=selectAddress&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
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
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //更新订单 地址
  updateOrderAddress: function() {
    var that = this;
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
    if (that.data.paymentdisabled == true) {
      console.log('禁用按钮')
      return;
    }
    that.setData({
      paymentdisabled: true
    })
    wx.showLoading({
      title: '正在加载中...',
    })

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + that.data.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&remarks=" + that.data.remark + "&deliveryId=" + that.data.carts.id + "&sign=" + sign;
    //0元支付 直接修改订单状态等；不用调用支付接口
    if (that.data.selectCoupons != null && that.data.orderList.paymentPrice == 0) {
      urlParam += '&status=1&couponid=' + that.data.selectCoupons.keyid + '&amount=' + that.data.orderList.amount + "&store=1";
    } else if (that.data.orderList.amount == 0) {
      urlParam += '&status=1&amount=' + that.data.orderList.amount + "&store=1";
    }
    console.log('更新订单 地址URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('更新订单 地址', res)
        if (res.data.rspCode == 0) {
          if ((that.data.selectCoupons != null && that.data.orderList.paymentPrice == 0) || (that.data.orderList.amount == 0)) {
            app.data.updateCartsData = null;
            wx.showToast({
              title: "下单成功！",
              icon: 'none',
              duration: 1500
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
            return;
          }
          that.nowpay();
        } else {
          app.setErrorMsg2(that, "更新订单 地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          that.setData({
            paymentdisabled: false
          })
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        that.setData({
          paymentdisabled: false
        })
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //注册支付
  nowpay: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var attach = '8_0_' + app.data.hotelId + '_3,' + that.data.orderId;
    // var price = (that.data.orderList.amount * 100).toFixed(0);
    var price = (that.data.orderList.paymentPrice * 100).toFixed(0);
    if (that.data.selectCoupons != null && that.data.orderList.paymentPrice > 0) {
      attach += '_' + that.data.selectCoupons.keyid;
      // price = (that.data.orderList.paymentPrice * 100).toFixed(0);
    }
    console.log('attach:', attach)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=" + encodeURIComponent("报价优-商城") + "&detail=" + encodeURIComponent("报价优-商城") + "&money=" + price + "&userId=" + app.globalData.muserInfo.userId + "&openid=" + app.globalData.muserInfo.wxopenId + "&attach=" + attach + "&sign=" + sign
    console.log(BJYURL + urlParam)
    wx.request({
      url: BJYURL + urlParam,
      success: function(res) {
        wx.hideLoading()
        if (res.data.rspCode == 0) {
          console.log("预支付获取成功", res.data)
          that.setData({
            paymentData: res.data.data,
            paymentdisabled: false
          })
          that.requestPayment();
        } else {
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          that.setData({
            paymentdisabled: false
          })
        }
      },
      fail: function(err) {
        wx.hideLoading()
        that.setData({
          paymentdisabled: false
        })
        wx.showToast({
          title: "网络错误！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //zhifu
  requestPayment: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var singParm = "appId=" + that.data.paymentData.appid + "&nonceStr=" + that.data.paymentData.nonce_str + "&package=prepay_id=" + that.data.paymentData.prepay_id + "&signType=MD5&timeStamp=" + timestamp + "&key=" + app.data.hotelKey;
    var sign = MD5JS.hexMD5(singParm);
    wx.requestPayment({
      'timeStamp': "" + timestamp,
      'nonceStr': that.data.paymentData.nonce_str,
      'package': 'prepay_id=' + that.data.paymentData.prepay_id,
      'signType': 'MD5',
      'paySign': sign,
      success: function(res) {
        app.data.updateCartsData = null;
        wx.showToast({
          title: "下单成功！",
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)

      },
      fail: function(res) {
        console.log("支付发起失败", res);
      }
    })
  },
  //更改订单状态为已支付
  saveOrders: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=SaveOrders&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    // var data = {};
    // data.orderId = that.data.orderid;
    // data.amount = that.data.amount;
    // data.companyId = app.globalData.muserInfo.companyId;
    // data.userId = app.globalData.muserInfo.userId;
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].selected) {
              that.setData({
                carts: data[i]
              })
              break;
            }
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
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询订单详情
  queryOrderDetail: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.muserInfo.userId + "&orderId=" + that.data.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    // urlParam = urlParam +"&status=1,2,3&pIndex=1&pSize=20&sField=sort&sOrder=desc"+ "&sign=" + sign;
    console.log('查询订单详情URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {

        console.log('查询订单详情11:', res)
        that.queryUserCoupons(true);
        if (res.data.rspCode == 0) {
          var data = res.data.data[0];
          // if (Utils.isNull(that.data.selectCoupons)) {
          //   data.paymentPrice = -1;
          // } else {
          //   data.paymentPrice = (data.amount - that.data.selectCoupons.discount).toFixed(2);
          // }

          //********************************** yzq算出运费
          var expressFee = 0;
          //多件商品
          var productLists = data.detail
          for (let i = 0; i < productLists.length; i++) {
            var product = productLists[i];
            expressFee = expressFee + product.expressFee
          }
          data.expressFee = expressFee
          //********************************** yzq算出运费

          //yzq 解决切换地址 上一句代码带来的bug  切换地址都重新加载
          data.paymentPrice = (data.amount + expressFee).toFixed(2);
          // 方便测试，订单支付金额为0
          // data.amount = 0
          // data.paymentPrice = 0
          that.setData({
            orderList: data,
            goodsList: data.detail,
          })

        } else {
          app.setErrorMsg2(that, "查询订单详情！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询可使用优惠券
  queryUserCoupons: function(isMax) {
    wx.showLoading({
      title: '正在加载中...',
    })
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.muserInfo.userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&orderId=" + that.data.orderId + "&isUsed=0";
    if (isMax) {
      urlParam = urlParam + "&ismax=0";
    }
    console.log('查询可使用优惠券:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('查询可使用优惠券:', res)
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].checked = false;
            }
            // that.setData({
            //   couponsList: data
            // })
            if (isMax) {
              that.useCoupons(data);
              // yzq 修改使用了优惠卷 然后切换收货地址。用原价-优惠卷价
              that.determineModaltip()
            } else {
              that.showMaxCoupons(data)
            }            
          }
        } else {
          app.setErrorMsg2(that, "查询可使用优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
        wx.hideLoading()
      },
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },

  choseTxtColor: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    var couponsList = this.data.couponsList;
    for (let i = 0; i < couponsList.length; i++) {
      if (i == index) {
        couponsList[index].checked = !couponsList[index].checked;
      } else {
        couponsList[i].checked = false;
      }
    }
    this.setData({
      couponsList: couponsList
    })
  },
  // 选择优惠劵
  radio: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr = this.data.checkboxArr; //选项集合
    if (checkboxArr[index].checked) return; //如果点击的当前已选中则返回
    checkboxArr.forEach(item => {
      item.checked = false
    })
    checkboxArr[index].checked = true; //改变当前选中的checked值
    this.setData({
      checkboxArr: checkboxArr
    });
  },
  selectCoupons: function() {

  },
  radioChange: function(e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },

  changeValueData: function(e) {
    // 获取输入框的内容
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 焦点触发 切换为textarea框
   */
  hideRemarkText: function() {
    this.setData({
      showRemarkTeLabel: false
    })
  },

  /**
   * 赠品 事件
   */
  showpopgigt: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var item = e.currentTarget.dataset.item;
    var detail = this.data.orderList.detail[item];

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
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        // 格式化赠品商品图片
        for (let i = 0; i < data.length; i++) {
          var photoData = data[i];
          if (!Utils.isNull(photoData.detailPhotos)) {
            var images = photoData.detailPhotos.split(",");
            data[i].images = images;
          } else if (!Utils.isNull(photoData.productphotos)) {
            var images = photoData.productphotos.split(",");
            data[i].images = images;
          }
        }

        that.setData({
          // 赠品商品详情
          giftDetail: data,
          showpopgift: true,
        })
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
  hidepopgigt: function() {
    this.setData({
      showpopgift: false
    })
  },
})
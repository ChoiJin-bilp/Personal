// pages/delivery/delivery.js
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
var packSMPageUrl = "../../../packageOther/pages";
Page({
  data: {
    DataURL: DataURL,
    scene: 0, // 1:订单页面进入选择地址 2:没有收货地址 从订单页面进入新建地址
    carts: [], // 购物车列表
    newaddress: false,
    editAddressStat: false,
    selectAllStatus: false, // 全选状态，默认全选
    region: [],
    imgUrls: [{
      src: DataURL + "/images/banner01.jpg?" + (Math.random() / 9999),
      url: "", //'../integral/integral?curData=1',
      isMainPage: 0,
    },
    {
      src: DataURL + "/images/banner02.jpg?" + (Math.random() / 9999),
      url: '',
      isMainPage: 0,
    }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000, //轮播

    addAddressData: { //新建地址 数据
      name: null,
      mobile: null,
      area: null,
      address: null,
      postalCode: null,
    },
    upAddressData: {}, //编辑地址
    carts: [], // 购物车列表
    // 查看物流弹框
    logistics: false,
    // 快递信息
    expressInformation: "",
    exitlogin: false,
    pIndex: 1,
    pSize: 4,
    status: 0,
    currentData: 0,
    shopkeeperStat: '', // 1未开店，2已开店
  },
  onLoad: function (options) {
    var that = this;
    console.log("onLoad:", options)

    that.setData({
      isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
      isOpenSoftCustomer: app.data.isOpenSoftCustomer,
    })

    if (app.data.isOpenMerchantPlatform) {
      that.getShopMainData();
    }

    if (!Utils.isNull(options.type)) {
      var currentData = options.type;
      that.setData({
        currentData: currentData
      })
      if (currentData == 0) {
        that.queryOrderDetail();
      }
    } else {
      that.queryOrderDetail();
    }
    // 退款测试
    // that.sureRefund("")
  },
  onShow() {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    let pages = getCurrentPages();
    // -1是当前页
    let prevPage = pages[pages.length - 1];
    if (isReData || prevPage.data.isReData) {
      isReData = false
      that.setData({
        pIndex: 1,
        isReData: false,
      })
      that.queryOrderDetail();
    }
    that.setData({
      carts: [{
        id: 1,
        title: '华为HUAWEI note 5i四摄极点全面屏仅售1999元',
        image: '../../images/Profiles1.png',
        norms: '150*68*80mm',
        num: 4,
        price: 0.01,
        selected: true
      },
      {
        id: 2,
        title: '华为HUAWEI note 5i四摄极点全面屏仅售1999元',
        image: '../../images/Profiles1.png',
        num: 1,
        price: 0.03,
        selected: true
      }
      ]
    });
  },
  /**
   * 团拼分享好友
   */
  onShareAppMessage: function (res) {
    var index = res.target.dataset.index
    var that = this
    return {
      title: '团拼分享',
      path: '/packageSMall/pages/storedetails/storedetails?pid=' + that.data.orderList[index].detail[0].pid + "&suid=" + app.globalData.userInfo.userId + "&tid=" + that.data.orderList[index].gorderId,
      imageUrl: that.data.orderList[index].detail[0].detailPhotos,
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  bindTopLoad: function () {
    console.log('下拉动作')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  bindDownLoad: function () {
    console.log('上拉触底')
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pIndex: ++this.data.pIndex
    })
    console.log("加载第" + this.data.pIndex + "页")
    this.queryOrderDetail();
  },
  checkCurrent: function (e) {
    console.log('checkCurrent');
    console.log(this.data.currentData);
    var that = this;
    that.setData({
      currentData: e.target.dataset.current,
      orderList: null,
    })
  },
  logisTics: function () {
    console.log(this.data.logistics)
    this.setData({
      logistics: true,
    })
  },
  swiperChange: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      pIndex: 1
    })
    console.log('swiperChange 第' + this.data.pIndex + "页");
    console.log(e.detail.current);
    this.setData({
      currentData: e.detail.current,
    })
    this.queryOrderDetail();
  },
  hidelogistics: function () {
    console.log(this.data.logistics)
    this.setData({
      logistics: false,
    })
  },

  showlogistics: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_delivery&action=QueryExpress&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&orderId=" + that.data.orderList[index].orderId + "&sign=" + sign;
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
        that.logisTics()
        that.setData({
          expressInformation: data,
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
  //获取店铺详情
  getShopMainData: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_shopapply&action=QueryApply&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&userId=" + app.globalData.userInfo.userId;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取店铺信息', res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            //有店铺信息
            var data = res.data.data[0];
            console.log("店铺详情：", data)
            var shopkeeperStat = 1;
            if (data.status == 2) { //审核中
              shopkeeperStat = 3;
            } else if (data.status == 1) { //通过
              shopkeeperStat = 2;
            } else if (data.status == 3 || data.status == 4) {
              shopkeeperStat = 3; //不通过 暂时也显示审核中
            }
            //有店铺信息
            that.setData({
              shopDataInfo: data,
              shopkeeperStat: shopkeeperStat
            })
            // wx.navigateTo({
            //   url:  "../shopdetail/shopdetail?type=1&companyId=" + shopId
            // });
          } else {
            //没有店铺信息
            that.setData({
              shopkeeperStat: 1
            })
            // wx.navigateTo({
            //   url:  "../openstore/openstore"
            // });
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取店铺详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取店铺详情接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取店铺详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  enterShop: function () {
    if (this.data.shopkeeperStat == 2) {
      wx.navigateTo({
        url: "../shopdetail/shopdetail?type=1&companyId=" + this.data.shopDataInfo.companyId
      });
    } else {
      wx.navigateTo({
        url: "../openstore/openstore"
      });
    }

  },
  /**
   * 查询订单 如linkNo软件服务5, 0:未支付1:已支付下单2:商家接单 3:定制中 4:定制完成
   */
  queryOrderDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.userTotalInfo.id + "&orderId=";
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败 12已支付定金
    var status = 0;
    //7酒店订单
    var linkNo = "7"
    switch (that.data.currentData) {
      case 0:
        status = 0;
        break;
      case 1:
        status = 1;
        break;
      case 2:
        status = 2;
        break;
      case 4:
        status = 5;
        break;
      default:

        break
    }
    let s = status == 1 ? '1,6' : status;
    urlParam = urlParam + "&status=" + s + "&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign + "&linkNo=" + linkNo;
    if (status == 0) {
      urlParam = urlParam + "&isGroup=1";
    }
    console.log('查询订单详情:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log('查询订单:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            imagesArray = null,
            detailDataItem = null;
          let linkNo = 0, orderPhotoUrl = "";

          if (data.length > 0 && status == 0) {

            for (let i = 0; i < data.length; i++) {
              var orders = data[i].orders;
              // 多个商品合计
              data[i].amount = 0;

              // 处理多件商品待付款订单
              if (data[i].cnt == 1) {
                data[i].orderId = orders[0].orderId;
              } else {
                data[i].detailPhotos = [];
              }
              for (let k = 0; k < orders.length; k++) {
                var order = orders[k];
                if (order.linkman != null && order.linkman != undefined && Utils.myTrim(order.linkman + "") != "")
                  data[i].orders[k].linkman = order.linkman;
                else
                  data[i].orders[k].linkman = "";
                if (order.mobile != null && order.mobile != undefined && Utils.myTrim(order.mobile + "") != "")
                  data[i].orders[k].mobile = order.mobile;
                else
                  data[i].orders[k].mobile = "";
                if (order.couponname != null && order.couponname != undefined && Utils.myTrim(order.couponname + "") != "")
                  data[i].orders[k].couponname = order.couponname;
                else
                  data[i].orders[k].couponname = "无";
                // 订单状态
                data[i].state = order.status;
                //规格列表处理
                var detail = order.detail

                for (let j = 0; j < detail.length; j++) {
                  detailDataItem = null;
                  detailDataItem = detail[j];
                  linkNo=0;
                  if (detailDataItem.linkNo != null && detailDataItem.linkNo != undefined && Utils.myTrim(detailDataItem.linkNo + "") != "") {
                    try {
                      linkNo = parseInt(detailDataItem.linkNo);
                      linkNo = isNaN(linkNo) ? 0 : linkNo;
                    } catch (err) { }
                  }
                  if (linkNo == 4 && detailDataItem.orderstatus == 12) {
                    // 算出总尾款
                    data[i].amount = data[i].amount + (detailDataItem.productprice - detailDataItem.deposit) * detailDataItem.number;
                  } else {
                    data[i].amount = data[i].amount + detailDataItem.amount;
                  }
                  // 团拼超时 订单失效
                  if (!Utils.isNull(detailDataItem.groupDay) &&
                    nowTimestamp > create_date + ((24 * 60 * 60 * 1000) * detailDataItem.groupDay)) {
                    data[i].status = -1 //团拼超时 失败
                    console.log('团拼超时 订单失效')
                  }

                  if (Utils.isNull(detailDataItem.attributeOne)) {
                    detailDataItem.attributeOne = ""
                  }
                  if (Utils.isNull(detailDataItem.attributeTwo)) {
                    detailDataItem.attributeTwo = ""
                  }

                  //图片处理
                  switch(linkNo){
                    case 7:
                      if (detailDataItem.productPhotos != null && detailDataItem.productPhotos != undefined) {
                        orderPhotoUrl = "";
                        orderPhotoUrl = app.operateVideoAndImg(detailDataItem.productPhotos, 10);
                        if (data[i].cnt >= 1) {
                          detail[j].detailPhotos = Utils.myTrim(orderPhotoUrl) != "" ? orderPhotoUrl : defaultItemImgSrc;
                        }
                      }
                      break;
                    default:
                      if (detailDataItem.detailPhotos != null && detailDataItem.detailPhotos != undefined) {
                        orderPhotoUrl = "";
                        orderPhotoUrl = app.operateVideoAndImg(detailDataItem.detailPhotos, 10);
                        if (data[i].cnt >= 1) {
                          detail[j].detailPhotos = Utils.myTrim(orderPhotoUrl) != "" ? orderPhotoUrl : defaultItemImgSrc;
                        } else {
                          if (data[i].detailPhotos.length < 3) {
                            data[i].detailPhotos[k] = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
                          }
                        }
                      }
                      break;
                  }
                  
                }
                order.detail = detail;
                try {
                  order.linkNo = parseInt(order.linkNo);
                } catch (e) { }
                console.log(' order.linkNo:', order.linkNo)
                var create_date = order.create_date;
                data[i].create_date = order.create_date;
                data[i].linkNo = order.linkNo;
                create_date = Date.parse(new Date(create_date.replace(/\-/g, '/')));
                var nowTimestamp = Date.parse(new Date());
                // 已付定金
                if (order.linkNo == 4 && order.status == 12) {
                  for (let l = 0; l < order.detail.length; l++) {
                    // 0=尾款支付没开始
                    if (order.detail[l].finalStartExpire == 0) {
                      data[i].status = -2 //尾款未开始
                    }
                    // // 售定金到期状态presellstatus和预售尾款到期状态finalPaystatu，为1没到期，0为未开始或已到期
                    else if (order.detail[l].finalPaystatus == 0) {
                      // 没支付尾款过期了
                      data[i].status = -3 //已取消
                      break;
                    }
                  }
                } else if (nowTimestamp > create_date + (30 * 60 * 1000)) {
                  data[i].status = -1 //已失效
                  continue
                }
              }
            }
          } else if (data.length > 0 && status == 5) {
            for (let i = 0; i < data.length; i++) {
              var create_date = data[i].create_date;
              create_date = Date.parse(new Date(create_date.replace(/\-/g, '/')));
              var nowTimestamp = Date.parse(new Date());

              //规格列表处理
              var detail = data[i].detail
              for (let j = 0; j < detail.length; j++) {
                detailDataItem = null;
                detailDataItem = detail[j];
                if (nowTimestamp > create_date + ((24 * 60 * 60 * 1000) * detailDataItem.groupDay)) {
                  data[i].status = -1 //团拼超时  失败
                }
              }
              data[i].detail = detail;
            }
          }

          //除订单分组数据(status != 0)  统一处理数据集
          if (data.length > 0 && status != 0) {
            for (let i = 0; i < data.length; i++) {
              //订单处理
              if (data[i].linkman != null && data[i].linkman != undefined && Utils.myTrim(data[i].linkman + "") != "")
                data[i].linkman = data[i].linkman;
              else
                data[i].linkman = "";
              if (data[i].mobile != null && data[i].mobile != undefined && Utils.myTrim(data[i].mobile + "") != "")
                data[i].mobile = data[i].mobile;
              else
                data[i].mobile = "";
              if (data[i].couponname != null && data[i].couponname != undefined && Utils.myTrim(data[i].couponname + "") != "")
                data[i].couponname = data[i].couponname;
              else
                data[i].couponname = "无";
              //规格列表处理
              var detail = data[i].detail
              for (let j = 0; j < detail.length; j++) {
                detailDataItem = null;
                detailDataItem = detail[j];
                linkNo = 0;
                if (detailDataItem.linkNo != null && detailDataItem.linkNo != undefined && Utils.myTrim(detailDataItem.linkNo + "") != "") {
                  try {
                    linkNo = parseInt(detailDataItem.linkNo);
                    linkNo = isNaN(linkNo) ? 0 : linkNo;
                  } catch (err) { }
                }

                if (Utils.isNull(detailDataItem.attributeOne)) {
                  detailDataItem.attributeOne = ""
                }
                if (Utils.isNull(detailDataItem.attributeTwo)) {
                  detailDataItem.attributeTwo = ""
                }

                //图片处理
                switch (linkNo) {
                  case 7:
                    if (!Utils.isNull(detailDataItem.productPhotos)) {
                      orderPhotoUrl = "";
                      orderPhotoUrl = app.operateVideoAndImg(detailDataItem.productPhotos, 10);
                      detail[j].detailPhotos = Utils.myTrim(orderPhotoUrl) != "" ? orderPhotoUrl : defaultItemImgSrc;
                    }
                    break;
                  default:
                    if (!Utils.isNull(detailDataItem.detailPhotos)) {
                      orderPhotoUrl = "";
                      orderPhotoUrl = app.operateVideoAndImg(detailDataItem.detailPhotos, 10);
                      detail[j].detailPhotos = Utils.myTrim(orderPhotoUrl) != "" ? orderPhotoUrl : defaultItemImgSrc;
                    }
                    break;
                }
                
              }
              data[i].detail = detail;
            }
          }

          console.log("订单数据集——")
          console.log(data)
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
          // if (status == 0) {
          //   setTimeout(function() {
          //     wx.hideLoading()
          //   }, 1000)
          // } else {
          //   wx.hideLoading()
          // }
        } else {
          wx.hideLoading()
          app.setErrorMsg2(that, "查询订单！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },

  /**
   * 更新多个订单
   */
  updateOrders: function (e) {
    var that = this;
    console.log(e)
    var orders = e.currentTarget.dataset.item;
    var status = e.currentTarget.dataset.status;
    var state = e.currentTarget.dataset.state;
    var content = "";
    if (status == 3) {
      content = "确定要取消订单吗";
    } else if (status == 5) {
      content = "确定要删除订单吗";
    }
    if (1 == state) {
      content = content + "?支付的定金将不会退回"
    }
    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          if (status == 5) {
            for (let i = 0; i < orders.orders.length; i++) {
              var order = orders.orders[i];
              that.removeOrders(order);
            }
          } else {
            for (let i = 0; i < orders.orders.length; i++) {
              var order = orders.orders[i];
              that.requestUpdateOrderStatus(status, order);
            }
          }
        } else if (res.cancel) { }
      }
    })

  },

  //确认收货
  updateOrderStatus: function (e) {
    var that = this;
    console.log('e', e)
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    var content = "";
    if (status == 2) {
      content = "确定已经入住了吗";
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
          if (status == 5) {
            that.removeOrders(that.data.orderList[index]);
          } else {
            that.requestUpdateOrderStatus(status, that.data.orderList[index]);
          }
        } else if (res.cancel) { }
      }
    })
  },
  /**
   * 删除订单
   */
  removeOrders: function (order) {
    var that = this;
    var timestamp = Date.parse(new Date());

    var urlParam = "cls=product_order&action=RemoveOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + order.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('删除订单 URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('删除订单', res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            that.setData({
              pIndex: 1
            })
            that.queryOrderDetail();
          }, 1000)

        } else {
          app.setErrorMsg2(that, "删除订单！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  //确认收货
  requestUpdateOrderStatus: function (status, order) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("that.data.orderList", that.data.orderList)
    console.log("id", order.orderId)
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + order.orderId;
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
              duration: 1500
            })
            setTimeout(function () {
              that.queryOrderDetail()
            }, 1000)
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
   * 继续支付
   */
  toDelivery: function (e) {
    isReData = true;
    var index = e.currentTarget.dataset.index;
    var orderList = this.data.orderList[index];
    if (orderList.linkNo == 0) {
      if (orderList.cnt == 1) {
        wx.navigateTo({
          url: "../hotelshoporders/hotelshoporders?orderid=" + orderList.orderId
        });
      } else {
        wx.navigateTo({
          url: "../hotelshoporders/hotelshoporders?orderid=&payno=" + orderList.payNo
        });
      }
    } else if (orderList.linkNo == 1) {
      if (orderList.cnt == 1) {
        wx.navigateTo({
          url: "../smorderdetail/smorderdetail?otype=1&orderid=" + orderList.orderId
        });
      } else {
        wx.navigateTo({
          url: "../smorderdetail/smorderdetail?otype=1&orderid=&payno=" + orderList.payNo
        });
      }
    } else if (orderList.linkNo == 2) {
      if (orderList.cnt == 1) {
        wx.navigateTo({
          url: "../smorderdetail/smorderdetail?otype=2&orderid=" + orderList.orderId
        });
      } else {
        wx.navigateTo({
          url: "../smorderdetail/smorderdetail?otype=2&orderid=&payno=" + orderList.payNo
        });
      }

    } else {
      if (orderList.cnt == 1) {
        wx.navigateTo({
          url: "../hotelshoporders/hotelshoporders?orderid=" + orderList.orderId
        });
      } else {
        wx.navigateTo({
          url: "../hotelshoporders/hotelshoporders?orderid=&payno=" + orderList.payNo
        });
      }

    }

  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var scene = this.data.scene;
    const choice = carts[index].choice;
    if (scene == 0) {
      carts[index].choice = !choice;
      this.setData({
        carts: carts
      });
    } else if (scene == 1) {
      if (choice) {
        return;
      }
      for (let i = 0; i < carts.length; i++) {
        if (i == index) {
          carts[index].choice = !choice;
        } else {
          carts[index].choice = false;
        }
      }
      this.setData({
        carts: carts
      });
      app.data.updateCartsData = carts[index];
      wx.navigateBack({
        delta: 1
      })
    }

  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].choice = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
  },
  /* 地址填写*/
  bindRegionChange: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      var str = 'addAddressData.area'
    } else {
      var str = 'upAddressData.area'
      var carts = this.data.carts;
      var editIndex = this.data.editIndex;
      var str2 = 'carts[' + editIndex + '].area';
      this.setData({
        [str2]: e.detail.value
      })
      var upAddressData = this.data.upAddressData;
      if (Utils.isNull(upAddressData.id)) {
        upAddressData.id = carts[editIndex].id;
        this.setData({
          upAddressData: upAddressData
        })
      }
    }
    console.log('str=', str)
    this.setData({
      [str]: e.detail.value
    })
  },
  /* 获取新建地址输入*/
  getInputContent: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var field = e.currentTarget.dataset.field;
    console.log("field:", field)
    that.setData({
      [field]: val
    })
  },
  /* 获取编辑地址输入*/
  getUpInputContent: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var field = e.currentTarget.dataset.field;
    var upAddressData = that.data.upAddressData;
    if (Utils.isNull(upAddressData.id)) {
      upAddressData.id = that.data.carts[that.data.editIndex].id;
      that.setData({
        upAddressData: upAddressData
      })
    }
    that.setData({
      [field]: val
    })
    console.log("upAddressData:", that.data.upAddressData)
  },

  //点击新建地址显示隐藏
  shownewaddress: function () {
    this.setData({
      newaddress: true
    })
  },
  //点击编辑
  showEditAddress: function () {
    var frequency = 0
    var index = null;
    var carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].choice) {
        frequency++;
        index = i;
      }
    }
    if (frequency == 0) {
      wx.showToast({
        title: '请选择需要编辑的联系方式',
        icon: 'none',
        duration: 1500
      })
      return
    } else if (frequency > 1) {
      wx.showToast({
        title: '只能选择一个联系方式编辑',
        icon: 'none',
        duration: 1500
      })
      return
    } else if (frequency == 1) {
      this.setData({
        editAddressStat: true,
        editIndex: index
      })
    }
  },
  hideEditAddress: function () {
    this.setData({
      editAddressStat: false
    })
  },
  hidenewaddress: function () {
    this.setData({
      newaddress: false
    })
  },
  //查询收货地址
  selectAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_address&action=selectAddress&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询收货地址', res);
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            data[i].choice = false;
            if (!Utils.isNull(data[i].area)) {
              data[i].area = data[i].area.split(',');
            }
            if (that.data.scene == 1) {
              var updateCartsData = app.data.updateCartsData;
              if (data[i].selected && Utils.isNull(updateCartsData)) {
                data[i].choice = true;
              } else if (!Utils.isNull(updateCartsData) && data[i].id == updateCartsData.id) {
                data[i].choice = true;
              }
            }
          }
          if (data.length == 0) {
            that.setData({
              selectAllStatus: false
            })
          }
          that.setData({
            carts: data
          })
          console.log('处理完数据', data)
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
  confirmAddress: function () {
    var data = this.data.addAddressData;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    console.log('新建内容', data)
    if (re.test(data.name) || Utils.isNull(data.name)) {
      wx.showToast({
        title: '请输入联系人姓名！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (Utils.isNull(data.mobile) || re.test(data.mobile)) {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!myreg.test(data.mobile)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000,
      })
      return;
    } else if (Utils.isNull(data.area)) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (Utils.isNull(data.address) || re.test(data.address)) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.insertAddress();
  },
  //提交 编辑收货地址
  confirmUpAddress: function () {
    var data = this.data.upAddressData;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    console.log('data:', data.id)
    if (data.id == undefined) {
      this.setData({
        editAddressStat: false,
        upAddressData: {},
        editIndex: null,
      })
      return;
    }
    if (data.name != undefined && (re.test(data.name) || Utils.isNull(data.name))) {
      wx.showToast({
        title: '请输入联系人姓名！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (data.mobile != undefined && (Utils.isNull(data.mobile) || re.test(data.mobile))) {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (data.mobile != undefined && (!myreg.test(data.mobile))) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000,
      })
      return;
    } else if (data.area != undefined && (Utils.isNull(data.area))) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (data.address != undefined && (Utils.isNull(data.address) || re.test(data.address))) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.updateAddress();
  },
  //编辑收货地址
  updateAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.upAddressData;
    var area = data.area;
    var areaStr = '';
    if (!Utils.isNull(area)) {
      for (let i = 0; i < area.length; i++) {
        if (areaStr == '') {
          areaStr += area[i];
        } else {
          areaStr += ',' + area[i];
        }
      }
      data.area = areaStr;
    }
    var dataStr = JSON.stringify(data)
    console.log("josn字符串：", dataStr)
    var urlParam = "cls=product_address&action=editAddress&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&addressJson=" + dataStr + "&sign=" + sign;
    console.log('编辑收货地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      method: 'get',
      success: function (res) {
        console.log('编辑收货地址', res)
        if (res.data.rspCode == 0) {
          that.selectAddress();
          that.setData({
            editAddressStat: false,
            upAddressData: {},
            editIndex: null,
          })
        } else {
          app.setErrorMsg2(that, "编辑收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  //新建收货地址
  insertAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=insertAddress&userId=" + app.globalData.userTotalInfo.id + "&name=" + data.name + "&mobile=" + data.mobile + "&area=" + data.area + "&address=" + data.address + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    if (!Utils.isNull(data.postalCode)) {
      urlParam += "&postalCode=" + data.postalCode;
    }
    console.log('新建收货地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('新建收货地址', res)
        if (res.data.rspCode == 0) {
          if (that.data.scene == 2) {
            wx.navigateBack({
              delta: 1
            })
            return;
          }
          var carts = that.data.carts;
          that.selectAddress();
          that.setData({
            newaddress: false,
            addAddressData: false
          })
        } else {
          app.setErrorMsg2(that, "新建收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  delAddress: function () {
    var that = this;
    var ids = '';
    var carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].choice) {
        if (ids == '') {
          ids += carts[i].id;
        } else {
          ids += ',' + carts[i].id;
        }
      }
    }
    if (ids == '') {
      wx.showToast({
        title: '请选择需要删除的记录',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除选中的联系方式吗',
        success(res) {
          if (res.confirm) {
            that.requestDelAddress(ids);
          } else if (res.cancel) { }
        }
      })
    }
  },
  //删除地址
  requestDelAddress: function (ids) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=deleteAddress&id=" + ids + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('删除地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('删除地址', res)
        if (res.data.rspCode == 0) {
          var carts = that.data.carts;
          if (!Utils.isNull(app.data.updateCartsData)) {
            var idArr = ids.split(',');
            for (let i = 0; i < idArr.length; i++) {
              if (idArr[i].id == app.data.updateCartsData.id) {
                app.data.updateCartsData = null;
              }
            }
          }
          that.selectAddress();
        } else {
          app.setErrorMsg2(that, "删除地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  //更换默认地址
  defaultAddress: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.carts[index].selected) {
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=defaultAddress&id=" + that.data.carts[index].id + "&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('更换默认地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更换默认地址', res)
        if (res.data.rspCode == 0) {
          that.selectAddress();
        } else {
          app.setErrorMsg2(that, "更换默认地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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

  stopTouchMove: function () {
    return false;
  },
  /**
   * 店铺详情
   */
  companyPage: function (e) {
    var index = e.currentTarget.dataset.index;
    var itemindex = e.currentTarget.dataset.itemindex;
    var companyId = this.data.orderList[index].detail[itemindex].companyId;
    wx.navigateTo({
      url: "../shopdetail/shopdetail?type=0&companyId=" + companyId
    });
  },


  /**
   * 订单详情
   */
  logisticsPage: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index];
    wx.navigateTo({
      url: "../hotelshoplogistics/hotelshoplogistics",
      // 通过eventChannel向被打开页面传送数据
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order
        })
      }
    });
  },
  // 申请售后
  service: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index];
    isReData = true;
    wx.navigateTo({
      url: "../service/service",
      // 通过eventChannel向被打开页面传送数据
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order
        })
      }
    });
  },

  /**
   * 定金支付详情
   */
  orderPage: function (e) {
    console.log(e)
    var item = e.currentTarget.dataset.item;
    if (item.linkNo != 4) {
      return;
    }
    if (item.finalPaystatus == 0) {
      console.log("尾款时间过期了")
      return;
    }
    if (item.linkNo == 4 && item.orderstatus == 12) {
      this.toDelivery(e)
    }
  },

  /**
   * 赠品 事件
   */
  showpopgigt: function (e) {
    wx.showLoading({
      title: '加载中',
    })

    var detail = e.currentTarget.dataset.item;

    var that = this
    console.log(e)
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
  refund: function (e) {
    var that = this;
    console.log('e', e)
    var index = e.currentTarget.dataset.index;
    var order = e.currentTarget.dataset.item;
    wx.showModal({
      title: '',
      content: "您确定取消该订单吗?货款将在24小时内退款至您的账户。",
      success(res) {
        if (res.confirm) {
          that.setData({
            pIndex: 1
          })
          // 判断实际支付
          if (order.payamount > 0) {
            that.sureRefund(order);
          } else {
            // 0元下单。直接取消订单
            that.requestUpdateOrderStatus(3, order);
          }
        } else if (res.cancel) { }
      }
    })

  },

  /**
   * 确定取消订单进行退款
   */
  sureRefund: function (order) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=_wxRefund&action=wxRefund&orderId=" + order.orderId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
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
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: "退款申请成功",
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            that.queryOrderDetail()
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.rspMsg,
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
   * 跳转我的售后
   */
  goMyService: function () {
    wx.navigateTo({
      url: "../myservice/myservice",
    });
  },
  /**
   * 跳转收货地址
   */
  goAddar: function () {
    wx.navigateTo({
      url: "../../../packageSMall/pages/shopadd/shopadd?tptype=1",
    });
  },
  /**
   * 跳转软件定制
   */
  customization: function () {
    wx.navigateTo({
      url: packSMPageUrl + "/storeDLDD/storeDLDD?linkNo=5",
    });
  },
})
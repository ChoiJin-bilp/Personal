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
    grades: ['全部', '待发货', '已发货', '已完成', '已取消'],
    changeStatus: ['待发货', '已发货', '已完成', '已取消'],
    status: "",
    pIndex: 1,
    selectStatusIndex: "",
    pSize: 4,
    smKey: "",
    // 搜索所有输入的 物流公司
    express: [],
  },
  onShow() {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    this.setData({
      hasList: true,
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
        },
        {
          id: 1,
          title: '华为HUAWEI note 5i四摄极点全面屏仅售1999元',
          image: '../../images/Profiles1.png',
          norms: '150*68*80mm',
          num: 4,
          price: 0.01,
          selected: true
        }
      ]
    });
    this.queryOrderDetail()
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
        status = "";
        break;
      case 1:
        status = 1;
        break;
      case 2:
        status = 6;
        break;
      case 3:
        status = 2;
        break;
      case 4:
        status = 3;
        break;
    }
    this.setData({
      grade_name: name,
      select: false,
      orderList: "",
      status: status,
      pIndex: 1,
    })
    this.queryOrderDetail()
  },

  /**
   * 选择订单状态
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    this.setData({
      selectStatusIndex: index,
    })
  },

  hidechangeinfor: function() {
    this.setData({
      changeinfor: false
    })
  },
  showchangeinfor: function(e) {
    var item = e.currentTarget.dataset.item
    var that = this
    this.setData({
      changeinfor: true,
      orderItem: item,
    })
  },
  /**
   * 监听物流公司输入
   */
  getInputExpressCompany: function(e) {
    var expressName = e.detail.value;
    this.setData({
      expressCompany: e.detail.value
    })
  },
  /**
   * 监听物流单号输入
   */
  getInputExpressNO: function(e) {
    this.setData({
      expressNO: e.detail.value
    })
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
   * 多个物流选一个
   */
  bindSelectExpress: function(e) {
    console.log('物流picker发送选择改变，携带值为', e)
    var item = e.currentTarget.dataset.item;
    this.setData({
      selectExpress: false,
      expressItem: item,
    })
    this.addExpress(this.data.orderItem, this.data.expressItem)
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
   * 查询订单
   */
  queryOrderDetail: function() {
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
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败12已支付定金
    var status = that.data.status;
    urlParam = urlParam + "&status=" + status + "&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign + "&addit=" + that.data.smKey;
    if (!Utils.isNull(status) && status == 0) {
      urlParam = urlParam + "&isGroup=1";
    }
    console.log('查询订单详情:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        wx.hideLoading()
        console.log('查询订单:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            imagesArray = null,
            detailDataItem = null;
          if (that.data.pIndex == 1 && data.length == 0) {
            wx.showToast({
              title: '暂无订单',
              icon: 'none',
              duration: 1500,
            })
            return;
          }

          if (!Utils.isNull(status) && data.length > 0 && status == 0) {
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
                // 订单状态
                data[i].state = order.status;
                //规格列表处理
                var detail = order.detail
                for (let j = 0; j < detail.length; j++) {
                  detailDataItem = null;
                  detailDataItem = detail[j];
                  if (detailDataItem.linkNo == 4 && detailDataItem.orderstatus == 12) {
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
                  //图片处理
                  if (detailDataItem.detailPhotos != null && detailDataItem.detailPhotos != undefined) {
                    imagesArray = null;
                    imagesArray = detailDataItem.detailPhotos.split(",");
                    if (data[i].cnt == 1) {
                      detail[j].detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
                    } else {
                      if (data[i].detailPhotos.length < 3) {
                        data[i].detailPhotos[k] = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
                      }
                    }
                  }
                }
                order.detail = detail;
                try {
                  order.linkNo = parseInt(order.linkNo);
                } catch (e) {}
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
          if (data.length > 0 && status != "0") {
            for (let i = 0; i < data.length; i++) {
              if (Utils.isNull(data[i].phone)) {
                data[i].phone = ""
              }
              //规格列表处理
              var detail = data[i].detail
              for (let j = 0; j < detail.length; j++) {
                detailDataItem = null;
                detailDataItem = detail[j];
                //图片处理
                if (!Utils.isNull(detailDataItem.detailPhotos)) {
                  imagesArray = null;
                  imagesArray = detailDataItem.detailPhotos.split(",");
                  detail[j].detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
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
      fail: function(err) {
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
   * 查询快递公司 顺丰
   */
  changeOrder: function() {
    var that = this;
    if (Utils.isNull(that.data.expressCompany) || Utils.isNull(that.data.expressNO) || Utils.isNull(that.data.selectStatusIndex)) {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_express&action=QueryExpressCompany&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&name=" + encodeURI(that.data.expressCompany);
    console.log('查询快递公司:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        wx.hideLoading()
        console.log('查询快递公司:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (data.length == 0) {
            wx.showToast({
              title: '没有该快递公司',
              icon: 'none',
              duration: 1500
            })
            return;
          }
          if (data.length > 1) {
            that.setData({
              express: data,
              selectExpress: true,
            })
          } else {
            that.setData({
              expressItem: data[0],
            })
            that.addExpress(that.data.orderItem, that.data.expressItem)
          }
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
      fail: function(err) {
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
   * 管理员添加或更新快递信息
   */
  addExpress: function(orderItem, expressItem) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      changeinfor: false,
    })
    var status = 1;
    switch (parseInt(that.data.selectStatusIndex)) {
      case 0:
        status = 1;
        break;
      case 1:
        status = 6;
        break;
      case 2:
        status = 2;
        break;
      case 3:
        status = 3;
        break;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_express&action=AddExpress&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + orderItem.orderId + "&expressNo=" + that.data.expressNO;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    var expressData = [{
      status: status,
      sn: expressItem.sn,
      name: expressItem.name
    }];
    console.log(JSON.stringify(expressData));
    urlParam = urlParam + "&sign=" + sign;
    console.log('管理员添加或更新快递信息:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      method: "POST",
      data: {
        data: JSON.stringify(expressData)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        wx.hideLoading()
        console.log('管理员添加或更新快递信息:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          wx: wx.showToast({
            title: '更改成功',
            icon: 'none',
            duration: 1500,
          })
          that.setData({
            pIndex: 1,
          })
          that.queryOrderDetail()
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
      fail: function(err) {
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
   * 删除提示
   */
  removeTips: function(e) {
    var item = e.currentTarget.dataset.item
    var that = this
    wx.showModal({
      title: '提示',
      content: "确定要删除订单吗?",
      success(res) {
        if (res.confirm) {
          that.removeOrder(item);
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 管理员订单删除记录
   */
  removeOrder: function(order) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_express&action=RemoveOrder&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + order.orderId + "&userId=" + app.globalData.userTotalInfo.id;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&name=" + that.data.expressCompany;
    console.log('管理员订单删除记录:', URL + urlParam)

    wx.request({
      url: URL + urlParam,
      success: function(res) {
        wx.hideLoading()
        console.log('管理员订单删除记录:', res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          wx: wx.showToast({
            title: '删除成功!',
            icon: 'none',
            duration: 1500,
          })
          // if (that.data.orderList.length > that.data.pSize) {

          // } else {
          //   that.setData({
          //     pIndex: 1,
          //   })
          //   that.queryOrderDetail()
          // }
          that.setData({
            pIndex: 1,
          })
          that.queryOrderDetail()
        } else {
          wx.hideLoading()
          app.setErrorMsg2(that, "管理员订单删除记录：" + JSON.stringify(res), URL + urlParam, false);
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
    })
  },

  /**
   * 订单详情
   */
  logisticsPage: function(e) {
    console.log(e)
    var order = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "../shoplogistics/shoplogistics",
      // 通过eventChannel向被打开页面传送数据
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          order: order,
          // 管理员
          admin: true,
        })
      }
    });
  },
})
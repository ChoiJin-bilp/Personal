// packageSMall/pages/shoplogistics/shoplogistics.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
var BJYURL = app.getUrlAndKey;
var appUserInfo = app.globalData.userInfo,
  sOptions = null;
Page({
  data: {
    DataURL: DataURL,
    order: "",
    expressInformation: "",
    roomSellType: app.data.roomSellType,

    paramShareUId: 0,
    orderId: "",
    linkNo:0,
    isSendById: false,                    //是否传参取订单信息
    viewType:0,                           //查看类型：0普通，1二维码查看
    orderStatus:0,                        //光趣订单状态：0待支付，1有效，2取消，3过期，4已使用
    orderStatusStr:"",                    //光趣订单状态描述
    gqDtBeginStr: "",                     //光趣有效期开始时间
    gqDtEndStr: "",                       //光趣有效期结束时间

    qrImgUrl:"",
    gqQRCodeMessage: app.data.gqQRCodeMessage,
    roleStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.dowithParam(options);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0, orderId = "", isSendById = false, viewType=0;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log(options)
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }
    //获取分享人ID
    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) {}
    try {
      if (sOptions.orderId != null && sOptions.orderId != undefined) {
        isSendById = true;
        orderId = Utils.myTrim(sOptions.orderId);
      }
    } catch (e) {}
    try {
      if (sOptions.vt != null && sOptions.vt != undefined)
        viewType = parseInt(sOptions.vt);
      viewType = isNaN(viewType) ? 0 : viewType;
    } catch (e) { }
    that.setData({
      orderId: orderId,
      paramShareUId: paramShareUId,
      isSendById: isSendById,
      viewType: viewType,
    })
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    let that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        
        if (that.data.isSendById) {
          that.queryOrderDetail(that.data.orderId)
        } else {
          //getOpenerEventChannel()微信系统方法，需调试库2.9.2 ,在json文件中加个"usingComponents": {} ,
          const eventChannel = that.getOpenerEventChannel()
          // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
          eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.log(data)
            var order = data.order

            that.dataFormat(order)
          })
        }
        break;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this,
      orderId = that.data.orderId;
    return {
      title: "订单详情，快来看看吧",
      path: "packageTemplate/pages/hotelshoplogistics/hotelshoplogistics?orderId=" + orderId + "&suid=" + appUserInfo.userId,
      success: (res) => { // 成功后要做的事情
        console.log("分享成功")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    let that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    let that = this;
    app.getAuthorizeUserInfo(that, e);
  },

  dataFormat: function (order) {
    var that = this, status = 0, orderStatus = 0, orderStatusStr = "", qrImgUrl = "", linkNo = 0, companyId = 0, roleStatus=0;
    let dtNow = new Date(), dtBegin = new Date(), dtEnd = new Date(),gqDtBeginStr="",gqDtEndStr="";
    if (order.companyId != null && order.companyId != undefined && Utils.myTrim(order.companyId + "") != "") {
      companyId = parseInt(order.companyId);
      companyId = isNaN(companyId) ? 0 : companyId;
    }
    if (companyId == appUserInfo.companyId && appUserInfo.roleStatus==1)
      roleStatus=1;
    if (order.status != null && order.status != undefined && Utils.myTrim(order.status + "") != "") {
      status = parseInt(order.status);
      status = isNaN(status) ? 0 : status;
    }
    if (order.linkNo != null && order.linkNo != undefined && Utils.myTrim(order.linkNo + "") != "") {
      linkNo = parseInt(order.linkNo);
      linkNo = isNaN(linkNo) ? 0 : linkNo;
    }
    if (that.data.roomSellType==1){
      let tag = app.data.gqValidDateHaveTime==0?1:0;
      
      if (order.wxQRCode != null && order.wxQRCode != undefined && Utils.myTrim(order.wxQRCode + "") != "") {
        qrImgUrl = app.getSysImgUrl(Utils.myTrim(order.wxQRCode).replace('/tts_upload', ''));
      }
      if (order.detail != null && order.detail != undefined && order.detail.length > 0) {
        let dataItem = order.detail[0];
        if (dataItem.group_purchase_startime != null && dataItem.group_purchase_startime != undefined) {
          try {
            dtBegin = new Date(Date.parse((dataItem.group_purchase_startime + "").replace(/-/g, "/")))
          } catch (e) {
            dtBegin = dtNow;
          }
        }
        
        if (dataItem.group_purchase_endtime != null && dataItem.group_purchase_endtime != undefined) {
          try {
            dtEnd = new Date(Date.parse((dataItem.group_purchase_endtime + "").replace(/-/g, "/")))
          } catch (e) {
            dtEnd = dtNow;
          }
        }
        gqDtBeginStr = Utils.getDateTimeStr3(dtBegin, "-", tag);
        gqDtEndStr = Utils.getDateTimeStr3(dtEnd, "-", tag);
      }

      //订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败8:退货申请9:退货中10:退货申请不通过11:退款失败12:预售中
      //显示订单状态：0待支付，1待生效，2取消，3有效，4过期，5已使用
      switch (status) {
        //待支付
        case 0:
          orderStatus = 0;
          orderStatusStr = "待支付";
          break;
        //待生效
        case 5:
        case 12:
          orderStatus = 1;
          orderStatusStr = "待生效";
          break;
        //待生效——需要判断有效期：1待生效，3有效，4过期
        case 1:
          orderStatus = 1;
          orderStatusStr = "待生效";
          if (dtNow >= dtBegin && dtNow <= dtEnd) {
            orderStatus = 3;
            orderStatusStr = "有效";
          }
          if (dtNow > dtEnd) {
            orderStatus = 4;
            orderStatusStr = "过期";
          }
          break;
        //取消
        case 3:
        case 4:
        case 8:
        case 9:
        case 10:
        case 11:
          
          orderStatus = 2;
          orderStatusStr = "取消";
          break;
        //已使用
        case 2:
          orderStatus = 4;
          orderStatusStr = "已使用";
          break;
      }
    }
    
    //算出运费
    var productLists = order.detail
    var expressFee = 0;
    var sum = 0
    for (let i = 0; i < productLists.length; i++) {
      var product = productLists[i];

      if (Utils.isNull(product.attributeOne)) {
        product.attributeOne = ""
      }
      if (Utils.isNull(product.attributeTwo)) {
        product.attributeTwo = ""
      }

      if (expressFee < product.expressFee) {
        expressFee = product.expressFee
      }
      if (Utils.isNull(product.payamount)) {
        product.payamount = 0
      }
      sum += product.payamount

      if (!Utils.isNull(product.eTime)) {
        try {
          var dateTime = new Date(product.eTime.replace(/\-/g, "/"));
          order.eTime = Utils.getDateTimeStr(dateTime, "-", false)
        } catch (e) {}
      }
      if (!Utils.isNull(product.sTime)) {
        try {
          var dateTime = new Date(product.sTime.replace(/\-/g, "/"));
          order.sTime = Utils.getDateTimeStr(dateTime, "-", false)
        } catch (e) {}
      }
    }
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
    if (Utils.isNull(order.mold)) {
      order.couponname = "无"
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
      order: order,
      orderId: order.orderId,

      linkNo: linkNo,
      orderStatus: orderStatus,
      orderStatusStr: orderStatusStr,
      gqDtBeginStr: gqDtBeginStr,
      gqDtEndStr: gqDtEndStr,

      qrImgUrl: qrImgUrl,
      roleStatus: roleStatus,
    })
  },
  
  queryOrderDetail: function (orderId) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + "&orderId=" + orderId;
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
    urlParam = urlParam + "&pIndex=1&pSize=20&sField=" + "id" + "&sOrder=" + "desc" + "&sign=" + sign + "&linkNo=" + linkNo;
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
          let linkNo = 0,
            orderPhotoUrl = "";

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
                  linkNo = 0;
                  if (detailDataItem.linkNo != null && detailDataItem.linkNo != undefined && Utils.myTrim(detailDataItem.linkNo + "") != "") {
                    try {
                      linkNo = parseInt(detailDataItem.linkNo);
                      linkNo = isNaN(linkNo) ? 0 : linkNo;
                    } catch (err) {}
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
                  //图片处理
                  switch (linkNo) {
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
                  } catch (err) {}
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
          // that.setData({
          //   order: data[0],
          // })
          if (status == 0) {
            that.dataFormat(data[0].orders[0]);
          } else {
            that.dataFormat(data[0])
          }

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
    urlParam = urlParam + "&sign=" + sign + "&wxAppId=" + app.data.wxAppId;
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
  //事件：核销订单
  setOrderFinished: function (e) {
    let that = this, orderId = that.data.orderId, otherParam = "&status=2";
    app.updateSMOrderInfo(that, orderId, otherParam);
  },
  //方法：获取核销订单结果处理函数
  dowithUpdateSMOrderInfo: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        wx.showToast({
          title: "核销订单成功！",
          icon: 'none',
          duration: 1500
        })
        that.setData({
          orderStatus: 4,
          orderStatusStr: "已使用",
        })
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "核销订单失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
})
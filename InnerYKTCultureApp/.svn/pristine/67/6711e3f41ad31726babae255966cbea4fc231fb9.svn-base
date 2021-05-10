// packageOther/pages/succeed/succeed.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  sOptions = null;
var mainPackageUrl = "../../../pages"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    roomSellType: app.data.roomSellType,
    // 可领取优惠券查询 付款成功
    mold: "11",

    linkNo: 0,
    pOrerderId: 0,
    orderId: "",
    gqQRCodeMessage: app.data.gqQRCodeMessage,
    // 按摩优惠券
    AnMoCoupons: [],
    num: 0,
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
    let that = this,
      isScene = false,
      dOptions = null,
      paramShareUId = 0,
      linkNo = 0,
      pOrerderId = 0,
      orderId = "";
    if (!Utils.isNull(options.mold)) {
      that.data.mold = options.mold
      if (that.data.mold == 20) {
        that.setData({
          num: options.anmocouponnum,
          duration: options.anmotime,
          anmocouponid: options.anmocouponid,
        })
      }
    }
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
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
      if (sOptions.linkNo != null && sOptions.linkNo != undefined)
        linkNo = parseInt(sOptions.linkNo);
      linkNo = isNaN(linkNo) ? 0 : linkNo;
    } catch (e) {}
    try {
      if (sOptions.porderid != null && sOptions.porderid != undefined)
        pOrerderId = parseInt(sOptions.porderid);
      pOrerderId = isNaN(pOrerderId) ? 0 : pOrerderId;
    } catch (e) {}
    try {
      if (sOptions.oid != null && sOptions.oid != undefined)
        orderId = Utils.myTrim(sOptions.oid);
    } catch (e) {}
    that.setData({
      pOrerderId: pOrerderId,
      orderId: orderId,
      linkNo: linkNo,
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
        if (appUserInfo == null || appUserInfo == undefined) {
          wx.showToast({
            title: "尚未登录！",
            icon: 'none',
            duration: 1500
          })
          return;
        }

        wx.showToast({
          title: "下单成功！",
          icon: 'none',
          duration: 1500
        })
        // 买饮品送按摩
        if (that.data.mold == 20) {
          // that.getCanCoupons()
          return
        }
        if (that.data.linkNo == 7) {
          that.createQRImg();
        }
        app.queryCanCoupons(this);
        if (that.data.linkNo == 7 && app.data.isOpenOrderRSendCP && app.data.orderRoomSendCheirapsisPId > 0) {
          that.insertAwardAboutRecord(app.data.orderRoomSendCheirapsisPId, that.data.orderId)
        }
        break;
    }
  },

  /**
   * 获取饮品支付成功按摩的优惠卷
   */
  getCanCoupons() {
    var urlParam = "cls=product_coupons&action=QueryCanCoupons"
    var otherParam = "&userId=" + appUserInfo.userId + "&companyId=" + app.data.agentCompanyId + "&orderId=" + this.data.orderId + "&flag=0&mold=" + this.data.mold
    app.doGetData(this, app.getUrlAndKey.smurl, urlParam, otherParam, 0, "获取饮品支付成功按摩的优惠卷")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            that.setData({
              AnMoCoupons: data,
            })
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  useMyAward: function (e) {
    var that = this
    // var item = e.currentTarget.dataset.item;
    // var AnMoCoupons = that.data.AnMoCoupons
    // var item = AnMoCoupons[0]
    var url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&id=" + that.data.anmocouponid + "&mcnt=" + that.data.duration + "&sqy=1&did=" + app.data.agentDeviceId
    wx.redirectTo({
      url: url,
    });
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
  getbut: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //方法：保存公司资料信息
  createQRImg: function () {
    var that = this,
      pOrerderId = that.data.pOrerderId,
      orderId = that.data.orderId,
      pageParam = "packageTemplate/pages/hotelshoplogistics/hotelshoplogistics";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      dataParam = "&pagedata=orderId=" + orderId + "|vt=1",
      otherParam = "&orderId=" + pOrerderId;

    urlParam = "cls=main_WXQRCode&action=UpdateOrderWXQRCode&page=" + pageParam + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + dataParam + otherParam + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("订单二维码生成结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          let qrImgUrl = "";
          if (res.data.data != null && res.data.data != undefined && res.data.data.wxQRCode != null && res.data.data.wxQRCode != undefined && Utils.myTrim(res.data.data.wxQRCode + "") != "") {
            qrImgUrl = app.getSysImgUrl(res.data.data.wxQRCode.replace('/tts_upload', ''));
            that.setData({
              qrImgUrl: qrImgUrl,
            })
            console.log(qrImgUrl)
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "订单二维码生成：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "订单二维码生成接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "订单二维码生成接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  //方法：插入支付抽奖相关记录
  insertAwardAboutRecord: function (productId, orderId) {
    let that = this,
      luckdraw_id = app.data.luckdraw_id,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId,
      typeParam = productId <= 0 ? "&type=4" : "";
    otherParamCon += "&productid=" + productId + "&orderNo=" + encodeURIComponent(orderId) + "&status=0" + typeParam + "&activityId=" + luckdraw_id + "&operation=add";

    app.operateAwardRecord(that, otherParamCon, 0)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        let id = 0;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          try {
            id = parseInt(dataList.resultMap.id);
            id = isNaN(id) ? 0 : id;
          } catch (err) {}
        }
        console.log("当前支付记录ID：" + id)
        that.setData({
          ["rechargeRecordId"]: id,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
})
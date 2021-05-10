// pages/mine/coupon/coupon.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  SMURL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  sOptions = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,

    currentData: 0,
    couponData: [],
    currentCoupon: '',
    reData: false,

    shareCouponType:0,      //分享劵类型：0普通团体劵，1个人劵
    shareCouponId: "",       //团体劵ID
  },
  onLoad: function (options) {
    var that = this;
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        that.setData({
          windowH: res.windowHeight - 44
        });
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,
      paramShareUId = 0,
      isScene = false,
      dOptions = null;
    console.log("加载源参数：");
    console.log(options);
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
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) {}
    that.data.paramShareUId = paramShareUId;

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        let shareCouponId = "",shareCouponType=0;
        if (sOptions.id != null && sOptions.id != undefined) {
          try {
            shareCouponId = Utils.myTrim(sOptions.id);
          } catch (e) {}
        }
        if (sOptions.t != null && sOptions.t != undefined) {
          try {
            shareCouponType = parseInt(sOptions.t);
            shareCouponType = isNaN(shareCouponType) ? 0 : shareCouponType;
          } catch (e) {}
        }

        that.setData({
          ["shareCouponId"]: shareCouponId,
          ["shareCouponType"]:shareCouponType,
        })
        if (Utils.myTrim(shareCouponId)!="") {
          //领取优惠券
          that.receiveCouponById(shareCouponId,shareCouponType);
        } else {
          //查询优惠券
          that.queryUserCoupons(0);
        }
        break;
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    var that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    var that = this;
    app.getAuthorizeUserInfo(that, e);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        if (that.data.reData) {
          that.data.reData = false
        }
        that.queryUserCoupons(that.data.currentData);
        console.log("onShow ...")
      }
    }
  },
  //方法：领取优惠券信息
  receiveCouponById: function (cid,cType) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      otherParam = "&distr=1&mold=1&id=" + cid;
    //分享劵类型：0普通团体劵，1个人劵
    switch(cType){
      case 0:
        otherParam = "&distr=1&mold=1&id=" + cid;
        break;
      case 1:
        otherParam = "&distr=1&sn=" + cid;
        break;
    }
    //mold:1团体，0个人
    urlParam = "cls=product_coupons&action=ReceiveAmCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&companyId=" + app.data.companyId + otherParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("领取优惠券信息：")
        console.log(res.data)
        let url="/packageYK/pages/Myprize/Myprize"
        if (res.data.rspCode == 0) {
          wx.showModal({
            title: '提示',
            content: "领取成功！",
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: url
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.rspMsg,
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: url
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          app.setErrorMsg2(that, "领取优惠券：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          wx.hideLoading();
        } catch (e) {}

        wx.showToast({
          title: "领取优惠券接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "领取优惠券接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //获取当前滑块的index
  swiperChange: function (e) {
    const that = this;
    console.log('swiperChange:', e.detail.current)
    that.setData({
      currentData: e.detail.current,
      couponData: []
    })
    that.queryUserCoupons(e.detail.current);
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    console.log("checkCurrent")
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  //查询优惠券
  queryUserCoupons: function (isUsed) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = app.globalData.muserInfo.userId
    // userId = 13140
    var urlParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&companyId=" + app.data.companyId;

    if (3 == isUsed) {
      urlParam = urlParam + "&avmold=12&isUsed=0"
    } else {
      urlParam = urlParam + "&isUsed=" + isUsed
    }

    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询优惠券', res);
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            that.setData({
              couponData: res.data.data
            })
          } else {
            wx.showToast({
              title: '暂无优惠劵',
              icon: 'none',
              duration: 1500,
            })
          }
        } else {
          app.setErrorMsg2(that, "查询优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        console.log("接口失败：" + err)
      }
    })
  },

  /**
   * 删除优惠劵
   */
  deleteCoupons: function (e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    var content = '是否删除该优惠劵,删除后将不能使用！';
    if (that.data.currentData == 2) {
      content = '是否删除该优惠劵?';
    }
    wx.showModal({
      title: '',
      content: content,
      showCancel: true,
      confirmText: '删除',
      confirmColor: '#ff0000',
      success: function (res) {
        if (res.confirm) {
          that.sureDeleteCoupons(index)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  /**
   * 确定删除优惠劵
   */
  sureDeleteCoupons: function (index) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=RemoveCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp + "&keyid=" + that.data.couponData[index].keyid;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('删除优惠劵', res);
        if (res.data.rspCode == 0) {
          var arr = that.data.couponData;
          arr.splice(index, 1);
          that.setData({
            couponData: arr,
          })
        } else {
          app.setErrorMsg2(that, "删除优惠劵！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
        wx.showToast({
          title: res.data.rspMsg,
          icon: 'none',
          duration: 1500
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("删除优惠劵接口失败：" + err)
      }
    })
  },
  onchangedetailType() {
    this.setData({
      detailType: !this.data.detailType,
    })
  },
  //退出弹窗
  emptyType() {
    this.setData({
      detailType: false,
      productType: false
    })
  },
  //显示提示弹窗
  showout() {
    this.setData({
      productType: !this.data.productType
    })
  },

  /**
   * 立即提现
   */
  nowWithdraw(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      productType: !that.data.productType
    })
    that.setData({
      currentCoupon: that.data.couponData[index],
    })
  },

  /**
   * 兑换
   */
  startWithdraw() {
    var that = this
    that.setData({
      productType: false
    })
    that.useCoupons(that.data.currentCoupon.keyid, that.data.currentCoupon.discount)
  },

  /**
   * 提现使用优惠券
   */
  useCoupons(couponId, money) {
    var userId = appUserInfo.userId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_coupons&action=UseCoupons&appId=' + app.data.appid + "&timestamp=" + timestamp + "&id=" + couponId + "&orderId=";
    var otherParam = "&userId=" + userId + "&money=" + money
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "提现使用优惠券")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.data.reData = true
            wx.navigateTo({
              url: "../exchannge/exchannge?money=" + that.data.currentCoupon.discount,
            })
            break
        }
        break
      default:
        console.log(error)
        break
    }
  },

  /**
   * 使用优惠券
   */
  goUseCoupon(e) {
    var index = e.currentTarget.dataset.index
    var typeid = this.data.couponData[index].typeid
    var url = '/pages/alittle/alittle?typeid=' + typeid
    console.log(url)
    wx.reLaunch({
      url: url
    })
  },
})
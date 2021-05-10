// packageYK/pages/signin/signin.js
const app = getApp();
var SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  sOptions = null;
var Utils = require('../../../utils/util.js');
// 定时器编号,可以取消定时
var TimeoutNumber = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    signinList: [],
    // 判断有没有签到第一天,开启签到活动
    isStartSignin: false,
    // 开启签到活动日期时间
    startSigninDate: "",
    // 判断当天是否已签到
    isSignin: false,
    // 当天签到的天数
    signinDay: 0,
    countDown: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 初始化值
    that.data.companyId = app.data.companyId
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,
      paramShareUId = 0,
      isScene = false,
      dOptions = null;
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

    that.data.companyId = sOptions.companyid

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        // let ProductId = null,
        //   Sid = 0,
        //   otherParams = "";
        // try {
        //   if (Utils.isNotNull(sOptions.pid) && Utils.myTrim(sOptions.pid + "") != "") {
        //     ProductId = sOptions.pid;
        //   }
        // } catch (e) {}
        // try {
        //   if (Utils.isNotNull(sOptions.sid) && Utils.myTrim(sOptions.sid + "") != "") {
        //     Sid = parseInt(sOptions.sid);
        //     Sid = isNaN(Sid) ? 0 : Sid;
        //   }
        // } catch (e) {}
        // if (Utils.myTrim(ProductId) == "") {
        //   wx.showToast({
        //     title: "无效商品！",
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return;
        // }
        that.getSigninitemlList()
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
  onShow: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '签到领红包',
      path: 'packageYK/pages/signin/signin'
    }
  },
  //退出弹窗
  emptyType() {
    this.setData({
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
   * 获取签到信息
   */
  getSigninitemlList() {
    var userId = appUserInfo.userId
    // userId = 6957
    let signParam = 'cls=main_signinitem&action=signinitemlList&companyId=' + app.data.companyId
    var otherParam = "&userId=" + userId
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取签到信息")
  },

  /**
   * 提交签到
   */
  userSignin() {
    if (!Utils.isNull(this.data.countDown) && this.data.countDown == 0) {
      wx.showToast({
        title: "活动已结束",
        icon: 'none',
        duration: 1500
      })
      return
    }
    let signParam = 'cls=main_signinHistory&action=userSigninHistory&userId=' + appUserInfo.userId
    var otherParam = "&xcxAppId=" + app.data.wxAppId + "&signinitemId=" + this.data.signinList.id + "&day=" + this.data.signinDay + "&companyId=" + app.data.companyId
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 1, "提交签到")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.dealData(data)
            break
          case 1:
            content = "签到成功"
            that.showout()
            that.getSigninitemlList()
            break
        }
        if (!Utils.isNull(content)) {
          wx.showToast({
            title: content,
            icon: 'none',
            duration: 1500
          })
        }
        break
      default:
        console.log(error)
        break
    }
  },

  dealData(data) {
    let that = this;
    // 判断有没有签到第一天/开启签到活动
    var isStartSignin = that.data.isStartSignin
    // 开启签到活动日期时间
    var startSigninDate = that.data.startSigninDate
    // 判断当天是否已签到
    var isSignin = that.data.isSignin
    // 当天签到的天数
    var signinDay = that.data.signinDay

    let curDate = new Date()
    let curDateString = curDate.getFullYear().toString() + curDate.getMonth().toString() + curDate.getDate().toString()
    for (let i = 0; i < data.dataList.length; i++) {
      const element = data.dataList[i];
      // 没签到
      if (element.ishexist == 0) {
        if (signinDay == 0) {
          signinDay = element.day
        }
      } else {
        if (element.day == 1) {
          startSigninDate = element.dtime
          isStartSignin = true
          // 只启动一次倒计时
          if (Utils.isNull(that.data.countDown)) {
            var delay = Utils.formatDate2(15, startSigninDate, 1)
            console.log(delay)
            var time = Utils.getTimeInterval(curDate.toString(), delay.toString(), 0)
            that.setCountDown(time)
          }
        }
        let date = new Date(element.dtime)
        let dateString = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
        if (curDateString == dateString) {
          isSignin = true
        }
      }
    }

    that.setData({
      signinList: data,
      isStartSignin: isStartSignin,
      startSigninDate: startSigninDate,
      isSignin: isSignin,
      signinDay: signinDay,
    })
  },

  userMoney() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 倒计时
   */
  setCountDown: function (time) {
    let that = this
    let delay = 1000 * 30;
    if (time <= 0) {
      time = 0;
      that.setData({
        countDown: 0,
      })
      return
    }
    let formatTime = this.getFormat(time);
    time -= delay;
    var countDown = `${formatTime.d}天${formatTime.hh}时${formatTime.mm}分`;
    console.log(countDown)
    that.setData({
      countDown: countDown,
    })
    clearTimeout(TimeoutNumber)
    TimeoutNumber = setTimeout(function () {
      that.setCountDown(time)
    }, delay);
  },
  /**
   * 格式化时间
   */
  getFormat: function (msec) {
    let ss = parseInt(msec / 1000);
    let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    let d = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
      }
    }

    d = parseInt(hh / 24)
    hh = parseInt(hh % 24)

    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return {
      ss,
      mm,
      hh,
      d
    };
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('监听页面卸载' + TimeoutNumber)
    clearTimeout(TimeoutNumber)
  },

})
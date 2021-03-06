// pages/mine/mine.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.muserInfo;
var packSMPageUrl = "../../packageSMall/pages",
  packYKPageUrl = "../../packageYK/pages",
  packTempPageUrl = "../../packageTemplate/pages",
  packOTPageUrl = "../../packageOther/pages",
  packComPageUrl = "../../packageCommercial/pages",
  packMainPageUrl = "../../pages",
  mainFootDir = "../../",
  mainPackageUrl = "../../pages",
  packOtherPageUrl = "../../packageOther/pages",
  mQRType = 1,
  mallhomepageType = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName, //系统名称
    sysLogoUrl: app.data.sysLogoUrl, //系统Logo
    isShowAuthor: false, //授权提示
    showguidance: false,
    isLoad: false, //是否已经加载
    DataURL: DataURL, //远程资源路径
    mallChannelId: 0,
    SMDataURL: SMDataURL, //报价优远程资源
    PublishVersion: "", //发布的版本号
    UserID: 0,
    UserName: "",
    avatarUrl: "",
    mobile: "",
    userCVersionType: 1,
    roleStatus: 0,

    //二维码
    isShowQRCode: false, //是否显示二维码弹窗
    qrShowTitle: "商城首页二维码",
    qrShowImgSrc: "",
    isMember: false,

    remainingSum: 0.00, //余额

    agentAuditState: 0, //代理申请状态：0未通过，1已通过

    adminCnt:0,     //管理项数量
    otherCnt:0,     //其他项数量
    //type：0管理项，1其他项；pagetype：0普通页面，1tabbar页面；package：页面所在的包包名简写；imgSrc：图标路径；page：页面名称
    adminFunList: [{
        name: "设备管理",
        isShow: false,
        type: 0,
        imgSrc: "/images/amy-sbgl.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "deviceAdmin",
        param: ""
      },
      {
        name: "统一套餐",
        isShow: false,
        type: 0,
        imgSrc: "/images/mine-icon3.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "costSetup",
        param: ""
      },
      // { name: "分成统计", isShow: false, type: 0, imgSrc: "/images/amy-fcgl.png", pagetype: 0, isaudit: 0, package: "yk", page: "statShare" , param:""},
      {
        name: "经营数据",
        isShow: false,
        type: 0,
        imgSrc: "/images/amy-jysj.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "agentbusiness",
        param: "?flag=0"
      },
      {
        name: "订单数据",
        isShow: false,
        type: 0,
        imgSrc: "/images/amy-dingdansecord.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "agentbusiness",
        param: "?flag=1"
      },

      {
        name: "配送管理",
        isShow: false,
        type: 0,
        imgSrc: "/images/patchwm.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "dispatching",
        param: ""
      },
      {
        name: "营销工具",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-yxgj.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "",
        param: ""
      },
      {
        name: "申请列表",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-sqlb.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "applyAccountList",
        param: ""
      },
      {
        name: "账户申请",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-fbxx.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "applyAccount",
        param: ""
      },
      {
        name: "商品管理",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-zhanghao.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "release",
        param: ""
      },
      {
        name: "信号接收",
        isShow: false,
        type: 1,
        imgSrc: "/images/signal.png",
        pagetype: 0,
        isaudit: 0,
        package: "",
        page: "testaddress",
        param: ""
      },
      {
        name: "设备绑定码",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-sbbd.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "deviceBindQRCode",
        param: ""
      },
      {
        name: "赠送按摩券",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-getgift.png",
        pagetype: 0,
        isaudit: 0,
        package: "yk",
        page: "Gifts",
        param: ""
      },
      {
        name: "核销实物",
        isShow: false,
        type: 1,
        imgSrc: "/images/amy-verification.png",
        pagetype: 0,
        isaudit: 0,
        package: "vp",
        page: "mkghetrs",
        param: ""
      }
    ],

    user_roleId: 0,

    cheirapsisCouponCnt: 0, //按摩劵数量
    curHistoryUseIntegrals:0,     //当前累积可用积分
    curUseIntegrals:0,            //当前可用积分
    curDayAddUseIntegrals:0,         //当天新增可用积分
    curMemIntegrals:0,            //当前会员积分
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    that.setData({
      sysLogoUrl: app.data.sysLogoUrl,
    })
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
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null) {
          wx.showToast({
            title: "获取用户失败！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let isMember = Utils.isNull(appUserInfo.userMobile) ? false : true;

        that.setData({
          PublishVersion: app.data.publishVersion,
          UserName: Utils.getStrLen(appUserInfo.userName, 20),
          UserID: appUserInfo.userId,
          avatarUrl: appUserInfo.avatarUrl,
          userCVersionType: appUserInfo.userCVersionType,
          mobile: appUserInfo.userMobile,
          roleStatus: appUserInfo.roleStatus,

          isMember: isMember,

          user_roleId: app.data.user_roleId,
        })
        that.getLoginFunctionList();
        that.getMyUserInfo();
        // that.getPartnerApplyStat();
        that.getAgentUserCompanyList();
        app.getNewMyRemainingSum(that);
        app.getMemberIntegrals(that,"");
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this,
      shareWXImg = that.data.SMDataURL + "/images/redpackerimg1.png",
      url = "";
    url = "pages/alittle/alittle?suid=" + appUserInfo.userId;
    console.log("分享链接：" + url)
    return {
      title: "that.data.shareAlertWords",
      imageUrl: shareWXImg,
      path: url,
      success: (res) => { // 成功后要做的事情
        console.log("分享成功")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;

    //导航条相关处理操作
    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) {
      //设置tabbar导航条当前索引位置
      app.setTabBarSelIndex(that);
    } else {
      //获取导航条
      app.getTabBarList(that, app.data.companyId, false);
    }
    appUserInfo = app.globalData.userInfo;
    that.getMyCheirapsisCouponList();
    if (appUserInfo == null || appUserInfo == undefined) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      if (!that.data.isLoad)
        that.data.isLoad = true;
      else {
        let user_roleId = that.data.user_roleId,
          isReLogin = false;
        if (user_roleId != app.data.user_roleId) {
          isReLogin = true;
          user_roleId = app.data.user_roleId;
        }
        that.setData({
          isShowMine: true,
          UserName: Utils.getStrLen(appUserInfo.userName, 20),
          UserID: appUserInfo.userId,
          avatarUrl: appUserInfo.avatarUrl,

          roleStatus: appUserInfo.roleStatus,
          user_roleId: user_roleId,
        })

        that.getMyUserInfo();
        that.getPartnerApplyStat();
        app.getNewMyRemainingSum(that);
        app.getMemberIntegrals(that,"");
        if (isReLogin) {
          that.getLoginFunctionList();
          that.getAgentUserCompanyList();
        }
        console.log("onShow")
      }
    }
    setTimeout(function(){
      that.setData({
        moprttype:true
      })
    },3000)
  },
  //方法：获取导航条回调方法
  dowithGetTabBarList: function () {
    let that = this;
    app.setTabBarSelIndex(that);
  },
  onUnload: function () {
    var that = this;
    appUserInfo = app.globalData.muserInfo;
    if (appUserInfo != null) {
      wx.switchTab({
        url: mainFootDir + app.data.sysMainPage
      })
    }
  },
  //方法：获取我的余额结果处理函数
  dowithGetNewMyRemainingSum: function (dataList, tag, errorInfo) {
    let that = this;
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("我的余额获取结果：");
        console.log(dataList);
        let mainData = dataList,
          remainingSum = 0.00;
        if (Utils.isNotNull(mainData) && Utils.isNotNull(mainData.balance)) {
          if (Utils.isNotNull(mainData.balance.totalmoney)) {
            remainingSum = parseFloat(mainData.balance.totalmoney);
            remainingSum = isNaN(remainingSum) ? 0 : remainingSum;
          }
          remainingSum = Utils.roundFixed(remainingSum, 2);
        }

        that.setData({
          remainingSum: remainingSum,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取余额失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取合作人申请状态
  getPartnerApplyStat: function () {
    let that = this,
      otherParams = "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId;
    app.getPartnerApplyStat(that, otherParams);
  },
  //方法：获取合作人申请结果处理函数
  dowithGetPartnerApplyStat: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取合作人申请结果：");
        console.log(dataList);
        let data = dataList,
          dataItem = null,
          listItem = null,
          partnerList = [];
        let agentAuditState = -1;
        if (Utils.isNotNull(data.dataList) && data.dataList.length > 0) {
          dataItem = data.dataList[0];
          if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "") {
            try {
              agentAuditState = parseInt(dataItem.status);
              agentAuditState = isNaN(agentAuditState) ? 0 : agentAuditState;
            } catch (err) {}
          }
        }
        that.setData({
          ["agentAuditState"]: agentAuditState,
        })
        app.data.agentAuditState = agentAuditState;

        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取合伙人失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取代理商的公司信息列表
  getAgentUserCompanyList: function () {
    let that = this,
      otherParams = "&xcxAppId=" + app.data.wxAppId;
    if(Utils.isNotNull(app.data.accountCompanyIdList)){
      otherParams += "&id=" + app.data.accountCompanyIdList;
      app.getCompanyMainDataInfo(that, otherParams);
    }     
  },
  //方法：获取代理商的公司信息列表结果处理函数
  dowithGetCompanyMainDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取代理商的公司信息列表结果：");
        console.log(dataList);
        let data = dataList,
          dataItem = null,
          listItem = null,
          agentUserCompanyList = [];
        if (Utils.isNotNull(data) && Utils.isNotNull(data.companyMsg) && data.companyMsg.length > 0) {
          let id = 0,
            companyName = "";
          for (let i = 0; i < data.companyMsg.length; i++) {
            id = 0;
            companyName = "";
            dataItem = null;
            listItem = null;
            dataItem = data.companyMsg[i];
            id = dataItem.id;

            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              companyName = dataItem.companyName;

            listItem = {
              id: id,
              companyName: companyName,
            }
            agentUserCompanyList.push(listItem);
          }
        }
        app.data.agentUserCompanyList = agentUserCompanyList;
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取公司信息列表失败！";
        break;
    }
  },
  //事件：跳转页面
  gotoPage: function (e) {
    //pagetype：0普通页面，1tabbar页面
    //package：包名简写
    //pagename：页面名称
    let that = this,
      pagetype = 0,
      isCheckAuditStat = 0,
      packageName = e.currentTarget.dataset.package,
      pagename = e.currentTarget.dataset.page,
      param = e.currentTarget.dataset.param,
      url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) {}
    try {
      isCheckAuditStat = parseInt(e.currentTarget.dataset.isaudit);
      isCheckAuditStat = isNaN(isCheckAuditStat) ? 0 : isCheckAuditStat;
    } catch (e) {}

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState,param);
  },

  //事件：跳转页面
  gotoCommonPage:function(e){
    let that=this,packageName="",page="",pagetype=0;
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype=isNaN(pagetype)?0:pagetype;
    } catch (e) {}
    try {
      packageName = Utils.myTrim(e.currentTarget.dataset.package);
    } catch (e) {}
    try {
      page = Utils.myTrim(e.currentTarget.dataset.page);
    } catch (e) {}
    app.gotoCommonPage(that,packageName,page,pagetype,"");
  },

  personal: function () {
    console.log("我的资料-----------------------------------------")
    console.log(app.globalData.userTotalInfo)
    wx.navigateTo({
      url: "../personal/personal"
    });
  },

  //方法：我的相关信息
  getMyUserInfo: function () {
    var that = this;
    if (Utils.myTrim(appUserInfo.userName) != "") {
      that.setData({
        UserName: Utils.getStrLen(appUserInfo.userName, 20),
        UserID: appUserInfo.userId,
      })
    }

  },



  //事件：跳转商城二维码
  showStoreMainPageQRCode: function (e) {
    var that = this,
      qrShowImgSrc = that.data.qrShowImgSrc;
    if (Utils.myTrim(qrShowImgSrc) != "") {
      that.setData({
        isShowQRCode: true,
        qrShowImgSrc: app.getSysImgUrl(qrShowImgSrc),
      })
      console.log(that.data.qrShowImgSrc);
    } else {
      that.createSPQRCode();
    }
  },
  //方法：生成商城二维码
  createSPQRCode: function (page, id) {
    var that = this,
      page = app.data.storeShareMainPage,
      params = "vtype=1"; // + "|suid=" + appUserInfo.userId;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=qrCode_qrCode&action=getMallProductCode&page=" + page + "&pagedata=" + params + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&type=" + mQRType + "&mallhomepageType=" + mallhomepageType + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      dataType: "json",
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("生成二维码成功！")
          if (res.data.data != null && res.data.data != undefined && res.data.data.imageAddress != null && res.data.data.imageAddress != undefined && Utils.myTrim(res.data.data.imageAddress) != "") {
            var qrsrc = app.getSysImgUrl(res.data.data.imageAddress.replace('/tts_upload', ''));
            try {
              that.dowithGetQRCode(qrsrc);
            } catch (err) {}
          } else {
            wx.showToast({
              title: "生成二维码失败！",
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "生成二维码接口失败！",
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  //方法：二维码生成处理方法
  dowithGetQRCode: function (qrSrc) {
    var that = this;
    if (Utils.myTrim(qrSrc) != "") {
      that.setData({
        isShowQRCode: true,
        qrShowImgSrc: app.getSysImgUrl(qrSrc),
      })
      console.log(that.data.qrShowImgSrc);
    }
  },
  //事件：隐藏二维码弹窗
  hideModalQRcode: function (e) {
    var that = this;
    that.setData({
      isShowQRCode: false,
      qrShowTitle: "",
      qrShowImgSrc: "",
    })
  },
  //事件：跳转管理页面
  gotoAdminPage: function (e) {
    let that = this;
    wx.showToast({
      title: "开发中！",
      icon: 'none',
      duration: 2000
    })
  },
  //方法：获取登录功能列表
  getLoginFunctionList: function () {
    let that = this,
      accountName = that.data.accountName,
      accountPwd = that.data.accountPwd,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    if (Utils.isNull(app.data.user_roleId) || app.data.user_roleId <= 0) return;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_rolePower&action=getRolePowerPowerList&roleId=" + app.data.user_roleId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&pageSize=99&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取功能列表结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data,
            adminFunList = that.data.adminFunList,
            adminCnt = 0,otherCnt=0;
          for (let i = 0; i < adminFunList.length; i++) {
            adminFunList[i].isShow = false;
          }
          if (Utils.isNotNull(mainData.menuDataList) && mainData.menuDataList.length > 0) {
            let dataItem = null,
              title = "",
              status = 0;
            for (let i = 0; i < mainData.menuDataList.length; i++) {
              dataItem = null;
              dataItem = mainData.menuDataList[i];
              if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
                try {
                  status = parseInt(dataItem.status);
                  status = isNaN(status) ? 0 : status;
                } catch (err) {}
              }
              if (Utils.isNotNull(dataItem.title) && Utils.myTrim(dataItem.title + "") != "null") {
                title = Utils.myTrim(dataItem.title);
              }
              for (let j = 0; j < adminFunList.length; j++) {
                if (Utils.myTrim(adminFunList[j].name) == title && status == 0) {
                  adminFunList[j].isShow = true;
                  adminCnt = adminFunList[j].type == 0 ? adminCnt + 1 : adminCnt;
                  otherCnt = adminFunList[j].type == 1 ? otherCnt + 1 : otherCnt;
                  break;
                }
              }
            }
          }

          that.setData({
            ["adminFunList"]: adminFunList,
            ["adminCnt"]: adminCnt,
            ["otherCnt"]:otherCnt,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          app.setErrorMsg2(that, "获取功能列表失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "功能列表获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取我的按摩劵
  getMyCheirapsisCouponList: function () {
    let that = this,
      otherConParams = "&xcxAppId=" + app.data.wxAppId;
    otherConParams += "&userId=" + appUserInfo.userId + "&duration=0&isUse=0&isCancelShare=0";
    app.getShareStatData(that, otherConParams, 1000000, 1);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this;
    app.dowithGetShareStatData(that, 1, dataList, tag, errorInfo, pageIndex,true)
  },
  //方法：获取用户积分结果处理函数
  dowithGetMemberIntegrals: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取用户积分结果：");
        console.log(dataList);
        let allEnableIntegrals=0, curUseIntegrals=0,dayEnableIntegrals=0,curDayAddUseIntegrals=0;
        let allUsedIntegrals=0,dayUsedIntegrals=0;
        if(Utils.isNotNull(dataList)){
          //获取累积可用积分
          if(Utils.isNotNull(dataList.addMap)){
            if(Utils.isDBNotNull(dataList.addMap.expenditure_integral)){
              try{
                allEnableIntegrals=parseInt(dataList.addMap.expenditure_integral);
                allEnableIntegrals=isNaN(allEnableIntegrals)?0:allEnableIntegrals;
              }catch(e){}
            }
          }
          //获取已使用可用积分
          if(Utils.isNotNull(dataList.cutMap)){
            if(Utils.isDBNotNull(dataList.cutMap.expenditure_integral)){
              try{
                allUsedIntegrals=parseInt(dataList.cutMap.expenditure_integral);
                allUsedIntegrals=isNaN(allUsedIntegrals)?0:allUsedIntegrals;
              }catch(e){}
            }
          }
          //获取未使用可用积分
          curUseIntegrals=allEnableIntegrals>=allUsedIntegrals?allEnableIntegrals-allUsedIntegrals:0;


          //获取当天累积可用积分
          if(Utils.isNotNull(dataList.addDayMap)){
            if(Utils.isDBNotNull(dataList.addDayMap.expenditure_integral)){
              try{
                dayEnableIntegrals=parseInt(dataList.addDayMap.expenditure_integral);
                dayEnableIntegrals=isNaN(dayEnableIntegrals)?0:dayEnableIntegrals;
              }catch(e){}
            }
          }
          //获取当天已使用可用积分
          if(Utils.isNotNull(dataList.cutDayMap)){
            if(Utils.isDBNotNull(dataList.cutDayMap.expenditure_integral)){
              try{
                dayUsedIntegrals=parseInt(dataList.cutDayMap.expenditure_integral);
                dayUsedIntegrals=isNaN(dayUsedIntegrals)?0:dayUsedIntegrals;
              }catch(e){}
            }
          }
          //获取当天未使用可用积分
          curDayAddUseIntegrals=dayEnableIntegrals>=dayUsedIntegrals?dayEnableIntegrals-dayUsedIntegrals:0;
        }
        that.setData({
          ["curHistoryUseIntegrals"]:allEnableIntegrals,
          ["curUseIntegrals"]: curUseIntegrals,
          ["curDayAddUseIntegrals"]:curDayAddUseIntegrals,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取用户积分失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
})
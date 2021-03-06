const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js'); 
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutGetChances = null, timeOutGetDrawAwardList = null, timeOutGetPCheirapsisProductList = null, timeOutGetDeviceInfo = null, internalDownTime = null, timeInternelQueryDevice=null;

var getGrade = 0, havePlayed = 0, isDowithing = false, sendGPRSCmdCnt = 0, frequentness=1;
var mainPackageUrl = "../../pages", packYKPageUrl ="../../packageYK/pages", packSMPageUrl = "../../packageSMall/pages", payForType = 0, payMordeAlert = "您还有可使用的按摩券(“首页”-“我的奖品”中选择使用)，是否需要继续支付？";

var interval = null;
var intime = 60;
var Ballheight = app.globalData.ballheight;
Page({
  data: {
    sysName: app.data.sysName,         //系统名称
    isLoad: false,         //是否已经加载
    isLoadMainData: false,  //是否已加载主信息
    DataURL: DataURL,      //远程资源路径
    randomNum: Math.random() / 9999,
    activityName: "幸运大转盘",                     //抽奖活动名称
    luckdraw_id: app.data.luckdraw_id,            //抽奖活动ID

    osTag: 0,                                     //系统类型：1 安卓，2 IOS
    chanceTimes: app.data.freeDrawTimeCnt,                     //抽奖机会

    mainbgcss: "",                      //固定位置禁止滚动样式

    showModalwinning: false,           //弹框遮罩层是否隐藏

    size: { //转盘大小可配置
      // w: 543,
      // h: 544
      w: 600,
      h: 600
    },
    musicflg: true,
    fastJuedin: false,
    repeat: false,
    xiaojuedingArr: null,
    s_awards: '？',//结果

    share: true,

    payCheirapsisProductList: [],        //付费按摩产品记录列表
    curItem: null,                       //当前抽奖记录信息
    drawAwardRecordList: [],             //抽奖记录信息列表

    rechargeRecordId: 0,                 //充值记录ID
    rechargeProductId: 0,                //充值对应产品ID
    rechargeAlert: "",                   //充值提示语
    rechargeSum: 0.00,                   //充值金额
    rechargeMinuteCnt: 0,               //充值分钟数
    rechargeType: 0,                     //充值类型：0抽奖，1按摩
    isRecharge: false,                   //是否为充值操作
    rechargeItem: null,

    remainingSum: 0.00,        //剩余余额

    rule: [
      { id: 1, rule: '1.本活动仅限注册用户参与' },
      { id: 2, rule: '2.用户每天可免费抽奖一次' },
      { id: 3, rule: '3.获得的奖品可在"我的奖品"中查看' },
      { id: 4, rule: '4.本次活动最终解释权归'+app.data.sysName+'所有' }
    ],
    ReChargePop: false,

    deviceProductPid: app.data.deviceProductPid,  //推荐商品ID

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    agentUserId: 0,                                //代理商ID
    agentCompanyId: 0,                             //代理商公司ID
    agentDeviceId: 0,                              //代理商设备ID
    agentDeviceStatus:1,                           //代理设备绑定公司状态：0已绑定，1未绑定
    isDeviceUsing:false,                           //当前用户是否在用该设备
    isShowHomeCheirapsisAlert: true,               //是否显示首页按摩提示

    deviceNo: "",                                 //设备编号

    roleStatus: 0,                 //0为普通1角色管理员(平台)2合作商
    loginMode: 0,                  //登录模式：0默认登录，1更换设备登录

    imgItemList: [DataURL + "/images/amy-fjs.png", DataURL + "/images/amy-fjy.png", DataURL + "/images/amy-fje.png"],
    starRingList: [],                //走马灯
    color: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],//透明度
    btnconfirm: DataURL + '/images/amy-centp.png', //开始抽奖图片
    clickLuck: 'clickLuck', //点击事件
    luckPosition: 0,        //判断是否中奖依据

    ringItems: { item0: null, item1: null, item2: null, item3: null, item4: null, item5: null, item6: null, item7: null },
    isLotteryDrawing: false,          //是否抽奖进行中

    curSelRechargeItem: null,        //当前所选充值记录信息
    curSelOperateAwardItem: null,     //当前所选使用抽奖记录

    //倒计时
    remainTime: 0,                  //倒计时总时长秒
    remainTimeDays:'',              //倒计时天
    remainTimeDayHours:'',          //倒计时（扣除天）小时

    remainTimeHours: '',            //倒计时（没扣除天）小时
    remainTimeMinutes: '',          //倒计时分钟
    remainTimeSeconds: '',          //倒计时秒     

    isShowESPricePop:false,         //是否显示特价弹窗

    cb51StartTag: 0,        //1启动检查，2停止检查，3支付检查，4时间查询
    socketMsgQueue:[],

    isPayforLotteryDraw:false,      //是否允许支付抽奖
    scrollX: 400,
    scrollY: 100,
    ballheight: Ballheight, //悬浮球移动面积
  },
  //方法：获取免费抽奖次数
  getFreeDrawTimeCnt: function (isRecharge) {
    let that = this, cacheResult = null, chanceTimes = app.data.freeDrawTimeCnt, isHaveSet = false;
    that.getAwardChances(isRecharge);
  },
  //方法：设置免费抽奖次数
  setFreeDrawTimeCnt: function (chanceTimes) {
    let that = this;
    that.setData({
      ["chanceTimes"]: chanceTimes,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    //版本检查
    app.checkAndUpdateVersion();

    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, mallChannelId = 0, isScene = false, dOptions = null;
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
    } catch (e) { }
    that.data.paramShareUId = paramShareUId;

    appUserInfo = app.globalData.userInfo;
    that.data.loginAction = 0;
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
    var that = this, isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        //如果当前用户为合作商，则自动赋值当前用户为代理商（如果参数传递了代理商则用参数的代理商替代）
        if (appUserInfo.roleStatus == 2) {
          app.data.agentUserId = appUserInfo.userId;
        }
        let agentUserId = app.data.agentUserId, agentCompanyId = app.data.agentCompanyId, agentDeviceId = app.data.agentDeviceId;
        let osTag = Utils.isNotNull(app.data.currentOS) && app.data.currentOS.osTag >= 1 ? app.data.currentOS.osTag : 1;
        that.setData({
          ["osTag"]: osTag,
          ["roleStatus"]: appUserInfo.roleStatus,
        })
        //获取代理商ID
        if (sOptions.auid != null && sOptions.auid != undefined) {
          try {
            agentUserId = parseInt(sOptions.auid);
            agentUserId = isNaN(agentUserId) ? 0 : agentUserId;
          } catch (e) { }
          app.data.agentUserId = agentUserId;
        }
        //获取代理商公司ID
        if (sOptions.acid != null && sOptions.acid != undefined) {
          try {
            agentCompanyId = parseInt(sOptions.acid);
            agentCompanyId = isNaN(agentCompanyId) ? 0 : agentCompanyId;
          } catch (e) { }
          app.data.agentCompanyId = agentCompanyId;
        }
        //获取代理商设备ID
        if (sOptions.adid != null && sOptions.adid != undefined) {
          try {
            agentDeviceId = parseInt(sOptions.adid);
            agentDeviceId = isNaN(agentDeviceId) ? 0 : agentDeviceId;
          } catch (e) { }
        }
        app.data.agentDeviceId = agentDeviceId > 0 ? agentDeviceId : app.data.agentDeviceId;
        that.setData({
          ["agentUserId"]: agentUserId,
          ["agentCompanyId"]: agentCompanyId,
          ["agentDeviceId"]: agentDeviceId,
          ["agentDeviceStatus"]: app.data.agentDeviceStatus,
          ["isPayforLotteryDraw"]: app.data.isPayforLotteryDraw,
          ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,
        })
        
        //启用新模式
        if (agentDeviceId <= 0 || app.data.agentDeviceStatus==1) {
          that.data.isLoad = true;
          that.gotoScanCodePage();
        } else {
          that.data.isLoadMainData = true;
          if (app.data.communicationType == 0) {
            app.checkBluetoothState();
          }
          that.getDefaultMainInfo(false);
        }

        // this.moveItemPostion(0);
        this.setStarRingEffect();
        break;
    }
  },
  //方法：默认登录首页信息获取
  getDefaultMainInfo: function (isRecharge) {
    let that = this;

    app.getBannerList(that)
      .then(function (data) {
        console.log(data);
        that.getFreeDrawTimeCnt(isRecharge);
        that.getAwardDataInfo(that.data.luckdraw_id);
        //app.getMyRemainingSum(that);
        timeOutGetDeviceInfo = setTimeout(function () {
          if (app.data.agentDeviceId > 0) {
            that.getDeviceInfo("", app.data.agentDeviceId, 1);
          }
        }, 200);
        
        that.scroll();
        console.log("Promise function finished!!!");
        that.data.isLoad = true;
      }, function (data) {
        console.log(data);
        that.getFreeDrawTimeCnt(isRecharge);
        that.getAwardDataInfo(that.data.luckdraw_id);
        //app.getMyRemainingSum(that);
        timeOutGetDeviceInfo = setTimeout(function () {
          if (app.data.agentDeviceId > 0) {
            that.getDeviceInfo("", app.data.agentDeviceId, 1);
          }
        }, 200);
        that.scroll();
        console.log("Promise function finished!!!");
        that.data.isLoad = true;
      })
  },
  ///////////////////////////////////////////////////////////////////
  //---获取首页banner-------------------------------------------------
  //方法：获取Banner方法结果处理函数
  dowithGetBannerList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined && dataList.length > 0) {
          let dataItem = null, detailItem = null, listItem = null, imgUrls = [], middleADImgUrls = [], distributionADUrl = [];
          var location = 0, order = 0, src = "", url = "";
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null; listItem = null; dataItem = dataList[i];
            location = 0; src = ""; url = ""; order = 0;
            if (dataItem.img != null && dataItem.img != undefined && Utils.myTrim(dataItem.img + "") != "null" && Utils.myTrim(dataItem.location + "") != "")
              src = dataItem.img;
            else
              continue;
            if (dataItem.url != null && dataItem.url != undefined && Utils.myTrim(dataItem.url + "") != "null" && Utils.myTrim(dataItem.url + "") != "")
              url = dataItem.url;
            if (dataItem.location != null && dataItem.location != undefined && Utils.myTrim(dataItem.location + "") != "null") {
              try {
                location = parseInt(dataItem.location);
                location = isNaN(location) ? 0 : location;
              } catch (err) { }
            }
            if (dataItem.order != null && dataItem.order != undefined && Utils.myTrim(dataItem.order + "") != "null") {
              try {
                order = parseInt(dataItem.order);
                order = isNaN(order) ? 0 : order;
              } catch (err) { }
            }
            listItem = {
              src: app.getSysImgUrl(src),
              url: url,
              order: order,
              isShow: false,
            }
            switch (location) {
              case 0:
                imgUrls.push(listItem);
                break;
              case 1:
                middleADImgUrls.push(listItem);
                break;
              case 2:
                distributionADUrl.push(listItem);
                break;
            }
          }
          app.data.distributionADUrl = distributionADUrl;
          if (imgUrls != null && imgUrls != undefined && imgUrls.length > 0)
            imgUrls[0].isShow = true;
          imgUrls = imgUrls.length > 0 ? imgUrls.sort(that.sortBanner) : imgUrls;
          middleADImgUrls = middleADImgUrls.length > 0 ? middleADImgUrls.sort(that.sortBanner) : middleADImgUrls;
          that.setData({
            imgUrls: imgUrls,
            imgUrlsCnt: imgUrls.length,
            middleADImgUrls: middleADImgUrls,
            middleADImgUrlsCnt: middleADImgUrls.length,
          }, that.lazyLoadBannerImg)
        }
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
  sortBanner: function (a, b) {
    return a.order - b.order;
  },
  //方法：Banner IntersectionObserver 对象懒加载图片
  lazyLoadBannerImg: function () {
    var that = this;
    app.lazyLoadImgList(that, that.data.imgUrls, "tbannerimg", "imgUrls");
    app.lazyLoadImgList(that, that.data.middleADImgUrls, "mbannerimg", "middleADImgUrls");
  },
  getDrawAwardDataList2: function () {
    let that = this;
    that.getDrawAwardDataList(false);
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
    app.data.pageLayerTag = "../../";

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果没有代理商，而且当前用户为合作商，则自动赋值当前用户为代理商
        if (app.data.agentUserId <= 0 && appUserInfo.roleStatus == 2) {
          app.data.agentUserId = appUserInfo.userId;
        }
        that.setData({
          ["agentUserId"]: app.data.agentUserId,
          ["agentDeviceId"]: app.data.agentDeviceId,
          ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,
        })
        if (app.data.agentDeviceId <= 0 || app.data.agentDeviceStatus==1) {
          that.data.isLoad = true;
          that.gotoScanCodePage();
        }
        console.log("isKeepOldMode:" + that.data.isLoadMainData);
        //判断是否已加载主信息
        if (that.data.isLoadMainData) {
          //如果已经加载过主信息
          console.log("isRecharge:" + that.data.isRecharge)
          that.getFreeDrawTimeCnt(that.data.isRecharge);
          that.getAwardDataInfo(that.data.luckdraw_id);
          
          timeOutGetDeviceInfo = setTimeout(function () {
            if (app.data.agentDeviceId > 0) {
              that.getDeviceInfo("", app.data.agentDeviceId, 1);
            }
          }, 200);

          let isShowReChargeCheirapsisAlert = 0;
          try {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            if (Utils.isNotNull(currPage) && Utils.isNotNull(currPage.data) && Utils.isNotNull(currPage.data.paramContinueCheirapsis)) {
              try {
                isShowReChargeCheirapsisAlert = parseInt(currPage.data.paramContinueCheirapsis)
                isShowReChargeCheirapsisAlert = isNaN(isShowReChargeCheirapsisAlert) ? 0 : isShowReChargeCheirapsisAlert;
              } catch (e) { }
            }
            if (isShowReChargeCheirapsisAlert) {
              wx.showToast({
                title: "请选择所需体验项目！",
                icon: 'none',
                duration: 2000
              })
            }
          } catch (err) { }
        } else if (app.data.agentDeviceId > 0 && app.data.agentDeviceStatus==0) {
          //如果尚未加载主信息
          that.data.isLoadMainData = true;
          if (app.data.communicationType == 0) {
            app.checkBluetoothState();
          }

          that.getDefaultMainInfo(that.data.isRecharge);
        }

        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
    that.data.isRecharge = false;
    let skt =[0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7];//透明度
    that.setData({
      color: skt
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutGetDrawAwardList != null && timeOutGetDrawAwardList != undefined) clearTimeout(timeOutGetDrawAwardList);
      if (timeOutGetPCheirapsisProductList != null && timeOutGetPCheirapsisProductList != undefined) clearTimeout(timeOutGetPCheirapsisProductList);
      if (timeOutGetDeviceInfo != null && timeOutGetDeviceInfo != undefined) clearTimeout(timeOutGetDeviceInfo);
      
      if (timeInternelQueryDevice != null && timeInternelQueryDevice != undefined) clearInterval(timeInternelQueryDevice);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutGetDrawAwardList != null && timeOutGetDrawAwardList != undefined) clearTimeout(timeOutGetDrawAwardList);
      if (timeOutGetPCheirapsisProductList != null && timeOutGetPCheirapsisProductList != undefined) clearTimeout(timeOutGetPCheirapsisProductList);
      if (timeOutGetDeviceInfo != null && timeOutGetDeviceInfo != undefined) clearTimeout(timeOutGetDeviceInfo);
      
      if (timeInternelQueryDevice != null && timeInternelQueryDevice != undefined) clearInterval(timeInternelQueryDevice);
    } catch (err) { }
  },
  scroll: function () {
    var that = this;
    setInterval(function () {
      if (that.data.topval == -384) {
        that.data.topval = 0;
      } else {
        that.data.topval -= 1;
      }
      that.setData({
        topval: that.data.topval
      })
    }, 30)
  },
  //方法：获取抽奖信息
  getAwardDataInfo: function (luckdraw_id) {
    let that = this, agentUserId = that.data.agentUserId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    //otherParamCon += agentUserId > 0 ? "&userId=" + agentUserId : "&userId=-1";

    app.getAwardProductList(that, luckdraw_id, 0, otherParamCon)
  },
  //方法：获取费用列表信息
  getPayCheirapsisProductList: function () {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += app.data.agentDeviceId > 0 ? "&devicesId=" + app.data.agentDeviceId : "&devicesId=-1";
    otherParamCon += "&lotteryProduct=1&dtPrice=1&status=0&orderfield=p.id&ordertype=asc";
    app.getAwardProductList2(that, 0, app.data.agentCompanyId, 1, otherParamCon)
  },
  //方法：获取奖项结果处理函数
  //operateTag:0转盘信息项目列表，1按摩服务产品
  dowithGetAwardProductList: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取抽奖产品列表记录结果：");
        console.log(dataList);
        let mainData = dataList, datalist = [], sourceDataList = [], payCheirapsisProductList = [], imgItemList = that.data.imgItemList, imgIndex = 0, imgSrc = "", isHave0 = false, ringItems = that.data.ringItems;
        let awardName = "", color = "", fcolor = "";
        let id = 0, lotteryProduct = 0, no = 0, lastNo = 0, grade = 0, type = 0, mallCouponsId = 0, duration = 0, price = 0.00, cashback_price=0.00, allPart = mainData.length;
        let sectionPartAngle = 360 / allPart;
        let dataItem = null, grade0listItem = null, srcListItem = null;
        switch (operateTag) {
          case 0:
            if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
              for (var i = 0; i < mainData.dataList.length; i++) {
                dataItem = null; dataItem = mainData.dataList[i]; srcListItem = null;
                // imgIndex = Math.floor((Math.random() * 3) + 1);
                // imgIndex=imgIndex-1;
                id = 0; lotteryProduct = 0; no = 0; type = 0; mallCouponsId = 0; duration = 0; cashback_price = 0.00;
                awardName = ""; color = ""; fcolor = ""; imgSrc = ""; price="";
                id = dataItem.id;
                if (Utils.isNotNull(dataItem.productName) && Utils.myTrim(dataItem.productName + "") != "null")
                  awardName = dataItem.productName;
                if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
                  try {
                    lotteryProduct = parseInt(dataItem.lotteryProduct);
                    lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
                  } catch (e) { }
                }
                if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                  try {
                    duration = parseInt(dataItem.duration);
                    duration = isNaN(duration) ? 0 : duration;
                  } catch (e) { }
                }
                console.log(dataItem.cashback_price)
                if (Utils.isNotNull(dataItem.cashback_price) && Utils.myTrim(dataItem.cashback_price + "") != "null") {
                  try {
                    price = dataItem.cashback_price;
                  } catch (e) { }
                }
                
                //2、抽奖选项
                if (lotteryProduct == 0) {
                  if (dataItem.serialNumber == null) continue;
                  no = dataItem.serialNumber;
                  if (no != null && no != undefined && no > lastNo) lastNo = no;
                  if (Utils.isNotNull(dataItem.type) && Utils.myTrim(dataItem.type + "") != "null") {
                    try {
                      type = parseInt(dataItem.type);
                      type = isNaN(type) ? 0 : type;
                    } catch (e) { }
                  }
                  if (Utils.isNotNull(dataItem.mallCouponsId) && Utils.myTrim(dataItem.mallCouponsId + "") != "null") {
                    try {
                      mallCouponsId = parseInt(dataItem.mallCouponsId);
                      mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
                    } catch (e) { }
                  }
                  if (mallCouponsId > 0 && imgItemList.length > 0) {
                    imgIndex++;
                    imgIndex = imgIndex >= imgItemList.length ? 0 : imgIndex;
                    imgSrc = imgItemList[imgIndex];
                  }

                  //如果有第0项（最开始项）
                  if (no != null && no != undefined && no == 0) {
                    isHave0 = true;
                  }

                  srcListItem = {
                    id: id,
                    position: 1,
                    index: no,            //序号从0开始
                    name: awardName,      //奖项名称
                    type: 0, mallCouponsId: mallCouponsId, duration: duration, imgSrc: imgSrc,price:price
                  };
                  sourceDataList.push(srcListItem);
                }
              }
              if (!isHave0) {
                srcListItem = null;
                srcListItem = {
                  id: 0,
                  position: 1,
                  index: 0,            //序号从0开始
                  name: "谢谢惠顾",      //奖项名称
                  type: type, mallCouponsId: 0, duration: 0, imgSrc: "", price:'',
                };
                sourceDataList.splice(0, 0, grade0listItem);
              }
              let position = 0;
              for (let i = 0; i < sourceDataList.length; i++) {
                if (sourceDataList[i].index == 0) {
                  sourceDataList[i].position = 4;
                  continue;
                }
                if (sourceDataList[i].index != 0) {
                  position = position == 4 ? 5 : position;
                  sourceDataList[i].position = position;
                }
                position++;
              }
              //ringItems
              for (let i = 0; i < sourceDataList.length; i++) {
                switch (sourceDataList[i].position) {
                  case 0:
                    ringItems.item0 = sourceDataList[i];
                    break;
                  case 1:
                    ringItems.item1 = sourceDataList[i];
                    break;
                  case 2:
                    ringItems.item2 = sourceDataList[i];
                    break;
                  case 3:
                    ringItems.item3 = sourceDataList[i];
                    break;
                  case 4:
                    ringItems.item4 = sourceDataList[i];
                    break;
                  case 5:
                    ringItems.item5 = sourceDataList[i];
                    break;
                  case 6:
                    ringItems.item6 = sourceDataList[i];
                    break;
                  case 7:
                    ringItems.item7 = sourceDataList[i];
                    break;
                }
              }
            }
            console.log("抽奖项目列表：")
            console.log(sourceDataList)
            that.setData({
              ["sourceDataList"]: sourceDataList,
              ["ringItems"]: ringItems,
            })
            console.log("抽奖活动数据信息获取：成功！")
            break;
          case 1:
            if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
              let promotionstart = "", promotionend = "",isHaveDeviceItem=false, arrayTemp = null, priceTypeList = app.data.priceTypeList;
              let firstPriceItem = null,dtStart=new Date(),dtStartStr="", dtEnd = new Date(), dtEndStr = "",isValid=true;
              payCheirapsisProductList = mainData.dataList;
              for (let i = 0; i < payCheirapsisProductList.length; i++) {
                firstPriceItem = null;
                if (!isHaveDeviceItem && payCheirapsisProductList[i].devicesId > 0) isHaveDeviceItem=true;
                if (Utils.isNotNull(payCheirapsisProductList[i].prices) && payCheirapsisProductList[i].prices.length > 0) {
                  for (let k = 0; k < payCheirapsisProductList[i].prices.length; k++) {
                    dtEnd = new Date(); dtStart = new Date(); isValid = true;
                    for (let n = 0; n < priceTypeList.length; n++) {
                      if (priceTypeList[n].id == payCheirapsisProductList[i].prices[k].priceType) {
                        payCheirapsisProductList[i].prices[k].priceTypeName = priceTypeList[n].name;
                        break;
                      }
                    }

                    promotionstart = ""; promotionend = "";
                    promotionstart = payCheirapsisProductList[i].prices[k].promotionstart; promotionend = payCheirapsisProductList[i].prices[k].promotionend;
                    switch (payCheirapsisProductList[i].prices[k].priceType){
                      case 2:
                        dtStart = new Date(promotionstart.replace(/\-/g, "/")); //Utils.getDateByTimeStr(promotionstart, true);
                        dtEnd = new Date(promotionend.replace(/\-/g, "/"));//Utils.getDateByTimeStr(promotionend, true);
                        arrayTemp = null;
                        arrayTemp = promotionstart.split(' ');
                        promotionstart = arrayTemp.length >= 2 ? arrayTemp[0] : promotionstart;

                        arrayTemp = null;
                        arrayTemp = promotionend.split(' ');
                        promotionend = arrayTemp.length >= 2 ? arrayTemp[0] : promotionend;
                        if (dtStart > (new Date()) || (new Date()) > dtEnd) {
                          isValid = false;
                        }
                        break;
                      case 3:
                        arrayTemp = null;
                        arrayTemp = promotionstart.split(' ');
                        promotionstart = arrayTemp.length >= 2 ? arrayTemp[1] : promotionstart;

                        arrayTemp = null;
                        arrayTemp = promotionend.split(' ');
                        promotionend = arrayTemp.length >= 2 ? arrayTemp[1] : promotionend;

                        dtStartStr = "";
                        dtStartStr = Utils.getDateTimeStr(dtEnd, "-", false) + " " + promotionstart;
                        dtStart = new Date(dtStartStr.replace(/\-/g, "/")); //Utils.getDateByTimeStr(dtStartStr, true);

                        dtEndStr = "";
                        dtEndStr = Utils.getDateTimeStr(dtEnd, "-", false) + " " + promotionend;
                        dtEnd = new Date(dtEndStr.replace(/\-/g, "/")); //Utils.getDateByTimeStr(dtEndStr, true);
                        if (dtStart > (new Date()) || (new Date()) > dtEnd) {
                          isValid = false;
                        }
                        break;
                    }
                    
                    payCheirapsisProductList[i].prices[k].promotionstart = promotionstart;
                    payCheirapsisProductList[i].prices[k].promotionend = promotionend;
                    payCheirapsisProductList[i].prices[k].dtStartTime = dtStart;
                    payCheirapsisProductList[i].prices[k].dtEndTime = dtEnd;
                    //有效性检查（促销价、时段价必须检查当前时间是否过时
                    if(isValid){
                      if (Utils.isNotNull(firstPriceItem)) {
                        firstPriceItem = payCheirapsisProductList[i].prices[k].sort < firstPriceItem.sort ? payCheirapsisProductList[i].prices[k] : firstPriceItem;
                      } else {
                        firstPriceItem = payCheirapsisProductList[i].prices[k];
                      }
                    }
                  }
                }

                //firstPriceItem
                if (Utils.isNotNull(firstPriceItem)){
                  payCheirapsisProductList[i].actprice = firstPriceItem.actprice;
                  payCheirapsisProductList[i].specialprice = firstPriceItem.specialprice;
                  payCheirapsisProductList[i].halfprice = firstPriceItem.halfprice;
                  payCheirapsisProductList[i].priceType = firstPriceItem.priceType;
                  payCheirapsisProductList[i].promotionstart = firstPriceItem.promotionstart;
                  payCheirapsisProductList[i].promotionend = firstPriceItem.promotionend;
                  payCheirapsisProductList[i].dtEndTime = firstPriceItem.dtEndTime;
                }
                payCheirapsisProductList[i].price = payCheirapsisProductList[i].specialprice > 0.00 && payCheirapsisProductList[i].specialprice < payCheirapsisProductList[i].actprice ? payCheirapsisProductList[i].specialprice: payCheirapsisProductList[i].actprice;
              }
              if (isHaveDeviceItem) {
                let tempList = payCheirapsisProductList;
                payCheirapsisProductList = [];
                for (let i = 0; i < tempList.length; i++) {
                  if (tempList[i].devicesId > 0) {
                    payCheirapsisProductList.push(tempList[i]);
                  }
                }
              }
            }
            
            if (payCheirapsisProductList.length>0 && payCheirapsisProductList.length <= 1 && (payCheirapsisProductList[0].priceType == 2 || payCheirapsisProductList[0].priceType ==3)){
              that.computeDownTime(payCheirapsisProductList[0].dtEndTime)
            }else{
              that.setData({
                ["remainTime"]: 0,
                ["isShowESPricePop"]: false,
              })
              if (Utils.isNotNull(internalDownTime)) clearInterval(internalDownTime);
            }
            that.setData({
              ["payCheirapsisProductList"]: payCheirapsisProductList,
            })
            console.log("服务费用列表")
            console.log(payCheirapsisProductList)
            break;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : (operateTag == 0 ? "获取转盘信息失败！" : "获取按摩服务失败！");
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取抽奖计算抽中信息
  calculateAwardDataInfo: function () {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=getPrizeProduct&activityId=" + luckdraw_id + "&companyId=" + app.data.companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log("计算抽奖")
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("抽奖计算结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data, drawAwardRecordList = [], sourceDataList = that.data.sourceDataList, grade = 0, curId = 0, curItem = null, dataItem = null, listItem = null, calPosition = 4;
          let id = 0, status = 0, payStatus=0, lotteryActivityProductId = 0, lotteryProduct = 0, productName = "", createDate = "", endTime = "", duration = 0, mallCouponsId = 0, isUse = 0, type = 0, dtCreate = new Date(), dtEnd = new Date(), dtDate = new Date(), dtNow = new Date(), isTimeOut = false, cashback_price=0.00;
          if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
            for (let i = 0; i < mainData.dataList.length; i++) {
              dataItem = null; listItem = null; dataItem = mainData.dataList[i];
              id = 0; lotteryActivityProductId = 0; lotteryProduct = 0; productName = ""; createDate = ""; endTime = ""; duration = 0; mallCouponsId = 0; isUse = 0; type = 0; status = 1; isTimeOut = false; cashback_price = 0.00; payStatus=0;
              id = dataItem.id;
              if (Utils.isNotNull(dataItem.lotteryActivityProductId) && Utils.myTrim(dataItem.lotteryActivityProductId + "") != "null") {
                try {
                  lotteryActivityProductId = parseInt(dataItem.lotteryActivityProductId);
                  lotteryActivityProductId = isNaN(lotteryActivityProductId) ? 0 : lotteryActivityProductId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.cashback_price) && Utils.myTrim(dataItem.cashback_price + "") != "null") {
                try {
                  cashback_price = parseFloat(dataItem.cashback_price);
                  cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
                  cashback_price = parseFloat((cashback_price).toFixed(app.data.limitQPDecCnt));
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
                try {
                  status = parseInt(dataItem.status);
                  status = isNaN(status) ? 1 : status;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.payStatus) && Utils.myTrim(dataItem.payStatus + "") != "null") {
                try {
                  payStatus = parseInt(dataItem.payStatus);
                  payStatus = isNaN(payStatus) ? 0 : payStatus;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
                try {
                  lotteryProduct = parseInt(dataItem.lotteryProduct);
                  lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.productName) && Utils.myTrim(dataItem.productName + "") != "null")
                productName = Utils.myTrim(dataItem.productName);
              if (Utils.isNotNull(dataItem.crateTime)) {
                try {
                  dtCreate = new Date(Date.parse((dataItem.crateTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtCreate = new Date();
                }
                createDate = Utils.getDateTimeStr3(dtCreate, "-", 0);
              }
              if (Utils.isNotNull(dataItem.endTime)) {
                try {
                  dtEnd = new Date(Date.parse((dataItem.endTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtEnd = new Date();
                }
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              } else {
                dtEnd = Utils.getDateTimeAddDays(dtCreate, 30);
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              }
              if (dtEnd < dtNow) {
                isTimeOut = true;
              }
              if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                try {
                  duration = parseInt(dataItem.duration);
                  duration = isNaN(duration) ? 0 : duration;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.mallCouponsId) && Utils.myTrim(dataItem.mallCouponsId + "") != "null") {
                try {
                  mallCouponsId = parseInt(dataItem.mallCouponsId);
                  mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.isUse) && Utils.myTrim(dataItem.isUse + "") != "null") {
                try {
                  isUse = parseInt(dataItem.isUse);
                  isUse = isNaN(isUse) ? 0 : isUse;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.type) && Utils.myTrim(dataItem.type + "") != "null") {
                try {
                  type = parseInt(dataItem.type);
                  type = isNaN(type) ? 0 : type;
                } catch (err) { }
              }
              
              //如果为无效抽奖记录则跳过
              if (status == 1) continue;

              if (type == 0 && (mallCouponsId > 0 || duration > 0)) type = 1;
              productName = Utils.myTrim(productName) == "" && type == 4 ? "充值抽奖" : productName;
              productName = Utils.myTrim(productName) == "" ? (lotteryProduct == 1 ? '付费按摩' + duration + '分钟' : (lotteryProduct == -1 ? '充值抽奖' : productName)) : productName;
              listItem = { id: id, lotteryActivityProductId: lotteryActivityProductId, lotteryProduct: lotteryProduct, productName: productName, createDate: createDate, endTime: endTime, duration: duration, mallCouponsId: mallCouponsId, isUse: isUse, type: type, cashback_price: cashback_price, payStatus: payStatus, }
              if (i == 0) {
                curItem = listItem;
              }
              if (type != 0 && !isTimeOut && isUse==0) {
                drawAwardRecordList.push(listItem);
              }
            }
          }
          console.log("当前抽中奖项：")
          console.log(curItem)
          that.setData({
            curItem: curItem,
            drawAwardRecordList: drawAwardRecordList,
          })
          if (Utils.isNotNull(curItem) && Utils.isNotNull(sourceDataList) && sourceDataList.length > 0) {
            for (let n = 0; n < sourceDataList.length; n++) {
              if (sourceDataList[n].id == curItem.lotteryActivityProductId) {
                calPosition = sourceDataList[n].position; break;
              }
            }
          }
          if (calPosition >= 0) {
            console.log("抽奖运行：成功！" + calPosition)
            //多久以后自动停止
            that.readToStartLotteryDraw(calPosition);
          }
        } else {
          app.setErrorMsg(that, "抽奖失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "抽奖活动数据信息获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取抽奖记录信息
  getDrawAwardDataList: function (isRecharge) {
    console.log("getDrawAwardDataList:"+isRecharge)
    let that = this, luckdraw_id = that.data.luckdraw_id, rechargeRecordId = that.data.rechargeRecordId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    console.log("rechargeRecordId:" + rechargeRecordId)
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=lotteryActivityRecordList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&status=0&isUse=0&pageIndex=1&pageSize=1000000&sign=" + sign;
    // urlParam = urlParam + "&activityId=" + luckdraw_id + "&companyId=" + app.data.companyId + "&userId=" + appUserInfo.userId + "&status=0&isUse=0&pageIndex=1&pageSize=1000000&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取抽奖记录信息结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data, drawAwardRecordList = [], sourceDataList = that.data.sourceDataList, grade = 0, curId = 0, curItem = null, dataItem = null, listItem = null, rechargeItem = null, spareCheirapsisCnt=0;
          let id = 0, lotteryActivityProductId = 0, lotteryProduct = 0, status = 0, payStatus=0, productName = "", createDate = "", endTime = "", duration = 0, mallCouponsId = 0, isUse = 0, type = 0, dtCreate = new Date(), dtEnd = new Date(), dtDate = new Date(), dtNow = new Date(), isTimeOut = false, cashback_price=0.00;
          if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
            for (let i = 0; i < mainData.dataList.length; i++) {
              dataItem = null; listItem = null; dataItem = mainData.dataList[i];
              id = 0; lotteryActivityProductId = 0; lotteryProduct = 0; productName = ""; createDate = ""; endTime = ""; duration = 0; mallCouponsId = 0; isUse = 0; type = 0; status = 1; isTimeOut = false; cashback_price = 0.00; payStatus=0;
              id = dataItem.id;
              if (Utils.isNotNull(dataItem.lotteryActivityProductId) && Utils.myTrim(dataItem.lotteryActivityProductId + "") != "null") {
                try {
                  lotteryActivityProductId = parseInt(dataItem.lotteryActivityProductId);
                  lotteryActivityProductId = isNaN(lotteryActivityProductId) ? 0 : lotteryActivityProductId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.cashback_price) && Utils.myTrim(dataItem.cashback_price + "") != "null") {
                try {
                  cashback_price = parseFloat(dataItem.cashback_price);
                  cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
                  cashback_price = parseFloat((cashback_price).toFixed(app.data.limitQPDecCnt));
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
                try {
                  lotteryProduct = parseInt(dataItem.lotteryProduct);
                  lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
                try {
                  status = parseInt(dataItem.status);
                  status = isNaN(status) ? 1 : status;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.payStatus) && Utils.myTrim(dataItem.payStatus + "") != "null") {
                try {
                  payStatus = parseInt(dataItem.payStatus);
                  payStatus = isNaN(payStatus) ? 0 : payStatus;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.productName) && Utils.myTrim(dataItem.productName + "") != "null")
                productName = Utils.myTrim(dataItem.productName);
              if (Utils.isNotNull(dataItem.crateTime)) {
                try {
                  dtCreate = new Date(Date.parse((dataItem.crateTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtCreate = new Date();
                }
                createDate = Utils.getDateTimeStr3(dtCreate, "-", 0);
              }
              
              if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                try {
                  duration = parseInt(dataItem.duration);
                  duration = isNaN(duration) ? 0 : duration;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.mallCouponsId) && Utils.myTrim(dataItem.mallCouponsId + "") != "null") {
                try {
                  mallCouponsId = parseInt(dataItem.mallCouponsId);
                  mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.isUse) && Utils.myTrim(dataItem.isUse + "") != "null") {
                try {
                  isUse = parseInt(dataItem.isUse);
                  isUse = isNaN(isUse) ? 0 : isUse;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.type) && Utils.myTrim(dataItem.type + "") != "null") {
                try {
                  type = parseInt(dataItem.type);
                  type = isNaN(type) ? 0 : type;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.endTime)) {
                try {
                  dtEnd = new Date(Date.parse((dataItem.endTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtEnd = new Date();
                }
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              } else {
                dtEnd = Utils.getDateTimeAddDays(dtCreate, 30);
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              }
              //抽奖结果记录需要判断过期
              if (dtEnd < dtNow) {
                isTimeOut = true;
              }
              //如果为无效抽奖记录则跳过
              if (status == 1) continue;

              if (type == 0 && (mallCouponsId > 0 || duration > 0)) type = 1;
              productName = Utils.myTrim(productName) == "" && type == 4 ? "充值抽奖" : productName;
              productName = Utils.myTrim(productName) == "" ? (lotteryProduct == 1 ? '付费按摩' + duration + '分钟' : (lotteryProduct == -1 ? '充值抽奖' : productName)) : productName;
              listItem = { id: id, lotteryActivityProductId: lotteryActivityProductId, lotteryProduct: lotteryProduct, productName: productName, createDate: createDate, endTime: endTime, duration: duration, mallCouponsId: mallCouponsId, isUse: isUse, type: type, cashback_price: cashback_price, payStatus: payStatus, }
              if (type != 0 && !isTimeOut && isUse==0) {
                drawAwardRecordList.push(listItem);

                if(duration>0){
                  spareCheirapsisCnt++;
                }
              }
              //如果为刚充值完成则获取充值记录信息
              if (isRecharge && rechargeRecordId == id) {
                rechargeItem = listItem;
              }
            }
          }
          app.data.spareCheirapsisCnt = spareCheirapsisCnt;
          that.setData({
            ["drawAwardRecordList"]: drawAwardRecordList,
            ["spareCheirapsisCnt"]: spareCheirapsisCnt,
            ["rechargeItem"]: rechargeItem,
          })

          //如果为刚充值完成
          if (isRecharge && Utils.isNotNull(rechargeItem)) {
            console.log("rechargeItem:");
            console.log(rechargeItem);
            if (rechargeItem.type == 4) {
              //修改充值抽奖记录的已使用状态，变更抽奖机会数
              let chanceTimes = that.data.chanceTimes;
              chanceTimes = chanceTimes <= 0 ? 1 : chanceTimes + 1;
              that.setData({
                ["chanceTimes"]: chanceTimes,
              })
              that.setFreeDrawTimeCnt(chanceTimes);
              //如果为抽奖充值
              wx.showModal({
                title: '提示',
                content: "充值成功，您可以继续抽奖" + chanceTimes + "次！",
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.startLotteryDraw(null);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              //如果为按摩充值
              that.setData({
                ["rechargeRecordId"]: 0,
              })
              
              that.gotoCheirapsisPage(rechargeItem.id, rechargeItem.duration,0.00,1);
            }
          }
        } else {
          app.setErrorMsg(that, "抽奖失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "抽奖活动数据信息获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：插入支付抽奖相关记录
  insertAwardAboutRecord: function (productId, rechargeSum) {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId, typeParam = productId <= 0 ? "&type=4" : "";
    otherParamCon += "&productid=" + productId + "&price=" + rechargeSum + typeParam + "&activityId=" + luckdraw_id + "&operation=add";
    otherParamCon += rechargeSum > 0.00 ? "" :"&payStatus=1&status=0";

    app.operateAwardRecord(that, otherParamCon, 0)
  },
  //方法：变更支付抽奖相关记录
  setAwardAboutRecordUsed: function (id) {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&isUse=1&id=" + id + "&activityId=" + luckdraw_id + "&operation=mod";

    app.operateAwardRecord(that, otherParamCon, 1)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    isDowithing = false;
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        let id = 0;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          try {
            id = parseInt(dataList.resultMap.id);
            id = isNaN(id) ? 0 : id;
          } catch (err) { }
        }
        console.log("当前支付记录ID：" + id)
        that.setData({
          ["rechargeRecordId"]: id,
        })
        //0插入，1更改
        switch (operateTag) {
          case 0:
            let rechargeSum = that.data.rechargeSum;
            if(rechargeSum>0){
              //1、如果为付费支付则调起微信支付
              that.getPrePayId(id);
            }else{
              //2、如果为免费支付则直接刷新获奖记录
              that.data.isRecharge = true;
              that.getDrawAwardDataList(that.data.isRecharge);
            }
            break;

          case 1:
            //继续抽奖
            havePlayed = 1;
            if (that.data.mainbgcss == "") {
              that.setData({
                mainbgcss: "solidfix",
              })
            }
            that.calculateAwardDataInfo();
            break;
        }
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
  //事件：关闭领取奖品弹窗
  hideAwardsPop: function () {
    var _this = this;
    console.log("hideAwardsPop begin")
    _this.setData({
      showModalwinning: false,
      mainbgcss: ""
    })
  },
  sortGrade: function (a, b) {
    return a.serialNumber - b.serialNumber;
  },

  //方法：领取优惠券
  receivePersonCoupons: function (couponId, recordId) {
    let that = this, luckdraw_id = that.data.luckdraw_id, couponData = [], listItem = null;

    listItem = { activityId: luckdraw_id, userId: appUserInfo.userId, couponid: couponId, sn: recordId + "" }
    couponData.push(listItem);
    app.receivePersonCoupons(that, couponData);
  },
  //方法：领取优惠券结果调用方法
  dowithReceivePersonCoupons: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("领取优惠券结果：");
        console.log(dataList);
        // wx.showToast({
        //   title: "优惠券已领取！",
        //   icon: 'none',
        //   duration: 2000
        // })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取优惠券失败，请跟客服联系！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },

  showLotterymywin: function () {
    this.setData({
      Lotterymywin: true
    })
  },
  hideLotterymywin: function () {
    this.setData({
      Lotterymywin: false
    })
  },
  //方法：打开充值弹窗
  showReChargePop: function (productId, type, amount, minute, alert) {
    let that = this, rechargeSum = amount;
    that.data.rechargeType = type;
    that.setData({
      ["rechargeProductId"]: productId,
      ["rechargeAlert"]: alert,
      ["rechargeSum"]: rechargeSum,
      ["rechargeMinuteCnt"]: minute,
      // ["ReChargePop"]: true,
    })
    that.submitPayInfo(null);
  },
  //事件：关闭充值弹窗
  hideReChargePop: function (e) {
    this.setData({
      ReChargePop: false
    })
  },
  //事件：我的抽奖记录立即使用
  useMyAward: function (e) {
    let that = this, item = null, url = "",pfTag=0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        showModalwinning: false,
        Lotterymywin: false,
      })
      pfTag = item.type == 2 && item.payStatus==1?1:pfTag;
      if (item.type == 4 && item.lotteryProduct == -1) {
        //如果“抽奖记录ID”大于0且为抽奖充值记录，则变更相应抽奖记录为“已使用”状态，增加抽奖机会、并将“抽奖记录ID”清零——抽奖操作
        that.setAwardAboutRecordUsed(item.id);
      } else {
        that.setData({
          ["curSelOperateAwardItem"]: item,
        })

        let minuteCnt = 0, cashback_price=0.00;
        if (Utils.isNotNull(item.duration) && Utils.myTrim(item.duration + "") != "null") {
          try {
            minuteCnt = parseInt(item.duration);
            minuteCnt = isNaN(minuteCnt) ? 0 : minuteCnt;
          } catch (err) { }
        }
        if (Utils.isNotNull(item.cashback_price) && Utils.myTrim(item.cashback_price + "") != "null") {
          try {
            cashback_price = parseFloat(item.cashback_price);
            cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
          } catch (err) { }
        }
        that.gotoCheirapsisPage(item.id, minuteCnt, cashback_price, pfTag);
      }
    } else {
      wx.showToast({
        title: "无法获取信息！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //方法：获取余额结果处理函数
  dowithGetMyRemainingSum: function (dataList, tag, errorInfo) {
    let that = this;
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        console.log("获取余额结果：");
        console.log(dataList);
        let remainingSum = 0.00;
        if (dataList != null && dataList != undefined && dataList.length > 0) {
          var mainData = dataList;
          if (mainData.surplusMoney != null && mainData.surplusMoney != undefined) {
            try {
              remainingSum = parseFloat(mainData.surplusMoney);
              remainingSum = isNaN(remainingSum) ? 0 : remainingSum;
            } catch (e) { }
          }
          remainingSum = Utils.roundFixed(remainingSum, 2);
        }
        console.log("我的余额：" + remainingSum)
        that.setData({
          ["remainingSum"]: remainingSum,
        });
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取余额信息失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：确定充值
  submitPayInfo: function (e) {
    var that = this, rechargeProductId = that.data.rechargeProductId, rechargeSum = that.data.rechargeSum;
    console.log("按钮确定充值。。。");
    if (isDowithing) {
      wx.showToast({
        title: "支付进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    // if (rechargeSum <= 0) {
    //   wx.showToast({
    //     title: "充值金额必须大于0！",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    isDowithing = true;
    //插入充值支付记录
    that.insertAwardAboutRecord(rechargeProductId, rechargeSum);
    //that.getPrePayId();
  },
  /////////////////////////////////////////////////////
  //----充值-------------------------------------------
  //方法：获取预支付ID
  getPrePayId: function (recordId) {
    var that = this, attach = "14_0_" + app.data.hotelId + "_3," + recordId, rechargeSum = that.data.rechargeSum, productDetail = payForType==0?app.data.sysName+"抽奖机会":app.data.sysName+"按摩服务";
    //体验版特别处理
    if (Utils.myTrim(app.data.version) != "online") {
      rechargeSum = 0.01;
    }
    app.getPrePayId0(that, attach, rechargeSum, productDetail);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    isDowithing = false;
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        that.setData({
          ["ReChargePop"]: false,
        })
        that.data.isRecharge = true;
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;

        console.log("支付发起成功！")
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //事件：支付按摩
  payforCheirapsis: function (e) {
    let that = this, item = null, amount = 0.00, min = 0;
    that.setData({
      ["isShowESPricePop"]: false,
    })
    app.setCacheValue(app.data.wxAppId + "-" + app.data.version + "-isShowESPricePop-" + "tag", 1);
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      let min = 0, amount = 0.00;
      try {
        min = parseInt(item.duration);
        min = isNaN(min) ? 0 : min;
      } catch (e) { }
      try {
        amount = parseFloat(item.price);
        amount = isNaN(amount) ? 0.00 : amount;
      } catch (e) { }
      amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt));
      if(amount>0){
        //1、如果为付费按摩
        if (app.data.spareCheirapsisCnt > 0) {
          wx.showModal({
            title: '提示',
            content: payMordeAlert,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  ["curSelRechargeItem"]: item,
                })

                if (app.data.isCheckDeviceForPay) {
                  that.data.cb51StartTag = 3;
                  that.getDeviceInfo("", app.data.agentDeviceId, 1);
                } else {
                  let curSelRechargeItem = that.data.curSelRechargeItem;
                  if (Utils.isNotNull(curSelRechargeItem)) {
                    payForType = 1;
                    that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
                  } else {
                    wx.showToast({
                      title: "请选择按摩时间选项！",
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          that.setData({
            ["curSelRechargeItem"]: item,
          })

          if (app.data.isCheckDeviceForPay) {
            that.data.cb51StartTag = 3;
            that.getDeviceInfo("", app.data.agentDeviceId, 1);
          } else {
            let curSelRechargeItem = that.data.curSelRechargeItem;
            if (Utils.isNotNull(curSelRechargeItem)) {
              payForType = 1;
              that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
            } else {
              wx.showToast({
                title: "请选择按摩时间选项！",
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      }else{
        //2、如果为免费按摩
        wx.showModal({
          title: '提示',
          content: "是否立即按摩？",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                ["curSelRechargeItem"]: item,
              })

              if (app.data.isCheckDeviceForPay) {
                that.data.cb51StartTag = 3;
                that.getDeviceInfo("", app.data.agentDeviceId, 1);
              } else {
                let curSelRechargeItem = that.data.curSelRechargeItem;
                if (Utils.isNotNull(curSelRechargeItem)) {
                  payForType = 1;
                  that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
                } else {
                  wx.showToast({
                    title: "请选择按摩时间选项！",
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      
    } else {
      wx.showToast({
        title: "获取信息失败无法体验！",
        icon: 'none',
        duration: 1500
      })
    }
  },

  //事件：跳转按摩器使用页面
  gotoCheirapsisPage: function (id, mincnt, cashback_price,isPayfor) {
    let that = this, url = "";
    let allCash=cashback_price,idlist=id,pf=isPayfor;
    allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
    idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
    pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
    url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&id=" + id + "&mcnt=" + mincnt + "&did=" + app.data.agentDeviceId + "&sqy=1&cash=" + allCash+"&pf="+pf;
    //按摩记录信息记载
    app.data.operateRecordItem={id:id,mincnt:mincnt,cash:allCash,pf:pf,tag:0,idlist:idlist}
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
  //事件：返回按摩使用界面
  returnCheirapsisPage: function () {
    let that = this, url = "";
    url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?did=" + app.data.agentDeviceId;
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
  //事件：浏览商品详情
  viewProductDetail: function (e) {
    let that = this, deviceProductPid = that.data.deviceProductPid, url = "";
    if (deviceProductPid > 0) {
      that.data.isForbidRefresh = true;
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + deviceProductPid;
      console.log("viewProductDetail:" + url)
      wx.navigateTo({
        url: url
      });
    }
  },
  //事件：扫码跳转事件
  onScanOnIndex: function (e) {
    let that = this, deviceId = 0, deviceBlueAddress = "";
    try {
      deviceId = parseInt(e.detail.did);
      deviceId = isNaN(deviceId) ? 0 : deviceId;
    } catch (e) { }
    try {
      deviceBlueAddress = Utils.myTrim(decodeURIComponent(e.detail.daddr));
    } catch (e) { }

    app.data.agentDeviceId = deviceId;
    that.setData({
      ["agentDeviceId"]: deviceId,
    })
    if (deviceId > 0 && app.data.agentDeviceStatus==0) {
      that.data.isLoadMainData = true;
      that.zhuanpan = that.selectComponent("#zhuanpan");
      if (app.data.communicationType == 0) {
        app.checkBluetoothState();
      }
      that.getDefaultMainInfo(false);
    } else {
      let url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&blueaddr=" + encodeURIComponent(deviceBlueAddress);
      console.log("gotoNextPage:" + url);
      wx.navigateTo({
        url: url
      });
    }
  },
  //事件：跳转页面
  gotoPage: function (e) {
    //pagetype：0普通页面，1tabbar页面
    //package：包名简写
    //pagename：页面名称
    let that = this, pagetype = 0, isCheckAuditStat = 0, packageName = e.currentTarget.dataset.package, pagename = e.currentTarget.dataset.page, url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) { }

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },
  //事件：切换设备
  gotoScanCodePage: function () {
    let that = this, url = "";
    url = mainPackageUrl + "/scanCode/scanCode?login=0";
    console.log("exchangeDeviceEvent:" + url);
    wx.redirectTo({
      url: url
    });
  },


  ////////////////////////////////////////////////////////////////////////////////////
  //----------九宫格抽奖相关-----------------------------------------------------------
  //方法：装饰星星闪烁效果
  setStarRingEffect: function () {
    let _this = this;
    //圆点设置
    let leftCircle = 40;
    let topCircle = 40;
    let starRingList = [];
    for (let i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 40;
        leftCircle = 40;
      } else if (i < 6) {
        topCircle = 40;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 40;
        leftCircle = 630;
      } else if (i < 12) {
        topCircle = topCircle + 84;
        leftCircle = 630;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 630;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 40;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 40;
      } else {
        return
      }
      starRingList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      starRingList: starRingList
    })
    //圆点闪烁
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FEFEFE',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FEFEFE',
        })
      }
    }, 500)
  },
  //事件：开始九宫格抽奖
  startLotteryDraw: function (e) {
    let that = this, chanceTimes = that.data.chanceTimes, isLotteryDrawing = that.data.isLotteryDrawing;
    if (isLotteryDrawing) {
      wx.showToast({
        title: "抽奖进行中...",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (chanceTimes <= 0) {
      if (that.data.isPayforLotteryDraw){
        wx.showModal({
          title: '提示',
          content: "支付" + app.data.continueDrawAwardAmount + "元，再抽一次？",
          success(res) {
            if (res.confirm) {
              payForType = 0;
              that.showReChargePop(0, 0, app.data.continueDrawAwardAmount, 0, "支付" + app.data.continueDrawAwardAmount + "元，再抽一次")
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: "对不起，今日抽奖机会已用尽，欢迎明天再来！",
          showCancel:false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else {
      let rechargeRecordId = that.data.rechargeRecordId, rechargeItem = that.data.rechargeItem;
      if (rechargeRecordId > 0 && Utils.isNotNull(rechargeItem) && rechargeItem.type == 4) {
        //如果“抽奖记录ID”大于0且为抽奖充值记录，则变更相应抽奖记录为“已使用”状态，增加抽奖机会、并将“抽奖记录ID”清零——抽奖操作
        that.setAwardAboutRecordUsed(rechargeItem.id);
      }else{
        havePlayed = 1;
        if (that.data.mainbgcss == "") {
          that.setData({
            mainbgcss: "solidfix"
          })
        }
        that.calculateAwardDataInfo();
      }
    }
  },
  //方法：开始准备抽奖
  readToStartLotteryDraw(potion) {
    let that = this;
    that.setData({
      ["luckPosition"]: potion,
      ["btnconfirm"]: DataURL + '/images/amy-cenpo.png',
      ["isLotteryDrawing"]: true,
    })

    //清空计时器
    clearInterval(interval);
    let index = 0;
    //循环设置每一项的透明度(当前项设置不透明，前一项设置为半透明，之后项序号加一继续循环)
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        that.data.color[7] = 0.7
      } else if (index != 0) {
        that.data.color[index - 1] = 0.7
      }
      that.data.color[index] = 1
      that.setData({
        color: that.data.color,
      })
      index++;
    }, intime);

    //结束循环操作
    let stoptime = 2000;
    setTimeout(function () {
      that.readStopLotteryDraw(that.data.luckPosition);
    }, stoptime)
  },

  // 也可以写成点击按钮停止抽奖
  clickStop: function () {
    let that = this;
    let stoptime = 2000;
    setTimeout(function () {
      that.readStopLotteryDraw(1);
    }, stoptime)
  },
  //方法：准备停止抽奖操作
  readStopLotteryDraw: function (which) {
    let that = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    let current = -1;
    let color = that.data.color;
    for (let i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    let index = current + 1;

    that.stopLotteryDraw(which, index, intime, 100);
    // setTimeout(function () {
    //   that.moveItemPostion(which);
    // }, 2000);
  },


  //方法：停止抽奖动作
  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLotteryDraw: function (which, index, time, splittime) {
    let that = this;
    //值越大出现中奖结果后减速时间越长
    let color = that.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        color[7] = 0.7
      } else if (index != 0) {
        color[index - 1] = 0.7
      }
      //当前位置为选中状态
      color[index] = 1
      that.setData({
        color: color,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        that.stopLotteryDraw(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          that.getAwardResult(which);
        }, 1000);
      }
    }, time);
  },
  //方法：处理中奖结果
  getAwardResult(which) {
    let that = this, curItem = that.data.curItem;

    var sDHide = "", fDHide = "hide";
    if (getGrade == 0) {
      sDHide = "hide"; fDHide = "";
    }
    that.setData({
      ["rechargeRecordId"]: 0,
      ["rechargeItem"]: null,

      ["btnconfirm"]: DataURL + '/images/amy-centp.png',
      ["isLotteryDrawing"]: false,
    })
    //抽奖次数递减并记录
    let chanceTimes = that.data.chanceTimes;
    chanceTimes = chanceTimes > 0 ? chanceTimes - 1 : 0;
    that.setFreeDrawTimeCnt(chanceTimes);

    if (Utils.isNotNull(curItem) && curItem.type != 0) {
      //有奖项
      //如果奖项带优惠券则领取优惠券
      if (curItem.mallCouponsId > 0) {
        that.receivePersonCoupons(curItem.mallCouponsId, curItem.id);
      }

      that.setData({
        mainbgcss: "",
        showModalwinning: true,
      })
    } else {
      //没有奖项
      if (chanceTimes <= 0) {
        //如果已经没有抽奖机会则引导支付消费
        wx.showModal({
          title: '提示',
          content: "很遗憾你的抽奖次数用完了，支付" + app.data.continueDrawAwardAmount + "元，再抽一次？",
          success(res) {
            if (res.confirm) {
              payForType=0;
              that.showReChargePop(0, 0, app.data.continueDrawAwardAmount, 0, "支付" + app.data.continueDrawAwardAmount + "元，再抽一次")
              console.log('用户点击确定')
              // that.moveItemPostion(which);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '很遗憾，你没有抽中奖项！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // that.moveItemPostion(which);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  //进入页面时缓慢切换
  moveItemPostion: function (which) {
    let that = this;
    let index = which;
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        that.data.color[7] = 0.7
      } else if (index != 0) {
        that.data.color[index - 1] = 0.7
      }
      that.data.color[index] = 1
      that.setData({
        color: that.data.color,
      })
      index++;
    }, 1000);
  },
  //说明显示/隐藏
  onchangeExplain() {
    this.setData({
      explaintype: !this.data.explaintype
    })
  },

  //方法：获取抽奖机会
  getAwardChances: function (isRecharge) {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=getPrizeCount&activityId=" + luckdraw_id + "&companyId=" + app.data.companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("抽奖机会获取结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data, chanceTimes = 0;
          if (Utils.isNotNull(mainData.resultMap)) {
            if (Utils.isNotNull(mainData.resultMap.lotteryNum) && Utils.myTrim(mainData.resultMap.lotteryNum + "") != "null") {
              try {
                chanceTimes = parseInt(mainData.resultMap.lotteryNum);
                chanceTimes = isNaN(chanceTimes) ? 0 : chanceTimes;
              } catch (err) { }
            }
          }
          if (chanceTimes > 0 && Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
            let dtNowStr = Utils.myTrim(Utils.getDateTimeStr3((new Date()), "-", 1)), createDate = "", dtDate = new Date(), finishedCnt = 0;
            for (let i = 0; i < mainData.dataList.length; i++) {
              createDate = "";
              if (Utils.isNotNull(mainData.dataList[i].crateTime)) {
                try {
                  dtDate = new Date(Date.parse((mainData.dataList[i].crateTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtDate = new Date();
                }
                createDate = Utils.myTrim(Utils.getDateTimeStr3(dtDate, "-", 1));
                if (dtNowStr == createDate) finishedCnt++;
              }
            }
            chanceTimes = chanceTimes >= finishedCnt ? chanceTimes - finishedCnt : 0;
          }

          that.setData({
            ["chanceTimes"]: chanceTimes,
          })
          console.log("抽奖机会："+chanceTimes)
          that.getDrawAwardDataList(isRecharge);
        } else {
          app.setErrorMsg(that, "抽奖机会获取失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam);
          that.getDrawAwardDataList(isRecharge);
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "抽奖机会获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        that.getDrawAwardDataList(isRecharge);
      }
    })
  },

  //////////////////////////////////////////////////////////////////////////////////
  //------------获取设备地址---------------------------------------------------------
  //方法：分析蓝牙地址
  getDeviceInfo: function (deviceBlueAddress, deviceId, tag) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;

    if (tag == 0) {
      otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceBlueAddress);
    } else {
      otherParamCon += "&id=" + deviceId;
    }

    otherParamCon += "&pageSize=99&pageIndex=1";
    app.getDeviceList(that, otherParamCon);
  },
  //方法：获取设备结果处理函数
  dowithGetDeviceList: function (dataList, tag, errorInfo) {
    let that = this, deviceId = 0, deviceCompanyId = app.data.agentCompanyId, deviceGprsAddress = app.data.agentDeviceAddress, address = "", status = 1, dtNowStr = "", dtDeviceStr = "", isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date(), userId = 0, isDeviceUsing = false,isDeviceOtherUsing=true;
    switch (tag) {
      case 1:
        console.log("获取设备结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let dataItem = dataList.dataList[0];
          deviceId = dataItem.id;
          try {
            userId = parseInt(dataItem.userId);
            userId = isNaN(userId) ? 0 : userId;
          } catch (e) { }
          isUsed = Utils.isNull(dataItem.isUsed) ? "00" : dataItem.isUsed;
          if (Utils.myTrim(isUsed) != "") {
            time = parseInt(isUsed, 16); //16进制转10进制
          }
          dataUpdateTime = Utils.isNull(dataItem.dataUpdateTime) ? "" : dataItem.dataUpdateTime;
          try {
            dtUpdate = new Date(dataUpdateTime.replace(/\-/g, "/"));
          } catch (e) { }
          //判断当前设备是否被其他人所用
          if (userId == app.globalData.userInfo.userId || time <= 0) {
            //没有被用——
            //1、使用者是自己；
            //2、剩余时间为0;
            isDeviceOtherUsing = false;
          } else if(userId != app.globalData.userInfo.userId && time>0){
            //3、如果设备超过指定秒数没有更新“dataUpdateTime”则判定为没有被用
            dataUpdateTime = Utils.isNull(dataItem.dataUpdateTime) ? "" : dataItem.dataUpdateTime;
            try {
              interval = Utils.getTimeInterval(dtUpdate, (new Date()), 0);
              //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
              if (interval >= (app.data.isUsedInterval * 1000)) {
                //设备已经在用
                isDeviceOtherUsing = false;
              }
            } catch (e) { }
          }
          //判断当前设备是否为当前用户所用
          if (!isDeviceOtherUsing && userId == app.globalData.userInfo.userId && time > 0) {
            dtNowStr = Utils.myTrim(Utils.getDateTimeStr((new Date()), "-", false));
            dtDeviceStr = Utils.myTrim(Utils.getDateTimeStr(dtUpdate, "-", false));
            isDeviceUsing = dtNowStr == dtDeviceStr?true:isDeviceUsing;
          }
          if (Utils.isNotNull(dataItem.status)) {
            try {
              status = parseInt(dataItem.status);
              status = isNaN(status) ? 1 : status;
            } catch (e) { }
          }
          //0已经绑定1解绑
          if (status == 0) {
            if (Utils.isNotNull(dataItem.companyId) && Utils.myTrim(dataItem.companyId + "") != "null") {
              try {
                deviceCompanyId = parseInt(dataItem.companyId);
                deviceCompanyId = isNaN(deviceCompanyId) ? 0 : deviceCompanyId;
              } catch (e) { }
            }
            address = Utils.isNotNull(dataItem.address) ? dataItem.address : "";
            
            app.data.agentCompanyId = deviceCompanyId;
            app.data.agentPutAddress = address;
          }
          app.data.agentDeviceId = deviceId;
          app.data.agentDeviceStatus = status;
          if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress + "") != "null") {
            deviceGprsAddress = Utils.myTrim(dataItem.deviceAddress);
          }
          app.data.agentDeviceAddress=deviceGprsAddress;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
        break;
    }
    if (that.data.cb51StartTag==3){
      that.data.cb51StartTag = 0;
      if (isDeviceOtherUsing) {
        wx.showModal({
          title: '提示',
          content: '该设备目前为在用状态，是否切换设备？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.gotoScanCodePage();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        let curSelRechargeItem = that.data.curSelRechargeItem;
        if (Utils.isNotNull(curSelRechargeItem)) {
          let min = 0, amount = 0.00;
          try {
            min = parseInt(curSelRechargeItem.duration);
            min = isNaN(min) ? 0 : min;
          } catch (e) { }
          try {
            amount = parseFloat(curSelRechargeItem.price);
            amount = isNaN(amount) ? 0.00 : amount;
          } catch (e) { }
          amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt));
          that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
        } else {
          wx.showToast({
            title: "请选择按摩时间选项！",
            icon: 'none',
            duration: 2000
          })
        }
      }
    }else{
      that.setData({
        ["agentDeviceId"]: deviceId,
        ["agentDeviceStatus"]: app.data.agentDeviceStatus,
        ["isDeviceUsing"]: isDeviceUsing,
      })
      timeOutGetPCheirapsisProductList = setTimeout(that.getPayCheirapsisProductList, 300);
    }
  },

  //////////////////////////////////////////////////////////////////////////////////
  //------------设备操控---------------------------------------------------------
  //4G模块控制
  //方法：4G指令发送方法
  //设备地址address  各种模式cmd  cmd对应的指令controlCmdType  时间time
  //isPushQueue:是否将指令插入队列
  sendDeviceCommand: function (address, cmd, controlCmdType, time, isPushQueue, num) {
    let that = this;

    // if (Utils.isNull(timeInternelQueryDevice)) {
    //   that.syncDeviceTimeInterval();
    // }
    app.sendDeviceCommandWebSocket(that, address, cmd, controlCmdType, time, isPushQueue, num)
  },
  //方法：获取同步设备状态
  //参数：
  //otherConParams：查询条件
  //tag：3支付检查在用，4使用抽奖按摩
  getSyncDeviceStatusInfo: function (address, tag) {
    let that = this, otherConParams = "&deviceAddress=" + address;
    app.getSyncDeviceStatusInfo(that, otherConParams, tag);
  },
  //方法：获取同步设备状态信息结果处理函数
  dowithGetSyncDeviceStatusInfo: function (dataList, tag, operateTag, errorInfo) {
    let that = this, workStat = that.data.workStat;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取同步设备状态信息结果");
        console.log(dataList)
        let data = dataList;
        switch (operateTag) {
          //【3】如果为支付
          case 3:
            if (data.isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，请在设备用完或空闲时支付！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              let curSelRechargeItem = that.data.curSelRechargeItem;
              if (Utils.isNotNull(curSelRechargeItem)) {
                let min = 0, amount = 0.00;
                try {
                  min = parseInt(curSelRechargeItem.duration);
                  min = isNaN(min) ? 0 : min;
                } catch (e) { }
                try {
                  amount = parseFloat(curSelRechargeItem.price);
                  amount = isNaN(amount) ? 0.00 : amount;
                } catch (e) { }
                amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt));
                payForType = 1;
                that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
              } else {
                wx.showToast({
                  title: "请选择按摩时间选项！",
                  icon: 'none',
                  duration: 2000
                })
              }
            }
            break;
          //【4】如果为使用抽奖按摩
          case 4:
            if (data.isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，请在设备用完或空闲时使用！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              let item = that.data.curSelOperateAwardItem, minuteCnt = 0, cashback_price = 0.00,pfTag=0;
              if (Utils.isNotNull(item.duration) && Utils.myTrim(item.duration + "") != "null") {
                try {
                  minuteCnt = parseInt(item.duration);
                  minuteCnt = isNaN(minuteCnt) ? 0 : minuteCnt;
                } catch (err) { }
              }
              if (Utils.isNotNull(item.cashback_price) && Utils.myTrim(item.cashback_price + "") != "null") {
                try {
                  cashback_price = parseFloat(item.cashback_price);
                  cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
                } catch (err) { }
              }
              pfTag = Utils.isNotNull(item) && item.type == 2 && item.payStatus==1?1:0;
              that.gotoCheirapsisPage(item.id, minuteCnt, cashback_price, pfTag);
            }
            break;
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "同步失败！";
        break;
    }
  },

  onchangeroof() {
    this.setData({
      roof: !this.data.roof
    })
  },
  changeball(e) {
    this.setData({
      ball: !this.data.ball,
    })
  },
  changeba(e) {
    if (e.changedTouches[0].clientX > 200) {
      this.setData({
        ball: !this.data.ball,
        scrollX: 400,
        scrollY: e.changedTouches[0].clientY - 45
      })
    } else {
      this.setData({
        ball: !this.data.ball,
        scrollX: 0,
        scrollY: e.changedTouches[0].clientY - 45
      })
    }
  },
  //方法：计算倒计时
  computeDownTime: function (dtEnd){
    let that = this, remainTime=0;//getTimesByDateTime
    
    try{
      remainTime = Utils.getTimesByDateTime(new Date(),dtEnd,3);
      if (remainTime>0){
        that.setData({
          ["remainTime"]: remainTime,
          ["isShowESPricePop"]: that.isCloseESPricePop()?false:true,
        })
        that.startCountdown();
      }
    }catch(e){}
  },
  // 开始倒计时
  startCountdown: function () {
    var that = this
    if (Utils.isNotNull(internalDownTime)) clearInterval(internalDownTime);
    internalDownTime = setInterval(function () {
      var time = that.data.remainTime - 1;
      that.setData({
        ["remainTime"]: time,
      })
      if (time > 0) {
        that.transformRemainTime(that.data.remainTime);
      } else {
        that.setData({
          ["isShowESPricePop"]: false,
        })
        clearInterval(internalDownTime);
        that.getPayCheirapsisProductList();
      }
    }, 1000);
  },
  //时间转换时分秒
  transformRemainTime: function (time) {
    let that = this;
    let sumSeconds = parseInt(time);
    let hours = parseInt(sumSeconds / 60 / 60);
    let minutes = parseInt(sumSeconds / 60 % 60);
    let seconds = parseInt(sumSeconds % 60);

    let days=parseInt(hours/24);
    let dayshours=parseInt(hours%24);
    
    that.setData({
      ["remainTimeHours"]: hours >= 10 ? hours : "0" + hours,
      ["remainTimeMinutes"]: minutes >= 10 ? minutes : (minutes <= 0 ? minutes : "0" + minutes),
      ["remainTimeSeconds"]: seconds >= 10 ? seconds : "0" + seconds,

      ["remainTimeDays"]:days,
      ["remainTimeDayHours"]:dayshours>=10?dayshours:"0"+dayshours,
    })
  },
  //事件：显示特价弹窗
  showESPricePop:function(e){
    let that=this;
    that.setData({
      ["isShowESPricePop"]: true,
    })
  },
  //事件：隐藏特价弹窗
  hideESPricePop:function(e){
    let that = this;
    that.setData({
      ["isShowESPricePop"]: false,
    })
    app.setCacheValue(app.data.wxAppId + "-" + app.data.version + "-isShowESPricePop-" + "tag",1);
  },
  isCloseESPricePop:function(){
    let that=this,tag=0;
    try{
      let tagObj = app.getCacheValue(app.data.wxAppId + "-" + app.data.version +"-isShowESPricePop-"+"tag");
      if (Utils.isNotNull(tagObj)){
        tag=parseInt(tagObj);
        tag=isNaN(tag)?0:tag;
      }
    }catch(e){}
    return tag==1?true:false;
  },
  //定时器 同步时间
  syncDeviceTimeInterval: function () {
    var that = this, i = 0;
    timeInternelQueryDevice = setInterval(function () {
      if (i == 0) {
        i++;
        //如果有指令未处理则进行重发处理
        let socketMsgQueue = that.data.socketMsgQueue, internalCnt = 0, dtNow = new Date();
        if (Utils.isNotNull(socketMsgQueue) && socketMsgQueue.length > 0) {
          let allLen = socketMsgQueue.length - 1;
          //倒叙处理，便于删除数组元素
          for (let i = allLen; i >= 0; i--) {
            //重试超过5次的指令不再执行
            if (socketMsgQueue[i].reTryCnt > 3) {
              socketMsgQueue.splice(i, 1);
              console.log("指令队列操作：删除重试次数超过5次的指令(" + socketMsgQueue.length + ")")
              wx.hideLoading();
              wx.showToast({
                title: "设备连接异常，无法操作！",
                icon: 'none',
                duration: 2000
              })
            } else {
              internalCnt = Utils.getTimesByDateTime(socketMsgQueue[i].dateTime, dtNow, 3);
              if (internalCnt > 3) {
                socketMsgQueue[i].reTryCnt = socketMsgQueue[i].reTryCnt + 1;
                console.log("指令队列操作：重试失败指令(" + socketMsgQueue.length + ")——")
                console.log(socketMsgQueue[i])
                that.sendDeviceCommand(app.data.agentDeviceAddress, socketMsgQueue[i].cmdObj.cmd, socketMsgQueue[i].cmdObj.cmdType, socketMsgQueue[i].time, false, socketMsgQueue[i].cmdObj.num);
              }
            }
          }
          that.data.socketMsgQueue = socketMsgQueue;
        }

        i = i >= frequentness ? 0 : i;
      } else {
        i++;
        i = i >= frequentness ? 0 : i;
        //LOGUtils.logI("No Work..." + that.data.allSecnds)
      }
    }, 1000 * 1);
  },
  //事件：隐藏按摩提示弹窗
  hideCheirapsisAlertPop:function(e){
    let that=this;
    app.data.isShowHomeCheirapsisAlert=false;
    that.setData({
      ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,
    })
  },
  //事件：确定按摩提示弹窗
  sureCheirapsisAlert:function(e){
    let that = this, url = "";
    app.data.isShowHomeCheirapsisAlert=false;
    url = packYKPageUrl + "/Myprize/Myprize";
    console.log("sureCheirapsisAlert:" + url);
    wx.navigateTo({
      url: url
    });
  },
})

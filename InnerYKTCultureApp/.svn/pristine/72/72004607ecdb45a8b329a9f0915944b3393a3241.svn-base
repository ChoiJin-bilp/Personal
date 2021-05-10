// pages/hoteldetails/hoteldetails.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl, OURL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, UploadURL = app.getUrlAndKey.uploadUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, mQRType = app.data.mQRType, stockAlert = "对不起，该房型房量不足！";
var defaultItemImgSrc = DataURL + app.data.defaultImg, homePageUrl = "../../../" + app.data.sysMainPage, packOtherPageUrl = "../../../packageOther/pages", packTempPageUrl = "../../../packageTemplate/pages", packSMPageUrl = "../../../packageSMall/pages", mainPackageUrl = "../../../pages", isDowithing = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName, //系统名称
    //是否隐藏拼团
    isHideGroup: true,
    showView: false,
    isShowGiftDetail: false,
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    isForbidRefresh: false,     //是否禁止刷新
    isOpenMerchantPlatform: false, //是否开放商户平台
    mallChannelId: 0, //渠道ID
    vtype: 0, //商品查看类别：0普通查看，1积分兑换商品查看,2代理商分享的普通客户查看代理商品，3代理商查看商品
    isNormalView: 1, //0分享查看，1正常查看
    groupBuyId: "", //拼团ID
    leaveGBCnt: 0, //拼团剩余名额
    gbMenList: [], //参与剩余名额示例列表
    shareGBIndex: 0, //分享拼团索引
    roomSellType: app.data.roomSellType,          //房间出售模式：0酒店模式，1光趣模式

    companyId: 0,
    proId: 0, //商品ID
    proSDetailId: "", //商品规格ID
    randomNum: Math.random() / 9999,
    currentData: 0, //选项卡默认第一个
    proDataInfo: null,
    selDIndex: 0,
    buyNum: 0, //购买数量
    buyAmount: 0.00,            //购买总价
    buyAmountSource: 0.00,       //购买原价总价
    buyAmountDiscount: 0.00,    //购买套装/特惠价总价
    buyAmountCoupon: 0.00,      //购买卷后价总价

    listData: [], //倒计时时间
    proFirstPhoto: "",
    shoppingCartCnt: 0, //购物车数量
    joinGroupon: false, //参团弹窗
    joinGrouponsize: false, //参团 規格弹窗
    autoplay: true,
    interval: 5000,
    duration: 1000,

    randomNum: Math.random() / 9999,

    isShowQRCode: false, //是否显示二维码弹窗
    qrShowTitle: "",
    qrShowImgSrc: "",

    isQRScene: false,

    //授权提示
    isShowAuthor: false,
    showguidance: false,

    paramShareUId: 0, //分享用户ID
    //分享修改价格
    isShowChgSharePricePop: false,
    sharePriceArrayList: [],
    receiveSharePriceList: [],
    //微信分享图片
    showsaveimage: false,
    shareWXAlert: "", //分享提示信息
    shareWXImg: DataURL + "/images/productshare01.jpg?" + (Math.random() / 9999),
    upWXSSImg: false,
    showTAWXAlert: true,
    changeAlert: false,

    couponAlertMsg: "",
    couponPopAlertMsg: '分享本商品给好友，好友可获50元优惠券!', //滚动文字
    couponCnt: 0, //优惠券张数
    pace: 1, //滚动速度
    posLeft1: 0, //水平滚动方法中left值
    isShowCPAMsg: false,

    couponData: null,

    //是否来源微信朋友圈
    isWX: 0, //0否，1是
    //拼团数据
    productOrder: null, //拼团订单数据集
    validGBCnt: 0, //有效拼团数量
    currentGroup: null, //当前所选拼团订单
    isGroup: false, //是否参加当前拼团

    //登录操作相关参数
    loginAction: 0, //0：加载信息，1：分享，2：加入购物车，3：立即购买，4：拼团
    loginATag: 0,

    //规格弹窗
    isShowProductSpecs: false, //是否显示规格弹窗

    //赠品
    giftDataInfo: null, //赠品信息


    //分销商
    distributorId: 0, //分销商ID
    currentUserId: 0,

    isMainShopCar: false, //true：商品中点击购物车或立即购买按钮打开规格弹窗，false：选择规格打开规格弹窗按钮

    ///////////////////////////////////////////////////////
    //---领劵中心------------------------------------------
    pageName: "Collarcenter", //当前页面名称
    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    selSpecOperateType: 0, //选规格操作类型：0购物车，1立即购买

    isShowCADImgAlert: false, //是否显示生成宣传图片提示
    isProhibitCADImgMsg: false, //是否禁止显示生成宣传图片提示

    dtBegin:'',                  //入住时间
    dtEnd: '',                   //退房时间
    reSelCheckInDate:false,      //是否为重新入住时段：true是 ，false否

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    
    noworder:true,
    yesorder:false,
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this, proDataInfo = that.data.proDataInfo, selProDetail = that.data.proDataInfo.productDetailList[0], shareWXImg = that.data.shareWXImg, shareAlert = that.data.shareAlert, url = "", tidParam = Utils.myTrim(that.data.groupBuyId) != "" ? "&tid=" + that.data.groupBuyId : "", channelParam = that.data.mallChannelId > 0 ? "&channelid=" + that.data.mallChannelId : "", distributorParam = that.data.distributorId > 0 ? "&distributorid=" + that.data.distributorId : "", sharePriceArrayList = that.data.sharePriceArrayList, sharePriceParam = "";
    shareAlert = Utils.myTrim(shareAlert) == "" ? selProDetail.optimalPriceName + "：" + selProDetail.optimalPrice + " " + proDataInfo.productName : shareAlert;
    if (sharePriceArrayList != null && sharePriceArrayList != undefined && sharePriceArrayList.length > 0) {
      sharePriceParam = "&sprice=" + JSON.stringify(sharePriceArrayList)
    }
    console.log(shareWXImg);
    that.setData({
      showsaveimage: false,
    })
    url = "/packageTemplate/pages/hoteldetails/hoteldetails?isnv=0&pid=" + that.data.proId + "&companyId=" + that.data.companyId + "&suid=" + appUserInfo.userId + channelParam + tidParam + distributorParam + sharePriceParam;
    console.log("房型分享：" + url)
    return {
      title: shareAlert,
      path: url,
      imageUrl: shareWXImg,
      success: (res) => { // 成功后要做的事情
        console.log("分享报价成功")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  onLoad(options) {
    let that = this;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, mallChannelId = 0, isScene = false, dOptions = null;
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
    try {
      if (sOptions.channelid != null && sOptions.channelid != undefined)
        mallChannelId = parseInt(sOptions.channelid);
      mallChannelId = isNaN(mallChannelId) ? 0 : mallChannelId;
    } catch (e) { }
    that.data.mallChannelId = mallChannelId;

    appUserInfo = app.globalData.userInfo;
    that.data.loginAction = 0;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
  //方法：检查用户登录
  //action —— 0：加载信息，1：分享，2：加入购物车，3：立即购买，4：拼团
  checkUserLoginAction(action, tag) {
    var that = this;
    that.data.loginAction = action;
    that.data.loginATag = tag;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      app.getLoginUserInfo(that);
    } else {
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
        //0：加载信息，1：分享，3：立即购买
        switch (that.data.loginAction) {
          //0：加载信息
          case 0:
            console.log("登录后加载：......");
            console.log(sOptions);

            var proId = "", companyId=0, proSDetailId = "", groupBuyId = "", vtype = 0, isQRScene = that.data.isQRScene, isNormalView = 0, isWX = 0, isShowCPAMsg = true, isShowCADImgAlert = true, distributorId = 0, currentUserId = 0, receiveSharePriceList = [], receiveSharePriceParamValue = "";

            currentUserId = appUserInfo != null && appUserInfo != undefined ? appUserInfo.userId : 0;
            try {
              if (sOptions.isWX != null && sOptions.isWX != undefined && Utils.myTrim(sOptions.isWX + "") != "") {
                isWX = parseInt(sOptions.isWX);
                isWX = isNaN(isWX) ? 0 : isWX;
              }
            } catch (e) { }
            try {
              if (sOptions.companyId != null && sOptions.companyId != undefined && Utils.myTrim(sOptions.companyId + "") != "") {
                companyId = parseInt(sOptions.companyId);
                companyId = isNaN(companyId) ? 0 : companyId;
              }
            } catch (e) { }
            companyId = companyId == 0 ? app.data.companyId : companyId;
            try {
              if (sOptions.pid != null && sOptions.pid != undefined && Utils.myTrim(sOptions.pid + "") != "") {
                proId = parseInt(sOptions.pid);
                proId = isNaN(proId) ? 0 : proId;
              }
            } catch (e) { }
            try {
              if (sOptions.distributorid != null && sOptions.distributorid != undefined && Utils.myTrim(sOptions.distributorid + "") != "") {
                distributorId = parseInt(sOptions.distributorid);
                distributorId = isNaN(distributorId) ? 0 : distributorId;
              }
            } catch (e) { }
            try {
              if (sOptions.did != null && sOptions.did != undefined && Utils.myTrim(sOptions.did + "") != "") {
                proSDetailId = Utils.myTrim(sOptions.did);
              }
            } catch (e) { }
            try {
              if (sOptions.tid != null && sOptions.tid != undefined && Utils.myTrim(sOptions.tid + "") != "") {
                groupBuyId = Utils.myTrim(sOptions.tid);
              }
            } catch (e) { }
            //商品查看类别：0普通查看，1积分兑换商品查看,2代理商分享的普通客户查看代理商品，3代理商查看商品
            try {
              if (sOptions.vtype != null && sOptions.vtype != undefined && Utils.myTrim(sOptions.vtype + "") != "") {
                vtype = parseInt(sOptions.vtype);
                vtype = isNaN(vtype) ? 0 : vtype;
              }
            } catch (e) { }
            try {
              if (sOptions.isnv != null && sOptions.isnv != undefined && Utils.myTrim(sOptions.isnv + "") != "") {
                isNormalView = parseInt(sOptions.isnv);
                isNormalView = isNaN(isNormalView) ? 1 : isNormalView;
              }
            } catch (e) { }
            //分享商品修改价格
            try {
              if (sOptions.sprice != null && sOptions.sprice != undefined && Utils.myTrim(sOptions.sprice + "") != "") {
                receiveSharePriceParamValue = Utils.myTrim(sOptions.sprice);
                if (Utils.myTrim(receiveSharePriceParamValue) != "") receiveSharePriceList = JSON.parse(receiveSharePriceParamValue);

                that.data.receiveSharePriceList = receiveSharePriceList;
              }
            } catch (e) { }

            ////0分享查看，1正常查看
            isNormalView = vtype == 1 ? 1 : isNormalView;
            isQRScene = isQRScene == false ? (that.data.paramShareUId > 0 ? true : isQRScene) : isQRScene;
            let dtShortCheckInStart = "", dtShortCheckInEnd = "";
            if (Utils.myTrim(app.data.dtCheckInStart) == "" || Utils.myTrim(app.data.dtCheckInEnd) == ""){
              let dtStartValue = new Date(), dtEndValue = new Date(), dtStart = "", dtEnd = "";
              try {
                dtEndValue = Utils.getDateTimeAddDays(dtStartValue, 1);
              } catch (e) { }
              dtStart = Utils.getDateTimeStr(dtStartValue, "-", false); dtEnd = Utils.getDateTimeStr(dtEndValue, "-", false);
              app.computeCheckInDaysCount(that, dtStart, dtEnd);
              that.setData({
                isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
                proId: proId,
                companyId: companyId,
                proSDetailId: proSDetailId,
                vtype: vtype,
                isQRScene: isQRScene,
                distributorId: distributorId,
                currentUserId: currentUserId,

                isNormalView: isNormalView,
                isWX: isWX,

                groupBuyId: groupBuyId,
                roleStatus: appUserInfo.roleStatus,
              })
            }else{
              dtShortCheckInStart = Utils.getMDStrDateByTimeStr(app.data.dtCheckInStart, false);
              dtShortCheckInEnd = Utils.getMDStrDateByTimeStr(app.data.dtCheckInEnd, false);

              that.setData({
                isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
                proId: proId,
                companyId: companyId,
                proSDetailId: proSDetailId,
                vtype: vtype,
                isQRScene: isQRScene,
                distributorId: distributorId,
                currentUserId: currentUserId,

                isNormalView: isNormalView,
                isWX: isWX,

                groupBuyId: groupBuyId,
                roleStatus: appUserInfo.roleStatus,

                dtBegin: app.data.dtCheckInStart,               //入住时间
                dtEnd: app.data.dtCheckInEnd,                   //退房时间
                dtShortCheckInStart: dtShortCheckInStart,
                dtShortCheckInEnd: dtShortCheckInEnd,
                buyNum: app.data.checkInDays,
              })
            }
            
            that.getMainDataList(proId);
            break;

          //1：分享
          case 1:
            if (appUserInfo == null || appUserInfo == undefined) {
              wx.showToast({
                title: "获取用户失败，无法操作！",
                icon: 'none',
                duration: 2000
              })
              return;
            }
            let dtStartValue = new Date(), dtEndValue = new Date(), dtStart = "", dtEnd = "";
            try {
              dtEndValue = Utils.getDateTimeAddDays(dtStartValue, 1);
            } catch (e) { }
            dtStart = Utils.getDateTimeStr(dtStartValue, "-", false); dtEnd = Utils.getDateTimeStr(dtEndValue, "-", false);
            app.computeCheckInDaysCount(that, dtStart, dtEnd);

            let shareTitle = app.data.alertSStoreProduct,proDataInfo = that.data.proDataInfo,selProDetail = that.data.proDataInfo.productDetailList[0];
            shareTitle = selProDetail.optimalPriceName + "：" + selProDetail.optimalPrice + " " + proDataInfo.productName;
            let shareWXImg = proDataInfo != null && proDataInfo != undefined && proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0 ? proDataInfo.photos[0].src : that.data.shareWXImg;
            console.log(that.data.proFirstPhoto);
            that.setData({
              isShowProductSpecs: false, //隐藏规格弹窗
              showsaveimage: true,
              shareWXAlert: shareTitle, //分享提示信息,
              shareTitle: shareTitle,
              shareWXImg: shareWXImg,
              upWXSSImg: false,
              showTAWXAlert: false,
              changeAlert: false,
            })
            break;
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
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad) {
      that.data.isLoad = true;
    } else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.setData({
            isShowProductSpecs: false,
          })
          that.getMainDataList(that.data.proId);
          isDowithing = false;
          console.log("onShow ...")
        }
        let tag=-1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        if(tag>=0){
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) {}
          let selDTStartValue = "", selDTEndValue = "";
          try {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            selDTStartValue = currPage.data.paramstart;
            selDTEndValue = currPage.data.paramend;
          } catch (err) { }
          if (Utils.myTrim(selDTStartValue) != "" && Utils.myTrim(selDTEndValue) != ""){
            app.computeCheckInDaysCount(that, selDTStartValue, selDTEndValue);
          }
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  //方法：入住时段判断及入住天数计算结果回调方法
  dowithComputeCheckInDaysCount: function (dataList, tag, errorInfo) {
    let that = this;

    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          let selDTStartKey = "dtBegin", selDTEndKey = "dtEnd", selDTNumKey ="buyNum";
          let dtShortCheckInStart = "", dtShortCheckInEnd = "";
          dtShortCheckInStart = Utils.getMDStrDateByTimeStr(dataList.dtCheckInStart, false);
          dtShortCheckInEnd = Utils.getMDStrDateByTimeStr(dataList.dtCheckInEnd, false);
          if (that.data.reSelCheckInDate){
            that.setData({
              [selDTStartKey]: dataList.dtCheckInStart,
              [selDTEndKey]: dataList.dtCheckInEnd,
              [selDTNumKey]: dataList.checkInDays,
              dtShortCheckInStart: dtShortCheckInStart,
              dtShortCheckInEnd: dtShortCheckInEnd,
            })
            that.computeItemAmount();
            that.data.reSelCheckInDate = false;
          }else{
            that.setData({
              [selDTStartKey]: dataList.dtCheckInStart,
              [selDTEndKey]: dataList.dtCheckInEnd,
              [selDTNumKey]: dataList.checkInDays,

              dtShortCheckInStart: dtShortCheckInStart,
              dtShortCheckInEnd: dtShortCheckInEnd,
            })
          }
        }
        break;
    }
  },
  //获取商品详情
  getMainDataList: function (id) {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "", idParam = "&id=" + id, ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + that.data.companyId, vtypeParam = that.data.vtype == 0 ? "" : "&isScore=1", channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "", sortParam = that.data.vtype == 1 ? "&sField=score&sOrder=asc" : "&sField=price&sOrder=asc", detailOrderParam = that.data.vtype == 1 ? "&sDetail=score,updateDate" : "&sDetail=price,updateDate", statParam = "&status=0,1";
    urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + idParam + ifOMPParam + channelParam + sortParam + detailOrderParam + "&userId=" + appUserInfo.userId + statParam + "&pSize=10&pIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined && res.data.data.length > 0) {
            var dataItem = res.data.data[0], videoList = [], vtype = that.data.vtype, receiveSharePriceList = that.data.receiveSharePriceList, isSChgPrice = false, proHeadPhotoList=[];
            var productId = id, pid = 0, mold = 0, groupmold = 0, groupMoney = 0.00, photos = [], photosTemp = [], introductionImgs = [], productDetailList = [], remark = "", supplier = "", photoUrl = defaultItemImgSrc, qrSrc = "", proFirstPhoto = defaultItemImgSrc, isSetFirstPhoto = false, giftId = "", giftName = "", gphotos = defaultItemImgSrc, selDIndex = 0, proSDetailId = that.data.proSDetailId, coupondist = 0.00, commission = 0.00;
            var productName = "", paroductNo = "", photosString = "", shopId = 0, shopLogo = DataURL + "/images/zz.png", shopType = "自营", shopName = "", productDetailId = "", status = 0, specPhotos = [], attributeOne = "", attributeTwo = "", sourcePrice = 0.00, sellPrice = 0.00, channelPrice = 0.00, sellScore = 0, dScore = 0, shelfStatus = 0, dShelfStatus = 0, detailPhoto = [], isHavePhoto = false, discountPrice = 0.00, couponMold = 0, couponfull = 0.00, couponpriceDecrement = 0.00, couponPrice = 0.00, isShowPrice1 = false, isShowPrice2 = false, isShowPrice3 = false, discountType = 0, stock = 0, strStock = "", couponsList = [], conponDataItem = null, conponDataList = null, deposit = 0.00, presellstatus = 0, presellEndDate = "", finalPayMentStartDate = "", finalPayMentEndDate = "", peDate = null, fsDate = null, feDate = null, optimalPrice = 0.00, optimalPriceName = "现价", sofeNum = 0, sn = 0, isCouponPrice = false, minprice=0.00;
            let area = "", window = "", bed = "", smoking = "", wifi = "", numFloor = "", cast = "", conveniences = "", bathroom = "", media = "", foodAndDrink = "", rulesOfuse="";
            let dtNow=new Date(), group_purchase_meal_msg = [], group_purchase_photos = [], group_purchase_remind = "", group_purchase_startime = new Date(), group_purchase_startimeStr = "", group_purchase_endtime = new Date(), group_purchase_endtimeStr="",detailRemark="";
            let tag = app.data.gqValidDateHaveTime == 0 ? 1 : 0;
            productId = dataItem.id;
            shopId = dataItem.companyId;
            //酒店设施
            if (dataItem.area != null && dataItem.area != undefined && Utils.myTrim(dataItem.area + "") != "null" && Utils.myTrim(dataItem.area + "") != ""){
              try{
                area = Utils.myTrim(dataItem.area + "");
              }catch(e){}
            }
            if (dataItem.window != null && dataItem.window != undefined && Utils.myTrim(dataItem.window + "") != "null" && Utils.myTrim(dataItem.window + "") != "") {
              try {
                window = Utils.myTrim(dataItem.window + "");
              } catch (e) { }
            }
            if (dataItem.bed != null && dataItem.bed != undefined && Utils.myTrim(dataItem.bed + "") != "null" && Utils.myTrim(dataItem.bed + "") != "") {
              try {
                bed = Utils.myTrim(dataItem.bed + "");
              } catch (e) { }
            }
            if (dataItem.smoking != null && dataItem.smoking != undefined && Utils.myTrim(dataItem.smoking + "") != "null" && Utils.myTrim(dataItem.smoking + "") != "") {
              try {
                smoking = Utils.myTrim(dataItem.smoking + "");
              } catch (e) { }
            }
            if (dataItem.wifi != null && dataItem.wifi != undefined && Utils.myTrim(dataItem.wifi + "") != "null" && Utils.myTrim(dataItem.wifi + "") != "") {
              try {
                wifi = Utils.myTrim(dataItem.wifi + "");
              } catch (e) { }
            }
            if (dataItem.numFloor != null && dataItem.numFloor != undefined && Utils.myTrim(dataItem.numFloor + "") != "null" && Utils.myTrim(dataItem.numFloor + "") != "") {
              try {
                numFloor = Utils.myTrim(dataItem.numFloor + "");
              } catch (e) { }
            }
            //cast = "", conveniences = "", bathroom = "", media = "", foodAndDrink = "", rulesOfuse="";
            if (dataItem.cast != null && dataItem.cast != undefined && Utils.myTrim(dataItem.cast + "") != "null" && Utils.myTrim(dataItem.cast + "") != "")
              cast = dataItem.cast;
            if (dataItem.conveniences != null && dataItem.conveniences != undefined && Utils.myTrim(dataItem.conveniences + "") != "null" && Utils.myTrim(dataItem.conveniences + "") != "")
              conveniences = dataItem.conveniences;
            if (dataItem.bathroom != null && dataItem.bathroom != undefined && Utils.myTrim(dataItem.bathroom + "") != "null" && Utils.myTrim(dataItem.bathroom + "") != "")
              bathroom = dataItem.bathroom;
            if (dataItem.media != null && dataItem.media != undefined && Utils.myTrim(dataItem.media + "") != "null" && Utils.myTrim(dataItem.media + "") != "")
              media = dataItem.media;
            if (dataItem.foodAndDrink != null && dataItem.foodAndDrink != undefined && Utils.myTrim(dataItem.foodAndDrink + "") != "null" && Utils.myTrim(dataItem.foodAndDrink + "") != "")
              foodAndDrink = dataItem.foodAndDrink;
            if (dataItem.rulesOfuse != null && dataItem.rulesOfuse != undefined && Utils.myTrim(dataItem.rulesOfuse + "") != "null" && Utils.myTrim(dataItem.rulesOfuse + "") != "")
              rulesOfuse = dataItem.rulesOfuse;
            
            if (dataItem.pid != null && dataItem.pid != undefined && Utils.myTrim(dataItem.pid + "") != "") {
              try {
                pid = parseInt(dataItem.pid);
                pid = isNaN(pid) ? 0 : pid;
              } catch (err) { }
            }
            //预售信息
            if (dataItem.presellstatus != null && dataItem.presellstatus != undefined && Utils.myTrim(dataItem.presellstatus + "") != "") {
              try {
                presellstatus = parseInt(dataItem.presellstatus);
                presellstatus = isNaN(presellstatus) ? 0 : presellstatus;
              } catch (err) { }
            }
            //商品标识,0一般，1热销，2特价，3新品 ，4预售，5软件定制，6软件代理 7软件定制试用 8软件代理试用
            if (dataItem.mold != null && dataItem.mold != undefined && Utils.myTrim(dataItem.mold + "") != "") {
              try {
                mold = parseInt(dataItem.mold);
                mold = isNaN(mold) ? 0 : mold;
              } catch (err) { }
            }
            mold = (mold >= 50 && mold < 60) ? 5 : ((mold >= 60 && mold < 70) ? 6 : mold);

            if (dataItem.deposit != null && dataItem.deposit != undefined && Utils.myTrim(dataItem.deposit + "") != "null") {
              try {
                deposit = parseFloat(dataItem.deposit);
                deposit = isNaN(deposit) ? 0 : deposit;
              } catch (err) { }
            }
            if (dataItem.presellEndDate != null && dataItem.presellEndDate != undefined) {
              try {
                peDate = new Date(Date.parse((dataItem.presellEndDate + "").replace(/-/g, "/")))
              } catch (e) {
                peDate = new Date();
              }
              presellEndDate = Utils.getDateTimeStr3(peDate, "-", 0);
            }
            if (dataItem.finalPayMentStartDate != null && dataItem.finalPayMentStartDate != undefined) {
              try {
                fsDate = new Date(Date.parse((dataItem.finalPayMentStartDate + "").replace(/-/g, "/")))
              } catch (e) {
                fsDate = new Date();
              }
              finalPayMentStartDate = Utils.getDateTimeStr3(fsDate, "-", 100);
            }
            if (dataItem.finalPayMentEndDate != null && dataItem.finalPayMentEndDate != undefined) {
              try {
                feDate = new Date(Date.parse((dataItem.finalPayMentEndDate + "").replace(/-/g, "/")))
              } catch (e) {
                feDate = new Date();
              }
              finalPayMentEndDate = Utils.getDateTimeStr3(feDate, "-", 100);
            }

            //最大两张优惠券
            if (dataItem.coupons != null && dataItem.coupons != undefined && dataItem.coupons.length > 0) {
              for (var j = 0; j < dataItem.coupons.length; j++) {
                conponDataItem = null;
                conponDataItem = dataItem.coupons[j];
                conponDataList = null;
                conponDataList = {
                  id: conponDataItem.id,
                  mold: conponDataItem.mold,
                  full: conponDataItem.full,
                  discount: conponDataItem.discount,
                  name: conponDataItem.name
                };
                couponsList.push(conponDataList);
              }
            }
            //佣金
            if (dataItem.commission != null && dataItem.commission != undefined && Utils.myTrim(dataItem.commission + "") != "null") {
              try {
                commission = parseFloat(dataItem.commission);
                commission = isNaN(commission) ? 0.00 : commission;
              } catch (err) { }
            }
            commission = parseFloat((commission).toFixed(app.data.limitQPDecCnt));
            
            if (dataItem.minprice != null && dataItem.minprice != undefined && Utils.myTrim(dataItem.minprice + "") != "null") {
              try {
                minprice = parseFloat(dataItem.minprice);
                minprice = isNaN(minprice) ? 0.00 : minprice;
              } catch (err) { }
            }
            minprice = parseFloat((minprice).toFixed(app.data.limitQPDecCnt));
            //赠品信息
            if (dataItem.gdetailId != null && dataItem.gdetailId != undefined && Utils.myTrim(dataItem.gdetailId + "") != "null" && Utils.myTrim(dataItem.gdetailId + "") != "")
              giftId = dataItem.gdetailId;
            if (dataItem.gproductName != null && dataItem.gproductName != undefined && Utils.myTrim(dataItem.gproductName + "") != "null" && Utils.myTrim(dataItem.gproductName + "") != "")
              giftName = dataItem.gproductName;
            if (dataItem.gphotos != null && dataItem.gphotos != undefined && Utils.myTrim(dataItem.gphotos + "") != "null" && Utils.myTrim(dataItem.gphotos + "") != "") {
              photosString = ""; photosString = dataItem.gphotos; photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString[n].endsWith(".jpg") || photosString[n].endsWith(".jpeg"))) {
                    gphotos = app.getSysImgUrl(photosTemp[n]);
                    break;
                  }
                }
              }
            }

            //团购标识
            if (dataItem.groupmold != null && dataItem.groupmold != undefined && Utils.myTrim(dataItem.groupmold + "") != "") {
              try {
                groupmold = parseInt(dataItem.groupmold);
                groupmold = isNaN(groupmold) ? 0 : groupmold;
              } catch (err) { }
            }
            //劵后价
            if (dataItem.coupondist != null && dataItem.coupondist != undefined && Utils.myTrim(dataItem.coupondist + "") != "null") {
              try {
                coupondist = parseFloat(dataItem.coupondist);
                coupondist = isNaN(coupondist) ? 0 : coupondist;
              } catch (err) { }
            }
            if (dataItem.couponmold != null && dataItem.couponmold != undefined && Utils.myTrim(dataItem.couponmold + "") != "") {
              try {
                couponMold = parseInt(dataItem.couponmold);
                couponMold = isNaN(couponMold) ? 0 : couponMold;
              } catch (err) { }
            }
            if (dataItem.couponfull != null && dataItem.couponfull != undefined && Utils.myTrim(dataItem.couponfull + "") != "") {
              try {
                couponfull = parseFloat(dataItem.couponfull);
                couponfull = isNaN(couponfull) ? 0.00 : couponfull;
              } catch (err) { }
            }
            if (dataItem.couponprice != null && dataItem.couponprice != undefined && Utils.myTrim(dataItem.couponprice + "") != "") {
              try {
                couponpriceDecrement = parseFloat(dataItem.couponprice);
                couponpriceDecrement = isNaN(couponpriceDecrement) ? 0.00 : couponpriceDecrement;
              } catch (err) { }
            }

            if (dataItem.status != null && dataItem.status != undefined && Utils.myTrim(dataItem.status + "") != "")
              try {
                shelfStatus = parseInt(dataItem.status);
                shelfStatus = isNaN(shelfStatus) ? 0 : shelfStatus;
              } catch (err) { }

            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            if (dataItem.address != null && dataItem.address != undefined && Utils.myTrim(dataItem.address + "") != "")
              paroductNo = dataItem.address;
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              shopName = dataItem.companyName;
            if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "")
              shopType ="自营";// Utils.myTrim(dataItem.companyLevel) == "0" ? "旗舰" : "普通";
            if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
              shopLogo = dataItem.companyLogo;
            //0 bjy商城  1 微官网商城
            switch (mQRType) {
              case 1:
                if (dataItem.wgwQrCode != null && dataItem.wgwQrCode != undefined && Utils.myTrim(dataItem.wgwQrCode + "") != "")
                  qrSrc = dataItem.wgwQrCode;
                break;
              default:
                if (dataItem.qrCode != null && dataItem.qrCode != undefined && Utils.myTrim(dataItem.qrCode + "") != "")
                  qrSrc = dataItem.qrCode;
                break;
            }

            if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
              remark = dataItem.remark;
            if (dataItem.supplier != null && dataItem.supplier != undefined && Utils.myTrim(dataItem.supplier + "") != "")
              supplier = dataItem.supplier;
            if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = ""; photosString = dataItem.photos; photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))){
                    photos.push(app.getSysImgUrl(photosTemp[n]));
                    if (Utils.myTrim(photosTemp[n] + "").indexOf("images/noimg.png") <= -1 && !isSetFirstPhoto) {
                      proFirstPhoto = photosTemp[n];
                      isSetFirstPhoto = true;
                    }
                  } else if (!Utils.isNull(photosString)){
                    videoList.push({ src: photosTemp[n], poster: photosTemp.length > 1 ? photosTemp[n + 1] : "" });
                  }
                }
              }
            }

            isHavePhoto = photos.length > 0 ? true : isHavePhoto;
            if (dataItem.detailPhotos != null && dataItem.detailPhotos != undefined && Utils.myTrim(dataItem.detailPhotos + "") != "") {
              photosString = ""; photosString = dataItem.detailPhotos; introductionImgs = [];
              introductionImgs = photosString.split(",");
              if (introductionImgs.length > 0) {
                for (var n = 0; n < introductionImgs.length; n++) {
                  if (introductionImgs[n] != null && introductionImgs[n] != undefined && Utils.myTrim(introductionImgs[n]) != "")
                    introductionImgs[n] = app.getSysImgUrl(introductionImgs[n]);
                }
              }
            }

            if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
              var dlistItem = null,
                detailItem = null;
              for (var i = 0; i < dataItem.detail.length; i++) {
                detailItem = dataItem.detail[i]; dlistItem = null;
                productDetailId = ""; photosString = ""; groupMoney = 0.00; status = 0; specPhotos = []; attributeOne = ""; attributeTwo = ""; sourcePrice = 0.00; sellPrice = 0.00; channelPrice = 0.00; dScore = 0; dShelfStatus = 0; detailPhoto = []; discountPrice = 0.00; couponPrice = 0.00; isShowPrice1 = false; isShowPrice2 = false; isShowPrice3 = false; discountType = 0; stock = 0.00; strStock = "0"; sofeNum = 0; sn = 0; optimalPrice = 0.00; optimalPriceName = "现价"; isSChgPrice = false; isCouponPrice = false; 
                group_purchase_meal_msg = []; group_purchase_photos = []; group_purchase_remind = []; group_purchase_startime = new Date(); group_purchase_startimeStr = ""; group_purchase_endtime = new Date(); group_purchase_endtimeStr = ""; detailRemark = "";
                if (detailItem.group_purchase_startime != null && detailItem.group_purchase_startime != undefined) {
                  try {
                    group_purchase_startime = new Date(Date.parse((detailItem.group_purchase_startime + "").replace(/-/g, "/")))
                  } catch (e) {
                    group_purchase_startime = dtNow;
                  }
                }

                if (detailItem.group_purchase_endtime != null && detailItem.group_purchase_endtime != undefined) {
                  try {
                    group_purchase_endtime = new Date(Date.parse((detailItem.group_purchase_endtime + "").replace(/-/g, "/")))
                  } catch (e) {
                    group_purchase_endtime = dtNow;
                  }
                }
                group_purchase_startimeStr = Utils.getDateTimeStr3(group_purchase_startime, "-", tag);
                group_purchase_endtimeStr = Utils.getDateTimeStr3(group_purchase_endtime, "-", tag);
                if (detailItem.group_purchase_meal_msg != null && detailItem.group_purchase_meal_msg != undefined && Utils.myTrim(detailItem.group_purchase_meal_msg + "") != "" && Utils.myTrim(detailItem.group_purchase_meal_msg + "") != "null") {
                  try{
                    group_purchase_meal_msg = JSON.parse(detailItem.group_purchase_meal_msg);;
                  } catch (e) { group_purchase_meal_msg=[];}
                }
                if (detailItem.group_purchase_remind != null && detailItem.group_purchase_remind != undefined && Utils.myTrim(detailItem.group_purchase_remind + "") != "" && Utils.myTrim(detailItem.group_purchase_remind + "") != "null") {
                  try {
                    group_purchase_remind = JSON.parse(detailItem.group_purchase_remind);;
                  } catch (e) { group_purchase_remind = []; }
                }
                if (detailItem.group_purchase_photos != null && detailItem.group_purchase_photos != undefined && Utils.myTrim(detailItem.group_purchase_photos + "") != "" && Utils.myTrim(detailItem.group_purchase_photos + "") != "null") {
                  photosString = "";
                  photosString = detailItem.group_purchase_photos;
                  group_purchase_photos = [];
                  group_purchase_photos = photosString.split(",");
                  if (group_purchase_photos.length > 0) {
                    for (var n = 0; n < group_purchase_photos.length; n++) {
                      if (group_purchase_photos[n] != null && group_purchase_photos[n] != undefined && Utils.myTrim(group_purchase_photos[n]) != "")
                        group_purchase_photos[n] = app.getSysImgUrl(group_purchase_photos[n]);
                    }
                  }
                }
                if (detailItem.remark != null && detailItem.remark != undefined && Utils.myTrim(detailItem.remark + "") != "" && Utils.myTrim(detailItem.remark + "null") != "") detailRemark = detailItem.remark;


                if (detailItem.stock != null && detailItem.stock != undefined && Utils.myTrim(detailItem.stock + "") != "" && Utils.myTrim(detailItem.stock + "null") != "") {
                  try {
                    stock = parseInt(detailItem.stock);
                    stock = isNaN(stock) ? 0 : stock;
                    stock = stock <= 0 ? 0 : stock;
                    strStock = stock + "";
                  } catch (err) { }
                }
                if (detailItem.sofeNum != null && detailItem.sofeNum != undefined && Utils.myTrim(detailItem.sofeNum + "") != "") {
                  try {
                    sofeNum = parseInt(detailItem.sofeNum);
                    sofeNum = isNaN(sofeNum) ? 0 : sofeNum;
                  } catch (err) { }
                }
                if (detailItem.sn != null && detailItem.sn != undefined && Utils.myTrim(detailItem.sn + "") != "") {
                  try {
                    sn = parseInt(detailItem.sn);
                    sn = isNaN(sn) ? 0 : sn;
                  } catch (err) { }
                }
                if (detailItem.score != null && detailItem.score != undefined && Utils.myTrim(detailItem.score + "") != "") {
                  try {
                    dScore = parseInt(detailItem.score);
                    dScore = isNaN(dScore) ? 0 : dScore;
                  } catch (err) { }
                }
                if (detailItem.groupMoney != null && detailItem.groupMoney != undefined && Utils.myTrim(detailItem.groupMoney + "") != "null") {
                  try {
                    groupMoney = parseFloat(detailItem.groupMoney);
                    groupMoney = isNaN(groupMoney) ? 0.00 : groupMoney;
                  } catch (err) { }
                }
                //如果为积分兑换，但积分为0则跳过 
                if (vtype == 1 && dScore <= 0) continue;
                if (detailItem.photos != null && detailItem.photos != undefined && Utils.myTrim(detailItem.photos + "") != "" && Utils.myTrim(detailItem.photos + "") != "null") {
                  photosString = "";
                  photosString = detailItem.photos;
                  detailPhoto = [];
                  detailPhoto = photosString.split(",");
                  if (detailPhoto.length > 0) {
                    for (var n = 0; n < detailPhoto.length; n++) {
                      if (detailPhoto[n] != null && detailPhoto[n] != undefined && Utils.myTrim(detailPhoto[n]) != "")
                        detailPhoto[n] = app.getSysImgUrl(detailPhoto[n]);
                    }
                  }
                }
                isHavePhoto = detailPhoto.length > 0 ? true : isHavePhoto;

                if (detailItem.status != null && detailItem.status != undefined && Utils.myTrim(detailItem.status + "") != "") {
                  try {
                    dShelfStatus = parseInt(detailItem.status);
                    dShelfStatus = isNaN(dShelfStatus) ? 0 : dShelfStatus;
                  } catch (err) { }
                }
                if (detailItem.id != null && detailItem.id != undefined && Utils.myTrim(detailItem.id + "") != "")
                  productDetailId = detailItem.id;
                if (Utils.myTrim(proSDetailId) != "" && Utils.myTrim(proSDetailId) == Utils.myTrim(productDetailId)) selDIndex = i;
                if (detailItem.attributeOne != null && detailItem.attributeOne != undefined && Utils.myTrim(detailItem.attributeOne + "") != "")
                  attributeOne = detailItem.attributeOne;
                if (detailItem.attributeTwo != null && detailItem.attributeTwo != undefined && Utils.myTrim(detailItem.attributeTwo + "") != "")
                  attributeTwo = detailItem.attributeTwo;
                /////////////////////////////////////////////////////////////////////////////
                //----------------价格处理----------------------------------------------------
                //针对分享修改价格的处理
                if (receiveSharePriceList != null && receiveSharePriceList != undefined && receiveSharePriceList.length > 0) {
                  for (var n = 0; n < receiveSharePriceList.length; n++) {
                    if (receiveSharePriceList[n][sn + ""] != null && receiveSharePriceList[n][sn + ""] != undefined) {
                      sourcePrice = receiveSharePriceList[n][sn + ""];
                      sellPrice = sourcePrice;
                      optimalPrice = sourcePrice;
                      isSChgPrice = true;
                      break;
                    }
                  }
                }
                if (!isSChgPrice) {
                  //原价
                  if (detailItem.price != null && detailItem.price != undefined && Utils.myTrim(detailItem.price + "") != "") {
                    try {
                      sourcePrice = parseFloat(detailItem.price);
                      sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
                    } catch (err) { }
                  }
                  sellPrice = sourcePrice;
                  //渠道价
                  if (detailItem.channelPrice != null && detailItem.channelPrice != undefined && Utils.myTrim(detailItem.channelPrice + "") != "") {
                    try {
                      channelPrice = parseFloat(detailItem.channelPrice);
                      channelPrice = isNaN(channelPrice) ? 0.00 : channelPrice;
                      if (channelPrice > 0.00) {
                        sourcePrice = channelPrice;
                        sellPrice = sourcePrice;
                      }
                    } catch (err) { }
                  }
                  //劵后价couponMold = 0, couponfull=0.00;
                  if (coupondist > 0.00 && coupondist < sellPrice) {
                    couponPrice = sellPrice - coupondist;
                    if (couponPrice > 0.00) {
                      isShowPrice1 = true;
                      couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
                    }
                  }

                  //特惠价或套装价
                  if (detailItem.way != null && detailItem.way != undefined && Utils.myTrim(detailItem.way + "") != "") {
                    try {
                      discountType = parseInt(detailItem.way);
                      discountType = isNaN(discountType) ? 0 : discountType;

                      if (detailItem.discount != null && detailItem.discount != undefined && Utils.myTrim(detailItem.discount + "") != "") {
                        try {
                          discountPrice = parseFloat(detailItem.discount);
                          discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                          discountPrice = sellPrice - discountPrice;
                          discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                          isShowPrice2 = discountPrice <= 0.00 ? false : true;
                        } catch (err) { }
                      }
                    } catch (err) { }
                  }
                  isShowPrice3 = couponPrice > 0.00 ? (discountPrice > 0.00 && discountType == 0 ? false : true) : false;
                  //最优价计算
                  optimalPrice = discountPrice > 0.00 && discountPrice < sourcePrice ? discountPrice : sourcePrice;
                  if (optimalPrice > 0.00) {
                    if (isShowPrice3 && optimalPrice > couponPrice) {
                      optimalPriceName = "劵后价";
                      optimalPrice = couponPrice;
                      isCouponPrice = true;
                    } else if (optimalPrice < sourcePrice) {
                      optimalPriceName = discountType == 0 ? "特惠价" : "套装价";
                    } else
                      optimalPriceName = "现价";
                  } else {
                    optimalPriceName = "现价";
                    optimalPrice = sourcePrice;
                  }
                }

                //如果为代理商分享商品
                if (vtype == 2) {
                  sourcePrice = sourcePrice > 0 ? that.data.agentPrice : sourcePrice;
                  sellPrice = sellPrice > 0 ? that.data.agentPrice : sellPrice;
                  couponPrice = couponPrice > 0 ? that.data.agentPrice : couponPrice;
                  discountPrice = discountPrice > 0 ? that.data.agentPrice : discountPrice;
                  optimalPrice = optimalPrice > 0 ? that.data.agentPrice : optimalPrice;
                }
                if (group_purchase_photos.length > 0) {
                  var photosTemp = group_purchase_photos;
                  group_purchase_photos = [];

                  for (var k = 0; k < photosTemp.length; k++) {
                    if (k == 0)
                      group_purchase_photos.push({
                        src: photosTemp[k],
                        isShow: true
                      });
                    else
                      group_purchase_photos.push({
                        src: photosTemp[k],
                        isShow: false
                      });
                  }
                }
                dlistItem = {
                  productDetailId: productDetailId, specPhotos: specPhotos, attributeOne: attributeOne, attributeTwo: attributeTwo, isHaveTwo: Utils.myTrim(attributeTwo) != "" ? true : false,
                  sourcePrice: parseFloat(sourcePrice.toFixed(app.data.limitQPDecCnt)), //渠道价
                  sellPrice: parseFloat(sellPrice.toFixed(app.data.limitQPDecCnt)),
                  couponPrice: parseFloat(couponPrice.toFixed(app.data.limitQPDecCnt)), //劵后价
                  discountPrice: parseFloat(discountPrice.toFixed(app.data.limitQPDecCnt)), //特惠价或套装价
                  isShowPrice1: isShowPrice1, isShowPrice2: isShowPrice2, isShowPrice3: isShowPrice3, discountType: discountType, dScore: dScore, dShelfStatus: dShelfStatus, detailPhoto: detailPhoto, stock: stock, strStock: strStock, groupMoney: groupMoney, optimalPrice: parseFloat(optimalPrice.toFixed(app.data.limitQPDecCnt)), optimalPriceName: optimalPriceName, isCouponPrice: isCouponPrice, sofeNum: sofeNum, sn: sn,
                  group_purchase_meal_msg: group_purchase_meal_msg, group_purchase_photos: group_purchase_photos, group_purchase_remind: group_purchase_remind, group_purchase_startime: group_purchase_startime, group_purchase_startimeStr: group_purchase_startimeStr, group_purchase_endtime: group_purchase_endtime, group_purchase_endtimeStr: group_purchase_endtimeStr, detailRemark: detailRemark,
                }
                productDetailList.push(dlistItem);
              }
            }
            shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
            if (isHavePhoto && photos != null && photos.length <= 0 && productDetailList != null && productDetailList.length > 0) {
              for (var n = 0; n < productDetailList.length; n++) {
                if (productDetailList[n].detailPhoto != null && productDetailList[n].detailPhoto.length > 0) photos.push(productDetailList[n].detailPhoto[0])
              }
            }
            if (introductionImgs.length > 0) {
              var introductionImgsTemp = introductionImgs;
              introductionImgs = [];

              for (var k = 0; k < introductionImgsTemp.length; k++) {
                introductionImgs.push({
                  src: introductionImgsTemp[k],
                  isShow: false
                });
              }
            }
            if (photos.length > 0) {
              var photosTemp = photos;
              photos = [];

              for (var k = 0; k < photosTemp.length; k++) {
                if (k == 0)
                  photos.push({
                    src: photosTemp[k],
                    isShow: true
                  });
                else
                  photos.push({
                    src: photosTemp[k],
                    isShow: false
                  });
              }
            }
            
            var proDataInfo = {
              pid: pid, productId: productId, productName: Utils.myTrim(productName) != "" ? productName : remark, paroductNo: paroductNo, shopId: shopId, shopLogo: Utils.myTrim(shopLogo) != "" ? app.getSysImgUrl(shopLogo) : shopLogo, shopType: shopType, shopName: shopName, qrSrc: qrSrc, photos: photos, isHavePhoto: isHavePhoto, productDetailList: productDetailList, productDetailCnt: productDetailList.length, remark: remark, supplier: supplier, sellScore: sellScore, shelfStatus: shelfStatus, introductionImgs: introductionImgs, giftId: giftId, giftName: giftName, gphotos: gphotos, commission: parseFloat(commission.toFixed(app.data.limitQPDecCnt)), couponsList: couponsList, couponsListCnt: couponsList.length, deposit: parseFloat(deposit.toFixed(app.data.limitQPDecCnt)), presellstatus: presellstatus, presellEndDate: presellEndDate, finalPayMentStartDate: finalPayMentStartDate, finalPayMentEndDate: finalPayMentEndDate, mold: mold, videoList: videoList, area: area, window: window, bed: bed, smoking: smoking, wifi: wifi, numFloor: numFloor, cast: cast, conveniences: conveniences, bathroom: bathroom, media: media, foodAndDrink: foodAndDrink, rulesOfuse: rulesOfuse, minprice: minprice,
            }
            if (Utils.myTrim(proDataInfo.productId) == "") {
              wx.showModal({
                title: '提示',
                content: '该商品已无效！点确定返回商城首页。',
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../../'+app.data.storeShareMainPage,
                    })
                  } else if (res.cancel) {
                    wx.reLaunch({
                      url: "../../../" + app.data.sysMainPage,
                    })
                  }
                }
              })
            } else {
              var shareWXImg = proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0 ? proDataInfo.photos[0].src : that.data.shareWXImg;
              proHeadPhotoList = [];
              if (proDataInfo.productDetailList != null && proDataInfo.productDetailList != undefined && proDataInfo.productDetailList.length > 0) {
                for (var n = 0; n < proDataInfo.productDetailList.length; n++) {
                  if (proDataInfo.productDetailList[n].detailPhoto != null && proDataInfo.productDetailList[n].detailPhoto != undefined && proDataInfo.productDetailList[n].detailPhoto.length > 0 && Utils.myTrim(proDataInfo.productDetailList[n].detailPhoto[0]) != "") {
                    proHeadPhotoList.push(proDataInfo.productDetailList[n].detailPhoto[0])
                  } else {
                    proHeadPhotoList.push(defaultItemImgSrc)
                  }
                }
              }
              that.setData({
                proDataInfo: proDataInfo,
                proHeadPhotoList: proHeadPhotoList,
                selDIndex: selDIndex,
                proFirstPhoto: proFirstPhoto,
                shareWXImg: shareWXImg,
                isHideGroup: groupmold == 8 ? false : true,

              }, that.lazyLoadImg)
              that.computeItemAmount();
            }

            console.log("商品详情：", proDataInfo)
            if (groupmold == 8) {
              timeOutPOrder = setTimeout(that.getProductOrder, 1500)
            }
          } else {
            wx.showToast({
              title: "该商品已下架！",
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取商品详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品详情接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：IntersectionObserver 对象懒加载图片
  lazyLoadImg: function () {
    var that = this, selDIndex = that.data.selDIndex;
    app.lazyLoadImgList(that, that.data.proDataInfo.photos, "img_toplist", "proDataInfo.photos");
    app.lazyLoadImgList(that, that.data.proDataInfo.introductionImgs, "img_introduce", "proDataInfo.introductionImgs");
    app.lazyLoadImgList(that, that.data.proDataInfo.productDetailList[selDIndex].group_purchase_photos, "img_introduce", "proDataInfo.productDetailList[" + selDIndex +"].group_purchase_photos");
  },
  //获取赠品详情
  getGiftDataInfo: function (id) {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_goodtype&action=QueryProductGift&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&detailId=" + id + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('赠品信息：')
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined && res.data.data.length > 0) {
            var dataItem = res.data.data[0],
              giftDataInfo = null;
            var productId = "", productName = "", paroductNo = "", detailId = id, photosString = "", detailPhoto = [], photosTemp = [], gIntroductionImgs = [], remark = "", attributeOne = "", attributeTwo = "", sellPrice = 0.00, isHaveTwo = false;
            productId = dataItem.id;
            //赠品信息
            if (dataItem.productId != null && dataItem.productId != undefined && Utils.myTrim(dataItem.productId + "") != "null" && Utils.myTrim(dataItem.productId + "") != "")
              productId = dataItem.productId;
            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;

            if (dataItem.productremark != null && dataItem.productremark != undefined && Utils.myTrim(dataItem.productremark + "") != "null")
              remark = dataItem.productremark;
            //赠品图片
            if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "null" && Utils.myTrim(dataItem.photos + "") != "")
              photosString = dataItem.photos;
            else if (dataItem.productphotos != null && dataItem.productphotos != undefined && Utils.myTrim(dataItem.productphotos + "") != "null" && Utils.myTrim(dataItem.productphotos + "") != "")
              photosString = dataItem.productphotos;
            if (Utils.myTrim(photosString) != "") {
              detailPhoto = []; photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    detailPhoto.push(app.getSysImgUrl(photosTemp[n]));
                  }
                }
              }
            }

            //赠品详情图片
            photosString = "";
            if (dataItem.detailPhotos != null && dataItem.detailPhotos != undefined && Utils.myTrim(dataItem.detailPhotos + "") != "null" && Utils.myTrim(dataItem.detailPhotos + "") != "")
              photosString = dataItem.detailPhotos;
            if (Utils.myTrim(photosString) != "") {
              gIntroductionImgs = [];
              gIntroductionImgs = photosString.split(",");
              if (gIntroductionImgs.length > 0) {
                for (var n = 0; n < gIntroductionImgs.length; n++) {
                  if (gIntroductionImgs[n] != null && gIntroductionImgs[n] != undefined && Utils.myTrim(gIntroductionImgs[n]) != "")
                    gIntroductionImgs[n] = app.getSysImgUrl(gIntroductionImgs[n]);
                  else
                    gIntroductionImgs[n] = defaultItemImgSrc;
                }
              }
            }

            //原价
            if (dataItem.price != null && dataItem.price != undefined && Utils.myTrim(dataItem.price + "") != "null") {
              try {
                sellPrice = parseFloat(dataItem.price);
                sellPrice = isNaN(sellPrice) ? 0.00 : sellPrice;
              } catch (err) { }
            }
            if (dataItem.attributeOne != null && dataItem.attributeOne != undefined && Utils.myTrim(dataItem.attributeOne + "") != "null")
              attributeOne = dataItem.attributeOne;
            if (dataItem.attributeTwo != null && dataItem.attributeTwo != undefined && Utils.myTrim(dataItem.attributeTwo + "") != "null")
              attributeTwo = dataItem.attributeTwo;

            if (detailPhoto.length <= 0) detailPhoto.push(defaultItemImgSrc);
            giftDataInfo = {
              productId: productId,
              productName: productName,
              paroductNo: paroductNo,
              detailId: detailId,
              detailPhoto: detailPhoto,
              remark: remark,
              attributeOne: attributeOne,
              attributeTwo: attributeTwo,
              isHaveTwo: Utils.myTrim(attributeTwo) != "" ? true : false,
              sellPrice: sellPrice,
              gIntroductionImgs: gIntroductionImgs,
            }
            that.setData({
              giftDataInfo: giftDataInfo,
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取赠品详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取赠品详情接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取赠品详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：选择规格
  exchangeDetail: function (e) {
    var that = this, index = 0, proDataInfo = that.data.proDataInfo, proSDetailId = "", vtype = that.data.vtype;
    try {
      index = e.currentTarget.dataset.index;
      index = isNaN(index) ? 0 : index;
    } catch (err) { }
    try {
      proSDetailId = proDataInfo.productDetailList[index].productDetailId;
    } catch (err) { }

    that.setData({
      selDIndex: index,
      proSDetailId: proSDetailId,
    })
    that.computeItemAmount();
  },
  //方法：计算总价
  computeItemAmount: function () {
    var that = this, num = that.data.buyNum, proDataInfo = that.data.proDataInfo, selDIndex = that.data.selDIndex, selProDetail = proDataInfo.productDetailList[selDIndex], buyAmount = that.data.buyAmount, buyAmountSource = that.data.buyAmountSource, buyAmountDiscount = that.data.buyAmountDiscount, buyAmountCoupon = that.data.buyAmountCoupon;

    buyAmount = proDataInfo.presellstatus == 1 ? proDataInfo.deposit * num : selProDetail.optimalPrice * num;
    buyAmountSource = selProDetail.sourcePrice * num;
    buyAmountDiscount = selProDetail.discountPrice * num;
    buyAmountCoupon = selProDetail.couponPrice * num;

    that.setData({
      buyAmount: parseFloat((buyAmount).toFixed(app.data.limitQPDecCnt)),
      buyAmountSource: parseFloat((buyAmountSource).toFixed(app.data.limitQPDecCnt)),
      buyAmountDiscount: parseFloat((buyAmountDiscount).toFixed(app.data.limitQPDecCnt)),
      buyAmountCoupon: parseFloat((buyAmountCoupon).toFixed(app.data.limitQPDecCnt)),
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;
    console.log("changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value, setValue = null, setKey = "";
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "shareprice":
        var price = 0.00, sn = e.currentTarget.dataset.sn, listItem = null, sharePriceArrayList = that.data.sharePriceArrayList, isExist = false;
        try {
          price = parseFloat(value);
          price = isNaN(price) ? 0.00 : price;
        } catch (e) { }
        for (var i = 0; i < sharePriceArrayList.length; i++) {
          if (sharePriceArrayList[i][sn] != null && sharePriceArrayList[i][sn] != undefined) {
            sharePriceArrayList[i][sn] = price;
            isExist = true;
          }
        }
        if (!isExist) {
          listItem = {};
          listItem[sn] = price;
          sharePriceArrayList.push(listItem)
        }
        that.data.sharePriceArrayList = sharePriceArrayList;
        break;
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------分享相关-------------------------------------------------------------------
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function (e) {
    var that = this,
      sType = 0;
    //sType:2 微信分享图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) { }
    }
    app.uploadImg(that, sType, 0, 1);
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this;
    switch (sType) {
      case 2:
        that.setData({
          shareWXImg: imgUrl,
          upWXSSImg: true,
        })
        break;
    }
  },

  //事件：分享房型商品
  shareWXStoreProduct: function () {
    var that = this;
    that.checkUserLoginAction(1, 0);
  },
  //事件：取消分享
  cancelWXSend: function () {
    var that = this;
    that.setData({
      showsaveimage: false
    })
  },
  //事件：分享文本框输入事件
  changeWXSSAlert: function (e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;

    that.setData({
      shareWXAlert: value,
      changeAlert: true,
    })
  },
  
  //事件：显示分享价格修改窗
  showChgSharePricePop: function (e) {
    var that = this;
    that.setData({
      isShowChgSharePricePop: true
    })
  },
  //事件：隐藏分享价格修改窗
  hideChgSharePricePop: function (e) {
    var that = this;
    that.setData({
      isShowChgSharePricePop: false
    })
  },
  //事件：提交分享价格修改窗
  submitChgSharePricePop: function (e) {
    var that = this, sharePriceArrayList = that.data.sharePriceArrayList;
    console.log(sharePriceArrayList);
    that.setData({
      isShowChgSharePricePop: false
    })
  },
  //事件：跳到首页
  gotoHomePage: function (e) {
    wx.reLaunch({
      url: homePageUrl
    });
  },
  //事件：跳转店铺详情
  viewShopDetail: function (e) {
    let that = this,shopId = 0,url="";
    try {
      shopId = parseInt(e.currentTarget.dataset.shopid);
      shopId = isNaN(shopId) ? 0 : shopId;
    } catch (err) { }
    //url = "../shopdetail/shopdetail?type=0&companyId=" + shopId;

    url = app.data.hotelType == 0 ? "../hotelintroduce/hotelintroduce?type=0&companyId=" + shopId : mainPackageUrl + "/chainhoteldetail/chainhoteldetail?id=" + shopId;
    wx.navigateTo({
      url: url
    });
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------生成宣传图片相关------------------------------------------------------------
  //分享商品详情按钮
  shareStoreDetails: function () {
    let that = this;
    that.createModalQRcard()
  },
  //方法：生成附带二维码宣传图片
  createModalQRcard: function () {
    let that = this, proDataInfo = that.data.proDataInfo, selProDetail = that.data.proDataInfo.productDetailList[0];
    let sellPriceName = selProDetail.optimalPriceName, sellPrice = selProDetail.optimalPrice, sourcePrice = selProDetail.sourcePrice, bgImag = "", priceParams = "", pageDataParam = "", pageParam = "&page=packageTemplate/pages/hoteldetails/hoteldetails";
    let page = "packageTemplate/pages/hoteldetails/hoteldetails", pageData = "pid=" + that.data.proId + "|suid=" + appUserInfo.userId, imgUrl = "", otherParams = "";

    otherParams = "&stype=1&priceinfo1=" + encodeURIComponent(sellPriceName + "：") + "¥" + sellPrice + "&priceinfo2=" + encodeURIComponent("原价：") + "¥" + sourcePrice;
    imgUrl = proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0 ? proDataInfo.photos[0].src : "";
    app.createADModalQRImg(that, page, pageData, that.data.proDataInfo.productName, "", imgUrl, otherParams)
  },
  //方法：宣传图片生成处理方法
  setCADImgInfo: function (imgUrl) {
    var that = this;
    that.setData({
      isShowQRCode: true,
      cardImagUrl: imgUrl,
    })
  },
  //事件：点确定查看二维码大图
  showCardImages: function () {
    this.setData({
      isShowQRCode: false
    })
    var imag = this.data.cardImagUrl
    app.viewImage(imag)
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

  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------赠品信息弹窗相关------------------------------------------------------------
  //事件：显示赠品信息弹窗 
  showGiftDetailPop: function (e) {
    var that = this,
      id = "";
    try {
      id = e.currentTarget.dataset.id;
    } catch (err) { }
    if (Utils.myTrim(id) == "") {
      wx.showToast({
        title: "赠品ID无效！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.getGiftDataInfo(id);
    that.setData({
      isShowGiftDetail: true
    })
  },
  //事件：隐藏赠品信息弹窗
  hideGiftDetailPop: function () {
    this.setData({
      isShowGiftDetail: false
    })
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------规格信息弹窗相关------------------------------------------------------------
  //事件：显示选择规格弹窗
  showProductSpecsPop: function () {
    var that = this, proDataInfo = that.data.proDataInfo, selDIndex = that.data.selDIndex, vtype = that.data.vtype;
    this.setData({
      isShowProductSpecs: true,
    })
    this.computeItemAmount();
  },
  //事件：显示选择规格弹窗
  showProductSpecsPop2: function (e) {
    var that = this,
      selSpecOperateType = 0;
    try {
      selSpecOperateType = parseInt(e.currentTarget.dataset.ptype);
      selSpecOperateType = isNaN(selSpecOperateType) ? 0 : selSpecOperateType;
    } catch (err) { }
    this.setData({
      isShowProductSpecs: true,
      isMainShopCar: true,
      selSpecOperateType: selSpecOperateType,
    })
    this.computeItemAmount();
  },
  //事件：隐藏选择规格弹窗
  hideProductSpecsPop: function () {
    var that = this, proDataInfo = that.data.proDataInfo, selDIndex = that.data.selDIndex, vtype = that.data.vtype;
    this.setData({
      isShowProductSpecs: false,
      isMainShopCar: false,
    })
  },

  //方法：判断入住时段是否正确
  checkDateTimePeriod:function(isSubmit){
    let result = false, that = this, dtBegin = that.data.dtBegin, dtEnd = that.data.dtEnd;
    if (Utils.myTrim(dtBegin) == "" || Utils.myTrim(dtEnd) == "") {
      if (isSubmit){
        wx.showToast({
          title: "请正确设置入住时间段！",
          icon: 'none',
          duration: 2000
        })
      }
      return result;
    } else {
      let dtNow=new Date(), dtSetBegin = new Date(), dtSetEnd = new Date(), num = 0;
      try {
        dtSetBegin = Date.parse(dtBegin.replace(/\-/g, "/"));
        dtSetEnd = Date.parse(dtEnd.replace(/\-/g, "/"));
        num = Utils.getDaysByDateTime(dtSetBegin, dtSetEnd);
      } catch (e) { }
      let dtS0=new Date(),dtN0=new Date();
      try{
        dtS0 = Utils.getDateByTimeStr(dtBegin,false);
        dtN0 = new Date(dtNow.getFullYear(), dtNow.getMonth(), dtNow.getDate())
      }catch(e){}
      if (dtN0 > dtS0){
        wx.showToast({
          title: "入住日期不能小于当前日期！",
          icon: 'none',
          duration: 2000
        })
        return result;
      }
      if (dtSetEnd <= dtSetBegin) {
        wx.showToast({
          title: "入住时间不能大于离店时间！",
          icon: 'none',
          duration: 2000
        })
        return result;
      }
    }
    return true;
  },
  //事件：提交订单
  submitMyOrder:function(e){
    let that = this, proDataInfo = that.data.proDataInfo, selDIndex = that.data.selDIndex, selProDetail = proDataInfo.productDetailList[selDIndex], sellPrice = proDataInfo.productDetailList[selDIndex].isCouponPrice ? proDataInfo.productDetailList[selDIndex].sourcePrice : proDataInfo.productDetailList[selDIndex].optimalPrice, vtype = that.data.vtype, dtBegin = that.data.dtBegin, dtEnd = that.data.dtEnd, buyNum = that.data.buyNum,dtBeginTmp=null,dtEndTmp=null;
    //库存判断
    if (app.data.isCheckHotelStock){
      if (selProDetail.stock < 1) {
        wx.showToast({
          title: stockAlert,
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    //时间段判断
    if (!that.checkDateTimePeriod(true)) return;
    try{
      dtBegin += " 00:00:00";
      dtEnd += " 00:00:00";
      dtBeginTmp = Date.parse(dtBegin.replace(/\-/g, "/"));
      dtBeginTmp = dtBeginTmp / 1000;
      dtEndTmp = Date.parse(dtEnd.replace(/\-/g, "/"));
      dtEndTmp = dtEndTmp / 1000;
    }catch(e){}
    
    let itemList = [], listItem = null, detailList = [], detailListItem = null, companyId = app.data.companyId, userId = appUserInfo.userId, mobile = appUserInfo.userMobile, amount = 0.00, linkNo = 0, priceflag = 0, shareUserId = 0;
    shareUserId = that.data.distributorId > 0 ? that.data.distributorId : that.data.paramShareUId;
    //priceflag：0原价, 1优惠价, 2套装价, 3特价
    if (sellPrice != selProDetail.sourcePrice) {
      priceflag = selProDetail.discountType == 0 ? 3 : 2;
    }
    //一般0,兑换1,领取2,团购3预售4，酒店7
    linkNo = 7;
    detailListItem = {
      product_id: proDataInfo.productId,
      detail_id: selProDetail.productDetailId,
      number: buyNum,
      price: sellPrice,
      amount: vtype == 2 ? 0.00 : sellPrice * buyNum,
      priceflag: priceflag,
      sTime: dtBeginTmp,
      eTime: dtEndTmp,
    }

    amount += detailListItem.amount;
    detailList.push(detailListItem);
    listItem = {
      linkNo: linkNo,
      amount: amount,
      companyId: proDataInfo.shopId,
      giftdetail: proDataInfo.giftId,
      userId: userId,
      shareuserId: shareUserId,
      mobile: mobile,
      linkman: appUserInfo.userName,
      deliveryId: 0,
      detail: detailList
    }
    if (vtype == 2) {
      listItem.amount = 0.00;
      listItem.shareuserId = that.data.agentUserId;
      listItem.shareorderId = that.data.agentOrderId;
    }

    itemList.push(listItem);
    app.addSMOrderInfo(that,itemList);
  },
  //方法：跳转订单详情页面
  gotoOrderDetailPage: function (orderId, tag) {
    let that = this, vtype = that.data.vtype, url = vtype == 1 ? packTempPageUrl + "/hotelshoporders/hotelshoporders?otype=1&orderid=" + orderId : packTempPageUrl + "/hotelshoporders/hotelshoporders?orderid=" + orderId;

    if (tag == 0) {
      console.log("订单跳转：" + url)
      wx.navigateTo({
        url: url,
        fail: function (e) {
          console.log("设置：isDowithing = false")
          isDowithing = false;
        }
      });
    } else
      isDowithing = false;
  },
  //事件：跳转选择日期页面
  chooseDateTime: function (e) {
    let that = this, tag = 0,stag="s", url = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, tag);
    } catch (e) { }
    that.data.isForbidRefresh = true;
    that.data.reSelCheckInDate=true;
    stag=tag==0?"s":"e";
    url = packOtherPageUrl + "/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择入住时段") + "&edtname=" + encodeURIComponent("离店时间") + "&tag=" + stag;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
  },
  //查看更多
  checkmore: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
})
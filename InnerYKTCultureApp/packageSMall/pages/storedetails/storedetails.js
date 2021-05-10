// pages/storedetails/storedetails.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var URL = app.getUrlAndKey.smurl,
  OURL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  UploadURL = app.getUrlAndKey.uploadUrl;
var defaultItemImgSrc = DataURL + app.data.defaultImg,
  isDowithing = false,
  mQRType = app.data.mQRType,
  pageParam = "packageSMall/pages/storedetails/storedetails",
  sOptions = null,
  homePageUrl = "../../../" + app.data.sysMainPage,
  mainPackageDir = "../../../pages",
  packOtherPageUrl = "../../../packageOther/pages",
  stockAlert = "库存不足，请选择其它规格！",
  timeOutPOrder = null,
  timeOutCoupon = null,
  timeOutShopCar = null;
var appUserInfo = app.globalData.userInfo;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName, //系统名称
    //是否隐藏拼团
    isHideGroup: true,
    isShowGiftDetail: false,
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    isForbidRefresh: false, //是否禁止刷新
    isOpenMerchantPlatform: false, //是否开放商户平台
    mallChannelId: 0, //渠道ID
    vtype: 0, //商品查看类别：0普通查看，1积分兑换商品查看,2代理商分享的普通客户查看代理商品，3代理商查看商品
    isNormalView: 1, //0分享查看，1正常查看
    groupBuyId: "", //拼团ID
    leaveGBCnt: 0, //拼团剩余名额
    gbMenList: [], //参与剩余名额示例列表
    shareGBIndex: 0, //分享拼团索引

    proId: 0, //商品ID
    proSDetailId: "", //商品规格ID
    randomNum: Math.random() / 9999,
    currentData: 0, //选项卡默认第一个
    proDataInfo: null,
    selDIndex: 0,
    buyNum: 1, //购买数量
    buyAmount: 0.00, //购买总价
    buyAmountSource: 0.00, //购买原价总价
    buyAmountDiscount: 0.00, //购买套装/特惠价总价
    buyAmountCoupon: 0.00, //购买卷后价总价

    proHeadPhotoList: [],
    listData: [], //倒计时时间
    proFirstPhoto: "",
    shoppingCartCnt: 0, //购物车数量
    joinGroupon: false, //参团弹窗
    joinGrouponsize: false, //参团 規格弹窗
    autoplay: true,
    interval: 5000,
    duration: 1000,

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

    ////////////////////////////////////////////////////////
    //---代理相关--------------------------------------------
    agentUserId: 0, //代理商用户ID
    agentOrderId: "", //代理商订单号
    agentPrice: 0.00, //代理价格

    companyId: app.data.agentCompanyId,
    // 是否是店内商品(饮品) 立即购买和加购物车操作不一样
    isShop: false,
  },
  //方法：获取是否显示分享提示弹窗标识
  getIsShowCPAMsg: function () {
    var that = this,
      todayStr = "",
      dayStr = "",
      haveShowCnt = 0,
      isShowCPAMsg = true;

    todayStr = Utils.getDateTimeStr(new Date(), "", false);
    //获取商机向导参数
    try {
      var showCPAMsgObj = wx.getStorageSync('store_showCPAMsg');
      if (showCPAMsgObj != null && showCPAMsgObj != undefined && Utils.myTrim(showCPAMsgObj + "") != "") {
        var scpArray = [];
        scpArray = showCPAMsgObj.split(",");
        if (scpArray.length >= 2) {
          dayStr = Utils.myTrim(scpArray[0]);
          if (dayStr == todayStr) {
            try {
              haveShowCnt = parseInt(scpArray[1]);
              haveShowCnt = isNaN(haveShowCnt) ? 0 : haveShowCnt;
            } catch (err) {}
            if (haveShowCnt >= 2) isShowCPAMsg = false;
          }
        }
      }
    } catch (err) {}
    return isShowCPAMsg;
  },
  //方法：设置是否显示分享提示弹窗标识
  setIsShowCPAMsg: function (setCnt) {
    var that = this,
      todayStr = "",
      dayStr = "",
      haveShowCnt = 0,
      isShowCPAMsg = true;

    todayStr = Utils.getDateTimeStr(new Date(), "", false);
    //获取商机向导参数
    try {
      var showCPAMsgObj = wx.getStorageSync('store_showCPAMsg');
      if (showCPAMsgObj != null && showCPAMsgObj != undefined && Utils.myTrim(showCPAMsgObj + "") != "") {
        var scpArray = [];
        scpArray = showCPAMsgObj.split(",");
        if (scpArray.length >= 2) {
          dayStr = Utils.myTrim(scpArray[0]);
          if (dayStr == todayStr) {
            if (setCnt > 0) {
              wx.setStorageSync('store_showCPAMsg', todayStr + "," + setCnt);
            } else {
              try {
                haveShowCnt = parseInt(scpArray[1]);
                haveShowCnt = isNaN(haveShowCnt) ? 0 : haveShowCnt;
              } catch (err) {}
              haveShowCnt++;
              wx.setStorageSync('store_showCPAMsg', todayStr + "," + haveShowCnt);
            }
          } else {
            if (setCnt > 0)
              wx.setStorageSync('store_showCPAMsg', todayStr + "," + setCnt);
            else
              wx.setStorageSync('store_showCPAMsg', todayStr + ",1");
          }
        } else {
          if (setCnt > 0)
            wx.setStorageSync('store_showCPAMsg', todayStr + "," + setCnt);
          else
            wx.setStorageSync('store_showCPAMsg', todayStr + ",1");
        }
      } else {
        if (setCnt > 0)
          wx.setStorageSync('store_showCPAMsg', todayStr + "," + setCnt);
        else
          wx.setStorageSync('store_showCPAMsg', todayStr + ",1");
      }
    } catch (err) {}
  },
  //事件：设置显示分享提示弹窗不再显示
  noShowCPAMsgPop: function () {
    var that = this;
    that.setData({
      isShowCPAMsg: false,
    })
    that.setIsShowCPAMsg(2);
  },
  changeWXSSAlert: function (e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;

    that.setData({
      shareWXAlert: value,
      changeAlert: true,
    })
  },

  //------微信分享图片-------------------------------------------
  shareWXStoreProduct: function () {
    var that = this;
    that.checkUserLoginAction(1, 0);
  },
  cancelWXSend: function () {
    var that = this;
    that.setData({
      showsaveimage: false
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    var that = this;
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
      } catch (err) {}
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      selProDetail = that.data.proDataInfo.productDetailList[0],
      shareWXImg = that.data.shareWXImg,
      shareAlert = that.data.shareAlert,
      url = "",
      tidParam = Utils.myTrim(that.data.groupBuyId) != "" ? "&tid=" + that.data.groupBuyId : "",
      channelParam = that.data.mallChannelId > 0 ? "&channelid=" + that.data.mallChannelId : "",
      distributorParam = that.data.distributorId > 0 ? "&distributorid=" + that.data.distributorId : "",
      sharePriceArrayList = that.data.sharePriceArrayList,
      sharePriceParam = "";
    shareAlert = Utils.myTrim(shareAlert) == "" ? selProDetail.optimalPriceName + "：" + selProDetail.optimalPrice + " " + proDataInfo.productName : shareAlert;
    if (sharePriceArrayList != null && sharePriceArrayList != undefined && sharePriceArrayList.length > 0) {
      sharePriceParam = "&sprice=" + JSON.stringify(sharePriceArrayList)
    }
    console.log(shareWXImg);
    that.setData({
      showsaveimage: false,
    })
    url = "/packageSMall/pages/storedetails/storedetails?isnv=0&pid=" + that.data.proId + "&suid=" + appUserInfo.userId + channelParam + tidParam + distributorParam + sharePriceParam + "&companyid=" + that.data.companyId;
    console.log("商品分享：" + url)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
      isProhibitCADImgMsg = false;
    // 初始化值
    that.data.companyId = app.data.agentCompanyId
    //生成宣传图片提示缓存显示标志
    var storageValue = wx.getStorageSync('storedetail_prohibitCADImgMsg');
    if (storageValue != null && storageValue != undefined && Utils.myTrim(storageValue) == '1') isProhibitCADImgMsg = true;
    that.setData({
      isProhibitCADImgMsg: isProhibitCADImgMsg,
    })
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {

    let that = this,
      paramShareUId = 0,
      mallChannelId = 0,
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
    try {
      if (sOptions.channelid != null && sOptions.channelid != undefined)
        mallChannelId = parseInt(sOptions.channelid);
      mallChannelId = isNaN(mallChannelId) ? 0 : mallChannelId;
    } catch (e) {}
    that.data.mallChannelId = mallChannelId;

    that.data.companyId = sOptions.companyid
    // 新界面跳转
    var newpage = sOptions.newpage
    if (!Utils.isNull(newpage)) {
      that.setData({
        newpage: newpage,
      })
    }

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
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        //0：加载信息，1：分享，2：加入购物车，3：立即购买，4：拼团
        switch (that.data.loginAction) {
          //0：加载信息
          case 0:
            console.log("登录后加载：......");
            console.log(sOptions);

            // couponPopAlertMsg = appUserInfo != null && appUserInfo != undefined && appUserInfo.userMold == 1 ? '分享本商品给好友，好友可获60元优惠券!' : couponPopAlertMsg;
            var proId = "",
              proSDetailId = "",
              groupBuyId = "",
              vtype = 0,
              isQRScene = that.data.isQRScene,
              isNormalView = 0,
              isWX = 0,
              isShowCPAMsg = true,
              isShowCADImgAlert = true,
              couponPopAlertMsg = '分享本商品给好友，好友可获得优惠券!',
              distributorId = 0,
              currentUserId = 0,
              agentUserId = 0,
              agentOrderId = "",
              agentPrice = 0.00,
              receiveSharePriceList = [],
              receiveSharePriceParamValue = "";

            currentUserId = appUserInfo != null && appUserInfo != undefined ? appUserInfo.userId : 0;
            try {
              if (sOptions.isWX != null && sOptions.isWX != undefined && Utils.myTrim(sOptions.isWX + "") != "") {
                isWX = parseInt(sOptions.isWX);
                isWX = isNaN(isWX) ? 0 : isWX;
              }
            } catch (e) {}
            try {
              if (sOptions.pid != null && sOptions.pid != undefined && Utils.myTrim(sOptions.pid + "") != "") {
                proId = parseInt(sOptions.pid);
                proId = isNaN(proId) ? 0 : proId;
              }
            } catch (e) {}
            try {
              if (sOptions.distributorid != null && sOptions.distributorid != undefined && Utils.myTrim(sOptions.distributorid + "") != "") {
                distributorId = parseInt(sOptions.distributorid);
                distributorId = isNaN(distributorId) ? 0 : distributorId;
              }
            } catch (e) {}
            try {
              if (sOptions.did != null && sOptions.did != undefined && Utils.myTrim(sOptions.did + "") != "") {
                proSDetailId = Utils.myTrim(sOptions.did);
              }
            } catch (e) {}
            try {
              if (sOptions.tid != null && sOptions.tid != undefined && Utils.myTrim(sOptions.tid + "") != "") {
                groupBuyId = Utils.myTrim(sOptions.tid);
              }
            } catch (e) {}
            //商品查看类别：0普通查看，1积分兑换商品查看,2代理商分享的普通客户查看代理商品，3代理商查看商品
            try {
              if (sOptions.vtype != null && sOptions.vtype != undefined && Utils.myTrim(sOptions.vtype + "") != "") {
                vtype = parseInt(sOptions.vtype);
                vtype = isNaN(vtype) ? 0 : vtype;
              }
            } catch (e) {}
            try {
              if (sOptions.isnv != null && sOptions.isnv != undefined && Utils.myTrim(sOptions.isnv + "") != "") {
                isNormalView = parseInt(sOptions.isnv);
                isNormalView = isNaN(isNormalView) ? 1 : isNormalView;
              }
            } catch (e) {}
            //代理商相关
            try {
              if (sOptions.auid != null && sOptions.auid != undefined && Utils.myTrim(sOptions.auid + "") != "") {
                agentUserId = parseInt(sOptions.auid);
                agentUserId = isNaN(agentUserId) ? 0 : agentUserId;
              }
            } catch (e) {}
            try {
              if (sOptions.aoid != null && sOptions.aoid != undefined && Utils.myTrim(sOptions.aoid + "") != "") {
                agentOrderId = Utils.myTrim(sOptions.aoid);
              }
            } catch (e) {}
            try {
              if (sOptions.aprice != null && sOptions.aprice != undefined && Utils.myTrim(sOptions.aprice + "") != "") {
                agentPrice = parseFloat(sOptions.aprice);
                agentPrice = isNaN(agentPrice) ? 0.00 : agentPrice;
              }
            } catch (e) {}
            //分享商品修改价格
            try {
              if (sOptions.sprice != null && sOptions.sprice != undefined && Utils.myTrim(sOptions.sprice + "") != "") {
                receiveSharePriceParamValue = Utils.myTrim(sOptions.sprice);
                if (Utils.myTrim(receiveSharePriceParamValue) != "") receiveSharePriceList = JSON.parse(receiveSharePriceParamValue);

                that.data.receiveSharePriceList = receiveSharePriceList;
              }
            } catch (e) {}

            //
            ////0分享查看，1正常查看
            isNormalView = vtype == 1 ? 1 : isNormalView;
            vtype = agentUserId > 0 ? 2 : vtype;
            isQRScene = isQRScene == false ? (that.data.paramShareUId > 0 ? true : isQRScene) : isQRScene;
            // isShowCPAMsg = that.getIsShowCPAMsg();
            // isShowCADImgAlert = that.getIsShowCADImgAlert();
            //that.setIsShowCPAMsg(0);
            that.setData({
              isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
              proId: proId,
              proSDetailId: proSDetailId,
              vtype: vtype,
              isQRScene: isQRScene,
              distributorId: distributorId,
              currentUserId: currentUserId,

              isNormalView: isNormalView,
              isWX: isWX,

              isShowCPAMsg: isShowCPAMsg,
              isShowCADImgAlert: isShowCADImgAlert,
              couponPopAlertMsg: couponPopAlertMsg,
              groupBuyId: groupBuyId,

              agentUserId: agentUserId,
              agentOrderId: agentOrderId,
              agentPrice: agentPrice,

              roleStatus: appUserInfo.roleStatus,
            })
            that.getMainDataList(proId);
            timeOutShopCar = setTimeout(that.getShoppingCartData, 500);
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
            var shareTitle = app.data.alertSStoreProduct,
              proDataInfo = that.data.proDataInfo,
              selProDetail = that.data.proDataInfo.productDetailList[0]
            shareTitle = selProDetail.optimalPriceName + "：" + selProDetail.optimalPrice + " " + proDataInfo.productName;
            var shareWXImg = that.data.proHeadPhotoList != null && that.data.proHeadPhotoList != undefined && that.data.proHeadPhotoList.length > 0 ? that.data.proHeadPhotoList[that.data.selDIndex] : that.data.shareWXImg;
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

            //2：加入购物车
          case 2:
            if (appUserInfo == null || appUserInfo == undefined) {
              wx.showToast({
                title: "获取用户失败，无法操作！",
                icon: 'none',
                duration: 2000
              })
              return;
            }
            var proDataInfo = that.data.proDataInfo,
              selDIndex = that.data.selDIndex,
              proDetailData = null,
              ptype = that.data.loginATag,
              vtype = that.data.vtype;
            try {
              proDetailData = proDataInfo.productDetailList[selDIndex];
            } catch (err) {}
            console.log("购物操作：isDowithing = " + isDowithing)
            if (proDetailData == null || proDetailData == undefined) {
              wx.showToast({
                title: "请选择商品规格！",
                icon: 'none',
                duration: 2000
              })
              return;
            }

            //0加入购物车，1立即购买 2发起拼单
            switch (ptype) {
              case 0:
                isDowithing = true;
                that.addShoppingCart(proDetailData, ptype);
                break;
                //产品上立即购买（数量默认为1）
              case 1:
                if (proDataInfo.productDetailList[selDIndex].stock <= 0.00) {
                  wx.showToast({
                    title: stockAlert,
                    icon: 'none',
                    duration: 2000
                  })
                  return;
                }
                isDowithing = true;
                that.data.buyNum = vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1; //（数量默认为1）
                that.addShoppingCart(proDetailData, ptype);
                break;
                //规格上立即购买
              case 11:
                if (proDataInfo.productDetailList[selDIndex].stock <= 0.00) {
                  wx.showToast({
                    title: stockAlert,
                    icon: 'none',
                    duration: 2000
                  })
                  return;
                }
                isDowithing = true;
                that.addShoppingCart(proDetailData, ptype);
                break;
            }
            break;

            //4：拼团
          case 4:
            if (appUserInfo == null || appUserInfo == undefined) {
              wx.showToast({
                title: "获取用户失败，无法操作！",
                icon: 'none',
                duration: 2000
              })
              return;
            }
            var proDataInfo = that.data.proDataInfo,
              selDIndex = that.data.selDIndex,
              selProDetail = proDataInfo.productDetailList[selDIndex],
              ptype = that.data.loginATag,
              prdDetailId = selProDetail.productDetailId,
              shareUserId = 0;
            shareUserId = that.data.distributorId > 0 ? that.data.distributorId : that.data.paramShareUId;

            //库存判断
            if (selProDetail.stock <= 0.00) {
              wx.showToast({
                title: stockAlert,
                icon: 'none',
                duration: 2000
              })
              return;
            }
            //拼团价格判断
            if (selProDetail.groupMoney <= 0.00) {
              wx.showToast({
                title: "对不起，该规格不参与拼团！",
                icon: 'none',
                duration: 2000
              })
              return;
            }
            var itemList = [],
              listItem = null,
              detailList = [],
              detailListItem = null,
              companyId = that.data.companyId,
              userId = appUserInfo.userId,
              mobile = appUserInfo.userMobile,
              amount = 0.00,
              currentGroup = that.data.currentGroup;

            if (currentGroup != null && currentGroup != undefined) {
              var nowDate = new Date(),
                endDate = new Date(Utils.getDateTimeStr(nowDate, "/", true));
              if (currentGroup.create_date != null && currentGroup.groupDay != null) {
                endDate = new Date(Utils.getDateTimeStr(currentGroup.create_date, "/", true));
                endDate.setDate(endDate.getDate() + currentGroup.groupDay);
              }
              if (nowDate >= endDate) {
                wx.showToast({
                  title: "对不起，该拼团活动已经结束！",
                  icon: 'none',
                  duration: 1500
                })
                return;
              }
            }

            detailListItem = {
              product_id: proDataInfo.productId,
              detail_id: selProDetail.productDetailId,
              number: 1,
              price: selProDetail.groupMoney,
              amount: selProDetail.groupMoney * 1,
            }
            detailList.push(detailListItem);
            // 1  表示团购已满
            var groupFull = 0
            if (currentGroup != null && currentGroup != undefined && (currentGroup.groupPerson - currentGroup.groupCnt == 1)) {
              groupFull = 1;
            }
            var groupUserId = userId
            //0发起拼单，1参与拼单 
            switch (ptype) {
              case 0:
                groupUserId = userId
                break;
              case 1:
                groupUserId = currentGroup != null && currentGroup != undefined ? currentGroup.userId : userId;
                break;
            }
            listItem = {
              linkNo: 3,
              amount: selProDetail.groupMoney * 1,
              companyId: proDataInfo.shopId,
              userId: userId,
              shareuserId: shareUserId,
              // 1  表示团购已满
              groupFull: groupFull,
              groupUserId: groupUserId,
              mobile: mobile,
              deliveryId: 0,
              detail: detailList
            }
            itemList.push(listItem);
            app.addSMOrderInfo(that, itemList);
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
    let windowWidth = wx.getSystemInfoSync().windowWidth; //屏幕宽度
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
    isDowithing = false
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
            isMainShopCar: false,
            isShowProductSpecs: false,
          })
          that.getMainDataList(that.data.proId);
          isDowithing = false;
          timeOutShopCar = setTimeout(that.getShoppingCartData, 500);
          timeOutCoupon = setTimeout(that.geMyCouponList, 1000);
          console.log("onShow ...")
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    try {
      if (timeOutShopCar != null && timeOutShopCar != undefined) clearTimeout(timeOutShopCar);
      if (timeOutCoupon != null && timeOutCoupon != undefined) clearTimeout(timeOutCoupon);
      if (timeOutPOrder != null && timeOutPOrder != undefined) clearTimeout(timeOutPOrder);
    } catch (err) {}
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    try {
      if (timeOutShopCar != null && timeOutShopCar != undefined) clearTimeout(timeOutShopCar);
      if (timeOutCoupon != null && timeOutCoupon != undefined) clearTimeout(timeOutCoupon);
      if (timeOutPOrder != null && timeOutPOrder != undefined) clearTimeout(timeOutPOrder);
    } catch (err) {}
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
    var urlParam = "",
      sign = "",
      idParam = "&id=" + id,
      ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + that.data.companyId,
      vtypeParam = that.data.vtype == 0 ? "" : "&isScore=1",
      channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "",
      sortParam = that.data.vtype == 1 ? "&sField=score&sOrder=asc" : "&sField=price&sOrder=asc",
      detailOrderParam = that.data.vtype == 1 ? "&sDetail=score,updateDate" : "&sDetail=price,updateDate",
      statParam = "&status=0,1";
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
            var dataItem = res.data.data[0],
              videoList = [],
              vtype = that.data.vtype,
              receiveSharePriceList = that.data.receiveSharePriceList,
              isSChgPrice = false;
            var productId = id,
              pid = 0,
              mold = 0,
              groupmold = 0,
              groupMoney = 0.00,
              photos = [],
              photosTemp = [],
              introductionImgs = [],
              productDetailList = [],
              remark = "",
              supplier = "",
              photoUrl = defaultItemImgSrc,
              qrSrc = "",
              proFirstPhoto = defaultItemImgSrc,
              isSetFirstPhoto = false,
              proHeadPhotoList = [],
              giftId = "",
              giftName = "",
              gphotos = defaultItemImgSrc,
              selDIndex = 0,
              proSDetailId = that.data.proSDetailId,
              // coupondist領取的最大抵扣券
              coupondist = 0.00,
              commission = 0.00;
            var productName = "",
              paroductNo = "",
              photosString = "",
              shopId = 0,
              shopLogo = DataURL + "/images/zz.png",
              shopType = "旗舰",
              shopName = "",
              productDetailId = "",
              status = 0,
              specPhotos = [],
              attributeOne = "",
              attributeTwo = "",
              sourcePrice = 0.00,
              sellPrice = 0.00,
              channelPrice = 0.00,
              sellScore = 0,
              dScore = 0,
              shelfStatus = 0,
              dShelfStatus = 0,
              detailPhoto = [],
              isHavePhoto = false,
              discountPrice = 0.00,
              couponMold = 0,
              couponfull = 0.00,
              couponpriceDecrement = 0.00,
              couponPrice = 0.00,
              isShowPrice1 = false,
              isShowPrice2 = false,
              isShowPrice3 = false,
              discountType = 0,
              stock = 0,
              strStock = "",
              couponsList = [],
              conponDataItem = null,
              conponDataList = null,
              deposit = 0.00,
              presellstatus = 0,
              presellEndDate = "",
              finalPayMentStartDate = "",
              finalPayMentEndDate = "",
              peDate = null,
              fsDate = null,
              feDate = null,
              optimalPrice = 0.00,
              optimalPriceName = "现价",
              sofeNum = 0,
              sn = 0,
              isCouponPrice = false;

            productId = dataItem.id;
            shopId = dataItem.companyId;
            if (dataItem.pid != null && dataItem.pid != undefined && Utils.myTrim(dataItem.pid + "") != "") {
              try {
                pid = parseInt(dataItem.pid);
                pid = isNaN(pid) ? 0 : pid;
              } catch (err) {}
            }
            //预售信息
            if (dataItem.presellstatus != null && dataItem.presellstatus != undefined && Utils.myTrim(dataItem.presellstatus + "") != "") {
              try {
                presellstatus = parseInt(dataItem.presellstatus);
                presellstatus = isNaN(presellstatus) ? 0 : presellstatus;
              } catch (err) {}
            }

            var smold = dataItem.mold + ""
            var isShop = that.data.isShop
            if (smold.indexOf("80") == 0 || smold.indexOf("81") == 0) {
              isShop = true
            }
            //商品标识,0一般，1热销，2特价，3新品 ，4预售，5软件定制，6软件代理 7软件定制试用 8软件代理试用
            if (dataItem.mold != null && dataItem.mold != undefined && Utils.myTrim(dataItem.mold + "") != "") {
              try {
                mold = parseInt(dataItem.mold);
                mold = isNaN(mold) ? 0 : mold;
              } catch (err) {}
            }
            mold = (mold >= 50 && mold < 60) ? 5 : ((mold >= 60 && mold < 70) ? 6 : mold);

            if (dataItem.deposit != null && dataItem.deposit != undefined && Utils.myTrim(dataItem.deposit + "") != "null") {
              try {
                deposit = parseFloat(dataItem.deposit);
                deposit = isNaN(deposit) ? 0 : deposit;
              } catch (err) {}
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
              } catch (err) {}
            }
            commission = parseFloat((commission).toFixed(app.data.limitQPDecCnt));
            //赠品信息
            if (dataItem.gdetailId != null && dataItem.gdetailId != undefined && Utils.myTrim(dataItem.gdetailId + "") != "null" && Utils.myTrim(dataItem.gdetailId + "") != "")
              giftId = dataItem.gdetailId;
            if (dataItem.gproductName != null && dataItem.gproductName != undefined && Utils.myTrim(dataItem.gproductName + "") != "null" && Utils.myTrim(dataItem.gproductName + "") != "")
              giftName = dataItem.gproductName;
            if (dataItem.gphotos != null && dataItem.gphotos != undefined && Utils.myTrim(dataItem.gphotos + "") != "null" && Utils.myTrim(dataItem.gphotos + "") != "") {
              photosString = "";
              photosString = dataItem.gphotos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
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
              } catch (err) {}
            }
            //劵后价
            if (dataItem.couponprice != null && dataItem.couponprice != undefined && Utils.myTrim(dataItem.couponprice + "") != "null") {
              try {
                // 没有领取也要显示劵后价(只用couponprice字段)
                coupondist = parseFloat(dataItem.couponprice);
                // coupondist = parseFloat(dataItem.coupondist);
                coupondist = isNaN(coupondist) ? 0 : coupondist;
              } catch (err) {}
            }
            if (dataItem.couponmold != null && dataItem.couponmold != undefined && Utils.myTrim(dataItem.couponmold + "") != "") {
              try {
                couponMold = parseInt(dataItem.couponmold);
                couponMold = isNaN(couponMold) ? 0 : couponMold;
              } catch (err) {}
            }
            if (dataItem.couponfull != null && dataItem.couponfull != undefined && Utils.myTrim(dataItem.couponfull + "") != "") {
              try {
                couponfull = parseFloat(dataItem.couponfull);
                couponfull = isNaN(couponfull) ? 0.00 : couponfull;
              } catch (err) {}
            }
            if (dataItem.couponprice != null && dataItem.couponprice != undefined && Utils.myTrim(dataItem.couponprice + "") != "") {
              try {
                couponpriceDecrement = parseFloat(dataItem.couponprice);
                couponpriceDecrement = isNaN(couponpriceDecrement) ? 0.00 : couponpriceDecrement;
              } catch (err) {}
            }

            if (dataItem.status != null && dataItem.status != undefined && Utils.myTrim(dataItem.status + "") != "")
              try {
                shelfStatus = parseInt(dataItem.status);
                shelfStatus = isNaN(shelfStatus) ? 0 : shelfStatus;
              } catch (err) {}

            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            if (dataItem.address != null && dataItem.address != undefined && Utils.myTrim(dataItem.address + "") != "")
              paroductNo = dataItem.address;
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              shopName = dataItem.companyName;
            if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "")
              shopType = Utils.myTrim(dataItem.companyLevel) == "0" ? "旗舰" : "普通";
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
              photosString = "";
              photosString = dataItem.photos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n];
                  photosString = photosString != null && photosString != undefined ? photosString.toLowerCase() : photosString;
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    photos.push(app.getSysImgUrl(photosTemp[n]));
                    if (Utils.myTrim(photosTemp[n] + "").indexOf("images/noimg.png") <= -1 && !isSetFirstPhoto) {
                      proFirstPhoto = photosTemp[n];
                      isSetFirstPhoto = true;
                    }
                  } else if (!Utils.isNull(photosString)) {
                    videoList.push({
                      src: photosTemp[n],
                      poster: photosTemp.length > 1 ? photosTemp[n + 1] : ""
                    });
                  }
                }
              }
            }

            isHavePhoto = photos.length > 0 ? true : isHavePhoto;
            if (dataItem.detailPhotos != null && dataItem.detailPhotos != undefined && Utils.myTrim(dataItem.detailPhotos + "") != "") {
              photosString = "";
              photosString = dataItem.detailPhotos;
              introductionImgs = [];
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
                detailItem = dataItem.detail[i];
                dlistItem = null;
                productDetailId = "";
                photosString = "";
                groupMoney = 0.00;
                status = 0;
                specPhotos = [];
                attributeOne = "";
                attributeTwo = "";
                sourcePrice = 0.00;
                sellPrice = 0.00;
                channelPrice = 0.00;
                dScore = 0;
                dShelfStatus = 0;
                detailPhoto = [];
                discountPrice = 0.00;
                couponPrice = 0.00;
                isShowPrice1 = false;
                isShowPrice2 = false;
                isShowPrice3 = false;
                discountType = 0;
                stock = 0.00;
                strStock = "0";
                sofeNum = 0;
                sn = 0;
                optimalPrice = 0.00;
                optimalPriceName = "现价";
                isSChgPrice = false;
                isCouponPrice = false;
                if (detailItem.stock != null && detailItem.stock != undefined && Utils.myTrim(detailItem.stock + "") != "" && Utils.myTrim(detailItem.stock + "null") != "") {
                  try {
                    stock = parseInt(detailItem.stock);
                    stock = isNaN(stock) ? 0 : stock;
                    stock = stock <= 0 ? 0 : stock;
                    strStock = stock + "";
                  } catch (err) {}
                }
                if (detailItem.sofeNum != null && detailItem.sofeNum != undefined && Utils.myTrim(detailItem.sofeNum + "") != "") {
                  try {
                    sofeNum = parseInt(detailItem.sofeNum);
                    sofeNum = isNaN(sofeNum) ? 0 : sofeNum;
                  } catch (err) {}
                }
                if (detailItem.sn != null && detailItem.sn != undefined && Utils.myTrim(detailItem.sn + "") != "") {
                  try {
                    sn = parseInt(detailItem.sn);
                    sn = isNaN(sn) ? 0 : sn;
                  } catch (err) {}
                }
                if (detailItem.score != null && detailItem.score != undefined && Utils.myTrim(detailItem.score + "") != "") {
                  try {
                    dScore = parseInt(detailItem.score);
                    dScore = isNaN(dScore) ? 0 : dScore;
                  } catch (err) {}
                }
                if (detailItem.groupMoney != null && detailItem.groupMoney != undefined && Utils.myTrim(detailItem.groupMoney + "") != "null") {
                  try {
                    groupMoney = parseFloat(detailItem.groupMoney);
                    groupMoney = isNaN(groupMoney) ? 0.00 : groupMoney;
                  } catch (err) {}
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
                      else
                        detailPhoto[n] = defaultItemImgSrc;
                    }
                  }
                }
                isHavePhoto = detailPhoto.length > 0 ? true : isHavePhoto;

                if (detailItem.status != null && detailItem.status != undefined && Utils.myTrim(detailItem.status + "") != "") {
                  try {
                    dShelfStatus = parseInt(detailItem.status);
                    dShelfStatus = isNaN(dShelfStatus) ? 0 : dShelfStatus;
                  } catch (err) {}
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
                    } catch (err) {}
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
                    } catch (err) {}
                  }
                  //劵后价couponMold = 0, couponfull=0.00
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

                      if (discountType < 2) {
                        if (detailItem.discount != null && detailItem.discount != undefined && Utils.myTrim(detailItem.discount + "") != "") {
                          try {
                            discountPrice = parseFloat(detailItem.discount);
                            discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                            discountPrice = sellPrice - discountPrice;
                            discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                            isShowPrice2 = discountPrice <= 0.00 ? false : true;
                          } catch (err) {}
                        }
                      }
                    } catch (err) {}
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

                dlistItem = {
                  productDetailId: productDetailId,
                  specPhotos: specPhotos,
                  attributeOne: attributeOne,
                  attributeTwo: attributeTwo,
                  isHaveTwo: Utils.myTrim(attributeTwo) != "" ? true : false,
                  sourcePrice: parseFloat(sourcePrice.toFixed(app.data.limitQPDecCnt)), //渠道价
                  sellPrice: parseFloat(sellPrice.toFixed(app.data.limitQPDecCnt)),
                  couponPrice: parseFloat(couponPrice.toFixed(app.data.limitQPDecCnt)), //劵后价
                  discountPrice: parseFloat(discountPrice.toFixed(app.data.limitQPDecCnt)), //特惠价或套装价
                  isShowPrice1: isShowPrice1,
                  isShowPrice2: isShowPrice2,
                  isShowPrice3: isShowPrice3,
                  discountType: discountType,
                  dScore: dScore,
                  dShelfStatus: dShelfStatus,
                  detailPhoto: detailPhoto,
                  stock: stock,
                  strStock: strStock,
                  groupMoney: groupMoney,
                  optimalPrice: parseFloat(optimalPrice.toFixed(app.data.limitQPDecCnt)),
                  optimalPriceName: optimalPriceName,
                  isCouponPrice: isCouponPrice,
                  sofeNum: sofeNum,
                  sn: sn,
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
              pid: pid,
              productId: productId,
              productName: Utils.myTrim(productName) != "" ? productName : remark,
              paroductNo: paroductNo,
              shopId: shopId,
              shopLogo: Utils.myTrim(shopLogo) != "" ? app.getSysImgUrl(shopLogo) : shopLogo,
              shopType: shopType,
              shopName: shopName,
              qrSrc: qrSrc,
              photos: photos,
              isHavePhoto: isHavePhoto,
              productDetailList: productDetailList,
              productDetailCnt: productDetailList.length,
              isHaveRemark: Utils.myTrim(remark) != "" ? true : false,
              remark: remark,
              supplier: supplier,
              sellScore: sellScore,
              shelfStatus: shelfStatus,
              introductionImgs: introductionImgs,
              giftId: giftId,
              giftName: giftName,
              gphotos: gphotos,
              commission: parseFloat(commission.toFixed(app.data.limitQPDecCnt)),
              couponsList: couponsList,
              couponsListCnt: couponsList.length,
              deposit: parseFloat(deposit.toFixed(app.data.limitQPDecCnt)),
              presellstatus: presellstatus,
              presellEndDate: presellEndDate,
              finalPayMentStartDate: finalPayMentStartDate,
              finalPayMentEndDate: finalPayMentEndDate,
              mold: mold,
              videoList: videoList,
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
              if ((proHeadPhotoList == null || proHeadPhotoList == undefined || proHeadPhotoList.length <= 0) && (proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0)) {
                for (var k = 0; k < proDataInfo.photos.length; k++) {
                  proHeadPhotoList.push(proDataInfo.photos.src)
                }
              }
              var shareWXImg = proHeadPhotoList != null && proHeadPhotoList != undefined && proHeadPhotoList.length > 0 ? proHeadPhotoList[0] : that.data.shareWXImg;

              that.setData({
                isShop: isShop,
                proDataInfo: proDataInfo,
                selDIndex: selDIndex,
                proFirstPhoto: proFirstPhoto,
                shareWXImg: shareWXImg,
                proHeadPhotoList: proHeadPhotoList,
                isHideGroup: groupmold == 8 ? false : true,

                buyNum: vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1,
              }, that.lazyLoadImg)
            }

            console.log("商品详情：", proDataInfo)
            console.log("商品图片：", proHeadPhotoList)
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
    var that = this;
    app.lazyLoadImgList(that, that.data.proDataInfo.photos, "img_toplist", "proDataInfo.photos");
    app.lazyLoadImgList(that, that.data.proDataInfo.introductionImgs, "img_introduce", "proDataInfo.introductionImgs");
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
            var productId = "",
              productName = "",
              paroductNo = "",
              detailId = id,
              photosString = "",
              detailPhoto = [],
              photosTemp = [],
              gIntroductionImgs = [],
              remark = "",
              attributeOne = "",
              attributeTwo = "",
              sellPrice = 0.00,
              isHaveTwo = false;
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
              detailPhoto = [];
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString[n].endsWith(".png") || photosString[n].endsWith(".jpg") || photosString[n].endsWith(".jpeg"))) {
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
              } catch (err) {}
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
  //方法：获取优惠券
  geMyCouponList: function () {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "&channelId=1";
    urlParam = "cls=product_coupons&action=QueryUserCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&companyId=" + that.data.companyId + channelParam + "&isUsed=0&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('优惠券查询列表结果：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined) {
            var dataItem = res.data.data,
              couponAlertMsg = that.data.couponAlertMsg,
              couponCnt = 0;
            try {
              couponCnt = dataItem.length;
            } catch (err) {}
            if (couponCnt > 0) {
              var moreAlert = ' 您有{{0}}张优惠券可以使用';
              moreAlert = moreAlert.replace("{{0}}", couponCnt);
              couponAlertMsg = moreAlert;
            }

            that.setData({
              couponAlertMsg: couponAlertMsg,
              couponCnt: 1,
            })
            console.log("优惠券查询结果：" + couponAlertMsg + "," + couponCnt)
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取可用优惠券：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取可用优惠券失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取可用优惠券接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取购物车信息
  getShoppingCartData: function () {
    var that = this;
    app.getShoppingCartData(that);
  },
  //方法：购买or加入购物车
  addShoppingCart: function (proDetailData, tag) {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      did = 0,
      buyNum = that.data.buyNum,
      priceflag = 0,
      sellPrice = 0.00,
      price1Param = "",
      vtype = that.data.vtype,
      selDIndex = that.data.selDIndex,
      shareUserId = 0;
    //没有分销商就取分享人ID
    shareUserId = that.data.distributorId > 0 ? that.data.distributorId : that.data.paramShareUId;
    sellPrice = proDetailData.isCouponPrice ? proDetailData.sourcePrice : proDetailData.optimalPrice;
    //priceflag：0原价, 1优惠价, 2套装价, 3特价
    if (sellPrice != proDetailData.sourcePrice) {
      priceflag = proDetailData.discountType == 0 ? 3 : 2;
      price1Param = "&finalPrice=" + sellPrice;
    } else {
      price1Param = "&finalPrice=0.00";
    }

    buyNum = buyNum > 1 ? buyNum : (vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1);
    did = proDetailData.productDetailId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "",
      giftParam = "&giftdetail=" + proDataInfo.giftId,
      price0Param = "&price=" + proDetailData.sourcePrice,
      numParam = "&num=" + buyNum,
      distributorParam = "&distributionUserId=" + shareUserId,
      priceflagParam = "&priceflag=" + priceflag;
    var appUserInfo = app.globalData.userInfo;
    urlParam = "cls=product_shopCar&action=addShopCar&userId=" + appUserInfo.userId + "&productDetailId=" + encodeURIComponent(did) + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + numParam + giftParam + channelParam + price0Param + price1Param + distributorParam + priceflagParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log(tag)
          switch (tag) {
            //加入购物车
            case 0:
              that.getShoppingCartData();
              wx.showToast({
                title: "加入购物车成功！",
                icon: 'none',
                duration: 3000
              });
              //isMainShopCar
              that.setData({
                isMainShopCar: false,
                isShowProductSpecs: false,
              })
              isDowithing = false;
              break;
              //立即购买
            case 1:
            case 11:
              var selProDetail = proDataInfo.productDetailList[selDIndex],
                sellPrice = proDataInfo.productDetailList[selDIndex].isCouponPrice ? proDataInfo.productDetailList[selDIndex].sourcePrice : proDataInfo.productDetailList[selDIndex].optimalPrice,
                vtype = that.data.vtype;
              var itemList = [],
                listItem = null,
                detailList = [],
                detailListItem = null,
                companyId = that.data.companyId,
                userId = appUserInfo.userId,
                mobile = appUserInfo.userMobile,
                amount = 0.00,
                linkNo = 0;
              //一般0,兑换1,领取2,团购3预售4            
              linkNo = proDataInfo.presellstatus == 1 ? 4 : (proDataInfo.mold == 5 ? 5 : (proDataInfo.mold == 6 ? 6 : 0));
              // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
              if (that.data.isShop) {
                linkNo = 8
              }
              detailListItem = {
                product_id: proDataInfo.productId,
                detail_id: selProDetail.productDetailId,
                number: buyNum,
                price: sellPrice,
                amount: vtype == 2 ? 0.00 : sellPrice * buyNum,
                priceflag: priceflag,
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
                //设备或来源id
                sourceId: app.data.agentDeviceId > 0 ? app.data.agentDeviceId : "",
                deliveryId: 0,
                detail: detailList
              }
              if (vtype == 2) {
                listItem.amount = 0.00;
                listItem.shareuserId = that.data.agentUserId;
                listItem.shareorderId = that.data.agentOrderId;
              }

              itemList.push(listItem);
              that.addSMOrderInfo(itemList);
              break;
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "加入购物车：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
          isDowithing = false;
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "加入购物车接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "加入购物车接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
        isDowithing = false;
      }
    })
  },

  //方法：新增订单
  addSMOrderInfo: function (itemList) {
    app.addSMOrderInfo(this, itemList);
  },
  //事件：新增积分兑换订单
  addSMScoreOrderInfo: function (e) {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      proDetailId = proDataInfo.productDetailList[selDIndex].productDetailId,
      selProDetail = proDataInfo.productDetailList[selDIndex],
      buyNum = that.data.buyNum;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中...",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    console.log("积分兑换操作：isDowithing = " + isDowithing)
    if (Utils.myTrim(proDetailId) == "") {
      wx.showToast({
        title: "请选择商品规格！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    isDowithing = true;
    buyNum = buyNum > 1 ? buyNum : 1;
    var itemList = [],
      listItem = null,
      detailList = [],
      detailListItem = null,
      companyId = proDataInfo.shopId,
      userId = appUserInfo.userId,
      mobile = appUserInfo.userMobile,
      amount = 0.00,
      shareUserId = 0;
    shareUserId = that.data.distributorId > 0 ? that.data.distributorId : that.data.paramShareUId;
    detailListItem = {
      product_id: proDataInfo.productId,
      detail_id: selProDetail.productDetailId,
      number: buyNum,
      price: selProDetail.dScore,
      amount: selProDetail.dScore * buyNum,
    }
    detailList.push(detailListItem);
    listItem = {
      linkNo: 1,
      amount: selProDetail.dScore * buyNum,
      companyId: proDataInfo.shopId,
      userId: userId,
      shareuserId: shareUserId,
      mobile: mobile,
      deliveryId: 0,
      detail: detailList
    }
    itemList.push(listItem);
    that.addSMOrderInfo(itemList);
  },
  //事件：购物操作
  addShoppingCarEvent: function (e) {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      proDetailData = null,
      ptype = 0,
      buyNum = that.data.buyNum,
      vtype = that.data.vtype;
    try {
      proDetailData = proDataInfo.productDetailList[selDIndex];
    } catch (err) {}
    try {
      ptype = parseInt(e.currentTarget.dataset.ptype);
      ptype = isNaN(ptype) ? 0 : ptype;
    } catch (err) {}
    if (appUserInfo == null) {
      that.checkUserLoginAction(2, ptype);
    } else {
      if (isDowithing) {
        wx.showToast({
          title: "操作进行中...",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      console.log("购物操作：isDowithing = " + isDowithing)
      if (proDetailData == null || proDetailData == undefined) {
        wx.showToast({
          title: "请选择商品规格！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      console.log("ccccc", proDetailData)
      //0加入购物车，1立即购买 2发起拼单 11规格上的立即购买 12规格弹窗确定（已经记录从立即购买按钮打开或加入购物车打开）
      switch (ptype) {
        case 0:
          isDowithing = true;
          that.addShoppingCart(proDetailData, ptype);
          break;
          //产品上立即购买（数量默认为1）
        case 1:
          if (proDataInfo.productDetailList[selDIndex].stock < 1) {
            wx.showToast({
              title: stockAlert,
              icon: 'none',
              duration: 2000
            })
            return;
          }
          isDowithing = true;
          that.data.buyNum = vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1; //（数量默认为1）
          that.addShoppingCart(proDetailData, ptype);
          break;
          //规格上立即购买
        case 11:
          if (proDataInfo.mold == 5) {
            //如果为定制商品
            that.getSrvOrderList();
          } else {
            //非定制商品
            that.gotoBuyQuickly();
          }

          break;

        case 12:
          //选规格操作类型：0购物车，1立即购买
          switch (that.data.selSpecOperateType) {
            case 0:
              isDowithing = true;
              //注意更改购物操作类型
              ptype = 0;
              that.addShoppingCart(proDetailData, ptype);
              break;
            case 1:
              if (proDataInfo.mold == 5) {
                //如果为定制商品
                that.getSrvOrderList();
              } else {
                buyNum = buyNum < 1 ? (vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1) : buyNum;
                if (proDataInfo.productDetailList[selDIndex].stock < buyNum) {
                  wx.showToast({
                    title: stockAlert,
                    icon: 'none',
                    duration: 2000
                  })
                  return;
                }
                isDowithing = true;
                //注意更改购物操作类型
                ptype = 11;
                that.addShoppingCart(proDetailData, ptype);
              }
              break;
          }
          break;
      }
    }
  },
  //事件：查看图片详情
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  immediatelypay: function (event) {
    wx.navigateTo({
      url: "../succeed/succeed"
    });
  },
  //事件：选择规格
  exchangeDetail: function (e) {
    var that = this,
      index = 0,
      proDataInfo = that.data.proDataInfo,
      proSDetailId = "",
      vtype = that.data.vtype;
    try {
      index = e.currentTarget.dataset.index;
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    try {
      proSDetailId = proDataInfo.productDetailList[index].productDetailId;
    } catch (err) {}

    that.setData({
      selDIndex: index,
      proSDetailId: proSDetailId,

      buyNum: vtype == 3 && proDataInfo.productDetailList[index].sofeNum > 0 ? proDataInfo.productDetailList[index].sofeNum : 1,
    })
    that.computeItemAmount();
  },

  //方法：跳转购物车页面
  gotoShoppingCart: function () {
    wx.navigateTo({
      url: mainPackageDir + "/shopcar/shopcar"
    });
  },
  //方法：跳转订单详情页面
  gotoOrderDetailPage: function (orderId, tag) {
    var that = this,
      vtype = that.data.vtype,
      url = vtype == 1 ? "../smorderdetail/smorderdetail?otype=1&orderid=" + orderId : "../shoporders/shoporders?orderid=" + orderId;

    that.setData({
      joinGroupon: false,
      joinGrouponsize: false,
    })
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
  //事件：跳到首页
  gotoHomePage: function (e) {
    wx.reLaunch({
      url: homePageUrl
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------生成宣传图片相关------------------------------------------------------------
  //分享商品详情按钮
  shareStoreDetails: function () {
    var that = this;
    that.createModalQRcard()
  },
  //方法：生成附带二维码宣传图片
  createModalQRcard: function () {
    let that = this,
      proDataInfo = that.data.proDataInfo,
      selProDetail = that.data.proDataInfo.productDetailList[0];
    let sellPriceName = selProDetail.optimalPriceName,
      sellPrice = selProDetail.optimalPrice,
      sourcePrice = selProDetail.sourcePrice,
      bgImag = "",
      priceParams = "",
      pageDataParam = "",
      pageParam = "&page=packageSMall/pages/storedetails/storedetails";
    let page = "packageSMall/pages/storedetails/storedetails",
      pageData = "pid=" + that.data.proId + "|suid=" + appUserInfo.userId + "|companyid=" + that.data.companyId,
      imgUrl = "",
      otherParams = "";

    otherParams = "&stype=1&priceinfo1=" + encodeURIComponent(sellPriceName + "：") + "¥" + sellPrice + "&priceinfo2=" + encodeURIComponent("原价：") + "¥" + sourcePrice;

    imgUrl = proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0 ? proDataInfo.photos[0].src : "";
    console.log(imgUrl)
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

  //事件：跳转店铺详情
  viewShopDetail: function (e) {
    return;
    var that = this,
      shopId = 0;
    try {
      shopId = parseInt(e.currentTarget.dataset.shopid);
      shopId = isNaN(shopId) ? 0 : shopId;
    } catch (err) {}
    wx.navigateTo({
      url: "../shopdetail/shopdetail?type=0&companyId=" + shopId
    });
  },
  hideModalsave: function () {
    this.setData({
      showModalsave: false,
    })
  },
  showModalsave: function () {
    this.setData({
      showModalsave: true,
    })
  },

  /////////////////////////////////////////////////////////
  //--------优惠券展示--------------------------------------
  //可领取优惠券查询
  queryCanCoupons: function () {
    var that = this;
    app.queryCanCoupons(that);
  },

  //方法：跳转优惠券页面
  gotoCouponPage: function () {
    var that = this;
    wx.navigateTo({
      url: "../coupon/coupon"
    });
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    var that = this,
      current = 0;
    try {
      current = parseInt(e.currentTarget.dataset.current);
      current = isNaN(current) ? 0 : current;
    } catch (err) {}
    if (that.data.currentData != current) {
      that.setData({
        currentData: current
      })
    }
  },

  //事件：隐藏分享提示弹窗
  hideShowCPAMsgPop: function (e) {
    var that = this;
    that.setData({
      isShowCPAMsg: false,
    })
  },

  /////////////////////////////////////////////////////////
  //--------商品拼团--------------------------------------
  //方法：获取商品拼团订单
  getProductOrder: function () {
    var that = this,
      productId = that.data.proDataInfo.productId;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders" + "&appId=" + app.data.appid + "&timestamp=" + timestamp +
      "&productid=" + productId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('拼团订单拼团订单：', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("拼团订单", res)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined && res.data.data.length > 0) {
          //如果是分享拼单
          var productOrder = null,
            leaveGBCnt = 0,
            gbMenList = [],
            shareGBIndex = 0,
            validList = [],
            validGBCnt = 0;
          var dataGId = "",
            create_date = new Date(),
            endDate = new Date(),
            nowDate = new Date(),
            groupDay = 0,
            groupCnt = 0,
            joinCnt = 0,
            dataItem = null;
          for (var i = 0; i < res.data.data.length; i++) {
            dataItem = null;
            dataItem = res.data.data[i];
            create_date = new Date();
            groupDay = 0;
            if (dataItem.gorderId != null && dataItem.gorderId != undefined && Utils.myTrim(dataItem.gorderId + "") != "null") {
              try {
                dataGId = Utils.myTrim(dataItem.gorderId);
              } catch (err) {}
            }
            if (dataItem.groupPerson != null && dataItem.groupPerson != undefined && Utils.myTrim(dataItem.groupPerson + "null") != "") {
              try {
                groupCnt = parseInt(dataItem.groupPerson);
                groupCnt = isNaN(groupCnt) ? 0 : groupCnt;
              } catch (err) {}
            }
            if (dataItem.groupCnt != null && dataItem.groupCnt != undefined && Utils.myTrim(dataItem.groupCnt + "null") != "") {
              try {
                joinCnt = parseInt(dataItem.groupCnt);
                joinCnt = isNaN(joinCnt) ? 0 : joinCnt;
              } catch (err) {}
            }
            if (dataItem.create_date != null && dataItem.create_date != undefined && Utils.myTrim(dataItem.create_date + "") != "null" && Utils.myTrim(dataItem.create_date + "") != "") {
              try {
                create_date = new Date(dataItem.create_date.replace(/\-/g, "/"));
              } catch (e) {}
            }
            if (dataItem.groupDay != null && dataItem.groupDay != undefined && Utils.myTrim(dataItem.groupDay + "") != "null" && Utils.myTrim(dataItem.groupDay + "") != "") {
              try {
                groupDay = parseInt(dataItem.groupDay);
                groupDay = isNaN(groupDay) ? 0 : groupDay;
              } catch (e) {}
            }
            dataItem.create_date = create_date;
            dataItem.groupDay = groupDay;
            endDate = new Date(Utils.getDateTimeStr(create_date, "/", true));
            endDate.setDate(endDate.getDate() + groupDay);
            nowDate = new Date();
            if (groupCnt > joinCnt && nowDate < endDate) {
              if (that.data.isNormalView == 0 && Utils.myTrim(that.data.groupBuyId) != "" && dataGId == Utils.myTrim(that.data.groupBuyId)) {
                shareGBIndex = i;
                leaveGBCnt = groupCnt > 0 && groupCnt > joinCnt ? groupCnt - joinCnt : 0;
              }

              validList.push(dataItem);
            }
          }
          for (var n = 0; n < groupCnt; n++) {
            if (leaveGBCnt >= groupCnt) {
              gbMenList.push(0);
            } else {
              if (n < (groupCnt - leaveGBCnt))
                gbMenList.push(1);
              else
                gbMenList.push(0);
            }
          }
          productOrder = res.data;
          productOrder.data = [];
          productOrder.data = validList;
          validGBCnt = validList.length;
          that.setData({
            productOrder: res.data,
            validGBCnt: validGBCnt,
            leaveGBCnt: leaveGBCnt,
            gbMenList: gbMenList,
            shareGBIndex: shareGBIndex,
          })
          that.setTimeCountDown()
        } else if (res.data.rspCode == 0) {
          that.setData({
            productOrder: res.data,
          })
        } else if (res.data.rspCode != 0) {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取拼团订单列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        console.log("拼团订单接口失败：" + err)
        wx.showToast({
          title: "获取拼团订单失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取拼团订单列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：设置拼团订单过期
  setProductOrderStat: function (orderId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&orderId=" + orderId + "&timestamp=" + timestamp,
      statusParam = "&status=7";
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + statusParam + "&sign=" + sign;
    console.log('设置拼团订单过期：', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("设置拼团订单过期结果：", res)
        if (res.data.rspCode == 0) {

        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "设置拼团订单过期：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        console.log("设置拼团订单过期失败：" + err)
        wx.showToast({
          title: "设置拼团订单过期失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "设置拼团订单过期：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //事件：发起拼单 参与拼单
  groupPurchase: function (e) {
    var that = this,
      ptype = 0;
    try {
      ptype = parseInt(e.currentTarget.dataset.ptype);
      ptype = isNaN(ptype) ? 0 : ptype;
    } catch (err) {}
    if (appUserInfo == null) {
      that.checkUserLoginAction(4, ptype);
    } else {
      that.data.loginAction = 4;
      that.data.loginATag = ptype;
      that.dowithAppRegLogin(9);
    }
  },
  /**设置倒计时的时间 */
  setTimeCountDown: function () {
    // let list = [{
    //   id: 1,
    //   memberNickname: '倒计时：',
    //   // 还剩下多少毫秒
    //   remainTime: 172800000
    // }];

    // this.setData({
    //   listData: list
    // });
    // this.setCountDown();

    var lists = this.data.productOrder;

    if (lists == null || lists == undefined) return;
    var myDate = new Date();
    var nowTime = myDate.getTime()
    for (let i = 0; i < lists.data.length; i++) {
      //计算得到创建时间跟当前时间的毫秒差值
      var time = Utils.getTimeInterval(Utils.getDateTimeStr(lists.data[i].create_date, "/", true), nowTime, 0)
      //计算团购时限天数条件下剩余的毫秒数
      var milliseconds = parseInt(lists.data[i].groupDay) * 24 * 60 * 60 * 1000 - time
      lists.data[i].memberNickname = '倒计时：'
      lists.data[i].remainTime = milliseconds
    }

    this.setData({
      productOrder: lists
    });
    this.setCountDown();
  },
  // 倒计时
  setCountDown: function () {
    var that = this;
    let time = 100;
    let {
      productOrder
    } = this.data;
    let list = productOrder.data.map((v, i) => {
      //过滤剩余毫秒数为0的记录
      if (v.remainTime != 0) {
        if (v.remainTime <= 0) {
          v.remainTime = 0;
        }
        let formatTime = this.getFormat(v.remainTime);
        v.remainTime -= time;
        //显示毫秒的
        // v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}.${parseInt(formatTime.ms / time)}`;
        // 没有毫秒显示
        v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;

        //更改订单状态
        if (v.remainTime <= 0) {
          try {
            that.setProductOrderStat(v.gorderId);
          } catch (err) {}
        }
      }

      return v;
    })
    this.setData({
      productOrder: productOrder
    });
    setTimeout(this.setCountDown, time);
  },

  /**
   * 格式化时间
   */
  getFormat: function (msec) {
    let ss = parseInt(msec / 1000);
    let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
      }
    }
    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return {
      ms,
      ss,
      mm,
      hh
    };
  },
  //事件：拼团列表参与拼团 
  showjoinGroupon: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      currentGroup = that.data.productOrder.data[index],
      groupPerson = currentGroup.groups,
      isGroup = false;
    var nowDate = new Date(),
      endDate = new Date(Utils.getDateTimeStr(nowDate, "/", true));
    if (currentGroup != null && currentGroup != undefined && currentGroup.create_date != null && currentGroup.groupDay != null) {
      endDate = new Date(Utils.getDateTimeStr(currentGroup.create_date, "/", true));
      endDate.setDate(endDate.getDate() + currentGroup.groupDay);
    }
    if (nowDate >= endDate) {
      wx.showToast({
        title: "对不起，该拼团活动已经结束！",
        icon: 'none',
        duration: 1500
      })
      return;
    }

    for (let i = 0; i < groupPerson.length; i++) {
      if (groupPerson[i].userId == appUserInfo.userId) {
        isGroup = true;
        break;
      }
    }
    that.setData({
      isGroup: false,
      joinGroupon: true,
      currentGroup: currentGroup,
      isGroup: isGroup,
    })
  },
  //事件：拼团分享参与拼团
  sharejoinGroupon: function (e) {
    var that = this,
      shareGBIndex = that.data.shareGBIndex,
      currentGroup = that.data.productOrder.data[shareGBIndex],
      groupPerson = currentGroup.groups,
      isGroup = false;
    var nowDate = new Date(),
      endDate = new Date(Utils.getDateTimeStr(nowDate, "/", true));
    if (currentGroup != null && currentGroup != undefined && currentGroup.create_date != null && currentGroup.groupDay != null) {
      endDate = new Date(Utils.getDateTimeStr(currentGroup.create_date, "/", true));
      endDate.setDate(endDate.getDate() + currentGroup.groupDay);
    }
    if (nowDate >= endDate) {
      wx.showToast({
        title: "对不起，该拼团活动已经结束！",
        icon: 'none',
        duration: 1500
      })
      return;
    }

    for (let i = 0; i < groupPerson.length; i++) {
      if (groupPerson[i].userId == appUserInfo.userId) {
        isGroup = true;
        break;
      }
    }
    that.setData({
      isGroup: false,
      joinGroupon: true,
      currentGroup: currentGroup,
      isGroup: isGroup,
    })
  },
  hidejoinGroupon: function () {
    this.setData({
      joinGroupon: false
    })
  },

  //弹窗 参与拼团 选择规格
  showjoinGrouponsize: function () {
    this.setData({
      joinGrouponsize: true,
      joinGroupon: false
    })
  },
  hidejoinGrouponsize: function () {
    this.setData({
      joinGrouponsize: false
    })
  },

  //事件：显示赠品信息弹窗 
  showGiftDetailPop: function (e) {
    var that = this,
      id = "";
    try {
      id = e.currentTarget.dataset.id;
    } catch (err) {}
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
  //事件：显示选择规格弹窗
  showProductSpecsPop: function () {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      vtype = that.data.vtype;
    this.setData({
      isShowProductSpecs: true,
      buyNum: vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1,
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
    } catch (err) {}
    this.setData({
      isShowProductSpecs: true,
      isMainShopCar: true,
      selSpecOperateType: selSpecOperateType,
    })
    this.computeItemAmount();
  },
  //事件：隐藏选择规格弹窗
  hideProductSpecsPop: function () {
    var that = this,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      vtype = that.data.vtype;
    this.setData({
      isShowProductSpecs: false,
      isMainShopCar: false,
      buyNum: vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1,
    })
  },
  //事件：购物车数量增减
  computeItemCount: function (e) {
    var that = this,
      tag = "",
      num = 0,
      oldNum = 0;
    try {
      tag = e.currentTarget.dataset.tag;
    } catch (err) {}
    num = that.data.buyNum;
    oldNum = num;
    switch (Utils.myTrim(tag)) {
      case "-":
        if (num <= 1) {
          wx.showToast({
            title: "数量不能小于1",
            icon: 'none',
            duration: 2000
          })
        } else {
          num--;
        }
        break;
      case "+":
        num++;
        break;
      default:
        try {
          num = parseInt(e.detail.value);
          num = isNaN(num) ? 0 : num;
        } catch (err) {}
        if (num <= 0) {
          num = oldNum;
          wx.showToast({
            title: "数量不能为0！",
            icon: 'none',
            duration: 2000
          })
        }
        break;
    }

    that.setData({
      buyNum: num,
    })
    that.computeItemAmount();
  },
  //方法：计算总价
  computeItemAmount: function () {
    var that = this,
      num = that.data.buyNum,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      selProDetail = proDataInfo.productDetailList[selDIndex],
      buyAmount = that.data.buyAmount,
      buyAmountSource = that.data.buyAmountSource,
      buyAmountDiscount = that.data.buyAmountDiscount,
      buyAmountCoupon = that.data.buyAmountCoupon;

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
  //事件：打开领劵弹窗
  showGetCouponPop: function () {
    var that = this;
    that.setData({
      getcouponpop: true
    })
    app.queryCanCoupons(that);
  },
  //事件：关闭领劵弹窗
  hideGetCouponPop: function () {
    this.setData({
      getcouponpop: false
    })
  },


  ///////////////////////////////////////////////////////
  //---领劵中心------------------------------------------
  //方法：处理优惠劵列表
  dowithCoupunData: function (couponData) {
    var that = this,
      articles = [],
      dataTem = {};

    if (couponData != null && couponData != undefined && couponData.length > 0) {
      for (var i = 0; i < couponData.length; i++) {
        dataTem = {};
        dataTem.activityId = couponData[i].activityId;
        dataTem.userId = app.globalData.userInfo.userId;
        dataTem.couponid = couponData[i].id;
        dataTem.sn = couponData[i].sn;

        dataTem.discount = couponData[i].discount;
        dataTem.mold = couponData[i].mold;
        dataTem.validday = couponData[i].validday;
        dataTem.full = couponData[i].full;
        dataTem.productNames = couponData[i].productNames;
        dataTem.typename = couponData[i].typename;
        dataTem.isGet = false;
        articles.push(dataTem);
      }
    }
    that.setData({
      articles: articles
    })
    that.getHaveUsedCoupons(articles);
  },
  //方法：获取已领取劵
  getHaveUsedCoupons: function (articles) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryUserCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.userInfo.userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + that.data.companyId + "&isUsed=0&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询优惠券', res);
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var dataTem = {},
              couponData = res.data.data;
            for (var i = 0; i < couponData.length; i++) {
              dataTem = {};
              dataTem.activityId = couponData[i].activityId;
              dataTem.userId = app.globalData.userInfo.userId;
              dataTem.couponid = couponData[i].id;
              dataTem.sn = couponData[i].sn;

              dataTem.discount = couponData[i].discount;
              dataTem.mold = couponData[i].mold;
              dataTem.validday = couponData[i].validday;
              dataTem.full = couponData[i].full;
              dataTem.productNames = couponData[i].productNames;
              dataTem.typename = couponData[i].typename;
              dataTem.isGet = true;
              articles.push(dataTem);
            }

            that.setData({
              articles: articles
            })
          }
        } else {
          app.setErrorMsg2(that, "查询已领取劵！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "无法获取已领取劵！",
            icon: 'none',
            duration: 1500
          })
        }
        if (articles.length <= 0) {
          wx.showToast({
            title: "暂无可领取优惠券！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询已领取劵！失败信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '无法获取已领取劵！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //事件：领取优惠券
  getCoupon: function (e) {
    var that = this,
      id = 0;
    try {
      id = parseInt(e.currentTarget.dataset.id);
      id = isNaN(id) ? 0 : id;
    } catch (e) {}
    if (id <= 0) {
      wx.showToast({
        title: "无效优惠券！",
        icon: 'none',
        duration: 1500
      })
    }
    that.saveCoupons(id);
  },
  //领取优惠券
  saveCoupons: function (id) {
    var that = this,
      couponData = that.data.couponData;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=SaveCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + that.data.companyId + "&sign=" + sign;
    console.log('领取优惠券：', URL + urlParam)
    var couponDataTem = [];
    for (let i = 0; i < couponData.length; i++) {
      if (id == couponData[i].id) {
        let dataTem = {};
        dataTem.activityId = couponData[i].activityId;
        dataTem.userId = app.globalData.userInfo.userId;
        dataTem.couponid = couponData[i].id;
        dataTem.sn = couponData[i].sn;
        couponDataTem = couponDataTem.concat(dataTem);
        break;
      }
    }
    console.log(JSON.stringify(couponDataTem));
    wx.request({
      url: URL + urlParam,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        data: JSON.stringify(couponDataTem)
      },
      success: function (res) {
        console.log("领取优惠券", res.data)
        if (res.data.rspCode == 0) {
          app.queryCanCoupons(that);
          wx.showToast({
            title: "领取成功！",
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: "领取优惠券失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '领取优惠券失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "领取优惠券接口调用失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取是否生成宣传图片提示
  getIsShowCADImgAlert: function () {
    var that = this,
      isShowCADImgAlert = true;

    //获取商机向导参数
    try {
      var showCADImgAlertObj = wx.getStorageSync('storedetail_prohibitCADImgMsg');
      if (showCADImgAlertObj != null && showCADImgAlertObj != undefined && Utils.myTrim(showCADImgAlertObj + "") == "1") {
        isShowCADImgAlert = false;
      }
    } catch (err) {}
    return isShowCADImgAlert;
  },
  //事件：不再提示生成宣传图片
  noAlertCADImg: function (e) {
    var that = this;
    wx.setStorageSync('storedetail_prohibitCADImgMsg', "1");
    that.setData({
      isShowCADImgAlert: false,
      isProhibitCADImgMsg: true,
    })
  },
  //事件：隐藏生成宣传图片
  hideCADImgAlert: function () {
    this.setData({
      isShowCADImgAlert: false
    })
  },
  //方法：立即购买
  gotoBuyQuickly: function () {
    var that = this,
      buyNum = that.data.buyNum,
      vtype = that.data.vtype,
      proDataInfo = that.data.proDataInfo,
      selDIndex = that.data.selDIndex,
      proDetailData = null;
    try {
      proDetailData = proDataInfo.productDetailList[selDIndex];
    } catch (err) {}
    buyNum = buyNum < 1 ? (vtype == 3 && proDataInfo.productDetailList[selDIndex].sofeNum > 0 ? proDataInfo.productDetailList[selDIndex].sofeNum : 1) : buyNum;
    if (proDataInfo.productDetailList[selDIndex].stock < buyNum) {
      wx.showToast({
        title: stockAlert,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    isDowithing = true;
    //注意更改购物操作类型
    that.addShoppingCart(proDetailData, 11);
  },
  //方法：获取服务订单列表
  getSrvOrderList: function () {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getCurSrvOrderId(that, appUserInfo.userId, "", "&status=1,2,3", 5);
  },
  //方法：获取订单号结果处理方法
  //dataItem：获取的订单数据实体
  //orderId：订单号
  //tag：调用结果：1成功，0失败
  dowithGetCurSrvOrderId: function (orderList, tag) {
    var that = this;
    wx.hideLoading();
    //1成功，0失败
    switch (tag) {
      case 1:
        if (orderList != null && orderList != undefined && orderList.length > 0) {
          wx.showModal({
            title: '提示',
            content: "尚有未完成定制订单，您确定再次购买吗？",
            cancelText: "查看订单",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.gotoBuyQuickly();
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.setData({
                  isMainShopCar: false,
                  isShowProductSpecs: false,
                })
                wx.navigateTo({
                  url: packOtherPageUrl + "/storeDLDD/storeDLDD?linkNo=5"
                });
              }
            }
          })
        } else {
          that.gotoBuyQuickly();
        }
        break;

      default:
        wx.showToast({
          title: "查询未完成订单失败！",
          icon: 'none',
          duration: 2000
        })
        that.data.isLoad = true;
        break;
    }
  },
  //////////////////////////////////////////////////////////////////////////
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;
    console.log("changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value,
      setValue = null,
      setKey = "";
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "shareprice":
        var price = 0.00,
          sn = e.currentTarget.dataset.sn,
          listItem = null,
          sharePriceArrayList = that.data.sharePriceArrayList,
          isExist = false;
        try {
          price = parseFloat(value);
          price = isNaN(price) ? 0.00 : price;
        } catch (e) {}
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
    var that = this,
      sharePriceArrayList = that.data.sharePriceArrayList;
    console.log(sharePriceArrayList);
    that.setData({
      isShowChgSharePricePop: false
    })
  },
})
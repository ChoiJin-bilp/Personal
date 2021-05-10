// pages/store/store.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  BaseURL = app.getUrlAndKey.url,
  DataURL = app.getUrlAndKey.dataUrl,
  UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = 20,
  defaultItemImgSrc = DataURL + app.data.defaultImg,
  mQRType = app.data.mQRType;
var packSMPageUrl = "../../packageSMall/pages",
  mainPackageUrl = "../../pages",
  mainFootDir = "../../",
  sOptions = null,
  timeOutChannel = null,
  timeOutShopCar = null;
var appUserInfo = app.globalData.userInfo;
var Ballheight = app.globalData.ballheight;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    isForbidRefresh: false, //是否禁止刷新
    isOpenMerchantPlatform: false, //是否开放商户平台
    mallChannelId: 0, //渠道ID
    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
    catalogs: [{
        "catalogName": "全部",
        "select": 1
      },
      {
        "catalogName": "电动牙刷",
        "select": 2
      },
      {
        "catalogName": "负离子益寿调养仪",
        "select": 3
      },
      {
        "catalogName": "微信商务平台定制",
        "select": 4
      },
      {
        "catalogName": "额温枪",
        "select": 5
      },
    ],
    catalogSelect: 1, //判断是否选中

    shoppingCartCnt: 0, //购物车数量
    paramShareUId: 0, //分享用户ID
    isQRScene: false,

    randomNum: Math.random() / 9999,

    //商品筛选条件
    isShowSearchPop: false,
    selProcuctTypeList: [{
      name: "全部",
      id: 0
    }, {
      name: "智能家居",
      id: 1
    }, {
      name: "电子牙刷",
      id: 2
    }, {
      name: "智能控制器",
      id: 3
    }, {
      name: "智能酒店",
      id: 4
    }, {
      name: "其他",
      id: 5
    }],
    selProductKeyParam: "", //筛选商品名称关键字
    selProductTypeIDParam: 0, //筛选商品类型ID
    selProductTypeNameParam: "全部", //筛选商品类型名称
    selPriceConParam: -1, //筛选价格排序：-1默认，0从低到高，1从高到低
    selPriceStartParam: '0.00', //筛选价格区间：起点价格
    selPriceEndParam: '0.00', //筛选价格区间：落点价格

    //商品过滤
    isSelFAll: true,
    isSelFNewProduct: false,
    isSelFPrice: false,

    array: [{
        quedao: '公司自营'
      },
      {
        quedao: '朋友圈广告'
      },
      {
        quedao: '头巾广告'
      }
    ],
    paixu: [{
        layer: '全部'
      },
      {
        layer: '新品'
      },
      {
        layer: '销量'
      },
      {
        layer: '价格'
      }
    ],
    id: 0,
    popditch: false,
    select: false,
    showTypeName: '商品',
    selShowType: 0, //0商品，1店铺，2组合劵商品

    isShowReceiveCouponPop: false, //是否显示 获取优惠券详情

    //二维码
    isShowQRCode: false, //是否显示二维码弹窗
    qrShowTitle: "商城首页二维码",
    qrShowImgSrc: "",

    isShowShareBtn: false, //是否显示分享按钮

    //登录操作相关参数
    loginAction: 0, //0：加载信息，1：分享
    loginATag: 0,

    //用户权限渠道
    userChannelList: [], //用户权限渠道数据集
    userChannelCnt: 0, //用户权限渠道数量

    currentShareChannelId: 0, //当前分享渠道ID
    isShowSelSChannelPop: false, //是否显示选择分享渠道弹窗
    shareWXImg: "", //分享图片

    //商品列表显示类型
    showProductType: 1, //商品列表显示类型：0 无分类+双列结构，1 分类+单列结构
    // 选中了哪个商品分类
    selProcuctTypeIndex: 0,
    // 扫码进入设备id
    deviceid: "",
    // 是否是第一次扫码进入购物
    isFirstScanCode: false,
    // 是否有店内饮品商品
    isShop: false,
    ballheight: Ballheight, //悬浮球移动面积

    synCouponId:0,          //组合劵ID
    synCouponPidList:"",    //组合劵对应商品ID列表，逗号间隔
    synRecordId:0,          //组合劵对应的按摩劵ID
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // app.data.agentCompanyId=690
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this,
      paramShareUId = 0,
      mallChannelId = 0,
      isScene = false,
      dOptions = null;
    console.log(options)
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
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
    console.log("加载参数：");
    console.log(sOptions);
    // 扫码进入设备id
    var deviceid = sOptions.deviceid;
    if (!Utils.isNull(deviceid)) {
      console.log("设备id..onLoad", deviceid);
      that.data.deviceid = deviceid;
      //如果为扫码设备进入，则默认显示可用按摩劵提示
      app.data.isShowHomeCheirapsisAlert = true;

      // 获取设备绑定相关信息
      app.getSingleDeviceInfo(that, deviceid)
      that.data.isFirstScanCode = true
    } else if (!Utils.isNull(app.data.agentDeviceId) && app.data.agentDeviceId != 0) {
      that.data.deviceid = app.data.agentDeviceId
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) {}
    that.data.paramShareUId = paramShareUId;
    try {
      if (sOptions.channelId != null && sOptions.channelId != undefined)
        mallChannelId = parseInt(sOptions.channelId);
      mallChannelId = isNaN(mallChannelId) ? 0 : mallChannelId;
    } catch (e) {}
    that.data.mallChannelId = mallChannelId;

    appUserInfo = app.globalData.userInfo;
    that.loginAction = 0;

    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },

  dowithGetSingleDeviceInfo(dataList, tag, errorInfo) {},
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        var isShowShareBtn = appUserInfo != null && appUserInfo != undefined ? true : false;
        //0：加载信息，1：分享
        switch (that.data.loginAction) {
          //0：加载信息
          case 0:

            console.log("登录后加载：......", );
            isQRScene = that.data.paramShareUId > 0 || that.data.paramShareUId == -1 ? true : isQRScene;
            var selProductKeyParam = "",
              selProductTypeIDParam = 0,
              selProductTypeNameParam = "",
              showProductType = 1;
            try {
              if (sOptions.keyword != null && sOptions.keyword != undefined)
                selProductKeyParam = decodeURIComponent(sOptions.keyword);
            } catch (e) {}
            try {
              if (sOptions.typeid != null && sOptions.typeid != undefined)
                selProductTypeIDParam = parseInt(sOptions.typeid);
              selProductTypeIDParam = isNaN(selProductTypeIDParam) ? 0 : selProductTypeIDParam;
            } catch (e) {}
            try {
              if (sOptions.type != null && sOptions.type != undefined)
                selProductTypeNameParam = decodeURIComponent(sOptions.type);
            } catch (e) {}
            try {
              if (sOptions.sptype != null && sOptions.sptype != undefined)
                showProductType = parseInt(sOptions.sptype);
              showProductType = isNaN(showProductType) ? 0 : showProductType;
            } catch (e) {}
            that.data.selProductTypeNameParam = selProductTypeNameParam;
            that.data.selProductTypeIDParam = selProductTypeIDParam;

            that.setData({
              isOpenMerchantPlatform: app.data.isOpenMerchantPlatform,
              isQRScene: isQRScene,
              isShowShareBtn: isShowShareBtn,
              selProductKeyParam: selProductKeyParam,

              showProductType: showProductType,
            })
            //检查来源是否为组合劵选择商品购买
            if(Utils.isNotNull(app.data.synCouponObj)){
              that.setData({
                ["synCouponId"]: app.data.synCouponObj.id,
                ["synCouponPidList"]: app.data.synCouponObj.mpids,
                ["synRecordId"]:app.data.synCouponObj.rid,
                ["selShowType"]:2,
              })
              app.data.synCouponObj=null;
            }else{
              that.setData({
                ["selShowType"]:0,
              })
            }
            that.getProductTypeList();
            if (appUserInfo != null && appUserInfo != undefined) {
              timeOutShopCar = setTimeout(that.getShoppingCartData, 500);
              timeOutChannel = setTimeout(that.getUserChannelList, 1000);
            }
            break;
            //1：分享
          case 1:
            break;
        }

        break;
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1];
    console.log("onShow", currentPage.options)
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    //导航条相关处理操作
    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) {
      //设置tabbar导航条当前索引位置
      app.setTabBarSelIndex(that);
    } else {
      //获取导航条
      app.getTabBarList(that, app.data.agentCompanyId, false);
    }

    // 第2次扫码进去
    if (!that.data.isFirstScanCode && !Utils.isNull(that.data.deviceid) && !Utils.isNull(currentPage.options)) {
      console.log("设备id..onShow", that.data.deviceid);
      // 获取设备绑定相关信息
      app.getSingleDeviceInfo(that, that.data.deviceid)
      // that.dowithParam(currentPage.options);
    }
    app.data.pageLayerTag = "../../";
   
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      //检查来源是否为组合劵选择商品购买
      if(Utils.isNotNull(app.data.synCouponObj)){
        that.setData({
          ["synCouponId"]: app.data.synCouponObj.id,
          ["synCouponPidList"]: app.data.synCouponObj.mpids,
          ["synRecordId"]:app.data.synCouponObj.rid,
          ["selShowType"]:2,
        })
        app.data.synCouponObj=null;
      }else{
        that.setData({
          ["selShowType"]:0,
        })
      }
      
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
        }
        if (appUserInfo != null) {
          timeOutShopCar = setTimeout(that.getShoppingCartData, 500);
          timeOutChannel = setTimeout(that.getUserChannelList, 1000);
        }
        var isShowShareBtn = appUserInfo != null && appUserInfo != undefined ? true : false;
        if (isShowShareBtn != that.data.isShowShareBtn) {
          that.setData({
            isShowShareBtn: isShowShareBtn,
          })
        }
        console.log("onShow ...")
      }
    }

    that.data.isForbidRefresh = false;
  },
  //方法：获取导航条回调方法
  dowithGetTabBarList: function () {
    let that = this;
    app.setTabBarSelIndex(that);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.data.isFirstScanCode = false
    try {
      if (timeOutShopCar != null && timeOutShopCar != undefined) clearTimeout(timeOutShopCar);
      if (timeOutChannel != null && timeOutChannel != undefined) clearTimeout(timeOutChannel);
    } catch (err) {}
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    try {
      if (timeOutShopCar != null && timeOutShopCar != undefined) clearTimeout(timeOutShopCar);
      if (timeOutChannel != null && timeOutChannel != undefined) clearTimeout(timeOutChannel);
    } catch (err) {}
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this,
      suid = appUserInfo != null && appUserInfo != undefined ? appUserInfo.userId : 0,
      channelParam = "",
      shareTitle = app.data.sysName + "商城";
    that.setData({
      isShowSelSChannelPop: false,
    })
    if (that.data.userChannelCnt <= 0 && that.data.mallChannelId > 0) {
      channelParam = "&channelId=" + that.data.mallChannelId;
    } else {
      channelParam = "&channelId=" + that.data.currentShareChannelId;
    }

    if (that.data.userChannelCnt > 0 && Utils.myTrim(that.data.shareWXImg) != "") {
      return {
        title: shareTitle,
        path: "/pages/store/store?suid=" + suid + channelParam,
        imageUrl: that.data.shareWXImg,
        success: (res) => { // 成功后要做的事情
          console.log("分享报价成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    } else {
      return {
        title: shareTitle,
        path: "/pages/store/store?suid=" + suid + channelParam,
        success: (res) => { // 成功后要做的事情
          console.log("分享报价成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----详细筛选---------------------------------------------------------
  //事件：筛选商品
  showSearchPop() {
    var that = this;
    that.setData({
      isShowSearchPop: true,
    })
  },
  //事件：关闭筛选商品
  closeSearchPop() {
    var that = this;
    that.setData({
      isShowSearchPop: false,

      selProductKeyParam: "", //筛选商品名称关键字
      selProductTypeIDParam: 0, //筛选商品类型ID
      selProductTypeNameParam: "全部", //筛选商品类型名称
      selPriceConParam: -1, //筛选价格排序：-1默认，0从低到高，1从高到低
      selPriceStartParam: '0.00', //筛选价格区间：起点价格
      selPriceEndParam: '0.00', //筛选价格区间：落点价格
    })
    that.loadInitData();
  },
  //事件：开始筛选商品
  submitSearchPop(e) {
    var that = this,
      tag = null;
    try {
      tag = e.currentTarget.dataset.tag;
    } catch (err) {}
    if (Utils.myTrim(tag) == 1) {
      var spstart = 0.00,
        spend = 0.00;
      try {
        spstart = parseFloat(that.data.selPriceStartParam);
        spstart = isNaN(spstart) ? 0.00 : spstart;
      } catch (err) {}
      try {
        spend = parseFloat(that.data.selPriceEndParam);
        spend = isNaN(spend) ? 0.00 : spend;
      } catch (err) {}
      if ((spstart > 0 || spend > 0) && (Utils.myTrim(that.data.selPriceStartParam) == '' || Utils.myTrim(that.data.selPriceEndParam) == '')) {
        wx.showToast({
          title: "价格区间两个价格需录入！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (spstart > spend && spend > 0.00) {
        wx.showToast({
          title: "起始价格不能大于结束价格！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (spstart > spend) {
        wx.showToast({
          title: "结束价格不能小于起始价格！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      that.setData({
        isShowSearchPop: false,
      })
    }
    that.loadInitData();

  },
  //事件：商品类型选择
  selectProductTypeParamCon: function (e) {
    var that = this,
      item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (err) {}
    if (item == null || item == undefined) return;
    that.setData({
      selProductTypeIDParam: item.id, //筛选商品类型ID
      selProductTypeNameParam: item.name, //筛选商品类型名称
    })
  },
  //事件：选择价格排序
  chosePriceSortColor: function (e) {
    var that = this,
      index = 0;
    try {
      index = e.currentTarget.dataset.index;
      index = isNaN(index) ? 0 : index;
    } catch (err) {}

    that.setData({
      selPriceConParam: index
    })
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;

    console.log("表单取值事件changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    var spstart = 0.00,
      spend = 0.00,
      sprdkey = that.data.selProductKeyParam;
    try {
      spstart = parseFloat(that.data.selPriceStartParam);
      spstart = isNaN(spstart) ? 0.00 : spstart;
    } catch (err) {}
    try {
      spend = parseFloat(that.data.selPriceEndParam);
      spend = isNaN(spend) ? 0.00 : spend;
    } catch (err) {}
    switch (cid) {
      case "spstart":
        value = Utils.restrictAmountValue(value, false);
        try {
          spstart = parseFloat(value);
          spstart = isNaN(spstart) ? 0.00 : spstart;
        } catch (err) {}

        that.setData({
          selPriceStartParam: value,
        })
        break;

      case "spend":
        value = Utils.restrictAmountValue(value, false);
        try {
          spend = parseFloat(value);
          spend = isNaN(spend) ? 0.00 : spend;
        } catch (err) {}

        that.setData({
          selPriceEndParam: value,
        })
        break;
      case "sprdkey":
        value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
        that.setData({
          selProductKeyParam: value,
        })
        break;
    }
  },
  //事件：页面控件聚焦事件
  focusValueMainData: function (e) {
    var that = this;

    console.log("表单聚焦事件focusValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    var spstart = 0.00,
      spend = 0.00;
    try {
      spstart = parseFloat(that.data.selPriceStartParam);
      spstart = isNaN(spstart) ? 0.00 : spstart;
    } catch (err) {}
    try {
      spend = parseFloat(that.data.selPriceEndParam);
      spend = isNaN(spend) ? 0.00 : spend;
    } catch (err) {}
    switch (cid) {
      case "spstart":
        that.setData({
          selPriceStartParam: spstart <= 0.00 ? "" : spstart,
        })
        break;

      case "spend":
        that.setData({
          selPriceEndParam: spend <= 0.00 ? "" : spend,
        })
        break;
    }
  },
  //事件：页面控件失焦事件
  blurValueMainData: function (e) {
    var that = this;

    console.log("表单失焦事件blurValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    var spstart = 0.00,
      spend = 0.00;
    try {
      spstart = parseFloat(that.data.selPriceStartParam);
      spstart = isNaN(spstart) ? 0.00 : spstart;
    } catch (err) {}
    try {
      spend = parseFloat(that.data.selPriceEndParam);
      spend = isNaN(spend) ? 0.00 : spend;
    } catch (err) {}
    switch (cid) {
      case "spstart":
        that.setData({
          selPriceStartParam: spstart <= 0.00 ? "0.00" : spstart,
        })
        break;

      case "spend":
        that.setData({
          selPriceEndParam: spend <= 0.00 ? "0.00" : spend,
        })
        break;
    }

  },
  //////////////////////////////////////////////////////////////////////
  //----商品列表---------------------------------------------------------
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData(false);
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    pageSize = 6
    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //获取商品列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this,
      noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      otherParamCon = "";
    switch (that.data.selShowType) {
      //商品列表
      case 0:
        noDataAlert = "暂无商品信息！";
        var selProductKeyParam = that.data.selProductKeyParam,
          selProductTypeIDParam = that.data.selProductTypeIDParam,
          selProductTypeNameParam = that.data.selProductTypeNameParam,
          selPriceConParam = that.data.selPriceConParam,
          selPriceStartParam = that.data.selPriceStartParam,
          selPriceEndParam = that.data.selPriceEndParam,
          spstart = 0.00,
          spend = 0.00,
          ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.agentCompanyId + "," + app.data.companyId,
          channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "",
          detailOrderParam = "&sDetail=price,updateDate",
          newProductParam = that.data.isSelFNewProduct ? "&mold=3" : ""; //, detailOrderParam ="&sDetail=price asc,updateDate desc"
        otherParamCon = "&typeflag=1";
        try {
          spstart = parseFloat(selPriceStartParam);
          spstart = isNaN(spstart) ? 0.00 : spstart;
        } catch (err) {}
        try {
          spend = parseFloat(selPriceEndParam);
          spend = isNaN(spend) ? 0.00 : spend;
        } catch (err) {}
        //商品关键字
        if (Utils.myTrim(selProductKeyParam) != '') {
          otherParamCon += "&productName=" + encodeURIComponent(selProductKeyParam);
        }
        //商品分类
        if (selProductTypeIDParam > 0 && Utils.myTrim(selProductTypeNameParam) != '') {
          otherParamCon += "&typeName=" + encodeURIComponent(selProductTypeNameParam);
        }
        // 商品标签 活动 推荐
        if (selProductTypeIDParam < 0) {
          otherParamCon += "&mold=" + that.data.selProcuctTypeList[that.data.selProcuctTypeIndex].mold;
        }
        //价格区间
        if (spstart > 0 || spend > 0) {
          otherParamCon += "&startPrice=" + spstart + "&endPrice=" + spend;
        }
        //价格排序
        if (selPriceConParam >= 0 || that.data.isSelFPrice) {
          if (selPriceConParam == 1)
            otherParamCon += "&sField=price&sOrder=desc";
          else
            otherParamCon += "&sField=price";
        }

        //CH接口
        // urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
        // sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
        // console.log('sign:' + urlParam + "&key=" + KEY)
        // urlParam = urlParam + ifOMPParam + channelParam + otherParamCon + detailOrderParam + "&userId=" + appUserInfo.userId + newProductParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
        otherParamCon += Utils.myTrim(ifOMPParam) != '' ? ifOMPParam : "";
        otherParamCon += Utils.myTrim(channelParam) != '' ? channelParam : "";
        otherParamCon += Utils.myTrim(detailOrderParam) != '' ? detailOrderParam : "";
        otherParamCon += Utils.myTrim(newProductParam) != '' ? newProductParam : "";
        app.getSoftSrvProduct(that, otherParamCon, pageSize, pageIndex);
        break;

      //店铺列表
      case 1:
        noDataAlert = "暂无店铺信息！";
        var selProductKeyParam = that.data.selProductKeyParam;
        //店铺关键字
        if (Utils.myTrim(selProductKeyParam) != '') {
          otherParamCon += "&productName=" + encodeURIComponent(selProductKeyParam);
        }
        urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
        sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
        console.log('sign:' + urlParam + "&key=" + KEY)
        urlParam = urlParam + "&isCompany=1" + otherParamCon + "&pSize=1000000&pIndex=1&sign=" + sign;
        console.log(URL + urlParam)
        console.log('~~~~~~~~~~~~~~~~~~~')
        wx.request({
          url: URL + urlParam,
          success: function (res) {
            console.log(res.data)
            wx.hideLoading();
            that.data.isLoad = true;
            if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
              var data = res.data.data,
                dataItem = null,
                detailItem = null,
                listItem = null,
                detailListItem = null,
                articles = [],
                detailList = [];
              var pid = 0,
                shopId = 0,
                shopLogo = DataURL + "/images/zz.png",
                shopType = "旗舰",
                shopName = "",
                productName = "",
                productNo = "",
                photos = "",
                remark = "",
                sourcePrice = 0.00,
                isShowPrice1 = false,
                isShowPrice2 = false,
                isShowPrice3 = false,
                discountPrice = 0.00;
              couponPrice = 0.00,
                discountType = 0,
                // coupondist領取的最大抵扣券
                coupondist = 0.00,
                sellPrice = 0.00,
                detailCnt = 0;
              for (var i = 0; i < data.length; i++) {
                dataItem = null;
                listItem = null;
                dataItem = data[i];
                shopId = 0;
                shopLogo = DataURL + "/images/zz.png";
                shopType = "旗舰";
                shopName = "";
                detailList = [];
                detailCnt = 0;
                if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "")
                  try {
                    shopId = parseInt(dataItem.companyId);
                    shopId = isNaN(shopId) ? 0 : shopId;
                  } catch (err) {}
                if (shopId <= 0) continue;

                if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
                  shopName = dataItem.companyName;
                if (dataItem.LevelName != null && dataItem.LevelName != undefined && Utils.myTrim(dataItem.LevelName + "") != "")
                  shopType = dataItem.LevelName;
                shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
                if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
                  shopLogo = dataItem.companyLogo;

                //----------
                if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
                  for (var n = 0; n < dataItem.detail.length; n++) {
                    detailCnt++;
                    if (detailCnt > 3) break;
                    detailItem = null;
                    detailItem = dataItem.detail[n];
                    pid = 0;
                    productName = "";
                    productNo = "";
                    photos = defaultItemImgSrc;
                    remark = "";
                    isShowPrice1 = false;
                    isShowPrice2 = false;
                    isShowPrice3 = false;
                    sourcePrice = 0.00;
                    discountPrice = 0.00;
                    sellPrice = 0.00;
                    discountType = 0,
                      pid = detailItem.pid;
                    if (detailItem.productName != null && detailItem.productName != undefined && Utils.myTrim(detailItem.productName + "") != "")
                      productName = detailItem.productName;
                    if (detailItem.address != null && detailItem.address != undefined && Utils.myTrim(detailItem.address + "") != "")
                      productNo = detailItem.address;
                    if (detailItem.photos != null && detailItem.photos != undefined && Utils.myTrim(detailItem.photos + "") != "")
                      photos = detailItem.photos;
                    if (detailItem.remark != null && detailItem.remark != undefined && Utils.myTrim(detailItem.remark + "") != "")
                      remark = detailItem.remark;
                    if (detailItem.minprice != null && detailItem.minprice != undefined && Utils.myTrim(detailItem.minprice + "") != "") {
                      try {
                        sourcePrice = parseFloat(detailItem.minprice);
                        sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
                      } catch (err) {}
                    }
                    if (detailItem.minstatusprice != null && detailItem.minstatusprice != undefined && Utils.myTrim(detailItem.minstatusprice + "") != "") {
                      try {
                        sellPrice = parseFloat(detailItem.minstatusprice);
                        sellPrice = isNaN(sellPrice) ? 0.00 : sellPrice;
                      } catch (err) {}
                    }

                    //劵后价couponMold = 0, couponfull=0.00
                    // if (coupondist > 0.00 && coupondist < sellPrice) {
                    //   couponPrice = sellPrice - coupondist;
                    //   if (couponPrice > 0.00) {
                    //     isShowPrice1 = true;
                    //     couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
                    //   }
                    // }
                    // //特惠价或套装价
                    // if (detailItem.way != null && detailItem.way != undefined && Utils.myTrim(detailItem.way + "") != "") {
                    //   try {
                    //     discountType = parseInt(detailItem.way);
                    //     discountType = isNaN(discountType) ? 0 : discountType;

                    //     if (discountType < 2) {
                    //       if (detailItem.discount != null && detailItem.discount != undefined && Utils.myTrim(detailItem.discount + "") != "") {
                    //         try {
                    //           discountPrice = parseFloat(detailItem.discount);
                    //           discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                    //           discountPrice = sellPrice - discountPrice;
                    //           discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                    //           isShowPrice2 = discountPrice <= 0.00 ? false : true;
                    //         } catch (err) {}
                    //       }
                    //     }
                    //   } catch (err) {}
                    // }
                    // isShowPrice3 = couponPrice > 0.00 ? (discountPrice > 0.00 && discountType == 0 ? false : true) : false;

                    detailListItem = null;
                    detailListItem = {
                      pid: pid,
                      productName: productName,
                      productNo: productNo,
                      photos: app.getSysImgUrl(photos),
                      remark: remark,
                      sourcePrice: sourcePrice,
                      sellPrice: sellPrice,
                    }
                    detailList.push(detailListItem);
                  }
                }
                shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
                listItem = {
                  shopId: shopId,
                  shopType: shopType,
                  shopLogo: shopLogo,
                  shopName: shopName,
                  detailList: detailList,
                }
                articles.push(listItem);
              }
              if (articles.length > 0) {
                // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
                var totalDataCount = that.data.totalDataCount;
                totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
                console.log("totalDataCount:" + totalDataCount);
                console.log(articles)
                // 直接将新一页的数据添加到数组里
                that.setData({
                  ["dataArray[" + pageIndex + "]"]: articles,
                  currentPage: pageIndex,
                  totalDataCount: totalDataCount
                })
              } else if (pageIndex == 1) {
                wx.showToast({
                  title: noDataAlert,
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
              app.setErrorMsg2(that, "获取店铺列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
            }
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: "获取店铺列表接口调用失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "获取店铺列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
          }
        })
        break;

      //组合劵商品列表
      case 2:
        noDataAlert = "暂无商品信息！";
        var selProductKeyParam = that.data.selProductKeyParam,selProductTypeIDParam = that.data.selProductTypeIDParam,selProductTypeNameParam = that.data.selProductTypeNameParam,selPriceConParam = that.data.selPriceConParam,selPriceStartParam = that.data.selPriceStartParam,selPriceEndParam = that.data.selPriceEndParam,spstart = 0.00,spend = 0.00,ifOMPParam = "",channelParam = "",detailOrderParam = "&sDetail=price,updateDate",newProductParam = that.data.isSelFNewProduct ? "&mold=3" : ""; 
        otherParamCon = "&status=0&lblid="+ that.data.synCouponPidList;
        //商品关键字
        if (Utils.myTrim(selProductKeyParam) != '') {
          otherParamCon += "&productName=" + encodeURIComponent(selProductKeyParam);
        }
        //商品分类
        if (selProductTypeIDParam > 0 && Utils.myTrim(selProductTypeNameParam) != '') {
          otherParamCon += "&typeName=" + encodeURIComponent(selProductTypeNameParam);
        }
        
        urlParam = "cls=product_goodtype&action=QueryProducts&appId=" + app.data.appid + "&timestamp=" + timestamp;
        sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
        console.log('sign:' + urlParam + "&key=" + KEY)
        urlParam = urlParam + otherParamCon + "&pSize="+pageSize+"&pIndex="+pageIndex+"&sign=" + sign;
        console.log(URL + urlParam)
        console.log('~~~~~~~~~~~~~~~~~~~')
        wx.request({
          url: URL + urlParam,
          success: function (res) {
            console.log(res.data)
            wx.hideLoading();
            that.data.isLoad = true;
            if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
              var data = res.data.data,
                dataItem = null,
                detailItem = null,
                listItem = null,
                detailListItem = null,
                articles = [],
                detailList = [];
              var pid = 0,
                shopId = 0,
                shopLogo = DataURL + "/images/zz.png",
                shopType = "旗舰",
                shopName = "",
                productName = "",
                productNo = "",
                photos = "",
                remark = "",
                sourcePrice = 0.00,
                isShowPrice1 = false,
                isShowPrice2 = false,
                isShowPrice3 = false,
                discountPrice = 0.00;
              couponPrice = 0.00,
                discountType = 0,
                // coupondist領取的最大抵扣券
                coupondist = 0.00,
                sellPrice = 0.00,
                detailCnt = 0;
              for (var i = 0; i < data.length; i++) {
                dataItem = null;
                listItem = null;
                dataItem = data[i];
                shopId = 0;
                shopLogo = DataURL + "/images/zz.png";
                shopType = "旗舰";
                shopName = "";
                detailList = [];
                detailCnt = 0;
                if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "")
                  try {
                    shopId = parseInt(dataItem.companyId);
                    shopId = isNaN(shopId) ? 0 : shopId;
                  } catch (err) {}
                if (shopId <= 0) continue;

                if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
                  shopName = dataItem.companyName;
                if (dataItem.LevelName != null && dataItem.LevelName != undefined && Utils.myTrim(dataItem.LevelName + "") != "")
                  shopType = dataItem.LevelName;
                shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
                if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
                  shopLogo = dataItem.companyLogo;

                //----------
                if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
                  for (var n = 0; n < dataItem.detail.length; n++) {
                    detailCnt++;
                    if (detailCnt > 3) break;
                    detailItem = null;
                    detailItem = dataItem.detail[n];
                    pid = 0;
                    productName = "";
                    productNo = "";
                    photos = defaultItemImgSrc;
                    remark = "";
                    isShowPrice1 = false;
                    isShowPrice2 = false;
                    isShowPrice3 = false;
                    sourcePrice = 0.00;
                    discountPrice = 0.00;
                    sellPrice = 0.00;
                    discountType = 0,
                      pid = detailItem.pid;
                    if (detailItem.productName != null && detailItem.productName != undefined && Utils.myTrim(detailItem.productName + "") != "")
                      productName = detailItem.productName;
                    if (detailItem.address != null && detailItem.address != undefined && Utils.myTrim(detailItem.address + "") != "")
                      productNo = detailItem.address;
                    if (detailItem.photos != null && detailItem.photos != undefined && Utils.myTrim(detailItem.photos + "") != "")
                      photos = detailItem.photos;
                    if (detailItem.remark != null && detailItem.remark != undefined && Utils.myTrim(detailItem.remark + "") != "")
                      remark = detailItem.remark;
                    if (detailItem.minprice != null && detailItem.minprice != undefined && Utils.myTrim(detailItem.minprice + "") != "") {
                      try {
                        sourcePrice = parseFloat(detailItem.minprice);
                        sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
                      } catch (err) {}
                    }
                    if (detailItem.minstatusprice != null && detailItem.minstatusprice != undefined && Utils.myTrim(detailItem.minstatusprice + "") != "") {
                      try {
                        sellPrice = parseFloat(detailItem.minstatusprice);
                        sellPrice = isNaN(sellPrice) ? 0.00 : sellPrice;
                      } catch (err) {}
                    }

                    //劵后价couponMold = 0, couponfull=0.00
                    // if (coupondist > 0.00 && coupondist < sellPrice) {
                    //   couponPrice = sellPrice - coupondist;
                    //   if (couponPrice > 0.00) {
                    //     isShowPrice1 = true;
                    //     couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
                    //   }
                    // }
                    // //特惠价或套装价
                    // if (detailItem.way != null && detailItem.way != undefined && Utils.myTrim(detailItem.way + "") != "") {
                    //   try {
                    //     discountType = parseInt(detailItem.way);
                    //     discountType = isNaN(discountType) ? 0 : discountType;

                    //     if (discountType < 2) {
                    //       if (detailItem.discount != null && detailItem.discount != undefined && Utils.myTrim(detailItem.discount + "") != "") {
                    //         try {
                    //           discountPrice = parseFloat(detailItem.discount);
                    //           discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                    //           discountPrice = sellPrice - discountPrice;
                    //           discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                    //           isShowPrice2 = discountPrice <= 0.00 ? false : true;
                    //         } catch (err) {}
                    //       }
                    //     }
                    //   } catch (err) {}
                    // }
                    // isShowPrice3 = couponPrice > 0.00 ? (discountPrice > 0.00 && discountType == 0 ? false : true) : false;

                    detailListItem = null;
                    detailListItem = {
                      pid: pid,
                      productName: productName,
                      productNo: productNo,
                      photos: app.getSysImgUrl(photos),
                      remark: remark,
                      sourcePrice: sourcePrice,
                      sellPrice: sellPrice,
                    }
                    detailList.push(detailListItem);
                  }
                }
                shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
                listItem = {
                  shopId: shopId,
                  shopType: shopType,
                  shopLogo: shopLogo,
                  shopName: shopName,
                  detailList: detailList,
                }
                articles.push(listItem);
              }
              if (articles.length > 0) {
                // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
                var totalDataCount = that.data.totalDataCount;
                totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
                console.log("totalDataCount:" + totalDataCount);
                console.log(articles)
                // 直接将新一页的数据添加到数组里
                that.setData({
                  ["dataArray[" + pageIndex + "]"]: articles,
                  currentPage: pageIndex,
                  totalDataCount: totalDataCount
                })
              } else if (pageIndex == 1) {
                wx.showToast({
                  title: noDataAlert,
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
              app.setErrorMsg2(that, "获取店铺列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
            }
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: "获取店铺列表接口调用失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "获取店铺列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
          }
        })
        break;
    }

  },
  //方法：获取代理商品结果处理函数
  dowithGetSoftSrvProduct: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,
      noDataAlert = "暂无商品信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        app.dowithProductList(that, dataList, pageIndex, noDataAlert);
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无商品！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：热销商品 IntersectionObserver 对象懒加载图片
  lazyLoadProductImg: function () {
    var that = this,
      currentPage = that.data.currentPage;
    app.lazyLoadImgList(that, that.data.dataArray[currentPage], "product_img", "dataArray[" + currentPage + "]");
  },
  //获取商品分类列表
  getProductTypeList: function (pageSize, pageIndex) {
    var that = this,
      otherParamCom = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.agentCompanyId + "," + app.data.companyId;
    otherParamCom += "&typeId=1";
    app.getProductTypeList(that, otherParamCom);
  },
  //方法：获取商品分类结果回调方法
  dowithGetProductTypeList: function (dataList, tag, errInfo) {
    let that = this;
    app.dowithGetProductTypeList(that, dataList, tag,true, errInfo);

    var selProcuctTypeList = that.data.selProcuctTypeList
    // 先把全部去掉，添加新元素
    selProcuctTypeList.splice(0, 1)
    var listItem = {
      id: -1,
      name: "推荐",
      mold: "706,716,806,816",
    }
    // 头部追加元素
    selProcuctTypeList.unshift(listItem)
    listItem = {
      id: -2,
      name: "活动",
      mold: "705,715,805,815",
    }
    selProcuctTypeList.unshift(listItem)
    listItem = {
      id: 0,
      name: "全部",
    }
    selProcuctTypeList.unshift(listItem)
    that.setData({
      selProcuctTypeList: selProcuctTypeList,
    })
    console.log(that.data.selProcuctTypeList)

    if (Utils.isNull(that.data.deviceid) || that.data.deviceid == 0) {
      that.loadInitData();
    } else {
      var isHave = false
      for (let index = 0; index < selProcuctTypeList.length; index++) {
        const element = selProcuctTypeList[index];
        if (element.name == "饮品" || element.name == "饮料") {
          that.sCatalog(index)
          isHave = true
          break
        }
      }
      if (!isHave) {
        that.loadInitData();
      }
    }
  },

  //可领取优惠券查询
  queryCanCoupons: function () {
    var that = this;
    app.queryCanCoupons(that);
  },

  //事件：浏览商品详情
  viewProductDetail: function (e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      companyId = e.currentTarget.dataset.companyid,
      url = "";
    if (Utils.myTrim(id) != "") {
      that.data.isForbidRefresh = true;
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + encodeURIComponent(id) + "&channelid=" + that.data.mallChannelId + "&companyid=" + companyId;
      if(that.data.synRecordId>0){
        url+="&srid=" + that.data.synRecordId; 
      }
      console.log("viewProductDetail:" + url)
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无效商品！",
        icon: 'none',
        duration: 2000
      })
    }
  },

  //方法：获取购物车信息
  getShoppingCartData: function () {
    var that = this;
    app.getShoppingCartData(that);
  },
  //事件：跳转到购物车列表页
  gotoShoppingCart: function (e) {
    wx.navigateTo({
      url: "../shopcar/shopcar"
    });
  },
  //事件：跳转到我的订单列表页
  gotoMyOrder: function (e) {
    wx.navigateTo({
      url: packSMPageUrl + "/myorders/myorders"
    });
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  //事件：页面浏览类型选择
  selShowType(e) {
    var that = this,
      oldShowType = that.data.selShowType,
      name = e.currentTarget.dataset.name,
      type = 0;
    try {
      type = parseInt(e.currentTarget.dataset.type);
      type = isNaN(type) ? 0 : type;
    } catch (err) {}
    that.setData({
      showTypeName: name,
      select: false,

      selShowType: type,
    })
    if (oldShowType != type)
      that.loadInitData();
  },
  //事件：跳转店铺详情
  viewShopDetail: function (e) {
    var that = this,
      shopId = 0;
    try {
      shopId = parseInt(e.currentTarget.dataset.shopid);
      shopId = isNaN(shopId) ? 0 : shopId;
    } catch (err) {}
    wx.navigateTo({
      url: packSMPageUrl + "/shopdetail/shopdetail?type=0&companyId=" + shopId
    });
  },
  hideModaluserule: function () {
    this.setData({
      isShowReceiveCouponPop: false
    })
  },

  /**
   * 查看二维码图片
   */
  showStoreMainPageQRCode: function (e) {
    var that = this;
    that.createModalQRcard()
  },
  /**
   * 生成二维码图片
   */
  createModalQRcard: function () {
    var that = this,
      page = app.data.storeShareMainPage,
      pageData = "vType=1|suid=" + appUserInfo.userId + "|channelId=" + that.data.mallChannelId,
      imgUrl = DataURL + "/tts/shop@2x.png",
      otherParams = "";
    console.log(page)
    app.createADModalQRImg(that, page, pageData, app.data.sysName + "商城", "", imgUrl, otherParams)
  },
  //方法：宣传图片生成处理方法
  setCADImgInfo: function (imgUrl) {
    var that = this;
    that.setData({
      isShowQRCode: true,
      cardImagUrl: imgUrl,
    })
  },

  /**
   * 查看二维码大图
   */
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
      qrShowImgSrc: "",
    })
  },
  //事件：跳到首页
  gotoHomePage: function (e) {
    wx.reLaunch({
      url: mainFootDir + app.data.sysMainPage
    });
  },
  //获取自定义的ID值
  choseTxtColor: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      id: id
    })
  },
  hideditch: function (e) {
    var that = this;
    that.setData({
      popditch: false,
    })
  },

  //////////////////////////////////////////////////////////////////////////
  //-------用户渠道权限分享--------------------------------------------------
  //获取商品分类列表
  getUserChannelList: function () {
    var that = this,
      noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    noDataAlert = "暂无商品分类信息！";
    urlParam = "cls=product_channel&action=QueryChannel&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&companyId=" + app.data.agentCompanyId + "," + app.data.companyId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("用户权限渠道：")
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var data = res.data.data,
            dataItem = null,
            listItem = null,
            userChannelList = [],
            userChannelCnt = 0,
            currentShareChannelId = 0,
            shareWXImg = "";
          var id = 0,
            name = "",
            qrcode = "";
          for (var i = 0; i < data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = data[i];
            id = 0;
            name = "";
            qrcode = "";
            if (dataItem.name != null && dataItem.name != undefined && Utils.myTrim(dataItem.name + "") != "")
              name = dataItem.name;
            if (dataItem.qrcode != null && dataItem.qrcode != undefined && Utils.myTrim(dataItem.qrcode + "") != "")
              qrcode = dataItem.qrcode;
            if (i == 0) {
              currentShareChannelId = dataItem.id;
              shareWXImg = qrcode;
            }

            listItem = {
              id: dataItem.id,
              name: name,
              qrcode: qrcode,
            }
            userChannelList.push(listItem);
          }
          if (userChannelList.length > 0) {
            // 直接将新一页的数据添加到数组里
            that.setData({
              userChannelList: userChannelList,
              userChannelCnt: userChannelList.length,
              currentShareChannelId: currentShareChannelId,
              shareWXImg: shareWXImg,
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取用户渠道列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取用户渠道接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取用户渠道接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //事件：选择分享渠道
  choseShareChannel: function (e) {
    var that = this,
      currentShareChannelId = 0,
      shareWXImg = "";
    try {
      currentShareChannelId = parseInt(e.currentTarget.dataset.id);
      currentShareChannelId = isNaN(currentShareChannelId) ? 0 : currentShareChannelId;
    } catch (err) {}
    try {
      shareWXImg = e.currentTarget.dataset.qrcode;
    } catch (err) {}

    that.setData({
      currentShareChannelId: currentShareChannelId,
      shareWXImg: shareWXImg,
    })
  },
  //事件：显示选择分享渠道弹窗
  showShareChannelPop: function (e) {
    var that = this;
    that.setData({
      isShowSelSChannelPop: true,
    })
  },
  //事件：关闭选择分享渠道弹窗
  hideShareChannelPop: function (e) {
    var that = this;
    that.setData({
      isShowSelSChannelPop: false,
    })
  },

  //////////////////////////////////////////////////////////////////
  //----商品过滤-----------------------------------------------------
  filterSearch: function (e) {
    var that = this,
      tag = 0,
      isSelFAll = that.data.isSelFAll,
      isSelFNewProduct = that.data.isSelFNewProduct,
      isSelFPrice = that.data.isSelFPrice,
      selPriceConParam = that.data.selPriceConParam;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) {}
    //tag:0全部，1新品，2价格
    switch (tag) {
      case 0:
        isSelFAll = true;
        isSelFNewProduct = false;
        isSelFPrice = false;
        selPriceConParam = -1;
        break;
      case 1:
        isSelFAll = false;
        isSelFNewProduct = !isSelFNewProduct;
        break;
      case 2:
        isSelFAll = false;
        isSelFPrice = true;
        selPriceConParam = selPriceConParam == -1 || selPriceConParam == 1 ? 0 : 1;
        break;
    }

    that.setData({
      isSelFAll: isSelFAll,
      isSelFNewProduct: isSelFNewProduct,
      isSelFPrice: isSelFPrice,
      selPriceConParam: selPriceConParam,
    })
    that.loadInitData();
  },
  //事件：商品分类侧边栏点击事件
  selectCatalog: function (e) {
    var index = e.currentTarget.dataset.index
    this.sCatalog(index)
  },

  /**
   * 选中分类
   */
  sCatalog: function (i) {
    var that = this,
      index = 0,
      selProcuctTypeList = that.data.selProcuctTypeList,
      selProductTypeIDParam = that.data.selProductTypeIDParam,
      selProductTypeNameParam = that.data.selProductTypeNameParam;
    try {
      index = parseInt(i);
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    if (selProcuctTypeList != null && selProcuctTypeList != undefined && selProcuctTypeList.length > 0 && selProcuctTypeList[index] != null && selProcuctTypeList[index] != undefined) {
      selProductTypeIDParam = selProcuctTypeList[index].id;
      selProductTypeNameParam = selProcuctTypeList[index].name;

      var isShop = false
      if (selProductTypeNameParam == "饮品" || selProductTypeNameParam == "饮料") {
        isShop = true
      }

      that.setData({
        selProductTypeIDParam: selProductTypeIDParam,
        selProductTypeNameParam: selProductTypeNameParam,
        selProcuctTypeIndex: index,
        isShop: isShop,
      })

      that.loadInitData();
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
      url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) {}

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },
  onReachBottom: function () {
    console.log(123);
    this.bindDownLoad()
    wx.stopPullDownRefresh()
  },

})
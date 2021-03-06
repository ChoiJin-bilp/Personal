// pages/alittle/alittle.js
const app = getApp();

var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var packSMPageUrl = "../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,sOptions = null,timeOutChrAlert = null,timeOutPrintImgList=null,timeOutGetFreeOrderRCItemList=null;
var differenheight = app.globalData.differenheight;
Page({
  data: {
    testObj:null,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1500,
    judgment: false,
    srollheight: 0,
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    isForbidRefresh: false, //是否禁止刷新
    randomNum: Math.random() / 9999,
    selProcuctTypeList: [],
    selProductTypeIndex: 0,
    //是否开放商户平台
    isOpenMerchantPlatform: false,
    // 店内饮品商品 方便兼容以前下单页面
    isShop: true,
    currentPage: 1,
    selectProductIndex: 0,
    dataArray: [],
    // 临时缓存数组
    tempDataArray: [],
    //购物车数量
    shoppingCartCnt: 0,
    shoppingCartAmount: 0,
    // 购物车的商品列表
    shopCarList: [],
    // 是否刷新数据
    isReData: true,
    //渠道ID
    mallChannelId: 0,
    isLoad: false, //是否已经加载
    synCouponId: 0, //组合劵ID
    synCouponPidList: "", //组合劵对应商品ID列表，逗号间隔
    synRecordId: 0, //组合劵对应的按摩劵ID
    synTempShopCarList: [], //组合劵临时购物车
    PotoType: false, //图案定制下拉判断
    imagerollX: 100, //图案位置X
    imagerollY: 30, //图案位置Y
    inputrollX: 50, //文字位置X
    inputrollY: 483, //文字位置Y
    imagePath: "", //返回图片地址
    imagedddType: true, //index判断
    money: "", //文字输入内容
    fileName: SMDataURL + '/images/amy-kaobei.png', //形成图片后的网络地址
    // 自定义图案价格(元)
    customizeImgPrice: 0,
    
    // 优惠券使用挑战的类型id
    couponTypeid: 0,
    // 是否获取分类商品
    isGetTypeProduct: true,

    pagetype: 0, //0点餐，1外卖
    gwNum: 0, //拼团人数
    curUserId: 0, //当前用户ID
    differenheight: differenheight, //屏幕高度

    printAllImgList:[],             //打印全部图片列表
    pSysImgList:[],                 //打印系统图片列表
    pMyImgList:[],                  //打印我的图片列表
    pOtherImgList:[],               //打印茶友图片列表

    // 选中了哪个图案
    selSysImgIndex: 0,              //打印图片索引
    selImgType:0,                   //打印图片索引类型：0系统图片，1茶友图片，2我的图片
    selPImgItem:null,
    isSelUploadImg:false,           //是否选择上传图片

    selUploadImgUrl:"",
    selUploadImgName:"",
    selPImgTag:0,                   //是否为选择更多打印图片返回：1是，0否
    isSelInList:true,

    isPreUploadPrintImage:false,    //是否预览上传图片
    isSelCheirapsisType:false,      //是否选择
    cycyVersion:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,otherParams="&companyId=" + app.data.companyId;

    //版本检查
    if (options.gwn != undefined) {
      that.setData({
        gwntype: true
      })
    }
    //获取页头Banner
    otherParams+="&urltype=3";
    app.getMainPageBannerList(that,otherParams);
    console.log("#################################################")
    var kk="2021/04/09 14:24:21";
    var kkDt=new Date(kk);
    console.log(kkDt)
    console.log(Utils.getDateTimeStr3(kkDt,"-",0))
    app.checkAndUpdateVersion();
    that.dowithParam(options);
    //判断屏幕大小
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "ios") {
          that.setData({
            systemInfo: true,
          })
        } else if (res.platform == "devtools") {
          that.setData({
            systemInfo: true,
          })
        } else if (res.platform == "android") {
          that.setData({
            systemInfo: false,
          })
        }
      }
    })
    console.log(this.data.systemInfo)
    if (this.data.differenheight > 1350 && this.data.systemInfo) {
      this.setData({
        reptype: true
      })
    }
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,
      paramShareUId = 0,
      mallChannelId = 0,
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
        //如果当前用户为合作商，则自动赋值当前用户为代理商（如果参数传递了代理商则用参数的代理商替代）
        if (appUserInfo.roleStatus == 2) {
          app.data.agentUserId = appUserInfo.userId;
        }
        let agentUserId = app.data.agentUserId,
          agentCompanyId = app.data.agentCompanyId,
          agentDeviceId = app.data.agentDeviceId,
          pagetype = 0,
          typeid = 0,
          gwNum = 0;
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
          } catch (e) {}
          app.data.agentUserId = agentUserId;
        }
        //获取代理商公司ID
        if (sOptions.acid != null && sOptions.acid != undefined) {
          try {
            agentCompanyId = parseInt(sOptions.acid);
            agentCompanyId = isNaN(agentCompanyId) ? 0 : agentCompanyId;
          } catch (e) {}
          app.data.agentCompanyId = agentCompanyId;
        }
        //获取代理商设备ID
        if (sOptions.adid != null && sOptions.adid != undefined) {
          try {
            agentDeviceId = parseInt(sOptions.adid);
            agentDeviceId = isNaN(agentDeviceId) ? 0 : agentDeviceId;
          } catch (e) {}
        }

        if (sOptions.pagetype != null && sOptions.pagetype != undefined) {
          try {
            pagetype = sOptions.pagetype;
          } catch (e) {}
        }
        if (Utils.isNotNull(sOptions.gwn)) {
          try {
            gwNum = parseInt(sOptions.gwn);
            gwNum = isNaN(gwNum) ? 0 : gwNum;
          } catch (e) {}
        }
        if (Utils.isNotNull(sOptions.typeid)) {
          try {
            typeid = parseInt(sOptions.typeid);
            typeid = isNaN(typeid) ? 0 : typeid;
          } catch (e) {}
        }
        app.data.agentDeviceId = agentDeviceId > 0 ? agentDeviceId : app.data.agentDeviceId;
        that.setData({
          ["agentUserId"]: agentUserId,
          ["agentCompanyId"]: agentCompanyId,
          ["agentDeviceId"]: agentDeviceId,
          ["agentDeviceStatus"]: app.data.agentDeviceStatus,
          ["isPayforLotteryDraw"]: app.data.isPayforLotteryDraw,
          ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,
          ["isFilterCheirapsis"]:app.data.isFilterCheirapsis,

          ["pagetype"]: pagetype,
          couponTypeid: typeid,

          ["isSetFreeCheirapsis"]: app.data.isSetFreeCheirapsis,
          ["isShowNDid"]: Utils.myTrim(app.data.sysName) == "云客茶语" ? true : false,
          ["curUserId"]: appUserInfo.userId,
        })


        app.data.agentCompanyId = app.data.companyId
        // 先获取小程序公司信息
        let mainCompanyData = app.data.mainCompanyData
        if (!Utils.isNull(mainCompanyData)) {
          that.setTitle(mainCompanyData.cName)
        }

        that.data.isOpenMerchantPlatform = app.data.isOpenMerchantPlatform;
        //检查来源是否为组合劵选择商品购买
        if (Utils.isNotNull(app.data.synCouponObj)) {
          that.setData({
            ["synCouponId"]: app.data.synCouponObj.id, //组合劵ID
            ["synCouponPidList"]: app.data.synCouponObj.mpids, //组合劵对应标签ID字符串（多个则用逗号分隔）
            ["synRecordId"]: app.data.synCouponObj.rid, //组合劵对应按摩劵ID
            ["synTempShopCarList"]: [],

            ["gwNum"]: gwNum,
          })

          app.data.synCouponObj = null; //重置“组合劵公共变量”为空
        } else {
          that.setData({
            ["synCouponId"]: 0, //组合劵ID
            ["synCouponPidList"]: "", //组合劵对应标签ID字符串（多个则用逗号分隔）
            ["synRecordId"]: 0, //组合劵对应按摩劵ID
            ["synTempShopCarList"]: [],

            ["gwNum"]: gwNum,
          })
        }
        that.getProductTypeList();
        that.getShopCar();
        that.getShoppingCartData()
        console.log(that.data.pagetype)

        timeOutChrAlert = setTimeout(that.showCheirapsisAlert, 500);
        timeOutPrintImgList = setTimeout(that.getPrintImgList, 800);
        timeOutGetFreeOrderRCItemList = setTimeout(that.getFreeOrderRechargeRankList, 1000);
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
  //方法：按摩提示
  showCheirapsisAlert: function () {
    let that = this;
    /////////////////////////////////////////////////////
    //按摩提示弹窗
    let cheirapsisAlertPopObj = null;
    cheirapsisAlertPopObj = that.selectComponent('#chsAlert');
    //如果启用多种支付方式且弹窗有效，而且不是0元支付
    if (Utils.isNotNull(cheirapsisAlertPopObj)) {
      cheirapsisAlertPopObj.queryCheirapsisDataList();
    }
  },
  //方法：获取打印图片分类结果处理函数
  dowithGetMainPageBannerList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取Banner结果：");
        console.log(dataList);
        let topBannerList = [],dataItem = null, listItem = null;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let data = dataList.dataList;
          let id = 0, imgUrl = "";
          for (var i = 0; i < data.length; i++) {
            id = 0; imgUrl = "";
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.img)){
              imgUrl = dataItem.img;
            }
            listItem = {
              id: id, imgUrl : imgUrl,
            }
            topBannerList.push(listItem);             
          }
        }
        if(topBannerList.length<=0){
          listItem = {
            id: 0, imgUrl : SMDataURL+'/images/xiejiaoba_banner_1.png',
          }
          topBannerList.push(listItem);  
        }
        that.setData({
          ["topBannerList"]: topBannerList,
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
  /**
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
    let that = this;
    if (that.data.couponTypeid > 0) {
      that.setData({
        couponTypeid: 0,
      })
    }
    try {
      if (Utils.isNotNull(timeOutChrAlert)) clearTimeout(timeOutChrAlert);
    } catch (err) {}
    try {
      if (Utils.isNotNull(timeOutPrintImgList)) clearTimeout(timeOutPrintImgList);
    } catch (err) {}
    try {
      if (Utils.isNotNull(timeOutGetFreeOrderRCItemList)) clearTimeout(timeOutGetFreeOrderRCItemList);
    } catch (err) {}
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (Utils.isNotNull(timeOutChrAlert)) clearTimeout(timeOutChrAlert);
    } catch (err) {}
    try {
      if (Utils.isNotNull(timeOutPrintImgList)) clearTimeout(timeOutPrintImgList);
    } catch (err) {}
    try {
      if (Utils.isNotNull(timeOutGetFreeOrderRCItemList)) clearTimeout(timeOutGetFreeOrderRCItemList);
    } catch (err) {}
  },
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;

    //导航条相关处理操作
    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) {
      //设置tabbar导航条当前索引位置
      app.setTabBarSelIndex(that);
    } else {
      //获取导航条
      app.getTabBarList(that, app.data.companyId, false);
    }

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        if(that.data.isForbidRefresh){
          that.getPrintImgList();
          if(that.data.selPImgTag==1){
            that.data.selPImgTag=0;
            //打印图片更多页面返回
            let id=0,imgUrl = "",name="",print_num=0,price=0.00,stype=0;
            try {
              let pages = getCurrentPages();
              let currPage = pages[pages.length - 1];
              if (Utils.isNotNull(currPage.data.paramId)) {
                try {
                  id = parseInt(currPage.data.paramId);
                  id = isNaN(id) ? 0 : id;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramPNum)) {
                try {
                  print_num = parseInt(currPage.data.paramPNum);
                  print_num = isNaN(print_num) ? 0 : print_num;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramSType)) {
                try {
                  stype = parseInt(currPage.data.paramSType);
                  stype = isNaN(stype) ? 0 : stype;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramPrice)) {
                try {
                  price = parseFloat(currPage.data.paramPrice);
                  price = isNaN(price) ? 0 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramImgUrl)) {
                imgUrl = currPage.data.paramImgUrl;
              }
              if (Utils.isNotNull(currPage.data.paramImgName)) {
                name = decodeURIComponent(currPage.data.paramImgName);
              }
              if(id>0){
                that.setData({
                  ["selImgType"]:stype,
                  ["PRReturnId"]:id,
                })
                that.getPrintImgList();
              }else{
                that.setData({
                  ["selPImgItem"]: null,
                  ["selSysImgIndex"]: -1,
                })
              }
              that.getPrintImgList();
            } catch (err) {}
            
          }else{
            
            //如果非禁止页面刷新
            if (!that.data.isForbidRefresh) {
              that.setData({
                ["shoppingCartCnt"]: 0,
              })
              // setTimeout(function () {
              //   // 提交订单后 刷新数据 把界面数字清0
              //   let dataArray = that.data.dataArray
              //   let shoppingCartCnt = that.data.shoppingCartCnt;
  
              //   if (that.data.gwNum == 0) {
              //     if (dataArray.length > 0 && shoppingCartCnt == 0) {
              //       that.setProductNumData(that, 0)
              //     }
              //   }
  
              // }, 1500)
              that.getProductTypeList();
              that.getShopCar();
              that.getShoppingCartData()
            }
          }
        }else{
          //如果没有代理商，而且当前用户为合作商，则自动赋值当前用户为代理商
          if (app.data.agentUserId <= 0 && appUserInfo.roleStatus == 2) {
            app.data.agentUserId = appUserInfo.userId;
          }
          that.setData({
            ["agentUserId"]: app.data.agentUserId,
            ["agentDeviceId"]: app.data.agentDeviceId,
            ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,

            ["selPImgItem"]:null,
            ["isSelInList"]:true,
          })

          //检查来源是否为组合劵选择商品购买
          if (Utils.isNotNull(app.data.synCouponObj)) {
            that.setData({
              ["synCouponId"]: app.data.synCouponObj.id, //组合劵ID
              ["synCouponPidList"]: app.data.synCouponObj.mpids, //组合劵对应标签ID字符串（多个则用逗号分隔）
              ["synRecordId"]: app.data.synCouponObj.rid, //组合劵对应按摩劵ID
              ["synTempShopCarList"]: [],
            })

            app.data.synCouponObj = null; //重置“组合劵公共变量”为空
          } else {
            that.setData({
              ["synCouponId"]: 0, //组合劵ID
              ["synCouponPidList"]: "", //组合劵对应标签ID字符串（多个则用逗号分隔）
              ["synRecordId"]: 0, //组合劵对应按摩劵ID
              ["synTempShopCarList"]: [],
            })
          }

          that.setData({
            ["shoppingCartCnt"]: 0,
          })
          
          that.getProductTypeList();
          that.getShopCar();
          that.getShoppingCartData()
        }
        
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
  },
  //方法：处理“更多”中选中打印图片后续逻辑
  dowithAfterSelMorePImg(id,stype,isPreviewImg){
    let that=this,pImgList=null,isSelInList=false,selSysImgIndex=-1,selPImgItem=null,printAllImgList=that.data.printAllImgList;
    switch(stype){
      case 0:
        pImgList=that.data.pSysImgList;
        break;
      case 1:
        pImgList=that.data.pOtherImgList;
        break;
      case 2:
        pImgList=that.data.pMyImgList;
        break;
    }
    if(Utils.isNotNull(pImgList) && pImgList.length>0){
      for(let i=0;i<pImgList.length;i++){
        if(pImgList[i].id==id){
          selPImgItem=pImgList[i];
          selSysImgIndex=i;
          isSelInList=true;break;
        }
      }      
    }
    if(!isSelInList && Utils.isNotNull(printAllImgList) && printAllImgList.length>0){
      for(let i=0;i<printAllImgList.length;i++){
        if(printAllImgList[i].id==id){
          selPImgItem=printAllImgList[i];
          break;
        }
      }
    }

    that.setData({
      ["selPImgItem"]:selPImgItem,
      ["isSelInList"]: isSelInList,
      ["selSysImgIndex"]:isSelInList?selSysImgIndex:-1,

      ["isPreviewImg"]:isPreviewImg,
    })
  },
  //方法：获取导航条回调方法
  dowithGetTabBarList: function () {
    let that = this;
    app.setTabBarSelIndex(that);
  },
  /**
   * 设置标题
   * @param {*} title 
   */
  setTitle(title) {
    if (!Utils.isNull(title)) {
      wx.setNavigationBarTitle({
        title: title,
      })
    }
  },
  //方法：获取购物车信息
  getShoppingCartData: function () {
    console.log("获取购物车数量")
    var that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      that.getSyncShoppingCartData();
    } else {
      var otherParam = "&shopType=3&companyId=" + app.data.agentCompanyId
      app.getShoppingCartData(that, otherParam);
    }

  },
  //方法：组合劵获取购物车信息
  getSyncShoppingCartData: function () {
    var that = this,
      shopCarList = that.data.shopCarList;
    var shoppingCartCnt = 0,
      shoppingCartAmount = 0;
    if (Utils.isNotNull(shopCarList) && shopCarList.length > 0) {
      for (let i = 0; i < shopCarList.length; i++) {
        shoppingCartCnt += shopCarList[i].num;
        shoppingCartAmount += shopCarList[i].amount;
      }
    }
    that.setData({
      ["shoppingCartCnt"]: shoppingCartCnt,
      ["shoppingCartAmount"]: shoppingCartAmount,
    })
  },
  /**
   * 购物车列表
   */
  onChagejudgment() {
    this.setData({
      judgment: !this.data.judgment,
    })
    if (this.data.judgment) {
      this.getShopCar()
    }
  },

  //获取商品分类列表
  getProductTypeList: function () {
    var that = this;
    if (that.data.gwNum > 0) {
      //【1】拼团抽奖
      let otherParam = "&status=0&companyId=" + app.data.companyId;
      otherParam += app.data.agentCompanyId > 0 && app.data.agentCompanyId != app.data.companyId ? "," + app.data.agentCompanyId : "";
      app.getGroupWorkItemList(that, otherParam);
    } else {
      //【2】点餐外卖
      var companyId = app.data.agentCompanyId
      // companyId = 5919
      var otherParamCom = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + app.data.companyId;
      // 5是饮品 1不区分饮品
      otherParamCom += "&typeId=1";
      app.getProductTypeList(that, otherParamCom);
    }

  },
  //方法：获取商品分类结果回调方法
  dowithGetProductTypeList: function (dataList, tag, errInfo) {
    let that = this;
    app.dowithGetProductTypeList(that, dataList, tag, true, errInfo);

    var selProcuctTypeList = that.data.selProcuctTypeList;
    for (let i = 0; i < selProcuctTypeList.length; i++) {
      selProcuctTypeList[i].type = 0;
    }
    // 先把全部去掉，添加新元素
    // selProcuctTypeList.splice(0, 1)
    // var listItem = {
    //   id: -1,
    //   name: "推荐",
    //   type: 0,
    //   mold: "706,716,806,816",
    // }
    // // 头部追加元素
    // selProcuctTypeList.unshift(listItem)
    // listItem = {
    //   id: -2,
    //   name: "活动",
    //   type: 0,
    //   mold: "705,715,805,815",
    // }
    // selProcuctTypeList.unshift(listItem)
    // listItem = {
    //   id: 0,
    //   name: "全部",
    //   type: 0,
    // }
    // selProcuctTypeList.unshift(listItem)
    // that.setData({
    //   selProcuctTypeList: selProcuctTypeList,
    // })
    console.log("分类列表:", selProcuctTypeList)

    // 使用优惠券跳转
    if (that.data.couponTypeid > 0) {
      let index = 0
      for (let i = 0; i < selProcuctTypeList.length; i++) {
        const element = selProcuctTypeList[i];
        if (element.id == that.data.couponTypeid) {
          index = i
          break
        }
      }
      if (index > 0) {
        that.sCatalog(index)
      } else {
        that.loadInitData();
      }
    } else {
      that.loadInitData();
    }
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
    var that = this,index = 0,selProcuctTypeList = that.data.selProcuctTypeList,selProTypeId=0;
    if (!that.data.isGetTypeProduct) {
      return
    }
    that.data.isGetTypeProduct = false
    try {
      index = parseInt(i);
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    if (selProcuctTypeList != null && selProcuctTypeList != undefined && selProcuctTypeList.length > 0 && selProcuctTypeList[index] != null && selProcuctTypeList[index] != undefined) {
      selProTypeId=selProcuctTypeList[index].id;
      let gwNum = Utils.isNotNull(selProcuctTypeList[index].type) && selProcuctTypeList[index].type == 1 ? selProcuctTypeList[index].id - 10000 : 0;

      that.setData({
        ["isSelCheirapsisType"]:selProTypeId==app.data.cheirapsisTypeId?true:false,
        ["selProductTypeIndex"]: index,
        ["gwNum"]: gwNum,
      })
      that.loadInitData();

      // 使用优惠券跳转
      if (that.data.couponTypeid > 0 && selProcuctTypeList[index].id != that.data.couponTypeid) {
        wx.showToast({
          title: "当前想使用的优惠券不支持该分类",
          icon: 'none',
          duration: 2000
        })
      }
    }
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
    // 获取第一页列表信息
    that.data.currentPage = 1
    that.queryProducts(pageSize, that.data.currentPage);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    that.data.currentPage = currentPage
    var tips = "加载第" + (currentPage) + "页";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.queryProducts(pageSize, currentPage);
  },

  /**
   * 获取饮品商品
   */
  queryProducts(pageSize, pageIndex) {
    var that = this;

    if (that.data.gwNum == 0) {
      //【1】非拼团商品列表
      var companyId = app.data.agentCompanyId
      // companyId = 5919
      var otherParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + app.data.companyId;
      var typeId = ""
      var mold = "9,70,80,71,81,705,706,715,716,805,806,815,816"
      var selProductTypeIndex = that.data.selProductTypeIndex
      // 活动和推荐
      // if (selProductTypeIndex == 1 || selProductTypeIndex == 2) {
      //   mold = that.data.selProcuctTypeList[selProductTypeIndex].mold
      // } else if (selProductTypeIndex > 0) {
      //   typeId = that.data.selProcuctTypeList[that.data.selProductTypeIndex].id
      // }

      // 去掉活动和推荐
      if (selProductTypeIndex > 0) {
        typeId = that.data.selProcuctTypeList[that.data.selProductTypeIndex].id
      }
      // 5是饮品 1不区分饮品
      otherParam = otherParam + "&status=0&typeflag=1&typeId=" + typeId + "&mold=" + mold + "&pSize=" + pageSize + "&prices=1&pIndex=" + pageIndex
      let signParam = 'cls=product_goodtype&action=QueryProducts';

      //如果为组合劵使用时选择商品
      if (that.data.synCouponId > 0) {
        otherParam = "&displayType=2&status=0&lblid=" + that.data.synCouponPidList + "&pSize=" + pageSize + "&pIndex=" + pageIndex
      }
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "获取饮品商品")
    } else {
      //【2】拼团商品列表
      let otherParam = "&num=" + that.data.gwNum + "&companyId=" + app.data.companyId;
      otherParam += app.data.agentCompanyId > 0 && app.data.agentCompanyId != app.data.companyId ? "," + app.data.agentCompanyId : "";
      app.getGWProductList(that, false, otherParam, pageSize, pageIndex);
    }
  },

  /**
   * 加减购物车
   * @param {*} productDetailId 
   * @param {*} detailLabelId 
   * @param {*} carStatus 
   * @param {*} tag 1非购物车加 2非购物车减 3购物车加 4购物车减
   */
  addShopCar(detailLabelId, carStatus, tag) {
    var userId = appUserInfo.userId
    let signParam = 'cls=product_shopCar&action=addShopCar&userId=' + userId + "&productDetailId=0"
    //  carStatus  0 加 1減  （从商品处进行加减 用于餐馆/饮品）       非必填参数 默认为0
    //  1:餐馆 2:便利店 3饮品（不传值则为商城的购物车）     非必填参数   
    var otherParam = "&detailLabelId=" + detailLabelId + "&shopType=3&carStatus=" + carStatus + "&companyId=" + app.data.agentCompanyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, tag, "加减购物车")
  },

  /**
   * 用戶购物车列表
   */
  getShopCar() {
    let that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      return;
    } else {
      var userId = appUserInfo.userId
      let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId
      var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + app.data.agentCompanyId
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 5, "用戶购物车列表")
    }
  },

  /**
   * 移除购物车中的商品 
   */
  deleteShopCarProduct(ids) {
    let that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      that.setData({
        ["shoppingCartCnt"]: 0,
        ["shoppingCartAmount"]: 0,
        ["shopCarList"]: [],
      })
      that.dealData6();
    } else {
      var userId = appUserInfo.userId
      let signParam = 'cls=product_shopCar&action=deleteShopCarProduct&ids=' + ids + "&userId=" + userId
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, "", 6, "移除购物车中的商品")
    }
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.data.isLoad = true;
            that.data.isGetTypeProduct = true
            this.setProductList(data)
            break
          case 1:
            content = "加入购物车成功"
            that.setData({
              chilType: false,
              dataArray: that.data.tempDataArray,
            })
            this.getShopCar();
            that.getShoppingCartData()
            break
          case 2:
            that.setData({
              dataArray: that.data.tempDataArray,
            })
            this.getShopCar();
            that.getShoppingCartData()
            break
          case 3:
            that.setData({
              dataArray: that.data.tempDataArray,
            })
            that.getShoppingCartData()
            that.getShopCar()
            break
          case 4:
            break
          case 5:
            that.dealData5(data)
            break
          case 6:
            content = "清空购物车成功"
            that.dealData6()
            break
        }
        if (!Utils.isNull(content)) {
          wx.showToast({
            title: content,
            icon: 'none',
            duration: 1500
          })
        }

        break;
      default:
        console.log(error)
        that.data.isGetTypeProduct = true
        break
    }
  },

  /**
   * 解析商品数据
   * @param {*} data 
   */
  setProductList(data) {
    let that = this;
    var currentPage = that.data.currentPage;
    if (data.length > 0) {
      // 购物车列表的数据
      var shopCarList = that.data.shopCarList
      // 设置标题 获取饮品详情中的公司名
      if (1 == currentPage) {
        that.setTitle(data[0].companyName)
      }

      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (Utils.isNull(element.photos)) {
          element.photo = defaultItemImgSrc
        } else {
          let photos = element.photos.split(",");
          element.photo = photos[0]
        }
        if (Utils.isNull(element.detailPhotos)) {
          var dPhotos = []
          dPhotos.push(defaultItemImgSrc)
          element.dPhotos = dPhotos
        } else {
          let dPhotos = element.detailPhotos.split(",");
          element.dPhotos = dPhotos
        }

        //显示的最低价
        element.minprice = 10000
        // 商品默认显示第一个规格的价格(不管是否有货)
        element.showprice = 0
        element.showSrcPrice = 0
        // 选择的数量
        element.num = 0
        // 弹窗显示选择的最终价格
        element.sumprice = 0
        // 显示选择了哪些规格
        element.showSelectLabels = ""
        var showSelectLabelList = []

        if (element.mold != 9) {
          // 老商品需要显示最低价格
          element.showprice = 9999
        }

        let details = element.detail
        for (let j = 0; j < details.length; j++) {
          const detail = details[j];
          // 老商品处理数据
          if (element.mold != 9) {
            //团购
            if (detail.groupmold == 8) {
              element.groupmold = 8
              if (element.showprice > detail.groupMoney) {
                element.showprice = detail.groupMoney
              }
            } else {
              if (element.showprice > detail.price) {
                element.showprice = detail.price
              }
            }
            continue
          }
          let labels = detail.labels

          // 是否默认选中了 单选默认选中 多选不需要
          let isSelect = false
          for (let k = 0; k < labels.length; k++) {
            const label = labels[k];
            label.discounts_price=Utils.isNotNull(label.discounts_price)?label.discounts_price:0.00;
            //sellPrice:正常售价——如果优惠价有效且小于正常价则取优惠价，否则取标签正常售价
            label.sellPrice=label.discounts_price>0 && label.discounts_price<label.lblprice?label.discounts_price:label.lblprice;  
            // 商品图片默认显示第一个规格的价格
            if (0 == k && j == 0) {
              element.showprice = label.sellPrice;
              element.showSrcPrice=label.lblprice;
            }
            if (label.sellPrice != 0 && element.minprice > label.sellPrice) {
              element.minprice = label.sellPrice
            }
            label.checked = false
            // 选择该规格的数量
            label.num = 0
            // 有货 单选默认选中
            if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
              label.checked = true
              element.sumprice = element.sumprice + label.sellPrice
              showSelectLabelList = showSelectLabelList.concat(label.lblname)
              isSelect = true
            }
            // 查询购物车中label选的数量
            for (let a = 0; a < shopCarList.length; a++) {
              const shopCar = shopCarList[a];
              var labList = shopCar.labList
              if (Utils.isNotNull(labList)) {
                for (let b = 0; b < labList.length; b++) {
                  const lab = labList[b];
                  if (lab.id == label.id) {
                    label.num = shopCar.num
                    break
                  }
                }
              }
            }
          }
        }
        // 查询购物车中product选的数量
        for (let a = 0; a < shopCarList.length; a++) {
          const shopCar = shopCarList[a];
          if (shopCar.productId == element.id) {
            element.num = element.num + shopCar.num
          }
          // 获取已加入购物车的图案
          element.synimage = shopCar.synimage
          element.synimage_price = shopCar.synimage_price
        }
        element.sumprice = element.sumprice.toFixed(2)
        element.showSelectLabels = showSelectLabelList.join("/")

        if(data[i].productName.indexOf("核销") >= 0)continue;
        if (data[i].productName.indexOf("按摩") >= 0 && app.data.isFilterCheirapsis) {
          //扫码按摩器后显示
          if (app.data.agentDeviceId > 0) {
            dataArray.push(data[i]);
          }
        } else {
          dataArray.push(data[i]);
        }
      }
      that.setData({
        dataArray: that.data.dataArray.concat(dataArray)
      })
      // that.setData({
      //   dataArray: that.data.dataArray.concat(data)
      // })
      console.log("解析后的商品", data)
    } else {
      if (1 == currentPage) {
        wx.showToast({
          title: "暂无商品！",
          icon: 'none',
          duration: 1500
        })
      } else {
        that.setData({
          currentPage: --currentPage
        })
        wx.showToast({
          title: "商品加载完毕！",
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  /**
   * 购物车列表数据
   * @param {*} data 
   */
  dealData5(data) {
    var that = this
    let shopCarList = data.shopCarList
    if (shopCarList.length > 0) {
      for (let i = 0; i < shopCarList.length; i++) {
        const shopCar = shopCarList[i];
        var showLabelList = []
        var labels = shopCar.labList
        for (let j = 0; j < labels.length; j++) {
          const label = labels[j];
          showLabelList = showLabelList.concat(label.lblname)
        }
        shopCar.showLabels = showLabelList.join("/")
        if (shopCar.synimage_price > 0) {
          shopCar.amount += (shopCar.synimage_price * shopCar.num)
        }
      }
      that.setData({
        shopCarList: shopCarList,
      })
    } else {
      // wx.showToast({
      //   title: "购物车里是空的",
      //   icon: 'none',
      //   duration: 1500
      // })
      that.setData({
        shopCarList: [],
      })
    }
  },
  /**
   * 清空购物车成功
   */
  dealData6() {
    var that = this

    if (that.data.gwNum == 0) {
      that.setProductNumData(that, 0)
    }


    that.setData({
      shopCarList: [],
      judgment: false,
    })
    that.getShoppingCartData()
  },

  /**
   * 设置商品显示所选的数量
   */
  setProductNumData(mainThis, num) {
    var that = mainThis
    var dataArray = that.data.dataArray

    // 把商品所显示的数量清空
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      data.num = num
      var details = data.detail
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        var labels = detail.labels
        for (let k = 0; k < labels.length; k++) {
          const label = labels[k];
          label.num = num
        }
      }
    }

    that.setData({
      dataArray: dataArray,
    })
  },

  /**
   * 选择商品规格
   * @param {*} e 
   */
  selectProductLabels(e) {
    var that = this
    var dataArray = that.data.dataArray
    var index = e.currentTarget.dataset.index
    var labelindex = e.currentTarget.dataset.labelindex
    var data = dataArray[that.data.selectProductIndex]
    var labels = data.detail[index].labels
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      // 0多选 1单选
      if (label.lblsingle == 1) {
        if (i == labelindex) {
          // 单选不能取消选中
          label.checked = true
        } else {
          label.checked = false
        }
      }
      // 多选 
      else {
        if (i == labelindex) {
          label.checked = !label.checked
          break
        }
      }
    }

    that.collectPrice()
  },

  /**
   * 汇总价格
   */
  collectPrice() {
    var that = this
    var dataArray = that.data.dataArray
    var data = dataArray[that.data.selectProductIndex]
    // 弹窗显示选择的最终价格
    var sumprice = 0
    // 显示选择了哪些规格
    var showSelectLabelList = []
    var details = data.detail,lblPrice=0.00;
    // 重新汇总所选择的商品规格
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.checked) {
          lblPrice=label.sellPrice;
          sumprice = sumprice + lblPrice
          showSelectLabelList = showSelectLabelList.concat(label.lblname)
        }
      }
    }

    // 判断是否是打印图案的商品
    if (data.photoType == 2) {
      if(Utils.isNotNull(that.data.selPImgItem)){
        sumprice = sumprice + that.data.selPImgItem.price;
      }
    }

    data.sumprice = sumprice.toFixed(2)
    data.showSelectLabels = showSelectLabelList.join("/")

    that.setData({
      dataArray: dataArray,
    })
  },

  /**
   * 商品详情弹窗
   */
  onchangedetailType(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      detailType: !this.data.detailType,
      selectProductIndex: index,
    })
  },

  /**
   * 普通商品浏览商品详情
   */
  viewProductDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = that.data.dataArray[index].pid
    var companyId = that.data.dataArray[index].companyId
    var url = "";
    if (Utils.myTrim(id) != "") {
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + encodeURIComponent(id) + "&channelid=" + that.data.mallChannelId + "&companyid=" + companyId + "&newpage=0";
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

  /**
   * 选好了
   */
  selectOK() {
    var that = this,shopCarList = that.data.shopCarList;
    //如果为组合劵选择商品购买（仅允许购买一种商品，一个数量）则不允许多选商品操作
    if (that.data.synCouponId > 0) {
      if (shopCarList.length > 0) {
        wx.showModal({
          title: '提示',
          content: '对不起，组合劵商品仅限选购一种！',
          showCancel: false,
          confirmText: "知道了",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
    }

    var dataArray = that.data.dataArray
    var data = dataArray[that.data.selectProductIndex]

    // 所选中的LabelId
    var labelIdList = []
    var showLabels = "",
      amount = 0.00;
    // var detailIdList = []

    var details = data.detail,lblPrice=0.00;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      var labels = detail.labels
      // 判断每个分类有没有选中一个的
      var isHaveSelect = false
      // 是否默认选中了 单选默认选中 多选不需要
      let isSelect = false
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.checked) {
          lblPrice=label.sellPrice;
          
          labelIdList = labelIdList.concat(label.id)
          showLabels += Utils.myTrim(showLabels) != "" ? "/" + label.lblname : label.lblname;
          // detailIdList = detailIdList.concat(label.detailId)
          isHaveSelect = true
          label.num++;
          amount += label.num * lblPrice;
        }
        // 多选可以不用选
        if (label.lblsingle == 0) {
          isHaveSelect = true
        }
        // 加入购物车后恢复默认选中 有货 单选默认选中
        if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
          label.checked = true
          isSelect = true
        } else {
          // 多选不需要默认选中
          label.checked = false
        }

      }
      if (!isHaveSelect) {
        wx.showToast({
          title: "商品规格存在缺货,请重新选择!",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }

    data.num++
    console.log("加入后购物车", dataArray)
    that.data.tempDataArray = dataArray
    var detailLabelId = labelIdList.join(",")
    // var productDetailId = detailIdList.join(",")

    // 判断是否是打印图案的商品
    let synimage = '',synimage_price = 0;
    if (data.photoType == 2) {
      if(Utils.isNotNull(that.data.selPImgItem)){
        synimage = that.data.selPImgItem.id+"|"+that.data.selPImgItem.path;
        synimage_price = that.data.selPImgItem.price;
      }else if(that.data.cycyVersion==1 && that.data.isSelUploadImg && Utils.myTrim(that.data.selUploadImgUrl) != ""){
        synimage = that.data.selUploadImgUrl;
        synimage_price = that.data.customizeImgPrice;
      }
      // 选中的图案
      data.synimage = synimage
      data.synimage_price = synimage_price
      if(that.data.synCouponId<=0){
        detailLabelId = detailLabelId + "&synimage=" + synimage + "&synimage_price=" + synimage_price
      } 
    }

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      let tmpShopCarList = that.data.shopCarList,
        shopCarListItem = null,
        isExist = false;
      let shoppingCartCnt = 0,
        shoppingCartAmount = 0;
      if (amount > 0.00) {
        amount = parseFloat((amount).toFixed(app.data.limitQPDecCnt));
      }

      shopCarListItem = {
        companyId: data.companyId,
        companyName: data.companyName,
        photos: [data.photo],
        productId: data.id,
        productName: data.productName,
        amount: amount,
        detailLabelId: detailLabelId,
        showLabels: showLabels,
        synimage:synimage,
        num: data.num
      }

      if (Utils.isNotNull(tmpShopCarList) && tmpShopCarList.length > 0) {
        for (let i = 0; i < tmpShopCarList.length; i++) {
          if (Utils.myTrim(tmpShopCarList[i].productId) == Utils.myTrim(data.id)) {
            tmpShopCarList[i] = shopCarListItem;
            shoppingCartCnt += shopCarListItem.num;
            shoppingCartAmount += shopCarListItem.amount;
            isExist = true;
          } else {
            shoppingCartCnt += tmpShopCarList[i].num;
            shoppingCartAmount += tmpShopCarList[i].amount;
          }
        }
      }
      if (!isExist) {
        tmpShopCarList.push(shopCarListItem);
        shoppingCartCnt += shopCarListItem.num;
        shoppingCartAmount += shopCarListItem.amount;
      }

      that.setData({
        ["shopCarList"]: tmpShopCarList,
        ["shoppingCartCnt"]: shoppingCartCnt,
        ["shoppingCartAmount"]: shoppingCartAmount,

        ["dataArray"]: that.data.tempDataArray,
        ["chilType"]: false,
      })
    } else {
      that.addShopCar(detailLabelId, 0, 1)
    }
  },

  /**
   * 商品处直接减少商品规格
   */
  changeCut(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var dataArray = that.data.dataArray
    var data = dataArray[index]

    // 所选中的LabelId
    var labelIdList = [];
    var showLabels = "",
      amount = 0.00;
    // var detailIdList = []
    // 判断是否可以直接减 多规格不支持直接减
    var isCanCut = false

    var details = data.detail
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      isCanCut = false
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.num > 0) {
          if (label.num == data.num) {
            isCanCut = true
            labelIdList = labelIdList.concat(label.id);
            showLabels += Utils.myTrim(showLabels) != "" ? "/" + label.lblname : label.lblname;
            // detailIdList = detailIdList.concat(label.detailId)
            label.num--;
            amount += label.num * label.sellPrice;
          } else {
            // 发现多种规格 不能直接减
            isCanCut = false
            break
          }
        }
      }

      var content = "多规格商品请去购物车删除哦"
      if (!isCanCut) {
        wx.showToast({
          title: content,
          icon: 'none',
          duration: 2500
        })
        that.setData({
          judgment: true,
          detailType: false,
        })
        return;
      }
    }
    data.num--
    var detailLabelId = labelIdList.join(",")
    // 判断选择的打印图案是否可以直接减
    if (data.photoType == 2) {
      detailLabelId = detailLabelId + "&synimage=" + data.synimage + "&synimage_price=" + data.synimage_price
    }

    // var productDetailId = detailIdList.join(",")
    that.data.tempDataArray = dataArray;

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      let shopCarList = that.data.shopCarList;
      if (amount > 0.00) {
        amount = parseFloat((amount).toFixed(app.data.limitQPDecCnt));
      }
      if (Utils.isNotNull(shopCarList) && shopCarList.length > 0) {
        let tmpShopCarList = [],
          shopCarListItem = null;
        let shoppingCartCnt = 0,
          shoppingCartAmount = 0;
        for (let i = 0; i < shopCarList.length; i++) {
          shopCarListItem = null;
          shopCarListItem = shopCarList[i];
          if (data.num > 0) {
            shopCarListItem.num = data.num;
            shopCarListItem.amount = amount;
            tmpShopCarList.push(shopCarListItem);
            shoppingCartCnt += shopCarListItem.num;
            shoppingCartAmount += shopCarListItem.amount;
          }
        }

        that.setData({
          ["shopCarList"]: tmpShopCarList,
          ["shoppingCartCnt"]: shoppingCartCnt,
          ["shoppingCartAmount"]: shoppingCartAmount,

          ["dataArray"]: that.data.tempDataArray,
        })
      }
    } else {
      that.addShopCar(detailLabelId, 1, 2)
    }

  },

  /**
   * 购物车中加减商品 0加 1减
   * @param {*} e 
   */
  changeDrinkNum(e) {
    var that = this
    let tag = e.currentTarget.dataset.tag
    var index = e.currentTarget.dataset.index
    var dataArray = that.data.dataArray
    var shopCarList = that.data.shopCarList[index]
    var labList = shopCarList.labList

    let shoppingCartCnt = that.data.shoppingCartCnt,
      shoppingCartAmount = that.data.shoppingCartAmount,
      price = 0.00;
    shoppingCartCnt -= shopCarList.num;
    shoppingCartAmount -= shopCarList.amount;
    price = shopCarList.amount / shopCarList.num;
    price = parseFloat((price).toFixed(app.data.limitQPDecCnt));
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      if (data.id == shopCarList.productId) {
        if (tag == 0) {
          data.num++
        } else {
          data.num--
        }
        shopCarList.num = data.num;
        shopCarList.amount = data.num * price;
      }

      var details = data.detail
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        var labels = detail.labels
        for (let k = 0; k < labels.length; k++) {
          const label = labels[k];
          for (let a = 0; a < labList.length; a++) {
            const lab = labList[a];
            if (lab.id == label.id) {
              if (tag == 0) {
                label.num++
              } else {
                label.num--
              }
              break
            }
          }
        }
      }
    }

    that.data.tempDataArray = dataArray

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      shoppingCartCnt += shopCarList.num;
      shoppingCartAmount += shopCarList.amount;
      let setKey = "shopCarList[" + index + "]";

      that.setData({
        [setKey]: shopCarList,
        ["shoppingCartCnt"]: shoppingCartCnt,
        ["shoppingCartAmount"]: shoppingCartAmount,

        ["dataArray"]: that.data.tempDataArray,
      })
    } else {
      that.addShopCar(shopCarList.detailLabelId + "&synimage=" + shopCarList.synimage + "&synimage_price=" + shopCarList.synimage_price, tag, 3)
    }

  },

  /**
   * 清空购物车
   */
  clearShopCar() {
    var that = this
    var shopCarList = that.data.shopCarList
    if (shopCarList.length == 0) {
      // wx.showToast({
      //   title: "购物车是空的",
      //   icon: 'none',
      //   duration: 2000
      // })
      return
    }
    wx.showModal({
      title: '提示',
      confirmText: '确定',
      content: '确定清空购物车?',
      success(res) {
        if (res.confirm) {
          var shopCarId = []
          for (let i = 0; i < shopCarList.length; i++) {
            const shopCar = shopCarList[i];
            shopCarId = shopCarId.concat(shopCar.id)
          }
          that.deleteShopCarProduct(shopCarId.join(","))
        } else if (res.cancel) {}
      }
    })
  },

  /*隐藏所有弹窗*/
  emptyType() {
    if (this.data.isUploadImg) {
      this.setData({
        isUploadImg: false,
        imagerollX: 100, //图案位置X
        imagerollY: 30, //图案位置Y
        inputrollX: 50, //文字位置X
        inputrollY: 483, //文字位置Y
        money: "", //文字输入内容
        imagedddType: true
      })
    } else if (this.data.isPreviewImg) {
      this.setData({
        isPreviewImg: false
      })
    } else {
      this.setData({
        judgment: false,
        detailType: false,
        chilType: false,
        isUploadImg: false
      })
    }

  },
  //加饮品 出现弹窗
  addProcuctnum(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    //如果为组合劵选择商品购买（仅允许购买一种商品，一个数量）则不允许增加数量操作
    var dataArray = that.data.dataArray;
    var data = dataArray[index];
    if (that.data.synCouponId > 0) {
      if (Utils.isNotNull(data) && data.num > 0) {
        wx.showModal({
          title: '提示',
          content: '对不起，组合劵商品仅限购买一份！',
          showCancel: false,
          confirmText: "知道了",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
    }

    this.setData({
      chilType: !this.data.chilType,
      selectProductIndex: index,
      detailType: false,

      ["selPImgItem"]:null,
      ["selSysImgIndex"]:-1,
      ["selUploadImgUrl"]:'',          //清空上传打印图片
    })
  },

  changechilType(e) {
    this.setData({
      chilType: !this.data.chilType,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadInitData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 去结算
   */
  gotoPage() {
    let that = this,
      url = "";
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      if (Utils.isNotNull(that.data.shopCarList) && that.data.shopCarList.length > 0) {
        app.data.synShopCarList = that.data.shopCarList;
      } else {
        wx.showToast({
          title: "请选择商品！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }

    //app.data.synShopCarList
    url = that.data.synRecordId > 0 ? "/packageYK/pages/amited/amited?rid=" + that.data.synRecordId : "/packageYK/pages/amited/amited?pagetype=" + that.data.pagetype;
    wx.navigateTo({
      url: url
    });
  },
  //事件：打印图片显示更多
  showMoreDetail(e) {
    let that=this,stype=0;
    try {
      stype = parseInt(e.currentTarget.dataset.stype);
      stype = isNaN(stype) ? 0 : stype;
    } catch (e) {}
    that.setData({
      ["PotoType"]: !this.data.PotoType,
      ["sMType"]:stype,
    })
  },
  compileTox() {
    this.setData({
      isUploadImg: !this.data.isUploadImg
    })
  },
  //事件：选择打印图片
  selectCustomizeImg(e) {
    let that = this,stype=0,isprev=0,index=0,self=0,selImgType=that.data.selImgType,selSysImgIndex=that.data.selSysImgIndex,isPreviewImg=false;
    try {
      stype = parseInt(e.currentTarget.dataset.stype);
      stype = isNaN(stype) ? 0 : stype;
    } catch (e) {}
    //isprev 是否预览图片：0否，1是
    try {
      isprev = parseInt(e.currentTarget.dataset.isprev);
      isprev = isNaN(isprev) ? 0 : isprev;
    } catch (e) {}
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? 0 : index;
    } catch (e) {}
    try {
      self = parseInt(e.currentTarget.dataset.self);
      self = isNaN(self) ? 0 : self;
    } catch (e) {}
    //如果选择同一个，且不为预览则为取消选择
    if ((self==1 || selSysImgIndex == index) && selImgType==stype && isprev==0) {
      that.setData({
        ["selSysImgIndex"]: -1,
  
        ["selPImgItem"]:null,
      })
    }else{
      let pImgList=[],selPImgItem=that.data.selPImgItem,selID=0;
      if(self!=1){
        //不是已选中项的操作
        switch(stype){
          case 0:
            pImgList=that.data.pSysImgList;
            break;
          case 1:
            pImgList=that.data.pOtherImgList;
            break;
          case 2:
            pImgList=that.data.pMyImgList;
            break;
        }
        selID=pImgList[index].id;
      }else{
        //选中项的操作
        selID=Utils.isNotNull(selPImgItem)?selPImgItem.id:0;
        index=-1;
      }
      
      isPreviewImg=isprev==1?true:isPreviewImg;
      that.setData({
        ["selSysImgIndex"]: index,
        ["selImgType"]:stype,
        ["isPreUploadPrintImage"]:false,

        ["isSelUploadImg"]:false,
      })
      that.dowithAfterSelMorePImg(selID,stype,isPreviewImg);
    }
   
    that.collectPrice()
  },
  preUploadPrintImage:function(e){
    let that=this;
    that.setData({
      ["isPreviewImg"]:true,
      ["isPreUploadPrintImage"]: true,
    })
  },
  //事件：预览打印图片
  previewImageDetail(e) {
    let that = this,stype=0,tag=0,index=0;
    try {
      stype = parseInt(e.currentTarget.dataset.stype);
      stype = isNaN(stype) ? 0 : stype;
    } catch (e) {}
    try{
      tag=parseInt(e.currentTarget.dataset.tag);
      tag=isNaN(tag)?0:tag;
    }catch(e){}
    try{
      index=parseInt(e.currentTarget.dataset.index);
      index=isNaN(index)?0:index;
    }catch(e){}
    
    switch(tag){
      case 0:
        if(index>=0){
          that.setData({
            ["isPreviewImg"]: !this.data.isPreviewImg,
            ["selSysImgIndex"]: index,
            ["selImgType"]:stype,
          })
        }else{
          that.setData({
            ["isPreviewImg"]: !this.data.isPreviewImg,
          })
        }
        break;
      default:
        that.setData({
          ["isPreviewImg"]: !this.data.isPreviewImg,
        })
        break;
    }
  },
  //事件：隐藏预览图片
  hidePreviewImageDetail:function(e){
    let that=this;
    that.setData({
      ["isPreviewImg"]: false,
      ["isPreUploadPrintImage"]:false,
    })
  },
  /*
    ---------------------------------------------------------------------绘制图片方法-------------------------------------------------------------
  */
  changeinpoy(e) {
    this.setData({
      money: e.detail.value
    })
  },
  changeball(e) {
    var tag = e.currentTarget.dataset.tag

    if (tag == 1) {
      this.setData({
        buuunum: 1
      })
    } else {
      this.setData({
        buuunum: 2
      })
    }
  },
  changeba(e) {
    var tag = e.currentTarget.dataset.tag
    var that = this
    const query = wx.createSelectorQuery()
    query.select('#area').boundingClientRect().selectViewport().scrollOffset().exec()
    query.select('#areaimage').boundingClientRect().selectViewport().scrollOffset().exec()
    query.select('#areainput').boundingClientRect().selectViewport().scrollOffset().exec(function (res) {
      if (tag == 1) {
        var srollx = res[4].left - res[0].left
        var srolly = res[4].top - res[0].top
        that.setData({
          inputrollX: srollx,
          inputrollY: srolly,
        })
      } else {
        var srollx = res[2].left - res[0].left
        var srolly = res[2].top - res[0].top
        that.setData({
          imagerollX: srollx,
          imagerollY: srolly,
        })
      }
    })
  },
  Touptch() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(res.tempFilePaths[0])
        that.setData({
          imagePath: res.tempFilePaths[0],
          imagedddType: false,
        })
      }
    })
  },
  createNewImg: function () {
    var that = this;
    const context = wx.createCanvasContext('mycanvas');
    var path = "car.png";
    // var path = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3302399998,3216746631&fm=26&gp=0.jpg";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    // context.drawImage(path, 0, 0,686,686);
    // context.drawImage(path, 0, 0,200,200);
    //t图片显示
    this.setMoney(context);
    //备注显示
    this.setName(context);
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    wx.showLoading({
      title: "图片处理中...",
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          var URL = app.getUrlAndKey.url,
            appUserInfo = app.globalData.userInfo;
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
          var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
          console.log('sign:' + urlParam + "&key=" + KEY)
          urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
          wx.uploadFile({
            url: URL + urlParam,
            filePath: tempFilePath,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              wx.hideLoading();
              var data = null;
              data = JSON.parse(res.data.replace(/\"/g, "\""));
              console.log(data)
              var fileName = data.data.fileName
              //恢复默认样式
              that.setData({
                fileName: fileName,
                isUploadImg: false,
                imagerollX: 100, //图案位置X
                imagerollY: 30, //图案位置Y
                inputrollX: 50, //文字位置X
                inputrollY: 483, //文字位置Y
                money: "", //文字输入内容
                imagedddType: true
              })
            },
            fail: function (e) {}
          })
          that.setData({
            // canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      }, that);
    }, 2000);
  },

  //将图片绘制到canvas的固定
  setMoney: function (context) {
    var path = this.data.imagePath;
    var imagerollX = this.data.imagerollX * 1.5
    var imagerollY = this.data.imagerollY * 1.5
    context.drawImage(path, imagerollX, imagerollY, 90, 90);
    // context.setFontSize(24);
    // context.setFillStyle("#484a3d");
    // context.fillText(money, 340, 190);
    context.stroke();
  },

  //换行text
  drawtext(ctx, t, x, y, w) {
    //参数说明
    //ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
    let chr = t.split("")
    let temp = ""
    let row = []

    for (let a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < w && ctx.measureText(temp + (chr[a])).width <= w) {
        temp += chr[a];
      } else {
        row.push(temp);
        temp = chr[a];
      }
    }
    row.push(temp)
    for (let b = 0; b < row.length; b++) {
      // ctx.translate(x,y+(b+1)*20);
      ctx.fillText(row[b], x, y + (b + 1) * 28); //每行字体y坐标间隔20
    }
  },
  setName: function (context) {
    var name = this.data.money;
    var inputrollX = this.data.inputrollX * 1.5
    var inputrollY = this.data.inputrollY * 1.5
    context.setFontSize(27);
    // // context.setFillStyle("transparent");
    context.setFillStyle("#333");
    context.save();
    if (inputrollY < 27) {
      inputrollY += 20
    }
    // context.translate(inputrollX,inputrollY);
    // // context.translate(88,1);//必须先将旋转原点平移到文字位置
    // // context.rotate(-15 * Math.PI / 180);
    // // context.fillText(name,0,0);//必须为（0,0）原点
    // context.strokeText(name,0,0);
    // context.restore();
    // context.stroke();
    this.drawtext(context, name, inputrollX, inputrollY, 250)
  },
  formSubmit: function () {
    var that = this
    wx.showToast({
      title: '形成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
    }, 1000)
  },
  
  

  /////////////////////////////////////////////////////////////////////////////////////////
  //----------打印图片部分------------------------------------------------------------------
  //方法：获取打印图片相关信息
  getPrintImgList: function () {
    let that = this,otherParam="&xcxAppId=" + app.data.wxAppId;
    otherParam+="&companyId=" + app.data.companyId;
    app.getPrintImgList(that,otherParam);
  },
  //方法：获取打印图片结果处理函数
  dowithGetPrintImgList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取打印图片结果：");
        console.log(dataList);
        let printAllImgList=[];
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let data = dataList.dataList, dataItem = null, listItem = null;
          let id = 0, name = "",path="",serial = "",price=0.00,print_num=0,userId=0,open=0,image_type_id=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; name = "";path="";serial = "";price=0.00;print_num=0;userId=0;open=0;image_type_id=0;
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.name)){
              name = dataItem.name;
            }
            if (Utils.isDBNotNull(dataItem.path)){
              path = dataItem.path;
              path = app.getSysImgUrl(path);
            }
            if (Utils.isDBNotNull(dataItem.serial)){
              serial = dataItem.serial;
            }
            if (Utils.isDBNotNull(dataItem.price)){
              try{
                price = parseFloat(dataItem.price);
                price = isNaN(price) ? 0.00 : price;
                price = parseFloat(price.toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            if (Utils.isDBNotNull(dataItem.print_num))
            {
              try{
                print_num = parseInt(dataItem.print_num);
                print_num = isNaN(print_num) ? 0 : print_num;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.userId))
            {
              try{
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.open))
            {
              try{
                open = parseInt(dataItem.open);
                open = isNaN(open) ? 0 : open;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.image_type_id))
            {
              try{
                image_type_id = parseInt(dataItem.image_type_id);
                image_type_id = isNaN(image_type_id) ? 0 : image_type_id;
              }catch(e){}
            }
            
            listItem = {
              id: id, name : name,path:path,serial,price:price,print_num:print_num,userId:userId,open:open,image_type_id:image_type_id,image_type_name:"",
            }
            printAllImgList.push(listItem);
          }
        }
        app.data.printImageInfo=app.filterPrintImgList(printAllImgList);
        that.setData({
          ["printAllImgList"]:app.data.printImageInfo.printAllImgList,
          ["pSysImgList"]: app.data.printImageInfo.pSysImgList,
          ["pMyImgList"]:app.data.printImageInfo.pMyImgList,
          ["pOtherImgList"]:app.data.printImageInfo.pOtherImgList,
        })
        if(that.data.PRReturnId>0){
          that.dowithAfterSelMorePImg(that.data.PRReturnId,that.data.selImgType,false);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //----------拼团部分----------------------------------------------------------------------
  //方法：获取拼团组合项列表结果处理函数
  dowithGetGroupWorkItemList: function (dataList, tag, errorInfo) {
    let that = this,
      selProcuctTypeList = [],
      lastIndex = 0;
    switch (tag) {
      case 1:
        console.log("团组合项列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.data) && dataList.data.length > 0) {
          let dataItem = null,
            listItem = null,
            gwItemList = [];
          let num = 0,
            picName = "";
          for (var i = 0; i < dataList.data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = dataList.data[i];
            num = 0;
            if (Utils.isNotNull(dataItem.totalNum) && Utils.myTrim(dataItem.totalNum + "") != "") {
              try {
                num = parseInt(dataItem.totalNum);
                num = isNaN(num) ? 0 : num;
              } catch (err) {}
            }

            if (that.data.gwNum == num) {
              lastIndex = i;
            }

            listItem = {
              id: num + 10000,
              name: num + "人拼团",
              type: 1,
              mold: "",
            }
            selProcuctTypeList.push(listItem);
          }
          that.setData({
            ["selProcuctTypeList"]: selProcuctTypeList,
          });
          console.log("分类列表:", that.data.selProcuctTypeList)
          this.sCatalog(lastIndex);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取拼团商品列表结果处理函数
  dowithGetGWProductList: function (dataList, tag, errorInfo, pageIndex) {
    let that = this;
    that.data.isGetTypeProduct = true
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团商品列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,
            listItem = null,
            gwProductList = [];
          let id = "",
            pid = 0,
            sid = 0,
            totalNum = 0,
            companyId = 0,
            couponMoney = 0.00,
            spellGroupPrice = 0.00,
            name = "",
            photo = defaultItemImgSrc,
            photosString = "",
            photosTemp = [],
            remark = "";
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = dataList[i];
            spellGroupPrice = 0.00;
            sid = 0;
            totalNum = 0;
            couponMoney = 0.00;
            name = "";
            photo = defaultItemImgSrc;
            remark = "";
            id = dataItem.id;
            pid = dataItem.pid;
            companyId = dataItem.companyId;
            name = dataItem.productName;
            if (Utils.isNotNull(dataItem.sid) && Utils.myTrim(dataItem.sid + "") != "") {
              try {
                sid = parseInt(dataItem.sid);
                sid = isNaN(sid) ? 0 : sid;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.totalNum) && Utils.myTrim(dataItem.totalNum + "") != "") {
              try {
                totalNum = parseInt(dataItem.totalNum);
                totalNum = isNaN(totalNum) ? 0 : totalNum;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.spellGroupPrice) && Utils.myTrim(dataItem.spellGroupPrice + "") != "") {
              try {
                spellGroupPrice = parseFloat(dataItem.spellGroupPrice);
                spellGroupPrice = isNaN(spellGroupPrice) ? 0.00 : spellGroupPrice;
              } catch (err) {}
            }
            //spellprice
            if (spellGroupPrice <= 0.00 && Utils.isNotNull(dataItem.spellprice) && Utils.myTrim(dataItem.spellprice + "") != "") {
              try {
                spellGroupPrice = parseFloat(dataItem.spellprice);
                spellGroupPrice = isNaN(spellGroupPrice) ? 0.00 : spellGroupPrice;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.couponMoney) && Utils.myTrim(dataItem.couponMoney + "") != "") {
              try {
                couponMoney = parseFloat(dataItem.couponMoney);
                couponMoney = isNaN(couponMoney) ? 0.00 : couponMoney;
              } catch (err) {}
            }
            //商品图片
            if (Utils.isNotNull(dataItem.photos) && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = "";
              photosString = dataItem.photos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (let n = 0; n < photosTemp.length; n++) {
                  photosString = photosTemp[n].toLowerCase();
                  if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                    photo = app.getSysImgUrl(photosTemp[n]);
                    break;
                  }
                }
              }
            }
            if (Utils.isNotNull(dataItem.remark) && Utils.myTrim(dataItem.remark + "") != "") {
              remark = Utils.myTrim(dataItem.remark);
            }

            listItem = {
              id: id,
              pid: pid,
              sid: sid,
              totalNum: totalNum,
              companyId: companyId,
              spellGroupPrice: spellGroupPrice,
              couponMoney: couponMoney,
              name: name,
              photo: photo,
              remark: remark,
            }
            gwProductList.push(listItem);
          }
          that.setData({
            ["dataArray"]: gwProductList,
          });
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团产品列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  viewGWProductDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var item = that.data.dataArray[index];

    if (Utils.isNotNull(item)) {
      let url = "/packageYK/pages/detailsgood/detailsgood?isnv=1&pid=" + encodeURIComponent(item.id) + "&num=" + item.totalNum;
      console.log("viewProductDetail:" + url)
      that.data.isForbidRefresh = true;
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
  isHottype(e) {
    let that = this,
      num = e.currentTarget.dataset.num
    if (num == this.data.pagetype) {
      return
    }
    if (num == 1) {
      wx.showToast({
        title: "外卖暂未开放,敬请期待!",
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      ["selProductTypeIndex"]: 0,
      ["pagetype"]: num,
      ["gwNum"]: 0,
    })
    //刷新数据
    // that.getProductTypeList();
  },
  //事件：跳转页面
  gotoCommonPage: function (e) {
    let that=this,packageName="",page="";
    try {
      packageName = Utils.myTrim(e.currentTarget.dataset.package);
    } catch (e) {}
    try {
      page = Utils.myTrim(e.currentTarget.dataset.page);
    } catch (e) {}
    if(Utils.myTrim(packageName)=="gotoCommonPage" && Utils.myTrim(page)=="CYmapdepot"){
      that.data.selPImgTag=1;
      that.data.isForbidRefresh=true;
    }
    app.gotoCommonPageEvent(this, e);
  },
  //事件：跳转页面
  gotoCommonPage2:function(e){
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
  doduck() {
    wx.navigateTo({
      url: '../../packageVP/pages/MywantMassage/MywantMassage'
    })
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////
  //----茶言茶语部分-------------------------------------------------------------------------------
  //事件：图片上传事件
  uploadImg: function (e) {
    let that = this,sType = 0;
    //sType:0顶部图片，1介绍图片
    try {
      sType = parseInt(e.currentTarget.dataset.type);
      sType=isNaN(sType)?0:sType;
    } catch (err) {}
    that.data.isForbidRefresh=true;
    app.uploadCompressImg(that, sType, 0, 1, "imgCompressCanvas")
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    let that = this,setDataKey = "";
    //sType:0顶部图片，1介绍图片
    switch (sType) {
      case 0:
        setDataKey = "selUploadImgUrl"
        break;
    }
    that.setData({
      [setDataKey]: imgUrl,
      ["selPImgItem"]: null,
      ["selSysImgIndex"]:-1,

      ["isSelUploadImg"]:true,
    })
  },
  //事件：选择上传打印图片
  selectUploadPrintImgEvent:function(e){
    let that=this,isSelUploadImg=!that.data.isSelUploadImg;
    that.setData({
      ["selPImgItem"]: null,
      ["selSysImgIndex"]:-1,
      ["isSelUploadImg"]:isSelUploadImg,
    })
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  //----充值免单部分-----------------------------------------------------------------------
  getFreeOrderRechargeRankList:function(){
    let that=this;
    app.getMemberFeeItemList(that);
  },
  //方法：获取会员套餐操作结果回调处理方法
  dowithGetMemberFeeItemList(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('获取会员套餐操作结果：')
        console.log(dataList)
        if (dataList != null && dataList != undefined) {
          let freeOrderRCRankList=[],mainData=null,dataItem = null, listItem = null;
          //获取会员充值套餐列表
          if(Utils.isNotNull(dataList.payRankList) && dataList.payRankList.length>0){
            let id=0,name="",content="",integral=0,expenditure_integral=0,price=0.00,sort=0,invalid=0,coupon_id=0,discount=0,mold=0,couponName="";
            mainData=dataList.payRankList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;content="";integral=0;expenditure_integral=0;price=0.00;name="";sort=0;invalid=0;coupon_id=0;discount=0;mold=0;couponName="";
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.content)){
                content = dataItem.content;
              }               
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              
              if (Utils.isDBNotNull(dataItem.integral)) {
                try {
                  integral = parseInt(dataItem.integral);
                  integral = isNaN(integral) ? 0 : integral;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.expenditure_integral)) {
                try {
                  expenditure_integral = parseInt(dataItem.expenditure_integral);
                  expenditure_integral = isNaN(expenditure_integral) ? 0 : expenditure_integral;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.sort)) {
                try {
                  sort = parseInt(dataItem.sort);
                  sort = isNaN(sort) ? 0 : sort;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.invalid)) {
                try {
                  invalid = parseInt(dataItem.invalid);
                  invalid = isNaN(invalid) ? 0 : invalid;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.price)) {
                try {
                  price = parseFloat(dataItem.price);
                  price = isNaN(price) ? 0 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.invalid)) {
                try {
                  invalid = parseInt(dataItem.invalid);
                  invalid = isNaN(invalid) ? 0 : invalid;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.coupon_id)) {
                try {
                  coupon_id = parseInt(dataItem.coupon_id);
                  coupon_id = isNaN(coupon_id) ? 0 : coupon_id;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.mold)) {
                try {
                  mold = parseInt(dataItem.mold);
                  mold = isNaN(mold) ? 0 : mold;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.discount)) {
                try {
                  discount = parseFloat(dataItem.discount);
                  discount = isNaN(discount) ? 0 : discount;
                  discount = parseFloat(discount.toFixed(app.data.limitQPDecCnt))
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.Coupons_name)){
                couponName = dataItem.Coupons_name;
              }
              if(invalid==0 && coupon_id>0 && discount>0 && mold==5){
                listItem={id:id,content:content,integral:integral,expenditure_integral:expenditure_integral,price:price,name:name,sort:sort,invalid:invalid,coupon_id:coupon_id,discount:discount,mold:mold,couponName:couponName}
                freeOrderRCRankList.push(listItem);
              }             
            }
          }
          freeOrderRCRankList=freeOrderRCRankList.sort(app.compareAsc("discount"));
          console.log("免单充值列表升序排列：")
          console.log(freeOrderRCRankList)
          app.data.freeOrderRCRankList=freeOrderRCRankList;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员套餐失败！";
        wx.showToast({
          title: res.data.rspMsg,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //说明显示/隐藏
  onchangeExplain() {
    this.setData({
      explaintype: !this.data.explaintype
    })
  },
  onchangeroof() {
    this.setData({
      roof: !this.data.roof
    })
  },
})
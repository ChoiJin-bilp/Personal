//app.js
var MD5JS = require('utils/md5.js');
var Utils = require('utils/util.js');
var LOG = require('utils/logutils.js');
var WxParse = require('wxParse/wxParse.js');
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
var WebSocket = null;
var MsgReceived = null;

var qqmapsdk = null;
var defaultHeadImg = "noimg.png",
  timeOutSaveSysInfo = null;
var sendGPRSCmdCnt = 0;
var packSMPageUrl = "packageSMall/pages",
  packYKPageUrl = "packageYK/pages",
  packVPPageUrl = "packageVP/pages",
  packTempPageUrl = "packageTemplate/pages",
  packATPageUrl = "packageAsite/pages",
  packOTPageUrl = "packageOther/pages",
  packComPageUrl = "packageCommercial/pages",
  packMainPageUrl = "pages",
  packOtherPageUrl = "packageOther/pages"
App({
  onLaunch: function () {
    //===============================================================
    //---发布所需设置部分信息------------------------------------------
    var currentVersionType = "B"; //接口版本类型：A A套接口；B B套接口
    var versionNo = "1.0.17"; //发布版本号
    var version = "devtest"; // devtest 开发测试版本，online 线上版本
    var verType = ""; //发布版本类型：GA 正式版，Beta 测试版
    //===============================================================
    //URL 报价优主接口链接，MURL 官网接口链接
    var URL = "",
      MURL = "",
      SMURL = "",
      DataURL = "",
      MDataURL = "",
      UploadURL = "",
      KEY = "";
    if (Utils.myTrim(currentVersionType) == "A") {
      this.getUrlAndKey.interfacePart = "/baojiayou_a/webAPI.jsp?";
      this.getUrlAndKey.smallInterfacePart = "/baojiayou_a/mall.jsp?";
    } else {
      this.getUrlAndKey.interfacePart = "/baojiayou/webAPI.jsp?";
      this.getUrlAndKey.smallInterfacePart = "/baojiayou/mall.jsp?";
    }
    switch (version) {
      //开发测试版
      case "devtest":
        MURL = this.getUrlAndKey.srvDevTest + this.getUrlAndKey.mainInterfacePart;
        SMURL = this.getUrlAndKey.srvDevTest + this.getUrlAndKey.smallInterfacePart;
        URL = this.getUrlAndKey.srvDevTest + this.getUrlAndKey.interfacePart;
        DataURL = this.getUrlAndKey.srvResDevTest + this.getUrlAndKey.resourcePart;
        MDataURL = this.getUrlAndKey.srvResDevTest + this.getUrlAndKey.mainResourcePart;
        UploadURL = this.getUrlAndKey.srvResDevTest + this.getUrlAndKey.uploadPart;
        KEY = this.getUrlAndKey.keyDevTest;

        this.data.wxAppId="wx879d6a40f4746d53";
        this.data.folderAlert = "文件上传网址 120.76.43.44:9080/desk/login.html";
        this.data.csCardId = 784;
        this.data.isSrvRightCheck = this.data.isSrvRightOpenVersion == 0 || this.data.isSrvRightOpenVersion == 1 ? true : false;
        this.data.commercialAppID = "wx879d6a40f4746d53";
        this.data.commercialAppVersion = "trial";
        this.data.mallOrderApplyId = 103;
        //是否开放自定义资讯
        this.data.isOpenCustomInformation = true;
        //分销商申请条件
        this.data.resellerConsumptionMin = 0; //分销商申请——最低消费金额条件
        this.data.resellerDeposit = 0; //分销商申请——不满足消费条件押金金额
        //是否开放直播
        this.data.isOpenLiveBroadCast = false;
        //对应公司ID
        this.data.indexLogoWidth = 160;

        this.data.freeDrawTimeCnt = 1;
        this.data.deviceProductPid = 0; //按摩器商品的PID
        this.data.orderRoomSendCheirapsisPId = 34; //订房送按摩产品ID
        this.data.testLogTag = true;
        this.data.gprsPort = "21000";

        // 测试 获取深高交展会购物商品
        this.data.agentCompanyId = 746
        this.data.version2 = "exp"

        verType = "Beta";
        this.data.luckdraw_id=41;
        this.data.syn9910ActiveId = 34;
        this.data.syn9910CompanyId = -6;
        this.data.continueDrawAwardAmount=0.01;
        break;

        //线上版
      case "online":
        MURL = this.getUrlAndKey.srvOnLine + this.getUrlAndKey.mainInterfacePart;
        SMURL = this.getUrlAndKey.srvOnLine + this.getUrlAndKey.smallInterfacePart;
        URL = this.getUrlAndKey.srvOnLine + this.getUrlAndKey.interfacePart;
        DataURL = this.getUrlAndKey.srvResOnLine + this.getUrlAndKey.resourcePart;
        MDataURL = this.getUrlAndKey.srvResOnLine + this.getUrlAndKey.mainResourcePart;
        UploadURL = this.getUrlAndKey.srvResOnLine + this.getUrlAndKey.uploadPart;
        KEY = this.getUrlAndKey.keyOnLine;

        this.data.wxAppId="wxb17a155e297fe513";
        this.data.folderAlert = "文件上传网址 www.baojiayou.com/desk/login.html";
        this.data.csCardId = 3042;
        this.data.isSrvRightCheck = this.data.isSrvRightOpenVersion == 1 ? true : false;
        this.data.commercialAppID = "wx7bf98da5e676799d";
        this.data.commercialAppVersion = "release";
        this.data.mallOrderApplyId = 175;
        //是否开放自定义资讯
        this.data.isOpenCustomInformation = false;
        //分销商申请条件
        this.data.resellerConsumptionMin = 0; //分销商申请——最低消费金额条件
        this.data.resellerDeposit = 0; //分销商申请——不满足消费条件押金金额
        //是否开放直播
        this.data.isOpenLiveBroadCast = false;
        //对应公司ID
        this.data.indexLogoWidth = 160;
        this.data.logoBGColorIndex = 0;

        this.data.freeDrawTimeCnt = 1;
        this.data.deviceProductPid = 360; //按摩器商品的PID
        this.data.orderRoomSendCheirapsisPId = 34; //订房送按摩产品ID
        this.data.testLogTag = false;
        this.data.gprsPort = "21000";
        verType = "GA";
        this.data.luckdraw_id=40;
        this.data.syn9910ActiveId = 34;
        this.data.syn9910CompanyId = -6;
        this.data.continueDrawAwardAmount=1;
        break;
    }
    this.getUrlAndKey.dataUrl = DataURL;
    this.getUrlAndKey.mdataUrl = MDataURL;
    this.getUrlAndKey.uploadUrl = UploadURL;
    this.getUrlAndKey.url = URL;
    this.getUrlAndKey.murl = MURL;
    this.getUrlAndKey.smurl = SMURL;
    this.getUrlAndKey.key = KEY;
    this.data.version = version;
    this.data.publishVersion = verType + " " + versionNo + "[" + currentVersionType + "]";
    this.data.currentVersion = version + versionNo;
    //腾讯地图API秘钥的Key
    this.data.qqMapSDKKey = "PLRBZ-YGTC4-U7HUR-X7AT5-UORVS-XPFQ7";
    //腾讯地图API秘钥的签名校验Secret Key
    this.data.qqMapIPSign = "CDP2OmwdM2wErzS7NNuHdlyKLZxa1SJ";

    switch (this.data.hotelType) {
      case 1:
        this.data.sysMainPage = "pages/chainhotel/chainhotel";
        break;
      default:
        this.data.sysMainPage = "pages/asite/index/index";
        break;
    }
    this.getSMallPlatformRightData(null);
    console.log("App.Data[dataUrl]:" + this.getUrlAndKey.dataUrl);
    console.log("App.Data[mdataUrl]:" + this.getUrlAndKey.mdataUrl);
    console.log("App.Data[uploadUrl]:" + this.getUrlAndKey.uploadUrl);
    console.log("App.Data[url]:" + this.getUrlAndKey.url);
    console.log("App.Data[murl]:" + this.getUrlAndKey.murl);
    console.log("App.Data[key]:" + this.getUrlAndKey.key);

    //网络状态判断
    wx.onNetworkStatusChange(res => {
      this.data.isConnected = res.isConnected
    })

    var code = wx.getStorageSync('Vcode');
    var time = wx.getStorageSync('VcodeTime');
    var mobile = wx.getStorageSync('Vmobile');
    if (!Utils.isNull(time) && !Utils.isNull(code) && !Utils.isNull(code)) {
      time = time + 1800;
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (time < timestamp) {
        wx.removeStorageSync('Vcode')
        wx.removeStorageSync('VcodeTime')
        wx.removeStorageSync('Vmobile')
      }
    }
    // //获取导航条
    // this.getTabBarList(null, 0, false);
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        let width = clientWidth * ratio
        that.globalData.ballheight = height - 96;
        that.globalData.differenheight = height;
        that.globalData.ballwidth = width;
      }
    });
  },
  globalData: {
    defaultCity: '深圳市',
    defaultCounty: '',
    defaultCityCode: "440300",
    isGetCurCity: false,

    muserInfo: null, //用户个人信息
    userInfo: null, //用户个人信息
    bjyUserInfo: null, //报价优用户信息
    userTotalInfo: null, //用户完整个人信息
    companyUserMap: {}, //判断 个人版或加入企业版的个人搬
    companyUsers: [], //企业用户相关信息
    tabBarList: [], //存放tabBar的数据
    sourceTabBarList: [{
        "selectedIconPath": "/images/index.png",
        "iconPath": "/images/noindex.png",
        "pagePath": "/pages/alittle/alittle",
        "text": "首页"
      },
      {
        "selectedIconPath": "/images/activity.png",
        "iconPath": "/images/noactivity.png",
        "pagePath": "/pages/comactivity/comactivity",
        "text": "活动"
      },
      {
        "selectedIconPath": "/images/curstore.png",
        "iconPath": "/images/store.png",
        "pagePath": "/pages/doorway/doorway",
        "text": "购物"
      },
      {
        "selectedIconPath": "/images/icon-tools.png",
        "iconPath": "/images/icon-tool.png",
        "pagePath": "/pages/store/store",
        "text": "商城"
      },
      {
        "selectedIconPath": "/images/mine.png",
        "iconPath": "/images/nomine.png",
        "pagePath": "/pages/mine/mine",
        "text": "我的"
      }
    ],
    ballheight: 0, //悬浮球的初使高度}
    differenheight: 0,
    ballwidth:0
  },
  data: {
    ////////////////////////////////////////////////////
    //--官网部分-----------------------------------------
    mPageSize: 10, //官网分页每页记录数

    commercialAppID: "", //商务小程序AppID
    commercialAppVersion: "", //商务小程序跳转版本

    switchAppId: "wx7bf98da5e676799d", //跳转小程序AppId
    switchVersion: "release", //跳转小程序版本
    mallOrderApplyId: 0, //报价优申请微官网定制招商记录ID

    productTypeList: [], //产品类型
    mainCompanyData: null, //公司信息
    ostype: "", //系统类型

    isOpenMerchantPlatform: false, //是否开发商户平台
    logoBGColorIndex: 1, //Logo底色：0灰色，1白色
    indexLogoWidth: 80, //首页Logo宽度

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //    抽奖部分
    user_roleId: 0, //账户角色
    accountRecordId: 0, //账户记录ID
    accountUserName: "", //账户名称
    accountUserPWD: "", //账户密码
    accountBindUserId: 0, //账户绑定用户ID
    accountCompanyIdList: "", //账户关联公司ID序列（半角逗号间隔）

    luckdraw_id: 40, //抽奖活动ID
    freeDrawTimeCnt: 1, //每天免费抽奖次数
    continueCheirapsisAmount: 1, //继续按摩充值金额（元）
    continueCheirapsisMinutes: 5, //继续按摩分钟数
    continueDrawAwardAmount: 0.01, //继续抽奖充值金额（元）
    countDownAlertTime: 0, //按摩倒计时提示时间（秒）

    orderRoomSendCheirapsisPId: 0, //订房送按摩产品ID
    isOpenOrderRSendCP: true, //是否启用订房送按摩功能

    deviceCheirapsisCode: "", //设备二维码地址
    deviceProductPid: 0, //按摩器商品的PID
    communicationType: 1, //通讯类型：0 蓝牙；1 GPRS；2 蓝牙优先，失败尝试GPRS；3 GPRS优先，失败尝试蓝牙

    isRegister: false, //是否已注册：true已注册，false未注册
    isPerfectUserInfo: false, //用户是否已完善资料
    userRoleType: 0, //用户类型：0个人，1公司

    agentCompanyId: -9999,         //当前代理公司ID
    agentDeviceId: 0,              //当前代理商设备ID
    agentDeviceAddress:"",         //当前代理设备地址
    agentDeviceStatus: 1,          //当前设备状态
    isDeviceMyUsing: false,        //当前设备是否正在使用：true是，false否
    agentDeviceSoftVersion:0,      //软件版本：9为02款以上版本
    agentUserId: 0, //当前代理商ID
    agentAuditState: 0, //代理申请状态：0未通过，1已通过
    agentPutAddress: "", //当前设备投放位置
    agentUserCompanyList: [], //当前代理商的公司信息列表
    currentOS: {
      osName: "",
      osTag: -1
    }, //当前操作系统信息：osName当前操作系统，osTag 核心系统（包括开放工具模拟的系统—— -1 未设置，0 PC，1 安卓，2 IOS

    isKeepOldMode: 0, //是否保持旧模式：0否，1是
    isCountdownSuspend: true, //设备暂停是否继续倒计时计数
    isUsedInterval: 10, //设备是否在用状态判断失效间隔时长（秒）
    isForbidOnUsed: false, //设备在用时是否禁止操作——数据库表 g_mallSysInfo 中操作

    isCheckDeviceForPay: false, //支付设备服务时是否检查设备状态
    isWriteDBError: true, //设备控制错误是否写数据库
    isSetDefaultDeviceModel: true, //是否根据设备地址默认设置型号
    defaultDeviceModels: [ //模式：模式ID，模式名称，默认开启强度
      {
        id: 0,
        name: "YK2001-JGX",
        defaultPower: "03"
      },
      {
        id: 2,
        name: "YK2002-JGX",
        defaultPower: ""
      },
    ],
    gprsPort: "", //GPRS接口端口
    spareCheirapsisCnt: 0, //剩余可用按摩次数
    cheirapsisCouponList: [], //我的按摩劵数据集
    priceTypeList: [{
        id: 0,
        name: "常规价"
      },
      {
        id: 2,
        name: "推广价"
      },
      {
        id: 3,
        name: "时段价"
      },
      {
        id: 4,
        name: "特别价"
      },
    ],
    //零钱明细类型
    walletdetailTypeList:[
      { id:0,name:"返现",tag:"+"},{id:1,name:"充值",tag:"+"},{id:2,name:"提现",tag:"-"},
      {id:3,name:"积分抽奖",tag:"+"},{id:4,name:"发红包",tag:"-"},{id:5,name:"领红包",tag:"+"},
      {id:6,name:"红包回退",tag:"+"},{id:7,name:"充账(手动)",tag:"+"},{id:8,name:"分销",tag:"+"},
      {id:9,name:"注册领红包",tag:"+"},{id:10,name:"新闻或商品领红包",tag:"+"},
      {id:11,name:"设备运营分成",tag:"+"},{id:12,name:"订房分成",tag:"+"},
      {id:13,name:"购物分成(酒店商品)",tag:"+"},{id:14,name:"购物分成(平台商品)",tag:"+"},
      {id:15,name:"云客按摩返现红包",tag:"+"},{id:16,name:"抵扣券转零钱",tag:"+"},
      {id:17,name:"签到金额",tag:"+"},{id:18,name:"余额支付",tag:"-"},{id:19,name:"充值(禁止提现)",tag:"-"}
    ],
    //积分明细类型
    integralTypeList:[
      { id:0,name:"充值",tag:"+"},{id:1,name:"扣减",tag:"-"}
    ],
    socketOpened: false,
    operateRecordItem: null, //当前按摩操控记录:tag：0默认，1在扫码页面中跳转按摩页
    isCurCheirapsisWorkPage: false, //当前页面是否为按摩操控界面

    isPayforLotteryDraw: true, //是否允许支付抽奖
    pageLayerTag: "", //页面层级
    isShowHomeCheirapsisAlert: true, //是否显示首页按摩提示
    webSocketMasterPage: null, //WebSocket当前所操控页面对象
    isShowAward: 0, //0默认显示抽奖，1不显示抽奖
    isSetFreeCheirapsis: 0, //是否允许免费按摩：0否，1是
    freeCheirapsisMode: 0, //免费按摩模式：0每天一次，1单个用户一次，2不限次数
    storePageLayout: 1, //购物界面布局方式： 1纵向 2横向
    isSelCityArea: false, //是否已经选择了地市
    isOnShowQueryCheirapsisTime: false, //是否onShow事件需要重新同步按摩器时间
    synCouponObj: null, //组合劵相关信息，传递给tab页面用，属性：id——组合劵ID，mpids——组合劵关联商品ID，逗号间隔
    synShopCarList: null, //组合劵购物车
    syn9910ActiveId: 0,
    syn9910CompanyId: 0,
    isPayforFreeCheirapsis:false,     //是否购买送免费按摩
    payGetCheirapsisList:null,        //购买所得按摩劵记录集

    curPageDataOptions:null,          //暂存当前页面返回所需相关信息
    isOpenGWPrize:true,               //是否开放拼团抽奖
    userLoginImgUrl:"logo-ykcy.png",               //用户登录界面图标名称

    userMemberInfo:null,              //会员相关信息
    isCheirapsisOperation:false,      //按摩器是否在运行中
    isCheirapsisAlertAddTime:true,    //是否默认提示时间叠加
    isFilterCheirapsis:false,         //是否过滤按摩器
    cheirapsisTypeId:0,               //按摩产品分类
    printImgTypeId:0,                 //茶言茶语分类
    isRegisterMobile:false,           //是否注册手机号
    printImageInfo:null,              //打印图片
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //    酒店部分
    dtCheckInStart: "", //入住时间
    dtCheckInEnd: "", //退房时间
    checkInDays: 0, //入住天数
    isCheckHotelStock: false, //是否检查库存

    tempCompanyData: null, //临时公司信息
    isMapHotelReservation: false, //是否显示地图订房
    hotelType: 1, //酒店类型：0普通酒店，1连锁酒店
    roomSellType: 0, //房间出售模式：0酒店模式，1光趣模式
    gqValidDateHaveTime: 0, //光趣有效期：0不带时间，1带时间
    gqQRCodeMessage: "为保障您的权益，未到店消费前请不要将券号提供给商家", //光趣二维码页面显示提示信息
    //////////////////////////////////////////////////////////////////////////
    //--报价优部分--------------------------------------------------------------
    //---------通用设置---------------------------------------------------------
    wxAppId: 'wxb17a155e297fe513', //小程序APPID
    appid: 1, //接口AppId参数
    companyId: -6, //系统公司ID
    hotelId: 2, //支付参数酒店ID
    hotelKey: "", //支付参数酒店Key

    version: '', //版本
    version2: '', //体验版和正式版区分 exp 体验版，online 正式版
    currentVersion: "intest1.1", //缓存版本号
    publishVersion: "1.3.7[A]", //发布版本号：GA 正式版，Beta 测试版
    csCardId: 784, //3042,                      //客服名片ID

    sysName: "云客茶语", //系统名称
    sysWebSite: "www.baojiayou.com", //系统官网
    sysLogoUrl: "", //系统Logo的URL
    sysMainPage: "pages/asite/index/index", //系统首页
    sysAppType: 1, //系统分类：0报价优，1微官网
    storeShareMainPage: "pages/doorway/doorway", //商城分享首页
    pageSize: 15, //分页每页记录数

    mQRType: 1, //二维码分类
    defaultImg: "/images/dnewsimg.png", //默认图片
    isPerfectLater: false, //是否暂不完善信息
    isPerfectLater2: false, //是否暂不完善注册相关信息
    alertCADImgTitle: "您收到一份{{type}}！", //生成宣传图片标题
    limitQPDecCnt: 2, //价钱保留小数位数
    js_code: '', //登录所用
    isConnected: false, //网络是否连接

    qqMapSDKKey: "", //腾讯地图API秘钥
    qqMapIPSign: "", //腾讯地图API签名
    selProcuctTypeList: 5, //商城首页商品分类显示个数
    isLoginCheckCacheUserId: true, //登录是否检查用户ID缓存
    timeOutTryCnt: 3, //超时重试次数（主要是登录）

    liveBroadCastAppId: "wx2b03c6e691cd7370", //直播组件APPID
    isOpenLiveBroadCast: false, //是否开放直播
    isOpenSoftCustomer: false, //是否开放软件定制
    templateType: 1, //模板类型：0零售，1酒店，2社区

    uploadImgSize: 1024 * 1024 * 2, //上传图片尺寸最大限制
    uploadImgSideLen: 1024, //上传图片最大边长限制
    uploadImgWidth: 1024, //上传图片最大宽度限制
    uploadImgHeight: 768, //上传图片最大高度限制
    //---------通用设置---------------------------------------------------------
    //---------商城相关-------------------------------------------------------
    shoppingCartCnt: 0, //购物车数量

    resellerConsumptionMin: 100, //分销商申请——最低消费金额条件
    resellerDeposit: 50, //分销商申请——不满足消费条件押金金额

    //---------商务工具涉及----------------------------------------------------
    limitShareCnt: 15, //发送产品限制数量
    limitQPProCnt: 30, //报价产品限制数量
    limitBQProCnt: 6, //自定义商机产品限制数量
    selProductList: [],
    createQuotePriceData: null, //创建报价暂存数据
    createBusinessData: null, //创建商机暂存数据
    sendQPContactData: null, //发送报价选择联系人数据
    sendProductData: null, //发送产品选择联系人数据
    isSrvRightOpenVersion: 0, //是否开发服务权限管理：0内测版开放，1全部包括正式版开放
    isSrvRightCheck: true, //是否检查会员操作权限
    isOpenCustomInformation: false, //是否开放自定义资讯
    folderAlert: "", //文件夹提示文字
    regMsg: "对不起，您必须到“个人中心”-“注册资料”中注册才能使用本功能！",
    regGuideMsg: "请先到“个人中心”进行注册，注册成功后即送50积分，积分可用于将来抽奖，最高10元现金",
    alertSQuote: "您收到一份{{type}}，请赶紧点开看看吧！",
    alertSProduct: "您收到一份产品表，请赶紧点开看看吧！",
    smallSiteUrl: "", //商城Web后台地址

    //文档类型：1 展会信息 2转让信息 3招商信息  4资讯信息 5牙刷社区 6益寿社区
    publicInfomationTypeList: [{
        id: 1,
        name: "展会信息"
      },
      {
        id: 2,
        name: "转让信息"
      },
      {
        id: 3,
        name: "招商信息"
      },
      {
        id: 4,
        name: "资讯信息"
      }
    ],
    //---------名片相关---------------------------------------------------------
    userCardDetaData: {}, //我的名片列表信息
    userData: null, //card和group有用到
    cardDetaData: {}, //当前操作名片信息
    cardgroupUpData: null, //修改的群资料
    cardGroupOnshowStat: false, //是否刷新card页面 文件夹列表
    cardTemplateList: [], //名片模板
    cardCompanyData: "", //保存的公司信息
    cardCompanyDataStr: "", //保存的公司参数字符串
    temporaryCompany: "", //添加名片时临时保存的公司名和地址

    cardgroupData: null, //群数据
    cardgroupMsgData: null, //群通知详情
    //---------名片相关---------------------------------------------------------
    viewDetailCustomer: null, //查看客户详情资料

    isCheckPWRight: false, //是否设置密码登录
    isHideAward: false, //是否隐藏积分的获奖信息
    isPasswordRight: false, //是否通过密码权限
    isSetNickName: false, //是否设置昵称

    smCartSelPayDataList: null, //商城购物车立即支付记录集
    updateCartsData: null, //订单修改的公司资料

    alertSStoreProduct: "推荐您一个好产品“{{product}}”！",

    provinceList: [],
    provinceCityList: [],

    testLogTag: false, //是否打印Log

    //记录饮品使用的上次地址id
    lastAddressId: 0,
    // 是否显示签到弹窗
    isShowSigninPop:true,
  },
  getUrlAndKey: {
    srvOnLine: "https://bjy.51yunkeyi.com", //正式接口域名地址
    srvDevTest: "https://e.amjhome.com", //测试接口域名地址

    srvResOnLine: "https://bjy.51yunkeyi.com", //正式资源域名地址
    srvResDevTest: "https://e.amjhome.com", //测试资源域名地址

    keyOnLine: "amj_b5e9sdfd6ws325", //在线接口key
    keyDevTest: "amj_b5e9sdfd6ws325", //测试接口key

    smallInterfacePart: "/baojiayou/mall.jsp?", //商城接口地址
    mainInterfacePart: "/baojiayou/wgwWS.jsp?", //官网接口地址
    interfacePart: "/baojiayou_a/webAPI.jsp?", //主A套接口地址
    // interfacePart: "/baojiayou/webAPI.jsp?",    //主B套接口地址

    mainResourcePart: "/baojiayou/gw_images", //官网资源地址
    resourcePart: "/baojiayou/tts_upload", //主资源地址
    uploadPart: "",

    dataUrl: "", //主资源URL地址
    mdataUrl: "", //官网资源URL地址
    uploadUrl: "", //上传URL地址
    url: "", //主接口URL地址
    murl: "", //官网接口URL地址
    smurl: "", //官网商城接口URL地址
    key: "" //接口key
  },
  //////////////////////////////////////////////////////////////////////
  //------------全局函数-------------------------------------------------
  //方法：获取provinceList
  getAppProvinceList() {
    var app = this;
    if (app.data.provinceList == null || app.data.provinceList == undefined || app.data.provinceList.length <= 0) {
      // app.data.provinceList = [
      //   ['北京', '安徽', "福建", "甘肃", "广东", "广西", "贵州", "海南", "河北", "河南", "黑龙江", "湖北", "湖南", "吉林", "江苏", "江西", "辽宁", "内蒙古", "宁夏", "青海", "山东", "山西", "陕西", "上海", "四川", "天津", "西藏", "新疆", "云南", "浙江", "重庆", "香港", "澳门", "台湾"],
      //   ['北京']
      // ]
      app.data.provinceList = [
        ['全国', '北京', '安徽', "福建", "甘肃", "广东", "广西", "贵州", "海南", "河北", "河南", "黑龙江", "湖北", "湖南", "吉林", "江苏", "江西", "辽宁", "内蒙古", "宁夏", "青海", "山东", "山西", "陕西", "上海", "四川", "天津", "西藏", "新疆", "云南", "浙江", "重庆", "香港", "澳门", "台湾"],
        ['']
      ]
    }
    return app.data.provinceList;
  },
  //方法：获取provinceCityList
  getAppProvinceCityList() {
    var app = this;
    if (app.data.provinceCityList == null || app.data.provinceCityList == undefined || app.data.provinceCityList.length <= 0) {
      app.data.provinceCityList = [{
        "regid": "-1",
        "parid": "1",
        "regname": "全国",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "2",
        "parid": "1",
        "regname": "北京",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "3",
        "parid": "1",
        "regname": "安徽",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "4",
        "parid": "1",
        "regname": "福建",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "5",
        "parid": "1",
        "regname": "甘肃",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "6",
        "parid": "1",
        "regname": "广东",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "7",
        "parid": "1",
        "regname": "广西",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "8",
        "parid": "1",
        "regname": "贵州",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "9",
        "parid": "1",
        "regname": "海南",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "10",
        "parid": "1",
        "regname": "河北",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "11",
        "parid": "1",
        "regname": "河南",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "12",
        "parid": "1",
        "regname": "黑龙江",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "13",
        "parid": "1",
        "regname": "湖北",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "14",
        "parid": "1",
        "regname": "湖南",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "15",
        "parid": "1",
        "regname": "吉林",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "16",
        "parid": "1",
        "regname": "江苏",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "17",
        "parid": "1",
        "regname": "江西",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "18",
        "parid": "1",
        "regname": "辽宁",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "19",
        "parid": "1",
        "regname": "内蒙古",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "20",
        "parid": "1",
        "regname": "宁夏",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "21",
        "parid": "1",
        "regname": "青海",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "22",
        "parid": "1",
        "regname": "山东",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "23",
        "parid": "1",
        "regname": "山西",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "24",
        "parid": "1",
        "regname": "陕西",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "25",
        "parid": "1",
        "regname": "上海",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "26",
        "parid": "1",
        "regname": "四川",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "27",
        "parid": "1",
        "regname": "天津",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "28",
        "parid": "1",
        "regname": "西藏",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "29",
        "parid": "1",
        "regname": "新疆",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "30",
        "parid": "1",
        "regname": "云南",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "31",
        "parid": "1",
        "regname": "浙江",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "32",
        "parid": "1",
        "regname": "重庆",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "33",
        "parid": "1",
        "regname": "香港",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "34",
        "parid": "1",
        "regname": "澳门",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "35",
        "parid": "1",
        "regname": "台湾",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "36",
        "parid": "3",
        "regname": "安庆",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "37",
        "parid": "3",
        "regname": "蚌埠",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "38",
        "parid": "3",
        "regname": "巢湖",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "39",
        "parid": "3",
        "regname": "池州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "40",
        "parid": "3",
        "regname": "滁州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "41",
        "parid": "3",
        "regname": "阜阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "42",
        "parid": "3",
        "regname": "淮北",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "43",
        "parid": "3",
        "regname": "淮南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "44",
        "parid": "3",
        "regname": "黄山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "45",
        "parid": "3",
        "regname": "六安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "46",
        "parid": "3",
        "regname": "马鞍山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "47",
        "parid": "3",
        "regname": "宿州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "48",
        "parid": "3",
        "regname": "铜陵",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "49",
        "parid": "3",
        "regname": "芜湖",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "50",
        "parid": "3",
        "regname": "宣城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "51",
        "parid": "3",
        "regname": "亳州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "398",
        "parid": "3",
        "regname": "合肥",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "52",
        "parid": "2",
        "regname": "北京",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "53",
        "parid": "4",
        "regname": "福州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "54",
        "parid": "4",
        "regname": "龙岩",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "55",
        "parid": "4",
        "regname": "南平",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "56",
        "parid": "4",
        "regname": "宁德",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "57",
        "parid": "4",
        "regname": "莆田",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "58",
        "parid": "4",
        "regname": "泉州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "59",
        "parid": "4",
        "regname": "三明",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "60",
        "parid": "4",
        "regname": "厦门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "61",
        "parid": "4",
        "regname": "漳州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "62",
        "parid": "5",
        "regname": "兰州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "63",
        "parid": "5",
        "regname": "白银",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "64",
        "parid": "5",
        "regname": "定西",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "65",
        "parid": "5",
        "regname": "甘南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "66",
        "parid": "5",
        "regname": "嘉峪关",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "67",
        "parid": "5",
        "regname": "金昌",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "68",
        "parid": "5",
        "regname": "酒泉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "69",
        "parid": "5",
        "regname": "临夏",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "70",
        "parid": "5",
        "regname": "陇南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "71",
        "parid": "5",
        "regname": "平凉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "72",
        "parid": "5",
        "regname": "庆阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "73",
        "parid": "5",
        "regname": "天水",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "74",
        "parid": "5",
        "regname": "武威",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "75",
        "parid": "5",
        "regname": "张掖",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "76",
        "parid": "6",
        "regname": "广州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "77",
        "parid": "6",
        "regname": "深圳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "78",
        "parid": "6",
        "regname": "潮州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "79",
        "parid": "6",
        "regname": "东莞",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "80",
        "parid": "6",
        "regname": "佛山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "81",
        "parid": "6",
        "regname": "河源",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "82",
        "parid": "6",
        "regname": "惠州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "83",
        "parid": "6",
        "regname": "江门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "84",
        "parid": "6",
        "regname": "揭阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "85",
        "parid": "6",
        "regname": "茂名",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "86",
        "parid": "6",
        "regname": "梅州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "87",
        "parid": "6",
        "regname": "清远",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "88",
        "parid": "6",
        "regname": "汕头",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "89",
        "parid": "6",
        "regname": "汕尾",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "90",
        "parid": "6",
        "regname": "韶关",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "91",
        "parid": "6",
        "regname": "阳江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "92",
        "parid": "6",
        "regname": "云浮",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "93",
        "parid": "6",
        "regname": "湛江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "94",
        "parid": "6",
        "regname": "肇庆",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "95",
        "parid": "6",
        "regname": "中山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "96",
        "parid": "6",
        "regname": "珠海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "97",
        "parid": "7",
        "regname": "南宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "98",
        "parid": "7",
        "regname": "桂林",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "99",
        "parid": "7",
        "regname": "百色",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "100",
        "parid": "7",
        "regname": "北海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "101",
        "parid": "7",
        "regname": "崇左",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "102",
        "parid": "7",
        "regname": "防城港",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "103",
        "parid": "7",
        "regname": "贵港",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "104",
        "parid": "7",
        "regname": "河池",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "105",
        "parid": "7",
        "regname": "贺州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "106",
        "parid": "7",
        "regname": "来宾",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "107",
        "parid": "7",
        "regname": "柳州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "108",
        "parid": "7",
        "regname": "钦州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "109",
        "parid": "7",
        "regname": "梧州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "110",
        "parid": "7",
        "regname": "玉林",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "111",
        "parid": "8",
        "regname": "贵阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "112",
        "parid": "8",
        "regname": "安顺",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "113",
        "parid": "8",
        "regname": "毕节",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "114",
        "parid": "8",
        "regname": "六盘水",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "115",
        "parid": "8",
        "regname": "黔东南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "116",
        "parid": "8",
        "regname": "黔南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "117",
        "parid": "8",
        "regname": "黔西南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "118",
        "parid": "8",
        "regname": "铜仁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "119",
        "parid": "8",
        "regname": "遵义",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "120",
        "parid": "9",
        "regname": "海口",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "121",
        "parid": "9",
        "regname": "三亚",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "122",
        "parid": "9",
        "regname": "白沙",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "123",
        "parid": "9",
        "regname": "保亭",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "124",
        "parid": "9",
        "regname": "昌江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "125",
        "parid": "9",
        "regname": "澄迈县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "126",
        "parid": "9",
        "regname": "定安县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "127",
        "parid": "9",
        "regname": "东方",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "128",
        "parid": "9",
        "regname": "乐东",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "129",
        "parid": "9",
        "regname": "临高县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "130",
        "parid": "9",
        "regname": "陵水",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "131",
        "parid": "9",
        "regname": "琼海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "132",
        "parid": "9",
        "regname": "琼中",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "133",
        "parid": "9",
        "regname": "屯昌县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "134",
        "parid": "9",
        "regname": "万宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "135",
        "parid": "9",
        "regname": "文昌",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "136",
        "parid": "9",
        "regname": "五指山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "137",
        "parid": "9",
        "regname": "儋州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "138",
        "parid": "10",
        "regname": "石家庄",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "139",
        "parid": "10",
        "regname": "保定",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "140",
        "parid": "10",
        "regname": "沧州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "141",
        "parid": "10",
        "regname": "承德",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "142",
        "parid": "10",
        "regname": "邯郸",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "143",
        "parid": "10",
        "regname": "衡水",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "144",
        "parid": "10",
        "regname": "廊坊",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "145",
        "parid": "10",
        "regname": "秦皇岛",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "146",
        "parid": "10",
        "regname": "唐山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "147",
        "parid": "10",
        "regname": "邢台",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "148",
        "parid": "10",
        "regname": "张家口",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "149",
        "parid": "11",
        "regname": "郑州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "150",
        "parid": "11",
        "regname": "洛阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "151",
        "parid": "11",
        "regname": "开封",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "152",
        "parid": "11",
        "regname": "安阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "153",
        "parid": "11",
        "regname": "鹤壁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "154",
        "parid": "11",
        "regname": "济源",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "155",
        "parid": "11",
        "regname": "焦作",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "156",
        "parid": "11",
        "regname": "南阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "157",
        "parid": "11",
        "regname": "平顶山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "158",
        "parid": "11",
        "regname": "三门峡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "159",
        "parid": "11",
        "regname": "商丘",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "160",
        "parid": "11",
        "regname": "新乡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "161",
        "parid": "11",
        "regname": "信阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "162",
        "parid": "11",
        "regname": "许昌",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "163",
        "parid": "11",
        "regname": "周口",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "164",
        "parid": "11",
        "regname": "驻马店",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "165",
        "parid": "11",
        "regname": "漯河",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "166",
        "parid": "11",
        "regname": "濮阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "167",
        "parid": "12",
        "regname": "哈尔滨",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "168",
        "parid": "12",
        "regname": "大庆",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "169",
        "parid": "12",
        "regname": "大兴安岭",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "170",
        "parid": "12",
        "regname": "鹤岗",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "171",
        "parid": "12",
        "regname": "黑河",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "172",
        "parid": "12",
        "regname": "鸡西",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "173",
        "parid": "12",
        "regname": "佳木斯",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "174",
        "parid": "12",
        "regname": "牡丹江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "175",
        "parid": "12",
        "regname": "七台河",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "176",
        "parid": "12",
        "regname": "齐齐哈尔",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "177",
        "parid": "12",
        "regname": "双鸭山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "178",
        "parid": "12",
        "regname": "绥化",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "179",
        "parid": "12",
        "regname": "伊春",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "180",
        "parid": "13",
        "regname": "武汉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "181",
        "parid": "13",
        "regname": "仙桃",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "182",
        "parid": "13",
        "regname": "鄂州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "183",
        "parid": "13",
        "regname": "黄冈",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "184",
        "parid": "13",
        "regname": "黄石",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "185",
        "parid": "13",
        "regname": "荆门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "186",
        "parid": "13",
        "regname": "荆州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "187",
        "parid": "13",
        "regname": "潜江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "188",
        "parid": "13",
        "regname": "神农架林区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "189",
        "parid": "13",
        "regname": "十堰",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "190",
        "parid": "13",
        "regname": "随州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "191",
        "parid": "13",
        "regname": "天门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "192",
        "parid": "13",
        "regname": "咸宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "193",
        "parid": "13",
        "regname": "襄阳(襄樊市)",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "194",
        "parid": "13",
        "regname": "孝感",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "195",
        "parid": "13",
        "regname": "宜昌",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "196",
        "parid": "13",
        "regname": "恩施",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "197",
        "parid": "14",
        "regname": "长沙",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "198",
        "parid": "14",
        "regname": "张家界",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "199",
        "parid": "14",
        "regname": "常德",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "200",
        "parid": "14",
        "regname": "郴州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "201",
        "parid": "14",
        "regname": "衡阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "202",
        "parid": "14",
        "regname": "怀化",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "203",
        "parid": "14",
        "regname": "娄底",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "204",
        "parid": "14",
        "regname": "邵阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "205",
        "parid": "14",
        "regname": "湘潭",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "206",
        "parid": "14",
        "regname": "湘西",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "207",
        "parid": "14",
        "regname": "益阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "208",
        "parid": "14",
        "regname": "永州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "209",
        "parid": "14",
        "regname": "岳阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "210",
        "parid": "14",
        "regname": "株洲",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "211",
        "parid": "15",
        "regname": "长春",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "212",
        "parid": "15",
        "regname": "吉林",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "213",
        "parid": "15",
        "regname": "白城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "214",
        "parid": "15",
        "regname": "白山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "215",
        "parid": "15",
        "regname": "辽源",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "216",
        "parid": "15",
        "regname": "四平",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "217",
        "parid": "15",
        "regname": "松原",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "218",
        "parid": "15",
        "regname": "通化",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "219",
        "parid": "15",
        "regname": "延边",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "220",
        "parid": "16",
        "regname": "南京",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "221",
        "parid": "16",
        "regname": "苏州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "222",
        "parid": "16",
        "regname": "无锡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "223",
        "parid": "16",
        "regname": "常州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "224",
        "parid": "16",
        "regname": "淮安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "225",
        "parid": "16",
        "regname": "连云港",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "226",
        "parid": "16",
        "regname": "南通",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "227",
        "parid": "16",
        "regname": "宿迁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "228",
        "parid": "16",
        "regname": "泰州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "229",
        "parid": "16",
        "regname": "徐州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "230",
        "parid": "16",
        "regname": "盐城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "231",
        "parid": "16",
        "regname": "扬州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "232",
        "parid": "16",
        "regname": "镇江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "233",
        "parid": "17",
        "regname": "南昌",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "234",
        "parid": "17",
        "regname": "抚州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "235",
        "parid": "17",
        "regname": "赣州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "236",
        "parid": "17",
        "regname": "吉安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "237",
        "parid": "17",
        "regname": "景德镇",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "238",
        "parid": "17",
        "regname": "九江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "239",
        "parid": "17",
        "regname": "萍乡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "240",
        "parid": "17",
        "regname": "上饶",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "241",
        "parid": "17",
        "regname": "新余",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "242",
        "parid": "17",
        "regname": "宜春",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "243",
        "parid": "17",
        "regname": "鹰潭",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "244",
        "parid": "18",
        "regname": "沈阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "245",
        "parid": "18",
        "regname": "大连",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "246",
        "parid": "18",
        "regname": "鞍山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "247",
        "parid": "18",
        "regname": "本溪",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "248",
        "parid": "18",
        "regname": "朝阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "249",
        "parid": "18",
        "regname": "丹东",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "250",
        "parid": "18",
        "regname": "抚顺",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "251",
        "parid": "18",
        "regname": "阜新",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "252",
        "parid": "18",
        "regname": "葫芦岛",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "253",
        "parid": "18",
        "regname": "锦州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "254",
        "parid": "18",
        "regname": "辽阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "255",
        "parid": "18",
        "regname": "盘锦",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "256",
        "parid": "18",
        "regname": "铁岭",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "257",
        "parid": "18",
        "regname": "营口",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "258",
        "parid": "19",
        "regname": "呼和浩特",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "259",
        "parid": "19",
        "regname": "阿拉善盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "260",
        "parid": "19",
        "regname": "巴彦淖尔盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "261",
        "parid": "19",
        "regname": "包头",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "262",
        "parid": "19",
        "regname": "赤峰",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "263",
        "parid": "19",
        "regname": "鄂尔多斯",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "264",
        "parid": "19",
        "regname": "呼伦贝尔",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "265",
        "parid": "19",
        "regname": "通辽",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "266",
        "parid": "19",
        "regname": "乌海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "267",
        "parid": "19",
        "regname": "乌兰察布市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "268",
        "parid": "19",
        "regname": "锡林郭勒盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "269",
        "parid": "19",
        "regname": "兴安盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "270",
        "parid": "20",
        "regname": "银川",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "271",
        "parid": "20",
        "regname": "固原",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "272",
        "parid": "20",
        "regname": "石嘴山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "273",
        "parid": "20",
        "regname": "吴忠",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "274",
        "parid": "20",
        "regname": "中卫",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "275",
        "parid": "21",
        "regname": "西宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "276",
        "parid": "21",
        "regname": "果洛",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "277",
        "parid": "21",
        "regname": "海北",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "278",
        "parid": "21",
        "regname": "海东",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "279",
        "parid": "21",
        "regname": "海南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "280",
        "parid": "21",
        "regname": "海西",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "281",
        "parid": "21",
        "regname": "黄南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "282",
        "parid": "21",
        "regname": "玉树",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "283",
        "parid": "22",
        "regname": "济南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "284",
        "parid": "22",
        "regname": "青岛",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "285",
        "parid": "22",
        "regname": "滨州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "286",
        "parid": "22",
        "regname": "德州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "287",
        "parid": "22",
        "regname": "东营",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "288",
        "parid": "22",
        "regname": "菏泽",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "289",
        "parid": "22",
        "regname": "济宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "290",
        "parid": "22",
        "regname": "莱芜",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "291",
        "parid": "22",
        "regname": "聊城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "292",
        "parid": "22",
        "regname": "临沂",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "293",
        "parid": "22",
        "regname": "日照",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "294",
        "parid": "22",
        "regname": "泰安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "295",
        "parid": "22",
        "regname": "威海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "296",
        "parid": "22",
        "regname": "潍坊",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "297",
        "parid": "22",
        "regname": "烟台",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "298",
        "parid": "22",
        "regname": "枣庄",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "299",
        "parid": "22",
        "regname": "淄博",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "300",
        "parid": "23",
        "regname": "太原",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "301",
        "parid": "23",
        "regname": "长治",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "302",
        "parid": "23",
        "regname": "大同",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "303",
        "parid": "23",
        "regname": "晋城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "304",
        "parid": "23",
        "regname": "晋中",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "305",
        "parid": "23",
        "regname": "临汾",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "306",
        "parid": "23",
        "regname": "吕梁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "307",
        "parid": "23",
        "regname": "朔州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "308",
        "parid": "23",
        "regname": "忻州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "309",
        "parid": "23",
        "regname": "阳泉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "310",
        "parid": "23",
        "regname": "运城",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "311",
        "parid": "24",
        "regname": "西安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "312",
        "parid": "24",
        "regname": "安康",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "313",
        "parid": "24",
        "regname": "宝鸡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "314",
        "parid": "24",
        "regname": "汉中",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "315",
        "parid": "24",
        "regname": "商洛",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "316",
        "parid": "24",
        "regname": "铜川",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "317",
        "parid": "24",
        "regname": "渭南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "318",
        "parid": "24",
        "regname": "咸阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "319",
        "parid": "24",
        "regname": "延安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "320",
        "parid": "24",
        "regname": "榆林",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "321",
        "parid": "25",
        "regname": "上海",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "322",
        "parid": "26",
        "regname": "成都",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "323",
        "parid": "26",
        "regname": "绵阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "324",
        "parid": "26",
        "regname": "阿坝",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "325",
        "parid": "26",
        "regname": "巴中",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "326",
        "parid": "26",
        "regname": "达州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "327",
        "parid": "26",
        "regname": "德阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "328",
        "parid": "26",
        "regname": "甘孜",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "329",
        "parid": "26",
        "regname": "广安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "330",
        "parid": "26",
        "regname": "广元",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "331",
        "parid": "26",
        "regname": "乐山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "332",
        "parid": "26",
        "regname": "凉山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "333",
        "parid": "26",
        "regname": "眉山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "334",
        "parid": "26",
        "regname": "南充",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "335",
        "parid": "26",
        "regname": "内江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "336",
        "parid": "26",
        "regname": "攀枝花",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "337",
        "parid": "26",
        "regname": "遂宁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "338",
        "parid": "26",
        "regname": "雅安",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "339",
        "parid": "26",
        "regname": "宜宾",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "340",
        "parid": "26",
        "regname": "资阳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "341",
        "parid": "26",
        "regname": "自贡",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "342",
        "parid": "26",
        "regname": "泸州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "343",
        "parid": "27",
        "regname": "天津",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "344",
        "parid": "28",
        "regname": "拉萨",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "345",
        "parid": "28",
        "regname": "阿里",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "346",
        "parid": "28",
        "regname": "昌都",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "347",
        "parid": "28",
        "regname": "林芝",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "348",
        "parid": "28",
        "regname": "那曲",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "349",
        "parid": "28",
        "regname": "日喀则",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "350",
        "parid": "28",
        "regname": "山南",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "351",
        "parid": "29",
        "regname": "乌鲁木齐",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "352",
        "parid": "29",
        "regname": "阿克苏",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "353",
        "parid": "29",
        "regname": "阿拉尔",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "354",
        "parid": "29",
        "regname": "巴音郭楞",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "355",
        "parid": "29",
        "regname": "博尔塔拉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "356",
        "parid": "29",
        "regname": "昌吉",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "357",
        "parid": "29",
        "regname": "哈密",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "358",
        "parid": "29",
        "regname": "和田",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "359",
        "parid": "29",
        "regname": "喀什",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "360",
        "parid": "29",
        "regname": "克拉玛依",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "361",
        "parid": "29",
        "regname": "克孜勒苏",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "362",
        "parid": "29",
        "regname": "石河子",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "363",
        "parid": "29",
        "regname": "图木舒克",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "364",
        "parid": "29",
        "regname": "吐鲁番",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "365",
        "parid": "29",
        "regname": "五家渠",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "366",
        "parid": "29",
        "regname": "伊犁",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "367",
        "parid": "30",
        "regname": "昆明",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "368",
        "parid": "30",
        "regname": "怒江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "369",
        "parid": "30",
        "regname": "普洱",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "370",
        "parid": "30",
        "regname": "丽江",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "371",
        "parid": "30",
        "regname": "保山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "372",
        "parid": "30",
        "regname": "楚雄",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "373",
        "parid": "30",
        "regname": "大理",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "374",
        "parid": "30",
        "regname": "德宏",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "375",
        "parid": "30",
        "regname": "迪庆",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "376",
        "parid": "30",
        "regname": "红河",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "377",
        "parid": "30",
        "regname": "临沧",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "378",
        "parid": "30",
        "regname": "曲靖",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "379",
        "parid": "30",
        "regname": "文山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "380",
        "parid": "30",
        "regname": "西双版纳",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "381",
        "parid": "30",
        "regname": "玉溪",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "382",
        "parid": "30",
        "regname": "昭通",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "383",
        "parid": "31",
        "regname": "杭州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "384",
        "parid": "31",
        "regname": "湖州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "385",
        "parid": "31",
        "regname": "嘉兴",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "386",
        "parid": "31",
        "regname": "金华",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "387",
        "parid": "31",
        "regname": "丽水",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "388",
        "parid": "31",
        "regname": "宁波",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "389",
        "parid": "31",
        "regname": "绍兴",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "390",
        "parid": "31",
        "regname": "台州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "391",
        "parid": "31",
        "regname": "温州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "392",
        "parid": "31",
        "regname": "舟山",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "393",
        "parid": "31",
        "regname": "衢州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "394",
        "parid": "32",
        "regname": "重庆",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "395",
        "parid": "33",
        "regname": "香港",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "396",
        "parid": "34",
        "regname": "澳门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "397",
        "parid": "35",
        "regname": "台湾",
        "regtype": "2",
        "ageid": "0"
      }]
    }
    return app.data.provinceCityList;
  },
  //方法：获取用户机器信息并保存
  getUserSysInfo: function (mainObj, userId) {
    let that = mainObj,
      app = this,
      uSysData = null,
      ostype = "",
      currentOS = app.data.currentOS;
    try {
      const res = wx.getSystemInfoSync();
      uSysData = {
        userId: userId,
        brand: res.brand,
        model: res.model,
        pixelRatio: res.pixelRatio,
        screenWidth: res.screenWidth,
        screenHeight: res.screenHeight,
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        statusBarHeight: res.statusBarHeight,
        language: res.language,
        version: res.version,
        system: res.system,
        platform: res.platform,
        fontSizeSetting: res.fontSizeSetting,
        SDKVersion: res.SDKVersion,
        benchmarkLevel: "",
      }
      let brand = (res.brand != null && res.brand != undefined) ? res.brand : "",
        model = (res.model != null && res.model != undefined) ? res.model : "",
        system = (res.system != null && res.system != undefined) ? res.system : "";
      ostype = brand + "/" + model + "/" + system;

      if (res.platform == "devtools") {
        currentOS.osName = "PC";
        currentOS.osTag = 0;
        if (!Utils.isNull(res.system)) {
          if (res.system.toUpperCase().indexOf("IOS") >= 0) {
            currentOS.osTag = 2;
          } else {
            currentOS.osTag = 1;
          }
        }
      } else if (res.platform == "ios") {
        currentOS.osName = "IOS";
        currentOS.osTag = 2;
      } else if (res.platform == "android") {
        currentOS.osName = "android";
        currentOS.osTag = 1;
      }
    } catch (e) {}
    app.data.ostype = ostype;
    app.data.currentOS = currentOS;
    app.setUserSysInfo(that, uSysData);
  },
  //方法：用户信息登记
  setUserSysInfo: function (mainObj, uSysData) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //cls=main_userSystemInfo&action=saveUserSystemInfo&appId=" + appId+ "&timestamp=" + timestamp

    var urlParam = "cls=main_userSystemInfo&action=saveUserSystemInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    // console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    // console.log(URL + urlParam)
    // console.log('~~~~~~~~~~~~~~~~~~~')
    // console.log(JSON.stringify(uSysData));
    wx.request({
      url: URL + urlParam,
      data: {
        systemInfo: uSysData
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("用户系统信息登记成功！！")
        } else {
          console.log("用户系统信息登记失败：" + res.data.rspMsg)
        }
      },
      fail: function (err) {
        console.log("用户系统信息登记接口调用失败：" + err)
      }
    })
  },
  ////////////////////////////////////////////////////////////////////////////
  //-------功能操作权限处理--------------------------------------------------------
  //方法：功能操作权限检查——主要是区分注册完善信息方面功能操作的限制
  //参数说明：
  //mainObj：当前页面
  //funId：功能ID
  //tag：0写操作，1读操作
  checkFunctionRights: function (mainObj, funId, tag) {
    var that = mainObj,
      app = this,
      isCanUse = false;
    //11报价，12询价，13订单，2产品，51供应，52采购，6零钱
    switch (funId) {
      case 11:
      case 12:
      case 13:
        //权限判断
        //if (!app.isPerfectPersonInfo()) return;
        isCanUse = true;
        break;
      case 2:
        isCanUse = true;
        break;
      case 51:
      case 52:
        switch (tag) {
          case 0:
            isCanUse = true;
            break;
          case 1:
            if (!app.isRegister()) {
              that.setData({
                isShowRegGuider: true,
              })
            } else
              isCanUse = true;
            break;
        }

        break;
      case 6:
        if (!app.isRegister()) {
          that.setData({
            isShowRegGuider: true,
          })
        } else
          isCanUse = true;
        break;
    }

    return isCanUse;
  },
  //方法：获取用户特性
  checkUserFeatures: function (userInfo) {
    let app = this,
      isPerfectUserInfo = false;
    app.data.isRegister = false;
    app.data.userRoleType = 0;

    if (Utils.isNotNull(userInfo)) {
      if (!Utils.isNull(userInfo.mobile)) {
        app.data.isRegister = true;
      }

      app.data.userRoleType = userInfo.companyType == 2 ? 1 : 0;

      //用户类型：0个人，1公司
      if (app.data.isRegister) {
        switch (app.data.userRoleType) {
          case 1:
            // if (!Utils.isNull(userInfo.contact) && !Utils.isNull(userInfo.mobile) && !Utils.isNull(userInfo.company) && !Utils.isNull(userInfo.personalTrade) && !Utils.isNull(userInfo.job) && !Utils.isNull(userInfo.companyContact) && !Utils.isNull(userInfo.personalTel) && !Utils.isNull(userInfo.addr) && !Utils.isNull(userInfo.companyLogo) && !Utils.isNull(userInfo.companyFile)) {
            //   isPerfectUserInfo=true;
            // }
            if (!Utils.isNull(userInfo.contact) && !Utils.isNull(userInfo.mobile) && !Utils.isNull(userInfo.company)) {
              isPerfectUserInfo = true;

            }
            break;
          default:
            if (!Utils.isNull(userInfo.contact) && !Utils.isNull(userInfo.mobile) && !Utils.isNull(userInfo.headerImg) && !Utils.isNull(userInfo.sex) && !Utils.isNull(userInfo.personalTrade) && !Utils.isNull(userInfo.job)) {
              isPerfectUserInfo = true;
            }
            break;
        }
      }
      app.data.isPerfectUserInfo = isPerfectUserInfo;
    }
  },
  //////////////////////////////////////////////////////////////////////////
  //--------获取会员服务权限数据-----------------------------------------------------
  //方法：获取会员服务权限数据信息——主要为“我的”-“服务管理”里面设置的相关限制
  //参数说明：
  //mainObj：当前页面
  //userId：当前用户ID
  //moduleId：模块ID——
  //          1: 剩余报价单个数,
  //          2: 剩余询价单个数,
  //          3: 剩余名片创建张数,
  //          4: 剩余产品创建个数,
  //          5: 剩余公司资料创建个数,
  //          6: 查看发布供应信息个数,
  //          7: 查看发布采购信息个数,
  //          8: 可查看的买家级别
  getMemberSrvRightData: function (mainObj, userId, moduleId, tag) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date()),
      urlParam = "",
      sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=serviceManager_serviceManager&action=findSingleServiceManager&userId=" + userId + "&moduleType=" + moduleId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var isPassSrvRight = false,
            remainder = 0;
          if (moduleId != 8) {
            try {
              remainder = parseInt(res.data.data.remainder);
              remainder = isNaN(remainder) ? 0 : remainder;
            } catch (err) {}
            if (remainder > 0) isPassSrvRight = true;
            console.log("剩余上限数量：" + res.data.data.remainder);
            if (moduleId == 6 || moduleId == 7) {
              that.setData({
                isPassSrvRight: true,
                totalDataCountLimit: remainder,
              })
            } else {
              that.setData({
                isPassSrvRight: isPassSrvRight,
              })
            }
          } else {
            that.setData({
              srvRightData: res.data.data,
            })
          }
          that.exeSrvRightOperation(tag);
        } else {
          app.setErrorMsg2(that, "获取会员服务权限信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取会员服务权限信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "操作权限接口调用失败！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：是否有查看商机信息权限
  //参数说明：
  //mainObj：当前页面
  //userId：当前用户ID
  //viewUserId：目标信息用户ID
  //viewInfoId：目标信息ID
  //infoType：目标信息类型：1供应，2采购
  isPassBusinessViewRight: function (mainObj, userId, viewUserId, viewInfoId, infoType) {
    var that = mainObj,
      app = this,
      result = false;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date()),
      urlParam = "",
      sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=serviceManager_serviceManager&action=insertBusinessClickRecord&userId=" + userId + "&clickUserId=" + viewUserId + "&businessId=" + viewInfoId + "&businessType=" + infoType + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          if (res.data.data.isTure != null && res.data.data.isTure != undefined && Utils.myTrim(res.data.data.isTure + "") != "" && Utils.myTrim(res.data.data.isTure + "").toLowerCase() == "true")
            result = true;

          that.setData({
            isPassSrvRight: result,
          })
          that.exeSrvRightOperation(0);
        } else {
          app.setErrorMsg2(that, "获取会员服务权限信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取会员服务权限信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "获取权限接口调用失败！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：设置模块使用情况信息
  setFunctionModuleInfo: function (mainObj, mid) {
    var that = mainObj,
      app = this,
      userId = 0;
    if (app.globalData.userInfo != null || app.globalData.userInfo != undefined)
      userId = app.globalData.userInfo.userId;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=moduleFrequency_moduleFrequency&action=insertModuleFrequency&userId=" + userId + "&type=" + mid + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    // console.log(URL + urlParam)
    // console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        // console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("设置模块信息：成功！")
        } else {
          var rspMsg = res.data.rspMsg;
          wx.showToast({
            title: rspMsg,
            icon: 'none',
            duration: 4000
          })
          app.setErrorMsg2(that, "设置模块信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "设置模块信息接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "设置模块信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  ////////////////////////////////////////////////////
  //--微官网部分-----------------------------------------
  //方法：判断是否登录，没登录则跳转登录页面
  isLoginCheck: function (mainObj, pageName) {
    var that = mainObj,
      app = this;
    if (app.globalData.muserInfo == null || app.globalData.muserInfo.userId == null || app.globalData.muserInfo.userId == undefined || app.globalData.muserInfo.userId <= 0) {
      wx.navigateTo({
        url: "../asite/login/login?spage=" + pageName
      });
    }
  },
  //方法：获取官网完整URL路径
  getASSysImgUrl: function (src) {
    var result = "",
      app = this;
    var DataURL = app.getUrlAndKey.mdataUrl;
    if (src != null && src != undefined && Utils.myTrim(src) != "") {
      if (src.toUpperCase().indexOf("HTTP") >= 0)
        result = src;
      else
        result = DataURL + (src.substr(0, 1) == "/" ? src : "/" + src);
    }
    return result;
  },
  //方法：获取官网相对URL路径
  getASPartSysImgUrl: function (src) {
    var result = "",
      app = this;
    var DataURL = app.getUrlAndKey.mdataUrl;
    if (src != null && src != undefined && Utils.myTrim(src) != "") {
      if (src.toUpperCase().indexOf("HTTP") >= 0)
        result = src.replace(DataURL, '');
      else
        result = src.substr(0, 1) == "/" ? src : "/" + src;
    }
    return result;
  },

  ////////////////////////////////////////////////////
  //--报价优部分-----------------------------------------
  //方法：检查更新新版本
  checkAndUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      console.log('是否进入模拟更新');
      //检测版本更新
      updateManager.onCheckForUpdate(function (res) {
        console.log('是否获取版本');
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function () {

            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //方法：检测网络状态
  checkNetworkStatus: function () {
    if (!this.data.isConnected) {
      wx.showToast({
        title: '当前网络信号不好...',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：获取酒店Key
  getPayHotelData: function (mainObj) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=main_hoteloptions&action=hoteloptionsList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&HotelID=" + app.data.hotelId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined && res.data.data.dataList != null && res.data.data.dataList != undefined && res.data.data.dataList.length > 0) {
          var hotelKey = "";
          try {
            hotelKey = res.data.data.dataList[0].OptionValue;
          } catch (err) {}
          app.data.hotelKey = hotelKey;
          console.log("HotelKey:" + hotelKey)
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取酒店参数信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取酒店参数信息接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取酒店参数信息接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：返回上一页
  returnBackPage: function () {
    console.log("navigateBack......")
    wx.navigateBack({
      delta: 1
    })
  },
  //方法：日志信息登记
  setLogInfo: function (mainObj, content, url) {
    var that = mainObj,
      app = this;

    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var errorInfo = {
      error: content,
      url: url,
      userId: -1,
      OSType: app.data.ostype,
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //cls=main_errorInfo&action=saveErrorInfo&appId=" + appId+ "&timestamp=" + timestamp

    var urlParam = "cls=main_errorInfo&action=saveErrorInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(JSON.stringify(errorInfo));
    wx.request({
      url: URL + urlParam,
      data: {
        errorInfo: errorInfo
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("日志信息登记成功！！")
        } else {
          console.log("日志信息登记失败：" + res.data.rspMsg)
        }
      },
      fail: function (err) {
        console.log("日志信息登记接口调用失败：" + err)
      }
    })
  },
  //方法：出错处理
  setErrorMsg: function (mainObj, message, url) {
    var that = mainObj,
      app = this;
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })

    try {
      app.setLogInfo(that, message, url);
    } catch (e) {}
    console.log(message)
  },
  //方法：出错处理:isShowPop——是否弹出错误信息
  setErrorMsg2: function (mainObj, message, url, isShowPop) {
    var that = mainObj,
      app = this;
    if (isShowPop) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    }

    try {
      app.setLogInfo(that, message, url);
    } catch (e) {}
    console.log(message)
  },
  //方法：判断是否有管理权限
  isManagerRight: function (mainObj, operaterId) {
    var that = mainObj,
      app = this,
      result = false;
    if (app.globalData.muserInfo.userId == operaterId) result = true;

    return result;
  },
  //方法：获取权限级别：0无直接操作权限（只能接收报价、接收产品【已收产品存库】），1有操作权限
  getRightLevel: function () {
    var app = this,
      result = 0,
      userMobile = "";
    if (app.globalData.muserInfo == null || app.globalData.muserInfo == undefined) return 0;
    try {
      userMobile = Utils.myTrim(app.globalData.muserInfo.userMobile);
    } catch (err) {}

    if (userMobile != "") result = 1;
    //新用户24小时内可使用报价优功能规则
    if (result == 0 && app.globalData.muserInfo.userRegTime != null && app.globalData.muserInfo.userRegTime != undefined) {
      var allIntervals = Utils.getTimeInterval(app.globalData.muserInfo.userRegTime, new Date(), 0),
        limitIntervals = 24 * 3600 * 1000;
      if (allIntervals < limitIntervals) result = 1;
    }
    return result;
  },
  //方法：完善信息检查
  isPerfectPersonInfo: function () {
    var app = this,
      result = false;
    if (app.getRightLevel() < 1) {
      wx.showToast({
        title: app.data.regMsg,
        icon: 'none',
        duration: 4000
      })
      return false;
    }
    return true;
  },
  //方法：判断用户是否注册
  isRegister: function () {
    var app = this,
      result = false;
    var userName = Utils.myTrim(app.globalData.muserInfo.userName),
      userMobile = Utils.myTrim(app.globalData.muserInfo.userMobile);
    if (userMobile != "") result = true;

    return result;
  },

  //方法：密码权限检查
  isAppPWRight: function () {
    var result = false,
      app = this;
    if (app.data.isPasswordRight)
      result = true;
    else {
      wx.showToast({
        title: "密码错误，请重新输入！",
        icon: 'none',
        duration: 2000
      })
    }

    return result;
  },
  //方法：获取主完整URL路径
  getSysImgUrl: function (src) {
    var result = "",
      app = this;
    var DataURL = app.getUrlAndKey.dataUrl;
    if (src != null && src != undefined && Utils.myTrim(src) != "") {
      if (src.toUpperCase().indexOf("HTTP") >= 0)
        result = src;
      else
        result = DataURL + (src.substr(0, 1) == "/" ? src : "/" + src);
    }
    return result;
  },
  //方法：获取主相对URL路径
  getPartSysImgUrl: function (src) {
    var result = "",
      app = this;
    var DataURL = app.getUrlAndKey.dataUrl;
    if (src != null && src != undefined && Utils.myTrim(src) != "") {
      if (src.toUpperCase().indexOf("HTTP") >= 0)
        result = src.replace(DataURL, '');
      else
        result = src.substr(0, 1) == "/" ? src : "/" + src;
    }
    return result;
  },
  //方法：对视频和图片的处理方法
  //dataUrlStrList：半角逗号分隔的地址列表
  //tag:10获取第一张图片,11获取第一个视频,20获取图片列表,21获取视频列表
  operateVideoAndImg: function (dataUrlStrList, tag) {
    let app = this,
      result = null,
      photosString = "",
      photosTemp = [];
    if (dataUrlStrList != null && dataUrlStrList != undefined && Utils.myTrim(dataUrlStrList + "") != "") {
      photosTemp = dataUrlStrList.split(",");
    }
    switch (tag) {
      //获取第一张图片
      case 10:
        if (photosTemp.length > 0) {
          for (var n = 0; n < photosTemp.length; n++) {
            // 判断是否是视频地址
            photosString = photosTemp[n];
            photosString = photosString != null && photosString != undefined ? photosString.toLowerCase() : photosString;
            if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
              result = app.getSysImgUrl(photosTemp[n]);
              break;
            }
          }
        }
        break;
        //获取第一个视频
      case 11:
        if (photosTemp.length > 0) {
          for (var n = 0; n < photosTemp.length; n++) {
            // 判断是否是视频地址
            photosString = photosTemp[n];
            photosString = photosString != null && photosString != undefined ? photosString.toLowerCase() : photosString;
            if (!Utils.isNull(photosString) && !(photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
              result = app.getSysImgUrl(photosTemp[n]);
              break;
            }
          }
        }
        break;
        //获取图片列表
      case 20:
        if (photosTemp.length > 0) {
          result = [];
          for (var n = 0; n < photosTemp.length; n++) {
            // 判断是否是视频地址
            photosString = photosTemp[n];
            photosString = photosString != null && photosString != undefined ? photosString.toLowerCase() : photosString;
            if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
              result.push(app.getSysImgUrl(photosTemp[n]));
            }
          }
        }
        break;
        //获取视频列表
      case 21:
        if (photosTemp.length > 0) {
          result = [];
          for (var n = 0; n < photosTemp.length; n++) {
            // 判断是否是视频地址
            photosString = photosTemp[n];
            photosString = photosString != null && photosString != undefined ? photosString.toLowerCase() : photosString;
            if (!Utils.isNull(photosString) && !(photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
              result.push(app.getSysImgUrl(photosTemp[n]));
            }
          }
        }
        break;
    }
    result = result != null && result != undefined ? result : (tag == 10 || tag == 11 ? "" : (tag == 20 || tag == 21 ? [] : result));
    return result;
  },

  //事件：图片查看事件
  viewImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var urls = []
    if (Utils.myTrim(src) != "") {
      urls.push(src);
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    } else {
      wx.showToast({
        title: "无效图片",
        icon: 'none',
        duration: 2000
      })
    }
    console.log(e);
  },
  //--------------登录注册----------------------
  //方法：（注册/登录）登录用户信息获取
  //参数说明：
  //mainObj：当前页面
  getLoginUserInfo: function (mainObj) {
    var that = mainObj,
      app = this;
    console.log("app getLoginUserInfo")
    if (app.data.isLoginCheckCacheUserId) {
      console.log("LoginCheckCacheUserId")
      var userId = 0;
      try {
        userId = parseInt(wx.getStorageSync('store_userId_' + app.data.version + '_' + app.data.wxAppId));
        userId = isNaN(userId) ? 0 : userId;
        console.log("userId：" + userId)
        if (userId > 0) {
          wx.checkSession({
            success() {
              app.regionBJYSys(mainObj, "", "", "", userId, 1);
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              app.getWeChatLoginUserInfo(that, 1);
            }
          })

          return;
        }
      } catch (e) {}
    }
    app.getWeChatLoginUserInfo(that, 1);
  },
  //方法：（注册/登录）登录用户信息获取
  //参数说明：
  //mainObj：当前页面
  //timeTag：重试次数标记
  getWeChatLoginUserInfo: function (mainObj, timeTag) {
    var that = mainObj,
      app = this,
      timeOutTryCnt = app.data.timeOutTryCnt == null || app.data.timeOutTryCnt == undefined ? 1 : app.data.timeOutTryCnt;
    console.log("app getWeChatLoginUserInfo")
    console.log("通过微信登录。。。。。。")
    try {
      if (app.data.isSetNickName) {
        console.log("Login without check authorization!...")
        wx.login({
          success: res => {
            //用户登录凭证（有效期五分钟）
            if (res.code) {
              app.regionBJYSys(mainObj, "", "", res.code, 0, 1);
            }
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: "wx.login调用失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
            if (timeTag <= timeOutTryCnt) {
              timeTag = timeTag + 1;
              app.getWeChatLoginUserInfo(that, timeTag);
            }
          }
        })
      } else {
        console.log("Login and check authorization!...")
        wx.getSetting({
          success(res0) {
            console.log(res0.authSetting)
            if (res0.authSetting["scope.userInfo"]) {
              console.log("已经授权！！！")
              wx.login({
                success: res => {
                  //用户登录凭证（有效期五分钟）
                  console.log("已经login")
                  if (res.code) {
                    wx.getUserInfo({
                      success: function (res1) {
                        console.log("getUserInfo成功！")
                        var nickName = "",
                          avatarUrl = "";
                        console.log(res1);
                        if (res1.userInfo != null && res1.userInfo != undefined) {
                          nickName = res1.userInfo.nickName != null && res1.userInfo.nickName != undefined ? res1.userInfo.nickName : "";
                          avatarUrl = res1.userInfo.avatarUrl != null && res1.userInfo.avatarUrl != undefined ? res1.userInfo.avatarUrl : "";
                        }
                        app.regionBJYSys(mainObj, nickName, avatarUrl, res.code, 0, 1);
                      },
                      fail: function (err) {
                        console.log('获取用户信息失败')
                        wx.showToast({
                          title: "获取用户信息失败！",
                          icon: 'none',
                          duration: 2500
                        })
                        app.setErrorMsg2(that, "wx.getUserInfo失败：出错：" + JSON.stringify(err), "", false);
                      }
                    })
                  }
                },
                fail: function (err) {
                  console.log(err);
                  wx.showToast({
                    title: "wx.login调用失败！",
                    icon: 'none',
                    duration: 2000
                  })
                  app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
                  if (timeTag <= timeOutTryCnt) {
                    timeTag = timeTag + 1;
                    app.getWeChatLoginUserInfo(that, timeTag);
                  }
                }
              })
            } else {
              console.log("尚未授权！！！");
              //1、根据审核要求——登录去掉授权
              // try {
              //   that.dowithAppRegLogin(0);
              // } catch (err) { }

              //2、根据审核要求——不授权也可以直接登录
              wx.login({
                success: res => {
                  //用户登录凭证（有效期五分钟）
                  if (res.code) {
                    app.regionBJYSys(mainObj, "", "", res.code, 0, 1);
                  }
                },
                fail: function (err) {
                  console.log(err);
                  wx.showToast({
                    title: "wx.login调用失败！",
                    icon: 'none',
                    duration: 2000
                  })
                  app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
                  if (timeTag <= timeOutTryCnt) {
                    timeTag = timeTag + 1;
                    app.getWeChatLoginUserInfo(that, timeTag);
                  }
                }
              })
            }
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: "wx.getSetting调用失败！",
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "wx.getSetting失败：出错：" + JSON.stringify(err), "", false);
            if (timeTag <= timeOutTryCnt) {
              timeTag = timeTag + 1;
              app.getWeChatLoginUserInfo(that, timeTag);
            }
          }
        })
      }
    } catch (e) {
      app.setErrorMsg2(that, "app.getWeChatLoginUserInfo失败：出错：" + JSON.stringify(e), "", false);
      if (timeTag <= timeOutTryCnt) {
        timeTag = timeTag + 1;
        app.getWeChatLoginUserInfo(that, timeTag);
      }
    }

  },
  //方法：注册用户
  //参数说明：
  //mainObj：当前页面
  //nickName：微信授权后的昵称，可为空字符串
  //avatarUrl：微信授权后的头像，可为空字符串
  //code：wx.login获取到的code
  //userId：缓存的用户ID
  //timeTag：重试次数标记
  regionBJYSys: function (mainObj, nickName, avatarUrl, code, userId, timeTag) {
    var that = mainObj,
      app = this,
      isAuthor = false,
      paramShareUId = 0,
      timeOutTryCnt = app.data.timeOutTryCnt == null || app.data.timeOutTryCnt == undefined ? 1 : app.data.timeOutTryCnt
    if (that.data.paramShareUId != null && that.data.paramShareUId != undefined) {
      paramShareUId = that.data.paramShareUId;
    } else if (that.data.othersUserId != null && that.data.othersUserId != undefined) {
      paramShareUId = that.data.othersUserId;
    }
    paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;

    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    avatarUrl = Utils.myTrim(avatarUrl) == "undefined" ? "" : avatarUrl;
    if (Utils.myTrim(nickName) != "" && Utils.myTrim(avatarUrl) != "") isAuthor = true;
    nickName = Utils.myTrim(nickName) != "" ? Utils.filterEmoj(nickName) : nickName;
    nickName = Utils.myTrim(nickName) != "" ? nickName : "微信用户";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=userReg&js_code=" + code + "&appId=" + app.data.appid + "&timestamp=" + timestamp,
      userIdParam = app.data.isLoginCheckCacheUserId && userId > 0 ? "&userId=" + userId : "";
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + userIdParam + "&nickName=" + encodeURIComponent(nickName) + "&avatarUrl=" + avatarUrl + "&appType=1&sourceUserId=" + paramShareUId + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var userName = "",
            userRegTime = new Date(),
            userTel = "",
            userMobile = "",
            avatarUrl = "",
            userJobPosition = "",
            companyId = 0,
            companyName = "",
            companyDescribe = "",
            companyLegal = "",
            companyTel = "",
            companyEmail = "",
            companyAddress = "",
            companyLogo = "",
            wxopenId = "",
            companyType = 1,
            companyStatus = 0,
            serviceEndTime = new Date,
            userCVersionType = 1,
            userRole = "",
            userIndustry = "",
            userFollowIndustry = "",
            isDistributor = false,
            roleStatus = 0,member_id=0;
          var mainData = res.data;
          if (mainData.data == null) return;

          if (Utils.isDBNotNull(mainData.data.userMap.companyId)) {
            companyId = parseInt(mainData.data.userMap.companyId);
            companyId = isNaN(companyId) ? 0 : companyId;
          }
          if (Utils.isDBNotNull(mainData.data.userMap.member_id)) {
            member_id = parseInt(mainData.data.userMap.member_id);
            member_id = isNaN(member_id) ? 0 : member_id;
          }
          if (Utils.isDBNotNull(mainData.data.userMap.roleStatus)) {
            roleStatus = parseInt(mainData.data.userMap.roleStatus);
            roleStatus = isNaN(roleStatus) ? 0 : roleStatus;
          }
          if (Utils.isDBNotNull(mainData.data.userMap.companyType)) {
            companyType = parseInt(mainData.data.userMap.companyType);
            companyType = isNaN(companyType) ? 1 : companyType;
          }
          if (Utils.isDBNotNull(mainData.data.userMap.companyStatus)) {
            companyStatus = parseInt(mainData.data.userMap.companyStatus);
            companyStatus = isNaN(companyStatus) ? 0 : companyStatus;
          }
          if (Utils.isDBNotNull(mainData.data.userMap.serviceEndTime)) {
            try {
              serviceEndTime = new Date(mainData.data.userMap.serviceEndTime.replace(/\-/g, "/"));
            } catch (e) {}
          }
          if (Utils.isDBNotNull(mainData.data.userMap.regTime)) {
            try {
              userRegTime = new Date(mainData.data.userMap.regTime.replace(/\-/g, "/"));
            } catch (e) {}
          }
          if (Utils.isDBNotNull(mainData.data.userMap.wxopenId)) wxopenId = mainData.data.userMap.wxopenId;
          if (Utils.isDBNotNull(mainData.data.userMap.contact)) userName = mainData.data.userMap.contact;
          if (Utils.isDBNotNull(mainData.data.userMap.tel)) userTel = mainData.data.userMap.tel;

          if (Utils.isDBNotNull(mainData.data.userMap.job)) userJobPosition = mainData.data.userMap.job;
          if (Utils.isDBNotNull(mainData.data.userMap.mobile)) userMobile = mainData.data.userMap.mobile;
          if (Utils.isDBNotNull(mainData.data.userMap.headerImg) && mainData.data.userMap.headerImg.indexOf(defaultHeadImg) < 0) avatarUrl = mainData.data.userMap.headerImg;
          if (Utils.isDBNotNull(mainData.data.userMap.personalClass)) userRole = mainData.data.userMap.personalClass;
          if (Utils.isDBNotNull(mainData.data.userMap.personalTrade)) userIndustry = mainData.data.userMap.personalTrade;
          if (Utils.isDBNotNull(mainData.data.userMap.productInfo)) userFollowIndustry = mainData.data.userMap.productInfo;
          if (Utils.isDBNotNull(mainData.data.userMap.shareUser)) {
            isDistributor = mainData.data.userMap.shareUser;
          }

          if (Utils.isNotNull(mainData.data.companyMap)) {
            if (Utils.isDBNotNull(mainData.data.companyMap.company)) companyName = mainData.data.companyMap.company;
            if (Utils.isDBNotNull(mainData.data.companyMap.intro)) companyDescribe = mainData.data.companyMap.intro;
            if (Utils.isDBNotNull(mainData.data.companyMap.legal)) companyLegal = mainData.data.companyMap.legal;
            if (Utils.isDBNotNull(mainData.data.companyMap.tel)) companyTel = mainData.data.companyMap.tel;
            if (Utils.isDBNotNull(mainData.data.companyMap.email)) companyEmail = mainData.data.companyMap.email;
            if (Utils.isDBNotNull(mainData.data.companyMap.addr)) companyAddress = mainData.data.companyMap.addr;
            if (Utils.isDBNotNull(mainData.data.companyMap.logo)) companyLogo = mainData.data.companyMap.logo;
          }

          companyId = companyId <= 0 ? app.data.companyId : companyId;
          //userCVersionType：1个人版，2企业版
          // if (companyType == 2 && (companyStatus == 1 || companyStatus == 7))
          //   userCVersionType = 2;

          var time = Date.parse(new Date()) / 1000;
          var userData = mainData.data.userMap;
          var companyUserMap = mainData.data.companyUserMap;
          var serviceEndTime = userData.serviceEndTime;
          if (!Utils.isNull(serviceEndTime)) {
            serviceEndTime = String(serviceEndTime.replace(/-/g, '/'));
            serviceEndTime = Date.parse(serviceEndTime) / 1000;
            if (userData.companyType == 2 && userData.companyStatus == 1 && serviceEndTime >= time) { //判断是否企业版
              userCVersionType = 2;
              userData.companyType = 2;
            } else {
              userCVersionType = 1;
              userData.companyType = 1;
            }
          }
          app.globalData.userTotalInfo = userData; //存入用户完整信息;
          app.globalData.companyUserMap = companyUserMap; //存入用户完整信息;

          var userinfo = {
            userId: mainData.data.userMap.id,
            userName: userName,
            roleStatus: roleStatus,
            wxopenId: wxopenId,
            avatarUrl: app.getSysImgUrl(avatarUrl),
            userJobPosition: userJobPosition,
            userMobile: userMobile,
            userPhone: userTel,
            userRegTime: userRegTime,
            serviceEndTime: serviceEndTime,
            userCVersionType: userCVersionType,
            userRole: userRole,
            userIndustry: userIndustry,
            userFollowIndustry: userFollowIndustry,

            companyId: companyId,
            companyName: companyName,
            companyAddress: companyAddress,
            companyDescribe: companyDescribe,
            companyLegal: companyLegal,
            companyTel: companyTel,
            companyEmail: companyEmail,
            companyLogo: app.getSysImgUrl(companyLogo),
            companyType: companyType,
            companyStatus: companyStatus,
            isDistributor: isDistributor,member_id:member_id,member_sort:0,member_name:"",
          }
          wx.setStorageSync('userNickName' + app.data.currentVersion, userinfo.userName)
          console.log("设置缓存“userNickName" + app.data.currentVersion + "”=" + userinfo.userName);
          console.log("获取缓存“userNickName" + app.data.currentVersion + "”=" + wx.getStorageSync('userNickName' + app.data.currentVersion));
          wx.setStorageSync('userinfo' + app.data.currentVersion, userinfo);
          if (app.data.isLoginCheckCacheUserId) {
            try {
              wx.setStorageSync('store_userId_' + app.data.version + '_' + app.data.wxAppId, userinfo.userId);
            } catch (e) {}
          }
          app.globalData.muserInfo = userinfo;
          app.globalData.userInfo = userinfo;
          app.data.isRegisterMobile=Utils.myTrim(userinfo.userMobile)!=""?true:false;
          if (mainData.data.companyUserMap != null && mainData.data.companyUserMap != undefined) {
            var cuMainData = mainData.data.companyUserMap,
              cuCompanyId = 0,
              cuUserId = 0,
              cuCompanyUserId = 0,
              cuId = 0,
              cuStatus = 0,
              cuUserType = 0;
            var cuObj = null,
              cuObjList = [];
            cuId = cuMainData.id;
            if (cuMainData.companyId != null && cuMainData.companyId != undefined && Utils.myTrim(cuMainData.companyId + "") != "")
              cuCompanyId = parseInt(cuMainData.companyId);
            cuCompanyId = isNaN(cuCompanyId) ? 0 : cuCompanyId;
            if (cuMainData.userId != null && cuMainData.userId != undefined && Utils.myTrim(cuMainData.userId + "") != "")
              cuUserId = parseInt(cuMainData.userId);
            cuUserId = isNaN(cuUserId) ? 0 : cuUserId;
            if (cuMainData.companyUserId != null && cuMainData.companyUserId != undefined && Utils.myTrim(cuMainData.companyUserId + "") != "")
              cuCompanyUserId = parseInt(cuMainData.companyUserId);
            cuCompanyUserId = isNaN(cuCompanyUserId) ? 0 : cuCompanyUserId;
            if (cuMainData.userType != null && cuMainData.userType != undefined && Utils.myTrim(cuMainData.userType + "") != "")
              cuUserType = parseInt(cuMainData.userType);
            cuUserType = isNaN(cuUserType) ? 0 : cuUserType;
            if (cuMainData.status != null && cuMainData.status != undefined && Utils.myTrim(cuMainData.status + "") != "")
              cuStatus = parseInt(cuMainData.status);
            cuStatus = isNaN(cuStatus) ? 0 : cuStatus;
            cuObj = {
              id: cuId,
              userId: cuUserId,
              companyId: cuCompanyId,
              companyUserId: cuCompanyUserId,
              userType: cuUserType,
              status: cuStatus
            }

            cuObjList.push(cuObj)
            wx.setStorageSync('companyuserinfo' + app.data.currentVersion, cuObjList);
            app.globalData.companyUsers = cuObjList;
          }

          console.log("登录用户信息获取：成功！")
          console.log(userinfo);
          //登记用户系统相关信息
          app.getUserSysInfo(null, userinfo.userId);
          
          //判断是否为小程序首页，如果为小程序首页则直接跳转页面；否则先获取公司信息再跳转首页
          if (that.data.checkPageName != null && that.data.checkPageName != undefined && Utils.myTrim(that.data.checkPageName) == "siteindex"){
            //获取缓存的平台账户信息
            app.getSysUserAccountInfo();
            that.dowithAppRegLogin(1);
          }else{
            app.getMainCompanyDataInfo(mainObj);
          }
          //检查是否进行拼团抽奖操作
          if(app.data.isOpenGWPrize){
            let otherGWParam="&userId="+userinfo.userId +"&xcxAppId="+app.data.wxAppId;
            app.setGWPrizeResult(that,otherGWParam);
          }
        } else if (res.data.rspCode == -100) {
          console.log("regionBJYSys 用户不存在！！！")
          app.getWeChatLoginUserInfo(that, 1);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "登录用户信息获取：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          if (timeTag <= timeOutTryCnt) {
            timeTag = timeTag + 1;
            app.regionBJYSys(mainObj, nickName, avatarUrl, code, userId, timeTag);
          } else {
            that.dowithAppRegLogin(0);
          }
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "登录用户信息接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "登录用户信息获取接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        if (timeTag <= timeOutTryCnt) {
          timeTag = timeTag + 1;
          app.regionBJYSys(mainObj, nickName, avatarUrl, code, userId, timeTag);
        } else {
          that.dowithAppRegLogin(0);
        }
      }
    })
  },
  //事件：取消注册
  cancelRegAuthorization: function (mainObj) {
    var that = mainObj,
      app = this;

    wx.showModal({
      title: '系统消息',
      content: "您确定取消授权吗？",
      icon: 'none',
      duration: 1500,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          console.log("授权取消 cancel")
          return;
        } else {
          //点击确定
          console.log("授权取消 sure")
          var nickName = "",
            avatarUrl = "";
          wx.login({
            success: res => {
              //用户登录凭证（有效期五分钟）
              if (res.code) {
                app.data.js_code = res.code;
                app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
                that.setData({
                  isShowAuthor: false,
                })
              }
            }
          })
        }
      },
    })
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (mainObj, e) {
    var that = mainObj,
      app = this,
      nickName = "",
      avatarUrl = "";

    if (e.detail.userInfo != null && e.detail.userInfo != undefined) {
      nickName = e.detail.userInfo.nickName;
      avatarUrl = e.detail.userInfo.avatarUrl;

      wx.login({
        success: res => {
          //用户登录凭证（有效期五分钟）
          if (res.code) {
            app.data.js_code = res.code;
            app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
          }
        }
      })

    } else {
      wx.login({
        success: res => {
          //用户登录凭证（有效期五分钟）
          if (res.code) {
            app.data.js_code = res.code;
            app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
          }
        }
      })
    }

    that.setData({
      isShowAuthor: false,
    })
  },
  //--------------产品名片----------------------
  //事件：显示附加名片二维码
  showProductQRCard: function (mainObj, proData, e) {
    var that = mainObj,
      app = this,
      qrsrc = e.currentTarget.dataset.qrsrc,
      selCardQRName = "",
      item = e.currentTarget.dataset.item;
    try {
      if (item != null && item != undefined) selCardQRName = item.name;
    } catch (err) {}
    if (Utils.myTrim(qrsrc) == "") {
      if (proData.id > 0) {
        app.createCardQRImg(mainObj, proData);
      }
    } else {
      that.setData({
        selCardQRImgSrc: qrsrc,
        selCardQRName: selCardQRName,
        showModalqrcard: true
      })
    }
  },
  //方法：新建名片表单二维码
  createCardQRImg: function (mainObj, proData) {
    var that = mainObj,
      app = this;
    var sendBatch = Date.parse(new Date()),
      param = "",
      pageData = "";
    sendBatch = sendBatch / 1000;
    //发送报价
    app.saveShareProductList(mainObj, sendBatch, proData.id + "");
    //sType=2&qTag=88|4|0&qIds=1553495379&suid=311
    param = "sType=5|q=" + proData.id;
    pageData = "sType=5|qTag=" + proData.userId + "#" + proData.companyId + "#|qIds=" + sendBatch + "|suid=" + app.globalData.userInfo.userId;

    app.getQRCode(mainObj, proData, "pages/index/index", param, pageData);
  },
  //方法：获取二维码
  getQRCode: function (mainObj, proData, page, param, pageData) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_WXQRCode&action=getWXQRCode&page=" + page + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + app.globalData.userInfo.userId + "&pagedata=" + param + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      dataType: "json",
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("生成二维码成功！")
          if (res.data.data != null && res.data.data != undefined && res.data.data.imageAddress != null && res.data.data.imageAddress != undefined && Utils.myTrim(res.data.data.imageAddress) != "") {
            var qrsrc = app.getSysImgUrl(res.data.data.imageAddress.replace('/tts_upload', ''));
            proData.vCardList[0].qrSrc = qrsrc;
            proData.pageData = pageData;
            that.setData({
              proData: proData,
              selCardQRImgSrc: qrsrc,
              selCardQRName: proData.vCardList[0].name,
              showModalqrcard: true
            })
            //保存表单信息
            app.saveCurProductInfo(mainObj, proData);
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
          app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "生成二维码接口失败！",
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：保存已发送产品信息:批次号，产品ID序列，文件夹ID序列，是否做保存已收操作
  saveShareProductList: function (mainObj, batchNo, dataIdList) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_shareProduct&action=saveShareProduct&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&batch=" + batchNo + "&receiveId=&productIds=" + dataIdList + "&selectProductFolderId=&saveProductFolderId=" + that.data.sendTFolderId + "&folderType=2&shareType=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("产品发送信息保存成功！")
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "产品发送信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "产品发送接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "产品发送信息接口调用失败：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：产品保存
  //proData：产品信息
  saveCurProductInfo: function (mainObj, proData) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var mdata = null;
    var stock = 0,
      markPrice = 0.00,
      sellPrice = 0.00,
      factoryPrice = 0.00,
      agentPrice = 0.00,
      wholesalePice = 0.00,
      contactIds = "";
    if (proData.vCardList != undefined && proData.vCardList != null && proData.vCardList.length > 0) {
      var itemCard = null;
      for (var n = 0; n < proData.vCardList.length; n++) {
        itemCard = proData.vCardList[n];
        contactIds += Utils.myTrim(contactIds) == "" ? itemCard.id + "," + itemCard.name + "," + itemCard.job + "," + itemCard.company + "," + app.getPartSysImgUrl(itemCard.bgSrc) + "," + app.getPartSysImgUrl(itemCard.qrSrc) : ";" + itemCard.id + "," + itemCard.name + "," + itemCard.job + "," + itemCard.company + "," + app.getPartSysImgUrl(itemCard.bgSrc) + "," + app.getPartSysImgUrl(itemCard.qrSrc);
      }
    }
    if (proData.stock != null && proData.stock != undefined && Utils.myTrim(proData.stock + "") != "") {
      stock = parseFloat(proData.stock);
      stock = isNaN(stock) ? 0 : stock;
    }
    if (proData.markPrice != null && proData.markPrice != undefined && Utils.myTrim(proData.markPrice + "") != "") {
      markPrice = parseFloat(proData.markPrice);
      markPrice = isNaN(markPrice) ? 0.00 : markPrice;
    }
    if (proData.sellPrice != null && proData.sellPrice != undefined && Utils.myTrim(proData.sellPrice + "") != "") {
      sellPrice = parseFloat(proData.sellPrice);
      sellPrice = isNaN(sellPrice) ? 0.00 : sellPrice;
    }
    if (proData.factoryPrice != null && proData.factoryPrice != undefined && Utils.myTrim(proData.factoryPrice + "") != "") {
      factoryPrice = parseFloat(proData.factoryPrice);
      factoryPrice = isNaN(factoryPrice) ? 0.00 : factoryPrice;
    }
    if (proData.agentPrice != null && proData.agentPrice != undefined && Utils.myTrim(proData.agentPrice + "") != "") {
      agentPrice = parseFloat(proData.agentPrice);
      agentPrice = isNaN(agentPrice) ? 0.00 : agentPrice;
    }
    if (proData.wholesalePice != null && proData.wholesalePice != undefined && Utils.myTrim(proData.wholesalePice + "") != "") {
      wholesalePice = parseFloat(proData.wholesalePice);
      wholesalePice = isNaN(wholesalePice) ? 0.00 : wholesalePice;
    }
    mdata = {
      id: proData.id,
      sourceProductId: proData.sourceProductId,
      companyId: proData.companyId,
      userId: proData.userId,
      productClassId: proData.productClassId,
      productNo: proData.productNo,
      agent: proData.agent,
      picture: proData.picture,
      productFile: proData.productFile,
      remark: proData.remark,
      spec: proData.spec,
      packing: proData.packing,
      stock: stock,
      name: Utils.filterTitle(proData.name),
      markPrice: markPrice,
      sellPrice: sellPrice,
      factoryPrice: factoryPrice,
      agentPrice: agentPrice,
      wholesalePice: wholesalePice,
      showMarkPrice: proData.showMarkPrice ? 1 : 0,
      showSellPrice: proData.showSellPrice ? 1 : 0,
      showFactoryPrice: proData.showFactoryPrice ? 1 : 0,
      showAgentPrice: proData.showAgentPrice ? 1 : 0,
      showWholesalePrice: proData.showWholesalePrice ? 1 : 0,
      productFolderId: proData.productFolderId,
      contactIds: contactIds,
      pageData: proData.pageData,
    }
    var delParam = "",
      alertContent = "产品保存",
      idParam = mdata.id + "",
      fidParam = "";

    var urlParam = "cls=main_product&action=saveProduct&companyId=" + proData.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&ids=" + idParam + fidParam + delParam + "&userId=" + proData.userId + "&checkname=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(JSON.stringify(mdata))
    wx.request({
      url: URL + urlParam,
      data: {
        productstr: mdata
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          if (res.data.data != null) {
            console.log(alertContent + "成功！")
          } else {
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          var strUrl = mdata == null ? URL + urlParam : URL + urlParam + "  json:" + JSON.stringify(mdata);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, alertContent + "失败！出错信息：" + JSON.stringify(res), strUrl, false);
        }
      },
      fail: function (err) {
        var strUrl = mdata == null ? URL + urlParam : URL + urlParam + "  json:" + JSON.stringify(mdata);
        wx.showToast({
          title: alertContent + "接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, alertContent + "接口调用失败：出错：" + err, strUrl, false);
      }
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------商城相关公共方法-------------------------------------------------
  //方法：获取设备公司默认跳转页面路径
  //说明：调用页面需要实现结果处理方法dowithGetDeviceCompanyPageUrl(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //companyId：公司ID
  getDeviceCompanyPageUrl: function (mainObj, companyId) {
    let that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=main_companyredirect&action=companyredirectList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&companyId=" + companyId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取设备公司默认跳转页面路径");
        console.log(res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetDeviceCompanyPageUrl(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDeviceCompanyPageUrl(null, 0, "");
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取设备公司默认跳转页面路径：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDeviceCompanyPageUrl(null, 0, "");
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取设备公司默认跳转页面路径接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取商户平台是否授权信息
  getSMallPlatformRightData: function (mainObj) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_shopapply&action=QuerySysInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            detailData = null,
            isForbidOnUsed = false;
          if (data != null && data != undefined && data.length > 0) {
            var paramValue = "";
            for (var i = 0; i < data.length; i++) {
              detailData = null;
              detailData = data[i];
              if (detailData.param != null && detailData.param != undefined && Utils.myTrim(detailData.param + "") != "") {
                paramValue = Utils.myTrim(detailData.param)
                switch (paramValue) {
                  case "在用设备禁用标志":
                    let tagValue = 0;
                    if (detailData.remarks != null && detailData.remarks != undefined && Utils.myTrim(detailData.remarks + "") != "") {
                      try {
                        tagValue = parseInt(detailData.remarks);
                        tagValue = isNaN(tagValue) ? 0 : tagValue;

                        app.data.isForbidOnUsed = tagValue == 1 ? true : false;
                      } catch (err) {}
                    }
                    break;
                }
              }
            }
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取系统信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取系统信息接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取系统信息接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取支付来源信息
  getPaySourceData: function (mainObj, companyId, appid) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=shoppingSource_shoppingSource&action=findShoppingMallSource&sm_companyId=" + companyId + "&wx_appId=" + appid + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            sourceId = -1,
            hotelKey = "";
          if (data.soruceId != null && data.soruceId != undefined && Utils.myTrim(data.soruceId + "") != "") {
            try {
              sourceId = parseInt(data.soruceId);
              sourceId = isNaN(sourceId) ? -1 : sourceId;
            } catch (err) {}
          }
          if (data.bussinessKey != null && data.bussinessKey != undefined && Utils.myTrim(data.bussinessKey + "") != "") {
            try {
              hotelKey = data.bussinessKey;
            } catch (err) {}
          }

          app.data.hotelId = sourceId;
          app.data.hotelKey = hotelKey;
          console.log("SourceId:" + app.data.hotelId + ",HotelKey:" + app.data.hotelKey)
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取支付来源：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取支付来源接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取支付来源接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },

  //方法：获取购物车信息
  getShoppingCartData: function (mainObj, otherParam) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (Utils.isNull(otherParam)) {
      otherParam = ""
    }
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_shopCar&action=userShopCarNum&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign + otherParam;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            shoppingCartCnt = 0;
          if (data.count != null && data.count != undefined && Utils.myTrim(data.count + "") != "") {
            try {
              shoppingCartCnt = parseInt(data.count);
              shoppingCartCnt = isNaN(shoppingCartCnt) ? 0 : shoppingCartCnt;
            } catch (err) {}
          }

          that.setData({
            shoppingCartCnt: shoppingCartCnt,
            shoppingCartAmount: data.amount,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取购物车数量：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        // wx.showToast({
        //   title: "获取购物车数量接口调用失败！",
        //   icon: 'none',
        //   duration: 2000
        // })
        app.setErrorMsg2(that, "获取购物车数量接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：新增订单
  addSMOrderInfo: function (mainObj, itemList) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_order&action=SaveOrders&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log(JSON.stringify(itemList));
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "POST",

      data: {
        data: JSON.stringify(itemList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("新增订单成功！")
          var ids = res.data.data.orderId,
            payNo = res.data.data.payNo,
            idsList = [];
          console.log("订单ID：" + ids)
          if (Utils.myTrim(ids) != "") {
            idsList = ids.split(",");
            if (idsList.length <= 1)
              //单订单支付
              try {
                console.log(idsList[0])
                that.gotoOrderDetailPage(idsList[0], 0, payNo);
              } catch (err) {}
            else if (idsList.length > 1)
              //多订单支付
              try {
                console.log(idsList)
                that.gotoOrderDetailPage(res.data.data.payNo, 1);
              } catch (err) {}
            else
              try {
                that.gotoMyOrder();
              } catch (err) {}
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "订单新增：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
          try {
            that.gotoOrderDetailPage("", -1);
          } catch (err) {}
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "订单新增接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "订单新增接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
        try {
          that.gotoOrderDetailPage("", -1);
        } catch (err) {}
      }
    })
  },
  //方法：新增订单
  //说明：调用页面需要实现结果处理方法dowithAddSMOrderInfo2(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  addSMOrderInfo2: function (mainObj, itemList) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_order&action=SaveOrders&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log(JSON.stringify(itemList));
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "POST",

      data: {
        data: JSON.stringify(itemList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("新增订单成功！")
          try {
            that.dowithAddSMOrderInfo2(res.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          app.setErrorMsg2(that, "新增订单：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          try {
            that.dowithAddSMOrderInfo2(null, 0, res.data.rspMsg);
          } catch (e) { console.log(e) }
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "新增订单接口调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        try {
          that.dowithAddSMOrderInfo2(null, 0, res.data.rspMsg);
        } catch (e) { console.log(e) }
      }
    })
  },
  //方法：修改订单
  //说明：需要在所调用的页面实现处理方法dowithUpdateSMOrderInfo(dataList,tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //orderId：订单号
  //otherParam：其他参数信息
  updateSMOrderInfo: function (mainObj, orderId, otherParam) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + orderId;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('更新订单信息URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更新订单信息', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithUpdateSMOrderInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithUpdateSMOrderInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "更新订单信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithUpdateSMOrderInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "更新订单信息失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------分销商相关-------------------------------------------------------
  //方法：获取分销申请相关信息：我的消费总金额、我的已支付申请分销商押金、免押金消费额度、不足消费额度申请押金、撤销退押金时限
  //说明：调用页面需要实现结果处理方法dowithGetApplyDistributorInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  getApplyDistributorInfo: function (mainObj) {
    var that = mainObj,
      app = this;
    var SMURL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    var appUserInfo = app.globalData.userInfo;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_business&action=QueryOrderPay&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log("获取分销申请相关信息URL:", SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      method: "GET",
      success: function (res) {
        console.log('获取分销申请相关信息')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetApplyDistributorInfo(res.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          app.setErrorMsg2(that, "获取我的消费总金额：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
          try {
            that.dowithGetApplyDistributorInfo(null, 0, "");
          } catch (e) {
            console.log(e)
          }
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取我的消费总金额调用失败！fail：" + JSON.stringify(err), SMURL + urlParam, false);
        try {
          that.dowithGetApplyDistributorInfo(null, 0, "");
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------代理商相关-------------------------------------------------------
  //方法：获取商品分类列表
  //说明：调用页面需要实现结果处理方法dowithGetProductTypeList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  getProductTypeList: function (mainObj, otherParamsCon) {
    let that = mainObj,
      app = this,
      noDataAlert = "";
    let URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "",
      orderByParam = "&sField=sort&sOrder=asc";
    noDataAlert = "暂无商品分类信息！";
    urlParam = "cls=product_goodtype&action=QueryTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamsCon + orderByParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          try {
            that.dowithGetProductTypeList(res.data.data, 1, "");
          } catch (e) {}
        } else {
          try {
            that.dowithGetProductTypeList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取商品分类列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetProductTypeList(null, 0, JSON.stringify(err));
        } catch (e) {}
        app.setErrorMsg2(that, "获取商品分类接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取商品分类结果回调方法
  //isFilterCheirapsis：是否过滤按摩器分类
  dowithGetProductTypeList: function (mainObj, dataList, tag,isFilterCheirapsis, errInfo) {
    let that = mainObj,app=this;
    switch (tag) {
      case 1:
        if (dataList != null && dataList != undefined) {
          console.log('获取商品分类信息返回结果：')
          console.log(dataList)
          let data = dataList,
            dataItem = null,
            listItem = null,
            selProcuctTypeList = [];
          let id = 0,
            name = "",
            selProductTypeIDParam = that.data.selProductTypeIDParam,
            selProductTypeNameParam = that.data.selProductTypeNameParam;
          listItem = {
            id: 0,
            name: "全部",
          }
          selProcuctTypeList.push(listItem);
          for (let i = 0; i < data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = data[i];
            id = 0;
            name = "";
            if (dataItem.productTypeName != null && dataItem.productTypeName != undefined && Utils.myTrim(dataItem.productTypeName + "") != "")
              name = dataItem.productTypeName;
            if (selProductTypeIDParam > 0 && selProductTypeIDParam == dataItem.id) selProductTypeNameParam = name;
            listItem = {
              id: dataItem.id,
              name: name,
              sort:dataItem.sort,
            }
            if(Utils.myTrim(name)!="" && name.indexOf("核销")>=0 && isFilterCheirapsis)continue;
            if(Utils.myTrim(name)!="" && name.indexOf("按摩")>=0){
              app.data.cheirapsisTypeId=dataItem.id;
            }
            if(Utils.myTrim(name)!="" && name.indexOf("茶言茶语")>=0){
              app.data.printImgTypeId=dataItem.id;
            }
            selProcuctTypeList.push(listItem);
          }
          if (Utils.isNull(selProductTypeIDParam)) {
            selProductTypeIDParam = 0
          }
          if (Utils.isNull(selProductTypeNameParam)) {
            selProductTypeNameParam = "默认"
          }
          if (selProcuctTypeList.length > 0) {
            // 直接将新一页的数据添加到数组里
            that.setData({
              selProcuctTypeList: selProcuctTypeList,
              selProductTypeIDParam: selProductTypeIDParam,
              selProductTypeNameParam: selProductTypeNameParam,
            })
          } else {
            wx.showToast({
              title: noDataAlert,
              icon: 'none',
              duration: 2000
            })
          }
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取商品类型操作失败！";
        break;
    }
  },
  //方法：获取商品列表
  //说明：调用页面需要实现结果处理方法dowithGetSoftSrvProduct(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getSoftSrvProduct: function (mainObj, otherParam, pageSize, pageIndex) {
    var that = mainObj,
      app = this;
    var SMURL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    wx.showLoading({
      title: '正在加载中...',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取定制软件商品详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取定制软件商品详情:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetSoftSrvProduct(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetSoftSrvProduct(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取商品详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetSoftSrvProduct(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取定制商品接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：商品列表结果处理方法
  dowithProductList: function (mainObj, dataList, pageIndex, noDataAlert) {
    let that = mainObj,
      app = this;
    if (dataList != null && dataList != undefined && dataList.length > 0) {
      let data = dataList,
        dataItem = null,
        detailItem = null,
        listItem = null,
        articles = [],
        videoList = [];
      let pid = 0,
        productDetailId = "",
        shopType = "",
        shopName = "",
        productId = "",
        productName = "",
        status = 0,
        statusId = 0,
        photosString = "",
        photosTemp = [],
        photos = "",
        remark = "",
        sourcePrice = 0.00,
        sellPrice = 0.00,
        minstatusprice = 0.00,
        photosList = [],
        discountPrice = 0.00,
        couponpriceDecrement = 0.00,
        couponPrice = 0.00,
        channelPrice = 0.00,
        isShowPrice1 = true,
        isShowPrice2 = true,
        discountType = 0,
        couponMold = 0,
        couponfull = 0.00,
        isHideGroup = true,
        groupmold = 0,
        detailPhoto = [],
        coupondist = 0.00,
        couponsList = [],
        conponDataItem = null,
        conponDataList = null,
        giftId = "",
        giftName = "",
        isHaveGift = false,
        presellstatus = 0;
      for (let i = 0; i < data.length; i++) {
        dataItem = null;
        listItem = null;
        dataItem = data[i];
        productDetailId = "";
        shopType = "";
        shopName = "";
        productId = "";
        productName = "";
        status = 0;
        statusId = 0;
        photos = "";
        remark = "";
        sourcePrice = 0.00;
        sellPrice = 0.00;
        minstatusprice = 0.00;
        discountPrice = 0.00;
        couponpriceDecrement = 0.00;
        couponPrice = 0.00;
        isShowPrice1 = false;
        isShowPrice2 = false;
        discountType = 0;
        channelPrice = 0.00;
        isHideGroup = true;
        groupmold = 0;
        coupondist = 0.00;
        couponsList = [];
        giftId = "";
        giftName = "";
        isHaveGift = false;
        presellstatus = 0;
        //预售标识
        if (dataItem.presellstatus != null && dataItem.presellstatus != undefined && Utils.myTrim(dataItem.presellstatus + "") != "") {
          try {
            presellstatus = parseInt(dataItem.presellstatus);
            presellstatus = isNaN(presellstatus) ? 0 : presellstatus;
          } catch (err) {}
        }
        //赠品信息
        if (dataItem.gdetailId != null && dataItem.gdetailId != undefined && Utils.myTrim(dataItem.gdetailId + "") != "null" && Utils.myTrim(dataItem.gdetailId + "") != "")
          giftId = dataItem.gdetailId;
        isHaveGift = Utils.myTrim(giftId) != "" ? true : false;
        if (dataItem.gproductName != null && dataItem.gproductName != undefined && Utils.myTrim(dataItem.gproductName + "") != "null" && Utils.myTrim(dataItem.gproductName + "") != "")
          giftName = dataItem.gproductName;
        //最大两张优惠券
        if (dataItem.coupons != null && dataItem.coupons != undefined && dataItem.coupons.length > 0) {
          for (let j = 0; j < dataItem.coupons.length; j++) {
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
        //团购标识
        if (dataItem.groupmold != null && dataItem.groupmold != undefined && Utils.myTrim(dataItem.groupmold + "") != "") {
          try {
            groupmold = parseInt(dataItem.groupmold);
            groupmold = isNaN(groupmold) ? 0 : groupmold;
          } catch (err) {}
        }
        isHideGroup = groupmold == 8 ? false : true;
        if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
          productName = dataItem.productName;
        //
        if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
          shopName = dataItem.companyName;
        if (dataItem.LevelName != null && dataItem.LevelName != undefined && Utils.myTrim(dataItem.LevelName + "") != "")
          shopType = dataItem.LevelName;
        if (dataItem.id != null && dataItem.id != undefined && Utils.myTrim(dataItem.id + "") != "")
          productId = dataItem.id;

        //商品图片
        if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
          photosString = "";
          photosString = dataItem.photos;
          detailPhoto = [];
          detailPhoto = photosString.split(",");
          if (detailPhoto.length > 0) {
            for (let n = 0; n < detailPhoto.length; n++) {
              photosString = detailPhoto[n].toLowerCase();
              if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                photos = app.getSysImgUrl(detailPhoto[n]);
                break;
              }
            }
          }
        }
        if (Utils.myTrim(photos) == "" && dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
          if (dataItem.detail[0].photos != null && dataItem.detail[0].photos != undefined && Utils.myTrim(dataItem.detail[0].photos + "") != "" && Utils.myTrim(dataItem.detail[0].photos + "") != "null") {
            photosString = "";
            photosString = dataItem.detail[0].photos;
            detailPhoto = [];
            detailPhoto = photosString.split(",");
            if (detailPhoto.length > 0) photos = app.getSysImgUrl(detailPhoto[0]);
          }
        }

        if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
          remark = dataItem.remark;


        //重新设置的价格
        if (dataItem.minprice != null && dataItem.minprice != undefined && Utils.myTrim(dataItem.minprice + "") != "") {
          try {
            sourcePrice = parseFloat(dataItem.minprice);
            sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
          } catch (err) {}
        }
        sellPrice = sourcePrice; //minstatusprice
        if (dataItem.minstatusprice != null && dataItem.minstatusprice != undefined && Utils.myTrim(dataItem.minstatusprice + "") != "") {
          try {
            minstatusprice = parseFloat(dataItem.minstatusprice);
            minstatusprice = isNaN(minstatusprice) ? 0.00 : minstatusprice;
          } catch (err) {}
        }
        //渠道价 
        if (dataItem.channelPrice != null && dataItem.channelPrice != undefined && Utils.myTrim(dataItem.channelPrice + "") != "") {
          try {
            channelPrice = parseFloat(dataItem.channelPrice);
            channelPrice = isNaN(channelPrice) ? 0.00 : channelPrice;

            if (channelPrice > 0.00) {
              sourcePrice = channelPrice;
              sellPrice = sourcePrice;
            }
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
        if (coupondist > 0.00 && coupondist < sellPrice) {
          couponPrice = sellPrice - coupondist;
          if (couponPrice > 0.00) {
            isShowPrice1 = true;
            couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
          }
        }

        //特惠价或套装价
        if (dataItem.way != null && dataItem.way != undefined && Utils.myTrim(dataItem.way + "") != "") {
          try {
            discountType = parseInt(dataItem.way);
            discountType = isNaN(discountType) ? 0 : discountType;

            if (dataItem.discount != null && dataItem.discount != undefined && Utils.myTrim(dataItem.discount + "") != "") {
              try {
                discountPrice = parseFloat(dataItem.discount);
                discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                discountPrice = sellPrice - discountPrice;
                discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                isShowPrice2 = discountPrice <= 0.00 ? false : true;
              } catch (err) {}
            }
          } catch (err) {}
        }
        shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
        listItem = {
          companyId: dataItem.companyId,
          pid: dataItem.pid,
          shopType: shopType,
          shopName: shopName,
          productId: productId,
          productName: Utils.myTrim(productName) != "" ? productName : remark,
          photos: app.getSysImgUrl(photos),
          remark: remark,
          sourcePrice: parseFloat(sourcePrice.toFixed(app.data.limitQPDecCnt)),
          sellPrice: parseFloat(sellPrice.toFixed(app.data.limitQPDecCnt)),
          minstatusprice: minstatusprice,
          couponPrice: parseFloat(couponPrice.toFixed(app.data.limitQPDecCnt)),
          discountPrice: parseFloat(discountPrice.toFixed(app.data.limitQPDecCnt)),
          channelPrice: parseFloat(channelPrice.toFixed(app.data.limitQPDecCnt)),
          isShowPrice1: isShowPrice1,
          isShowPrice2: isShowPrice2,
          discountType: discountType,
          mallChannelId: that.data.mallChannelId,
          isHideGroup: isHideGroup,
          groupmold: groupmold,
          couponsList: couponsList,
          isHaveGift: isHaveGift,
          giftId: giftId,
          giftName: Utils.myTrim(giftId) != "" ? giftName : "",
          presellstatus: presellstatus,
          isShow: false,
        }
        articles.push(listItem);
      }
      if (articles.length > 0) {
        // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
        let totalDataCount = that.data.totalDataCount;
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
        title: "暂无商品",
        icon: 'none',
        duration: 1500
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////
  //--------公司相关-------------------------------------------------------
  //方法：新增公司信息
  //说明：调用页面需要实现结果处理方法dowithAddCompanyMainDataInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数(修改：opertion=mod 新增：opertion=add)
  addCompanyMainDataInfo: function (mainObj, otherParam) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_companyMsg&action=savecompanyMsg&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithAddCompanyMainDataInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithAddCompanyMainDataInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "公司保存：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        try {
          that.dowithAddCompanyMainDataInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "公司保存接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  //方法：获取公司信息
  //说明：调用页面需要实现结果处理方法dowithGetCompanyMainDataInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getCompanyMainDataInfo: function (mainObj, otherParam) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_companyMsg&action=companyMsgList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetCompanyMainDataInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetCompanyMainDataInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取酒店详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        try {
          that.dowithGetCompanyMainDataInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取酒店详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },


  //方法：获取特定信息描述
  //说明：调用页面需要实现结果处理方法dowithGetMainDescribe(result,tag,errorInfo)
  //     result：返回的结果集
  //     tag：1成功，0失败
  //     errorInfo：错误提示信息
  //参数：
  //mainObj：调用页面主体
  //mtype：下单用户ID
  getMainDescribe: function (mainObj, mtype) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.companyId,
      isSofeParam = "&mold=5",
      sortParam = "&sOrder=desc";
    urlParam = "cls=main_describe&action=describeList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&type=" + mtype + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('获取特定信息描述:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log('获取特定信息描述:', res)
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined && res.data.data.resultMap != null && res.data.data.resultMap != undefined) {
            try {
              that.dowithGetMainDescribe(res.data.data.resultMap, 1, "");
            } catch (e) {}
          } else {
            wx.showToast({
              title: '获取信息描述失败！',
              icon: 'none',
              duration: 1500
            })
            try {
              that.dowithGetMainDescribe(null, 0, '获取信息描述失败！');
            } catch (e) {}
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取信息描述：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          try {
            that.dowithGetMainDescribe(null, 0, res.data.rspMsg);
          } catch (e) {}
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '获取信息描述失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "获取信息描述接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
        try {
          that.dowithGetMainDescribe(null, 0, '获取信息描述失败！');
        } catch (e) {}
      }
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------优惠券查询与领取-------------------------------------------------
  //可领取优惠券查询
  queryCanCoupons: function (mainObj) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    if (app.globalData.muserInfo == null) return;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryCanCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp,
      channelParam = that.data.mallChannelId > 0 ? "&channelId=" + that.data.mallChannelId : "";
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    //可领取优惠券查询 付款成功
    if (!Utils.isNull(that.data.mold)) {
      // mold=11 订单支付成功
      urlParam = urlParam + "&companyId=" + app.data.companyId + "&userId=" + app.globalData.muserInfo.userId + "&mold=" + that.data.mold + "&sign=" + sign;
    } else {
      //渠道channelId  1是商城
      urlParam = urlParam + "&companyId=" + app.data.companyId + "&userId=" + app.globalData.muserInfo.userId + channelParam + "&sign=" + sign;
    }

    console.log("可领取优惠券查询URL:")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("可领取优惠券查询", res.data)
        var pageName = that.data.pageName != null && that.data.pageName != undefined ? Utils.myTrim(that.data.pageName) : "";
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var couponData = res.data.data;
            that.setData({
              couponData: couponData
            })
            if (pageName == "Collarcenter") {
              that.dowithCoupunData(couponData);
            } else {
              app.saveCoupons(mainObj);
            }
          } else if (pageName == "Collarcenter") {
            that.dowithCoupunData([]);
          }
        } else {
          app.setErrorMsg2(that, "可领取优惠券查询！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '可领取优惠券查询失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "可领取优惠券查询接口调用失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //领取优惠券
  saveCoupons: function (mainObj) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=SaveCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('领取优惠券：', URL + urlParam)
    var couponDataTem = [];
    var couponData = that.data.couponData;
    for (let i = 0; i < couponData.length; i++) {
      let dataTem = {};
      dataTem.activityId = couponData[i].activityId;
      dataTem.userId = app.globalData.muserInfo.userId;
      dataTem.couponid = couponData[i].id;
      dataTem.sn = couponData[i].sn;
      couponDataTem = couponDataTem.concat(dataTem);
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
          that.setData({
            isShowReceiveCouponPop: true
          })
        } else {
          // app.setErrorMsg2(that, "领取优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          // wx.showToast({
          //   title: res.data.rspMsg,
          //   icon: 'none',
          //   duration: 1500
          // })
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
  //方法：领取优惠券
  //说明：需要在所调用的页面实现处理方法dowithReceivePersonCoupons(dataList, tag,errorInfo)
  //     dataList：返回的领取优惠券信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  receivePersonCoupons: function (mainObj, couponData) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=SaveCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('领取优惠券：', URL + urlParam)
    //couponData包括：activityId，userId，couponid，sn
    console.log(JSON.stringify(couponData));
    wx.request({
      url: URL + urlParam,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        data: JSON.stringify(couponData)
      },
      success: function (res) {
        console.log("领取优惠券", res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithReceivePersonCoupons(res.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithReceivePersonCoupons(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "领取优惠券：出错：" + res.data.rspMsg, URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithReceivePersonCoupons(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "领取优惠券接口调用失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------支付相关公共方法-------------------------------------------------
  //方法：获取预支付ID
  //说明：需要在所调用的页面实现处理方法dowithPayment(tag,errorInfo)
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：当前页面
  //attach：支付attach信息
  //payFee：支付金额
  getPrePayId: function (mainObj, attach, payFee) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.showLoading({
      title: '正在加载中...',
    })
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=payforservice&detail=payforservice&money=" + (payFee * 100).toFixed(0) + "&userId=" + app.globalData.muserInfo.userId + "&attach=" + encodeURIComponent(attach) + "&openid=" + app.globalData.muserInfo.wxopenId + "&sign=" + sign
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          console.log("预支付获取成功", res.data)
          //调起微信支付
          app.requestPayment(mainObj, res.data.data);
        } else {
          that.data.isDowithing = false;
          wx.hideLoading()
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "支付失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.data.isDowithing = false;
        wx.hideLoading()
        app.setErrorMsg2(that, "支付失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: "预支付ID获取失败！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：获取预支付ID
  //说明：需要在所调用的页面实现处理方法dowithPayment(tag,errorInfo)
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：当前页面
  //attach：支付attach信息
  //payFee：支付金额
  //productDetail：商品描述
  getPrePayId0: function (mainObj, attach, payFee, productDetail) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.showLoading({
      title: '正在加载中...',
    })
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=" + encodeURIComponent(productDetail) + "&detail=" + encodeURIComponent(productDetail) + "&money=" + (payFee * 100).toFixed(0) + "&userId=" + app.globalData.userInfo.userId + "&attach=" + encodeURIComponent(attach) + "&openid=" + app.globalData.userInfo.wxopenId + "&sign=" + sign
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          console.log("预支付获取成功", res.data)
          //调起微信支付
          app.requestPayment(mainObj, res.data.data);
        } else {
          that.data.isDowithing = false;
          wx.hideLoading()
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "支付失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.data.isDowithing = false;
        wx.hideLoading()
        app.setErrorMsg2(that, "支付失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: "预支付ID获取失败！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：获取预支付ID
  //说明：需要在所调用的页面实现处理方法dowithGetPrePayId10(tag,errorInfo)
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：当前页面
  //attach：支付attach信息
  //payFee：支付金额
  //productDetail：商品描述
  getPrePayId10: function (mainObj, attach, payFee, productDetail) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.showLoading({
      title: '正在加载中...',
    })
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=" + encodeURIComponent(productDetail) + "&detail=" + encodeURIComponent(productDetail) + "&money=" + (payFee * 100).toFixed(0) + "&userId=" + app.globalData.userInfo.userId + "&attach=" + encodeURIComponent(attach) + "&openid=" + app.globalData.userInfo.wxopenId + "&sign=" + sign
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取预支付ID信息')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPrePayId10(res.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          app.setErrorMsg2(that, "获取预支付ID：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          try {
            that.dowithGetPrePayId10(null, 0, "");
          } catch (e) { console.log(e) }
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取预支付ID调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        try {
          that.dowithGetPrePayId10(null, 0, "");
        } catch (e) { console.log(e) }
      }
    })
  },
  //方法：获取预支付ID
  //说明：需要在所调用的页面实现处理方法dowithPayment(tag,errorInfo)
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：当前页面
  //attach：支付attach信息
  //otherParams：其他参数（包括body、detail）
  //payFee：支付金额
  getPrePayId2: function (mainObj, attach, otherParams, payFee) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.showLoading({
      title: '正在加载中...',
    })
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=payforservice&detail=payforservice&money=" + (payFee * 100).toFixed(0) + "&userId=" + app.globalData.userInfo.userId + "&attach=" + encodeURIComponent(attach) + "&openid=" + app.globalData.userInfo.wxopenId + "&sign=" + sign
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          console.log("预支付获取成功", res.data)
          //调起微信支付
          app.requestPayment(mainObj, res.data.data);
        } else {
          try {
            that.dowithPayment(0, "");
          } catch (err) {}
          wx.hideLoading()
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithPayment(0, "预支付ID获取失败！");
        } catch (err) {}
        wx.hideLoading()
        app.setErrorMsg2(that, "支付失败：fail！错误信息：" + err, URL + urlParam, false);
      }
    })
  },
  //方法：发起微信支付
  requestPayment: function (mainObj, reqPaymentData) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var singParm = "appId=" + reqPaymentData.appid + "&nonceStr=" + reqPaymentData.nonce_str + "&package=prepay_id=" + reqPaymentData.prepay_id + "&signType=MD5&timeStamp=" + timestamp + "&key=" + app.data.hotelKey;
    var sign = MD5JS.hexMD5(singParm);
    wx.hideLoading()
    wx.requestPayment({
      'timeStamp': "" + timestamp,
      'nonceStr': reqPaymentData.nonce_str,
      'package': 'prepay_id=' + reqPaymentData.prepay_id,
      'signType': 'MD5',
      'paySign': sign,
      success: function (res) {
        console.log("支付返回结果：")
        console.log(res)
        try {
          that.dowithPayment(1, "");
        } catch (err) {}
        wx.hideLoading();
        console.log("支付发起成功！")
      },
      fail: function (err) {
        try {
          that.dowithPayment(0, "支付失败！");
        } catch (err) {}
        wx.hideLoading()
        console.log("支付发起失败", err);
      }
    })
  },
  /////////////////////////////////////////////////////////////////////
  //-------获取公司相关信息---------------------------------------------
  //说明：需要在所调用的页面实现处理方法dowithGetCompanyDataInfo(dataList,tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //id：所取公司ID，如果不提供则获取对应小程序APPID的公司
  getCompanyDataInfo: function (mainObj, id) {
    let that = mainObj,
      app = this,
      companyData = null,
      otherParam = "";
    let URL = app.getUrlAndKey.murl,
      KEY = app.getUrlAndKey.key,
      DataURL = app.getUrlAndKey.dataUrl;

    otherParam = id != null && id != undefined && id > 0 ? "&id=" + id : otherParam;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=home_home&action=homePage&AppId=" + encodeURIComponent(app.data.wxAppId) + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&length=70&limitCount=1&imageCount=3&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')

    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          console.log("获取主页信息成功！");
          try {
            that.dowithGetCompanyDataInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetCompanyDataInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取主页信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetCompanyDataInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取主页信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  dowithSingleCompanyDataInfo: function (mainObj, dataList) {
    let that = mainObj,
      app = this,
      DataURL = app.getUrlAndKey.dataUrl,
      mainObject = null;
    let data = dataList,
      dataItem = null,
      itemObj = null,
      companyData = null;
    let src = "",
      newsheadimg = "",
      newstitle = "",
      newsdate = "",
      newssummay = "";
    let companyId = 0,
      cSummary = "",
      cPhone = "",
      cEmail = "",
      cWebSite = "",
      cAddr = "",
      cName = "",
      cLogoUrl = "",
      longitude = -1,
      latitude = -1,
      city = "",
      area = "";
    let topBanners = [],
      newsList = [],
      productTypeList = [],
      productList = [],
      cPhotos = [],
      productTypeCnt = 0,
      productCnt = 0,
      photosTemp = [],
      photosString = "";

    //1、顶部Banner
    if (data.bannerList != null && data.bannerList != undefined) {
      for (let i = 0; i < data.bannerList.length; i++) {
        dataItem = null;
        itemObj = null;
        dataItem = data.bannerList[i];
        src = "";
        if (dataItem.img != null && dataItem.img != undefined && Utils.myTrim(dataItem.img + "") != "")
          src = dataItem.img;
        itemObj = {
          src: app.getASSysImgUrl(src),
          url: "",
        }
        topBanners.push(itemObj);
      }
    }

    //2、公司动态
    if (data.dynamicLsit != null && data.dynamicLsit != undefined) {
      for (let i = 0; i < data.dynamicLsit.length; i++) {
        dataItem = null;
        itemObj = null;
        dataItem = data.dynamicLsit[i];
        newsheadimg = DataURL + "/images/dbanner.png";
        newstitle = "";
        newsdate = "";
        newssummay = "";
        if (dataItem.img != null && dataItem.img != undefined && Utils.myTrim(dataItem.img + "") != "")
          newsheadimg = dataItem.img;
        if (dataItem.title != null && dataItem.title != undefined && Utils.myTrim(dataItem.title + "") != "")
          newstitle = dataItem.title;
        if (dataItem.content != null && dataItem.content != undefined && Utils.myTrim(dataItem.content + "") != "")
          newssummay = dataItem.content;
        try {
          var dateTime = new Date(dataItem.time.replace(/\-/g, "/"));
          newsdate = Utils.getDateTimeStr(dateTime, "-", false);
        } catch (e) {}
        itemObj = {
          id: dataItem.id,
          imgSrc: Utils.myTrim(newsheadimg) != "" ? app.getASSysImgUrl(newsheadimg) : "",
          title: newstitle,
          pubishDate: newsdate,
          summary: newssummay,
        }
        newsList.push(itemObj);
      }
    }
    //3、公司相关信息
    if (data.companyInfo != null && data.companyInfo != undefined) {
      let businessList = [],
        markers = [],
        cmphotoList = [],
        markerItem = null;
      dataItem = data.companyInfo;
      cSummary = "";
      cPhone = "";
      cEmail = "";
      cWebSite = "";
      cAddr = "";
      city = "";
      area = "";
      companyId = dataItem.id;
      if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "null" && Utils.myTrim(dataItem.photos + "") != "") {
        photosString = "";
        photosString = dataItem.photos;
        photosTemp = [];
        photosTemp = photosString.split(",");
        if (photosTemp.length > 0) {
          for (var n = 0; n < photosTemp.length; n++) {
            if (n == 0)
              cmphotoList.push({
                src: app.getSysImgUrl(photosTemp[n]),
                isShow: true
              });
            else
              cmphotoList.push({
                src: app.getSysImgUrl(photosTemp[n]),
                isShow: false
              });
          }
        }
      }
      if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
        cName = dataItem.companyName;
      if (dataItem.city != null && dataItem.city != undefined && Utils.myTrim(dataItem.city + "") != "")
        city = dataItem.city;
      if (dataItem.area != null && dataItem.area != undefined && Utils.myTrim(dataItem.area + "") != "")
        area = dataItem.area;
      if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
        cLogoUrl = app.getASSysImgUrl(dataItem.companyLogo);
      if (dataItem.companyProfile != null && dataItem.companyProfile != undefined && Utils.myTrim(dataItem.companyProfile + "") != "")
        cSummary = dataItem.companyProfile;
      if (dataItem.companyPhone != null && dataItem.companyPhone != undefined && Utils.myTrim(dataItem.companyPhone + "") != "")
        cPhone = dataItem.companyPhone;
      if (dataItem.companyEmail != null && dataItem.companyEmail != undefined && Utils.myTrim(dataItem.companyEmail + "") != "")
        cEmail = dataItem.companyEmail;
      if (dataItem.companyURL != null && dataItem.companyURL != undefined && Utils.myTrim(dataItem.companyURL + "") != "")
        cWebSite = dataItem.companyURL;
      if (dataItem.companySite != null && dataItem.companySite != undefined && Utils.myTrim(dataItem.companySite + "") != "")
        cAddr = dataItem.companySite;
      if (dataItem.businessList != null && dataItem.businessList != undefined && dataItem.businessList.length > 0) {
        let businessName = "",
          busImgUrl = "",
          busDataItem = null,
          busListItem = null;
        for (let n = 0; n < dataItem.businessList.length; n++) {
          businessName = "";
          busImgUrl = "";
          busDataItem = null;
          busListItem = null;
          busDataItem = dataItem.businessList[n];

          if (busDataItem.businessName != null && busDataItem.businessName != undefined && Utils.myTrim(busDataItem.businessName + "") != "")
            businessName = busDataItem.businessName;
          if (busDataItem.image != null && busDataItem.image != undefined && Utils.myTrim(busDataItem.image + "") != "")
            busImgUrl = busDataItem.image;
          busListItem = {
            id: busDataItem.id,
            businessName: businessName,
            busImgUrl: Utils.myTrim(busImgUrl) != "" ? app.getASSysImgUrl(busImgUrl) : defaultBusImg,
          }
          businessList.push(busListItem);
        }
      }

      if (data.location != null && data.location != undefined) {
        try {
          longitude = data.location.longitude != null && data.location.longitude != undefined ? parseFloat(data.location.longitude) : longitude;
          longitude = isNaN(longitude) ? -1 : longitude;
        } catch (err) {}
        try {
          latitude = data.location.latitude != null && data.location.latitude != undefined ? parseFloat(data.location.latitude) : latitude;
          latitude = isNaN(latitude) ? -1 : latitude;
        } catch (err) {}
        markerItem = {
          iconPath: DataURL + "/images/markicon.png",
          id: 0,
          latitude: latitude,
          longitude: longitude,
          width: 20,
          height: 28,
          callout: {
            content: cName
          }
        }
        markers.push(markerItem);
      }
      //酒店相关信息
      let openTime = "",
        numRoom = 0,
        numFloor = 0,
        mustRead = "",
        inAndoutTime = "",
        childrenAndExtraBed = "",
        pet = "",
        breakfast = "",
        freeWifi = "",
        parking = "",
        baggage = "",
        morningCall = "",
        deliveryService = "",
        centralAir = "",
        others = "",
        introduction = "",
        photos = [],
        innerPhotos = [],
        exteriorPhotos = [],
        aroundPhotos = [];
      let trafficTitle = null,
        trafficValue = null,
        strListTemp = [],
        airportTitle = [],
        airportValue = [],
        trainTitle = [],
        trainValue = [],
        metroTitle = [],
        metroValue = [];
      if (data.companyHotelInfo != null && data.companyHotelInfo != undefined) {
        dataItem = data.companyHotelInfo;

        if (dataItem.trafficTitle != null && dataItem.trafficTitle != undefined && Utils.myTrim(dataItem.trafficTitle + "") != "null" && Utils.myTrim(dataItem.trafficTitle + "") != "") {
          photosString = "";
          photosString = dataItem.trafficTitle;
          photosTemp = [];
          photosTemp = photosString.split("$");
          if (photosTemp.length > 0) {
            for (let n = 0; n < photosTemp.length; n++) {
              switch (n) {
                case 0:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        airportTitle.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
                case 1:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        trainTitle.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
                case 2:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        metroTitle.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
              }
            }
          }
        }
        trafficTitle = {
          airportTitle: airportTitle,
          trainTitle: trainTitle,
          metroTitle: metroTitle
        }
        if (dataItem.trafficValue != null && dataItem.trafficValue != undefined && Utils.myTrim(dataItem.trafficValue + "") != "null" && Utils.myTrim(dataItem.trafficValue + "") != "") {
          photosString = "";
          photosString = dataItem.trafficValue;
          photosTemp = [];
          photosTemp = photosString.split("$");
          if (photosTemp.length > 0) {
            for (let n = 0; n < photosTemp.length; n++) {
              switch (n) {
                case 0:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        airportValue.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
                case 1:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        trainValue.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
                case 2:
                  strListTemp = [];
                  if (Utils.myTrim(photosTemp[n]) != "") {
                    strListTemp = photosTemp[n].split("@");
                    if (strListTemp.length > 0) {
                      for (let k = 0; k < strListTemp.length; k++) {
                        metroValue.push(Utils.myTrim(strListTemp[k]))
                      }
                    }
                  }
                  break;
              }
            }
          }
        }
        trafficValue = {
          airportValue: airportValue,
          trainValue: trainValue,
          metroValue: metroValue
        }
        if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "null" && Utils.myTrim(dataItem.photos + "") != "") {
          photosString = "";
          photosString = dataItem.photos;
          photosTemp = [];
          photosTemp = photosString.split(",");
          if (photosTemp.length > 0) {
            for (var n = 0; n < photosTemp.length; n++) {
              if (n == 0)
                photos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: true
                });
              else
                photos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: false
                });
            }
          }
        }

        if (dataItem.innerPhotos != null && dataItem.innerPhotos != undefined && Utils.myTrim(dataItem.innerPhotos + "") != "null" && Utils.myTrim(dataItem.innerPhotos + "") != "") {
          photosString = "";
          photosString = dataItem.innerPhotos;
          photosTemp = [];
          photosTemp = photosString.split(",");
          if (photosTemp.length > 0) {
            for (var n = 0; n < photosTemp.length; n++) {
              if (n == 0)
                innerPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: true
                });
              else
                innerPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: false
                });
            }
          }
        }
        if (dataItem.exteriorPhotos != null && dataItem.exteriorPhotos != undefined && Utils.myTrim(dataItem.exteriorPhotos + "") != "null" && Utils.myTrim(dataItem.exteriorPhotos + "") != "") {
          photosString = "";
          photosString = dataItem.exteriorPhotos;
          photosTemp = [];
          photosTemp = photosString.split(",");
          if (photosTemp.length > 0) {
            for (var n = 0; n < photosTemp.length; n++) {
              if (n == 0)
                exteriorPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: true
                });
              else
                exteriorPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: false
                });
            }
          }
        }
        if (dataItem.aroundPhotos != null && dataItem.aroundPhotos != undefined && Utils.myTrim(dataItem.aroundPhotos + "") != "null" && Utils.myTrim(dataItem.aroundPhotos + "") != "") {
          photosString = "";
          photosString = dataItem.aroundPhotos;
          photosTemp = [];
          photosTemp = photosString.split(",");
          if (photosTemp.length > 0) {
            for (var n = 0; n < photosTemp.length; n++) {
              if (n == 0)
                aroundPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: true
                });
              else
                aroundPhotos.push({
                  src: app.getSysImgUrl(photosTemp[n]),
                  isShow: false
                });
            }
          }
        }
        if (dataItem.openTime != null && dataItem.openTime != undefined && Utils.myTrim(dataItem.openTime + "") != "null" && Utils.myTrim(dataItem.openTime + "") != "")
          openTime = dataItem.openTime;
        openTime = openTime.replace("年", "");

        if (dataItem.mustRead != null && dataItem.mustRead != undefined && Utils.myTrim(dataItem.mustRead + "") != "null" && Utils.myTrim(dataItem.mustRead + "") != "")
          mustRead = dataItem.mustRead;
        if (dataItem.numFloor != null && dataItem.numFloor != undefined && Utils.myTrim(dataItem.numFloor + "") != "null" && Utils.myTrim(dataItem.numFloor + "") != "")
          numFloor = dataItem.numFloor;
        if (dataItem.inAndoutTime != null && dataItem.inAndoutTime != undefined && Utils.myTrim(dataItem.inAndoutTime + "") != "null" && Utils.myTrim(dataItem.inAndoutTime + "") != "")
          inAndoutTime = dataItem.inAndoutTime;
        if (dataItem.childrenAndExtraBed != null && dataItem.childrenAndExtraBed != undefined && Utils.myTrim(dataItem.childrenAndExtraBed + "") != "null" && Utils.myTrim(dataItem.childrenAndExtraBed + "") != "")
          childrenAndExtraBed = dataItem.childrenAndExtraBed;
        if (dataItem.pet != null && dataItem.pet != undefined && Utils.myTrim(dataItem.pet + "") != "null" && Utils.myTrim(dataItem.pet + "") != "")
          pet = dataItem.pet;
        if (dataItem.breakfast != null && dataItem.breakfast != undefined && Utils.myTrim(dataItem.breakfast + "") != "null" && Utils.myTrim(dataItem.breakfast + "") != "")
          breakfast = dataItem.breakfast;
        if (dataItem.freeWifi != null && dataItem.freeWifi != undefined && Utils.myTrim(dataItem.freeWifi + "") != "null" && Utils.myTrim(dataItem.freeWifi + "") != "")
          freeWifi = dataItem.freeWifi;
        if (dataItem.parking != null && dataItem.parking != undefined && Utils.myTrim(dataItem.parking + "") != "null" && Utils.myTrim(dataItem.parking + "") != "")
          parking = dataItem.parking;
        if (dataItem.baggage != null && dataItem.baggage != undefined && Utils.myTrim(dataItem.baggage + "") != "null" && Utils.myTrim(dataItem.baggage + "") != "")
          baggage = dataItem.baggage;
        if (dataItem.morningCall != null && dataItem.morningCall != undefined && Utils.myTrim(dataItem.morningCall + "") != "null" && Utils.myTrim(dataItem.morningCall + "") != "")
          morningCall = dataItem.morningCall;
        if (dataItem.deliveryService != null && dataItem.deliveryService != undefined && Utils.myTrim(dataItem.deliveryService + "") != "null" && Utils.myTrim(dataItem.deliveryService + "") != "")
          deliveryService = dataItem.deliveryService;
        if (dataItem.centralAir != null && dataItem.centralAir != undefined && Utils.myTrim(dataItem.centralAir + "") != "null" && Utils.myTrim(dataItem.centralAir + "") != "")
          centralAir = dataItem.centralAir;
        if (dataItem.others != null && dataItem.others != undefined && Utils.myTrim(dataItem.others + "") != "null" && Utils.myTrim(dataItem.others + "") != "")
          others = dataItem.others;
        if (dataItem.introduction != null && dataItem.introduction != undefined && Utils.myTrim(dataItem.introduction + "") != "null" && Utils.myTrim(dataItem.introduction + "") != "")
          introduction = dataItem.introduction;
        //
        if (dataItem.numRoom != null && dataItem.numRoom != undefined && Utils.myTrim(dataItem.numRoom + "") != "") {
          try {
            numRoom = parseInt(dataItem.numRoom);
            numRoom = isNaN(numRoom) ? 0 : numRoom;
          } catch (err) {}
        }
      }
      WxParse.wxParse('introduction', 'html', introduction, that, 5);
      WxParse.wxParse('cSummary', 'html', cSummary, that);

      companyData = {
        companyId: companyId,
        cName: cName,
        cLogoUrl: cLogoUrl,
        cSummary: cSummary,
        cPhone: cPhone,
        cEmail: cEmail,
        cWebSite: cWebSite,
        cAddr: cAddr,
        businessList: businessList,
        city: city,
        area: area,
        mapLocation: {
          longitude: longitude,
          latitude: latitude,
          markers: markers,
        },

        //酒店相关信息
        openTime: openTime,
        numRoom: numRoom,
        numFloor: numFloor,
        mustRead: mustRead,
        inAndoutTime: inAndoutTime,
        childrenAndExtraBed: childrenAndExtraBed,
        pet: pet,
        breakfast: breakfast,
        freeWifi: freeWifi,
        parking: parking,
        baggage: baggage,
        morningCall: morningCall,
        deliveryService: deliveryService,
        centralAir: centralAir,
        others: others,
        introduction: introduction,
        cmphotoList: cmphotoList,
        photos: photos,
        innerPhotos: innerPhotos,
        exteriorPhotos: exteriorPhotos,
        aroundPhotos: aroundPhotos,
        trafficTitle: trafficTitle,
        trafficValue: trafficValue
      }
    }
    //公司相册
    if (data.photoList != null && data.photoList != undefined) {
      for (let i = 0; i < data.photoList.length; i++) {
        dataItem = null;
        itemObj = null;
        dataItem = data.photoList[i];
        src = "";
        if (dataItem != null && dataItem != undefined && Utils.myTrim(dataItem + "") != "") {
          src = dataItem;
          itemObj = {
            src: app.getASSysImgUrl(src),
          }
          cPhotos.push(itemObj);
        }
      }
    }
    if (companyData != null)
      companyData.cPhotos = cPhotos;
    //产品信息productList
    if (data.productList != null && data.productList != undefined) {
      let listItem = null;
      if (data.productList.productTypeMsg != null && data.productList.productTypeMsg != undefined && data.productList.productTypeMsg.length > 0) {
        var productImage = "";
        for (let i = 0; i < data.productList.productTypeMsg.length; i++) {
          listItem = null;
          dataItem = null;
          dataItem = data.productList.productTypeMsg[i];
          if (dataItem.productImage != null && dataItem.productImage != undefined && Utils.myTrim(dataItem.productImage + "") != "")
            productImage = dataItem.productImage;
          listItem = {
            id: dataItem.productTypeId,
            typeName: dataItem.productTypeName,
            productImage: Utils.myTrim(productImage) != "" ? app.getASSysImgUrl(productImage) : defaultProImg
          }
          productTypeList.push(listItem);
        }
      }
      if (data.productList.productMsg != null && data.productList.productMsg != undefined && data.productList.productMsg.length > 0) {
        let agencyPrice = 0.00,
          dealerPrice = 0.00,
          factoryPrice = 0.00,
          marketPrice = 0.00,
          wholesalePrice = 0.00,
          companyId = 0,
          createTime = "",
          productDescribe = "",
          productImage = "",
          productName = "",
          productInventory = "",
          productSerialNumber = "",
          specification = "",
          status = "",
          productTypeId = 0;

        for (let i = 0; i < data.productList.productMsg.length; i++) {
          listItem = null;
          dataItem = null;
          dataItem = data.productList.productMsg[i];
          agencyPrice = 0.00;
          dealerPrice = 0.00;
          factoryPrice = 0.00;
          marketPrice = 0.00;
          wholesalePrice = 0.00;
          companyId = 0;
          createTime = "";
          productDescribe = "";
          productImage = "";
          productName = "";
          productInventory = "";
          productSerialNumber = "";
          specification = "";
          status = "";
          productTypeId = 0;
          if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
            productName = dataItem.productName;
          if (dataItem.productImage != null && dataItem.productImage != undefined && Utils.myTrim(dataItem.productImage + "") != "")
            productImage = dataItem.productImage;
          if (Utils.myTrim(productImage) == "") continue;
          if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "")
            companyId = parseInt(dataItem.companyId);
          companyId = isNaN(companyId) ? 0 : companyId;
          if (dataItem.agencyPrice != null && dataItem.agencyPrice != undefined && Utils.myTrim(dataItem.agencyPrice + "") != "")
            agencyPrice = parseFloat(dataItem.agencyPrice);
          agencyPrice = isNaN(agencyPrice) ? 0 : agencyPrice;
          if (dataItem.dealerPrice != null && dataItem.dealerPrice != undefined && Utils.myTrim(dataItem.dealerPrice + "") != "")
            dealerPrice = parseFloat(dataItem.dealerPrice);
          dealerPrice = isNaN(dealerPrice) ? 0 : dealerPrice;
          if (dataItem.factoryPrice != null && dataItem.factoryPrice != undefined && Utils.myTrim(dataItem.factoryPrice + "") != "")
            factoryPrice = parseFloat(dataItem.factoryPrice);
          factoryPrice = isNaN(factoryPrice) ? 0 : factoryPrice;
          if (dataItem.marketPrice != null && dataItem.marketPrice != undefined && Utils.myTrim(dataItem.marketPrice + "") != "")
            marketPrice = parseFloat(dataItem.marketPrice);
          marketPrice = isNaN(marketPrice) ? 0 : marketPrice;
          if (dataItem.wholesalePrice != null && dataItem.wholesalePrice != undefined && Utils.myTrim(dataItem.wholesalePrice + "") != "")
            wholesalePrice = parseFloat(dataItem.wholesalePrice);
          wholesalePrice = isNaN(wholesalePrice) ? 0 : wholesalePrice;

          if (dataItem.productDescribe != null && dataItem.productDescribe != undefined && Utils.myTrim(dataItem.productDescribe + "") != "")
            productDescribe = dataItem.productDescribe;
          if (dataItem.productInventory != null && dataItem.productInventory != undefined && Utils.myTrim(dataItem.productInventory + "") != "")
            productInventory = dataItem.productInventory;
          if (dataItem.productSerialNumber != null && dataItem.productSerialNumber != undefined && Utils.myTrim(dataItem.productSerialNumber + "") != "")
            productSerialNumber = dataItem.productSerialNumber;
          if (dataItem.specification != null && dataItem.specification != undefined && Utils.myTrim(dataItem.specification + "") != "")
            specification = dataItem.specification;
          if (dataItem.status != null && dataItem.status != undefined && Utils.myTrim(dataItem.status + "") != "")
            status = dataItem.status;
          listItem = {
            id: dataItem.id,
            productName: productName,
            productImage: Utils.myTrim(productImage) != "" ? app.getASSysImgUrl(productImage) : defaultProImg,
            productDescribe: productDescribe,
            productInventory: productInventory,
            productSerialNumber: productSerialNumber,
            specification: specification,
            status: status,
            companyId: companyId,
            agencyPrice: agencyPrice,
            dealerPrice: dealerPrice,
            factoryPrice: factoryPrice,
            marketPrice: marketPrice,
            wholesalePrice: wholesalePrice,
          }
          productList.push(listItem);
        }
      }
    }

    mainObject = {
      companyId: companyId,
      topBanners: topBanners,
      newsList: newsList,
      companyData: companyData,
      productTypeList: productTypeList,
      productList: productList,
      productTypeCnt: productTypeList.length, //产品分类数量
      productCnt: productList.length, //产品数量
    }
    return mainObject;
  },
  //方法：获取数据信息
  getMainCompanyDataInfo: function (mainObj) {
    var that = mainObj,
      app = this,
      companyData = null;
    var URL = app.getUrlAndKey.murl,
      KEY = app.getUrlAndKey.key,
      DataURL = app.getUrlAndKey.dataUrl;
    wx.showLoading({
      title: "加载中......",
    })

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=home_home&action=homePage&AppId=" + encodeURIComponent(app.data.wxAppId) + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&length=70&limitCount=1&imageCount=3&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')

    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          console.log("获取公司信息成功！");
          var data = res.data.data,
            dataItem = null,
            itemObj = null;
          var src = "",
            newsheadimg = "",
            newstitle = "",
            newsdate = "",
            newssummay = "";
          var cSummary = "",
            cPhone = "",
            cEmail = "",
            cWebSite = "",
            cAddr = "",
            cName = "",
            cLogoUrl = "",
            longitude = -1,
            latitude = -1;
          var productTypeList = [],
            productList = [],
            cPhotos = [];
          companyData = null;

          //3、公司相关信息
          if (data.companyInfo != null && data.companyInfo != undefined) {
            var businessList = [],
              markers = [],
              markerItem = null;
            dataItem = data.companyInfo;
            cSummary = "";
            cPhone = "";
            cEmail = "";
            cWebSite = "";
            cAddr = "";

            app.data.companyId = dataItem.id;
            app.globalData.userInfo.companyId = app.globalData.userInfo.companyId <= 0 ? app.data.companyId : app.globalData.userInfo.companyId;
            console.log("公司ID：" + app.data.companyId);
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              cName = dataItem.companyName;
            if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
              cLogoUrl = app.getASSysImgUrl(dataItem.companyLogo);
            if (dataItem.companyProfile != null && dataItem.companyProfile != undefined && Utils.myTrim(dataItem.companyProfile + "") != "")
              cSummary = dataItem.companyProfile;
            if (dataItem.companyPhone != null && dataItem.companyPhone != undefined && Utils.myTrim(dataItem.companyPhone + "") != "")
              cPhone = dataItem.companyPhone;
            if (dataItem.companyEmail != null && dataItem.companyEmail != undefined && Utils.myTrim(dataItem.companyEmail + "") != "")
              cEmail = dataItem.companyEmail;
            if (dataItem.companyURL != null && dataItem.companyURL != undefined && Utils.myTrim(dataItem.companyURL + "") != "")
              cWebSite = dataItem.companyURL;
            if (dataItem.companySite != null && dataItem.companySite != undefined && Utils.myTrim(dataItem.companySite + "") != "")
              cAddr = dataItem.companySite;
            if (dataItem.businessList != null && dataItem.businessList != undefined && dataItem.businessList.length > 0) {
              var businessName = "",
                busImgUrl = "",
                busDataItem = null,
                busListItem = null;
              for (var n = 0; n < dataItem.businessList.length; n++) {
                businessName = "";
                busImgUrl = "";
                busDataItem = null;
                busListItem = null;
                busDataItem = dataItem.businessList[n];

                if (busDataItem.businessName != null && busDataItem.businessName != undefined && Utils.myTrim(busDataItem.businessName + "") != "")
                  businessName = busDataItem.businessName;
                if (busDataItem.image != null && busDataItem.image != undefined && Utils.myTrim(busDataItem.image + "") != "")
                  busImgUrl = busDataItem.image;
                busListItem = {
                  id: busDataItem.id,
                  businessName: businessName,
                  busImgUrl: Utils.myTrim(busImgUrl) != "" ? app.getASSysImgUrl(busImgUrl) : defaultBusImg,
                }
                businessList.push(busListItem);
              }
            }

            if (data.location != null && data.location != undefined) {
              try {
                longitude = data.location.longitude != null && data.location.longitude != undefined ? parseFloat(data.location.longitude) : longitude;
                longitude = isNaN(longitude) ? -1 : longitude;
              } catch (err) {}
              try {
                latitude = data.location.latitude != null && data.location.latitude != undefined ? parseFloat(data.location.latitude) : latitude;
                latitude = isNaN(latitude) ? -1 : latitude;
              } catch (err) {}
              markerItem = {
                iconPath: DataURL + "/images/markicon.png",
                id: 0,
                latitude: latitude,
                longitude: longitude,
                width: 20,
                height: 28,
                callout: {
                  content: cName
                }
              }
              markers.push(markerItem);
            }

            companyData = {
              cName: cName,
              cLogoUrl: cLogoUrl,
              cSummary: cSummary,
              cPhone: cPhone,
              cEmail: cEmail,
              cWebSite: cWebSite,
              cAddr: cAddr,
              businessList: businessList,
              mapLocation: {
                longitude: longitude,
                latitude: latitude,
                markers: markers,
              }
            }
            app.getPaySourceData(that, app.data.companyId, app.data.wxAppId)
          }
          if (companyData != null)
            companyData.cPhotos = cPhotos;
          //产品信息productList
          if (data.productList != null && data.productList != undefined) {
            var listItem = null;
            if (data.productList.productTypeMsg != null && data.productList.productTypeMsg != undefined && data.productList.productTypeMsg.length > 0) {
              var productImage = "";
              for (var i = 0; i < data.productList.productTypeMsg.length; i++) {
                listItem = null;
                dataItem = null;
                dataItem = data.productList.productTypeMsg[i];
                if (dataItem.productImage != null && dataItem.productImage != undefined && Utils.myTrim(dataItem.productImage + "") != "")
                  productImage = dataItem.productImage;
                listItem = {
                  id: dataItem.productTypeId,
                  typeName: dataItem.productTypeName,
                  productImage: Utils.myTrim(productImage) != "" ? app.getASSysImgUrl(productImage) : defaultProImg
                }
                productTypeList.push(listItem);
              }
            }
          }

          app.data.productTypeList = productTypeList;
          app.data.mainCompanyData = companyData;
          app.data.sysLogoUrl = companyData.cLogoUrl;
          console.log(companyData);
          //获取缓存的平台账户信息
          app.getSysUserAccountInfo();
          that.dowithAppRegLogin(1);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取主页信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取主页信息接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取主页信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////
  //------生成表单宣传图片----------------------------------------------------
  //方法：生成表单宣传图片
  //说明：需要在所调用的页面实现处理方法setCADImgInfo(imgUrl)
  //     imgUrl：返回的宣传图片路径
  //参数说明：
  //mainObj：页面主体
  //page：小程序跳转页面URL
  //pageData：小程序跳转参数（&用“|”代替）
  //title：宣传图片标题
  //words：宣传图片广告语
  //innerImgUrl：宣传图片内带图片
  //otherParams：其他参数
  createADModalQRImg: function (mainObj, page, pageData, title, words, innerImgUrl, otherParams) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key,
      DataURL = app.getUrlAndKey.dataUrl;
    title = title == null || title == undefined ? "" : title;
    words = words == null || words == undefined ? "" : words;
    wx.showLoading({
      title: '正在生成图片中',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var sendBatch = Date.parse(new Date()),
      vistingCardInfo = "";
    sendBatch = sendBatch / 1000;
    var urlParam = "cls=main_WXQRCode&action=getWXPicture&page=" + page + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&pagedata=" + pageData + "&title=" + encodeURIComponent(title) + "&gg=" + words + "&img=" + encodeURIComponent(innerImgUrl) + otherParams + "&sign=" + sign;
    console.log("生成宣传图片接口：")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.rspCode == 0) {
          var imgUrl = DataURL + "/" + res.data.data.imageAddress + "?" + Math.random(99);
          that.setCADImgInfo(imgUrl);
        } else {
          app.setErrorMsg2(that, "生成图片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        app.setErrorMsg2(that, "生成图片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '生成图片失败',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })

  },
  //方法：生成小程序二维码图片
  //说明：需要在所调用的页面实现处理方法setWXQRCodeImg(imgUrl)
  //     imgUrl：返回的宣传图片路径
  //参数说明：
  //mainObj：页面主体
  //page：小程序跳转页面URL
  //pageData：小程序跳转参数（&用“|”代替）
  createWXQRCodeImg: function (mainObj, page, pageData) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=main_WXQRCode&action=getWXQRCode&page=" + page + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&pagedata=" + pageData + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      dataType: "json",
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("生成二维码成功！")
          if (res.data.data != null && res.data.data != undefined && res.data.data.imageAddress != null && res.data.data.imageAddress != undefined && Utils.myTrim(res.data.data.imageAddress) != "") {
            let qrsrc = app.getSysImgUrl(res.data.data.imageAddress.replace('/tts_upload', ''));
            try {
              that.setWXQRCodeImg(qrsrc);
            } catch (e) {
              console.log(e)
            }
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
          app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "生成二维码接口失败！",
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "生成二维码失败！出错信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////
  //------地图导航------------------------------------------------------------
  //方法：根据经纬度获取当前城市
  //参数：
  //mainObj：调用页面主体
  getMapCityInfo: function (mainObj, latitude, longitude) {
    let that = mainObj,
      app = this;
    if (longitude > -1 && latitude > -1) {
      if (qqmapsdk == null || qqmapsdk == undefined) {
        try {
          //实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: app.data.qqMapSDKKey
          });
        } catch (e) {}
      }
      let location = {
        latitude: latitude,
        longitude: longitude,
      }
      console.log("逆地址解析：")
      qqmapsdk.reverseGeocoder({
        //位置坐标，默认获取当前位置，非必须参数
        /**
         * 
         //Object格式
          location: {
            latitude: 39.984060,
            longitude: 116.307520
          },
        */
        /**
         *
         //String格式
          location: '39.984060,116.307520',
        */
        location: location || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
        //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
        sig: app.data.qqMapIPSign,
        success: function (res) { //成功后的回调
          console.log("根据坐标获取城市信息：")
          console.log(res);
          var res = res.result;
          try {
            let city_code = res.ad_info.city_code,
              nation_code = res.ad_info.nation_code;
            city_code = Utils.myTrim(city_code) != '' ? city_code.replace(nation_code, "") : city_code;
            app.globalData.defaultCity = res.ad_info.city;
            app.globalData.defaultCityCode = city_code;
            app.globalData.defaultCounty = '';
            app.globalData.isGetCurCity = true;
          } catch (e) {}
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      })
    }
  },
  //方法：根据地址获取经纬度
  //说明：调用页面需要实现结果处理方法dowithGetMapLALInfo(dataInfo,tag,errorInfo)
  //     dataInfo：返回的经纬度信息，Longitude经度，Latitude纬度
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  getMapLALInfo: function (mainObj, address) {
    let that = mainObj,
      app = this;
    if (Utils.myTrim(address) != "") {
      if (qqmapsdk == null || qqmapsdk == undefined) {
        try {
          //实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: app.data.qqMapSDKKey
          });
        } catch (e) {}
      }

      console.log("地址解析：" + address)
      qqmapsdk.geocoder({
        //获取表单传入地址
        address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        sig: app.data.qqMapIPSign,
        success: function (res) { //成功后的回调
          console.log("腾讯地图API地址解析结果：")
          console.log(res);
          let dataInfo = null;
          let latitude = res.result.location.lat;
          let longitude = res.result.location.lng;
          dataInfo = {
            Longitude: longitude,
            Latitude: latitude
          }
          try {
            that.dowithGetMapLALInfo(dataInfo, 1, "");
          } catch (e) {
            console.log(e)
          }
        },
        fail: function (error) {
          console.error(error);
          try {
            that.dowithGetMapLALInfo(null, 0, "无效地址");
          } catch (e) {
            console.log(e)
          }
        },
        complete: function (res) {
          console.log(res);
        }
      })
    } else {
      try {
        that.dowithGetMapLALInfo(null, 0, "无效地址");
      } catch (e) {
        console.log(e)
      }
    }
  },
  //事件：我要导航
  navigateToMap: function (mainObj, address) {
    var that = mainObj,
      app = this;
    if (Utils.myTrim(address) != "") {
      if (qqmapsdk == null || qqmapsdk == undefined) {
        try {
          //实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: app.data.qqMapSDKKey
          });
        } catch (e) {}
      }

      console.log("地址解析：" + address)
      qqmapsdk.geocoder({
        //获取表单传入地址
        address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        sig: app.data.qqMapIPSign,
        success: function (res) { //成功后的回调
          console.log("腾讯地图API地址解析结果：")
          console.log(res);
          let latitude = res.result.location.lat;
          let longitude = res.result.location.lng;
          //根据地址解析在地图上标记解析地址位置
          try {
            wx.openLocation({
              latitude: latitude,
              longitude: longitude,
              name: address,
              scale: 15
            })
          } catch (e) {
            wx.showToast({
              title: "无效地址不能导航！",
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: function (error) {
          console.error(error);
          wx.showToast({
            title: "无效地址不能导航！",
            icon: 'none',
            duration: 1500
          })
        },
        complete: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showToast({
        title: "无效地址不能导航！",
        icon: 'none',
        duration: 1500
      })
    }
  },

  //方法：报价优小程序跳转
  //mainObj：页面主体
  //tag：0停留在本页，1跳转到微官网首页
  //appurl：跳转目标小程序的页面路径
  gotoBJYWXApp: function (mainObj, tag, appurl) {
    var that = mainObj,
      app = this;
    console.log("跳转：" + app.data.commercialAppID);
    try {
      wx.showModal({
        title: '温馨提示',
        content: '您确定要跳转到报价优商务工具吗？',
        showCancel: true, //是否显示取消按钮
        cancelText: "取消", //默认是“取消”
        cancelColor: '#000000', //取消文字的颜色
        confirmText: "确定", //默认是“确定”
        confirmColor: '#3cc51f', //确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消，wx.navigateBack
            if (tag == 1) {
              wx.switchTab({
                url: '../../pages/asite/index/index'
              })
            }
          } else {
            // 使用wx.navigateToMiniProgram跳转到小程序
            wx.navigateToMiniProgram({
              appId: app.data.commercialAppID, // 要跳转的小程序的appid
              path: appurl, // 跳转的目标页面
              extraData: {
                sappid: app.data.wxAppId,
                sappname: app.data.sysName
              },
              envVersion: app.data.commercialAppVersion,
              success(res) {
                // 打开成功  
              },
              fail(err) {
                console.log('跳转操作失败！')
                console.log(err)
              }
            })
          }
        },
        fail: function (err) {
          //接口调用失败的回调函数，wx.navigateBack
        },
        complete: function (res) {
          //接口调用结束的回调函数（调用成功、失败都会执行）
          if (tag == 1) {
            wx.switchTab({
              url: '../../pages/asite/index/index'
            })
          }
        },
      })

    } catch (e) {
      console.log('跳转失败！')
      console.log(e)
      if (tag == 1) {
        wx.switchTab({
          url: '../../pages/asite/index/index'
        })
      }
    }
  },
  ////////////////////////////////////////////////////////////////////
  //-------图片处理----------------------------------------------------
  //事件：图片上传事件
  //mainObj：调用页面主体
  //sType：处理类型
  //rbImgCnt：已上传图片数量
  //maxRbImgCnt：最大上传图片数量
  uploadImg: function (mainObj, sType, rbImgCnt, maxRbImgCnt) {
    var that = mainObj,
      app = this,
      enableRbImgCnt = 0,
      appUserInfo = app.globalData.userInfo;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    maxRbImgCnt = maxRbImgCnt == 0 ? 1 : maxRbImgCnt;
    enableRbImgCnt = maxRbImgCnt - rbImgCnt;

    wx.chooseImage({
      count: enableRbImgCnt,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log("select image")
        console.log(res)
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          if (maxRbImgCnt > 1) {
            //多张图片上传
            if (res.tempFilePaths.length > enableRbImgCnt) {
              wx.showLoading({
                title: "最多只能上传" + maxRbImgCnt + "张，图片处理中...",
              })
            }
            //多图片上传
            app.recUpLoadMImg(mainObj, res.tempFilePaths, 0, 0, 0, res.tempFilePaths.length, sType, rbImgCnt, maxRbImgCnt);
          } else {
            //单张图片上传
            wx.showLoading({
              title: "图片处理中...",
            })
            //单图片上传
            console.log(res.tempFilePaths[0])
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;

            var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
            var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
            console.log('sign:' + urlParam + "&key=" + KEY)
            urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
            console.log(URL + urlParam)
            console.log('~~~~~~~~~~~~~~~~~~~')
            wx.uploadFile({
              url: URL + urlParam, //仅为示例，非真实的接口地址
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                wx.hideLoading();
                console.log("图片上传服务器结果。。。")
                var data = null;
                try {
                  data = JSON.parse(res.data.replace(/\"/g, "\""));
                } catch (e) {}
                console.log(res)
                if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
                  var imgUrl = "";
                  if (data.data.fileName != null && data.data.fileName != undefined) {
                    imgUrl = app.getSysImgUrl(data.data.fileName);
                    that.dowithImg(imgUrl, sType);
                  } else {
                    wx.showToast({
                      title: res.data.rspMsg,
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
                }
                //do something
              },
              fail: function (e) {
                wx.hideLoading();
              },
              complete: function (e) {
                wx.hideLoading();
              }
            })
          }
        }
      }
    })
  },
  //方法：递归上传多图片
  //mainObj：调用页面主体
  //imgData：本轮操作需要上传的图片列表
  //index：本轮操作当前正在上传的图片列表索引
  //sCnt：本轮操作上传成功图片数量
  //fCnt：本轮操作上传失败图片数量
  //aCnt：本轮操作总共需要上传的图片数量
  //sType：处理类型
  //rbImgCnt：所有已上传图片数量
  //maxRbImgCnt：最大上传图片数量
  recUpLoadMImg: function (mainObj, imgData, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt) {
    var that = mainObj,
      app = this,
      appUserInfo = app.globalData.userInfo,
      sindex = index + 1;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    //数量是否超过限制判断
    if (rbImgCnt >= maxRbImgCnt) {
      return;
    }
    //上传第几张提示
    wx.showLoading({
      title: "上传" + sindex + "/" + aCnt + "张...",
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(index + ":" + imgData[index]);
    wx.uploadFile({
      url: URL + urlParam, //仅为示例，非真实的接口地址
      filePath: imgData[index],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        console.log("图片上传服务器结果。。。")
        wx.hideLoading();
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) {}
        console.log(res)
        if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          var imgUrl = "";
          if (data.data.fileName != null && data.data.fileName != undefined) {
            sCnt++;
            rbImgCnt++;
            imgUrl = app.getSysImgUrl(data.data.fileName);
            console.log(imgUrl);
            that.dowithImg(imgUrl, sType);
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
        //do something
      },
      fail: function (e) {
        wx.hideLoading();
        fCnt++;
      },
      complete: function (e) {
        wx.hideLoading();
        index++;
        if (index == aCnt || (rbImgCnt >= maxRbImgCnt)) {
          wx.hideLoading();
          if (fCnt > 0 || sCnt <= 0) {
            wx.showToast({
              title: '共' + sCnt + '张上传成功,' + fCnt + '张上传失败！',
              icon: 'none',
              duration: 2000
            })
          }
        } else { //递归调用recUpLoadMImg函数
          app.recUpLoadMImg(mainObj, imgData, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt);
        }
      }
    })
  },
  //方法：图片上传事件
  //说明：需要在所调用的页面定义dowithImg(imgUrl, sType)处理上传成功的图片逻辑）
  //      imgUrl:返回的有效图片路径
  //      sType：处理类型
  //参数说明：
  //mainObj：调用页面主体
  //sType：处理类型
  //rbImgCnt：已上传图片数量
  //maxRbImgCnt：最大上传图片数量
  uploadCompressImg: function (mainObj, sType, rbImgCnt, maxRbImgCnt, canvasId) {
    var that = mainObj,
      app = this,
      enableRbImgCnt = 0,
      appUserInfo = app.globalData.userInfo;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    maxRbImgCnt = maxRbImgCnt == 0 ? 1 : maxRbImgCnt;
    enableRbImgCnt = maxRbImgCnt - rbImgCnt;

    let ctx = wx.createCanvasContext(canvasId);
    wx.chooseImage({
      count: enableRbImgCnt,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log("select image")
        console.log(res)
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          if (maxRbImgCnt > 1) {
            //多张图片上传
            if (res.tempFilePaths.length > enableRbImgCnt) {
              wx.showLoading({
                title: "最多只能上传" + maxRbImgCnt + "张，图片处理中...",
              })
            }
          }
          //多图片上传
          app.recUploadWithCompressImg(mainObj, res.tempFilePaths, 0, 0, 0, res.tempFilePaths.length, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId);
        }
      },
      fail: function(err) {
        console.log("fail-wx.chooseImage")
        console.log(err)
      }
    })
  },
  //方法：递归上传多个压缩处理图片
  //mainObj：调用页面主体
  //tempFilePaths：本轮操作需要上传的图片列表
  //index：本轮操作当前正在上传的图片列表索引
  //sCnt：本轮操作上传成功图片数量
  //fCnt：本轮操作上传失败图片数量
  //aCnt：本轮操作总共需要上传的图片数量
  //sType：处理类型
  //rbImgCnt：所有已上传图片数量
  //maxRbImgCnt：最大上传图片数量
  //ctx：canvas对象
  //canvasId：canvas的ID
  recUploadWithCompressImg: function (mainObj, tempFilePaths, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId) {
    let that = mainObj,
      app = this,
      appUserInfo = app.globalData.userInfo,
      sindex = index + 1,
      alertMessage = "";
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    //数量是否超过限制判断
    if (rbImgCnt >= maxRbImgCnt) {
      return;
    }
    //上传提示
    alertMessage = maxRbImgCnt > 1 ? "上传" + sindex + "/" + aCnt + "张..." : "图片处理中...";
    wx.showLoading({
      title: alertMessage,
    })
    //1、图片大小检查处理
    wx.getFileInfo({
      filePath: tempFilePaths[index],
      success(res) {
        console.log("压缩前图片大小:", res.size / 1024, 'kb');
        if (res.size > app.data.uploadImgSize) {
          //1.1图片大小超标的情况
          wx.getImageInfo({
            src: tempFilePaths[index],
            success: function (imageInfo) {
              let icImgWidth = imageInfo.width,
                icImgHeight = imageInfo.height;
              //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
              if (icImgWidth > app.data.uploadImgWidth || icImgHeight > app.data.uploadImgHeight) {
                let scale = icImgWidth / icImgHeight;
                if (scale > app.data.uploadImgWidth / app.data.uploadImgHeight) {
                  // 要求宽度*(原生图片比例)=新图片尺寸
                  icImgWidth = app.data.uploadImgWidth;
                  icImgHeight = Math.round(app.data.uploadImgWidth / scale);
                } else {
                  icImgHeight = app.data.uploadImgHeight;
                  icImgWidth = Math.round(app.data.uploadImgHeight * scale);
                }
              }
              that.setData({ //构造画板宽高
                icImgWidth: icImgWidth,
                icImgHeight: icImgHeight
              })
              //画出压缩图片
              ctx.clearRect(0, 0, icImgWidth, icImgHeight);
              ctx.drawImage(tempFilePaths[index], 0, 0, icImgWidth, icImgHeight);
              ctx.draw(false, () => {
                try{
                  wx.canvasToTempFilePath({
                    canvasId: canvasId,
                    width: icImgWidth,
                    height: icImgHeight,
                    success(res0) {
                      try {
                        app.uploadSingleCompressImg(mainObj, res0.tempFilePath, tempFilePaths, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId);
                      } catch (e) {}
                    },
                    fail: function(err) {
                      console.log("fail-wx.canvasToTempFilePath")
                      console.log(err)
                    }
                  });
                }catch(e){
                  console.log("try fail-wx.canvasToTempFilePath")
                  console.log(err)
                }
              });
            },
            fail: function(err) {
              console.log("fail-wx.getImageInfo")
              console.log(err)
            }
          })
        } else {
          //1.2图片大小不超标的情况
          app.uploadSingleCompressImg(mainObj, tempFilePaths[index], tempFilePaths, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId);
        }
      },
      fail: function(err) {
        console.log("fail-wx.getFileInfo")
        console.log(err)
      }
    })
  },
  //方法：上传单个压缩处理图片
  //mainObj：调用页面主体
  //tempSingleImgPath：当前需要上传的图片
  //imgData：本轮操作需要上传的图片列表
  //index：本轮操作当前正在上传的图片列表索引
  //sCnt：本轮操作上传成功图片数量
  //fCnt：本轮操作上传失败图片数量
  //aCnt：本轮操作总共需要上传的图片数量
  //sType：处理类型
  //rbImgCnt：所有已上传图片数量
  //maxRbImgCnt：最大上传图片数量
  //ctx：canvas对象
  //canvasId：canvas的ID
  uploadSingleCompressImg: function (mainObj, tempSingleImgPath, tempFilePaths, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId) {
    let that = mainObj,
      app = this,
      appUserInfo = app.globalData.userInfo;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;

    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(index + ":" + tempSingleImgPath);
    wx.uploadFile({
      url: URL + urlParam, //仅为示例，非真实的接口地址
      filePath: tempSingleImgPath,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        console.log("图片上传服务器结果。。。")
        wx.hideLoading();
        let data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) {}
        console.log(res)
        if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          let imgUrl = "";
          if (data.data.fileName != null && data.data.fileName != undefined) {
            sCnt++;
            rbImgCnt++;
            imgUrl = app.getSysImgUrl(data.data.fileName);
            console.log(imgUrl);
            that.dowithImg(imgUrl, sType);
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
        //do something
      },
      fail: function (e) {
        console.log("fail-wx.uploadFile")
        console.log(e)
        wx.hideLoading();
        fCnt++;
      },
      complete: function (e) {
        wx.hideLoading();
        if (maxRbImgCnt > 1) {
          index++;
          if (index == aCnt || (rbImgCnt >= maxRbImgCnt)) {
            wx.hideLoading();
            if (fCnt > 0 || sCnt <= 0) {
              wx.showToast({
                title: '共' + sCnt + '张上传成功,' + fCnt + '张上传失败！',
                icon: 'none',
                duration: 2000
              })
            }
          } else { //递归调用recUpLoadMImg函数
            app.recUploadWithCompressImg(mainObj, tempFilePaths, index, sCnt, fCnt, aCnt, sType, rbImgCnt, maxRbImgCnt, ctx, canvasId);
          }
        }
      }
    })
  },
  //方法：IntersectionObserver 对象懒加载商品详情图片
  //mainObj：调用页面主体
  //imgDataList：图片数据集
  //preClass：图片标识样式前缀
  //arraykeyStr：图片项setData键值前缀
  lazyLoadImgList: function (mainObj, imgDataList, preClass, arraykeyStr) {
    var that = mainObj,
      app = this;
    if (imgDataList != null && imgDataList != undefined && imgDataList.length > 0) {
      for (let i = 0; i < imgDataList.length; i++) {
        const viewPort = wx.createIntersectionObserver().relativeToViewport();
        viewPort.observe("." + preClass + i, (res) => {
          //console.log("图片进入视图区域", res);
          let index = res.dataset.index;
          let keyStr = arraykeyStr + "[" + i + "].isShow";
          that.setData({
            [keyStr]: true
          })
          viewPort.disconnect();
        })
      }
    }
  },
  /**
   * 预览大图
   */
  viewImage: function (imgSrc) {
    var urls = [];
    urls.push(imgSrc);
    wx.previewImage({
      current: imgSrc, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  ////////////////////////////////////////////////////////////////////
  //-------短信发送--------------------------------------------------
  //方法：发送短信
  //说明：需要在所调用的页面实现处理方法dowithSMSMessage(tag,timestamp)
  //      tag：1成功，0失败
  //      timestamp：发送时间戳
  //参数说明：
  //mainObj：调用页面主体
  //mobile：接收短信手机号
  //content：短信内容
  //sCnt：本轮操作上传成功图片数量
  sendSMSMessage: function (mainObj, mobile, content) {
    var that = mainObj,
      app = this;
    var URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_user&action=sendSms&companyId=" + app.data.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&content=" + encodeURIComponent(content) + "&mobile=" + mobile + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log("【短信：" + content + "】")
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithSMSMessage(1, timestamp);
          } catch (e) {}
        } else {
          app.setErrorMsg2(that, "获取注册验证码失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          try {
            that.dowithSMSMessage(0, timestamp);
          } catch (e) {}
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取注册验证码失败：fail：" + JSON.stringify(err), URL + urlParam, false);
        try {
          that.dowithSMSMessage(0, timestamp);
        } catch (e) {}
      }
    })
  },
  ////////////////////////////////////////////////////////////////////
  //-------直播相关--------------------------------------------------
  //方法：获取直播列表
  //说明：需要在所调用的页面实现处理方法dowithGetLiveBroadcastList(dataList,tag,errorInfo,pageIndex)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex:当前分页索引
  //参数说明：
  //mainObj：调用页面主体
  //pageSize：分页每页记录数
  //pageSize：分页索引（从1开始）
  getLiveBroadcastList: function (mainObj, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let SMURL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    //直播测试 chenh 获取指定直播房间 可按房间名称,主播名称,房间编号来查
    let roomname = "定制商城教程直播";
    let timestamp = Date.parse(new Date()) / 1000;
    let urlParam = "cls=product_liveplay&action=QueryLiveRoom&appId=" + app.data.appid + "&timestamp=" + timestamp + "&xcxAppId=" + app.data.wxAppId;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log(SMURL + urlParam);
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          try {
            that.dowithGetLiveBroadcastList(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetLiveBroadcastList(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "直播查询：出错：" + res.data.rspMsg, SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetLiveBroadcastList(null, 0, JSON.stringify(err), pageIndex);
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "直播查询：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    });
  },
  ////////////////////////////////////////////////////////////////////
  //-------首页相关----------------------------------------------------
  //方法：获取Banner列表
  //说明：需要在所调用的页面实现处理方法dowithGetBannerList(dataList,tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  getBannerList: function (mainObj) {
    let that = mainObj,
      app = this,
      noDataAlert = "暂无banner信息！";
    return new Promise((resolve, reject) => {
      let SMURL = app.getUrlAndKey.smurl,
        KEY = app.getUrlAndKey.key;
      let appUserInfo = app.globalData.userInfo;

      let timestamp = Date.parse(new Date()),
        urlParam = "",
        sign = "",
        otherParamCon = "&location=0,1";
      timestamp = timestamp / 1000;

      //CH接口
      urlParam = "cls=product_activity&action=QueryBanner&appId=" + app.data.appid + "&timestamp=" + timestamp;
      sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      console.log('sign:' + urlParam + "&key=" + KEY)
      urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
      console.log("banner信息URL:")
      console.log(SMURL + urlParam)
      console.log('~~~~~~~~~~~~~~~~~~~')
      wx.request({
        url: SMURL + urlParam,
        success: function (res) {
          console.log("banner信息:")
          console.log(res.data)
          if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
            try {
              that.dowithGetBannerList(res.data.data, 1, "");
            } catch (e) {
              console.log(e)
            }
          } else {
            try {
              that.dowithGetBannerList(null, 0, res.data.rspMsg);
            } catch (e) {
              console.log(e)
            }
            app.setErrorMsg2(that, "获取banner信息：出错：" + res.data.rspMsg, SMURL + urlParam, false)
          }
          resolve('getBannerList successful！！！');
        },
        fail: function (err) {
          try {
            that.dowithGetBannerList(null, 0, JSON.stringify(err));
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取banner信息：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
          reject('getBannerList failed！！！');
        }
      })
    });
  },

  ////////////////////////////////////////////////////////////////////
  //-------社区相关----------------------------------------------------
  //方法：入住时段判断及入住天数计算
  //说明：需要在所调用的页面实现处理方法dowithComputeCheckInDaysCount(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //dtBegin：入住日期（字符串）
  //dtEnd：离开日期（字符串）
  computeCheckInDaysCount: function (mainObj, dtBegin, dtEnd) {
    let that = mainObj,
      app = this,
      num = 0;
    //时间段判断
    if (Utils.myTrim(dtBegin) == "" || Utils.myTrim(dtEnd) == "") {
      return;
    }
    let dtNow = new Date(),
      dtSetBegin = new Date(),
      dtSetEnd = new Date();
    try {
      dtSetBegin = Date.parse(dtBegin.replace(/\-/g, "/"));
      dtSetEnd = Date.parse(dtEnd.replace(/\-/g, "/"));
      num = Utils.getDaysByDateTime(dtSetBegin, dtSetEnd);
    } catch (e) {}
    let dtS0 = new Date(),
      dtN0 = new Date();
    try {
      dtS0 = Utils.getDateByTimeStr(dtBegin, false);
      dtN0 = new Date(dtNow.getFullYear(), dtNow.getMonth(), dtNow.getDate())
    } catch (e) {
      console.log(e)
    }
    if (dtN0 > dtS0) {
      wx.showToast({
        title: "入住日期不能小于当前日期！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (dtSetEnd <= dtSetBegin) {
      wx.showToast({
        title: "入住时间不能大于离开时间！",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //不够一天按1天来算
    if (num <= 0 && dtSetEnd > dtSetBegin) num = 1;
    if (num <= 0) {
      wx.showToast({
        title: "入住起始时间设置错误！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    app.data.dtCheckInStart = dtBegin;
    app.data.dtCheckInEnd = dtEnd;
    app.data.checkInDays = num;
    try {
      let dataList = {
        dtCheckInStart: dtBegin,
        dtCheckInEnd: dtEnd,
        checkInDays: num,
      }
      that.dowithComputeCheckInDaysCount(dataList, 1, "")
    } catch (e) {}
  },
  ////////////////////////////////////////////////////////////////////
  //-------社区相关----------------------------------------------------
  //方法：社区收藏操作
  //说明：需要在所调用的页面实现处理方法dowithOperationCollectCommunity(dataList, tag,collectTag, errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     collectTag：0收藏，1取消收藏
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //cId：小区ID
  //hId：房源ID
  //recordId：收藏记录ID
  //mold：0小区，1房源
  //tag：0收藏，1取消收藏
  operationCollectCommunity: function (mainObj, cId, hId, recordId, mold, tag) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    if (tag == 0) {
      //收藏操作
      switch (mold) {
        case 0:
          otherParamCon += "&mold=" + mold + "&housing_id=" + cId;
          break;

        case 1:
          otherParamCon += "&mold=" + mold + "&housing_id=" + cId + "&detail_id=" + hId;
          break;
      }
      otherParamCon += "&opertion=add";
    } else {
      //取消收藏操作
      otherParamCon += "&id=" + recordId + "&opertion=del";
    }

    let timestamp = Date.parse(new Date()),
      urlParam = "",
      sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_housingfavorite&action=saveHousingfavorite&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithOperationCollectCommunity(res.data.data, 1, tag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithOperationCollectCommunity(null, 0, tag, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "操作社区收藏：出错：" + res.data.rspMsg, SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithOperationCollectCommunity(null, 0, tag, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "操作社区收藏接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //方法：社区收藏操作
  //说明：需要在所调用的页面实现处理方法dowithIsCollectedCommunity(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //cId：小区ID
  //hId：房源ID
  //recordId：收藏记录ID
  //mold：0小区，1房源
  isCollectedCommunity: function (mainObj, cId, hId, mold) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    //收藏操作
    switch (mold) {
      case 0:
        otherParamCon += "&mold=" + mold + "&housing_id=" + cId;
        break;

      case 1:
        otherParamCon += "&mold=" + mold + "&housing_id=" + cId + "&detail_id=" + hId;
        break;
    }

    let timestamp = Date.parse(new Date()),
      urlParam = "",
      sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_housingfavorite&action=checkUserFavorite&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          try {
            that.dowithIsCollectedCommunity(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithIsCollectedCommunity(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "操作社区收藏：出错：" + res.data.rspMsg, SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithIsCollectedCommunity(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "操作社区收藏接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },

  //方法：获取公司列表信息
  //说明：调用页面需要实现结果处理方法dowithGetCompanyListDataInfo(dataList,tag,errorInfo, pageIndex)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getCompanyListDataInfo: function (mainObj, otherParam, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_companyMsg&action=companyMsgList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetCompanyListDataInfo(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetCompanyListDataInfo(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取酒店详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        try {
          that.dowithGetCompanyListDataInfo(null, 0, JSON.stringify(err), pageIndex);
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取酒店详情接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取单个公司信息结果处理方法
  dowithCompanyMainDataInfo: function (mainObj, dataList) {
    let that = mainObj,
      app = this;
    let curCompanyId = 0,
      companyDataInfo = that.data.companyDataInfo;
    if (dataList != null && dataList != undefined) {
      let data = dataList,
        dataItem = null,
        companyId = 0,
        companyName = "",
        companyLogo = "",
        levelValue = 0,
        levelName = "",
        telephone = "",
        address = "",
        longitude = -1,
        latitude = -1,
        describe = "",
        photoList = [];
      let photosTemp = [],
        photosString = "";
      console.log(JSON.stringify(data.companyMsg));
      if (data.companyMsg != null && data.companyMsg != undefined && data.companyMsg.length > 0) {
        dataItem = data.companyMsg.length > 0 ? data.companyMsg[0] : data.companyMsg;
        companyId = dataItem.id;
        if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
          companyName = dataItem.companyName;
        //companyLogo
        if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
          companyLogo = dataItem.companyLogo;
        if (dataItem.companyPhone != null && dataItem.companyPhone != undefined && Utils.myTrim(dataItem.companyPhone + "") != "")
          telephone = dataItem.companyPhone;
        if (dataItem.companySite != null && dataItem.companySite != undefined && Utils.myTrim(dataItem.companySite + "") != "")
          address = dataItem.companySite;
        if (dataItem.companyProfile != null && dataItem.companyProfile != undefined && Utils.myTrim(dataItem.companyProfile + "") != "")
          describe = dataItem.companyProfile;
        if (dataItem.longitude != null && dataItem.longitude != undefined && Utils.myTrim(dataItem.longitude + "") != "") {
          try {
            longitude = parseInt(dataItem.longitude);
            longitude = isNaN(longitude) ? -1 : longitude;
          } catch (err) {}
        }
        if (dataItem.latitude != null && dataItem.latitude != undefined && Utils.myTrim(dataItem.latitude + "") != "") {
          try {
            latitude = parseInt(dataItem.latitude);
            latitude = isNaN(latitude) ? -1 : latitude;
          } catch (err) {}
        }
        //levelName levelValue
        if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "") {
          try {
            levelValue = parseInt(dataItem.companyLevel);
            levelValue = isNaN(levelValue) ? 0 : levelValue;
          } catch (err) {}
        }
        levelName = levelValue == 0 ? "旗舰" : "普通";
        //获取公司相册
        if (data.companyphotoList != null && data.companyphotoList != undefined && data.companyphotoList.length > 0) {
          photoList = [];
          photosTemp = [];
          photosString = "";
          for (let i = 0; i < data.companyphotoList.length; i++) {
            dataItem = null;
            dataItem = data.companyphotoList[i];
            if (dataItem.path != null && dataItem.path != undefined && Utils.myTrim(dataItem.path + "") != "") {
              photosString = "";
              photosString = dataItem.path;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    photoList.push(app.getSysImgUrl(photosTemp[n]));
                  }
                }
              }
            }
          }
        }
        if (dataItem.photos != null && dataItem.photos != undefined && dataItem.photos.length > 0) {
          photosTemp = [];
          photosString = "";
          photosString = dataItem.photos;
          photosTemp = photosString.split(",");
          if (photosTemp.length > 0) {
            for (var n = 0; n < photosTemp.length; n++) {
              // 判断是否是视频地址
              photosString = photosTemp[n].toLowerCase();
              if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                photoList.push(app.getSysImgUrl(photosTemp[n]));
              }
            }
          }
        }
      }
      if (photoList.length > 0) {
        var photoListTemp = photoList;
        photoList = [];

        for (var k = 0; k < photoListTemp.length; k++) {
          photoList.push({
            src: photoListTemp[k],
            isShow: k == 0 ? true : false,
          });
        }
      }
      companyDataInfo = {
        companyId: companyId,
        companyName: companyName,
        companyLogo: companyLogo,
        levelName: levelName,
        telephone: telephone,
        address: address,
        longitude: longitude,
        latitude: latitude,
        describe: describe,
        photoList: photoList,
      }
    }
    that.setData({
      companyDataInfo: companyDataInfo,
    }, that.lazyLoadImg)
  },
  //方法：获取个人经纬度
  //说明：需要在所调用的页面实现处理方法dowithGetPersonLocation(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  getPersonLocation: function (mainObj) {
    let that = mainObj,
      app = this;
    wx.getLocation({
      success: function (res) {
        let location = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        app.data.personLocation = location;
        try {
          that.dowithGetPersonLocation(location, 1, "");
        } catch (e) {
          console.log(e)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPersonLocation(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  //方法：获取我的余额
  //说明：需要在所调用的页面实现处理方法dowithGetMyRemainingSum(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  getMyRemainingSum: function (mainObj) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=redEnvelope_changePurse&action=changePurseSurplus&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMyRemainingSum(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetMyRemainingSum(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "余额获取：出错：" + res.data.rspMsg, URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMyRemainingSum(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "余额获取接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //方法：获取我的余额
  //说明：需要在所调用的页面实现处理方法dowithGetNewMyRemainingSum(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  getNewMyRemainingSum: function (mainObj) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=main_moneyBalance&action=myBalance&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log("获取我的余额："+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetNewMyRemainingSum(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetNewMyRemainingSum(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "余额获取：出错：" + res.data.rspMsg, URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetNewMyRemainingSum(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "余额获取接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //方法：抽奖记录操作
  //说明：需要在所调用的页面实现处理方法dowithOperateAwardRecord(dataList, tag,operateTag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     operateTag：0插入记录，1修改记录
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  //operateTag：0插入记录，1修改记录
  operateAwardRecord: function (mainObj, otherParams, operateTag) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=saveLotteryActivityRecord&companyId=" + app.data.companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("抽奖记录操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithOperateAwardRecord(res.data.data, 1, operateTag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithOperateAwardRecord(null, 0, operateTag, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "抽奖记录操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithOperateAwardRecord(null, 0, operateTag, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "抽奖记录操作接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：抽奖记录操作
  //说明：需要在所调用的页面实现处理方法dowithOperateAwardRecord(dataList, tag,operateTag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     operateTag：0插入记录，1修改记录
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //companyId：公司ID
  //otherParams：其他参数
  //operateTag：0插入记录，1修改记录
  operateAwardRecord2: function (mainObj, companyId, otherParams, operateTag) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=saveLotteryActivityRecord&companyId=" + companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("抽奖记录操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithOperateAwardRecord(res.data.data, 1, operateTag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithOperateAwardRecord(null, 0, operateTag, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "抽奖记录操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithOperateAwardRecord(null, 0, operateTag, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "抽奖记录操作接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取奖项列表
  //说明：需要在所调用的页面实现处理方法dowithGetAwardProductList(dataList, tag,operateTag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     operateTag:操作标志
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getAwardProductList: function (mainObj, luckdraw_id, operateTag, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityProduct&action=lotteryActivityProductList&activityId=" + luckdraw_id + "&companyId=" + app.data.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取奖项列表结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetAwardProductList(res.data.data, 1, operateTag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetAwardProductList(null, 0, operateTag, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取奖项列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetAwardProductList(null, 0, operateTag, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取奖项列表接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取奖项列表
  //说明：需要在所调用的页面实现处理方法dowithGetAwardProductList(dataList, tag,operateTag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     operateTag:操作标志
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //luckdraw_id：活动ID
  //companyId：设备所属公司ID
  //operateTag：0转盘信息项目列表，1按摩服务产品，2特别价检查信息
  //otherParams：其他参数
  getAwardProductList2: function (mainObj, luckdraw_id, companyId, operateTag, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityProduct&action=lotteryActivityProductList&activityId=" + luckdraw_id + "&companyId=" + companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取奖项列表结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetAwardProductList(res.data.data, 1, operateTag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetAwardProductList(null, 0, operateTag, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取奖项列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetAwardProductList(null, 0, operateTag, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取奖项列表接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取合作人申请状态操作
  //说明：需要在所调用的页面实现处理方法dowithGetPartnerApplyStat(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getPartnerApplyStat: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_partner&action=partnerList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=200000&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取合作人申请信息结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPartnerApplyStat(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetPartnerApplyStat(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取合作人申请信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPartnerApplyStat(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取合作人申请信息接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取分成统计操作
  //说明：需要在所调用的页面实现处理方法dowithGetPartnerPageList(dataList, tag,errorInfo, pageIndex)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：当前页索引
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getPartnerPageList: function (mainObj, otherParams, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_partner&action=partnerList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取账户申请列表信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPartnerPageList(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetPartnerPageList(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取账户申请列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPartnerPageList(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取账户申请列表接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },

  //----------------------------------------------------------------------
  //---免费按摩部分--------------------------------------------------------
  //方法：获取合作人申请状态操作
  //说明：需要在所调用的页面实现处理方法dowithQueryFreeCheirapsisDataInfo(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  queryFreeCheirapsisDataInfo: function (mainObj, companyId, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=GetFreeLotteryActivityRecord&companyId=" + companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("查询免费按摩信息结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithQueryFreeCheirapsisDataInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithQueryFreeCheirapsisDataInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "查询免费按摩：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithQueryFreeCheirapsisDataInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "查询免费按摩接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取合作人申请状态操作
  //说明：需要在所调用的页面实现处理方法dowithGetFreeCheirapsisDataInfo(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getFreeCheirapsisDataInfo: function (mainObj, companyId, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    otherParams += "&operation=add";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=SaveFreeLotteryActivityRecord&companyId=" + companyId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("领取免费按摩劵结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetFreeCheirapsisDataInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetFreeCheirapsisDataInfo(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "领取免费按摩劵：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetFreeCheirapsisDataInfo(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "领取免费按摩劵接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  //方法：获取合作人操作
  //说明：需要在所调用的页面实现处理方法dowithGetPartnerList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getPartnerList: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_partner&action=partnerList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=2000&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取合作人操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPartnerList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetPartnerList(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取合作人操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPartnerList(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取合作人接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  ////////////////////////////////////////////////////////////////////////////////////
  //----------设备相关信息-------------------------------------------------------------
  //方法：获取单个设备信息
  //说明：需要在所调用的页面实现处理方法dowithGetSingleDeviceInfo(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //deviceId：设备ID
  getSingleDeviceInfo: function (mainObj, deviceId) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;

    otherParamCon += "&id=" + deviceId;
    otherParamCon += "&pageSize=99&pageIndex=1";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_devices&action=devicesList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取设备操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            app.dowithGetSingleDeviceInfo(mainObj, res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            app.dowithGetSingleDeviceInfo(mainObj, null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取设备操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          app.dowithGetSingleDeviceInfo(mainObj, null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取设备接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取单个设备结果处理函数
  dowithGetSingleDeviceInfo: function (mainObj, dataList, tag, errorInfo) {
    let that = mainObj,
      app = this,
      deviceId = 0,
      model = "",
      deviceCompanyId = app.data.agentCompanyId,
      deviceGprsAddress = that.data.deviceGprsAddress,
      address = "";
    switch (tag) {
      case 1:
        console.log("获取设备结果：");
        console.log(dataList);
        let dataItem = null;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.companyMsgList) && dataList.companyMsgList.length > 0) {
          dataItem = null;
          dataItem = dataList.companyMsgList[0];
          let isShowAward = 0,
            isSetFreeCheirapsis = 0,
            freeCheirapsisMode = 0,
            storePageLayout = 1; //freeMassage
          if (Utils.isNotNull(dataItem.orientation) && Utils.myTrim(dataItem.orientation + "") != "null") {
            try {
              storePageLayout = parseInt(dataItem.orientation);
              storePageLayout = isNaN(storePageLayout) ? 1 : storePageLayout;
            } catch (e) {}
            app.data.storePageLayout = storePageLayout;
          }
          if (Utils.isNotNull(dataItem.showLuck) && Utils.myTrim(dataItem.showLuck + "") != "null") {
            try {
              isShowAward = parseInt(dataItem.showLuck);
              isShowAward = isNaN(isShowAward) ? 0 : isShowAward;
            } catch (e) {}
            app.data.isShowAward = isShowAward;
          }
          if (Utils.isNotNull(dataItem.freeMassage) && Utils.myTrim(dataItem.freeMassage + "") != "null") {
            try {
              isSetFreeCheirapsis = parseInt(dataItem.freeMassage);
              isSetFreeCheirapsis = isNaN(isSetFreeCheirapsis) ? 0 : isSetFreeCheirapsis;
            } catch (e) {}
            app.data.isSetFreeCheirapsis = isSetFreeCheirapsis;
          }
          if (Utils.isNotNull(dataItem.freeType) && Utils.myTrim(dataItem.freeType + "") != "null") {
            try {
              freeCheirapsisMode = parseInt(dataItem.freeType);
              freeCheirapsisMode = isNaN(freeCheirapsisMode) ? 0 : freeCheirapsisMode;
            } catch (e) {}
            app.data.freeCheirapsisMode = freeCheirapsisMode;
          }
        }
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let status = 1;
          if (Utils.isNotNull(dataList.dataList[0].status)) {
            try {
              status = parseInt(dataList.dataList[0].status);
              status = isNaN(status) ? 1 : status;
            } catch (e) {}
          }
          deviceId = dataList.dataList[0].id;
          deviceGprsAddress = Utils.isNotNull(dataList.dataList[0].deviceAddress) ? dataList.dataList[0].deviceAddress : "";
          //0已经绑定1解绑
          if (status == 0) {
            if (Utils.isNotNull(dataList.dataList[0].companyId) && Utils.myTrim(dataList.dataList[0].companyId + "") != "null") {
              try {
                deviceCompanyId = parseInt(dataList.dataList[0].companyId);
                deviceCompanyId = isNaN(deviceCompanyId) ? 0 : deviceCompanyId;
              } catch (e) {}
            }
            address = Utils.isNotNull(dataList.dataList[0].address) ? dataList.dataList[0].address : "";

            app.data.agentCompanyId = deviceCompanyId;
            app.data.agentPutAddress = address;
            console.log("设备相关信息打印：")
            console.log(app.data.agentDeviceId + ":" + app.data.agentCompanyId + ":" + app.data.agentPutAddress)
          }
          app.data.agentDeviceId = deviceId;
          app.data.agentDeviceStatus = status;
          app.data.agentDeviceAddress = deviceGprsAddress;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
        break;
    }
  },
  //方法：获取设备信息
  //说明：需要在所调用的页面实现处理方法dowithGetDeviceList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getDeviceList: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_devices&action=devicesList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取设备操作结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetDeviceList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDeviceList(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取设备操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDeviceList(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "获取设备接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取设备分页信息
  //说明：需要在所调用的页面实现处理方法dowithGetDevicePageData(dataList, tag,errorInfo, pageIndex)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getDevicePageData: function (mainObj, otherParams, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_devices&action=devicesList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取设备分页信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetDevicePageData(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDevicePageData(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取设备分页：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDevicePageData(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取设备分页接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取同步设备状态
  //说明：需要在所调用的页面实现处理方法dowithGetSyncDeviceStatusInfo(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     operateTag：操作标识
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherConParams：查询条件
  //operateTag：0同步时间操作，1启动检查在用，2停止检查在用，3支付检查在用，-1其他
  getSyncDeviceStatusInfo: function (mainObj, otherConParams, operateTag) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_devices&action=devicesStatus&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherConParams + "&pageSize=99&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取设备分页信息:', res)
        if (res.data.rspCode == 0) {
          let dataObj = res.data.data;
          if (operateTag >= 0) {
            let deviceStatusArray = res.data.data.dataList;
            let isUsed = Utils.isNull(deviceStatusArray[0].isUsed) ? "00" : deviceStatusArray[0].isUsed; //剩余时间 大余0用户在使用
            let dataUpdateTime = Utils.isNull(deviceStatusArray[0].dataUpdateTime) ? "" : deviceStatusArray[0].dataUpdateTime;
            let userId = Utils.isNull(deviceStatusArray[0].userId) ? 0 : deviceStatusArray[0].userId;
            deviceStatusArray[0].userId;
            let mode = Utils.isNull(deviceStatusArray[0].mode) ? "01" : deviceStatusArray[0].mode;
            let magnitude = Utils.isNull(deviceStatusArray[0].magnitude) ? "01" : deviceStatusArray[0].magnitude;
            let shajun = Utils.isNull(deviceStatusArray[0].shajun) ? "0" : deviceStatusArray[0].shajun; //是否杀菌 0：杀菌停止 ； 1：杀菌开启'
            let userStatus = Utils.isNull(deviceStatusArray[0].userStatus) ? "00" : Utils.myTrim(deviceStatusArray[0].userStatus);

            let time = that.data.remainTime;
            //倒计时 时间
            if (Utils.myTrim(isUsed) != "") {
              time = parseInt(isUsed, 16); //16进制转10进制
            }
            //判断是否在用
            let isUseStat = false,
              dtNow = new Date(),
              dtUpdate = new Date(),
              interval = 0;
            if (time > 0) {
              workStat = userStatus == "00" ? 2 : 1;
              if (Utils.myTrim(dataUpdateTime) != "") {
                try {
                  dtUpdate = new Date(dataUpdateTime.replace(/\-/g, "/"));
                } catch (e) {}
              }
              interval = Utils.getTimeInterval(dtUpdate, dtNow, 0);
              //isUsed为“00”则没人用，否则在用
              if (userId == appUserInfo.userId) {
                //如果上一指令发送者为自己
                isUseStat = false;
              } else {
                //如果上一指令发送者为别人——【1】如果有剩余时间，且更新时间在限定范围内，则为占用，否则为空闲；【2】如果无剩余时间，则为空闲
                if (Utils.myTrim(isUsed) != "00") {
                  //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
                  if (interval < (app.data.isUsedInterval * 1000)) {
                    //设备已经在用
                    isUseStat = true;
                  }
                } else {
                  isUseStat = false;
                }
              }
            }

            let isHot = that.data.isHot,
              curFunction = that.data.curFunction,
              curPower = that.data.curPower,
              workStat = that.data.workStat;
            //是否杀菌 0：杀菌停止 ； 1：杀菌开启'
            try {
              isHot = parseInt(shajun);
              isHot = isNaN(isHot) ? 0 : isHot;
            } catch (e) {}
            //模式 01：正传 ， 02 : 反转 ；  03： 马达停止
            switch (mode) {
              case "01":
                curFunction = 1;
                break;
              case "02":
                curFunction = 2;
                break;
              case "03":
                curFunction = 3;
                break;
              case "04":
                curFunction = 4;
                break;
              case "05":
                curFunction = 5;
                break;
              case "06":
                curFunction = 6;
                break;
              case "07":
                curFunction = 7;
                break;
              case "08":
                curFunction = 8;
                break;
              case "09":
                curFunction = 9;
                break;
            }
            //强度
            try {
              curPower = parseInt(magnitude, 16);
              curPower = isNaN(curPower) ? 1 : curPower;
            } catch (e) {}
            dataObj = null;
            dataObj = {
              userId: userId,
              time: time,
              isUseStat: isUseStat,
              isHot: isHot,
              curFunction: curFunction,
              curPower: curPower,
            }
          }

          try {
            that.dowithGetSyncDeviceStatusInfo(dataObj, 1, operateTag, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetSyncDeviceStatusInfo(null, 0, operateTag, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取设备分页：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetSyncDeviceStatusInfo(null, 0, operateTag, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取设备分页接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：检测优惠劵是否在有效时段
  //返回结果：0正常，1活动尚未开始，2活动已过期
  checkCouponSetTimeValid:function(couponItem){
    let result=0,resultObj=null,vDtStartTimeStr="",vDtEndTimeStr="";
    let nowTime=new Date(),cDate=new Date(),nowDayStr="";
    let vSTimeStr="",vETimeStr="";

    if (Utils.isDBNotNull(couponItem.startTime)) {
      try {
        cDate = new Date(Date.parse((couponItem.startTime + "").replace(/-/g, "/")))
        vDtStartTimeStr = Utils.getDateTimeStr(cDate, "/", true);
      } catch (e) {}
    }
    if (Utils.isDBNotNull(couponItem.endTime)) {
      try {
        cDate = new Date(Date.parse((couponItem.endTime + "").replace(/-/g, "/")))
        vDtEndTimeStr = Utils.getDateTimeStr(cDate, "/", true);
      } catch (e) {}      
    }
    
    if(Utils.myTrim(vDtStartTimeStr) == '' || Utils.myTrim(vDtStartTimeStr) == ''){
      //如果未设置有效期
      result=0;
    }else{
      //如果设置有效期
      //获取今天的日期
      nowDayStr=Utils.getDateTimeStr3((new Date()),"/",1);
      //获取开始时段，结束时段
      let vDtSTimeStr="",vDtETimeStr="",arrayTemp = null;
      
      arrayTemp = vDtStartTimeStr.split(' ');
      vSTimeStr = arrayTemp.length >= 2 ? arrayTemp[1] : vSTimeStr;
      arrayTemp = null;
      arrayTemp = vDtEndTimeStr.split(' ');
      vETimeStr = arrayTemp.length >= 2 ? arrayTemp[1] : vETimeStr;

      //特别处理结束时间为0点的情况
      arrayTemp = null;
      arrayTemp = vETimeStr.split(':');
      if(arrayTemp.length >0 && arrayTemp[0]=="00"){
        vETimeStr="23:59:59"
      }

      //获取有效开始时间，有效结束时间
      vDtSTimeStr=nowDayStr + " " + vSTimeStr;
      vDtETimeStr=nowDayStr + " " + vETimeStr;
      if((new Date(vDtSTimeStr))>nowTime){
        //1。1 
        result = 1;
      }else if(nowTime>(new Date(vDtETimeStr))){
        result=2;
      }
    }

    resultObj={result:result,couponStartTime:vSTimeStr,couponEndTime:vETimeStr}
    return resultObj;
  },
  //方法：获取分成统计操作
  //说明：需要在所调用的页面实现处理方法dowithGetShareStatData(dataList, tag,errorInfo, pageIndex)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getShareStatData: function (mainObj, otherParams, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=lotteryActivityRecordList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取分成统计信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetShareStatData(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetShareStatData(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取分成统计：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetShareStatData(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取分成统计接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取分成统计操作
  //说明：需要在所调用的页面实现处理方法dowithGetShareStatData(dataList, tag,errorInfo, pageIndex)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  //operateTag：操作类型参数
  getShareStatData2: function (mainObj, otherParams,operateTag, pageSize, pageIndex) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=lotteryActivityRecordList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取分成统计信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetShareStatData2(res.data.data, 1,operateTag, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetShareStatData2(null, 0,operateTag, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取分成统计：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetShareStatData2(null, 0,operateTag, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取分成统计接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (mainObj, otherTag, dataList, tag, errorInfo, pageIndex, isFilterStatus) {
    let that = mainObj,
      app = this,
      noDataAlert = "暂无按摩订单信息！";
    try{
      wx.hideLoading();
    }catch(e){}
    
    try {
      that.data.isLoad = true;
    } catch (e) {}

    switch (tag) {
      case 1:
        console.log("获取按摩订单列表：")
        console.log(dataList);
        let cheirapsisCouponList = [],
          cheirapsisCouponCnt = 0,currentData=Utils.isNotNull(that.data.currentData)?that.data.currentData:-1;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let mainData = dataList,
            grade = 0,
            curId = 0,
            curItem = null,
            dataItem = null,
            listItem = null,
            rechargeItem = null,
            spareCheirapsisCnt = 0,isSureContinue=false;
          let id = 0,
            companyId = 0,
            lotteryActivityProductId = 0,
            lotteryProduct = 0,
            status = 0,
            payStatus = 0,
            productName = "",
            createDate = "",
            receiveDate="",
            endTime = "",
            useTime = "",
            duration = 0,
            mallCouponsId = 0,
            isUse = 0,
            type = 0,
            dtTemp = new Date(),
            dtCreate = new Date(),
            dtEnd = new Date(),
            dtDate = new Date(),
            dtNow = new Date(),
            isTimeOut = false,
            cashback_price = 0.00,
            userId = 0,
            shareUserId = 0,
            isCancelShare = 0,
            synCouponMpid = "",
            synCouponPrice = 0.00,
            synCouponName = "",remark="",premark="";
          for (let i = 0; i < mainData.dataList.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = mainData.dataList[i];isSureContinue=false;
            id = 0;
            companyId = 0;
            lotteryActivityProductId = 0;
            lotteryProduct = 0;
            productName = "";
            createDate = "";receiveDate="",
            endTime = "";
            duration = 0;
            mallCouponsId = 0;
            isUse = 0;
            type = 0;
            status = 1;
            isTimeOut = false;
            cashback_price = 0.00;
            payStatus = 0;
            useTime = "";
            userId = 0;
            shareUserId = 0;
            isCancelShare = 0;
            synCouponMpid = "";
            synCouponPrice = 0.00;
            synCouponName = "";remark="";premark="";
            id = dataItem.id;
            if (Utils.isNotNull(dataItem.remark) && Utils.myTrim(dataItem.remark + "") != "null")
              remark = Utils.myTrim(dataItem.remark);
            if (Utils.isNotNull(dataItem.premark) && Utils.myTrim(dataItem.premark + "") != "null")
              premark = Utils.myTrim(dataItem.premark);
            if (Utils.isNotNull(dataItem.synCouponMpid) && Utils.myTrim(dataItem.synCouponMpid + "") != "null")
              synCouponMpid = Utils.myTrim(dataItem.synCouponMpid);
            if (Utils.isNotNull(dataItem.synCouponName) && Utils.myTrim(dataItem.synCouponName + "") != "null")
              synCouponName = Utils.myTrim(dataItem.synCouponName);
            if (Utils.isNotNull(dataItem.synCouponPrice) && Utils.myTrim(dataItem.synCouponPrice + "") != "null") {
              try {
                synCouponPrice = parseFloat(dataItem.synCouponPrice);
                synCouponPrice = isNaN(synCouponPrice) ? 0.00 : synCouponPrice;
                synCouponPrice = parseFloat((synCouponPrice).toFixed(app.data.limitQPDecCnt));
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.companyId) && Utils.myTrim(dataItem.companyId + "") != "null") {
              try {
                companyId = parseInt(dataItem.companyId);
                companyId = isNaN(companyId) ? 0 : companyId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "null") {
              try {
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.shareUserId) && Utils.myTrim(dataItem.shareUserId + "") != "null") {
              try {
                shareUserId = parseInt(dataItem.shareUserId);
                shareUserId = isNaN(shareUserId) ? 0 : shareUserId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.isCancelShare) && Utils.myTrim(dataItem.isCancelShare + "") != "null") {
              try {
                isCancelShare = parseInt(dataItem.isCancelShare);
                isCancelShare = isNaN(isCancelShare) ? 0 : isCancelShare;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lotteryActivityProductId) && Utils.myTrim(dataItem.lotteryActivityProductId + "") != "null") {
              try {
                lotteryActivityProductId = parseInt(dataItem.lotteryActivityProductId);
                lotteryActivityProductId = isNaN(lotteryActivityProductId) ? 0 : lotteryActivityProductId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.cashback_price) && Utils.myTrim(dataItem.cashback_price + "") != "null") {
              try {
                cashback_price = parseFloat(dataItem.cashback_price);
                cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
                cashback_price = parseFloat((cashback_price).toFixed(app.data.limitQPDecCnt));
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
              try {
                lotteryProduct = parseInt(dataItem.lotteryProduct);
                lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
              try {
                status = parseInt(dataItem.status);
                status = isNaN(status) ? 1 : status;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.payStatus) && Utils.myTrim(dataItem.payStatus + "") != "null") {
              try {
                payStatus = parseInt(dataItem.payStatus);
                payStatus = isNaN(payStatus) ? 0 : payStatus;
              } catch (err) {}
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
            if (Utils.isNotNull(dataItem.createDate)) {
              try {
                dtCreate = new Date(Date.parse((dataItem.createDate + "").replace(/-/g, "/")))
              } catch (e) {
                dtCreate = new Date();
              }
              receiveDate = Utils.getDateTimeStr3(dtCreate, "-", 0);
            }

            if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
              try {
                duration = parseInt(dataItem.duration);
                duration = isNaN(duration) ? 0 : duration;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.mallCouponsId) && Utils.myTrim(dataItem.mallCouponsId + "") != "null") {
              try {
                mallCouponsId = parseInt(dataItem.mallCouponsId);
                mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.isUse) && Utils.myTrim(dataItem.isUse + "") != "null") {
              try {
                isUse = parseInt(dataItem.isUse);
                isUse = isNaN(isUse) ? 0 : isUse;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.useTime)) {
              try {
                dtTemp = new Date(Date.parse((dataItem.useTime + "").replace(/-/g, "/")))
              } catch (e) {
                dtTemp = new Date();
              }
              useTime = Utils.getDateTimeStr3(dtTemp, "-", 0);
            }
            if (Utils.isNotNull(dataItem.type) && Utils.myTrim(dataItem.type + "") != "null") {
              try {
                type = parseInt(dataItem.type);
                type = isNaN(type) ? 0 : type;
              } catch (err) {}
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

            //计算可用的按摩劵数量
            if(!isTimeOut && type != 0 && isUse== 0){
              if(lotteryProduct==5 && status==1) cheirapsisCouponCnt++;
              if(lotteryProduct!=5 && status==0) cheirapsisCouponCnt++;
            }
            if(currentData>-1){
              //如果不是“待赠送”
              switch(currentData){
                case 0:
                  if (isFilterStatus){
                    if(lotteryProduct!=5 && status==1) isSureContinue=true;
                  }
                  break;
                case 1:
                  if (isFilterStatus){
                    if(lotteryProduct!=5 && isUse==0 && status==0) isSureContinue=true;
                    if(lotteryProduct==5 && isUse==0 && (status==1 || status==0)) isSureContinue=true;
                  }
                  break;
                case 2:
                case 3:
                  if (isFilterStatus){
                    if(lotteryProduct!=5 && status==1) isSureContinue=true;
                    if(lotteryProduct==5 && status==0) isSureContinue=true;
                  }
                  break;
              }
            }else{
              //如果为无效抽奖记录则跳过
              if (isFilterStatus && status == 1) continue;
            }
            if(isSureContinue) continue;

            if (type == 0 && (mallCouponsId > 0 || duration > 0)) type = 1;
            productName = Utils.myTrim(productName) == "" && type == 4 ? "充值抽奖" : productName;
            productName = Utils.myTrim(productName) == "" ? (lotteryProduct == 1 ? '付费按摩' + duration + '分钟' : (lotteryProduct == -1 ? '充值抽奖' : productName)) : productName;

            if(Utils.myTrim(premark)==""){
              if(duration>0 && mallCouponsId==0)premark="足底按摩劵";
              if(duration==0 && mallCouponsId>0)premark="抵扣劵";
              if(duration>0 && mallCouponsId>0)premark="按摩+优惠劵";
            }
            listItem = {
              id: id,
              companyId: companyId,
              lotteryActivityProductId: lotteryActivityProductId,
              lotteryProduct: lotteryProduct,
              productName: productName,
              createDate: createDate,receiveDate:receiveDate,
              endTime: endTime,
              useTime: useTime,
              duration: duration,
              mallCouponsId: mallCouponsId,
              isUse: isUse,
              status: status,
              type: type,
              cashback_price: cashback_price,
              payStatus: payStatus,
              userId: userId,
              shareUserId: shareUserId,
              isCancelShare: isCancelShare,
              synCouponMpid: synCouponMpid,
              synCouponPrice: synCouponPrice,
              synCouponName: synCouponName,remark:remark,premark:premark,isTimeOut:isTimeOut,
            }
            if (!isFilterStatus && !isTimeOut) {
              //【1】不做过滤，则将未过期的记录插入集合
              cheirapsisCouponList.push(listItem);
            } else {
              if (Utils.isNotNull(that.data.currentData) && that.data.currentData == 1) {
                //【2】如果取已使用按摩劵，则将抽奖未中奖的记录排除
                //（type：0没有奖项1有优惠卷2按摩3优惠卷和按摩4购买充值抽奖记录）
                if (type != 0) {
                  cheirapsisCouponList.push(listItem);
                }
              } else {
                //【3】否则插入非抽奖未中、非过期、非已使用记录
                if (type != 0 && !isTimeOut && isUse == 0) {
                  cheirapsisCouponList.push(listItem);
                }
              }
            }
          }
          if (Utils.isNull(that.data.currentData) || that.data.currentData == 0) app.data.cheirapsisCouponList = cheirapsisCouponList;
        }
        switch (otherTag) {
          case 1:
            that.setData({
              ["cheirapsisCouponCnt"]: cheirapsisCouponCnt,
            })
            break;
          default:
            that.setData({
              ["drawAwardRecordList"]: cheirapsisCouponList,
            })
            console.log(cheirapsisCouponList)
            break;
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无信息！";
        break;
    }
  },
  //方法：获取按摩记录
  //说明：需要在所调用的页面实现处理方法dowithGetCheirapsisDataList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getCheirapsisDataList: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=product_coupons&action=QueryAmCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取按摩记录信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetCheirapsisDataList(res.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetCheirapsisDataList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取按摩记录：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetCheirapsisDataList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取按摩记录接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //---------------------按摩劵相关----------------------------------------------------------
  //方法：获取组合劵记录
  //说明：需要在所调用的页面实现处理方法dowithGetSynCouponList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getSynCouponList: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityProduct&action=huodongProductList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取组合劵记录信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetSynCouponList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetSynCouponList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取组合劵记录：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetSynCouponList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取组合劵记录接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：通用查询组合劵是否可用
  //说明：需要在所调用的页面实现处理方法dowithCheckComCheirapsisCouponEnable(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //cid：劵ID
  //otherParams：其他参数
  checkComCheirapsisCouponEnable: function (mainObj, cid, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=checkCouponsCount&productId=" + cid + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询组合劵是否可用信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithCheckComCheirapsisCouponEnable(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithCheckComCheirapsisCouponEnable(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "查询组合劵是否可用：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithCheckComCheirapsisCouponEnable(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "查询组合劵是否可用接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：查询组合劵是否可用
  //说明：需要在所调用的页面实现处理方法dowithCheckSynCouponEnable(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //cid：劵ID
  //otherParams：其他参数
  checkSynCouponEnable: function (mainObj, cid, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=getChanceCount&productId=" + cid + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询组合劵是否可用信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithCheckSynCouponEnable(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithCheckSynCouponEnable(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "查询组合劵是否可用：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithCheckSynCouponEnable(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "查询组合劵是否可用接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },

  //方法：获取商品送按摩劵记录
  //说明：需要在所调用的页面实现处理方法dowithGetProductCheirapsisCouponList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数
  getProductCheirapsisCouponList: function (mainObj,otherParams) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=SaveZFLotteryActivityRecord&userId="+appUserInfo.userId+"&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取商品送劵记录信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetProductCheirapsisCouponList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetProductCheirapsisCouponList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取商品送劵记录：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetProductCheirapsisCouponList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取商品送劵记录接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },

  //方法：获取我的余额
  //说明：需要在所调用的页面实现处理方法dowithGetMyRemainingSum(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  getMyRemainingSum: function (mainObj) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=redEnvelope_changePurse&action=changePurseSurplus&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamCon + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取我的余额信息:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMyRemainingSum(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetMyRemainingSum(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取我的余额：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMyRemainingSum(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取我的余额接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取sessionKey
  //说明：需要在所调用的页面实现处理方法dowithGetWechatSessionKey(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //otherParams：其他参数（包括：xcxAppId，js_code）
  getWechatSessionKey: function (mainObj, otherParams) {
    let that = mainObj,
      app = this;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=main_user&action=getSessionkey&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("Session 获取结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetWechatSessionKey(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetWechatSessionKey(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "Session获取：出错：" + res.data.rspMsg, URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetWechatSessionKey(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "Session获取接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //-------会员相关-------------------------------------------------------------------------
  //方法：获取会员套餐列表
  //说明：调用页面需要实现结果处理方法dowithGetMemberFeeItemList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  getMemberFeeItemList: function (mainObj) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=memberList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('会员套餐列表：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取会员套餐列表结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMemberFeeItemList(res.data.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          try {
            that.dowithGetMemberFeeItemList(null, 0, res.data.rspMsg);
          } catch (e) { console.log(e) }
          app.setErrorMsg2(that, "获取会员套餐列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMemberFeeItemList(null, 0, JSON.stringify(err));
        } catch (e) { console.log(e) }
        app.setErrorMsg2(that, "获取会员套餐接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：根据公共充值免单列表和订单金额获取免单充值项
  getProductFreeRCItemList:function(mainObj,freeRCItemListName,amount){
    let that=mainObj,app=this;
    let freeOrderRCRankList=app.data.freeOrderRCRankList,valueList=[];
    if(amount>0.00 && Utils.isNotNull(freeOrderRCRankList) && freeOrderRCRankList.length>0){
      freeOrderRCRankList=freeOrderRCRankList.sort(app.compareAsc("discount"));
      console.log(freeOrderRCRankList)
      for(let i=0;i<freeOrderRCRankList.length;i++){
        if(amount<freeOrderRCRankList[i].discount){
          valueList.push(freeOrderRCRankList[i]);
          break;
        }
      }
      that.setData({
        [freeRCItemListName]: valueList,
      })
    }
    that.setData({
      [freeRCItemListName]: valueList,
    })
  },
  //方法：领取充值福利
  //说明：调用页面需要实现结果处理方法dowithReceiveRechargeWelfareInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  receiveRechargeWelfareInfo: function (mainObj,couponId,count) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_mallActivityCoupons&action=saveMallActivityCoupons&userId=" + appUserInfo.userId + "&couponid=" + couponId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&count=" + count + "&sign=" + sign;
    console.log('领取充值福利：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('领取充值福利结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithReceiveRechargeWelfareInfo(res.data.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          try {
            that.dowithReceiveRechargeWelfareInfo(null, 0, res.data.rspMsg);
          } catch (e) { console.log(e) }
          app.setErrorMsg2(that, "领取充值福利：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithReceiveRechargeWelfareInfo(null, 0, JSON.stringify(err));
        } catch (e) { console.log(e) }
        app.setErrorMsg2(that, "领取充值福利接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取会员充值详情信息
  //说明：调用页面需要实现结果处理方法dowithGetMemberRechargeDetail(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  getMemberRechargeDetail: function (mainObj,userId,otherParams,pageSize,pageIndex) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=uIntegralList&appId=" + app.data.appid + "&userId=" + userId + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取会员充值详情：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取会员充值详情结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMemberRechargeDetail(res.data.data, 1, "", pageIndex);
          } catch (e) { console.log(e) }
        } else {
          try {
            that.dowithGetMemberRechargeDetail(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) { console.log(e) }
          app.setErrorMsg2(that, "获取会员充值详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMemberRechargeDetail(null, 0, JSON.stringify(err), pageIndex);
        } catch (e) { console.log(e) }
        app.setErrorMsg2(that, "获取会员充值详情接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：更新会员充值详情信息
  //说明：调用页面需要实现结果处理方法dowithSaveMemberRechargeDetail(dataList,tag,operateTag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  saveMemberRechargeDetail: function (mainObj,userId,orderId,otherParams,operateTag) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=saveUIntegral&userId="+userId + "&orderId=" + orderId+"&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('保存会员充值详情：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('保存会员充值详情结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithSaveMemberRechargeDetail(res.data.data, 1,operateTag, "");
          } catch (e) { console.log(e) }
        } else {
          try {
            that.dowithSaveMemberRechargeDetail(null, 0,operateTag, res.data.rspMsg);
          } catch (e) { console.log(e) }
          app.setErrorMsg2(that, "保存会员充值详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithSaveMemberRechargeDetail(null, 0,operateTag, JSON.stringify(err));
        } catch (e) { console.log(e) }
        app.setErrorMsg2(that, "保存会员充值详情接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取用户信息
  //说明：调用页面需要实现结果处理方法dowithGetUserPersonInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  getUserPersonInfo: function (mainObj,userId) {
    let that = mainObj,app = this;
    let URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "cls=main_user&action=userDetail&id=" + userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log("获取用户信息:"+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取用户信息：", res.data)
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetUserPersonInfo(res.data.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          try {
            that.dowithGetUserPersonInfo(null, 0, res.data.rspMsg);
          } catch (e) { console.log(e) }
          app.setErrorMsg2(that, "获取用户信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          that.dowithGetUserPersonInfo(null, 0, JSON.stringify(err));
        } catch (e) { console.log(e) }
        app.setErrorMsg2(that, "获取用户信息接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  /**
   * json对象数组按照某个属性排序:降序排列
   * @param {Object} propertyName
   */
  compareDesc(propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if(value2 < value1) {
        return -1;
      } else if(value2 > value1) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  /**
   * json对象数组按照某个属性排序:升序排列
   * @param {Object} propertyName
   */
  compareAsc(propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if(value2 < value1) {
        return 1;
      } else if(value2 > value1) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  /**
   * 处理手机号隐私，打*
   */
  phoneHide: function (phone) {
    var mobile = phone.substring(0, 3) + '****' + phone.substring(7);
    return mobile;
  },

  //方法：缓存平台账户信息
  setSysUserAccountInfo:function(){
    let app=this,accountObj=null,firstCompanyId=0;

    if (Utils.myTrim(app.data.accountCompanyIdList)){
      let comArray=app.data.accountCompanyIdList.split(",");
      if(comArray.length>0){
        try{
          firstCompanyId=parseInt(comArray[0]);
          firstCompanyId=isNaN(firstCompanyId)?0:firstCompanyId;
        }catch(e){}
      }
    }
    accountObj={
      user_roleId:app.data.user_roleId,
      accountRecordId:app.data.accountRecordId,
      accountUserName:app.data.accountUserName,
      accountUserPWD:app.data.accountUserPWD,
      accountBindUserId:app.data.accountBindUserId,
      accountCompanyIdList:app.data.accountCompanyIdList,
      firstCompanyId:firstCompanyId,
    }
    app.setCacheValue("sysAccountInfo" + app.data.version + '_' + app.data.wxAppId,accountObj);
  },
  //方法：获取缓存平台账户信息
  getSysUserAccountInfo:function(){
    let app=this,accountObj=null;
    try{
      accountObj=app.getCacheValue("sysAccountInfo" + app.data.version + '_' + app.data.wxAppId,accountObj);
    }catch(e){}
    if(Utils.isNotNull(accountObj)){
      app.data.user_roleId = accountObj.user_roleId;
      app.data.accountRecordId = accountObj.accountRecordId;
      app.data.accountUserName = accountObj.accountUserName;
      app.data.accountUserPWD = accountObj.accountUserPWD;
      app.data.accountBindUserId=accountObj.accountBindUserId;
      app.data.accountCompanyIdList = accountObj.accountCompanyIdList;
      app.data.agentCompanyId = app.data.agentCompanyId <= 0 && accountObj.firstCompanyId>0 ? accountObj.firstCompanyId : app.data.agentCompanyId;
    }
  },
  //方法：获取缓存值
  getCacheValue: function (key) {
    var result = null;
    try {
      result = wx.getStorageSync(key)
    } catch (e) {}

    return result;
  },
  //方法：设置缓存值
  setCacheValue: function (key, value) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {}
  },
  //方法：清除缓存值
  clearCacheValue: function (key) {
    var result = null;
    try {
      result = wx.removeStorageSync(key)
    } catch (e) {}

    return result;
  },
  //方法：检测蓝牙是否开启
  checkBluetoothState: function () {
    let app = this;
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log("蓝牙初始化 openBluetoothAdapter succed:")
          console.log(res)
          /* 获取本机的蓝牙状态 */
          setTimeout(() => {
            app.getBluetoothAdapterState()
          }, 1000)
        },
        fail: function (err) {
          // 初始化失败
          console.log("蓝牙初始化 openBluetoothAdapter fail:")
          console.log(err)
          wx.showModal({
            title: '温馨提示',
            content: '请检测蓝牙状态是否开启。如蓝牙未开，请打开蓝牙！',
            showCancel: false
          })
        }
      })
    } else {
      wx.showToast({
        title: "微信版本过低，无法使用蓝牙！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //查看蓝牙是否开启
  getBluetoothAdapterState: function () {
    var openBiluetooth = false
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log("蓝牙检测结果 getBluetoothAdapterState：")
        console.log(res);
        var available = res.available;
        if (!available) {
          wx.showModal({
            title: '温馨提示',
            content: '请检测蓝牙状态是否开启。如蓝牙未开，请打开蓝牙！',
            showCancel: false
          })
          openBiluetooth = false
        } else {
          openBiluetooth = true
        }
      },
      fail: function (err) {
        console.log("蓝牙检测失败结果：");
        console.log(err);
        wx.showModal({
          title: '温馨提示',
          content: '请检测手机蓝牙是否开启,Android6.0系统以上的手机必须打开定位功能',
          showCancel: false
        })
        openBiluetooth = false
      }
    })
    return openBiluetooth
  },
  //方法：跳转页面
  //pageLayer：页面所处层级，例如：../../
  //isCheckAuditStat：0不检查审核，1检查审核
  //pagetype：0普通页面，1tabbar页面
  //packageName：包名简写
  //pagename：页面名称
  //agentAuditState：1已通过审核，0未通过审核
  gotoPage: function (mainObj, pageLayer, isCheckAuditStat, pagetype, packageName, pagename, agentAuditState, param) {
    //pagetype：0普通页面，1tabbar页面
    //packageName：包名简写
    //pagename：页面名称
    let that = mainObj,
      app = this,
      url = "";
    if (isCheckAuditStat == 1 && agentAuditState != 1) {
      wx.showToast({
        title: '未通过审核，无法使用该功能！',
        icon: "none",
        duration: 2000,
      })
      return;
    }
    if (Utils.isNull(param)) {
      param = ""
    }
    switch (packageName) {
      case "commercial":
        url = pageLayer + packComPageUrl + "/" + pagename + "/" + pagename + param
        break;
      case "other":
        url = pageLayer + packOtherPageUrl + "/" + pagename + "/" + pagename + param
        break;
      case "small":
        url = pageLayer + packSMPageUrl + "/" + pagename + "/" + pagename + param
        break;
      case "yk":
        url = pageLayer + packYKPageUrl + "/" + pagename + "/" + pagename + param
        break;
      case "vp":
        url = pageLayer + packVPPageUrl + "/" + pagename + "/" + pagename + param
        break;
      case "temp":
        url = pageLayer + packTempPageUrl + "/" + pagename + "/" + pagename + param
        break;
      default:
        url = pageLayer + packMainPageUrl + "/" + pagename + "/" + pagename
        break;
    }

    console.log("gotoPage:" + url)
    switch (pagetype) {
      case 1:
        wx.switchTab({
          url: url
        });
        break;
      default:
        wx.navigateTo({
          url: url
        });
        break;
    }
  },
  //事件：跳转页面
  gotoCommonPageEvent:function(mainObj,e){
    let that=mainObj,app=this,packageName="",page="",otherparams="",pagetype=0;
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
    try {
      otherparams = Utils.myTrim(e.currentTarget.dataset.otherparams);
    } catch (e) {}
    app.gotoCommonPage(that,packageName,page,pagetype,otherparams);
  },
  //方法：跳转页面
  //参数说明：
  //mainObj：调用页面主体
  //packageName：页面所在分包名称
  //pageName：页面名称
  //pageType：0 navigateTo调用，1 switchTab调用，2 redirectTo调用，其他reLaunch调用
  //params：页面加载参数字符串
  gotoCommonPage:function(mainObj,packageName,pageName,pageType,params){
    let that=mainObj,app=this,url="";

    url="/pages/"+pageName+"/"+pageName;
    url=Utils.myTrim(packageName)!=""?"/"+packageName+url:url;
    if(Utils.myTrim(params)!="" && params.length>0){
      params=params.substr(0,1)=="&"?params.substr(1):params;
      url+="?"+params;
    }
    url+=Utils.myTrim(params)!=""?"?"+params:"";
    switch (pageType) {
      case 0:
        wx.navigateTo({
          url: url
        });
        break;
      case 1:
        wx.switchTab({
          url: url
        });
        break;
      case 2:
        wx.redirectTo({
          url: url
        });
        break;
      default:
        wx.reLaunch({
          url: url
        });
        break;
    }
  },
  //方法：统一跳转原页面
  //参数说明：
  //mainObj：调用页面主体
  gotoBackRegPage:function(mainObj){
    let that=mainObj,app=this,curPageDataOptions=app.data.curPageDataOptions;
    if(Utils.isNotNull(curPageDataOptions)){
      let url= "",params="",pageType=0;
      url=Utils.isNull(curPageDataOptions.package)?curPageDataOptions.page:"/"+curPageDataOptions.package+curPageDataOptions.page;
      params=Utils.isNotNull(curPageDataOptions.options)?Utils.jsonToUrl(curPageDataOptions.options):"";
      url+=Utils.myTrim(params) != ''?"?"+params:"";
      pageType=Utils.isNotNull(curPageDataOptions.pageType)?curPageDataOptions.pageType:0;
      
      switch (pageType) {
        case 0:
          wx.redirectTo({
            url: url
          })
          break;
        case 1:
          wx.switchTab({
            url: url
          });
          break;
        default:
          wx.reLaunch({
            url: url
          });
          break;
      }
    }
  },
  //方法：分析设备二维码
  //tag：0获取可用二维码，1获取全部二维码
  getDeviceAddressByQRCode: function (qrResult, tag) {
    let app = this,
      result = null,
      deviceAddress = "",
      jsonObj = null;
    //通讯类型：0 蓝牙；1 GPRS；
    switch (app.data.communicationType) {
      case 0:
        let qrCodeObj = null,
          osTag = 0;

        try {
          qrCodeObj = JSON.parse(qrResult);
        } catch (e) {}
        osTag = Utils.isNotNull(app.data.currentOS) && app.data.currentOS.osTag >= 1 ? app.data.currentOS.osTag : 1;
        if (Utils.isNotNull(qrCodeObj)) {
          if (tag == 0) {
            //获取单个地址
            switch (osTag) {
              case 1:
                deviceAddress = Utils.isNotNull(qrCodeObj.android) ? qrCodeObj.android : "";
                break;
              case 2:
                deviceAddress = Utils.isNotNull(qrCodeObj.ios) ? qrCodeObj.ios : "";
                break;
            }
            result = deviceAddress;
          } else {
            //获取所有地址
            result = {
              bluetoothAddress: Utils.isNotNull(qrCodeObj.android) ? qrCodeObj.android : "",
              iosBluetoothAddress: Utils.isNotNull(qrCodeObj.ios) ? qrCodeObj.ios : "",
            }
          }
        }
        break;

      case 1:
        deviceAddress = qrResult + "";
        if (tag == 0) {
          //获取单个地址
          result = deviceAddress;
        } else {
          //获取所有地址
          result = {
            gprsAddress: deviceAddress,
          }
        }
        break;
    }
    return result;
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  //------------GPRS设备控制--------------------------------------------------------------------
  //方法：生成一个区间随机数  最大Max  最小Min
  getSectionRandomNumber: function (Min, Max) {
    let result = "";
    let Range = Max - Min;
    let Rand = Math.random();
    let sequenceNumber = Min + Math.round(Rand * Range); //四舍五入

    sequenceNumber++;
    //console.log("获取一个随机数", sequenceNumber)
    //console.log("获取一个随机数16进制", sequenceNumber.toString(16))
    result = sequenceNumber.toString(16);
    result = result.length > 2 ? result.substr(0, 2) : result;
    //console.log("获取一个随机数16进制", result)
    return result.toUpperCase();
  },
  connectWebSocket: function (mainObj) {
    let that = mainObj,
      app = this;
    try {
      if (Utils.isNull(WebSocket)) {
        WebSocket = require('websocket/connect.js');
      }
      if (Utils.isNull(MsgReceived)) {
        MsgReceived = require('websocket/msgHandler.js');
      }
      WebSocket.setReceiveCallback(MsgReceived, that);
      WebSocket.connect();
    } catch (e) {}
  },
  closeWebSocket: function () {
    try {
      WebSocket.close();
    } catch (e) {
      console.log("WebSocket Close err:")
      console.log(e)
    }
  },
  //4G模块控制
  //方法：4G指令发送方法
  //设备地址address  各种模式cmd  cmd对应的指令controlCmdType  时间time
  //isPushQueue:是否将指令插入队列
  sendDeviceCommandWebSocket: function (mainObj, address, cmd, controlCmdType, time, isPushQueue, oldNum) {
    let that = mainObj,
      app = this,
      appUserInfo = app.globalData.userInfo,
      cb62StartTag = 0;
    if (Utils.isNull(WebSocket)) {
      WebSocket = require('websocket/connect.js');
    }
    if (Utils.isNull(MsgReceived)) {
      MsgReceived = require('websocket/msgHandler.js');
    }
    try {
      cb62StartTag = that.data.cb62StartTag;
    } catch (e) {}
    if (cmd == "CB51") {
      if (that.data.cb51StartTag != 4) {
        wx.showLoading({
          title: '查询状态',
        })
      }
    } else {
      if (cb62StartTag == 0) {
        wx.showLoading({
          title: '控制设备',
        })
      }
    }

    //WebSocket指令操控
    let protocol = "",
      num = !isPushQueue && Utils.isNotNull(oldNum) ? oldNum : app.getSectionRandomNumber(16, 255) + app.getSectionRandomNumber(16, 255);
    if (time != undefined && time != null) {
      protocol = time.toString(16).toUpperCase()
      if (protocol.length == 1) {
        protocol = "000" + time.toString(16).toUpperCase()
      }
      if (protocol.length == 2) {
        protocol = "00" + time.toString(16).toUpperCase()
      }
      if (protocol.length == 3) {
        protocol = "0" + time.toString(16).toUpperCase()
      }
    }
    let sendCmdObj = {
      "from": appUserInfo.userId + "",
      "to": address,
      "cmd": cmd,
      "num": num,
      "cmdType": controlCmdType,
      "protocol": protocol,
      "type": 1,
      "content": "",
      "tips": ""
    }
    if (app.data.socketOpened) {
      sendGPRSCmdCnt = 0;

      // if (isPushQueue) {
      //   that.data.socketMsgQueue.push({
      //     dateTime: new Date(),
      //     reTryCnt: 0,
      //     time: time,
      //     cmdObj: sendCmdObj
      //   });
      // }

      WebSocket.send(sendCmdObj);
    } else {
      if (sendGPRSCmdCnt < 5) {
        console.log('发送接口失败(' + sendGPRSCmdCnt + ")")
        try {
          WebSocket.close();
        } catch (e) {}
        WebSocket.setReceiveCallback(MsgReceived, that);
        WebSocket.connect();
        setTimeout(function () {
          sendGPRSCmdCnt++;
          app.sendDeviceCommandWebSocket(mainObj, address, cmd, controlCmdType, time, isPushQueue, oldNum);
        }, 500);
      } else {
        wx.hideLoading()
        sendGPRSCmdCnt = 0;
        try {
          if (Utils.isNotNull(that.data.cb62StartTag))
            that.data.cb62StartTag == 0;

          if (Utils.isNotNull(that.data.isStartQuickly) && that.data.isStartQuickly == 1 && Utils.myTrim(cmd) == "CB60") {
            that.setData({
              ["isStartQuickly"]: 0
            })
          }
          if (Utils.isNotNull(that.data.isSCmdOperating)) {
            that.setData({
              ["isSCmdOperating"]: false,
            })
          }
        } catch (e) {}

        wx.showToast({
          title: '网络异常！',
          icon: "none",
          duration: 2000
        })
        console.log('网络异常');
      }
    }
  },
  //方法：发送GPRS命令
  //说明：需要在所调用的页面实现处理方法dowithSendDeviceGprsCmd(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     sendObj：参数信息
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //address：设备地址
  //cmd：命令
  //time：同步时间
  sendDeviceGprsCmd: function (mainObj, address, cmd, controlCmdType, time) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let num = app.getSectionRandomNumber(16, 255) + app.getSectionRandomNumber(16, 255);
    let sendObj = {
      address: address,
      cmd: cmd,
      controlCmdType: controlCmdType,
      time: time,
      num: num,
    }
    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "",
      protocol = ""
    urlParam = "cls=main_devicesControlStatus&action=saveDevicesControlStatus&userId=" + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    //console.log('sign:' + urlParam + "&key=" + KEY)
    if (time != undefined && time != null) {
      protocol = time.toString(16).toUpperCase()
      if (protocol.length == 1) {
        protocol = "000" + time.toString(16).toUpperCase()
      }
      if (protocol.length == 2) {
        protocol = "00" + time.toString(16).toUpperCase()
      }
      if (protocol.length == 3) {
        protocol = "0" + time.toString(16).toUpperCase()
      }
    }
    let id = 0,
      userId = appUserInfo.userId,
      reCount = 0,
      status = 0,
      deviceAddress = address

    let datajson = {
      "id": id,
      "userId": userId,
      "reCount": reCount,
      "status": status,
      "deviceAddress": deviceAddress,
      "cmd": cmd,
      "num": num,
      "cmdType": controlCmdType,
      "protocol": protocol,
    }
    urlParam = urlParam + "&sign=" + sign + "&datajson=" + JSON.stringify(datajson);
    //console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        //console.log("4G指令发送结果：", res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithSendDeviceGprsCmd(res.data.data, 1, sendObj, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithSendDeviceGprsCmd(null, 0, sendObj, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          //设备控制错误是否写数据库错误日志
          if (app.data.isWriteDBError) {
            app.setErrorMsg2(that, "4G指令发送出错：出错：" + JSON.stringify(res), URL + urlParam, false);
          }
        }
      },
      fail: function (err) {
        try {
          that.dowithSendDeviceGprsCmd(null, 0, sendObj, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        //设备控制错误是否写数据库错误日志
        if (app.data.isWriteDBError) {
          app.setErrorMsg2(that, "4G指令发送接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        }
      }
    })
  },
  //方法：获取GPRS命令状态
  //说明：需要在所调用的页面实现处理方法dowithGetDeviceGprsCmdStatus(dataList, tag,sendObj,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     sendObj：参数信息
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //address：设备地址
  //cmd：命令
  //time：同步时间
  getDeviceGprsCmdStatus: function (mainObj, address, cmd, controlCmdType, num, repetitionsNumber) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let sendObj = {
      address: address,
      cmd: cmd,
      controlCmdType: controlCmdType,
      num: num,
      repetitionsNumber: repetitionsNumber,
    }

    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = ""
    urlParam = "cls=main_devicesControlStatus&action=devicesControlStatusList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    //console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&sign=" + sign +
      "&cmd=" + cmd + "&num=" + num + "&cmdType=" + controlCmdType + "&deviceAddress=" + address;
    //console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        //console.log("指令状态查询接口", res);
        if (res.data.rspCode == 0) { //成功
          try {
            that.dowithGetDeviceGprsCmdStatus(res.data.data, 1, sendObj, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDeviceGprsCmdStatus(null, 0, sendObj, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          //设备控制错误是否写数据库错误日志
          if (app.data.isWriteDBError) {
            app.setErrorMsg2(that, "指令状态查询出错：出错：" + JSON.stringify(res), URL + urlParam, false);
          }
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDeviceGprsCmdStatus(null, 0, sendObj, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        //设备控制错误是否写数据库错误日志
        if (app.data.isWriteDBError) {
          app.setErrorMsg2(that, "指令状态查询接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        }
      }
    })
  },
  //方法：获取设备状态
  //说明：需要在所调用的页面实现处理方法dowithGetDeviceStatus(dataList, tag,sendObj,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     sendObj：参数信息
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //address：设备地址
  //cmd：命令
  //time：同步时间
  getDeviceStatus: function (mainObj, address, cmd, controlCmdType, num) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;
    let sendObj = {
      address: address,
      cmd: cmd,
      controlCmdType: controlCmdType,
      num: num,
    }

    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = ""
    urlParam = "cls=main_devices&action=devicesStatus&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    //console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&deviceAddress=" + address + "&pageSize=99&pageIndex=1&sign=" + sign;
    //console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("设备状态查询接口", res)
        if (res.data.rspCode == 0) { //成功
          try {
            that.dowithGetDeviceStatus(res.data.data, 1, sendObj, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDeviceStatus(null, 0, sendObj, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          //设备控制错误是否写数据库错误日志
          if (app.data.isWriteDBError) {
            app.setErrorMsg2(that, "设备状态查询出错：出错：" + JSON.stringify(res), URL + urlParam, false);
          }
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDeviceStatus(null, 0, sendObj, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        //设备控制错误是否写数据库错误日志
        if (app.data.isWriteDBError) {
          app.setErrorMsg2(that, "设备状态查询接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        }
      }
    })
  },
  //方法：插入零钱记录
  //说明：需要在所调用的页面实现处理方法dowithInsertWalletRecordByAward(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //money：金额
  //recordId：抽奖记录ID
  insertWalletRecordByAward: function (mainObj, money, recordId) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.smurl,
      KEY = app.getUrlAndKey.key;

    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=product_activity&action=UserMoneyRecord&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId + "&trade_no=" + recordId;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&type=15&money=" + money + "&mode=a&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("抽奖返现接口", res)
        if (res.data.rspCode == 0) { //成功
          try {
            that.dowithInsertWalletRecordByAward(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithInsertWalletRecordByAward(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          //设备控制错误是否写数据库错误日志
          if (app.data.isWriteDBError) {
            app.setErrorMsg2(that, "抽奖返现出错：错误：" + JSON.stringify(res), URL + urlParam, false);
          }
        }
      },
      fail: function (err) {
        try {
          that.dowithInsertWalletRecordByAward(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "抽奖返现接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：插入零钱记录
  //说明：需要在所调用的页面实现处理方法dowithGetDeviceSrvPriceList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //money：金额
  //recordId：抽奖记录ID
  getDeviceSrvPriceList: function (mainObj, otherParamList) {
    let that = mainObj,
      app = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key;

    let appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "";
    urlParam = "cls=main_deviceServicePrice&action=QueryProductPrice&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY)
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParamList + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("价格获取接口", res)
        if (res.data.rspCode == 0) { //成功
          try {
            that.dowithGetDeviceSrvPriceList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetDeviceSrvPriceList(null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          //设备控制错误是否写数据库错误日志
          if (app.data.isWriteDBError) {
            app.setErrorMsg2(that, "价格获取出错：错误：" + JSON.stringify(res), URL + urlParam, false);
          }
        }
      },
      fail: function (err) {
        try {
          that.dowithGetDeviceSrvPriceList(null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg2(that, "价格获取接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //-----------------------获取tabbar导航条信息-------------------------------------------------------------
  //方法：获取tabbar导航条信息
  //说明：需要在所调用的页面实现处理方法dowithGetTabBarList(dataList, tag,errorInfo)
  //     dataList：返回的直播列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数说明：
  //mainObj：调用页面主体
  //companyId：设备所属公司ID
  //isInsistGet：是否无论导航条存在都继续获取导航条信息
  getTabBarList: function (mainObj, companyId, isInsistGet) {
    let that = mainObj,
      app = this;

    if ((Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) && !isInsistGet) {
      return;
    }

    let URL = app.getUrlAndKey.url,
      KEY = app.getUrlAndKey.key,
      DataURL = app.getUrlAndKey.dataUrl;

    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "cls=main_navMenu&action=navMenuList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&companyMsgId=" + companyId + "&sign=" + sign;
    console.log("获取导航条接口：")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            app.dowithGetTabBarList(that, res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            app.dowithGetTabBarList(that, null, 0, res.data.rspMsg);
          } catch (e) {
            console.log(e)
          }
          app.setErrorMsg2(that, "获取导航条：出错：" + res.data.rspMsg, URL + urlParam, false)
        }
      },
      fail: function (err) {
        try {
          app.dowithGetTabBarList(that, null, 0, JSON.stringify(err));
        } catch (e) {
          console.log(e)
        }
        app.setErrorMsg(that, "获取导航条接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  dowithGetTabBarList: function (mainObj, dataList, tag, errorInfo) {
    let that = mainObj,
      app = this,
      tabItemList = [];
    switch (tag) {
      case 1:
        console.log("获取导航条结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let dataItem = null;
          for (var i = 0; i < dataList.dataList.length; i++) {
            dataItem = null;
            dataItem = dataList.dataList[i];
            if (dataItem.title != null && dataItem.title != undefined && Utils.myTrim(dataItem.title + "") != "")
              tabItemList.push(dataItem.title);
          }
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取导航条失败！";
        break;
    }
    app.globalData.tabBarList = [];
    if (Utils.isNotNull(app.globalData.sourceTabBarList) && app.globalData.sourceTabBarList.length > 0) {
      if (Utils.isNotNull(tabItemList) && tabItemList.length > 0) {
        for (let m = 0; m < tabItemList.length; m++) {
          for (let i = 0; i < app.globalData.sourceTabBarList.length; i++) {
            if (Utils.myTrim(app.globalData.sourceTabBarList[i].text) == Utils.myTrim(tabItemList[m])) {
              app.globalData.tabBarList.push(app.globalData.sourceTabBarList[i]);
              break;
            }
          }
        }
      } else {
        for (let i = 0; i < app.globalData.sourceTabBarList.length; i++) {
          app.globalData.tabBarList.push(app.globalData.sourceTabBarList[i]);
        }
      }
    }
    try {
      if (Utils.isNotNull(mainObj)) {
        mainObj.dowithGetTabBarList()
      }
    } catch (e) {}
  },
  setTabBarSelIndex: function (mainObj) {
    let that = mainObj,
      app = this,
      selected = 0,
      curUrl = "";
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象

    curUrl = Utils.myTrim(currentPage.route);
    console.log("当前页面路径：" + curUrl)

    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0 && curUrl != "") {
      for (let i = 0; i < app.globalData.tabBarList.length; i++) {
        if (app.globalData.tabBarList[i].pagePath.indexOf(curUrl) >= 0) {
          selected = i;
          break;
        }
      }
    }

    if (typeof that.getTabBar === 'function' && that.getTabBar()) {
      let tabBar = that.getTabBar();
      if (Utils.isNotNull(tabBar)) {
        if ((Utils.isNull(tabBar.data.list) || tabBar.data.list.length <= 0) && app.globalData.tabBarList.length > 0) {
          tabBar.setData({
            list: app.globalData.tabBarList,
            selected: selected //设置当前跳转页在tabbar中所在的索引位置
          })
        } else {
          tabBar.setData({
            selected: selected //设置当前跳转页在tabbar中所在的索引位置
          })
        }
      }
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //--------------------------拼团部分-----------------------------------------------------------------
  //方法：获取拼团组合
  //说明：调用页面需要实现结果处理方法dowithGetGroupWorkItemList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  getGroupWorkItemList: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_goodtype&action=QuerySpellNum&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log('获取拼团组合项列表')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetGroupWorkItemList(res.data, 1, "");
          } catch (e) { console.log(e) }
        } else {
          app.setErrorMsg2(that, "获取拼团组合项列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          try {
            that.dowithGetGroupWorkItemList(null, 0, "");
          } catch (e) { console.log(e) }
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取拼团组合项列表调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        try {
          that.dowithGetGroupWorkItemList(null, 0, "");
        } catch (e) { console.log(e) }
      }
    })
  },
  //方法：获取拼团商品列表
  //说明：调用页面需要实现结果处理方法dowithGetGWProductList(dataList,tag,errorInfo,pageIndex)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getGWProductList: function (mainObj,isHaveSid, otherParam, pageSize, pageIndex) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    wx.showLoading({
      title: '正在加载中...',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = isHaveSid?"cls=product_goodtype&action=QuerySpellPeriods&appId=" + app.data.appid + "&timestamp=" + timestamp:"cls=product_goodtype&action=QuerySpell&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取拼团商品列表详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取拼团商品列表详情:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetGWProductList(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetGWProductList(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取拼团商品列表：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetGWProductList(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取拼团商品列表接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取拼团商品详情
  //说明：调用页面需要实现结果处理方法dowithGetGWProductDetail(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getGWProductDetail: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_goodtype&action=QuerySpellDetail&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('获取拼团商品详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取拼团商品详情:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetGWProductDetail(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetGWProductDetail(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取拼团商品详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetGWProductDetail(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取拼团商品详情接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取拼团抽奖订单详情
  //说明：调用页面需要实现结果处理方法dowithGetGWOrderDetail(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getGWOrderDetail: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_goodtype&action=QuerySpellOrder&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('获取拼团抽奖订单详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取拼团抽奖订单详情:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetGWOrderDetail(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetGWOrderDetail(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取拼团抽奖订单详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetGWOrderDetail(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取拼团抽奖订单接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：修改拼团抽奖订单
  //说明：调用页面需要实现结果处理方法dowithUpdateGWOrderDetail(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  updateGWOrderDetail: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_goodtype&action=UpdateSpellOrder&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('修改拼团抽奖订单:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('修改拼团抽奖订单:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithUpdateGWOrderDetail(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithUpdateGWOrderDetail(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "修改拼团抽奖订单：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithUpdateGWOrderDetail(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "修改拼团抽奖订单接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取拼团抽奖订单详情
  //说明：调用页面需要实现结果处理方法dowithSetGWPrizeResul(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  setGWPrizeResult: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=main_lotteryServer&action=UpdateLottery&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('拼团抽奖抽奖结果处理:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('拼团抽奖抽奖结果处理:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithSetGWPrizeResul(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithSetGWPrizeResul(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "拼团抽奖抽奖结果处理：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithSetGWPrizeResul(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "拼团抽奖抽奖结果处理接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取拼团消费劵列表
  //说明：调用页面需要实现结果处理方法dowithGetGWCouponList(dataList,tag,errorInfo,pageIndex)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getGWCouponList: function (mainObj, otherParam, pageSize, pageIndex) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    wx.showLoading({
      title: '正在加载中...',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_goodtype&action=QuerySpellSeq&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    // urlParam = urlParam + moldParam + otherParam + ifOMPParam + sortParam + "&pSize=10&pIndex=1&sign=" + sign;
    urlParam = urlParam + otherParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取拼团消费劵列表详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取拼团消费劵列表详情:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetGWCouponList(res.data.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetGWCouponList(null, 0, res.data.rspMsg, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取拼团消费劵列表：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetGWCouponList(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取拼团消费劵列表接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：拼团抽奖订单退款
  //说明：调用页面需要实现结果处理方法dowithRefundGWOrderAmoun(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  refundGWOrderAmount: function (mainObj,orderId, otherParam) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=wxRefund_wxRefund&action=wxRefund&orderId="+orderId+"&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('订单退款处理:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('订单退款处理:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithRefundGWOrderAmoun(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithRefundGWOrderAmoun(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "订单退款处理：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithRefundGWOrderAmoun(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "订单退款处理接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取用户积分信息
  //说明：调用页面需要实现结果处理方法dowithGetMemberIntegrals(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getMemberIntegrals: function (mainObj,otherParam) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=main_member&action=getUserIntegral&appId=" + app.data.appid +"&userId="+ appUserInfo.userId+ "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    
    urlParam = urlParam + "&companyId=" + app.data.companyId + otherParam + "&sign=" + sign;
    console.log('获取用户积分:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取用户积分:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMemberIntegrals(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetMemberIntegrals(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取用户积分：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMemberIntegrals(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取用户积分接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //方法：获取订单列表
  //说明：调用页面需要实现结果处理方法dowithGetOrderDataList(dataList,tag,errorInfo,pageIndex)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //     pageIndex：返回页面索引
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getOrderDataList: function (mainObj, otherParam, pageSize, pageIndex) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_order&action=QueryOrdersNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    
    urlParam = urlParam + otherParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取订单列表:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取订单列表结果:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetOrderDataList(res.data, 1, "", pageIndex);
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetOrderDataList(null, 0, res.data, pageIndex);
          } catch (e) {}
          app.setErrorMsg2(that, "获取订单列表：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetOrderDataList(null, 0, "", pageIndex);
        } catch (e) {}
        app.setErrorMsg2(that, "获取订单列表接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取订单详情列表
  //说明：调用页面需要实现结果处理方法dowithGetOrderDetailList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getOrderDetailList: function (mainObj, otherParam) {
    var that = mainObj,app = this;
    var SMURL = app.getUrlAndKey.smurl,KEY = app.getUrlAndKey.key;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",sign = "";
    urlParam = "cls=product_order&action=QueryOrdersDetailNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('获取订单详情:', SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('获取订单详情结果:', res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetOrderDetailList(res.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetOrderDetailList(null, 0, res.data);
          } catch (e) {}
          app.setErrorMsg2(that, "获取订单详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetOrderDetailList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取订单详情接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //--------打印图片相关--------------------------------------------------------------------------
  //方法：构造首页各类图库
  filterPrintImgList:function(printAllImgList){
    let app=this, sysLimit=4,otherLimit=4,myLimit=3,sysCnt=0,otherCnt=0,myCnt=0;
    let sysOtherLimit=4,sysOtherCnt=0;
    let pSysImgList = [],pMyImgList=[],pOtherImgList=[],pSysOtherImgList=[],dataItem=null;
    let appUserInfo = app.globalData.userInfo;
    for(let i=0;i<printAllImgList.length;i++){
      dataItem=null;dataItem=printAllImgList[i];
      if(dataItem.userId==0 && sysCnt<sysLimit){
        sysCnt++;
        pSysImgList.push(dataItem);
      }
      if(dataItem.userId>0 && dataItem.userId!=appUserInfo.userId && dataItem.open==0 && otherCnt<otherLimit){
        otherCnt++;
        pOtherImgList.push(dataItem);
      }
      if(dataItem.userId==appUserInfo.userId && myCnt<myLimit){
        myCnt++;
        pMyImgList.push(dataItem);
      }

      if((dataItem.userId==0 || (dataItem.userId>0 && dataItem.userId!=appUserInfo.userId && dataItem.open==0)) && sysOtherCnt<sysOtherLimit){
        sysOtherCnt++;
        pSysOtherImgList.push(dataItem);
      }
    }
    let printImageInfo={
      printAllImgList:printAllImgList,pSysImgList:pSysImgList,pOtherImgList:pOtherImgList,pMyImgList:pMyImgList,pSysOtherImgList:pSysOtherImgList,
    }
    return printImageInfo;
  },
  //方法：获取打印图片相关信息
  //说明：调用页面需要实现结果处理方法dowithGetPrintImgList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getPrintImgList: function (mainObj,otherParam) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_gimage&action=gimageList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParam + "&sign=" + sign;
    console.log('获取打印图片信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取打印图片信息结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPrintImgList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetPrintImgList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取打印图片：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPrintImgList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取打印图片接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取打印图片相关信息
  //说明：调用页面需要实现结果处理方法dowithGetPrintImgTypeList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getPrintImgTypeList: function (mainObj) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_gimage&action=gimagetypeList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('获取打印图片类型信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取打印图片类型信息结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetPrintImgTypeList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetPrintImgTypeList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取打印图片类型：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetPrintImgTypeList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取打印图片类型接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：设置我使用过打印图片相关信息
  //说明：调用页面需要实现结果处理方法dowithSetMyUsedPrintImgInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  setMyUsedPrintImgInfo: function (mainObj,otherParams) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_myUsedImage&action=saveMyUsedImage&userId="+appUserInfo.userId+"&companyId="+app.data.companyId+"&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('设置我使用过打印图片：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('设置我使用过打印图片结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithSetMyUsedPrintImgInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithSetMyUsedPrintImgInfo(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "设置我使用过打印图片：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithSetMyUsedPrintImgInfo(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "设置我使用过打印图片接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取我使用过打印图片信息
  //说明：调用页面需要实现结果处理方法dowithGetMyUsedPrintImgInfo(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getMyUsedPrintImgInfo: function (mainObj,otherParams) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_myUsedImage&action=myUsedImageList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId="+appUserInfo.userId+"&companyId="+app.data.companyId+ "&sign=" + sign;
    console.log('获取我使用过打印图片：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取我使用过打印图片结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMyUsedPrintImgInfo(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetMyUsedPrintImgInfo(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取我使用过打印图片：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMyUsedPrintImgInfo(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取我使用过打印图片接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：获取首页滚动图片相关信息
  //说明：调用页面需要实现结果处理方法dowithGetMainPageBannerList(dataList,tag,errorInfo)
  //     dataList：返回的商品列表信息
  //     tag：1成功，0失败
  //     errorInfo：返回出错信息
  //参数：
  //mainObj：调用页面主体
  //otherParam：指定条件参数
  getMainPageBannerList: function (mainObj,otherParams) {
    var that = mainObj,app = this;
    var URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,appUserInfo = app.globalData.userInfo;
    let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_gbanner&action=gbannerList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('获取Banner信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取Banner信息结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          try {
            that.dowithGetMainPageBannerList(res.data.data, 1, "");
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            that.dowithGetMainPageBannerList(null, 0, res.data.rspMsg);
          } catch (e) {}
          app.setErrorMsg2(that, "获取Banner：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        try {
          that.dowithGetMainPageBannerList(null, 0, "");
        } catch (e) {}
        app.setErrorMsg2(that, "获取Banner接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  /**
   * post请求
   * mainObj=this
   * URL 
   * signParam=签名的字段参数(appId、timestamp在最后可以不用写)
   * dataJsonName=需要post的字段参数名
   * dataObj=需要post的数据
   * otherParam=其他不参与签名的字段
   * tag=多个post请求成功回调方法的区分
   * msg=post请求的日志信息
   * isHideLoading=是否隐藏加载框
   * isHideLoading=是否隐藏Toast
   */
  doPostData: function (mainObj, URL, signParam, dataJsonName, dataObj, otherParam, tag, msg, isHideToast, isHideLoading) {
    var that = mainObj;
    var app = this,
      KEY = app.getUrlAndKey.key;
    if (!isHideLoading) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var sign = signParam;
    if (sign.indexOf("appId") >= 0) {
      console.log('包含appId此字符串')
    } else {
      sign = sign + "&appId=" + app.data.appid + "&timestamp=" + timestamp
    }
    var signMD5 = MD5JS.hexMD5(sign + "&key=" + KEY);
    console.log(msg + 'sign:', sign)

    var urlParam = sign + "&sign=" + signMD5 + otherParam;


    console.log(msg, URL + urlParam);
    if (Utils.myTrim(dataJsonName) != "") {
      console.log(dataJsonName + "\tjson对象：", JSON.stringify(dataObj));

      wx.request({
        url: URL + urlParam,
        method: "POST",
        data: {
          [dataJsonName]: JSON.stringify(dataObj)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (!isHideLoading) {
            wx.hideLoading();
          }
          console.log(msg, res.data)
          if (res.data.rspCode == 0) {
            try {
              that.postRuslt(res.data.data, 1, res.data.rspMsg, tag);
            } catch (e) {
              console.log(msg, e)
            }
          } else {
            try {
              var errorInfo = res.data.rspMsg
              errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "失败！"
              if (!isHideToast) {
                wx.showToast({
                  title: errorInfo,
                  icon: 'none',
                  duration: 1500
                })
              }
              that.postRuslt(res.data.data, 0, errorInfo, tag);
            } catch (e) {
              console.log(msg, e)
            }
            app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(res)+" "+(Utils.isNotNull(dataObj)?JSON.stringify(dataObj):""), URL + urlParam, false);
          }
        },
        fail: function (err) {
          if (!isHideLoading) {
            wx.hideLoading();
          }
          try {
            var errorInfo = JSON.stringify(err)
            errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "失败！"
            if (!isHideToast) {
              wx.showToast({
                title: errorInfo,
                icon: 'none',
                duration: 1500
              })
            }
            that.postRuslt(null, 0, errorInfo, tag);
          } catch (e) {
            console.log(msg, e)
          }
          app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(err)+" "+(Utils.isNotNull(dataObj)?JSON.stringify(dataObj):""), URL + urlParam, false);
        }
      })
    } else {
      wx.request({
        url: URL + urlParam,
        success: function (res) {
          if (!isHideLoading) {
            wx.hideLoading();
          }
          console.log(msg, res.data)
          if (res.data.rspCode == 0) {
            try {
              that.postRuslt(res.data.data, 1, res.data.rspMsg, tag);
            } catch (e) {
              console.log(msg, e)
            }
          } else {
            try {
              var errorInfo = res.data.rspMsg
              errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "获取失败！"
              if (!isHideToast) {
                wx.showToast({
                  title: errorInfo,
                  icon: 'none',
                  duration: 1500
                })
              }
              that.postRuslt(res.data.data, 0, errorInfo, tag);
            } catch (e) {
              console.log(msg, e)
            }
            app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          }
        },
        fail: function (err) {
          if (!isHideLoading) {
            wx.hideLoading();
          }
          try {
            var errorInfo = JSON.stringify(err)
            errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "获取失败！"
            if (!isHideToast) {
              wx.showToast({
                title: errorInfo,
                icon: 'none',
                duration: 1500
              })
            }
            that.postRuslt(null, 0, errorInfo, tag);
          } catch (e) {
            console.log(msg, e)
          }
          app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        }
      })
    }
  },

  /**
   * get请求
   * mainObj=this
   * URL 
   * signParam=签名的字段参数(appId、timestamp在最后可以不用写)
   * otherParam=其他不参与签名的字段
   * tag=多个post请求成功回调方法的区分
   * msg=get请求的日志信息
   * isHideLoading=是否隐藏加载框
   * isHideLoading=是否隐藏Toast
   * isAll 是否需要返回完整数据
   */
  doGetData: function (mainObj, URL, signParam, otherParam, tag, msg, isHideToast, isHideLoading, isAll) {
    var that = mainObj
    var app = this,
      KEY = app.getUrlAndKey.key;
    if (!isHideLoading) {
      wx.showLoading({
        title: '加载中...',
      })
    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var sign = signParam;
    if (sign.indexOf("appId") >= 0) {
      console.log('包含appId此字符串')
    } else {
      sign = sign + "&appId=" + app.data.appid + "&timestamp=" + timestamp
    }
    var signMD5 = MD5JS.hexMD5(sign + "&key=" + KEY);
    console.log(msg + 'sign:', sign)

    var urlParam = sign + "&sign=" + signMD5 + otherParam;

    console.log(msg, URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (!isHideLoading) {
          wx.hideLoading();
        }
        console.log(msg + "doGetData Result:", res);
        console.log(msg, res.data)
        if (res.data.rspCode == 0) {
          try {
            if (isAll) {
              that.getRuslt(res.data, 1, res.data.rspMsg, tag);
            } else {
              that.getRuslt(res.data.data, 1, res.data.rspMsg, tag);
            }
          } catch (e) {
            console.log(msg, e)
          }
        } else {
          try {
            var errorInfo = res.data.rspMsg
            errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "获取失败！"
            if (!isHideToast) {
              wx.showToast({
                title: errorInfo,
                icon: 'none',
                duration: 1500
              })
            }
            that.getRuslt(res.data.data, 0, errorInfo, tag);
          } catch (e) {
            console.log(msg, e)
          }
          app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        if (!isHideLoading) {
          wx.hideLoading();
        }
        try {
          var errorInfo = JSON.stringify(err)
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : msg + "获取失败！"
          if (!isHideToast) {
            wx.showToast({
              title: errorInfo,
              icon: 'none',
              duration: 1500
            })
          }
          that.getRuslt(null, 0, errorInfo, tag);
        } catch (e) {
          console.log(msg, e)
        }
        app.setErrorMsg2(that, msg + "：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
})
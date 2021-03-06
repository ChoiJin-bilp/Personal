// pages/amited/amited.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,isComparePrice=false;
// 配送时长1小时(秒)
var DeliveryTime = 60 * 60;
// 配送时间间隔(秒)
var DeliverySpace = 30 * 60;
// 可以预定的天数(天)
var ReserveDays = 5;
// 开始营业的时间9点
var StatTime = 9;
// 结束营业的时间23点
var EndTime = 23;
// 门店地址
var ShopAddress = "深圳市科苑路东方科技大厦";
// 配送距离3km
var DeliveryDistan = 3 * 1000;
//是否启用多种支付方式
let isUseMulitiPayfoPop = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: '',
    SMDataURL: SMDataURL,
    totalDouble: 0,
    // 订单类型 8饮品预订 9饮品外卖 12是分钟按摩券下单
    linkNo: 8,
    // 0是预订点餐 1外卖
    pagetype: 0,
    shopCarList: [],
    companyName: "",
    // 排队进度 前面还有多少单
    orderNum: 0,
    //当前设备投放位置
    agentPutAddress: app.data.agentPutAddress,
    //堂食外带 
    isHot: 1,
    remarks: "",
    // 显示多少张按摩券
    numAnMoCoupon: 0,
    orderId: "",
    payNo: "",
    orderType: 0, //订单类型：0单商品订单，1多商品订单

    addressList: [],
    isReData: true,
    // 当前选择的收货地址
    curAddress: [],
    // 显示可预定的日期
    reserveDates: [],
    // 选中日期哪天送
    selectDateIndex: 0,
    // 选中了几点送达
    selectTimeIndex: 0,
    // 显示用户选择的日期时间
    showSelectDate: "立即取餐",
    // 门店地址经纬度
    shopLocation: "",
    // 是否超出配送范围
    isOverDistan: true,
    showTipTxet: "计算中",
    // 预定超过多久优惠(小时)
    reserveOverTime: 12,
    // 预定优惠多少元
    reserveoverTimeCutHow: 8,
    // 预定时间有没有到优惠时间
    isReserveOverTime: false,
    // 是否支持预定优惠
    isCanReserveFavourable: true,

    //订单可使用优惠券
    couponsList: [],
    //选中优惠券
    selectCoupons: "",
    // 优惠券合计
    discountSum: 0,
    // 二维码图片地址
    QRURL: "",

    synRecordId: 0, //组合劵对应的按摩劵ID
    orderPTag: 0, //0单订单，1多订单

    freeOrderRCList:[],       //免单充值选项列表
    isFreeOrder:false,        //是否选择充值免单
    rechargeAmount:0.00,

    srcOption:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log("onLoad:")
    console.log(options);
    appUserInfo = app.globalData.userInfo
    that.data.srcOption=options;
    let mainCompanyData = app.data.mainCompanyData;
    let synRecordId = 0;
    try {
      if (options.rid != null && options.rid != undefined)
        synRecordId = parseInt(options.rid);
      synRecordId = isNaN(synRecordId) ? 0 : synRecordId;
    } catch (e) {}

    var pagetype = options.pagetype
    var linkNo = this.data.linkNo
    // 外卖
    if (pagetype == 1) {
      linkNo = 9
    } else {
      linkNo = 8
    }

    // 是否支持预定优惠
    var isCanReserveFavourable = options.isCanReserveFavourable
    if (Utils.isNull(isCanReserveFavourable)) {
      isCanReserveFavourable = true
    } else {
      isCanReserveFavourable = false
    }

    this.setData({
      companyName: mainCompanyData.cName,
      agentPutAddress: app.data.agentPutAddress,
      pagetype: pagetype,
      linkNo: linkNo,
      isCanReserveFavourable: isCanReserveFavourable,

      ["synRecordId"]: synRecordId,
    })

    this.setReserveDays()
    this.queryOrders()
    this.getShopCar()
  },
  //方法：扫码切换座位号
  scanSitePosition:function(){
    let that=this;
    app.data.curPageDataOptions={
      package:"packageYK",page:"/pages/amited/amited",options: that.data.srcOption,
    }
    wx.redirectTo({
      url: '/pages/scanCode/scanCode?login=2&alt='+encodeURIComponent("请扫码确定座位号")
    })
  },
  onShow: function () {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;

    if (this.data.isReData) {
      this.getAddress()
      this.data.isReData = false
    } else {
      this.setAddressData()
    }
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    let value = e.detail.value, setKey = "";
    value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    let len = Utils.getStrlengthB(value);
    switch (cid) {
      case "agentPutAddress":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "agentPutAddress";
        that.setData({
          [setKey]: value
        })
        break;
    }
  },
  /**
   * 获取距离 是否支持配送
   */
  getDistanc() {
    var that = this
    var pagetype = that.data.pagetype
    // 外卖
    if (pagetype == 1) {
      let shopLocation = that.data.shopLocation
      if (Utils.isNull(shopLocation)) {
        // 同步请求后 获取数据
        Utils.getLngAndLat(app, ShopAddress).then(res => {
          shopLocation = res
        }).catch(err => {
          shopLocation = err
        });
        that.data.shopLocation = shopLocation
      }
      let curAddress = that.data.curAddress
      if (!Utils.isNull(curAddress)) {
        let curAddressLocation = ''
        // 同步请求后 获取数据
        Utils.getLngAndLat(app, curAddress.area).then(res => {
          curAddressLocation = res
        }).catch(err => {
          curAddressLocation = err
        });
        setTimeout(function () {
          console.log(shopLocation)
          console.log(curAddressLocation)
          let distanc = Utils.getLocationDistance(shopLocation.lat, shopLocation.lng, curAddressLocation.lat, curAddressLocation.lng)
          console.log("距离", distanc)
          if (distanc > DeliveryDistan) {
            that.setData({
              isOverDistan: true,
              showTipTxet: "超出3km配送范围",
            })
          } else {
            that.setData({
              isOverDistan: false,
              showTipTxet: "超出3km配送范围",
            })
          }
        }, 1500)
      }
    }
  },

  /**
   * 设置显示预定时间
   */
  setReserveDays() {
    var that = this
    var reserveDates = that.data.reserveDates

    // 未来几天日期时间点
    var defaultTime = []
    for (let i = 0;; i++) {
      let now = new Date();
      now.setHours(StatTime)
      now.setMinutes(0)
      //获取当前时间点时间戳
      let nowTime = now.getTime();
      let t = nowTime + DeliveryTime * 1000 + DeliverySpace * 1000 * i
      now.setTime(t)
      if (now.getHours() >= EndTime) {
        if (now.getMinutes() > 0) {
          break
        }
      }
      let min = parseInt(now.getMinutes()) >= 10 ? now.getMinutes() : ("0" + now.getMinutes())
      let time = now.getHours() + ":" + min
      let reserveTime = {
        time: time,
        //  是否预定优惠
        isReserveOverTime: true
      }
      defaultTime.push(reserveTime)
    }

    for (let i = 0; i < ReserveDays; i++) {
      let showTime = Utils.getformatDate(i, 0)
      let timeDate = Utils.formatDate(i)

      var defaultTimes = []

      // 当天的日期
      if (0 == i) {
        let now = new Date();
        //获取当前时间点时间戳
        let nowTime = now.getTime();
        //获取当前时间点小时
        let nowHours = now.getHours()
        if (nowHours >= StatTime) {
          let t = nowTime + DeliveryTime * 1000
          let myDate = new Date()
          myDate.setTime(t)
          // 立即送达时间
          let min = parseInt(myDate.getMinutes()) >= 10 ? myDate.getMinutes() : ("0" + myDate.getMinutes())
          let arrivalTime = myDate.getHours() + ":" + min

          let reserveTime = {
            time: arrivalTime,
            //  是否预定优惠
            isReserveOverTime: false
          }
          defaultTimes.push(reserveTime)
          console.log("立即送达时间=" + arrivalTime)

          for (let i = 1;; i++) {
            let longTime = nowTime + DeliveryTime * 1000 + DeliverySpace * 1000 * i
            let arrivalDate = new Date()
            arrivalDate.setTime(longTime)
            if (arrivalDate.getHours() >= EndTime) {
              if (arrivalDate.getMinutes() > 0) {
                break
              }
            }
            let min = parseInt(arrivalDate.getMinutes()) >= 10 ? arrivalDate.getMinutes() : ("0" + arrivalDate.getMinutes())
            let time = arrivalDate.getHours() + ":" + min

            let showSelectDate = timeDate + " " + time
            let differenceHours = Utils.getTimeInterval(new Date().getTime(), showSelectDate, 1)
            //  是否预定优惠
            let isReserveOverTime = false
            if (differenceHours >= that.data.reserveOverTime) {
              isReserveOverTime = true
            }
            reserveTime = {
              time: time,
              isReserveOverTime: isReserveOverTime
            }
            defaultTimes.push(reserveTime)

          }
        } else if (nowHours >= EndTime) {
          // 过了营业时间点
        } else {
          defaultTimes = defaultTime
        }

      } else {
        defaultTimes = defaultTime
      }


      let times = {
        showTime: showTime,
        timeDate: timeDate,
        defaultTimes: defaultTimes,
      }
      reserveDates.push(times)
    }
    console.log(reserveDates)
    var selectDateIndex = that.data.selectDateIndex
    var selectTimeIndex = that.data.selectTimeIndex
    var showSelectDate = reserveDates[selectDateIndex].timeDate + " " + reserveDates[selectDateIndex].defaultTimes[selectTimeIndex].time + ":00"
    that.setData({
      reserveDates: reserveDates,
      showSelectDate: showSelectDate,
    })
  },

  //显示选取时间弹窗
  onChangtimeOut() {
    this.setData({
      timeOut: !this.data.timeOut,
    })
  },
  //输入框聚焦和取消聚焦事件
  focusOut() {
    this.setData({
      type: true,
    })
  },
  blurOut() {
    if (this.data.item == "") {
      this.setData({
        type: false,
      })
    }
  },

  /**
   * 切换堂食/外带
   */
  isHottype(e) {
    this.setData({
      isHot: e.currentTarget.dataset.num
    })
    console.log(this.data.isHot)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //清空弹窗
  emptyType() {
    this.setData({
      timeOut: false,
      ImageyulanType:false
    })
  },

  getInput(e) {
    var value = e.detail.value;
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "remarks"
        break;
    }
    this.setData({
      [name]: value,
    })
  },

  /**
   * 用戶购物车列表
   */
  getShopCar() {
    let that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synRecordId > 0) {
      that.getSynShopCar();
    } else {
      var userId = appUserInfo.userId
      let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId
      var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + app.data.agentCompanyId
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "用戶购物车列表")
    }

  },

  /**
   * 查询排队订单状态
   */
  queryOrders() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=QueryOrdersNew&appId=' + app.data.appid + "&timestamp=" + timestamp;
    // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货(配送中)7团购失败 12已支付定金
    var otherParam = "&linkNo=8,9&status=1&pageIndex=1&pageSize=99&companyId=" + app.data.agentCompanyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 1, "查询排队订单状态", false, false, true)
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus(orderId, amount) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=UpdateOrders&appId=' + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + orderId;
    var otherParam = "&store=1&status=1&amount=" + amount
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 2, "更新订单状态")
  },

  /**
   * 更新订单二维码图片
   */
  updateOrderWXQRCode(orderId) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=UpdateCashOrders&appId=' + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + orderId;
    var otherParam = "&qrUrl=" + this.data.QRURL
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 9, "更新订单二维码图片")
  },

  //方法：支付订单操作
  nowpay(payNo, orderId, amount) {
    let that = this,orderDatas = that.data.orderDatas,synRecordId=that.data.synRecordId,attach = "",price = amount,describe = "";
    let isFreeOrder=that.data.isFreeOrder,freeOrderRCList=that.data.freeOrderRCList,payModeTag=3;

    //支付模式：0公众号支付，1App支付，2支付宝支付，3小程序支付，4零元支付，5余额支付
    //如果为免单，则0元支付；如果金额小于等于0，则0元支付
    payModeTag=isFreeOrder?4:payModeTag;
    payModeTag=amount<=0?4:payModeTag;
    // 支付标识  0支付 1预购支付  2尾款支付
    let payType = orderDatas.linkNo == 4 ? (orderDatas.status == 0 ? 1 : 2) : 0;
    if (that.data.orderPTag == 0) {
      attach = '8_' + payType + '_' + app.data.hotelId + '_'+payModeTag+',' + orderId;
    } else {
      attach = '9_' + payType + '_' + app.data.hotelId + '_'+payModeTag+',' + payNo;
    }
    //如果页面为组合劵使用商品调用
    attach += synRecordId > 0 ? "|" + synRecordId : "";

    let shopCarList = that.data.shopCarList;
    if (Utils.isNotNull(shopCarList) && shopCarList.length > 0) {
      describe = Utils.isNotNull(shopCarList[0].productName) && Utils.myTrim(shopCarList[0].productName) != "" ? shopCarList[0].productName : "商品订单";
    }
    if(isFreeOrder && Utils.isNotNull(freeOrderRCList) && freeOrderRCList.length>0){
      //1、免单充值处理
      wx.showModal({
        title: '提示',
        content: '即将跳往充值页面，充值完成后本订单自动提交，您确定吗？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(url)
            let url="/packageVP/pages/Mymember/Mymember?lp=2&oid="+orderId+"&rid="+freeOrderRCList[0].id;
            url+="&at="+encodeURIComponent(attach)+"&price="+price+"&txt="+encodeURIComponent(describe);
            if(synRecordId>0){
              url+="&srid="+synRecordId;
            }
            console.log("充值免单页面跳转：")
            console.log(url)
            wx.redirectTo({
              url: url
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    }else{
      //2、正常支付处理
      let payPopObj = null;
      payPopObj = that.selectComponent('#payPop');
      //如果启用多种支付方式且弹窗有效
      if (isUseMulitiPayfoPop && Utils.isNotNull(payPopObj)) {
        
        payPopObj.showPayForPop(orderId, price, attach, describe);
      } else {
        price = (amount * 100).toFixed(0);

        let signParam = 'cls=main_payment&action=BJYXCXpayment';
        var otherParam = "&body=" + encodeURIComponent(app.data.sysName + "-商城") + "&detail=" + encodeURIComponent(app.data.sysName + "-商城") + "&money=" + price + "&userId=" + appUserInfo.userId + "&openid=" + appUserInfo.wxopenId + "&attach=" + attach
        app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 3, "注册支付")
      }
    }
    
  },

  /**
   * 调起支付
   */
  requestPayment() {
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = "appId=" + that.data.paymentData.appid + "&nonceStr=" + that.data.paymentData.nonce_str + "&package=prepay_id=" + that.data.paymentData.prepay_id + "&signType=MD5&timeStamp=" + timestamp + "&key=" + app.data.hotelKey;
    var sign = MD5JS.hexMD5(signParam);
    wx.requestPayment({
      'timeStamp': "" + timestamp,
      'nonceStr': that.data.paymentData.nonce_str,
      'package': 'prepay_id=' + that.data.paymentData.prepay_id,
      'signType': 'MD5',
      'paySign': sign,
      success: function (res) {
        //跳转支付成功页面
        that.gotoPaySuccessPage();
      },
      fail: function (res) {
        wx.hideLoading()
        // wx.navigateBack({
        //   delta: 1,
        // })
        wx.showModal({
          title: '提示',
          content: "订单还未支付,确定取消订单吗?",
          confirmText: "去支付",
          success(res) {
            if (res.confirm) {
              that.startPay()
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
        console.log("支付发起失败", res);
      }
    })
  },
  //方法：组件调用支付完成方法
  onCompontDowithAfterPayfor: function (e) {
    let that = this;
    that.gotoPaySuccessPage();
  },

  //方法：跳转支付成功页面
  gotoPaySuccessPage() {
    let that = this,orderId = that.data.orderId,selectCoupons = that.data.selectCoupons,url="";
    url="/packageOther/pages/successDetailspa/successDetailspa?oid=" + orderId;

    //如果页面为组合劵使用商品调用
    if (that.data.synRecordId > 0) {
      url+="&srid="+that.data.synRecordId;
    }
    if(Utils.isNotNull(selectCoupons)){
      url+="&cpid="+selectCoupons.keyid;
    }
    wx.redirectTo({
      url: url
    })
  },

  /**
   * 获取收货地址
   */
  getAddress() {
    var userId = appUserInfo.userId
    let signParam = 'cls=product_address&action=selectAddress&userId=' + userId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, "", 5, "获取收货地址")
  },

  /**
   * 获取查询优惠券
   */
  queryCoupons() {

    var that = this
    let shopCarList = that.data.shopCarList
    var did = []
    var tid = []

    for (let i = 0; i < shopCarList.length; i++) {
      var shopCar = shopCarList[i]
      var labels = shopCar.labList
      let add_tid = true

      for (let j = 0; j < labels.length; j++) {
        const label = labels[j];
        let add_did = true
        for (let k = 0; k < did.length; k++) {
          const element = did[k];
          if (element == label.detailId) {
            add_did = false
            break
          }
        }
        if (add_did) {
          did.push(label.detailId)
        }
      }

      for (let t = 0; t < tid.length; t++) {
        const element = tid[t];
        if (element == shopCar.productTypeId) {
          add_tid = false
          break
        }
      }
      if (add_tid) {
        tid.push(shopCar.productTypeId)
      }

    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId=13140
    let signParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId;
    let otherParam = "&isUsed=0&did=" + did.join(",") + "&tid=" + tid.join(",");
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 6, "获取查询优惠券")
  },

  /**
   * 使用优惠券
   */
  useCoupons() {
    var selectCoupons = this.data.selectCoupons
    if (selectCoupons.length == 0) {
      return
    }
    // var couponId = []
    // for (let i = 0; i < selectCoupons.length; i++) {
    //   const element = selectCoupons[i];
    //   couponId.push(element.keyid)
    // }

    var userId = appUserInfo.userId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_coupons&action=UseCoupons&appId=' + app.data.appid + "&timestamp=" + timestamp + "&id=" +
      selectCoupons.keyid + "&orderId=" + this.data.orderId;
    var otherParam = "&userId=" + userId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 7, "使用优惠券")
  },

  /**
   * 获取二维码图片URL
   */
  getWXQRCode(orderId) {
    var userId = appUserInfo.userId
    let signParam = 'cls=main_WXQRCode&action=getWXQRCode&page=packageYK/pages/Myprize/Myprize'
    var otherParam = "&pagedata=oid=" + orderId + "&userId=" + userId + "&xcxAppId=" + app.data.wxAppId
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 8, "获取二维码图片URL")
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
            that.queryCoupons()
            break
          case 1:
            let orderNum = 0
            if (!Utils.isNull(data.cash)) {
              orderNum = data.cash.cnt
            }
            that.setData({
              orderNum: orderNum,
            })
            break
            //更新订单状态
          case 2:
            that.useCoupons()
            //跳转支付成功页面
            that.gotoPaySuccessPage()
            break
          case 3:
            that.setData({
              paymentData: data,
            })
            that.requestPayment()
            break
          case 4:
            //跳转支付成功页面
            that.gotoPaySuccessPage()
            break
          case 5:
            that.dealData5(data)
            break
          case 6:
            that.dealData6(data)
            break
          case 7:

            break
          case 8:
            that.setData({
              QRURL: app.getUrlAndKey.uploadUrl + "/baojiayou/" + data.imageAddress,
            })
            console.log("二维码图片地址:" + that.data.QRURL)
            that.updateOrderWXQRCode(that.data.orderId)
            break
          case 9:

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
        break
    }
  },

  dealData6(data) {
    let that = this,couponsList=[];
    let keyid = that.getMaxcoupon(data),checkResult=null;
    let mold=0,full=0.00,cDate=new Date(), vDtStartTimeStr="",vDtEndTimeStr="";
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      mold=0;full=0.00;
      vDtStartTimeStr="";vDtEndTimeStr="";
      if (Utils.isDBNotNull(element.startTime)) {
        try {
          cDate = new Date(Date.parse((element.startTime + "").replace(/-/g, "/")))
          vDtStartTimeStr = Utils.getTimeStrByDateTime(cDate);
        } catch (e) {
          console.log(e)
        }
      }
      if (Utils.isDBNotNull(element.endTime)) {
        try {
          cDate = new Date(Date.parse((element.endTime + "").replace(/-/g, "/")))
          vDtEndTimeStr = Utils.getTimeStrByDateTime(cDate);
        } catch (e) {}      
      }
      element.vDtStartTimeStr=vDtStartTimeStr;
      element.vDtEndTimeStr=vDtEndTimeStr;
      if (Utils.isDBNotNull(element.mold)){
        try{
          mold = parseInt(element.mold);
          mold = isNaN(mold) ? 0 : mold;
        }catch(e){}
      }  
      if (Utils.isDBNotNull(element.full)){
        try{
          full = parseFloat(element.full);
          full = isNaN(full) ? 0.00 : full;
        }catch(e){}
      }  
      //若满减劵未满足金额条件则继续下一循环
      if(mold==0 && that.data.temptotalDouble<full){
        continue;
      }
      checkResult=that.checkCouponTimeValid(element);
      if(Utils.isNotNull(checkResult)){
        if(checkResult.result==0){
          element.checked = keyid == element.keyid?true:element.checked;
        }else{
          continue;
        }
      }else if (keyid == element.keyid) {
        element.checked = true
      }
      couponsList.push(element);
    }
    that.setData({
      couponsList: couponsList,
    })
    
    if (keyid > 0) {
      that.submitSelCoupons()
    }
  },

  /**
   * 自动使用最优优惠券 免单>大额优惠券
   * @param {*} data 
   */
  getMaxcoupon(data) {
    var keyid = 0
    var discount = 0
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element.mold == 2) {
        keyid = element.keyid
        break
      }
      if (discount < element.discount) {
        keyid = element.keyid
      }
    }

    return keyid
  },

  /**
   * 处理收货地址数据
   * @param {*} data 
   */
  dealData5(data) {
    var that = this
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        var names = element.name.split(",")
        element.name = names[0]
        element.sex = names[1]
      }
      that.setData({
        addressList: data,
      })
      that.setAddressData()
    } else {
      app.data.lastAddressId = 0
      that.setData({
        addressList: [],
        curAddress: [],
      })
    }
  },

  /**
   * 设置收货地址
   */
  setAddressData() {
    var that = this
    var addressList = that.data.addressList

    if (addressList.length > 0) {
      let curAddress = that.data.curAddress
      if (curAddress.length == 0) {
        if (app.data.lastAddressId == 0) {
          curAddress = addressList[0]
        } else {
          for (let i = 0; i < addressList.length; i++) {
            const element = addressList[i];
            if (element.id == app.data.lastAddressId) {
              curAddress = element
              break
            }
          }
        }
      } else {
        if (app.data.lastAddressId != curAddress.id) {
          for (let i = 0; i < addressList.length; i++) {
            const element = addressList[i];
            if (element.id == app.data.lastAddressId) {
              curAddress = element
              break
            }
          }
        }
      }
      that.setData({
        curAddress: curAddress,
      })
    }

    that.getDistanc()
  },

  /**
   * 购物车列表数据
   * @param {*} data 
   */
  dealData(data) {
    var that = this
    let shopCarList = data.shopCarList
    // 显示多少张按摩券
    let numAnMoCoupon = 0
    // 是否是只有分钟按摩券下单
    let isAnMoCoupon = true
    if (shopCarList.length > 0) {
      let tempArray=null,synImgItem="";
      for (let i = 0; i < shopCarList.length; i++) {
        const shopCar = shopCarList[i];

        //购物车图片处理
        synImgItem="";
        if(Utils.isNotNull(shopCar.synimage) && Utils.myTrim(shopCar.synimage) != ''){
          try{
            tempArray=shopCar.synimage.split("|");
            if(Utils.isNotNull(tempArray) && tempArray.length>0){
              synImgItem=tempArray.length>=2?Utils.myTrim(tempArray[1]):Utils.myTrim(tempArray[0]);
            }
          }catch(e){}
        }
        shopCar.synImgItem=synImgItem;

        // 只要不包括分钟的 都是非按摩券下单
        if (shopCar.productName.indexOf("分钟") < 0) {
          isAnMoCoupon = false
        }
        var showLabelList = []
        var labels = shopCar.labList
        for (let j = 0; j < labels.length; j++) {
          const label = labels[j];
          showLabelList = showLabelList.concat(label.lblname)
        }
        shopCar.showLabels = showLabelList.join("/")
        numAnMoCoupon += shopCar.num
        if (shopCar.synimage_price > 0) {
          shopCar.amount += shopCar.synimage_price
        }
      }
      let linkNo = that.data.linkNo
      // 按摩券下单linkNo = 12
      if (isAnMoCoupon) {
        linkNo = 12
      }
      console.log(linkNo)
      that.setData({
        linkNo: linkNo,
        shopCarList: shopCarList,
        totalDouble: data.totalDouble.toFixed(2),
        // 保存临时价格，方便优惠加减，恢复原价
        temptotalDouble: data.totalDouble,
        companyName: shopCarList[0].companyName,
        numAnMoCoupon: numAnMoCoupon,
      })
      //获取免单充值项
      app.getProductFreeRCItemList(that,"freeOrderRCList",that.data.temptotalDouble);
    } else {
      wx.showToast({
        title: "购物车里是空的",
        icon: 'none',
        duration: 1500
      })
      that.setData({
        shopCarList: [],
      })
    }
  },
  //方法：组合劵购物车信息获取
  getSynShopCar() {
    let that = this,
      shopCarList = [],
      totalDouble = 0,
      companyName = "",
      numAnMoCoupon = 1;
    if (Utils.isNotNull(app.data.synShopCarList) && app.data.synShopCarList.length > 0) {
      shopCarList = app.data.synShopCarList;
      let synImgItem="",tempArray=null;
      for(let i=0;i<shopCarList.length;i++){
        synImgItem="";tempArray=null;
        if(Utils.isNotNull(shopCarList[i].synimage) && Utils.myTrim(shopCarList[i].synimage) != ''){
          try{
            tempArray=shopCarList[i].synimage.split("|");
            if(Utils.isNotNull(tempArray) && tempArray.length>0){
              synImgItem=tempArray.length>=2?Utils.myTrim(tempArray[1]):Utils.myTrim(tempArray[0]);
            }
          }catch(e){}
        }
        shopCarList[i].synImgItem=synImgItem;
      }
      companyName = shopCarList[0].companyName;
      for (let i = 0; i < shopCarList.length; i++) {
        totalDouble += shopCarList[i].amount;
      }
    }
    that.setData({
      shopCarList: shopCarList,
      totalDouble: totalDouble,
      // 保存临时价格，方便优惠加减，恢复原价
      temptotalDouble: totalDouble,
      companyName: companyName,
      numAnMoCoupon: numAnMoCoupon,
    })
    //获取免单充值项
    app.getProductFreeRCItemList(that,"freeOrderRCList",that.data.temptotalDouble);
  },
  //事件：提交订单检测座位号
  submitOrderCheck:function(e){
    let that=this;
    if(that.data.isHot==1){
      if(Utils.myTrim(that.data.agentPutAddress)==""){
        //没有座位号提示
        wx.showModal({
          title: '提示',
          content: '您需要添加座位信息，或稍后自行到前台取单',
          cancelText:"前台取单",
          confirmText:"添加座位",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                ["isSetSitePosition"]: true,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              that.submitOrder();
            }
          }
        })
      }else{
        //有座位号确认提示
        wx.showModal({
          title: '提示',
          content: '当前座位号为“'+that.data.agentPutAddress+'”，是否更换座位？',
          cancelText:"不更换",
          confirmText:"更换座位",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                ["isSetSitePosition"]: true,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              that.submitOrder();
            }
          }
        })
      }
      
    }else{
      that.submitOrder();
    }
  },
  /**
   * 提交订单
   */
  submitOrder() {
    var that = this
    if (!Utils.isNull(that.data.orderId)) {
      wx.showToast({
        title: "订单已提交,请勿重复提交",
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    var way = "7" + that.data.isHot
    var deliveryId = 0
    if (1 == that.data.pagetype) {
      if (Utils.isNull(that.data.curAddress)) {
        wx.showToast({
          title: "地址不为空",
          icon: 'none',
          duration: 2000
        })
        return
      }
      deliveryId = that.data.curAddress.id
      way = ''
    }

    
    wx.showLoading({
      title: '加载中...',
    })

    var userId = appUserInfo.userId
    var mobile = appUserInfo.userMobile

    // `deliverytime`; '预计送到时间
    //  `deliveryflag `;送货标识,0非立即送货1立即送货'
    var deliveryflag = 1
    if (that.data.selectTimeIndex > 0) {
      deliveryflag = 0
    }

    let pages = getCurrentPages();
    // -1是当前页 -2是上个页面
    let prevPage = pages[pages.length - 2];
    // 通知上个页面更新数据
    prevPage.data.isReData = true

    let shopCarList = that.data.shopCarList
    var detail = []
    // 打印图案图片
    let synImagesList="",synidList="",synImgItem="",synImgID="",tempArray=null;
    let synDImgList="",synDIDList="";
    that.data.orderType = shopCarList.length > 1 ? 1 : 0;
    for (let i = 0; i < shopCarList.length; i++) {
      const shopCar = shopCarList[i];
      synImgItem="";synImgID="";
      synDImgList="";synDIDList="";
      if(Utils.isNotNull(shopCar.synimage) && Utils.myTrim(shopCar.synimage) != ''){
        try{
          tempArray=shopCar.synimage.split("|");
          if(Utils.isNotNull(tempArray) && tempArray.length>0){
            if(tempArray.length>=2){
              synImgID=Utils.myTrim(tempArray[0]);
              synImgItem=Utils.myTrim(tempArray[1]);
            }else{
              synImgItem=Utils.myTrim(tempArray[0]);
            }            
          }
        }catch(e){}
      }
      if(i==0){
        synImagesList=synImgItem;
      }else{
        synImagesList += ("," + synImgItem);
      }
      if(synImgID!=''){
        synidList+=Utils.myTrim(synidList) != ''?","+synImgID:synImgID;

        synDIDList+=Utils.myTrim(synDIDList) != ''?","+synImgID:synImgID;
        synDImgList+=Utils.myTrim(synDImgList) != ''?","+synImgItem:synImgItem;
      }
      
      var LabelIds = shopCar.detailLabelId.split(",")
      var detailListItem = {
        product_id: shopCar.productId,
        // detail_id: "",
        lbl_ids: LabelIds.join("-"),
        number: shopCar.num,
        price: shopCar.amount,
        amount: shopCar.amount,

        dtlid:synDIDList,
        dtlimage:synDImgList,
        // 0原价, 1优惠价, 2套装价, 3特价
        priceflag: 0,
      }
      detail = detail.concat(detailListItem)
    }

    var listItem = [{
      linkNo: that.data.linkNo,
      amount: that.data.temptotalDouble,
      companyId: app.data.agentCompanyId,
      // giftdetail: proDataInfo.giftId,
      userId: userId,
      // shareuserId: shareUserId,
      mobile: mobile,
      //设备或来源id
      sourceId: app.data.agentDeviceId > 0 ? app.data.agentDeviceId : "",
      // 收货地址id
      deliveryId: deliveryId,
      //座位号
      addr:that.data.agentPutAddress,
      // 预计送到时间
      deliverytime: that.data.showSelectDate.replace(" ", "|"),
      // 送货标识,0非立即送货1立即送货
      deliveryflag: deliveryflag,
      detail: detail,
      way: way,
      remarks: that.data.remarks,
      synimage: synImagesList,    
      synid:synidList,
    }]
    console.log(listItem)
    that.data.orderDatas = listItem[0]
    app.addSMOrderInfo(this, listItem);
  },

  /**
   * 提交订单回调
   * @param {*} orderId 
   * @param {*} tag 
   * @param {*} payNo 
   */
  gotoOrderDetailPage: function (orderId, tag, payNo) {
    if (tag == -1) {
      wx.showToast({
        title: "订单提交失败,稍后请重试",
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this
    that.setData({
      orderId: orderId,
      payNo: payNo,
      orderPTag: tag,
    })
    // 获取二维码生成图片
    that.getWXQRCode(orderId)

    var amount = that.data.totalDouble;

    that.nowpay(payNo, orderId, amount);
    return;
    // 方便测试使用
    // amount = 0
    //0元支付直接更新订单状态
    if (0 == amount) {
      setTimeout(function () {
        that.updateOrderStatus(orderId, amount)
      }, 1500)
    } else {
      that.nowpay(payNo, orderId, amount)
    }
  },

  startPay() {
    let that = this,amount = that.data.totalDouble;
    that.nowpay(that.data.payNo, that.data.orderId, amount)
  },

  //跳转
  gotoPage() {
    wx.navigateTo({
      url: '../addressDelivery/addressDelivery'
    })
  },

  /**
   * 选中日期
   */
  selectWeek(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectDateIndex = that.data.selectDateIndex
    if (selectDateIndex == index) {
      return
    }
    var reserveDates = that.data.reserveDates
    var selectTimeIndex = that.data.selectTimeIndex
    var showSelectDate = reserveDates[selectDateIndex].timeDate + " " + reserveDates[selectDateIndex].defaultTimes[selectTimeIndex].time + ":00"
    that.setData({
      selectDateIndex: index,
      showSelectDate: showSelectDate,
    })
  },
  /**
   * 选中时间点
   */
  selectTime(e) {
    var that = this
    var index = e.currentTarget.dataset.index

    var reserveDates = that.data.reserveDates
    var selectDateIndex = that.data.selectDateIndex
    var showSelectDate = reserveDates[selectDateIndex].timeDate + " " + reserveDates[selectDateIndex].defaultTimes[index].time + ":00"

    // 判断是否预定超过8小时
    var differenceHours = Utils.getTimeInterval(new Date().getTime(), showSelectDate, 1)
    var isReserveOverTime = false
    var totalDouble = that.data.totalDouble
    if (differenceHours >= that.data.reserveOverTime) {
      isReserveOverTime = true
      totalDouble = totalDouble - that.data.reserveoverTimeCutHow
      if (totalDouble < 0) {
        totalDouble = 0
      }
    } else {
      totalDouble = that.data.temptotalDouble
    }

    that.setData({
      selectTimeIndex: index,
      isReserveOverTime: isReserveOverTime,
      totalDouble: totalDouble,
      timeOut: false,
      showSelectDate: showSelectDate,
    })
  },

  //方法：显示选择优惠劵弹窗
  showSelCouponsPop() {
    this.setData({
      isShowSelCouponsPop: !this.data.isShowSelCouponsPop,
    })

    var couponsList = this.data.couponsList
    if (this.data.isShowSelCouponsPop) {

      var selectCoupons = this.data.selectCoupons

      for (let i = 0; i < selectCoupons.length; i++) {
        const element = selectCoupons[i];
        for (let j = 0; j < couponsList.length; j++) {
          const coupon = couponsList[j];
          if (element.keyid == coupon.keyid) {
            coupon.checked = true
            break
          }
        }
      }

    } else {

      // for (let j = 0; j < couponsList.length; j++) {
      //   const coupon = couponsList[j];
      //   coupon.checked = false
      // }

    }

    this.setData({
      couponsList: couponsList,
    })
  },
  /**
   * 选中优惠券
   */
  choseTxtColor(e) {
    var that = this,item=null;
    var index = e.currentTarget.dataset.index;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}

    if(Utils.isNotNull(item)){
      let checkValidObj=null,isValid=true;
      checkValidObj=that.checkCouponTimeValid(item);
      if(Utils.isNotNull(checkValidObj) && checkValidObj.result!=0){
        isValid=false;
        wx.showModal({
          title: '提示',
          content: checkValidObj.alertContent,
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

      if(isValid){
        var couponsList = that.data.couponsList
        for (let i = 0; i < couponsList.length; i++) {
          const element = couponsList[i];
          if (i == index) {
            element.checked = !element.checked
            // break
          } else {
            element.checked = false
          }
        }
    
        that.setData({
          couponsList,
        })
      }
    }    
  },

  /**
   * 全选
   */
  choseAll() {
    var that = this
    var couponsList = that.data.couponsList
    for (let i = 0; i < couponsList.length; i++) {
      const element = couponsList[i];
      element.checked = true

    }

    that.setData({
      couponsList: couponsList,
    })
  },

  /**
   * 确定优惠券
   */
  submitSelCoupons() {
    var selectCoupons = ''
    var couponsList = this.data.couponsList
    var discountSum = 0

    for (let j = 0; j < couponsList.length; j++) {
      const coupon = couponsList[j];
      if (coupon.checked) {
        selectCoupons = coupon
        discountSum = discountSum + coupon.discount
        break
      }
    }
    var totalDouble = this.data.temptotalDouble

    switch(selectCoupons.mold){
      //免费劵
      case 2:
        var shopCarList = this.data.shopCarList
        for (let i = 0; i < shopCarList.length; i++) {
          let shopCar = shopCarList[i]
          if (shopCar.productTypeId == selectCoupons.typeid) {
            discountSum = shopCar.amount / shopCar.num
            break
          }
        }
        totalDouble = totalDouble - discountSum;
        break;
      //指定价格券
      case 3:
        totalDouble = selectCoupons.discount;
        break;
      default:
        totalDouble = totalDouble - discountSum;
        break;
    }
    
    
    if (totalDouble < 0) {
      totalDouble = 0
    }
    totalDouble = totalDouble.toFixed(2)
    console.log(selectCoupons)
    this.setData({
      selectCoupons: selectCoupons,
      isShowSelCouponsPop: false,
      discountSum: discountSum,
      totalDouble: totalDouble,
    })
  },
  //页面跳转
  gotoCommonPage: function (e) {
    app.gotoCommonPageEvent(this, e);
  },
  TLstype() {
    this.setData({
      TLstype: !this.data.TLstype
    })
  },

  //方法：判断优惠劵有效期
  //返回：
  //result:1超额，2类型不对，3不在有效期，4原价较低
  checkCouponTimeValid:function(couponItem){
    let that=this,shopCarList=that.data.shopCarList;
    let result=0,alertContent="",resultObj=null;

    if(Utils.isNull(shopCarList) || shopCarList.length<=0){
      resultObj={result:0,alertContent:""}

      return resultObj;
    }
    if(couponItem.mold==3){
      let isMore=false,isMorePrice=false;
      //1、比较原价
      if(isComparePrice && couponItem.discount>that.data.temptotalDouble){
        result=4;
        isMorePrice=true;
        alertContent="对不起，该劵指定价大于原价！"
      }
      if(!isMorePrice){
        //2、检测是否超额     
        if(shopCarList.length>1){
          isMore=true;
          alertContent="对不起，该劵只适用单个商品限额1份！"
        }else if(shopCarList[0].num>1){
          isMore=true;
          alertContent="对不起，该劵只适用单个商品限额1份！"
        }
        if(isMore){
          result=1;
          resultObj={result:result,alertContent:alertContent}

          return resultObj;
        }
        //2、检测是否为对应分类
        if(shopCarList[0].productTypeId!=couponItem.typeid){
          result=2;
          alertContent="对不起，该劵不适用于该商品分类！"
          resultObj={result:result,alertContent:alertContent}

          return resultObj;
        }
        //3、检测有效期
        let validTimeObj=null;
        validTimeObj=app.checkCouponSetTimeValid(couponItem);
        switch(validTimeObj.result){
          case 0:
            break;
          default:
            result=3;
            alertContent="对不起，该劵只能在时段："+validTimeObj.couponStartTime+" ~ " + validTimeObj.couponEndTime +" 使用！";
            break;
        }
      }      
    }

    resultObj={result:result,alertContent:alertContent}

    return resultObj;
  },

  ////////////////////////////////////////////////////////////////////////////////////////
  //----充值免单部分-----------------------------------------------------------------------
  //事件：选择免单充值
  checkedFreeOrder:function(e){
    let that=this,isFreeOrder=!that.data.isFreeOrder,freeOrderRCList=that.data.freeOrderRCList,rechargeAmount=0.00;

    if(isFreeOrder && Utils.isNotNull(freeOrderRCList) && freeOrderRCList.length>0){
      rechargeAmount=freeOrderRCList[0].price;
    }
    that.setData({
      ["isFreeOrder"]: !that.data.isFreeOrder,
      ["rechargeAmount"]:rechargeAmount,
    })
  },
    ////////////////////////////////////////////////////////////////////////////////////////
  //----显示预览图片部分-----------------------------------------------------------------------
  changeTpe(e){
    var that = this,src="";
    try {
      src = e.currentTarget.dataset.src;
    } catch (e) {}
    that.setData({
      ImageyulanType: !that.data.ImageyulanType,
      preImgSrc:src,
    })
  }
})
// pages/shopcar/shopcar.js
// pages/storedetails/storedetails.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
var BJYURL = app.getUrlAndKey.url;
var appUserInfo = app.globalData.userInfo,
  sOptions = null,checkIsFullTag=0,payTag=3,isTestPrice =false;
//是否启用多种支付方式
let isUseMulitiPayfoPop=true;
//payTag:3小程序支付，4零元支付，5余额支付
Page({
  data: {
    sysName: app.data.sysName, //系统名称
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    carts: [], // 默认收货地址
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    isShowSelCouponsPop: false, //是否显示选择优惠劵弹窗
    showAddess: false,
    paymentdisabled: false,
    preorder: [{
        number: '1',
        text: '提交定金'
      },
      {
        number: '2',
        text: '支付定金'
      },
      {
        number: '3',
        text: '支付尾款'
      },
      {
        number: '4',
        text: '下单成功'
      }
    ],
    checkboxArr: [{
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      },
      {
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      },
      {
        discount: '10',
        endTime: '2019-09-24 ',
        content: '满10元可用',
        checked: false
      }

    ],
    showRemarkTeLabel: true,
    id: 0,
    couponsList: [], //订单可使用优惠券
    selectCoupons: null, //选中优惠券
    orderDatas: {},
    isHot: 1, //堂食外带 
    //当前设备投放位置
    agentPutAddress: app.data.agentPutAddress,
    // 是否是店内商品(饮品)
    isShop: false,
    // 支付引导
    isPaymentGuidance: false,
    randomNum: Math.random() / 9999,

    Sid:0,               //拼团抽奖期数ID
    orderId:"",          //订单ID
    productId:"",        //商品ID
    payNo:"",            //统一支付号
    orderType:0,         //订单类型：0普通订单，1拼团抽奖订单
    isGWOrderFull:0,       //拼团订单是否已满 
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      agentPutAddress: app.data.agentPutAddress,
    })
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this,
      paramShareUId = 0,
      isScene = false,
      dOptions = null;
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
        isTestPrice =appUserInfo.userId ==13118?true:false;
        var orderid = "",payNo = "",Sid,orderType=0,isGWOrderFull=0;
        try {
          if (Utils.isNotNull(sOptions.sid) && Utils.myTrim(sOptions.sid + "") != "") {
            Sid = parseInt(sOptions.sid);
            Sid=isNaN(Sid)?0:Sid;
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.type) && Utils.myTrim(sOptions.vtype + "") != "") {
            orderType = parseInt(sOptions.type);
            orderType = isNaN(orderType) ? 0 : orderType;
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.isf) && Utils.myTrim(sOptions.isf + "") != "") {
            isGWOrderFull = parseInt(sOptions.type);
            isGWOrderFull = isNaN(isGWOrderFull) ? 0 : isGWOrderFull;
          }
        } catch (e) {}
        try {
          if (sOptions.orderid != null && sOptions.orderid != undefined && Utils.myTrim(sOptions.orderid + "") != "") {
            orderid = Utils.myTrim(sOptions.orderid);
          }
        } catch (e) {}
        try {
          if (sOptions.payno != null && sOptions.payno != undefined && Utils.myTrim(sOptions.payno + "") != "") {
            payNo = Utils.myTrim(sOptions.payno);
          }
        } catch (e) {}
        that.setData({
          orderId: orderid,
          payNo: payNo,
          orderType:orderType,
          isGWOrderFull:isGWOrderFull,
          Sid:Sid,
        })

        this.queryOrderDetail();
        if (!Utils.isNull(app.data.updateCartsData)) {
          console.log('有选择')
          this.setData({
            carts: app.data.updateCartsData,
            showAddess: true,
          })
        } else {
          console.log('没选择')
          this.selectAddress();
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
  onShow: function () {
    // // yzq 修改选中非默认地址多次去选地址界面 来回切换
    // // if (!Utils.isNull(app.data.updateCartsData) && app.data.updateCartsData.id != this.data.carts.id) {
    // if (!Utils.isNull(app.data.updateCartsData)) {
    //   console.log('有选择')
    //   this.setData({
    //     carts: app.data.updateCartsData,
    //     showAddess: true,
    //   })
    // } else {
    //   console.log('没选择')
    //   this.selectAddress();
    // }
    // this.queryOrderDetail();

    var that = this;
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
        this.queryOrderDetail();
        if (!Utils.isNull(app.data.updateCartsData)) {
          console.log('有选择')
          this.setData({
            carts: app.data.updateCartsData,
            showAddess: true,
          })
        } else {
          console.log('没选择')
          this.selectAddress();
        }
        console.log("onShow ...")
      }
    }
  },
  onUnload: function () {
    console.log('页面卸载')
    app.data.updateCartsData = null;
  },

  //方法：默认选择相符的优惠券
  showMaxCoupons: function (data) {
    var couponsList = this.data.couponsList

    for (let i = 0; i < couponsList.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (couponsList[i].checked && data[j].keyid == couponsList[i].keyid) {
          data[j].checked = true
          break;
        }
      }
    }

    this.setData({
      couponsList: data,
      isShowSelCouponsPop: true
    })
  },
  //方法：只罗列最大额度优惠券并默认选择
  useOnlyMaxCoupon: function (data) {
    if (data.length == 0) {
      return
    }
    // 优惠卷额度
    var discount = 0.0;
    var index = -1;
    for (let i = 0; i < data.length; i++) {
      if (discount < data[i].discount) {
        index = i;
        discount = data[i].discount;
      }
    }
    if (index == -1) {
      return
    }
    data[index].checked = true;
    this.setData({
      couponsList: data
    })
  },
  //事件：显示可使用优惠劵选择弹窗
  showSelCouponsPop: function () {
    this.setData({
      showRemarkTeLabel: true
    })
    var that = this;
    if (!that.data.isShop && that.data.carts.length == 0) {
      wx.showModal({
        title: '提示',
        content: '您暂未添加收货地址，请先添加收货地址',
        confirmText: '添加',
        success(res) {
          if (res.confirm) {
            that.navigateNewAddress();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    that.queryCoupons(false);
  },
  //事件：隐藏可使用优惠券选择弹窗
  hideSelCouponsPop: function () {
    var couponsList = this.data.couponsList;
    var selectCoupons = this.data.selectCoupons;
    if (selectCoupons != null) {
      for (let i = 0; i < couponsList.length; i++) {
        if (couponsList[i].keyid == selectCoupons.keyid) {
          couponsList[i].checked = true;
        } else if (couponsList[i].checked) {
          couponsList[i].checked = false;
        }
      }
    }
    this.setData({
      couponsList: couponsList,
      isShowSelCouponsPop: false
    })
  },
  //事件：提交优惠券选择结果
  submitSelCoupons: function () {
    this.setData({
      showRemarkTeLabel: true
    })

    //所有订单
    var orders = this.data.orders;
    //初始化合计价格
    var orderDatas = this.data.orderDatas;
    orderDatas.paymentPrice = parseFloat(orderDatas.expressFee).toFixed(2);
    // 所有可以使用的优惠卷
    var couponsList = this.data.couponsList;
    // 能使用优惠卷的订单
    var orderList;

    //找出已选择使用的优惠卷
    var selectCoupons;
    for (let i = 0; i < couponsList.length; i++) {
      if (couponsList[i].checked) {
        selectCoupons = couponsList[i];
        this.setData({
          selectCoupons: selectCoupons
        })
        console.log("已选择使用的优惠卷selectCoupons=", this.data.selectCoupons)
        break;
      }
    }

    // 只有一个订单的情况
    if (orders.length == 1) {
      orderList = orders[0];
    }

    for (let i = 0; i < orders.length; i++) {
      var order = orders[i];
      order = this.orderPaymentPrice(order);
      if (!Utils.isNull(selectCoupons) && order.orderId == selectCoupons.orderId) {
        orderList = order;
      } else {
        orderDatas.paymentPrice = (parseFloat(orderDatas.paymentPrice) + parseFloat(order.paymentPrice)).toFixed(2);
      }
    }

    //可以使用优惠卷
    if (!Utils.isNull(selectCoupons)) {
      //算出总原价，然后使用优惠卷
      var sumPaymentPrice = 0
      //多件商品
      var productLists = orderList.detail
      for (let i = 0; i < productLists.length; i++) {
        var product = productLists[i];
        sumPaymentPrice = sumPaymentPrice + product.productprice * product.number
      }

      // yzq 使用优惠卷不分套装价和原价
      // orderList.paymentPrice = (orderList.amount - couponsList[i].discount).toFixed(2);
      // 解决有套装价时，使用优惠卷要用原价-优惠卷
      orderList.paymentPrice = (sumPaymentPrice - selectCoupons.discount).toFixed(2);

      console.log("使用优惠卷后:", orderList.paymentPrice)
      if (orderList.paymentPrice < 0) {
        orderList.paymentPrice = 0;
      }

      // 算出订单的 总支付价
      orderDatas.paymentPrice = (parseFloat(orderDatas.expressFee) + parseFloat(orderList.paymentPrice)).toFixed(2);
      console.log("加运费:" + orderDatas.expressFee + "后", orderDatas.paymentPrice)
      this.setData({
        orderDatas: orderDatas,
        isShowSelCouponsPop: false
      })
      return;
    }

    this.setData({
      orders: orders,
      orderDatas: orderDatas,
      selectCoupons: null,
      isShowSelCouponsPop: false
    })
  },



  /**
   * 算出每个订单的支付总金额
   */
  orderPaymentPrice: function (orderList) {
    var detail = orderList.detail
    var paymentPrice = 0;
    for (let i = 0; i < detail.length; i++) {
      var product = detail[i];
      paymentPrice = paymentPrice + (product.linkNo == 4 ? (product.orderstatus == 0 ? product.deposit * product.number : product.smallBalance * product.number) : product.amount)
    }
    orderList.paymentPrice = paymentPrice;
    //方便测试使用
    // orderList.paymentPrice = 0;
    return orderList;
  },

  navigateNewAddress: function () {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=2"
    });
  },
  navigateAddress: function (scene) {
    wx.navigateTo({
      url: "../shopadd/shopadd?scene=1"
    });
  },
  //查询默认收货地址
  selectAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_address&action=selectAddress&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log("查询默认收货地址" + URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (data.length > 0) {
            var defaultIndex = 0;
            for (let i = 0; i < data.length; i++) {
              data[i].area = data[i].area.split(',');
              if (data[i].selected) defaultIndex = i;
            }
            that.setData({
              carts: data[defaultIndex],
              showAddess: true
            })
          } else {
            that.setData({
              carts: [],
              showAddess: false
            })
          }
          console.log("查询默认收货地址：", that.data.carts)
        } else {
          app.setErrorMsg2(that, "查询默认收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '查询收货地址失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "查询默认收货地址失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        console.log("selectAddress 接口失败：" + err)
      }
    })
  },

  /**
   * 开始支付
   */
  startPay() {
    var that = this;
    switch(that.data.orderType){
      case 1:
        //是否拼满检测
        checkIsFullTag=0;
        that.checkGWIsFull();
        
        break;
      default:
        if (that.data.isShop) {
          that.setData({
            isPaymentGuidance: true,
          })
          return
        }
        that.analysisOrders()
        break;
    }
  },

  /**
   * 分析订单数组
   */
  analysisOrders: function () {
    var that = this;
    if (!that.data.isShop && that.data.carts.length == 0) {
      wx.showModal({
        title: '提示',
        content: '您暂未添加收货地址，请先添加收货地址',
        confirmText: '添加',
        success(res) {
          if (res.confirm) {
            that.navigateNewAddress();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }

    if (that.data.paymentdisabled == true) {
      console.log('禁用按钮')
      return;
    }
    that.setData({
      paymentdisabled: true,
      isPaymentGuidance: false,
    })

    var orders = that.data.orders;
    //普通订单需要检查库存
    if(that.data.orderType==0){
      for (let i = 0; i < orders.length; i++) {
        var order = orders[i];
        //检查库存
        for (let j = 0; j < order.detail.length; j++) {
          var detail = order.detail[j];
          if (Utils.isNull(detail.stock) || detail.stock <= 0) {
            wx.showToast({
              title: '商品库存不足',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              paymentdisabled: false
            })
            return;
          }
        }
        // 更新多个订单 
        that.updateOrder(order);
      }
    }
    

    //20200508 lixb变更0元支付判断条件
    var amount = that.data.orderDatas.amount,
      paymentPrice = that.data.orderDatas.paymentPrice;
    // if ((amount != null && amount != undefined && amount == 0) || (paymentPrice != null && paymentPrice != undefined && paymentPrice == 0)) {
    //   //0元支付处理
    //   app.data.updateCartsData = null;

    //   // 买饮品送按摩
    //   if (that.data.isShop) {
    //     that.getCanCoupons()
    //     return
    //   }
    //   var orderIds = []
    //   var orders = that.data.orders
    //   for (let index = 0; index < orders.length; index++) {
    //     const order = orders[index];
    //     orderIds.push(order.orderId)
    //   }
    //   wx.redirectTo({
    //     url: '../../../packageOther/pages/succeed/succeed?linkNo=' + that.data.orderDatas.linkNo + "&pid=" + that.data.orders[0].detail[0].pid + "&oid=" + orderIds.join(",")
    //   })
    //   return;
    // }
    that.nowpay();
  },
  //方法：更新订单——收货地址，如果为0元支付则更新支付状态
  updateOrder: function (order) {
    wx.showLoading({
      title: '正在加载中...',
    })
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + order.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    var deliveryId = 0
    if (!that.data.isShop) {
      deliveryId = that.data.carts.id
    }
    //way 71堂食 70外带
    urlParam = urlParam + "&remarks=" + that.data.remark + "&deliveryId=" + deliveryId + "&sign=" + sign + "&way=7" + that.data.isHot;

    //0元支付 直接修改订单状态等；不用调用支付接口
    if (that.data.selectCoupons != null && order.paymentPrice == 0) {
      urlParam += '&status=1&couponid=' + that.data.selectCoupons.keyid + '&amount=' + order.amount + "&store=1";
    } else if (order.paymentPrice == 0 || order.amount == 0) {
      urlParam += '&status=1&amount=' + order.amount + "&store=1";
    }

    console.log('更新订单信息URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更新订单信息', res)
        if (res.data.rspCode == 0) {} else {
          app.setErrorMsg2(that, "更新订单信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          that.setData({
            paymentdisabled: false
          })
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.setData({
          paymentdisabled: false
        })
        wx.hideLoading()
        wx.showToast({
          title: '更新订单信息失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "更新订单信息失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  //注册支付
  nowpay: function () {
    var that = this,isMulitiPayfor=false,price=that.data.orderDatas.paymentPrice,attach="";
    
    var orderDatas = that.data.orderDatas;
    // 支付标识  0支付 1预购支付  2尾款支付
    var payType = orderDatas.linkNo == 4 ? (orderDatas.status == 0 ? 1 : 2) : 0;
    payTag=Utils.isNull(that.data.orderDatas.paymentPrice) || that.data.orderDatas.paymentPrice<=0?4:payTag;
    switch(that.data.orderType){
      //拼团抽奖订单
      case 1:
        attach = '7_' + payType + '_' + app.data.hotelId + '_'+payTag+',' + that.data.orders[0].orderId;
        break;
      default:
        if (Utils.isNull(that.data.payNo)) {
          attach = '8_' + payType + '_' + app.data.hotelId + '_'+payTag+',' + that.data.orders[0].orderId;
        } else {
          attach = '9_' + payType + '_' + app.data.hotelId + '_'+payTag+',' + that.data.payNo;
        }
        break;
    }
    
    if (that.data.selectCoupons != null) {
      attach += '_' + that.data.selectCoupons.keyid;
    }
    console.log('attach:', attach)
    let payPopObj=null;
    payPopObj=that.selectComponent('#payPop');
    //如果启用多种支付方式且弹窗有效，而且不是0元支付
    if(isUseMulitiPayfoPop && Utils.isNotNull(payPopObj) && payTag!=4){
      let describe="",orders=that.data.orders,orderId="";
      if(Utils.isNotNull(orders) && orders.length>0){
        orderId=orders[0].orderId;
        describe=Utils.isNotNull(orders[0].detail) && orders[0].detail.length>0?orders[0].detail[0].productName:(orderType==0?"商品订单":"拼团抽奖订单");
      }
      //orderId：订单ID，
      //price：支付费用（单位：元），
      //attach：支付附加传递参数，例如：9_0_-6_3,20210323161054989
      //describe：支付描述,例如：红豆双皮奶
      payPopObj.showPayForPop(orderId,price,attach,describe);
    }else{
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
      price = (that.data.orderDatas.paymentPrice * 100).toFixed(0);
      //支付是否为测试价格1分钱
      price=isTestPrice?1:price;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      urlParam += "&body=" + encodeURIComponent("" + that.data.sysName + "-商城") + "&detail=" + encodeURIComponent("" + that.data.sysName + "-商城") + "&money=" + price + "&userId=" + app.globalData.userInfo.userId + "&openid=" + app.globalData.userInfo.wxopenId + "&attach=" + attach + "&sign=" + sign
      console.log(BJYURL + urlParam)
      wx.request({
        url: BJYURL + urlParam,
        success: function (res) {
          wx.hideLoading()
          if (res.data.rspCode == 0) {
            console.log("预支付获取成功", res.data)
            let appid="";
            if(Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.appid) && Utils.myTrim(res.data.data.appid) != ""){
              appid=Utils.myTrim(res.data.data.appid);
            }
            switch(appid){
              case "AppID":
                let success=0;
                if(Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.success)){
                  try{
                    success=parseInt(res.data.data.success);
                    success=isNaN(success)?-1:success;
                  }catch(e){}
                }
                if(success>=0){
                  //支付完成后的处理方法
                  that.dowithAfterPayfor();
                }else{
                  wx.showToast({
                    title: "支付失败，请重试！",
                    icon: 'none',
                    duration: 1500
                  })
                }
                break;
              default:
                that.setData({
                  paymentData: res.data.data,
                  paymentdisabled: false
                })
                checkIsFullTag=1;
                that.checkGWIsFull();
                break;
            }
          } else {
            app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 1500
            })
            that.setData({
              paymentdisabled: false
            })
          }
        },
        fail: function (err) {
          wx.hideLoading()
          that.setData({
            paymentdisabled: false
          })
          wx.showToast({
            title: "支付失败！",
            icon: 'none',
            duration: 1500
          })
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        }
      })
    }
  },
  //zhifu
  requestPayment: function () {
    wx.showLoading({
      title: '正在加载中...',
    })
    var that = this,reUrl="";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var singParm = "appId=" + that.data.paymentData.appid + "&nonceStr=" + that.data.paymentData.nonce_str + "&package=prepay_id=" + that.data.paymentData.prepay_id + "&signType=MD5&timeStamp=" + timestamp + "&key=" + app.data.hotelKey;
    var sign = MD5JS.hexMD5(singParm);
    wx.requestPayment({
      'timeStamp': "" + timestamp,
      'nonceStr': that.data.paymentData.nonce_str,
      'package': 'prepay_id=' + that.data.paymentData.prepay_id,
      'signType': 'MD5',
      'paySign': sign,
      success: function (res) {
        //支付完成后的处理方法
        that.dowithAfterPayfor();
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("支付发起失败", res);
      }
    })
  },
  //方法：支付完成后的处理方法
  dowithAfterPayfor:function(){
    let that=this,reUrl="";
    app.data.updateCartsData = null;
        
    switch(that.data.orderType){
      //拼团抽奖订单
      case 1:
        reUrl='../../../packageYK/pages/particulars/particulars?ot=1&oid='+that.data.orderId + "&pid=" + that.data.orders[0].detail[0].product_id;
        console.log(reUrl)
        if(that.data.isGWOrderFull==1){
          if(app.data.isOpenGWPrize){
            try{
              let otherGWParam="&userId="+appUserInfo.userId +"&xcxAppId="+app.data.wxAppId;
              app.setGWPrizeResult(that,otherGWParam);
            }catch(e){}                
          }
        }
        wx.redirectTo({
          url: reUrl
        })
        
        break;
      //其他订单
      default:
        // 买饮品送按摩
        if (that.data.isShop) {
          that.getCanCoupons()
          return
        }
        var orderIds = []
        var orders = that.data.orders
        for (let index = 0; index < orders.length; index++) {
          const order = orders[index];
          orderIds.push(order.orderId)
        }
        reUrl='../../../packageOther/pages/succeed/succeed?linkNo=' + that.data.orderDatas.linkNo + "&pid=" + that.data.orders[0].detail[0].pid + "&oid=" + orderIds.join(",");
        console.log(reUrl)
        wx.redirectTo({
          url: reUrl
        })
        break;
    }
  },
  //方法：组件调用支付完成方法
  onCompontDowithAfterPayfor:function(e){
    let that=this,reUrl="";
    app.data.updateCartsData = null;
        
    switch(that.data.orderType){
      //拼团抽奖订单
      case 1:
        reUrl='../../../packageYK/pages/particulars/particulars?ot=1&oid='+that.data.orderId + "&pid=" + that.data.orders[0].detail[0].product_id;
        console.log(reUrl)
        if(that.data.isGWOrderFull==1){
          if(app.data.isOpenGWPrize){
            try{
              let otherGWParam="&userId="+appUserInfo.userId +"&xcxAppId="+app.data.wxAppId;
              app.setGWPrizeResult(that,otherGWParam);
            }catch(e){}                
          }
        }
        wx.redirectTo({
          url: reUrl
        })
        
        break;
      //其他订单
      default:
        // 买饮品送按摩
        if (that.data.isShop) {
          that.getCanCoupons()
          return
        }
        var orderIds = []
        var orders = that.data.orders
        for (let index = 0; index < orders.length; index++) {
          const order = orders[index];
          orderIds.push(order.orderId)
        }
        reUrl='../../../packageOther/pages/succeed/succeed?linkNo=' + that.data.orderDatas.linkNo + "&pid=" + that.data.orders[0].detail[0].pid + "&oid=" + orderIds.join(",");
        console.log(reUrl)
        wx.redirectTo({
          url: reUrl
        })
        break;
    }
  },
  //查询订单详情
  queryOrderDetail: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_order&action=QueryOrders" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.userInfo.userId + "&orderId=" + that.data.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    if (!Utils.isNull(that.data.payNo)) {
      urlParam = urlParam + "&payNo=" + that.data.payNo;
    }
    urlParam = urlParam + "&sign=" + sign;
    // urlParam = urlParam +"&status=1,2,3&pIndex=1&pSize=20&sField=sort&sOrder=desc"+ "&sign=" + sign;
    console.log('查询订单详情URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询订单详情11:', res)
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          var orderDatas = that.data.orderDatas;

          //********************************** yzq算出运费和要支付的总价****************************
          //算出运费 (多件商品 取最大的运费)
          var expressFee = 0;
          // 配送方式
          var expressCompanyName;
          //算出要支付的总价
          var paymentPrice = 0;
          // 订单类型 4是预售
          var linkNo = 4;
          // 订单状态 12=已交定金，待付尾款
          var status = 12;
          // 总定金
          var sumDeposit = 0;
          // 总尾款
          var sumSmallBalance = 0;
          // 支付尾款开始时间
          var finalPayMentStartDate;
          // 支付尾款截止时间
          var finalPayMentEndDate;
          // 是否到了付尾款时间 0=尾款支付没开始
          var finalStartExpire = 0;
          for (let i = 0; i < data.length; i++) {
            var order = data[i];
            linkNo = order.linkNo;
            status = order.status
            for (let j = 0; j < order.detail.length; j++) {
              var orderDatail = order.detail[j];
              finalStartExpire = orderDatail.finalStartExpire;
              finalPayMentEndDate = orderDatail.finalPayMentEndDate;
              finalPayMentStartDate = orderDatail.finalPayMentStartDate;
              // 算出尾款(原价-定金)
              orderDatail.smallBalance = orderDatail.productprice - orderDatail.deposit;
              sumDeposit = sumDeposit + orderDatail.deposit * orderDatail.number;
              sumSmallBalance = (parseFloat(sumSmallBalance) + parseFloat(orderDatail.smallBalance) * parseFloat(orderDatail.number)).toFixed(2)
              if (expressFee < orderDatail.expressFee) {
                expressFee = orderDatail.expressFee;
              }
              // 备注
              if (!Utils.isNull(orderDatail.remark)) {
                that.setData({
                  remark: orderDatail.remark,
                })
              }
              // 配送方式
              if (Utils.isNull(orderDatail.expressCompanyName)) {
                orderDatail.expressCompanyName = "无"
              }

              if (Utils.isNull(orderDatail.attributeOne)) {
                orderDatail.attributeOne = ""
              }
              if (Utils.isNull(orderDatail.attributeTwo)) {
                orderDatail.attributeTwo = ""
              }

              var isSofe = orderDatail.isSofe + ""
              var isShop = that.data.isShop
              if (isSofe.indexOf("80") == 0 || isSofe.indexOf("81") == 0) {
                isShop = true
              }

              expressCompanyName = orderDatail.expressCompanyName;
              paymentPrice = paymentPrice + (orderDatail.linkNo == 4 ? (orderDatail.orderstatus == 0 ? orderDatail.deposit * orderDatail.number : orderDatail.smallBalance * orderDatail.number) : orderDatail.amount)
            }
          }
          orderDatas.expressFee = expressFee
          orderDatas.linkNo = linkNo
          orderDatas.finalStartExpire = finalStartExpire
          orderDatas.status = status
          orderDatas.finalPayMentEndDate = finalPayMentEndDate;
          orderDatas.finalPayMentStartDate = finalPayMentStartDate
          orderDatas.sumDeposit = sumDeposit
          orderDatas.sumSmallBalance = sumSmallBalance
          orderDatas.paymentPrice = parseFloat(paymentPrice).toFixed(2)
          orderDatas.expressCompanyName = expressCompanyName
          //********************************** yzq算出运费和要支付的总价end****************************

          that.setData({
            orders: data,
            orderDatas: orderDatas,
            isShop: isShop,
          })

          // 只有一个订单的情况 且是特价商品时
          var orders = that.data.orders;
          var isQueryCoupons = true;
          if (orders.length == 1) {
            var orderList = orders[0];
            orderList = that.orderPaymentPrice(orderList);
            for (let i = 0; i < orderList.detail.length; i++) {
              var orderDatail = order.detail[i];
              // priceflag价格标示0原价,1优惠价,2套装价,3特价 
              if (orderDatail.priceflag == 3) {
                isQueryCoupons = false;
                break;
              }
            }
            that.setData({
              orders: orders,
            })
          }
          //如果订单总金额小于等于0元，则不显示优惠券
          isQueryCoupons=orderDatas.paymentPrice<=0.00?false:isQueryCoupons;
          //20210316 产品说拼团抽奖订单涉及退款，使用优惠券不好弄，所以拼团订单屏蔽优惠券
          isQueryCoupons=that.data.orderType==1?false:isQueryCoupons;
          if (orderDatas.linkNo == 4 && orderDatas.status == 0) {
            // 支付定金
          } else if (orderDatas.linkNo == 4 && orderDatas.finalStartExpire == 0) {
            // 尾款未开始
          } else if (isQueryCoupons) {
            that.queryCoupons(true)
          }
        } else {
          app.setErrorMsg2(that, "查询订单详情！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
          title: '查询订单详情失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "查询订单详情！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        console.log("queryOrderDetail 接口失败：" + JSON.stringify(err))
      }
    })
  },

  //方法：查询优惠券
  queryCoupons: function (isMax) {
    wx.showLoading({
      title: '正在加载中...',
    })
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + app.globalData.userInfo.userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&orderId=" + that.data.orderId + "&isUsed=0";
    if (isMax) {
      urlParam = urlParam + "&ismax=0";
    }
    if (!Utils.isNull(that.data.payNo)) {
      urlParam = urlParam + "&payNo=" + that.data.payNo;
    }
    console.log('查询可使用优惠券:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询可使用优惠券:', res)
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data[i].checked = false;
            }
            if (isMax) {
              that.useOnlyMaxCoupon(data);
              // yzq 修改使用了优惠卷 然后切换收货地址。用原价-优惠卷价
              that.submitSelCoupons()
            } else {
              that.showMaxCoupons(data)
            }
          } else {
            that.submitSelCoupons()
          }
        } else {
          app.setErrorMsg2(that, "查询可使用优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
        wx.hideLoading()
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '查询优惠券失败！',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "查询可使用优惠券！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        console.log("queryCoupons 接口失败：" + JSON.stringify(err))
      }
    })
  },

  choseTxtColor: function (e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    var couponsList = this.data.couponsList;
    for (let i = 0; i < couponsList.length; i++) {
      if (i == index) {
        couponsList[index].checked = !couponsList[index].checked;
      } else {
        couponsList[i].checked = false;
      }
    }
    this.setData({
      couponsList: couponsList
    })
  },
  // 选择优惠劵
  radio: function (e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr = this.data.checkboxArr; //选项集合
    if (checkboxArr[index].checked) return; //如果点击的当前已选中则返回
    checkboxArr.forEach(item => {
      item.checked = false
    })
    checkboxArr[index].checked = true; //改变当前选中的checked值
    this.setData({
      checkboxArr: checkboxArr
    });
  },
  selectCoupons: function () {

  },
  radioChange: function (e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },

  changeValueData: function (e) {
    // 获取输入框的内容
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 焦点触发 切换为textarea框
   */
  hideRemarkText: function () {
    this.setData({
      showRemarkTeLabel: false
    })
  },

  /**
   * 赠品 事件
   */
  showpopgigt: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var detail = e.currentTarget.dataset.item;

    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_goodtype&action=QueryProductGift&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&detailId=" + detail.gdetailId + "&sign=" + sign;
    console.log('查询赠品信息:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        // 格式化赠品商品图片
        for (let i = 0; i < data.length; i++) {
          var photoData = data[i];
          if (!Utils.isNull(photoData.detailPhotos)) {
            var images = photoData.detailPhotos.split(",");
            data[i].detailPhotos = images;
          }
          if (!Utils.isNull(photoData.productphotos)) {
            var images = photoData.productphotos.split(",");
            data[i].productphotos = images;
          }
        }

        that.setData({
          // 赠品商品详情
          giftDetail: data,
          showpopgift: true,
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    var that = this;
    app.viewImg(e);
  },
  hidepopgigt: function () {
    this.setData({
      showpopgift: false
    })
  },
  /**
   * 更新个订单
   */
  updateOrders: function (e) {
    var that = this;
    console.log(e)
    var orders = e.currentTarget.dataset.item;
    var status = e.currentTarget.dataset.status;
    var content = "确定要取消订单吗?支付的定金将不会退回";
    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          for (let i = 0; i < orders.length; i++) {
            var order = orders[i];
            that.requestUpdateOrderStatus(status, order);
          }
        } else if (res.cancel) {}
      }
    })

  },

  /**
   * 更新订单
   */
  requestUpdateOrderStatus: function (status, order) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("id", order.orderId)
    var urlParam = "cls=product_order&action=UpdateOrders&appId=" + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + order.orderId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&status=" + status + "&sign=" + sign;
    console.log('更新订单 URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更新订单', res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: "取消订单成功",
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          app.setErrorMsg2(that, "更新订单 地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '更新订单地址失败',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "更新订单 地址失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        console.log("requestUpdateOrderStatus 接口失败：" + JSON.stringify(err))
      }
    })
  },
  
  /**
   * 切换堂食/外带
   */
  isHottype(e) {
    this.setData({
      isHot: e.currentTarget.dataset.num
    })
  },

  /**
   * 获取饮品支付成功按摩的优惠券
   */
  getCanCoupons() {
    var that = this
    var orderIds = []
    var orders = that.data.orders
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      orderIds.push(order.orderId)
    }
    var urlParam = "cls=product_coupons&action=QueryCanCoupons"
    var otherParam = "&userId=" + appUserInfo.userId + "&companyId=" + app.data.agentCompanyId + "&orderId=" + orderIds.join(",") + "&flag=0&mold=20"
    app.doGetData(this, app.getUrlAndKey.smurl, urlParam, otherParam, 0, "获取饮品支付成功按摩的优惠券")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            that.gotoPaySuccessPage();
            break
        }
        break;
      default:
        console.log(error)
        switch (tag) {
          case 0:
            that.gotoPaySuccessPage();
            break
        }
        break
    }
  },
  //方法：跳转支付成功页面
  gotoPaySuccessPage() {
    let that = this,orderId = that.data.orders[0].orderId,url="";
    url="/packageOther/pages/successDetailspa/successDetailspa?oid=" + orderId;

    wx.redirectTo({
      url: url
    })
  },
  /////////////////////////////////////////////////////////////////////////////
  //方法：检测是否拼满
  checkGWIsFull:function(){
    let that=this,orders=that.data.orders;
    if(Utils.isNotNull(orders) && orders.length>0  && Utils.isNotNull(orders[0].detail) && orders[0].detail.length>0){
      let pid=orders[0].detail[0].product_id,otherParams="",orderNumber=0;
      try{
        orderNumber=parseInt(orders[0].detail[0].number);
        orderNumber=isNaN(orderNumber)?1:orderNumber;
      }catch(e){}
      that.data.orderNumber=orderNumber;
      otherParams="&pid="+pid;
      otherParams+=that.data.Sid>0?"&sid="+that.data.Sid:"";
      let isHaveSid=that.data.Sid>0?true:false;
      app.getGWProductList(that,isHaveSid,otherParams,100,1);
    }
  },
  //方法：获取拼团商品列表结果处理函数
  dowithGetGWProductList: function (dataList, tag, errorInfo,pageIndex) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团商品列表获取结果：");
        console.log(dataList);
        let totalNum=0,cnt=0;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null;
          dataItem = dataList[0];
          
          if (Utils.isNotNull(dataItem.totalNum) && Utils.myTrim(dataItem.totalNum + "") != "") {
            try {
              totalNum = parseInt(dataItem.totalNum);
              totalNum = isNaN(totalNum) ? 0 : totalNum;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.cnt) && Utils.myTrim(dataItem.cnt + "") != "") {
            try {
              cnt = parseInt(dataItem.cnt);
              cnt = isNaN(cnt) ? 0 : cnt;
            } catch (err) {}
          }
        }
        if(totalNum>0 && (totalNum-cnt)>=that.data.orderNumber){
          switch(checkIsFullTag){
            case 0:
              wx.showModal({
                title: '温馨提示',
                content: '此商品为活动特价商品，非质量问题，暂不支持退换货！',
                confirmText:"好的",
                cancelText:"不再提示",
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    if (that.data.isShop) {
                      that.setData({
                        isPaymentGuidance: true,
                      })
                      return
                    }
                    that.analysisOrders()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              break;
            case 1:
              that.requestPayment();
              break;
          }          
        }else{
          wx.showToast({
            title: "对不起，该期已拼满！",
            icon: 'none',
            duration: 2000
          })
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团产品列表失败！";
        wx.showToast({
          title: "拼满检测失败！",
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
})
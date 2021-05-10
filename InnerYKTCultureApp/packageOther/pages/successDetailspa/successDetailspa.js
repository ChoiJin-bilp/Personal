// packageOther/pages/successDetailspa/successDetailspa.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
const util = require('../../../utils/util.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url,SMURL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,sOptions = null,
  defaultItemImgSrc = DataURL + app.data.defaultImg;
var mainPackageUrl = "../../../pages",isGetOrder=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isLoad: false,             //是否已经加载
    loginType:0,               //登录类型：0支付加载，1查询加载
    // 可领取优惠券查询 付款成功
    mold: "20",
    // 按摩优惠券
    AnMoCoupons: [],
    num: 0,
    orderId: "",
    order: "",
    showTips: false,
    // 打印图案
    synimageList: [],

    isMultipleCoupon: false,
    payGetCheirapsisList: [],
    synimage: "https://e.amjhome.com//baojiayou/tts_upload/6796/20210105/s_tts_6796_20210105163947_646.jpg",

    synRecordId:0,
    orderCouponId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   * 参数说明：
   * oid：订单号
   * srid：按摩组合劵ID
   * lp：0订单支付登录，1查询登录
   */
  onLoad: function (options) {
    let that=this;
    sOptions=options;
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
    var that = this,isMultipleCoupon = false,mlst = 0;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        let loginType=0,synRecordId=0,orderCouponId="";
        try {
          if (Utils.isNotNull(sOptions.mlst)){
            mlst = parseInt(sOptions.mlst);
            mlst = isNaN(mlst) ? 0 : mlst;
          }            
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.lp)){
            loginType = parseInt(sOptions.lp);
            loginType = isNaN(loginType) ? 0 : loginType;
          }            
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.cpid)){
            orderCouponId = Utils.myTrim(sOptions.cpid);
          }            
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.srid)){
            synRecordId = parseInt(sOptions.srid);
            synRecordId = isNaN(synRecordId) ? 0 : synRecordId;
          }            
        } catch (e) {}
        that.setData({
          orderId: sOptions.oid,
          // 0不显示按摩券
          showcoupon: Utils.isNotNull(sOptions.showcoupon) ? sOptions.showcoupon : null,
          companyId: Utils.isNotNull(sOptions.companyId) ? sOptions.companyId : null,
    
          ["loginType"]:loginType,
          ["synRecordId"]:synRecordId,
          ["orderCouponId"]:orderCouponId,
        })
        that.useCoupons();
        //如果为组合按摩劵商品订单支付成功
        if (synRecordId>0) {
          //变更组合按摩劵的状态
          that.setPayRecordInfo(that.data.synRecordId, 1);
        } else {
          //获取购买饮品的按摩劵，并获取订单信息
          that.getCanCoupons(that.data.loginType)
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
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;

    let that=this;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) 
        return;
      else{
        //刷新按摩劵记录（主要获取最新的使用状态）
        that.getCanCoupons(1);
      }      
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：设置我已使用过的打印图片
  setMyUsedPrintImgInfo:function(imgIdList){
    let that=this,otherParams="";
    //图片ID序列不为空且为支付加载才设置
    if(Utils.myTrim(imgIdList)!="" && that.data.loginType==0){
      otherParams+="&imageId="+imgIdList+"&orderId="+that.data.orderId;
      app.setMyUsedPrintImgInfo(that,otherParams);
    }
  },
  //方法：设置我使用过打印图片结果处理函数
  dowithSetMyUsedPrintImgInfo: function (dataList, tag, errorInfo) {
    let that = this,
      selProcuctTypeList = [],
      lastIndex = 0;
    switch (tag) {
      case 1:
        console.log("设置我使用过打印图片结果：");
        console.log(dataList);
        
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "设置我使用过打印图片失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /**
   * 查询订单详情
   */
  queryOrders() {
    var that = this,orderId = that.data.orderId,userId = appUserInfo.userId
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "",otherParams="";
    otherParams+="&userId=" + userId + "&orderId=" + orderId;
    timestamp = timestamp / 1000;
    urlParam = "cls=product_order&action=QueryOrdersNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pSize=1000&pIndex=1&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("订单查询结果：")
        console.log(res.data)
        that.data.isLoad = true;
        isGetOrder=true;
        if (res.data.rspCode == 0 && res.data.list != null && res.data.list != undefined) {
          var data = res.data.list, dataItem = null, listItem = null, articles = [],synid="";
          var order = data[0]
          if (Utils.isDBNotNull(order.synid)) {
            synid=order.synid;
          }
          if (Utils.isNull(order.synimage)) {
            order.synimage = ""
          }
          let synimageList=order.synimage.split(",");
          
          if (Utils.isNull(order.area)) {
            order.area = order.oaddr
          }
          if (Utils.isNull(order.remarks)) {
            order.remarks = ""
          }
          if (!Utils.isNull(order.name)) {
            let names = order.name.split(",")
            order.oname = names[0] + "(" + names[1] + ")"
          }
          var sum = 0
          if (!Utils.isNull(order.payamount)) {
            sum = order.payamount
          }
          // 优惠券
          order.coupons=[];
          order.coupondiscount = 0;

          // 合计总价
          order.sum = parseFloat(sum).toFixed(2)
          order.detail=[];
          that.setData({
            order: order,
            synimageList: synimageList,
          })
          that.getOrderDetailByOId(order.orderId);
          that.getOrderCouponByOId(order.orderId);
          that.setMyUsedPrintImgInfo(synid);

          if (that.data.showTips) {
            if (!Utils.isNull(app.data.agentDeviceId) && app.data.agentDeviceId > 0) {
              wx.showModal({
                title: '提示',
                content: "已成功下单,您已获得赠送的按摩券,如需使用,请戴好脚套后点击开始按摩",
                cancelText: "稍后再说",
                cancelColor: "#c6c6c6",
                confirmText: "开始按摩",
                confirmColor: "#333333",
                success(res) {
                  if (res.confirm) {
                    that.useMyAward(null);
                  } else if (res.cancel) {}
                }
              })
            }
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取信息列表：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.hideLoading();
        wx.showToast({
          title: "获取信息列表接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取信息列表接口调用失败：出错：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  //方法：获取订单详情
  getOrderDetailByOId: function (orderId) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_order&action=QueryOrdersDetailNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&orderId=" + orderId + "&sign=" + sign;
    console.log('查询订单详情URL:'+SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("查询订单详情结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
            let dataItem=null,imagesArray=null,dp="";
            for (let i = 0; i < res.data.data.length; i++) {
              dataItem=null;dataItem=res.data.data[i];
              dp="";
              if (Utils.isNull(dataItem.attributeOne)) {
                dataItem.attributeOne = ""
              }
              if (Utils.isNull(dataItem.attributeTwo)) {
                dataItem.attributeTwo = ""
              }
              //图片处理
              
              if (Utils.isDBNotNull(dataItem.detailPhotos)){
                dp = dataItem.detailPhotos;
              }
              if (!Utils.isNull(dp)) {
                imagesArray=null;imagesArray = dp.split(",");
                dataItem.detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
              }
              res.data.data[i]=dataItem;
            }

            that.setData({
              ["order.detail"]: res.data.data,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.rspMsg,
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          app.setErrorMsg2(that, "查询订单详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try{
          wx.hideLoading();
        }catch(e){}
        
        wx.showToast({
          title: "查询订单详情接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "查询订单详情接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取订单优惠劵
  getOrderCouponByOId: function (orderId) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_order&action=QueryOrderCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&orderId=" + orderId + "&sign=" + sign;
    console.log('查询订单优惠劵URL:'+SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("查询订单优惠劵结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
            let dataItem=null,discount=0;
            let coupondiscount = 0;
            for (let i = 0; i < res.data.data.length; i++) {
              dataItem=null;dataItem=res.data.data[i];
              if (Utils.isDBNotNull(dataItem.discount)){
                try{
                  discount=parseInt(dataItem.discount);
                  discount=isNaN(discount)?0:discount;
                }catch(e){}
                coupondiscount += discount;
              }
            }

            that.setData({
              ["order.coupons"]:res.data.data,
              ["order.coupondiscount"]: coupondiscount,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.rspMsg,
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          app.setErrorMsg2(that, "查询订单详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try{
          wx.hideLoading();
        }catch(e){}
        
        wx.showToast({
          title: "查询订单详情接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "查询订单详情接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  /**
   * 获取饮品支付成功按摩的优惠券
   */
  getCanCoupons(loginType) {
    let that = this,orderId = that.data.orderId,otherParam="";
    // 测试环境
    // orderId = "20201109182144185"

    if (app.data.isPayforFreeCheirapsis) {
      let urlParam = "cls=product_coupons&action=QueryCanCoupons";
      otherParam = "&userId=" + appUserInfo.userId + "&companyId=" + app.data.companyId + "&orderId=" + orderId + "&flag=0&mold=20"
      app.doGetData(this, app.getUrlAndKey.smurl, urlParam, otherParam, 1, "获取饮品支付成功按摩的优惠券")
    } else {
      if(loginType==0){
        //获取商品送劵按摩记录
        otherParam = "&xcxAppId=" + app.data.wxAppId + "&operation=add&orderonlyone=1";
        otherParam += "&orderNo=" + orderId;
        app.getProductCheirapsisCouponList(that, otherParam);
      }else{
        //获取商品所拥有的按摩记录
        otherParam = "&xcxAppId=" + app.data.wxAppId + "&duration=0&isCancelShare=0&userId=" + appUserInfo.userId + "&isUse=0&orderField=createDate";
        otherParam += "&orderNo=" + orderId;
        app.getShareStatData(that, otherParam, 1000000, 1);
      }
    }
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取商品所拥有的按摩记录信息：")
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          that.setData({
            isMultipleCoupon: true,
            payGetCheirapsisList: dataList.dataList,
            num: dataList.dataList.length,
          })
        }
        
        break;

      default:
        break;
    }
    that.queryOrders();
  },

  //方法：获取商品送劵按摩记录结果处理函数
  dowithGetProductCheirapsisCouponList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取商品送劵按摩记录列表信息：")
        console.log(dataList);
        if (Utils.isNotNull(dataList)) {
          if (Utils.isNotNull(dataList.resultMap) && dataList.resultMap.length > 0) {
            that.setData({
              isMultipleCoupon: true,
              payGetCheirapsisList: dataList.resultMap,
              num: dataList.resultMap.length,
            })
          }
        }
        
        break;

      default:
        break;
    }
    that.queryOrders();
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            that.data.isLoad=true;
            isGetOrder=true;
            if (data.length > 0) {
              var order = data[0]
              if (Utils.isNull(order.synimage)) {
                order.synimage = ""
              }
              var synimageList = order.synimage.split(",")
              if (Utils.isNull(order.area)) {
                order.area = order.oaddr
              }
              if (Utils.isNull(order.remarks)) {
                order.remarks = ""
              }
              if (!Utils.isNull(order.name)) {
                let names = order.name.split(",")
                order.oname = names[0] + "(" + names[1] + ")"
              }
              var sum = 0
              if (!Utils.isNull(order.payamount)) {
                sum = order.payamount
              }
              for (let index = 0; index < order.detail.length; index++) {
                const element = order.detail[index];
                if (Utils.isNull(element.attributeOne)) {
                  element.attributeOne = ""
                }
                if (Utils.isNull(element.attributeTwo)) {
                  element.attributeTwo = ""
                }
                //图片处理
                var dp = element.detailPhotos
                if (Utils.isNull(dp)) {
                  dp = element.productPhotos
                }
                if (!Utils.isNull(dp)) {
                  var imagesArray = dp.split(",");
                  element.detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
                }
              }

              var coupondiscount = 0
              // 优惠券价格
              for (let i = 0; i < order.coupons.length; i++) {
                const element = order.coupons[i];
                coupondiscount = coupondiscount + element.discount
              }
              order.coupondiscount = coupondiscount

              // 合计总价
              order.sum = parseFloat(sum).toFixed(2)

              that.setData({
                order: order,
                synimageList: synimageList,
              })

              if (that.data.showTips) {
                if (!Utils.isNull(app.data.agentDeviceId) && app.data.agentDeviceId > 0) {
                  wx.showModal({
                    title: '提示',
                    content: "已成功下单,您已获得赠送的按摩券,如需使用,请戴好脚套后点击开始按摩",
                    cancelText: "稍后再说",
                    cancelColor: "#c6c6c6",
                    confirmText: "开始按摩",
                    confirmColor: "#333333",
                    success(res) {
                      if (res.confirm) {
                        that.useMyAward(null);
                      } else if (res.cancel) {}
                    }
                  })
                }
              }
            }
            break
          case 1:
            console.log("获取商品相关按摩记录列表信息：")
            console.log(data)
            if (data.length > 0) {
              // 显示多张
              if (data.length > 0) {
                that.setData({
                  isMultipleCoupon: true,
                  payGetCheirapsisList: data,
                  num: data.length,
                })
              }
            }
            that.queryOrders();
            break
          case 7:
            break;
        }
        break;
      default:
        console.log(error)
        switch (tag) {
          case 1:
            that.queryOrders()
            break;
          case 7:
            wx.showToast({
              title: "优惠劵更新失败！",
              icon: 'none',
              duration: 2000
            })
            break;
        }
        break
    }
  },

  useMyAward: function (e) {
    let that = this,isSingle = true,item = null,chgTag=0,url = "";
    if (Utils.isNotNull(e)) {
      let tag = 0;
      try {
        tag = parseInt(e.currentTarget.dataset.tag);
        tag = isNaN(tag) ? 0 : tag;
      } catch (e) {}
      try {
        chgTag = parseInt(e.currentTarget.dataset.chg);
        chgTag = isNaN(chgTag) ? 0 : chgTag;
      } catch (e) {}
      if (tag == 1) {
        try {
          item = e.currentTarget.dataset.item;
        } catch (e) {}
      }
      if (Utils.isNotNull(item)){
        app.data.agentDeviceId=chgTag==1?0:app.data.agentDeviceId;

        let vSTCCommentObj = null;
        vSTCCommentObj = that.selectComponent('#vSTCComment');
        //如果启用按摩条件检测
        if (Utils.isNotNull(vSTCCommentObj)) {
          vSTCCommentObj.checkCheirapsisCondition(app.data.agentDeviceId, item.id, item.duration, 0.00, 0,0);
        }else{
          url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&id=" + item.id + "&mcnt=" + item.duration + "&sqy=1&did=" + app.data.agentDeviceId;
          wx.navigateTo({
            url: url,
          });
        }  
        
      } 
    }
  },
  //事件：判断按摩结束操作
  onCompontDowithAfterCheckCondition:function(e){
    let that=this,id=0, minuteCnt=0, cashback_price=0.00, pfTag=0,chDeviceTag=0;
    console.log("onCompontDowithAfterCheckCondition 参数：")
    console.log(e)
    try {
      id = parseInt(e.detail.id);
      id = isNaN(id) ? 0 : id;
    } catch (e) { }
    try {
      minuteCnt = parseInt(e.detail.minuteCnt);
      minuteCnt = isNaN(minuteCnt) ? 0 : minuteCnt;
    } catch (e) { }
    try {
      cashback_price = parseFloat(e.detail.cashback_price);
      cashback_price = isNaN(cashback_price) ? 0 : cashback_price;
    } catch (e) { }
    try {
      pfTag = parseInt(e.detail.pfTag);
      pfTag = isNaN(pfTag) ? 0 : pfTag;
    } catch (e) { }
    try {
      chDeviceTag = parseInt(e.detail.chDeviceTag);
      chDeviceTag = isNaN(chDeviceTag) ? 0 : chDeviceTag;
    } catch (e) { }
    that.gotoCheirapsisPage(id, minuteCnt, cashback_price, pfTag,chDeviceTag);
  },
  //事件：跳转按摩器使用页面
  gotoCheirapsisPage: function (id, mincnt, cashback_price, isPayfor,chDeviceTag) {
    let that = this, url = "";
    //按摩记录信息记载
    let allCash=cashback_price,idlist=id,pf=isPayfor;
    allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
    idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
    pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
    
    app.data.operateRecordItem = { id: id, mincnt: mincnt, cash: allCash, pf: pf,tag:0,idlist:idlist }
    url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&id=" + id + "&mcnt=" + mincnt + "&did=" + app.data.agentDeviceId + "&sqy=1&cash=" + allCash + "&pf=" + pf;
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
  emptyType() {
    this.setData({
      ImageyulanType: false
    })
  },
  changeTpe(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (Utils.isNull(index)) {
      that.setData({
        ImageyulanType: !that.data.ImageyulanType,
      })
      return
    }
    var synimageList = that.data.synimageList
    that.setData({
      synimage: synimageList[index],
      ImageyulanType: !that.data.ImageyulanType,
    })
  },
  chType(e) {
    var that = this;

    this.setData({
      ImageyulanType: !this.data.ImageyulanType,
    })
  },



  ////////////////////////////////////////////////////////////////////////////////////////////
  //----按摩组合劵处理操作----------------------------------------------------------------------
  //方法：组合劵修改对应按摩劵相关信息
  setPayRecordInfo: function (id, tag) {
    if (id <= 0) return;
    let that = this,otherParamCon = "&xcxAppId=" + app.data.wxAppId,dtEnd = new Date(),endTime = "";
    if (tag == 0) {
      dtEnd = Utils.getDateTimeAddDays((new Date()), 30);
      endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
      otherParamCon += "&status=0&id=" + id + "&mod_endTime=" + encodeURIComponent(endTime) + "&mod_orderNo=" + that.data.orderId + "&isSetRShare=1&operation=mod";
    } else {
      otherParamCon += "&id=" + id + "&isSetRShare=1&operation=mod";
    }

    app.operateAwardRecord2(that, 0, otherParamCon, 1)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    let other = "",
      url = "";
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        //operateTag：0插入记录，1修改记录
        switch (operateTag) {
          case 1:
            that.getCanCoupons(that.data.loginType)
            break;
        }

        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        switch (operateTag) {
          case 1:
            wx.showToast({
              title: "按摩记录状态修改失败！",
              icon: 'none',
              duration: 2000
            })
            break;
        }
        break;
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////////
  //----普通优惠劵处理操作----------------------------------------------------------------------
  useCoupons() {
    let that=this, orderCouponId = this.data.orderCouponId;
    if ( Utils.isNull(orderCouponId)) {
      return
    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_coupons&action=UseCoupons&appId=' + app.data.appid + "&timestamp=" + timestamp + "&id=" + orderCouponId + "&orderId=" + that.data.orderId;
    var otherParam = "&userId=" + appUserInfo.userId;
    app.doGetData(that, app.getUrlAndKey.smurl, signParam, otherParam, 7, "使用优惠券")
  },
})
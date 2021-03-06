// packageYK/pages/GetAMassage/GetAMassage.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var WXBizDataCrypt = require('../../../utils/RdWXBizDataCrypt.js');//WXBizDataCrypt
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl, Differenheight = app.globalData.differenheight;
var appUserInfo = app.globalData.userInfo,sOptions=null, packYKPageUrl ="../../../packageYK/pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    DataURL:app.getUrlAndKey.dataUrl,
    Differenheight:Differenheight,
    recordId:0,
    minutesCnt:0,
    freeCheirapsisMode:0,
    paramShareStat:0,//0待领取，1已领取，-1已失效
    paramShareUId:0, //分享人ID
    modeType:-1,      //0免费按摩领劵，1分享领劵,2组合劵9块9领10张

    couponActiveId:0,
    couponCompanyId:0,
    couponLotteryProduct:0,
    recordObjData:null,

    cheirapsisCouponList:[],   //推荐活动按摩劵列表
    commonCouponList:[],       //推荐活动普通优惠劵列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, isScene = false, dOptions = null;
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
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        let recordId = 0, minutesCnt = 0, freeCheirapsisMode = 0,modeType=0,pageTitle="",couponActiveId=0,couponCompanyId=0,couponLotteryProduct=0;
        if (sOptions.id != null && sOptions.id != undefined) {
          try {
            recordId = parseInt(sOptions.id);
            recordId = isNaN(recordId) ? 0 : recordId;
          } catch (e) { }
        }
        if (sOptions.mcnt != null && sOptions.mcnt != undefined) {
          try {
            minutesCnt = parseInt(sOptions.mcnt);
            minutesCnt = isNaN(minutesCnt) ? 0 : minutesCnt;
          } catch (e) { }
        }
        if (sOptions.mtype != null && sOptions.mtype != undefined) {
          try {
            modeType = parseInt(sOptions.mtype);
            modeType = isNaN(modeType) ? 0 : modeType;
          } catch (e) { }
        }
        if (sOptions.cid != null && sOptions.cid != undefined) {
          try {
            couponCompanyId = parseInt(sOptions.cid);
            couponCompanyId = isNaN(couponCompanyId) ? 0 : couponCompanyId;
          } catch (e) { }
        }
        if (sOptions.aid != null && sOptions.aid != undefined) {
          try {
            couponActiveId = parseInt(sOptions.aid);
            couponActiveId = isNaN(couponActiveId) ? 0 : couponActiveId;
          } catch (e) { }
        }
        if (sOptions.lp != null && sOptions.lp != undefined) {
          try {
            couponLotteryProduct = parseInt(sOptions.lp);
            couponLotteryProduct = isNaN(couponLotteryProduct) ? 0 : couponLotteryProduct;
          } catch (e) { }
        }
        that.setData({
          ["recordId"]: recordId,
          ["minutesCnt"]: minutesCnt,
          ["freeCheirapsisMode"]:app.data.freeCheirapsisMode,

          ["modeType"]:modeType,
          ["couponActiveId"]:couponActiveId,
          ["couponCompanyId"]:couponCompanyId,
          ["couponLotteryProduct"]:couponLotteryProduct,
        })
        switch(modeType){
          case 1:
            pageTitle="领取按摩券";
            that.getPayRecordInfo(recordId);
            break;
          case 2:
            pageTitle="活动价按摩劵";
            that.querySynCouponById(recordId);
            break;
          case 3:
            pageTitle="推荐活动劵";
            that.queryRecommendSynCouponById("",couponActiveId,couponCompanyId,2);
           
            break;
          default:
            pageTitle="免费按摩";
            that.data.isLoad = true;
            break;
        }
        wx.setNavigationBarTitle({
          title: pageTitle
        })
        break;
    }
  },
  //方法：获取支付记录信息
  getPayRecordInfo: function (id) {
    let that = this, otherConParams = "&xcxAppId=" + app.data.wxAppId;
    otherConParams += "&id=" + id;
    app.getShareStatData(that, otherConParams, 100, 1);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无按摩劵信息！";
    switch (tag) {
      case 1:
        console.log("获取按摩劵列表信息：")
        console.log(dataList);
        let cheirapsisCouponList = [],cheirapsisCouponCnt = 0,paramShareStat=-2;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let mainData = dataList,grade = 0,curId = 0,curItem = null,dataItem = null,listItem = null,rechargeItem = null,spareCheirapsisCnt = 0;
          let id = 0,companyId=0,lotteryActivityProductId = 0,lotteryProduct = 0,status = 0,payStatus = 0,productName = "",createDate = "",endTime = "",useTime = "",duration = 0,mallCouponsId = 0,isUse = 0,type = 0,dtTemp = new Date(),dtCreate = new Date(),dtEnd = new Date(),dtDate = new Date(),dtNow = new Date(),isTimeOut = false,cashback_price = 0.00,userId=0,shareUserId=0,isCancelShare=0,synCouponMpid="",synCouponPrice=0.00,synCouponName="";
          for (let i = 0; i < mainData.dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = mainData.dataList[i];
            id = 0;companyId=0;lotteryActivityProductId = 0;lotteryProduct = 0;productName = "";createDate = "";endTime = "";duration = 0;mallCouponsId = 0;isUse = 0;type = 0;status = 1;cashback_price = 0.00;payStatus = 0;useTime = "";isTimeOut = false;userId=0;shareUserId=0;isCancelShare=0;synCouponMpid="";synCouponPrice=0.00;synCouponName="";
            id = dataItem.id;
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
            //paramShareStat:0待领取，1已领取，2已被领取，-1已失效,-2已过期
            switch(isCancelShare){
              //分享中
              case 1:
                //分享中，且记录有效（有效期内，状态有效，未使用）则可以领取，否则为失效
                if(lotteryProduct==5){
                  if(!isTimeOut && isUse==0){
                    paramShareStat=0;
                  }else{
                    paramShareStat=isTimeOut?-2:-1;
                  }
                }else{
                  if(!isTimeOut && isUse==0){
                    paramShareStat=0;
                  }else{
                    paramShareStat=isTimeOut?-2:-1;
                  }
                }
                
                break;
              //非分享中
              case 0:
                //非分享中，归属用户ID为当前用户且分享人ID大于0则已领取，否则无效（归属别的用户别人已领取，或者自己未分享的记录）
                if(userId==appUserInfo.userId){
                  paramShareStat=1;
                }else{
                  paramShareStat=2;
                }
                break;
            }
                       
            if (type == 0 && (mallCouponsId > 0 || duration > 0)) type = 1;
            productName = Utils.myTrim(productName) == "" && type == 4 ? "充值抽奖" : productName;
            productName = Utils.myTrim(productName) == "" ? (lotteryProduct == 1 ? '付费按摩' + duration + '分钟' : (lotteryProduct == -1 ? '充值抽奖' : productName)) : productName;
            listItem = {
              id: id,companyId:companyId,
              lotteryActivityProductId: lotteryActivityProductId,
              lotteryProduct: lotteryProduct,
              productName: productName,
              createDate: createDate,
              endTime: endTime,
              useTime: useTime,
              duration: duration,
              mallCouponsId: mallCouponsId,
              isUse: isUse,status:status,
              type: type,
              cashback_price: cashback_price,
              payStatus: payStatus,synCouponMpid:synCouponMpid,synCouponPrice:synCouponPrice,synCouponName:synCouponName,
            }
            cheirapsisCouponList.push(listItem);
          }
        }
        that.setData({
          ["drawAwardRecordList"]: cheirapsisCouponList,
          ["paramShareStat"]:paramShareStat,
        })
        if(paramShareStat!=0){
          switch(paramShareStat){
            case 1:
              wx.showToast({
                title: "对不起，您已经领取该劵！",
                icon: 'none',
                duration: 2000
              })
              break;
            case -1:
              wx.showToast({
                title: "对不起，该劵已失效！",
                icon: 'none',
                duration: 2000
              })
              break;
          }
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无按摩劵信息！";
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
  useMyAward:function(e){
    let that=this;
    let url = "/pages/cheirapsisWork/cheirapsisWork?ncw=1&id=" + that.data.recordId + "&mcnt=" + that.data.minutesCnt + "&did=" + app.data.agentDeviceId + "&sqy=1";
    //按摩记录信息记载
    let allCash=0.00,idlist=that.data.recordId,pf=0;
    allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
    idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
    pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
    app.data.operateRecordItem={id:that.data.recordId,mincnt:that.data.minutesCnt,cash:allCash,pf:pf,tag:0,idlist:idlist}
    console.log("gotoCheirapsisPage:" + url)
    wx.redirectTo({
      url: url
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //事件：领取按摩劵
  receiveCoupon:function(e){
    let that=this,id=0,companyId=0;
    try {
      id = parseInt(e.currentTarget.dataset.id);
      id=isNan(id)?0:id;
    } catch (e) {}
    try {
      companyId = parseInt(e.currentTarget.dataset.companyid);
      companyId=isNan(companyId)?0:companyId;
    } catch (e) {}
    that.setAwardAboutRecord(id,companyId);
  },
  //方法：变更支付抽奖相关记录
  setAwardAboutRecord: function (id,companyId) {
    if (id <= 0) return;
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&id=" + id + "&isCancelShare=0&moduserId=" + appUserInfo.userId + "&operation=mod";
    
    app.operateAwardRecord2(that, companyId, otherParamCon, 1)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        //operateTag：0插入记录，1修改记录
        switch (operateTag) {
          case 1:
            that.setData({
              ["paramShareStat"]:1,
            })
            wx.showModal({
              title: '提示',
              content: '领取成功!领取的按摩券将会在“我的”-“我的按摩券”中显示!',
              showCancel:false,
              confirmText:"知道了",
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  let url = packYKPageUrl + "/Myprize/Myprize";
                  console.log("gotoMyPrize:" + url);
                  wx.navigateTo({
                    url: url
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
        }

        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        switch (operateTag) {
          case 0:
            wx.showToast({
              title: "按摩记录插入失败！",
              icon: 'none',
              duration: 2000
            })
            break;
          case 1:
            wx.showToast({
              title: "按摩劵领取失败！",
              icon: 'none',
              duration: 2000
            })
            break;
        }
        break;
    }
  },

  //方法：查询综合优惠券信息
  querySynCouponById: function (cid) {
    var that = this,otherParamCon="";

    otherParamCon+="&lotteryProduct=4&id=" + cid;
    app.getAwardProductList2(that, app.data.syn9910ActiveId, app.data.syn9910CompanyId, 1, otherParamCon);
  },
  //方法：查询综合优惠券信息
  //operateTag：2获取活动商品，3获取活动劵
  queryRecommendSynCouponById: function (cidList,aid,companyId,operateTag) {
    var that = this,otherParamCon="";

    otherParamCon+=Utils.myTrim(cidList)!=""?"&id=" + cidList:"";
    app.getAwardProductList2(that, aid, companyId, operateTag, otherParamCon);
  },
  //方法：获取组合劵结果处理函数
  dowithGetAwardProductList: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        switch(operateTag){
          case 1:
            console.log("获取组合劵结果：");
            console.log(dataList);
            if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
              let recordObjData=dataList.dataList[0];
              if(Utils.isNull(recordObjData.original_price))recordObjData.original_price=recordObjData.price+10;
              that.setData({
                ["recordObjData"]: recordObjData,
              })
            }else{
              wx.showToast({
                title: "对不起，劵信息为空！",
                icon: 'none',
                duration: 2000
              })
            }
            break;
          case 2:
            console.log("获取推荐活动相关商品结果：");
            console.log(dataList);

            if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
              let isCheirapsisCoupon=true,id=0,idList="",mallCouponsId=0,mallCouponsIdList="";
              let dataItem=null;
              for(let i=0;i<dataList.dataList.length;i++){
                dataItem=null;dataItem=dataList.dataList[i];
                id=0;mallCouponsId=0;
                id=dataItem.id;
                if (Utils.isDBNotNull(dataItem.mallCouponsId))
                {
                  try{
                    mallCouponsId = parseInt(dataItem.mallCouponsId);
                    mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
                  }catch(e){}
                }
                if(mallCouponsId>0){
                  mallCouponsIdList+=Utils.myTrim(mallCouponsIdList)!=""?","+mallCouponsId:mallCouponsId;
                }else{
                  idList+=Utils.myTrim(idList)!=""?","+id:id;
                }
              }
              if(Utils.myTrim(idList)!=""){
                that.queryRecommendSynCouponById(idList,that.data.couponActiveId,that.data.couponCompanyId,3)
              }
              if(Utils.myTrim(mallCouponsIdList)!=""){
                that.queryComCouponById(mallCouponsIdList);
              }
            }else{
              wx.showToast({
                title: "对不起，劵信息为空！",
                icon: 'none',
                duration: 2000
              })
            }
            break;
          case 3:
            console.log("获取推荐活动相关劵结果：");
            console.log(dataList);

            if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
              that.setData({
                ["cheirapsisCouponList"]: dataList.dataList,
              })
            }else{
              wx.showToast({
                title: "对不起，劵信息为空！",
                icon: 'none',
                duration: 2000
              })
            }
            break;
        }
        
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "对不起，劵信息为空！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：查询推荐活动普通优惠券信息
  queryComCouponById: function (cidList) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_coupons&action=QueryCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&id=" + cidList + "&sign=" + sign;
    console.log('查询推荐活动普通优惠券:'+SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("查询推荐活动普通优惠券结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
            let dataItem=null,cDate=new Date(), vDtStartTimeStr="",vDtEndTimeStr="";
            for(let i=0;i<res.data.data.length;i++){
              dataItem=null;dataItem=res.data.data[i];
              vDtStartTimeStr="";vDtEndTimeStr="";
              if (Utils.isDBNotNull(dataItem.startTime)) {
                try {
                  cDate = new Date(Date.parse((dataItem.startTime + "").replace(/-/g, "/")))
                  vDtStartTimeStr = Utils.getTimeStrByDateTime(cDate);
                } catch (e) {}
              }
              if (Utils.isDBNotNull(dataItem.endTime)) {
                try {
                  cDate = new Date(Date.parse((dataItem.endTime + "").replace(/-/g, "/")))
                  vDtEndTimeStr = Utils.getTimeStrByDateTime(cDate);
                } catch (e) {}      
              }
              res.data.data[i].vDtStartTimeStr=vDtStartTimeStr;
              res.data.data[i].vDtEndTimeStr=vDtEndTimeStr;
            }
            that.setData({
              ["commonCouponList"]: res.data.data,
            })
          }else{
            wx.showToast({
              title: "对不起，劵信息为空！",
              icon: 'none',
              duration: 2000
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
          app.setErrorMsg2(that, "查询推荐活动普通优惠券：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try{
          wx.hideLoading();
        }catch(e){}
        
        wx.showToast({
          title: "查询推荐活动优惠券接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "查询推荐活动普通优惠券接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //事件：支付押金
  payForCouponEvent:function(e){
    var that = this,item=that.data.recordObjData;
    
    if(Utils.isNotNull(item)){
      that.checkSynSingleCouponById(item.id,item.activityId);
    }else{
      wx.showToast({
        title: "对不起，劵信息为空！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：检查综合劵是否可用信息
  checkSynSingleCouponById:function(cid,activityId){
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon+="&lotteryProduct=4&status=0&userId=" + appUserInfo.userId + "&activityId=" + activityId;
    app.checkSynCouponEnable(that,cid,otherParamCon);
  },
  //方法：查询组合劵是否可用结果处理函数
  dowithCheckSynCouponEnable: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("查询组合劵结果：");
        console.log(dataList);
        let mainData = dataList;
        if (Utils.isNotNull(mainData) && Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
          wx.showModal({
            title: '提示',
            content: '您已购买 请勿重复购买！',
            showCancel:false,
            confirmText:"知道了",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          that.payForCoupon();
        }   
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "查询组合劵是否可用失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：发起支付
  payForCoupon:function(){
    var that = this,item=that.data.recordObjData, attach = "15_0_" + app.data.hotelId +"_3",price=0.00;
    
    if(Utils.isNotNull(item)){
      attach+=","+item.id;
      // attach+=Utils.isNotNull(item.single_num)?"_"+item.single_num:"";
      price=Utils.isNotNull(item.price)?item.price:price;
      price = parseFloat(price.toFixed(app.data.limitQPDecCnt));
      app.getPrePayId0(that, attach, price,"活动价按摩劵");
    }else{
      wx.showToast({
        title: "对不起，劵信息为空！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.data.isDowithing = false;
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "支付成功！" : alertContent;
        wx.showModal({
          title: '提示',
          content: '支付成功！您可以到“我的按摩券”用劵按摩！',
          confirmText:"知道了",
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              let url = packYKPageUrl + "/Myprize/Myprize";
              console.log("gotoMyPrize:" + url);
              wx.navigateTo({
                url: url
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "支付失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },

  //事件：领取推荐活动劵
  receiveRecommendCoupon:function(e){
    let that=this,item=null,dataType=0,url="",paramsList="";
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    try {
      dataType = parseInt(e.currentTarget.dataset.type);
      dataType=isNaN(dataType)?0:dataType;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      switch(dataType){
        case 0:
          url="/packageYK/pages/Myprize/Myprize";
          //b=3&c=48&ca=164&d=-6&e=5
          paramsList="ca="+item.id+"&d="+item.companyId+"&c="+item.activityId+"&e="+item.lotteryProduct+"&b="+item.distr;
          break;
        default:
          url="/packageSMall/pages/coupon/coupon";
          paramsList="id="+item.id+"&t="+item.distr;
          break;
      }
      url+=Utils.myTrim(paramsList)!=""?"?"+paramsList:"";
      wx.navigateTo({
        url: url,
      })
    }
  },
})
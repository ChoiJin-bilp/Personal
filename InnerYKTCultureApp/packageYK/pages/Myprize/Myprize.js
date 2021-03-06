// packageYK/pages/Myprize/Myprize.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutGetChances = null, timeOutGetDrawAwardList = null, timeOutGetPCheirapsisProductList = null, timeOutGetDeviceInfo = null, internalDownTime = null, timeInternelQueryDevice = null;

var getGrade = 0, havePlayed = 0, isDowithing = false, sendGPRSCmdCnt = 0, frequentness = 1;
var operatePageTag=-1,isInsert=0, mainPackageUrl = "../../../pages", packYKPageUrl ="../../../packageYK/pages", packSMPageUrl = "../../../packageSMall/pages", payForType = 0, payMordeAlert = "您还有可使用的按摩券(“首页”-“我的奖品”中选择使用)，是否需要继续支付？",isSetMyUse=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad:false,
    luckdraw_id: app.data.luckdraw_id,            //抽奖活动ID
    
    DataURL: DataURL,                    //远程资源路径
    drawAwardRecordList: [],             //抽奖记录信息列表

    curSelOperateAwardItem: null,     //当前所选使用抽奖记录
    agentCompanyId: 0,                             //代理商公司ID
    agentDeviceId: 0,                              //代理商设备ID

    currentData:0,
    
    couponId:0,                          //劵ID
    couponIsGroup:0,                     //0个人，1团体
    couponType:0,                        //劵类型:1电子2纸质3组合券
    couponActivityId:0,
    couponCompanyId:0,
    couponLotteryProduct:0,

    couponProductShowPrice: 0.00,
    couponProductName: "",
    couponProductLabelIds: "",
    couponDuration:0,
    couponCnt:0,                         //劵数量

    orderId:"",                          //终端机通过订单号获取按摩劵

    curIndex:0,                          //当前操作记录索引
    shareWXImg: DataURL + "/images/cheirapsisCoupon.jpg?" + (Math.random() / 9999),
    shareAlert:"你的好友正在邀请你来一起享受",

    ///////////////////////////////////////////////////////////////////
    couponData:[],
    couponDataLen:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    
    console.log("onLoad app.data.agentDeviceId:"+app.data.agentDeviceId)
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
    } catch (e) { }
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
        let couponId = 0, couponIsGroup=0, couponType = 0,couponActivityId=0,couponCompanyId=0,couponLotteryProduct=0,orderId="";
        //加载方式：0普通，1终端机订单送按摩劵，2扫码送按摩劵
        let loginType=0;
        if (Utils.isNotNull(sOptions.oid)) {
          //1、终端机二维码通过订单号获取按摩劵
          loginType=1;
          try {
            orderId = Utils.myTrim(sOptions.oid);
          } catch (e) { }
        }else{
          //2、非终端机二维码
          if (sOptions.c != null && sOptions.c != undefined) {
            try {
              couponActivityId = parseInt(sOptions.c);
              couponActivityId = isNaN(couponActivityId) ? 0 : couponActivityId;
            } catch (e) { }
          }
          if (sOptions.d != null && sOptions.d != undefined) {
            try {
              couponCompanyId = parseInt(sOptions.d);
              couponCompanyId = isNaN(couponCompanyId) ? 0 : couponCompanyId;
            } catch (e) { }
          }
          //团体劵
          if (sOptions.ca != null && sOptions.ca != undefined) {
            try {
              couponId = parseInt(sOptions.ca);
              couponId = isNaN(couponId) ? 0 : couponId;
            } catch (e) { }
          }
          if (couponId > 0){
            couponIsGroup = 1;
          } else{
            //个人劵
            if (sOptions.a != null && sOptions.a != undefined) {
              try {
                couponId = parseInt(sOptions.a);
                couponId = isNaN(couponId) ? 0 : couponId;
              } catch (e) { }
            }
          }
          
          if (sOptions.b != null && sOptions.b != undefined) {
            try {
              couponType = parseInt(sOptions.b);
              couponType = isNaN(couponType) ? 0 : couponType;
            } catch (e) { }
          }
          if (sOptions.e != null && sOptions.e != undefined) {
            try {
              couponLotteryProduct = parseInt(sOptions.e);
              couponLotteryProduct = isNaN(couponLotteryProduct) ? 0 : couponLotteryProduct;
            } catch (e) { }
          }
          if(couponId>0){
            app.data.cheirapsisCouponList=[];
            loginType=2;
          }
        }
        
        that.setData({
          ["couponId"]: couponId,
          ["couponIsGroup"]: couponIsGroup,
          ["couponType"]: couponType,
          ["couponActivityId"]:couponActivityId,
          ["couponCompanyId"]:couponCompanyId,
          ["couponLotteryProduct"]:couponLotteryProduct,
          ["agentDeviceId"]: app.data.agentDeviceId,
          ["agentCompanyId"]: app.data.agentCompanyId,

          ["orderId"]:orderId,
        })
        
        that.getDrawAwardDataList(false);
        that.queryUserCoupons(that.data.currentData);
        //加载方式：0普通，1终端机订单送按摩劵，2扫码送按摩劵
        switch(loginType){
          case 1:
            that.GetCheirapsisCouponByOrderId(orderId);
            break;
          case 2:
            if (couponId >0) {
              if(couponType==3){
                //如果为组合劵 陈锦荣
                if(that.data.couponActivityId==0 && that.data.couponCompanyId==0){
                  //【1】如果为个体组合劵
                  that.data.couponIsGroup=0;
                  that.checkComCouponType(that.data.couponId);
                }else{
                  //【2】如果为团体组合劵
                  that.data.couponIsGroup=1;
                  that.querySynCouponById(that.data.couponId,that.data.couponActivityId,that.data.couponCompanyId);
                }
              }else{
                //非组合劵 陈恒
                that.queryCouponById(couponId, couponIsGroup,couponType);
              }        
            }
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
  /////////////////////////////////////////////////////////////////////////////////
  //1、终端机下单领取按摩劵----------------------------------------------------------
  //方法：检查综合劵是否可用信息
  GetCheirapsisCouponByOrderId:function(orderId){
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon+="&operation=add&orderonlyone=1&orderNo=" + orderId;
    app.getProductCheirapsisCouponList(that,otherParamCon);
  },
  //方法：获取商品送劵按摩记录结果处理函数
  dowithGetProductCheirapsisCouponList: function (dataList, tag, errorInfo) {
    let that = this,
      noDataAlert = "暂无商品送劵信息！";
    let other = "",
      url = "";
    that.setData({
      ["currentData"]: 0,
    })
    setTimeout(that.refreshAfterReceiveCoupon, 3000)
    switch (tag) {
      case 1:
        console.log("获取商品送劵按摩记录列表信息：")
        console.log(dataList);
        if (Utils.isNotNull(dataList)) {
          wx.showModal({
            title: '提示',
            content: '恭喜您，领劵成功！',
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
        break;

      default:
        errorInfo=tils.myTrim(errorInfo)!=""?errorInfo:"领劵失败，请与管理员联系！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /////////////////////////////////////////////////////////////////////////////////
  //2、扫码领取按摩劵【1】综合劵领取--------------------------------------------------
  //方法：查询判断个体/团体劵
  checkComCouponType: function (cid) {
    let that = this, otherConParams = "&xcxAppId=" + app.data.wxAppId;
    otherConParams += "&id="+cid;
    
    app.getShareStatData2(that, otherConParams,2, 1000000, 1);
  },
  //方法：获取查询判断个体/团体劵结果处理函数
  dowithGetShareStatData2: function (dataList, tag,operateTag, errorInfo, pageIndex) {
    let that = this,receiveUserId=0,lotteryActivityProductId=0;
    switch (tag) {
      case 1:
        console.log("获取查询判断个体组合劵结果：")
        console.log(dataList);
        
        switch (operateTag) {
          case 2:
            if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
              //个体劵
              let mainData = dataList,dataItem = null;
              dataItem = mainData.dataList[0];
              
              if (Utils.isDBNotNull(dataItem.userId)) {
                try {
                  receiveUserId = parseInt(dataItem.userId);
                  receiveUserId = isNaN(receiveUserId) ? 0 : receiveUserId;
                } catch (err) {}
              }
              if (Utils.isDBNotNull(dataItem.lotteryActivityProductId)) {
                try {
                  lotteryActivityProductId = parseInt(dataItem.lotteryActivityProductId);
                  lotteryActivityProductId = isNaN(lotteryActivityProductId) ? 0 : lotteryActivityProductId;
                } catch (err) {}
              }
              
              if(receiveUserId>0){
                //已领取
                let alertContent="";
                if(receiveUserId==appUserInfo.userId){
                  alertContent="对不起，该劵您已领取！";
                }else{
                  alertContent="对不起，该劵已被领取！";
                }
                wx.showModal({
                  title: '提示',
                  content: alertContent,
                  showCancel:false,
                  success (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }else{
                //未领取
                that.checkComCheirapsisCouponEnable(lotteryActivityProductId);
              }
            }else{
              wx.showModal({
                title: '提示',
                content: "对不起，劵信息为空！",
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
            break;
          default:
            break;
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "组合劵获取失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：通用检查综合劵是否可用信息
  checkComCheirapsisCouponEnable:function(cid){
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon+="&status=1&userId=" + appUserInfo.userId;
    app.checkComCheirapsisCouponEnable(that,cid,otherParamCon);
  },
  //方法：通用查询组合劵是否可用结果处理函数
  dowithCheckComCheirapsisCouponEnable: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      //可以领取
      case 1:
        console.log("通用查询组合劵结果：");
        console.log(dataList);
        wx.showModal({
          title: '提示',
          content: '是否领取优惠券？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              switch(that.data.couponIsGroup){
                //个体组合劵领取
                case 0:
                  that.receivePersonComCouponInfo(that.data.couponId);
                  break;
                //团体组合劵领取
                case 1:
                  that.insertLotteryActivityRecord(that.data.couponProductName,that.data.couponDuration,that.data.couponProductLabelIds,that.data.couponProductShowPrice);
                  break;
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "查询组合劵是否可用失败！";
        wx.showModal({
          title: '提示',
          content: errorInfo,
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
    }
  },

  //方法：综合劵领取
  receiveSynCounpon:function(){
    let that=this;
    wx.showModal({
      title: '提示',
      content: '是否领取优惠券？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.insertLotteryActivityRecord(that.data.couponProductName,that.data.couponDuration,that.data.couponProductLabelIds,that.data.couponProductShowPrice);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //方法：查询综合优惠券信息
  querySynCouponById: function (cid, activityId,companyId) {
    var that = this,otherParamCon="",sid=cid;

    otherParamCon+="&activityId=&companyId=" + companyId+"&lap_id=" +  sid;
    app.getSynCouponList(that,otherParamCon);
  },
  //方法：获取组合劵结果处理函数
  dowithGetSynCouponList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取组合劵结果：");
        console.log(dataList);
        if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
          let name="", mpdl_id="",price=0.00,duration=0,single_num=1;
          let dataItem=dataList.dataList[0];
          if (Utils.isNotNull(dataItem.mname) && Utils.myTrim(dataItem.mname + "") != "null") {
            name = dataItem.mname;
          }
          if (Utils.isNotNull(dataItem.mmpdl_id) && Utils.myTrim(dataItem.mmpdl_id + "") != "null") {
            mpdl_id = dataItem.mmpdl_id;
          }
          if (Utils.isNotNull(dataItem.mprice) && Utils.myTrim(dataItem.mprice + "") != "null") {
            try {
              price = parseFloat(dataItem.mprice);
              price = isNaN(price) ? 0.00 : price;
              price = parseFloat((price).toFixed(app.data.limitQPDecCnt));
            } catch (err) { }
          }
          if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
            try {
              duration = parseInt(dataItem.duration);
              duration = isNaN(duration) ? 0 : duration;
            } catch (err) { }
          }
          if (Utils.isNotNull(dataItem.single_num) && Utils.myTrim(dataItem.single_num + "") != "null") {
            try {
              single_num = parseInt(dataItem.single_num);
              single_num = isNaN(single_num) ? 1 : single_num;
            } catch (err) { }
          }
          that.setData({
            ["couponProductShowPrice"]: price,
            ["couponProductName"]: name,
            ["couponProductLabelIds"]: mpdl_id,
            ["couponDuration"]:duration,
            ["couponCnt"]:single_num,
          })
          that.checkComCheirapsisCouponEnable(that.data.couponId);
        }else{
          wx.showModal({
            title: '提示',
            content: "对不起，劵信息为空！",
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
  //方法：插入按摩记录
  insertLotteryActivityRecord(name,duration,mpdl_id,price){
    let that = this, luckdraw_id = that.data.couponActivityId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&status=1&lotteryProduct=5&productid=" + that.data.couponId + "&synCouponName=" + encodeURIComponent(name) + "&synCouponMpid=" + mpdl_id +"&synCouponPrice=" + price + "&duration=" + duration + "&activityId=" + luckdraw_id + "&operation=add";
    otherParamCon+="&addcount="+that.data.couponCnt;
    
    app.operateAwardRecord(that, otherParamCon, 0)
  },
  //方法：变更按摩记录——领取个体组合劵
  receivePersonComCouponInfo: function (id) {
    if (id <= 0) return;
    let that = this, luckdraw_id = that.data.couponActivityId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&id=" + id + "&activityId=" + 0 + "&moduserId=" + appUserInfo.userId + "&status=1&lotteryProduct=5&createDate=1&operation=mod";
    
    app.operateAwardRecord(that, otherParamCon, 2)
  },
  /////////////////////////////////////////////////////////////////////////////////
  //2、扫码领取按摩劵【2】综合劵领取--------------------------------------------------
  //方法：查询优惠券信息
  queryCouponById: function (cid, couponIsGroup,ctype) {
    let that = this,otherParam="&userId=" + appUserInfo.userId;
    otherParam += couponIsGroup == 1 ? "&lotteryProductId=" + cid : "&cid=" + cid;
    otherParam += "&distr=" + ctype;
    app.getCheirapsisDataList(that,otherParam)
  },
  //方法：获取按摩记录结果处理函数
  dowithGetCheirapsisDataList: function (dataList, tag, errorInfo) {
    let that = this,couponId=that.data.couponId,couponIsGroup=that.data.couponIsGroup,couponType=that.data.couponType,isForbidReceive=false;
    switch (tag) {
      case 1:
        console.log("获取按摩记录结果：");
        console.log(dataList);
        if (couponIsGroup==1){
          //团体
          if (Utils.isNotNull(dataList.list) && dataList.list.length > 0){
            let isUse=1;
            for (let i = 0; i < dataList.list.length;i++){
              try {
                isUse = parseInt(dataList.list[i].isUse);
                isUse = isNaN(isUse) ? 1 : isUse;
              } catch (err) { }
              if(isUse==0){
                isForbidReceive=true;break;
              }
            }
          }
        }else{
          //个人
          if (Utils.isNotNull(dataList.list) && dataList.list.length > 0) isForbidReceive = true;
        }
        
        if(!isForbidReceive){
          wx.showModal({
            title: '提示',
            content: '是否领取优惠券？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.receiveCouponById(couponId, couponIsGroup,couponType);
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: couponIsGroup == 1?'该劵已领取尚未使用！':'该券已经领取！',
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
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无按摩信息！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：领取优惠券信息
  receiveCouponById: function (cid, couponIsGroup, ctype) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "", otherParam = couponIsGroup==1?"&id="+cid:"&cid="+cid;
    otherParam+=that.data.couponLotteryProduct>0?"&lotteryProduct="+that.data.couponLotteryProduct:"";
    urlParam = "cls=product_coupons&action=ReceiveAmCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&companyId=" + app.data.companyId + otherParam + "&distr=" + ctype + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("领取优惠券信息：")
        console.log(res.data)
        if (res.data.rspCode == 0) {
          setTimeout(that.refreshAfterReceiveCoupon, 1000)
          wx.showModal({
            title: '提示',
            content: "领取成功！",
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
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
          app.setErrorMsg2(that, "领取优惠券：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        try{
          wx.hideLoading();
        }catch(e){}
        
        wx.showToast({
          title: "领取优惠券接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "领取优惠券接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },
  //方法：获取抽奖记录信息
  getDrawAwardDataList: function (isRecharge) {
    console.log("getDrawAwardDataList:" + isRecharge)
    let that = this;
    if (Utils.isNotNull(app.data.cheirapsisCouponList) && app.data.cheirapsisCouponList.length>0){
      that.data.isLoad=true;
      that.setData({
        ["drawAwardRecordList"]: app.data.cheirapsisCouponList,
      })
    }else{
      that.getMyCheirapsisCouponList(0);
    }
  },
  //事件：我的抽奖记录立即使用
  useMyAward: function (e) {
    let that = this, item = null, url = "",chDeviceTag=0, pfTag = 0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    try {
      chDeviceTag = parseInt(e.currentTarget.dataset.item);
      chDeviceTag=isNaN(chDeviceTag)?0:chDeviceTag;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      if(item.shareUserId==item.userId){
        wx.showModal({
          title: '提示',
          content: '对不起，该劵只能赠送他人使用！',
          showCancel:false,
          confirmText:"知道了",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
      that.setData({
        showModalwinning: false,
        Lotterymywin: false,
      })
      pfTag = item.type == 2 && item.payStatus == 1 ? 1 : pfTag;
      if (item.type == 4 && item.lotteryProduct == -1) {
        //如果“抽奖记录ID”大于0且为抽奖充值记录，则变更相应抽奖记录为“已使用”状态，增加抽奖机会、并将“抽奖记录ID”清零——抽奖操作
        that.setAwardAboutRecordUsed(item.id);
      } else {
        that.setData({
          ["curSelOperateAwardItem"]: item,
        })

        let minuteCnt = 0, cashback_price = 0.00;
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
        
        let vSTCCommentObj = null;
        vSTCCommentObj = that.selectComponent('#vSTCComment');
        //如果启用按摩条件检测
        if (Utils.isNotNull(vSTCCommentObj)) {
          vSTCCommentObj.checkCheirapsisCondition(app.data.agentDeviceId, item.id, minuteCnt, cashback_price, pfTag,chDeviceTag);
        }else{
          that.gotoCheirapsisPage(item.id, minuteCnt, cashback_price, pfTag,chDeviceTag);
        }   
      }
    } else {
      wx.showToast({
        title: "无法获取信息！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //事件：组合劵立即使用
  useSynCoupon: function (e) {
    let that = this, item = null, url = "", pfTag = 0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      if(item.shareUserId==item.userId){
        wx.showModal({
          title: '提示',
          content: '对不起，该劵只能赠送他人使用！',
          showCancel:false,
          confirmText:"知道了",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
      app.data.synCouponObj={
        id:item.lotteryActivityProductId,
        mpids:item.synCouponMpid,
        rid:item.id,
      }
      wx.reLaunch({
        url: "/pages/alittle/alittle"
      });
    } else {
      wx.showToast({
        title: "无法获取信息！",
        icon: 'none',
        duration: 1500
      })
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
    url = "/pages/cheirapsisWork/cheirapsisWork?ncw=1&id=" + id + "&mcnt=" + mincnt + "&did=" + app.data.agentDeviceId + "&sqy=1&cash=" + allCash + "&pf=" + pf;
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        that.getMyCheirapsisCouponList(that.data.currentData);
        that.queryUserCoupons(that.data.currentData);
        console.log("onShow ...")
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this,id=0,companyId=0,curIndex=-1,curShareItem = that.data.curShareItem,shareWXImg = that.data.shareWXImg,shareAlert = that.data.shareAlert,url = "";
    try {
      curShareItem = e.target.dataset.item;
    } catch (e) {}
    try {
      curIndex = parseInt(e.target.dataset.index);
      curIndex=isNaN(curIndex)?-1:curIndex;
    } catch (e) {}
    that.setData({
      ["curShareItem"]: curShareItem,
      ["curIndex"]:curIndex,
    })
    console.log("赠送朋友：")
    console.log(curShareItem)
    //shareAlert=curShareItem.lotteryProduct==5?'':'';
    id=Utils.isNotNull(curShareItem)?curShareItem.id:id;
    companyId=Utils.isNotNull(curShareItem)?curShareItem.companyId:companyId;
    let tag=1;
    if(Utils.isNotNull(curShareItem) && curShareItem.shareUserId==curShareItem.userId){
      tag=2;
    }
    that.setAwardAboutRecord(id,companyId,1);
    console.log(shareWXImg);
    
    url = "/packageYK/pages/GetAMassage/GetAMassage?id="+id+"&mtype=1&suid="+appUserInfo.userId;
    console.log("按摩劵分享：" + url)
    if(Utils.myTrim(shareWXImg) != ""){
      return {
        title: shareAlert,
        path: url,
        imageUrl: shareWXImg,
        success: (res) => { // 成功后要做的事情
          console.log("分享按摩劵成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    }else{
      return {
        title: shareAlert,
        path: url,
        success: (res) => { // 成功后要做的事情
          console.log("分享按摩劵成功")
          console.log(res)
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    }
    
  },
  setCurrentItem:function(e){
    let that=this,id=0,companyId=0,tag=0,curIndex=-1,curShareItem = that.data.curShareItem;
    try {
      curShareItem = e.currentTarget.dataset.item;
    } catch (e) {}
    try {
      curIndex = parseInt(e.currentTarget.dataset.index);
      curIndex=isNaN(curIndex)?-1:curIndex;
    } catch (e) {}
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag=isNaN(tag)?-1:tag;
    } catch (e) {}
    if(Utils.isNotNull(curShareItem) && Utils.isNotNull(curShareItem.remark) 
    && Utils.myTrim(curShareItem.remark) == 'FUSelf'){
      tag=-2
    }
    id=Utils.isNotNull(curShareItem)?curShareItem.id:id;
    companyId=Utils.isNotNull(curShareItem)?curShareItem.companyId:companyId;
    that.setData({
      ["curShareItem"]: curShareItem,
      ["curIndex"]:curIndex,
    })
    that.setAwardAboutRecord(id,companyId,tag);
  },
  selectTabIndex:function(e){
    let that = this, current=0;
    try {
      current = parseInt(e.currentTarget.dataset.current);
      current = isNaN(current) ? 0 : current;
    } catch (err) { }
    if (current == that.data.currentData)return;
    that.setData({
      ["currentData"]: current,
    })
    that.getMyCheirapsisCouponList(current);
    that.queryUserCoupons(current);
  },
  //方法：获取我的按摩劵
  getMyCheirapsisCouponList: function (tag) {
    let that = this, otherConParams = "&xcxAppId=" + app.data.wxAppId;
    otherConParams += "&duration=0";
    
    //tag:0未使用，1已使用，2待赠送，3已赠送
    switch(tag){
      case 0:
        //未使用不包括分享中的记录
        otherConParams+=tag==0?"&isCancelShare=0":"";
        otherConParams+="&userId=" + appUserInfo.userId + "&isUse=0&orderField=createDate";
        break;
      case 1:
        //已使用，则按使用时间排序
        otherConParams+=tag==1?"&orderField=useTime":"";
        otherConParams+="&userId=" + appUserInfo.userId;
        break;
      case 2:
        //分享中中的记录
        otherConParams+=tag==2?"&isCancelShare=1":"";
        otherConParams+="&userId=" + appUserInfo.userId + "&isUse=0";
        break;
      case 3:
        //分享完未使用中的记录
        otherConParams+="&isUse=0&isCancelShare=0&shareUserId=" + appUserInfo.userId;
        break;
      // case 4:
      //   //组合劵的记录
      //   otherConParams+="&isCancelShare=0";
      //   otherConParams+="&userId=" + appUserInfo.userId + "&lotteryProduct=5";
      //   break;
    }
    
    app.getShareStatData(that, otherConParams, 1000000, 1);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,isFilterStatus=that.data.currentData==4?false:true;
    that.data.isLoad=true;
    app.dowithGetShareStatData(that,0, dataList, tag, errorInfo, pageIndex,isFilterStatus);
  },
  //隐藏弹窗
  emptyType(){
    this.setData({
      drinkType:false,
      detailType:false,
      productType:false,
    })
  },
  changeDrink(){
    this.setData({
      drinkType: !this.data.drinkType,
    })
  },

  //方法：变更支付抽奖相关记录
  //tag:0启用分享，1设置分享，-1取消分享
  setAwardAboutRecord: function (id,companyId,tag) {
    if (id <= 0) return;
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&id=" + id;

    operatePageTag=tag;
    switch(tag){
      case 1:
        otherParamCon += "&shareUserId="+appUserInfo.userId+"&isCancelShare=1";
        break;
      case 2:
        otherParamCon += "&remark="+encodeURIComponent("FUSelf")+"&isCancelShare=1";
        break;
      case -1:
        otherParamCon += "&shareUserId=0&isCancelShare=0";
        break;
      case -2:
        otherParamCon += "&isCancelShare=0";
        break;
    }
    otherParamCon += "&operation=mod";
    
    app.operateAwardRecord2(that, companyId, otherParamCon, 1)
  },
  
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        //operateTag：0领取团体组合劵，1修改记录，2领取个体组合劵
        switch (operateTag) {
          case 0:
          case 2:
            that.setData({
              ["currentData"]: 0,
            })
            setTimeout(that.refreshAfterReceiveCoupon, 1000)
            wx.showModal({
              title: '提示',
              content: "领取成功！",
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          case 1:
            let isCancelShare=0,curIndex=that.data.curIndex;
            if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
              try {
                isCancelShare = parseInt(dataList.resultMap.isCancelShare);
                isCancelShare = isNaN(id) ? 0 : isCancelShare;
              } catch (err) { }
            }
            let setKey="drawAwardRecordList["+curIndex+"].isCancelShare"
            this.setData({
              [setKey]: isCancelShare,
            })
            switch(operatePageTag){
              case -1:
                setTimeout(that.refreshAfterReceiveCoupon, 3000)
                wx.showToast({
                  title: "取消赠送成功！",
                  icon: 'none',
                  duration: 2000
                })
                break;
            }
            break;
        }

        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        switch (operateTag) {
          case 0:
            errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "插入按摩记录失败！";
            wx.showToast({
              title: errorInfo,
              icon: 'none',
              duration: 2000
            })
            break;
          case 1:
            switch(operatePageTag){            
              case -1:
                wx.showToast({
                  title: "取消赠送失败！",
                  icon: 'none',
                  duration: 2000
                })
                break;
            }
            break;
        }        
        break;
    }
  },
  //方法：领劵后刷新
  refreshAfterReceiveCoupon:function(){
    let that=this;
    
    that.getMyCheirapsisCouponList(that.data.currentData);
  },
  gokkk:function(){
    let that=this,url="";//packYKPageUrl
    wx.navigateTo({
      url: packYKPageUrl+"/amited/amited"
    });
  },





  /////////////////////////////////////////////////////////////////////////////////////////////////
  //原优惠券部分------------------------------------------------------------------------------------
  //查询优惠券isUsed
  queryUserCoupons: function (currentData) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = app.globalData.muserInfo.userId
    // userId = 13140
    var urlParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&companyId=" + app.data.companyId;

    switch(currentData){
      case 0:
        urlParam += "&isUsed=0";
        break;
      case 1:
        urlParam += "&isUsed=2";
        break;
      default:
        return;
        break;
    }
    
    console.log('查询优惠券:'+SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('查询优惠券', res);
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          let couponDataLen=0;
          if (res.data.data.length > 0) {
            couponDataLen=res.data.data.length;
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
              couponData: res.data.data,
              ["couponDataLen"]:couponDataLen,
            })
          }
        } else {
          app.setErrorMsg2(that, "查询优惠券！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
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
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        app.setErrorMsg2(that, "删除优惠劵接口调用出错：" + JSON.stringify(err), SMURL + urlParam, false);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        console.log("接口失败：" + err)
      }
    })
  },
  /**
   * 删除优惠劵
   */
  deleteCoupons: function (e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    var content = '是否删除该优惠劵,删除后将不能使用！';
    if (that.data.currentData == 2) {
      content = '是否删除该优惠劵?';
    }
    wx.showModal({
      title: '',
      content: content,
      showCancel: true,
      confirmText: '删除',
      confirmColor: '#ff0000',
      success: function (res) {
        if (res.confirm) {
          that.sureDeleteCoupons(index)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  /**
   * 确定删除优惠劵
   */
  sureDeleteCoupons: function (index) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=RemoveCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp + "&keyid=" + that.data.couponData[index].keyid;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log('删除优惠劵', res);
        if (res.data.rspCode == 0) {
          var arr = that.data.couponData;
          arr.splice(index, 1);
          that.setData({
            couponData: arr,
          })
        } else {
          app.setErrorMsg2(that, "删除优惠劵！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
        wx.showToast({
          title: res.data.rspMsg,
          icon: 'none',
          duration: 1500
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("删除优惠劵接口失败：" + err)
        app.setErrorMsg2(that, "删除优惠劵接口调用出错：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  onchangedetailType() {
    this.setData({
      detailType: !this.data.detailType,
    })
  },
  
  //显示提示弹窗
  showout() {
    this.setData({
      productType: !this.data.productType
    })
  },
  /**
   * 立即提现
   */
  nowWithdraw(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      productType: !that.data.productType
    })
    that.setData({
      currentCoupon: that.data.couponData[index],
    })
  },

  /**
   * 兑换
   */
  startWithdraw() {
    var that = this
    that.setData({
      productType: false
    })
    that.useCoupons(that.data.currentCoupon.keyid, that.data.currentCoupon.discount)
  },

  /**
   * 提现使用优惠券
   */
  useCoupons(couponId, money) {
    var userId = appUserInfo.userId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_coupons&action=UseCoupons&appId=' + app.data.appid + "&timestamp=" + timestamp + "&id=" + couponId + "&orderId=";
    var otherParam = "&userId=" + userId + "&money=" + money
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "提现使用优惠券")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.data.reData = true
            wx.navigateTo({
              url: "/packageSMall/pages/exchannge/exchannge?money=" + that.data.currentCoupon.discount,
            })
            break
        }
        break
      default:
        console.log(error)
        break
    }
  },

  /**
   * 使用优惠券
   */
  goUseCoupon(e) {
    let that=this,item=null,index=0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      let typeid = item.typeid,url = '/pages/alittle/alittle?typeid='+typeid;
      console.log(url)
      if(item.mold==3){
        let resultObj=null;
        resultObj=app.checkCouponSetTimeValid(item);
        switch(resultObj.result){
          case 0:
            wx.reLaunch({
              url: url
            })
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '对不起，该劵只能在时段：'+resultObj.couponStartTime+" ~ " + resultObj.couponEndTime +' 使用！',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
        }
      }else{
        wx.reLaunch({
          url: url
        })
      }
    }
  },
  setMyUse:function(e){
    let that=this;
    isSetMyUse=true;
  }
})
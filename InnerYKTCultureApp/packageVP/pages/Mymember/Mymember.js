// packageVP/pages/Mymember/Mymember.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo, sOptions = null,isTestPrice =false;
var Differenheight = app.globalData.differenheight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:DataURL,
    isForbidRefresh: false,                        //是否禁止刷新
    isDowithing:false,

    rechargeRandId:0,

    curMemSort:1,                 //当前会员级别
    curUseIntegrals:0,            //当前可用积分
    curMemIntegrals:0,            //当前会员积分

    remainingSum: 0.00,           //剩余余额
    memberLevelList:[],           //会员等级列表
    memberRechargePackageList:[], //会员充值套餐
    selRCIndex:0,                 //当前选中套餐索引
    selUpgradeMemLevelItem:{id:0,price:0.00,integral:0,upSort:0,upSortName:""},  //当前选中套餐后可升级的会员等级信息

    srcOptions:null,              //保存加载信息
    loginType:0,                  //登录类型：0普通加载，1活动跳转，2充值免单
    selFreeOrderId:"",            //充值免单对应订单号
    selFreeSynRecordId:0,         //充值免单对应组合劵ID
    selFreeOrderCouponId:0,       //充值免单对应的优惠劵记录ID
    selFreeOrderAttach:"",
    selFreeOrderDescribe:"",
    selFreeOrderAmount:0.00,
    selFreeOrderCouponKeyId:"",
    isAgreTreaty: false,   //是否勾选协议

    rechargeOrderId:"",           //充值订单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.srcOptions=options;
    appUserInfo = app.globalData.userInfo;
    sOptions=options;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null) {
          wx.showToast({
            title: "获取用户失败！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let rechargeRandId=0,loginType=0,selFreeOrderId="",selFreeSynRecordId=0,selFreeOrderAttach="",selFreeOrderDescribe="",selFreeOrderAmount=0.00;
        try {
          if (Utils.isNotNull(sOptions.at)){
            selFreeOrderAttach = Utils.myTrim(sOptions.at);
            selFreeOrderAttach=decodeURIComponent(selFreeOrderAttach);
          }            
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.txt)){
            selFreeOrderDescribe = Utils.myTrim(sOptions.txt);
            selFreeOrderDescribe=decodeURIComponent(selFreeOrderDescribe);
          }            
        } catch (e) {}
        if (Utils.isDBNotNull(sOptions.price)){
          try{
            selFreeOrderAmount = parseFloat(sOptions.price);
            selFreeOrderAmount = isNaN(selFreeOrderAmount) ? 0.00 : selFreeOrderAmount;
            selFreeOrderAmount=parseFloat(selFreeOrderAmount.toFixed(app.data.limitQPDecCnt))
          }catch(e){}
        }  
        if (Utils.isNotNull(sOptions.rid)){
          try{
            rechargeRandId = parseInt(sOptions.rid);
            rechargeRandId = isNaN(rechargeRandId) ? 0 : rechargeRandId;
          }catch(e){}
        }
        try {
          if (Utils.isNotNull(sOptions.lp)){
            loginType = parseInt(sOptions.lp);
            loginType = isNaN(loginType) ? 0 : loginType;
          }            
        } catch (e) {}

        try {
          if (Utils.isNotNull(sOptions.oid)){
            selFreeOrderId = Utils.myTrim(sOptions.oid);
          }            
        } catch (e) {}

        try {
          if (Utils.isNotNull(sOptions.srid)){
            selFreeSynRecordId = parseInt(sOptions.srid);
            selFreeSynRecordId = isNaN(selFreeSynRecordId) ? 0 : selFreeSynRecordId;
          }            
        } catch (e) {}
        that.setData({
          ["loginType"]:loginType,
          ["rechargeRandId"]:rechargeRandId,

          ["selFreeOrderId"]:selFreeOrderId,
          ["selFreeSynRecordId"]:selFreeSynRecordId,

          ["selFreeOrderAttach"]:selFreeOrderAttach,
          ["selFreeOrderDescribe"]:selFreeOrderDescribe,
          ["selFreeOrderAmount"]:selFreeOrderAmount,
        })
        wx.setNavigationBarTitle({
          title: loginType == 0 ? "我的会员" : "会员充值"
        })
        that.data.rechargeRandId=rechargeRandId;
        isTestPrice =appUserInfo.userId ==13118 || appUserInfo.userId ==732 || appUserInfo.userId==13140 || appUserInfo.userId==6900 || appUserInfo.userId==13141?true:false;
        that.getMainDataInfo();
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
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else
      {
        if(!that.data.isForbidRefresh){
          that.getMainDataInfo();
        }
      }
    }
    that.data.isForbidRefresh=false;
  },
  //方法：获取信息
  getMainDataInfo:function(){
    console.log("getMainDataInfo")
    var that = this;
    wx.showLoading({
      title: "加载中......",
    })
    app.getNewMyRemainingSum(that);
    app.getMemberIntegrals(that,"");
  },
  //方法：获取我的余额结果处理函数
  dowithGetNewMyRemainingSum: function (dataList, tag, errorInfo) {
    let that = this;
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("我的余额获取结果：");
        console.log(dataList);
        let mainData = dataList, remainingSum = 0.00,withdrawableSum=0.00,nowithdrawalSum=0.00,serviceCharge=0.00;
        if (Utils.isNotNull(mainData) && Utils.isNotNull(mainData.balance)){
          if (Utils.isNotNull(mainData.balance.totalmoney)) {
            remainingSum = parseFloat(mainData.balance.totalmoney);
            remainingSum = isNaN(remainingSum) ? 0 : remainingSum;
          }
          if (Utils.isNotNull(mainData.balance.money)) {
            withdrawableSum = parseFloat(mainData.balance.money);
            withdrawableSum = isNaN(withdrawableSum) ? 0 : withdrawableSum;
          }
          if (Utils.isNotNull(mainData.balance.nomoney)) {
            nowithdrawalSum = parseFloat(mainData.balance.nomoney);
            nowithdrawalSum = isNaN(nowithdrawalSum) ? 0 : nowithdrawalSum;
          }
          remainingSum = parseFloat(remainingSum.toFixed(app.data.limitQPDecCnt));
          withdrawableSum = parseFloat(withdrawableSum.toFixed(app.data.limitQPDecCnt));
          nowithdrawalSum = parseFloat(nowithdrawalSum.toFixed(app.data.limitQPDecCnt));
        }
        
        that.setData({
          ["remainingSum"]: remainingSum,
          ["withdrawableSum"]:withdrawableSum,
          ["nowithdrawalSum"]:nowithdrawalSum,
          ["serviceCharge"]:serviceCharge,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取余额失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取会员套餐操作结果回调处理方法
  dowithGetMemberFeeItemList(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('获取会员套餐操作结果：')
        console.log(dataList)
        if (dataList != null && dataList != undefined) {
          let memberRechargePackageList=[],memberLevelList=[],mainData=null,dataItem = null, listItem = null;
          let curMemIntegrals=that.data.curMemIntegrals,curMemSort=1,selRCIndex=0,currentIndex=0,curNextSortMemIntegrals=0,selFreeOrderCouponId=0;
          //获取会员充值套餐列表
          if(Utils.isNotNull(dataList.payRankList) && dataList.payRankList.length>0){
            let id=0,name="",content="",integral=0,expenditure_integral=0,price=0.00,sort=0,invalid=0;
            mainData=dataList.payRankList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;content="";integral=0;expenditure_integral=0;price=0.00;name="";sort=0;invalid=0;
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
              if (Utils.isDBNotNull(dataItem.coupon_id)) {
                try {
                  coupon_id = parseInt(dataItem.coupon_id);
                  coupon_id = isNaN(coupon_id) ? 0 : coupon_id;
                } catch (e) { }
              }
              
              if(invalid!=0)continue;
              listItem={id:id,content:content,integral:integral,expenditure_integral:expenditure_integral,price:price,name:name,sort:sort,invalid:invalid,}
              switch(that.data.loginType){
                case 1:
                  if(id==that.data.rechargeRandId){
                    memberRechargePackageList.push(listItem);
                  } 
                  break;
                default:
                  if(id==that.data.rechargeRandId){
                    selRCIndex=currentIndex;
                    if(that.data.loginType==2){
                      selFreeOrderCouponId=coupon_id;
                    }
                  } 
    
                  currentIndex++;
                    
                  memberRechargePackageList.push(listItem);
                  break;
              }             
            }
          }
          //获取会员等级列表
          if(Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
            let id=0,name="",content="",integral=0,sort=0,invalid=0;
            mainData=dataList.dataList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;integral=0;name="";content="";sort=0;invalid=0;
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.content)){
                content = dataItem.content;
              }   
              if (Utils.isDBNotNull(dataItem.integral)) {
                try {
                  integral = parseInt(dataItem.integral);
                  integral = isNaN(integral) ? 0 : integral;
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
              if(invalid!=0)continue;
              if(curMemIntegrals>=integral){
                curMemSort=sort;
              }
              listItem={id:id,integral:integral,name:name,content:content,sort:sort,invalid:invalid,}
              memberLevelList.push(listItem);
            }
          }
          // memberLevelList=memberLevelList.sort(that.compareDesc("sort"));
          // console.log(memberLevelList)
          memberLevelList=memberLevelList.sort(that.compareAsc("sort"));
          console.log(memberLevelList)
          let isMySort=false;
          for(let i=0;i<memberLevelList.length;i++){
            dataItem=null;dataItem=memberLevelList[i];
            if(isMySort){
              curNextSortMemIntegrals=dataItem.integral-that.data.curMemIntegrals;
              isMySort=false;
            }
            if(dataItem.sort==curMemSort){
              isMySort=true;
            }
          }
          that.setData({
            ["memberRechargePackageList"]: memberRechargePackageList,
            ["memberLevelList"]:memberLevelList,
            ["selRCIndex"]:selRCIndex,
            ["curMemSort"]:curMemSort,
            ["curNextSortMemIntegrals"]:curNextSortMemIntegrals,

            ["selUpgradeMemLevelItem"]:memberRechargePackageList[selRCIndex],
            ["selFreeOrderCouponId"]:selFreeOrderCouponId,
          })
          console.log(memberRechargePackageList)
          app.data.userMemberInfo={
            ["memberLevelList"]:memberLevelList,
            ["curMemSort"]:curMemSort,
            ["curUseIntegrals"]:that.data.curUseIntegrals,
            ["curMemIntegrals"]:that.data.curMemIntegrals,
          }
          that.afterSelRCItem(selRCIndex);
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
  //方法：保存充值套餐相关信息
  saveMemberFeeItemInfo: function (rcId) {
    var that = this;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=saveUserIntegral&userId="+appUserInfo.userId+"&payRankId="+rcId+"&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&companyId=" + app.data.companyId + "&sign=" + sign;
    console.log('保存充值套餐信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('保存充值套餐信息结果')
        console.log(res)
        if (res.data.rspCode == 0) {
          let loginType=that.data.loginType,selUpgradeMemLevelItem=that.data.selUpgradeMemLevelItem;
          wx.showModal({
            title: '提示',
            content: "充值成功！",
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                if(loginType==2 && Utils.isNotNull(selUpgradeMemLevelItem)){
                  //充值免单操作
                  //领取充值福利
                  app.receiveRechargeWelfareInfo(that,that.data.selFreeOrderCouponId,1);
                }else{
                  //跳转充值成功页面
                  that.gotoRechargeSuccedPage(rcId,that.data.selUpgradeMemLevelItem);
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "保存充值套餐：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.hideLoading();
        wx.showToast({
          title: "保存充值套餐接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "保存充值套餐接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：领取充值福利操作结果回调处理方法
  dowithReceiveRechargeWelfareInfo(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('领取充值福利操作结果：')
        console.log(dataList)
        if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
          that.setData({
            ["selFreeOrderCouponKeyId"]: dataList.dataList[0].id,
          })
        }
        //订单充值免单提交处理
        app.getPrePayId10(that, that.data.selFreeOrderAttach, that.data.selFreeOrderAmount, that.data.selFreeOrderDescribe);
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取充值福利失败！";
        wx.showToast({
          title: res.data.errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
   //方法：获取预支付ID结果处理函数
   dowithGetPrePayId10:function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取预支付ID结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList.data)) {
          let appid="";
          if(Utils.isNotNull(dataList.data.appid) && Utils.myTrim(dataList.data.appid) != ""){
            appid=Utils.myTrim(dataList.data.appid);
          }
          switch(appid){
            //0元支付或余额支付
            case "AppID":
              let success=0;
              if(Utils.isNotNull(dataList.data.success)){
                try{
                  success=parseInt(dataList.data.success);
                  success=isNaN(success)?-1:success;
                }catch(e){}
              }
              if(success>=0){
                //支付完成后的处理方法
                let orderId = that.data.selFreeOrderId,couponId = that.data.selFreeOrderCouponKeyId,url="";
                url="/packageOther/pages/successDetailspa/successDetailspa?oid=" + orderId;

                //如果页面为组合劵使用商品调用
                if (that.data.selFreeSynRecordId > 0) {
                  url+="&srid="+that.data.selFreeSynRecordId;
                }
                if(!Utils.isNull(couponId)){
                  url+="&cpid="+couponId;
                }
                wx.redirectTo({
                  url: url
                })
              }else{
                wx.showToast({
                  title: "订单提交失败，请重试！",
                  icon: 'none',
                  duration: 1500
                })
              }
              break;
            //其他支付
            default:
              that.data.paymentData=dataList.data;
              app.requestPayment(that, dataList.data);
              break;
          }
        }
        break;
      default:
        that.data.isDowithing = false;
        wx.showToast({
          title: "支付失败！",
          icon: 'none',
          duration: 1500
        })
        break;
    }
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
  
  //事件：选择充值套餐
  selectRechargePackage:function(e){
    let that=this,selRCIndex=0;
    try {
      selRCIndex = parseInt(e.currentTarget.dataset.index);
      selRCIndex = isNaN(selRCIndex) ? 0 : selRCIndex;
    } catch (e) {}
    that.setData({
      ["selRCIndex"]:selRCIndex,
    })
    that.afterSelRCItem(selRCIndex);   
  },
  //方法：选中套餐后相应处理
  afterSelRCItem:function(index){
    let that=this,memberLevelList=that.data.memberLevelList,memberRechargePackageList=that.data.memberRechargePackageList,curMemIntegrals=that.data.curMemIntegrals,curMemSort=that.data.curMemSort,selRCItem=memberRechargePackageList[index],selUpgradeMemLevelItem=null,getMemIntegrals=that.data.curUseIntegrals;

    if(Utils.isNotNull(selRCItem)){
      getMemIntegrals+=selRCItem.integral;
      let upSortName="",upSort=curMemSort;
      for(let i=0;i<memberLevelList.length;i++){
        if(getMemIntegrals>=memberLevelList[i].integral){
          upSort=memberLevelList[i].sort;
          upSortName=memberLevelList[i].name;
        }
      }
      if(upSort<=curMemSort){
        upSortName='';
      }
      selUpgradeMemLevelItem={id:selRCItem.id,price:selRCItem.price,integral:selRCItem.integral,upSort:upSort,upSortName:upSortName}
    }else{
      selUpgradeMemLevelItem={id:0,price:0.00,integral:0,upSort:0,upSortName:""}
    }
    that.setData({
      ["selUpgradeMemLevelItem"]:selUpgradeMemLevelItem,
    })
    try{
      that.gotoRechargeRankTop(index);
    }catch(e){}
  },
  //事件：立即充值
  submitRechargeItem:function(e){
    let that=this,selUpgradeMemLevelItem=that.data.selUpgradeMemLevelItem, reChargeSum = Utils.isNotNull(selUpgradeMemLevelItem)?selUpgradeMemLevelItem.price:0.00;
    //注册用户检测
    if(Utils.isNotNull(app.globalData.userInfo) && (Utils.isNull(app.globalData.userInfo.userMobile) || app.globalData.userInfo.userMobile.indexOf("u_")>=0)){
      wx.showModal({
        title: '提示',
        content: '该功能需要注册用户，您是否继续？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //app.data.curPageDataOptions对象属性说明：
            //package：源页面所在分包名称
            //page：源页面所在分包路径，例如：/pages/remaining/remaining
            //options：源页面的加载参数
            app.data.curPageDataOptions={
              package:"packageVP",page:"/pages/Mymember/Mymember",options: that.data.srcOptions,
            }
            wx.redirectTo({
              url: '/packageYK/pages/tiedaphone/tiedaphone?lgt=2'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')   
          }
        }
      })
      
      return;
    }
    
    if (!that.data.isAgreTreaty){
      wx.showToast({
        title: "请阅读并同意充值协议！",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (that.data.isDowithing){
      wx.showToast({
        title: "支付进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (reChargeSum<=0){
      wx.showToast({
        title: "充值金额必须大于0！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    reChargeSum=isTestPrice?0.01:reChargeSum;
    that.setData({
      ["reChargeSum"]: reChargeSum
    })
    that.data.isDowithing=true;
    that.data.isForbidRefresh=true;
    that.getPrePayId();
  },
  /////////////////////////////////////////////////////
  //----充值-------------------------------------------
  //方法：获取预支付ID
  getPrePayId: function () {
    var that = this,selUpgradeMemLevelItem=that.data.selUpgradeMemLevelItem,RechargeType=19, attach = "6_0_" + app.data.hotelId + "_3", reChargeSum = that.data.reChargeSum,rcId=Utils.isNotNull(selUpgradeMemLevelItem)?selUpgradeMemLevelItem.id:0;
    //订单号生产
    let timestamp = Date.parse(new Date()), randomNo = 0,orderId="";
    timestamp = timestamp / 1000;
    randomNo=Utils.random(100,999);
    orderId=timestamp+""+randomNo;
    that.data.rechargeOrderId=orderId;
    //attach说明：
    attach+=","+rcId+"_"+RechargeType+"_"+orderId;
    app.getPrePayId0(that, attach, reChargeSum,"会员充值");
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this,selUpgradeMemLevelItem=that.data.selUpgradeMemLevelItem, rcId = Utils.isNotNull(selUpgradeMemLevelItem)?selUpgradeMemLevelItem.id:0;
    that.data.isDowithing = false;
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;
        console.log("支付发起成功！")
        let loginType=that.data.loginType;
        wx.showModal({
          title: '提示',
          content: "充值成功！",
          showCancel:false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              if(loginType==2 && Utils.isNotNull(selUpgradeMemLevelItem)){
                //充值免单操作
                //领取充值福利
                app.receiveRechargeWelfareInfo(that,that.data.selFreeOrderCouponId,1);
              }else{
                //跳转充值成功页面
                that.gotoRechargeSuccedPage(rcId,that.data.selUpgradeMemLevelItem);
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
  //方法：跳转充值成功页面
  gotoRechargeSuccedPage:function(rId,selUpgradeMemLevelItem){
    let that=this,memberLevelList=that.data.memberLevelList,curMemIntegrals=that.data.curMemIntegrals,upIntegrals=0;
    if(!Utils.isNotNull(selUpgradeMemLevelItem)){
      wx.showToast({
        title: "充值套餐信息无效！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    curMemIntegrals+=selUpgradeMemLevelItem.integral;
    for(let i=0;i<memberLevelList.length;i++){
      if(memberLevelList[i].integral>curMemIntegrals){
        upIntegrals=memberLevelList[i].integral - curMemIntegrals;
        break;
      }
    }
    

    let otherParams="&id="+rId+"&oid="+that.data.rechargeOrderId;
    otherParams+="&rprice="+selUpgradeMemLevelItem.price;
    otherParams+="&pprice="+that.data.reChargeSum;
    otherParams+="&rint="+selUpgradeMemLevelItem.integral;
    otherParams+="&aint="+curMemIntegrals;
    otherParams+="&uint="+upIntegrals;
    app.gotoCommonPage(that,"packageVP","Paysucces",0,otherParams);
    that.data.isForbidRefresh=false;
  },
  //方法：获取用户积分结果处理函数
  dowithGetMemberIntegrals: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取用户积分结果：");
        console.log(dataList);
        let curUseIntegrals=0,curMemIntegrals=0;
        let allEnableIntegrals=0, allUsedIntegrals=0;
        if(Utils.isNotNull(dataList)){
          //获取累积可用积分
          if(Utils.isNotNull(dataList.addMap)){
            if(Utils.isDBNotNull(dataList.addMap.expenditure_integral)){
              try{
                allEnableIntegrals=parseInt(dataList.addMap.expenditure_integral);
                allEnableIntegrals=isNaN(allEnableIntegrals)?0:allEnableIntegrals;
              }catch(e){}
            }
            if(Utils.isDBNotNull(dataList.addMap.integral)){
              try{
                curMemIntegrals=parseInt(dataList.addMap.integral);
                curMemIntegrals=isNaN(curMemIntegrals)?0:curMemIntegrals;
              }catch(e){}
            }
          }
          //获取已使用可用积分
          if(Utils.isNotNull(dataList.cutMap)){
            if(Utils.isDBNotNull(dataList.cutMap.expenditure_integral)){
              try{
                allUsedIntegrals=parseInt(dataList.cutMap.expenditure_integral);
                allUsedIntegrals=isNaN(allUsedIntegrals)?0:allUsedIntegrals;
              }catch(e){}
            }
          }
          //获取未使用可用积分
          curUseIntegrals=allEnableIntegrals>=allUsedIntegrals?allEnableIntegrals-allUsedIntegrals:0;          
        }
        that.setData({
          ["curUseIntegrals"]: curUseIntegrals,
          ["curMemIntegrals"]:curMemIntegrals,
        })
        app.getMemberFeeItemList(that);
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取用户积分失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  gotoRechargeRankTop:function(e){
    let that=this;
    let query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    query.select("#rank"+e).boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      var miss = 0;
      if(Utils.isNotNull(res)){
        if(Utils.isNotNull(res[0]) && Utils.isNotNull(res[0].scrollTop)) miss += res[0].scrollTop;
        if(Utils.isNotNull(res[1]) && Utils.isNotNull(res[1].top)) miss += res[1].top;
        miss -= 10;

        if(Utils.isNotNull(res[1]) && Utils.isNotNull(res[1].height)){
          miss = miss - ((Differenheight/4)-(res[1].height/2))
        }
      }
       
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 300
      });
    });
  },
  //事件：点击勾选框
  clickCheckbox: function () {
    this.setData({
      isAgreTreaty: !this.data.isAgreTreaty
    })
  },
  //隐藏协议
  onMyEvent(e) {
    this.setData({
      showModalserve: e.detail.myNum
    })
  },
  // 打开协议
  showModalserve: function () {
    this.setData({
      showModalserve: true,
    })
    this.selectComponent("#towerId").initData()
  },
})
// packageVP/pages/mkghetrstwo/mkghetrstwo.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    loginType:1,                 //登录类型：1查看，0核销
    curOrderId:"",               //充值订单号
    curUserId:0,                 //充值用户ID
    curUserMobile:"",            //充值用户手机号
    curVerify:0,                 //当前充值类型：0无核销商品 1有商品未核销 2有商品已核销
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    
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
        let loginType=0,curOrderId="",curUserId=0;
        
        if (Utils.isNotNull(sOptions.oid)) {
          try {
            curOrderId = Utils.myTrim(sOptions.oid);
          } catch (e) { }
        }
        if (Utils.isNotNull(sOptions.uid)) {
          try {
            curUserId = parseInt(sOptions.uid);
            curUserId = isNaN(curUserId) ? 0 : curUserId;
          } catch (e) { }
        }
        if (Utils.isNotNull(sOptions.lp)) {
          try {
            loginType = parseInt(sOptions.lp);
            loginType = isNaN(loginType) ? 0 : loginType;
          } catch (e) { }
        }
        //核销管理角色：1、loginType为0；2、当前用户必须为系统角色用户
        that.setData({
          ["loginType"]: loginType==0 && app.data.user_roleId>0?0:1,
          ["curOrderId"]: curOrderId,
          ["curUserId"]: curUserId,
        })
        that.getMainDataList();
        
        break;
    }
  },
  //方法：获取信息
  getMainDataList:function(){
    let that=this,otherParams="&companyId="+app.data.companyId;
    otherParams+="&orderId="+that.data.curOrderId;
    //获取会员充值详情
    app.getMemberRechargeDetail(that,that.data.curUserId,otherParams,1000,1);
    //获取相应用户信息
    app.getUserPersonInfo(that,that.data.curUserId);
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

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //方法：获取会员充值详情结果处理函数
  dowithGetMemberRechargeDetail: function (dataList, tag, errorInfo, pageIndex) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取会员充值详情结果：");
        console.log(dataList);
        let rechargeDataObj=null;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0){
          let data = dataList.dataList,dataItem=data[0];
          let tradeNo="",orderId="",userId=0,price=0.00,money=0.00,integral=0,orImgUrl="",productId=0,verify=0,verify_content="",updateDate=new Date(),updateDateStr="",verify_addr="",verify_admin="",verify_adminUId=0,content="";
          let verifyArray=null;
          
          if (Utils.isDBNotNull(dataItem.verify))
          {
            try{
              verify = parseInt(dataItem.verify);
              verify = isNaN(verify) ? 0 : verify;
            }catch(e){}
          }
          if (Utils.isDBNotNull(dataItem.iupdateDate)) {
            try {
              updateDate = new Date(Date.parse((dataItem.iupdateDate + "").replace(/-/g, "/")))
            } catch (e) { updateDate = new Date(); }
            updateDateStr = Utils.getDateTimeStr(updateDate, "/", true);
          }
          if (Utils.isDBNotNull(dataItem.userId))
          {
            try{
              userId = parseInt(dataItem.userId);
              userId = isNaN(userId) ? 0 : userId;
            }catch(e){}
          }
          if (Utils.isDBNotNull(dataItem.integral))
          {
            try{
              integral = parseInt(dataItem.integral);
              integral = isNaN(integral) ? 0 : integral;
            }catch(e){}
          }
          if (Utils.isDBNotNull(dataItem.productId))
          {
            try{
              productId = parseInt(dataItem.productId);
              productId = isNaN(productId) ? 0 : productId;
            }catch(e){}
          }
          if (Utils.isDBNotNull(dataItem.tradeNo)){
            tradeNo = dataItem.tradeNo;
          }
          if (Utils.isDBNotNull(dataItem.orderId)){
            orderId = dataItem.orderId;
          }
          if (Utils.isDBNotNull(dataItem.content)){
            content = dataItem.content;
          }
          if (Utils.isDBNotNull(dataItem.orImgUrl)){
            orImgUrl = dataItem.orImgUrl;
          }
          if (Utils.isDBNotNull(dataItem.verify_content)){
            verify_content = dataItem.verify_content;
          }
          if(Utils.myTrim(verify_content)!=""){
            try{
              verifyArray=verify_content.split(",");
              if(Utils.isNotNull(verifyArray) && verifyArray.length>=3){
                verify_addr=verifyArray[0];verify_admin=verifyArray[1];
                try{
                  verify_adminUId = parseInt(verifyArray[2]);
                  verify_adminUId = isNaN(verify_adminUId) ? 0 : verify_adminUId;
                }catch(e){}
               }
            }catch(e){}
          }
          
          if (Utils.isDBNotNull(dataItem.price)){
            try{
              price = parseFloat(dataItem.price);
              price = isNaN(price) ? 0.00 : price;
              price=parseFloat((price).toFixed(app.data.limitQPDecCnt));
            }catch(e){}
          }   
          if (Utils.isDBNotNull(dataItem.money)){
            try{
              money = parseFloat(dataItem.money);
              money = isNaN(money) ? 0.00 : money;
              money=parseFloat((money).toFixed(app.data.limitQPDecCnt));
            }catch(e){}
          }   
          price=price>0?price:money;
          //verify：0无核销商品 1有商品未核销 2有商品已核销 
          rechargeDataObj={tradeNo:tradeNo,orderId:orderId,userId:userId,price:price,money:money,integral:integral,orImgUrl:orImgUrl,productId:productId,verify:verify,updateDateStr:updateDateStr,verify_addr:verify_addr,verify_admin:verify_admin,verify_adminUId:verify_adminUId,content:content,}

          that.setData({
            ["rechargeDataObj"]: rechargeDataObj,
            ["curVerify"]:verify,
          })

          //如果有商品且未核销，没有生成小程序码，则自动生成并保存
          if(verify==1 && Utils.myTrim(orImgUrl)==""){
            that.createWXQRCodeImg();
          }
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员充值详情失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取用户详情结果处理函数
  dowithGetUserPersonInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取用户信息结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList)){
          let curUserMobile="";
          if (Utils.isDBNotNull(dataList.mobile)){
            curUserMobile = dataList.mobile;
          }
          that.setData({
            ["curUserMobile"]: curUserMobile,
          })
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员充值详情失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：生成小程序二维码
  createWXQRCodeImg: function () {
    let that = this, rechargeDataObj = that.data.rechargeDataObj;
    //page：二维码页面地址，pageData：二维码参数字符串（用“|”替代“&”）
    let page = "packageVP/pages/mkghetrstwo/mkghetrstwo", pageData = "oid=" + rechargeDataObj.orderId+"|uid="+rechargeDataObj.userId;
    app.createWXQRCodeImg(that, page, pageData);
  },
  //方法：生成代理公司小程序二维码结果处理函数
  setWXQRCodeImg: function (imgSrc) {
    let that = this, rechargeDataObj = that.data.rechargeDataObj, otherParams = "&companyId="+app.data.companyId;
    console.log("小程序二维码图片生成结果：" + imgSrc)
    that.setData({
      ["rechargeDataObj.orImgUrl"]: imgSrc,
    })
    otherParams+="&isverify=0&orImgUrl="+encodeURIComponent(imgSrc);
    app.saveMemberRechargeDetail(that,rechargeDataObj.userId,rechargeDataObj.orderId,otherParams,1);
  },
  //事件：核销充值记录
  submitVerifyRechargeInfo:function(e){
    let that=this,rechargeDataObj=that.data.rechargeDataObj,otherParams = "&companyId="+app.data.companyId,adminName="",adminAddr="",vProductDetail="";
    adminName=Utils.isNotNull(appUserInfo.userName)?appUserInfo.userName:"";
    if(Utils.isNotNull(app.data.agentCompanyId) && app.data.agentCompanyId>0 && Utils.isNotNull(app.data.agentUserCompanyList) && app.data.agentUserCompanyList.length>0){
      for(let i=0;i<app.data.agentUserCompanyList.length;i++){
        if(app.data.agentCompanyId==app.data.agentUserCompanyList[i].id){
          adminAddr=app.data.agentUserCompanyList[i].companyName;break;
        }
      }
    }
    vProductDetail=adminAddr+","+adminName+","+appUserInfo.userId;
    otherParams+="&isverify=1&verify_content="+encodeURIComponent(vProductDetail);
    app.saveMemberRechargeDetail(that,rechargeDataObj.userId,rechargeDataObj.orderId,otherParams,0);
  },
  //方法：充值记录修改结果处理函数
  dowithSaveMemberRechargeDetail: function (dataList, tag,operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取用户信息结果：");
        console.log(dataList);
        switch(operateTag){
          case 1:
            break;
          case 0:
            wx.showToast({
              title: "核销成功！",
              icon: 'none',
              duration: 2000
            })
            setTimeout(that.getMainDataList, 2000);
            break;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员充值详情失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：跳转扫码核销界面
  gotoSCanQRCodeRCVPage:function(e){
    let that=this,url="";
    url="/pages/scanCode/scanCode?login=2&alt="+encodeURIComponent("请扫码做充值核销");
    wx.redirectTo({
      url: url
    })
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
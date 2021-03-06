// pages/userLogin/userLogin.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,timeOutPersonCenter=null;
var packSMPageUrl = "../../packageSMall/pages", packYKPageUrl = "../../packageYK/pages", packTempPageUrl = "../../packageTemplate/pages", packOTPageUrl = "../../packageOther/pages", packComPageUrl = "../../packageCommercial/pages", packMainPageUrl = "../../pages", mainFootDir = "../../", packOtherPageUrl = "../../packageOther/pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,         //是否已经加载
    DataURL: DataURL,      //远程资源路径

    accountName:"",
    accountPwd:"",

    userLoginImgUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    appUserInfo = app.globalData.userInfo;
    that.setData({
      userLoginImgUrl: DataURL+"/images/" + app.data.userLoginImgUrl
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutPersonCenter != null && timeOutPersonCenter != undefined) clearTimeout(timeOutPersonCenter);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutPersonCenter != null && timeOutPersonCenter != undefined) clearTimeout(timeOutPersonCenter);
    } catch (err) { }
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
      case "accountName":
        that.setData({
          accountName: value
        })
        break;
      case "accountPwd":
        that.setData({
          accountPwd: value
        })
        break;
    }
  },
  //事件：登录事件
  submitLoginInfo:function(e){
    let that=this;
    if(Utils.myTrim(that.data.accountName) == ""){
      wx.showToast({
        title: "请输入账号！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.validLoginDataInfo();
  },
  //方法：验证登录账户
  validLoginDataInfo: function () {
    let that = this, accountName = that.data.accountName, accountPwd = that.data.accountPwd, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_companyAndUser&action=companyAndUserList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userName=" + encodeURIComponent(accountName) + "&sign=" + sign+"&cashId=&password=" + accountPwd;;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("登录结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data,userId=0, user_roleId = 0, accountRecordId = 0, accountCompanyIdList="",firstCompanyId=0;
          if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
            let oldPwd="";
            accountRecordId = mainData.dataList[0].id;
            if (Utils.isNotNull(mainData.dataList[0].password) && Utils.myTrim(mainData.dataList[0].password + "") != "null") {
              oldPwd = Utils.myTrim(mainData.dataList[0].password);
            }
            if (oldPwd != Utils.myTrim(accountPwd)){
              wx.showToast({
                title: "密码错误！",
                icon: 'none',
                duration: 2000
              })
              return;
            }
            if (Utils.isNotNull(mainData.dataList[0].userId) && Utils.myTrim(mainData.dataList[0].userId + "") != "null") {
              try {
                userId = parseInt(mainData.dataList[0].userId);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) { }
            }
            
            if (Utils.isNotNull(mainData.dataList[0].user_roleId) && Utils.myTrim(mainData.dataList[0].user_roleId + "") != "null") {
              try {
                user_roleId = parseInt(mainData.dataList[0].user_roleId);
                user_roleId = isNaN(user_roleId) ? 0 : user_roleId;
              } catch (err) { }
            }
            //companyMsgId
            if (Utils.isNotNull(mainData.dataList[0].companyMsgId) && Utils.myTrim(mainData.dataList[0].companyMsgId + "") != "null") {
              accountCompanyIdList = Utils.myTrim(mainData.dataList[0].companyMsgId);
              accountCompanyIdList=Utils.myTrim(accountCompanyIdList)==""?app.data.companyId+"":accountCompanyIdList;
              //firstCompanyId
              if (Utils.myTrim(accountCompanyIdList)){
                let comArray=accountCompanyIdList.split(",");
                if(comArray.length>0){
                  try{
                    firstCompanyId=parseInt(comArray[0]);
                    firstCompanyId=isNaN(firstCompanyId)?0:firstCompanyId;
                  }catch(e){}
                }
              }
            }
          }
          
          if (user_roleId > 0) {
            console.log("登录：成功！user_roleId:" + user_roleId)
            app.data.user_roleId = user_roleId;
            app.data.accountRecordId = accountRecordId;
            app.data.accountUserName = accountName;
            app.data.accountUserPWD = accountPwd;
            app.data.accountBindUserId=userId;
            app.data.accountCompanyIdList = accountCompanyIdList;
            app.data.agentCompanyId = app.data.agentCompanyId <= 0 && firstCompanyId>0 ? firstCompanyId : app.data.agentCompanyId;
            if (userId <= 0) {
              wx.showModal({
                title: '提示',
                content: '该账户尚未绑定，您确定将当前用户跟该账户绑定吗？',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.updateLoginDataInfo(accountRecordId);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    app.setSysUserAccountInfo();
                    that.gotoMyPersonCenter();
                  }
                }
              })
            }else{
              app.setSysUserAccountInfo();
              that.gotoMyPersonCenter();
            }
          }else{
            wx.showToast({
              title: "无效账户！",
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          app.setErrorMsg2(that, "登录失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "登录信息获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  gotoMyPersonCenter:function(){
    let that=this,url = packMainPageUrl + "/mine/mine";
    wx.switchTab({
      url: url
    });
  },
  //方法：绑定账户的用户ID
  updateLoginDataInfo: function (id) {
    let that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "",dataJsonStr="", dataJson = {
      id: id, userId: appUserInfo.userId};
    dataJsonStr = JSON.stringify(dataJson)
    urlParam = "cls=main_companyAndUser&action=saveCompanyAndUser&userId=" + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&datajson=" + dataJsonStr + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("登录更新结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          console.log("登录更新成功!")
          app.data.accountBindUserId = appUserInfo.userId;
          app.setSysUserAccountInfo();
          timeOutPersonCenter = setTimeout(that.gotoMyPersonCenter, 2000);
          wx.showToast({
            title: "账户绑定成功！",
            icon: 'none',
            duration: 2000
          })
        } else {
          app.setSysUserAccountInfo();
          timeOutPersonCenter = setTimeout(that.gotoMyPersonCenter, 2000);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "登录更新失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        app.setSysUserAccountInfo();
        app.setErrorMsg2(that, "登录更新：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
})
// packageYK/pages/tiedaphone/tiedaphone.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var WXBizDataCrypt = require('../../../utils/RdWXBizDataCrypt.js');//WXBizDataCrypt
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,sOptions=null;
var mainPackageUrl = "../../../pages",mainFootDir ="../../",reTryCnt=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo

    loginType:0,                       //登录类型：0免费按摩绑定手机号，1其他绑定手机号，2注册用户
    
    contact:"微信用户",     //昵称
    mobile:"",             //手机号码
    avatarUrl:"",

    isAuthorizeMobile:false,
    getPerDisabled: false,  //获取验证码按钮是否可用
    timeStatus: false,     //是否重置获取验证码按钮
    time: '验证',     //倒计时 
    currentTime: 60,       //倒计时最大数值
    personPIN: "",          //验证码

    sendTimestamp: null,    //发送时间戳
    sourceRandomNum: "",    //源验证码
    targetMobile: "",       //目的手机号

    tabIndex:0,          //0一键绑定，1手动绑定

    encryptedData:"",
    iv:"",

    curPageDataOptions:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,isScene = false,dOptions = null;
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
    } else {
      sOptions = options;
    }
    
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
        let loginType=0,curPageDataOptions=null;
        try {
          if (Utils.isNotNull(sOptions.lgt) && Utils.myTrim(sOptions.lgt + "") != "") {
            loginType = parseInt(sOptions.lgt);
            loginType = isNaN(loginType) ? 0 : loginType;
          }
        } catch (e) {}
        if(loginType>=1){
          curPageDataOptions=app.data.curPageDataOptions;
        }
        that.setData({
          ["contact"]: appUserInfo.userName,
          ["mobile"]:appUserInfo.userMobile,
          ["avatarUrl"]:appUserInfo.avatarUrl,

          ["loginType"]:loginType,
          ["curPageDataOptions"]:curPageDataOptions,
        })
        
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
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //事件：切换Tab页面
  exchangeTabPage:function(e){
    let that=this,tag=0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    if(that.data.tabIndex!=tag){
      that.setData({
        ["tabIndex"]: tag,
      })
    }
  },
  //事件：获取用户信息
  getUserInfo:function(e){
    let that=this,userInfo=null;
    userInfo = e.detail.userInfo;
    if(Utils.isNotNull(userInfo)){
      that.setData({
        ["contact"]: Utils.isNotNull(userInfo.nickName)?userInfo.nickName:that.data.contact,
        ["avatarUrl"]: Utils.isNotNull(userInfo.avatarUrl)?userInfo.avatarUrl:that.data.avatarUrl,
      })
    }
  },
  getAPIUserInfo:function(){
    let that=this;
    wx.getUserInfo({
      success: function(res) {
        let userInfo = res.userInfo;
        if(Utils.isNotNull(userInfo)){
          that.setData({
            ["contact"]: Utils.isNotNull(userInfo.nickName)?userInfo.nickName:that.data.contact,
            ["avatarUrl"]: Utils.isNotNull(userInfo.avatarUrl)?userInfo.avatarUrl:that.data.avatarUrl,
          })
        }
      }
    })
  },
  //事件：获取手机号码授权事件
  getPhoneNumber: function (e) {
    var that = this;

    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      console.log(e.detail)
      that.setData({
        ["encryptedData"]: e.detail.encryptedData,
        ["iv"]: e.detail.iv,
      })
      //调用登录接口，获取 code 解密信息
      wx.login({
        success: function (res) {
          //发起网络请求
          console.log("code:"+res.code);
          let otherParams="&xcxAppId=" + app.data.wxAppId;
          otherParams+="&js_code=" + res.code;
          app.getWechatSessionKey(that,otherParams)
        }
      })
    }
  },
  //方法：获取Session结果处理函数
  dowithGetWechatSessionKey: function (dataList, tag, errorInfo) {
    let that = this;
    
    switch (tag) {
      case 1:
        console.log("获取Session结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.session_key)) {
          let pc = new WXBizDataCrypt(app.data.wxAppId, dataList.session_key)
          let data = pc.decryptData(that.data.encryptedData , that.data.iv)
          //phoneNumber
          console.log('解密后 data: ', data)
          if(Utils.isNotNull(data) && Utils.isNotNull(data.phoneNumber)){
            reTryCnt=0;
            that.setData({
              ["mobile"]: data.phoneNumber,
              ["isAuthorizeMobile"]:true,
            })
            if(that.data.loginType!=2){
              that.savePersonInfo();
            }            
          }else{
            // if(reTryCnt<=3){
            //   //调用登录接口，获取 code 解密信息
            //   wx.login({
            //     success: function (res) {
            //       //发起网络请求
            //       console.log("code:"+res.code);
            //       let otherParams="&xcxAppId=" + app.data.wxAppId;
            //       otherParams+="&js_code=" + res.code;
            //       reTryCnt++;
            //       console.log("解密重试次数（"+reTryCnt+"）")
            //       app.getWechatSessionKey(that,otherParams)
            //     }
            //   })
            // }else{
              wx.showToast({
                title: '手机号码获取失败,请重试！',
                icon: 'none',
                duration: 2000
              })
            // }
          }
        }
        break;
      default:
        reTryCnt=0;
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Session失败！";
        break;
    }
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    let value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    let len = Utils.getStrlengthB(value);
    switch (cid) {
      case "mobile":
        that.setData({
          mobile: value
        })
        break;
      case "contact":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          contact: value
        })
        break;
      case "personPIN":
        that.setData({
          personPIN: value
        })
        break;
    }
  },
  //事件：验证手机号码
  getPersonPIN: function (e) {
    var that = this;
    var mobile = that.data.mobile;
    if (Utils.isNull(mobile)) {
      wx.showToast({
        title: "请输入手机号码！",
        icon: 'none',
      })
      return;
    } else if (!Utils.mobileVer(mobile)) {
      wx.showToast({
        title: "请输入正确手机号码！",
        icon: 'none',
      })
      return;
    }
    that.checkMobile();
  },
  //方法：检查手机号是否重复
  checkMobile :function(){
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.setData({
      getPerDisabled: true
    })
    var urlParam = "cls=main_user&action=checkUserMobileReg&mobile=" + that.data.mobile +  "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("检查手机是否重复：",res)
        if (res.data.rspCode == 0) {
          that.requestGetPersonPIN();
        } else if (res.data.rspCode == -2){
          wx.showToast({
            title: '手机号码已经注册，请重新输入其他手机号码！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            getPerDisabled: false,
          })
        } else {
          app.setErrorMsg2(that, "检查手机号码失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '网络异常！',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            getPerDisabled: false,
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取注册验证码失败：fail：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          getPerDisabled: false,
        })
        console.log("失败：" + err)
      }
    })
  },
  //方法：获取验证码
  requestGetPersonPIN:function(){
    var that = this, randomNum = "", content = "", sysName = "九牛会";//that.data.sysName;
    
    for (var i = 0; i < 4; i++) {
      var num = parseInt(10 * Math.random());
      randomNum = randomNum + num;
    }
    content = "【" + sysName + "】验证码：" + randomNum + " 。您正在进行注册验证，有效时间为10分钟。";
    that.data.sourceRandomNum = randomNum;
    that.data.targetMobile = that.data.mobile;
    that.setData({
      getPerDisabled: true
    })
    app.sendSMSMessage(that, that.data.mobile, content);
  },
  //方法：短信返回处理方法
  dowithSMSMessage: function (tag, timestamp) {
    var that = this, currentTime = that.data.currentTime;
    //1成功，0失败
    switch (tag) {
      case 1:
        that.data.sendTimestamp = timestamp;
        that.setData({
          time: currentTime + 'S',
        })
        var interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime + 'S',
            currentTime: currentTime,
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重试',
              currentTime: 60,
              getPerDisabled: false,
            })
          } else if (that.data.timeStatus) {
            clearInterval(interval)
            that.setData({
              time: '验证',
              currentTime: 60,
              getPerDisabled: false,
            })
          }
        }, 1000)
        break;

      default:
        wx.showToast({
          title: "获取验证码失败！",
          icon: 'none',
          duration: 1500
        })
        that.setData({
          getPerDisabled: false,
        })
        break;
    }
  },
  //事件：保存提交
  submitDataInfo: function (e) {
    var that = this,isAuthorizeMobile=that.data.isAuthorizeMobile;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var code = that.data.sourceRandomNum, time = that.data.sendTimestamp, mobile = that.data.targetMobile;
    if (!Utils.isNull(time) && !Utils.isNull(code) && !Utils.isNull(code)) {
      time = time + 600;
    }
    if (Utils.isNull(that.data.mobile)) {
      wx.showToast({
        title: "请输入手机号码！",
        icon: 'none',
      })
      return;
    } else if (!isAuthorizeMobile && Utils.isNull(that.data.personPIN)) {
      wx.showToast({
        title: "请输入验证码！",
        icon: 'none',
      })
      return;
    } else if (!isAuthorizeMobile && mobile != that.data.mobile) {
      wx.showToast({
        title: "请获取验证码！",
        icon: 'none',
      })
      return;
    } else if (!isAuthorizeMobile && Utils.isNull(time)) {
      wx.showToast({
        title: "请获取验证码！",
        icon: 'none',
      })
      return;
    } else if (!isAuthorizeMobile && time < timestamp) {
      wx.showToast({
        title: "验证码已过期，请重新获取！",
        icon: 'none',
      })
      return;
    } else if (!isAuthorizeMobile && that.data.personPIN != code) {
      wx.showToast({
        title: "验证码错误，请重新输入！",
        icon: 'none',
      })
      return;
    }
    that.savePersonInfo();
  },
  //方法：注册
  savePersonInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    if(that.data.loginType==2){
      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&contact=" + encodeURIComponent(that.data.contact) + "&headerImg=" + encodeURIComponent(that.data.avatarUrl) +"&mobile=" + that.data.mobile +  "&updateTime=1&sign=" + sign;
    }else{
      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&mobile=" + that.data.mobile +  "&updateTime=1&sign=" + sign;
    }
    
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          console.log('注册账号成功')
          var userMap = res.data.data.userMap;
          app.globalData.userInfo.userName = userMap.contact;
          app.globalData.userInfo.userMobile = userMap.mobile;
          app.globalData.userTotalInfo.mobile = userMap.mobile;
          
          app.globalData.userTotalInfo = userMap;
          wx.removeStorageSync('Vcode')
          wx.removeStorageSync('VcodeTime')
          wx.removeStorageSync('Vmobile')
          
          app.data.isRegisterMobile=Utils.myTrim(app.globalData.userInfo.userMobile)!=""?true:false;
          switch(that.data.loginType){
            case 1:
              wx.showToast({
                title: '手机号码注册成功！',
                icon: 'none',
                duration: 2000
              })
              setTimeout(that.gotoBackRegPage, 2000);
              break;
            case 2:
              wx.showToast({
                title: '用户注册成功！',
                icon: 'none',
                duration: 2000
              })
              setTimeout(that.gotoBackRegPage, 2000);
              break;
            default:
              //领取免费按摩劵
              console.log("领取免费按摩劵。。。。。。")
              let otherParams="&xcxAppId=" + app.data.wxAppId;
              app.getFreeCheirapsisDataInfo(that,app.data.agentCompanyId,otherParams);
              break;
          }
          
        } else if (res.data.rspCode == -2) {
          wx.removeStorageSync('Vcode')
          wx.removeStorageSync('VcodeTime')
          wx.removeStorageSync('Vmobile')
          wx.showToast({
            title: '手机号码已经注册，请重新输入其他手机号码！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            disabled: false
          })
        }  else {
          app.setErrorMsg2(that, "注册账号失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "注册账号失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：领取免费按摩劵结果处理函数
  dowithGetFreeCheirapsisDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("领取免费按摩劵结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          let dataItem = dataList.resultMap,id=0,mincnt=0;
          id=dataItem.id;
          if (dataItem.duration != null && dataItem.duration != undefined && Utils.myTrim(dataItem.duration + "") != "null") {
            try {
              mincnt = parseInt(dataItem.duration);
              mincnt = isNaN(mincnt) ? 0 : mincnt;
            } catch (err) { }
          }
          this.gotoFreeCouponPage(id,mincnt);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取免费按摩劵失败！";
        break;
    }
  },
  //方法：跳转免费按摩劵领取结果页面
  gotoFreeCouponPage:function(id,mincnt){
    let that=this,url="/packageYK/pages/GetAMassage/GetAMassage?id="+id+"&mcnt="+mincnt;
    console.log("gotoFreeCouponPage:"+url)
    wx.redirectTo({
      url: url,
    })
  },
  //方法：跳转原调用页面
  gotoBackRegPage:function(){
    let that=this,curPageDataOptions=that.data.curPageDataOptions;
    if(Utils.isNotNull(curPageDataOptions)){
      let url= "",params="";
      url=Utils.isNull(curPageDataOptions.package)?curPageDataOptions.page:"/"+curPageDataOptions.package+curPageDataOptions.page;
      params=Utils.isNotNull(curPageDataOptions.options)?Utils.jsonToUrl(curPageDataOptions.options):"";
      url+=Utils.myTrim(params) != ''?"?"+params:"";

      wx.redirectTo({
        url: url
      })
    }
  }
})
// pages/login/login.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var PYTool = require('../../utils/pinyin.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,sOptions=null;
var mainFootDir ="../../";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo
    isShowAuthor: false, //授权提示
    showguidance: false,
    showModalserve: false,
    showCheckbox: false,
    DataURL: DataURL,      //远程资源路径

    headerImg:"",
    contact:"",

    getPerDisabled: false,  //获取验证码按钮是否可用
    timeStatus: false,     //是否重置获取验证码按钮
    time: '获取验证码',     //倒计时 
    currentTime: 60,       //倒计时最大数值
    personPIN: "",          //验证码

    sendTimestamp: null,    //发送时间戳
    sourceRandomNum: "",    //源验证码
    targetMobile: "",       //目的手机号

    //目的跳转页
    srcGotoPack:"",              //分包名称
    srcGotoPage:"",              //页面名称
    srcGotoParams: "",           //页面参数（第一个参数非“&”开头
    srcGotoPageType: "",         //0普通页面，1tabbar页面
  },
  onLoad: function (options){
    let that = this;
    that.dowithParam(options);
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
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }
    //分享人获取
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
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this, isQRScene = that.data.isQRScene;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        if (app.globalData.userInfo == null) {
          that.getSetting();
        } else if (Utils.isNull(app.globalData.userInfo.avatarUrl)) {
          that.getSetting();
        } else if (Utils.myTrim(app.globalData.userInfo.avatarUrl)) {
          that.setData({
            headerImg: app.globalData.userInfo.avatarUrl
          })
        }
        if (Utils.myTrim(app.globalData.userInfo.avatarUrl)) {
          that.setData({
            headerImg: app.globalData.userInfo.avatarUrl
          })
        }
        let srcGotoPack = "", srcGotoPage = "", srcGotoParams = "", srcGotoPageType = 0;
        try {
          if (sOptions.stpack != null && sOptions.stpack != undefined)
            srcGotoPack = decodeURIComponent(sOptions.stpack);
          if (sOptions.stpage != null && sOptions.stpage != undefined)
            srcGotoPage = decodeURIComponent(sOptions.stpage);
          if (options.stparams != null && options.stparams != undefined)
            srcGotoParams = decodeURIComponent(options.stparams);
          if (options.stptype != null && options.stptype != undefined) {
            try {
              srcGotoPageType = parseInt(options.stptype);
              srcGotoPageType = isNaN(srcGotoPageType) ? 0 : srcGotoPageType;
            } catch (err) { }
          }
        } catch (e) { }
        that.setData({
          sysLogoUrl: app.data.sysLogoUrl,
          srcGotoPack: srcGotoPack,
          srcGotoPage: srcGotoPage,
          srcGotoParams: srcGotoParams,
          srcGotoPageType: srcGotoPageType,
        })
        break;
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    let that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    let that = this;
    app.getAuthorizeUserInfo(that, e);
  },
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
  //检查手机号是否重复
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
  //获取验证码
  requestGetPersonPIN:function(){
    var that = this, randomNum = "", content = "", sysName = that.data.sysName;
    sysName = app.data.sysAppType == 1? "微官网" : sysName;
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
              time: '重新获取',
              currentTime: 60,
              getPerDisabled: false,
            })
          } else if (that.data.timeStatus) {
            clearInterval(interval)
            that.setData({
              time: '获取验证码',
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
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var code = that.data.sourceRandomNum, time = that.data.sendTimestamp, mobile = that.data.targetMobile;
    if (!Utils.isNull(time) && !Utils.isNull(code) && !Utils.isNull(code)) {
      time = time + 600;
    }
    var contact = "" + that.data.contact;
    if (Utils.isNull(that.data.contact)) {
      wx.showToast({
        title: "请输入姓名！",
        icon: 'none',
      })
      return;
    } else if (contact.match(/^\s+$/)) {
      wx.showToast({
        title: "姓名不能为空！",
        icon: 'none',
      })
      return;
    } else if (Utils.isNull(that.data.contact)) {
      wx.showToast({
        title: "请输入姓名！",
        icon: 'none',
      })
      return;
    } else if (Utils.isNull(that.data.mobile)) {
      wx.showToast({
        title: "请输入手机号码！",
        icon: 'none',
      })
      return;
    } else if (Utils.isNull(that.data.personPIN)) {
      wx.showToast({
        title: "请输入验证码！",
        icon: 'none',
      })
      return;
    } else if (mobile != that.data.mobile) {
      wx.showToast({
        title: "请获取验证码！",
        icon: 'none',
      })
      return;
    } else if (Utils.isNull(time)) {
      wx.showToast({
        title: "请获取验证码！",
        icon: 'none',
      })
      return;
    } else if (time < timestamp) {
      wx.showToast({
        title: "验证码已过期，请重新获取！",
        icon: 'none',
      })
      return;
    } else if (that.data.personPIN != code) {
      wx.showToast({
        title: "验证码错误，请重新输入！",
        icon: 'none',
      })
      return;
    } else if (that.data.showCheckbox == false) {
      wx.showToast({
        title: "请您仔细阅读" + that.data.sysName + "使用协议并同意后才能注册！",
        icon: 'none',
      })
      return;
    }
    that.savePersonInfo();
  },
  //注册
  savePersonInfo: function () {
    var that = this, srcGotoPack = that.data.srcGotoPack, srcGotoPage = that.data.srcGotoPage, srcGotoParams = that.data.srcGotoParams, srcGotoPageType = that.data.srcGotoPageType;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var namePY = Utils.myTrim(that.data.contact) == "" ? "" : PYTool.getPinYin(that.data.contact, "", true);
    var appUserInfo = app.globalData.userInfo;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&contact=" + encodeURIComponent(that.data.contact) + "&contactPinyin=" + encodeURIComponent(namePY) + "&headerImg=" + encodeURIComponent(that.data.headerImg) + "&mobile=" + that.data.mobile +  "&updateTime=1&sign=" + sign;
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
          // //重新获取用户特性
          // app.checkUserFeatures(app.globalData.userTotalInfo);
          // let url = '../../pages/personal/personal', otherParam = Utils.myTrim(srcGotoPage) != "" ? "?stpack=" + encodeURIComponent(srcGotoPack) + "&stpage=" + encodeURIComponent(srcGotoPage) + "&stptype=" + srcGotoPageType + "&stparams=" + encodeURIComponent(srcGotoParams):"";
          // // if (!Utils.isNull(res.data.dataregInfo))
          // wx.showModal({
          //   title: '注册成功',
          //   content: "完善资料可领取红包",
          //   confirmText:'完善资料',
          //   success(res) {
          //     if (res.confirm) {
          //       wx.redirectTo({
          //         url: url + otherParam,
          //       });
          //     } else if (res.cancel) {
          //       wx.navigateBack({
          //         delta: 1,
          //       })
          //     }
          //   }
          // })
          
          wx.removeStorageSync('Vcode')
          wx.removeStorageSync('VcodeTime')
          wx.removeStorageSync('Vmobile')
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          })
          // setTimeout(function () {
          //   console.log("1111111111111111")
          //   wx.reLaunch({
          //     url: mainFootDir + app.data.sysMainPage
          //   })
          // }, 1500) 
        
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
          that.setData({
            disabled: false
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
        that.setData({
          disabled: false
        })
      }
    })
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "contact":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          that.setData({
            contact: that.data.contact
          })
          return;
        }
        that.setData({
          contact: value
        })
        break;
      case "mobile":
        that.setData({
          mobile: value
        })
        break;
      case "personPIN":
        that.setData({
          personPIN: value
        })
        break;
    }
  },
  hideModalserve: function () {
    this.setData({
      showModalserve: false,
    })
  },
  showModalVIP: function () {
    this.setData({
      showModalserve: true,
    })
  },
  showCheckbox: function () {
    this.setData({
      showCheckbox: !this.data.showCheckbox
    })
  },
  nextBlur: function (e) {
    var num = Number(e.target.id) + 1;
    this.setData({
      blurId: num
    })
  },

  ////////////////////////////////////////////////////////////////////////
  //----------微信授权处理-------------------------------------------------
  getSetting: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        if (res.authSetting["scope.userInfo"]) {
          console.log("已经授权！！！")
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var nickName = "",
                avatarUrl = "";
              console.log(res);
              if (res.userInfo != null && res.userInfo != undefined) {
                nickName = Utils.filterEmoj(res.userInfo.nickName);
                avatarUrl = res.userInfo.avatarUrl;
                that.setData({
                  headerImg: avatarUrl,
                  contact: nickName,
                })
              }
            },
            fail: function () {
              console.log('获取用户信息失败')
              wx.showToast({
                title: "获取用户信息失败！",
                icon: 'none',
                duration: 2500
              })
            }
          })

        } else {
          console.log("尚未授权！！！");
          that.setData({
            isShowAuthor: true,
          })
          console.log("isShowAuthor", that.data.isShowAuthor)

        }
      }
    })
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
})
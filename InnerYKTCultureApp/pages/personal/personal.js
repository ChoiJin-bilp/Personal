// pages/personal/personal.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var PYTool = require('../../utils/pinyin.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var defaultHeadImg = "noimg.png",
  packOtherPageUrl = "../../packageOther/pages",
  mainFootDir = "../../";
Page({

  data: {
    sysName: app.data.sysName, //系统名称
    sysLogoUrl: app.data.sysLogoUrl, //系统Logo
    isForbidRefresh: false, //是否禁止刷新
    isOpenCompetitionActivity: app.data.isOpenCompetitionActivity, //是否开放赛事组队
    isShowAuthor: false, //授权提示
    showguidance: false,
    version2: app.data.version2,
    showpassword: false,
    showCompetition: false,
    showphone: false,
    industrySort: [], //所在行业选项
    saleMoney: [],
    focusIndustry: [],
    index: 0,
    isShowSelselection: false,
    showcancel: false,
    cancelPersAccStat: false, //是否注销企业版的个人版资料
    isLoad: false, //是否已经加载
    DataURL: DataURL, //远程资源路径
    userInfo: {},
    inviteCode: "", //邀请码
    //微信号
    wxnumber: "",
    //邮箱
    email: "",
    newPassword: "",
    newPassword2: "",
    newMobile: "",

    userStatus: false, //注册状态
    completed: false, //修改或注销完成
    paydis: false, //支付按钮 禁用状态
    price: "", //注册时支付验证（仅供测试人员）
    MainF: 0,
    disabled: false,
    name_max: 20,
    pin_max: 4,
    account_max: 16,
    password_max: 16,
    mobile_max: 11,
    occupation_max: 40,
    hobby_max: 100,
    remark_max: 800,

    items: [{
        name: '男',
        value: '男'
      },
      {
        name: '女',
        value: '女'
      },
    ],
    myitems: [{
        role: '供应方',
        value: '供应方'
      },
      {
        role: '采购方',
        value: '采购方'
      },
      {
        role: '供应+采购',
        value: '供应+采购'
      },
      {
        role: '其它',
        value: '其它'
      },
    ],
    type: [{
        id: 1,
        value: '个人版',
        checked: true
      },
      {
        id: 2,
        value: '企业版',
        checked: false
      },
    ],
    educationItems: [{
        name: "高中",
        value: "高中"
      },
      {
        name: "大专",
        value: "大专"
      },
      {
        name: "本科",
        value: "本科"
      },
      {
        name: "硕士",
        value: "硕士"
      },
      {
        name: "博士",
        value: "博士"
      },
      {
        name: "其他",
        value: "其他"
      },
    ],
    selectEducationed: false,
    selectRemarks: false,
    showRemarkTeLabel: false,
    showModalserve: false,
    showCheckbox: false,

    showOtherItems: false,

    //服务管理
    showSrvRightOpen: false, //是否开放服务管理

    //新人领劵弹窗
    isShowReceiveCoupon: false,
    couponData: null,

    actionTitle: "", //赛事标题

    //小队
    isShowAlertNewTeam: false, //是否显示创建小队提示弹窗
    isShowCreateNewTeam: false, //是否显示创建小队弹窗

    teamRoleList: ['队长', '副队长', '成员'], //小队角色
    teamName: "", //小队名称
    teamRole: "", //小队角色
    teamName_max: 20,

    getPerDisabled: false, //获取验证码按钮是否可用
    timeStatus: false, //是否重置获取验证码按钮
    time: '获取验证码', //倒计时 
    currentTime: 60, //倒计时最大数值

    sendTimestamp: null, //发送时间戳
    sourceRandomNum: "", //源验证码
    targetMobile: "", //目的手机号

    CancelPIN: "",
    PhonelPIN: "",
    accountRecordId:0,

    srcOptions:null,       //保存加载信息
    user_roleId:0,
  },
  //事件：学历下拉框显示事件
  bindShowSelEducation() {
    this.setData({
      selectEducationed: !this.data.selectEducationed
    })
  },
  //事件：学历下拉框选择事件
  onSelectEducation(e) {
    var value = e.currentTarget.dataset.id
    var str = "userInfo.education"
    this.setData({
      [str]: value,
      selectEducationed: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    that.data.srcOptions=options;
    if(Utils.isNotNull(app.globalData.userInfo) && (Utils.isNull(app.globalData.userInfo.userMobile) || app.globalData.userInfo.userMobile.indexOf("u_")>=0)){
      wx.showModal({
        title: '提示',
        content: '该功能需要注册用户，您是否继续？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.data.curPageDataOptions={
              package:"",page:"/pages/personal/personal",options: that.data.srcOptions,
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
    var disabled = true,
      showSrvRightOpen = false;
    //根据服务管理开放版本判断是否显示或隐藏该模块
    switch (app.data.isSrvRightOpenVersion) {
      case 0:
        if (app.data.version == 'intest') showSrvRightOpen = true;
        break;

      case 1:
        showSrvRightOpen = true;
        break;
    }

    that.setData({
      //disabled: disabled,
      headerURLImg: DataURL + '/images/head.png',
      topURLImg: DataURL + '/images/top.png',

      showSrvRightOpen: showSrvRightOpen,
      sysLogoUrl: app.data.sysLogoUrl, //系统Logo

      user_roleId: app.data.user_roleId, //账户角色
      accountRecordId: app.data.accountRecordId, //账户记录ID
      accountUserName: app.data.accountUserName, //账户名称
      accountUserPWD: app.data.accountUserPWD, //账户密码
      accountBindUserId: app.data.accountBindUserId, //账户绑定用户ID

      user_roleId: app.data.user_roleId,
    });
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var dateTime = Y + '-' + M + '-' + D;
    that.setData({
      dateTime: dateTime
    })
    //获取个人资料
    that.getPersonInfo();
  },
  dowithAppRegLogin: function (tag) {
    var that = this;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../";
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
        if (!that.data.isForbidRefresh) {
          if (that.data.disabled) {
            //获取个人资料
            that.getPersonInfo();
          }
          console.log("onShow")
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  ///////////////////////////////////////////////////////////
  //------个人信息操作----------------------------------------
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function () {
    var that = this;
    if (that.data.disabled) return;

    app.uploadImg(that, 0, 0, 1);
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this,
      setKey = "";
    switch (sType) {
      case 0:
        setKey = "userInfo.headerImg";
        break;
    }
    that.setData({
      [setKey]: imgUrl
    })
  },

  getInput(e) {
    var value = e.detail.value;
    var that = this
    that.setData({
      newBindId: value
    })
  },

  //获取修改密码输入数据
  changeValueMainPassword: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    if (id == 1) {
      that.setData({
        newPassword: value
      })
    } else {
      that.setData({
        newPassword2: value
      })
    }
  },
  /**
   * 获取微信号输入
   */
  changeValueWXnumber: function (e) {
    var value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    this.setData({
      wxnumber: value
    })
  },
  /**
   * 获取邮箱输入
   */
  changeValueEmail: function (e) {
    var value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    this.setData({
      email: value
    })
  },
  //获取邀请码输入
  changeValueCode: function (e) {
    var value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    this.setData({
      inviteCode: value
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
      //payment 支付用于体验版
      case "payment":
        that.setData({
          price: value
        })
        break;
      case "contact":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          var str = "userInfo.contact";
          that.setData({
            [str]: that.data.userInfo.contact
          })
          return;
        }
        if (len > this.data.name_max) return;
        var str = "userInfo.contact";
        that.setData({
          [str]: value
        })
        break;
      case "password":
        var str = "userInfo.password";
        that.setData({
          [str]: value
        })
        break;
      case "password2":
        var str = "userInfo.password2";
        that.setData({
          [str]: value
        })
        break;
      case "accountType":
        var str = "userInfo.companyType";
        that.setData({
          [str]: value
        })
        break;
      case "mobile":
        //最多字数限制
        if (len > this.data.mobile_max) return;
        var str = "userInfo.mobile";
        that.setData({
          [str]: value
        })
        break;
      case "newMobile":
        //最多字数限制
        if (len > this.data.mobile_max) return;
        that.setData({
          newMobile: value
        })
        break;
      case "PhonelPIN":
        that.setData({
          PhonelPIN: value
        })
        break;
      case "CancelPIN":
        that.setData({
          CancelPIN: value
        })
        break;
      case "sex":
        var str = "userInfo.sex";
        that.setData({
          [str]: value
        })
        break;
      case "birthday":
        var str = "userInfo.birthday";
        that.setData({
          [str]: value.replace(/\-/g, "/")
        })
        break;
      case "job":
        if (Utils.checkStr(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
            duration: 2000
          })
          return;
        }

        if (len > this.data.occupation_max) return;
        var str = "userInfo.job";
        that.setData({
          [str]: value
        })
        break;
      case "hobby":
        if (Utils.checkStr(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
            duration: 2000
          })
          return;
        }

        if (len > this.data.hobby_max) return;
        var str = "userInfo.hobby";
        that.setData({
          [str]: value
        })
        break;
      case "remark":
        var str = "userInfo.remark";
        that.setData({
          [str]: value
        })
        break;
      case "role":
        var str = "userInfo.personalClass";
        that.setData({
          [str]: value
        })
        break;

        //创建小队——队名
      case "teamname":
        if (len > this.data.teamName_max) return;
        that.setData({
          teamName: value
        })
        break;
    }
  },
  //事件：编辑个人信息事件
  editDataInfo: function () {
    var that = this;
    that.setData({
      disabled: false,
      showRemarkTeLabel: false,
    })
  },
  //修改手机
  submitphone: function () {
    var that = this;
    if (Utils.isNull(that.data.PhonelPIN)) {
      wx.showToast({
        title: "请输入验证码！",
        icon: 'none',
      })
      return;
    } else if (that.data.sourceRandomNum != that.data.PhonelPIN) {
      wx.showToast({
        title: "验证码错误，请重新输入！",
        icon: 'none',
      })
      return;
    }
    that.requestCancelInfo(2);
  },
  //注销账号
  submitcancel: function () {
    var that = this;
    if (Utils.myTrim(that.data.CancelPIN) == "") {
      wx.showToast({
        title: "请输入验证码！",
        icon: 'none',
      })
      return;
    } else if (that.data.sourceRandomNum != that.data.CancelPIN) {
      wx.showToast({
        title: "验证码错误，请重新输入！",
        icon: 'none',
      })
      return;
    }
    that.requestCancelInfo(1);
  },
  submitCode: function (e) {
    var that = this;
    if (Utils.isNull(that.data.email) && Utils.isNull(that.data.wxnumber) &&
      Utils.isNull(that.data.userInfo.birthday) && Utils.isNull(that.data.userInfo.sex)) {
      wx.showToast({
        title: "请填写完整！",
        icon: 'none',
      })
      return;
    }
    if (!Utils.isEMail(that.data.email)) {
      wx.showToast({
        title: "邮箱格式不正确！",
        icon: 'none',
      })
      return;
    }
    if (Utils.isNull(that.data.inviteCode)) {
      wx.showToast({
        title: "请输入邀请码！",
        icon: 'none',
      })
      return;
    } else {
      that.savePersonInviteCode();
    }
  },
  //方法：保存邀请码（验证）
  savePersonInviteCode: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&userMold=" + that.data.inviteCode + "&sex=" + that.data.userInfo.sex + "&birthday=" +
      that.data.userInfo.birthday + "&wxnumber=" + that.data.wxnumber + "&email=" + that.data.email + "&sign=" + sign;
    console.log("保存邀请码（验证）:", URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var isShowAlertNewTeam = true,
            userMold = 0;
          try {
            userMold = res.data.data.userMap.userMold;
            userMold = isNaN(userMold) ? 0 : userMold;
          } catch (err) {}
          wx.showToast({
            title: '申请成功！',
            icon: 'success',
            duration: 1500
          })
          app.globalData.userInfo.userMold = userMold;
          that.setData({
            showCompetition: false,
            userInfo: res.data.data.userMap,

            isShowAlertNewTeam: isShowAlertNewTeam,
          })
          //优惠券弹窗提示
          that.queryCanCoupons();
        } else if (res.data.rspCode == -3) {
          wx.showToast({
            title: '邀请码错误！',
            icon: 'none',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "保存邀请码（验证）：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "我的资料保存接口调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
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
  //事件：保存提交
  submitDataInfo: function (e) {
    var that = this;
    var contact = "" + that.data.userInfo.contact;
    if (Utils.isNull(that.data.userInfo.contact)) {
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
    } else if (Utils.myTrim(that.data.userInfo.password) == "" && !that.data.userStatus) {
      wx.showToast({
        title: "请输入密码！",
        icon: 'none',
      })
      return;
    } else if (Utils.myTrim(that.data.userInfo.password2) == "" && !that.data.userStatus) {
      wx.showToast({
        title: "请再次输入密码！",
        icon: 'none',
      })
      return;
    } else if (that.data.userInfo.password.length < 6) {
      wx.showToast({
        title: "密码最少6位！",
        icon: 'none',
      })
      return;
    } else if (Utils.myTrim(that.data.userInfo.mobile) == "" && !that.data.userStatus) {
      wx.showToast({
        title: "请输入手机号码！",
        icon: 'none',
      })
      return;
    } else if (that.data.userInfo.password != that.data.userInfo.password2 && !that.data.userStatus) {
      wx.showToast({
        title: "2次密码输入不一致，请重新输入！",
        icon: 'none',
      })
      return;
    }
    that.savePersonInfo();
  },
  //修改新密码
  submitPassword: function () {
    var that = this;
    // 修改密码类型 0=平台 1=云客智能
    var changePwdType = this.data.changePwdType;
    if (Utils.myTrim(that.data.newPassword) == "" || Utils.myTrim(that.data.newPassword2) == "") {
      wx.showToast({
        title: "请输入密码！",
        icon: 'none',
      })
      return;
    } else {
      if (that.data.newPassword != that.data.newPassword2) {
        wx.showToast({
          title: "2次密码输入不一致，请重新输入！",
          icon: 'none',
        })
        return;
      } else {
        if (0 == changePwdType) {
          var datajson = {
            id: that.data.accountRecordId,
            password: that.data.newPassword,
          }
          that.saveCompanyAndUser(datajson, 0)
        } else {
          that.requestUpdateInfo(1);
        }
      }
    }
  },

  /**
   * 绑定
   */
  bindAccount() {
    this.setData({
      showBind: true,
    })
  },
  hideBind() {
    this.setData({
      showBind: false,
    })
  },

  submitBind() {
    var that = this
    var newBindId = that.data.newBindId
    if (Utils.isNull(newBindId)) {
      wx.showToast({
        title: "用户ID不能为空",
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (0 == newBindId) {
      wx.showToast({
        title: "用户ID不能为0",
        icon: 'none',
        duration: 1500
      })
      return
    }
    var datajson = {
      id: that.data.accountRecordId,
      userId: newBindId,
    }
    that.saveCompanyAndUser(datajson, 2)
  },

  /**
   * 解绑
   */
  unbindAccount() {
    var that = this
    var accountBindUserId = that.data.accountBindUserId
    if (Utils.isNull(accountBindUserId) || accountBindUserId == 0) {
      wx.showToast({
        title: "已经是解绑状态",
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showModal({
      title: '',
      content: "您确定要解绑吗？",
      icon: 'none',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          console.log("cancel del")
          return;
        } else {
          //点击确定
          console.log("sure del")
          var datajson = {
            id: that.data.accountRecordId,
            userId: 0,
          }
          that.saveCompanyAndUser(datajson, 1)
        }
      },
    })
  },

  /**
   * 修改用户账号
   */
  saveCompanyAndUser(datajson, tag) {
    var signParam = 'cls=main_companyAndUser&action=saveCompanyAndUser&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId
    app.doPostData(this, app.getUrlAndKey.url, signParam, "datajson", datajson, "", tag, "修改用户账号")
  },
  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (tag) {
          case 0:
            msg = "修改成功"
            that.setData({
              showpassword: false,
              accountUserPWD: that.data.newPassword,
            })
            app.data.accountUserPWD = that.data.newPassword
            break
          case 1:
            msg = "解绑成功"
            that.setData({
              accountBindUserId: "",
            })
            app.data.accountBindUserId = ""
            break
          case 2:
            msg = "绑定成功"
            that.setData({
              accountBindUserId: that.data.newBindId,
              showBind: false,
            })
            app.data.accountBindUserId = that.data.newBindId
            break
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1500
        })
        break;
      default:
        console.log(error)
        break
    }
  },

  //修改资料
  requestUpdateInfo: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var param = "";
    if (e == 1) {
      param = "&password=" + that.data.newPassword;
    } else if (e == 2) {

    }
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod" + param + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          that.setData({
            timeStatus: false
          })
          if (e == 1) {
            wx.showToast({
              title: '修改密码成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              showpassword: false
            })
          }

        } else {
          var tit = "";
          if (e == 1) {
            app.setErrorMsg2(that, "修改密码失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
            tit = "修改失败!";
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
            })
          }

        }
      },
      fail: function (err) {
        var tit = "";
        app.setErrorMsg2(that, "修改密码失败：fail！错误信息：" + err, URL + urlParam, false);
        if (e == 1) {
          tit = "修改失败!";
          wx.showToast({
            title: tit,
            icon: 'none',
          })
        }

      }
    })
  },
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
                nickName = res.userInfo.nickName;
                avatarUrl = res.userInfo.avatarUrl;
                var str = "userInfo.headerImg";
                that.setData({
                  [str]: avatarUrl
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
  hideMyTest: function () {
    this.setData({
      isQRShare: false,
    })
  },
  //方法：获取个人信息
  getPersonInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=userDetail&id=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("个人资料：", res.data)
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          app.globalData.userTotalInfo = data;
          var userStatus = false,
            disabled = false,
            actionTitle = "";
          if (data.actionName != null && data.actionName != undefined && Utils.myTrim(data.actionName + "") != 'null' && Utils.myTrim(data.actionName + "") != '') {
            actionTitle = data.actionName;
          }
          if (data.password != null && data.password != '' && data.password != undefined && data.password != 'null') {
            userStatus = true;
            disabled = true;
          }
          data.password2 = "";
          var time = Utils.formatTime(new Date());
          if (data.companyType == 2 && !Utils.isNull(data.serviceEndTime) && data.companyStatus == 1 && data.serviceEndTime >= time) { //判断是否企业版
            data.companyStatus = 7; //过期
          }
          var productInfo = data.productInfo;
          if (!Utils.isNull(productInfo)) {
            if (productInfo.substr(productInfo.length - 1, 1) == "|") {
              productInfo = productInfo.substring(0, productInfo.length - 1);
            }
            data.productInfo = productInfo.split('|');
          } else {
            data.productInfo = [];
          }
          var personalTrade = data.personalTrade;
          if (!Utils.isNull(personalTrade)) {
            if (personalTrade.substr(personalTrade.length - 1, 1) == "|") {
              personalTrade = personalTrade.substring(0, personalTrade.length - 1);
            }
            data.personalTrade = personalTrade.split('|');
          }
          if (Utils.isNull(data.headerImg)) {
            that.getSetting();
          }
          that.setData({
            userInfo: data,
            userStatus: userStatus,
            actionTitle: actionTitle,
            //disabled: disabled
          })
          that.getIndustryType();
        } else {
          app.setErrorMsg2(that, "我的资料获取：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "获取信息失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "我的资料获取：失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "网络异常！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：获取注册行业角色类型
  getIndustryType: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=userBaseData&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log(urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取注册行业角色类型：", res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          var tradeClass = data.tradeClass;
          var roleClass = data.roleClass;

          var industrySort = tradeClass.split("|"); //所在行业。
          var myitems = roleClass.split("|"); //我的角色
          var productInfo = tradeClass.split("|"); //关注行业
          var saleMoney = data.saleMoney.split("|"); //销售金额

          var myproductInfo = that.data.userInfo.productInfo; //我已关注的行业
          var industry = [];
          for (let i = 0; i < productInfo.length; i++) { //行业所有类型
            if (!Utils.isNull(myproductInfo)) {
              for (let y = 0; y < myproductInfo.length; y++) { //已经关注类型
                if (productInfo[i] == myproductInfo[y]) {
                  var array = {
                    'name': productInfo[i],
                    'checked': true
                  }
                  break;
                }
                if (y == myproductInfo.length - 1) {
                  var array = {
                    'name': productInfo[i],
                    'checked': false
                  }
                }
              }
            } else {
              var array = {
                'name': productInfo[i],
                'checked': false
              }
            }
            industry = industry.concat(array)
          }

          var myindustrySort = that.data.userInfo.personalTrade; //我已所在行业
          var industry2 = [];
          for (let i = 0; i < industrySort.length; i++) { //行业所有类型
            if (!Utils.isNull(myindustrySort)) {
              for (let y = 0; y < myindustrySort.length; y++) { //已经关注类型
                if (industrySort[i] == myindustrySort[y]) {
                  var array = {
                    'name': industrySort[i],
                    'checked': true
                  }
                  break;
                }
                if (y == myindustrySort.length - 1) {
                  var array = {
                    'name': industrySort[i],
                    'checked': false
                  }
                }
              }
            } else {
              var array = {
                'name': industrySort[i],
                'checked': false
              }
            }
            industry2 = industry2.concat(array)
          }
          that.setData({
            focusIndustry: industry,
            myitems: myitems,
            industrySort: industry2,
            saleMoney: saleMoney,
          })
        } else {
          app.setErrorMsg2(that, "获取注册行业角色类型：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "获取信息失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取注册行业角色类型：失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "网络异常！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //方法：保存个人信息
  savePersonInfo: function (type) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var namePY = Utils.myTrim(that.data.userInfo.contact) == "" ? "" : PYTool.getPinYin(that.data.userInfo.contact, "", true);
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&contact=" + encodeURIComponent(that.data.userInfo.contact) + "&password=" + encodeURIComponent(that.data.userInfo.password) + "&contactPinyin=" + encodeURIComponent(namePY) + "&mobile=" + that.data.userInfo.mobile + "&sign=" + sign;
    var userInfo = that.data.userInfo;
    console.log("我的资料数据：", userInfo)
    urlParam += "&headerImg=" + encodeURIComponent(userInfo.headerImg);
    urlParam += "&sex=" + encodeURIComponent(userInfo.sex);
    urlParam += "&education=" + encodeURIComponent(userInfo.education);
    urlParam += "&birthday=" + encodeURIComponent(userInfo.birthday);
    urlParam += "&job=" + encodeURIComponent(userInfo.job);
    urlParam += "&hobby=" + encodeURIComponent(userInfo.hobby);
    urlParam += "&remark=" + encodeURIComponent(userInfo.remark);
    var personalTrade = "";
    for (let i = 0; i < userInfo.personalTrade.length; i++) {
      personalTrade += userInfo.personalTrade[i] + "|";
    }
    urlParam += "&personalTrade=" + encodeURIComponent(personalTrade);
    urlParam += "&personalClass=" + encodeURIComponent(userInfo.personalClass);
    urlParam += "&saleMoney=" + encodeURIComponent(userInfo.saleMoney);
    let productInfo = "";
    for (let i = 0; i < userInfo.productInfo.length; i++) {
      productInfo += userInfo.productInfo[i] + "|";
    }
    urlParam += "&productInfo=" + encodeURIComponent(productInfo);
    console.log("保存资料URL:", URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log('保存个人资料信息')
        console.log(res)
        // that.setData({
        //   disabled: true,
        //   showRemarkTeLabel: true
        // })
        if (res.data.rspCode == 0) {

          var mainData = res.data.data.userMap;
          // wx.setStorageSync('userinfo' + app.data.currentVersion, mainData);
          // app.globalData.userInfo = mainData;
          app.globalData.userInfo.userName = mainData.contact;
          app.globalData.userInfo.userMobile = mainData.mobile;
          app.globalData.userInfo.avatarUrl = mainData.headerImg;
          console.log("我的资料保存成功————————————")
          wx.showToast({
            title: "保存成功",
            mask: true,
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "我的资料保存：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
        app.setErrorMsg2(that, "我的资料保存接口调用失败！fail：" + JSON.stringify(err), URL + urlParam, false);
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
  //获取验证码
  getPersonPIN: function (e) {
    var that = this,
      sysName = that.data.sysName;

    var id = 0,
      sourceRandomNum = "",
      content = "",
      mobile = that.data.userInfo.mobile;
    id = e.currentTarget.dataset.id;
    for (var i = 0; i < 4; i++) {
      var num = parseInt(10 * Math.random());
      sourceRandomNum = sourceRandomNum + num;
    }
    sysName = app.data.sysAppType == 1 ? "微官网" : sysName;
    if (id == 1) { //注册
      if (Utils.myTrim(that.data.userInfo.mobile) == "") {
        wx.showToast({
          title: "请输入手机号码！",
          icon: 'none',
        })
        return;
      } else if (!Utils.mobileVer(that.data.userInfo.mobile)) {
        wx.showToast({
          title: "请输入正确手机号码！",
          icon: 'none',
        })
        return;
      }
      content = "【" + sysName + "】验证码：" + sourceRandomNum + " 。您正在进行注册验证，有效时间为10分钟。";
    } else if (id == 2) { //注销账户
      if (Utils.myTrim(that.data.userInfo.mobile) == "") {
        wx.showToast({
          title: "请输入手机号码！",
          icon: 'none',
        })
        return;
      } else if (!Utils.mobileVer(that.data.userInfo.mobile)) {
        wx.showToast({
          title: "请输入正确手机号码！",
          icon: 'none',
        })
        return;
      }
      content = "【" + sysName + "】验证码：" + sourceRandomNum + " 。您正在进行注销账号验证，有效时间为10分钟。";
    } else if (id == 3) { //修改手机
      content = "【" + sysName + "】验证码：" + sourceRandomNum + " 。您正在进行修改手机验证，有效时间为10分钟。";
      if (Utils.myTrim(that.data.newMobile) == "") {
        wx.showToast({
          title: "请输入手机号码！",
          icon: 'none',
        })
        return;
      } else if (!Utils.mobileVer(that.data.newMobile)) {
        wx.showToast({
          title: "请输入正确手机号码！",
          icon: 'none',
        })
        return;
      } else if (that.data.newMobile == that.data.userInfo.mobile) {
        wx.showToast({
          title: "请输入另外一个手机号码！",
          icon: 'none',
        })
        return;
      }
      mobile = that.data.newMobile;
    }
    that.setData({
      getPerDisabled: true
    })

    that.data.sourceRandomNum = sourceRandomNum;
    that.data.targetMobile = mobile;
    that.setData({
      getPerDisabled: true
    })
    app.sendSMSMessage(that, mobile, content);
  },
  //方法：短信返回处理方法
  dowithSMSMessage: function (tag, timestamp) {
    var that = this,
      currentTime = that.data.currentTime;
    //1成功，0失败
    switch (tag) {
      case 1:
        that.data.sendTimestamp = timestamp;
        var currentTime = that.data.currentTime
        that.setData({
          time: currentTime + 'S',
        })
        var interval = setInterval(function () {
          console.log('是否完成：', that.data.completed)
          if (that.data.completed) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            clearInterval(interval)
            that.setData({
              time: '获取验证码',
              currentTime: 60,
              disabled: false,
              getPerDisabled: false,
              completed: false,
            })
            return;
          }
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
              disabled: false,
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
  //注销账号||修改手机
  requestCancelInfo: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    var param = "";
    var title = "";
    if (e == 1) {
      param = "&wxopenId=";
      title = "注销";
      if (that.data.userInfo.companyType == 2) {
        if (that.data.cancelPersAccStat) {
          urlParam += "&companyType=1"
        } else {
          param = "";
          urlParam += "&companyType=1&companyStatus=0"
        }
      }
    } else if (e == 2) {
      param = "&mobile=" + that.data.newMobile;
      title = "修改";
    }

    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod" + param + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log(title + '~~~~~~~~~~~~~~~~~账号')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          that.setData({
            timeStatus: false,
            showcancel: false,
            completed: true,
          })
          if (e == 1) {
            wx.clearStorageSync()
            console.log("清理本地数据缓存")
            app.globalData.userInfo = null;
            console.log("删除app数据")
          }

          wx.showToast({
            title: title + "成功！",
            mask: true,
            duration: 2000,
            success: function (res) {
              if (e == 1) {
                if (res.cancel) {} else {
                  // wx.navigateBack({
                  //   delta: 1
                  // })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: mainFootDir + app.data.sysMainPage
                    })
                  }, 2000)

                }
              } else {
                var str = 'userInfo.mobile';
                that.setData({
                  [str]: that.data.newMobile,
                  showphone: false,
                  PhonelPIN: '',
                  sourceRandomNum: ''
                })
                that.setData({
                  newMobile: ''
                })
              }
            }
          })
        } else {
          app.setErrorMsg2(that, title + "失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            mask: true,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, title + "失败：fail！错误信息：" + err, URL + urlParam, false);

        wx.showToast({
          title: title + "失败！",
          mask: true,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //升级企业版
  requestUpgrade: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&opertion=mod&companyType=2&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          wx.removeStorageSync('userinfo' + app.data.currentVersion);
          that.setData({
            userInfo: res.data.data.userMap,
          })
          wx.showToast({
            title: "升级成功",
            mask: true,
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "升级企业版调用失败111！fail：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "升级企业版失败！fail：" + JSON.stringify(err), URL + urlParam, false);
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
  //注册支付
  payment: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (that.data.price == '' || that.data.price <= 0) {
      wx.showToast({
        title: "请输入金额！",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    that.setData({
      paydis: true
    })
    wx.showLoading({
      title: '正在加载中...',
    })
    var urlParam = "cls=main_payment&action=BJYXCXpayment&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&body=zc&detail=zc&money=" + (that.data.price * 100).toFixed(0) + "&userId=" + that.data.userInfo.id + "&openid=" + appUserInfo.wxopenId + "&sign=" + sign
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          console.log("预支付获取成功", res.data)
          that.setData({
            paymentData: res.data.data
          })
          that.requestPayment();
        } else {
          wx.hideLoading()
          app.setErrorMsg2(that, "支付失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "支付失败！",
            icon: 'none',
            duration: 1500
          })
          that.setData({
            paydis: false
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        that.setData({
          paydis: false
        })
        app.setErrorMsg2(that, "支付失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: "支付失败！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //zhifu
  requestPayment: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var singParm = "appId=" + that.data.paymentData.appid + "&nonceStr=" + that.data.paymentData.nonce_str + "&package=prepay_id=" + that.data.paymentData.prepay_id + "&signType=MD5&timeStamp=" + timestamp + "&key=Tts46151626232315654615844443526";
    var sign = MD5JS.hexMD5(singParm);
    wx.hideLoading()
    wx.requestPayment({
      'timeStamp': "" + timestamp,
      'nonceStr': that.data.paymentData.nonce_str,
      'package': 'prepay_id=' + that.data.paymentData.prepay_id,
      'signType': 'MD5',
      'paySign': sign,
      success: function (res) {
        wx.hideLoading()
        console.log("支付成功", res)
        that.setData({
          paydis: false,
        })
      },
      fail: function (res) {
        wx.hideLoading()
        that.setData({
          paydis: false
        })
        console.log("支付发起失败", res);
      }
    })
  },
  applyEnterprise: function (e) {
    if (Utils.isNull(app.globalData.userTotalInfo.mobile)) {
      wx.showToast({
        title: "请先注册！",
        icon: 'none',
      })
      return;
    } else {
      wx.navigateTo({
        url: "../enterprise/enterprise?status=1"
      });
    }
  },
  //方法：返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  hidepassword: function () {
    this.setData({
      showpassword: false
    })
  },
  showpassword: function (e) {
    var changePwdType = e.currentTarget.dataset.tag
    this.setData({
      showpassword: true,
      changePwdType: changePwdType,
    })
  },
  hidephone: function () {
    this.setData({
      showphone: false
    })
  },
  showphone: function () {
    this.setData({
      showphone: true
    })
  },
  hidecancel: function () {
    this.setData({
      showcancel: false
    })
  },
  showcancel: function () {
    this.setData({
      showcancel: true
    })
  },

  showModalVIP: function () {
    this.setData({
      showModalserve: true,
      selectRemarks: true
    })
  },
  hideModalserve: function () {
    this.setData({
      showModalserve: false,
      selectRemarks: false
    })
  },
  showCheckbox: function () {
    this.setData({
      showCheckbox: !this.data.showCheckbox
    })
    console.log(this.data.showCheckbox)
  },
  //失去焦点 切换为文本框
  showRemarkText: function () {
    // this.setData({
    //   showRemarkTeLabel: true
    // })
  },
  //焦点触发 切换为textarea框
  hideRemarkText: function () {
    this.setData({
      showRemarkTeLabel: false
    })
  },
  radioChanges(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  renewPay: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.val;
    wx.navigateTo({
      url: "../enterprise/enterprise?status=" + status
    });
  },
  updateAudit: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.val;
    wx.navigateTo({
      url: "../audit/audit?status=" + status
    });
  },
  nextBlur: function (e) {
    var num = Number(e.target.id) + 1;
    this.setData({
      blurId: num
    })
    if (num == 7) {
      this.setData({
        showRemarkTeLabel: false
      })
    }
  },
  //事件：切换扩展选项显示/隐藏
  onChangeShowItemDetailState: function (e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    var showView = e.currentTarget.dataset.item;
    showView = showView ? false : true;

    switch (cid) {
      case "qpother":
        that.setData({
          showOtherItems: showView
        })
        break;
    }
  },
  checkPersAccount: function () {
    this.setData({
      cancelPersAccStat: !this.data.cancelPersAccStat
    })
  },
  //防止点验证码输入框时触发 获取验证码按钮
  checkVcode: function () {

  },
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var str = "userInfo.personalTrade";
    this.setData({
      [str]: this.data.industrySort[index],
    })
  },
  bindSalePickerChange: function (e) {
    var index = e.detail.value;
    var str = "userInfo.saleMoney";
    this.setData({
      [str]: this.data.saleMoney[index],
    })
  },

  clicks: function (e) {
    if (this.data.disabled) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.focusIndustry;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    var str = 'userInfo.productInfo';
    this.setData({
      [str]: arrs,
      focusIndustry: arrs,
    })
  },
  clicks2: function (e) {
    if (this.data.disabled) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    var arrs = this.data.industrySort;
    var userInfo = this.data.userInfo;
    if (Utils.isNull(userInfo.personalTrade)) {
      userInfo.personalTrade = [];
    }
    var personalTrade = userInfo.personalTrade.slice(0);
    var num = 0;

    if (arrs[index].checked == false) {
      arrs[index].checked = true;
      personalTrade.push(arrs[index].name);
    } else {
      arrs[index].checked = false;
      for (let i = 0; i < personalTrade.length; i++) {
        if (arrs[index].name == personalTrade[i]) {
          personalTrade.splice(i, 1);
        }
      }
    };
    if (arrs[index].checked) {
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].checked) {
          ++num;
          console.log('num', num);
          console.log('arrs[i].', arrs[i].name);
          if (num > 5) {
            arrs[index].checked = false;
            wx.showToast({
              title: "最多只能选择5个行业！",
              icon: 'none',
              duration: 1500
            })
            return
          }
        }
      }
    }
    userInfo.personalTrade = personalTrade;
    this.setData({
      userInfo: userInfo,
      industrySort: arrs,
    })
  },
  clicksGZ: function (e) {
    if (this.data.disabled) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    var arrs = this.data.focusIndustry;
    var userInfo = this.data.userInfo;
    if (Utils.isNull(userInfo.productInfo)) {
      userInfo.productInfo = [];
    }
    var productInfo = userInfo.productInfo.slice(0);
    var num = 0;

    if (arrs[index].checked == false) {
      arrs[index].checked = true;
      productInfo.push(arrs[index].name);
    } else {
      arrs[index].checked = false;
      for (let i = 0; i < productInfo.length; i++) {
        if (arrs[index].name == productInfo[i]) {
          productInfo.splice(i, 1);
        }
      }
    };
    if (arrs[index].checked) {
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].checked) {
          ++num;
          if (num > 5) {
            arrs[index].checked = false;
            wx.showToast({
              title: "最多只能选择5个行业！",
              icon: 'none',
              duration: 1500
            })
            return
          }
        }
      }
    }
    userInfo.productInfo = productInfo;
    this.setData({
      userInfo: userInfo,
      focusIndustry: arrs,
    })
  },
  showisShowSel: function () {
    if (!this.data.disabled) {
      this.setData({
        isShowSelselection: true
      })
    }

  },
  showisShowGZSel: function () {
    if (!this.data.disabled) {
      this.setData({
        isShowGZSelselection: true
      })
    }
  },
  hideisShowSel: function () {
    this.setData({
      isShowSelselection: false
    })
  },
  hideisShowSelGZ: function () {
    this.setData({
      isShowGZSelselection: false
    })
  },

  showCompetition: function () {
    this.setData({
      showCompetition: true
    })
  },
  hideCompetition: function () {
    this.setData({
      showCompetition: false
    })
  },

  /////////////////////////////////////////////////////////
  //--------服务管理----------------------------------------
  manageSrvRight: function (e) {
    wx.navigateTo({
      url: packOtherPageUrl + "/serve/serve"
    });
  },

  /////////////////////////////////////////////////////////
  //--------优惠券展示--------------------------------------
  //可领取优惠券查询
  queryCanCoupons: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=QueryCanCoupons&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&userId=" + app.globalData.userInfo.userId + "&mold=7&sign=" + sign;
    console.log(SMURL + urlParam)
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("可领取优惠券查询", res.data)
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            var couponData = res.data.data;
            that.setData({
              couponData: couponData
            })
            that.saveCoupons();
          }
        } else {
          app.setErrorMsg2(that, "可领取优惠券查询！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //领取优惠券
  saveCoupons: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_coupons&action=SaveCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('领取优惠券：', SMURL + urlParam)
    var couponDataTem = [];
    var couponData = that.data.couponData;
    for (let i = 0; i < couponData.length; i++) {
      let dataTem = {};
      dataTem.activityId = couponData[i].activityId;
      dataTem.userId = app.globalData.userInfo.userId;
      dataTem.couponid = couponData[i].id;
      dataTem.sn = couponData[i].sn;
      dataTem.shareId = that.data.paramShareUId;
      couponDataTem = couponDataTem.concat(dataTem);
    }
    console.log(JSON.stringify(couponDataTem));
    wx.request({
      url: SMURL + urlParam,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        data: JSON.stringify(couponDataTem)
      },
      success: function (res) {
        console.log("领取优惠券", res.data)
        if (res.data.rspCode == 0) {
          that.setData({
            isShowReceiveCoupon: true
          })
        } else {
          // app.setErrorMsg2(that, "领取优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          // wx.showToast({
          //   title: res.data.rspMsg,
          //   icon: 'none',
          //   duration: 1500
          // })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //事件：隐藏优惠券领取弹窗
  hideReceiveCouponPop: function () {
    this.setData({
      isShowReceiveCoupon: false
    })
  },

  /////////////////////////////////////////////////////////////////////
  //------小队部分------------------------------------------------------
  //方法：获取小队角色信息
  getTeamRoleDataList: function () {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=main_saleTeam&action=saleTeamBaseData&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("赛事小队角色返回结果：");
        console.log(res.data)
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            dataItem = null,
            listItem = null,
            teamRoleList = [],
            teamRoleName = "";
          for (var i = 0; i < data.dataList.length; i++) {
            dataItem = null;
            dataItem = data.dataList[i];
            listItem = null;
            teamRoleName = "";
            if (dataItem.title != null && dataItem.title != undefined && Utils.myTrim(dataItem.title + "") != "null")
              teamRoleName = dataItem.title;
            teamRoleList.push(teamRoleName);
          }
          if (teamRoleList.length > 0) {
            console.log(teamRoleList)
            // 直接将新一页的数据添加到数组里
          } else {
            teamRoleList: ['队长', '副队长', '成员']
          }
          that.setData({
            teamRoleList: teamRoleList,
          })

        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取小队角色列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取小队角色调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取小队角色列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：创建小队
  createNewTeam: function () {
    var that = this,
      teamName = that.data.teamName,
      teamRole = that.data.teamRole;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var otherParam = "&name=" + encodeURIComponent(teamName) + "&role=" + encodeURIComponent(teamRole),
      alertContent = "创建小队";

    var urlParam = "cls=main_saleTeam&action=saveSaleTeam&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + otherParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('创建小队返回信息：')
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var teamId = 0,
            url = "";
          if (res.data.data != null && res.data.data != undefined) {
            if (res.data.data.id != null && res.data.data.id != undefined) {
              try {
                teamId = parseInt(res.data.data.id);
                teamId = isNaN(teamId) ? 0 : teamId;
              } catch (err) {}
            }
          }
          app.globalData.userInfo.teamId = teamId;
          that.setData({
            teamId: teamId,
            isShowCreateNewTeam: false,
          })
          url = packOtherPageUrl + "/myteam/myteam?isnv=1&id=" + teamId;
          console.log("Go to:" + url)
          //跳转小队列表页面
          wx.navigateTo({
            url: url
          });
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, alertContent + "失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: alertContent + "接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, alertContent + "接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：关闭是否创建小队提示弹窗
  hideNewTeamAlertPop: function () {
    this.setData({
      isShowAlertNewTeam: false
    })
  },
  //事件：显示创建小队弹窗
  showNewTeamCreatePop: function () {
    var that = this;
    that.getTeamRoleDataList();
    that.setData({
      isShowCreateNewTeam: true,
      isShowAlertNewTeam: false,
    })
  },
  //事件：关闭创建小队弹窗
  hideCreateNewTeamPop: function () {
    this.setData({
      isShowAlertNewTeam: false,
      isShowCreateNewTeam: false
    })
  },
  //事件：选择小队角色
  bindTeamRolePickerChange: function (e) {
    var that = this,
      index = e.detail.value;
    that.setData({
      teamRole: that.data.teamRoleList[index],
    })
    console.log('picker发送选择改变，携带值为:' + e.detail.value + ":" + that.data.teamRole)
  },
  //事件：创建小队
  submitNewTeam: function (e) {
    var that = this,
      teamName = that.data.teamName,
      teamRole = that.data.teamRole;
    if (Utils.myTrim(teamName) == "" || Utils.myTrim(teamRole) == "") {
      wx.showToast({
        title: "小队名称和角色必填！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.createNewTeam();
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
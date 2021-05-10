// pages/mycard/mycard.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages", footFolderDir = "../../../";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    showmessage: false,
    aabb: true,
    showcheckmsg: false,
    isShowSelselection: false,
    isMobile: false,
    isEmail: false,
    isTel: false,
    showredbackokpop: false,
    userData: null,
    updateStatus: false, //用户是否修改信息
    updateFileStatus: false, //用户是否修改相册
    updateFileDisabled: false,
    isOnShow: false, //chooseImage会触发onshow，用于防止触发onshow
    contact: null,
    job: null,
    remark: null,
    company: null,
    mobile: null,
    tel: null,
    email: null,
    wxnumber: null,
    addr: null,
    school: null,
    hometown: null,
    personIntro: null,
    cardTemplateId: null,
    productInfo: null,
    personalClass: null,
    personalTrade: null,
    showEmail: null,
    showMobile: null,
    showTel: null,
    selectedArticles: null,
    userUploadFile: [],
    showModaltips: false,
    showModalsave: false,
    compStatus: true, //true：编辑、false：保存
    checked: false,
    disabled: false,
    cardMessage: null,
    showText: true,
    remarkStatus: true, //标注 是否显示，分享的时候隐藏
    showSendImg: true, // true图片，false文章
    showReceiveType: 1, // 1随机，2p平均
    showMyArticleList: true, //是否显示要发送的文章列表
    showOtherItems: false,
    showRechargeTips: false, //充值提示
    userCardTemList: [], //模板列表
    message: "", //留言输入内容
    hisHead: "",
    myHead: "",
    heig: "", //聊天窗口高度
    msgList: [], //留言板
    msgDetaList: [], //留言板详情
    shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
    shareTitle: "",
    myArticleList: [], //分享时 文章列表
    sharedisabled: false, //分享按钮禁用
    redEnvelPrice: '',
    redEnvelNum: '',
    paymentStatus: false,
    paymentdisabled: false, //充值提示按钮禁用
    priceLimitationTips: false, //红包金额最少0.01显示，
    rechargeMoney: 0,
    industrySort: ['智能家居', '数码', '时尚', '教育', '传媒', '金融', '艺术', '建筑', '制造', '健康', '互联网', '设计'], //所在行业选项
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getIndustryType();
    if (options.status == 1) {
      that.getMainDataList(options.cardId);
      return
    }
    if (!that.data.isOnShow) {
      console.log("onLoad")
      var userData = app.data.userCardDetaData;
      // var personalTrade = userData.personalTrade;
      // if (!Utils.isNull(personalTrade)) {
      //   if (personalTrade.substr(personalTrade.length - 1, 1) == "|") {
      //     personalTrade = personalTrade.substring(0, personalTrade.length - 1);
      //   }
      //   userData.personalTrade = personalTrade.split('|');
      // }
      that.setData({
        userData: userData,
        userCardTemList: app.data.cardTemplateList,
        userId: app.globalData.userInfo.userId
      })
      console.log("名片数据：", app.data.userCardDetaData)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //事件：我要导航
  navigateTo: function(e) {
    var that = this,
      address = "";
    try {
      address = e.currentTarget.dataset.addr;
    } catch (e) {}
    app.navigateToMap(that, address);
  },
  //选中模板事件
  selectTemplate: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var userData = that.data.userData;
    userData.cardTemp = that.data.userCardTemList[index];
    that.setData({
      userData: userData,
      cardTemplateId: that.data.userCardTemList[index].id,
      updateStatus: true
    })
  },

  //公司资料按钮
  companyDetails: function() {
    app.data.userCardDetaData = this.data.userData
    wx.navigateTo({
      url: packComPageUrl + "/perfectCo/perfectCo?vtype=3"
    });
  },
  //获取输入修改内容
  getInput: function(e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var field = e.currentTarget.dataset.value;
    that.setData({
      updateStatus: true,
      [field]: val
    })
    if (field == 'addr') {
      var addrStr = 'userData.addr';
      that.setData({
        [addrStr]: val
      })
    }
  },
  /*input 不可见*/
  showPassword: function(e) {
    var that = this;
    var value = e.currentTarget.dataset.value;
    var isPassword = "";
    var param = "";
    if (value == "mobile") {
      var showMoel = "userData.showMobile";
      that.setData({
        [showMoel]: !that.data.userData.showMobile,
        updateStatus: true,
        showMobile: !that.data.userData.showMobile
      })
    } else if (value == "email") {
      var showMoel = "userData.showEmail";
      that.setData({
        [showMoel]: !that.data.userData.showEmail,
        updateStatus: true,
        showEmail: !that.data.userData.showEmail
      })
    } else if (value == "tel") {
      var showMoel = "userData.showTel";
      that.setData({
        [showMoel]: !that.data.userData.showTel,
        updateStatus: true,
        showTel: !that.data.userData.showTel
      })
    }
  },
  //获取名片
  getMainDataList: function(cardId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=myContactList&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data; // 接口相应的json数据
          var mydataList = data.data.mydataList;
          var cardTemplateList = data.data.cardTemplateList;
          if (mydataList.length > 0) {
            for (var i = 0; i < mydataList.length; i++) {
              if (mydataList[i].id == cardId) {
                if (mydataList[i].userFile != "" && mydataList[i].userFile != undefined &&
                  mydataList[i].userFile != null && mydataList[i].userFile != "null") {
                  var imgFile = mydataList[i].userFile.split(",");
                  mydataList[i].userFile = imgFile;
                } else {
                  mydataList[i].userFile = [];
                }
                for (var y = 0; y < cardTemplateList.length; y++) {
                  if (mydataList[i].cardTemplateId == cardTemplateList[y].id) {
                    mydataList[i].cardTemp = cardTemplateList[y];
                  }
                }
                if (mydataList[i].companyFile != "" && mydataList[i].companyFile != undefined &&
                  mydataList[i].companyFile != null && mydataList[i].companyFile != "null") {
                  var companyImgFile = mydataList[i].companyFile.split(",");
                  mydataList[i].companyFile = companyImgFile;
                } else {
                  mydataList[i].companyFile = [];
                }
                if (!Utils.isNull(mydataList[i].personalTrade)) {
                  var personalTrade = mydataList[i].personalTrade
                  personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                  personalTrade = personalTrade.split("|");
                  mydataList[i].personalTrade = personalTrade;
                }
                that.setData({
                  userData: mydataList[i],
                  userCardTemList: cardTemplateList,
                  userId: app.globalData.userInfo.userId
                })
                break;
              }
            }
          }
          if (Utils.isNull(that.data.userData)) {
            wx.showModal({
              title: '提示',
              content: '名片已删除',
              showCancel: false,
              confirmText: "进入主页",
              success(res) {
                wx.reLaunch({
                  url: footFolderDir + app.data.sysMainPage
                })
              }
            })
            return;
          }
        } else {
          app.setErrorMsg2(that, "获取名片夹信息失败2！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },

  //分享事件
  onShareAppMessage: function(res) {
    let that = this;
    // 来自页面内转发按钮
    wx.hideToast();
    that.setData({
      showModalsave: false,
      disabled: false,
      remarkStatus: false
    })
    var articlesId = "";
    var path = "";
    var redEnvelStat = false;
    var cardRedInfoId = "";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (that.data.redEnvelPrice > 0) {
      var timestamp = Date.parse(new Date());
      cardRedInfoId = app.globalData.userInfo.userId + that.data.userData.id + timestamp;
      that.requestRedEnvel(cardRedInfoId);
      redEnvelStat = true;
    }
    if (!that.data.showSendImg && !Utils.isNull(that.data.selectedArticles)) { //分享带文章
      path = '/packageCommercial/pages/articleinfo/articleinfo?scene=1&contactUserId=' + that.data.userData.id + '&userId=' + app.globalData.userInfo.userId + "&articlesId=" + that.data.selectedArticles.id + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.userData.contactId
    } else {
      path = '/packageCommercial/pages/carddetails/carddetails?status=1&contactUserId=' + app.data.userCardDetaData.id + '&checked=' + that.data.checked + '&userId=' + app.globalData.userInfo.userId + '&redEnvelStat=' + redEnvelStat + '&cardRedInfoId=' + cardRedInfoId + '&batch=' + timestamp + '&contactId=' + that.data.userData.contactId;

      // path = '/packageCommercial/pages/card/card?status=1&contactUserId=' + app.data.userCardDetaData.id + '&checked=' + that.data.checked + '&userId=' + app.globalData.userInfo.userId + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.userData.contactId
    }
    var shareWXImg = that.data.shareWXImg;
    var shareTitle = that.data.shareTitle;
    if (Utils.isNull(shareTitle)) {
      shareTitle = that.data.userData.contact + "的名片";
    }

    console.log("分享路径：", path)
    that.requestCardRecord(cardRedInfoId, timestamp); //记录发送名片
    return {
      title: shareTitle,
      path: path,
      imageUrl: shareWXImg,
      success: (res) => { // 失效
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //编辑或保存事件
  editModalcomp: function(e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    if (val == 0) {
      that.setData({
        compStatus: !that.data.compStatus
      })
    } else {

    }
  },
  //保存创建信息
  saveCardInfo: function() {
    var that = this;
    console.log("保存事件", that.data.updateStatus)
    if (!that.data.updateStatus) {
      wx.showToast({
        title: '保存成功！',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        compStatus: true,
        updateStatus: false
      })
      return;
    } else {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var urlParam = "cls=main_user&action=saveUserInfo&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&opertion=mod&companyId=" + app.globalData.userInfo.companyId + "&id=" + that.data.userData.id;
      if (that.data.contact != null) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        if (re.test(that.data.contact) || that.data.contact == "") {
          wx.showToast({
            title: '请输入您的姓名！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      if (!Utils.isNull(that.data.showEmail)) {
        Params += "&showEmail=" + that.data.showEmail;
      }
      if (!Utils.isNull(that.data.showMobile)) {
        Params += "&showMobile=" + that.data.showMobile;
      }

      if (!Utils.isNull(that.data.showTel)) {
        Params += "&showTel=" + that.data.showTel;
      }
      if (that.data.contact != null) {
        Params += "&contact=" + encodeURIComponent(that.data.contact);
      }
      if (that.data.remark != null) {
        Params += "&remark=" + encodeURIComponent(that.data.remark);
      }
      if (that.data.job != null) {
        Params += "&job=" + encodeURIComponent(that.data.job);
      }
      if (that.data.company != null) {
        Params += "&company=" + encodeURIComponent(that.data.company);
      }
      if (that.data.mobile != null) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
        if (that.data.mobile.length > 0 && !myreg.test(that.data.mobile)) {
          wx.showToast({
            title: '请输入正确手机号码',
            icon: 'none',
            duration: 2000,
          })
          return;
        }
        Params += "&mobile=" + that.data.mobile;
      }
      if (that.data.email != null) {
        Params += "&email=" + that.data.email;
      }
      if (that.data.tel != null) {
        Params += "&tel=" + that.data.tel;
      }
      if (that.data.wxnumber != null) {
        Params += "&wxnumber=" + that.data.wxnumber;
      }
      if (that.data.school != null) {
        Params += "&school=" + encodeURIComponent(that.data.school);
      }
      if (that.data.hometown != null) {
        Params += "&hometown=" + encodeURIComponent(that.data.hometown);
      }
      if (that.data.addr != null) {
        Params += "&addr=" + encodeURIComponent(that.data.addr);
      }
      if (that.data.personIntro != null) {
        Params += "&personIntro=" + encodeURIComponent(that.data.personIntro);
      }
      if (that.data.cardTemplateId != null) {
        Params += "&cardTemplateId=" + encodeURIComponent(that.data.cardTemplateId);
      }
      if (that.data.productInfo != null) {
        Params += "&productInfo=" + encodeURIComponent(that.data.productInfo);
      }
      if (that.data.personalClass != null) {
        Params += "&personalClass=" + encodeURIComponent(that.data.personalClass);
      }
      var personalTrade = that.data.userData.personalTrade;
      var personalTradeStr = "";
      for (let i = 0; i < personalTrade.length; i++) {
        personalTradeStr += personalTrade[i] + "|";
      }
      Params += "&personalTrade=" + encodeURIComponent(personalTradeStr);

      if (that.data.updateFileStatus) {
        var userFile = "";
        var wxCodeImg = "";
        var headerImg = "";
        userFile = that.data.userData.userFile.join(",");
        Params += "&userFile=" + userFile;
        wxCodeImg = that.data.userData.wxCodeImg;
        Params += "&wxCodeImg=" + wxCodeImg;
        headerImg = that.data.userData.headerImg;
        Params += "&headerImg=" + headerImg;
      }

      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + Params;
      console.log(URL + urlParam)
      wx.request({
        url: URL + urlParam,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "post",
        success: function(res) {
          console.log(res)
          if (res.data.rspCode == 0) {
            wx.showToast({
              title: '保存成功!',
              icon: 'none',
              duration: 2000
            })
            if (!Utils.isNull(res.data.data)) {
              var userMap = res.data.data.userMap;
              if (!Utils.isNull(userMap.userFile)) {
                var imgFile = userMap.userFile.split(",");
                userMap.userFile = imgFile;
              } else {
                userMap.userFile = [];
              }
              for (var y = 0; y < that.data.userCardTemList.length; y++) {
                if (userMap.cardTemplateId == that.data.userCardTemList[y].id) {
                  userMap.cardTemp = that.data.userCardTemList[y];
                }
              }
              var personalTrade = userMap.personalTrade;
              if (!Utils.isNull(personalTrade)) {
                if (personalTrade.substr(personalTrade.length - 1, 1) == "|") {
                  personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                }
                userMap.personalTrade = personalTrade.split('|');
              }
              that.setData({
                compStatus: true,
                updateStatus: false,
                userData: userMap
              })
            } else {
              that.setData({
                compStatus: true,
                updateStatus: false,
              })
            }

          } else {
            app.setErrorMsg2(that, "我的名片保存失败！错误信息：", URL + urlParam, false);
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 1500
            })
            // console.log("接口失败1：" + res)
          }
        },
        fail: function(err) {

          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1500
          })
          // console.log("接口失败：" + err)
        }
      })
    }
  },
  //删除事件
  hideModalDele: function() {
    console.log("删除事件")
    var that = this;
    // this.queryIsGroupleader();
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success(res) {
        if (res.confirm) {
          that.deleUserCardData();
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查询留言板
  requestQueryCardMsg: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_message&action=messageReadList&sendUserId=" + app.globalData.userInfo.userId + "&receiveUserId=" + that.data.userData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&operation=2" + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("查询留言板", res)
        if (res.data.rspCode == 0) {
          that.setData({
            msgList: res.data.data,
            showmessage: true
          })
        } else {
          console.log("留言查找错误")
          app.setErrorMsg2(that, "查询留言板失败！错误信息：" + JSON.stringify(res), URL + urlParam);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //删除之前查询是否名片群的群主
  queryIsGroupleader: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var content = "确定要删除吗？";
    var urlParam = "cls=main_contactFolder&action=qzListFolder&contactId=" + that.data.userData.contactId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          if (!Utils.isNull(res.data.data.dataList) && res.data.data.dataList.length > 0) {
            var data = res.data.data.dataList;
            var cardName = "";
            for (let i = 0; i < data.length; i++) {
              cardName += data[i].name + "群、";
            }
            cardName = cardName.substring(0, cardName.length - 1);
            content = " 该名片为" + cardName + "的群主，请先转让群主后才可删除";
            wx.showModal({
              title: '提示',
              content: content,
              showCancel: false,
              confirmText: '好的',
              success(res) {
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
              content: content,
              success(res) {
                if (res.confirm) {
                  that.deleUserCardData();
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return;
          }

        } else {
          app.setErrorMsg2(that, "删除之前查询是否还是群主失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
      complete: function() {

      }
    })
  },
  //删除接口
  deleUserCardData: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=delContact&userId=" + app.globalData.userInfo.userId + "&id=" + that.data.userData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&companyId=" + app.globalData.userInfo.companyId;
    console.log('删除名片url', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('删除名片success', res)
        if (res.data.rspCode == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.setErrorMsg2(that, "删除我的名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //图片上传
  uploadDIY(filePaths, successUp, failUp, i, length, type) {
    var that = this;
    var userFileNum = 0;
    wx.showLoading({
      title: '正在上传图片中...',
      mask: true
    })
    if (type == 0) { //相册判断最多上传6张
      userFileNum = that.data.userData.userFile.length + 1;
      console.log("准备上传第" + userFileNum + "张图片")
      if (userFileNum > 6) {
        wx.showToast({
          title: '名片相册最多上传6张照片！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + that.data.userData.id + "&sign=" + sign;
    if (type == 2) { //上传分享图片 都加此参数（添加红包水印）。
      urlParam += "&hb=1";
    }
    console.log(URL + urlParam)
    wx.uploadFile({
      url: URL + urlParam,
      filePath: filePaths[i],
      name: 'file',
      formData: {

      },
      success: (res) => {
        successUp++;
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
          console.log('data:', data)
        } catch (e) {}
        if (!Utils.isNull(data) && !Utils.isNull(data.rspCode) && data.rspCode == 0) {
          var imgUrl = "";
          imgUrl = data.data.fileName;
          if (type == 2) {
            if (that.data.paymentStatus) {
              imgUrl = data.data.fileName_h;
            }
            that.setData({
              shareWXImg: imgUrl,
              shareWXImg_h: data.data.fileName_h,
              shareWXImg_old: data.data.fileName
            })
            return;
          } else if (type == 1) {
            var userFileStr = "userData.wxCodeImg";
            that.setData({
              [userFileStr]: imgUrl,
              updateStatus: true,
              updateFileStatus: true,
            })
            return;
          } else if (type == 3) {
            var userFileStr = "userData.headerImg";
            that.setData({
              [userFileStr]: imgUrl,
              updateStatus: true,
              updateFileStatus: true,
            })
            return;
          } else if (type == 0) {
            console.log("type=", type)
            var userFile = that.data.userData.userFile;
            userFile = userFile.concat(imgUrl);
            var userFileStr = "userData.userFile";
            that.setData({
              [userFileStr]: userFile,
              updateStatus: true,
              updateFileStatus: true,
            })
            console.log('userFile[]:', that.data.userData.userFile)
          }

        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
          that.setData({
            updateFileDisabled: false
          })
          wx.hideLoading();
        } else { //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length, type);
        }
      },
    });
  },
  genghuanTP: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          var tempFilePaths = res.tempFilePaths;
          var imgUrl = data.data.fileName;
          if (that.data.paymentStatus) {
            imgUrl = data.data.fileName_h;
          }
          that.setData({
            shareWXImg: imgUrl,
            shareWXImg_h: data.data.fileName_h,
            shareWXImg_old: data.data.fileName
          })
          that.setData({
            tempFilePaths: tempFilePaths[0]
          })
        }
      },
      fail: function(err) {

        wx.hideLoading()
      }
    });
  },
  uploadImage: function(e) {
    var that = this,
      sType = 0;
    //sType:0 相册图片（多个），2 微信分享图片（单个）
    if (that.data.updateFileDisabled) {
      console.log('end')
      return;
    }
    that.setData({
      updateFileDisabled: true
    })
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    sType = parseInt(e.currentTarget.dataset.type);
    var count = 1;
    if (sType == 0) {
      var userFile = that.data.userData.userFile;
      if (!Utils.isNull(userFile) && userFile.length > 0) {
        count = 6 - userFile.length;
      } else {
        count = 6;
      }
    }
    that.setData({
      isOnShow: true
    })
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          //1、多图上传
          console.log("开始上传。。。")
          switch (sType) {
            case 0:
              var successUp = 0; //成功个数
              var failUp = 0; //失败个数
              var length = res.tempFilePaths.length; //总共个数
              var i = 0; //第几个
              this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, sType);
              return;
              break;

            case 1:
              var successUp = 0; //成功个数
              var failUp = 0; //失败个数
              var length = res.tempFilePaths.length; //总共个数
              var i = 0; //第几个
              this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, sType);
              return;
              break;

            case 2:
              var successUp = 0; //成功个数
              var failUp = 0; //失败个数
              var length = res.tempFilePaths.length; //总共个数
              var i = 0; //第几个
              this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, sType);
              return;
              break;

            case 3:
              var successUp = 0; //成功个数
              var failUp = 0; //失败个数
              var length = res.tempFilePaths.length; //总共个数
              var i = 0; //第几个
              this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, sType);
              return;
              break;

          }
        }
      },
      fail: function(err) {
        that.setData({
          updateFileDisabled: false
        })
        wx.hideLoading()
      }
    });
  },
  //事件：图片查看事件
  viewImg: function(e) {
    let that = this;
    app.viewImg(e);
  },
  /* 完善信息 */
  hideModaltip: function() {
    this.setData({
      showModaltips: false
    })
  },
  showModaltip: function(e) {
    var that = this;
    var val = e.currentTarget.dataset.index;
    var userFile = that.data.userData.userFile;
    userFile.splice(val, 1);
    var userFileStr = "userData.userFile";
    that.setData({
      [userFileStr]: userFile,
      updateStatus: true,
      updateFileStatus: true,
    })
  },
  hideWXQRcode: function(e) {
    var that = this;
    var userFileStr = "userData.wxCodeImg";
    that.setData({
      [userFileStr]: '',
      updateStatus: true,
      updateFileStatus: true,
    })
  },
  hideModalHeaderImg: function(e) {
    var that = this;
    var userFileStr = "userData.headerImg";
    that.setData({
      [userFileStr]: '',
      updateStatus: true,
      updateFileStatus: true,
    })
  },
  hideModalsave: function() {
    this.setData({
      showModalsave: false
    })
  },
  showModalsave: function() {
    this.setData({
      showModalsave: true
    })
  },

  //发送名片
  sendNameCardShare: function() {
    if (this.data.updateStatus) {
      wx.showToast({
        title: '请先保存修改的资料',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //显示发送名片弹窗
    this.setData({
      disabled: true,
      showModalsave: true
    })
    //获取文章列表
    this.queryArticleList();
  },
  hideModalsave: function() {
    this.setData({
      showModalsave: false,
      disabled: false
    })
  },
  //希望对方回个名片
  checkboxChange: function(e) {
    var that = this;
    that.setData({
      checked: !that.data.checked
    })
    console.log(that.data.checked)
  },
  //获取分享的留言
  getMessage: function(e) {
    var that = this;
    var val = e.detail.value;
    val = val.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    that.setData({
      cardMessage: val
    })
  },
  cancelWXSend: function() {
    var that = this;
    that.setData({
      showModalsave: false,
      disabled: false,
    })
  },
  changeWXSSAlert: function(e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    // value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    // if (Utils.checkStr(value)) {
    //   wx.showToast({
    //     title: "非法字符不能输入！",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    that.setData({
      shareTitle: value,
    })
  },
  hideredbackokpop: function() {
    this.setData({
      showredbackokpop: false,
      disabled: false
    })
  },

  hidemessage: function() {
    this.setData({
      showmessage: false
    })
  },
  hidecheckmsg: function() {
    this.setData({
      showcheckmsg: false,
      showmessage: false
    })
  },
  hidecheckmsg2: function() {
    this.setData({
      showcheckmsg: false,
    })
  },
  //删除一条留言
  removeMessage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除留言记录吗？',
      success(res) {
        if (res.confirm) {
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          var urlParam = "cls=main_message&action=clearMessage&receiveUserId=" + that.data.userData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
          var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
          urlParam = urlParam + "&operation=2&userId=" + app.globalData.userInfo.userId + "&sendUserId=" + that.data.msgList[index].sendUserId + "&sign=" + sign;
          console.log(URL + urlParam)
          wx.request({
            url: URL + urlParam,
            success: function(res) {
              console.log(res.data)
              if (res.data.rspCode == 2) {
                console.log("成功!!", res)
                var msgList = that.data.msgList;
                msgList.splice(index, 1);
                that.setData({
                  msgList: msgList
                })
              } else {
                app.setErrorMsg2(that, "删除留言失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
                wx.showToast({
                  title: res.data.rspMsg,
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: function(err) {

              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 1500
              })
              console.log("接口失败：" + err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查询要发送的文章列表
  queryArticleList: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_document&action=documentList&folderId=-1&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&pageSize=100&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("文章列表", res.data.data)
        if (res.data.rspCode == 0) {
          if (res.data.data.length == 0) {
            that.setData({
              showMyArticleList: false
            })
            return;
          }
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (i == 0) {
              data[i].check = true;
              that.setData({
                selectedArticles: data[i]
              })

            } else {
              data[i].check = false;
            }
          }
          that.setData({
            myArticleList: data
          })
        } else {
          app.setErrorMsg2(that, "查询要发送的文章列表！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  confirmmessage: function(e) {
    var that = this;
    if (Utils.myTrim(that.data.message) == "") {
      wx.showToast({
        title: "请输入留言内容！",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_message&action=saveMessage&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sendUserId=" + that.data.msgList[that.data.msgIndex].sendUserId + "&receiveUserId=" + that.data.userData.id + "&message=" + encodeURIComponent(that.data.message) + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("留言成功!!", res)
          that.setData({
            message: "",
            heig: (that.data.msgDetaList.length + 1) * 100,
            msgDetaList: that.data.msgDetaList.concat(res.data.data)
          })
        } else {
          app.setErrorMsg2(that, "留言失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })

  },
  //查询单个留言详情
  getMsgList: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      msgIndex: index
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_message&action=messageList&sendUserId=" + that.data.msgList[index].sendUserId + "&receiveUserId=" + that.data.userData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&operation=2&status=1" + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("内容详情", res.data)
        if (res.data.rspCode == 0) {
          var useList = res.data.data.userList;
          var msgList = that.data.msgList;
          var hisHead = "";
          var myHead = "";
          msgList[index].status = 1;
          var num = 0;
          for (var i = 0; i < msgList.length; i++) {
            if (msgList[i].status == 1) {
              num++;
            }
          }
          if (num == msgList.length) {
            var userData = that.data.userData;
            userData.messageStatus = 0;
            that.setData({
              userData: userData
            })
          }
          if (useList[0].id == that.data.userData.id) {
            myHead = useList[0].headerImg;
            hisHead = useList[1].headerImg;
          } else {
            myHead = useList[1].headerImg;
            hisHead = useList[0].headerImg;
          }
          that.setData({
            msgDetaList: res.data.data.dataList,
            msgList: msgList,
            heig: res.data.data.dataList.length * 100,
            showmessage: false,
            showcheckmsg: true
          })
        } else {
          app.setErrorMsg2(that, "查找留言详情失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          console.log("留言查找错误")
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {


        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })

  },
  changeGetMsg: function(e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    that.setData({
      message: value,
    })
  },
  changeShowText: function(e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    if (!Utils.isNull(value)) {
      that.setData({
        showText: false
      })
    }
  },
  changeGetTextarea: function(e) {
    var that = this;
    that.setData({
      showText: true
    })
  },

  hidemessage: function() {
    this.setData({
      showmessage: false
    })
  },
  showmessage: function() {
    this.setData({
      showmessage: true
    })
  },
  hidecheckmsg: function() {
    this.setData({
      showcheckmsg: false,
    })
  },
  radioChange: function() {
    this.setData({
      showSendImg: !this.data.showSendImg,
    })
    if (Utils.isNull(this.data.selectedArticles)) {
      this.setData({
        sharedisabled: false
      })
    }
    var shareWXImg = this.data.shareWXImg;
    if (this.data.showSendImg) { //--------------------发送图片
      if (this.data.paymentStatus) { //已支付选择发红包
        if (Utils.isNull(this.data.shareTitle)) { //没有自定义标题
          this.setData({
            shareTitle: "发红包了，您赶紧快抢吧！"
          })
        }
        if (shareWXImg.indexOf("/images/FXHB.png?") == -1) {
          this.setData({
            shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
          })
        }
      } else { //未支付
        if (!Utils.isNull(this.data.selectedArticles)) {
          if (this.data.shareTitle == this.data.selectedArticles.name) { //没有自定义标题
            this.setData({
              shareTitle: ""
            })
          }
          if (shareWXImg.indexOf("/images/cardShare01.jpg?") == -1) { //更改为默认图片
            this.setData({
              shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
            })
          }
        }
      }
    } else { //--------------------发送文章
      if (this.data.paymentStatus) { //已支付选择发红包
        if (Utils.isNull(this.data.shareTitle || (!this.data.showSendImg && this.data.showMyArticleList && !Utils.isNull(this.data.selectedArticles) && this.data.selectedArticles.name == this.data.shareTitle))) {
          this.setData({
            shareTitle: "发红包了，您赶紧快抢吧！"
          })
        }
        // if (this.data.shareWXImg.indexOf("/images/cardShare01.jpg?") != -1 || (!this.data.showSendImg && this.data.showMyArticleList && !Utils.isNull(this.data.selectedArticles) && this.data.shareWXImg.indexOf(this.data.selectedArticles.file) != -1)) {
        var file = this.data.selectedArticles.file;
        if (Utils.isNull(file)) {
          this.setData({
            shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
          })
        } else if (!Utils.isNull(file)) {
          var file = file.substring(0, file.lastIndexOf('/') + 1) + 'h_' + file.substring(file.lastIndexOf('/') + 1, file.length);
          this.setData({
            shareWXImg: DataURL + file + "?" + (Math.random() / 9999)
          })
        }
      } else { //未支付选择发红包
        if (!Utils.isNull(this.data.selectedArticles)) {
          if (Utils.isNull(this.data.shareTitle && !Utils.isNull(this.data.selectedArticles.name))) { //没有自定义标题
            this.setData({
              shareTitle: this.data.selectedArticles.name
            })
          }
          if (!Utils.isNull(this.data.selectedArticles.file) && this.data.shareWXImg.indexOf("/images/cardShare01.jpg?") != -1) {
            this.setData({
              shareWXImg: DataURL + this.data.selectedArticles.file + "?" + (Math.random() / 9999)
            })
          }
        }
      }

      if (Utils.isNull(this.data.selectedArticles)) {
        this.setData({
          sharedisabled: true,
        })
      }
    }
    console.log('当前图片：', this.data.shareWXImg)
  },
  radioChange2: function() {
    this.setData({
      showReceiveType: !this.data.showReceiveType
    })
  },
  //事件：切换扩展选项显示/隐藏
  onChangeShowItemDetailState: function(e) {
    var that = this;
    if (!that.data.showSendImg && Utils.isNull(this.data.selectedArticles)) {
      return;
    }
    that.setData({
      showOtherItems: !that.data.showOtherItems
    })
  },
  choseText: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    var myArticleList = this.data.myArticleList;
    for (let i = 0; i < myArticleList.length; i++) {
      if (myArticleList[i].check == true) {
        myArticleList[i].check = false;
      }
    }
    myArticleList[index].check = true;
    this.setData({
      selectedArticles: myArticleList[index],
      myArticleList: myArticleList,
    })


    if (!that.data.paymentStatus) {
      this.setData({
        shareTitle: myArticleList[index].name
      })
      if (!Utils.isNull(myArticleList[index].file)) {
        this.setData({
          shareWXImg: DataURL + myArticleList[index].file
        })
      }
    } else {
      that.setData({
        shareTitle: "发红包了，您赶紧快抢吧！"
      })
      if (!Utils.isNull(myArticleList[index].file)) {
        var shareWXImg = myArticleList[index].file;
        //带文章 红包水印图
        shareWXImg = shareWXImg.substring(0, shareWXImg.lastIndexOf('/') + 1) + 'h_' + shareWXImg.substring(shareWXImg.lastIndexOf('/') + 1, shareWXImg.length);
        that.setData({
          shareWXImg: DataURL + shareWXImg
        })
      } else {
        that.setData({
          shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
        })
      }
    }
    console.log('图片：：：', that.data.shareWXImg)
  },

  //-----------------------------------比carddetails页面新增代码
  //获取输入的红包金额
  getRedEnvelPrice: function(e) {
    var that = this;
    var redEnvelPrice = e.detail.value;
    if (/^(\d?)+(\.\d{0,2})?$/.test(redEnvelPrice)) { //正则验证，提现金额小数点后不能大于两位数字
      redEnvelPrice = redEnvelPrice;
    } else {
      redEnvelPrice = redEnvelPrice.substring(0, redEnvelPrice.length - 1);
    }
    that.setData({
      redEnvelPrice: redEnvelPrice,
      sharedisabled: true
    })
    if ((Utils.isNull(redEnvelPrice) || redEnvelPrice <= 0) && (Utils.isNull(that.data.redEnvelNum) || that.data.redEnvelNum <= 0)) {
      that.setData({
        sharedisabled: false
      })
    }
    if (that.data.redEnvelNum > 0 && redEnvelPrice > 0) {
      that.requestConfirmSend();
    } else {
      that.resetTitleAndImg();
    }
  },
  //过滤小数点后2位
  getRedEnvelPriceEnd: function() {
    var redEnvelPrice = this.data.redEnvelPrice;
    if (!Utils.isNull(redEnvelPrice) && redEnvelPrice > 0) {
      if (redEnvelPrice.indexOf(".") >= 0) {
        this.setData({
          redEnvelPrice: parseFloat(redEnvelPrice).toFixed(2)
        })
      }
    }
  },
  //获取输入的红包数量
  getRedEnvelNum: function(e) {
    var that = this;
    var redEnvelNum = e.detail.value;
    that.setData({
      redEnvelNum: redEnvelNum,
      sharedisabled: true
    })
    if ((Utils.isNull(redEnvelNum) || redEnvelNum <= 0) && (Utils.isNull(that.data.redEnvelPrice) || that.data.redEnvelPrice <= 0)) {
      that.setData({
        sharedisabled: false,
      })
    }
    if (redEnvelNum > 0 && that.data.redEnvelPrice > 0) { //红包金额和数量输入完毕 开始检查余额
      that.requestConfirmSend();
    } else {
      that.resetTitleAndImg();
    }

  },
  //查询可发红包金额；
  requestConfirmSend: function() {
    var that = this;
    if ((that.data.redEnvelPrice / that.data.redEnvelNum) < 0.01) {
      that.setData({
        priceLimitationTips: true,
        showRechargeTips: false
      })
      return
    } else {
      if (that.data.priceLimitationTips == true) {
        that.setData({
          priceLimitationTips: false
        })
      }
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var amtType = 1;
    if (!that.data.showReceiveType) {
      amtType = 2;
    }
    var urlParam = "cls=redEnvelope_changePurse&action=changePurseSurplus&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("查询可发红包金额", res.data)
        if (res.data.rspCode == 0) {
          var surplusMoney = res.data.data.surplusMoney;
          var sharedisabled = false;
          if (surplusMoney < that.data.redEnvelPrice) { //余额不够发红包
            var rechargeMoney = Utils.accSub(that.data.redEnvelPrice, surplusMoney);
            that.setData({
              showRechargeTips: true,
              rechargeMoney: rechargeMoney,
            })

          } else { //余额够发红包
            var shareWXImg = that.data.shareWXImg;
            if (that.data.showSendImg) { //图片
              console.log('发送图片', that.data.showSendImg)
              if (Utils.isNull(that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (!Utils.isNull(shareWXImg)) { //默认图片
                if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1) {
                  that.setData({
                    shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
                  })
                } else { //不是默认图
                  //带红包水印图
                  that.setData({
                    shareWXImg: that.data.shareWXImg_h
                  })
                }

              }
            } else { //文章
              console.log('发送文章', that.data.showSendImg)
              if (Utils.isNull(that.data.shareTitle) || (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles) && that.data.selectedArticles.name == that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles.file) && !Utils.isNull(shareWXImg)) { //文章图片
                console.log("有文章图片，加水印")
                if (shareWXImg.indexOf(that.data.selectedArticles.file) != -1) {

                  //带文章 红包水印图
                  var shareWXImg = shareWXImg.substring(0, shareWXImg.lastIndexOf('/') + 1) + 'h_' + shareWXImg.substring(shareWXImg.lastIndexOf('/') + 1, shareWXImg.length);
                  that.setData({
                    shareWXImg: shareWXImg
                  })
                }

              } else if (!Utils.isNull(shareWXImg)) { //默认图
                if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1) {
                  console.log("默认图")
                  that.setData({
                    shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
                  })
                } else { //上传图片
                  //带红包水印图
                  that.setData({
                    shareWXImg: that.data.shareWXImg_h
                  })
                }
              }
              if (Utils.isNull(that.data.selectedArticles)) {
                sharedisabled = true;
              }
            }
            console.log('图片：：：', that.data.shareWXImg)
            that.setData({
              sharedisabled: sharedisabled,
              showRechargeTips: false,
              paymentStatus: true
            })
          }
        } else {
          app.setErrorMsg2(that, "查询可发红包金额！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //取消红包金额或者数量后 回复图片和文字
  resetTitleAndImg: function() {
    var that = this;

    if (that.data.showRechargeTips) {
      that.setData({
        showRechargeTips: false
      })
    }
    // if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
    if (that.data.paymentStatus) { //选择过红包
      if (that.data.showSendImg) { //发送图片
        if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
          that.setData({
            shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999)
          })
        } else {
          that.setData({
            shareWXImg: that.data.shareWXImg_old
          })
        }

      } else { //发送文章
        if (!Utils.isNull(that.data.selectedArticles) && !Utils.isNull(that.data.selectedArticles.file)) { //如果有文章图片
          that.setData({
            shareWXImg: DataURL + that.data.selectedArticles.file + "?" + (Math.random() / 9999)
          })
        } else if (!Utils.isNull(that.data.shareWXImg)) {
          if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
            that.setData({
              shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999)
            })
          }
        } else {
          that.setData({
            shareTitle: '',
            shareWXImg: that.data.shareWXImg_old
          })
        }
      }
    }
    if (that.data.shareTitle.indexOf('发红包了') != -1) {
      if (that.data.showSendImg) { //发送图片
        that.setData({
          shareTitle: ''
        })
      } else { //发送文章
        if (!Utils.isNull(that.data.selectedArticles)) { //如果有文章
          that.setData({
            shareTitle: that.data.selectedArticles.name
          })
        } else {
          that.setData({
            shareTitle: ''
          })
        }
      }
    }
    if (that.data.paymentStatus) {
      that.setData({
        paymentStatus: false
      })
    }
  },
  //事件：红包充值
  payment: function() {
    var that = this, attach = "6_0_" + app.data.hotelId + "_3", otherParams = "&body=" + encodeURIComponent("天天上-充值") + "&detail=" + encodeURIComponent("天天上-充值");
    if (that.data.paymentdisabled == true) {
      return;
    }
    that.setData({
      paymentdisabled: true
    })
    app.getPrePayId2(that, attach, otherParams, that.data.rechargeMoney);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.setData({
      paymentdisabled: false
    })
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;
        that.requestConfirmSend();
        console.log("支付发起成功！")
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
  //发送红包
  requestRedEnvel: function(cardRedInfoId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var amtType = 1;
    if (!that.data.showReceiveType) {
      amtType = 2;
    }

    timestamp = timestamp / 1000;
    var urlParam = "cls=acquireRedEnvelope_cardRedEnvelope&action=setCardRedEnvelope" + "&cardId=" + that.data.userData.id + "&senderUserId=" + app.globalData.userInfo.userId + "&amtType=" + amtType + "&totalMoney=" + that.data.redEnvelPrice + "&totalNumber=" + that.data.redEnvelNum + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&cardRedInfoId=" + cardRedInfoId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("发送红包", res.data)
        if (res.data.rspCode == 0) {
          console.log("发送成功")
        } else {
          app.setErrorMsg2(that, "发送红包！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //发送名片记录
  requestCardRecord: function(cardRedInfoId, timestamp) {
    var that = this;
    var timest = Date.parse(new Date());
    timest = timest / 1000;
    var urlParam = "cls=main_user&action=sendUserContact" + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timest;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + timestamp + "&contactUserId=" + that.data.userData.id + "&cardRedInfoId=" + cardRedInfoId + "&sign=" + sign;
    if (!that.data.showSendImg && !Utils.isNull(that.data.selectedArticles)) { //分享带文章
      urlParam += '&documentIds=' + that.data.selectedArticles.id
    }
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("名片记录成功")
        } else {
          app.setErrorMsg2(that, "发送名片记录！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function(err) {

      },
      complete: function(err) {
        that.setData({
          showModalsave: false,
          disabled: false,
          remarkStatus: false,
          showSendImg: true,
          showredbackokpop: false, //关闭分享确定弹窗
          showReceiveType: 1, // 1随机，2p平均
          showMyArticleList: true, //是否显示要发送的文章列表
          showOtherItems: false,
          userCardTemList: [], //模板列表
          message: "", //留言输入内容
          shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
          shareTitle: "",
          myArticleList: [], //分享时 文章列表
          redEnvelPrice: '',
          redEnvelNum: '',
          paymentStatus: false,
        })
      },
    })
  },

  bindPickerChange: function(e) {
    var index = e.detail.value;
    var field = e.currentTarget.dataset.value;
    var userStr = 'userData.personalTrade';
    this.setData({
      updateStatus: true,
      [field]: this.data.industrySort[index],
      [userStr]: this.data.industrySort[index]
    })
  },
  //方法：获取注册行业角色类型
  getIndustryType: function() {
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
      success: function(res) {
        console.log("获取注册行业角色类型：", res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          var tradeClass = data.tradeClass;
          var industrySort = tradeClass.split("|"); //所在行业。
          var myindustrySort = that.data.userData.personalTrade; //我已所在行业
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
            industrySort: industry2,
          })
        } else {
          app.setErrorMsg2(that, "获取注册行业角色类型：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {

        wx.showToast({
          title: "网络异常！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  clicks2: function(e) {
    if (this.data.compStatus) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    var arrs = this.data.industrySort;
    var userData = this.data.userData;
    if (Utils.isNull(userData.personalTrade)) {
      userData.personalTrade = [];
    }
    var personalTrade = userData.personalTrade.slice(0);
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
    var num = 0;
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
    userData.personalTrade = personalTrade;
    var userDataStr = 'userData.personalTrade';
    this.setData({
      [userDataStr]: personalTrade,
      updateStatus: true,
      personalTrade: arrs,
      industrySort: arrs,
    })
  },
  showisShowSel: function() {
    if (!this.data.compStatus) {
      this.setData({
        isShowSelselection: true
      })
    }

  },
  hideisShowSel: function() {
    this.setData({
      isShowSelselection: false
    })
  },
  hideqrcardimages: function() {
    this.setData({
      qrcardimages: false
    })
  },
  /**
   * 生成名片二维码图片
   */
  createModalQRcard: function() {
    var that = this,
      page = app.data.sysMainPage,
      pageData = "sType=13|cId=" + that.data.userData.id + "|suid=" + app.globalData.userInfo.userId,
      // imgUrl = DataURL + "/tts/shop@2x.png",
      title = that.data.userData.contact + "的名片";

    page = "packageCommercial/pages/carddetails/carddetails";
    pageData = "status=10|cid=" + that.data.userData.id + "|suid=" + app.globalData.userInfo.userId;

    app.createADModalQRImg(that, page, pageData, title, that.data.ADStr, "", "")
  },

  showtextarea: function() {
    let that = this, dataInfo = that.data.userData, id = 0;
    if (dataInfo != null && dataInfo != undefined) {
      id = dataInfo.id;
    }
    if (id <= 0) {
      wx.showToast({
        title: "保存表单信息后才能生成图片！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.setData({
      textarea: true
    })
  },
  /**
   * 获取广告语
   */
  getAd: function(e) {
    var adStr = e.detail.value;
    adStr = Utils.myTrim(adStr) != "" ? Utils.filterEmoj(adStr) : adStr;
    this.setData({
      ADStr: adStr,
    })
  },
  /**
   * 生成图片
   */
  showqrcardimages: function(e) {
    console.log(e)
    this.setData({
      qrcardimages: true,
      textarea: false
    })
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      that.setData({
        ADStr: "",
        cardImagUrl: "",
      })
    }
    that.createModalQRcard();
  },

  //方法：宣传图片生成处理方法
  setCADImgInfo: function(imgUrl) {
    var that = this;
    console.log(imgUrl)
    that.setData({
      isShowQRCode: true,
      cardImagUrl: imgUrl,
    })
  },

  /**
   * 查看名片大图
   */
  showCardImages: function() {
    this.setData({
      qrcardimages: false
    })
    var imag = this.data.cardImagUrl
    app.viewImage(imag)
  },
  /**
   * 隐藏名片图片弹窗
   */
  hideqrcardimages: function() {
    this.setData({
      qrcardimages: false
    })
  },
})
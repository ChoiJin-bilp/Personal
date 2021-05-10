const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var defaultPassword = "512019", packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages", footFolderDir = "../../../";
var appUserInfo = app.globalData.userInfo;
var timeMyCardList = null, sOptions = null;
Page({

  /**
   * 页面的初始数据放
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo
    //授权提示
    isShowAuthor: false,
    showSendImg: true,
    redback: [{
        redbar: '随机领取',
        checked: 'true'
      },
      {
        redbar: '平均领取'
      }
    ],
    myArticleList: [{
        mytext: '爱美家推广'
      },
      {
        mytext: '天天上推广'
      },
      {
        mytext: '云客推广'
      }
    ],
    industrySort: ['智能家居', '数码', '时尚', '教育', '传媒', '金融', '艺术', '建筑', '制造', '健康', '互联网', '设计'], //所在行业选项
    recordnum: 0,
    DataURL: DataURL,
    showModalfolder: false, // 收藏里面的文件夹 弹窗
    showmessage: false,
    showcheckmsg: false,
    cardDataInfo: {},                        //当前页面名片信息

    collectionStat: true,                    //是否已收藏该名片
    showCollButt: 2,                         //0：分享进入。 1：名片 夹进入 //2：查看名片回复进入 // 3名片群进入
    showModallogin: false, //是否显示密码弹窗
    Password: "", //登录密码
    urlImage: "", //url地址用于图片显示
    array: [],                              //我的名片列表数据，用于回名片
    arrayIndex: 0,                          //当前所选我的名片列表索引index
    showOtherItems: false,
    id: 0, //发送里面文章index
    heig: 0, //聊天窗高度
    arraynum: 0,
    arraynum1: 4,
    queryStatus: -1,
    showModaltips: false,
    shareBtnStatus: false, //触发分享按钮
    showModalcard: false,
    replyStatus: false,                      //true 无须回名片，false 可以回ta名片
    myCardStat: true,                        //true 进入分享的是自己的名片,false 不是自己的名片
    showCollectionButton: true, //是否显示收藏按钮
    showMyArticleList: true, //是否显示要发送的文章列表
    showredbackokpop: false, //关闭分享确定弹窗
    showReceiveType: 1, // 1随机，2p平均
    redEnvelStat: false, //是否有红包
    cardRedInfoId: '', //红包id
    redEnvelopes: {}, //红包
    showRedEnvelPop: false,                  //是否显示红包弹窗
    successfulRedEnvel: false,               //是否成功领取红包
    receivingRecords: false, //红包领取记录
    received: false, //已经领过红包后的页面
    sharedisabled: false, //分享按钮禁用
    showRechargeTips: false, //充值提示
    priceLimitationTips: false, //充值提示
    redInfoCode: 0,                          //红包状态：0可以领取，1已领完，2已领取，3已过期
    contactUserId: null,
    checked: null,
    selectedArticles: null, //选中的文章id，
    returnChecked: false,
    userId: "",
    othersUserId: "",
    shareBatch: "",
    message: "", //留言输入内容
    msgList: [], //留言板
    shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
    shareTitle: "",
    redEnvelPrice: '',
    redEnvelNum: '',
    rechargeMoney: 0, //需要充值的红包金额

    isShowCardTopPart:false,

    isQRScene:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // console.log("Load时间：")
    // console.log((new Date()))
    console.log("参数信息-------------")
    console.log(options)
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    var that = this,isScene = false,dOptions = null;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
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
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        var paramStatus = 0, showCollButt = 0, contactUserId, options = sOptions, isQRScene=that.data.isQRScene;
        try {
          paramStatus = parseInt(options.status);
          paramStatus = isNaN(paramStatus) ? 0 : paramStatus;
        } catch (e) { }
        try {
          showCollButt = parseInt(options.showCollButt)
          showCollButt = isNaN(showCollButt) ? 0 : showCollButt;
        } catch (e) { }
        try {
          contactUserId = parseInt(options.contactUserId)
          contactUserId = isNaN(contactUserId) ? 0 : contactUserId;
        } catch (e) { }

        switch (paramStatus) {
          //名片+文章分享页面进入
          case 0:
            that.setData({
              cardDataInfo: app.data.cardDetaData,
              contactUserId: contactUserId > 0 ? contactUserId : app.data.cardDetaData.id,
              queryStatus: options.status,
              othersUserId: options.othersUserId,
              cardRedInfoId: options.cardRedInfoId,
              shareBatch: options.batch,
              shareContactId: options.contactId,
              showCollButt: showCollButt,
              sysLogoUrl: app.data.sysLogoUrl,
            })
            that.requestQueryCardDetail();
            break;

          //分享自己名片
          case 1:
            app.data.cardGroupOnshowStat = true;
            that.setData({
              contactUserId: options.contactUserId,
              returnChecked: options.checked,
              othersUserId: options.userId,
              paramShareUId: options.userId,
              queryStatus: options.status,
              cardRedInfoId: options.cardRedInfoId,
              shareBatch: options.batch,
              shareContactId: options.contactId,
              redEnvelStat: options.redEnvelStat,
              showCollButt: showCollButt,
              sysLogoUrl: app.data.sysLogoUrl,
            })
            that.requestQueryCardDetail();
            break;

          //分享好友名片
          case 2:
            that.setData({
              contactUserId: options.contactUserId,
              othersUserId: options.userId,
              paramShareUId: options.userId,
              queryStatus: options.status,
              cardRedInfoId: options.cardRedInfoId,
              shareBatch: options.batch,
              shareContactId: options.contactId,
              redEnvelStat: options.redEnvelStat,
              showCollButt: showCollButt,
              sysLogoUrl: app.data.sysLogoUrl,
            })
            that.requestQueryCardDetail();
            break;

          //消息通知进入
          case 3:
            if(isQRScene){
              that.setData({
                contactUserId: options.cid,
                othersUserId: options.uid,
                paramShareUId: options.uid,
                sysLogoUrl: app.data.sysLogoUrl,
              })
            }else{
              that.setData({
                contactUserId: options.cardId,
                queryStatus: options.status,
                showCollButt: 0,
                sysLogoUrl: app.data.sysLogoUrl,
              })
            }
            that.requestQueryCardDetail();
            break;

          //首页分享进入
          case 10:
            that.setData({
              contactUserId: options.cid,
              othersUserId: options.uid,
              paramShareUId: options.uid,
              showCollButt: 0,
              sysLogoUrl: app.data.sysLogoUrl,
            })
            that.requestQueryCardDetail();
            break;

          //收藏进入or名片群进入
          default:
            var showCollectionButton = true, cardDataInfo = app.data.cardDetaData;
            if (!Utils.isNull(options.showCollectionButton)) {
              showCollectionButton = false
            }
            if (!Utils.isNull(options.cardGroupOnshowStat)) {
              app.data.cardGroupOnshowStat = true;
              console.log(" app.data.cardGroupOnshowStat =", app.data.cardGroupOnshowStat)
            }
            cardDataInfo = that.createCardPhotoArray(cardDataInfo);
            that.setData({
              cardDataInfo: cardDataInfo,
              showCollButt: options.showCollButt,
              showCollectionButton: showCollectionButton,
              myCardStat: false,
              sysLogoUrl: app.data.sysLogoUrl,
            }, that.lazyLoadImg)
            console.log('名片数据:', cardDataInfo)
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
  //方法：IntersectionObserver 对象懒加载名片相册图片
  lazyLoadImg: function () {
    var that = this, imgDataList = that.data.cardDataInfo.cPhotoArray;
    for (let i = 0; i < imgDataList.length; i++) {
      const viewPort = wx.createIntersectionObserver().relativeToViewport();
      viewPort.observe(`.img_cardPhoto` + i, (res) => {
        //console.log("图片进入视图区域", res);
        let index = res.dataset.index;
        let keyStr = "cardDataInfo.cPhotoArray[" + i + "].isShow";
        console.log(keyStr)
        that.setData({
          [keyStr]: true
        })
        viewPort.disconnect();
      })
    }
  },
  //方法：设置名片的相册数组
  createCardPhotoArray: function (cardDataInfo){
    var that = this, cPhotoArray = [];
    if (cardDataInfo.userFile != null && cardDataInfo.userFile != undefined && cardDataInfo.userFile.length){
      for (var i = 0; i < cardDataInfo.userFile.length;i++){
        cPhotoArray.push({ src: cardDataInfo.userFile[i], isShow:false})
      }
    }
    cardDataInfo.cPhotoArray = cPhotoArray;
    return cardDataInfo;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    try {
      if (timeMyCardList != null && timeMyCardList != undefined) clearTimeout(timeMyCardList);
    } catch (err) { }
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
  onUnload: function() {
    console.log('卸载页面')
  },
  //事件：名片背景图加载完毕
  finishLoadCardBKImg: function (e) {
    var that=this;
    that.setData({
      isShowCardTopPart: true
    })
  },
  collection: function() {
    var that = this;
    if (!Utils.isNull(that.data.cardDataInfo.isCardFriend)) {
      that.requestCollection();
      return
    }
    if (that.data.collectionStat) {
      return;
    } else {
      that.requestCollection();
    }
  },
  //返回主页
  JumpPage: function() {
    var that = this;
    wx.reLaunch({
      url: footFolderDir + app.data.sysMainPage
    })
  },
  //回名片
  returnCard: function() {
    var that = this;
    console.log("that.data.returnCard:", that.data.replyStatus)
    if (that.data.replyStatus) {} else {
      if (that.data.arraynum > 1) {
        that.setData({
          showModaltips: true
        })
      } else {
        that.requestSendingCard();
      }

    }
  },
  //回名片的确定按钮，关闭我的名片选择。触发分享按钮
  confirm: function() {
    var that = this;
    that.setData({
      // showModaltips:false,
      shareBtnStatus: true
    })
    console.log(that.data.shareBtnStatus)
  },
  //分享事件
  onShareAppMessage: function(res) {
    let that = this;
    that.setData({
      showModaltips: false
    })
    var contactUserId = that.data.cardDataInfo.id;
    var articlesId = "";
    var path = "";
    var redEnvelStat = false;
    var cardRedInfoId = "";
    var timestamp = Date.parse(new Date());
    if (that.data.redEnvelPrice > 0) {

      cardRedInfoId = app.globalData.userInfo.userId + contactUserId + timestamp;
      that.requestRedEnvel(cardRedInfoId);
      redEnvelStat = true;
    }
    timestamp = timestamp / 1000;
    if (!that.data.showSendImg && !Utils.isNull(that.data.selectedArticles)) { //分享带文章
      path = '/packageCommercial/pages/articleinfo/articleinfo?scene=1&contactUserId=' + contactUserId + '&userId=' + app.globalData.userInfo.userId + "&articlesId=" + that.data.selectedArticles.id + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.cardDataInfo.contactId
    } else {
      path = '/packageCommercial/pages/carddetails/carddetails?status=2&contactUserId=' + contactUserId + '&userId=' + app.globalData.userInfo.userId + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.cardDataInfo.contactId
    }
    var shareWXImg = that.data.shareWXImg;
    var shareTitle = that.data.shareTitle;
    if (Utils.isNull(shareTitle)) {
      shareTitle = that.data.cardDataInfo.contact + "的名片";
    }
    console.log("分享路径：", path)
    that.requestCardRecord(timestamp); //记录发送名片
    return {
      title: shareTitle,
      path: path,
      imageUrl: shareWXImg,
      success: (res) => { // 失效
        console.log("分享成功")
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //跳转创建名片
  newcard: function() {
    wx.navigateTo({
      url: packComPageUrl + "/newcard/newcard"
    });
  },
  //方法：回名片
  requestSendingCard: function() {
    var that = this;
    console.log(that.data.array)
    console.log(that.data.array.length)
    if (that.data.array.length == 0) {
      wx.showToast({
        title: '您没有创建名片，请到我的名片里创建名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (that.data.replyStatus) {
      wx.showToast({
        title: '您已经回过名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserContact&userId=" + that.data.othersUserId + "&contactUserId=" + that.data.array[that.data.arrayIndex].id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + "&pageSize=" + 10 + "&pageIndex=1" + "&status=0&userType=3";
    console.log(urlParam)
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            showModaltips: false,
            replyStatus: true
          })
          wx.showToast({
            title: '发送成功！',
            icon: 'none',
            duration: 1500
          })
          var str = "" + that.data.cardDataInfo.id;
          //缓存已回复名片ID
          wx.setStorageSync(str, "" + that.data.cardDataInfo.id)
          console.log("已缓存")
          console.log(wx.getStorageSync(str))
        } else {
          app.setErrorMsg2(that, "回名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        app.setErrorMsg2(that, "回名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //保存名片
  requestCollection: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserContact&userId=" + app.globalData.userInfo.userId + "&contactUserId=" + that.data.cardDataInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&contactId=" + that.data.shareContactId + "&batch=" + that.data.shareBatch + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log('保存名片:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('保存名片:', res)
        if (res.data.rspCode == 0) {
          var str = 'cardDataInfo.isCardFriend';
          that.setData({
            collectionStat: true,
            [str]: true
          })
        } else {
          app.setErrorMsg2(that, "保存名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }

      },
      fail: function(err) {
        app.setErrorMsg2(that, "保存名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //加入收藏文件夹
  submitCollection: function(e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var index = e.currentTarget.dataset.index;
    var urlParam = "cls=main_contact&action=moveContact" + "&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&ids=" + that.data.cardDataInfo.contactId + "&targetContactFolderId=" + that.data.folderList[index].id + "&sign=" + sign;
    console.log("---------")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            showModalfolder: false
          })
          wx.showToast({
            title: '移入成功',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '该名片已在此群',
            icon: 'none',
            duration: 1500
          })
        }

      },
      fail: function(err) {
        app.setErrorMsg2(that, "移入名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询单个名片信息
  requestQueryCardDetail: function() {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.setData({
      userId: app.globalData.userInfo.userId
    })
    var urlParam = "cls=main_user&action=contactDetail&userId=" + app.globalData.userInfo.userId + "&contactUserId=" + that.data.contactUserId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + that.data.shareBatch + "&lookType=1&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1" + "&cardRedInfoId=" + that.data.cardRedInfoId;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("查询单个名片信息", res)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          var contactData = res.data.data.contact, cardDataInfo=null;
          //1、判断是否为自己的名片
          if (that.data.othersUserId != app.globalData.userInfo.userId && contactData.userId != app.globalData.userInfo.userId) {
            that.setData({
              myCardStat: false
            })
          }
          //2、判断是否已保存得出是否已收藏该名片状态
          var status = res.data.data.status;
          var collectionStat = false;
          if (status == 1) { //未保存
            collectionStat = false;
            console.log("名片未保存")
          } else { //已保存
            collectionStat = true;
            console.log("名片已保存")
          }
          var userInfo = res.data.data.userInfo;
          //3、获取名片相册数据
          var imgFile = [];
          if (!Utils.isNull(userInfo.userFile)) {
            imgFile = userInfo.userFile.split(",");
            userInfo.userFile = imgFile;
          } else {
            userInfo.userFile = [];
          }
          //4、获取公司相册数据
          var imgComFile = [];
          if (!Utils.isNull(userInfo.companyFile)) {
            imgComFile = userInfo.companyFile.split(",");
            userInfo.companyFile = imgComFile;
          } else {
            userInfo.companyFile = [];
          }
          //5、获取名片行业数据
          var personalTrade = userInfo.personalTrade;
          if (!Utils.isNull(personalTrade)) {
            if (personalTrade.substr(personalTrade.length - 1, 1) == "|") {
              personalTrade = personalTrade.substring(0, personalTrade.length - 1);
            }
            userInfo.personalTrade = personalTrade.split('|');
          }
          //6、给全局名片信息对象赋值
          app.data.cardDetaData = userInfo;

          //7、判断是否已回复该名片
          var str = "" + userInfo.id;
          var value = wx.getStorageSync(str)
          if (value == userInfo.id) {
            that.setData({
              returnChecked: false,
              checked: false,
              replyStatus: true
            })
          }
          if (that.data.returnChecked == "true") {
            that.setData({
              checked: true
            })
          } else if (that.data.returnChecked == "false") {
            that.setData({
              checked: false
            })
          }
          //如果没有回复或保存该名片则提示回复名片
          if (that.data.checked == true && collectionStat == false) {
            wx.showModal({
              title: '提示',
              content: '对方希望您回ta个名片',
              showCancel: false,
              confirmText: "好的",
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          //8、获取红包信息
          var length = 0;
          var successfulRedEnvel = false; //红包已领取和其他状态
          var showRedEnvelPop = false; //红包弹窗
          var cardRedInfo = [];
          cardRedInfo = res.data.data.cardRedInfo;
          console.log('进入场景：', that.data.scene)
          //9、判断是否显示红包弹窗
          if (that.data.queryStatus == 1 || that.data.queryStatus == 2) { //分享进入
            showRedEnvelPop = true;
          }
          if (cardRedInfo.code == 0) { //有可领取红包
          } else if (cardRedInfo.code == 1) { //来晚了,红包被领完
          } else if (cardRedInfo.code == 2) { //您已经领取过此红包，不可再次领取!
            successfulRedEnvel = true;
          } else if (cardRedInfo.code == 3) { //此红包已过期，不可领取
          } else {
            showRedEnvelPop = false;
            console.log('没有红包，code：', cardRedInfo.code)
          }
          //红包领取记录长度
          if (!Utils.isNull(cardRedInfo.data)) {
            length = cardRedInfo.data.length;
          }

          cardDataInfo = that.createCardPhotoArray(userInfo);
          that.setData({
            cardDataInfo: cardDataInfo,
            collectionStat: collectionStat,
            redInfoCode: cardRedInfo.code,
            successfulRedEnvel: successfulRedEnvel,
            showRedEnvelPop: showRedEnvelPop,
            cardRedInfo: cardRedInfo,
            recordnum: length
          }, that.lazyLoadImg)
          // console.log("获取名片信息结束时间：")
          // console.log((new Date()))
          timeMyCardList = setTimeout(that.getPersonalCard,1000);
        } else if (res.data.rspCode == -2) {
          wx.showModal({
            title: '提示',
            content: '对方名片已删除',
            confirmText: "索要",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.requestAskCard();
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.JumpPage();
              }
            }
          })
          return;
        } else {
          app.setErrorMsg2(that, "查询单个名片信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        wx.hideLoading();
        app.setErrorMsg2(that, "查询单个名片信息失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //索要名片
  requestAskCard: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=saveAskForContact&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&status=1" + "&contactUserId=" + that.data.contactUserId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log('索要名片', res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: '索要成功',
            duration: 1500
          })
          setTimeout(function() {
            console.log('索要名片超时')
            that.JumpPage();
          }, 1450)
        } else {
          app.setErrorMsg2(that, "索要失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          console.log('索要接口返回不成功！')
          that.JumpPage();
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        console.log('索要名片接口调用失败！')
        console(err)
        that.JumpPage();
        app.setErrorMsg2(that, "索要失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询留言板
  requestQueryCardMsg: function() {
    var that = this;
    that.setData({
      userId: app.globalData.userInfo.userId
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_message&action=messageList&sendUserId=" + app.globalData.userInfo.userId + "&receiveUserId=" + that.data.cardDataInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&operation=1&status=1" + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var msgList = res.data.data.dataList;
          var useList = res.data.data.userList;
          for (var i = 0; i < msgList.length; i++) {
            if (msgList[i].sendUserId != app.globalData.userInfo.userId) {
              if (msgList[i].contact == '' || msgList[i].contact == 'null' || msgList[i].contact == null || msgList[i].contact == undefined) {
                msgList[i].contact = '**';
              }
            }
          }
          var hisHead = "";
          var myHead = "";
          if (useList[0].id == app.globalData.userInfo.userId) {
            myHead = useList[0].headerImg;
            if (myHead == "") {
              myHead = "../../../images/mine.png";
            }
            hisHead = useList[1].headerImg;
            if (hisHead == "") {
              hisHead = "../../../images/mine.png";
            }
          } else {
            myHead = useList[1].headerImg;
            if (myHead == "") {
              myHead = "../../../images/mine.png";
            }
            hisHead = useList[0].headerImg;
            if (hisHead == "") {
              hisHead = "../../../images/mine.png";
            }
          }
          var cardDataInfo = that.data.cardDataInfo;
          cardDataInfo.messageStatus = 0;
          cardDataInfo = that.createCardPhotoArray(cardDataInfo);
          that.setData({
            cardDataInfo: cardDataInfo,
            msgList: msgList,
            showcheckmsg: true,
            heig: msgList.length * 100,
            myHead: myHead,
            hisHead: hisHead
          })

        } else {
          app.setErrorMsg2(that, "名片详情页面查找留言板失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          console.log("留言查找错误")
        }
      },
      fail: function(err) {
        app.setErrorMsg2(that, "名片详情页面查找留言板失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //删除事件
  hideModalDele: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.deleUserCardData();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除接口
  deleUserCardData: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=delContact&userId=" + app.globalData.userInfo.userId + "&id=" + that.data.cardDataInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&companyId=" + app.globalData.userInfo.companyId;
    console.log(urlParam)
    console.log('删除名片url :', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.setErrorMsg2(that, "删除名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function(err) {
        app.setErrorMsg2(that, "删除名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////
  //--------登录密码----------------------------------------------------------
  //事件：页面控件值变更事件
  changeValueMainData: function(e) {
    var that = this;
    console.log("changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    switch (cid) {
      case "password":
        that.setData({
          Password: value
        })
        break;
    }
  },
  hideModaltip: function() {
    this.setData({
      showModaltips: false
    })
  },
  choseTxtColor: function(e) {
    var id = e.currentTarget.dataset.id; //获取自定义的ID值
    this.setData({
      arrayIndex: id
    })
  },
  //方法：查询我的名片列表信息
  getPersonalCard: function() {
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
        wx.hideLoading();
        console.log("查询自己名片数据", res.data)

        if (res.data.rspCode == 0) {
          var cardTemplateList = res.data.data.cardTemplateList;
          var mydataList = res.data.data.mydataList;
          for (var i = 0; i < cardTemplateList.length; i++) {
            if (that.data.cardDataInfo.cardTemplateId == cardTemplateList[i].id) {
              var cardDataInfoStr = "cardDataInfo.cardTemp"
              that.setData({
                [cardDataInfoStr]: cardTemplateList[i]
              })
            }
          }
          for (var y = 0; y < mydataList.length; y++) {
            for (var i = 0; i < cardTemplateList.length; i++) {
              if (mydataList[y].cardTemplateId == cardTemplateList[i].id) {
                mydataList[y].cardTemp = cardTemplateList[i];
              }
            }
          }
          //我的名片列表信息
          app.data.userCardDetaData = mydataList;

          that.setData({
            array: mydataList,
            arraynum: mydataList.length,
          })
        } else {
          app.setErrorMsg2(that, "名片详情页面·查询自己名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        wx.hideLoading();
        app.setErrorMsg2(that, "名片详情页面·查询自己名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  companyDetails: function() {
    app.data.userCardDetaData = this.data.cardDataInfo
    wx.navigateTo({
      url: packComPageUrl + "/perfectCo/perfectCo?vtype=4"
    });
  },
  //电话拨打
  phonecallevent: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.cardDataInfo.mobile
    })
  },
  //电话复制
  phoneCopy: function() {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.cardDataInfo.mobile,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //电话保存
  addPhone: function() {
    var cardDataInfo = this.data.cardDataInfo;
    wx.addPhoneContact({
      firstName: cardDataInfo.contact,
      mobilePhoneNumber: cardDataInfo.mobile,
      weChatNumber: cardDataInfo.wxnumber,
      addressPostalCode: cardDataInfo.showEmail,
      organization: cardDataInfo.company,
      title: cardDataInfo.job,
      workPhoneNumber: cardDataInfo.tel,
      success: function(res_addphone) {
        console.log("电话添加联系人返回：", res_addphone)
      }
    })
  },
  //图片上传
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.showLoading({
      title: '正在上传图片中...',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    //上传分享图片 都加此参数（添加红包水印）。
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
    urlParam += "&hb=1";
    console.log("上传图片")
    console.log(URL + urlParam)
    wx.uploadFile({
      url: URL + urlParam,
      filePath: filePaths[i],
      name: 'file',
      formData: {

      },
      success: (res) => {
        console.log(res)
        successUp++;
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) {}
        if (!Utils.isNull(data) && !Utils.isNull(data.rspCode) && data.rspCode == 0) {
          var imgUrl = data.data.fileName;
          if (that.data.paymentStatus) {
            imgUrl = data.data.fileName_h;
          }
          that.setData({
            shareWXImg: imgUrl,
            shareWXImg_h: data.data.fileName_h,
            shareWXImg_old: data.data.fileName
          })
          console.log("显示图：", that.data.shareWXImg)
          console.log("水印：", data.data.fileName_h)
          console.log("无水印：", data.data.fileName)
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
          wx.hideLoading();
        } else { //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  uploadImage: function(e) {
    var type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      },
    });
  },

  //事件：图片查看事件
  viewImg: function(e) {
    let that = this;
    app.viewImg(e);
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

          var temIndustrySort = that.data.cardDataInfo.personalTrade; //我已所在行业
          var myindustrySort = [];
          var industry2 = [];
          for (let i = 0; i < industrySort.length; i++) { //行业所有类型
            if (!Utils.isNull(temIndustrySort)) {
              myindustrySort = temIndustrySort.split("|");
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
        app.setErrorMsg2(that, "获取注册行业角色类型：失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "网络异常！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //事件：显示发送名片弹窗
  showSendCardPop: function() {
    this.setData({
      disabled: true,
      isShowSendCardPop: true
    })
    this.queryArticleList();
  },
  cancelWXSend: function() {
    var that = this;
    that.setData({
      isShowSendCardPop: false,
      disabled: false,
    })
  },
  changeWXSSAlert: function(e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    if (Utils.checkStr(value)) {
      wx.showToast({
        title: "非法字符不能输入！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.setData({
      shareTitle: value,
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
        app.setErrorMsg2(that, "查询要发送的文章列表失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //提交留言内容
  confirmmessage: function() {
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
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&receiveUserId=" + that.data.cardDataInfo.id + "&message=" + encodeURIComponent(that.data.message) + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("留言成功!!", res)
          that.setData({
            message: "",
            showmessage: false,
            heig: (that.data.msgList.length + 1) * 100,
            msgList: that.data.msgList.concat(res.data.data)
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
        app.setErrorMsg2(that, "留言失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  removeMessage: function(e) {
    var that = this;
    if (that.data.msgList.length == 0) {
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要清空留言记录吗？',
      success(res) {
        if (res.confirm) {
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          var urlParam = "cls=main_message&action=clearMessage&receiveUserId=" + that.data.cardDataInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
          var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
          urlParam = urlParam + "&operation=1&sendUserId=" + app.globalData.userInfo.userId + "&sign=" + sign;
          console.log(URL + urlParam)
          wx.request({
            url: URL + urlParam,
            success: function(res) {
              console.log(res.data)
              if (res.data.rspCode == 2) {
                console.log("清空成功！", res)
                that.setData({
                  msgList: []
                })
              } else {
                that.setData({
                  showcheckmsg: false,
                })
                app.setErrorMsg2(that, "名片详情页面·清空失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
                wx.showToast({
                  title: res.data.rspMsg,
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: function(err) {
              that.setData({
                showcheckmsg: false,
              })
              app.setErrorMsg2(that, "名片详情页面·清空失败：fail！错误信息：" + err, URL + urlParam, false);
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
  //获取收藏列表
  getFolders: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=contactFolderList&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=1" + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign + "&pageSize=10000&pageIndex=1";
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            showModalfolder: true,
            folderList: res.data.data.dataList
          })
        } else {
          app.setErrorMsg2(that, "获取名片详情收藏文件夹失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        app.setErrorMsg2(that, "获取名片详情收藏文件夹失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //领取红包
  requestReceiveRedEnvel: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=acquireRedEnvelope_cardRedEnvelope&action=getCardRedEnvelope" + "&cardRedInfoId=" + that.data.cardRedInfoId + "&receivingUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        console.log("领取红包", res.data)
        if (res.data.rspCode == 0) {
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: true,
          })
        } else if (res.data.rspCode == 1) {
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: false,
            redInfoCode: 1 //红包已被领完了
          })
        } else if (res.data.rspCode == 2) { //已经领过红包
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: true,
          })
          wx.showToast({
            title: res.data.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        } else if (res.data.rspCode == 3) { //红包过期
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: false,
            redInfoCode: 3 //红包过期
          })
        } else {
          app.setErrorMsg2(that, "领取红包！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(err) {
        app.setErrorMsg2(that, "领取红包失败：fail！错误信息：" + err, URL + urlParam, false);
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

    that.setData({
      message: value,
    })
    console.log(that.data.message)
  },

  hidecheckmsg: function() {
    this.setData({
      showcheckmsg: false,
    })
  },
  hideModalfolder: function() {
    this.setData({
      showModalfolder: false,
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
  //事件：切换扩展选项显示/隐藏
  onChangeShowItemDetailState: function(e) {
    var that = this;
    that.setData({
      showOtherItems: !that.data.showOtherItems
    })
  },
  radioChange: function() {
    this.setData({
      showSendImg: !this.data.showSendImg
    })
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
        if (this.data.shareWXImg.indexOf("/images/cardShare01.jpg?") != -1 || (!this.data.showSendImg && this.data.showMyArticleList && !Utils.isNull(this.data.selectedArticles) && this.data.shareWXImg.indexOf(this.data.selectedArticles.file) != -1)) {
          this.setData({
            shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
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
          sharedisabled: true
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
  closeReceiveRedEnvel: function() {
    this.setData({
      showRedEnvelPop: false,
      receivingRecords: false
    })
    if (Utils.isNull(app.globalData.userTotalInfo.mobile)) {
      wx.showModal({
        content: '现金红包需要注册后才可提现。',
        confirmText: '注册',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: mainPackageDir + "/login/login"
            });
          } else if (res.cancel) {}
        }
      })
    }
  },
  showReceivingRecords: function() {
    this.setData({
      receivingRecords: true
    })
  },
  clickReceivingRecords: function() {
    this.setData({
      receivingRecords: !this.data.receivingRecords
    })
  },
  //---------------------------------------------
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
          console.log("用户可以使用金额：", surplusMoney)
          if (surplusMoney < that.data.redEnvelPrice) { //余额不够发红包
            var rechargeMoney = Utils.accSub(that.data.redEnvelPrice, surplusMoney);
            that.setData({
              showRechargeTips: true,
              rechargeMoney: rechargeMoney,
            })
          } else { //余额发红包
            var shareWXImg = that.data.shareWXImg;
            if (that.data.showSendImg) { //图片
              if (Utils.isNull(that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1) { //默认图片
                that.setData({
                  shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
                })
              } else { //不是默认图
                //带红包水印图
                that.setData({
                  shareWXImg: that.data.shareWXImg_h
                })
              }
            } else { //文章
              if (Utils.isNull(that.data.shareTitle) || (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles) && that.data.selectedArticles.name == that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles.file) && shareWXImg.indexOf(that.data.selectedArticles.file) != -1) { //文章图片
                console.log("水印")
                //带文章 红包水印图
                var shareWXImg = shareWXImg.substring(0, shareWXImg.lastIndexOf('/') + 1) + 'h_' + shareWXImg.substring(shareWXImg.lastIndexOf('/') + 1, shareWXImg.length);
                that.setData({
                  shareWXImg: shareWXImg
                })
              } else if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1 || Utils.isNull(shareWXImg)) { //默认图
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
              if (Utils.isNull(that.data.selectedArticles)) {
                sharedisabled = true;
              }
            }
            console.log('图片：：：', that.data.shareWXImg)
            that.setData({
              sharedisabled: false,
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
        app.setErrorMsg2(that, "查询可发红包金额失败：fail！错误信息：" + err, URL + urlParam, false);
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
        if (!Utils.isNull(that.data.selectedArticles) && !Utils.isNull(that.data.selectedArticles.file)) { //如果有文章
          that.setData({
            shareWXImg: DataURL + that.data.selectedArticles.file + "?" + (Math.random() / 9999)
          })
        } else if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
          that.setData({
            shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999)
          })
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
    var urlParam = "cls=acquireRedEnvelope_cardRedEnvelope&action=setCardRedEnvelope" + "&cardId=" + app.data.cardDetaData.id + "&senderUserId=" + app.globalData.userInfo.userId + "&amtType=" + amtType + "&totalMoney=" + that.data.redEnvelPrice + "&totalNumber=" + that.data.redEnvelNum + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
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
        app.setErrorMsg2(that, "发送红包失败：fail！错误信息：" + err, URL + urlParam, false);
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
  requestCardRecord: function(timestamp) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=sendUserContact" + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + timestamp + "&contactUserId=" + that.data.cardDataInfo.id + "&sign=" + sign;
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
        app.setErrorMsg2(that, "发送名片记录失败：fail！错误信息：" + err, URL + urlParam, false);
      },
      complete: function(err) {
        that.setData({
          isShowSendCardPop: false,
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
  //////////////////////////////////////////////////////////////////////////
  //--------获取会员服务权限数据--------------------------------------------
  //方法：获取会员服务权限数据信息
  //参数说明：
  //mainObj：当前页面
  //userId：当前用户ID
  //moduleId：模块ID——
  //          1: 剩余报价单个数,
  //          2: 剩余询价单个数,
  //          3: 剩余名片创建张数,
  //          4: 剩余产品创建个数,
  //          5: 剩余公司资料创建个数,
  //          6: 剩余发布供应信息个数,
  //          7: 剩余发布采购信息个数,
  //          8: 可查看的买家级别
  getMemberSrvRightData: function(userId, moduleId, tag) {
    var that = this;
    app.getMemberSrvRightData(that, userId, moduleId, tag);
  },
  //方法：检查会员权限后的操作
  exeSrvRightOperation: function(tag) {
    var that = this,
      isPassSrvRight = that.data.isPassSrvRight;
    switch (tag) {
      //报价（供应）信息
      case 1:
        if (!isPassSrvRight) {
          wx.showToast({
            title: "名片创建数量已达上限，不能再创建！",
            icon: 'none',
            duration: 2500
          })
          return;
        }
        wx.navigateTo({
          url: packComPageUrl + "/newcard/newcard?mode=1"
        });
        break;
    }
  },
  createNameCard: function(e) {
    //是否启用会员服务权限检查
    if (app.data.isSrvRightCheck) {
      this.getMemberSrvRightData(app.globalData.userInfo.userId, 3, 1)
    } else {
      wx.navigateTo({
        url: packComPageUrl + "/newcard/newcard?mode=1"
      });
    }
  },
  //事件：生成宣传图片
  createQRADImage: function() {
    var that = this
    this.setData({
      qrcardimages: true
    })
    var page = "packageCommercial/pages/carddetails/carddetails";
    var pagedata = "status=10|cid=" + app.data.cardDetaData.id + "|suid=" + app.globalData.userInfo.userId;
    var title = that.data.cardDataInfo.contact+"的名片";
    app.createADModalQRImg(that, page, pagedata, title, "", "","")
  },
  //方法：宣传图片生成处理方法
  setCADImgInfo: function(imgUrl) {
    var that = this;
    console.log(imgUrl)
    that.setData({
      cardImgUrl: imgUrl,
    })
  },
  /**
   * 查看图片
   */
  viewImage: function(imgSrc) {
    this.setData({
      qrcardimages: false
    })
    app.viewImage(this.data.cardImgUrl)
  },
  hideqrcardimages: function() {
    this.setData({
      qrcardimages: false
    })
  },
})
// pages/perfect/perfect.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var PYTool = require('../../../utils/pinyin.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages", footFolderDir = "../../../";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo
    //授权提示
    isShowAuthor: false,
    companyInfo: [],
    index: 0,
    DataURL: DataURL,      //远程资源路径
    shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
    companyData: {
      id: '',
      label: '',
      company: '',
      addr: '',
      companyWebSite: '',
      intro: '',
      legal: '',
      mobile: '',
      email: '',
      logo: '',
      companyFile: "",
      companyFileList: [],
      showCompanyInfo: true,
    },
    disabled: true,
    userInfo: null,
    infoDisabled: true,
    updateStatus: false,
    updateFileStatus: false,
    bindingState: false,//是否创建公司资料的时候就绑定名片
    userRelVersion: 1, //1: 个人版，2：加入企业版的个人，3:企业版

    maxOtherImgCnt: 6,           //公司相册图片最大数量
  },
  //方法：公司相册列表赋值操作
  setCompanyPotoFileList: function (companyData, companyDataValue) {
    if (companyDataValue != null && companyDataValue != undefined) {
      companyData = companyDataValue;
      if (companyDataValue.companyFile != null && companyDataValue.companyFile != undefined) {
        if (Utils.isArray(companyDataValue.companyFile))
          companyData.companyFileList = companyDataValue.companyFile;
        else if (Utils.myTrim(companyDataValue.companyFile) != "" && Utils.myTrim(companyDataValue.companyFile) != "null")
          companyData.companyFileList = companyDataValue.companyFile.split(',');
        else
          companyData.companyFileList = [];
      } else
        companyData.companyFileList = [];
    }

    return companyData;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载参数:")
    console.log(options)
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, vtype=0;
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
    try {
      if (sOptions.vtype != null && sOptions.vtype != undefined && Utils.myTrim(sOptions.vtype + "") != "") {
        vtype = parseInt(sOptions.vtype);
        vtype = isNaN(vtype) ? 0 : vtype;
      }
    } catch (e) { }
    that.data.vtype = vtype;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo==undefined) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(sOptions);
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    let that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        let options = sOptions, companyData = that.data.companyData, userRelVersion = 0, vtype = that.data.vtype, sysLogoUrl = app.data.sysLogoUrl;
        
        try {
          if (app.globalData.companyUserMap.length > 0) { //加入企业版的个人
            userRelVersion = 2;
          } else if (app.globalData.userTotalInfo.companyType == 2) { //企业版
            userRelVersion = 3;
          } else if (app.globalData.userTotalInfo.companyType == 1) { //个人版
            userRelVersion = 1;
          }
        } catch (err) {}

        switch(vtype){
          //新增公司资料
          case 1:
            that.setData({
              disabled: false,

              userRelVersion: userRelVersion,
              vtype: vtype,
              sysLogoUrl: sysLogoUrl,
            })
            break;

          //公司管理-编辑页面
          case 2:
          //已收记录页面
          case 6:
          //已发记录页面
          case 7:
          //名片下 公司查看管理
          case 8:
            companyData = that.setCompanyPotoFileList(companyData, app.data.userCardDetaData);
            that.setData({
              companyData: companyData,

              userRelVersion: userRelVersion,
              vtype: vtype,
              sysLogoUrl: sysLogoUrl,
            })
            break;

          //我的名片-查看页面
          case 3:
            if (app.data.userCardDetaData.companyInfo != null && app.data.userCardDetaData.companyInfo != undefined) {
              companyData = that.setCompanyPotoFileList(companyData, app.data.userCardDetaData.companyInfo);

              that.setData({
                companyData: companyData,

                userRelVersion: userRelVersion,
                vtype: vtype,
                sysLogoUrl: sysLogoUrl,
              })
              console.log("公司资料：", app.data.userCardDetaData.companyInfo)
            }else{
              that.setData({
                userRelVersion: userRelVersion,
                vtype: vtype,
                sysLogoUrl: sysLogoUrl,
              })
            }
            that.queryCompanyInfo();
            break;

          //查看对方信息页面
          case 4:
            if (app.data.cardDetaData.companyInfo != null && app.data.cardDetaData.companyInfo != undefined) {
              companyData = that.setCompanyPotoFileList(companyData, app.data.cardDetaData.companyInfo);

              that.setData({
                companyData: companyData,

                userRelVersion: userRelVersion,
                vtype: vtype,
                sysLogoUrl: sysLogoUrl,
              })
              console.log("公司资料：", app.data.cardDetaData.companyInfo)
            }else{
              that.setData({
                userRelVersion: userRelVersion,
                vtype: vtype,
                sysLogoUrl: sysLogoUrl,
              })
            }
            console.log("公司资料：", app.data.cardDetaData)
            that.queryCompanyInfo();
            break;

          //查看公司管理分享的页面
          case 5:
            that.setData({
              stype: 2,
              batch: options.batch,
              receiveId: options.receiveId,
              sharerUserId: options.userId,
              paramShareUId: options.userId,
              shareCompanyId: options.companyId,

              userRelVersion: userRelVersion,
              vtype: vtype,
              sysLogoUrl: sysLogoUrl,
            })
            
            that.queryCompanyInfoDetail(options.companyId);
            that.sendCompanyInfo(that.data.stype, that.data.batch, that.data.receiveId);
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //监听页面卸载
  onUnload: function () {
    var that = this;
    console.log("页面卸载、")
  },
  //查询所有公司资料
  queryCompanyInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var str = '';
    var userTotalInfo = app.globalData.userTotalInfo;
    // if (userTotalInfo.companyType == 1){
    //   str = 'userId';
    // }else{
    //   str = 'companyUserId';
    // }
    var urlParam = "cls=main_companyInfo&action=companyInfoList" + "&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log("公司资料：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("公司资料：", URL + urlParam)
        console.log("所有公司资料", res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (!Utils.isNull(data[i].companyFile)) {
              data[i].companyFileList = data[i].companyFile.split(',');
            }
          }
          that.setData({
            companyInfo: data
          })
        } else {
          app.setErrorMsg2(that, "查询公司管理信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '数据查询失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "保存给我回复的名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //选择公司资料
  choiceCompanyInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    var params = "&opertion=mod&companyId=" + app.globalData.userInfo.companyId + "&id=" + app.data.userCardDetaData.id + "&companyInfoId=" + that.data.companyData.id;
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + params;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("我的名片绑定公司资料", res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: '绑定公司成功',
            icon: 'none',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "我的名片绑定公司资料失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "我的名片绑定公司资料失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //获取输入内容
  changeValueMainData: function (e) {
    var that = this;
    var val = e.detail.value;
    var field = "companyData." + e.currentTarget.dataset.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;

    that.setData({
      updateStatus: true,
      infoDisabled: false,
      [field]: val
    })
  },
  //勾选是否显示公司资料
  returnCard: function (e) {
    var that = this;
    var str = "companyData.showCompanyInfo";
    that.setData({
      updateStatus: true,
      infoDisabled: false,
      disabled: false,
      [str]: !that.data.companyData.showCompanyInfo
    })
  },
  //编辑
  editDataInfo: function () {
    var that = this;
    that.setData({
      disabled: false
    })
  },
  //保存信息
  submitDataInfo: function () {
    var that = this;
    var companyData = that.data.companyData;

    if (that.data.vtype == 1) {
      var companyData = that.data.companyData;
      if (Utils.isNull(companyData.company)) {
        wx.showToast({
          title: '请输入公司名称！',
          icon: 'none',
          duration: 1500
        })
        return;
      }
      that.hideModalcomp();

    } else {
      that.hideModalcomp();
    }

  },
  deleteDataInfo: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          that.requestDeleteDataInfo();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //发送或者接受公司资料
  sendCompanyInfo: function (shareType, batch, receiveId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var userId = "";
    var companyInfoIds = "";
    var shareType = 2;
    if (that.data.vtype != 5) { //发送
      userId = app.globalData.userTotalInfo.id;
      companyInfoIds = that.data.companyData.id;
      shareType = 1;
    } else { //接收
      userId = receiveId; //发送人id
      receiveId = app.globalData.userTotalInfo.id; //当前用户id
      companyInfoIds = that.data.shareCompanyId;
    }
    var urlParam = "cls=main_shareCompanyInfo&action=saveShareCompanyInfo&userId=" + userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + batch + "&receiveId=" + receiveId + "&companyInfoIds=" + companyInfoIds + "&shareType=" + shareType + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("发送或者接受记录：", res)
        if (res.data.rspCode == 0) {
          console.log("发送或者接受成功")
        } else {
          app.setErrorMsg2(that, "发送或者接受记录失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发送或者接受记录失败：fail！错误信息：" + err, URL + urlParam, false);
        console.log("接口失败：" + err)
      }
    })
  },
  //进入分享页面---查询公司资料
  queryCompanyInfoDetail: function (companyId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_companyInfo&action=companyInfoDetail&companyInfoId=" + companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (Utils.isNull(data)) {
            wx.showToast({
              title: '公司资料已被删除',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.reLaunch({
                url: footFolderDir + app.data.sysMainPage
              })
            }, 2000)
            return;
          }
          var companyFile = "";
          var companyFileArr = []
          companyFile = data.companyFile;
          companyFileArr = []
          if (!Utils.isNull(companyFile)) {
            companyFileArr = companyFile.split(',');
            data.companyFileList = companyFileArr;
          }
          that.setData({
            companyData: data,
          })
          console.log('处理后数据：', data)
        } else {
          app.setErrorMsg2(that, "进入分享页面---查询公司资料失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '数据获取失败',
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "进入分享页面---查询公司资料失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },

  //删除公司资料
  requestDeleteDataInfo: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var companyData = that.data.companyData;
    if (that.data.vtype == 6) { //删除已收记录
      var urlParam = "cls=main_shareCompanyInfo&action=saveShareCompanyInfo&userId=" + companyData.receiveId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&opertion=del&shareType=" + companyData.shareType + "&ids=" + companyData.shareCompanyInfoId;
      urlParam = urlParam + "&sign=" + sign + Params;
    } else if (that.data.vtype == 7) { //删除已发记录
      console.log("companyData", companyData)
      var urlParam = "cls=main_shareCompanyInfo&action=saveShareCompanyInfo&userId=" + companyData.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&opertion=del&shareType=" + companyData.shareType + "&ids=" + companyData.shareCompanyInfoId;
      urlParam = urlParam + "&sign=" + sign + Params;
    } else {
      var urlParam = "cls=main_companyInfo&action=saveCompanyInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&companyUserId=" + app.globalData.userTotalInfo.id + "&opertion=del&id=" + companyData.id;
      urlParam = urlParam + "&sign=" + sign + Params;
    }

    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("删除公司资料：", res)
        if (res.data.rspCode == 0) {
          if (that.data.vtype != 5) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.reLaunch({
              url: footFolderDir + app.data.sysMainPage
            })
          }

        } else {
          app.setErrorMsg2(that, "删除企业公司名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "删除企业公司名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //保存创建信息
  hideModalcomp: function () {
    var that = this;
    console.log("保存事件", that.data.updateStatus)
    if (!that.data.updateStatus && that.data.disabled) {
      wx.showToast({
        title: '请先修改资料！',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        updateFileStatus: false,
      })
      return;
    } else {
      var companyData = that.data.companyData;
      var opertion = "";
      companyData.companyFile = companyData.companyFileList.join(',')
      if (that.data.vtype == 1) {
        opertion = "add";
      } else if (that.data.vtype == 2 || that.data.vtype == 3) {
        opertion = "mod&id=" + companyData.id;

      }
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var urlParam = "cls=main_companyInfo&action=saveCompanyInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&companyUserId=" + app.globalData.userTotalInfo.id + "&opertion=" + opertion;
      if (that.data.updateStatus) {
        Params += "&label=" + encodeURIComponent(companyData.label);
        Params += "&company=" + encodeURIComponent(companyData.company);
        Params += "&addr=" + encodeURIComponent(companyData.addr);
        Params += "&companyWebSite=" + encodeURIComponent(companyData.companyWebSite);
        Params += "&legal=" + encodeURIComponent(companyData.legal);
        Params += "&mobile=" + companyData.mobile;
        Params += "&email=" + encodeURIComponent(companyData.email);
        Params += "&intro=" + companyData.intro;
        Params += "&defaultType=" + companyData.defaultType;
      }
      if (that.data.updateFileStatus) {
        Params += "&logo=" + encodeURIComponent(companyData.logo);
        Params += "&companyFile=" + encodeURIComponent(companyData.companyFile);
      }
      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + Params;
      console.log(URL + urlParam)
      wx.request({
        url: URL + urlParam,
        success: function (res) {
          console.log("保存资料：", res)
          if (res.data.rspCode == 0) {
            that.setData({
              updateStatus: false,
              updateFileStatus: false,
              disabled: true,
              infoDisabled: true,
            })
            if (that.data.vtype == 1) {
              var companyInfo = that.data.companyInfo;
              var companyInfoMap = res.data.data.companyInfoMap;
              companyInfo = companyInfo.concat(companyInfoMap);
              if (that.data.bindingState) {
                that.setData({
                  vtype: 3,
                  bindingState: false,
                  companyData: companyInfoMap,
                  companyInfo: companyInfo,
                })
                that.choiceCompanyInfo();
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }

            } else if (that.data.vtype == 2 || that.data.vtype == 3) {
              wx.showToast({
                title: '保存成功',
                icon: 'none',
                duration: 1500
              })
            }

          } else {
            app.setErrorMsg2(that, "保存公司名片信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 1500
            })
            console.log("接口失败1：" + res)
          }
        },
        fail: function (err) {
          app.setErrorMsg2(that, "保存公司名片信息失败：fail！错误信息：" + err, URL + urlParam, false);
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败：" + err)
        }
      })
    }
  },
  //设置默认公司
  setDefaultcompany: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_companyInfo&action=saveCompanyInfo&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&defaultType=2&companyUserId=" + app.globalData.userTotalInfo.id + "&opertion=mod&id=" + that.data.companyData.id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("设置默认公司：", res)
        if (res.data.rspCode == 0) {
          var companyData = that.data.companyData;
          companyData.defaultType = 2
          that.setData({
            companyData: companyData
          })
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "设置默认公司失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '设置失败',
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "设置默认公司失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //删除照片 logo
  showModaltip: function (e) {
    var that = this;
    var logo = "companyData.logo";
    that.setData({
      [logo]: "",
      updateStatus: true,
      updateFileStatus: true,
      infoDisabled: false,
      disabled: false,
    })
  },
  //删除照片 相册
  showModaltip2: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.index;
    var companyFileList = that.data.companyData.companyFileList;
    companyFileList.splice(val, 1);
    var userFileListStr = "companyData.companyFileList";
    that.setData({
      [userFileListStr]: companyFileList,
      updateStatus: true,
      updateFileStatus: true,
      infoDisabled: false,
      disabled: false,
    })
  },
  ////////////////////////////////////////////////////////////////////
  //-------图片处理----------------------------------------------------
  //事件：图片上传事件
  uploadImg: function (e) {
    var that = this, sType = 0, userFile = this.data.companyData.companyFileList, maxOtherImgCnt = that.data.maxOtherImgCnt, rbImgCnt = userFile != null && userFile != undefined && userFile.length > 0 ? userFile.length:0, enableOtherImgCnt = maxOtherImgCnt - rbImgCnt;


    //sType:0 Logo图片，1 公司图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) { }
    }
    //0封面单张图片，1多张相关图片，2多张介绍图片
    switch (sType) {
      //多图上传
      case 1:
        app.uploadImg(that, sType, rbImgCnt, maxOtherImgCnt)
        break;

      //单图片上传
      default:
        app.uploadImg(that, sType, 0, 1)
        break;
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    let that = this;
    switch (sType) {
      case 1:
        let companyFileList = that.data.companyData.companyFileList, userFileStr = "companyData.companyFileList";
        companyFileList.push(imgUrl);
        that.setData({
          [userFileStr]: companyFileList,
          updateStatus: true,
          updateFileStatus: true,
        })
        console.log("存入照片")
        console.log(that.data.companyData.companyFileList)
        break;
      default:
        let comStr = "companyData.logo";
        that.setData({
          [comStr]: imgUrl,
          updateStatus: true,
          updateFileStatus: true,
          infoDisabled: false,
          disabled: false,
        })
        break;
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    var that = this;
    app.viewImg(e);
  },
  //分享事件
  onShareAppMessage: function (res) {
    let that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.sendCompanyInfo(1, timestamp, '');
    return {
      title: "您收到一份公司资料，请赶紧点开看看吧！",
      path: '/packageCommercial/pages/perfectCo/perfectCo?sType=20&vtype=5&receiveId=' + app.globalData.userTotalInfo.id + "&batch=" + timestamp + "&companyId=" + that.data.companyData.id + "&userId=" + app.globalData.userInfo.userId,
      imageUrl: that.data.shareWXImg,
      success: (res) => {    // 失效
        console.log("分享成功")
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //公司选择
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    this.setData({
      index: index,
      companyData: this.data.companyInfo[index]
    })
    app.data.userCardDetaData.companyInfo = this.data.companyInfo[index];
    console.log("更改的公司资料：", this.data.companyInfo[index])
    this.choiceCompanyInfo();
  },
  //返回主页
  JumpPage: function () {
    var that = this;
    wx.reLaunch({
      url: footFolderDir + app.data.sysMainPage
    })
  },
  //创建
  newPerfect: function () {
    this.setData({
      bindingState: true,
      disabled: false,
      vtype: 1
    })
  },

  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var defaultType = 1;
    if (e.detail.value) {
      defaultType = 2;
    }
    var field = "companyData.defaultType";
    this.setData({
      [field]: defaultType,
      updateStatus: true
    })
  },
})
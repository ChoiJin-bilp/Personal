// pages/perfect/perfect.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var PYTool = require('../../../utils/pinyin.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,      //远程资源路径
    companyData:{
      company: null,
      addr: null,
      companyWebSite: null,
      intro: null,
      legal: null,
      companyTel: null,
      companyEmail: null,
      companyLogo: null,
      companyFile: null,
      showCompanyInfo: true,
    },
    disabled: true,
    infoDisabled:true,
    updateStatus:false,
    updateFileStatus:false,
    array: ['天天上科技有限公司', '爱美家科技有限公司', '云客科技有限公司'],
    objectArray: [
      {
        id: 0,
        name: '天天上科技有限公司'
      },
      {
        id: 1,
        name: '爱美家科技有限公司'
      },
      {
        id: 2,
        name: '云客科技有限公司'
      }
    ],
    index: 0,

    maxOtherImgCnt: 6,           //公司相册图片最大数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      scene: options.scene
    })
    if (options.scene == 1){//注册
      if (app.data.cardCompanyData != ""){
        that.setData({
          companyData: app.data.cardCompanyData,
          disabled: false
        })
      }else{
        that.setData({
          companyData:app.data.temporaryCompany,
          disabled: false
        })
      }
    } else if (options.scene == 2){//自己名片编辑页面
      that.setData({
        companyData: app.data.userCardDetaData,
      })
      console.log('公司资料：', app.data.userCardDetaData)
    } else if (options.scene == 3){//查看对方信息页面
      that.setData({
        companyData: app.data.cardDetaData,
      })
    }
    console.log(app.data.cardDetaData)
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
    app.data.userCardDetaData = this.data.companyData;
    console.log("页面卸载、", app.data.userCardDetaData.addr)
  },
  //获取输入内容
  changeValueMainData:function(e){
    var that = this;
    var val = e.detail.value;
    var field = "companyData." + e.currentTarget.dataset.value;
    console.log(field)
    that.setData({
      updateStatus: true,
      infoDisabled: false,
      [field]: val
    })
    if (field == 'companyData.addr') {
      var addrStr = 'companyData.addr';
      that.setData({
        [addrStr]: val
      })
    }
  },
  //勾选是否显示公司资料
  returnCard:function(e){
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
  editDataInfo:function(){
    var that = this;
    that.setData({
      disabled: false
    })
  },
  //保存信息
  submitDataInfo:function(){
    var that = this;
    var companyData = that.data.companyData;
    if (companyData.company!= null){
      app.data.cardCompanyDataStr += "&company=" + encodeURIComponent(companyData.company);
    }
    if (companyData.addr != null){
      app.data.cardCompanyDataStr += "&addr=" +  encodeURIComponent(companyData.addr);
    }
    if (companyData.companyWebSite != null) {
      app.data.cardCompanyDataStr += "&companyWebSite=" + encodeURIComponent(companyData.companyWebSite);
    }
    if (companyData.intro != null){
      app.data.cardCompanyDataStr += "&intro=" +  encodeURIComponent(companyData.intro);
    }
    if (companyData.legal != null){
      app.data.cardCompanyDataStr += "&legal=" +  encodeURIComponent(companyData.legal);
    }
    if (companyData.companyTel != null){
      app.data.cardCompanyDataStr += "&companyTel=" + companyData.companyTel;
    }
    if (companyData.companyEmail != null){
      app.data.cardCompanyDataStr += "&companyEmail=" +  encodeURIComponent(companyData.companyEmail);
    }
    app.data.cardCompanyDataStr += "&showCompanyInfo=" + companyData.showCompanyInfo;
    if (that.data.updateFileStatus){
      app.data.cardCompanyDataStr += "&companyLogo=" + encodeURIComponent(companyData.companyLogo);
      app.data.cardCompanyDataStr += "&companyFile=" + encodeURIComponent(companyData.companyFile);
    }
    console.log("保存的参数字符串")
    console.log(app.data.cardCompanyDataStr)
    if (that.data.scene == 1){
      app.data.cardCompanyData = {
        company: companyData.company,
        addr: companyData.addr,
        companyWebSite: companyData.companyWebSite,
        intro: companyData.intro,
        legal: companyData.legal,
        companyTel: companyData.companyTel,
        companyEmail: companyData.companyEmail,
        showCompanyInfo: companyData.showCompanyInfo,
        companyLogo: companyData.companyLogo,
        companyFile: companyData.companyFile,
      }
      wx.showToast({
        title: '保存成功！',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        infoDisabled:true
      })
      wx.navigateBack({
        delta: 1
      })
      console.log("保存的公司信息")
      console.log(app.data.cardCompanyData)
    } else if (that.data.scene == 2){
      that.hideModalcomp();
    }
    
  },
  //保存创建信息
  hideModalcomp: function () {
    var that = this;
    console.log("保存事件", that.data.updateStatus)
    if (!that.data.updateStatus) {
      wx.showToast({
        title: '保存成功！',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        updateStatus: false,
        updateFileStatus: false,
        disabled: true
      })
      return;
    } else {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var urlParam = "cls=main_user&action=saveUserInfo&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      var Params = "&opertion=mod&companyId=" + app.globalData.userInfo.companyId + "&id=" + that.data.companyData.id + app.data.cardCompanyDataStr;
      if (that.data.contact != null) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        if (re.test(that.data.companyData.company) || that.data.companyData.company == "") {
          wx.showToast({
            title: '请输入公司名称！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
      }
      urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + Params;
      console.log(URL + urlParam)
      wx.request({
        url: URL + urlParam,
        success: function (res) {
          console.log(res)
          if (res.data.rspCode == 0) {
            wx.showToast({
              title: '保存成功!',
              icon: 'none',
              duration: 1500
            })
            app.data.cardCompanyDataStr = "";
            var userMap = res.data.data.userMap;
            if (!Utils.isNull(userMap.companyFile)) {
              var imgFile = userMap.companyFile.split(",");
              userMap.companyFile = imgFile;
            } else {
              userMap.companyFile = [];
            }
            app.data.userCardDetaData = userMap;
            that.setData({
              updateStatus: false,
              updateFileStatus: false,
              disabled: true,
              companyData: userMap,
            })
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
  //删除照片 logo
  showModaltip: function (e) {
    var that = this;
    var companyLogo = "companyData.companyLogo";
    that.setData({
      [companyLogo]:"",
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
    var companyFile = that.data.companyData.companyFile;
    companyFile.splice(val, 1);
    var userFileStr = "companyData.companyFile";
    that.setData({
      [userFileStr]: companyFile,
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
    var that = this, sType = 0, userFile = that.data.companyData.companyFile, maxOtherImgCnt = that.data.maxOtherImgCnt, rbImgCnt = userFile != null && userFile != undefined && userFile.length > 0 ? userFile.length : 0, enableOtherImgCnt = maxOtherImgCnt - rbImgCnt;


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
        let companyFile = that.data.companyData.companyFile, userFileStr = "companyData.companyFile";
        companyFile = companyFile.concat(imgUrl);
        that.setData({
          [userFileStr]: companyFile,
          updateStatus: true,
          updateFileStatus: true,
        })
        console.log("存入照片")
        console.log(that.data.companyData.companyFile)
        break;
      default:
        let comStr = "companyData.companyLogo";
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
    let that = this;
    app.viewImg(e);
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
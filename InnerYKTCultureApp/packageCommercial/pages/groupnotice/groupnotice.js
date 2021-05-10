// pages/groupnotice/groupnotice.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    disabled:true,
    updateStatus:false,
    cardgroupMsgData:{
      title:'',
      message:'',
      img:[],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardgroupData: app.data.cardgroupData,
      userInfo: app.globalData.userInfo,
      scene: options.status,
      identity: options.identity,
    })
    if (options.status == 1){ //查看
        this.setData({
          cardgroupMsgData: app.data.cardgroupMsgData
        })
    } else if (options.status == 2) { //新建
        this.setData({
          disabled:false
        })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取群通知输入
  changeInputNotif: function (e) {
    var val = e.detail.value;
        val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var type = e.currentTarget.dataset.type;
    console.log('输入内容：',val)
    if (type == 1) {
      var titStr = 'cardgroupMsgData.title';
      this.setData({
        updateStatus: true,
        [titStr]: val
      })
    } else {
      var titStr = 'cardgroupMsgData.message';
      this.setData({
        updateStatus: true,
        [titStr]: val
      })
    }

  },
  //保存群通知
  confirmNotify: function (e) {
    var that = this;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (!that.data.updateStatus){
      that.setData({
        disabled: true
      })
      return;
    }
    var cardgroupMsgData = that.data.cardgroupMsgData;
    console.log('title:', cardgroupMsgData.title)
    if (re.test(cardgroupMsgData.title) || Utils.isNull(cardgroupMsgData.title)) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var imgStr = '';
    if (cardgroupMsgData.img.length > 0){
      for (let i = 0; i < cardgroupMsgData.img.length; i++){
        imgStr += cardgroupMsgData.img[i] + ',';
        }
      imgStr = imgStr.substring(0, imgStr.length - 1)
     }
    var urlParam = "cls=main_qunNotice&action=saveQunNotice&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&operation=mod&id=" + cardgroupMsgData.id + "&message=" + encodeURIComponent(cardgroupMsgData.message) + "&title=" + encodeURIComponent(cardgroupMsgData.title) + "&img=" + imgStr + "&sign=" + sign;
    console.log("发布群通知URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          console.log('发布消息:', res.data)
          that.setData({
            disabled: true
          })
          wx.showToast({
            title: '保存成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "发布群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发布群通知失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //发布群通知
  updateShareQunNews: function (e) {
    var that = this;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(that.data.cardgroupMsgData.title) || Utils.isNull(that.data.cardgroupMsgData.title)) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var cardgroupMsgData = that.data.cardgroupMsgData;
    if (Utils.isNull(cardgroupMsgData.message)) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var cardList = [];
    var cardListStr = '';
    cardList = that.data.cardgroupData;
    cardListStr = 'cardgroupList';
    var id = cardList.id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var imgStr = '';
    if (cardgroupMsgData.img.length > 0) {
      for (let i = 0; i < cardgroupMsgData.img.length; i++) {
        imgStr += cardgroupMsgData.img[i] + ',';
      }
      imgStr = imgStr.substring(0, imgStr.length - 1)
    }
    var urlParam = "cls=main_qunNotice&action=saveQunNotice&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&contactFolderId=" + id + "&message=" + encodeURIComponent(that.data.cardgroupMsgData.message) + "&title=" + encodeURIComponent(that.data.cardgroupMsgData.title) + "&img=" + imgStr + "&sign=" + sign;
    console.log("发布群通知URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          console.log('发布消息:', res.data)
          wx.showToast({
            title: '发布成功',
            duration: 500
          })
          setTimeout(function (){
            wx.navigateBack({
              delta: 1
            })
          },500)
      
        } else {
          app.setErrorMsg2(that, "发布群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发布群通知失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //删除群通知
  delNotify:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗？',
      success(res) {
        if (res.confirm) {
          that.requestDelNotify();
        } else if (res.cancel) {
        }
      }
    })
  },
  //删除群通知
  requestDelNotify: function (e) {
    var that = this;
    var cardgroupMsgData = that.data.cardgroupMsgData;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_qunNotice&action=saveQunNotice&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&operation=del&id=" + cardgroupMsgData.id + "&sign=" + sign;
    console.log("删除群通知URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          console.log('删除消息:', res.data)
          wx.showToast({
            title: '删除成功',
            duration: 500
          })
          setTimeout(function (){
            wx.navigateBack({
              delta: 1
            })
          },500)
        } else {
          app.setErrorMsg2(that, "删除群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  //图片上传
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    var userFileNum = 0;
    wx.showLoading({
      title: '正在上传中...',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
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
        } catch (e) { }
        if (!Utils.isNull(data) && !Utils.isNull(data.rspCode) && data.rspCode == 0) {
           var imgUrl = data.data.fileName;
           var cardgroupMsgData = that.data.cardgroupMsgData;
               cardgroupMsgData.img = cardgroupMsgData.img.concat(imgUrl);
            that.setData({
              cardgroupMsgData: cardgroupMsgData,
              updateStatus: true,
            })
          console.log('cardgroupMsgData:', cardgroupMsgData)
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
        } else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length, type);
        }
      },
    });
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    app.viewImg(e);
  },
  editNotify:function(){
    this.setData({
      disabled:false
    })
  },
  selectImage: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var cardgroupMsgData = that.data.cardgroupMsgData;
    console.log('cardgroupMsgData=', cardgroupMsgData)
    var count = 6;
        count = count - cardgroupMsgData.img.length;
    // if (type == 1) {//编辑
    // }else{  //新建

    // }
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log('获取图片：', res)
        if (!Utils.isNull(res.tempFilePaths)) {
          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          var length = res.tempFilePaths.length; //总共个数
          var i = 0; //第几个
          that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
          return;
        }
        // tempFilePath可以作为img标签的src属性显示图片
        wx.hideLoading()
      }, fail: function (err) {
        wx.hideLoading()
      }
    })
  },
  delrbImgList: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var img = that.data.cardgroupMsgData.img;
        img.splice(index, 1);
    var imgStr = "cardgroupMsgData.img";
    that.setData({
      [imgStr]: img,
      updateStatus: true,
    })
  },
})
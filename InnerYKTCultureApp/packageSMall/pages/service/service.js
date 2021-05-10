// packageSMall/pages/service/service.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
var appUserInfo = app.globalData.muserInfo;
var BJYURL = app.getUrlAndKey.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    array: ['7天无理由', '发货慢', '货物损坏', '其它'],
    rbImgArray: [],
    //订单
    order: "",
    //已选择的图片
    rbImgCnt: 0,
    // 最大上传的图片
    maxOtherImgCnt: 6,
    // 是否显示删除图片按钮
    disabled: true,
    // 问题描述(不能为空)
    remark: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //getOpenerEventChannel()微信系统方法，需调试库2.9.2 ,在json文件中加个"usingComponents": {} ,
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        order: data.order
      })
    })
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  /**
   * 售后类型
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      moldType: e.detail.value
    })
  },

  changeValueMainData: function(e) {
    // 获取输入框的内容
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 焦点触发 切换为textarea框
   */
  hideRemarkText: function() {
    this.setData({
      showRemarkTeLabel: false
    })
  },
  /**
   * 选择图片
   */
  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: that.data.maxOtherImgCnt,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if (tempFilePaths != null && tempFilePaths.length > 0) {
          if (tempFilePaths.length > (parseInt(that.data.maxOtherImgCnt) - parseInt(that.data.rbImgCnt))) {
            wx.showToast({
              title: "最多只能上传6张图片",
              icon: "none",
            })
          } else {
            wx.showLoading({
              title: "图片上传中...",
            })
            that.recUpLoadMImg(tempFilePaths, 0, 0, 0, tempFilePaths.length);
          }
        }
      }
    })
  },

  /**
   * 事件：图片查看事件
   */
  viewImg: function(e) {
    app.viewImg(e);
  },

  /**
   * 事件：删除其他图片
   */
  delrbImgList: function(e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    var rbImgArray = that.data.rbImgArray,
      rbImgCnt = 0;
    rbImgArray.splice(index, 1);
    rbImgCnt = rbImgArray.length;

    that.setData({
      rbImgCnt: rbImgCnt, //已有图片数量
      rbImgArray: rbImgArray, //图片列表数值
    })
  },

  /**
   * 方法：递归上传多图片
   */
  recUpLoadMImg: function(imgData, index, sCnt, fCnt, aCnt) {
    var that = this,
      sindex = index + 1,
      maxOtherImgCnt = that.data.maxOtherImgCnt;
    if (that.data.rbImgCnt >= maxOtherImgCnt) {
      return;
    }
    wx.showLoading({
      title: "上传" + sindex + "/" + aCnt + "张...",
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log("上传图片URL:" + BJYURL + urlParam)
    console.log("第" + index + "张图片路径:" + imgData[index]);
    wx.uploadFile({
      url: BJYURL + urlParam, //仅为示例，非真实的接口地址
      filePath: imgData[index],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function(res) {
        console.log("图片上传服务器结果。。。")
        wx.hideLoading();
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) {}
        console.log(res)
        if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          var imgUrl = "";
          if (data.data.fileName != null && data.data.fileName != undefined) {
            sCnt++;
            imgUrl = app.getSysImgUrl(data.data.fileName);
            console.log("服务器返回图片路径:" + imgUrl);
            that.dowithImg(imgUrl);
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
        //do something
      },
      fail: function(e) {
        wx.hideLoading();
        fCnt++;
      },
      complete: function(e) {
        wx.hideLoading();
        index++;
        if (index == aCnt || (that.data.rbImgCnt >= maxOtherImgCnt)) {
          wx.hideLoading();
          if (fCnt > 0 || sCnt <= 0) {
            wx.showToast({
              title: '共' + sCnt + '张上传成功,' + fCnt + '张上传失败！',
              icon: 'none',
              duration: 2000
            })
          }
        } else { //递归调用recUpLoadMImg函数
          that.recUpLoadMImg(imgData, index, sCnt, fCnt, aCnt);
        }
      }
    })
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function(imgUrl) {
    var that = this;
    var rbImgCnt = that.data.rbImgCnt,
      rbImgArray = that.data.rbImgArray;
    rbImgArray.push(imgUrl);
    rbImgCnt = rbImgArray.length;
    that.setData({
      rbImgCnt: rbImgCnt,
      rbImgArray: rbImgArray,
    })
  },
  /**
   * 提交申请
   */
  submitService: function() {
    var that = this;
    var moldType = that.data.moldType;
    var remark = that.data.remark;
    if (Utils.isNull(moldType) || Utils.isNull(remark)) {
      wx.showToast({
        title: "请填写完整！",
        icon: 'none',
      })
      return;
    }

    var rbImgArray = that.data.rbImgArray;

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_custservice&action=SaveService&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + appUserInfo.userId;
    console.log('sign:' + urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log("申请售后URL:" + URL + urlParam);
    var datas = [];
    var data = {
      orderId: that.data.order.orderId,
      mold: moldType,
      title: "",
      description: remark,
      //  把数组用,隔开拆分
      photos: rbImgArray.join(","),
      remarks: ""
    }
    datas.push(data)
    var jsonData = JSON.stringify(datas);
    console.log(jsonData);

    wx.request({
      url: URL + urlParam,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        data: jsonData
      },
      success(res) {
        console.log(res)
        var msg = res.data.rspMsg;
        if (Utils.isNull(msg)) {
          msg = "申请成功"
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
        // 关闭当前页面，返回上一页面
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: err,
          icon: 'none',
        })
      }
    })
  },
})
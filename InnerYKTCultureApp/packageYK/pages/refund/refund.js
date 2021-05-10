// pages/refund/refund.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  sOptions = null,
  scanQrTag = 0;
var pageSize = 20,
  defaultItemImgSrc = DataURL + app.data.defaultImg,
  packMainPageUrl = "../../../pages",
  packYKPageUrl = "../../../packageYK/pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    rbImgCnt: 0, //已有图片数量
    rbImgArray: [], //图片列表数值
    // 是否可编辑
    isEdit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
    var id = options.id
    this.setData({
      id: id,
      type: options.type,
    })
    if (this.data.type == 1) {
      this.setData({
        isEdit: false,
      })
      this.queryUserLotteryRecordt()
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function (e) {
    var rbImgArray = this.data.rbImgArray
    if (rbImgArray.length == 6) {
      wx.showToast({
        title: '最多只能上传6张图片',
        icon: "none",
        duration: 1500
      })
      return
    }
    var that = this,
      sType = 0,
      maxOtherImgCnt = that.data.maxOtherImgCnt,
      rbImgCnt = that.data.rbImgCnt,
      maxReduceImgCnt = that.data.maxReduceImgCnt,
      reduceImgCnt = that.data.reduceImgCnt,
      enableOtherImgCnt = maxOtherImgCnt - rbImgCnt,
      enableReduceImgCnt = maxReduceImgCnt - reduceImgCnt;

    //sType:0 封面图片，1 其他图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) {}
    }
    //0封面单张图片，1多张相关图片，2多张介绍图片
    switch (sType) {
      //文章封面相关多图上传
      case 1:
        app.uploadImg(that, sType, rbImgCnt, maxOtherImgCnt)
        break;

        //介绍图片多图上传
      case 2:
        app.uploadImg(that, sType, reduceImgCnt, maxReduceImgCnt)
        break;

        //单图片上传
      default:
        app.uploadImg(that, sType, 0, 1)
        break;
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this;
    switch (sType) {
      case 0:
        var exhbitionData = that.data.exhbitionData;
        exhbitionData.coverImage = imgUrl;
        that.setData({
          exhbitionData: exhbitionData
        })
        break;
      case 1:
        var rbImgCnt = that.data.rbImgCnt
        var rbImgArray = that.data.rbImgArray;
        rbImgArray.push(imgUrl);
        rbImgCnt = rbImgArray.length;
        that.setData({
          rbImgCnt: rbImgCnt,
          rbImgArray: rbImgArray,
        })
        break;
      case 2:
        var reduceImgCnt = that.data.reduceImgCnt,
          reduceImgArray = that.data.reduceImgArray;
        reduceImgArray.push(imgUrl);
        reduceImgCnt = reduceImgArray.length;
        that.setData({
          reduceImgCnt: reduceImgCnt,
          reduceImgArray: reduceImgArray,
        })
        break;
    }
  },

  //事件：删除其他图片
  delrbImgList: function (e) {
    var that = this,
      tag = 0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) {}
    var index = e.currentTarget.dataset.index;
    //0招商图片，1招商介绍图片
    switch (tag) {

      default:
        var reduceImgArray = that.data.reduceImgArray,
          reduceImgCnt = 0;
        reduceImgArray.splice(index, 1);
        reduceImgCnt = reduceImgArray.length;

        that.setData({
          reduceImgCnt: reduceImgCnt, //已有图片数量
          reduceImgArray: reduceImgArray, //图片列表数值
        })
        break;

      case 1:
        var rbImgArray = that.data.rbImgArray,
          rbImgCnt = 0;
        rbImgArray.splice(index, 1);
        rbImgCnt = rbImgArray.length;

        that.setData({
          rbImgCnt: rbImgCnt, //已有图片数量
          rbImgArray: rbImgArray, //图片列表数值
        })
        break;
    }
  },

  getInput: function (e) {
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "remark"
        break
      case 1:
        name = "mobile"
        break
    }
    this.setData({
      [name]: value,
    })
  },

  /**
   * 按摩消费订单申请和查询
   */
  getUserLotteryRecordt() {
    var remark = this.data.remark
    var mobile = this.data.mobile
    var rbImgArray = this.data.rbImgArray
    if (Utils.isNull(remark) || Utils.isNull(mobile)) {
      wx.showToast({
        title: '请填完带*内容',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (rbImgArray.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId = 8033
    let signParam = 'cls=main_lotteryActivityProduct&action=UserLotteryRecord&appId=' + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId + "&id=" + this.data.id
    var otherParam = "&pIndex=1&pSize=20&mode=a&remark=" + remark + "&mobile=" + mobile + "&imgs=" + rbImgArray.join(",")
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "按摩消费订单申请和查询")
  },

  /**
   * 按摩消费订单申请和查询
   */
  queryUserLotteryRecordt() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId = 8033
    let signParam = 'cls=main_lotteryActivityProduct&action=UserLotteryRecord&appId=' + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId + "&id=" + this.data.id
    var otherParam = "&pIndex=1&pSize=20&mode=q"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 1, "按摩消费订单申请和查询")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            wx.showToast({
              title: '申请成功!',
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 2000)
            break
          case 1:
            that.setData({
              mobile: data[0].mobile,
              remark: data[0].userRemark,
              rbImgArray: data[0].errorImage.split(",")
            })
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },
})
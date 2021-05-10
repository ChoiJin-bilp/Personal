// packageOther/pages/fxdata/fxdata.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl

Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [],

    time: [{
      name: '7天内',
      value: 7
    }, {
      name: '15天',
      value: 15
    }, {
      name: '一个月',
      value: 30
    }, {
      name: '一年',
      value: 365
    }],
    DataURL: DataURL,
    selCommissionConParam: -1,
    isSelFCommission: false,
    sField: "",
    sOrder: "",
    sDay: "",
    pIndex: 1,
    pSize: 10,
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e)
    var index = e.detail.value
    this.setData({
      sDay: this.data.time[index].value,
      index: index,
    })
    this.queryDistribute()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryDistribute()
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
   * 监听用户下拉动作
   */
  bindTopLoad: function() {
    console.log("监听用户下拉动作");
    this.setData({
      pIndex: 1
    })
    this.queryDistribute()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  bindDownLoad: function() {
    console.log("上拉触底事件");
    this.setData({
      pIndex: ++this.data.pIndex
    })
    this.queryDistribute()
  },


  /**
   * 佣金排序
   */
  bonusOrder: function() {

    var selCommissionConParam = this.data.selCommissionConParam;
    var sOrder = this.data.sOrder;

    if (selCommissionConParam == 0) {
      selCommissionConParam = 1;
      sOrder = "desc"
    } else {
      selCommissionConParam = 0;
      sOrder = "asc"
    }

    this.setData({
      isSelFCommission: true,
      // 0升 1降
      selCommissionConParam: selCommissionConParam,
      sField: "bonus",
      sOrder: sOrder,
    })

    this.queryDistribute()
  },
  /**
   * 查询分销记录
   */
  queryDistribute: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_activity&action=QueryDistribute&appId=" + app.data.appid + "&timestamp=" + timestamp;
    console.log('sign:', urlParam + "&key=" + KEY)
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&userId=" + app.globalData.userTotalInfo.id + "&sField=" + that.data.sField + "&sGroup=pid&sOrder=" + that.data.sOrder + "&sDay=" + that.data.sDay + "&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sign=" + sign;
    console.log('查询分销记录:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        if (data.length == 0) {
          if (that.data.pIndex != 1) {
            that.setData({
              pIndex: --that.data.pIndex
            })
          }

          wx.showToast({
            title: "暂无数据",
            icon: 'none',
          })
        }
        if (that.data.pIndex == 1) {
          that.setData({
            array: data
            // array: that.data.array.concat(data)
          })
        } else {
          that.setData({
            array: that.data.array.concat(data)
          })
        }
      },
      fail: function(res) {
        console.log(res)
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})
// pages/Gifts/Gifts.js
const app = getApp()
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize = 8
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '2020-08-01',
    endDate: "2020-09-01",
    DataURL: DataURL, //远程资源路径
    numIndex: 0,
    nums: [],
    pIndex: 1,
    startDate: '2020-08-01',
    endDate: "2020-09-01",
    couponList: [],
    all: {
      cnt: 0,
      duration: 0
    },
    now: {
      cnt: 0,
      duration: 0
    },
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
    var nums = []
    for (let index = 0; index < 10; index++) {
      nums.push(index + 1)
    }

    // 今天日期
    console.log(Utils.formatDate(0));
    // 近30天 日期
    var startDate = Utils.formatDate(-29)
    var endDate = Utils.formatDate(0)
    // 产品要求默认只要当前月的日期
    startDate = Utils.getCurMinDate()
    endDate = Utils.getCurMaxDate()

    this.setData({
      nums: nums,
      startDate: startDate,
      endDate: endDate,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
    })

    var accountBindUserId = this.data.accountBindUserId
    if (Utils.isNull(accountBindUserId) || accountBindUserId == 0) {
      wx.showModal({
        title: '提示',
        content: '登录账号没有绑定用户ID',
        confirmText: "去绑定",
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../../../pages/personal/personal',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
      return
    }
    this.queryAmCoupons()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //时间选择
  bindDateChange: function (e) {
    var tag = e.currentTarget.dataset.tag
    var name = "startDate"
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (tag == 1) {
      name = "endDate"
    }
    this.setData({
      [name]: e.detail.value
    })
  },

  /**
   * 弹出下拉框
   */
  changeType() {
    this.setData({
      type: !this.data.type
    })
  },

  optionTaps(e) {
    var index = e.currentTarget.dataset.index
    var numIndex = this.data.numIndex
    if (numIndex == index) {
      this.setData({
        type: false,
      })
      return
    }
    this.setData({
      type: false,
      numIndex: index,
    })
  },

  getInput: function (e) {
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "guid"
        break
      case 1:
        if (isNaN(value)) {
          value = 1
        } else if (parseInt(value) > 30) {
          value = 30
          wx.showToast({
            title: "赠送时间不能超过30分钟",
            icon: 'none',
            duration: 1500
          })
        }
        name = "duration"
        break
    }
    this.setData({
      [name]: value,
    })
  },
  //时间选择
  bindDateChange: function (e) {
    var tag = e.currentTarget.dataset.tag
    var name = "startDate"
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (tag == 1) {
      name = "endDate"
    }
    this.setData({
      [name]: e.detail.value
    })
  },

  serachOK() {
    this.setData({
      all: {
        cnt: 0,
        duration: 0
      },
      now: {
        cnt: 0,
        duration: 0
      },
      couponList: [],
      pIndex: 1,
    })
    this.queryAmCoupons()
  },

  /**
   * 赠送优惠券
   */
  giveCoupons() {
    var that = this
    var guid = that.data.guid
    var duration = that.data.duration
    if (Utils.isNull(duration) || Utils.isNull(guid)) {
      wx.showToast({
        title: "请填写完整",
        icon: 'none',
        duration: 1500
      })
      return
    }

    wx.showModal({
      title: '提示',
      content: '确定要赠送给用户ID\'' + guid + "\'的用户吗?",
      success(res) {
        if (res.confirm) {
          that.receiveAmCoupons(guid, duration, that.data.nums[that.data.numIndex])
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 赠送电子按摩券或纸质按摩券绑定领取
   * id二维码关联系统分发电子券或纸质券设置编号,companyId公司,userId用户,distr分发类型(1电子2纸质),duration时长,num数量
   */
  receiveAmCoupons(guid, duration, num) {
    let signParam = 'cls=product_coupons&action=ReceiveAmCoupons'
    var otherParam = "&companyId=" + app.data.companyId + "&distr=1&userId=" + guid + "&duration=" + duration + "&num=" + num + "&userby=" + this.data.accountBindUserId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "赠送电子按摩券")
  },
  /**
   * 发放和领取按摩券查询
   * userId用户,companyId公司,lotteryProductId活动券设置id,status状态,isUse使用标识,
    type类型,duration时长,lotteryProduct券标识,orderNo关联单据,deviceNo设备号,distr发放类型(1电子2纸质0其他),
    startDate开始时间,endDate结束时间,sField排序字段,sOrder升降序 asc desc &pIndex当前页&pSize分页大小
   */
  queryAmCoupons() {
    let signParam = 'cls=product_coupons&action=QueryAmCoupons'
    var otherParam = "&companyId=" + app.data.companyId + "&distr=1&userby=" + this.data.accountBindUserId + "&startDate=" + this.data.startDate + " 00:00:00&endDate=" + this.data.endDate + " 23:59:59&pSize=" + pageSize + "&pIndex=" + this.data.pIndex + "&sField=createDate&sOrder=desc"
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 1, "发放和领取按摩券查询", false, false, true)
  },
  getRuslt: function (data, code, error, tag) {
    let that = this
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 2000
            })
            setTimeout(that.serachOK, 2100)
            break;
          case 1:
            var list = data.list
            if (list.length == 0) {
              if (that.data.pIndex == 1) {
                wx.showToast({
                  title: "暂无记录",
                  icon: 'none',
                  duration: 1500
                })
              } else {
                that.setData({
                  pIndex: --that.data.pIndex,
                })
                wx.showToast({
                  title: "记录加载完毕",
                  icon: 'none',
                  duration: 1500
                })
              }
              return
            }

            var all = data.all
            if (Utils.isNull(all.cnt)) {
              all.cnt = 0
            }
            if (Utils.isNull(all.duration)) {
              all.duration = 0
            }

            var now = data.now
            if (Utils.isNull(now.cnt)) {
              now.cnt = 0
            }
            if (Utils.isNull(now.duration)) {
              now.duration = 0
            }
            that.setData({
              all: all,
              now: now,
              couponList: that.data.couponList.concat(list),
            })
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("用户下拉动作")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底事件")
    this.setData({
      pIndex: ++this.data.pIndex,
    })
    this.queryAmCoupons()
  },
})
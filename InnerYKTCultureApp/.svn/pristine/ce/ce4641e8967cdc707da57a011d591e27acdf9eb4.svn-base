// pages/historyitem/historyitem.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.muserInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    // 角色
    user_roleId: app.data.user_roleId,
    userId: "",
    status: [{
        statu: 2,
        name: "已送达"
      },
      {
        statu: 6,
        name: "配送中"
      }, {
        statu: 1,
        name: "未接单"
      }
    ],
    selectStatusIndex: 0,
    CompanydataList: [],
    selectHotelIndex: 0,
    companyId: "",
    // 配送员工id
    deliveryuserId: "",
    // 订单号或者号牌搜索
    key: "",
    startDate: '2020-08-01',
    endDate: "2020-09-01",
    orderList: [],
    userList: [],
    selectUserIndex: 0,
    cnt: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo;

    // 今天日期
    console.log(Utils.formatDate(0));
    // 近30天 日期
    var startDate = Utils.formatDate(-29)
    var endDate = Utils.formatDate(0)
    // 产品要求默认只要当前月的日期
    startDate = Utils.getCurMinDate()
    endDate = Utils.getCurMaxDate()

    var userId = appUserInfo.userId
    if (this.data.user_roleId == 2) {
      //账户绑定用户ID
      userId = app.data.accountBindUserId
    }

    this.setData({
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    })

    this.getHotleCompany()
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

  //显示隐藏下拉框
  onChangedivtype(e) {
    var that = this
    var tag = parseInt(e.currentTarget.dataset.tag)
    switch (tag) {
      case 0:
        that.setData({
          isShowStatus: !that.data.isShowStatus
        })
        break;
      case 1:
        that.setData({
          isShowHotel: !that.data.isShowHotel
        })
        break;
      case 2:
        that.setData({
          isShowUser: !that.data.isShowUser
        })
        break;
    }
  },

  getInput: function (e) {
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    this.setData({
      key: value,
    })
  },

  /**
   * 选择酒店
   * @param {*} e 
   */
  selectHotel(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectHotelIndex = that.data.selectHotelIndex
    if (selectHotelIndex == index) {
      that.setData({
        isShowHotel: false,
      })
      return
    }
    that.setData({
      selectHotelIndex: index,
      companyId: that.data.CompanydataList[index].id,
      isShowHotel: !that.data.isShowHotel,
    })
    that.getHotleUser()
  },

  /**
   * 选择员工
   * @param {*} e 
   */
  selectUser(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectUserIndex = that.data.selectUserIndex
    if (selectUserIndex == index) {
      that.setData({
        isShowUser: false,
      })
      return
    }
    that.setData({
      selectUserIndex: index,
      isShowUser: !that.data.isShowUser,
    })
    that.queryOrders()
  },
  /**
   * 选择状态
   * @param {*} e 
   */
  selectStatus(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectStatusIndex = that.data.selectStatusIndex
    if (selectStatusIndex == index) {
      that.setData({
        isShowStatus: false,
      })
      return
    }
    that.setData({
      selectStatusIndex: index,
      isShowStatus: !that.data.isShowStatus,
    })
    that.queryOrders()
  },

  /**
   * 获取用户绑定的酒店
   */
  getHotleCompany() {
    let signParam = 'cls=main_rolePower&action=getRolePowerPowerList&roleId=' + app.data.user_roleId
    var otherParam = "&userId=" + this.data.userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取用户绑定酒店")
  },

  /**
   * 获取绑定酒店员工
   */
  getHotleUser() {
    let signParam = 'cls=main_companyUser&action=companyUList&companyId=' + this.data.companyId
    // var otherParam = "&userId=" + this.data.userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, "", 1, "获取绑定酒店员工")
  },

  /**
   * 查询订单
   */
  queryOrders() {
    if (Utils.isNull(this.data.companyId)) {
      return
    }
    if (this.data.userList.length > 0) {
      this.data.deliveryuserId = this.data.userList[this.data.selectUserIndex].id
    }
    this.setData({
      orderList: [],
      cnt: 0,
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=QueryOrdersNew&appId=' + app.data.appid + "&timestamp=" + timestamp;
    // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货(配送中)7团购失败 12已支付定金
    // 预计送到开始结束时间sdeliverytime,edeliverytime 配送员 deliveryuserId
    var otherParam = "&linkNo=9&status=" + this.data.status[this.data.selectStatusIndex].statu + "&pageIndex=1&pageSize=99&companyId=" + this.data.companyId + "&sdeliverytime=" + this.data.startDate + " 00:00:00&edeliverytime=" + this.data.endDate + " 23:59:59&deliveryuserId=" + this.data.deliveryuserId + "&key=" + this.data.key
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 2, "查询订单", false, false, true)
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.dealData(data)
            break
          case 1:
            if (!Utils.isNull(data) && data.length > 0) {
              that.setData({
                userList: data,
              })
            }
            that.queryOrders()
            break
          case 2:
            that.dealData2(data)
            break

        }
        if (!Utils.isNull(content)) {
          wx.showToast({
            title: content,
            icon: 'none',
            duration: 1500
          })
        }
        break
      default:
        console.log(error)
        break
    }
  },

  dealData(data) {
    var that = this
    if (data.CompanydataList.length > 0) {
      that.setData({
        CompanydataList: data.CompanydataList,
        companyId: data.CompanydataList[0].id,
        selectHotelIndex: 0,
      })
      if (that.data.user_roleId == 2) {
        that.getHotleUser()
      } else {
        that.queryOrders()
      }

    } else {
      wx.showToast({
        title: "没有绑定酒店",
        icon: 'none',
        duration: 1500
      })
    }
  },

  dealData2(data) {
    var that = this
    let list = []
    if (!Utils.isNull(data.list)) {
      list = data.list
    }
    if (list.length == 0) {
      wx.showToast({
        title: "暂无订单",
        icon: 'none',
        duration: 2000
      })
    }

    that.setData({
      orderList: list,
      cnt: data.cash.cnt,
    })
  },

  //电话拨打
  phonecallevent: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var mobile = that.data.orderList[index].dmobile
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },

  /**
   * 导航路线规划
   */
  goToMapRoute(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var order = that.data.orderList[index]

    // 同步请求后 获取数据
    Utils.getLngAndLat(app, order.addr).then(res => {
      that.statrGoMap(order.addr, res)
    }).catch(err => {
      that.statrGoMap(order.addr, err)
    });

  },

  /**
   * 路线规划
   * @param {*} addr 
   * @param {*} data 
   */
  statrGoMap(addr, data) {
    // let key = app.data.qqMapSDKKey; //使用在腾讯位置服务申请的key
    // let referer = app.data.sysName; //调用插件的app的名称
    // let endPoint = JSON.stringify({ //终点
    //   'name': addr,
    //   'latitude': data.lat,
    //   'longitude': data.lng
    // });
    // wx.navigateTo({
    //   url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    // });

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log(res)
        const latitude = data.lat
        const longitude = data.lng
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name: addr
        })
      }
    })

  },

  /**
   * 订单详情
   * @param {*} e 
   */
  goDetail(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var order = that.data.orderList[index]
    var url = '../../../packageOther/pages/successDetailspa/successDetailspa?showcoupon=0&oid=' + order.orderId
    wx.navigateTo({
      url: url,
    })
  },
})
// pages/dispatching/dispatching.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.muserInfo;
const plugin = requirePlugin('routePlan');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    // 当天日期
    curDate: "2021-10-01",
    // 查看配送状态
    sendStatus: 0,
    orderList: [],
    curCnt: 0,
    secCnt: 0,
    sendCnt: 0,
    status: 1,
    // 角色
    user_roleId: app.data.user_roleId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.muserInfo
    //今天日期
    var curDate = Utils.formatDate(0)
    this.data.curDate = curDate
    this.queryOrders()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  /**
   * 查询订单
   */
  queryOrders() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=QueryOrdersNew&appId=' + app.data.appid + "&timestamp=" + timestamp;
    // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
    // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货(配送中)7团购失败 12已支付定金
    // 预计送到开始结束时间sdeliverytime,edeliverytime 配送员 deliveryuserId
    var deliveryuserId = ''
    //非平台 配送中只看用户自己的
    if (this.data.sendStatus == 2 && this.data.user_roleId != 2) {
      deliveryuserId = appUserInfo.userId
    }
    var otherParam = "&linkNo=9&status=" + this.data.status + "&pageIndex=1&pageSize=99&companyId=" + app.data.agentCompanyId + "&sdeliverytime=" + this.data.curDate + " 00:00:00&edeliverytime=" + this.data.curDate + " 23:59:59&deliveryuserId=" + deliveryuserId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "查询订单", false, false, true)
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus(orderId, deliveryuserId, status, tag) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let signParam = 'cls=product_order&action=UpdateOrders&appId=' + app.data.appid + "&timestamp=" + timestamp + "&orderId=" + orderId;
    var otherParam = "&store=1&status=" + status + "&deliveryuserId=" + deliveryuserId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, tag, "更新订单状态")
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
            let curDate = Utils.formatDate(0)
            let status = 6
            let sendStatus = 2
            let curCnt = parseInt(that.data.curCnt)
            if (curCnt > 0) {
              curCnt = curCnt - 1
            }
            that.setData({
              sendStatus: sendStatus,
              status: status,
              curDate: curDate,
              curCnt: curCnt,
            })
            that.queryOrders()
            content = "接单成功"
            break
          case 2:
            that.queryOrders()
            content = "操作成功"
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
    var numName
    // 当日订单
    if (0 == that.data.sendStatus) {
      numName = "curCnt"
    }
    // 次日订单
    else if (1 == that.data.sendStatus) {
      numName = "secCnt"
    }
    // 配送中
    else {
      numName = "sendCnt"
    }
    that.setData({
      orderList: list,
      [numName]: data.cash.cnt,
    })

    if (0 == that.data.sendStatus || 2 == that.data.sendStatus) {
      that.setTimeCountDown()
    }
  },
  /**
   * 切换
   * @param {*} e 
   */
  switchStatus(e) {
    var that = this
    var tag = parseInt(e.currentTarget.dataset.tag)
    var sendStatus = that.data.sendStatus
    var status = that.data.status
    var curDate = that.data.curDate
    var orderList = []
    if (sendStatus == tag) {
      return
    }
    switch (tag) {
      case 0:
        sendStatus = 0
        status = 1
        curDate = Utils.formatDate(0)
        // curDate = Utils.formatDate(-20)
        break;
      case 1:
        sendStatus = 1
        status = 1
        curDate = Utils.formatDate(1)
        break;
      case 2:
        curDate = Utils.formatDate(0)
        // curDate = Utils.formatDate(-20)
        status = 6
        sendStatus = 2
        break;

      default:
        break;
    }
    that.setData({
      sendStatus: sendStatus,
      status: status,
      curDate: curDate,
      orderList: orderList,
    })
    that.queryOrders()
  },

  /**设置倒计时的时间 */
  setTimeCountDown: function () {

    var lists = this.data.orderList;

    if (lists == null || lists == undefined) return;
    var myDate = new Date();
    for (let i = 0; i < lists.length; i++) {
      //计算得到创建时间跟当前时间的毫秒差值
      var time = Utils.getTimeInterval(myDate.toString(), lists[i].deliverytime.toString(), 0)
      //计算团购时限天数条件下剩余的毫秒数
      // var milliseconds = parseInt(lists.data[i].groupDay) * 24 * 60 * 60 * 1000 - time
      lists[i].memberNickname = '倒计时：'
      lists[i].remainTime = time
    }

    this.setData({
      orderList: lists
    });
    this.setCountDown();
  },
  // 倒计时
  setCountDown: function () {
    var that = this;
    let time = 100;
    let {
      orderList
    } = this.data;
    let list = orderList.map((v, i) => {
      //过滤剩余毫秒数为0的记录
      if (v.remainTime != 0) {
        if (v.remainTime <= 0) {
          v.remainTime = 0;
        }
        let formatTime = this.getFormat(v.remainTime);
        v.remainTime -= time;
        //显示毫秒的
        // v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}.${parseInt(formatTime.ms / time)}`;
        // 没有毫秒显示
        v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;

        //更改订单状态
        if (v.remainTime <= 0) {
          v.countDown = "已超时"
        }
      } else {
        v.countDown = "已超时"
      }

      return v;
    })
    this.setData({
      orderList: orderList
    });
    setTimeout(this.setCountDown, time);
  },

  /**
   * 格式化时间
   */
  getFormat: function (msec) {
    let ss = parseInt(msec / 1000);
    let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
      }
    }
    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return {
      ms,
      ss,
      mm,
      hh
    };
  },

  gotoPage() {
    wx.navigateTo({
      url: '../patchhistory/patchhistory'
    })
  },

  /**
   * 立即接单/确认送达
   */
  updateOrder(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tag = parseInt(e.currentTarget.dataset.tag)
    var content
    var status

    switch (tag) {
      case 0:
        content = '是否确定接单?'
        status = 6
        break;
      case 1:
        content = '是否已送达?'
        status = 2
        break;

      default:
        break;
    }

    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          var userId = appUserInfo.userId
          var orderList = that.data.orderList
          that.updateOrderStatus(orderList[index].orderId, userId, status, tag + 1)
        } else if (res.cancel) {

        }
      }
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
// packageYK/pages/agentbusiness/agentbusiness.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize = 2
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: URL,
    SMDataURL: SMDataURL,
    DataURL: DataURL,
    teamtype: false, //显示合伙人下拉框
    divtype: false, //显示分成统计类型下拉框

    sstype: false, //搜索拉长
    useInoftype: false, //客户与游客显示金额页面

    constoList: [{
        name: "设备使用",
        id: 0,
      },
      {
        name: "酒店订房",
        id: 1,
      }, {
        name: "购物",
        id: 2,
      }
    ],
    constoIndex: 0,
    startDate: '2020-08-01',
    endDate: "2020-09-01",
    pageIndex: 1,
    // 11设备运营分成 12订房分成 13购物分成(酒店商品) 14购物分成(平台商品)
    dtype: 11,
    type: 1,
    dataArray: [],
    ptMoney: 0,
    jdMoney: 0,
    dlsMoney: 0,
    all: "",
    companyId: "",
    // 角色
    user_roleId: app.data.user_roleId,
    companyName: "",
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
    // 显示下拉酒店
    isShowHotel: false,
    selectHotelIndex: 0,
    iuid: "",
    // 按摩订单数据下拉框 查询数据
    param: "",
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
  //点击“分成统计类型”传参
  onchangeCS(e) {
    var index = e.currentTarget.dataset.index
    var constoIndex = this.data.constoIndex
    if (index == constoIndex) {
      this.setData({
        divtype: false, //显示设备使用率版面
      })
      return
    }

    // 按摩订单数据
    if (1 == this.data.flag) {
      var param = ""
      switch (parseInt(index)) {
        case 1:
          param = "&distr=2"
          break;
        case 2:
          param = "&lotteryProduct=0"
          break;
        case 3:
          param = "&distr=1"
          break;
        case 4:
          param = "&price=0&lotteryProduct=0,1,2"
          break;
        case 5:
          param = "&lotteryProduct=3"
          break;
      }
      this.setData({
        param: param,
        //显示设备使用率版面
        divtype: false,
        constoIndex: index,
      })
    } else {
      // 经营数据
      var dtype = 11
      if (index == 0) {
        dtype = 11
        this.setData({
          usagetype: true,
          divtype: false, //显示设备使用率版面
          dtype: dtype,
          constoIndex: index,
        })
      } else {
        dtype = "13,14"
        if (index == 1) {
          dtype = 12
        }
        this.setData({
          divtype: false,
          usagetype: false, //隐藏设备使用率版面
          dtype: dtype,
          constoIndex: index,
        })
      }

    }

    this.loadInitData()
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
    that.loadInitData()
  },
  //显示搜索长条
  onChangesstype() {
    this.setData({
      sstype: true
    })
  },
  //显示隐藏下拉框
  onChangeteamtype() {
    this.setData({
      teamtype: !this.data.teamtype
    })
  },
  //显示隐藏下拉框
  onChangedivtype(e) {
    var that = this
    var tag = parseInt(e.currentTarget.dataset.tag)
    switch (tag) {
      case 0:
        that.setData({
          divtype: !that.data.divtype
        })
        break;
      case 1:
        that.setData({
          isShowHotel: !that.data.isShowHotel
        })
        break;
    }

  },
  //隐藏所有显示
  ondelteamtype() {
    this.setData({
      teamtype: false,
      divtype: false,
      sstype: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 今天日期
    console.log(Utils.formatDate(0));
    // 近30天 日期
    var startDate = Utils.formatDate(-29)
    var endDate = Utils.formatDate(0)
    // 产品要求默认只要当前月的日期
    startDate = Utils.getCurMinDate()
    endDate = Utils.getCurMaxDate()

    // 0经营数据 1订单数据
    var flag = options.flag
    var constoList = this.data.constoList
    if (1 == flag) {
      constoList = [{
        name: "全部",
        id: 0,
      }, {
        name: "纸质按摩券",
        id: 1,
      }, {
        name: "抽奖按摩券",
        id: 2,
      }, {
        name: "电子按摩券",
        id: 3,
      }, {
        name: "0元",
        id: 4,
      }, {
        name: "免费按摩",
        id: 5,
      }]
      wx.setNavigationBarTitle({
        title: '按摩订单数据',
      })
    }
    this.setData({
      flag: flag,
      startDate: startDate,
      endDate: endDate,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
      constoList: constoList,
    })
    appUserInfo = app.globalData.userInfo;

    this.getHotleCompany()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  okDate() {
    this.loadInitData()
  },

  search() {
    this.loadInitData()
  },
  getInput: function (e) {
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "companyName"
        break;
      case 1:
        name = "iuid"
        break;
    }
    this.setData({
      [name]: value,
    })
  },

  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
      all: "",
      pageIndex: 1,
    })
    if (0 == that.data.flag) {
      // 获取第一页列表信息
      that.getDataList(pageSize, that.data.pageIndex, that.data.companyName);
    } else {
      that.queryAmCoupons()
    }
  },

  /**
   * 获取经营数据
   */
  getDataList(pageSize, pageIndex, companyName) {
    var signParam = 'cls=product_activity&action=QueryDivide'
    var dtype = this.data.dtype
    var otherParam = ""
    if (this.data.user_roleId != 2) {
      var userId = appUserInfo.userId
      var accountBindUserId = this.data.accountBindUserId
      if (!Utils.isNull(accountBindUserId) && accountBindUserId != 0) {
        userId = accountBindUserId
      }
      // userId = 9504
      // userId = 8033
      // userId = 8173
      otherParam = "&userId=" + userId
    }
    companyName = encodeURIComponent(companyName)
    otherParam = otherParam + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&companyName=" + companyName + "&startDate=" + this.data.startDate + " 00:00:00&endDate=" + this.data.endDate + " 23:59:59&sField=crateTime&sOrder=desc&dtype=" + dtype + "&companyId=" + this.data.companyId;
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "获取经营数据", false, false, true)
  },

  /**
   * 获取用户绑定的酒店
   */
  getHotleCompany() {
    var userId = appUserInfo.userId
    var accountBindUserId = this.data.accountBindUserId
    if (!Utils.isNull(accountBindUserId) && accountBindUserId != 0) {
      userId = accountBindUserId
    }
    let signParam = 'cls=main_rolePower&action=getRolePowerPowerList&roleId=' + app.data.user_roleId
    var otherParam = "&userId=" + userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 1, "获取用户绑定酒店")
  },

  /**
  * 发放和领取按摩券查询
  * userId用户,companyId公司,lotteryProductId活动券设置id,status状态,isUse使用标识,
   type类型,duration时长,lotteryProduct券标识(0抽奖商品1付费商品,-1抽奖机会,2按摩劵),,orderNo关联单据,deviceNo设备号,distr发放类型(1电子2纸质0其他),
   startDate开始时间,endDate结束时间,sField排序字段,sOrder升降序&pIndex当前页&pSize分页大小
  */
  queryAmCoupons() {
    let signParam = 'cls=product_coupons&action=QueryAmCoupons'
    var otherParam = "&companyId=" + this.data.companyId + "&isUse=1&userId=" + this.data.iuid + "&startDate=" + this.data.startDate + " 00:00:00&endDate=" + this.data.endDate + " 23:59:59&pSize=" + pageSize + "&pIndex=" + this.data.pageIndex + this.data.param + "&sField=useTime&sOrder=desc"
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 2, "发放和领取按摩券查询", false, false, true)
  },

  getRuslt: function (data, code, error, tag) {
    let that = this
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            let moneyData = data.data
            if (Utils.isNull(that.data.all) && moneyData.length > 0) {
              for (let i = 0; i < moneyData.length; i++) {
                // 2平台3代理商4酒店5平台业务员6合作商
                if (moneyData[i].role_typeId == 2) {}

                var amount = moneyData[i].amount
                if (Utils.isNull(amount)) {
                  amount = 0
                }
                amount = parseFloat(amount).toFixed(2)
              }

              var all = data.all
              if (Utils.isNull(all)) {
                all = 0
              }
              all = parseFloat(all).toFixed(2)

              that.setData({
                cnt: data.cnt,
                all: all,
                moneyData: moneyData,
              })
            }
            let dataList = data.list
            if (dataList.length > 0) {
              for (let i = 0; i < dataList.length; i++) {
                if (Utils.isNull(dataList[i].deviceNo)) {
                  dataList[i].deviceNo = ""
                }
                if (Utils.isNull(dataList[i].dremark)) {
                  dataList[i].dremark = ""
                }
                if (Utils.isNull(dataList[i].model)) {
                  dataList[i].model = ""
                }
                if (Utils.isNull(dataList[i].operation_userId)) {
                  dataList[i].operation_userId = ""
                }
                if (Utils.isNull(dataList[i].duration)) {
                  dataList[i].duration = ""
                }
                if (Utils.isNull(dataList[i].crateTime)) {
                  dataList[i].crateTime = ""
                }
                for (let j = 0; j < dataList[i].detail.length; j++) {
                  var detail = dataList[i].detail[j]
                  // 2平台3代理商4酒店5平台业务员6合作商
                  if (detail.role_typeId == 2) {}

                  var money = detail.money
                  if (Utils.isNull(money)) {
                    money = 0
                  }
                  money = parseFloat(money).toFixed(2)
                }
              }
              // 直接将新一页的数据添加到数组里
              that.setData({
                dataArray: that.data.dataArray.concat(dataList)
              })
            } else if (that.data.pageIndex == 1) {
              wx.showToast({
                title: "暂无数据",
                icon: 'none',
                duration: 1500
              })
            } else {
              that.data.pageIndex--
              wx.showToast({
                title: "数据加载完毕",
                icon: 'none',
                duration: 1500
              })
            }
            break;
          case 1:
            if (data.CompanydataList.length > 0) {
              that.setData({
                CompanydataList: data.CompanydataList,
                companyId: data.CompanydataList[0].id,
                selectHotelIndex: 0,
              })
            }
            that.loadInitData()
            break
          case 2:
            if (data.list.length > 0) {
              that.setData({
                cnt: data.all.cnt,
                dataArray: that.data.dataArray.concat(data.list),
              })
            } else if (that.data.pageIndex == 1) {
              wx.showToast({
                title: "暂无数据",
                icon: 'none',
                duration: 1500
              })
            } else {
              that.data.pageIndex--
              wx.showToast({
                title: "数据加载完毕",
                icon: 'none',
                duration: 1500
              })
            }
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },
  //下拉加载
  onReachBottom: function () {
    console.log("下拉刷新运行了");
    //重新获取数据
    this.bindDownLoad();
    //数据获取后停止下拉刷新
    wx.stopPullDownRefresh();
  },
  onPullDownRefresh: function () {
    console.log("上拉刷新运行了");
    //重新获取数据
    this.bindTopLoad();
    //数据获取后停止下拉刷新
    wx.stopPullDownRefresh();
  },
  bindTopLoad() {

  },
  bindDownLoad() {
    this.setData({
      pageIndex: ++this.data.pageIndex
    })
    if (0 == this.data.flag) {
      // 获取第一页列表信息
      this.getDataList(pageSize, this.data.pageIndex, this.data.companyName);
    } else {
      this.queryAmCoupons()
    }
  },
})
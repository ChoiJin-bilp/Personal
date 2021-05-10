// packageYK/pages/deviceSrvOrder/deviceSrvOrder.js
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
    isLoad: false, //是否已经加载
    isForbidRefresh: false, //是否禁止刷新

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
    cnt: 0,
    startDate: '2020-08-01',
    endDate: "2020-09-01",
    CompanydataList: [],
    selCompanydataIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    // 今天日期
    console.log(Utils.formatDate(0));
    // 近30天 日期
    var startDate = Utils.formatDate(-29)
    var endDate = Utils.formatDate(0)
    // 产品要求默认只要当前月的日期
    startDate = Utils.getCurMinDate()
    endDate = Utils.getCurMaxDate()

    var user_roleId = app.data.user_roleId
    if (Utils.isNull(user_roleId) || user_roleId == 0) {
      user_roleId = 1
    }
    that.setData({
      startDate: startDate,
      endDate: endDate,
      user_roleId: user_roleId,
    })

    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,
      isScene = false,
      dOptions = null,
      paramShareUId = 0;
    console.log("加载参数：");
    console.log(options)
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })
        break;

      default:
        appUserInfo = app.globalData.userInfo;
        that.getUserLotteryRecordt()
        if (that.data.user_roleId > 1) {
          that.getHotleCompany()
        } else {
          that.loadInitData()
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
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
        }
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
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
  showSelectCompanyList() {
    this.setData({
      isShowSelectCompanyList: !this.data.isShowSelectCompanyList,
    })
  },
  /**
   * 选择酒店公司/商品分类
   */
  bindPickerCompanyChange: function (e) {
    let index = e.currentTarget.dataset.index
    var tag = parseInt(e.currentTarget.dataset.tag)
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    switch (tag) {
      case 0:
        if (that.data.selCompanydataIndex == index) {
          that.setData({
            isShowSelectCompanyList: false,
          })
          return
        }
        that.setData({
          selCompanydataIndex: index,
          isShowSelectCompanyList: false,
        })
        that.loadInitData()
        break;
      default:
        break;
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----设备信息列表---------------------------------------------------------
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData();
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this
    let currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    let that = this
    let currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    let tips = "加载第" + (currentPage) + "页";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex) {
    var userId = appUserInfo.userId
    // userId = 8033
    // userId = 12436
    // status(状态 0有效 1无效',),  
    let that = this
    var companyId = app.data.companyId
    if (that.data.CompanydataList.length > 0) {
      companyId = that.data.CompanydataList[that.data.selCompanydataIndex].id
    }
    // type 0没有奖项1有优惠卷2按摩3优惠卷和按摩4购买充值抽奖记录',
    var otherParamCon = "&xcxAppId=" + app.data.wxAppId + "&userId=" + userId + "&status=0&type=0,2&companyId=" + companyId + "&stime=" + that.data.startDate + " 00:00:00&etime=" + that.data.endDate + " 23:59:59";
    //按产品要求只看已使用的记录
    // otherParamCon += "&isUse=1";
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getShareStatData(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,
      noDataAlert = "暂无按摩订单信息！";
    wx.hideLoading();
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        console.log("获取按摩订单列表：")
        console.log(dataList);
        let articles = [];
        if (Utils.isNotNull(dataList)) {
          if (Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            let dataItem = null,
              listItem = null;
            let putAddress = "",
              deviceNumber = "",
              deviceAddress = "",
              zfno = "",
              createDate = "",
              minutes = 0,
              percentage = 0,
              amount = 0.00,
              dtCreate = new Date(),
              isUse = 0,
              lotteryProduct = 0;
            for (let i = 0; i < dataList.dataList.length; i++) {
              dataItem = null;
              listItem = null;
              dataItem = dataList.dataList[i];
              putAddress = "";
              deviceNumber = "";
              deviceAddress = "";
              zfno = "";
              createDate = "";
              minutes = 0;
              percentage = 0;
              amount = 0.00;
              isUse = 0;
              lotteryProduct = 0;
              // 7天内可以申请退款
              var buyDay = 0
              if (Utils.isNotNull(dataItem.crateTime)) {
                try {
                  dtCreate = new Date(Date.parse((dataItem.crateTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtCreate = new Date();
                }
                createDate = Utils.getDateTimeStr3(dtCreate, "-", 0);
                buyDay = Utils.getTimesByDateTime(dtCreate, new Date(), 0)
              }
              if (Utils.isNotNull(dataItem.zfno) && Utils.myTrim(dataItem.zfno + "") != "null")
                zfno = dataItem.zfno;
              if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress + "") != "null")
                deviceAddress = dataItem.deviceAddress;
              if (Utils.isNotNull(dataItem.address) && Utils.myTrim(dataItem.address + "") != "null")
                putAddress = dataItem.address;
              if (Utils.isNotNull(dataItem.number) && Utils.myTrim(dataItem.number + "") != "null")
                deviceNumber = dataItem.number;
              if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                try {
                  minutes = parseInt(dataItem.duration);
                  minutes = isNaN(minutes) ? 0 : minutes;
                } catch (e) {}
              }
              if (Utils.isNotNull(dataItem.percent) && Utils.myTrim(dataItem.percent + "") != "null") {
                try {
                  percentage = parseFloat(dataItem.percent);
                  percentage = isNaN(percentage) ? 0.00 : percentage;
                } catch (e) {}
              }
              if (Utils.isNotNull(dataItem.price) && Utils.myTrim(dataItem.price + "") != "null") {
                try {
                  amount = parseFloat(dataItem.price);
                  amount = isNaN(amount) ? 0.00 : amount;
                } catch (e) {}
              }
              if (Utils.isNotNull(dataItem.isUse) && Utils.myTrim(dataItem.isUse + "") != "null") {
                try {
                  isUse = parseInt(dataItem.isUse);
                  isUse = isNaN(isUse) ? 0 : isUse;
                } catch (e) {}
              }
              //lotteryProduct
              if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
                try {
                  lotteryProduct = parseInt(dataItem.lotteryProduct);
                  lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
                } catch (e) {}
              }
              listItem = {
                id: dataItem.id,
                zfno: zfno,
                deviceAddress: deviceAddress,
                putAddress: putAddress,
                deviceNumber: deviceNumber,
                minutes: minutes,
                percentage: percentage,
                amount: amount,
                createDate: createDate,
                isUse: isUse,
                payStatus: dataItem.payStatus,
                buyDay: buyDay,
                lotteryProduct: lotteryProduct,
              }
              articles.push(listItem);
            }

          }
        }

        if (articles.length > 0) {
          // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
          var totalDataCount = that.data.totalDataCount;
          totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
          console.log("totalDataCount:" + totalDataCount);

          // 直接将新一页的数据添加到数组里
          that.setData({
            ["dataArray[" + pageIndex + "]"]: articles,
            currentPage: articles.length > 0 ? pageIndex : that.data.currentPage,
            totalDataCount: totalDataCount,
          })
        } else if (pageIndex == 1) {
          wx.showToast({
            title: noDataAlert,
            icon: 'none',
            duration: 2000
          })
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无" + mainTypeName + "信息！";
        break;
    }
  },
  gotoPage: function (e) {
    var id = e.currentTarget.dataset.id
    let that = this
    var url = "../../../packageYK/pages/refund/refund?id=" + id + "&type=0";
    console.log(url)
    wx.navigateTo({
      url: url
    });
  },
  goFeedbackPage: function (e) {
    var id = e.currentTarget.dataset.id
    let that = this
    var url = "../../../packageYK/pages/feedback/feedback?id=" + id;
    console.log(url)
    wx.navigateTo({
      url: url
    });
  },
  goMessDetailPage: function (e) {
    var id = e.currentTarget.dataset.id
    let that = this
    var url = "../../../packageYK/pages/refund/refund?id=" + id + "&type=1";
    console.log(url)
    wx.navigateTo({
      url: url
    });
  },
  /**
   * 按摩消费订单申请和查询
   */
  getUserLotteryRecordt() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId = 8033
    let signParam = 'cls=main_lotteryActivityProduct&action=UserLotteryRecord&appId=' + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId + "&id="
    var otherParam = "&pIndex=1&pSize=20&mode=q&pstatus=3,4,5"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "按摩消费订单申请和查询", false, false, true)
  },

  /**
   * 获取用户绑定的酒店
   */
  getHotleCompany() {
    let signParam = 'cls=main_rolePower&action=getRolePowerPowerList&roleId=' + this.data.user_roleId
    var otherParam = "&userId=" + appUserInfo.userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 1, "获取用户绑定酒店")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            that.setData({
              // 消息总数
              cnt: data.cnt,
            })
            break
          case 1:
            that.setData({
              CompanydataList: data.CompanydataList,
            })
            setTimeout(that.loadInitData, 800)
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },
})
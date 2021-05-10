// packageYK/pages/applyAccountList/applyAccountList.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutGotoList = null;
var pageSize = 20,packYkPageUrl = "../../../packageYK/pages", mainPackageDir = "../../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isForbidRefresh: false,
    isLoad: false, //是否已经加载

    curStatId: 0,                    //当前所选查看数据类型
    statTypeList: [
      { name: "待审核", id: 0 },
      { name: "已通过", id: 1 },
      { name: "已拒绝", id: 2 }
    ],
    investorList: [
      { id: 1, name: "平台", checked: true },
      { id: 2, name: "酒店", checked: false },
      { id: 3, name: "代理商", checked: false },
    ],

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0;
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
    var that = this, isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })
        break;

      default:
        appUserInfo = app.globalData.userInfo;
        that.loadInitData();
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
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //事件：选择查看数据状态类型
  selectStatType(e) {
    let that=this;
    console.log(e.currentTarget.dataset.id)
    that.setData({
      curStatId: e.currentTarget.dataset.id,
    })
    that.loadInitData();
  },
  //////////////////////////////////////////////////////////////////////
  //----信息列表---------------------------------------------------------
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
    let that = this;
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
    let that = this;
    let currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this, curStatId = that.data.curStatId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon = otherParamCon + "&status=" + curStatId;
    if (app.data.user_roleId != 2) {
      //如果为非平台管理员则只能看自己的申请列表
      otherParamCon += "&userId=" + appUserInfo.userId;
    }
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getPartnerPageList(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取账户申请列表结果处理函数
  dowithGetPartnerPageList: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,noDataAlert = "暂无信息！";
    wx.hideLoading();
    that.data.isLoad=true;
    switch (tag) {
      case 1:
        console.log("账户申请列表结果：")
        console.log(dataList)
        let data = dataList,dataItem = null,detailItem = null,listItem = null,articles = [],videoList = [];
        if (Utils.isNotNull(data.dataList) && data.dataList.length > 0) {
          let id = 0, hotelName = "", equipmentAcquirer = 0, equipmentAcquirerName = "", addr = "", contact = "", mobile = "", proposer = "", status=0, createDate = "", updateDate="",dtDate=new Date();
          let investorList = that.data.investorList;
          for (let i = 0; i < data.dataList.length; i++) {
            dataItem = null; listItem = null; dataItem = data.dataList[i];
            id = dataItem.id; hotelName = ""; equipmentAcquirer = 0; equipmentAcquirerName = ""; addr = ""; contact = ""; mobile = ""; proposer = ""; status=0; createDate = ""; updateDate = "";
            if (Utils.isNotNull(dataItem.createDate)) {
              try {
                dtDate = new Date(Date.parse((dataItem.createDate + "").replace(/-/g, "/")))
              } catch (e) {
                dtDate = new Date();
              }
              createDate = Utils.getDateTimeStr3(dtDate, "-", 0);
            }
            if (Utils.isNotNull(dataItem.updateDate)) {
              try {
                dtDate = new Date(Date.parse((dataItem.updateDate + "").replace(/-/g, "/")))
              } catch (e) {
                dtDate = new Date();
              }
              updateDate = Utils.getDateTimeStr3(dtDate, "-", 0);
            }
            if (Utils.isNotNull(dataItem.hotelName) && Utils.myTrim(dataItem.hotelName + "") != "null")
              hotelName = dataItem.hotelName;
            if (Utils.isNotNull(dataItem.addr) && Utils.myTrim(dataItem.addr + "") != "null")
              addr = dataItem.addr;
            if (Utils.isNotNull(dataItem.contact) && Utils.myTrim(dataItem.contact + "") != "null")
              contact = dataItem.contact;
            if (Utils.isNotNull(dataItem.mobile) && Utils.myTrim(dataItem.mobile + "") != "null")
              mobile = dataItem.mobile;
            if (Utils.isNotNull(dataItem.proposer) && Utils.myTrim(dataItem.proposer + "") != "null")
              proposer = dataItem.proposer;
            if (Utils.isNotNull(dataItem.equipmentAcquirer) && Utils.myTrim(dataItem.equipmentAcquirer + "") != "null") {
              try {
                equipmentAcquirer = parseInt(dataItem.equipmentAcquirer);
                equipmentAcquirer = isNaN(equipmentAcquirer) ? 0 : equipmentAcquirer;
              } catch (err) { }
            }
            for (let n = 0; n < investorList.length;n++){
              if (investorList[n].id == equipmentAcquirer){
                equipmentAcquirerName=investorList[n].name;
                break;
              }
            }
            if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
              try {
                status = parseInt(dataItem.status);
                status = isNaN(status) ? 0 : status;
              } catch (err) { }
            }
            
            listItem = {
              id: id, hotelName: hotelName, equipmentAcquirer: equipmentAcquirer, equipmentAcquirerName: equipmentAcquirerName, addr: addr, contact: contact, mobile: mobile, proposer: proposer, createDate: createDate, updateDate: updateDate, status: status,
            }

            articles.push(listItem);
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
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : noDataAlert;
        break;
    }
  },
  //事件：查看账户详情
  viewDetail:function(e){
    let that = this, id = e.currentTarget.dataset.id, url = packYkPageUrl +"/applyAccount/applyAccount?id="+id;
    console.log("viewDetail:"+url)
    wx.navigateTo({
      url: url
    });
  },
})
// packageYK/pages/statShare/statShare.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl, URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL =app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, pageSize = 20;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    DataURL: DataURL,
    isLoad: false,                     //是否已经加载
    isForbidRefresh: false,            //是否禁止刷新

    isShowPartnerList: false,          //合作商下拉框显示
    isShowCompanyList: false,          //合作商公司下拉显示
    
    selParterId: 0,                    //合作商ID
    selParterName:"",                  //合作商名称
    selAgentUserCompanyId:0,           //合作商公司ID
    selAgentUserCompanyName:"",        //合作商公司名称

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    totalCommission: 0.00,   //累计佣金
    partnerList: [],         //合作商列表
    agentUserCompanyList:[], //合作商公司列表
    
    searchKeyword: "",      //搜索关键字

    roleStatus: 0,           //当前用户角色
  },
  onChangeShowPartnerList() {
    this.setData({
      ["isShowPartnerList"]: !this.data.isShowPartnerList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    let that = this;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        let selParterId = 0;
        //如果为管理员则查看所有，否则只能查看自己的统计数据
        selParterId = appUserInfo.roleStatus == 1 ? 0 : appUserInfo.userId;
        that.setData({
          ["roleStatus"]: appUserInfo.roleStatus,
          ["selParterId"]: selParterId,
        })
        that.getMainDataInfo();
        break;
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    let that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    let that = this;
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
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo == undefined) {
      return;
    } else {
      if (!that.data.isLoad)
        that.data.isLoad = true;
      else {
        that.setData({
          ["roleStatus"]: appUserInfo.roleStatus,
        })
        console.log("onShow")
      }
    }
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;

    console.log("changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "keyword":
        that.setData({
          searchKeyword: value
        })
        break;
    }
  },
  //事件：选择查询合伙人统计数据
  selPartnerData: function (e) {
    let that = this, item = e.currentTarget.dataset.item, selParterId = 0, selParterName="";
    if (Utils.isNotNull(item)){
      selParterName = Utils.myTrim(item.userName);
      try {
        selParterId = parseInt(item.userId);
        selParterId = isNaN(selParterId) ? 0 : selParterId;
      } catch (e) { }
    }
    
    that.setData({
      ["selParterId"]: selParterId,
      ["selParterName"]: selParterName,

      ["selAgentUserCompanyId"]:0,
      ["isShowPartnerList"]: false,
    })
    that.getAgentUserCompanyList(selParterId);
  },
  //方法：获取代理商的公司信息列表
  getAgentUserCompanyList: function (selParterId) {
    let that = this, otherParams = "&xcxAppId=" + app.data.wxAppId + "&companyChildUserId=" + selParterId;
    app.getCompanyMainDataInfo(that, otherParams);
  },
  //方法：获取代理商的公司信息列表结果处理函数
  dowithGetCompanyMainDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取代理商的公司信息列表结果：");
        console.log(dataList);
        let data = dataList, dataItem = null, listItem = null, agentUserCompanyList = [], selAgentUserCompanyId = 0, selAgentUserCompanyName = "";
        if (Utils.isNotNull(data) && Utils.isNotNull(data.companyMsg) && data.companyMsg.length > 0) {
          let id = 0, companyName = "";
          for (let i = 0; i < data.companyMsg.length; i++) {
            id = 0; companyName = "";
            dataItem = null; listItem = null; dataItem = data.companyMsg[i];
            id = dataItem.id;

            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              companyName = dataItem.companyName;

            if(i==0){
              selAgentUserCompanyId = id; selAgentUserCompanyName = companyName;
            }
            listItem = {
              id: id, companyName: companyName,
            }
            agentUserCompanyList.push(listItem);
          }
        }
        console.log(agentUserCompanyList)
        that.setData({
          ["agentUserCompanyList"]: agentUserCompanyList,
          ["selAgentUserCompanyId"]: selAgentUserCompanyId,
          ["selAgentUserCompanyName"]: selAgentUserCompanyName,
        })
        that.loadInitData();
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取公司信息列表失败！";
        break;
    }
  },
  //事件：选择代理公司事件
  selCompanyList:function(e){
    let that = this, item = e.currentTarget.dataset.item, selAgentUserCompanyId = 0, selAgentUserCompanyName="";
    if (Utils.isNotNull(item)) {
      selAgentUserCompanyName = Utils.myTrim(item.companyName);
      try {
        selAgentUserCompanyId = parseInt(item.id);
        selAgentUserCompanyId = isNaN(selAgentUserCompanyId) ? 0 : selAgentUserCompanyId;
      } catch (e) { }
    }
    that.setData({
      ["selAgentUserCompanyId"]: selAgentUserCompanyId,
      ["selAgentUserCompanyName"]: selAgentUserCompanyName,

      ["isShowCompanyList"]:false,
    })
    that.loadInitData();
  },
  getMainDataInfo: function () {
    let that = this;

    app.getPartnerList(that, "");
    if (that.data.selParterId>0){
      that.getAgentUserCompanyList(that.data.selParterId);
    }
    //that.loadInitData();
  },

  //方法：获取合伙人记录结果处理函数
  dowithGetPartnerList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取合伙人记录结果：");
        console.log(dataList);
        let data = dataList, dataItem = null, listItem = null, partnerList = [];
        let userId = 0, userName = "", partnerName = "";
        if (Utils.isNotNull(data.dataList) && data.dataList.length > 0) {
          for (let i = 0; i < data.dataList.length; i++) {
            dataItem = null; dataItem = data.dataList[i]; listItem = null;
            userId = 0; userName = ""; partnerName = "";
            if (Utils.isNotNull(dataItem.id) && Utils.myTrim(dataItem.id + "") != "") {
              try {
                userId = parseInt(dataItem.id);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) { }
            }
            if (Utils.isNotNull(dataItem.contact) && Utils.myTrim(dataItem.contact + "") != "")
              userName = dataItem.contact;
            if (Utils.isNotNull(dataItem.name) && Utils.myTrim(dataItem.name + "") != "")
              partnerName = dataItem.name;

            listItem = { userId: userId, userName: userName, partnerName: partnerName }
            partnerList.push(listItem);
          }
        }
        that.setData({
          ["partnerList"]: partnerList,
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取合伙人失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----分成统计信息列表---------------------------------------------------------
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
    let that = this, selParterId = that.data.selParterId, searchKeyword = that.data.searchKeyword, otherParamCon = "&xcxAppId=" + app.data.wxAppId + "&companyId=" + that.data.selAgentUserCompanyId + "&status=0&lotteryProduct=1";
    //关键字
    if (Utils.myTrim(searchKeyword) != '') {
      otherParamCon += "&kword=" + encodeURIComponent(searchKeyword);
    }
    
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getShareStatData(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无分成统计信息！";
    wx.hideLoading();
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        console.log("获取分成统计列表信息：")
        console.log(dataList);
        let articles = [], totalCommission = 0.00;
        if (Utils.isNotNull(dataList)) {
          if (Utils.isNotNull(dataList.totalNomey)) {
            try {
              totalCommission = parseFloat(dataList.totalNomey);
              totalCommission = isNaN(totalCommission) ? 0.00 : totalCommission;
            } catch (e) { }
            totalCommission = parseFloat(totalCommission.toFixed(app.data.limitQPDecCnt));
          }
          if (Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            let dataItem = null, listItem = null;
            let putAddress = "", deviceNumber = "", minutes = 0, percentage = 0, amount = 0.00;
            for (let i = 0; i < dataList.dataList.length; i++) {
              dataItem = null; listItem = null; dataItem = dataList.dataList[i];
              putAddress = ""; deviceNumber = ""; minutes = 0; percentage = 0; amount = 0.00;
              if (Utils.isNotNull(dataItem.address) && Utils.myTrim(dataItem.address + "") != "null")
                putAddress = dataItem.address;
              if (Utils.isNotNull(dataItem.number) && Utils.myTrim(dataItem.number + "") != "null")
                deviceNumber = dataItem.number;
              if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                try {
                  minutes = parseInt(dataItem.duration);
                  minutes = isNaN(minutes) ? 0 : minutes;
                } catch (e) { }
              }
              if (Utils.isNotNull(dataItem.percent) && Utils.myTrim(dataItem.percent + "") != "null") {
                try {
                  percentage = parseFloat(dataItem.percent);
                  percentage = isNaN(percentage) ? 0.00 : percentage;
                } catch (e) { }
              }
              if (Utils.isNotNull(dataItem.price) && Utils.myTrim(dataItem.price + "") != "null") {
                try {
                  amount = parseInt(dataItem.price);
                  amount = isNaN(amount) ? 0.00 : amount;
                } catch (e) { }
              }
              listItem = { id: dataItem.id, putAddress: putAddress, deviceNumber: deviceNumber, minutes: minutes, percentage: percentage, amount: amount }
              articles.push(listItem);
            }

          }
        }
        //articles = app.dowithGetHotelInfoDataList(that, dataList, selTypeDataItem.type, false, null);

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

            ["totalCommission"]: totalCommission,
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
  onChangeCompanyList(){
    this.setData({
      isShowCompanyList:!this.data.isShowCompanyList
    })
  }
})
// pages/walletdetail/walletdetail.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var defaultProImg = "noimg.png", lastSort = 0, saveProData = [], patchCnt = 8;
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, isDowithing = false;
var pageSize = app.data.pageSize;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,          //资源地址前缀
    isLoad: false,             //是否已经加载

    remainingSum:0.00,      //剩余余额

    totalDataCount: 0,      //总记录数
    currentPage: 0,         //当前页码
    articles: [],           //记录集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    var remainingSum=0.00;
    try {
      if (options.rmsum != null && options.rmsum != undefined)
        remainingSum = parseFloat(options.rmsum); remainingSum = isNaN(remainingSum) ? 0 : remainingSum;
    } catch (e) { }
    that.setData({
      remainingSum: remainingSum,
    })
    that.loadInitData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) 
        return;
      else
        that.loadInitData();
    }
  },
  //事件：下拉加载更多
  bindDownLoad: function () {
    this.loadMoreData();
  },
  //事件：上拉刷新
  bindTopLoad: function () {
    this.loadInitData();
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    that.setData({
      dataArray: [],
    });

    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取产品列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=redEnvelope_changePurse&action=changePurseInfo&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        that.data.isLoad = true;
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var data = res.data.data, dataItem = null, listItem = null, articles = [];
          var id = 0, type = 0, typeValue = "",partner_trade_no="",orderId="", money = 0.00, createDate = "", cDate = null,tag=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; type = 0; typeValue = "";partner_trade_no="";orderId=""; money = 0.00; createDate = ""; cDate = null;tag=0;
            dataItem = null; listItem = null; dataItem = data[i];
            //id = dataItem.id;
            id++;
            if (Utils.isDBNotNull(dataItem.partner_trade_no)){
              partner_trade_no = dataItem.partner_trade_no;
            }
            if (Utils.isDBNotNull(dataItem.orderId)){
              orderId = dataItem.orderId;
            }
            if (Utils.isDBNotNull(dataItem.createDate)) {
              try {
                cDate = new Date(Date.parse((dataItem.createDate + "").replace(/-/g, "/")))
              } catch (e) { cDate = new Date(); }
              createDate = Utils.getDateTimeStr(cDate, "/", true);
            }
            if (Utils.isDBNotNull(dataItem.money)){
              try{
                money = parseFloat(dataItem.money);
                money = isNaN(money) ? 0.00 : money;
              }catch(e){}
            }              
            if (Utils.isDBNotNull(dataItem.type))
            {
              try{
                type = parseInt(dataItem.type);
                type = isNaN(type) ? 0 : type;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.typeValue)) typeValue = dataItem.typeValue;

            //1充值  2提现 3积分抽奖 4发红包 5领红包 6红包回退 19不可提现的充值
            for(let n=0;n<app.data.walletdetailTypeList.length;n++){
              if(type==app.data.walletdetailTypeList[n].id){
                typeValue=app.data.walletdetailTypeList[n].name;
                tag=app.data.walletdetailTypeList[n].tag=="+"?0:-1;
              }
            }
            listItem = {
              id: id, type: type, typeValue: typeValue,partner_trade_no:partner_trade_no,orderId:orderId, money: money, createDate: createDate,tag:tag,
            }
            articles.push(listItem);
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
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取信息列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.hideLoading();
        wx.showToast({
          title: "获取信息列表接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取信息列表接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：查看详情
  viewIntegerDetail:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      if(Utils.isNotNull(item.orderId) && Utils.myTrim(item.orderId)!=""){
        let url="/packageVP/pages/mkghetrstwo/mkghetrstwo?lp=1&oid="+item.orderId+"&uid="+item.userId;
        wx.navigateTo({
          url: url,
        })
      }else{
        wx.showToast({
          title: "订单号为空无法查看详情！",
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})
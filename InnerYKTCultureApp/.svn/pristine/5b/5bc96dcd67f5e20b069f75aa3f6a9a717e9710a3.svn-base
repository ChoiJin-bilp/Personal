// packageYK/pages/beverageList/beverageList.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize = app.data.pageSize,defaultItemImgSrc = DataURL + app.data.defaultImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,

    totalDataCount: 0,      //总记录数
    currentPage: 0,         //当前页码
    articles: [],           //记录集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.loadInitData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
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
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "",otherParams="";
    otherParams+="&userId=" + appUserInfo.userId +"&status=1,2,6&sField=id&sOrder=desc&linkNo=8,9"
    timestamp = timestamp / 1000;
    urlParam = "cls=product_order&action=QueryOrdersNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pSize=" + pageSize + "&pIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        that.data.isLoad = true;
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0 && res.data.list != null && res.data.list != undefined) {
          var data = res.data.list, dataItem = null, listItem = null, articles = [];
          var id = 0, orderId = "";
          for (var i = 0; i < data.length; i++) {
            id = 0; orderId = "";
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.orderId)){
              orderId = dataItem.orderId;
            }
            dataItem.detail=[];
            
            articles.push(dataItem);
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

            for(let n=0;n<articles.length;n++){
              that.getOrderDetailByOId(articles[n].orderId,pageIndex,n);
            }
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
  //方法：获取订单详情
  getOrderDetailByOId: function (orderId,pageIndex,index) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    urlParam = "cls=product_order&action=QueryOrdersDetailNew&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&orderId=" + orderId + "&sign=" + sign;
    console.log('查询订单详情URL:'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("查询订单详情结果：")
        console.log(res)
        if (res.data.rspCode == 0) {
          if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
            let dataItem=null,imagesArray=null,cDate=new Date(), vDtStartTimeStr="",vDtEndTimeStr="";
            for(let i=0;i<res.data.data.length;i++){
              dataItem=null;dataItem=res.data.data[i];
              //图片处理
              if (Utils.isDBNotNull(dataItem.detailPhotos)) {
                imagesArray = null;
                imagesArray = dataItem.detailPhotos.split(",");
                res.data.data[i].detailPhotos = imagesArray != null && imagesArray.length > 0 ? imagesArray[0] : defaultItemImgSrc;
              }
            }
            that.setData({
              ["dataArray["+pageIndex+"]["+index+"].detail"]: res.data.data,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.rspMsg,
            showCancel:false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          app.setErrorMsg2(that, "查询订单详情：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        try{
          wx.hideLoading();
        }catch(e){}
        
        wx.showToast({
          title: "查询订单详情接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "查询订单详情接口：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  
  goDetail(e) {
    var item = e.currentTarget.dataset.item
    console.log(item)
    var url = "/packageOther/pages/successDetailspa/successDetailspa?lp=1&oid=" + item.orderId + "&companyId=" + item.companyId;
    wx.navigateTo({
      url: url,
    })
  },
})
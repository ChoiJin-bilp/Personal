// packageVP/pages/Yantea/Yantea.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    isLoad: false,             //是否已经加载
    isForbidRefresh: false,    //是否禁止刷新

    sStartDate:"",
    sEndDate:"",

    totalDataCount: 0,      //总记录数
    currentPage: 0,         //当前页码
    articles: [],           //记录集合
    allRecordMoney:0.00,    //总共记录返利

    startDate: '2020-08-01',
    endDate: "2020-09-01",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, isScene = false, dOptions = null;
    console.log("加载源参数：");
    console.log(options);
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }
    //获取分享人ID
    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    that.data.paramShareUId = paramShareUId;

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
        console.log('=========onload============');
        let stDate=new Date(),etDate=Utils.getDateTimeAddDays(stDate,1),sStartDate="",sEndDate="";
        
        //获取等级和金额
        that.getMyDataInfo();

        stDate=Utils.getDateTimeAddDays(stDate,-30);
        sStartDate=Utils.getDateTimeStr(stDate,"/",false);
        sEndDate=Utils.getDateTimeStr(etDate,"/",false);
        that.setData({
          ["sStartDate"]: sStartDate,
          ["sEndDate"]:sEndDate,
        })
        //获取使用我图片的订单列表
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
      else{
        let tag = -1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        if (tag >= 0) {
          //tag:0日期选择
          switch(tag){
            case 0:
              let selDTStartValue = "", selDTEndValue = "";
              try {
                let pages = getCurrentPages();
                let currPage = pages[pages.length - 1];
                selDTStartValue = currPage.data.paramstart;
                selDTEndValue = currPage.data.paramend;
              } catch (err) { }
              that.setData({
                ["sStartDate"]: selDTStartValue,
                ["sEndDate"]:selDTEndValue,
              })
              that.loadInitData();
              break;
            
          }
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) { }
          
        }
        if(!that.data.isForbidRefresh){
          that.loadInitData();
        }
      }
    }
    that.data.isForbidRefresh=false;
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
      ["allRecordMoney"]:0.00,
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
  //方法：获取数据列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this,sStartDate=that.data.sStartDate,sEndDate=that.data.sEndDate,otherParams="&companyId="+app.data.companyId+"&userId="+appUserInfo.userId;
    if(Utils.myTrim(sStartDate) != "" && Utils.myTrim(sEndDate) != ""){
      otherParams+="&startDate="+encodeURIComponent(sStartDate)+"&endDate="+encodeURIComponent(sEndDate);
    }
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_myUsedImage&action=myImageList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log('获取被用图片订单信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading();
        console.log('获取被用图片订单结果')
        console.log(res.data)
        that.data.isLoad = true;
        
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.dataList)) {
          var data = res.data.data.dataList, dataItem = null, listItem = null, articles = [],allRecordMoney=that.data.allRecordMoney;
          var id = 0, orderId = "",imageId=0, userId = 0,money=0.00,name="",path="", createDate = "", cDate = null;
          for (var i = 0; i < data.length; i++) {
            id = 0; orderId = "";imageId=0; userId = 0;money=0.00;name="";path=""; createDate = "";
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.iid;
            if (Utils.isDBNotNull(dataItem.orderId)) {
              try {
                orderId = Utils.myTrim(dataItem.orderId)
              } catch (e) {}
            }
            if (Utils.isDBNotNull(dataItem.name)) {
              try {
                name = Utils.myTrim(dataItem.name)
              } catch (e) {}
            }
            if (Utils.isDBNotNull(dataItem.path)) {
              try {
                path = Utils.myTrim(dataItem.path)
              } catch (e) {}
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
                money=parseFloat((money).toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            if (Utils.isDBNotNull(dataItem.imageId))
            {
              try{
                imageId = parseInt(dataItem.imageId);
                imageId = isNaN(imageId) ? 0 : imageId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.userId))
            {
              try{
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              }catch(e){}
            }
            allRecordMoney+=money;
            listItem = {
              id : id, orderId : orderId,imageId:imageId, userId : userId,money:money,name:name,path:path, createDate : createDate,
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

              ["allRecordMoney"]:allRecordMoney,
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
  //方法：获取等级和总金额
  getMyDataInfo: function () {
    var that = this,otherParams="&companyId="+app.data.companyId+"&userId="+appUserInfo.userId;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_myUsedImage&action=myImageMoney&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('获取等级和金额信息：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取等级和金额结果')
        console.log(res.data)
        
        if (res.data.rspCode == 0) {
          let dataItem=null, allMyGetMoney=0.00,myLevelInfo=null,level=0,levelName="",levelImg="";
          if(Utils.isNotNull(res.data.data)){
            if(Utils.isNotNull(res.data.data.moneyMap)){
              dataItem=null;dataItem=res.data.data.moneyMap;
              if (Utils.isDBNotNull(dataItem.totalMoney)){
                try{
                  totalMoney = parseFloat(dataItem.totalMoney);
                  totalMoney = isNaN(totalMoney) ? 0.00 : totalMoney;
                  totalMoney=parseFloat((totalMoney).toFixed(app.data.limitQPDecCnt));
                }catch(e){}
              }   
            }

            if(Utils.isNotNull(res.data.data.greatMap)){
              dataItem=null;dataItem=res.data.data.greatMap;
              level=dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)) {
                try {
                  levelName = Utils.myTrim(dataItem.name)
                } catch (e) {}
              }
              switch(level){
                case 1:
                  levelImg=SMDataURL+"/images/PV-Tea-level1.png";
                  break;
                case 2:
                  levelImg=SMDataURL+"/images/PV-Tea-level2.png";
                  break;
                case 3:
                  levelImg=SMDataURL+"/images/PV-Tea-level3.png";
                  break;
                default:
                  levelImg=SMDataURL+"/images/PV-Tea-level4.png";
                  break;
              }
              myLevelInfo={level:level,levelName:levelName,levelImg:levelImg}
            }
          }
          that.setData({
            ["allMyGetMoney"]: allMyGetMoney,

            ["myLevelInfo"]:myLevelInfo,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取等级和金额：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取等级和金额接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取等级和金额接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：跳转选择日期页面
  chooseDateTime: function (e) {
    let that = this, tag = 0, stag = "s", url = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, tag);
    } catch (e) { }
    that.data.isForbidRefresh = true;
    stag = tag == 0 ? "s" : "e";
    url = "/packageOther/pages/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择时段") + "&edtname=" + encodeURIComponent("结束时间") + "&tag=" + stag;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
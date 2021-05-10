// packageYK/pages/costSetup/costSetup.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,DataURL = app.getUrlAndKey.mdataUrl,SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, packOtherPageUrl = "../../../packageOther/pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    serviceDataList: [],
    
    agentUserCompanyList: [],
    pageType:0,           //0设备费用设置，1公司（酒店）费用设置
    deviceId:0,           //当前设备ID
    deviceNumber:"",      //当前设备编号
    deviceCompanyId:0,    //设备所属ID
    deviceCompanyName:"", //设备所属公司名称

    srvFeeDataInfo:null,
    time: '12:01',
    date: '2016-09-01',

    priceTypeList:null,

    curPriceTypeItem:null,
    curPriceIndex:-1,
    timeChoices:[
      { value: 'everydayOne', name: '每天一次', checked: 'true'},
      { value: 'userOnly', name: '单个用户一次' }
    ],
    switch1Checked:false,

    isShowPriceLimit:false,    //是否显示价格限制
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0;
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
    that.setData({
      ["paramShareUId"]: paramShareUId,
      ["priceTypeList"]: app.data.priceTypeList,
    })
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
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        let deviceId = 0, deviceCompanyId = 0, deviceCompanyName="", deviceNumber = "", pageType=0;
        try {
          if (Utils.isNotNull(sOptions.id))
            deviceId = parseInt(sOptions.id);
          deviceId = isNaN(deviceId) ? 0 : deviceId;
        } catch (e) { }
        pageType=deviceId>0?0:1;
        try {
          if (Utils.isNotNull(sOptions.cid))
            deviceCompanyId = parseInt(sOptions.cid);
          deviceCompanyId = isNaN(deviceCompanyId) ? 0 : deviceCompanyId;
        } catch (e) { }
        try {
          if (Utils.isNotNull(sOptions.name))
            deviceNumber = Utils.myTrim(decodeURIComponent(sOptions.name));
        } catch (e) { }
        if (deviceId<=0){
          pageType=1;
          if (Utils.isNotNull(app.data.agentUserCompanyList) && app.data.agentUserCompanyList.length>0){
            deviceCompanyId = app.data.agentUserCompanyList[0].id;
            deviceCompanyName = app.data.agentUserCompanyList[0].companyName;
          }
        }
        that.setData({
          ["deviceId"]: deviceId,
          ["deviceCompanyId"]: deviceCompanyId,
          ["deviceCompanyName"]: deviceCompanyName,
          ["deviceNumber"]: deviceNumber,
          ["pageType"]: pageType,

          ["agentUserCompanyList"]: app.data.agentUserCompanyList,
        })
        that.getServicePrice();
        break;
    }
  },
  //事件：选择代理公司事件
  selCompanyListItem: function (e) {
    let that = this, item = null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        ["deviceCompanyId"]: item.id,
        ["deviceCompanyName"]: item.companyName,

        ["isShowSelectCompanyList"]: false,
      })
      that.getServicePrice();
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
    if (!that.data.isLoad) {
      that.data.isLoad = true;
    } else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          console.log("onShow ...")
        }
        let tag = -1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        if (tag >= 0) {
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) { }
          let selDTStartValue = "", selDTEndValue = "", srvFeeDataInfo = that.data.srvFeeDataInfo, curPriceIndex = that.data.curPriceIndex;
          try {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            selDTStartValue = currPage.data.paramstart;
            selDTEndValue = currPage.data.paramend;
          } catch (err) { }
          if (Utils.myTrim(selDTStartValue) != "" && Utils.myTrim(selDTEndValue) != "") {
            srvFeeDataInfo.price[curPriceIndex].promotionstart = selDTStartValue;
            srvFeeDataInfo.price[curPriceIndex].promotionend = selDTEndValue;
            that.setData({
              ["srvFeeDataInfo"]: srvFeeDataInfo,
            })
            that.data.curPriceIndex=-1;
          }
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
   /**
   * 添加服务费用设置
   */
  saveDeviceService2: function (mainDataInfo, tag) {
    var signParam = 'cls=main_deviceServicePrice&action=saveDeviceServicePrice&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId
    app.doPostData(this, app.getUrlAndKey.url, signParam, "data", mainDataInfo, "", tag, "添加服务费用设置")
  },
  //方法：保存服务费用
  //tag:0新增修改，1删除
  saveDeviceService: function (mainDataInfo, tag) {
    let that = this, alertContent=tag==0?"费用添加":"费用删除";
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    let urlParam = "cls=main_deviceServicePrice&action=saveDeviceServicePrice&appId=" + app.data.appid + "&timestamp=" + timestamp+"&userId=" + appUserInfo.userId;
    let sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(JSON.stringify(mainDataInfo));
    wx.request({
      url: URL + urlParam,
      method: "POST",
      data: {
        data: JSON.stringify(mainDataInfo)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: alertContent+"成功！",
            icon: 'none',
            duration: 1500
          })
          that.getServicePrice();
          that.setData({
            ["isShowAddSrvCostPop"]: false,
          })
        } else {
          app.setErrorMsg2(that, alertContent + "失败！错误信息：" + JSON.stringify(res), URL + urlParam + "  json:" + JSON.stringify(mainDataInfo), false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg(that, alertContent + "接口调用失败：出错：" + err, URL + urlParam + "  json:" + JSON.stringify(mainDataInfo));
      }
    })
  },

  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (tag) {
          case 0:
            msg = "添加成功"
            that.setData({
              isShowAddSrvCostPop: false,
            })
            that.getServicePrice()
            break
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1500
        })
        break;
      default:
        console.log(error)
        break
    }
  },

  /**
   * 服务费用列表
   */
  getServicePrice() {
    let that = this, deviceId = that.data.deviceId, signParam = 'cls=main_lotteryActivityProduct&action=lotteryActivityProductList&activityId=0&companyId=' + that.data.deviceCompanyId;
    var otherParam = "&type=2&lotteryProduct=1&status=0&devicesId=" + deviceId+ "&pageSize=99&pageIndex=1"
    otherParam +="&orderfield=p.id&ordertype=asc";
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取服务费用列表")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this, serviceDataList = [], priceTypeList = that.data.priceTypeList;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            if (Utils.isNotNull(data) && Utils.isNotNull(data.dataList) && data.dataList.length>0){
              serviceDataList = data.dataList;
            }
            if (serviceDataList.length <= 0) {
              wx.showToast({
                title: '暂无服务费用',
                icon: "none",
                duration: 1500
              })
            }
            let promotionstart = "", promotionend="",arrayTemp=null;
            for (let i = 0; i < serviceDataList.length;i++){
              if (Utils.isNotNull(serviceDataList[i].prices) && serviceDataList[i].prices.length>0){
                for (let k = 0; k < serviceDataList[i].prices.length;k++){
                  for (let n = 0; n < priceTypeList.length; n++) {
                    if (priceTypeList[n].id == serviceDataList[i].prices[k].priceType) {
                      serviceDataList[i].prices[k].priceTypeName = priceTypeList[n].name;
                      break;
                    }
                  }

                  promotionstart = ""; promotionend = "";
                  promotionstart = serviceDataList[i].prices[k].promotionstart; promotionend = serviceDataList[i].prices[k].promotionend;
                  if (serviceDataList[i].prices[k].priceType==3){
                    arrayTemp = null;
                    arrayTemp=promotionstart.split(' ');
                    promotionstart = arrayTemp.length >= 2 ? arrayTemp[1] : promotionstart;

                    arrayTemp = null;
                    arrayTemp = promotionend.split(' ');
                    promotionend = arrayTemp.length >= 2 ? arrayTemp[1] : promotionend;
                  }
                  serviceDataList[i].prices[k].promotionstart = promotionstart;
                  serviceDataList[i].prices[k].promotionend = promotionend;
                }
              }
            }
            that.setData({
              ["serviceDataList"]: serviceDataList,
            })
            break
          case 1:
            wx.showToast({
              title: '删除成功',
              icon: "none",
              duration: 1500
            })
            setTimeout(function () {
              that.getServicePrice()
            }, 800)
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this,index=0;
    let cid = e.currentTarget.dataset.cid;
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index=isNaN(index)?0:index;
    } catch (err) { }
    // 获取输入框的内容
    let value = e.detail.value,len=0, setKey = "",price=0.00,intValue=0;
    value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    try {
      len = Utils.getStrlengthB(value);
    } catch (err) { }
    switch (cid) {
      case "actprice":
        price=0.00;
        try{
          price=parseFloat(value);
          price = isNaN(price) ? 0.00 : price;
        }catch(e){}
        price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
        setKey = "srvFeeDataInfo.price[" + index +"].actprice";
        that.setData({
          [setKey]: price
        })
        break;
      case "specialprice":
        price = 0.00;
        try {
          price = parseFloat(value);
          price = isNaN(price) ? 0.00 : price;
        } catch (e) { }
        price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
        setKey = "srvFeeDataInfo.price[" + index + "].specialprice";
        that.setData({
          [setKey]: price
        })
        break;
      case "halfprice":
        price = 0.00;
        try {
          price = parseFloat(value);
          price = isNaN(price) ? 0.00 : price;
        } catch (e) { }
        price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
        setKey = "srvFeeDataInfo.price[" + index + "].halfprice";
        that.setData({
          [setKey]: price
        })
        break;
      case "dtstart":
        setKey = "srvFeeDataInfo.price[" + index + "].promotionstart";
        that.setData({
          [setKey]: value
        })
        break;
      case "dtend":
        setKey = "srvFeeDataInfo.price[" + index + "].promotionend";
        that.setData({
          [setKey]: value
        })
        break;
      case "sort":
        let tag = e.currentTarget.dataset.tag, srvFeeDataInfo = that.data.srvFeeDataInfo,sort=0;
        if (Utils.isNotNull(srvFeeDataInfo) && Utils.isNotNull(srvFeeDataInfo.price[index])){
          sort = srvFeeDataInfo.price[index].sort;
          sort = isNaN(sort) ? 0 : sort;
          switch(tag){
            case "+":
              sort++;
              break;
            case "-":
              if(sort<=0){
                wx.showToast({
                  title: '目前已经是最高优先级！',
                  icon: "none",
                  duration: 1500
                })
                return;
              }
              sort--
              break;
          }
        }
        setKey = "srvFeeDataInfo.price[" + index + "].sort";
        that.setData({
          [setKey]: sort
        })
        break;
      case "del":
        wx.showModal({
          title: '提示',
          content: '您确定要删除该价格类型吗？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              setKey = "srvFeeDataInfo.price[" + index + "].invalid";
              that.setData({
                [setKey]: 1
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case "duration":
        let duration = 0;
        try {
          duration = parseInt(value);
          duration = isNaN(duration) ? 0 : duration;
        } catch (e) { }
        setKey = "srvFeeDataInfo.duration";
        that.setData({
          [setKey]: duration
        })
        break;

      case "p-num":
        intValue=0;
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        setKey = "srvFeeDataInfo.num";
        that.setData({
          [setKey]: intValue
        })
        break;
      case "p-single_num":
        intValue=0;
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        setKey = "srvFeeDataInfo.single_num";
        that.setData({
          [setKey]: intValue
        })
        break;
      case "p-interval_day":
        intValue=0;
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        setKey = "srvFeeDataInfo.interval_day";
        that.setData({
          [setKey]: intValue
        })
        break;
      case "p-limit_num":
        intValue=0;
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        setKey = "srvFeeDataInfo.limit_num";
        that.setData({
          [setKey]: intValue
        })
        break;
      
    }
  },
  //事件：隐藏添加服务费用弹窗
  hideAddSrvCostPop() {
    this.setData({
      ["isShowAddSrvCostPop"]: false,
    })
  },
  //事件：显示添加服务费用弹窗
  showAddSrvCostPop(e) {
    let that = this, item=null,isShowPriceLimit=false, srvFeeDataInfo=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    srvFeeDataInfo = that.formateMainData(item);
    if(Utils.isNotNull(srvFeeDataInfo) && Utils.isNotNull(srvFeeDataInfo.price) && srvFeeDataInfo.price.length>0){
      for(let i=0;i<srvFeeDataInfo.price.length;i++){
        if(srvFeeDataInfo.price[i].priceType==4){
          isShowPriceLimit=true;break;
        }
      }
    }
    this.setData({
      ["isShowAddSrvCostPop"]: true,
      ["srvFeeDataInfo"]: srvFeeDataInfo,
      ["isShowPriceLimit"]:isShowPriceLimit,
    })
  },
  formateMainData:function(item){
    let that = this, srvFeeDataInfo = null, deviceCompanyId = that.data.deviceCompanyId;
    if (Utils.isNotNull(item)){
      srvFeeDataInfo = {
        id: item.id,
        productName: item.productName,
        companyId: item.companyId,
        userId: item.userId,
        partnerId: item.userId,
        duration: item.duration,
        status: item.status,
        type: item.type,
        lotteryProduct: item.lotteryProduct,
        activityId: item.activityId,
        devicesId: item.devicesId,

        num:item.num,single_num:item.single_num,limit_num:item.limit_num,interval_day:item.interval_day,
        price: [],
      }
      if (Utils.isNotNull(item.prices) && item.prices.length>0){
        let itemPrice=null,promotionstart="",promotionend="",timeArr=[],timeArr2=[];
        for (let i = 0; i < item.prices.length;i++){
          itemPrice = null; itemPrice = item.prices[i];
          promotionstart="";promotionend="";
          switch(itemPrice.priceType){
            case 2:
            case 4:
              if(Utils.myTrim(itemPrice.promotionstart) != ""){
                timeArr=[];
                timeArr = itemPrice.promotionstart.split(" ");
                promotionstart=timeArr.length>0?timeArr[0]:itemPrice.promotionstart;
              }
              if(Utils.myTrim(itemPrice.promotionend) != ""){
                timeArr=[];
                timeArr = itemPrice.promotionend.split(" ");
                promotionend=timeArr.length>0?timeArr[0]:itemPrice.promotionend;
              }
              break;
            case 3:
              if(Utils.myTrim(itemPrice.promotionstart) != ""){
                timeArr=[];timeArr2=[];
                timeArr = itemPrice.promotionstart.split(" ");
                timeArr2=timeArr.length>=2?timeArr[1].split(":"):timeArr[0].split(":");
                if(timeArr2.length>=2){
                  promotionstart=timeArr2[0]+":"+timeArr2[1];
                }
                promotionstart=Utils.myTrim(promotionstart)!=""?promotionstart:itemPrice.promotionstart;
              }
              if(Utils.myTrim(itemPrice.promotionend) != ""){
                timeArr=[];timeArr2=[];
                timeArr = itemPrice.promotionend.split(" ");
                timeArr2=timeArr.length>=2?timeArr[1].split(":"):timeArr[0].split(":");
                if(timeArr2.length>=2){
                  promotionend=timeArr2[0]+":"+timeArr2[1];
                }
                promotionend=Utils.myTrim(promotionend)!=""?promotionend:itemPrice.promotionend;
              }
              break;
            default:
              promotionstart=itemPrice.promotionstart;
              promotionend=itemPrice.promotionend;
              break;
          }
          srvFeeDataInfo.price.push({
            id: itemPrice.id, priceType: itemPrice.priceType, priceTypeName: itemPrice.priceTypeName,
            actprice: itemPrice.actprice, specialprice: itemPrice.specialprice, halfprice: itemPrice.halfprice,
            promotionstart: promotionstart, promotionend: promotionend, sort: itemPrice.sort, invalid: itemPrice.invalid,
          })
        }
      }
    }else{
      srvFeeDataInfo = {
        id: 0,
        productName:"",
        companyId: deviceCompanyId,
        userId: appUserInfo.userId,
        partnerId: appUserInfo.userId,
        duration: 0,
        status: 0,
        type: 2,
        lotteryProduct: 1,
        activityId: 0,
        devicesId: that.data.deviceId,

        num:0,single_num:0,limit_num:0,interval_day:0,
        price: [],
      }
    }
    return srvFeeDataInfo;
  },
  //事件：添加服务费用
  addServiceCostInfo() {
    let that = this, srvFeeDataInfo = that.data.srvFeeDataInfo;
    // that.saveDeviceService([""], 0)
    // return;
    if (Utils.isNull(srvFeeDataInfo.duration)) {
      wx.showToast({
        title: '请填写分钟！',
        icon: "none",
        duration: 1500
      })
      return
    }
    if (Utils.isNull(srvFeeDataInfo.price) || srvFeeDataInfo.price.length<=0) {
      wx.showToast({
        title: '请添加价格分类！',
        icon: "none",
        duration: 1500
      })
      return
    }
    let isFillInfo=true;
    for (let i = 0; i < srvFeeDataInfo.price.length;i++){
      if (Utils.isNull(srvFeeDataInfo.price[i].actprice)){
        isFillInfo=false;break;
      }
    }
    if(!isFillInfo){
      wx.showToast({
        title: '请正常价不能为空！',
        icon: "none",
        duration: 1500
      })
    }

    let savePriceItemList = [], itemData = null, saveItemData = null, promotionstart = "", promotionend = "", date = new Date(),today="", timestamp=0;
    today = Utils.getDateTimeStr3(date,"-",1);
    for (let i = 0; i < srvFeeDataInfo.price.length; i++) {
      itemData = null; itemData = srvFeeDataInfo.price[i]; saveItemData = null;
      if (itemData.invalid==1){
        if(itemData.id==0)continue;
        saveItemData = { id: itemData.id, invalid: itemData.invalid}
      }else{
        switch (itemData.priceType){
          case 0:
            saveItemData = {
              id: itemData.id, priceType: itemData.priceType,
              actprice: itemData.actprice, specialprice: itemData.specialprice, halfprice: itemData.halfprice,
              sort: itemData.sort,
            }
            break;
          case 2:
          case 4:
            try{
              promotionstart = itemData.promotionstart.replace(/\-/g, "/") + " 00:00:00";
              date = new Date(promotionstart);
              timestamp = Date.parse(date);
              timestamp = timestamp / 1000;
              promotionstart = timestamp
            }catch(e){}
            try {
              promotionend = itemData.promotionend.replace(/\-/g, "/") + " 00:00:00";
              date = new Date(promotionend);
              timestamp = Date.parse(date);
              timestamp = timestamp / 1000;
              promotionend = timestamp
            } catch (e) { }
            saveItemData = {
              id: itemData.id, priceType: itemData.priceType, 
              actprice: itemData.actprice, specialprice: itemData.specialprice, halfprice: itemData.halfprice,
              promotionstart: promotionstart, promotionend: promotionend, sort: itemData.sort,
            }
            break;
          case 3:
            try {
              promotionstart = today + " " + itemData.promotionstart + ":00";
              date = new Date(promotionstart.replace(/\-/g, "/"));
              timestamp = Date.parse(date);
              timestamp = timestamp / 1000;
              promotionstart = timestamp
            } catch (e) { }
            try {
              promotionend = today + " " + itemData.promotionend + ":00";
              date = new Date(promotionend.replace(/\-/g, "/"));
              timestamp = Date.parse(date);
              timestamp = timestamp / 1000;
              promotionend = timestamp
            } catch (e) { }
            saveItemData = {
              id: itemData.id, priceType: itemData.priceType,
              actprice: itemData.actprice, specialprice: itemData.specialprice, halfprice: itemData.halfprice,
              promotionstart: promotionstart, promotionend: promotionend, sort: itemData.sort,
            }
            break;
        }
      }
      savePriceItemList.push(saveItemData);
    }
    srvFeeDataInfo.price = savePriceItemList;
    that.saveDeviceService([srvFeeDataInfo], 0)
  },

  /**
   * 删除服务费用
   */
  deleteServer(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该服务费用吗?',
      success(res) {
        if (res.confirm) {
          that.saveDeviceService([{id:id,status:1}], 1)
        } else if (res.cancel) { }
      }
    })
  },
  //返回
  ondelhidtype(){
    this.setData({
      isShowAddSrvCostPop: false,
    })
  },
  //事件：切换价格类型列表显示
  onChangeShowPriceTypeList() {
    this.setData({
      isShowPriceTypeList: !this.data.isShowPriceTypeList
    })
  },
  //事件：选择价格类型
  onSelectPriceType(e) {
    let that = this, item = null,isShowPriceLimit=that.data.isShowPriceLimit, url = "";
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      isShowPriceLimit=item.id==4?true:isShowPriceLimit;
      that.setData({
        ["curPriceTypeItem"]: item,
        ["isShowPriceTypeList"]: false,
        ["isShowPriceLimit"]:isShowPriceLimit,
      })
    }
  },
  //事件：添加价格费用
  addPriceItemEvent:function(e){
    let that = this, srvFeeDataInfo = that.data.srvFeeDataInfo, curPriceTypeItem = that.data.curPriceTypeItem;
    if (Utils.isNotNull(srvFeeDataInfo)) {
      if (Utils.isNotNull(curPriceTypeItem)) {
        let isExist=false;
        if (Utils.isNotNull(srvFeeDataInfo.price) && srvFeeDataInfo.price.length>0){
          for (let i = 0; i < srvFeeDataInfo.price.length;i++){
            if (srvFeeDataInfo.price[i].priceType == curPriceTypeItem.id){
              isExist=true;break;
            }
          }
        }
        if(isExist){
          wx.showToast({
            title: '价格类型不能重复添加！',
            icon: "none",
            duration: 1500
          })
          return;
        }

        let dtDefault="";
        switch(curPriceTypeItem.id){
          case 2:
          case 4:
            dtDefault = Utils.getDateTimeStr3(new Date(),"-",102);
            break;
          case 3:
            dtDefault="00:00"
            break;
        }
        let priceItem={
          id: 0, priceType: curPriceTypeItem.id, priceTypeName: curPriceTypeItem.name,
          actprice: 0.00, specialprice: 0.00, halfprice:0.00,
          promotionstart: dtDefault, promotionend: dtDefault, sort: 0, invalid:0,
        }
        srvFeeDataInfo.price.splice(0, 0, priceItem);
        that.setData({
          srvFeeDataInfo: srvFeeDataInfo,
        })
      } else {
        wx.showToast({
          title: '请选择价格类型！',
          icon: "none",
          duration: 1500
        })
      }
    }else{
      wx.showToast({
        title: '添加失败！',
        icon: "none",
        duration: 1500
      })
    }
  },
  //事件：跳转选择日期页面
  chooseDateTime: function (e) {
    let that = this, tag = 0, curPriceIndex=-1, stag = "s", url = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    try {
      curPriceIndex = parseInt(e.currentTarget.dataset.index);
      curPriceIndex = isNaN(curPriceIndex) ? -1 : curPriceIndex;
    } catch (err) { }
    that.data.curPriceIndex = curPriceIndex;
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, tag);
    } catch (e) { }
    that.data.isForbidRefresh = true;
    that.data.reSelCheckInDate = true;
    stag = tag == 0 ? "s" : "e";
    url = packOtherPageUrl + "/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择促销时段") + "&edtname=" + encodeURIComponent("结束时间") + "&tag=" + stag;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
  },
  kkk:function(e){
    let that = this, otherParamsList ="&pid=112&d=n&h=h";
    app.getDeviceSrvPriceList(that,otherParamsList)
  },
  showSelectCompanyList() {
    this.setData({
      isShowSelectCompanyList: !this.data.isShowSelectCompanyList,
    })
  },
  /*当选次数*/
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const timeChoices = this.data.timeChoices
    for (let i = 0, len = timeChoices.length; i < len; ++i) {
      timeChoices[i].checked = timeChoices[i].value === e.detail.value
    }
    this.setData({
      timeChoices
    })
  },
  /*是否有免费按摩*/
  switch1Change(e){
    console.log(e.detail.value)
    this.setData({
      switch1Checked:e.detail.value
    })
  }
})
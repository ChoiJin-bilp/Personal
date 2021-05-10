// packageYK/pages/applyAccount/applyAccount.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,URL = app.getUrlAndKey.url,KEY = app.getUrlAndKey.key,DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions=null,timeOutGotoList=null;
var packYkPageUrl = "../../../packageYK/pages", mainPackageDir = "../../../pages",packOtherPageUrl = "../../../packageOther/pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    isForbidRefresh:false,
    disabled:false,

    investorList: [
      { id: 1, name: "平台", checked: true}, 
      { id: 2, name: "酒店", checked: false }, 
      { id: 3, name: "代理商", checked: false }, 
    ],
    accountTypeList: [
      { id: 0, name: "酒店", checked: true },
      { id: 1, name: "饮品店", checked: false },
    ],
    typegroup: [{
      value: 0,
      checked: true,
      name: "营销投放",
    }, {
      value: 1,
      name: "销售投放",
    },],

    name_max:100,
    companyName_max:100,
    address_max:200,
    contractNo_max:80,
    contractImgCnt:6,

    curId:0,
    hotelContractImgList:[],
    agentContractImgList: [],
    mainDataInfo:null,
    customItem: [],
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
        let curId = 0;
        try {
          if (Utils.isNotNull(sOptions.id))
            curId = parseInt(sOptions.id);
          curId = isNaN(curId) ? 0 : curId;
        } catch (e) { }
        
        that.setData({
          ["curId"]: curId,
        })
        if (curId > 0) {
          that.getMainDataInfo(curId);
        } else {
          that.createMainDataInfo();
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
    let that=this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;

    let tag = -1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) {}
        if (tag >= 0) {
          //tag:0日期选择，1城市区域选择
          switch (tag) {
            case 1:
              if (app.data.isSelCityArea) {
                that.setData({
                  ["mainDataInfo.put_area"]: Utils.myTrim(app.globalData.defaultCity) == "" ? "全国" : app.globalData.defaultCity + " " + app.globalData.defaultCounty,
                })
              }
              break;
          }
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) {}

        }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {//timeOutGotoList
    try {
      if (timeOutGotoList != null && timeOutGotoList != undefined) clearTimeout(timeOutGotoList);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    try {
      if (timeOutGotoList != null && timeOutGotoList != undefined) clearTimeout(timeOutGotoList);
    } catch (err) { }
  },
  createMainDataInfo:function(){
    let that = this, mainDataInfo=null;
    mainDataInfo={
      id: 0, hotelName: "", equipmentAcquirer: 0, contact: "", mobile: "", addr: "", proposer: appUserInfo.userName, 
      hotel_divided_into: 0, platform_divided_into: 0, agent_divided_into: 0, platform_salesman_divided_into: 0, partner_divided_into:0,
      reservation_hotel_divided_into: 0, reservation_platform_divided_into: 0, reservation_agent_divided_into: 0, reservation_platform_salesman_divided_into: 0, reservation_partner_divided_into:0,
      hotelShop_hotel_divided_into: 0, hotelShop_platform_divided_into: 0, hotelShop_agent_divided_into: 0, hotelShop_platform_salesman_divided_into: 0, hotelShop_partner_divided_into:0,
      platformShop_hotel_divided_into: 0, platformShop_platform_divided_into: 0, platformShop_agent_divided_into: 0, platformShop_platform_salesman_divided_into: 0, platformShop_partner_divided_into:0,
      hotel_contract_code: "", hotel_contract_img:"", agent_contract_code: "", agent_contract_img:"",
      userId: appUserInfo.userId,
      cnu_userId: app.data.accountRecordId,
      status:0,
      remark:"",put_area:"",
    }
    that.setData({
      ["mainDataInfo"]: mainDataInfo,
    })
  },
  getMainDataInfo:function(id){
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon = otherParamCon + "&id=" + id;
    app.getPartnerList(that, otherParamCon);
  },
  //方法：获取账户申请列表结果处理函数
  dowithGetPartnerList: function (dataList, tag, errorInfo) {
    let that = this, noDataAlert = "暂无信息！";
    wx.hideLoading();
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        console.log("账户申请列表结果：")
        console.log(dataList)
        let data = dataList, dataItem = null, detailItem = null, mainDataInfo = null, hotelContractImgList = [],agentContractImgList = [];
        if (Utils.isNotNull(data.dataList) && data.dataList.length > 0) {
          let hotel_contract_img = "", agent_contract_img="";
          dataItem = data.dataList[0];
          if (Utils.isNotNull(dataItem.hotel_contract_img) && Utils.myTrim(dataItem.hotel_contract_img + "") != "null"){
            hotel_contract_img = Utils.myTrim(dataItem.hotel_contract_img);
            hotelContractImgList = hotel_contract_img != "" ? hotel_contract_img.split(","):[];
          }
          if (Utils.isNotNull(dataItem.agent_contract_img) && Utils.myTrim(dataItem.agent_contract_img + "") != "null") {
            agent_contract_img = Utils.myTrim(dataItem.agent_contract_img);
            agentContractImgList = agent_contract_img != "" ? agent_contract_img.split(",") : [];
          }

          mainDataInfo = {
            id: dataItem.id, hotelName: Utils.isNotNull(dataItem.hotelName) && Utils.myTrim(dataItem.hotelName + "") != "null" ? dataItem.hotelName : "", equipmentAcquirer: Utils.isNotNull(dataItem.equipmentAcquirer) && Utils.myTrim(dataItem.equipmentAcquirer + "") != "null" ? dataItem.equipmentAcquirer : 0, contact: Utils.isNotNull(dataItem.contact) && Utils.myTrim(dataItem.contact + "") != "null" ? dataItem.contact : "", mobile: Utils.isNotNull(dataItem.mobile) && Utils.myTrim(dataItem.mobile + "") != "null" ? dataItem.mobile : "", addr: Utils.isNotNull(dataItem.addr) && Utils.myTrim(dataItem.addr + "") != "null" ? dataItem.addr : "", proposer: Utils.isNotNull(dataItem.proposer) && Utils.myTrim(dataItem.proposer + "") != "null" ? dataItem.proposer : "",

            hotel_divided_into: Utils.isNotNull(dataItem.hotel_divided_into) && Utils.myTrim(dataItem.hotel_divided_into + "") != "null" ? dataItem.hotel_divided_into : 0, 
            platform_divided_into: Utils.isNotNull(dataItem.platform_divided_into) && Utils.myTrim(dataItem.platform_divided_into + "") != "null" ? dataItem.platform_divided_into : 0, 
            agent_divided_into: Utils.isNotNull(dataItem.agent_divided_into) && Utils.myTrim(dataItem.agent_divided_into + "") != "null" ? dataItem.agent_divided_into : 0, 
            platform_salesman_divided_into: Utils.isNotNull(dataItem.platform_salesman_divided_into) && Utils.myTrim(dataItem.platform_salesman_divided_into + "") != "null" ? dataItem.platform_salesman_divided_into : 0, 
            partner_divided_into: Utils.isNotNull(dataItem.partner_divided_into) && Utils.myTrim(dataItem.partner_divided_into + "") != "null" ? dataItem.partner_divided_into : 0,

            reservation_hotel_divided_into: Utils.isNotNull(dataItem.reservation_hotel_divided_into) && Utils.myTrim(dataItem.reservation_hotel_divided_into + "") != "null" ? dataItem.reservation_hotel_divided_into : 0, 
            reservation_platform_divided_into: Utils.isNotNull(dataItem.reservation_platform_divided_into) && Utils.myTrim(dataItem.reservation_platform_divided_into + "") != "null" ? dataItem.reservation_platform_divided_into : 0, 
            reservation_agent_divided_into: Utils.isNotNull(dataItem.reservation_agent_divided_into) && Utils.myTrim(dataItem.reservation_agent_divided_into + "") != "null" ? dataItem.reservation_agent_divided_into : 0, 
            reservation_platform_salesman_divided_into: Utils.isNotNull(dataItem.reservation_platform_salesman_divided_into) && Utils.myTrim(dataItem.reservation_platform_salesman_divided_into + "") != "null" ? dataItem.reservation_platform_salesman_divided_into : 0, 
            reservation_partner_divided_into: Utils.isNotNull(dataItem.reservation_partner_divided_into) && Utils.myTrim(dataItem.reservation_partner_divided_into + "") != "null" ? dataItem.reservation_partner_divided_into : 0,

            hotelShop_hotel_divided_into: Utils.isNotNull(dataItem.hotelShop_hotel_divided_into) && Utils.myTrim(dataItem.hotelShop_hotel_divided_into + "") != "null" ? dataItem.hotelShop_hotel_divided_into : 0, 
            hotelShop_platform_divided_into: Utils.isNotNull(dataItem.hotelShop_platform_divided_into) && Utils.myTrim(dataItem.hotelShop_platform_divided_into + "") != "null" ? dataItem.hotelShop_platform_divided_into : 0, 
            hotelShop_agent_divided_into: Utils.isNotNull(dataItem.hotelShop_agent_divided_into) && Utils.myTrim(dataItem.hotelShop_agent_divided_into + "") != "null" ? dataItem.hotelShop_agent_divided_into : 0, 
            hotelShop_platform_salesman_divided_into: Utils.isNotNull(dataItem.hotelShop_platform_salesman_divided_into) && Utils.myTrim(dataItem.hotelShop_platform_salesman_divided_into + "") != "null" ? dataItem.hotelShop_platform_salesman_divided_into : 0, 
            hotelShop_partner_divided_into: Utils.isNotNull(dataItem.hotelShop_partner_divided_into) && Utils.myTrim(dataItem.hotelShop_partner_divided_into + "") != "null" ? dataItem.hotelShop_partner_divided_into : 0,

            platformShop_hotel_divided_into: Utils.isNotNull(dataItem.platformShop_hotel_divided_into) && Utils.myTrim(dataItem.platformShop_hotel_divided_into + "") != "null" ? dataItem.platformShop_hotel_divided_into : 0, 
            platformShop_platform_divided_into: Utils.isNotNull(dataItem.platformShop_platform_divided_into) && Utils.myTrim(dataItem.platformShop_platform_divided_into + "") != "null" ? dataItem.platformShop_platform_divided_into : 0, 
            platformShop_agent_divided_into: Utils.isNotNull(dataItem.platformShop_agent_divided_into) && Utils.myTrim(dataItem.platformShop_agent_divided_into + "") != "null" ? dataItem.platformShop_agent_divided_into : 0, 
            platformShop_platform_salesman_divided_into: Utils.isNotNull(dataItem.platformShop_platform_salesman_divided_into) && Utils.myTrim(dataItem.platformShop_platform_salesman_divided_into + "") != "null" ? dataItem.platformShop_platform_salesman_divided_into : 0, 
            platformShop_partner_divided_into: Utils.isNotNull(dataItem.platformShop_partner_divided_into) && Utils.myTrim(dataItem.platformShop_partner_divided_into + "") != "null" ? dataItem.platformShop_partner_divided_into : 0,

            hotel_contract_code: Utils.isNotNull(dataItem.hotel_contract_code) && Utils.myTrim(dataItem.hotel_contract_code + "") != "null" ? dataItem.hotel_contract_code : "", hotel_contract_img: hotel_contract_img, agent_contract_code: Utils.isNotNull(dataItem.agent_contract_code) && Utils.myTrim(dataItem.agent_contract_code + "") != "null" ? dataItem.agent_contract_code : "", agent_contract_img: agent_contract_img,
            userId: Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "null" ? dataItem.userId : 0,
            cnu_userId: Utils.isNotNull(dataItem.cnu_userId) && Utils.myTrim(dataItem.cnu_userId + "") != "null" ? dataItem.cnu_userId : 0,

            status: Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null" ? dataItem.status : 0,
            remark: Utils.isNotNull(dataItem.remark) && Utils.myTrim(dataItem.remark + "") != "null" ? dataItem.remark : "",
            put_area:Utils.isNotNull(dataItem.put_area) && Utils.myTrim(dataItem.put_area + "") != "null" && Utils.myTrim(dataItem.put_area + "") != "" ? dataItem.put_area : "",
          }
        }

        that.setData({
          ["mainDataInfo"]: mainDataInfo,
          ["hotelContractImgList"]: hotelContractImgList,
          ["agentContractImgList"]: agentContractImgList,
          ["disabled"]:true,
        })
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : noDataAlert;
        break;
    }
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    
    // 获取输入框的内容
    let value = e.detail.value, setDataKey = "", intValue = 0;
    value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "hotelName":
        setDataKey ="mainDataInfo.hotelName";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.companyName_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.companyName_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "contact":
        setDataKey = "mainDataInfo.contact";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.name_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.name_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "mobile":
        setDataKey = "mainDataInfo.mobile";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > 11) {
            wx.showToast({
              title: "内容超长（字数限制11）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "addr":
        setDataKey = "mainDataInfo.addr";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.address_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.address_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "proposer":
        setDataKey = "mainDataInfo.proposer";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.name_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.name_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "hotel_contract_code":
        setDataKey = "mainDataInfo.hotel_contract_code";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.contractNo_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.contractNo_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "agent_contract_code":
        setDataKey = "mainDataInfo.agent_contract_code";
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.contractNo_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.contractNo_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        that.setData({
          [setDataKey]: value
        })
        break;
      case "equipmentAcquirer":
        let equipmentAcquirer = 0;
        setDataKey = "mainDataInfo.equipmentAcquirer";
        try{
          equipmentAcquirer=parseInt(value);
          equipmentAcquirer = isNaN(equipmentAcquirer) ? 0 : equipmentAcquirer;
        }catch(e){}
        that.setData({
          [setDataKey]: equipmentAcquirer
        })
        break;
      case "yk_companyType":
        let yk_companyType = 0;
        setDataKey = "mainDataInfo.yk_companyType";
        try{
          yk_companyType=parseInt(value);
          yk_companyType = isNaN(yk_companyType) ? 0 : yk_companyType;
        }catch(e){}
        that.setData({
          [setDataKey]: yk_companyType
        })
        break;

      case "hotel_divided_into":
        setDataKey = "mainDataInfo.hotel_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platform_divided_into":
        setDataKey = "mainDataInfo.platform_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "agent_divided_into":
        setDataKey = "mainDataInfo.agent_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platform_salesman_divided_into":
        setDataKey = "mainDataInfo.platform_salesman_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "partner_divided_into":
        setDataKey = "mainDataInfo.partner_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;

      case "reservation_hotel_divided_into":
        setDataKey = "mainDataInfo.reservation_hotel_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "reservation_platform_divided_into":
        setDataKey = "mainDataInfo.reservation_platform_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "reservation_agent_divided_into":
        setDataKey = "mainDataInfo.reservation_agent_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "reservation_platform_salesman_divided_into":
        setDataKey = "mainDataInfo.reservation_platform_salesman_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "reservation_partner_divided_into":
        setDataKey = "mainDataInfo.reservation_partner_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;

      case "hotelShop_hotel_divided_into":
        setDataKey = "mainDataInfo.hotelShop_hotel_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "hotelShop_platform_divided_into":
        setDataKey = "mainDataInfo.hotelShop_platform_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "hotelShop_agent_divided_into":
        setDataKey = "mainDataInfo.hotelShop_agent_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "hotelShop_platform_salesman_divided_into":
        setDataKey = "mainDataInfo.hotelShop_platform_salesman_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "hotelShop_partner_divided_into":
        setDataKey = "mainDataInfo.hotelShop_partner_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;

      case "platformShop_hotel_divided_into":
        setDataKey = "mainDataInfo.platformShop_hotel_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platformShop_platform_divided_into":
        setDataKey = "mainDataInfo.platformShop_platform_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platformShop_agent_divided_into":
        setDataKey = "mainDataInfo.platformShop_agent_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platformShop_platform_salesman_divided_into":
        setDataKey = "mainDataInfo.platformShop_platform_salesman_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
      case "platformShop_partner_divided_into":
        setDataKey = "mainDataInfo.platformShop_partner_divided_into";
        try {
          intValue = parseInt(value);
          intValue = isNaN(intValue) ? 0 : intValue;
        } catch (e) { }
        that.setData({
          [setDataKey]: intValue
        })
        break;
    }
  },
  ///////////////////////////////////////////////////////////
  //------图片信息操作----------------------------------------
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function (e) {
    let that = this, sType = 0, contractImgCnt = that.data.contractImgCnt;
    if (that.data.disabled) return;
    //sType:0 个人头像，1 公司Logo ，2 营业执照
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) { }
    }
    switch (sType) {
      //酒店合同多图上传
      case 0:
        let hotelContractImgList = that.data.hotelContractImgList, finishHCImgCnt = Utils.isNotNull(hotelContractImgList) && hotelContractImgList.length > 0 ? hotelContractImgList.length : 0;
        app.uploadImg(that, sType, finishHCImgCnt, contractImgCnt)
        break;

      //代理商合同多图上传
      case 1:
        let agentContractImgList = that.data.agentContractImgList, finishACImgCnt = Utils.isNotNull(agentContractImgList) && agentContractImgList.length > 0 ? agentContractImgList.length : 0;
        app.uploadImg(that, sType, finishACImgCnt, contractImgCnt)
        break;
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    let that = this,
      setKey = "";
    switch (sType) {
      case 0:
        let hotelContractImgList = that.data.hotelContractImgList;
        hotelContractImgList.push(imgUrl)
        that.setData({
          ["hotelContractImgList"]: hotelContractImgList,
        })
        break;
      case 1:
        let agentContractImgList = that.data.agentContractImgList;
        agentContractImgList.push(imgUrl)
        that.setData({
          ["agentContractImgList"]: agentContractImgList,
        })
        break;
    }
  },
  //事件：删除其他图片
  delrbImgList: function (e) {
    let that = this,tag = 0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    let index = e.currentTarget.dataset.index;
    //0招商图片，1招商介绍图片
    switch (tag) {
      case 0:
        let hotelContractImgList = that.data.hotelContractImgList;
        hotelContractImgList.splice(index, 1);
        that.setData({
          ["hotelContractImgList"]: hotelContractImgList,
        })
        break;
      case 1:
        let agentContractImgList = that.data.agentContractImgList;
        agentContractImgList.splice(index, 1);
        that.setData({
          ["agentContractImgList"]: agentContractImgList,
        })
        break;
    }
  },

  //事件：提交信息
  submitMainDataInfo:function(e){
    let that = this, mainDataInfo = that.data.mainDataInfo,allStatPercent=0;
    if (!Utils.isNull(mainDataInfo.mobile) && !Utils.mobileVer(mainDataInfo.mobile)) {
      wx.showToast({
        title: "请输入正确手机号码！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //设备分成总和判断
    try{
      allStatPercent = mainDataInfo.hotel_divided_into + mainDataInfo.platform_divided_into + mainDataInfo.agent_divided_into + mainDataInfo.platform_salesman_divided_into + mainDataInfo.partner_divided_into;
      allStatPercent = isNaN(allStatPercent) ? 0 : allStatPercent;
    }catch(e){}
    if (allStatPercent>100){
      wx.showToast({
        title: "设备分成比例总和不能超过100%！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //地区选择判断
    if (Utils.isNull(mainDataInfo.put_area)) {
      wx.showToast({
        title: "请选择投放区域！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    //订房分成总和判断
    try {
      allStatPercent = mainDataInfo.reservation_hotel_divided_into + mainDataInfo.reservation_platform_divided_into + mainDataInfo.reservation_agent_divided_into + mainDataInfo.reservation_platform_salesman_divided_into + mainDataInfo.reservation_partner_divided_into;
      allStatPercent = isNaN(allStatPercent) ? 0 : allStatPercent;
    } catch (e) { }
    if (allStatPercent > 100) {
      wx.showToast({
        title: "订房分成比例总和不能超过100%！",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //酒店购物分成总和判断
    try {
      allStatPercent = mainDataInfo.hotelShop_hotel_divided_into + mainDataInfo.hotelShop_platform_divided_into + mainDataInfo.hotelShop_agent_divided_into + mainDataInfo.hotelShop_platform_salesman_divided_into + mainDataInfo.hotelShop_partner_divided_into;
      allStatPercent = isNaN(allStatPercent) ? 0 : allStatPercent;
    } catch (e) { }
    if (allStatPercent > 100) {
      wx.showToast({
        title: "酒店购物分成比例总和不能超过100%！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //平台购物分成总和判断
    try {
      allStatPercent = mainDataInfo.platformShop_hotel_divided_into + mainDataInfo.platformShop_platform_divided_into + mainDataInfo.platformShop_agent_divided_into + mainDataInfo.platformShop_platform_salesman_divided_into + mainDataInfo.platformShop_partner_divided_into;
      allStatPercent = isNaN(allStatPercent) ? 0 : allStatPercent;
    } catch (e) { }
    if (allStatPercent > 100) {
      wx.showToast({
        title: "平台购物分成比例总和不能超过100%！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let hotelContractImgList = that.data.hotelContractImgList, agentContractImgList = that.data.agentContractImgList, hotel_contract_img = "", agent_contract_img="";
    hotel_contract_img = Utils.isNotNull(hotelContractImgList) && hotelContractImgList.length > 0 ? hotelContractImgList.join(","):"";
    agent_contract_img = Utils.isNotNull(agentContractImgList) && agentContractImgList.length > 0 ? agentContractImgList.join(",") : "";
    mainDataInfo.hotel_contract_img = hotel_contract_img;
    mainDataInfo.agent_contract_img = agent_contract_img;
    console.log(mainDataInfo);
    that.savePartner(mainDataInfo);
  },
  //事件：返回
  gotoBack:function(e){
    let that=this;
    wx.navigateBack({
      delta: 1
    })
  },
  gotoApplyListPage:function(){
    let that = this, url = packYkPageUrl + "/applyAccountList/applyAccountList";
    wx.navigateTo({
      url: url
    });
  },

  savePartner: function (mainDataInfo) {
    var signParam = 'cls=main_partner&action=savePartner&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId
    app.doPostData(this, app.getUrlAndKey.url, signParam, "datajson", mainDataInfo, "", 0, "账户申请")
  },

  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (tag) {
          case 0:
            msg = "申请账户成功！"
            break
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1500
        })
        timeOutGotoList = setTimeout(that.gotoApplyListPage, 1500);
        break;
      default:
        console.log(error)
        break
    }
  },
  
  //事件：城市地区选择
  showSelAreaPop: function (e) {
    let that = this,
      url = "";
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, 1);
    } catch (e) {}
    url = packOtherPageUrl + "/switchcity/switchcity";
    //设置选区域标志以及是否只查看当前区域酒店
    that.data.isForbidRefresh = true;
    app.data.isSelCityArea=false;
    console.log("viewDetail:" + url)
    wx.navigateTo({
      url: url
    });
  },
})
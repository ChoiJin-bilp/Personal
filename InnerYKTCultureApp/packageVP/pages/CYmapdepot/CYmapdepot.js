// packageVP/pages/CYmapdepot/CYmapdepot.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  DataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = DataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL:DataURL,
    isLoad:false,
    loginType:0,          //登录类型：0选图加载，1我的作品库管理
    SDataType:0,          //0系统图库，1茶友图库，2我的图库
    SDActTag:0,           //0无，1新增
    List:[
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
      {name:'全部'},
    ],
    

    imgTypeList:[],
    selTypeIndex:0,

    printImgList:[],
    selPImgIndex:-1,        //当前选中图片
    isEditMyImg:false,      //是否编辑我的图库
    isShowEditPop:false,    //是否显示编辑弹窗
    isShowDelPop:false,     //是否显示删除弹窗

    //编辑图片信息对象
    editImgObj:{ id: 0, name : "",path:"",serial:"",price:0.00,print_num:0,userId:0,open:0,image_type_id:-1,image_type_name:"",},      
    customizeImgPrice:0.00, //自定义图案价格(元)
    name_max:12,
    //返回参数
    paramId:0,
    paramPrice:0.00,
    paramImgUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(options)
    appUserInfo = app.globalData.userInfo;
    let SDataType=0,SDActTag=0,pageTitle="",loginType=0;
    if (Utils.isNotNull(options.lp)) {
      try {
        loginType = parseInt(options.lp);
        loginType = isNaN(loginType) ? 0 : loginType;
      } catch (e) {}
    }
    if (Utils.isNotNull(options.stype)) {
      try {
        SDataType = parseInt(options.stype);
        SDataType = isNaN(SDataType) ? 0 : SDataType;
      } catch (e) {}
    }
    if (Utils.isNotNull(options.act)) {
      try {
        SDActTag = parseInt(options.act);
        SDActTag = isNaN(SDActTag) ? 0 : SDActTag;
      } catch (e) {}
    }
    that.setData({
      ["loginType"]:loginType,
      ["SDataType"]: SDataType,
      ["SDActTag"]: SDActTag,

      ["selCurTypeId"]:0,
      ["selTypeIndex"]:1,
    })
    pageTitle=SDataType==0?"茶语图库":(SDataType==1?"茶友图库":"我的创作图库");
    wx.setNavigationBarTitle({
      title: pageTitle
    })
    let mainCompontObj = null;
    mainCompontObj = that.selectComponent('#selPImgCompont');
    if(Utils.isNotNull(mainCompontObj)){
      mainCompontObj.initLoadEvent(SDataType,SDActTag);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        console.log("onShow ...")
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

  //事件：选择确定打印图片
  submitSelCurPImgItem:function(e){
    let that=this,selPImgItem=that.data.selPImgItem;
    that.gotoBackPage();
  },
  //事件：选择打印图片后续处理
  onCompontDowithAfterSelect:function(e){
    let that=this,selPImgItem=null;
    try {
      selPImgItem = e.detail.selPImgItem;
    } catch (e) { }
    that.setData({
      ["selPImgItem"]:selPImgItem,
    })
  },
  //方法：返回
  gotoBackPage: function () {
    let that = this,selPImgItem=that.data.selPImgItem;
    if(Utils.isNotNull(selPImgItem)){
      try{
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 2];   //上个页面
        // 直接给上一个页面赋值
        prevPage.setData({
          paramId:selPImgItem.id,
          paramSType:that.data.SDataType,
          paramPrice:selPImgItem.price,
          paramImgUrl:selPImgItem.path,
          paramPNum:selPImgItem.print_num,
          paramImgName:encodeURIComponent(selPImgItem.name),
        });
      }catch(e){}
    }
    
    
    wx.navigateBack({
      delta: 1
    })
  },
})
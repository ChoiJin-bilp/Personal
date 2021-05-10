// packageVP/pages/rightsNterests/rightsNterests.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    num:4,

    curMemSortName:"",            //当前会员级别名称
    curMemSort:0,                 //当前会员级别
    curUseIntegrals:0,            //当前可用积分
    curMemIntegrals:0,            //当前会员积分

    curNextSortMemIntegrals:0,    //距离下一级别所需会员积分

    memberLevelList:[],           //会员等级列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    if(Utils.isNull(app.data.userMemberInfo)){
      wx.showToast({
        title: "会员信息无效！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let curMemSortName="",curNextSortMemIntegrals=0,isMySort=false;
    if(Utils.isNotNull(app.data.userMemberInfo.memberLevelList) && app.data.userMemberInfo.memberLevelList.length>0){
      let dataItem=null;
      for(let i=0;i<app.data.userMemberInfo.memberLevelList.length;i++){
        dataItem=null;dataItem=app.data.userMemberInfo.memberLevelList[i];
        if(isMySort){
          curNextSortMemIntegrals=dataItem.integral-app.data.userMemberInfo.curMemIntegrals;
          isMySort=false;
        }
        if(dataItem.sort==app.data.userMemberInfo.curMemSort){
          curMemSortName=dataItem.name;
          isMySort=true;
        }
        switch(dataItem.sort){
          case 1:
            dataItem.width="0";
            dataItem.logoimg="yunke-tong.png";
            dataItem.bgcolorArray= ["#dbb682","#fff","#fff","#fff"];
            dataItem.fontColorArray=["","","",""];
            break;
          case 2:
            dataItem.width="30";
            dataItem.logoimg="yunke-yin.png";
            dataItem.bgcolorArray= ["#dbb682","#a06d47","#fff","#fff"];
            dataItem.fontColorArray=["#333","","#666","#666"];
            break;
          case 3:
            dataItem.width="60";
            dataItem.logoimg="yunke-jin.png";
            dataItem.bgcolorArray= ["#dbb682","#BC9063","#a06d47","#fff"];
            dataItem.fontColorArray=["#a06d47","#d0aa80","#a06d47","#a06d47"];
            break;
          case 4:
            dataItem.width="90";
            dataItem.logoimg="yunke-zuans.png";
            dataItem.bgcolorArray= ["#dbb682","#C89E6F","#B4865B","#a06d47"];
            dataItem.fontColorArray=["","#d3cbdb","","#dfc9ff"];
            break;
        }
        dataItem.sname=dataItem.name.replace('会员','');
        app.data.userMemberInfo.memberLevelList[i]=dataItem;       
      }
    }
    console.log(app.data.userMemberInfo.memberLevelList)
    that.setData({
      ["memberLevelList"]:app.data.userMemberInfo.memberLevelList,
      ["curMemSort"]:app.data.userMemberInfo.curMemSort,
      ["curMemSortName"]:curMemSortName,
      ["curUseIntegrals"]:app.data.userMemberInfo.curUseIntegrals,
      ["curMemIntegrals"]:app.data.userMemberInfo.curMemIntegrals,
      ["curNextSortMemIntegrals"]:curNextSortMemIntegrals,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
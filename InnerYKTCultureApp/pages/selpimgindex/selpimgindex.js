// pages/selpimgindex/selpimgindex.js
const app = getApp();

var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var packSMPageUrl = "../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,sOptions = null,timeOutChrAlert = null,timeOutPrintImgList=null,timeOutGetFreeOrderRCItemList=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,

    pMyImgList:[],                  //打印我的图片列表
    pOtherImgList:[],               //打印茶友图片列表

    // 选中了哪个图案
    selSysImgIndex: 0,              //打印图片索引
    selImgType:0,                   //打印图片索引类型：0系统图片，1茶友图片，2我的图片
    selPImgItem:null,
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
        
        that.getPrintImgList();
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
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;

    //导航条相关处理操作
    if (Utils.isNotNull(app.globalData.tabBarList) && app.globalData.tabBarList.length > 0) {
      //设置tabbar导航条当前索引位置
      app.setTabBarSelIndex(that);
    } else {
      //获取导航条
      app.getTabBarList(that, app.data.companyId, false);
    }

    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        if(that.data.isForbidRefresh){          
          if(that.data.selPImgTag==1){
            that.data.selPImgTag=0;
            //打印图片更多页面返回
            let id=0,imgUrl = "",name="",print_num=0,price=0.00,stype=0;
            try {
              let pages = getCurrentPages();
              let currPage = pages[pages.length - 1];
              if (Utils.isNotNull(currPage.data.paramId)) {
                try {
                  id = parseInt(currPage.data.paramId);
                  id = isNaN(id) ? 0 : id;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramPNum)) {
                try {
                  print_num = parseInt(currPage.data.paramPNum);
                  print_num = isNaN(print_num) ? 0 : print_num;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramSType)) {
                try {
                  stype = parseInt(currPage.data.paramSType);
                  stype = isNaN(stype) ? 0 : stype;
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramPrice)) {
                try {
                  price = parseFloat(currPage.data.paramPrice);
                  price = isNaN(price) ? 0 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
                } catch (e) {}
              }
              if (Utils.isNotNull(currPage.data.paramImgUrl)) {
                imgUrl = currPage.data.paramImgUrl;
              }
              if (Utils.isNotNull(currPage.data.paramImgName)) {
                name = decodeURIComponent(currPage.data.paramImgName);
              }
              if(id>0){
                that.setData({
                  ["selImgType"]:stype,
                  ["PRReturnId"]:id,
                })
              }else{
                that.setData({
                  ["selPImgItem"]: null,
                  ["selSysImgIndex"]: -1,
                })
              }
              that.getPrintImgList();
            } catch (err) {}
            
          }
        }else{
          that.setData({
            ["selPImgItem"]:null,
            ["isSelInList"]:true,

            ["selSysImgIndex"]: -1,
          })

          that.getPrintImgList();
        }
        
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //----------打印图片部分------------------------------------------------------------------
  //方法：获取打印图片相关信息
  getPrintImgList: function () {
    let that = this,otherParam="&xcxAppId=" + app.data.wxAppId;
    otherParam+="&companyId=" + app.data.companyId;
    app.getPrintImgList(that,otherParam);
  },
  //方法：获取打印图片结果处理函数
  dowithGetPrintImgList: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取打印图片结果：");
        console.log(dataList);
        let printAllImgList=[];
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let data = dataList.dataList, dataItem = null, listItem = null;
          let id = 0, name = "",path="",serial = "",price=0.00,print_num=0,userId=0,open=0,image_type_id=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; name = "";path="";serial = "";price=0.00;print_num=0;userId=0;open=0;image_type_id=0;
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.name)){
              name = dataItem.name;
            }
            if (Utils.isDBNotNull(dataItem.path)){
              path = dataItem.path;
              path = app.getSysImgUrl(path);
            }
            if (Utils.isDBNotNull(dataItem.serial)){
              serial = dataItem.serial;
            }
            if (Utils.isDBNotNull(dataItem.price)){
              try{
                price = parseFloat(dataItem.price);
                price = isNaN(price) ? 0.00 : price;
                price = parseFloat(price.toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            if (Utils.isDBNotNull(dataItem.print_num))
            {
              try{
                print_num = parseInt(dataItem.print_num);
                print_num = isNaN(print_num) ? 0 : print_num;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.userId))
            {
              try{
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.open))
            {
              try{
                open = parseInt(dataItem.open);
                open = isNaN(open) ? 0 : open;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.image_type_id))
            {
              try{
                image_type_id = parseInt(dataItem.image_type_id);
                image_type_id = isNaN(image_type_id) ? 0 : image_type_id;
              }catch(e){}
            }
            
            listItem = {
              id: id, name : name,path:path,serial,price:price,print_num:print_num,userId:userId,open:open,image_type_id:image_type_id,image_type_name:"",
            }
            printAllImgList.push(listItem);
          }
        }
        app.data.printImageInfo=app.filterPrintImgList(printAllImgList);
        that.setData({
          ["printAllImgList"]:app.data.printImageInfo.printAllImgList,
          ["pMyImgList"]:app.data.printImageInfo.pMyImgList,
          ["pOtherImgList"]:app.data.printImageInfo.pSysOtherImgList,
        })
        if(that.data.PRReturnId>0){
          that.dowithAfterSelMorePImg(that.data.PRReturnId,that.data.selImgType,false);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：处理“更多”中选中打印图片后续逻辑
  dowithAfterSelMorePImg(id,stype,isPreviewImg){
    let that=this,pImgList=null,isSelInList=false,selSysImgIndex=-1,selPImgItem=null,printAllImgList=that.data.printAllImgList;
    switch(stype){
      case 3:
        pImgList=that.data.pOtherImgList;
        break;
      case 2:
        pImgList=that.data.pMyImgList;
        break;
    }
    if(Utils.isNotNull(pImgList) && pImgList.length>0){
      for(let i=0;i<pImgList.length;i++){
        if(pImgList[i].id==id){
          selPImgItem=pImgList[i];
          selSysImgIndex=i;
          isSelInList=true;break;
        }
      }      
    }
    if(!isSelInList && Utils.isNotNull(printAllImgList) && printAllImgList.length>0){
      for(let i=0;i<printAllImgList.length;i++){
        if(printAllImgList[i].id==id){
          selPImgItem=printAllImgList[i];
          break;
        }
      }
    }

    that.setData({
      ["selPImgItem"]:selPImgItem,
      ["isSelInList"]: isSelInList,
      ["selSysImgIndex"]:isSelInList?selSysImgIndex:-1,

      ["isPreviewImg"]:isPreviewImg,
    })
  },
  //事件：跳转页面
  gotoCommonPage: function (e) {
    let that=this,packageName="",page="";
    try {
      packageName = Utils.myTrim(e.currentTarget.dataset.package);
    } catch (e) {}
    try {
      page = Utils.myTrim(e.currentTarget.dataset.page);
    } catch (e) {}
    if(Utils.myTrim(packageName)=="packageVP" && Utils.myTrim(page)=="CYmapdepot"){
      that.data.selPImgTag=1;
      that.data.isForbidRefresh=true;
    }
    app.gotoCommonPageEvent(this, e);
  },
  //事件：隐藏预览图片
  hidePreviewImageDetail:function(e){
    let that=this,tag=0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) {}
    if(tag==1){
      that.setData({
        ["isPreviewImg"]: false,
        ["isPreUploadPrintImage"]:false,
      })
    }else{
      that.setData({
        ["isPreviewImg"]: false,
        ["isPreUploadPrintImage"]:false,
  
        ["selPImgItem"]:null,
        ["selSysImgIndex"]:-1,
      })
    }
  },
  //事件：选择打印图片
  selectCustomizeImg(e) {
    let that = this,stype=0,isprev=0,index=0,self=0,selImgType=that.data.selImgType,selSysImgIndex=that.data.selSysImgIndex,isPreviewImg=false;
    try {
      stype = parseInt(e.currentTarget.dataset.stype);
      stype = isNaN(stype) ? 0 : stype;
    } catch (e) {}
    //isprev 是否预览图片：0否，1是
    try {
      isprev = parseInt(e.currentTarget.dataset.isprev);
      isprev = isNaN(isprev) ? 0 : isprev;
    } catch (e) {}
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? 0 : index;
    } catch (e) {}
    try {
      self = parseInt(e.currentTarget.dataset.self);
      self = isNaN(self) ? 0 : self;
    } catch (e) {}
    //如果选择同一个，且不为预览则为取消选择
    if ((self==1 || selSysImgIndex == index) && selImgType==stype && isprev==0) {
      that.setData({
        ["selSysImgIndex"]: -1,
  
        ["selPImgItem"]:null,
      })
    }else{
      let pImgList=[],selPImgItem=that.data.selPImgItem,selID=0;
      if(self!=1){
        //不是已选中项的操作
        switch(stype){
          case 3:
            pImgList=that.data.pOtherImgList;
            break;
          case 2:
            pImgList=that.data.pMyImgList;
            break;
        }
        selID=pImgList[index].id;
      }else{
        //选中项的操作
        selID=Utils.isNotNull(selPImgItem)?selPImgItem.id:0;
        index=-1;
      }
      
      isPreviewImg=isprev==1?true:isPreviewImg;
      that.setData({
        ["selSysImgIndex"]: index,
        ["selImgType"]:stype,
        ["isPreUploadPrintImage"]:false,

        ["isSelUploadImg"]:false,
      })
      that.dowithAfterSelMorePImg(selID,stype,isPreviewImg);
    }
  },
  //事件：下一步选择饮品
  selectOK:function(e){
    let that=this,selPImgItem=that.data.selPImgItem,url="";
    if(Utils.isNotNull(selPImgItem)){     
      url="/pages/seltypeproductlist/seltypeproductlist?pid="+app.data.printImgTypeId+"&spid="+selPImgItem.id+"&spurl="+encodeURIComponent(selPImgItem.path)+"&spprice="+selPImgItem.price;
      console.log("goto page:"+url)
      console.log(selPImgItem)
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.showToast({
        title: "请先选择图片！",
        icon: 'none',
        duration: 1500
      })
    }
  }
})
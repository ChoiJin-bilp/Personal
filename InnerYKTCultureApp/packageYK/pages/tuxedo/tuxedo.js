// pages/tuxedo/tuxedo.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg,internalDownTime=null;
var packSMPageUrl = "../../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,sOptions=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    randomNum: Math.random() / 9999,

    Sid:0,               //期数ID
    ProductId:"",        //商品ID
    gwPeriods:0,         //拼团期数
    proDataInfo:null,    //商品详情
    orderItemList:[],    //订单列表

    isFull:false,        //是否拼满
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
    var that = this,paramShareUId = 0,isScene = false,dOptions = null;
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      var strScene = decodeURIComponent(options.scene);
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
    } catch (e) {}
    that.data.paramShareUId = paramShareUId;

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      console.log(options);
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        var Sid=0, ProductId="",otherProductParam="";
        try {
          if (Utils.isNotNull(sOptions.sid) && Utils.myTrim(sOptions.sid + "") != "") {
            try{
              Sid=parseInt(sOptions.sid);
              Sid=isNaN(Sid)?0:Sid;
            }catch(e){}
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.pid) && Utils.myTrim(sOptions.pid + "") != "") {
            ProductId = Utils.myTrim(sOptions.pid);
          }
        } catch (e) {}
        that.setData({
          Sid: Sid,
          ProductId:ProductId,
        })
        
        otherProductParam="&pid="+ProductId;

        otherProductParam+=that.data.Sid>0?"&sid="+that.data.Sid:"";
        let isHaveSid=that.data.Sid>0?true:false;
        app.getGWProductList(that,isHaveSid,otherProductParam,100,1);
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

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：获取拼团抽奖订单结果处理函数
  dowithGetGWOrderDetail: function (dataList, tag, errorInfo) {
    let that = this;
    try{
      wx.hideLoading();
    }catch(e){}
    switch (tag) {
      case 1:
        console.log("拼团抽奖订单获取结果：");
        console.log(dataList);
        let dataItem = null,listItem=null,orderItemList = [],gwPeriods=0,isFull=false;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let id=0,orderId="",userId=0,checked=0,couponid="",sn="",win=0,win_no="",couponMoney=0.00,headerImg=defaultItemImgSrc,periods=0,create_date=new Date(),create_dateStr="",mobile="";
          let mySnList="",isWin=false,isChecked=false;
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            orderId="";userId=0;checked=0;couponid="";sn="";win=0;win_no="";couponid=0;couponMoney=0.00;headerImg=defaultItemImgSrc;periods=0;create_date=new Date();create_dateStr="";mobile="";
            id=dataItem.id;
            if (Utils.isNotNull(dataItem.create_date)) {
              try {
                create_date = new Date(Date.parse((dataItem.create_date + "").replace(/-/g, "/")))
              } catch (e) {}
            }
            if (Utils.isNotNull(dataItem.orderId) && Utils.myTrim(dataItem.orderId + "") != "null" && Utils.myTrim(dataItem.orderId + "") != "") {
              orderId=Utils.myTrim(dataItem.orderId);
            }
            if (Utils.isNotNull(dataItem.couponid) && Utils.myTrim(dataItem.couponid + "") != "null" && Utils.myTrim(dataItem.couponid + "") != "") {
              couponid=Utils.myTrim(dataItem.couponid);
            }
            if (Utils.isNotNull(dataItem.sn) && Utils.myTrim(dataItem.sn + "") != "null" && Utils.myTrim(dataItem.sn + "") != "") {
              sn=Utils.myTrim(dataItem.sn);
            }
            if (Utils.isNotNull(dataItem.win_no) && Utils.myTrim(dataItem.win_no + "") != "null" && Utils.myTrim(dataItem.win_no + "") != "") {
              win_no=Utils.myTrim(dataItem.win_no);
            }
            if (Utils.isNotNull(dataItem.headerImg) && Utils.myTrim(dataItem.headerImg + "") != "null" && Utils.myTrim(dataItem.headerImg + "") != "") {
              headerImg=Utils.myTrim(dataItem.headerImg);
            }
            if (Utils.isNotNull(dataItem.couponMoney) && Utils.myTrim(dataItem.couponMoney + "") != "") {
              try {
                couponMoney = parseFloat(dataItem.couponMoney);
                couponMoney = isNaN(couponMoney) ? 0.00 : couponMoney;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "") {
              try {
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.checked) && Utils.myTrim(dataItem.checked + "") != "") {
              try {
                checked = parseInt(dataItem.checked);
                checked = isNaN(checked) ? 0 : checked;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.win) && Utils.myTrim(dataItem.win + "") != "") {
              try {
                win = parseInt(dataItem.win);
                win = isNaN(win) ? 0 : win;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.couponid) && Utils.myTrim(dataItem.couponid + "") != "") {
              try {
                couponid = parseInt(dataItem.couponid);
                couponid = isNaN(couponid) ? 0 : couponid;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.periods) && Utils.myTrim(dataItem.periods + "") != "") {
              try {
                periods = parseInt(dataItem.periods);
                periods = isNaN(periods) ? 0 : periods;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.mobile) && Utils.myTrim(dataItem.mobile + "") != "null" && Utils.myTrim(dataItem.mobile + "") != "") {
              mobile=Utils.myTrim(dataItem.mobile);
            }
            if(orderId==that.data.orderId && userId==that.data.curUserId && win==1){
              isWin=true;
            }
            if(orderId==that.data.orderId && userId==that.data.curUserId && checked==1){
              isChecked=true;
            }
            //
            if(orderId==that.data.orderId && userId==that.data.curUserId){
              mySnList+=Utils.myTrim(mySnList) != ""?"、"+sn:sn;
            }
            gwPeriods=periods;
            isFull=win==1?true:isFull;

            create_dateStr==Utils.getDateTimeStr3(create_date,"/",101);
            mobile=Utils.myTrim(mobile) != "" && mobile.length>=11?mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"):mobile;
            listItem = {
              id:id,orderId:orderId,userId:userId,periods:periods,checked:checked,couponid:couponid,sn:sn,win:win,win_no:win_no,couponid:couponid,couponMoney:couponMoney,headerImg:headerImg,create_date:create_date,create_dateStr:create_dateStr,mobile:mobile,
            }
            orderItemList.push(listItem);
          }
        }
        
        that.setData({
          ["orderItemList"]: orderItemList,
          ["gwPeriods"]:gwPeriods,
          ["isFull"]:isFull,
        });
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团产品详情失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取拼团商品列表结果处理函数
  dowithGetGWProductList: function (dataList, tag, errorInfo,pageIndex) {
    let that = this;
    try{
      wx.hideLoading();
    }catch(e){}
    
    switch (tag) {
      case 1:
        console.log("拼团商品列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,proDataInfo = null;
          let id="",pid=0,companyId=0, couponMoney = 0.00,productName="",photo=defaultItemImgSrc,photosString = "",videoList = [],photos = [],photosTemp = [],isHavePhoto=false,introductionImgs=[],price=0.00,disparityPrice=0.00,spellGroupPrice=0.00,periods=0,totalNum=0,endDate=new Date(),isFull=false,cnt=0,wincnt=0,failcnt=0,leavecnt=0,mold=0,sid=0,lastPeriods=0;
          let percentage=0;
          dataItem = dataList[0];
          
          id=dataItem.id;
          pid=dataItem.pid;
          companyId=dataItem.companyId;
          productName=dataItem.productName;
          if (Utils.isNotNull(dataItem.endDate)) {
            try {
              endDate = new Date(Date.parse((dataItem.endDate + "").replace(/-/g, "/")))
            } catch (e) {
              try{
                endDate =new Date(Utils.dateAddDay(Utils.getDateTimeStr3(new Date(),"-",0),3));
              }catch(e){}
            }
          }else{
            try{
              endDate =new Date(Utils.dateAddDay(Utils.getDateTimeStr3(new Date(),"-",0),3));
            }catch(e){}
          }
          if (Utils.isNotNull(dataItem.photos) && Utils.myTrim(dataItem.photos + "") != "") {
            photosString = "";
            photosString = dataItem.photos;
            photosTemp = [];
            photosTemp = photosString.split(",");
            if (photosTemp.length > 0) {
              for (var n = 0; n < photosTemp.length; n++) {
                // 判断是否是视频地址
                photosString = photosTemp[n];
                photosString = Utils.isNotNull(photosString) ? photosString.toLowerCase() : photosString;
                if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                  photos.push(app.getSysImgUrl(photosTemp[n]));
                } else if (!Utils.isNull(photosString)) {
                  videoList.push({
                    src: photosTemp[n],
                    poster: photosTemp.length > 1 ? photosTemp[n + 1] : ""
                  });
                }
              }
            }
          }

          isHavePhoto = photos.length > 0 || videoList.length>0 ? true : isHavePhoto;
          photo=photos.length > 0?photos[0]:photo;
          if (Utils.isNotNull(dataItem.detailPhotos) && Utils.myTrim(dataItem.detailPhotos + "") != "") {
            photosString = "";
            photosString = dataItem.detailPhotos;
            introductionImgs = [];
            introductionImgs = photosString.split(",");
            if (introductionImgs.length > 0) {
              for (var n = 0; n < introductionImgs.length; n++) {
                if (introductionImgs[n] != null && introductionImgs[n] != undefined && Utils.myTrim(introductionImgs[n]) != "")
                  introductionImgs[n] = app.getSysImgUrl(introductionImgs[n]);
              }
            }
          }
          if (Utils.isNotNull(dataItem.price) && Utils.myTrim(dataItem.price + "") != "") {
            try {
              price = parseFloat(dataItem.price);
              price = isNaN(price) ? 0.00 : price;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.couponMoney) && Utils.myTrim(dataItem.couponMoney + "") != "") {
            try {
              couponMoney = parseFloat(dataItem.couponMoney);
              couponMoney = isNaN(couponMoney) ? 0.00 : couponMoney;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.spellGroupPrice) && Utils.myTrim(dataItem.spellGroupPrice + "") != "") {
            try {
              spellGroupPrice = parseFloat(dataItem.spellGroupPrice);
              spellGroupPrice = isNaN(spellGroupPrice) ? 0.00 : spellGroupPrice;
            } catch (err) {}
          }
          if(spellGroupPrice<=0.00 && Utils.isNotNull(dataItem.spellprice) && Utils.myTrim(dataItem.spellprice + "") != ""){
            try {
              spellGroupPrice = parseFloat(dataItem.spellprice);
              spellGroupPrice = isNaN(spellGroupPrice) ? 0.00 : spellGroupPrice;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.periods) && Utils.myTrim(dataItem.periods + "") != "") {
            try {
              periods = parseInt(dataItem.periods);
              periods = isNaN(periods) ? 0 : periods;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.totalNum) && Utils.myTrim(dataItem.totalNum + "") != "") {
            try {
              totalNum = parseInt(dataItem.totalNum);
              totalNum = isNaN(totalNum) ? 0 : totalNum;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.cnt) && Utils.myTrim(dataItem.cnt + "") != "") {
            try {
              cnt = parseInt(dataItem.cnt);
              cnt = isNaN(cnt) ? 0 : cnt;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.wincnt) && Utils.myTrim(dataItem.wincnt + "") != "") {
            try {
              wincnt = parseInt(dataItem.wincnt);
              wincnt = isNaN(wincnt) ? 0 : wincnt;
            } catch (err) {}
          }
          //
          if (Utils.isNotNull(dataItem.mold) && Utils.myTrim(dataItem.mold + "") != "") {
            try {
              mold = parseInt(dataItem.mold);
              mold = isNaN(mold) ? 0 : mold;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.sid) && Utils.myTrim(dataItem.sid + "") != "") {
            try {
              sid = parseInt(dataItem.sid);
              sid = isNaN(sid) ? 0 : sid;
            } catch (err) {}
          }
          disparityPrice=price-spellGroupPrice;
          let nowDate = new Date();
          isFull=cnt>=totalNum?true:isFull;
          //当有人参与了拼团，且结束时间已过期则拼团已满（如果没有人参与，则不检查结束时间）
          if(nowDate >= endDate && cnt>0){
            isFull=true;
          }
          
          failcnt= cnt>0 ? cnt-wincnt:0;
          leavecnt=totalNum-cnt;

          lastPeriods=periods-1;
          if(cnt>=totalNum){
            percentage=100;
          }else{
            percentage=Math.round(cnt/totalNum*100);
          }
          
          proDataInfo = {
            id:id,pid:pid,companyId:companyId,productName:productName,photo:photo,photos:photos,videoList:videoList,isHavePhoto:isHavePhoto,price:parseFloat(price.toFixed(app.data.limitQPDecCnt)),disparityPrice:parseFloat(disparityPrice.toFixed(app.data.limitQPDecCnt)), couponMoney : parseFloat(couponMoney.toFixed(app.data.limitQPDecCnt)),spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),periods:periods,totalNum:totalNum,endDate:endDate,isFull:isFull,cnt:cnt,wincnt:wincnt,failcnt:failcnt,leavecnt:leavecnt,mold:mold,sid:sid,
            productDetailList:[],
          }
          that.setData({
            ["proDataInfo"]: proDataInfo,
            ["percentage"]:percentage,
          });
          let otherOrderParam="&pid="+proDataInfo.id+"&sid="+that.data.Sid;
          app.getGWOrderDetail(that,otherOrderParam);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团产品列表失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
})
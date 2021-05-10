// pages/detailsgood/detailsgood.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  pageSize = 6,
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
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1500,
    danmuList:
    [{
      text: '',
      color: '#ff0000',
      time: 1
    }, {
      text: '',
      color: '#ff00ff',
      time: 3
    }],

    Sid:0,
    ProductId:0,
    proSDetailId:"",
    companyId:0,
    proDataInfo:null,
    orderItemList:[],      //已参与订单
    selDIndex:0,
    proDCnt:0,
    buyNum:1,
    buyAmount:0.00,

    lastPeriods:0,

    remainTime:0,
    remainTimeHours:"",
    remainTimeMinutes:"",
    paramShareUId:0,

    isDrinkProduct:false,  //是否饮品
    srcOptions:null,       //保存加载信息
    isGWOrderFull:0,       //拼团订单是否已满     

    selSpellGroupPrice:0.00,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 初始化值
    that.data.companyId = app.data.agentCompanyId
    that.data.srcOptions=options;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,paramShareUId = 0,isScene = false,dOptions = null;
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
    } catch (e) {}
    that.data.paramShareUId = paramShareUId;
    
    that.data.companyId = sOptions.companyid
    // 新界面跳转
    var newpage = sOptions.newpage
    if (!Utils.isNull(newpage)) {
      that.setData({
        newpage: newpage,
      })
    }

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
        let ProductId=null,Sid=0,num,otherParams="";
        try {
          if (Utils.isNotNull(sOptions.pid) && Utils.myTrim(sOptions.pid + "") != "") {
            ProductId = sOptions.pid;
            // ProductId = parseInt(sOptions.pid);
            // ProductId = isNaN(ProductId) ? 0 : ProductId;
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.sid) && Utils.myTrim(sOptions.sid + "") != "") {
            Sid = parseInt(sOptions.sid);
            Sid=isNaN(Sid)?0:Sid;
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.num) && Utils.myTrim(sOptions.num + "") != "") {
            num = parseInt(sOptions.num);
            num=isNaN(Sid)?0:num;
          }
        } catch (e) {}
        if(Utils.myTrim(ProductId) == ""){
          wx.showToast({
            title: "无效商品！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        that.setData({
          ["ProductId"]: ProductId,
          ["Sid"]:Sid,
        });
        otherParams="&pid="+that.data.ProductId;
        otherParams+=that.data.Sid>0?"&sid="+that.data.Sid:"";
        otherParams+=num>0?"&num="+num:"";
        let isHaveSid=that.data.Sid>0?true:false;
        app.getGWProductList(that,isHaveSid,otherParams,100,1);
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
  //方法：获取拼团商品列表结果处理函数
  dowithGetGWProductList: function (dataList, tag, errorInfo,pageIndex) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团商品列表获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,proDataInfo = null,isDrinkProduct=false;
          let id="",pid=0,companyId=0, couponMoney = 0.00,productName="",photo=defaultItemImgSrc,photosString = "",videoList = [],photos = [],photosTemp = [],isHavePhoto=false,introductionImgs=[],price=0.00,disparityPrice=0.00,spellGroupPrice=0.00,periods=0,totalNum=0,successNum =0,endDate=new Date(),isFull=false,cnt=0,wincnt=0,failcnt=0,leavecnt=0,mold=0,sid=0,lastPeriods=0,psid=0,pstatus=0;
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
                endDate =new Date(Utils.dateAddDay(Utils.getDateTimeStr3(new Date(),"/",0),3));
              }catch(e){}
            }
          }else{
            try{
              endDate =new Date(Utils.dateAddDay(Utils.getDateTimeStr3(new Date(),"/",0),3));
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
          //successNum 
          if (Utils.isNotNull(dataItem.successNum) && Utils.myTrim(dataItem.successNum + "") != "") {
            try {
              successNum = parseInt(dataItem.successNum);
              successNum = isNaN(successNum) ? 0 : successNum;
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
          if (Utils.isNotNull(dataItem.psid) && Utils.myTrim(dataItem.psid + "") != "") {
            try {
              psid = parseInt(dataItem.psid);
              psid = isNaN(psid) ? 0 : psid;
            } catch (err) {}
          }
          if (Utils.isNotNull(dataItem.pstatus) && Utils.myTrim(dataItem.pstatus + "") != "") {
            try {
              pstatus = parseInt(dataItem.pstatus);
              pstatus = isNaN(pstatus) ? 0 : pstatus;
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
          isDrinkProduct=mold==9?true:false;
          proDataInfo = {
            id:id,pid:pid,companyId:companyId,productName:productName,photos:photos,videoList:videoList,isHavePhoto:isHavePhoto,price:parseFloat(price.toFixed(app.data.limitQPDecCnt)),disparityPrice:parseFloat(disparityPrice.toFixed(app.data.limitQPDecCnt)), couponMoney : parseFloat(couponMoney.toFixed(app.data.limitQPDecCnt)),spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),periods:periods,totalNum:totalNum,successNum:successNum,endDate:endDate,isFull:isFull,cnt:cnt,wincnt:wincnt,failcnt:failcnt,leavecnt:leavecnt,mold:mold,sid:sid,psid:psid,pstatus:pstatus,
            productDetailList:[],
          }
          that.setData({
            ["proDataInfo"]: proDataInfo,
            ["proDCnt"]:0,

            ["lastPeriods"]:lastPeriods,
            ["isDrinkProduct"]:isDrinkProduct,
          });
          //获取商品详情
          let otherParam="&pid="+proDataInfo.id;
          app.getGWProductDetail(that,otherParam);
          if(proDataInfo.sid>0){
            let otherOrderParam="&pid="+proDataInfo.id+"&sid="+proDataInfo.sid;
            app.getGWOrderDetail(that,otherOrderParam);
          }
          //显示倒计时
          if(!isFull){
            that.computeDownTime(endDate);
          }
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
  //方法：获取拼团商品详情结果处理函数
  dowithGetGWProductDetail: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团商品详情获取结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,listItem=null,productDetailList = [],selDIndex=0,selSpellGroupPrice=0.00;
          let proDataInfo=that.data.proDataInfo,srcPrice=proDataInfo.price;
          let productDetailId="",attribute="",specs="",lblid=0,lblname="",lblsingle=0,lblprice=0.00,lab_spellgroup_price=0.00,photo=defaultItemImgSrc,photosString = "",photos = [],photosTemp = [],isHavePhoto=false,spellGroupPrice=0.00,checked=false;
          
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            productDetailId="";attribute="";lblname="";specs="";photo=defaultItemImgSrc;spellGroupPrice=0.00;lblid=0;lblsingle=0;lblprice=0.00;lab_spellgroup_price=0.00;
            productDetailId=dataItem.id;
            if (Utils.isNotNull(dataItem.attributeOne) && Utils.myTrim(dataItem.attributeOne + "") != "null" && Utils.myTrim(dataItem.attributeOne + "") != "") {
              attribute=Utils.myTrim(dataItem.attributeOne);
            }
            if (Utils.isNotNull(dataItem.attributeTwo) && Utils.myTrim(dataItem.attributeTwo + "") != "null" && Utils.myTrim(dataItem.attributeTwo + "") != "") {
              attribute+=Utils.myTrim(attribute)!=""?" "+Utils.myTrim(dataItem.attributeTwo):Utils.myTrim(dataItem.attributeTwo);
            }
            if (Utils.isNotNull(dataItem.lblname) && Utils.myTrim(dataItem.lblname + "") != "null" && Utils.myTrim(dataItem.lblname + "") != "") {
              lblname=Utils.myTrim(dataItem.lblname);
            }
            specs=attribute;
            if (Utils.myTrim(lblname) != "") {
              specs+=Utils.myTrim(specs)!=""?" "+lblname:lblname;
            }
            //商品图片
            if (Utils.isNotNull(dataItem.photos) && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = "";
              photosString = dataItem.photos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (let n = 0; n < photosTemp.length; n++) {
                  photosString = photosTemp[n].toLowerCase();
                  if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                    photo = app.getSysImgUrl(photosTemp[n]);
                    break;
                  }
                }
              }
            }
            if (Utils.isNotNull(dataItem.saleprcie) && Utils.myTrim(dataItem.saleprcie + "") != "") {
              try {
                spellGroupPrice = parseFloat(dataItem.saleprcie);
                spellGroupPrice = isNaN(spellGroupPrice) ? 0.00 : spellGroupPrice;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lblprice) && Utils.myTrim(dataItem.lblprice + "") != "") {
              try {
                lblprice = parseFloat(dataItem.lblprice);
                lblprice = isNaN(lblprice) ? 0.00 : lblprice;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lab_spellgroup_price) && Utils.myTrim(dataItem.lab_spellgroup_price + "") != "") {
              try {
                lab_spellgroup_price = parseFloat(dataItem.lab_spellgroup_price);
                lab_spellgroup_price = isNaN(lab_spellgroup_price) ? 0.00 : lab_spellgroup_price;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lblid) && Utils.myTrim(dataItem.lblid + "") != "") {
              try {
                lblid = parseInt(dataItem.lblid);
                lblid = isNaN(lblid) ? 0 : lblid;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.lblsingle) && Utils.myTrim(dataItem.lblsingle + "") != "") {
              try {
                lblsingle = parseInt(dataItem.lblsingle);
                lblsingle = isNaN(lblsingle) ? 0 : lblsingle;
              } catch (err) {}
            }
            
            listItem = {
              productDetailId:productDetailId,attribute:attribute,lblid:lblid,lblname:lblname,lblsingle:lblsingle,lblprice:parseFloat(lblprice.toFixed(app.data.limitQPDecCnt)),lab_spellgroup_price:parseFloat(lab_spellgroup_price.toFixed(app.data.limitQPDecCnt)),specs:specs,spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),photo:photo,
            }
            productDetailList.push(listItem);
          }
          if(productDetailList.length>0){            
            if(that.data.isDrinkProduct){
              //【1】如果为饮品商品
              srcPrice=productDetailList[0].lblprice;

              let srcProductDetailList=productDetailList,srcListItem=null,srcProductDetailId="",srcAttribute="",labels=[],lastLabelId=0;
              productDetailList=[]
              for(let i=0;i<srcProductDetailList.length;i++){
                checked=false;dataItem = null;dataItem=srcProductDetailList[i];
                if(Utils.myTrim(srcProductDetailId) != "" && Utils.myTrim(srcAttribute) != "" && srcProductDetailId==dataItem.productDetailId && srcAttribute==dataItem.attribute){
                  if(dataItem.lblid!=lastLabelId){
                    labels.push({lblid:dataItem.lblid,lblname:dataItem.lblname,lblsingle:dataItem.lblsingle,lblprice:dataItem.lblprice,spellGroupPrice:dataItem.lab_spellgroup_price,checked:checked})
                  }                  
                }else{
                  if(Utils.isNotNull(srcListItem)){
                    srcListItem.labels=labels;
                    productDetailList.push(srcListItem);
                  }               
  
                  labels=[];srcListItem=null;srcProductDetailId="";srcAttribute="";
                  srcProductDetailId=dataItem.productDetailId;srcAttribute=dataItem.attribute;
                  srcListItem=dataItem;
  
                  labels.push({lblid:dataItem.lblid,lblname:dataItem.lblname,lblsingle:dataItem.lblsingle,lblprice:dataItem.lblprice,spellGroupPrice:dataItem.lab_spellgroup_price,checked:checked})
                  lastLabelId=dataItem.lblid;
                }              
              }
              if(Utils.isNotNull(srcListItem)){
                srcListItem.labels=labels;
                productDetailList.push(srcListItem);
              }
  
              //获取对应的拼团单价
              let setI=0,setJ=0;
              for(let i=0;i<productDetailList.length;i++){
                for(let j=0;j<productDetailList[i].labels.length;j++){
                  if(productDetailList[i].labels[j].lblsingle==1){
                    productDetailList[i].labels[j].checked=true;

                    if(productDetailList[i].labels[j].spellGroupPrice>0.00){
                      if(selSpellGroupPrice<=0.00){
                        selSpellGroupPrice=productDetailList[i].labels[j].spellGroupPrice;
                        setI=i;setJ=j;
                      }else if(productDetailList[i].labels[j].spellGroupPrice>=selSpellGroupPrice){
                        selSpellGroupPrice=productDetailList[i].labels[j].spellGroupPrice;
                        setI=i;setJ=j;
                      }
                    }
                    break;
                  }         
                }
              }
              selDIndex=setI;
            }else{
              //【1】如果为非饮品商品
              selSpellGroupPrice=productDetailList[0].spellGroupPrice;
            }
          }
          
          
          that.setData({
            ["proDataInfo.productDetailList"]: productDetailList,
            //["proDataInfo.price"]:srcPrice,
            ["proDCnt"]:productDetailList.length,
            ["selDIndex"]:selDIndex,
            ["buyAmount"]:selSpellGroupPrice * 1,

            ["selSpellGroupPrice"]:selSpellGroupPrice,
          });
          console.log("解析后的商品明细：")
          console.log(productDetailList)
        }
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
        let dataItem = null,listItem=null,orderItemList = [];
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let id=0,userId=0,headerImg=defaultItemImgSrc;
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            userId=0;headerImg=defaultItemImgSrc;
            id=dataItem.id;
            if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "") {
              try {
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.headerImg) && Utils.myTrim(dataItem.headerImg + "") != "null" && Utils.myTrim(dataItem.headerImg + "") != "") {
              headerImg=Utils.myTrim(dataItem.headerImg);
            }
            listItem = {
              id:id,userId:userId,headerImg:headerImg,
            }
            orderItemList.push(listItem);
          }
        }
        
        that.setData({
          ["orderItemList"]: orderItemList,
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
  bindVideoLeavePictureInPicture() {
    console.log('退出小窗模式')
  },
  bindVideoEnterPictureInPicture() {
    console.log('进入小窗模式')
  },
  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  video(e) {
    var that = this;
    var _index = e.currentTarget.dataset.id;
    var a;
      a = 'myVideo'
      that.setData({
        video1: true
      });
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(a)
    videoContextPrev.stop();
    videoContextPrev.pause();
    //将点击视频进行播放
    var videoContext = wx.createVideoContext(_index)
    videoContext.play();
  },
  onchangedetailType(){
    this.setData({
      detailType: !this.data.detailType,
    })
  },
  //退出弹窗
  emptyType(){
    this.setData({
      detailType:false,
      productType:false,
      payType:false,
    })
  },
  //显示弹窗
  showout(){
    let that=this;
    if (that.data.proDataInfo.cnt >= that.data.proDataInfo.totalNum) {
      wx.showToast({
        title: "对不起，该期已拼满，请等待下一期！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(Utils.isNotNull(app.globalData.userInfo) && (Utils.isNull(app.globalData.userInfo.userMobile) || app.globalData.userInfo.userMobile.indexOf("u_")>=0)){
      wx.showModal({
        title: '提示',
        content: '该功能需要注册用户，您是否继续？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.data.curPageDataOptions={
              package:"packageYK",page:"/pages/detailsgood/detailsgood",options: that.data.srcOptions,
            }
            wx.redirectTo({
              url: '/packageYK/pages/tiedaphone/tiedaphone?lgt=2'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            
          }
        }
      })
      
      return;
    }else{
      that.setData({
        productType:!this.data.productType
      })
    }    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：计算倒计时
  computeDownTime: function (dtEnd){
    let that = this, remainTime=0;//getTimesByDateTime
    
    try{
      remainTime = Utils.getTimesByDateTime(new Date(),dtEnd,3);
      if (remainTime>0){
        that.setData({
          ["remainTime"]: remainTime,
        })
        that.startCountdown();
      }
    }catch(e){}
  },
  // 开始倒计时
  startCountdown: function () {
    var that = this
    if (Utils.isNotNull(internalDownTime)) clearInterval(internalDownTime);
    internalDownTime = setInterval(function () {
      var time = that.data.remainTime - 1;
      that.setData({
        ["remainTime"]: time,
      })
      if (time > 0) {
        that.transformRemainTime(that.data.remainTime);
      } else {
        that.setData({
          ["proDataInfo.isFull"]: true,
        })
        clearInterval(internalDownTime);
      }
    }, 1000);
  },
  //时间转换时分秒
  transformRemainTime: function (time) {
    let that = this;
    let sumSeconds = parseInt(time);
    let hours = parseInt(sumSeconds / 60 / 60);
    let minutes = parseInt(sumSeconds / 60 % 60);
    let seconds = parseInt(sumSeconds % 60);

    let days=parseInt(hours/24);
    let dayshours=parseInt(hours%24);
    
    that.setData({
      ["remainTimeHours"]: hours >= 10 ? hours : "0" + hours,
      ["remainTimeMinutes"]: minutes >= 10 ? minutes : (minutes <= 0 ? minutes : "0" + minutes),
      ["remainTimeSeconds"]: seconds >= 10 ? seconds : "0" + seconds,

      // ["remainTimeDays"]:days,
      // ["remainTimeDayHours"]:dayshours>=10?dayshours:"0"+dayshours,
    })
  },
  //事件：选择规格
  exchangeDetail: function (e) {
    var that = this, index = 0, proDataInfo = that.data.proDataInfo, proSDetailId = "", vtype = that.data.vtype;
    try {
      index = e.currentTarget.dataset.index;
      index = isNaN(index) ? 0 : index;
    } catch (err) { }
    try {
      proSDetailId = proDataInfo.productDetailList[index].productDetailId;
    } catch (err) { }

    that.setData({
      selDIndex: index,
      proSDetailId: proSDetailId,

      ["selSpellGroupPrice"]:proDataInfo.productDetailList[index].spellGroupPrice,

      buyNum: 1,
    })
    that.computeItemAmount();
  },
  //方法：计算总价
  computeItemAmount: function () {
    var that = this, num = that.data.buyNum, selSpellGroupPrice = that.data.selSpellGroupPrice, buyAmount = that.data.buyAmount;

    buyAmount = selSpellGroupPrice * num;

    that.setData({
      ["buyAmount"]: parseFloat((buyAmount).toFixed(app.data.limitQPDecCnt)),
    })
  },
  //事件：购物车数量增减
  computeItemCount: function (e) {
    var that = this,tag = "",num = 0,oldNum = 0,proDataInfo=that.data.proDataInfo;
    try {
      tag = e.currentTarget.dataset.tag;
    } catch (err) { }
    num = that.data.buyNum;
    oldNum = num;
    switch (Utils.myTrim(tag)) {
      case "-":
        if (num <= 1) {
          wx.showToast({
            title: "数量不能小于1",
            icon: 'none',
            duration: 2000
          })
        } else {
          num--;
        }
        break;
      case "+":
        num++;
        if (num > proDataInfo.leavecnt) {
          num = oldNum;
          wx.showToast({
            title: "对不起，最多只能购买"+proDataInfo.leavecnt+"份！",
            icon: 'none',
            duration: 2000
          })
        }
        break;
      default:
        try {
          num = parseInt(e.detail.value);
          num = isNaN(num) ? 0 : num;
        } catch (err) { }
        if (num <= 0) {
          num = oldNum;
          wx.showToast({
            title: "数量不能为0！",
            icon: 'none',
            duration: 2000
          })
        }
        break;
    }

    that.setData({
      ["buyNum"]: num,
    })
    that.computeItemAmount();
  },
  //事件：新增订单
  addOrderEvent:function(e){
    let that=this;
    let selDIndex =that.data.selDIndex , proDataInfo=that.data.proDataInfo,selProDetail = proDataInfo.productDetailList[selDIndex], sellPrice = that.data.selSpellGroupPrice;
    let itemList = [], listItem = null, detailList = [], detailListItem = null, companyId = proDataInfo.companyId<=0? app.data.companyId:proDataInfo.companyId, userId = appUserInfo.userId, mobile = appUserInfo.userMobile,buyNum=that.data.buyNum, amount = 0.00, linkNo = 11,lbl_ids="";

    if (buyNum > proDataInfo.leavecnt) {
      wx.showToast({
        title: "对不起，最多只能购买"+proDataInfo.leavecnt+"份！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    try{
      that.data.isGWOrderFull=(proDataInfo.leavecnt-buyNum)<=0?1:that.data.isGWOrderFull;
    }catch(e){}
    if(that.data.isDrinkProduct && Utils.isNotNull(proDataInfo.productDetailList) && proDataInfo.productDetailList.length>0){
      //如果为饮品商品
      let labelIdList=[];
      for(let i=0;i<proDataInfo.productDetailList.length;i++){
        for(let j=0;j<proDataInfo.productDetailList[i].labels.length;j++){
          if(proDataInfo.productDetailList[i].labels[j].checked){
            labelIdList.push(proDataInfo.productDetailList[i].labels[j].lblid);
          }
        }
      }
      if (labelIdList.length<=0) {
        wx.showToast({
          title: "商品规格不完整",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      lbl_ids=labelIdList.join("-");
    }else{
      lbl_ids=selProDetail.lblid;
    }
    
    if(that.data.isDrinkProduct){
      detailListItem = {
        product_id: proDataInfo.id,
        lbl_ids: lbl_ids,
        periods:proDataInfo.sid,
        number: buyNum,
        price: sellPrice,
        amount: sellPrice * buyNum,
      }
    }else{
      detailListItem = {
        product_id: proDataInfo.id,
        detail_id: selProDetail.productDetailId,
        lbl_ids: lbl_ids,
        periods:proDataInfo.sid,
        number: buyNum,
        price: sellPrice,
        amount: sellPrice * buyNum,
      }
    }
    
    

    amount += detailListItem.amount;
    detailList.push(detailListItem);
    listItem = {
      linkNo: linkNo,
      amount: amount,
      companyId: companyId,
      userId: userId,
      shareuserId: that.data.paramShareUId,
      mobile: mobile,
      deliveryId: 0,
      deliveryflag:1,
      detail: detailList
    }

    itemList.push(listItem);
    app.addSMOrderInfo2(that,itemList);
  },
  //方法：获取拼团商品详情结果处理函数
  dowithAddSMOrderInfo2: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团订单新增结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.data)) {
          let orderId="",payNo="",url="../../../packageSMall/pages/shoporders/shoporders";
          if (Utils.isNotNull(dataList.data.orderId) && Utils.myTrim(dataList.data.orderId + "") != "") {
            orderId = Utils.myTrim(dataList.data.orderId);
          }
          if (Utils.isNotNull(dataList.data.payNo) && Utils.myTrim(dataList.data.payNo + "") != "") {
            payNo = Utils.myTrim(dataList.data.payNo);
          }
          url+="?type=1&orderid=" + orderId+"&isf="+that.data.isGWOrderFull+"&sid="+that.data.proDataInfo.sid;
          wx.navigateTo({
            url: url,
            fail: function (e) {
              console.log("设置：isDowithing = false")
              isDowithing = false;
            }
          });
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "新增拼团订单失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：跳转拼团订单列表
  gotoGWOrderListPage:function(e){
    let that=this,sid=0,pid="",url="";
    try {
      pid = Utils.myTrim(e.currentTarget.dataset.pid);
    } catch (e) {}
    try {
      sid = parseInt(e.currentTarget.dataset.sid);
      sid=isNaN(sid)?0:sid;
    } catch (e) {}
    url="../../../packageYK/pages/tuxedo/tuxedo?sid="+sid+"&pid="+pid;
    wx.navigateTo({
      url: url
    })
  },
  //事件：选择饮品规格
  selectProductLabels(e) {
    let that = this,proDataInfo=that.data.proDataInfo,productDetailList=[],selSpellGroupPrice=that.data.selSpellGroupPrice;
    productDetailList=Utils.isNotNull(proDataInfo) && Utils.isNotNull(proDataInfo.productDetailList) && proDataInfo.productDetailList.length>0?proDataInfo.productDetailList:productDetailList;

    if(productDetailList.length>0){
      try{
        let index = e.currentTarget.dataset.index,labelindex = e.currentTarget.dataset.labelindex,setKey="";
        let labels=productDetailList[index].labels,isSingle=productDetailList[index].lblsingle==1?true:false,isCheck=true;
        for(let i=0;i<labels.length;i++){
          if(isSingle){
            if(i==labelindex){
              labels[i].checked=isCheck;
            }else{
              labels[i].checked=false;
            }
          }else{
            if(i==labelindex){
              labels[i].checked=!labels[i].checked;
            }
          }
        }
        productDetailList[index].labels=labels;

        let selDIndex=that.data.selDIndex, oldSpellGroupPrice=0.00,otherAmount=0.00;
        for(let a=0;a<productDetailList.length;a++){
          for(let b=0;b<productDetailList[a].labels.length;b++){
            if(productDetailList[a].labels[b].checked){
              //配料价格累计
              if(productDetailList[a].labels[b].lblsingle==0){
                otherAmount+=productDetailList[a].labels[b].lblprice;
              }
              //拼团单价获取
              if(productDetailList[a].labels[b].spellGroupPrice>=oldSpellGroupPrice){
                selDIndex=a;
                oldSpellGroupPrice=productDetailList[a].labels[b].spellGroupPrice;
              }
            }           
          }
        }
        selSpellGroupPrice = otherAmount+oldSpellGroupPrice;

        setKey="proDataInfo.productDetailList["+index+"].labels";
        that.setData({
          [setKey]: labels,
          ["selDIndex"]:selDIndex,

          ["selSpellGroupPrice"]:selSpellGroupPrice,
        })
        that.computeItemAmount();
      }catch(e){}
    }
    
  },
  kkk:function(e){
    let that=this,obj=null;
    obj = this.selectComponent('#payPop')
    obj.showPayForPop(1);
  },
  onExePageMethod:function(e){
    let that=this,content="";
    try {
      content = e.detail.content;
    } catch (e) { }
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    })
  }
})
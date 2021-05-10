// pages/particulars/particulars.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var packSMPageUrl = "../../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,sOptions=null,isGetByOrder=false,internalDownTime=null,internalPlayAn=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    randomNum: Math.random() / 9999,

    mlisttype:false,
    chiocetype:true,
    //中奖界面的高度
    maxhei:0,

    orderId:"",          //订单ID
    ProductId:"",        //商品ID
    Sid:0,               //期数ID
    GWTotleNum:0,        //拼团总人数
    curPeriods:0,        //当前期数
    sidOrderCnt:0,       //当前期份数

    curAllCnt:0,         //拼团总数
    curLeavecnt:0,       //拼团剩余份数

    proDataInfo:null,    //商品详情
    orderItemList:[],    //订单列表
    percentage:0,        //参与人数百分比
    curUserId:0,
    isWin:false,         //当前用户是否已中奖
    isChecked:false,     //当前用户是否已查看
    isOpenPrize:false,   //该期是否已开奖
    mySnList:"",         //参团编号序列
    curAmountCoupons:0.00,  //当前用户消费劵总金额

    remainTime:0,
    remainTimeHours:"",
    remainTimeMinutes:"",
    paramShareUId:0,
    shareAlert:"拼中享低价，拼不中还送消费券，我已收到消费券，快来跟我一起拼团吧~",

    isMulitiOrder:false, //是否跨期订单
    openType:0,          //0 拼团列表打开，1订单支付打开
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.dowithParam(options);
    if(!that.data.mlisttype){
      that.setData({
        chiocetype: false
      })
    }
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
        var orderId = "",ProductId="",Sid=0,GWTotleNum=0,otherOrderParam="",openType=0;
        try {
          if (Utils.isNotNull(sOptions.oid) && Utils.myTrim(sOptions.oid + "") != "") {
            orderId = Utils.myTrim(sOptions.oid);
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.pid) && Utils.myTrim(sOptions.pid + "") != "") {
            ProductId = Utils.myTrim(sOptions.pid);
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
            GWTotleNum = parseInt(sOptions.num);
            GWTotleNum=isNaN(GWTotleNum)?0:GWTotleNum;
          }
        } catch (e) {}
        try {
          if (Utils.isNotNull(sOptions.ot) && Utils.myTrim(sOptions.ot + "") != "") {
            openType = parseInt(sOptions.ot);
            openType=isNaN(openType)?0:openType;
          }
        } catch (e) {}
        that.setData({
          orderId: orderId,
          ProductId:ProductId,
          Sid:Sid,
          GWTotleNum:GWTotleNum,
          curUserId:appUserInfo.userId,
          openType:openType,
        })
        otherOrderParam="&pid="+ProductId;
        otherOrderParam+=openType==0?"&sid="+ Sid:"&orderId=" + orderId;
        isGetByOrder=openType==1?true:false;
        app.getGWOrderDetail(that,otherOrderParam);
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
  //事件：点击查看结果
  viewGWResult:function(e){
    let that = this,otherParam="&orderId="+that.data.orderId+"&userId="+appUserInfo.userId;
    app.updateGWOrderDetail(that,otherParam);
  },
  //方法：动画排列抽奖结果
  playGWResultAnimation() {
    let that = this,bustlist = that.data.orderItemList,Maxtop=0;
    that.setData({
      chiocetype: true
    })
    for (let i = 0; i < bustlist.length; i++) {
      if (i > 0) {
        if (bustlist[i].top > bustlist[i - 1].top) {
          Maxtop = bustlist[i].top
        }
      }
    }
    console.log(Maxtop)
    if(Maxtop < 20){
      Maxtop = 180
    }
    for (let i = 0; i < bustlist.length; i++) {
      bustlist[i].left = 260;
      bustlist[i].top = Maxtop;
    }
    this.setData({
      ["orderItemList"]: bustlist,
      mlisttype:true
    })
    var k =0;
    var satTime = 10000/bustlist.length
    internalPlayAn = setInterval(function(){
      if(k >= bustlist.length) {
        clearInterval(internalPlayAn)
        that.setData({
          chiocetype: false
        })
      }else{
        that.setGWOrderItemPosition(k)
      }
      k++;
    },satTime)
  },

  //方法：设置抽奖订单结果显示位置
  setGWOrderItemPosition(e) {
    var that =this
    var bustlist = that.data.orderItemList;
    bustlist[e].left = (e % 5) * 130
    bustlist[e].top = 14 + parseInt(e / 5) * 180
    that.setData({
      ["orderItemList"]: bustlist
    })
  },
  //方法：设置订单项布局位置
  setOrderItemsPosition(orderItemList,tag) {
    let that =this;
    if(tag){
      if(Utils.isNotNull(orderItemList) && orderItemList.length > 0){
        for(let i=0;i<orderItemList.length;i++){
          orderItemList[i].left = (i % 5) * 130
          orderItemList[i].top = 14 + parseInt(i / 5) * 180
        }
      }
    }
    if(orderItemList.length>10){
      let maxhei = parseInt(orderItemList.length/5) * 170+170
      that.setData({
        ["maxhei"]: maxhei
      })
    }
    console.log(this.data.maxhei)
    that.setData({
      ["orderItemList"]: orderItemList
    })
  },

  emptyType(){
    this.setData({
      detailType:false
    })
  },
  onchangedetailType(){
    this.setData({
      detailType:!this.data.detailType
    })
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
    var that = this, proDataInfo = that.data.proDataInfo, shareWXImg = that.data.shareWXImg, shareAlert = that.data.shareAlert, url = "";
    shareAlert=that.data.isWin?shareAlert:(that.data.curAmountCoupons>0?"拼中享低价，拼不中还送消费券，我已收到消费券金额（"+that.data.curAmountCoupons+"），快来跟我一起拼团吧~":shareAlert);
    
    url = "/packageYK/pages/detailsgood/detailsgood?pid=" + encodeURIComponent(proDataInfo.id) + "&sid=" + that.data.Sid + "&suid=" + appUserInfo.userId;
    console.log("商品分享：" + url)
    return {
      title: shareAlert,
      path: url,
      // imageUrl: shareWXImg,
      success: (res) => { // 成功后要做的事情
        console.log("分享拼团抽奖商品成功")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
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
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let dataItem = null,listItem=null,orderItemList = [],proDataInfo=that.data.proDataInfo;
          let id=0,orderId="",userId=0,checked=0,couponid="",sn="",win=0,win_no="",couponMoney=0.00,headerImg=defaultItemImgSrc,periods=0,endDate=new Date(),periodsid=0;
          let mySnList="",isWin=false,isChecked=false,isOpenPrize=false,percentage=0,curPeriods=0,curAmountCoupons=0.00;
          let isMulitiOrder=false,lastPeriodsid=0,sidList=[],Sid=that.data.Sid;
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            orderId="";userId=0;checked=0;couponid="";sn="";win=0;win_no="";couponid=0;couponMoney=0.00;headerImg=defaultItemImgSrc;endDate=new Date();periodsid=0;
            id=dataItem.id;
            if (Utils.isNotNull(dataItem.endDate)) {
              try {
                endDate = new Date(Date.parse((dataItem.endDate + "").replace(/-/g, "/")))
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
            //periodsid
            if (Utils.isNotNull(dataItem.periodsid) && Utils.myTrim(dataItem.periodsid + "") != "") {
              try {
                periodsid = parseInt(dataItem.periodsid);
                periodsid = isNaN(periodsid) ? 0 : periodsid;
              } catch (err) {}
            }
            if(periodsid!=lastPeriodsid){
              sidList.push(periodsid);
              lastPeriodsid=periodsid>lastPeriodsid?periodsid:lastPeriodsid;
            }
            
            if(!isGetByOrder){
              if(orderId==that.data.orderId && userId==that.data.curUserId){
                isWin=win==1?true:isWin;
                isChecked=checked==1?true:isChecked;
                curAmountCoupons+=couponMoney;
                mySnList+=Utils.myTrim(mySnList) != ""?"、"+sn:sn;
              }
              isOpenPrize=win==1?true:isOpenPrize;
              curPeriods=periods;
            }
            listItem = {
              id:i,orderId:orderId,userId:userId,checked:checked,couponid:couponid,sn:sn,win:win,win_no:win_no,couponid:couponid,couponMoney:couponMoney,headerImg:headerImg,periods:periods,periodsid:periodsid,
            }
            orderItemList.push(listItem);
          }
          if(isGetByOrder){
            //【1】如果是根据订单号来查询——检查是否跨期，并找到最后一个期数ID
            Sid=Sid<=0?lastPeriodsid:Sid;
            isMulitiOrder=sidList.length>1?true:false;
            that.setData({
              ["isMulitiOrder"]: isMulitiOrder,
              ["Sid"]:Sid,
            });
            //重新根据商品ID和最后期数ID获取相关订单列表
            let otherOrderParam="&pid="+that.data.ProductId+"&sid="+ Sid;
            isGetByOrder=false;
            app.getGWOrderDetail(that,otherOrderParam);
          }else{
            //【2】如果为商品ID和期数ID获取相关订单列表
            that.setData({
              ["orderItemList"]: orderItemList,
              ["isWin"]:isWin,
              ["isOpenPrize"]:isOpenPrize,
              ["isChecked"]:isChecked,
              ["mySnList"]:mySnList,
              ["curPeriods"]:curPeriods,
            });
            //获取商品信息
            let otherProductParam="&pid="+that.data.ProductId;
            otherProductParam+=that.data.Sid>0?"&sid="+that.data.Sid:"";
            otherProductParam+=that.data.Sid<=0 && that.data.GWTotleNum>0?"&num="+that.data.GWTotleNum:"";
            let isHaveSid=that.data.Sid>0?true:false;
            app.getGWProductList(that,isHaveSid,otherProductParam,100,1);
  
            that.setOrderItemsPosition(orderItemList);
            //如果已经查看过则直接显示抽奖结果
            if(isChecked){
              that.setOrderItemsPosition(orderItemList,true);
            }else{
              that.setOrderItemsPosition(orderItemList,false);
            }
          }
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
          let dataItem = null,proDataInfo = null,curAllCnt=0;
          let id="",pid=0,companyId=0, couponMoney = 0.00,productName="",photo=defaultItemImgSrc,photosString = "",videoList = [],photos = [],photosTemp = [],isHavePhoto=false,introductionImgs=[],price=0.00,disparityPrice=0.00,spellGroupPrice=0.00,periods=0,totalNum=0,endDate=new Date(),isFull=false,cnt=0,wincnt=0,failcnt=0,leavecnt=0,mold=0,sid=0,lastPeriods=0;
          let percentage=0,isOpenPrize=that.data.isOpenPrize;
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
          
          proDataInfo = {
            id:id,pid:pid,companyId:companyId,productName:productName,photo:photo,photos:photos,videoList:videoList,isHavePhoto:isHavePhoto,price:parseFloat(price.toFixed(app.data.limitQPDecCnt)),disparityPrice:parseFloat(disparityPrice.toFixed(app.data.limitQPDecCnt)), couponMoney : parseFloat(couponMoney.toFixed(app.data.limitQPDecCnt)),spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),periods:periods,totalNum:totalNum,endDate:endDate,isFull:isFull,cnt:cnt,wincnt:wincnt,failcnt:failcnt,leavecnt:leavecnt,mold:mold,sid:sid,
            productDetailList:[],
          }
          let sidOrderCnt=that.data.orderItemList.length;
          if(totalNum>0){
            percentage=Math.round(sidOrderCnt/totalNum*100);
          }

          //如果已过了截止时间则默认为已开奖状态
          if(!isOpenPrize && (new Date())>endDate){
            isOpenPrize=true;
          }
          
          that.setData({
            ["proDataInfo"]: proDataInfo,
            ["curAllCnt"]:totalNum,
            ["Sid"]:that.data.Sid>0?that.data.Sid:proDataInfo.sid,

            ["percentage"]:percentage,
            ["isOpenPrize"]:isOpenPrize,
            ["curLeavecnt"]:totalNum-sidOrderCnt,
          });
          //显示倒计时
          if(!isOpenPrize){
            that.computeDownTime(endDate);
          }
          if(that.data.isMulitiOrder){
            wx.showModal({
              title: '提示',
              content: '您的订单份数超过拼团限额，已做自动排新期处理！上期拼团订单信息请到“我的”-“我的拼团”中查看',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
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
  //方法：修改拼团抽奖订单结果处理函数
  dowithUpdateGWOrderDetail: function (dataList, tag, errorInfo) {
    let that = this;
    
    switch (tag) {
      case 1:
        console.log("拼团抽奖订单修改结果：");
        console.log(dataList);
        that.setData({
          ["isChecked"]: true,
        });
        
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "修改查看状态失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
    
    //如果已经开奖且当前用户未中奖则做退款操作
    if(that.data.isOpenPrize && !that.data.isWin && Utils.myTrim(that.data.orderId) != ""){
      let otherParam="&type=1&wxAppId="+app.data.wxAppId;
      app.refundGWOrderAmount(that,that.data.orderId,otherParam)
    }
    that.playGWResultAnimation();
  },
  //方法：未中拼团抽奖订单退款结果处理函数
  dowithRefundGWOrderAmoun: function (dataList, tag, errorInfo) {
    let that = this;
    
    switch (tag) {
      case 1:
        console.log("未中拼团抽奖订单退款结果：");
        console.log(dataList);
        wx.showToast({
          title: "未中订单退款已处理，请注意查看！",
          icon: 'none',
          duration: 2000
        })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "退款失败，请联系管理员！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
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
  //事件：跳转我的拼团
  gotoOrderPage:function(e){
    let that=this,url="../../../packageYK/pages/myspelling/myspelling";
    wx.redirectTo({
      url: url
    })
  },
  //事件：返回
  gotoBackGWHome:function(e){
    let that=this,url="../../../pages/doorway/doorway";
    wx.reLaunch({
      url:url
    })
  }
})
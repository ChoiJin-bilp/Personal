// pages/myspelling/myspelling.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,pageSize = 10,
defaultItemImgSrc = SMDataURL + app.data.defaultImg;;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    randomNum: Math.random() / 9999,
    isLoad: false,                                 //是否已经加载
    isForbidRefresh: false,                        //是否禁止刷新

    gwProductList:[],
    gwStatus:0,         //拼团中0，已开奖2
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
    var that = this,paramShareUId = 0,isScene = false,dOptions = null;
    console.log(options)
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
    console.log("加载参数：");
    console.log(sOptions);
    
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

  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      default:
        appUserInfo = app.globalData.userInfo;
        
        that.loadInitData();
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
        }
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this,gwStatus=that.data.gwStatus,valid=gwStatus==0?1:0,otherParam="";
    otherParam="&userId="+appUserInfo.userId+"&status="+gwStatus+"&valid="+valid+"&sField=orderId&sOrder=desc";
    app.getGWOrderDetail(that,otherParam);
  },
  //方法：获取拼团抽奖订单结果处理函数
  dowithGetGWOrderDetail: function (dataList, tag, errorInfo) {
    let that = this;
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("拼团抽奖订单获取结果：");
        console.log(dataList);
        let dataItem = null,listItem=null,orderItemList = [],isWin=false;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList) && dataList.length > 0) {
          let oid=0,orderId="",userId=0,checked=0,couponid="",sn="",win=0,win_no="",couponMoney=0.00,headerImg=defaultItemImgSrc,periodsid=0;
          let product_id="",pid=0,companyId=0, productName="",photo=defaultItemImgSrc,photosString = "",photos = [],photosTemp = [],price=0.00,spellGroupPrice=0.00,periods=0,totalNum=0,endDate=new Date(),isFull=false,cnt=0,wincnt=0,leavecnt=0,sid=0,percentage=0,endDateStr="",linkNo=0;
          let mySnList="";
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            orderId="";userId=0;checked=0;couponid="";sn="";win=0;win_no="";couponid=0;couponMoney=0.00;linkNo=0;headerImg=defaultItemImgSrc;

            product_id="";pid=0;companyId=0; productName="";photo=defaultItemImgSrc;photosString = "";photos = [];photosTemp = [];price=0.00;spellGroupPrice=0.00;periods=0;totalNum=0;endDate=new Date();isFull=false;cnt=0;wincnt=0;leavecnt=0;sid=0;percentage=0;endDateStr="";

            oid=dataItem.id;
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
            

            //////////////////////////////////////////
            if (Utils.isNotNull(dataItem.product_id) && Utils.myTrim(dataItem.product_id + "") != "null" && Utils.myTrim(dataItem.product_id + "") != "") {
              product_id=Utils.myTrim(dataItem.product_id);
            }
            if (Utils.isNotNull(dataItem.productName) && Utils.myTrim(dataItem.productName + "") != "null" && Utils.myTrim(dataItem.productName + "") != "") {
              productName=Utils.myTrim(dataItem.productName);
            }
            if (Utils.isNotNull(dataItem.endDate)) {
              try {
                endDate = new Date(Date.parse((dataItem.endDate + "").replace(/-/g, "/")))
              } catch (e) {
                try{
                  endDate =new Date(Utils.dateAddDay(Utils.getDateTimeStr3(new Date(),"-",0),3));
                }catch(e){}
              }
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
                  }
                }
              }
            }
            
            if (Utils.isNotNull(dataItem.price) && Utils.myTrim(dataItem.price + "") != "") {
              try {
                price = parseFloat(dataItem.price);
                price = isNaN(price) ? 0.00 : price;
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
            if (Utils.isNotNull(dataItem.periodsid) && Utils.myTrim(dataItem.periodsid + "") != "") {
              try {
                sid = parseInt(dataItem.periodsid);
                sid = isNaN(sid) ? 0 : sid;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.linkNo) && Utils.myTrim(dataItem.linkNo + "") != "") {
              try {
                linkNo = parseInt(dataItem.linkNo);
                linkNo = isNaN(linkNo) ? 0 : linkNo;
              } catch (err) {}
            }
            let nowDate = new Date();
            isFull=cnt>=totalNum?true:isFull;
            //当有人参与了拼团，且结束时间已过期则拼团已满（如果没有人参与，则不检查结束时间）
            // if(nowDate >= endDate && cnt>0){
            //   isFull=true;
            // }
            photo=photos.length>0?photos[0]:photo;
            leavecnt=totalNum-cnt;

            if(cnt>=totalNum){
              percentage=100;
            }else{
              percentage=Math.round(cnt/totalNum*100);
            }
            endDateStr=Utils.getDateTimeStr3(endDate,"/",101);
            listItem = {
              oid:oid,orderId:orderId,userId:userId,checked:checked,couponid:couponid,sn:sn,win:win,win_no:win_no,couponid:couponid,couponMoney:parseFloat(couponMoney.toFixed(app.data.limitQPDecCnt)),headerImg:headerImg,

              product_id:product_id,pid:pid,companyId:companyId, productName:productName,photo:photo,price:parseFloat(price.toFixed(app.data.limitQPDecCnt)),spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),periods:periods,totalNum:totalNum,endDate:endDate,endDateStr:endDateStr,isFull:isFull,cnt:cnt,wincnt:wincnt,leavecnt:leavecnt,sid:sid,percentage:percentage,linkNo:linkNo,
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
  //事件：切换列表状态
  exchangeStatList:function(e){
    let that=this,gwStatus=0;
    try {
      gwStatus = parseInt(e.currentTarget.dataset.status);
      gwStatus=isNaN(gwStatus)?0:gwStatus;
    } catch (e) {}
    that.setData({
      ["gwStatus"]: gwStatus,
    });

    that.loadInitData();
  },
  //事件：跳转拼团详情
  gotoGWDetailPage:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      let url='../../../packageYK/pages/particulars/particulars?oid='+item.orderId + "&pid=" + item.product_id+"&sid="+item.sid + "&num="+item.totalNum;
      wx.navigateTo({
        url: url
      })
    }
  },
  //事件：跳转订单详情
  gotoGWOrderPage:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      let url='../../../packageOther/pages/successDetailspa/successDetailspa?oid='+item.orderId + "&companyId=" + item.companyId;
      wx.navigateTo({
        url: url
      })
    }
  },
})
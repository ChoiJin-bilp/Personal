// pages/seniority/seniority.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,pageSize = 10,
defaultItemImgSrc = SMDataURL + app.data.defaultImg,isCurUser=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    randomNum: Math.random() / 9999,
    isLoad: false,                                 //是否已经加载
    isForbidRefresh: false,                        //是否禁止刷新

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    companyId:0,
    gwProductList:[],
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
        this.setData({
          companyId: app.data.agentCompanyId>0?app.data.agentCompanyId:app.data.companyId,
        })
        let otherParamCon = "&companyId="+that.data.companyId+"&userId="+appUserInfo.userId+"&win=0";
        app.getGWCouponList(that, otherParamCon, pageSize, 1);

        let otherParams="&companyId="+that.data.companyId+"&type=1";
        app.getGWProductList(that,false,otherParams,100,1);
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
  //////////////////////////////////////////////////////////////////////
  //----信息列表---------------------------------------------------------
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
    this.loadInitData();
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this
    let currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    let that = this
    let currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    let tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex) {
    let that = this,otherParamCon = "&companyId="+that.data.companyId+"&win=0";
    app.getGWCouponList(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取资讯信息列表结果处理函数
  dowithGetGWCouponList: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,
      mainTypeName = that.data.mainTypeName,
      noDataAlert = "暂无" + mainTypeName + "信息！";
    wx.hideLoading();
    switch (tag) {
      case 1:
        console.log("获取拼团优惠券列表信息：")
        console.log(dataList);
        let articles = [],curUserInfo=null;
        let dataItem = null,listItem = null;
        let userId=0,contact="",seq=0,total=0.00,mobile="",headerImg=defaultItemImgSrc;
        if (Utils.isNotNull(dataList) && dataList.length > 0) {
          if(isCurUser){
            dataItem = dataList[0];
            if (Utils.isNotNull(dataItem.contact) && Utils.myTrim(dataItem.contact + "") != "null" && Utils.myTrim(dataItem.contact + "") != "") {
              contact=Utils.myTrim(dataItem.contact);
            }
            if (Utils.isNotNull(dataItem.mobile) && Utils.myTrim(dataItem.mobile + "") != "null" && Utils.myTrim(dataItem.mobile + "") != "") {
              mobile=Utils.myTrim(dataItem.mobile);
            }
            if (Utils.isNotNull(dataItem.headerImg) && Utils.myTrim(dataItem.headerImg + "") != "null" && Utils.myTrim(dataItem.headerImg + "") != "") {
              headerImg=Utils.myTrim(dataItem.headerImg);
            }
            
            if (Utils.isNotNull(dataItem.total) && Utils.myTrim(dataItem.total + "") != "") {
              try {
                total = parseFloat(dataItem.total);
                total = isNaN(total) ? 0.00 : total;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "") {
              try {
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              } catch (err) {}
            }
            if (Utils.isNotNull(dataItem.seq) && Utils.myTrim(dataItem.seq + "") != "") {
              try {
                seq = parseInt(dataItem.seq);
                seq = isNaN(seq) ? 0 : seq;
              } catch (err) {}
            }
            
            curUserInfo = {
              userId:userId,contact:contact,seq:seq,total:parseFloat(total.toFixed(app.data.limitQPDecCnt)),mobile:mobile,headerImg:headerImg,
            }
          }else{
            for (var i = 0; i < dataList.length; i++) {
              dataItem = null;listItem = null;dataItem = dataList[i];
              userId=0;contact="";seq=0;total=0.00;mobile="";headerImg=defaultItemImgSrc;
  
              if (Utils.isNotNull(dataItem.contact) && Utils.myTrim(dataItem.contact + "") != "null" && Utils.myTrim(dataItem.contact + "") != "") {
                contact=Utils.myTrim(dataItem.contact);
              }
              if (Utils.isNotNull(dataItem.mobile) && Utils.myTrim(dataItem.mobile + "") != "null" && Utils.myTrim(dataItem.mobile + "") != "") {
                mobile=Utils.myTrim(dataItem.mobile);
              }
              if (Utils.isNotNull(dataItem.headerImg) && Utils.myTrim(dataItem.headerImg + "") != "null" && Utils.myTrim(dataItem.headerImg + "") != "") {
                headerImg=Utils.myTrim(dataItem.headerImg);
              }
              
              if (Utils.isNotNull(dataItem.total) && Utils.myTrim(dataItem.total + "") != "") {
                try {
                  total = parseFloat(dataItem.total);
                  total = isNaN(total) ? 0.00 : total;
                } catch (err) {}
              }
              if (Utils.isNotNull(dataItem.userId) && Utils.myTrim(dataItem.userId + "") != "") {
                try {
                  userId = parseInt(dataItem.userId);
                  userId = isNaN(userId) ? 0 : userId;
                } catch (err) {}
              }
              if (Utils.isNotNull(dataItem.seq) && Utils.myTrim(dataItem.seq + "") != "") {
                try {
                  seq = parseInt(dataItem.seq);
                  seq = isNaN(seq) ? 0 : seq;
                } catch (err) {}
              }
              
              listItem = {
                userId:userId,contact:contact,seq:seq,total:parseFloat(total.toFixed(app.data.limitQPDecCnt)),mobile:mobile,headerImg:headerImg,
              }
              articles.push(listItem);
            }
          }
          
        }

        //curUserInfo
        if(isCurUser){
          that.setData({
            ["curUserInfo"]: curUserInfo,
          })
          isCurUser= false;
          that.loadInitData();
        }else{
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
            })
          } else if (pageIndex == 1) {
            wx.showToast({
              title: noDataAlert,
              icon: 'none',
              duration: 2000
            })
          }
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无返劵信息！";
        break;
    }
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
          let dataItem = null,listItem = null,gwProductList = [];
          let id="",pid=0,companyId=0, couponMoney = 0.00,name="",photo=defaultItemImgSrc,photosString = "",photosTemp = [],price=0.00,spellGroupPrice=0.00,periods=0,totalNum=0,endDate=new Date(),isFull=false,cnt=0,wincnt=0,endDateStr="",percentage=0;
          for (var i = 0; i < dataList.length; i++) {
            dataItem = null;listItem = null;dataItem = dataList[i];
            couponMoney = 0.00;name="";photo=defaultItemImgSrc;price=0.00;spellGroupPrice=0.00;periods=0;totalNum=0;endDate=new Date();isFull=false;cnt=0;wincnt=0;endDateStr="";percentage=0;
            id=dataItem.id;
            pid=dataItem.pid;
            companyId=dataItem.companyId;
            name=dataItem.productName;
            if (Utils.isNotNull(dataItem.couponMoney) && Utils.myTrim(dataItem.couponMoney + "") != "") {
              try {
                couponMoney = parseFloat(dataItem.couponMoney);
                couponMoney = isNaN(couponMoney) ? 0.00 : couponMoney;
              } catch (err) {}
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
            if (Utils.isNotNull(dataItem.endDate)) {
              try {
                endDate = new Date(Date.parse((dataItem.endDate + "").replace(/-/g, "/")))
              } catch (e) {}
            }
            let nowDate = new Date();
            isFull=cnt>=totalNum?true:isFull;
            //当有人参与了拼团，且结束时间已过期则拼团已满（如果没有人参与，则不检查结束时间）
            if(nowDate >= endDate && cnt>0){
              isFull=true;
            }
            
            if(cnt>=totalNum){
              percentage=100;
            }else{
              percentage=Math.round(cnt/totalNum*100);
            }
            endDateStr=Utils.getDateTimeStr3(endDate,"/",101);
            listItem = {
              id:id,pid:pid,companyId:companyId, couponMoney : parseFloat(couponMoney.toFixed(app.data.limitQPDecCnt)),name:name,photo:photo,price:parseFloat(price.toFixed(app.data.limitQPDecCnt)),spellGroupPrice:parseFloat(spellGroupPrice.toFixed(app.data.limitQPDecCnt)),periods:periods,totalNum:totalNum,endDate:endDate,isFull:isFull,cnt:cnt,wincnt:wincnt,endDateStr:endDateStr,percentage:percentage,
            }
            gwProductList.push(listItem);
          }
          that.setData({
            ["gwProductList"]: gwProductList,
          });
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
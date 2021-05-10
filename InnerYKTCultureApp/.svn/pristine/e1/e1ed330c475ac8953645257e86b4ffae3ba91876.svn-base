// packageVP/pages/verification/verification.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var pageSize =3;// app.data.pageSize;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    isLoad: false,             //是否已经加载
    isForbidRefresh: false,    //是否禁止刷新

    agentUserCompanyList:[],   //登录公司列表
    selAgentCIndex:-1,
    searchKeyword:"",              //搜索关键字
    sStartDate:"",
    sEndDate:"",

    totalDataCount: 0,      //总记录数
    currentPage: 0,         //当前页码
    articles: [],           //记录集合

    startDate: '2020-08-01',
    endDate: "2020-09-01",
    status: [{
        statu: 0,
        name: "云客茶语"
      },
      {
        statu: 1,
        name: "歇脚吧"
      }, {
        statu: 2,
        name: "未接单"
      }
    ],
    selectStatusIndex: 0,
    putrList:[
      {name:'充值单号',kgyu:'DFKJDS2020001'},
      {name:'核销地址',kgyu:'深圳市福田区某某路东方科技大厦'},
      {name:'用户ID',kgyu:'545455454'},
      {name:'核销人',kgyu:'张三'},
      {name:'核销人ID',kgyu:'4554878'},
      {name:'核销时间',kgyu:'2020.08.18 14:52'},
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this,stDate=new Date(),etDate=Utils.getDateTimeAddDays(stDate,1),sStartDate="",sEndDate="";
    appUserInfo = app.globalData.userInfo;

    stDate=Utils.getDateTimeAddDays(stDate,-30);
    sStartDate=Utils.getDateTimeStr(stDate,"/",false);
    sEndDate=Utils.getDateTimeStr(etDate,"/",false);
    that.setData({
      ["agentUserCompanyList"]: app.data.agentUserCompanyList,
      ["selAgentCIndex"]:0,
      ["sStartDate"]: sStartDate,
      ["sEndDate"]:sEndDate,
    })
    
    that.loadInitData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) 
        return;
      else{
        let tag = -1;
        //选择日期时间操作
        try {
          let tagObj = wx.getStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId);
          tag = parseInt(tagObj);
          tag = isNaN(tag) ? -1 : tag;
        } catch (err) { }
        if (tag >= 0) {
          //tag:0日期选择
          switch(tag){
            case 0:
              let selDTStartValue = "", selDTEndValue = "";
              try {
                let pages = getCurrentPages();
                let currPage = pages[pages.length - 1];
                selDTStartValue = currPage.data.paramstart;
                selDTEndValue = currPage.data.paramend;
              } catch (err) { }
              that.setData({
                ["sStartDate"]: selDTStartValue,
                ["sEndDate"]:selDTEndValue,
              })
              that.loadInitData();
              break;
            
          }
          try {
            wx.removeStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId)
          } catch (e) { }
          
        }
        if(!that.data.isForbidRefresh){
          that.loadInitData();
        }
      }
    }
    that.data.isForbidRefresh=false;
  },
  //事件：下拉加载更多
  bindDownLoad: function () {
    this.loadMoreData();
  },
  //事件：上拉刷新
  bindTopLoad: function () {
    this.loadInitData();
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    that.setData({
      dataArray: [],
    });

    // 获取第一页列表信息
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //方法：获取产品列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this,searchKeyword=that.data.searchKeyword,agentUserCompanyList=that.data.agentUserCompanyList,selAgentCIndex=that.data.selAgentCIndex,sStartDate=that.data.sStartDate,sEndDate=that.data.sEndDate,companyId=0,otherParams="";
    try{
      companyId=(Utils.isNotNull(agentUserCompanyList) && agentUserCompanyList.length>0)?agentUserCompanyList[selAgentCIndex]:0;
    }catch(e){}
    companyId=companyId>0?companyId:app.data.companyId;
    otherParams="&verify=2&companyId="+companyId;
    //keyword
    if(Utils.myTrim(searchKeyword) != ""){
      otherParams+="&keyword="+encodeURIComponent(searchKeyword);
    }
    if(Utils.myTrim(sStartDate) != "" && Utils.myTrim(sEndDate) != ""){
      otherParams+="&startDate="+encodeURIComponent(sStartDate)+"&endDate="+encodeURIComponent(sEndDate);
    }
    //获取会员充值详情
    app.getMemberRechargeDetail(that,0,otherParams,pageSize, pageIndex);
  },
  //方法：获取会员充值详情结果处理函数
  dowithGetMemberRechargeDetail: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,noDataAlert = "暂无核销记录信息！";
    wx.hideLoading();
    that.data.isLoad = true;
    switch (tag) {
      case 1:       
        console.log("获取会员充值详情结果：");
        console.log(dataList);
        let articles = [];
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0){
          let data = dataList.dataList,dataItem=null,listItem=null;
          let id=0,tradeNo="",orderId="",userId=0,price=0.00,money=0.00,integral=0,orImgUrl="",productId=0,verify=0,verify_content="",updateDate=new Date(),updateDateStr="",verify_addr="",verify_admin="",verify_adminUId=0,content="";
          let verifyArray=null;
          for(let i=0;i<data.length;i++){
            dataItem=null;listItem=null;dataItem=data[i];
            id=0;tradeNo="";orderId="";userId=0;price=0.00;money=0.00;integral=0;orImgUrl="";productId=0;verify=0;verify_content="";updateDate=new Date();updateDateStr="";verify_addr="";verify_admin="";verify_adminUId=0;content="";
            verifyArray=null;
            id=dataItem.id;
            if (Utils.isDBNotNull(dataItem.verify))
            {
              try{
                verify = parseInt(dataItem.verify);
                verify = isNaN(verify) ? 0 : verify;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.iupdateDate)) {
              try {
                updateDate = new Date(Date.parse((dataItem.iupdateDate + "").replace(/-/g, "/")))
              } catch (e) { updateDate = new Date(); }
              updateDateStr = Utils.getDateTimeStr(updateDate, "/", true);
            }
            if (Utils.isDBNotNull(dataItem.userId))
            {
              try{
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.integral))
            {
              try{
                integral = parseInt(dataItem.integral);
                integral = isNaN(integral) ? 0 : integral;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.productId))
            {
              try{
                productId = parseInt(dataItem.productId);
                productId = isNaN(productId) ? 0 : productId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.tradeNo)){
              tradeNo = dataItem.tradeNo;
            }
            if (Utils.isDBNotNull(dataItem.orderId)){
              orderId = dataItem.orderId;
            }
            if (Utils.isDBNotNull(dataItem.content)){
              content = dataItem.content;
            }
            if (Utils.isDBNotNull(dataItem.orImgUrl)){
              orImgUrl = dataItem.orImgUrl;
            }
            if (Utils.isDBNotNull(dataItem.verify_content)){
              verify_content = dataItem.verify_content;
            }
            if(Utils.myTrim(verify_content)!=""){
              try{
                verifyArray=verify_content.split(",");
                if(Utils.isNotNull(verifyArray) && verifyArray.length>=3){
                  verify_addr=verifyArray[0];verify_admin=verifyArray[1];
                  try{
                    verify_adminUId = parseInt(verifyArray[2]);
                    verify_adminUId = isNaN(verify_adminUId) ? 0 : verify_adminUId;
                  }catch(e){}
                }
              }catch(e){}
            }
            
            if (Utils.isDBNotNull(dataItem.price)){
              try{
                price = parseFloat(dataItem.price);
                price = isNaN(price) ? 0.00 : price;
                price=parseFloat((price).toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            if (Utils.isDBNotNull(dataItem.money)){
              try{
                money = parseFloat(dataItem.money);
                money = isNaN(money) ? 0.00 : money;
                money=parseFloat((money).toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            price=price>0?price:money;
            //verify：0无核销商品 1有商品未核销 2有商品已核销 
            listItem={id:id,tradeNo:tradeNo,orderId:orderId,userId:userId,price:price,money:money,integral:integral,orImgUrl:orImgUrl,productId:productId,verify:verify,updateDateStr:updateDateStr,verify_addr:verify_addr,verify_admin:verify_admin,verify_adminUId:verify_adminUId,content:content,}
            articles.push(listItem);
          }
        }
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
          console.log(that.data.dataArray)
        } else if (pageIndex == 1) {
          wx.showToast({
            title: noDataAlert,
            icon: 'none',
            duration: 2000
          })
        }
        
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员充值详情失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    let value = e.detail.value, setKey = "";
    value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    let len = Utils.getStrlengthB(value);
    switch (cid) {
      case "keyword":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "searchKeyword";
        that.setData({
          [setKey]: value
        })
        break;
    }
  },
  //事件：跳转选择日期页面
  chooseDateTime: function (e) {
    let that = this, tag = 0, stag = "s", url = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }
    try {
      wx.setStorageSync('selDTTag' + app.data.version + '_' + app.data.wxAppId, tag);
    } catch (e) { }
    that.data.isForbidRefresh = true;
    stag = tag == 0 ? "s" : "e";
    url = "/packageOther/pages/calendardbtime/calendardbtime?pagetitle=" + encodeURIComponent("选择时段") + "&edtname=" + encodeURIComponent("结束时间") + "&tag=" + stag;
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    });
  },
  //事件：显示公司选择下拉框
  showAGCompanyListPop(e) {
    var that = this;
    that.setData({
      ["isShowAGCompanyList"]: !that.data.isShowAGCompanyList
    })
  },
  //事件：公司列表选择
  selectAGCompanyList(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selAgentCIndex = that.data.selAgentCIndex
    if (selAgentCIndex == index) {
      that.setData({
        ["isShowAGCompanyList"]: false,
      })
      return
    }
    that.setData({
      ["selAgentCIndex"]: index,
      ["isShowAGCompanyList"]: !that.data.isShowAGCompanyList,
    })
    that.loadInitData();
  },
  //事件：查看详情
  gotoViewDetailPage:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      let url="/packageVP/pages/mkghetrstwo/mkghetrstwo?oid="+item.orderId+"&uid="+item.userId;
      that.data.isForbidRefresh=true;
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.showToast({
        title: "暂无信息查看！",
        icon: 'none',
        duration: 1500
      })
    }
  }
})
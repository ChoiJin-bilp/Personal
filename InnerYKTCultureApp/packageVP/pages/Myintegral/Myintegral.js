// packageVP/pages/Myintegral/Myintegral.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  pageSize = 10,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,

    pageType:0,                   //0可用积分，1会员积分
    curMemSort:0,                 //当前会员级别
    curUseIntegrals:0,            //当前可用积分
    curMemIntegrals:0,            //当前会员积分

    curAllIntegrals:0,            //当前显示积分
    showType:-1,                   //显示类型：-1全部，0增加，1减少

    totalDataCount: 0,      //总记录数
    currentPage: 0,         //当前页码
    articles: [],           //记录集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log("加载参数：")
    console.log(options)
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;

    let pageType=0;
    try {
      if (Utils.isNotNull(options.type)){
        pageType = parseInt(options.type);
        pageType = isNaN(pageType) ? 0 : pageType;
      }      
    } catch (e) {}
    wx.setNavigationBarTitle({
      title: pageType == 0 ? "我的可用积分" : "我的会员积分"
    })
    that.setData({
      ["pageType"]:pageType,
    })
    if(Utils.isNull(app.data.userMemberInfo)){
      app.getMemberIntegrals(that,"");
    }else{
      that.setData({
        ["curMemSort"]:app.data.userMemberInfo.curMemSort,
        ["curUseIntegrals"]:app.data.userMemberInfo.curUseIntegrals,
        ["curMemIntegrals"]:app.data.userMemberInfo.curMemIntegrals,
  
        ["curAllIntegrals"]:pageType==0?app.data.userMemberInfo.curUseIntegrals:app.data.userMemberInfo.curMemIntegrals,
      })
      that.loadInitData();
    }
  },
  //方法：获取用户积分结果处理函数
  dowithGetMemberIntegrals: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取用户积分结果：");
        console.log(dataList);
        let curUseIntegrals=0,curMemIntegrals=0;
        let allEnableIntegrals=0, allUsedIntegrals=0;
        if(Utils.isNotNull(dataList)){
          //获取累积可用积分
          if(Utils.isNotNull(dataList.addMap)){
            if(Utils.isDBNotNull(dataList.addMap.expenditure_integral)){
              try{
                allEnableIntegrals=parseInt(dataList.addMap.expenditure_integral);
                allEnableIntegrals=isNaN(allEnableIntegrals)?0:allEnableIntegrals;
              }catch(e){}
            }
            if(Utils.isDBNotNull(dataList.addMap.integral)){
              try{
                curMemIntegrals=parseInt(dataList.addMap.integral);
                curMemIntegrals=isNaN(curMemIntegrals)?0:curMemIntegrals;
              }catch(e){}
            }
          }
          //获取已使用可用积分
          if(Utils.isNotNull(dataList.cutMap)){
            if(Utils.isDBNotNull(dataList.cutMap.expenditure_integral)){
              try{
                allUsedIntegrals=parseInt(dataList.cutMap.expenditure_integral);
                allUsedIntegrals=isNaN(allUsedIntegrals)?0:allUsedIntegrals;
              }catch(e){}
            }
          }
          //获取未使用可用积分
          curUseIntegrals=allEnableIntegrals>=allUsedIntegrals?allEnableIntegrals-allUsedIntegrals:0;          
        }
        that.setData({
          ["curUseIntegrals"]: curUseIntegrals,
          ["curMemIntegrals"]:curMemIntegrals,
        })
        app.getMemberFeeItemList(that);
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取用户积分失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：获取会员套餐操作结果回调处理方法
  dowithGetMemberFeeItemList(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('获取会员套餐操作结果：')
        console.log(dataList)
        if (dataList != null && dataList != undefined) {
          let memberRechargePackageList=[],memberLevelList=[],mainData=null,dataItem = null, listItem = null;
          let curMemIntegrals=that.data.curMemIntegrals,curMemSort=1,selRCIndex=0,currentIndex=0,curNextSortMemIntegrals=0;
          //获取会员充值套餐列表
          if(Utils.isNotNull(dataList.payRankList) && dataList.payRankList.length>0){
            let id=0,name="",content="",integral=0,expenditure_integral=0,price=0.00,sort=0,invalid=0;
            mainData=dataList.payRankList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;content="";integral=0;expenditure_integral=0;price=0.00;name="";sort=0;invalid=0;
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.content)){
                content = dataItem.content;
              }               
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              
              if (Utils.isDBNotNull(dataItem.integral)) {
                try {
                  integral = parseInt(dataItem.integral);
                  integral = isNaN(integral) ? 0 : integral;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.expenditure_integral)) {
                try {
                  expenditure_integral = parseInt(dataItem.expenditure_integral);
                  expenditure_integral = isNaN(expenditure_integral) ? 0 : expenditure_integral;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.sort)) {
                try {
                  sort = parseInt(dataItem.sort);
                  sort = isNaN(sort) ? 0 : sort;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.invalid)) {
                try {
                  invalid = parseInt(dataItem.invalid);
                  invalid = isNaN(invalid) ? 0 : invalid;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.price)) {
                try {
                  price = parseFloat(dataItem.price);
                  price = isNaN(price) ? 0 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt))
                } catch (e) { }
              }
              if(invalid!=0)continue;
              if(id==that.data.rechargeRandId) selRCIndex=currentIndex;

              currentIndex++;
              listItem={id:id,content:content,integral:integral,expenditure_integral:expenditure_integral,price:price,name:name,sort:sort,invalid:invalid,}
              memberRechargePackageList.push(listItem);
            }
          }
          //获取会员等级列表
          if(Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
            let id=0,name="",content="",integral=0,sort=0,invalid=0;
            mainData=dataList.dataList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;integral=0;name="";content="";sort=0;invalid=0;
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.content)){
                content = dataItem.content;
              }   
              if (Utils.isDBNotNull(dataItem.integral)) {
                try {
                  integral = parseInt(dataItem.integral);
                  integral = isNaN(integral) ? 0 : integral;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.sort)) {
                try {
                  sort = parseInt(dataItem.sort);
                  sort = isNaN(sort) ? 0 : sort;
                } catch (e) { }
              }
              if (Utils.isDBNotNull(dataItem.invalid)) {
                try {
                  invalid = parseInt(dataItem.invalid);
                  invalid = isNaN(invalid) ? 0 : invalid;
                } catch (e) { }
              }
              if(invalid!=0)continue;
              if(curMemIntegrals>=integral){
                curMemSort=sort;
              }
              listItem={id:id,integral:integral,name:name,content:content,sort:sort,invalid:invalid,}
              memberLevelList.push(listItem);
            }
          }
          // memberLevelList=memberLevelList.sort(that.compareDesc("sort"));
          // console.log(memberLevelList)
          memberLevelList=memberLevelList.sort(that.compareAsc("sort"));
          console.log(memberLevelList)
          let isMySort=false;
          for(let i=0;i<memberLevelList.length;i++){
            dataItem=null;dataItem=memberLevelList[i];
            if(isMySort){
              curNextSortMemIntegrals=dataItem.integral-that.data.curMemIntegrals;
              isMySort=false;
            }
            if(dataItem.sort==curMemSort){
              isMySort=true;
            }
          }
          app.data.userMemberInfo={
            ["memberLevelList"]:memberLevelList,
            ["curMemSort"]:curMemSort,
            ["curUseIntegrals"]:that.data.curUseIntegrals,
            ["curMemIntegrals"]:that.data.curMemIntegrals,
          }
          that.setData({
            ["curMemSort"]:app.data.userMemberInfo.curMemSort,
            
            ["curAllIntegrals"]:that.data.pageType==0?app.data.userMemberInfo.curUseIntegrals:app.data.userMemberInfo.curMemIntegrals,
          })
          that.loadInitData();
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取会员套餐失败！";
        wx.showToast({
          title: res.data.rspMsg,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /**
   * json对象数组按照某个属性排序:升序排列
   * @param {Object} propertyName
   */
  compareAsc(propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if(value2 < value1) {
        return 1;
      } else if(value2 > value1) {
        return -1;
      } else {
        return 0;
      }
    }
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
      else
        that.loadInitData();
    }
  },
  //事件：选择显示类型
  selectShowType:function(e){
    let that=this,showType=-1;
    try {
      showType = parseInt(e.currentTarget.dataset.type);
      showType=isNaN(showType)?-1:showType;
    } catch (e) {}
    that.setData({
      ["showType"]:showType,
    })
    that.loadInitData();
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
    var that = this,showType=that.data.showType,otherParams=showType>=0?"&type="+showType:"";
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_member&action=userIntegralList&appId=" + app.data.appid + "&userId=" + appUserInfo.userId + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        that.data.isLoad = true;
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.dataList)) {
          var data = res.data.data.dataList, dataItem = null, listItem = null, articles = [];
          var id = 0, type = 0, typeValue = "", integral = 0, createDate = "", cDate = null,tag=0,orderId="",user_id=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; type = 0; typeValue = ""; integral = 0; createDate = ""; cDate = null;tag=0;orderId="";user_id=0;
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.orderId)) {
              try {
                orderId = Utils.myTrim(dataItem.orderId)
              } catch (e) {}
            }
            if (Utils.isDBNotNull(dataItem.createDate)) {
              try {
                cDate = new Date(Date.parse((dataItem.createDate + "").replace(/-/g, "/")))
              } catch (e) { cDate = new Date(); }
              createDate = Utils.getDateTimeStr(cDate, "/", true);
            }
            if(that.data.pageType==0){
              //1、可用积分
              if (Utils.isDBNotNull(dataItem.expenditure_integral)){
                try{
                  integral = parseInt(dataItem.expenditure_integral);
                  integral = isNaN(integral) ? 0 : integral;
                }catch(e){}
              } 
            }else{
              //2、会员积分
              if (Utils.isDBNotNull(dataItem.integral)){
                try{
                  integral = parseInt(dataItem.integral);
                  integral = isNaN(integral) ? 0 : integral;
                }catch(e){}
              } 
            }
                         
            if (Utils.isDBNotNull(dataItem.type))
            {
              try{
                type = parseInt(dataItem.type);
                type = isNaN(type) ? 0 : type;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.user_id))
            {
              try{
                user_id = parseInt(dataItem.user_id);
                user_id = isNaN(user_id) ? 0 : user_id;
              }catch(e){}
            }
            
            //1充值  2提现 3积分抽奖 4发红包 5领红包 6红包回退
            for(let n=0;n<app.data.integralTypeList.length;n++){
              if(type==app.data.integralTypeList[n].id){
                typeValue=app.data.integralTypeList[n].name;
                tag=app.data.integralTypeList[n].tag=="+"?0:-1;
              }
            }
            listItem = {
              id: id, type: type, typeValue: typeValue, integral: integral, createDate: createDate,tag:tag,orderId:orderId,user_id:user_id,
            }
            articles.push(listItem);
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
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取信息列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.hideLoading();
        wx.showToast({
          title: "获取信息列表接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取信息列表接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  // 打开协议
  showModalserve: function () {
    this.setData({
      showModalserve: true,
    })
    this.selectComponent("#towerId").inloyData()
  },
    //隐藏协议
  onMyEvent(e) {
    this.setData({
      showModalserve: e.detail.myNum
    })
  },
  //事件：查看详情
  viewIntegerDetail:function(e){
    let that=this,item=null;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      if(Utils.isNotNull(item.orderId) && Utils.myTrim(item.orderId)!=""){
        let url="/packageVP/pages/mkghetrstwo/mkghetrstwo?lp=1&oid="+item.orderId+"&uid="+item.user_id;
        wx.navigateTo({
          url: url,
        })
      }else{
        wx.showToast({
          title: "订单号为空无法查看详情！",
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})
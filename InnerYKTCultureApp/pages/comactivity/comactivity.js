// pages/comactivity/comactivity.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js'); 
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, payForType = 0,selPayDataItem=null,internalDownTime=null, isTestPrice = false;;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    isLoad: false,         //是否已经加载
    DataURL:DataURL,
    isDowithing:false,

    luckdraw_id: app.data.luckdraw_id,            //抽奖活动ID
    isAwardActiveValid:false,                     //抽奖活动是否有效
    payCheirapsisProductList: [],        //付费按摩产品记录列表

    memberRechargePackageList:[],        //会员充值列表

    srcOptions:null,       //保存加载信息
    height:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.data.srcOptions=options;
    that.dowithParam(options);
    let query = wx.createSelectorQuery();

    let contentBoxH = query.select(".lmkimages").boundingClientRect();

    query.exec(res => {
      // let contentBoxH = res[0] ? res[0].height : 0;
      that.setData({
        height: res[0].height
      }) 
    })
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, mallChannelId = 0, isScene = false, dOptions = null;
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
        isTestPrice = appUserInfo.userId ==13118?true:false;
        console.log('=========onload============');
        //如果当前用户为合作商，则自动赋值当前用户为代理商（如果参数传递了代理商则用参数的代理商替代）
        if (appUserInfo.roleStatus == 2) {
          app.data.agentUserId = appUserInfo.userId;
        }
        let agentUserId = app.data.agentUserId, agentCompanyId = app.data.agentCompanyId, agentDeviceId = app.data.agentDeviceId;
        let osTag = Utils.isNotNull(app.data.currentOS) && app.data.currentOS.osTag >= 1 ? app.data.currentOS.osTag : 1;
        that.setData({
          ["osTag"]: osTag,
          ["roleStatus"]: appUserInfo.roleStatus,
        })
        //获取代理商ID
        if (sOptions.auid != null && sOptions.auid != undefined) {
          try {
            agentUserId = parseInt(sOptions.auid);
            agentUserId = isNaN(agentUserId) ? 0 : agentUserId;
          } catch (e) { }
          app.data.agentUserId = agentUserId;
        }
        //获取代理商公司ID
        if (sOptions.acid != null && sOptions.acid != undefined) {
          try {
            agentCompanyId = parseInt(sOptions.acid);
            agentCompanyId = isNaN(agentCompanyId) ? 0 : agentCompanyId;
          } catch (e) { }
          app.data.agentCompanyId = agentCompanyId;
        }
        //获取代理商设备ID
        if (sOptions.adid != null && sOptions.adid != undefined) {
          try {
            agentDeviceId = parseInt(sOptions.adid);
            agentDeviceId = isNaN(agentDeviceId) ? 0 : agentDeviceId;
          } catch (e) { }
        }
        app.data.agentDeviceId = agentDeviceId > 0 ? agentDeviceId : app.data.agentDeviceId;
        that.setData({
          ["agentUserId"]: agentUserId,
          ["agentCompanyId"]: agentCompanyId,
          ["agentDeviceId"]: agentDeviceId,
          ["agentDeviceStatus"]: app.data.agentDeviceStatus,
          ["isPayforLotteryDraw"]: app.data.isPayforLotteryDraw,
          ["isShowHomeCheirapsisAlert"]: app.data.isShowHomeCheirapsisAlert,

          ["isSetFreeCheirapsis"]:app.data.isSetFreeCheirapsis,
          ["isShowNDid"]:Utils.myTrim(app.data.sysName)=="云客茶语"?true:false,
        })
        
        // //没有设备信息则跳转扫码页面
        // if (agentDeviceId <= 0 || app.data.agentDeviceStatus==1) {
        //   that.data.isLoad = true;
        //   that.gotoScanCodePage();         
        // } else {
        //   that.getDefaultMainInfo(false);
        // }
          
          that.getDefaultMainInfo(false);
        break;
    }
  },
  //方法：默认登录首页信息获取
  getDefaultMainInfo: function (isRecharge) {
    let that = this;

    app.getMemberFeeItemList(that);
    ////that.getPayCheirapsisProductList();
    that.getAwardDataInfo(app.data.luckdraw_id);

    //
    that.getRecommendActivityList();
  },
  //事件：切换设备
  gotoScanCodePage: function () {
    let that = this, url = "";
    url = "/pages/scanCode/scanCode?login=2";
    console.log("exchangeDeviceEvent:" + url);
    //app.data.curPageDataOptions对象属性说明：
    //package：源页面所在分包名称
    //page：源页面所在分包路径，例如：/pages/remaining/remaining
    //pageType:0 navigateTo调用，1 switchTab调用，2 redirectTo调用，其他reLaunch调用
    //options：源页面的加载参数
    app.data.curPageDataOptions={
      package:"",page:"/pages/comactivity/comactivity",pageType:1,options: that.data.srcOptions,
    }
    wx.redirectTo({
      url: url
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;

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
        that.getDrawAwardDataList(that.data.isRecharge);
        that.getDefaultMainInfo(false);
      }
    }   
  },
  //方法：获取导航条回调方法
  dowithGetTabBarList: function () {
    let that = this;
    app.setTabBarSelIndex(that);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法：获取会员套餐操作结果回调处理方法
  dowithGetMemberFeeItemList(dataList,tag,errorInfo) {
    var that = this;
    switch (tag) {
      case 1:
        console.log('获取会员套餐操作结果：')
        console.log(dataList)
        if (dataList != null && dataList != undefined) {
          let memberRechargePackageList=[],mainData=null,dataItem = null, listItem = null;
          //获取会员充值套餐列表
          if(Utils.isNotNull(dataList.payRankList) && dataList.payRankList.length>0){
            let id=0,name="",image="",content="",integral=0,expenditure_integral=0,price=0.00,sort=0,invalid=0;
            mainData=dataList.payRankList;
            for(let i=0;i<mainData.length;i++){
              dataItem = null; listItem = null; dataItem = mainData[i];
              id=0;content="";integral=0;expenditure_integral=0;price=0.00;name="";image="";sort=0;invalid=0;
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.content)){
                content = dataItem.content;
              }               
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.image)){
                image = dataItem.image;
                image = app.getSysImgUrl(image);
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
              if(invalid!=0 || Utils.myTrim(image)=="")continue;
              
              listItem={id:id,content:content,integral:integral,expenditure_integral:expenditure_integral,price:price,name:name,sort:sort,invalid:invalid,image:image}
              memberRechargePackageList.push(listItem);
            }
          }
          that.setData({
            ["memberRechargePackageList"]: memberRechargePackageList,
          })
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
  //方法：获取抽奖信息
  getAwardDataInfo: function (luckdraw_id) {
    let that = this, agentUserId = that.data.agentUserId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;

    app.getAwardProductList(that, luckdraw_id, 0, otherParamCon)
  },
  //方法：获取费用列表信息
  getPayCheirapsisProductList: function () {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += app.data.agentDeviceId > 0 ? "&devicesId=" + app.data.agentDeviceId : "&devicesId=-1";
    otherParamCon += "&lotteryProduct=1&dtPrice=1&status=0&orderfield=p.id&ordertype=asc";
    app.getAwardProductList2(that, 0, app.data.agentCompanyId, 1, otherParamCon)
  },
  //方法：获取奖项结果处理函数
  //operateTag:0转盘信息项目列表，1按摩服务产品，2特别价检查信息
  dowithGetAwardProductList: function (dataList, tag, operateTag, errorInfo) {
    let that = this,resultDescribe=operateTag==0?"获取抽奖项列表记录结果":(operateTag==1?"获取按摩服务费用列表记录结果":(operateTag==2?"获取特别价检查信息结果":(operateTag==3?"获取推荐活动劵结果":"获取抽奖产品列表记录结果")));
    that.data.isLoad=true;
    switch (tag) {
      //判断是否搞抽奖活动
      case 0:
        let isAwardActiveValid=false;
        if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0)isAwardActiveValid=true;
        that.setData({
          ["isAwardActiveValid"]: isAwardActiveValid,
        })
        break;
      //获取按摩费用列表
      case 1:
        console.log(resultDescribe+"：");
        console.log(dataList);
        let mainData = dataList, datalist = [], payCheirapsisProductList = [], imgItemList = that.data.imgItemList, imgIndex = 0, imgSrc = "", isHave0 = false, ringItems = that.data.ringItems;
        let awardName = "", color = "", fcolor = "";
        let id = 0, lotteryProduct = 0, no = 0, lastNo = 0, grade = 0, type = 0, mallCouponsId = 0, duration = 0, price = 0.00, cashback_price=0.00, allPart = mainData.length;
        let sectionPartAngle = 360 / allPart;
        let dataItem = null, grade0listItem = null, srcListItem = null;
        switch (operateTag) {
          case 1:
            if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
              let promotionstart = "", promotionend = "",isHaveDeviceItem=false,isHaveEspecialItem=false, arrayTemp = null, priceTypeList = app.data.priceTypeList;
              let firstPriceItem = null,especialProductItem=null,dtStart=new Date(),dtStartStr="", dtEnd = new Date(), dtEndStr = "",isValid=true;
              payCheirapsisProductList = mainData.dataList;
              let num=0,single_num=0,limit_num=0,interval_day=0;
              for (let i = 0; i < payCheirapsisProductList.length; i++) {
                firstPriceItem = null;isHaveEspecialItem=false;
                num=0;single_num=0;limit_num=0;interval_day=0;
                try{
                  num=Utils.isNotNull(payCheirapsisProductList[i].num)?parseInt(payCheirapsisProductList[i].num):0;
                  num=isNaN(num)?0:num;
                }catch(e){}
                try{
                  single_num=Utils.isNotNull(payCheirapsisProductList[i].single_num)?parseInt(payCheirapsisProductList[i].single_num):0;
                  single_num=isNaN(single_num)?0:single_num;
                }catch(e){}
                try{
                  limit_num=Utils.isNotNull(payCheirapsisProductList[i].limit_num)?parseInt(payCheirapsisProductList[i].limit_num):0;
                  limit_num=isNaN(limit_num)?0:limit_num;
                }catch(e){}
                try{
                  interval_day=Utils.isNotNull(payCheirapsisProductList[i].interval_day)?parseInt(payCheirapsisProductList[i].interval_day):0;
                  interval_day=isNaN(interval_day)?0:interval_day;
                }catch(e){}
                payCheirapsisProductList[i].num=num;
                payCheirapsisProductList[i].single_num=single_num;
                payCheirapsisProductList[i].limit_num=limit_num;
                payCheirapsisProductList[i].interval_day=interval_day;
                if (!isHaveDeviceItem && payCheirapsisProductList[i].devicesId > 0) isHaveDeviceItem=true;
                if (Utils.isNotNull(payCheirapsisProductList[i].prices) && payCheirapsisProductList[i].prices.length > 0) {
                  for (let k = 0; k < payCheirapsisProductList[i].prices.length; k++) {
                    dtEnd = new Date(); dtStart = new Date(); isValid = true;
                    for (let n = 0; n < priceTypeList.length; n++) {
                      if (priceTypeList[n].id == payCheirapsisProductList[i].prices[k].priceType) {
                        payCheirapsisProductList[i].prices[k].priceTypeName = priceTypeList[n].name;
                        isHaveEspecialItem=priceTypeList[n].id==4?true:isHaveEspecialItem;
                        break;
                      }
                    }

                    promotionstart = ""; promotionend = "";
                    promotionstart = payCheirapsisProductList[i].prices[k].promotionstart; promotionend = payCheirapsisProductList[i].prices[k].promotionend;
                    switch (payCheirapsisProductList[i].prices[k].priceType){
                      case 2:
                      case 4:
                        dtStart = new Date(promotionstart.replace(/\-/g, "/")); //Utils.getDateByTimeStr(promotionstart, true);
                        dtEnd = new Date(promotionend.replace(/\-/g, "/"));//Utils.getDateByTimeStr(promotionend, true);
                        arrayTemp = null;
                        arrayTemp = promotionstart.split(' ');
                        promotionstart = arrayTemp.length >= 2 ? arrayTemp[0] : promotionstart;

                        arrayTemp = null;
                        arrayTemp = promotionend.split(' ');
                        promotionend = arrayTemp.length >= 2 ? arrayTemp[0] : promotionend;
                        if (dtStart > (new Date()) || (new Date()) > dtEnd) {
                          isValid = false;
                        }
                        break;
                      case 3:
                        arrayTemp = null;
                        arrayTemp = promotionstart.split(' ');
                        promotionstart = arrayTemp.length >= 2 ? arrayTemp[1] : promotionstart;

                        arrayTemp = null;
                        arrayTemp = promotionend.split(' ');
                        promotionend = arrayTemp.length >= 2 ? arrayTemp[1] : promotionend;

                        dtStartStr = "";
                        dtStartStr = Utils.getDateTimeStr(dtEnd, "-", false) + " " + promotionstart;
                        dtStart = new Date(dtStartStr.replace(/\-/g, "/")); //Utils.getDateByTimeStr(dtStartStr, true);

                        dtEndStr = "";
                        dtEndStr = Utils.getDateTimeStr(dtEnd, "-", false) + " " + promotionend;
                        dtEnd = new Date(dtEndStr.replace(/\-/g, "/")); //Utils.getDateByTimeStr(dtEndStr, true);
                        if (dtStart > (new Date()) || (new Date()) > dtEnd) {
                          isValid = false;
                        }
                        break;
                    }
                    
                    payCheirapsisProductList[i].prices[k].promotionstart = promotionstart;
                    payCheirapsisProductList[i].prices[k].promotionend = promotionend;
                    payCheirapsisProductList[i].prices[k].dtStartTime = dtStart;
                    payCheirapsisProductList[i].prices[k].dtEndTime = dtEnd;
                    //有效性检查（促销价、时段价必须检查当前时间是否过时
                    if(isValid){
                      if (Utils.isNotNull(firstPriceItem)) {
                        firstPriceItem = payCheirapsisProductList[i].prices[k].sort < firstPriceItem.sort ? payCheirapsisProductList[i].prices[k] : firstPriceItem;
                      } else {
                        firstPriceItem = payCheirapsisProductList[i].prices[k];
                      }
                    }
                  }
                }

                //firstPriceItem
                if (Utils.isNotNull(firstPriceItem)){
                  payCheirapsisProductList[i].actprice = firstPriceItem.actprice;
                  payCheirapsisProductList[i].specialprice = firstPriceItem.specialprice;
                  payCheirapsisProductList[i].halfprice = firstPriceItem.halfprice;
                  payCheirapsisProductList[i].priceType = firstPriceItem.priceType;
                  payCheirapsisProductList[i].promotionstart = firstPriceItem.promotionstart;
                  payCheirapsisProductList[i].promotionend = firstPriceItem.promotionend;
                  payCheirapsisProductList[i].dtEndTime = firstPriceItem.dtEndTime;
                }
                payCheirapsisProductList[i].price = payCheirapsisProductList[i].specialprice > 0.00 && payCheirapsisProductList[i].specialprice < payCheirapsisProductList[i].actprice ? payCheirapsisProductList[i].specialprice: payCheirapsisProductList[i].actprice;

                especialProductItem=isHaveEspecialItem?payCheirapsisProductList[i]:especialProductItem;
              }
              //特别价优先，有特别价则只显示特别价
              if(isHaveEspecialItem){
                payCheirapsisProductList = [];
                payCheirapsisProductList.push(especialProductItem);
              }else{
                if (isHaveDeviceItem) {
                  let tempList = payCheirapsisProductList;
                  payCheirapsisProductList = [];
                  for (let i = 0; i < tempList.length; i++) {
                    if (tempList[i].devicesId > 0) {
                      payCheirapsisProductList.push(tempList[i]);
                    }
                  }
                }
              }
            }
            
            if (payCheirapsisProductList.length>0 && payCheirapsisProductList.length <= 1 && (payCheirapsisProductList[0].priceType == 2 || payCheirapsisProductList[0].priceType ==3)){
              //that.computeDownTime(payCheirapsisProductList[0].dtEndTime)
            }else{
              that.setData({
                ["remainTime"]: 0,
              })
              //if (Utils.isNotNull(internalDownTime)) clearInterval(internalDownTime);
            }
            that.setData({
              ["payCheirapsisProductList"]: payCheirapsisProductList,
            })
            console.log("服务费用列表")
            console.log(payCheirapsisProductList)
            break;

          case 2:
            let curSelRechargeItem=that.data.curSelRechargeItem,isCanPayFor=true,reasonAlert="";
            if(Utils.isNotNull(curSelRechargeItem) && Utils.isNotNull(dataList)){
              let totalbuycount=0,userbuycount=0,dayuserbuycount=0,userbuylasttime=new Date(),nowDate=new Date();
              if (Utils.isNotNull(dataList.totalbuycount) && Utils.myTrim(dataList.totalbuycount + "") != ""){
                try{
                  totalbuycount=parseInt(dataList.totalbuycount);
                  totalbuycount=isNaN(totalbuycount)?0:totalbuycount;
                }catch(e){}
              }
              if (Utils.isNotNull(dataList.userbuycount) && Utils.myTrim(dataList.userbuycount + "") != ""){
                try{
                  userbuycount=parseInt(dataList.userbuycount);
                  userbuycount=isNaN(userbuycount)?0:userbuycount;
                }catch(e){}
              }
              if (Utils.isNotNull(dataList.dayuserbuycount) && Utils.myTrim(dataList.dayuserbuycount + "") != ""){
                try{
                  dayuserbuycount=parseInt(dataList.dayuserbuycount);
                  dayuserbuycount=isNaN(dayuserbuycount)?0:dayuserbuycount;
                }catch(e){}
              }
              if (Utils.isNotNull(dataList.userbuylasttime) && Utils.myTrim(dataList.userbuylasttime + "") != ""){
                try {
                  userbuylasttime = new Date(Date.parse((dataList.userbuylasttime + "").replace(/-/g, "/")))
                } catch (e) { userbuylasttime = new Date(); }
              }
              //1、活动时间是否有效
              if(Utils.isNotNull(curSelRechargeItem.prices) && curSelRechargeItem.prices.length>0){
                if (curSelRechargeItem.prices[0].dtStartTime > (new Date()) || (new Date()) > curSelRechargeItem.prices[0].dtEndTime) {
                  isCanPayFor=false;
                  if(curSelRechargeItem.prices[0].dtStartTime > (new Date()))
                    reasonAlert="该活动尚未开始，不能再购买！";
                  if((new Date()) > curSelRechargeItem.prices[0].dtEndTime)
                    reasonAlert="该活动尚已结束，不能再购买！";
                }
              }
              //2、活动是否已达总限制购买量
              if(isCanPayFor && curSelRechargeItem.num>0 && curSelRechargeItem.num<=totalbuycount){
                isCanPayFor=false;reasonAlert="该活动购买总量已达限定，不能再购买！";
              }
              //3、活动是否已达个人总限制购买量
              if(isCanPayFor && curSelRechargeItem.single_num>0 && curSelRechargeItem.single_num<=userbuycount){
                isCanPayFor=false;reasonAlert="该活动个人购买总量已达限定，不能再购买！";
              }
              let lastBuyDay="",nowDay="";
              lastBuyDay=Utils.getDateTimeStr(userbuylasttime,"/",false);
              nowDay=Utils.getDateTimeStr((new Date()),"/",false);
              //4、活动是否已达个人当天总限制购买量
              if(isCanPayFor && lastBuyDay==nowDay && curSelRechargeItem.limit_num>0 && curSelRechargeItem.limit_num<=dayuserbuycount){
                isCanPayFor=false;reasonAlert="该活动个人当天购买总量已达限定，不能再购买！";
              }
              //4、活动是否已达个人当天总限制购买量
              if(isCanPayFor && lastBuyDay!=nowDay && curSelRechargeItem.interval_day>0 && Utils.getDateTimeAddDays(userbuylasttime,curSelRechargeItem.interval_day)>(new Date())){
                isCanPayFor=false;reasonAlert="该活动自上次购买后需要间隔"+curSelRechargeItem.interval_day+"天才能再继续购买！";
              }
            }
            if(isCanPayFor){
              //可以购买
              that.dowithClickFeeItem(curSelRechargeItem);
            }else{
              //不能购买
              wx.showModal({
                title: '提示',
                content: reasonAlert,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            break;
          //获取推荐活动团体劵
          case 3:
            console.log(resultDescribe+"：");
            console.log(dataList);
            let recommendProductList=[];
            if(Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length>0){
              recommendProductList=dataList.dataList;
            }
            that.setData({
              ["recommendProductList"]:recommendProductList,
            })
            break;
        }
        break;
      
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : (operateTag == 0 ? "获取转盘信息失败！" : "获取按摩服务失败！");
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /////////////////////////////////////////////////////////////////////////
  //-------------免费按摩---------------------------------------------------
  //事件：免费按摩
  gotoFreeCheirapsis:function(e){
    let that=this;//appUserInfo
    if(Utils.isNotNull(appUserInfo)){
      if(Utils.isNotNull(appUserInfo.userMobile) && Utils.myTrim(appUserInfo.userMobile) != "" && appUserInfo.userMobile.indexOf("u_")<0){
        //如果当前用户手机号码有效则直接查询可领取按摩劵——如果没有领取则领取
        console.log("当前用户("+appUserInfo.userId+")手机号码:"+appUserInfo.userMobile)
        let otherParams="&xcxAppId=" + app.data.wxAppId;
        if(app.data.freeCheirapsisMode==2){
          //如果为不限次数则立马获取免费按摩劵
          let otherParams="&xcxAppId=" + app.data.wxAppId;
          app.getFreeCheirapsisDataInfo(that,app.data.agentCompanyId,otherParams);
        }else{
          //如果限制次数则查询已按摩的结果来判断
          app.queryFreeCheirapsisDataInfo(that,app.data.agentCompanyId,otherParams);
        }       
      }else{
        //如果当前用户手机号码无效则直接跳转手机号码绑定页面
        wx.navigateTo({
          url: packYKPageUrl + '/tiedaphone/tiedaphone',
        })
      }
    }else{
      wx.showToast({
        title: "无法获取用户信息！",
        icon: 'none',
        duration: 1500
      })
    }
    
  },
  //方法：查询免费按摩劵结果处理函数
  dowithQueryFreeCheirapsisDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("查询免费按摩劵结果：");
        console.log(dataList);
        let isHaveGet=false,alertContent="";
        
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          if(app.data.freeCheirapsisMode==1){
            isHaveGet=true;
            alertContent='对不起，您已经领取免费按摩劵！';
          }else{
            alertContent='对不起，您已经领取免费按摩劵！请明天再来';
            let dataItem = dataList.resultMap,crateTimeObj="",crateTime=new Date();
            crateTimeObj = Utils.isNull(dataItem.crateTime) ? "" : dataItem.crateTime;
            try {
              crateTime = new Date(crateTimeObj.replace(/\-/g, "/"));

              let dtNowStr = Utils.myTrim(Utils.getDateTimeStr((new Date()), "-", false));
              let dtcrateTimeStr = Utils.myTrim(Utils.getDateTimeStr(crateTime, "-", false));
              isHaveGet = dtNowStr == dtcrateTimeStr?true:isHaveGet;
            } catch (e) { }
          }
        }
        console.log("app.data.freeCheirapsisMode:"+app.data.freeCheirapsisMode)
        if(isHaveGet){
          wx.showModal({
            title: '提示',
            content: alertContent,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          let otherParams="&xcxAppId=" + app.data.wxAppId;
          app.getFreeCheirapsisDataInfo(that,app.data.agentCompanyId,otherParams);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取免费按摩劵失败！";
        break;
    }
  },
  //方法：领取免费按摩劵结果处理函数
  dowithGetFreeCheirapsisDataInfo: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log("领取免费按摩劵结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          let dataItem = dataList.resultMap,id=0,mincnt=0;
          id=dataItem.id;
          if (dataItem.duration != null && dataItem.duration != undefined && Utils.myTrim(dataItem.duration + "") != "null") {
            try {
              mincnt = parseInt(dataItem.duration);
              mincnt = isNaN(mincnt) ? 0 : mincnt;
            } catch (err) { }
          }
          this.gotoFreeCouponPage(id,mincnt);
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "领取免费按摩劵失败！";
        break;
    }
  },
  //方法：跳转免费按摩劵领取结果页面
  gotoFreeCouponPage:function(id,mincnt){
    let that=this,url="/packageYK/pages/GetAMassage/GetAMassage?id="+id+"&mcnt="+mincnt;
    console.log("gotoFreeCouponPage:"+url)
    wx.navigateTo({
      url: url,
    })
  },
  /////////////////////////////////////////////////////////////////////////
  //-------------付费按摩---------------------------------------------------
  //事件：支付按摩
  payforCheirapsis: function (e) {
    let that = this, item = null, priceType = 0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      that.setData({
        ["curSelRechargeItem"]: item,
      })
      try {
        priceType = parseInt(item.priceType);
        priceType = isNaN(priceType) ? 0 : priceType;
      } catch (e) { }
      if(priceType==4){
        let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
        otherParamCon += "&userId="+appUserInfo.userId+"&lotteryActivityProductId="+item.id+"&hd=1";
        app.getAwardProductList2(that, 0, app.data.agentCompanyId, 2, otherParamCon)
      }else{
        that.dowithClickFeeItem(item);
      }
    } else {
      wx.showToast({
        title: "获取信息失败无法体验！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  dowithClickFeeItem:function(curSelRechargeItem){
    let that=this;
    //没有设备信息则跳转扫码页面
    if (app.data.agentDeviceId <= 0 || app.data.agentDeviceStatus==1) {
      //【1】如果没有扫码设备
      that.data.isLoad = true;
      that.gotoScanCodePage();         
    } else {
      //【2】如果已经扫码设备
      let min = 0, amount = 0.00;
      try {
        min = parseInt(curSelRechargeItem.duration);
        min = isNaN(min) ? 0 : min;
      } catch (e) { }
      try {
        amount = parseFloat(curSelRechargeItem.price);
        amount = isNaN(amount) ? 0.00 : amount;
      } catch (e) { }
      amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt));
      selPayDataItem={item:curSelRechargeItem,amount:amount,min:min}
      ////////////////////////////////////////////////
      if (app.data.isCheckDeviceForPay) {
        that.data.cb51StartTag = 3;
        that.getDeviceInfo("", app.data.agentDeviceId, 1);
      } else {
        if (Utils.isNotNull(curSelRechargeItem)) {
          payForType = 1;
          that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
        } else {
          wx.showToast({
            title: "请选择按摩时间选项！",
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  },
  //方法：打开充值弹窗
  showReChargePop: function (productId, type, amount, minute, alert) {
    let that = this, rechargeSum = amount;
    that.data.rechargeType = type;
    that.setData({
      ["rechargeProductId"]: productId,
      ["rechargeAlert"]: alert,
      ["rechargeSum"]: rechargeSum,
      ["rechargeMinuteCnt"]: minute,
    })
    that.submitPayInfo(null);
  },
  //事件：确定充值
  submitPayInfo: function (e) {
    var that = this, rechargeProductId = that.data.rechargeProductId, rechargeSum = that.data.rechargeSum;
    console.log("按钮确定充值。。。");
    if (that.data.isDowithing) {
      wx.showToast({
        title: "支付进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.data.isDowithing = true;
    //插入充值支付记录
    that.insertAwardAboutRecord(rechargeProductId, rechargeSum);
  },
  //方法：插入支付抽奖相关记录
  insertAwardAboutRecord: function (productId, rechargeSum) {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId, typeParam = productId <= 0 ? "&type=4" : "";
    otherParamCon += "&productid=" + productId + "&price=" + rechargeSum + typeParam + "&activityId=" + luckdraw_id + "&operation=add";
    otherParamCon += rechargeSum > 0.00 ? "" :"&payStatus=1&status=0";

    app.operateAwardRecord(that, otherParamCon, 0)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    that.data.isDowithing = false;
    switch (tag) {
      case 1:
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        let id = 0;
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
          try {
            id = parseInt(dataList.resultMap.id);
            id = isNaN(id) ? 0 : id;
          } catch (err) { }
        }
        console.log("当前支付记录ID：" + id)
        that.setData({
          ["rechargeRecordId"]: id,
        })
        //0插入，1更改
        switch (operateTag) {
          case 0:
            let rechargeSum = that.data.rechargeSum;
            if(rechargeSum>0){
              //1、如果为付费支付则调起微信支付
              that.getPrePayId(id);
            }else{
              //2、如果为免费支付则直接刷新获奖记录
              that.data.isRecharge = true;
              that.getDrawAwardDataList(that.data.isRecharge);
            }
            break;
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  /////////////////////////////////////////////////////
  //----充值-------------------------------------------
  //方法：获取预支付ID
  getPrePayId: function (recordId) {
    var that = this, attach = "14_0_" + app.data.hotelId + "_3," + recordId, rechargeSum = that.data.rechargeSum, productDetail = payForType==0?app.data.sysName+"抽奖机会":app.data.sysName+"按摩服务";
    //体验版特别处理
    if (isTestPrice) {
      rechargeSum = 0.01;
    }
    app.getPrePayId0(that, attach, rechargeSum, productDetail);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.data.isDowithing = false;
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        that.setData({
          ["ReChargePop"]: false,
        })
        that.data.isRecharge = true;
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;

        console.log("支付发起成功！")
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  //-----------获取按摩记录----------------------------------------------------------------
  //方法：获取抽奖记录信息
  getDrawAwardDataList: function (isRecharge) {
    console.log("getDrawAwardDataList:"+isRecharge)
    let that = this, luckdraw_id = that.data.luckdraw_id, rechargeRecordId = that.data.rechargeRecordId, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    console.log("rechargeRecordId:" + rechargeRecordId)
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "", sign = "";
    urlParam = "cls=main_lotteryActivityRecord&action=lotteryActivityRecordList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&userId=" + appUserInfo.userId + "&status=0&isUse=0&isCancelShare=0&pageIndex=1&pageSize=1000000&sign=" + sign;
    // urlParam = urlParam + "&activityId=" + luckdraw_id + "&companyId=" + app.data.companyId + "&userId=" + appUserInfo.userId + "&status=0&isUse=0&pageIndex=1&pageSize=1000000&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取抽奖记录信息结果：")
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data)) {
          let mainData = res.data.data, drawAwardRecordList = [], grade = 0, curId = 0, curItem = null, dataItem = null, listItem = null, rechargeItem = null, spareCheirapsisCnt=0;
          let id = 0, lotteryActivityProductId = 0, lotteryProduct = 0, status = 0, payStatus=0, productName = "", createDate = "", endTime = "", duration = 0, mallCouponsId = 0, isUse = 0, type = 0, dtCreate = new Date(), dtEnd = new Date(), dtDate = new Date(), dtNow = new Date(), isTimeOut = false, cashback_price=0.00;
          if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
            for (let i = 0; i < mainData.dataList.length; i++) {
              dataItem = null; listItem = null; dataItem = mainData.dataList[i];
              id = 0; lotteryActivityProductId = 0; lotteryProduct = 0; productName = ""; createDate = ""; endTime = ""; duration = 0; mallCouponsId = 0; isUse = 0; type = 0; status = 1; isTimeOut = false; cashback_price = 0.00; payStatus=0;
              id = dataItem.id;
              if (Utils.isNotNull(dataItem.lotteryActivityProductId) && Utils.myTrim(dataItem.lotteryActivityProductId + "") != "null") {
                try {
                  lotteryActivityProductId = parseInt(dataItem.lotteryActivityProductId);
                  lotteryActivityProductId = isNaN(lotteryActivityProductId) ? 0 : lotteryActivityProductId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.cashback_price) && Utils.myTrim(dataItem.cashback_price + "") != "null") {
                try {
                  cashback_price = parseFloat(dataItem.cashback_price);
                  cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
                  cashback_price = parseFloat((cashback_price).toFixed(app.data.limitQPDecCnt));
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.lotteryProduct) && Utils.myTrim(dataItem.lotteryProduct + "") != "null") {
                try {
                  lotteryProduct = parseInt(dataItem.lotteryProduct);
                  lotteryProduct = isNaN(lotteryProduct) ? 0 : lotteryProduct;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.status) && Utils.myTrim(dataItem.status + "") != "null") {
                try {
                  status = parseInt(dataItem.status);
                  status = isNaN(status) ? 1 : status;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.payStatus) && Utils.myTrim(dataItem.payStatus + "") != "null") {
                try {
                  payStatus = parseInt(dataItem.payStatus);
                  payStatus = isNaN(payStatus) ? 0 : payStatus;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.productName) && Utils.myTrim(dataItem.productName + "") != "null")
                productName = Utils.myTrim(dataItem.productName);
              if (Utils.isNotNull(dataItem.crateTime)) {
                try {
                  dtCreate = new Date(Date.parse((dataItem.crateTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtCreate = new Date();
                }
                createDate = Utils.getDateTimeStr3(dtCreate, "-", 0);
              }
              
              if (Utils.isNotNull(dataItem.duration) && Utils.myTrim(dataItem.duration + "") != "null") {
                try {
                  duration = parseInt(dataItem.duration);
                  duration = isNaN(duration) ? 0 : duration;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.mallCouponsId) && Utils.myTrim(dataItem.mallCouponsId + "") != "null") {
                try {
                  mallCouponsId = parseInt(dataItem.mallCouponsId);
                  mallCouponsId = isNaN(mallCouponsId) ? 0 : mallCouponsId;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.isUse) && Utils.myTrim(dataItem.isUse + "") != "null") {
                try {
                  isUse = parseInt(dataItem.isUse);
                  isUse = isNaN(isUse) ? 0 : isUse;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.type) && Utils.myTrim(dataItem.type + "") != "null") {
                try {
                  type = parseInt(dataItem.type);
                  type = isNaN(type) ? 0 : type;
                } catch (err) { }
              }
              if (Utils.isNotNull(dataItem.endTime)) {
                try {
                  dtEnd = new Date(Date.parse((dataItem.endTime + "").replace(/-/g, "/")))
                } catch (e) {
                  dtEnd = new Date();
                }
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              } else {
                dtEnd = Utils.getDateTimeAddDays(dtCreate, 30);
                endTime = Utils.getDateTimeStr3(dtEnd, "-", 0);
              }
              //抽奖结果记录需要判断过期
              if (dtEnd < dtNow) {
                isTimeOut = true;
              }
              //如果为无效抽奖记录则跳过
              if (status == 1) continue;

              if (type == 0 && (mallCouponsId > 0 || duration > 0)) type = 1;
              productName = Utils.myTrim(productName) == "" && type == 4 ? "充值抽奖" : productName;
              productName = Utils.myTrim(productName) == "" ? (lotteryProduct == 1 ? '付费按摩' + duration + '分钟' : (lotteryProduct == -1 ? '充值抽奖' : productName)) : productName;
              listItem = { id: id, lotteryActivityProductId: lotteryActivityProductId, lotteryProduct: lotteryProduct, productName: productName, createDate: createDate, endTime: endTime, duration: duration, mallCouponsId: mallCouponsId, isUse: isUse, type: type, cashback_price: cashback_price, payStatus: payStatus, }
              if (type != 0 && !isTimeOut && isUse==0) {
                drawAwardRecordList.push(listItem);

                if(duration>0){
                  spareCheirapsisCnt++;
                }
              }
              //如果为刚充值完成则获取充值记录信息
              if (isRecharge && rechargeRecordId == id) {
                rechargeItem = listItem;
              }
            }
          }
          app.data.spareCheirapsisCnt = spareCheirapsisCnt;
          that.setData({
            ["drawAwardRecordList"]: drawAwardRecordList,
            ["spareCheirapsisCnt"]: spareCheirapsisCnt,
            ["rechargeItem"]: rechargeItem,
          })

          //如果为刚充值完成
          if (isRecharge && Utils.isNotNull(rechargeItem)) {
            console.log("rechargeItem:");
            console.log(rechargeItem);
            if (rechargeItem.type != 4) {
              //如果为按摩充值
              that.setData({
                ["rechargeRecordId"]: 0,
              })
              
              that.gotoCheirapsisPage(rechargeItem.id, rechargeItem.duration,0.00,1);
            }
          }
        } else {
          app.setErrorMsg(that, "抽奖失败：失败！错误信息：" + JSON.stringify(res), URL + urlParam)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "抽奖活动数据信息获取：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：跳转按摩器使用页面
  gotoCheirapsisPage: function (id, mincnt, cashback_price,isPayfor) {
    let that = this, url = "";
      let allCash=cashback_price,idlist=id,pf=isPayfor;
      allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
      idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
      pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
      url = "/pages/cheirapsisWork/cheirapsisWork?ncw=1&id=" + id + "&mcnt=" + mincnt + "&did=" + app.data.agentDeviceId + "&sqy=1&cash=" + allCash+"&pf="+pf;
      //按摩记录信息记载
      app.data.operateRecordItem={id:id,mincnt:mincnt,cash:allCash,pf:pf,tag:0,idlist:idlist}
      console.log("gotoCheirapsisPage:" + url)
      wx.navigateTo({
        url: url
      });
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
  gotoback(e){
    if(e.currentTarget.dataset.pout==0){
      wx.navigateTo({
        url: '../luckdraw/luckdraw'
       })
    }else if(e.currentTarget.dataset.pout==1){
    }
  },

  //方法：获取推荐活动团体劵
  getRecommendActiveCoupon:function(){
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&recommend=1&orderfield=p.id";
    app.getAwardProductList2(that, 0, app.data.companyId, 3, otherParamCon)
  },
  //事件：跳转领取推荐活动劵页面
  gotoCommonReceiveCouponPage:function(e){
    let that=this,item=null,url="";
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) {}
    if(Utils.isNotNull(item)){
      let isCanContinue=true;
      //领取方式1新人领取(未注册手机号的用户)2老人领取3不限
      switch(item.getWay){
        case 1:          
          if(app.data.isRegisterMobile){
            isCanContinue=false;
            wx.showModal({
              title: '提示',
              content: "对不起，该活动仅限新用户参与！",
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          break;
        case 2:
          if(!app.data.isRegisterMobile){
            isCanContinue=false;
            wx.showModal({
              title: '提示',
              content: "对不起，该活动仅限老用户参与！",
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          break;
      }
      if(isCanContinue){
        url="/packageYK/pages/GetAMassage/GetAMassage?mtype=3&aid="+item.id+"&cid="+item.companyId;
        wx.navigateTo({
          url: url,
        })
      }      
    }
  },
  //方法：获取推荐活动列表
  getRecommendActivityList: function () {
    var that = this;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_lotteryActivity&action=lotteryActivityList&companyId=" + app.data.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&recommend=1&sign=" + sign;
    console.log('获取推荐活动列表：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取推荐活动列表");
        console.log(res)
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.dataList) && res.data.data.dataList.length>0) {
          var data = res.data.data.dataList, dataItem = null, listItem = null, recommendProductList = [];
          var id = 0, companyId = 0, getWay = 0,activityName="", activityImage = "";
          for (var i = 0; i < data.length; i++) {
            id = 0; companyId = 0; getWay = 0;activityName=""; activityImage = "";
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.companyId))
            {
              try{
                companyId = parseInt(dataItem.companyId);
                companyId = isNaN(companyId) ? 0 : companyId;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.getWay))
            {
              try{
                getWay = parseInt(dataItem.getWay);
                getWay = isNaN(getWay) ? 0 : getWay;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.activityName)){
              activityName = dataItem.activityName;
            }
            if (Utils.isDBNotNull(dataItem.activityImage)){
              activityImage = dataItem.activityImage;
              activityImage = app.getSysImgUrl(activityImage);
            }
            if(Utils.myTrim(activityImage)=="")continue;
            listItem = {
              id : id, companyId : companyId, getWay : getWay,activityName:activityName, activityImage:activityImage,
            }
            recommendProductList.push(listItem);
          }

          that.setData({
            ["recommendProductList"]: recommendProductList,
          })
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
})
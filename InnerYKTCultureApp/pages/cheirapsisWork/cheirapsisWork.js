// pages/cheirapsisWork/cheirapsisWork.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var LOGUtils = require('../../utils/logutils.js');
// var WebSocket = require('../../websocket/connect.js');
// var MsgReceived = require('../../websocket/msgHandler.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,timeOutFCDOperate=null, timeOutGetDrawAwardList = null, timeInternelQueryDevice = null, timeOutGetPCheirapsisProductList = null, timeOutGetDrawAwardRecordList=null, intervalCountDown = null;
//isNewCheirapsis：是否开始新一轮按摩
var mainObj = null, sendGPRSCmdCnt = 0, frequentness = 5, sendCmdTime = new Date(), lastStatData = null,isShowOPAlert=false,isNewCheirapsis=false;
var mainPackageUrl = "../../pages", mainPackageUrlName = "pages", packYKPageUrl = "../../packageYK/pages", netFailCnt = 0, controlsFailCnt = 0, payMordeAlert = "您还有可使用的按摩券(“首页”-“我的奖品”中选择使用)，是否需要继续支付？";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    isLoad: false,         //是否已经加载
    DataURL: DataURL,      //远程资源路径
    isDowithing:false,
    operationTag: 0,        //onShow操作类型：0无操作，1切换设备
    luckdraw_id: app.data.luckdraw_id,            //抽奖活动ID
    isShowLog:false,
    isFControlSucced:false,      //加载或显示首次操作是否成功
    fControlCnt:0,               //加载或显示首次操作重试次数

    isStartQuickly:0,            //是否立即启动
    awardRecordId: 0,            //按摩记录ID
    deviceId: 0,                 //设备ID
    deviceStatus:1,              //设备绑定公司状态：0已绑定，1未绑定
    deviceCompanyId: 0,          //设备所属公司ID
    workStat: 0,                //按摩器状态：0未启用，1启用中，2暂停，3已停止

    payCheirapsisProductList: [], //按摩器服务类目
    curSelIndex: -1,              //当前所选服务类目

    isShowReChargePop: false,     //继续按摩充值弹窗是否显示
    isConitnueReCharge: false,    //是否继续按摩

    //倒计时
    remainTime: 0,                  //倒计时总时长秒
    addCheirapsisTime:0,            //延时总时长秒
    alertRemainTime: 0,              //提示时间
    remainTimeHours: '',            //倒计时小时
    remainTimeMinutes: '',          //倒计时分钟
    remainTimeSeconds: '',          //倒计时秒        

    curSelRechargeItem: null,             //当前所选充值记录信息
    rechargeRecordId: 0,                 //充值记录ID
    rechargeProductId: 0,                //充值对应产品ID
    rechargeAlert: "",                   //充值提示语
    rechargeSum: 0.00,                   //充值金额
    rechargeMinuteCnt: 0,               //充值分钟数
    rechargeType: 0,                     //充值类型：0抽奖，1按摩
    rechargeItem: null,

    isForbidOnUsed: app.data.isForbidOnUsed, //设备在用时是否禁止操作
    //////////////////////控制设备的参数/////////////////////////////////////
    deviceAddress: "",          //设备蓝牙地址
    uuid00: "0000FFF0-0000-1000-8000-00805F9B34FB", //调起服务
    uuid01: "0000FFF1-0000-1000-8000-00805F9B34FB", //控制获取特征值 

    isHot: 1,           //是否加热
    curFunction: 1,     //所选功能：1正转，2反转，3捂脚，0其他
    curPower: 1,        //强度档位：1档，2档，3档，4档，5档
    signalPower: 70,    //信号强度
    isUseStat: false,   //设备是否在用（已经被使用）
    chatype: '',
    chat: '',

    htmlLog: "",
    deviceModelId: -1,  //设备版本：01款，02款
    softVersion:0,      //软件版本：9为02款以上版本
    speed: 0,

    cashDrawAward: 0.00,   //抽奖提现金额（提现后记得更改为0.00）
    isPayfor: 0,           //是否为支付按摩
    sitysix: 0,

    allSecnds: 0,           //剩余时间（秒）
    lastSyncRemainTime: 0,  //上次同步时间
    cb51StartTag: 0,        //1启动检查，2停止检查，3支付检查，4时间查询
    isReStart: false,
    socketMsgQueue:[],      //websocket消息队列

    setHotDegreeObj:null,   //设置加热信息
    isSetHotDegree:0,       //是否点了加热按钮
    selHDIndex: -1,         //当前所选02款加热时段设置项索引
    selHDItem:null,         //当前所选02款加热时段设置项
    hotDegreeList:[         //02款加热时段设置列表
      { id: 0, thermal: 60, sitysix:0, openTime: 60, closeTime: 40 },
      { id: 50, thermal: 80, sitysix:50, openTime: 80, closeTime: 20 },
      { id: 100, thermal: 100, sitysix:100, openTime: 100, closeTime: 0 },
    ],
    remainHotTime:0,        //02款加热间隔剩余时间
    cb62StartTag:0,

    syncTimeStat:false,     //是否同步处理剩余时间显示
    finishShowAlert:0,      //是否显示提示弹窗（按摩中途切换其他页面再返回按摩界面情况）：0不显示，1显示
    thermal:20, //滑块的值

    drawAwardRecordList:[], //可用优惠券
    isOnShow:false,         //是否执行onShow事件
    isShowRemainTime:false, //是否显示剩余时间
    isSCmdOperating:false,  //是否指令执行中

    deviceUserId:0,         //当前设备使用用户ID
    cb51RemainTime:0,       //CB51查询结果剩余时间数
    payIdList:"",           //按摩红包流水涉及的按摩记录ID

    isTestDevice:0,         //是否测试设备:0否，1是
    isNewCWork:0,           //是否新一轮按摩
    isSendCashDrawAward:false,  //是否已红包返现

    WebSocket:null,
    MsgReceived:null,
  },
  ///////////////////////////////////////////////////////////////////////////////////
  //----------------黄夏迪部分方法----------------------------------------------------
  //方法：启动设备
  startHXDDeviceWork: function () {
    let that = this;
    //workStat按摩器状态：0未启用，1启用中，2暂停，3已停止
    //倒计时方法调用——注意：正常情况应该是黄夏迪启动机器后调用
    if (app.data.agentDeviceAddress != null && app.data.agentDeviceAddress.length > 0) {
      let cmdCtrlType="";
      switch(that.data.softVersion){       
        case 0:
          isNewCheirapsis=false;
          if (that.data.workStat == 0) {
            console.log("开始时间：" + that.data.remainTime);
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "01", that.data.remainTime,true,null) //开启设备
            //同步时间频率设置
            frequentness = 5;
          } else if (that.data.workStat == 2) {
            //暂停后重新启动，先查询时间
            that.data.isReStart = true;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "02", null, true, null) //开启设备
          }
          break;
        default:
          if(that.data.cb51RemainTime>0 && that.data.deviceUserId==appUserInfo.userId && app.data.isDeviceMyUsing && isNewCheirapsis){
            //【1】延时处理：如果设备正在运行，上次运行剩余时间大于0，本次为新一轮按摩则延时处理
            if(app.data.isCheirapsisAlertAddTime){
              wx.showModal({
                title: '提示',
                content: '按摩器正在运行，您确定加时吗？取消操作则返回“我的按摩劵”页面',
                success (res) {
                  if (res.confirm) {
                    //默认延时处理
                    that.addCheirapsisTime();
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.redirectTo({
                      url: "/packageYK/pages/Myprize/Myprize"
                    });
                  }
                }
              })
            }else{
              //默认延时处理
              that.addCheirapsisTime();
            }
          }else{
            isNewCheirapsis=false;
            if (that.data.workStat == 0) {
              console.log("开始时间：" + that.data.remainTime);
              that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "01", that.data.remainTime,true,null) //开启设备
              //同步时间频率设置
              frequentness = 5;
            } else if (that.data.workStat == 2) {
              //暂停后重新启动，先查询时间
              that.data.isReStart = true;
              that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "02", null, true, null) //开启设备
            }
          }
          break;
      }
      
    } else {
      wx.showToast({
        title: '设备地址为空',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：延时处理
  addCheirapsisTime:function(){
    let that=this;
    isNewCheirapsis=false;
    that.data.cb51RemainTime=0;
    that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "04", that.data.addCheirapsisTime,true,null) //开启设备
    //同步时间频率设置
    frequentness = 5;
    //如果设备尚未启动则更新记录状态
    if (that.data.awardRecordId > 0) {
      //更改相应抽奖记录的已使用状态
      that.setAwardAboutRecordUsed(that.data.awardRecordId);
    }
  },
  //方法：变更功能模式/强度
  //funMode：功能模式 0正常，1捂脚，2杀菌，3其他
  //power：档位 1档，2档，3档，4档，5档
  changeHXDDeviceWork: function (tag, funMode, power) {
    //黄夏迪代码
    let that = this;
    if (tag == 0) { //模式
      switch (funMode) {
        case 1:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB61", "01", null, true, null) //正常
          break;
        case 2:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB61", "02", null, true, null) //反转
          break;
        case 3:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB61", "03", null, true, null) //捂脚
          break;
        case 4:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB61", "04", null, true, null) //捂脚
          break;
        case 5:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB61", "05", null, true, null) //捂脚
          break;
        case 0:
          if (!that.data.isSetHot)
            //不加热
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", "00", null, true, null)
          else
            //加热
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", "01", null, true, null) //杀菌（加热）
          break;
      }
    } else if (tag == 1) { //强度
      switch (power) {
        case 1:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "01", null, true, null)
          break;
        case 2:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "02", null, true, null)
          break;
        case 3:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "03", null, true, null)
          break;
        case 4:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "04", null, true, null)
          break;
        case 5:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "05", null, true, null)
          break;
        case 6:
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB63", "06", null, true, null)
          break;
      }
    }
  },
  changeDeviceWork: function (cmd, cmdctrltype) {
    let that = this;
    that.sendDeviceCommand(app.data.agentDeviceAddress, cmd, cmdctrltype, null, true, null);
  },
  //方法：关闭设备
  //参数：
  //tag:0关闭，1暂停
  stopHXDDeviceWork: function (tag) {
    let that = this;
    //结束按摩方法调用——注意：正常情况应该是黄夏迪关闭机器后调用
    if (app.data.agentDeviceAddress != null && app.data.agentDeviceAddress.length > 0) {
      if (tag == 0) {
        // that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "00", null,true,null)
      } else if (tag == 1) {
        that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "03", null, true, null)//
      }
    } else {
      wx.showToast({
        title: '设备地址为空',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //----------------黄夏迪部分方法----------------------------------------------------
  onLoad: function (options) {
    let that = this,isTestDevice=0;
    console.log("cheirapsisWork 加载......")
    console.log(options)
    try {
      if (Utils.isNotNull(options) && Utils.isNotNull(options.test))
      isTestDevice = parseInt(options.test);
      isTestDevice = isNaN(isTestDevice) ? 0 : isTestDevice;
    } catch (e) {}
    if(app.data.agentDeviceId<=0 && isTestDevice==0){
      app.data.curPageDataOptions={
        package:"",page:"/pages/cheirapsisWork/cheirapsisWork",options: options,
      }
      wx.redirectTo({
        url: '/pages/scanCode/scanCode?login=2'
      })
      return;
    }
    if(Utils.isNotNull(app.globalData.userInfo) && (Utils.isNull(app.globalData.userInfo.userMobile) || app.globalData.userInfo.userMobile.indexOf("u_")>=0)){
      wx.showModal({
        title: '提示',
        content: '该功能需要绑定手机号，您是否继续？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.data.curPageDataOptions={
              package:"",page:"/pages/cheirapsisWork/cheirapsisWork",options:options,
            }
            wx.redirectTo({
              url: '/packageYK/pages/tiedaphone/tiedaphone?lgt=1'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      
      return;
    }
    mainObj = that;
    app.data.webSocketMasterPage=that;
    if(!app.data.socketOpened){
      app.connectWebSocket(that);
    }
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, isScene = false, dOptions = null, paramShareUId = 0;
    console.log("加载参数：")
    console.log(options)
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }

    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }

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
        
        //计算按摩总时长（秒），倒计时提示继续按摩总时长（秒）
        let finishShowAlert = 0, isStartQuickly=0,awardRecordId = 0, minCnt = 0, isPayfor = 0, cashDrawAward = 0.00, deviceId = 0, deviceAddress = "", remainTime = 0, alertRemainTime = app.data.countDownAlertTime,isNewCWork=0;
        that.data.osTag = Utils.isNotNull(app.data.currentOS) && app.data.currentOS.osTag >= 1 ? app.data.currentOS.osTag : 1;
        //是否新启按摩操作：1是，0否
        try {
          if (sOptions.ncw != null && sOptions.ncw != undefined)
          isNewCWork = parseInt(sOptions.ncw);
          isNewCWork = isNaN(isNewCWork) ? 0 : isNewCWork;
        } catch (e) { }
        //是否显示提示弹窗（按摩中途切换其他页面再返回按摩界面情况）：0不显示，1显示
        try {
          if (sOptions.fsa != null && sOptions.fsa != undefined)
            finishShowAlert = parseInt(sOptions.fsa);
          finishShowAlert = isNaN(finishShowAlert) ? 0 : finishShowAlert;
        } catch (e) { }
        //按摩记录ID
        try {
          if (sOptions.id != null && sOptions.id != undefined)
            awardRecordId = parseInt(sOptions.id);
          awardRecordId = isNaN(awardRecordId) ? 0 : awardRecordId;
        } catch (e) { }
        //按摩器ID
        try {
          if (sOptions.did != null && sOptions.did != undefined)
            deviceId = parseInt(sOptions.did);
          deviceId = isNaN(deviceId) ? 0 : deviceId;
        } catch (e) { }
        //是否为支付按摩
        try {
          if (sOptions.pf != null && sOptions.pf != undefined)
            isPayfor = parseInt(sOptions.pf);
          isPayfor = isNaN(isPayfor) ? 0 : isPayfor;
        } catch (e) { }
        //是否立即启动按摩
        try {
          if (sOptions.sqy != null && sOptions.sqy != undefined)
            isStartQuickly = parseInt(sOptions.sqy);
          isStartQuickly = isNaN(isStartQuickly) ? 0 : isStartQuickly;
        } catch (e) { }
        //分钟数
        try {
          if (sOptions.mcnt != null && sOptions.mcnt != undefined)
            minCnt = parseInt(sOptions.mcnt);
          minCnt = isNaN(minCnt) ? 0 : minCnt;
        } catch (e) { }
        //抽奖返现红包
        try {
          if (sOptions.cash != null && sOptions.cash != undefined)
            cashDrawAward = parseFloat(sOptions.cash);
          cashDrawAward = isNaN(cashDrawAward) ? 0 : cashDrawAward;
          cashDrawAward = parseFloat((cashDrawAward).toFixed(app.data.limitQPDecCnt));
        } catch (e) { }
        try {
          if (sOptions.blueaddr != null && sOptions.blueaddr != undefined)
            deviceAddress = Utils.myTrim(decodeURIComponent(sOptions.blueaddr));
        } catch (e) { }
        deviceId=deviceId>0?deviceId:app.data.agentDeviceId;
        
        //1、获取设备相关信息并做相应启动操作
        if (deviceId > 0) {
          that.getDeviceInfo("", deviceId, 1);
        } else if (Utils.myTrim(deviceAddress) != "") {
          that.getDeviceInfo(deviceAddress, 0, 0);
        }
        isNewCheirapsis=isNewCWork==1?true:false;
        remainTime = minCnt * 60;
        that.setData({
          ["awardRecordId"]: awardRecordId,
          ["deviceId"]: deviceId,
          ["deviceStatus"]: app.data.agentDeviceStatus,
          ["remainTime"]: remainTime,
          ["addCheirapsisTime"]:remainTime,
          ["alertRemainTime"]: alertRemainTime,
          ["cashDrawAward"]: cashDrawAward,
          ["isStartQuickly"]: isStartQuickly,

          ["rechargeMinuteCnt"]: minCnt,
          ["isForbidOnUsed"]: app.data.isForbidOnUsed,
          ["isPayfor"]: isPayfor,

          ["finishShowAlert"]: finishShowAlert,
        })
        if(Utils.isNull(app.data.operateRecordItem)){
          app.data.operateRecordItem = { id: awardRecordId, mincnt: minCnt, cash: cashDrawAward, pf: isPayfor,tag:0,idlist:awardRecordId }
        }else if(app.data.operateRecordItem.pf==0 && isPayfor==1){
          app.data.operateRecordItem.pf=isPayfor;
        }
        console.log("deviceId："+deviceId)
        console.log("app.data.operateRecordItem")
        console.log(app.data.operateRecordItem)
        //2、格式化剩余时间
        that.transformRemainTime(remainTime);
        //3、启动同步定时器
        that.syncDeviceTimeInterval();
        //4、获取价格费用列表
        timeOutGetDrawAwardRecordList = setTimeout(function () { 
          that.getPayRecordInfo(0, 1);
        }, 500);
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
    app.data.webSocketMasterPage=that;
    app.data.pageLayerTag ="../../";
    app.data.isCurCheirapsisWorkPage = true;
    console.log(that.data.awardRecordId)
    that.twinklet()
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      that.setData({
        ["isShowRemainTime"]: false,
      })
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        that.data.isOnShow = true;
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%")
        //1、如果支付按摩记录ID大于0，则为支付完成的“onShow”事件——获取该按摩记录，查询按摩器状态并启动
        if (that.data.rechargeRecordId > 0) {
          that.getPayRecordInfo(that.data.rechargeRecordId,0);
        }
        //2、如果为切换设备则获取相应信息
        if (that.data.operationTag == 1) {
          let deviceAddress = "";
          try {
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            deviceAddress = Utils.myTrim(currPage.data.deviceAddress);
          } catch (err) { }
          that.setData({
            ["deviceId"]: app.data.agentDeviceId,
            ["deviceStatus"]: app.data.agentDeviceStatus,
            ["remainTime"]: 0,
            ["curSelIndex"]: -1,
          })
          that.transformRemainTime(0);
        }
        //3、根据设备ID查询设备信息并发送查询设备状态指令
        that.getDeviceInfo("", app.data.agentDeviceId, 1);
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
    that.data.operationTag = 0;
  },
  //方法：获取支付记录信息
  //tag：0按指定ID获取按摩记录，1按当前用户ID获取可用按摩记录
  getPayRecordInfo: function (id,tag) {
    let that = this, otherConParams = "&xcxAppId=" + app.data.wxAppId;
    switch(tag){
      case 1:
        otherConParams += "&userId=" + appUserInfo.userId + "&duration=0&status=0&isUse=0&isCancelShare=0";
        app.getShareStatData(that, otherConParams, 1000000, 1);
        break;
      default:
        otherConParams += "&id=" + id;
        app.getShareStatData(that, otherConParams, 100, 1);
        break;
    }
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无分成统计信息！";
    if (that.data.rechargeRecordId > 0){
      try {
        wx.hideLoading()
      } catch (e) { }
      that.data.isLoad = true;
      switch (tag) {
        case 1:
          netFailCnt = 0;
          console.log("获取分成统计列表信息：")
          console.log(dataList);
          let isFinishPay = false, rechargeMinuteCnt = that.data.rechargeMinuteCnt;
          if (Utils.isNotNull(dataList)) {
            if (Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
              let dataItem = dataList.dataList[0];
              if (Utils.isNotNull(dataItem.zfno) && Utils.myTrim(dataItem.zfno + "") != "null" && Utils.myTrim(dataItem.zfno + "") != "") {
                isFinishPay = true;

                if (rechargeMinuteCnt<=0){
                  if (dataItem.duration != null && dataItem.duration != undefined && Utils.myTrim(dataItem.duration + "") != "null") {
                    try {
                      rechargeMinuteCnt = parseInt(dataItem.duration);
                      rechargeMinuteCnt = isNaN(rechargeMinuteCnt) ? 0 : rechargeMinuteCnt;
                    } catch (err) { }
                  }
                }
              }
            }
          }

          if (isFinishPay) {
            let remainTime = rechargeMinuteCnt * 60;
            //按摩记录信息记载
            let allCash=0.00,idlist=that.data.rechargeRecordId,pf=1;
            allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
            idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
      pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
            app.data.operateRecordItem = { id: that.data.rechargeRecordId, mincnt: rechargeMinuteCnt, cash: allCash, pf: pf, tag: 0,idlist:idlist }
            //如果当前保存设备地址的APP公共变量“”不为空，则无须扫码操作
            that.setData({
              ["awardRecordId"]: that.data.rechargeRecordId,
              ["rechargeMinuteCnt"]: rechargeMinuteCnt,
              ["remainTime"]: remainTime,

              ["rechargeRecordId"]: 0,
              ["workStat"]: 0,
              ["isStartQuickly"]: 1,
            })

            that.transformRemainTime(remainTime);

            //产品要求立即启动
            console.log("CB51查询设备状态并立即启用----------------------------")
            console.log(app.data.operateRecordItem)
            //如果为正常启动则查询是否在用
            that.data.cb51StartTag = 1;
            isNewCheirapsis=true;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
          }
          break;

        default:
          netFailCnt++;
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无" + mainTypeName + "信息！";
          break;
      }
    }else{
      app.dowithGetShareStatData(that, 0, dataList, tag, errorInfo, pageIndex,true)
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    console.log("onHide.......,")
    app.data.isCurCheirapsisWorkPage=false;
    try {
      if (Utils.isNotNull(timeOutGetPCheirapsisProductList)) clearTimeout(timeOutGetPCheirapsisProductList);
    } catch (err) { }
    try {
      if (Utils.isNotNull(timeOutGetDrawAwardRecordList)) clearTimeout(timeOutGetDrawAwardRecordList);
    } catch (err) { }
    try {
      if (Utils.isNotNull(timeOutFCDOperate)) clearTimeout(timeOutFCDOperate);
    } catch (err) { }
    app.closeWebSocket(that);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    console.log("onUnload.......,")
    app.data.isCurCheirapsisWorkPage=false;

    app.closeWebSocket(that);

    try {
      try {
        if (Utils.isNotNull(timeOutGetPCheirapsisProductList)) clearTimeout(timeOutGetPCheirapsisProductList);
      } catch (err) { }
      try {
        if (Utils.isNotNull(timeOutGetDrawAwardRecordList)) clearTimeout(timeOutGetDrawAwardRecordList);
      } catch (err) { }
      try {
        if (Utils.isNotNull(timeOutFCDOperate)) clearTimeout(timeOutFCDOperate);
      } catch (err) { }
      //因为打开其他界面时还需要计时判断，所以该计时器不应该清除 
      // if (timeInternelQueryDevice != null && timeInternelQueryDevice != undefined) clearInterval(timeInternelQueryDevice);
    } catch (err) { }
  },
  //事件：变更功能强度选择
  onChangeFunctionEvent: Utils.debounceStart(function (e) {
    let that = this, isHot = that.data.isHot, isSetHot = that.data.isSetHot, tag = 0, num = 0, curFunction = that.data.curFunction, curPower = that.data.curPower;
    let cmd="",cmdctrltype="";
    console.log("app.data.isCurCheirapsisWorkPage:" + app.data.isCurCheirapsisWorkPage)
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    try {
      num = parseInt(e.currentTarget.dataset.num);
      num = isNaN(num) ? 0 : num;
    } catch (e) { }
    
    switch (tag) {
      //变更模式
      case 0:
        cmd = "CB61";
        cmdctrltype = "0" + num;
        if (curFunction == num) return;
        break;
      //变更强度
      case 1:
        cmd = "CB63";
        cmdctrltype = "0" + num;
        if (curPower == num) return;
        break;
      //加热或不加热
      case 2:
        cmd = "CB62";
        cmdctrltype = "0" + num;
        if (that.data.deviceModelId==2){
          let setHotDegreeObj = that.data.setHotDegreeObj,cmdNum=60;
          if (Utils.isNotNull(setHotDegreeObj)){
            cmdNum=Utils.isNotNull(setHotDegreeObj.selHDItem)?setHotDegreeObj.selHDItem.thermal:cmdNum;
            if (setHotDegreeObj.isSetHotDegree==num)return;
          }
          switch(that.data.softVersion){
            case 0:
              that.setHotDegreeEnd();
              break;
            default:
              if(num==1){
                cmdctrltype=cmdNum.toString(16).toUpperCase();
              }
              break;
          }
        }else{
          if (isHot == num) return;
        }
        break;
    }

    that.changeDeviceWork(cmd, cmdctrltype);
  }, 500, this),
  //方法：获取费用列表信息
  getPayCheirapsisProductList: function () {
    let that = this, deviceId = that.data.deviceId;

    if (deviceId > 0 && app.data.agentDeviceStatus == 0) {
      let otherParamCon = "&xcxAppId=" + app.data.wxAppId;
      otherParamCon += "&devicesId=" + deviceId;
      otherParamCon += "&lotteryProduct=1&dtPrice=1&status=0&orderfield=p.duration&ordertype=asc";
      app.getAwardProductList2(that, 0, app.data.agentCompanyId, 1, otherParamCon);
    } else {
      let payCheirapsisProductList = [], srcListItem = null;
      srcListItem = { id: 1, productName: "体验尝试", duration: 1, price: 0 }
      payCheirapsisProductList.push(srcListItem);

      srcListItem = null;
      srcListItem = { id: 2, productName: "休闲放松", duration: 5, price: 0 }
      payCheirapsisProductList.push(srcListItem);

      srcListItem = null;
      srcListItem = { id: 3, productName: "疲劳恢复", duration: 15, price: 0 }
      payCheirapsisProductList.push(srcListItem);

      srcListItem = null;
      srcListItem = { id: 4, productName: "深度解压", duration: 20, price: 0 }
      payCheirapsisProductList.push(srcListItem);

      that.setData({
        ["payCheirapsisProductList"]: payCheirapsisProductList,
      })
    }
  },
  //方法：获取奖项结果处理函数
  //operateTag:0转盘信息，1按摩服务
  dowithGetAwardProductList: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        netFailCnt = 0;
        console.log("获取合伙人记录结果：");
        console.log(dataList);
        let mainData = dataList, datalist = [], sourceDataList = [], payCheirapsisProductList = [], curSelIndex = -1;
        let awardName = "", color = "", fcolor = "";
        let id = 0, lotteryProduct = 0, no = 0, lastNo = 0, grade = 0, type = 0, mallCouponsId = 0, duration = 0, price = 0.00, allPart = mainData.length;
        let sectionPartAngle = 360 / allPart;
        let dataItem = null, grade0listItem = null, srcListItem = null;
        switch (operateTag) {
          case 1:
            if (Utils.isNotNull(mainData.dataList) && mainData.dataList.length > 0) {
              let promotionstart = "", promotionend = "", isHaveDeviceItem = false, arrayTemp = null, priceTypeList = app.data.priceTypeList;
              let firstPriceItem = null, dtStart = new Date(), dtStartStr = "", dtEnd = new Date(), dtEndStr = "", isValid = true;
              payCheirapsisProductList = mainData.dataList;
              for (let i = 0; i < payCheirapsisProductList.length; i++) {
                firstPriceItem = null;
                if (!isHaveDeviceItem && payCheirapsisProductList[i].devicesId > 0) isHaveDeviceItem = true;
                if (Utils.isNotNull(payCheirapsisProductList[i].prices) && payCheirapsisProductList[i].prices.length > 0) {
                  for (let k = 0; k < payCheirapsisProductList[i].prices.length; k++) {
                    dtEnd = new Date(); dtStart = new Date(); isValid = true;
                    for (let n = 0; n < priceTypeList.length; n++) {
                      if (priceTypeList[n].id == payCheirapsisProductList[i].prices[k].priceType) {
                        payCheirapsisProductList[i].prices[k].priceTypeName = priceTypeList[n].name;
                        break;
                      }
                    }

                    promotionstart = ""; promotionend = "";
                    promotionstart = payCheirapsisProductList[i].prices[k].promotionstart; promotionend = payCheirapsisProductList[i].prices[k].promotionend;
                    switch (payCheirapsisProductList[i].prices[k].priceType) {
                      case 2:
                        dtStart = new Date(promotionstart.replace(/\-/g, "/")); //Utils.getDateByTimeStr(promotionstart, true);
                        dtEnd = new Date(promotionend.replace(/\-/g, "/"));//Utils.getDateByTimeStr(promotionend, true);
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
                    if (isValid) {
                      if (Utils.isNotNull(firstPriceItem)) {
                        firstPriceItem = payCheirapsisProductList[i].prices[k].sort < firstPriceItem.sort ? payCheirapsisProductList[i].prices[k] : firstPriceItem;
                      } else {
                        firstPriceItem = payCheirapsisProductList[i].prices[k];
                      }
                    }
                  }
                }

                //firstPriceItem
                if (Utils.isNotNull(firstPriceItem)) {
                  payCheirapsisProductList[i].actprice = firstPriceItem.actprice;
                  payCheirapsisProductList[i].specialprice = firstPriceItem.specialprice;
                  payCheirapsisProductList[i].halfprice = firstPriceItem.halfprice;
                  payCheirapsisProductList[i].priceType = firstPriceItem.priceType;
                  payCheirapsisProductList[i].promotionend = firstPriceItem.promotionend;
                  payCheirapsisProductList[i].dtEndTime = firstPriceItem.dtEndTime;
                }
                payCheirapsisProductList[i].price = payCheirapsisProductList[i].specialprice > 0.00 && payCheirapsisProductList[i].specialprice < payCheirapsisProductList[i].actprice ? payCheirapsisProductList[i].specialprice : payCheirapsisProductList[i].actprice;
              }
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
            if (payCheirapsisProductList.length>0){
              that.setData({
                ["payCheirapsisProductList"]: payCheirapsisProductList,
                ["curSelIndex"]: curSelIndex,
              })
            }else{
              wx.showToast({
                title: "该设备暂无费用设置！",
                icon: 'none',
                duration: 2000
              })
            }
            break;
        }
        break;
      default:
        netFailCnt++;
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : (operateTag == 0 ? "获取转盘信息失败！" : "获取按摩服务价格失败！");
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  //方法：分析蓝牙地址
  getDeviceInfo: function (deviceBlueAddress, deviceId, tag) {
    let that = this, otherParamCon = "&xcxAppId=" + app.data.wxAppId;

    if (tag == 0) {
      otherParamCon += "&deviceAddress=" + encodeURIComponent(deviceBlueAddress);
    } else {
      otherParamCon += "&id=" + deviceId;
    }

    otherParamCon += "&pageSize=99&pageIndex=1";
    app.getDeviceList(that, otherParamCon);
  },
  //方法：获取设备结果处理函数
  dowithGetDeviceList: function (dataList, tag, errorInfo) {
    let that = this, osTag = that.data.osTag, deviceId = 0, model = "", deviceModelId = -1, deviceCompanyId = app.data.agentCompanyId, deviceGprsAddress = app.data.agentDeviceAddress, address = "", status = 1, interval = 0, isUsed = "", dataUpdateTime = "", time = 0, dtUpdate = new Date(), userId = 0, isDeviceUsing = true;
    that.data.isLoad = true;
    switch (tag) {
      case 1:
        netFailCnt = 0;
        console.log("获取设备结果：");
        console.log(dataList);
        if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
          let dataItem = dataList.dataList[0];
          deviceId = dataItem.id;
          try {
            userId = parseInt(dataItem.userId);
            userId = isNaN(userId) ? 0 : userId;
          } catch (e) { }
          isUsed = Utils.isNull(dataItem.isUsed) ? "00" : dataItem.isUsed;
          //倒计时 时间
          if (Utils.myTrim(isUsed) != "") {
            time = parseInt(isUsed, 16); //16进制转10进制
          }
          //判断当前设备是否被其他人所用
          if (userId == app.globalData.userInfo.userId || time<=0){
            //没有被用——
            //1、使用者是自己；
            //2、剩余时间为0;
            isDeviceUsing=false;
          }else{
            //3、如果设备超过指定秒数没有更新“dataUpdateTime”则判定为没有被用
            dataUpdateTime = Utils.isNull(dataItem.dataUpdateTime) ? "" : dataItem.dataUpdateTime;
            try {
              dtUpdate = new Date(dataUpdateTime.replace(/\-/g, "/"));
              interval = Utils.getTimeInterval(dtUpdate, (new Date()), 0);
              //如果剩余时间大于0，只要上次更新时间低于指定时效则为在用
              if (interval >= (app.data.isUsedInterval * 1000)) {
                //设备已经在用
                isDeviceUsing = false;
              }
            } catch (e) { }
          }
          
          if (Utils.isNotNull(dataItem.model)) {
            model = Utils.myTrim(dataItem.model);
          }


          if (Utils.isNotNull(dataItem.status)) {
            try {
              status = parseInt(dataItem.status);
              status = isNaN(status) ? 1 : status;
            } catch (e) { }
          }
          //0已经绑定1解绑
          if (status == 0) {
            if (Utils.isNotNull(dataItem.companyId) && Utils.myTrim(dataItem.companyId + "") != "null") {
              try {
                deviceCompanyId = parseInt(dataItem.companyId);
                deviceCompanyId = isNaN(deviceCompanyId) ? 0 : deviceCompanyId;
              } catch (e) { }
            }
            address = Utils.isNotNull(dataItem.address) ? dataItem.address : "";
            
            app.data.agentCompanyId = deviceCompanyId;
            app.data.agentPutAddress = address;
          }
          app.data.agentDeviceId = deviceId;
          app.data.agentDeviceStatus=status;
          
          if (Utils.isNotNull(dataItem.deviceAddress) && Utils.myTrim(dataItem.deviceAddress + "") != "null") {
            deviceGprsAddress = Utils.myTrim(dataItem.deviceAddress);
          }

          if (Utils.isNotNull(app.data.defaultDeviceModels) && app.data.defaultDeviceModels.length > 0) {
            for (let n = 0; n < app.data.defaultDeviceModels.length; n++) {
              if (Utils.myTrim(app.data.defaultDeviceModels[n].name) == model) {
                deviceModelId = app.data.defaultDeviceModels[n].id; break;
              }
            }
            if (deviceModelId < 0 && Utils.myTrim(deviceGprsAddress) != "") {
              try {
                deviceModelId = parseInt(deviceGprsAddress.substr(0, 1));
                deviceModelId = isNaN(deviceModelId) ? -1 : deviceModelId;
              } catch (e) { }
            }
          }
        } else {
          that.insertDeviceRecord(deviceGprsAddress);
        }
        break;
      default:
        netFailCnt++;
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取设备失败！";
        break;
    }
    app.data.agentDeviceAddress=deviceGprsAddress;
    that.setData({
      ["deviceId"]: deviceId,
      ["deviceStatus"]: status,
      ["deviceModelId"]: deviceModelId,
      ["deviceCompanyId"]: deviceCompanyId,

      ["deviceUserId"]:userId,
    })
    timeOutGetPCheirapsisProductList = setTimeout(that.getPayCheirapsisProductList, 300);
    wx.setNavigationBarTitle({
      title: app.data.agentDeviceStatus == 0 ? "设备操控" : "设备测试"
    })

    if (that.data.isStartQuickly == 1 && that.data.rechargeMinuteCnt > 0) {
      console.log("CB51查询设备状态并立即启用----------------------------")
      //如果为正常启动则查询是否在用
      that.data.cb51StartTag = 1;
      that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
    } else {
      console.log("CB51查询设备状态----------------------------")
      that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
    }
    //延时检查首次查询是否成功，不成功则最多总共重试3次
    that.data.fControlCnt=that.data.fControlCnt+1;
    timeOutFCDOperate=setTimeout(that.checkDeviceFirstQueryResult, 1000);
  },
  //方法：首次查询结果检查或重试
  checkDeviceFirstQueryResult:function(){
    let that=this,isFControlSucced=that.data.isFControlSucced,fControlCnt=that.data.fControlCnt;
    if(isFControlSucced || fControlCnt>=3){
      if(!isFControlSucced){
        try{
          wx.hideLoading()
        }catch(e){}
        wx.showModal({
          title: '提示',
          content: '设备启动失败，请返回重试！',
          showCancel:false,
          confirmText:"知道了",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      that.data.isFControlSucced=false;
      that.data.fControlCnt=0;
    }else{
      that.data.fControlCnt=that.data.fControlCnt+1;
      console.log("首次查询重试第"+that.data.fControlCnt+"次。。。。。。")
      that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
    }
  },
  insertDeviceRecord: function (deviceAddress) {
    let that = this, mainDataInfo = null;
    mainDataInfo = { id: 0, deviceAddress: deviceAddress }
    that.saveDeviceInfo(mainDataInfo, 0);
  },
  /**
   * 添加设备
   */
  saveDeviceInfo: function (mainDataInfo, tag) {
    var signParam = 'cls=main_devices&action=saveDevices&userId=' + appUserInfo.userId + "&xcxAppId=" + app.data.wxAppId, otherParam = "";
    app.doPostData(this, app.getUrlAndKey.url, signParam, "datajson", mainDataInfo, "", tag, "操作设备");
  },

  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        netFailCnt = 0;
        console.log(data)

        break;
      default:
        netFailCnt++;
        console.log(error)
        break
    }
  },
  //事件：启动按摩器
  startCheirapsisEvent: Utils.debounceStart(function (e) {
    let that = this;
    //如果按摩时间已结束则提示
    if (that.data.remainTime <= 0) {
      let alertContent = "", workStat = that.data.workStat, deviceId = that.data.deviceId;
      alertContent = workStat == 2 ? (deviceId > 0 && app.data.agentDeviceStatus == 0 ? '对不起，按摩已结束，如需再次按摩请返回重新充值选择购买！' : '对不起，按摩已结束，如需再次按摩重新选择按摩时间！') : (deviceId > 0 && app.data.agentDeviceStatus == 0 ? '请选择购买按摩服务！' : '请选择按摩时间！')
      wx.showModal({
        title: '提示',
        content: alertContent,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    console.log("app.data.agentDeviceAddress:" + app.data.agentDeviceAddress)
    if (Utils.isNull(app.data.agentDeviceAddress)) {
      wx.showToast({
        title: "设备地址无效，无法启动！请重新用微信扫码后再试",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (that.data.workStat == 0 || that.data.remainTime <= 0) {
      //如果为正常启动则查询是否在用
      that.data.cb51StartTag=1;
      that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
    } else {
      //如果为暂停后启动则调用黄夏迪方法启动机器
      //调用黄夏迪启动机器方法
      that.startHXDDeviceWork();
    }
  }, 1000, this),
  //事件：停止按摩器
  stopAllDeviceEvent: Utils.debounceStart(function (e) {
    let that = this, workStat = that.data.workStat;
    if (workStat != 1 && workStat != 2) {
      wx.showToast({
        title: "当前手机未启动设备，无法停止！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: "停止按摩剩余时间将清零，您确定吗？",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "00", null, true, null);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }, 1000, this),
  //事件：关闭按摩器
  stopCheirapsisEvent: Utils.debounceStart(function (e) {
    let that = this;
    if (that.data.remainTime > 0) {
      //暂停操作
      //调用黄夏迪关闭机器方法
      that.stopHXDDeviceWork(1);
    } else {
      //关闭操作
      //调用黄夏迪关闭机器方法
      that.stopHXDDeviceWork(0);
    }
  }, 1000, this),

  //方法：结束按摩方法
  //tag：1指令关闭设备，0其他关闭设备
  finishCheirapsisWork: function (tag) {
    let that = this;
    let workStat = that.data.remainTime > 0 ? 2 : 3, curSelIndex = that.data.curSelIndex;
    //判断是否为暂停 that.data.remainTime>0?暂停:停止
    that.setData({
      ["workStat"]: workStat,
    })

    if (that.data.remainTime <= 0) {
      app.data.isDeviceMyUsing=false;
      console.log("+++++++++++++++++++++++++++++++++++++++++++++")
      console.log("finishCheirapsisWork=========================")
      console.log("app.data.isCurCheirapsisWorkPage:" + app.data.isCurCheirapsisWorkPage)
      console.log("app.data.operateRecordItem:")
      console.log(app.data.operateRecordItem)

      that.setHotDegreeEnd();

      if (app.data.isCurCheirapsisWorkPage) {
        that.transformRemainTime(0);
        that.setIfSyncTimeStat(false);
        app.data.operateRecordItem=null
        switch (tag) {
          case 1:
            if (that.data.isSendCashDrawAward) {             
              wx.showToast({
                title: "本次返现红包已转入“钱包”！",
                icon: 'none',
                duration: 2000
              })
              setTimeout(that.showFinishAlertPop, 2000);
            }else{
              that.showFinishAlertPop();
            }
            that.setData({
              ["curSelIndex"]: -1,
              ["cashDrawAward"]: 0.00,
            })
            break;
          default:
            that.showFinishAlertPop();
            break;
        }
      } else {
        console.log("isShowOPAlert:" + isShowOPAlert)
        if (!isShowOPAlert){
          isShowOPAlert=true;
          wx.showModal({
            title: '温馨提示',
            content: app.data.agentDeviceStatus == 0 ? '本次按摩已结束，是否返回按摩页查看更多优惠？' : '本次按摩已结束，是否返回按摩页？',
            cancelText:"否",
            confirmText:"是",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                isShowOPAlert=false;
                //事件：返回按摩使用界面
                let url = "";
                url = app.data.pageLayerTag + mainPackageUrlName + "/cheirapsisWork/cheirapsisWork?fsa=1&did=" + that.data.deviceId;
                console.log("gotoCheirapsisPage:" + url)
                wx.navigateTo({
                  url: url
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
                isShowOPAlert = false;
                if (Utils.isNotNull(app.data.operateRecordItem) && Utils.isNotNull(app.data.operateRecordItem.cash) && Utils.isNotNull(app.data.operateRecordItem.id) && app.data.operateRecordItem.cash > 0.00) {
                  app.insertWalletRecordByAward(that, app.data.operateRecordItem.cash, app.data.operateRecordItem.idlist);
                  wx.showToast({
                    title: "本次返现红包已转入“钱包”！",
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            }
          })
        }
      }
    }
  },
  //事件：关闭结束提示弹窗
  hideFinishAlertPop: function (e) {
    let that = this, isAlert = false;
    //按摩记录信息记载
    app.data.operateRecordItem = null;

    if (that.data.deviceId > 0 && app.data.agentDeviceStatus==0) {
      //如果为正常模式
      let payCheirapsisProductList = that.data.payCheirapsisProductList, item = null;
      if (Utils.isNotNull(payCheirapsisProductList) && payCheirapsisProductList.length > 0) {
        for (let i = 0; i < payCheirapsisProductList.length; i++) {
          //只比较时间相等
          if (payCheirapsisProductList[i].duration == that.data.rechargeMinuteCnt) {
            item = payCheirapsisProductList[i]; break;
          }
        }
      }
      if (Utils.isNotNull(item)) {
        if (item.price > 0.00) {
          isAlert = that.data.isPayfor == 1 && item.halfprice > 0.00 && item.halfprice < item.price ? true : false;
        }
      }
    }
    if (!isAlert) {
      that.setData({
        ["isShowFinishAlertPop"]: false,
        ["cashDrawAward"]: 0.00,
        ["curSelIndex"]: -1,
        ["isPayfor"]: 0,
      })
      //返回上一页
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否要放弃本次特价优惠？退出将不再获得本次优惠',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              ["isShowFinishAlertPop"]: false,
              ["cashDrawAward"]: 0.00,
              ["curSelIndex"]: -1,
              ["isPayfor"]: 0,
            })

            //返回上一页
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //方法：获取抽奖返现插入零钱记录结果回调处理方法
  dowithInsertWalletRecordByAward: function (dataList, tag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        console.log('抽奖返现插入零钱返回结果：')
        console.log(dataList)
        that.setData({
          ["isSendCashDrawAward"]: true,
        })
        // wx.showToast({
        //   title: "本次返现红包已转入“钱包”！",
        //   icon: 'none',
        //   duration: 2000
        // })
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "抽奖返现插入零钱失败！";
        break;
    }
  },
  //事件：继续体验服务
  submitConitueService: function (e) {
    let that = this;
    that.setData({
      ["cashDrawAward"]: 0.00,
    })
    //按摩记录信息记载
    app.data.operateRecordItem = null;

    if (that.data.deviceId > 0 && app.data.agentDeviceStatus==0) {
      //如果为正常模式
      let payCheirapsisProductList = that.data.payCheirapsisProductList, item = null;
      if (Utils.isNotNull(payCheirapsisProductList) && payCheirapsisProductList.length > 0) {
        if (payCheirapsisProductList.length>1){
          for (let i = 0; i < payCheirapsisProductList.length; i++) {
            //只比较时间相等
            if (payCheirapsisProductList[i].duration == that.data.rechargeMinuteCnt) {
              item = payCheirapsisProductList[i]; break;
            }
          }
          item=Utils.isNull(item)?payCheirapsisProductList[0]:item;
        }else{
          item = payCheirapsisProductList[0];
        }
      }
      if (Utils.isNotNull(item)) {
        let payPrice=0.00;
        if (item.price > 0.00) {
          payPrice = that.data.isPayfor == 1 ? (item.halfprice > 0.00 ? item.halfprice : item.price) : item.price;
        }
        that.showReChargePop(item.id, 1, payPrice, item.duration, "充值" + payPrice + "元，享受" + item.duration + "分钟足疗按摩");
      } else {
        that.setData({
          ["curSelIndex"]: -1,
        })
        
        wx.showToast({
          title: "请选择需要体验的类目！！",
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      //如果为工厂测试模式
      //如果为免费测试服务类目
      let payCheirapsisProductList = that.data.payCheirapsisProductList, curSelIndex = that.data.curSelIndex, item = payCheirapsisProductList[curSelIndex];
      let remainTime = Utils.isNotNull(payCheirapsisProductList) && Utils.isNotNull(payCheirapsisProductList[curSelIndex]) ? payCheirapsisProductList[curSelIndex].duration * 60 : that.data.rechargeMinuteCnt * 60;
      //如果当前保存设备地址的APP公共变量“”不为空，则无须扫码操作
      that.setData({
        ["awardRecordId"]: 0,
        ["remainTime"]: remainTime,
        ["workStat"]: 0,
        ["isShowFinishAlertPop"]: false,
        ["isPayfor"]: 0,
      })
      that.transformRemainTime(remainTime);
    }
  },
  //事件：关闭充值继续按摩提示弹窗
  hideReChargePop: function (e) {
    let that = this;
    that.setData({
      ["isShowReChargePop"]: false
    })
  },
  //事件：确定充值继续按摩事件
  sureReChargeContinue: function (e) {
    let that = this;
    that.setData({
      ["isShowReChargePop"]: false,
      ["isConitnueReCharge"]: true,
    })
  },

  //方法：变更支付抽奖相关记录
  setAwardAboutRecordUsed: function (id) {
    if (id <= 0) return;
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    otherParamCon += "&isUse=1&id=" + id + "&activityId=" + 0 + "&deviceId=" + that.data.deviceId + "&isSetRShare=1&operation=mod";
    otherParamCon += app.data.communicationType == 0 ? "&deviceNo=" + encodeURIComponent(that.data.deviceAddress) : "&deviceNo=" + encodeURIComponent(app.data.agentDeviceAddress);

    app.operateAwardRecord2(that, that.data.deviceCompanyId, otherParamCon, 1)
  },
  //方法：操作抽奖记录结果处理函数
  dowithOperateAwardRecord: function (dataList, tag, operateTag, errorInfo) {
    let that = this;
    switch (tag) {
      case 1:
        netFailCnt = 0;
        console.log("操作抽奖记录结果：");
        console.log(dataList);
        //operateTag：0插入记录，1修改记录
        switch (operateTag) {
          case 0:
            let id = 0, rechargeMinuteCnt = that.data.rechargeMinuteCnt;
            if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.resultMap)) {
              try {
                id = parseInt(dataList.resultMap.id);
                id = isNaN(id) ? 0 : id;
              } catch (err) { }
              if (rechargeMinuteCnt<=0){
                try {
                  rechargeMinuteCnt = parseInt(dataList.resultMap.duration);
                  rechargeMinuteCnt = isNaN(rechargeMinuteCnt) ? 0 : rechargeMinuteCnt;
                } catch (err) { }
              }
            }
            console.log("当前支付记录ID：" + id)
            
            let rechargeSum = that.data.rechargeSum;
            if (rechargeSum > 0) {
              //1、如果为付费支付则调起微信支付
              that.setData({
                ["rechargeRecordId"]: id,
              })
              that.getPrePayId(id);
            } else {
              //2、如果为免费支付则直接刷新获奖记录
              let remainTime = rechargeMinuteCnt * 60;
              //如果当前保存设备地址的APP公共变量“”不为空，则无须扫码操作
              that.setData({
                ["ReChargePop"]: false,
                ["isShowFinishAlertPop"]: false,
                ["isPayfor"]: 0,

                ["awardRecordId"]: id,
                ["remainTime"]: remainTime,

                ["rechargeRecordId"]: 0,
                ["workStat"]: 0,
                ["isStartQuickly"]: 1,
              })
              
              //按摩记录信息记载
              let allCash=0.00,idlist=id,pf=0;
              allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
              idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
      pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
              app.data.operateRecordItem = { id: id, mincnt: rechargeMinuteCnt, cash: allCash, pf: pf, tag: 0,idlist:idlist }
              that.transformRemainTime(remainTime);

              //产品要求立即启动
              console.log("CB51查询设备状态并立即启用----------------------------")
              console.log(app.data.operateRecordItem)
              //如果为正常启动则查询是否在用
              that.data.cb51StartTag = 1;
              isNewCheirapsis=true;
              that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
            }
            break;
          case 1:
            app.data.spareCheirapsisCnt = app.data.spareCheirapsisCnt > 0 ? app.data.spareCheirapsisCnt - 1 : app.data.spareCheirapsisCnt;
            if (that.data.cashDrawAward > 0.00) {
              app.insertWalletRecordByAward(that, that.data.cashDrawAward, app.data.operateRecordItem.idlist)
            }
            timeOutGetDrawAwardRecordList = setTimeout(function () {
              that.getPayRecordInfo(0, 1);
            }, 500);
            break;
        }

        break;
      default:
        that.data.isDowithing = false;
        netFailCnt++;
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取Banner失败！";
        switch (operateTag) {
          case 0:
            wx.showToast({
              title: "按摩记录插入失败！",
              icon: 'none',
              duration: 2000
            })
            break;
          case 1:
            break;
        }
        break;
    }
  },
  //事件：切换设备
  exchangeDeviceEvent: function (e) {
    let that = this, url = "";
    if (that.data.workStat == 1 || that.data.workStat == 2) {
      wx.showModal({
        title: '提示',
        content: '设备运行中禁止切换！',
        showCancel:false,
        confirmText:"知道了",
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
      return;
    }
    url = mainPackageUrl + "/scanCode/scanCode?login=1";
    that.data.operationTag = 1;
    console.log("exchangeDeviceEvent:" + url);
    wx.navigateTo({
      url: url
    });
  },
  //事件：选择设备服务类目事件
  onSelectCheirapsisSrvItemEvent: function (e) {
    let that = this, tag = 0, workStat = that.data.workStat, item = null, amount = 0.00, min = 0, index = -1;
    //如果剩余时间大于0并且设备运行中或暂停中则不能选择操作
    if (that.data.remainTime > 0 && (workStat == 1 || workStat == 2)) {
      wx.showToast({
        title: "设备运行中，不能操作！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) { }
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? -1 : index;
    } catch (e) { }
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      try {
        min = parseInt(item.duration);
        min = isNaN(min) ? 0 : min;
      } catch (e) { }
      //tag：0直接点击，1按摩完成提示窗点击
      switch (tag) {
        case 1:
          if (that.data.deviceId > 0 && app.data.agentDeviceStatus==0) {
            //如果为正常模式
            that.setData({
              ["curSelIndex"]: index,
              ["rechargeMinuteCnt"]: min,
            })
          } else {
            //如果为工厂测试模式
            that.setData({
              ["curSelIndex"]: index,
            })
          }
          break;
        default:
          try {
            amount = parseFloat(item.price);
            amount = isNaN(amount) ? 0.00 : amount;
          } catch (e) { }
          amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt))
          that.setData({
            ["curSelIndex"]: index,
            ["rechargeMinuteCnt"]: min,

            ["curSelRechargeItem"]: item,
            ["isShowFinishAlertPop"]: false,
            ["isPayfor"]: 0,
          })
          if (app.data.agentDeviceId > 0 && app.data.agentDeviceStatus==0) {
            if(amount>0){
              //1、付费按摩
              that.data.cb51StartTag = 3;
              that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
            }else{
              //2、免费按摩
              wx.showModal({
                title: '提示',
                content: "是否立即按摩？",
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.data.cb51StartTag = 3;
                    that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    //如果为免费测试服务类目
                    let remainTime = min * 60;
                    //如果当前保存设备地址的APP公共变量“”不为空，则无须扫码操作
                    that.setData({
                      ["awardRecordId"]: 0,
                      ["remainTime"]: remainTime,
                      ["workStat"]: 0,
                    })
                    that.transformRemainTime(remainTime);
                  }
                }
              })
            }
          } else {
            //如果为免费测试服务类目
            let remainTime = min * 60;
            //如果当前保存设备地址的APP公共变量“”不为空，则无须扫码操作
            that.setData({
              ["awardRecordId"]: 0,
              ["remainTime"]: remainTime,
              ["workStat"]: 0,
            })
            that.transformRemainTime(remainTime);
          }
          break;
      }

    } else {
      wx.showToast({
        title: "获取信息失败无法体验！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //方法：打开充值弹窗
  showReChargePop: function (productId, type, amount, minute, alert) {
    let that = this, rechargeSum = amount;
    that.data.rechargeType = type;
    that.setData({
      ["rechargeProductId"]: productId,
      ["rechargeAlert"]: alert,
      ["rechargeSum"]: amount,
      ["rechargeMinuteCnt"]: minute,
      // ["ReChargePop"]: true,
      // ["isPayfor"]: 0,
    })

    that.submitPayInfo(null);
  },
  //事件：关闭充值弹窗
  hideReChargePop: function (e) {
    this.setData({
      ReChargePop: false
    })
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
    // if (rechargeSum <= 0) {
    //   wx.showToast({
    //     title: "充值金额必须大于0！",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    that.data.isDowithing = true;
    //插入充值支付记录
    that.insertAwardAboutRecord(rechargeProductId, rechargeSum);
    //that.getPrePayId();
  },
  //方法：插入支付抽奖相关记录
  insertAwardAboutRecord: function (productId, rechargeSum) {
    let that = this, luckdraw_id = that.data.luckdraw_id, otherParamCon = "&xcxAppId=" + app.data.wxAppId, typeParam = productId <= 0 ? "&type=4" : "";
    otherParamCon += "&productid=" + productId + "&price=" + rechargeSum + typeParam + "&activityId=" + luckdraw_id + "&operation=add";
    otherParamCon += rechargeSum > 0.00 ? "" : "&payStatus=1&status=0";
    app.operateAwardRecord(that, otherParamCon, 0)
  },
  /////////////////////////////////////////////////////
  //----充值-------------------------------------------
  //方法：获取预支付ID
  getPrePayId: function (recordId) {
    var that = this, attach = "14_0_" + app.data.hotelId + "_3," + recordId, rechargeSum = that.data.rechargeSum;
    //体验版特别处理
    if (Utils.myTrim(app.data.version) != "online") {
      rechargeSum = 0.01;
    }
    app.getPrePayId0(that, attach, rechargeSum,app.data.sysName + "按摩服务");
  },

  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.data.isDowithing = false;
    try {
      wx.hideLoading()
    } catch (e) { }
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        netFailCnt = 0;
        that.setData({
          ["ReChargePop"]: false,
          ["isShowFinishAlertPop"]: false,
          ["isPayfor"]: 1,
        })
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;
        app.data.spareCheirapsisCnt = app.data.spareCheirapsisCnt + 1;
        console.log("支付发起成功！")
        break;

      default:
        netFailCnt++;
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },

  //方法：显示结束提示弹窗
  showFinishAlertPop: function (e) {
    let that = this;
    that.setData({
      ["isShowFinishAlertPop"]: true
    })
  },

  
  //4G模块控制
  //方法：4G指令发送方法
  //设备地址address  各种模式cmd  cmd对应的指令controlCmdType  时间time
  //isPushQueue:是否将指令插入队列
  sendDeviceCommand: function (address, cmd, controlCmdType, time, isPushQueue,num) {
    let that = this;
    that.setData({
      ["isSCmdOperating"]: true
    })
    app.sendDeviceCommandWebSocket(that, address, cmd, controlCmdType, time, isPushQueue,num)
    sendCmdTime = new Date();
  },
  //生成一个区间随机数  最大Max  最小Min
  getSequenceNumber: function (Min, Max) {
    var result = "";
    var Range = Max - Min;
    var Rand = Math.random();
    var sequenceNumber = Min + Math.round(Rand * Range); //四舍五入
    // }
    sequenceNumber++;
    console.log("获取一个随机数" + sequenceNumber)
    console.log("获取一个随机数16进制" + sequenceNumber.toString(16))
    result = sequenceNumber.toString(16);
    result = result.length > 2 ? result.substr(0, 2) : result;
    console.log("获取一个随机数16进制" + result)
    return result.toUpperCase();
  },
  //方法：设置是否同步时间状态
  setIfSyncTimeStat: function (tag) {
    let that = this;
    that.data.syncTimeStat = tag;
  },
  //定时器 同步时间
  syncDeviceTimeInterval: function () {
    var that = this, i = 0;
    app.data.timeInternelQueryDevice = setInterval(function () {
      if (i == 0 && that.data.syncTimeStat) {
        i++;
        if(that.data.isShowLog){
          console.log("Query......")
        } 
        
        //console.log("Work..." + allSecnds)

        if (that.data.allSecnds <= 60) {
          frequentness = 3;
        } else {
          //如果自上一次同步时间间隔超过60秒，则主动查询（有可能websocket断掉了）
          if (Math.abs(that.data.allSecnds - that.data.lastSyncRemainTime) > 60) {
            that.data.cb51StartTag = 4;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
          }
        }

        i = i >= frequentness ? 0 : i;
      } else {
        i++;
        i = i >= frequentness ? 0 : i;
        //console.log("No Work..." + that.data.allSecnds)
      }
      if (that.data.syncTimeStat) {
        if (that.data.allSecnds >= 0) {
          //【1】格式化剩余时间
          that.transformRemainTime(that.data.allSecnds);
          //【4】剩余时间大于0，而这时执行onShow事件
          if (that.data.isOnShow) {
            that.data.isOnShow = false;
            if(that.data.isShowLog){
              console.log("that.data.isOnShow Send CB51......")
            } 
            
            that.data.cb51StartTag = 4;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
          }
          if (app.data.isOnShowQueryCheirapsisTime) {
            app.data.isOnShowQueryCheirapsisTime = false;
            if(that.data.isShowLog){
              console.log("app.data.isOnShowQueryCheirapsisTime Send CB51......")
            } 
            
            that.data.cb51StartTag = 4;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
          }
          
          //【2】02款加热处理操作 
          if (that.data.deviceModelId == 2 && that.data.softVersion==0){
            let setHotDegreeObj = that.data.setHotDegreeObj, remainHotTime = that.data.remainHotTime;
            if (Utils.isNotNull(setHotDegreeObj) && Utils.isNotNull(setHotDegreeObj.selHDItem) && setHotDegreeObj.isSetHotDegree == 1 && setHotDegreeObj.selHDItem.closeTime > 0 && that.data.cb62StartTag==0){
              if (remainHotTime==0){
                switch (that.data.isHot){
                  case 1:
                    //不加热
                    that.data.cb62StartTag = 1;
                    that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", "00", null, true, null);
                    break;
                  case 0:
                    //加热
                    that.data.cb62StartTag=1;
                    that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", "01", null, true, null);
                    break;
                }
              }else{
                that.data.remainHotTime--;
              }
            }
          }

          //【3】剩余时间小于2秒时发送查询设备状态指令
          if (that.data.allSecnds <= 2) {            
            if(that.data.isShowLog){
              console.log("Send CB51......")
            } 
            that.data.cb51StartTag = 4;
            that.sendDeviceCommand(app.data.agentDeviceAddress, "CB51", "", null, true, null);
          }
          
          //【5】剩余时间为0时清除同步处理标志
          if (that.data.allSecnds == 0) {
            that.setIfSyncTimeStat(false);
          }
        } else {
          if (that.data.syncTimeStat) that.setIfSyncTimeStat(false);
          if (that.data.workStat == 1 || that.data.workStat == 2) {
            that.setData({
              ["workStat"]: 3,
            })
          }
        }
      }
      if (that.data.allSecnds >= 0){
        that.data.allSecnds--;
        if(that.data.isShowLog){
          console.log("【本地时间-设备时间】：" + that.data.allSecnds + "-" + that.data.remainTime + "  /" + frequentness + "   加热：" + that.data.remainHotTime+"("+that.data.isHot+")")
        }        
      } 

      //如果有指令未处理则进行重发处理
      // let socketMsgQueue = that.data.socketMsgQueue,internalCnt=0,dtNow=new Date();
      // if (Utils.isNotNull(socketMsgQueue) && socketMsgQueue.length > 0) {
      //   let allLen = socketMsgQueue.length-1;
      //   //倒叙处理，便于删除数组元素
      //   for (let i = allLen; i >= 0; i--) {
      //     //重试超过5次的指令不再执行
      //     if (socketMsgQueue[i].reTryCnt > 3) {
      //       socketMsgQueue.splice(i, 1);
      //       console.log("指令队列操作：删除重试次数超过5次的指令(" + socketMsgQueue.length + ")")
      //       try {
      //         wx.hideLoading()
      //       } catch (e) { }
      //     }else{
      //       internalCnt = Utils.getTimesByDateTime(socketMsgQueue[i].dateTime,dtNow,3);
      //       if (internalCnt>3){
      //         socketMsgQueue[i].reTryCnt = socketMsgQueue[i].reTryCnt+1;
      //         console.log("指令队列操作：重试失败指令(" + socketMsgQueue.length + ")——")
      //         console.log(socketMsgQueue[i])
      //         that.sendDeviceCommand(app.data.agentDeviceAddress, socketMsgQueue[i].cmdObj.cmd, socketMsgQueue[i].cmdObj.cmdType, socketMsgQueue[i].time, false, socketMsgQueue[i].cmdObj.num);
      //       }
      //     }
      //   }
      //   that.data.socketMsgQueue = socketMsgQueue;
      // }
    }, 1000 * 1);
  },
  //时间转换时分秒
  transformRemainTime: function (time) {
    let that = this;
    let sumSeconds = parseInt(time);
    let hours = parseInt(sumSeconds / 60 / 60);
    let minutes = parseInt(sumSeconds / 60 % 60);
    let seconds = parseInt(sumSeconds % 60);
    minutes = seconds > 0 ? minutes + 1 : minutes;
    that.setData({
      ["remainTimeHours"]: hours >= 10 ? hours : "0" + hours,
      ["remainTimeMinutes"]: minutes >= 10 ? minutes : (minutes <= 0 ? minutes : "0" + minutes),
      ["remainTimeSeconds"]: seconds >= 10 ? seconds : "0" + seconds
    })
  },
  twinklet() {
    let that = this;
    that.setData({
      twinklet: false
    })
    setTimeout(function () {
      that.setData({
        twinklet: true
      })
    }, 4000)
  },
  //事件：点击
  slbindchange(e) {
    let that = this, setHotDegreeObj = that.data.setHotDegreeObj, selHDItem = null, hotDegreeList = that.data.hotDegreeList, remainHotTime = that.data.remainHotTime, isHot = that.data.isHot;
    let sitysix=0,sity = e.currentTarget.dataset.num,oldCmdNum=0;

    oldCmdNum=Utils.isNotNull(setHotDegreeObj) && Utils.isNotNull(setHotDegreeObj.selHDItem)?setHotDegreeObj.selHDItem.thermal:oldCmdNum;
    
    switch (parseInt(sity)) {
      // case 20:
      //   sitysix=0;
      //   break;
      case 60:
        sitysix = 0;
        break;
      // case 40:
      //   sitysix = 0;
      //   break;
      case 80:
        sitysix = 50;
        break;
      case 100:
        sitysix = 100;
        break;
    }
    if (Utils.isNotNull(hotDegreeList) && hotDegreeList.length>0){
      for (let i = 0; i < hotDegreeList.length;i++){
        if (hotDegreeList[i].id==sitysix){
          selHDItem = hotDegreeList[i];break;
        }
      }
    }
    setHotDegreeObj.selHDItem = selHDItem;
    remainHotTime = Utils.isNotNull(selHDItem) ? (isHot == 1 ? selHDItem.openTime : selHDItem.closeTime):remainHotTime;
    that.setData({
      ["sitysix"]: sitysix,
      ["thermal"]: sity,

      ["setHotDegreeObj"]: setHotDegreeObj,
      ["remainHotTime"]: remainHotTime,
    })
    switch(that.data.softVersion){      
      case 0:
        app.setCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId, setHotDegreeObj);
        break;
      default:
        if(setHotDegreeObj.isSetHotDegree!=0 && sity!=oldCmdNum){
          let cmdctrltype=sity.toString(16).toUpperCase();
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", cmdctrltype, null, true, null);
        }
        break;
    }
  },
  //事件：拖动
  sliderchange(e) {
    let that = this, setHotDegreeObj = that.data.setHotDegreeObj, selHDItem = null, hotDegreeList = that.data.hotDegreeList, remainHotTime = that.data.remainHotTime, isHot = that.data.isHot;
    let sitysix = 0,sity = 0,oldCmdNum=0;

    oldCmdNum=Utils.isNotNull(setHotDegreeObj) && Utils.isNotNull(setHotDegreeObj.selHDItem)?setHotDegreeObj.selHDItem.thermal:oldCmdNum;
    try{
      sity = parseInt(e.detail.value);
      sity=isNaN(sity)?60:sity;
    }catch(e){}

    switch (sity) {
      // case 20:
      //   sitysix = 0;
      //   break;
      // case 40:
      //   sitysix = 0;
      //   break;
      case 60:
        sitysix = 0;
        break;
      case 80:
        sitysix = 50;
        break;
      case 100:
        sitysix = 100;
        break;
    }
    if (Utils.isNotNull(hotDegreeList) && hotDegreeList.length > 0) {
      for (let i = 0; i < hotDegreeList.length; i++) {
        if (hotDegreeList[i].id == sitysix) {
          selHDItem = hotDegreeList[i]; break;
        }
      }
    }
    setHotDegreeObj.selHDItem = selHDItem;
    remainHotTime = Utils.isNotNull(selHDItem) ? (isHot == 1 ? selHDItem.openTime : selHDItem.closeTime) : remainHotTime;
    that.setData({
      ["sitysix"]: sitysix,
      ["thermal"]: sity,

      ["setHotDegreeObj"]: setHotDegreeObj,
      ["remainHotTime"]: remainHotTime,
    })
    switch(that.data.softVersion){
      case 0:
        app.setCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId, setHotDegreeObj);
        break;
      default:
        if(setHotDegreeObj.isSetHotDegree!=0 && sity!=oldCmdNum){
          let cmdctrltype=sity.toString(16).toUpperCase();
          that.sendDeviceCommand(app.data.agentDeviceAddress, "CB62", cmdctrltype, null, true, null);
        }
        break;
    }
  },
  gotoPage: function (e) {
    //pagetype：0普通页面，1tabbar页面
    //package：包名简写
    //pagename：页面名称
    let that = this, pagetype = 0, isCheckAuditStat = 0, packageName = e.currentTarget.dataset.package, pagename = e.currentTarget.dataset.page, url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) { }

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },
  onchangeExplain() {
    this.setData({
      explaintype: !this.data.explaintype
    })
  },
  onchangeroof() {
    this.setData({
      roof: !this.data.roof
    })
  },
  //方法：设置02款加热开始
  setHotDegreeStart: function (cmd, isHot,shajun, cb62StartTag){
    let that = this, deviceModelId = that.data.deviceModelId, setHotDegreeObj = that.data.setHotDegreeObj, sitysix = that.data.sitysix;
    if (deviceModelId==2){
      switch(that.data.softVersion){
        //02款
        case 0:
          let isSetHotDegree = 0, selHDItem = null, cacheObj = null, remainHotTime = 0;
          switch(cmd){
            //控制指令操作
            case "CB60":
            case "CB62":
              if (cb62StartTag == 0 || cmd =="CB60") {
                //按钮加热控制操作
                if(cmd=="CB60"){
                  setHotDegreeObj = { isSetHotDegree: isHot, selHDItem: isHot == 1 ? that.data.hotDegreeList[1] : null }
                }else{
                  setHotDegreeObj = { isSetHotDegree: isHot, selHDItem: isHot == 1 ? that.data.hotDegreeList[2] : null }
                }
                
                sitysix = isHot == 1 ? that.data.hotDegreeList[1].id:0;
              }else{
                //倒计时加热控制操作
                try {
                  setHotDegreeObj = app.getCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId);
                } catch (e) { }
                // console.log("倒计时加热控制——")
                // console.log("缓存——")
                // console.log(setHotDegreeObj)
                // console.log("data——")
                // console.log(that.data.setHotDegreeObj)
                if (Utils.isNull(setHotDegreeObj)) {
                  setHotDegreeObj = Utils.isNull(that.data.setHotDegreeObj) ? { isSetHotDegree: isHot, selHDItem: isHot == 1 ? that.data.hotDegreeList[2] : null } : that.data.setHotDegreeObj;
                }
                // console.log("最终——")
                // console.log(setHotDegreeObj)
              }
              break;
            //查询指令操作
            default:
              try {
                setHotDegreeObj = app.getCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId);
              } catch (e) { }
              if (Utils.isNull(setHotDegreeObj)){
                console.log("没有缓存加热状态。。。。。。")
                setHotDegreeObj = Utils.isNull(that.data.setHotDegreeObj) ? { isSetHotDegree: isHot, selHDItem: isHot == 1 ? that.data.hotDegreeList[2] : null } : that.data.setHotDegreeObj;
              }
              break;
          }
          if (setHotDegreeObj.isSetHotDegree == 1) {
            remainHotTime = that.data.remainHotTime;
            remainHotTime = remainHotTime > 0 ? remainHotTime : (isHot == 1 ? setHotDegreeObj.selHDItem.openTime : setHotDegreeObj.selHDItem.closeTime);
            sitysix = setHotDegreeObj.selHDItem.id;
          }
          that.setData({
            ["remainHotTime"]: remainHotTime,
            ["setHotDegreeObj"]: setHotDegreeObj,

            ["sitysix"]: sitysix,
            ["thermal"]: Utils.isNotNull(setHotDegreeObj.selHDItem) ? setHotDegreeObj.selHDItem.thermal:(sitysix==0?20:0),
          })
          app.setCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId, setHotDegreeObj);
          console.log("setHotDegreeObj")
          console.log(setHotDegreeObj)
          break;
        //09以上款
        default:
          if(isHot==1){
            let sindex = 0,hdItem=null;
            for(let i=0;i<that.data.hotDegreeList.length;i++){
              hdItem=null;hdItem=that.data.hotDegreeList[i];
              if(shajun<hdItem.thermal){
                break;
              }else{
                sindex=i;
              }
            }
            setHotDegreeObj = { isSetHotDegree: isHot, selHDItem: that.data.hotDegreeList[sindex] }
            that.setData({
              ["setHotDegreeObj"]:setHotDegreeObj,
  
              ["sitysix"]: that.data.hotDegreeList[sindex].sitysix,
              ["thermal"]: that.data.hotDegreeList[sindex].thermal,
            })
          }else{
            if(Utils.isNotNull(setHotDegreeObj)){
              setHotDegreeObj.isSetHotDegree=isHot;
            }else{
              setHotDegreeObj = { isSetHotDegree: isHot, selHDItem: null }
            }
            that.setData({
              ["setHotDegreeObj"]:setHotDegreeObj,
            })
          }
          break;
      }
      
    }
    that.data.cb62StartTag = 0;
  },
  //方法：设置02款加热结束
  setHotDegreeEnd: function () {
    let that = this, deviceModelId = that.data.deviceModelId, setHotDegreeObj = that.data.setHotDegreeObj;
    if (deviceModelId == 2) {
      setHotDegreeObj = { isSetHotDegree: 0, selHDItem: null }
      app.clearCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId);

      that.setData({
        ["remainHotTime"]: 0,
        ["setHotDegreeObj"]: setHotDegreeObj,

        ["sitysix"]:0,
        ["thermal"]:20,
      })
    }
  },
  //事件：确定按摩提示弹窗
  sureCheirapsisAlert: function (e) {
    let that = this, url = "";
    url = packYKPageUrl + "/Myprize/Myprize";
    console.log("sureCheirapsisAlert:" + url);
    wx.navigateTo({
      url: url
    });
  },

  //
  // setSynthesizeParameter:function(hot,mode){
  //   let that=this,setSParamObj=null;
  //   try {
  //     setHotDegreeObj = app.getCacheValue("cwhd-selhdtagobj-" + app.data.version + "-" + app.data.wxAppId);
  //   } catch (e) { }
  // },
})
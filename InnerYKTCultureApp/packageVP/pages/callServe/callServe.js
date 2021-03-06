// packageVP/pages/callServe/callServe.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var defaultProImg = "noimg.png", lastSort = 0, saveProData = [], patchCnt = 8;
var URL = app.getUrlAndKey.url,SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,timeInternelQueryDelay =null,sOptions=null;
var pageSize = app.data.pageSize, mainPackageDir = "../../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,          //资源地址前缀
    isDowithing:false,         //提交是否正在操作
    agentPutAddress: app.data.agentPutAddress,
    otherQuestion:"",          //其他问题

    selMainTypeIndex:-1,       //所选问题大类

    normalQuestionList:[
      {id:1,mainType:"设备问题",questionList:[
        {id:1,content:"不清楚如何启动按摩器",checked:false},
        {id:2,content:"按摩器无法启动",checked:false},
        {id:3,content:"按摩功能控制不灵敏",checked:false},
        {id:4,content:"没有脚套",checked:false},
      ]},
      {id:2,mainType:"点单问题",questionList:[
        {id:1,content:"催单",checked:false},
        {id:2,content:"送单错误",checked:false},
        {id:3,content:"无法按摩",checked:false},
      ]},
      {id:3,mainType:"按摩劵问题",questionList:[
        {id:1,content:"按摩券使用不了",checked:false},
      ]}
    ],
    isDelayEnable:true,       //是否延迟
    lastSecond:0,             //延迟秒数
    srcOption:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.data.srcOption=options;
    that.dowithParam(options);
  },
  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this,paramShareUId = 0,isScene = false,dOptions = null;
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
    } catch (e) {}
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
    var that = this,
      isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        this.setData({
          ["agentPutAddress"]: app.data.agentPutAddress,
        })
        that.getNormalQuestion();
        that.checkDelayEnable();
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
    let that=this;

    that.checkDelayEnable();
  },
  //方法：查询常规问题
  getNormalQuestion: function () {
    var that = this,otherParams="&mold=4&companyId="+app.data.companyId;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=product_custservice&action=QueryService&appId=" + app.data.appid + "&timestamp=" + timestamp+"&userId=0";
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('获取常规问题:'+SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log("获取常规问题结果：")
        console.log(res.data)
        if (res.data.rspCode == 0) {
          let normalQuestionList=[];
          if(Utils.isNotNull(res.data.data) && res.data.data.length>0){
            let data = res.data.data, dataItem = null, listItem = null;
            let mainId=0,detailId=0, mainType="",questionList=[],questionListStr="",tempArray=null;
            for(let i=0;i<data.length;i++){
              dataItem = null; listItem = null;dataItem=data[i];
              mainType="";questionList=[];questionListStr="";tempArray=null;
              if (Utils.isDBNotNull(dataItem.title)){
                mainType = dataItem.title;
              }
              if (Utils.isDBNotNull(dataItem.reason)){
                questionListStr = dataItem.reason;
              }
              if(Utils.myTrim(questionListStr) != ""){
                tempArray=questionListStr.split("|");
                if(Utils.isNotNull(tempArray) && tempArray.length>0){
                  for(let j=0;j<tempArray.length;j++){
                    detailId++;
                    questionList.push({id:detailId,content:tempArray[j],checked:false});
                  }
                }
              }
              if(questionList.length>0){
                mainId++;
                normalQuestionList.push({id:mainId,mainType:mainType,questionList:questionList})
              }
            }
          }
          if(normalQuestionList.length>0){
            that.setData({
              ["normalQuestionList"]: normalQuestionList,
            })
          } 
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取常规问题：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取常规问题接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取常规问题接口调用失败：出错：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  //方法：保存提交问题
  saveCallQuestion: function (dataItemList) {
    var that = this,postData=null;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=product_custservice&action=SaveService&appId=" + app.data.appid + "&timestamp=" + timestamp+"&userId=" + appUserInfo.userId;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log('问题反馈:'+SMURL + urlParam)
    console.log(JSON.stringify(dataItemList))
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      method: "POST",

      data: {
        data: JSON.stringify(dataItemList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("问题反馈结果：")
        console.log(res.data)
        that.data.isDowithing=false;
        if (res.data.rspCode == 0) {
          wx.showModal({
            title: '提示',
            content: '呼叫成功，稍等片刻，店员看到后会马上赶来',
            showCancel:false,
            confirmText:"我知道了",
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.clearDataInfo();
                that.setDelayEnable();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "问题反馈：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isDowithing=false;
        wx.showToast({
          title: "问题反馈接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "问题反馈接口调用失败：出错：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  //方法：选择问题操作
  selectQuestionOperation:function(mainIndex,detailIndex){
    let that=this,normalQuestionList=that.data.normalQuestionList,otherQuestion=that.data.otherQuestion,isInput=false;
    if(Utils.isNotNull(normalQuestionList) && normalQuestionList.length>0){
      let mainData=null,detailData=null;
      if(mainIndex<0){
        isInput=true;
        //清空常规问题
        for(let i=0;i<normalQuestionList.length;i++){
          mainData=null;mainData=normalQuestionList[i];
          if(Utils.isNotNull(mainData.questionList) && mainData.questionList.length>0){
            for(let j=0;j<mainData.questionList.length;j++){
              detailData=null;detailData=mainData.questionList[j]
              detailData.checked=false;
            }
          }
        }
      }else if(mainIndex>=0 && detailIndex>=0){
        for(let i=0;i<normalQuestionList.length;i++){
          mainData=null;mainData=normalQuestionList[i];
          if(i==mainIndex){
            //当前选中大类
            if(Utils.isNotNull(mainData.questionList) && mainData.questionList.length>0){
              for(let j=0;j<mainData.questionList.length;j++){
                detailData=null;detailData=mainData.questionList[j];
                if(j==detailIndex){
                  detailData.checked=false;
                  detailData.checked=!detailData.checked;
                }else{
                  detailData.checked=false;
                }
              }
            }
          }else{
            //非当前选中大类
            if(Utils.isNotNull(mainData.questionList) && mainData.questionList.length>0){
              for(let j=0;j<mainData.questionList.length;j++){
                detailData=null;detailData=mainData.questionList[j];
                detailData.checked=false;
              }
            }
          }
        }
      }
      
    }
    that.setData({
      ["normalQuestionList"]: normalQuestionList,
      ["otherQuestion"]:isInput?otherQuestion:"",
      ["selMainTypeIndex"]:mainIndex,
    })
  },
  //方法：清空呼叫信息
  clearDataInfo:function(){
    let that=this,normalQuestionList=that.data.normalQuestionList;
    if(Utils.isNotNull(normalQuestionList) && normalQuestionList.length>0){
      let mainData=null,detailData=null;
      for(let i=0;i<normalQuestionList.length;i++){
        mainData=null;mainData=normalQuestionList[i];
        if(Utils.isNotNull(mainData.questionList) && mainData.questionList.length>0){
          for(let j=0;j<mainData.questionList.length;j++){
            detailData=null;detailData=mainData.questionList[j]
            if(detailData.checked){
              detailData.checked=false;
            }
          }
        }
      }
    }
    that.setData({
      ["normalQuestionList"]: normalQuestionList,
      ["otherQuestion"]:"",
    })
  },
  //方法：设置提交后呼叫按钮可用时间
  setDelayEnable:function(){
    let that=this,dtNow=new Date(),dtTime=Utils.getDateTimeAddMunites(dtNow,1);
    console.log(Utils.getDateTimeStr(dtNow,"/",true)+" ~ "+Utils.getDateTimeStr(dtTime,"/",true))
    app.setCacheValue("SetCallSrvDelayTime"+"_"+app.data.wxAppId+"_"+app.data.version,Utils.getDateTimeStr(dtTime,"/",true));
    timeInternelQueryDelay=setInterval(that.checkDelayEnable, 1000 * 1);
  },
  //方法：检测呼叫按钮是否可用
  checkDelayEnable:function(){
    let that=this,dtNow=new Date(),dtTime=null,dtObj=null,isDelayEnable=true,lastSecond=0;
    try{
      dtObj=app.getCacheValue("SetCallSrvDelayTime"+"_"+app.data.wxAppId+"_"+app.data.version);
      if(Utils.isNotNull(dtObj)){
        try {
          dtTime = new Date(Date.parse(dtObj))
        } catch (e) {}
      }
      if(dtNow<dtTime){
        isDelayEnable=false;
        lastSecond=Utils.getTimesByDateTime(dtNow,dtTime,3);
      }
    }catch(e){}

    that.setData({
      ["isDelayEnable"]: isDelayEnable,
      ["lastSecond"]:lastSecond,
    })
    if(isDelayEnable){
      try{
        if (timeInternelQueryDelay != null && timeInternelQueryDelay != undefined) clearInterval(timeInternelQueryDelay);
      }catch(e){}
    }else{
      if(!isDelayEnable && !Utils.isNotNull(timeInternelQueryDelay)){
        timeInternelQueryDelay=setInterval(that.checkDelayEnable, 1000 * 1);
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try{
      if (timeInternelQueryDelay != null && timeInternelQueryDelay != undefined){
        clearInterval(timeInternelQueryDelay);
        timeInternelQueryDelay=null;
      } 
    }catch(e){}
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try{
      if (timeInternelQueryDelay != null && timeInternelQueryDelay != undefined){
        clearInterval(timeInternelQueryDelay);
        timeInternelQueryDelay=null;
      } 
    }catch(e){}
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
      case "agentPutAddress":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "agentPutAddress";
        that.setData({
          [setKey]: value
        })
        break;
      //otherQuestion
      case "oquestion":
        if (Utils.checkStrNoPunc(value)) {
          wx.showToast({
            title: "非法字符不能输入！",
            icon: 'none',
          })
          return;
        }
        setKey = "otherQuestion";
        that.setData({
          [setKey]: value
        })
        that.selectQuestionOperation(-1,0);
        break;
    }
  },
  //方法：扫码切换座位号
  scanSitePosition:function(){
    let that=this;
    app.data.curPageDataOptions={
      package:"packageVP",page:"/pages/callServe/callServe",options: that.data.srcOption,
    }
    wx.redirectTo({
      url: '/pages/scanCode/scanCode?login=2&alt='+encodeURIComponent("请扫码确定座位号")
    })
  },
  //事件：选择常见问题
  selsectNormalQuestion:function(e){
    let that=this,normalQuestionList=that.data.normalQuestionList,setKey="",mindex=0,dindex=0,checked=false;
    try {
      mindex = parseInt(e.currentTarget.dataset.mindex);
      mindex = isNaN(mindex) ? -1 : mindex;
    } catch (e) {}
    try {
      dindex = parseInt(e.currentTarget.dataset.dindex);
      dindex = isNaN(dindex) ? -1 : dindex;
    } catch (e) {}
    that.selectQuestionOperation(mindex,dindex);
  },
  //事件：呼叫店员
  submitMyQuestion:function(e){
    let that=this,agentPutAddress=that.data.agentPutAddress,otherQuestion=that.data.otherQuestion,normalQuestionList=that.data.normalQuestionList,isDelayEnable=that.data.isDelayEnable;
    if(!isDelayEnable){
      // wx.showModal({
      //   title: '提示',
      //   content: '呼叫不能频繁操作，只能间隔一分钟后使用！',
      //   showCancel:false,
      //   confirmText:"知道了",
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //       that.clearDataInfo();
      //       that.setDelayEnable();
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      return;
    }
    if(Utils.myTrim(agentPutAddress)=="" && appUserInfo.userId!=732){
      wx.showModal({
        title: '提示',
        content: '您需要添加座位信息，才能进行呼叫处理！',
        cancelText:"取消",
        confirmText:"添加座位",
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              ["isSetSitePosition"]: true,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    if(that.data.isDowithing){
      wx.showToast({
        title: "提交操作中......",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let allQuestion=otherQuestion,questionTitle="其他问题",selMainTypeIndex=that.data.selMainTypeIndex;
    if(selMainTypeIndex>=0){
      allQuestion="";
      if(Utils.isNotNull(normalQuestionList) && normalQuestionList.length>0){
        let mainData=null,detailData=null;
        try{
          mainData=normalQuestionList[selMainTypeIndex];
          questionTitle=mainData.mainType;
          if(Utils.isNotNull(mainData.questionList) && mainData.questionList.length>0){
            for(let j=0;j<mainData.questionList.length;j++){
              detailData=null;detailData=mainData.questionList[j]
              if(detailData.checked && Utils.myTrim(detailData.content) != ""){
                allQuestion=detailData.content;break;
              }
            }
          }
        }catch(e){}
      }
    }
    if(Utils.myTrim(allQuestion)==""){
      wx.showToast({
        title: "问题不能为空！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    console.log("呼叫问题：")
    console.log(allQuestion);
    let questionDataItem={
    companyId: app.data.companyId,
    orderId: "",
    mold: 3,
    mobile: appUserInfo.userMobile,
    userId:appUserInfo.userId,
    create_by: appUserInfo.userName,
    status: 0,
    title: questionTitle,
    reason: allQuestion,
    place: agentPutAddress,
    description: "",
    photos: "",
    sellerRemarks: "",
    remarks:"" }
    let questionDataList=[];
    questionDataList.push(questionDataItem);
    that.data.isDowithing=true;
    that.saveCallQuestion(questionDataList);
  },
  //事件：跳转页面
  gotoCommonPage:function(e){
    app.gotoCommonPageEvent(this,e);
  },
})
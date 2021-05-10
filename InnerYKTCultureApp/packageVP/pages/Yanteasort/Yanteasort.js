// packageVP/pages/Yanteasort/Yanteasort.js
const app = getApp();
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null,pageSize = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,    
    isLoad: false,             //是否已经加载
    isForbidRefresh: false,    //是否禁止刷新

    curLevelId:0,              //当前用户等级ID

    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1500,
    num:1
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    
    that.dowithParam(options);
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, isScene = false, dOptions = null;
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
        console.log('=========onload============');
        let curLevelId=0;
        if (Utils.isNotNull(sOptions.id)) {
          try {
            curLevelId = parseInt(sOptions.id);
            curLevelId = isNaN(curLevelId) ? 0 : curLevelId;
          } catch (e) {}
        }
        that.setData({
          ["curLevelId"]:curLevelId,
        })
        //获取等级
        that.getSysLevelInfoList();
        //获取排名
        that.getSysLevelRankingList();
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
  moveServerProSwiper:function(e){
    var that=this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  //方法：获取数据列表
  getSysLevelInfoList: function () {
    var that = this,otherParams="&companyId="+app.data.companyId;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_imagegreat&action=imagegreatList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('获取文创大师等级：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取文创大师等级结果')
        console.log(res.data)
        that.data.isLoad = true;
        
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.dataList)) {
          var data = res.data.data.dataList, dataItem = null, listItem = null, sysLevelList = [];
          var id = 0, photos = "",name=0, num = 0,money=0.00,invalid=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; photos = "";name=""; num = 0;money=0.00;invalid=0;
            dataItem = null; listItem = null; dataItem = data[i];
            id = dataItem.id;
            if (Utils.isDBNotNull(dataItem.photos)) {
              try {
                photos = Utils.myTrim(dataItem.photos)
              } catch (e) {}
            }
            if (Utils.isDBNotNull(dataItem.name)) {
              try {
                name = Utils.myTrim(dataItem.name)
              } catch (e) {}
            }
                  
            if (Utils.isDBNotNull(dataItem.money)){
              try{
                money = parseFloat(dataItem.money);
                money = isNaN(money) ? 0.00 : money;
                money=parseFloat((money).toFixed(app.data.limitQPDecCnt));
              }catch(e){}
            }   
            if (Utils.isDBNotNull(dataItem.num))
            {
              try{
                num = parseInt(dataItem.num);
                num = isNaN(num) ? 0 : num;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.invalid))
            {
              try{
                invalid = parseInt(dataItem.invalid);
                invalid = isNaN(num) ? 0 : invalid;
              }catch(e){}
            }
            if(invalid!=0)continue;
            listItem = {
              id : id, photos : photos,name:name, num : num,money:money,invalid:invalid,
            }
            sysLevelList.push(listItem);
          }

          that.setData({
            ["sysLevelList"]:sysLevelList,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取文创大师等级：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.showToast({
          title: "获取文创大师等级调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取文创大师等级接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：获取数据排名列表
  getSysLevelRankingList: function () {
    var that = this,otherParams="&companyId="+app.data.companyId;
    var timestamp = Date.parse(new Date()), urlParam = "", sign = "";
    timestamp = timestamp / 1000;
    urlParam = "cls=main_myUsedImage&action=ImageSortList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + otherParams + "&sign=" + sign;
    console.log('获取文创大师排名：'+URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取文创大师排名结果')
        console.log(res.data)
        
        if (res.data.rspCode == 0 && Utils.isNotNull(res.data.data) && Utils.isNotNull(res.data.data.sortMap)) {
          var data = res.data.data.sortMap, dataItem = null, listItem = null, rankingList = [];
          var id = 0, photos = "",name=0, userId = 0,count=0;
          for (var i = 0; i < data.length; i++) {
            id = 0; photos = "";name=""; userId = 0;count=0;
            dataItem = null; listItem = null; dataItem = data[i];
            id =Utils.isDBNotNull(dataItem.id)? dataItem.id:i;
            if (Utils.isDBNotNull(dataItem.headerImg)) {
              try {
                photos = Utils.myTrim(dataItem.headerImg)
              } catch (e) {}
            }
            if (Utils.isDBNotNull(dataItem.count)) {
              try {
                name = Utils.myTrim(dataItem.count)
              } catch (e) {}
            }
                  
            if (Utils.isDBNotNull(dataItem.count))
            {
              try{
                count = parseInt(dataItem.count);
                count = isNaN(count) ? 0 : count;
              }catch(e){}
            }
            if (Utils.isDBNotNull(dataItem.userId))
            {
              try{
                userId = parseInt(dataItem.userId);
                userId = isNaN(userId) ? 0 : userId;
              }catch(e){}
            }
            if(userId<=0)continue;
            listItem = {
              id : id, photos : photos,name:name, count : count,userId:userId,
            }
            rankingList.push(listItem);
          }

          that.setData({
            ["rankingList"]:rankingList,
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取文创大师排名：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.showToast({
          title: "获取文创大师排名调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取文创大师排名接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
})
// pages/MyCompany/MyCompany.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //会员服务限制信息对象
    srvRightData: null,      //服务权限信息对象
    isPassSrvRight: false,   //是否服务权限是否通过
    DataURL: DataURL,
    isForbidRefresh: false,     //是否禁止刷新

    currentData: 0,
    receptionpop: false,
    companyInfo:[], //公司资料列表
    companySendOrReceInfo:[], //公司已发送或已接收资料列表
    userVersion:true // true: 个人版，false：加入企业版的个人
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    console.log("获取当前index")
    that.setData({
      currentData: e.detail.current
    })
    if (e.detail.current == 0){
      that.queryCompanyInfo()
    } else if (e.detail.current == 1) {
      that.queryCompanySendOrReceiveInfo(2);
    } else if (e.detail.current == 2) {
      that.queryCompanySendOrReceiveInfo(1);
    }
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    console.log("点击切换")
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight - 36
        });
      }
    })
    if (app.globalData.companyUserMap.length > 0 && app.globalData.userTotalInfo.companyType == 1) { //加入企业版的个人
      that.setData({
        userVersion: false
      })
    }
  },
  onShow:function(){
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      return;
    } else {
      //如果非禁止页面刷新
      if (!that.data.isForbidRefresh) {
        if (that.data.currentData == 0) {
          that.queryCompanyInfo()
        } else if (that.data.currentData == 1) {
          that.queryCompanySendOrReceiveInfo(2);
        } else if (that.data.currentData == 2) {
          that.queryCompanySendOrReceiveInfo(1);
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  queryCompanyInfo:function(){
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
  
 
    var urlParam = "cls=main_companyInfo&action=companyInfoList&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);                                                                                                                                                                                                                                                                          
    urlParam = urlParam + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("所有公司资料",res);
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          var companyFile = "";
          var companyFileArr = []
          for(let i = 0; i < data.length; i ++){
             companyFile = data[i].companyFile;
             companyFileArr = []
            if (!Utils.isNull(companyFile)) {
              companyFileArr = companyFile.split(',');
              data[i].companyFile = companyFileArr;
            }else{
              data[i].companyFile = [];
            }
          }
          that.setData({
            companyInfo: data
          })
          console.log("处理数据：",data)
        } else {
          app.setErrorMsg2(that, "查询公司管理信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '数据查询失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "保存给我回复的名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询已发送or已收到记录
  queryCompanySendOrReceiveInfo:function(type){
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var shareType = 2; //已收
    if(type == 1){ //已发
      shareType = 1;
    }
    var urlParam = "cls=main_shareCompanyInfo&action=shareCompanyInfoList&shareType=" + shareType+"&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var dataList = res.data.data.dataList;
          var userList = [];
          // var userList = res.data.data.userList;
          var companyFile = "";
          var companyFileArr = []
          for (let i = 0; i < dataList.length; i++) {
            companyFile = dataList[i].companyFile;
            companyFileArr = []
            if (!Utils.isNull(companyFile)) {
              companyFileArr = companyFile.split(',');
              dataList[i].companyFile = companyFileArr;
            }else{
              dataList[i].companyFile = [];
            }
          }
          if(type == 1){
            console.log("已发送数据:", dataList)
          that.setData({
            companySendOrReceInfo: dataList,
          })
          }else if(type == 2){
            console.log("已收数据:", dataList)
            that.setData({
              companySendOrReceInfo: dataList
            })
          }
        } else {
          app.setErrorMsg2(that, "查询发送or收到公司资料失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '查询失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询发送or收到公司资料失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查询已发送 接收人信息
  showreceptionpop:function(e){
    var sendIndex = e.currentTarget.dataset.index;
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_shareCompanyInfo&action=recShareCompanyInfoList&shareType=2&userId=" + app.globalData.userTotalInfo.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + that.data.companySendOrReceInfo[sendIndex].batch + "&companyInfoId=" + that.data.companySendOrReceInfo[sendIndex].id + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询已发送 接收人信息',res)
        if (res.data.rspCode == 0) {
          var dataList = res.data.data.dataList;
          if (dataList.length == 0){
            wx.showToast({
              title: '暂时没有人查看您发送的公司资料',
              icon: 'none',
              duration: 1500
            })
            return;
          }else{
            that.setData({
              receptionpop: true,
              receiverList: dataList
            })
          }
          // var companyFile = "";
          // var companyFileArr = []
          // for (let i = 0; i < dataList.length; i++) {
          //   companyFile = dataList[i].companyFile;
          //   companyFileArr = []
          //   if (!Utils.isNull(companyFile)) {
          //     companyFileArr = companyFile.split(',');
          //     dataList[i].companyFile = companyFileArr;
          //   }else{
          //     dataList[i].companyFile = [];
          //   }
          // }
     
        } else {
          app.setErrorMsg2(that, "查询已发送 接收人信息！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '查询失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询已发送 接收人信息：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  /* 新建 */
  newcompany: function () {
    //是否启用会员服务权限检查
    if (app.data.isSrvRightCheck) {
      this.getMemberSrvRightData(app.globalData.userInfo.userId, 5, 1)
    } else {
      that.data.isForbidRefresh = true;
      wx.navigateTo({
        url: packComPageUrl + "/perfectCo/perfectCo?vtype=1"
      });
    }
  },
  /* 查看 */
  checkcompany: function (e) {
    let that=this;
    let index = e.currentTarget.dataset.index;
    let vtype = e.currentTarget.dataset.vtype;
    if (vtype == 2){
    app.data.userCardDetaData = this.data.companyInfo[index];
    } else if (vtype == 6 || vtype == 7){
      app.data.userCardDetaData = this.data.companySendOrReceInfo[index];
    } else if (vtype == 0){
      vtype = 2;
      app.data.userCardDetaData = this.data.companySendOrReceInfo[index];
    }
    that.data.isForbidRefresh = true;
    wx.navigateTo({
      url: packComPageUrl + "/perfectCo/perfectCo?vtype=" + vtype
    });
  },

  hidereceptionpop: function () {
    this.setData({
      receptionpop: false
    })
  },
  // showreceptionpop: function (e) {
  //   var sendIndex = e.currentTarget.dataset.index;
  //   if (Utils.isNull(this.data.companySendOrReceInfo[sendIndex].userlist)){
  //     wx.showToast({
  //       title: '暂时没有人查看您发送的公司资料',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return;
  //   }
  //   this.setData({
  //     receptionpop: true,
  //     sendIndex: sendIndex
  //   })
  // },
  //////////////////////////////////////////////////////////////////////////
  //--------获取会员服务权限数据--------------------------------------------
  //方法：获取会员服务权限数据信息
  //参数说明：
  //mainObj：当前页面
  //userId：当前用户ID
  //moduleId：模块ID——
  //          1: 剩余报价单个数,
  //          2: 剩余询价单个数,
  //          3: 剩余名片创建张数,
  //          4: 剩余产品创建个数,
  //          5: 剩余公司资料创建个数,
  //          6: 剩余发布供应信息个数,
  //          7: 剩余发布采购信息个数,
  //          8: 可查看的买家级别
  getMemberSrvRightData: function (userId, moduleId, tag) {
    var that = this;
    app.getMemberSrvRightData(that, userId, moduleId, tag);
  },
  //方法：检查会员权限后的操作
  exeSrvRightOperation: function (tag) {
    var that = this, isPassSrvRight = that.data.isPassSrvRight;
    switch (tag) {
      //报价（供应）信息
      case 1:
        if (!isPassSrvRight) {
          wx.showToast({
            title: "公司创建数量已达上限，不能再创建！",
            icon: 'none',
            duration: 2500
          })
          return;
        }
        wx.navigateTo({
          url: packComPageUrl + "/perfectCo/perfectCo?vtype=1"
        });
        break;
    }

  },
})
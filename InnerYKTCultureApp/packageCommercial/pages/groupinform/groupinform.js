// pages/groupinform/groupinform.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({
  data: {
    DataURL: DataURL,
    delBtnWidth: 140,
    data: [
      { num: "1", name: "关于最新公告", time: "2019-08-05 12:00:00"}, 
      { num: "2", name: "关于最新公告", time: "2019-08-05 12:00:00"}, 
      { num: "3", name: "关于最新公告", time: "2019-08-05 12:00:00"}, 
      { num: "4", name: "关于最新公告", time: "2019-08-05 12:00:00"}, 
      { num: "5", name: "关于最新公告", time: "2019-08-05 12:00:00"}
    ],
    isScroll: true,
    windowHeight: 0,
    identity: 0, // 0 ：成员，1：群主 ,2:管理员
    crowinform:false,
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    var identity = 0;
    if (app.globalData.userInfo.userId == app.data.cardgroupData.shareQunUserId) {
      identity = 1; // 群主
    } else if (app.globalData.userInfo.userId == app.data.cardgroupData.assistantUserId) {
      identity = 2; // 群主
    }
    that.setData({
      cardgroupData: app.data.cardgroupData,
      userInfo: app.globalData.userInfo,
      identity: identity
    })
  },
  onShow:function(){
    this.queryGroupNotifi();
  },
  drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.data) {
      var item = this.data.data[index]
      item.right = 0
    }
    this.setData({
      data: this.data.data,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.data[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        data: this.data.data
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.data[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    }
  },

  delItem: function (e) {

  },
  notifyDetails: function (e) {
    var type = e.currentTarget.dataset.type;
    if(type == 1){
      var index = e.currentTarget.dataset.index;
      app.data.cardgroupMsgData = this.data.cardgroupMsgList[index];
    }
    wx.navigateTo({
      url: packComPageUrl + "/groupnotice/groupnotice?status=" + type + '&identity=' + this.data.identity
    })
    
  },
  //查询群通知
  queryGroupNotifi: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_qunNotice&action=qunNoticeList&contactFolderId=" + that.data.cardgroupData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=100&pageIndex=1";
    console.log("获取群通知：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取群通知：", res)
        if (res.data.rspCode == 0) {
          var tips = '';
          var groupNotifDis = true;
          if (!Utils.isNull(res.data.data.dataList)) {
            var dataList = res.data.data.dataList;
            for (let i = 0; i < dataList.length; i++) {
                dataList[i].checked = false;
              if (!Utils.isNull(dataList[i].img)){
                dataList[i].img = dataList[i].img.split(',');
              }else{
                dataList[i].img = [];
              }
            }
          } else {
            if (that.data.userInfo.userId == that.data.cardgroupData.shareQunUserId) {
              tips = '您还没有发送群消息，请点击右上角按钮发布群消息';
            } else {
              tips = '群主暂时未发布群消息';
            }
            dataList = [];
          }
          if ((that.data.userInfo.userId == that.data.cardgroupData.shareQunUserId)) {
            groupNotifDis = false;
          }
          that.setData({
            cardgroupMsgList: dataList,
            crowinform: true,
            groupNotifDis: groupNotifDis,
            noMsgTips: tips
          })
          console.log("111=", tips)
          console.log("111=", dataList.length)
        } else {
          app.setErrorMsg2(that, "获取群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取群通知失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
})
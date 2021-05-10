// components/cheirapsisAlert/cheirapsisAlert.js
var app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var packMainPageUrl = "../../pages", packYKPageUrl ="/packageYK/pages";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    cheirapsisCouponCnt:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showkkk:function(){
      let that=this;
      wx.showModal({
        title: '提示',
        content: '这是一个模态弹窗'+"("+that.data.pageName+")",
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    //方法：查询按摩记录信息
    queryCheirapsisDataList: function () {
      let that = this,otherConParams = "&xcxAppId=" + app.data.wxAppId;
      otherConParams += "&userId=" + app.globalData.userInfo.userId + "&duration=0&isUse=0&isCancelShare=0";
      app.getShareStatData(that, otherConParams, 1000000, 1);
    },
    //方法：获取分成统计信息列表结果处理函数
    dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
      let that = this;
      app.dowithGetShareStatData(that, 1, dataList, tag, errorInfo, pageIndex,true);
      console.log("cheirapsisCouponCnt:"+that.data.cheirapsisCouponCnt)
      if (that.data.cheirapsisCouponCnt > 0){
        //如果有可用按摩记录，且其他条件允许：当前设备有效且为运营状态，没有显示过使用提示，当前设备该用户没有在用
        if(app.data.isShowHomeCheirapsisAlert && app.data.agentDeviceId>0 && !app.data.isDeviceMyUsing){
          wx.showModal({
            title: '提示',
            content: '您有可以使用的按摩劵，是否开始按摩?',
            confirmText:"开始按摩",
            cancelText:"下次再说",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                app.data.isShowHomeCheirapsisAlert=false;
                let url = packYKPageUrl + "/Myprize/Myprize";
                console.log("sureCheirapsisAlert:" + url);
                wx.navigateTo({
                  url: url
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
                app.data.isShowHomeCheirapsisAlert=false;
              }
            }
          })
        }
      }
    },
  },
  pageLifetimes: {
    show: function() {
      let that=this;
      // 页面被展示
      console.log("components cheirapsisAlert is onShow ......")
    },
  }
})

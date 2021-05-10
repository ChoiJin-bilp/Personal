// packageVP/pages/MywantMassage/MywantMassage.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, SMURL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, sOptions = null, timeOutGetChances = null, timeOutGetDrawAwardList = null, timeOutGetPCheirapsisProductList = null, timeOutGetDeviceInfo = null, internalDownTime = null, timeInternelQueryDevice = null;

var getGrade = 0, havePlayed = 0, isDowithing = false, sendGPRSCmdCnt = 0, frequentness = 1;
var operatePageTag=-1,isInsert=0, mainPackageUrl = "../../../pages", packYKPageUrl ="../../../packageYK/pages", packSMPageUrl = "../../../packageSMall/pages", payForType = 0, payMordeAlert = "您还有可使用的按摩券(“首页”-“我的奖品”中选择使用)，是否需要继续支付？";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL:DataURL,
    currentData:0,
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;

    that.getMyCheirapsisCouponList(0);
    //that.queryUserCoupons(0)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //方法：获取我的按摩劵
  getMyCheirapsisCouponList: function (tag) {
    let that = this, otherConParams = "&xcxAppId=" + app.data.wxAppId;
    otherConParams += "&duration=0";
    
    //未使用不包括分享中的记录
    otherConParams+=tag==0?"&isCancelShare=0":"";
    otherConParams+="&userId=" + appUserInfo.userId + "&isUse=0";
    
    app.getShareStatData(that, otherConParams, 1000000, 1);
  },
  //方法：获取分成统计信息列表结果处理函数
  dowithGetShareStatData: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,isFilterStatus=that.data.currentData==4?false:true;
    app.dowithGetShareStatData(that,0, dataList, tag, errorInfo, pageIndex,isFilterStatus);
  },
  //事件：我的抽奖记录立即使用
  useMyAward: function (e) {
    let that = this, item = null, url = "", pfTag = 0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      if(item.shareUserId==item.userId){
        wx.showModal({
          title: '提示',
          content: '对不起，该劵只能赠送他人使用！',
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
      that.setData({
        showModalwinning: false,
        Lotterymywin: false,
      })
      pfTag = item.type == 2 && item.payStatus == 1 ? 1 : pfTag;
      if (item.type == 4 && item.lotteryProduct == -1) {
        //如果“抽奖记录ID”大于0且为抽奖充值记录，则变更相应抽奖记录为“已使用”状态，增加抽奖机会、并将“抽奖记录ID”清零——抽奖操作
        that.setAwardAboutRecordUsed(item.id);
      } else {
        that.setData({
          ["curSelOperateAwardItem"]: item,
        })
        // cb51StartTag = 4;
        // that.sendDeviceCommand(that.data.deviceGprsAddress, "CB51", "", null);

        let minuteCnt = 0, cashback_price = 0.00;
        if (Utils.isNotNull(item.duration) && Utils.myTrim(item.duration + "") != "null") {
          try {
            minuteCnt = parseInt(item.duration);
            minuteCnt = isNaN(minuteCnt) ? 0 : minuteCnt;
          } catch (err) { }
        }
        if (Utils.isNotNull(item.cashback_price) && Utils.myTrim(item.cashback_price + "") != "null") {
          try {
            cashback_price = parseFloat(item.cashback_price);
            cashback_price = isNaN(cashback_price) ? 0.00 : cashback_price;
          } catch (err) { }
        }
        that.gotoCheirapsisPage(item.id, minuteCnt, cashback_price, pfTag);
      }
    } else {
      wx.showToast({
        title: "无法获取信息！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //事件：组合劵立即使用
  useSynCoupon: function (e) {
    let that = this, item = null, url = "", pfTag = 0;
    try {
      item = e.currentTarget.dataset.item;
    } catch (e) { }
    if (Utils.isNotNull(item)) {
      if(item.shareUserId==item.userId){
        wx.showModal({
          title: '提示',
          content: '对不起，该劵只能赠送他人使用！',
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
      app.data.synCouponObj={
        id:item.lotteryActivityProductId,
        mpids:item.synCouponMpid,
        rid:item.id,
      }
      wx.reLaunch({
        url: "/pages/alittle/alittle"
      });
    } else {
      wx.showToast({
        title: "无法获取信息！",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //事件：跳转按摩器使用页面
  gotoCheirapsisPage: function (id, mincnt, cashback_price, isPayfor) {
    let that = this, url = "";
    
    //按摩记录信息记载
    let allCash=cashback_price,idlist=id,pf=isPayfor;
    allCash+=Utils.isNotNull(app.data.operateRecordItem)?app.data.operateRecordItem.cash:0.00;
    idlist+=Utils.isNotNull(app.data.operateRecordItem)?","+app.data.operateRecordItem.idlist:"";
    pf=Utils.isNotNull(app.data.operateRecordItem) && app.data.operateRecordItem.pf>0?app.data.operateRecordItem.pf:pf;
    
    app.data.operateRecordItem = { id: id, mincnt: mincnt, cash: allCash, pf: pf,tag:0,idlist:idlist }
    url = mainPackageUrl + "/cheirapsisWork/cheirapsisWork?ncw=1&id=" + id + "&mcnt=" + mincnt + "&did=" + app.data.agentDeviceId + "&sqy=1&cash=" + allCash + "&pf=" + pf;
    console.log("gotoCheirapsisPage:" + url)
    wx.navigateTo({
      url: url
    });
  },





  //查询优惠券
  queryUserCoupons: function (isUsed) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = app.globalData.muserInfo.userId
    // userId = 13140
    var urlParam = "cls=product_coupons&action=QueryUserCoupons" + "&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userId=" + userId;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&companyId=" + app.data.companyId;

    if (3 == isUsed) {
      urlParam = urlParam + "&avmold=12&isUsed=0"
    } else {
      urlParam = urlParam + "&isUsed=" + isUsed
    }

    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询优惠券', res);
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          if (res.data.data.length > 0) {
            that.setData({
              couponData: res.data.data
            })
          } else {
            wx.showToast({
              title: '暂无优惠劵',
              icon: 'none',
              duration: 1500,
            })
          }
        } else {
          app.setErrorMsg2(that, "查询优惠券！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.data.isLoad = true;
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        console.log("接口失败：" + err)
      }
    })
  },
  /**
   * 使用优惠券
   */
  goUseCoupon(e) {
    var url = '/pages/alittle/alittle?typeid=' + app.data.cheirapsisTypeId
    console.log(url)
    wx.reLaunch({
      url: url
    })
  },
  //事件：跳转页面
  gotoPage: function (e) {
    //pagetype：0普通页面，1tabbar页面
    //package：包名简写
    //pagename：页面名称
    let that = this, pagetype = 0, isCheckAuditStat = 0, packageName = e.currentTarget.dataset.package, pagename = e.currentTarget.dataset.page, url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) { }

    app.gotoPage(that, "../../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },
  onchangeroof() {
    this.setData({
      roof: !this.data.roof
    })
  },
    //说明显示/隐藏
    onchangeExplain() {
      this.setData({
        explaintype: !this.data.explaintype
      })
    },
    gotoback(e){
      if(e.currentTarget.dataset.num==0){
        wx.navigateTo({
          url: '../Payformassage/Payformassage?titletype='+e.currentTarget.dataset.num
         })
      }else{
        wx.reLaunch({
          url: '../../../pages/comactivity/comactivity'
         })
      }
    },

})
// packageVP/pages/Payformassage/Payformassage.js
const app = getApp();
var SMDataURL = app.getUrlAndKey.dataUrl;
var Ballheight = app.globalData.ballheight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL:SMDataURL,
    imgList: [
      "https://bjy.51yunkeyi.com/baojiayou/tts_upload/images/ops-d.png"
    ],
    num:1,
    Ballheight:Ballheight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let litype = options.titletype
    if(litype==0){
      wx.setNavigationBarTitle({
        title: '买饮品送按摩' 
      })
    }else if(litype==1){
      wx.setNavigationBarTitle({
        title: '付费按摩/按摩活动' 
      })
    }
    this.setData({
      litype
    })
  },
  //预览图片，放大预览
  previewImg:function(e){
    var img = e.currentTarget.dataset.src
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  /*Somnrtnum下一步上一步*/
  Somnrtnum(e){
    var that= this,toWay = e.currentTarget.dataset.num,num =that.data.num; 
    console.log(toWay)
    if(toWay==0){
      if(that.data.num>1){
        num--
        that.setData({
          num:num
        })
      }else{
        return
      }
    }else if(toWay==1){
      if(that.data.num<6){
        num++
        that.setData({
          num:num
        })
      }else{
        return
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  gotoback(e){
    if(e.currentTarget.dataset.pout==0){
      wx.navigateTo({
        url: '../../../pages/luckdraw/luckdraw'
       })
    }else if(e.currentTarget.dataset.pout==1){
      wx.reLaunch({
        url: '../../../pages/alittle/alittle'
       })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})
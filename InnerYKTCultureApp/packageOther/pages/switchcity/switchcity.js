import { LETTERS, HOT_CITY_LIST } from '../../../locale/citydata'
import { commonMessage } from '../../../locale/commonMessageZhCn'
import { AutoPredictor } from '../../../localutils/autoPredictor'
import utils from '../../../localutils/utils'
const app = getApp()
var Utils = require('../../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = null, timeOutGoBack=null;
const {
  isNotEmpty,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl,
  onFail,
} = utils;
const appInstance = getApp();

Page({
  data: {
    sideBarLetterList: [],
    winHeight: 0,
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: commonMessage['location.getting'],
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: false,
    auto: true, // 自动手动定位开关,

    curCountyListcityCode:'',
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });

    try {
      //实例化腾讯地图API核心类
      qqmapsdk = new QQMapWX({
        key: app.data.qqMapSDKKey
      });
    } catch (e) { }
    // 定位
    //this.getLocation();
    this.setData({
      city: appInstance.globalData.defaultCity,
      county: appInstance.globalData.defaultCounty,
      currentCityCode: appInstance.globalData.defaultCityCode,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutGoBack != null && timeOutGoBack != undefined) clearTimeout(timeOutGoBack);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutGoBack != null && timeOutGoBack != undefined) clearTimeout(timeOutGoBack);
    } catch (err) { }
  },
  //事件：确定返回
  submitSelCityCounty:function(e){
    let that=this;
    app.data.isSelCityArea = true;
    that.gotoBackPage();
  },
  //方法：返回
  gotoBackPage: function () {
    let that = this;
    
    wx.navigateBack({
      delta: 1
    })
  },
  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
  },
  //选择城市
  chooseCity: function (e) {
    const { city, code } = safeGet(['currentTarget', 'dataset'], e)
    this.setData({
      auto: false,
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    this.getCountyList()

    appInstance.globalData.defaultCity = city;
    appInstance.globalData.defaultCityCode=code;
    appInstance.globalData.defaultCounty = ''
  },
  getCurCityCountyList:function(e){
    let that = this, currentCityCode = that.data.currentCityCode, curCountyListcityCode = that.data.curCountyListcityCode, countyList = that.data.countyList;

    if (countyList != null && countyList!=undefined && countyList.length > 0 && Utils.myTrim(currentCityCode) == Utils.myTrim(curCountyListcityCode)){
      return
    }
    that.setData({
      auto: false,
      showCountyPicker: true,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    that.getCountyList()
  },

  chooseCounty: function (e) {
    let that=this;
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
    this.setData({ county: county })
    appInstance.globalData.defaultCounty = county
    // 返回
    //timeOutGoBack = setTimeout(that.gotoBackPage, 300);
  },
  selAllNone:function(){
    let that=this;
    app.globalData.defaultCity="";
    appInstance.globalData.defaultCounty = "";
    that.setData({ city: "全国", county:""})
    // 返回
    //timeOutGoBack = setTimeout(that.gotoBackPage, 300);
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({ scrollTop: 0 })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  getCountyList: function () {
    let that=this;
    console.log(commonMessage['location.county.getting']);
    const code = that.data.currentCityCode

    // wx.request({
    //   url: getCountyListUrl(code),
    //   success: res => this.setCountyList(res),
    //   fail: onFail(commonMessage['location.county.fail']),
    // })

    qqmapsdk.getDistrictByCityId({
      // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
      id: code, //对应接口getCityList返回数据的Id，如：北京是'110000'
      sig: app.data.qqMapIPSign,
      success: function (res) {//成功后的回调
        console.log(res);
        console.log('对应城市ID下的区县数据(以北京为例)：', res.result[0]);
        that.setCountyList(res)
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  setCountyList: function (res) {
    let that=this;
    const countyList = res.result != null && res.result != undefined && res.result.length > 0 ? res.result[0] : []
    that.setData({ 
      countyList:countyList,
      curCountyListcityCode:that.data.currentCityCode, 
    })
  },

  getLocation: function () {
    console.log(commonMessage['location.city.getting'])

    this.setData({ county: '' })
    wx.getLocation({
      type: 'wgs84',
      success: res => this.getLocationFromGeoCoord(res),
      fail: onFail(commonMessage['location.city.fail']),
    })
  },

  getLocationFromGeoCoord: function (geoCoord) {
    const { latitude, longitude } = geoCoord
    wx.request({
      url: getLocationUrl(latitude, longitude),
      success: location => this.setCityCounty(location)
    })
  },

  setCityCounty: function (location) {
    const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location)
    if (this.data.auto) { // 如果开始手动选择，以手动为准
      this.setData({
        city,
        currentCityCode: adcode,
        county: district
      })
      appInstance.globalData.defaultCity = city
      // this.getCountyList();
    }
  },
  reGetLocation: function () {
    const { city, county } = this.data
    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({ url: getIndexUrl() })
  },
  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({
      inputName: '',
      completeList: []
    })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    let inputName = e.detail.value.trim()
    this.setData({ inputName })
    if (!inputName) {
      this.setData({ completeList: [] })
    }
    this.useAutoPredictor(inputName)
  },
  // 输入框自动联想搜索
  useAutoPredictor: function (content) {
    let autoPredictor = new AutoPredictor(content)
    let completeList = autoPredictor.associativeSearch()
    this.setData({ completeList })
  },
})

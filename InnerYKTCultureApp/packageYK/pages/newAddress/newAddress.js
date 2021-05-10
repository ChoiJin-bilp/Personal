// pages/newAddress/newAddress.js
const app = getApp();

var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  SMDataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
// 地图选地址
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMDataURL: SMDataURL,
    curlocation: [],
    sexs: [{
      name: "先生",
      checked: true,
    }, {
      name: "女士",
      checked: false,
    }],
    addAddressData: {
      id: "",
      name: '',
      mobile: '',
      area: '',
      address: "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    appUserInfo = app.globalData.userInfo

    var type = options.type
    if (0 == type) {
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
      })
      //getOpenerEventChannel()微信系统方法，需调试库2.9.2 ,在json文件中加个"usingComponents": {} ,
      const eventChannel = that.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据 
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        console.log(data)
        var address = data.address
        var sexs = that.data.sexs;
        for (let i = 0; i < sexs.length; i++) {
          const element = sexs[i];
          element.checked = false
          if (address.sex == element.name) {
            element.checked = true
          }
        }
        var addAddressData = that.data.addAddressData
        addAddressData.id = address.id
        addAddressData.name = address.name
        addAddressData.mobile = address.mobile
        addAddressData.area = address.area
        addAddressData.address = address.address
        that.setData({
          addAddressData: addAddressData,
          sexs: sexs,
        })
      })
    }

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        that.data.curlocation = res
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location)
    if (!Utils.isNull(location)) {
      var addAddressData = this.data.addAddressData
      addAddressData.area = location.address
      this.setData({
        addAddressData: addAddressData,
      })
    }
  },

  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },

  goToMap() {
    var that = this
    var curlocation = that.data.curlocation
    const key = app.data.qqMapSDKKey; //使用在腾讯位置服务申请的key
    const referer = app.data.sysName; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: curlocation.latitude,
      longitude: curlocation.longitude
    });
    const category = '';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },

  selectSex(e) {
    var sexs = this.data.sexs;
    var index = e.currentTarget.dataset.index
    if (sexs[index].checked) {
      return
    }
    for (let i = 0; i < sexs.length; i++) {
      const element = sexs[i];
      element.checked = !element.checked
    }
    this.setData({
      sexs: sexs,
    })
  },

  getInput(e) {
    var value = e.detail.value;
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "addAddressData.name"
        break;
      case 1:
        name = "addAddressData.mobile"
        break;
      case 2:
        name = "addAddressData.address"
        break;
    }
    this.setData({
      [name]: value,
    })
  },

  confirmAddress: function () {
    var that = this
    var data = this.data.addAddressData;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    console.log('新建内容', data)
    if (re.test(data.name) || Utils.isNull(data.name)) {
      wx.showToast({
        title: '请输入联系人姓名！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (Utils.isNull(data.mobile) || re.test(data.mobile)) {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!myreg.test(data.mobile)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    switch (that.data.templateType) {
      case 1:
        break;
      default:
        if (Utils.isNull(data.area)) {
          wx.showToast({
            title: '请填写收货地址',
            icon: 'none',
            duration: 2000
          })
          return;
        } else if (Utils.isNull(data.address) || re.test(data.address)) {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        break;
    }
    this.insertAddress();
  },

  /**
   * 新建收货地址
   */
  insertAddress: function () {
    var that = this;
    var sex
    var sexs = this.data.sexs;
    for (let i = 0; i < sexs.length; i++) {
      const element = sexs[i];
      if (element.checked) {
        sex = element.name
        break
      }
    }
    var data = that.data.addAddressData;
    var userId = appUserInfo.userId
    var signParam = "cls=product_address&action=insertAddress&userId=" + userId + "&name=" + data.name + "," + sex + "&mobile=" + data.mobile + "&area=" + data.area + "&address=" + data.address

    let otherParam = "&xcxAppId=" + app.data.wxAppId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "新建收货地址")
  },
  /**
   * 修改地址
   */
  updateAddress() {
    var userId = appUserInfo.userId
    var data = this.data.addAddressData;

    var sexs = this.data.sexs;
    var sex
    for (let i = 0; i < sexs.length; i++) {
      const element = sexs[i];
      if (element.checked) {
        sex = element.name
        break
      }
    }
    data.name = data.name + "," + sex

    var addressJson = JSON.stringify(data)
    var signParam = "cls=product_address&action=editAddress&userId=" + userId
    let otherParam = "&xcxAppId=" + app.data.wxAppId + "&addressJson=" + addressJson
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 2, "修改地址")
  },
  /**
   * 删除收货地址
   */
  deleteAddress: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除收货地址?',
      success(res) {
        if (res.confirm) {
          var data = that.data.addAddressData;
          if (data.id == app.data.lastAddressId) {
            app.data.lastAddressId = 0
          }
          var signParam = "cls=product_address&action=deleteAddress&id=" + data.id
          app.doGetData(that, app.getUrlAndKey.smurl, signParam, "", 1, "删除收货地址")
        } else if (res.cancel) {

        }
      }
    })

  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.dealData("收货地址新建成功")
            break
          case 1:
            that.dealData("地址删除成功")
            break
          case 2:
            that.dealData("修改地址成功")
            break
        }
        break
      default:
        console.log(error)
        break
    }
  },

  dealData(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    })
    setTimeout(function () {
      let pages = getCurrentPages()
      // -1是当前页 -2是上个页面
      let prevPage = pages[pages.length - 2];
      // 通知上个页面更新数据
      prevPage.data.isReData = true
      prevPage = pages[pages.length - 3];
      prevPage.data.isReData = true
      wx.navigateBack({
        delta: 1,
      })
    }, 2000)

  },

})
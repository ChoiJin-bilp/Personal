// pages/shopadd/shopadd.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    scene: 0, // 1:订单页面进入选择地址 2:没有收货地址 从订单页面进入新建地址
    carts: [], // 购物车列表
    mainTitle: "",
    templateType: 0, //模板类型：0零售，1酒店，2社区

    newaddress: false,
    editAddressStat: false,
    selectAllStatus: false, // 全选状态，默认全选
    region: [],
    addAddressData: { //新建地址 数据
      name: null,
      mobile: null,
      area: null,
      address: null,
      postalCode: null,
    },
    upAddressData: {} //编辑地址
  },
  onLoad: function (options) {
    var that = this,
      templateType = 0,
      scene = "";
    try {
      if (options.tptype != null && options.tptype != undefined)
        templateType = parseInt(options.tptype);
      templateType = isNaN(templateType) ? 0 : templateType;
    } catch (e) {}
    if (!Utils.isNull(options.scene)) { //订单页面选择地址
      scene = options.scene;
    }
    that.setData({
      scene: scene,
      templateType: templateType,
      mainTitle: templateType == 1 ? '联系方式' : '收货地址',
    })
    wx.setNavigationBarTitle({
      title: that.data.mainTitle
    })
    if (options.scene == 2) { //订单页面：新建地址
      that.shownewaddress();
      return;
    }
    that.selectAddress();
  },
  onShow() {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var scene = this.data.scene;
    const choice = carts[index].choice;
    console.log(scene)
    if (scene == 0) {
      carts[index].choice = !choice;
      //是否全选中
      let isAllCheck = false;
      //检查是否有全选
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].choice) {
          isAllCheck = true
        } else {
          isAllCheck = false
          break;
        }
      }
      this.setData({
        carts: carts,
        selectAllStatus: isAllCheck,
      });
    } else if (scene == 1) {
      if (choice) {
        return;
      }
      for (let i = 0; i < carts.length; i++) {
        if (i == index) {
          carts[index].choice = !choice;
        } else {
          carts[index].choice = false;
        }
      }
      this.setData({
        carts: carts,
      });
      app.data.updateCartsData = carts[index];
      wx.navigateBack({
        delta: 1
      })
    }

  },


  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].choice = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
  },
  /* 地址填写*/
  bindRegionChange: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      var str = 'addAddressData.area'
    } else {
      var str = 'upAddressData.area'
      var carts = this.data.carts;
      var editIndex = this.data.editIndex;
      var str2 = 'carts[' + editIndex + '].area';
      this.setData({
        [str2]: e.detail.value
      })
      var upAddressData = this.data.upAddressData;
      if (Utils.isNull(upAddressData.id)) {
        upAddressData.id = carts[editIndex].id;
        this.setData({
          upAddressData: upAddressData
        })
      }
    }
    console.log('str=', str)
    this.setData({
      [str]: e.detail.value
    })
  },
  /* 获取新建地址输入*/
  getInputContent: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var field = e.currentTarget.dataset.field;
    console.log("field:", field)
    that.setData({
      [field]: val
    })
  },
  /* 获取编辑地址输入*/
  getUpInputContent: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var field = e.currentTarget.dataset.field;
    var upAddressData = that.data.upAddressData;
    if (Utils.isNull(upAddressData.id)) {
      upAddressData.id = that.data.carts[that.data.editIndex].id;
      that.setData({
        upAddressData: upAddressData
      })
    }
    that.setData({
      [field]: val
    })
    console.log("upAddressData:", that.data.upAddressData)
  },

  //点击新建地址显示隐藏
  shownewaddress: function () {
    this.setData({
      newaddress: true
    })
  },
  //点击编辑
  showEditAddress: function () {
    var that = this,
      frequency = 0
    var index = null;
    var carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].choice) {
        frequency++;
        index = i;
      }
    }
    if (frequency == 0) {
      wx.showToast({
        title: '请选择需要编辑的' + that.data.mainTitle,
        icon: 'none',
        duration: 1500
      })
      return
    } else if (frequency > 1) {
      wx.showToast({
        title: '只能选择一个' + that.data.mainTitle + '编辑',
        icon: 'none',
        duration: 1500
      })
      return
    } else if (frequency == 1) {
      this.setData({
        editAddressStat: true,
        editIndex: index
      })
    }
  },
  hideEditAddress: function () {
    this.setData({
      editAddressStat: false
    })
  },
  hidenewaddress: function () {
    this.setData({
      newaddress: false
    })
  },
  //查询收货地址
  selectAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_address&action=selectAddress&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询收货地址', res);
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            data[i].choice = false;
            if (!Utils.isNull(data[i].area)) {
              data[i].area = data[i].area.split(',');
            }
            if (that.data.scene == 1) {
              var updateCartsData = app.data.updateCartsData;
              if (data[i].selected && Utils.isNull(updateCartsData)) {
                data[i].choice = true;
              } else if (!Utils.isNull(updateCartsData) && data[i].id == updateCartsData.id) {
                data[i].choice = true;
              }

              //yzq更新在此页面编辑收货信息 返回订单详情数据不更新
              if (!Utils.isNull(updateCartsData) && data[i].id == updateCartsData.id) {
                app.data.updateCartsData.address = data[i].address;
                app.data.updateCartsData.area = data[i].area;
                app.data.updateCartsData.mobile = data[i].mobile;
                app.data.updateCartsData.name = data[i].name;
              }
            }
          }
          that.setData({
            carts: data
          })
          console.log('处理完数据', data)
        } else {
          app.setErrorMsg2(that, "查询默认收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  confirmAddress: function () {
    var that = this,
      data = this.data.addAddressData;
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
            title: '请选择所在地区',
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
  //提交 编辑收货地址
  confirmUpAddress: function () {
    var that = this,
      data = this.data.upAddressData;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    console.log('data:', data.id)
    if (data.id == undefined) {
      this.setData({
        editAddressStat: false,
        upAddressData: {},
        editIndex: null,
      })
      return;
    }
    if (data.name != undefined && (re.test(data.name) || Utils.isNull(data.name))) {
      wx.showToast({
        title: '请输入联系人姓名！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (data.mobile != undefined && (Utils.isNull(data.mobile) || re.test(data.mobile))) {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (data.mobile != undefined && (!myreg.test(data.mobile))) {
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
        if (data.area != undefined && (Utils.isNull(data.area))) {
          wx.showToast({
            title: '请选择所在地区',
            icon: 'none',
            duration: 2000
          })
          return;
        } else if (data.address != undefined && (Utils.isNull(data.address) || re.test(data.address))) {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        break;
    }
    this.updateAddress();
  },
  //编辑收货地址
  updateAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.upAddressData;
    var area = data.area;
    var areaStr = '';
    if (!Utils.isNull(area)) {
      for (let i = 0; i < area.length; i++) {
        if (areaStr == '') {
          areaStr += area[i];
        } else {
          areaStr += ',' + area[i];
        }
      }
      data.area = areaStr;
    }
    var dataStr = JSON.stringify(data)
    console.log("josn字符串：", dataStr)
    var urlParam = "cls=product_address&action=editAddress&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&addressJson=" + dataStr + "&sign=" + sign;
    console.log('编辑收货地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      method: 'get',
      success: function (res) {
        console.log('编辑收货地址', res)
        if (res.data.rspCode == 0) {
          that.selectAddress();
          that.setData({
            editAddressStat: false,
            upAddressData: {},
            editIndex: null,
          })
        } else {
          app.setErrorMsg2(that, "编辑收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //新建收货地址
  insertAddress: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=insertAddress&userId=" + app.globalData.muserInfo.userId + "&name=" + data.name + "&mobile=" + data.mobile + "&area=" + data.area + "&address=" + data.address + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    if (!Utils.isNull(data.postalCode)) {
      urlParam += "&postalCode=" + data.postalCode
    }
    console.log('新建收货地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('新建收货地址', res)
        if (res.data.rspCode == 0) {
          if (that.data.scene == 2) {
            wx.navigateBack({
              delta: 1
            })
            return;
          }
          var carts = that.data.carts;
          that.selectAddress();
          that.setData({
            newaddress: false,
            addAddressData: false
          })
        } else {
          app.setErrorMsg2(that, "新建收货地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  delAddress: function () {
    var that = this;
    var ids = '';
    var carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].choice) {
        if (ids == '') {
          ids += carts[i].id;
        } else {
          ids += ',' + carts[i].id;
        }
      }
    }
    if (ids == '') {
      wx.showToast({
        title: '请选择需要删除的地址',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除选中的' + that.data.mainTitle + '吗',
        success(res) {
          if (res.confirm) {
            that.requestDelAddress(ids);
          } else if (res.cancel) {}
        }
      })
    }
  },
  //删除地址
  requestDelAddress: function (ids) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=deleteAddress&id=" + ids + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('删除地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('删除地址', res)
        if (res.data.rspCode == 0) {
          var carts = that.data.carts;
          if (!Utils.isNull(app.data.updateCartsData)) {
            var idArr = ids.split(',');
            for (let i = 0; i < idArr.length; i++) {
              if (idArr[i].id == app.data.updateCartsData.id) {
                app.data.updateCartsData = null;
              }
            }
          }
          that.selectAddress();
        } else {
          app.setErrorMsg2(that, "删除地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //更换默认地址
  defaultAddress: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.carts[index].selected) {
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.addAddressData;
    var urlParam = "cls=product_address&action=defaultAddress&id=" + that.data.carts[index].id + "&userId=" + app.globalData.muserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('更换默认地址', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('更换默认地址', res)
        if (res.data.rspCode == 0) {
          that.selectAddress();
        } else {
          app.setErrorMsg2(that, "更换默认地址失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
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
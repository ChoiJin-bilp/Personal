// packageYK/pages/generated/generated.js
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    modelList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appUserInfo = app.globalData.userInfo
    this.getModelList(0)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  addData() {
    var modelList = this.data.modelList

    var model = {
      attributeOne: "",
      labels: [{
        lblname: "",
        lblprice: 0,
      }],
      sort: modelList.length + 1,
    }

    modelList = modelList.concat(model)
    this.setData({
      modelList: modelList
    })

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

  getInput: function (e) {
    var that = this
    var value = e.detail.value
    var type = parseInt(e.currentTarget.dataset.type)
    var tag = parseInt(e.currentTarget.dataset.tag)
    var index = e.currentTarget.dataset.index
    var modelList = that.data.modelList
    switch (type) {
      // 分类名称
      case 0:
        modelList[index].attributeOne = value
        break;
        // 规格
      case 1:
        let itemindex = e.currentTarget.dataset.itemindex
        let labels = modelList[index].labels
        switch (tag) {
          case 0:
            labels[itemindex].lblname = value
            break
          case 1:
            labels[itemindex].lblprice = value
            break
        }
        break;
    }

    that.setData({
      ["modelList"]: modelList,
    })
  },
  /**
   * 删除分类
   */
  deleteModel(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定是否删除？',
      success(res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index
          var modelList = that.data.modelList
          var id = modelList[index].id
          if (Utils.isNull(id)) {
            modelList.splice(index, 1)
            that.setData({
              modelList: modelList,
            })
          } else {
            var models = [{
              id: id,
              delete: 1,
            }]

            var data = [{
              istemplet: 1,
              companyId: app.data.companyId,
              detail: models,
            }]
            that.deleteProducts(data)
          }

        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 添加规格
   */
  addLabel(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var modelList = that.data.modelList
    var model = modelList[index]

    for (let j = 0; j < model.labels.length; j++) {
      const label = model.labels[j];
      if (Utils.isNull(label.lblname) || Utils.isNull(label.lblprice)) {
        wx.showToast({
          title: "请填写完整,再添加规格",
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    var label = {
      lblname: "",
      lblprice: 0,
    }
    var labels = model.labels
    labels = labels.push(label)
    that.setData({
      modelList: modelList,
    })
  },
  /**
   * 删除规格
   */
  deleteLabel(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定是否删除？',
      success(res) {
        if (res.confirm) {

          var index = e.currentTarget.dataset.index
          var itemindex = e.currentTarget.dataset.itemindex
          var modelList = that.data.modelList
          var id = modelList[index].labels[itemindex].id
          if (Utils.isNull(id)) {
            modelList[index].labels.splice(itemindex, 1)
            that.setData({
              modelList: modelList,
            })
          } else {

            var labels = []
            var label = {
              id: id,
              delete: 1,
            }
            labels = labels.concat(label)
            var models = [{
              id: modelList[index].id,
              delete: 2,
              labels: labels
            }]

            var data = [{
              istemplet: 1,
              companyId: app.data.companyId,
              detail: models,
            }]
            that.deleteProducts(data)
          }
        } else if (res.cancel) {}
      }
    })
  },
  /**
   *  判断是否填写完整
   */
  isComplete() {
    var that = this
    var isb = true
    var modelList = that.data.modelList
    for (let i = 0; i < modelList.length; i++) {
      const model = modelList[i];
      if (Utils.isNull(model.attributeOne)) {
        isb = false
        break
      }
      for (let j = 0; j < model.labels.length; j++) {
        const label = model.labels[j];
        if (Utils.isNull(label.lblname) || Utils.isNull(label.lblprice)) {
          isb = false
          break
        }
      }
    }
    return isb;
  },

  /**
   * 新增分类
   */
  addNew() {
    var that = this
    if (!that.isComplete()) {
      wx.showToast({
        title: "请填写完整,再新增分类",
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.addData()
  },

  /**
   * 保存
   */
  save() {
    var that = this
    if (!that.isComplete()) {
      wx.showToast({
        title: "请填写完整,再新增规格",
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.saveProducts()
  },

  /**
   * 添加与更新模板
   */
  saveProducts: function () {
    var data = [{
      istemplet: 1,
      companyId: app.data.companyId,
      detail: this.data.modelList,
    }]
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    var signParam = "cls=product_goodtype&action=SaveProducts&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userby=" + userId
    app.doPostData(this, app.getUrlAndKey.smurl, signParam, "data", data, "", 0, "添加与更新模板")
  },

  /**
   * 删除分类 规格
   * @param {*} data 
   */
  deleteProducts: function (data) {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    var signParam = "cls=product_goodtype&action=SaveProducts&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userby=" + userId
    app.doPostData(this, app.getUrlAndKey.smurl, signParam, "data", data, "", 1, "删除分类 规格")
  },

  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1800)
            break;
          case 1:
            wx.showToast({
              title: "删除成功",
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              that.getModelList(1)
            }, 1800)
            break;
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  /**
   * 获取保存的模板
   */
  getModelList(tag) {
    let signParam = 'cls=product_goodtype&action=QueryProducts'
    var userId = appUserInfo.userId
    var otherParam = "&istemplet=1&companyId=" + app.data.companyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, tag, "获取保存的模板")
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            // 查询
          case 1:
            if (data.length > 0) {
              var modelList = []
              for (let i = 0; i < data.length; i++) {
                const model = data[i];
                var labels = []
                for (let j = 0; j < model.labels.length; j++) {
                  const label = model.labels[j];
                  var la = {
                    lblname: label.lblname,
                    lblprice: label.lblprice,
                    id: label.id,
                  }
                  labels = labels.concat(la)
                }
                var mo = {
                  attributeOne: model.attributeOne,
                  labels: labels,
                  sort: model.sort,
                  id: model.id,
                }
                modelList = modelList.concat(mo)
              }
              that.setData({
                modelList: modelList,
              })
            } else {
              if (0 == tag) {
                // 初始化默认数据
                that.addData()
              } else if (1 == tag) {
                that.setData({
                  modelList: [],
                })
              }
            }
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },
})
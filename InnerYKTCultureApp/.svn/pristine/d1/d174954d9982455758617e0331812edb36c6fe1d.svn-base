// pages/source/source.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url,
  SMURL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  Differenheight = app.globalData.differenheight;
var appUserInfo = null,
  sOptions = null,
  timeOutRegAlert = null,
  timeOutPersonLocation = null,
  isDowithing = false;
var pageSize = 8,
  defaultItemImgSrc = DataURL + app.data.defaultImg;
var packSMPageUrl = "../../../packageSMall/pages",
  packOtherPageUrl = "../../../packageOther/pages",
  packHotelPageUrl = "../../../packageHotel/pages",
  packComPageUrl = "../../../packageCommercial/pages",
  packMainPageUrl = "../../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    sty: false, //选项样式
    infoType: 0, //0商品，1信息
    searchStatus: "0,1", //商品状态——0:上架  1:下架；信息状态——0未发布，1发布
    searchKeyword: "", //搜索关键字
    dataArray: [],
    pageIndex: 1,
    loadData: false,
    // 是否编辑 删除
    isEdit: true,
    // 是否弹出酒店下拉
    showout: true,
    // 选中了哪个酒店
    selCompanyIndex: 0,
    // 选中了 哪个商品分类
    selProcuctTypeIndex: 0,
    // 弹窗添加商品分类
    addProcuctType: false,
    CompanydataList: [],
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
    Differenheight: Differenheight,
    // 规格模板
    modelList: [],
    // 选中了哪个分类模板
    selectModelIndex: 0,
    selProductTypeId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pagetype = options.pagetype
    this.setData({
      pagetype: pagetype,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
    })
    // 0商品  1房源 2饮品
    if (0 == pagetype) {
      wx.setNavigationBarTitle({
        title: '酒店商品',
      })
    } else if (2 == pagetype) {
      wx.setNavigationBarTitle({
        title: '饮品商品',
      })
    }
    appUserInfo = app.globalData.userInfo;

    this.getHotleCompany()
  },

  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
    if (this.data.loadData) {
      this.data.loadData = false
      this.loadInitData();
    }
  },

  /**
   * 获取用户绑定的酒店
   */
  getHotleCompany() {
    let signParam = 'cls=main_rolePower&action=getRolePowerPowerList&roleId=' + app.data.user_roleId
    var userId = appUserInfo.userId
    // appUserInfo.userId=6763
    // userId = 8173
    userId = this.data.accountBindUserId
    var otherParam = "&userId=" + userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取用户绑定酒店")
  },

  /**
   * 获取保存的模板
   */
  getModelList() {
    let signParam = 'cls=product_goodtype&action=QueryProducts'
    var userId = appUserInfo.userId
    var otherParam = "&istemplet=1&createby=" + userId + "&companyId=" + app.data.companyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 1, "获取保存的模板")
  },
  /**
   * 获取选中饮品商品
   */
  queryProducts(ids) {
    var that = this
    var companyId = app.data.agentCompanyId
    var otherParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + app.data.companyId;
    // 5是饮品
    otherParam = otherParam + "&status=0,1&typeflag=5&mold=9&id=" + ids + "&pSize=99&pIndex=1"
    let signParam = 'cls=product_goodtype&action=QueryProducts'
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 2, "获取选中饮品商品")
  },

  getRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            if (data.CompanydataList.length == 0) {
              wx.showToast({
                title: "暂无绑定酒店",
                icon: 'none',
                duration: 1500
              })
              return
            }
            that.setData({
              CompanydataList: data.CompanydataList,
            })
            if (that.data.CompanydataList.length > 0) {
              that.getProductTypeList()
            }
            break
          case 1:
            if (data.length == 0) {
              wx.showToast({
                title: "规格模板为空",
                icon: 'none',
                duration: 1500
              })
              return
            }

            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              let labels = element.labels
              for (let j = 0; j < labels.length; j++) {
                const label = labels[j];
                //初始化 是否选中删除
                label.checked = false
              }
            }
            that.setData({
              modelList: data,
            })
            break
          case 2:
            that.setData({
              selectProducts: data,
            })
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  /**
   * 添加与更新分类
   * @param {*} mainDataInfo 
   */
  saveProductTypes: function (mainDataInfo) {
    var signParam = 'cls=product_goodtype&action=SaveProductTypes'
    app.doPostData(this, app.getUrlAndKey.smurl, signParam, "data", mainDataInfo, "", 0, "添加与更新分类")
  },
  /**
   * 更新饮品 
   */
  saveProducts: function (data) {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    var signParam = "cls=product_goodtype&action=SaveProducts&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userby=" + userId
    app.doPostData(this, app.getUrlAndKey.smurl, signParam, "data", data, "", 1, "更新饮品")
  },
  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (tag) {
          case 0:
            msg = "操作成功！"
            // let selProcuctTypeList = that.data.selProcuctTypeList
            // let listItem = {
            //   id: data.ids,
            //   name: that.data.procuctTypeName,
            // }
            // selProcuctTypeList.push(listItem)
            that.setData({
              addProcuctType: false,
              // selProcuctTypeList: selProcuctTypeList,
              oldProcuctTypeName: "",
              selProcuctTypeIndex: 0,
            })
            that.getProductTypeList()
            break
          case 1:
            msg = "操作成功！"
            that.loadInitData();
            break
        }
        if (!Utils.isNull(msg)) {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 1500
          })
        }
        break;
      default:
        console.log(error)
        break
    }
  },

  //获取商品分类列表
  getProductTypeList: function (pageSize, pageIndex) {
    var that = this,
      otherParamCom = "&companyId=" + that.data.CompanydataList[that.data.selCompanyIndex].id;
    // 0商品  1房源 2饮品
    // var pagetype = that.data.pagetype
    // if (0 == pagetype) {
    //   otherParamCom += "&typeId=1";
    // } else if (2 == pagetype) {
    //   otherParamCom += "&typeId=5";
    // }
    // 不管是 0商品  2饮品都放一起
    otherParamCom += "&typeId=1";

    app.getProductTypeList(that, otherParamCom);
  },
  //方法：获取商品分类结果回调方法
  dowithGetProductTypeList: function (dataList, tag, errInfo) {
    let that = this;
    app.dowithGetProductTypeList(that, dataList, tag,false, errInfo);

    // 0商品  1房源 2饮品
    var pagetype = that.data.pagetype
    if (0 == pagetype) {
      var selProcuctTypeList = that.data.selProcuctTypeList
      // 先把全部去掉，添加新元素
      selProcuctTypeList.splice(0, 1)
      var listItem = {
        id: -1,
        name: "推荐",
        mold: "706,716,806,816",
      }
      selProcuctTypeList.unshift(listItem)
      listItem = {
        id: -1,
        name: "活动",
        mold: "705,715,805,815",
      }
      selProcuctTypeList.unshift(listItem)
      listItem = {
        id: 0,
        name: "全部",
      }
      selProcuctTypeList.unshift(listItem)
      that.setData({
        selProcuctTypeList: selProcuctTypeList,
      })
    }
    that.loadInitData();
  },

  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    let that = this
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
      pageIndex: 1,
    })
    // 获取第一页列表信息
    that.getMainDataList(pageSize, that.data.pageIndex);
  },

  //方法：获取信息列表
  getMainDataList: function (pageSize, pageIndex, otherParam) {
    let that = this,
      otherParamCon = "&xcxAppId=" + app.data.wxAppId;
    let status = that.data.searchStatus,
      infoType = that.data.infoType,
      searchKeyword = that.data.searchKeyword,
      selTypeDataItem = that.data.selTypeDataItem;

    wx.showLoading({
      title: "数据加载中...",
    })
    //0商品，1信息
    switch (infoType) {
      case 0:
        //商品关键字
        if (Utils.myTrim(searchKeyword) != '') {
          otherParamCon += "&productName=" + encodeURIComponent(searchKeyword);
        }
        // if (selTypeDataItem != null && selTypeDataItem != undefined) {
        //   otherParamCon += "&typeId=" + selTypeDataItem.id;
        // }
        var userId = appUserInfo.userId
        userId = this.data.accountBindUserId
        // otherParamCon += "&status=" + status + "&createBy=" + userId;
        // 根据公司id来获取商品 createBy不需要
        otherParamCon += "&status=" + status;
        otherParamCon += "&sField=createDate&sOrder=desc";
        var pagetype = that.data.pagetype

        // 获取发布房源
        if (1 == pagetype) {
          otherParamCon = otherParamCon + "&typeflag=2";
        } else {
          if (that.data.CompanydataList.length == 0) {
            wx.showToast({
              title: "请选择酒店",
              icon: 'none',
              duration: 1500
            })
            return
          }
          // 0商品  1房源 2饮品 
          var typeflag = "1"
          var mold = "70,80,71,81,705,706,715,716,805,806,815,816"
          if (2 == pagetype) {
            typeflag = "1"
            // 10 组合券赠品
            mold = "9,10";
          }
          otherParamCon = otherParamCon + "&typeflag=" + typeflag + "&companyId=" + that.data.CompanydataList[that.data.selCompanyIndex].id + "&displayType=0,1,2";

          if (that.data.selProcuctTypeList.length > 0) {
            var selProcuctTypeIndex = that.data.selProcuctTypeIndex
            if (selProcuctTypeIndex == 0) {
              otherParamCon = otherParamCon + "&mold=" + mold
            } 
            // else if (0 == pagetype && selProcuctTypeIndex == 1 || selProcuctTypeIndex == 2) {
            //   otherParamCon = otherParamCon + "&mold=" + that.data.selProcuctTypeList[selProcuctTypeIndex].mold
            // }
             else {
              otherParamCon = otherParamCon + "&typeName=" + that.data.selProcuctTypeList[selProcuctTypeIndex].name + "&mold=" + mold
            }
          }
        }
        app.getSoftSrvProduct(that, otherParamCon, pageSize, pageIndex);
        break
    }
  },

  //方法：获取代理商品结果处理函数
  dowithGetSoftSrvProduct: function (dataList, tag, errorInfo, pageIndex) {
    let that = this,
      noDataAlert = "暂无商品信息！";
    wx.hideLoading();
    switch (tag) {
      case 1:
        let data = dataList,
          dataItem = null,
          detailItem = null,
          listItem = null,
          dataArray = [],
          videoList = [],
          isSelAll = that.data.isSelAll;
        if (data != null && data != undefined && data.length > 0) {
          let pid = 0,
            shopType = "",
            shopName = "",
            companyPhone = "",
            productId = "",
            productName = "",
            photosString = "",
            photosTemp = [],
            photos = "",
            remark = "",
            sourcePrice = 0.00,
            sellPrice = 0.00,
            photosList = [],
            detailPhoto = [],
            priceUnite = "";
          for (let i = 0; i < data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = data[i];
            shopType = "";
            shopName = "";
            productId = "";
            productName = "";
            photos = "";
            sourcePrice = 0.00;
            sellPrice = 0.00;
            companyPhone = "";
            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            //
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              shopName = dataItem.companyName;
            if (dataItem.companyPhone != null && dataItem.companyPhone != undefined && Utils.myTrim(dataItem.companyPhone + "") != "")
              companyPhone = dataItem.companyPhone;
            if (dataItem.LevelName != null && dataItem.LevelName != undefined && Utils.myTrim(dataItem.LevelName + "") != "")
              shopType = dataItem.LevelName;
            if (dataItem.id != null && dataItem.id != undefined && Utils.myTrim(dataItem.id + "") != "")
              productId = dataItem.id;

            //商品图片
            if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = "";
              photosString = dataItem.photos;
              detailPhoto = [];
              detailPhoto = photosString.split(",");
              if (detailPhoto.length > 0) {
                for (let n = 0; n < detailPhoto.length; n++) {
                  photosString = detailPhoto[n].toLowerCase();
                  if (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg")) {
                    photos = app.getSysImgUrl(detailPhoto[n]);
                    break;
                  }
                }
              }
            }
            if (Utils.myTrim(photos) == "" && dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
              if (dataItem.detail[0].photos != null && dataItem.detail[0].photos != undefined && Utils.myTrim(dataItem.detail[0].photos + "") != "" && Utils.myTrim(dataItem.detail[0].photos + "") != "null") {
                photosString = "";
                photosString = dataItem.detail[0].photos;
                detailPhoto = [];
                detailPhoto = photosString.split(",");
                if (detailPhoto.length > 0) photos = app.getSysImgUrl(detailPhoto[0]);
              }
            }

            //重新设置的价格
            if (dataItem.minprice != null && dataItem.minprice != undefined && Utils.myTrim(dataItem.minprice + "") != "") {
              try {
                sourcePrice = parseFloat(dataItem.minprice);
                sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
              } catch (err) {}
            }
            sourcePrice = parseFloat(sourcePrice.toFixed(app.data.limitQPDecCnt));
            sellPrice = sourcePrice; //minstatusprice
            //priceUnite
            if (sellPrice > 10000) {
              sellPrice = sellPrice / 10000;
              sellPrice = parseFloat(sellPrice.toFixed(app.data.limitQPDecCnt));
              priceUnite = "万";
            }
            shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
            listItem = {
              pid: dataItem.pid,
              shopType: shopType,
              shopName: shopName,
              productId: productId,
              productName: Utils.myTrim(productName) != "" ? productName : remark,
              photos: app.getSysImgUrl(photos),
              sourcePrice: sourcePrice,
              sellPrice: sellPrice,
              status: dataItem.status,
              companyPhone: companyPhone,
              priceUnite: priceUnite,
              // 是否选中
              isSel: false,
            }
            dataArray.push(listItem);
          }
        }
        if (dataArray.length > 0) {
          // 直接将新一页的数据添加到数组里
          that.setData({
            dataArray: that.data.dataArray.concat(dataArray)
          })
        } else if (that.data.pageIndex == 1) {
          wx.showToast({
            title: noDataAlert,
            icon: 'none',
            duration: 2000
          })
        } else {
          that.data.pageIndex--
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无商品信息！";
        break;
    }
  },

  getInput(e) {
    console.log(e)
    var value = e.detail.value;
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "searchKeyword"
        break;
      case 1:
        name = "procuctTypeName"
        break;
      case 2:
        name = "sort"
        break;
      default:
        break;
    }
    this.setData({
      [name]: value,
    })
  },

  startSeach() {
    this.loadInitData();
  },

  //判断
  onChangstytype(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var dataArray = that.data.dataArray
    console.log(index)
    for (let i = 0; i < dataArray.length; i++) {
      if (index == i) {
        dataArray[i].isSel = !dataArray[i].isSel
        break
      }
    }
    this.setData({
      dataArray: dataArray
    })
  },

  //事件：上下架操作
  submitPutDownShelf: function (e) {
    let that = this,
      dataArray = that.data.dataArray,
      selProductIdList = [],
      tag = 0;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    //1上架，0下架，2删除
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) {}
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].isSel) {
        selProductIdList.push(dataArray[i].pid)
      }
    }
    if (selProductIdList.length <= 0) {
      wx.showToast({
        title: "请选择需要操作的商品！",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(selProductIdList);
    switch (tag) {
      case 0:
        tag = 2;
        break;
      case 2:
        tag = 3;
        break;
    }
    if (tag == 3) {
      wx.showModal({
        title: '系统消息',
        content: "您确定要删除所选商品吗？",
        icon: 'none',
        duration: 1500,
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            console.log("cancel more del")
            return;
          } else {
            //点击确定
            console.log("sure more del")
            isDowithing = true;
            that.operateMainDataList(selProductIdList, tag);
          }
        },
      })
    } else {
      isDowithing = true;
      that.operateMainDataList(selProductIdList, tag);
    }
  },
  //方法：保存商品信息
  //tag: 1上架 2下架  3删除
  operateMainDataList: function (selProductIdList, tag) {
    let that = this,
      alertMsg = "";
    switch (tag) {
      case 1:
        alertMsg = "上架";
        break;
      case 2:
        alertMsg = "下架";
        break;
      case 3:
        alertMsg = "删除";
        break;
    }
    wx.showLoading({
      title: "数据处理中...",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    // userId = 8173
    // userId = 6763
    userId = this.data.accountBindUserId
    let urlParam = "",
      sign = "",
      operationParam = "&operation=" + tag,
      idParam = "",
      idList = "";
    idList = selProductIdList.join(',');
    idParam = "&pid=" + idList;
    urlParam = "cls=main_mallProduct&action=saveMallProduct&userId=" + userId + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + operationParam + idParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      // url: "http://192.168.1.116:8080/baojiayou/webAPI.jsp?" + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        isDowithing = false;
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: alertMsg + "操作成功！",
            icon: 'none',
            duration: 1500
          })
          that.loadInitData();
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, alertMsg + "操作：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        isDowithing = false;
        wx.hideLoading();
        wx.showToast({
          title: alertMsg + "操作接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, alertMsg + "操作接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },

  gotoStruction() {
    var url = '../Gammon/Gammon'
    var that = this
    if (1 != that.data.pagetype) {
      url = '../../../packageOther/pages/commoditydetail/commoditydetail?pagetype=' + that.data.pagetype+"&typeid="+that.data.selProductTypeId;
    }
    wx.navigateTo({
      url: url,
    })
  },

  gotoEdit(e) {
    var id = e.currentTarget.dataset.id
    var url = '../Gammon/Gammon?pid=' + id
    var that = this
    if (0 == that.data.pagetype || 2 == that.data.pagetype) {
      url = '../../../packageOther/pages/commoditydetail/commoditydetail?pid=' + id + "&pagetype=" + that.data.pagetype
    }
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  bindTopLoad: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  bindDownLoad: function () {
    // 获取第一页列表信息
    this.getMainDataList(pageSize, ++this.data.pageIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showSelectClassList() {
    this.setData({
      showout: !this.data.showout,
    })
  },
  /**
   * 选择酒店
   * @param {*} e 
   */
  selHotleCompany(e) {
    var index = e.currentTarget.dataset.index
    if (index != this.data.selCompanyIndex) {
      this.setData({
        selCompanyIndex: index,
        showout: !this.data.showout,
      })
      if (this.data.CompanydataList.length > 0) {
        this.getProductTypeList()
      }
    } else {
      this.setData({
        showout: !this.data.showout,
      })
    }
  },

  addProcuctType() {
    this.setData({
      addProcuctType: !this.data.addProcuctType,
      oldProcuctTypeName: "",
      sort: 0,
    })
  },
  delProcuctType() {
    this.setData({
      isEdit: !this.data.isEdit,
    })
  },

  //下拉选择饮品分类
  onchangeCatetype() {
    this.setData({
      catetype: !this.data.catetype
    })
  },

  okSureProcuctType() {
    var that = this
    var procuctTypeName = that.data.procuctTypeName
    var oldProcuctTypeName = that.data.oldProcuctTypeName
    if (Utils.isNull(procuctTypeName)) {
      if (Utils.isNull(oldProcuctTypeName)) {
        wx.showToast({
          title: "名称不能为空",
          icon: 'none',
          duration: 1500
        })
        return
      }
    }
    if (that.data.CompanydataList.length == 0) {
      wx.showToast({
        title: "请选择酒店",
        icon: 'none',
        duration: 1500
      })
      return
    }
    // flag标识(1,新增2,更新);status(状态0无效（删除时使用）；1有效)不填默认为1;type:0产品1商品类型2酒店房型3信息类型4招聘类型5饮品;
    // photo类型图片;content广告语;parentId上级;imgs分类广告banner,多张逗号分隔;qrCode商品类型对应的小程序码。
    var mainDataInfo
    // 新增
    if (Utils.isNull(oldProcuctTypeName)) {
      var type = 1
      // 0商品  1房源 2饮品
      // var pagetype = that.data.pagetype
      // if (2 == pagetype) {
      //   type = 5
      // }
      mainDataInfo = [{
        flag: 1,
        type: type,
        companyId: that.data.CompanydataList[that.data.selCompanyIndex].id,
        productTypeName: procuctTypeName,
        sort: that.data.sort,
      }]
    } else {
      // 修改
      mainDataInfo = [{
        flag: 2,
        productTypeName: procuctTypeName,
        id: that.data.changeItem.id,
        sort: that.data.sort,
      }]
    }

    that.saveProductTypes(mainDataInfo)
  },

  /**
   * 修改
   * @param {} e 
   */
  editProcuctType(e) {
    var item = e.currentTarget.dataset.item
    var that = this
    that.setData({
      oldProcuctTypeName: item.name,
      changeItem: item,
      addProcuctType: true,
      sort: item.sort,
    })
  },

  /**
   * 删除
   */
  deleteProcuctType(e) {
    var item = e.currentTarget.dataset.item
    var that = this
    var dataArray = that.data.dataArray
    if (dataArray.length > 0) {
      wx.showModal({
        title: '提示',
        confirmText: '确定',
        showCancel: false,
        content: '请先将该分类下的商品移出或删除后再重试',
        success(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return
    }
    wx.showModal({
      title: '提示',
      confirmText: '确定',
      content: '是否删除该分类?',
      success(res) {
        if (res.confirm) {
          var mainDataInfo = [{
            flag: 2,
            status: 0,
            id: item.id
          }]
          that.saveProductTypes(mainDataInfo)
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 选择分类
   */
  seleteProcuctType(e) {
    let that=this,index=0,id=0;
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? 0 : index;
    } catch (e) {}
    try {
      id = parseInt(e.currentTarget.dataset.id);
      id = isNaN(id) ? 0 : id;
    } catch (e) {}
    
    that.setData({
      ["selProcuctTypeIndex"]: index,
      ["selProductTypeId"]:id,
    })
    this.loadInitData();
  },
  //新增规格模板
  onchangeShowCompile(e) {
    let that = this
    let tag = e.currentTarget.dataset.tag

    if (0 == tag) {
      let dataArray = that.data.dataArray
      let selProductIdList = []
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].isSel) {
          selProductIdList.push(dataArray[i].pid)
        }
      }
      if (selProductIdList.length <= 0) {
        wx.showToast({
          title: "请选择需要操作的商品！",
          icon: 'none',
          duration: 1500
        })
        return;
      }
      if (that.data.modelList == 0) {
        that.getModelList()
      }
      that.queryProducts(selProductIdList.join(","))
    }

    that.setData({
      showCompile: !this.data.showCompile
    })

  },
  emptyType() {
    this.setData({
      showCompile: false,
    })
  },
  //页面跳转
  gotoPage: function (e) {
    //pagetype：0普通页面，1tabbar页面
    //package：包名简写
    //pagename：页面名称
    let that = this,
      pagetype = 0,
      isCheckAuditStat = 0,
      packageName = e.currentTarget.dataset.package,
      pagename = e.currentTarget.dataset.page,
      url = "";
    try {
      pagetype = parseInt(e.currentTarget.dataset.pagetype);
      pagetype = isNaN(pagetype) ? 0 : pagetype;
    } catch (e) {}
    try {
      isCheckAuditStat = parseInt(e.currentTarget.dataset.isaudit);
      isCheckAuditStat = isNaN(isCheckAuditStat) ? 0 : isCheckAuditStat;
    } catch (e) {}

    app.gotoPage(that, "../../", isCheckAuditStat, pagetype, packageName, pagename, that.data.agentAuditState);
  },

  checkboxChange(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var modelList = that.data.modelList
    var label = modelList[that.data.selectModelIndex].labels[index]

    label.checked = !label.checked

    that.setData({
      modelList: modelList,
    })
  },
  /**
   * 一键操作 切换分类
   * @param {*} e 
   */
  optionTaps(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (index == that.data.selectModelIndex) {
      that.setData({
        catetype: false,
      })
      return
    }
    that.setData({
      selectModelIndex: index,
      catetype: false,
    })
  },

  /**
   * 切换有货 无货
   */
  setAvailable(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var modelList = that.data.modelList
    var label = modelList[that.data.selectModelIndex].labels[index]
    if (0 == label.available) {
      label.available = 1
    } else {
      label.available = 0
    }
    that.setData({
      modelList: modelList,
    })
  },

  /**
   * 一键操作 确认
   */
  sureSetAll() {
    var that = this
    wx.showLoading({
      title: '操作中...',
    })
    // 一键操作模板
    var model = that.data.modelList[that.data.selectModelIndex]
    let mlabels = model.labels
    // 选中要修改的商品
    let selectProducts = that.data.selectProducts

    // 修改后的数据
    let products = []

    // 删除提示
    let deleteTips = []

    for (let i = 0; i < selectProducts.length; i++) {
      const selectProduct = selectProducts[i];
      let details = selectProduct.detail

      // 修改后的
      let productdetail = []
      for (let j = 0; j < details.length; j++) {
        let productdetailLabels = []
        const detail = details[j];
        if (detail.attributeOne == model.attributeOne) {
          let labels = detail.labels
          for (let k = 0; k < labels.length; k++) {

            const label = labels[k];
            // 模板比对
            for (let a = 0; a < mlabels.length; a++) {
              const mlabel = mlabels[a];
              if (label.lblname == mlabel.lblname) {
                let lab = {}
                if (mlabel.checked) {
                  lab = {
                    id: label.id,
                    delete: 1,
                  }
                } else {
                  lab = {
                    id: label.id,
                    available: mlabel.available,
                    lblprice: mlabel.lblprice,
                  }
                }
                productdetailLabels = productdetailLabels.concat(lab)
              }
            }
          }
        }

        if (productdetailLabels.length > 0) {
          let petail = {
            id: detail.id,
            labels: productdetailLabels,
          }
          productdetail = productdetail.concat(petail)
        }

      }
      if (productdetail.length > 0) {
        let product = {
          id: selectProduct.id,
          detail: productdetail,
        }
        products = products.concat(product)
      }
    }
    console.log(products)

    for (let i = 0; i < mlabels.length; i++) {
      const mlabel = mlabels[i];
      if (mlabel.checked) {
        deleteTips = deleteTips.concat(mlabel.lblname)
      }
    }

    if (deleteTips.length > 0) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        confirmText: '确定',
        content: '是否删除选中商品的\'' + deleteTips.join("、") + "\'的规格?",
        success(res) {
          if (res.confirm) {
            that.okSure(products)
          } else if (res.cancel) {}
        }
      })
    } else {
      that.okSure(products)
    }
  },
  okSure(products) {
    this.setData({
      showCompile: false,
    })
    if (products.length > 0) {
      this.saveProducts(products)
    } else {
      wx.showToast({
        title: "暂无可修改的分类",
        icon: 'none',
        duration: 1500
      })
    }
  },
})
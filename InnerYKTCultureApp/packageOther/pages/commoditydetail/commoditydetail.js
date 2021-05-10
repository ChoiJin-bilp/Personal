// pages/commoditydetail/commoditydetail.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var PYTool = require('../../../utils/pinyin.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,
  timeOutPType = null,
  isDowithing = false,
  timeOutReturn = null,
  insertIRETime = 0,
  insertIRECnt = 3;
var defaultItemImgSrc = DataURL + app.data.defaultImg,
  packOtherPageUrl = "../../../packageOther/pages",
  packSMPageUrl = "../../../packageSMall/pages",
  packHotelPageUrl = "../../../packageHotel/pages",
  packComPageUrl = "../../../packageCommercial/pages",
  mainPackageDir = "../../../pages",
  mQRType = app.data.mQRType;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,
    DataURL: DataURL,
    isLoad: false, //是否已经加载
    isForbidRefresh: false, //是否禁止刷新

    mainTypeId: 0, //分类ID
    mainTypePId: 0, //分类父ID
    proId: 0, //商品ID
    proSDetailId: "", //商品规格ID
    randomNum: Math.random() / 9999,
    proDataInfo: null,
    selDIndex: 0,

    selProductTypeIndex: 0, //所选商品索引
    selProductTypeIDParam: 0, //所选商品类型ID
    selProductSuitableValue: 0, //所选适用商品类别

    editSpecsName: "", //当前操作规格名称
    editSpecsSourcePrice: 0.00, //当前操作规格原价
    editSpecsStock: 0.00, //当前操作规格库存
    editSpecsPhoto: [], //当前操作规格图片列表
    editIndex: -1, //当前操作规格索引

    disabled: false,
    maxPhoImgCnt: 6, //产品顶部图片最大数量
    maxIntImgCnt: 10, //产品介绍图片最大数量
    maxSpecsPhoImgCnt: 10, //产品规格图片最大数量

    max_name: 50,
    max_no: 50,
    max_remark: 500,

    suitableProductList: [{
        name: '无',
        value: 0,
        mold: "",
        checked: true
      }, {
        name: '活动',
        value: 1,
        mold: 5,
        checked: false
      },
      {
        name: '推荐',
        value: 2,
        mold: 6,
        checked: false
      },
    ],
    productLabelList: [{
      name: '无',
      value: 0,
      mold: "",
      checked: true
    }, {
      name: '赠送商品',
      value: 1,
      mold: 9,
      checked: false
    }, {
      name: '打印图案',
      value: 2,
      mold: "",
      checked: false
    }, ],
    // 是否是店内商品
    isShopProduct: false,
    newProductType: 0, //新增分类ID

    isAgreTreaty: true,

    //红包相关
    isShowRedEnvelopeAlertPop: false,
    redEnvelopeOneMoney: 0.00,
    id: 0,
    cardItem: "",
    cardIndex: 0,
    CompanydataList: [],
    selCompanydataIndex: 0,
    // 角色 2平台 4酒店
    user_roleId: app.data.user_roleId,
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
    timeChoices: [{
        value: 1,
        name: '单选',
        checked: 'true'
      },
      {
        value: 0,
        name: '多选'
      }
    ],
    modelList: [],
    // 已经选中分类的下标
    selectModelIndex: 0,
    // 已经选择处理的
    models: [],
    // 选择了那个分类编辑
    editModelIndex: 0,
    isEdittModel: false,
    // 弹窗临时的
    tempModel: [],
    // 弹窗临时添加 没确定
    // addTempModel: [],
    // 分类排序
    modelSort: 0,
    saleStatusList: [{
        value: 0,
        name: '上架',
        checked: 'true'
      },
      {
        value: 1,
        name: '下架'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
      proId = 0,
      newProductType = 0,
      mainTypePId = 0;
    appUserInfo = app.globalData.userInfo;
    try {
      if (options.pid != null && options.pid != undefined && Utils.myTrim(options.pid + "") != "") {
        proId = parseInt(options.pid);
        proId = isNaN(proId) ? 0 : proId;
      }
    } catch (e) {}
    try {
      if (options.typeid != null && options.typeid != undefined && Utils.myTrim(options.typeid + "") != "") {
        newProductType = parseInt(options.typeid);
        newProductType = isNaN(newProductType) ? 0 : newProductType;
      }
    } catch (e) {}
    try {
      if (options.typepid != null && options.typepid != undefined)
        mainTypePId = parseInt(options.typepid);
      mainTypePId = isNaN(mainTypePId) ? 0 : mainTypePId;
    } catch (e) {}

    // 0商品  1房源 2饮品
    var pagetype = options.pagetype
    // 是否是店内商品
    var isShopProduct = false
    if (2 == pagetype) {
      isShopProduct = true
      that.setData({
        suitableProductList: that.data.productLabelList,
      })
      that.getModelList()
    }

    that.setData({
      proId: proId,
      mainTypePId: mainTypePId,
      mainTypeId: newProductType,
      selProductTypeIDParam: newProductType,
      pagetype: pagetype,
      isShopProduct: isShopProduct,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
    })
    if (proId > 0) {
      wx.setNavigationBarTitle({
        title: '商品编辑',
      })
      if (2 == pagetype) {
        timeOutPType = setTimeout(function () {
          that.queryProducts(proId)
        }, 900);
      } else {
        timeOutPType = setTimeout(function () {
          that.getMainDataList(proId)
        }, 900);
      }
      that.setData({
        isAgreTreaty: true,
      })
    } else {
      var userId = appUserInfo.userId
      userId = this.data.accountBindUserId
      let proDataInfo = {
        pid: 0,
        productId: '',
        productName: '',
        secondProductName: '',
        paroductNo: '',
        shopId: app.data.companyId,
        photos: [],
        productDetailList: [],
        remark: '',
        shelfStatus: 0,
        introductionImgs: [],
        mold: 0,
        videoList: [],
        productTypeId: newProductType,
        sort: 0,
        createBy: userId,
      }
      that.setData({
        proDataInfo: proDataInfo,
      })
    }
    that.getHotleCompany()
    // that.getCompany()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime = app.data.isDeviceMyUsing ? true : false;
    if (!that.data.isLoad) {
      that.data.isLoad = true;
    } else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.getMainDataList(that.data.proId);
          console.log("onShow ...")
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutPType != null && timeOutPType != undefined) clearTimeout(timeOutPType);
      if (timeOutReturn != null && timeOutReturn != undefined) clearTimeout(timeOutReturn);
    } catch (err) {}
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutPType != null && timeOutPType != undefined) clearTimeout(timeOutPType);
      if (timeOutReturn != null && timeOutReturn != undefined) clearTimeout(timeOutReturn);
    } catch (err) {}
  },
  //获取商品分类列表
  getProductTypeList: function () {
    var that = this,
      noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "",
      orderByParam = "&sField=sort&sOrder=asc",
      ifOMPParam = "&companyId=" + that.data.CompanydataList[that.data.selCompanydataIndex].id;
    noDataAlert = "暂无商品分类信息！";
    // var pagetype = that.data.pagetype
    // if (0 == pagetype) {
    //   orderByParam += "&typeId=1";
    // } else if (2 == pagetype) {
    //   orderByParam += "&typeId=5";
    // }
    // 不管是 0商品  2饮品都放一起
    orderByParam += "&typeId=1";

    urlParam = "cls=product_goodtype&action=QueryTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + ifOMPParam + orderByParam + "&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
          var data = res.data.data,
            dataItem = null,
            listItem = null,
            selProcuctTypeList = [];
          var id = 0,
            name = "",
            selProductTypeIndex = 0,
            selProductTypeIDParam = that.data.selProductTypeIDParam,
            selProductTypeNameParam = that.data.selProductTypeNameParam;
          // listItem = {
          //   id: 0,
          //   name: "全部",
          // }
          // selProcuctTypeList.push(listItem);
          for (var i = 0; i < data.length; i++) {
            dataItem = null;
            listItem = null;
            dataItem = data[i];
            id = 0;
            name = "";
            if (dataItem.productTypeName != null && dataItem.productTypeName != undefined && Utils.myTrim(dataItem.productTypeName + "") != "")
              name = dataItem.productTypeName;
            if (selProductTypeIDParam > 0 && selProductTypeIDParam == dataItem.id) {
              selProductTypeIndex = i;
              selProductTypeNameParam = name;
            }
            listItem = {
              id: dataItem.id,
              name: name,
            }
            selProcuctTypeList.push(listItem);

            // 编辑商品需要选中商品分类
            if (that.data.proId > 0) {
              var proDataInfo = that.data.proDataInfo
              if (proDataInfo.productTypeId == dataItem.id) {
                selProductTypeIndex = i
              }
            }
          }
          if (selProcuctTypeList.length > 0) {
            // 直接将新一页的数据添加到数组里
            that.setData({
              selProcuctTypeList: selProcuctTypeList,
              selProductTypeIDParam: selProcuctTypeList[0].id,
              selProductTypeIndex: selProductTypeIndex,
              selProductTypeNameParam: selProductTypeNameParam,
            })
          } else {
            wx.showToast({
              title: noDataAlert,
              icon: 'none',
              duration: 2000
            })
            that.setData({
              selProcuctTypeList: [],
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取商品分类列表：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品分类接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品分类接口：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false)
      }
    })
  },

  //获取商品详情
  getMainDataList: function (id) {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    var urlParam = "",
      sign = "",
      idParam = "&id=" + id,
      ifOMPParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + app.data.companyId,
      detailOrderParam = "&sDetail=price,updateDate",
      statParam = "&status=0,1";
    urlParam = "cls=product_goodtype&action=QueryProductTypes&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    ifOMPParam = ""
    urlParam = urlParam + idParam + ifOMPParam + detailOrderParam + "&userId=" + userId + statParam + "&pSize=10&pIndex=1&sign=" + sign;
    console.log(SMURL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: SMURL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          if (res.data.data != null && res.data.data != undefined && res.data.data.length > 0) {
            var dataItem = res.data.data[0],
              videoList = [],
              isSChgPrice = false,
              selProductTypeIndex = that.data.selProductTypeIndex;
            var productId = id,
              pid = 0,
              productTypeId = 0,
              sort = 0,
              mold = 0,
              groupmold = 0,
              groupMoney = 0.00,
              photos = [],
              photosTemp = [],
              introductionImgs = [],
              productDetailList = [],
              remark = "",
              supplier = "",
              photoUrl = defaultItemImgSrc,
              qrSrc = "",
              proFirstPhoto = defaultItemImgSrc,
              isSetFirstPhoto = false,
              proHeadPhotoList = [],
              giftId = "",
              giftName = "",
              gphotos = defaultItemImgSrc,
              selDIndex = 0,
              proSDetailId = that.data.proSDetailId,
              coupondist = 0.00,
              commission = 0.00,
              createBy = 0;
            var productName = "",
              secondProductName = "",
              paroductNo = "",
              photosString = "",
              shopId = 0,
              shopLogo = DataURL + "/images/zz.png",
              shopType = "旗舰",
              shopName = "",
              productDetailId = "",
              status = 0,
              specPhotos = [],
              attributeOne = "",
              attributeTwo = "",
              sourcePrice = 0.00,
              sellPrice = 0.00,
              channelPrice = 0.00,
              sellScore = 0,
              dScore = 0,
              shelfStatus = 0,
              dShelfStatus = 0,
              detailPhoto = [],
              isHavePhoto = false,
              discountPrice = 0.00,
              couponMold = 0,
              couponfull = 0.00,
              couponpriceDecrement = 0.00,
              couponPrice = 0.00,
              isShowPrice1 = false,
              isShowPrice2 = false,
              isShowPrice3 = false,
              discountType = 0,
              stock = 0,
              strStock = "",
              couponsList = [],
              conponDataItem = null,
              conponDataList = null,
              deposit = 0.00,
              presellstatus = 0,
              presellEndDate = "",
              finalPayMentStartDate = "",
              finalPayMentEndDate = "",
              peDate = null,
              fsDate = null,
              feDate = null,
              optimalPrice = 0.00,
              optimalPriceName = "现价",
              sofeNum = 0,
              sn = 0,
              isCouponPrice = false;

            productId = dataItem.id;
            shopId = dataItem.companyId;
            // 找出绑定的酒店
            var selCompanydataIndex = 0
            for (let i = 0; i < that.data.CompanydataList.length; i++) {
              var companydata = that.data.CompanydataList[i]
              if (companydata.id == shopId) {
                selCompanydataIndex = i
              }
            }
            // 找出商品分类
            // 需要加载商品详情中的酒店 才可以找到商品分类 写在getProductTypeList()

            // arrangeData

            if (dataItem.pid != null && dataItem.pid != undefined && Utils.myTrim(dataItem.pid + "") != "") {
              try {
                pid = parseInt(dataItem.pid);
                pid = isNaN(pid) ? 0 : pid;
              } catch (err) {}
            }
            if (dataItem.createBy != null && dataItem.createBy != undefined && Utils.myTrim(dataItem.createBy + "") != "") {
              try {
                createBy = parseInt(dataItem.createBy);
                createBy = isNaN(pid) ? 0 : createBy;
              } catch (err) {}
            }
            //sort 
            if (dataItem.sort != null && dataItem.sort != undefined && Utils.myTrim(dataItem.sort + "") != "") {
              try {
                sort = parseInt(dataItem.sort);
                sort = isNaN(sort) ? 0 : sort;
              } catch (err) {}
            }
            if (dataItem.productTypeId != null && dataItem.productTypeId != undefined && Utils.myTrim(dataItem.productTypeId + "") != "") {
              try {
                productTypeId = parseInt(dataItem.productTypeId);
                productTypeId = isNaN(productTypeId) ? 0 : productTypeId;
              } catch (err) {}
            }
            //预售信息
            if (dataItem.presellstatus != null && dataItem.presellstatus != undefined && Utils.myTrim(dataItem.presellstatus + "") != "") {
              try {
                presellstatus = parseInt(dataItem.presellstatus);
                presellstatus = isNaN(presellstatus) ? 0 : presellstatus;
              } catch (err) {}
            }
            //商品标识,0一般，1热销，2特价，3新品 ，4预售，5软件定制，6软件代理 7软件定制试用 8软件代理试用
            if (dataItem.mold != null && dataItem.mold != undefined && Utils.myTrim(dataItem.mold + "") != "") {
              try {
                mold = parseInt(dataItem.mold);
                mold = isNaN(mold) ? 0 : mold;
              } catch (err) {}
            }
            mold = (mold >= 50 && mold < 60) ? 5 : ((mold >= 60 && mold < 70) ? 6 : mold);

            var suitableProductList = that.data.suitableProductList
            var isShopProduct = that.data.isShopProduct
            var ml = dataItem.mold + ""
            // 活动
            if (ml.lastIndexOf("5") > 0) {
              suitableProductList[0].checked = false
              suitableProductList[1].checked = true
            }
            // 推荐
            if (ml.lastIndexOf("6") > 0) {
              suitableProductList[0].checked = false
              suitableProductList[2].checked = true
            }
            if (ml.indexOf("8") == 0) {
              isShopProduct = true
            }

            //上下架状态
            let saleStatusList = that.data.saleStatusList
            for (let i = 0; i < saleStatusList.length; i++) {
              const saleStatus = saleStatusList[i];
              saleStatus.checked = false
              if (dataItem.status == saleStatus.value) {
                saleStatus.checked = true
              }
            }

            if (dataItem.deposit != null && dataItem.deposit != undefined && Utils.myTrim(dataItem.deposit + "") != "null") {
              try {
                deposit = parseFloat(dataItem.deposit);
                deposit = isNaN(deposit) ? 0 : deposit;
              } catch (err) {}
            }
            if (dataItem.presellEndDate != null && dataItem.presellEndDate != undefined) {
              try {
                peDate = new Date(Date.parse((dataItem.presellEndDate + "").replace(/-/g, "/")))
              } catch (e) {
                peDate = new Date();
              }
              presellEndDate = Utils.getDateTimeStr3(peDate, "-", 0);
            }
            if (dataItem.finalPayMentStartDate != null && dataItem.finalPayMentStartDate != undefined) {
              try {
                fsDate = new Date(Date.parse((dataItem.finalPayMentStartDate + "").replace(/-/g, "/")))
              } catch (e) {
                fsDate = new Date();
              }
              finalPayMentStartDate = Utils.getDateTimeStr3(fsDate, "-", 100);
            }
            if (dataItem.finalPayMentEndDate != null && dataItem.finalPayMentEndDate != undefined) {
              try {
                feDate = new Date(Date.parse((dataItem.finalPayMentEndDate + "").replace(/-/g, "/")))
              } catch (e) {
                feDate = new Date();
              }
              finalPayMentEndDate = Utils.getDateTimeStr3(feDate, "-", 100);
            }

            //最大两张优惠券
            if (dataItem.coupons != null && dataItem.coupons != undefined && dataItem.coupons.length > 0) {
              for (var j = 0; j < dataItem.coupons.length; j++) {
                conponDataItem = null;
                conponDataItem = dataItem.coupons[j];
                conponDataList = null;
                conponDataList = {
                  id: conponDataItem.id,
                  mold: conponDataItem.mold,
                  full: conponDataItem.full,
                  discount: conponDataItem.discount,
                  name: conponDataItem.name
                };
                couponsList.push(conponDataList);
              }
            }
            //佣金
            if (dataItem.commission != null && dataItem.commission != undefined && Utils.myTrim(dataItem.commission + "") != "null") {
              try {
                commission = parseFloat(dataItem.commission);
                commission = isNaN(commission) ? 0.00 : commission;
              } catch (err) {}
            }
            commission = parseFloat((commission).toFixed(app.data.limitQPDecCnt));
            //赠品信息
            if (dataItem.gdetailId != null && dataItem.gdetailId != undefined && Utils.myTrim(dataItem.gdetailId + "") != "null" && Utils.myTrim(dataItem.gdetailId + "") != "")
              giftId = dataItem.gdetailId;
            if (dataItem.gproductName != null && dataItem.gproductName != undefined && Utils.myTrim(dataItem.gproductName + "") != "null" && Utils.myTrim(dataItem.gproductName + "") != "")
              giftName = dataItem.gproductName;
            if (dataItem.gphotos != null && dataItem.gphotos != undefined && Utils.myTrim(dataItem.gphotos + "") != "null" && Utils.myTrim(dataItem.gphotos + "") != "") {
              photosString = "";
              photosString = dataItem.gphotos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    gphotos = app.getSysImgUrl(photosTemp[n]);
                    break;
                  }
                }
              }
            }

            //团购标识
            if (dataItem.groupmold != null && dataItem.groupmold != undefined && Utils.myTrim(dataItem.groupmold + "") != "") {
              try {
                groupmold = parseInt(dataItem.groupmold);
                groupmold = isNaN(groupmold) ? 0 : groupmold;
              } catch (err) {}
            }
            //劵后价
            if (dataItem.coupondist != null && dataItem.coupondist != undefined && Utils.myTrim(dataItem.coupondist + "") != "null") {
              try {
                coupondist = parseFloat(dataItem.coupondist);
                coupondist = isNaN(coupondist) ? 0 : coupondist;
              } catch (err) {}
            }
            if (dataItem.couponmold != null && dataItem.couponmold != undefined && Utils.myTrim(dataItem.couponmold + "") != "") {
              try {
                couponMold = parseInt(dataItem.couponmold);
                couponMold = isNaN(couponMold) ? 0 : couponMold;
              } catch (err) {}
            }
            if (dataItem.couponfull != null && dataItem.couponfull != undefined && Utils.myTrim(dataItem.couponfull + "") != "") {
              try {
                couponfull = parseFloat(dataItem.couponfull);
                couponfull = isNaN(couponfull) ? 0.00 : couponfull;
              } catch (err) {}
            }
            if (dataItem.couponprice != null && dataItem.couponprice != undefined && Utils.myTrim(dataItem.couponprice + "") != "") {
              try {
                couponpriceDecrement = parseFloat(dataItem.couponprice);
                couponpriceDecrement = isNaN(couponpriceDecrement) ? 0.00 : couponpriceDecrement;
              } catch (err) {}
            }

            if (dataItem.status != null && dataItem.status != undefined && Utils.myTrim(dataItem.status + "") != "")
              try {
                shelfStatus = parseInt(dataItem.status);
                shelfStatus = isNaN(shelfStatus) ? 0 : shelfStatus;
              } catch (err) {}

            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            //secondProductName
            if (dataItem.secondProductName != null && dataItem.secondProductName != undefined && Utils.myTrim(dataItem.secondProductName + "") != "")
              secondProductName = dataItem.secondProductName;
            if (dataItem.address != null && dataItem.address != undefined && Utils.myTrim(dataItem.address + "") != "")
              paroductNo = dataItem.address;
            if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
              shopName = dataItem.companyName;
            if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "")
              shopType = Utils.myTrim(dataItem.companyLevel) == "0" ? "旗舰" : "普通";
            if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
              shopLogo = dataItem.companyLogo;
            //0 bjy商城  1 微官网商城
            switch (mQRType) {
              case 1:
                if (dataItem.wgwQrCode != null && dataItem.wgwQrCode != undefined && Utils.myTrim(dataItem.wgwQrCode + "") != "")
                  qrSrc = dataItem.wgwQrCode;
                break;
              default:
                if (dataItem.qrCode != null && dataItem.qrCode != undefined && Utils.myTrim(dataItem.qrCode + "") != "")
                  qrSrc = dataItem.qrCode;
                break;
            }

            if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
              remark = dataItem.remark;
            if (dataItem.supplier != null && dataItem.supplier != undefined && Utils.myTrim(dataItem.supplier + "") != "")
              supplier = dataItem.supplier;
            if (dataItem.photos != null && dataItem.photos != undefined && Utils.myTrim(dataItem.photos + "") != "") {
              photosString = "";
              photosString = dataItem.photos;
              photosTemp = [];
              photosTemp = photosString.split(",");
              if (photosTemp.length > 0) {
                for (var n = 0; n < photosTemp.length; n++) {
                  // 判断是否是视频地址
                  photosString = photosTemp[n].toLowerCase();
                  if (!Utils.isNull(photosString) && (photosString.endsWith(".png") || photosString.endsWith(".jpg") || photosString.endsWith(".jpeg"))) {
                    photos.push(app.getSysImgUrl(photosTemp[n]));
                    if (Utils.myTrim(photosTemp[n] + "").indexOf("images/noimg.png") <= -1 && !isSetFirstPhoto) {
                      proFirstPhoto = photosTemp[n];
                      isSetFirstPhoto = true;
                    }
                  } else if (!Utils.isNull(photosString)) {
                    videoList.push({
                      src: photosTemp[n],
                      poster: photosTemp.length > 1 ? photosTemp[n + 1] : ""
                    });
                  }
                }
              }
            }

            isHavePhoto = photos.length > 0 ? true : isHavePhoto;

            if (dataItem.detailPhotos != null && dataItem.detailPhotos != undefined && Utils.myTrim(dataItem.detailPhotos + "") != "") {
              photosString = "";
              photosString = dataItem.detailPhotos;
              introductionImgs = [];
              introductionImgs = photosString.split(",");
              if (introductionImgs.length > 0) {
                for (var n = 0; n < introductionImgs.length; n++) {
                  if (introductionImgs[n] != null && introductionImgs[n] != undefined && Utils.myTrim(introductionImgs[n]) != "")
                    introductionImgs[n] = app.getSysImgUrl(introductionImgs[n]);
                }
              }
            }

            if (dataItem.detail != null && dataItem.detail != undefined && dataItem.detail.length > 0) {
              var dlistItem = null,
                detailItem = null;
              for (var i = 0; i < dataItem.detail.length; i++) {
                detailItem = dataItem.detail[i];
                dlistItem = null;
                productDetailId = "";
                photosString = "";
                groupMoney = 0.00;
                status = 0;
                specPhotos = [];
                attributeOne = "";
                attributeTwo = "";
                sourcePrice = 0.00;
                sellPrice = 0.00;
                channelPrice = 0.00;
                dScore = 0;
                dShelfStatus = 0;
                detailPhoto = [];
                discountPrice = 0.00;
                couponPrice = 0.00;
                isShowPrice1 = false;
                isShowPrice2 = false;
                isShowPrice3 = false;
                discountType = 0;
                stock = 0.00;
                strStock = "0";
                sofeNum = 0;
                sn = 0;
                optimalPrice = 0.00;
                optimalPriceName = "现价";
                isSChgPrice = false;
                isCouponPrice = false;
                if (detailItem.stock != null && detailItem.stock != undefined && Utils.myTrim(detailItem.stock + "") != "" && Utils.myTrim(detailItem.stock + "null") != "") {
                  try {
                    stock = parseInt(detailItem.stock);
                    stock = isNaN(stock) ? 0 : stock;
                    stock = stock <= 0 ? 0 : stock;
                    strStock = stock + "";
                  } catch (err) {}
                }
                if (detailItem.sofeNum != null && detailItem.sofeNum != undefined && Utils.myTrim(detailItem.sofeNum + "") != "") {
                  try {
                    sofeNum = parseInt(detailItem.sofeNum);
                    sofeNum = isNaN(sofeNum) ? 0 : sofeNum;
                  } catch (err) {}
                }
                if (detailItem.sn != null && detailItem.sn != undefined && Utils.myTrim(detailItem.sn + "") != "") {
                  try {
                    sn = parseInt(detailItem.sn);
                    sn = isNaN(sn) ? 0 : sn;
                  } catch (err) {}
                }
                if (detailItem.score != null && detailItem.score != undefined && Utils.myTrim(detailItem.score + "") != "") {
                  try {
                    dScore = parseInt(detailItem.score);
                    dScore = isNaN(dScore) ? 0 : dScore;
                  } catch (err) {}
                }
                if (detailItem.groupMoney != null && detailItem.groupMoney != undefined && Utils.myTrim(detailItem.groupMoney + "") != "null") {
                  try {
                    groupMoney = parseFloat(detailItem.groupMoney);
                    groupMoney = isNaN(groupMoney) ? 0.00 : groupMoney;
                  } catch (err) {}
                }
                if (detailItem.photos != null && detailItem.photos != undefined && Utils.myTrim(detailItem.photos + "") != "" && Utils.myTrim(detailItem.photos + "") != "null") {
                  photosString = "";
                  photosString = detailItem.photos;
                  detailPhoto = [];
                  detailPhoto = photosString.split(",");
                  if (detailPhoto.length > 0) {
                    for (var n = 0; n < detailPhoto.length; n++) {
                      if (detailPhoto[n] != null && detailPhoto[n] != undefined && Utils.myTrim(detailPhoto[n]) != "")
                        detailPhoto[n] = app.getSysImgUrl(detailPhoto[n]);
                      else
                        detailPhoto[n] = defaultItemImgSrc;
                    }
                  }
                }
                isHavePhoto = detailPhoto.length > 0 ? true : isHavePhoto;

                if (detailItem.status != null && detailItem.status != undefined && Utils.myTrim(detailItem.status + "") != "") {
                  try {
                    dShelfStatus = parseInt(detailItem.status);
                    dShelfStatus = isNaN(dShelfStatus) ? 0 : dShelfStatus;
                  } catch (err) {}
                }
                if (detailItem.id != null && detailItem.id != undefined && Utils.myTrim(detailItem.id + "") != "")
                  productDetailId = detailItem.id;
                if (Utils.myTrim(proSDetailId) != "" && Utils.myTrim(proSDetailId) == Utils.myTrim(productDetailId)) selDIndex = i;
                if (detailItem.attributeOne != null && detailItem.attributeOne != undefined && Utils.myTrim(detailItem.attributeOne + "") != "")
                  attributeOne = detailItem.attributeOne;
                if (detailItem.attributeTwo != null && detailItem.attributeTwo != undefined && Utils.myTrim(detailItem.attributeTwo + "") != "")
                  attributeTwo = detailItem.attributeTwo;
                /////////////////////////////////////////////////////////////////////////////
                //----------------价格处理----------------------------------------------------
                //原价
                if (detailItem.price != null && detailItem.price != undefined && Utils.myTrim(detailItem.price + "") != "") {
                  try {
                    sourcePrice = parseFloat(detailItem.price);
                    sourcePrice = isNaN(sourcePrice) ? 0.00 : sourcePrice;
                  } catch (err) {}
                }
                sellPrice = sourcePrice;
                //渠道价
                if (detailItem.channelPrice != null && detailItem.channelPrice != undefined && Utils.myTrim(detailItem.channelPrice + "") != "") {
                  try {
                    channelPrice = parseFloat(detailItem.channelPrice);
                    channelPrice = isNaN(channelPrice) ? 0.00 : channelPrice;
                    if (channelPrice > 0.00) {
                      sourcePrice = channelPrice;
                      sellPrice = sourcePrice;
                    }
                  } catch (err) {}
                }
                //劵后价couponMold = 0, couponfull=0.00;
                if (coupondist > 0.00 && coupondist < sellPrice) {
                  couponPrice = sellPrice - coupondist;
                  if (couponPrice > 0.00) {
                    isShowPrice1 = true;
                    couponPrice = parseFloat((couponPrice).toFixed(app.data.limitQPDecCnt));
                  }
                }

                //特惠价或套装价
                if (detailItem.way != null && detailItem.way != undefined && Utils.myTrim(detailItem.way + "") != "") {
                  try {
                    discountType = parseInt(detailItem.way);
                    discountType = isNaN(discountType) ? 0 : discountType;

                    if (detailItem.discount != null && detailItem.discount != undefined && Utils.myTrim(detailItem.discount + "") != "") {
                      try {
                        discountPrice = parseFloat(detailItem.discount);
                        discountPrice = isNaN(discountPrice) ? 0.00 : discountPrice;
                        discountPrice = sellPrice - discountPrice;
                        discountPrice = parseFloat((discountPrice).toFixed(app.data.limitQPDecCnt));
                        isShowPrice2 = discountPrice <= 0.00 ? false : true;
                      } catch (err) {}
                    }
                  } catch (err) {}
                }
                isShowPrice3 = couponPrice > 0.00 ? (discountPrice > 0.00 && discountType == 0 ? false : true) : false;
                //最优价计算
                optimalPrice = discountPrice > 0.00 && discountPrice < sourcePrice ? discountPrice : sourcePrice;
                if (optimalPrice > 0.00) {
                  if (isShowPrice3 && optimalPrice > couponPrice) {
                    optimalPriceName = "劵后价";
                    optimalPrice = couponPrice;
                    isCouponPrice = true;
                  } else if (optimalPrice < sourcePrice) {
                    optimalPriceName = discountType == 0 ? "特惠价" : "套装价";
                  } else
                    optimalPriceName = "现价";
                } else {
                  optimalPriceName = "现价";
                  optimalPrice = sourcePrice;
                }

                dlistItem = {
                  productDetailId: productDetailId,
                  specPhotos: specPhotos,
                  attributeOne: attributeOne,
                  attributeTwo: attributeTwo,
                  isHaveTwo: Utils.myTrim(attributeTwo) != "" ? true : false,
                  sourcePrice: parseFloat(sourcePrice.toFixed(app.data.limitQPDecCnt)), //渠道价
                  detailPhoto: detailPhoto,
                  stock: stock,
                  strStock: strStock,
                  sn: sn,
                  isDel: false,
                }
                productDetailList.push(dlistItem);
              }
            }
            shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
            if (isHavePhoto && photos != null && photos.length <= 0 && productDetailList != null && productDetailList.length > 0) {
              for (var n = 0; n < productDetailList.length; n++) {
                if (productDetailList[n].detailPhoto != null && productDetailList[n].detailPhoto.length > 0) photos.push(productDetailList[n].detailPhoto[0])
              }
            }
            if (introductionImgs.length > 0) {
              var introductionImgsTemp = introductionImgs;
              introductionImgs = [];

              for (var k = 0; k < introductionImgsTemp.length; k++) {
                introductionImgs.push({
                  src: introductionImgsTemp[k],
                  isShow: false
                });
              }
            }
            if (photos.length > 0) {
              var photosTemp = photos;
              photos = [];

              for (var k = 0; k < photosTemp.length; k++) {
                if (k == 0)
                  photos.push({
                    src: photosTemp[k],
                    isShow: true
                  });
                else
                  photos.push({
                    src: photosTemp[k],
                    isShow: false
                  });
              }
            }

            var proDataInfo = {
              pid: pid,
              cardId: dataItem.cardId,
              productId: productId,
              productName: Utils.myTrim(productName) != "" ? productName : remark,
              secondProductName: secondProductName,
              paroductNo: paroductNo,
              shopId: shopId,
              photos: photos,
              productDetailList: productDetailList,
              remark: remark,
              shelfStatus: shelfStatus,
              introductionImgs: introductionImgs,
              mold: mold,
              videoList: videoList,
              productTypeId: productTypeId,
              sort: sort,
              // createBy: createBy,
            }
            if (Utils.myTrim(proDataInfo.productId) == "") {
              wx.showModal({
                title: '提示',
                content: '该商品已无效！点确定返回商城首页。',
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../../' + app.data.storeShareMainPage,
                    })
                  } else if (res.cancel) {
                    wx.reLaunch({
                      url: "../../../" + app.data.sysMainPage,
                    })
                  }
                }
              })
            } else {
              proHeadPhotoList = [];
              if (proDataInfo.productDetailList != null && proDataInfo.productDetailList != undefined && proDataInfo.productDetailList.length > 0) {
                for (var n = 0; n < proDataInfo.productDetailList.length; n++) {
                  if (proDataInfo.productDetailList[n].detailPhoto != null && proDataInfo.productDetailList[n].detailPhoto != undefined && proDataInfo.productDetailList[n].detailPhoto.length > 0 && Utils.myTrim(proDataInfo.productDetailList[n].detailPhoto[0]) != "") {
                    proHeadPhotoList.push(proDataInfo.productDetailList[n].detailPhoto[0])
                  } else {
                    proHeadPhotoList.push(defaultItemImgSrc)
                  }
                }
              }
              if ((proHeadPhotoList == null || proHeadPhotoList == undefined || proHeadPhotoList.length <= 0) && (proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0)) {
                for (var k = 0; k < proDataInfo.photos.length; k++) {
                  proHeadPhotoList.push(proDataInfo.photos.src)
                }
              }
              var shareWXImg = proHeadPhotoList != null && proHeadPhotoList != undefined && proHeadPhotoList.length > 0 ? proHeadPhotoList[0] : that.data.shareWXImg;
              if (that.data.selProcuctTypeList != null && that.data.selProcuctTypeList != undefined && that.data.selProcuctTypeList.length > 0) {
                for (let n = 0; n < that.data.selProcuctTypeList.length; n++) {
                  if (that.data.selProcuctTypeList[n].id == proDataInfo.productTypeId) {
                    selProductTypeIndex = n;
                    break;
                  }
                }
              }
              that.setData({
                selCompanydataIndex: selCompanydataIndex,
                isShopProduct: isShopProduct,
                suitableProductList: suitableProductList,
                saleStatusList: saleStatusList,
                proDataInfo: proDataInfo,
                selDIndex: selDIndex,
                proFirstPhoto: proFirstPhoto,
                proHeadPhotoList: proHeadPhotoList,
                isHideGroup: groupmold == 8 ? false : true,

                selProductTypeIndex: selProductTypeIndex,
                selProductTypeIDParam: proDataInfo.productTypeId,
              }, that.lazyLoadImg)
            }
            if (!Utils.isNull(proDataInfo.cardId) && proDataInfo.cardId != 0) {
              that.getCardDetail(proDataInfo.cardId)
            }
            console.log("商品详情：", proDataInfo)
            console.log("商品图片：", proHeadPhotoList)
            // 团购商品
            if (groupmold == 8) {
              // timeOutPOrder = setTimeout(that.getProductOrder, 1500)
            }

            // 获取商品分类并选中
            that.getProductTypeList()

          } else {
            wx.showToast({
              title: "没有商品记录信息！",
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "获取商品详情：失败！错误信息：" + JSON.stringify(res), SMURL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品详情接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品详情接口调用：失败！错误信息：" + JSON.stringify(err), SMURL + urlParam, false);
      }
    })
  },
  //方法：IntersectionObserver 对象懒加载图片
  lazyLoadImg: function () {
    var that = this;
    app.lazyLoadImgList(that, that.data.proDataInfo.photos, "img_toplist", "proDataInfo.photos");
    app.lazyLoadImgList(that, that.data.proDataInfo.introductionImgs, "img_introduce", "proDataInfo.introductionImgs");
  },

  //事件：返回
  returnBack: function () {
    // let that = this,
    //   proDataInfo = that.data.proDataInfo,
    //   status = 0,
    //   url = "";
    // if (proDataInfo != null && proDataInfo != undefined) status = proDataInfo.status;

    // url = packHotelPageUrl + "/9niumyfabu/9niumyfabu?inftype=0&status=" + status;
    // console.log("returnBack:" + url)
    wx.navigateBack({
      delta: 1,
    });
  },
  //////////////////////////////////////////////////////////////////////////
  //事件：页面控件值变更事件
  changeValueMainData: function (e) {
    var that = this;
    if (that.data.disabled) return;

    console.log("changeValueMainData----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value,
      setValue = null,
      setKey = "";
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "productName":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.max_name) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.max_name + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        setValue = value;
        setKey = "proDataInfo.productName";
        break;
      case "secondProductName":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.max_name) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.max_name + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        setValue = value;
        setKey = "proDataInfo.secondProductName";
        break;
      case "paroductNo":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.max_no) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.max_no + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        setValue = value;
        setKey = "proDataInfo.paroductNo";
        break;
      case "sort":
        if (Utils.myTrim(value) != "") {
          try {
            setValue = parseInt(value);
            setValue = isNaN(setValue) ? 0 : setValue;
          } catch (e) {}
        }
        setValue = value;
        setKey = "proDataInfo.sort";
        break;
      case "remark":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.max_remark) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.max_remark + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        setValue = value;
        setKey = "proDataInfo.remark";
        break;
      case "DetailSourcePrice":
        let index = 0;
        try {
          index = parseInt(e.currentTarget.dataset.index);
          index = isNaN(index) ? 0 : index;
        } catch (err) {}
        if (Utils.myTrim(value) != "") {
          try {
            setValue = parseFloat(value);
            setValue = isNaN(setValue) ? 0.00 : setValue;
            setValue = parseFloat(setValue.toFixed(app.data.limitQPDecCnt));
          } catch (e) {}
        }
        setValue = value;
        setKey = "proDataInfo.productDetailList[" + index + "].sourcePrice";
        break;
      case "editSpecsName":
        if (Utils.myTrim(value) != "") {
          //最多字数限制
          if (len > that.data.max_name) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.max_name + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
        }
        setValue = value;
        setKey = "editSpecsName";
        break;
      case "editSpecsSourcePrice":
        if (Utils.myTrim(value) != "") {
          try {
            setValue = parseFloat(value);
            setValue = isNaN(setValue) ? 0.00 : setValue;
            setValue = parseFloat(setValue.toFixed(app.data.limitQPDecCnt));
          } catch (e) {}
        }
        setValue = value;
        setKey = "editSpecsSourcePrice";
        break;
      case "editSpecsStock":
        if (Utils.myTrim(value) != "") {
          try {
            setValue = parseFloat(value);
            setValue = isNaN(setValue) ? 0.00 : setValue;
            setValue = parseFloat(setValue.toFixed(app.data.limitQPDecCnt));
          } catch (e) {}
        }
        setValue = value;
        setKey = "editSpecsStock";
        break;
      case "mold":
        if (Utils.myTrim(value) != "") {
          try {
            setValue = parseInt(value);
            setValue = isNaN(setValue) ? 0 : setValue;
          } catch (e) {}
        }
        setValue = value;
        setKey = "proDataInfo.mold";
        break;
    }
    that.setData({
      [setKey]: setValue
    })
  },
  //--------产品详情中textarea会跟随滚动处理--------------------------------
  outRemark: function () {
    var that = this;
    that.setData({
      showPDRemark: false,
    })
  },
  enterRemark: function () {
    var that = this;
    if (that.data.productDisabled) return;
    that.setData({
      showPDRemark: true,
    })
  },
  //事件：商品类型选择
  bindPickerProductTypeChange: function (e) {
    let that = this,
      index = 0,
      selProductTypeIDParam = 0,
      selProcuctTypeList = that.data.selProcuctTypeList;
    try {
      index = parseInt(e.detail.value);
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      selProductTypeIndex: index,
      selProductTypeIDParam: selProcuctTypeList[index].id,
      selProductTypeNameParam: selProcuctTypeList[selProductTypeIDParam].name,
    })
  },
  /**
   * 选择酒店公司/商品分类
   */
  bindPickerCompanyChange: function (e) {
    let index = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    switch (tag) {
      case 0:
        that.setData({
          selCompanydataIndex: index,
        })
        that.getProductTypeList()
        break;
      case 1:
        that.setData({
          selProductTypeIndex: index,
        })
        break;
      default:
        break;
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function (e) {
    let that = this,
      sType = 0,
      proDataInfo = that.data.proDataInfo,
      maxPhoImgCnt = that.data.maxPhoImgCnt,
      finishedPhoImgCnt = 0,
      enablePhoImgCnt = 0,
      maxIntImgCnt = that.data.maxIntImgCnt,
      finishedIntImgCnt = 0,
      enableIntImgCnt = 0;
    //sType:0顶部图片，1介绍图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) {}
    }
    that.data.isForbidRefresh = true;
    switch (sType) {
      //顶部图片多图上传
      case 0:
        finishedPhoImgCnt = proDataInfo != null && proDataInfo != undefined && proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0 ? proDataInfo.photos.length : 0;
        enablePhoImgCnt = maxPhoImgCnt - finishedPhoImgCnt;
        app.uploadCompressImg(that, sType, finishedPhoImgCnt, maxPhoImgCnt, "imgCompressCanvas")
        break;

        //介绍图片多图上传
      case 1:
        finishedIntImgCnt = proDataInfo != null && proDataInfo != undefined && proDataInfo.introductionImgs != null && proDataInfo.introductionImgs != undefined && proDataInfo.introductionImgs.length > 0 ? proDataInfo.introductionImgs.length : 0;
        enableIntImgCnt = maxIntImgCnt - finishedIntImgCnt;
        app.uploadCompressImg(that, sType, finishedIntImgCnt, maxIntImgCnt, "imgCompressCanvas")
        break;
        //规格图片多图上传
      case 10:
        let editSpecsPhoto = that.data.editSpecsPhoto;
        finishedIntImgCnt = editSpecsPhoto != null && editSpecsPhoto != undefined && editSpecsPhoto.length > 0 ? editSpecsPhoto.length : 0;
        enableIntImgCnt = maxIntImgCnt - finishedIntImgCnt;
        app.uploadCompressImg(that, sType, finishedIntImgCnt, maxIntImgCnt, "imgCompressCanvas")
        break;

        //单图片上传
      default:
        app.uploadCompressImg(that, sType, 0, 1, "imgCompressCanvas")
        break;
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    let that = this,
      proDataInfo = that.data.proDataInfo,
      imgArray = [],
      setDataKey = "";
    //sType:0顶部图片，1介绍图片
    switch (sType) {
      case 0:
        imgArray = proDataInfo.photos;
        imgArray.push({
          src: imgUrl,
          isShow: true
        });
        setDataKey = "proDataInfo.photos"
        break;
      case 1:
        imgArray = proDataInfo.introductionImgs;
        imgArray.push({
          src: imgUrl,
          isShow: true
        });
        setDataKey = "proDataInfo.introductionImgs"
        break;
      case 10:
        imgArray = that.data.editSpecsPhoto;
        imgArray.push(imgUrl);
        setDataKey = "editSpecsPhoto"
        break;
    }
    that.setData({
      [setDataKey]: imgArray,
    })
  },
  //事件：删除其他图片
  delrbImgList: function (e) {
    let that = this,
      proDataInfo = that.data.proDataInfo,
      tag = 0,
      imgArray = [],
      setDataKey = "";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) {}
    let index = e.currentTarget.dataset.index;
    //tag:0顶部图片，1介绍图片
    switch (tag) {
      case 0:
        imgArray = proDataInfo.photos;
        imgArray.splice(index, 1);
        setDataKey = "proDataInfo.photos"
        break;
      case 1:
        imgArray = proDataInfo.introductionImgs;
        imgArray.splice(index, 1);
        setDataKey = "proDataInfo.introductionImgs"
        break;
      case 10:
        imgArray = that.data.editSpecsPhoto;
        imgArray.splice(index, 1);
        setDataKey = "editSpecsPhoto"
        break;
    }
    that.setData({
      [setDataKey]: imgArray,
    })
  },
  ////////////////////////////////////////////////////////////////
  //--------规格弹窗----------------------------------------------
  hideSpecsPop: function () {
    this.setData({
      isShowSpecsPop: false
    })
  },
  showSpecsPop: function (e) {
    let that = this,
      index = -1;
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? -1 : index;
    } catch (err) {}
    this.setData({
      editSpecsName: "",
      editSpecsSourcePrice: 0.00,
      editSpecsStock: 0.00,
      editSpecsPhoto: [],
      editIndex: index,

      isShowSpecsPop: true
    })
  },
  //事件：删除规格
  delSpecsList: function (e) {
    let that = this,
      index = 0,
      setKey = "";
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    wx.showModal({
      title: '系统消息',
      content: "您确定删除该规格吗？",
      icon: 'none',
      duration: 1500,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          console.log("cancel more del")
        } else {
          //点击确定
          console.log("sure more del")
          setKey = "proDataInfo.productDetailList[" + index + "].isDel";
          that.setData({
            [setKey]: true,
          })
        }
      },
    })
  },
  //事件：规格弹窗提交事件
  submitSpecsPop: function (e) {
    let that = this,
      proDataInfo = that.data.proDataInfo,
      productDetailList = proDataInfo.productDetailList,
      dlistItem = null,
      editIndex = that.data.editIndex,
      editSpecsName = that.data.editSpecsName,
      editSpecsSourcePrice = that.data.editSpecsSourcePrice,
      editSpecsStock = that.data.editSpecsStock,
      editSpecsPhoto = that.data.editSpecsPhoto,
      setKey = "";

    if (Utils.myTrim(editSpecsName) == "") {
      wx.showToast({
        title: "规格名称不能为空！",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    dlistItem = {
      productDetailId: '',
      specPhotos: [],
      attributeOne: editSpecsName,
      attributeTwo: '',
      isHaveTwo: false,
      sourcePrice: editSpecsSourcePrice, //渠道价
      detailPhoto: editSpecsPhoto,
      stock: editSpecsStock,
      strStock: editSpecsStock + "",
      sn: 0,
      isDel: false,
    }
    productDetailList.push(dlistItem);
    setKey = "proDataInfo.productDetailList";
    that.setData({
      [setKey]: productDetailList,
      ["editSpecsPhoto"]: [],
      isShowSpecsPop: false,
    })
  },
  //事件：点击勾选框
  clickCheckbox: function () {
    this.setData({
      isAgreTreaty: !this.data.isAgreTreaty
    })
  },
  //事件：保存商品事件
  submitProductInfo: function (e) {
    let that = this,
      proDataInfo = that.data.proDataInfo,
      isAgreTreaty = that.data.isAgreTreaty;
    var pagetype = that.data.pagetype
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中......",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!isAgreTreaty) {
      wx.showToast({
        title: '请阅读协议并同意！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (Utils.myTrim(proDataInfo.productName) == "") {
      wx.showToast({
        title: "商品名称不能为空！",
        icon: 'none',
        duration: 1500
      })
      return;
    }

    if (0 == pagetype) {
      if (Utils.isNull(proDataInfo.productDetailList) || (Utils.isNotNull(proDataInfo.productDetailList) && proDataInfo.productDetailList.length <= 0)) {
        wx.showToast({
          title: "商品规格不能为空！",
          icon: 'none',
          duration: 1500
        })
        return;
      }
    }

    if (that.data.selProcuctTypeList.length == 0) {
      wx.showToast({
        title: "商品分类不能为空,请返回上级页面添加分类",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // if (that.data.selProductTypeIDParam == 0) {
    //   wx.showToast({
    //     title: "请选择商品类型！",
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return;
    // }

    var cardItem = that.data.cardItem
    // if ("" == cardItem) {
    //   wx.showToast({
    //     title: "请选择名片",
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return
    // }
    let tag = 0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) {}
    // 1下架 0上架
    tag = tag == 1 ? 0 : 1;
    // proDataInfo.status = tag;

    // 获取上下架状态
    for (let i = 0; i < that.data.saleStatusList.length; i++) {
      const saleStatus = that.data.saleStatusList[i];
      if (saleStatus.checked) {
        proDataInfo.status = saleStatus.value
        tag = saleStatus.value
        break
      }
    }

    let product = null,
      productDetail = [],
      item = null,
      dlistItem = null,
      photoSrcValue = "",
      introductionImgsSrcValue = "",
      photoSrc = [],
      introductionImgsSrc = [],
      delDetailIDList = "",
      detailPhotoStr = "";
    if (proDataInfo.productDetailList != null && proDataInfo.productDetailList != undefined && proDataInfo.productDetailList.length > 0) {
      for (let i = 0; i < proDataInfo.productDetailList.length; i++) {
        dlistItem = null;
        item = null;
        item = proDataInfo.productDetailList[i];
        if (item.isDel && Utils.myTrim(item.productDetailId) != '') {
          delDetailIDList += Utils.myTrim(delDetailIDList) != '' ? ",'" + item.productDetailId +
            "'" : "'" + item.productDetailId + "'";
        } else {
          detailPhotoStr = "";
          if (item.detailPhoto != null && item.detailPhoto != undefined && item.detailPhoto.length > 0) {
            detailPhotoStr = item.detailPhoto.join(',');
          }
          dlistItem = {
            id: item.productDetailId,
            productId: proDataInfo.productId,
            attributeOne: item.attributeOne,
            sn: item.sn,
            price: item.sourcePrice,
            stock: item.stock,
            photos: detailPhotoStr,
          }
          productDetail.push(dlistItem);
        }
      }
    }
    if (proDataInfo.photos != null && proDataInfo.photos != undefined && proDataInfo.photos.length > 0) {
      for (let i = 0; i < proDataInfo.photos.length; i++) {
        photoSrc.push(proDataInfo.photos[i].src);
      }
      photoSrcValue = photoSrc.join(',');
    }
    if (proDataInfo.introductionImgs != null && proDataInfo.introductionImgs != undefined && proDataInfo.introductionImgs.length > 0) {
      for (let i = 0; i < proDataInfo.introductionImgs.length; i++) {
        introductionImgsSrc.push(proDataInfo.introductionImgs[i].src);
      }
      introductionImgsSrcValue = introductionImgsSrc.join(',');
    }

    if (0 == pagetype) {
      if (!Utils.isNotNull(productDetail) || productDetail.length <= 0) {
        wx.showToast({
          title: "商品规格不能为空！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    } else if (2 == pagetype) {
      if (!Utils.isNotNull(that.data.models) || that.data.models.length <= 0) {
        wx.showToast({
          title: "商品规格不能为空！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }

    var companyId = that.data.companyId
    if (Utils.isNull(companyId)) {
      companyId = proDataInfo.shopId
    }

    if (that.data.CompanydataList.length == 0) {
      wx.showToast({
        title: "请选择酒店",
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // 绑定的酒店id
    companyId = that.data.CompanydataList[that.data.selCompanydataIndex].id

    var mold = proDataInfo.mold
    // 不同角色计算购物分成
    if (that.data.user_roleId == 2) {
      mold = 70
      if (that.data.isShopProduct) {
        mold = 80
      }
    } else if (that.data.user_roleId == 4) {
      mold = 71
      if (that.data.isShopProduct) {
        mold = 81
      }
    }

    var suitableProductList = that.data.suitableProductList


    isDowithing = true;

    // 商品
    if (0 == pagetype) {
      for (let i = 0; i < suitableProductList.length; i++) {
        if (suitableProductList[i].checked) {
          mold = mold + "" + suitableProductList[i].mold
          break
        }
      }
      product = {
        id: proDataInfo.productId,
        pid: proDataInfo.pid,
        cardId: Utils.isNotNull(cardItem) ? cardItem.id : 0,
        companyId: companyId,
        // 商品分类id
        productTypeId: that.data.selProcuctTypeList[that.data.selProductTypeIndex].id,
        // productTypeId: 0,
        // 1商品  2房源 5饮品
        type: 1,
        productName: proDataInfo.productName,
        // 商品编号
        address: proDataInfo.paroductNo,
        photos: photoSrcValue,
        status: tag,
        sort: proDataInfo.sort,
        mold: mold,
        remark: proDataInfo.remark,
        detailPhotos: introductionImgsSrcValue,
        secondProductName: proDataInfo.secondProductName,
        productDetail: productDetail,
        delDetailIDList: delDetailIDList,
        // createBy: proDataInfo.createBy,
      }

      that.setData({
        ["proDataInfo"]: proDataInfo,
      })
      that.saveMainDataList(product);
    }
    // 饮品
    else if (2 == pagetype) {
      mold = 9
      var displayType = 0
      // 图片显示类型：0.默认（小图）；1.大图；2杯图(打印杯子图案)
      var photoType = 0
      for (let i = 0; i < suitableProductList.length; i++) {
        let suitable = suitableProductList[i]
        if (suitable.checked) {
          mold = mold + "" + suitable.mold
          // 组合券商品 赠送商品
          if (suitable.value == 1) {
            // displayType=2 组合券商品
            displayType = 2
            mold = suitable.mold
          } else if (suitable.value == 2) {
            photoType = 2
          }
        }
      }
      product = [{
        id: proDataInfo.productId,
        // pid: proDataInfo.pid,
        // cardId: Utils.isNotNull(cardItem) ? cardItem.id : 0,
        companyId: companyId,
        // 商品分类id
        productTypeId: that.data.selProcuctTypeList[that.data.selProductTypeIndex].id,
        // productTypeId: 0,
        // 1商品  2房源 5饮品
        // 不区分商品 饮品 用mold区分
        type: 1,
        productName: proDataInfo.productName,
        // 商品编号
        address: proDataInfo.paroductNo,
        photos: photoSrcValue,
        status: tag,
        sort: proDataInfo.sort,
        // 饮品
        mold: mold,
        displayType: displayType,
        remark: proDataInfo.remark,
        detailPhotos: introductionImgsSrcValue,
        // secondProductName: proDataInfo.secondProductName,
        detail: that.data.models,
        photoType: photoType,
        // delDetailIDList: delDetailIDList,
        // createBy: proDataInfo.createBy,      
      }]

      that.setData({
        ["proDataInfo"]: proDataInfo,
      })
      that.saveProducts(product, 0);
    }
  },
  /**
   * 上传更新饮品 0添加、更新 1删除
   */
  saveProducts: function (data, tag) {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var userId = appUserInfo.userId
    var signParam = "cls=product_goodtype&action=SaveProducts&appId=" + app.data.appid + "&timestamp=" + timestamp + "&userby=" + userId
    app.doPostData(this, app.getUrlAndKey.smurl, signParam, "data", data, "", tag, "上传更新饮品")
  },
  postRuslt: function (data, code, error, tag) {
    var that = this
    isDowithing = false;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 1500
            })
            //当前页面
            var pages = getCurrentPages();
            //上一页面
            var prevPage = pages[pages.length - 2];
            //直接给上一个页面赋值
            prevPage.setData({
              loadData: true
            });
            setTimeout(that.returnBack, 1500)
            break;
          case 1:
            wx.showToast({
              title: "删除成功",
              icon: 'none',
              duration: 1500
            })
            that.setData({
              category: false,
            })
            setTimeout(function () {
              that.queryProducts(that.data.proId)
            }, 1800)
            break
        }
        break;
      default:
        console.log(error)
        break
    }
  },
  //方法：保存商品信息
  saveMainDataList: function (productJsObj) {
    let that = this;
    wx.showLoading({
      title: "数据保存中...",
    })
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let urlParam = "",
      sign = "",
      operationParam = "&operation=0";
    urlParam = "cls=main_mallProduct&action=saveMallProduct&userId=" + userId + "&xcxAppId=" + app.data.wxAppId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + operationParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(JSON.stringify(productJsObj));
    wx.request({
      url: URL + urlParam,
      method: "POST",
      data: {
        productjson: JSON.stringify(productJsObj)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("商品保存结果：")
        console.log(res.data)
        wx.hideLoading();
        isDowithing = false;
        if (res.data.rspCode == 0) {
          let proId = 0,
            mainTypePId = that.data.mainTypePId,
            mainTypeId = that.data.mainTypeId,
            proDataInfo = that.data.proDataInfo;
          try {
            if (Utils.isNotNull(res.data.data)) {
              proId = parseInt(res.data.data.productpid);
              proId = isNaN(proId) ? 0 : proId;
            }
          } catch (e) {}
          that.setData({
            proId: proId,
          })
          wx.showToast({
            title: "操作成功",
            icon: 'none',
            duration: 1500
          })
          //当前页面
          var pages = getCurrentPages();
          //上一页面
          var prevPage = pages[pages.length - 2];
          //直接给上一个页面赋值
          prevPage.setData({
            loadData: true
          });
          setTimeout(that.returnBack, 1600)
          // let otherParam = "&redEnvelopeType=2&productId=" + proId + "&productTypeId=" + mainTypeId + "&title=" + encodeURIComponent(proDataInfo.productName);
          // app.insertInventedRedEnvelope(that, otherParam);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "商品详情保存：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        isDowithing = false;
        wx.hideLoading();
        wx.showToast({
          title: "商品详情保存接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "商品详情保存接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：插入虚拟红包记录操作结果处理函数
  dowithInsertInventedRedEnvelope: function (dataList, tag, errorInfo) {
    let that = this,
      mainTypePId = that.data.mainTypePId,
      mainTypeId = that.data.mainTypeId,
      proDataInfo = that.data.proDataInfo,
      noDataAlert = "插入虚拟红包失败！";
    switch (tag) {
      case 1:
        console.log("插入虚拟红包结果：");
        console.log(dataList);

        if (Utils.isNotNull(dataList.redEnvelope)) {
          let redEnvelopeOneMoney = 0.00;
          try {
            if (dataList.redEnvelope.redEnvelopeOneMoney != null && dataList.redEnvelope.redEnvelopeOneMoney != undefined)
              redEnvelopeOneMoney = parseFloat(dataList.redEnvelope.redEnvelopeOneMoney);
            redEnvelopeOneMoney = isNaN(redEnvelopeOneMoney) ? 0.00 : redEnvelopeOneMoney;
          } catch (e) {}
          redEnvelopeOneMoney = parseFloat(redEnvelopeOneMoney.toFixed(app.data.limitQPDecCnt));
          that.setData({
            ["isShowRedEnvelopeAlertPop"]: true,
            ["redEnvelopeOneMoney"]: redEnvelopeOneMoney,
          })
        }
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : noDataAlert;
        // if(insertIRETime<insertIRECnt){
        //   let otherParam = "&redEnvelopeType=2&productId=" + that.data.proId + "&productTypeId=" + (mainTypePId > 0 ? mainTypePId : mainTypeId) + "&title=" + encodeURIComponent(proDataInfo.productName);
        //   insertIRETime++;
        //   app.insertInventedRedEnvelope(that, otherParam);
        // }
        that.returnBack();
        break;
    }
  },

  choseTxtColor: function (e) {
    var cardIndex = e.currentTarget.dataset.index; //获取自定义的ID值
    this.setData({
      cardIndex: cardIndex
    })
  },
  hideModaltip: function () {
    this.setData({
      showCards: false
    })
  },

  // 确定
  okSelectCard: function () {
    var that = this
    that.setData({
      showCards: false,
      cardItem: that.data.cardLists[that.data.cardIndex],
    })
  },
  // 关闭协议
  hideModalserve: function () {
    this.setData({
      showModalserve: false,
    })
  },
  // 打开协议
  showModalserve: function () {
    this.setData({
      showModalserve: true,
    })
  },

  /**
   * 获取用户绑定的酒店
   */
  getHotleCompany() {
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    let signParam = 'cls=main_rolePower&action=getRolePowerPowerList&roleId=' + app.data.user_roleId
    var otherParam = "&userId=" + userId + "&pageSize=99&pageIndex=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 2, "获取用户绑定酒店")
  },

  /**
   * 获取名片
   */
  getCards: function () {
    var cardLists = this.data.cardLists
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    if (Utils.isNull(cardLists) || cardLists.length == 0) {
      var signParam = 'cls=main_user&action=myContactList&companyId=' + app.globalData.userInfo.companyId + '&userId=' + userId
      var otherParam = "&pageSize=10000&pageIndex=1"
      app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 0, "获取名片")
    } else {
      this.setData({
        showCards: true,
      })
    }
  },

  /**
   * 查询单个名片信息
   */
  getCardDetail: function (concactId) {
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    var signParam = 'cls=main_user&action=contactDetail&userId=' + userId + '&contactUserId=' + concactId
    var otherParam = "&pageSize=10000&pageIndex=1&lookType=1"
    app.doGetData(this, app.getUrlAndKey.url, signParam, otherParam, 1, "查询单个名片信息")
  },

  /**
   * 获取保存的模板
   */
  getModelList() {
    let signParam = 'cls=product_goodtype&action=QueryProducts'
    var userId = appUserInfo.userId
    var otherParam = "&istemplet=1&companyId=" + app.data.companyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 3, "获取保存的模板")
  },

  /**
   * 获取饮品商品详情
   */
  queryProducts(productId) {
    let signParam = 'cls=product_goodtype&action=QueryProducts'
    // displayType不管是不是组合赠品 和普通的都显示
    var otherParam = "&status=0,1&displayType=0,1,2&id=" + productId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 4, "获取饮品商品详情")
  },

  getRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          // 获取名片
          case 0:
            let cardLists = data.mydataList
            if (Utils.isNull(cardLists) || cardLists.length == 0) {
              wx.showToast({
                title: "暂无名片！",
                icon: 'none',
                duration: 1500
              })
              return
            }
            that.setData({
              cardLists: cardLists,
              showCards: true,
            })
            break
            // 查询单个名片信息
          case 1:
            that.setData({
              cardItem: data.userInfo,
            })
            break
          case 2:
            that.setData({
              CompanydataList: data.CompanydataList,
            })
            if (that.data.proId > 0) {} else {
              // 要找出商品详情中的酒店才可以找该酒店的所有商品分类
              that.getProductTypeList()
            }
            break
          case 3:
            that.setData({
              modelList: data,
            })
            break
          case 4:
            that.arrangeData(data)
            break
        }
        break;
      default:
        console.log(error)
        switch (tag) {
          // 没有红包活动
          case 0:
            wx.showToast({
              title: "信息保存成功！",
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1600)
            break;
        }
        break
    }
  },

  /**
   * 处理查询后的饮品数据
   */
  arrangeData(data) {
    var that = this
    for (let i = 0; i < data.length; i++) {
      const product = data[i];
      var companyId = product.companyId;
      // 找出绑定的酒店
      var selCompanydataIndex = 0
      for (let j = 0; j < that.data.CompanydataList.length; j++) {
        var companydata = that.data.CompanydataList[j]
        if (companydata.id == companyId) {
          selCompanydataIndex = j
        }
      }

      var photos = []
      if (!Utils.isNull(product.photos)) {
        let photosString = product.photos;
        photos = photosString.split(",");
      }

      var introductionImgs = []
      if (!Utils.isNull(product.detailPhotos)) {
        let photosString = product.detailPhotos;
        introductionImgs = photosString.split(",");
      }


      if (introductionImgs.length > 0) {
        var introductionImgsTemp = introductionImgs;
        introductionImgs = [];

        for (var k = 0; k < introductionImgsTemp.length; k++) {
          introductionImgs.push({
            src: introductionImgsTemp[k],
            isShow: true
          });
        }
      }
      if (photos.length > 0) {
        var photosTemp = photos;
        photos = [];

        for (var k = 0; k < photosTemp.length; k++) {
          if (k == 0)
            photos.push({
              src: photosTemp[k],
              isShow: true
            });
          else
            photos.push({
              src: photosTemp[k],
              isShow: true
            });
        }
      }

      var suitableProductList = that.data.suitableProductList
      var mold = product.mold + ""
      for (let i = 0; i < suitableProductList.length; i++) {
        const element = suitableProductList[i];
        element.checked = false
        //displayType 展示类型: 0.热卖商品；1.推荐商品 2赠送商品、组合券
        if (element.mold == mold && product.displayType == 2) {
          element.checked = true
        }
        // 打印杯子图案
        else if (product.photoType == 2 && element.value == 2) {
          element.checked = true
        }
        // 默认无的情况 
        else if (product.photoType != 2 && mold == 9 && i == 0 && product.displayType != 2) {
          element.checked = true
        }
      }
      console.log(suitableProductList)

      //上下架状态
      let saleStatusList = that.data.saleStatusList
      for (let i = 0; i < saleStatusList.length; i++) {
        const saleStatus = saleStatusList[i];
        saleStatus.checked = false
        if (product.status == saleStatus.value) {
          saleStatus.checked = true
        }
      }

      var proDataInfo = {
        pid: product.pid,
        productId: product.id,
        productName: Utils.myTrim(product.productName),
        paroductNo: product.address,
        photos: photos,
        remark: product.remark,
        introductionImgs: introductionImgs,
        mold: mold,
        productTypeId: product.productTypeId,
        sort: product.sort,
      }

      var details = product.detail
      var models = []
      var detailId = ""
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        var prices = []
        var labels = []
        detailId = detail.id

        for (let k = 0; k < detail.labels.length; k++) {
          const label = detail.labels[k];
          if (k == 0) {
            var price = {
              price: label.lblprice
            }
            prices = prices.concat(price)

          }

          var lb = {
            id: label.id,
            available: label.available,
            detailId: label.detailId,
            lblname: label.lblname,
            lblprice: label.lblprice,
            discounts_price: label.discounts_price,
            lblsingle: label.lblsingle,
            lblsort: label.lblsort,
            // 弹窗
            type: false,
          }
          labels = labels.concat(lb)
        }

        var model = [{
          attributeOne: detail.attributeOne,
          sort: detail.sort,
          // prices: prices,
          labels: labels,
          id: detailId,
        }]
        models = models.concat(model)
      }
      console.log("规格分类", models)
      that.setData({
        ["proDataInfo"]: proDataInfo,
        selCompanydataIndex: selCompanydataIndex,
        models: models,
        suitableProductList: suitableProductList,
        saleStatusList: saleStatusList,
      })
      break
    }
    // 获取商品分类并选中
    that.getProductTypeList()
  },

  /**
   * 获取公司店铺信息
   */
  getCompany: function () {
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    var otherParam = "&userId=" + userId
    // 获取公司信息列表
    app.getCompanyMainDataInfo(this, otherParam)
  },
  dowithGetCompanyMainDataInfo(dataList, tag, errorInfo) {
    wx.hideLoading();
    let that = this;
    switch (tag) {
      case 1:
        console.log("获取公司信息", dataList)
        var companyMsg = dataList.companyMsg
        if (companyMsg.length == 0) {} else {
          var companyId = companyMsg[0].id
          that.setData({
            companyId: companyId,
          })
        }
        break;
      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取公司信息失败！";
        // wx.showToast({
        //   title: errorInfo,
        //   icon: "none"
        // })
        break;
    }
  },
  //隐藏协议
  onMyEvent(e) {
    this.setData({
      showModalserve: e.detail.myNum
    })
  },
  checkboxChange: function(e) {
    let that=this,suitableProductList=that.data.suitableProductList,selValueArray=0;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    console.log("长度:" + e.detail.value.length);
    try{
      if(Utils.isNotNull(e.detail.value) && e.detail.value.length>0 && Utils.isNotNull(suitableProductList) && suitableProductList.length>0){
        for(let j=0;j<suitableProductList.length;j++){
          suitableProductList[j].checked=false;
        }
        for(let i=0;i<e.detail.value.length;i++){
          for(let j=0;j<suitableProductList.length;j++){
            if(Utils.myTrim(e.detail.value[i])==(suitableProductList[j].value+"")){
              suitableProductList[j].checked=true;
            }
          }
        }
      }
    }catch(e){}
    this.setData({
      ["suitableProductList"]: suitableProductList,
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var tag = e.currentTarget.dataset.tag
    var name
    var items = this.data.suitableProductList
    switch (parseInt(tag)) {
      case 0:
        name = 'suitableProductList'
        break;
      case 1:
        name = 'saleStatusList'
        items = this.data.saleStatusList
        break;
      default:
        break;
    }

    for (let i = 0; i < items.length; i++) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      [name]: items
    })
  },
  /**
   * 门店标签
   */
  radioShopChange() {
    this.setData({
      isShopProduct: !this.data.isShopProduct,
    })
  },
  /*当选次数*/
  radioChoiseChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const timeChoices = this.data.timeChoices
    for (let i = 0, len = timeChoices.length; i < len; ++i) {
      timeChoices[i].checked = false
      timeChoices[i].checked = timeChoices[i].value == e.detail.value
    }
    this.setData({
      timeChoices
    })
  },
  /**
   * 切换有货 无货
   */
  setAvailable(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tempModel = that.data.tempModel
    var label = tempModel[0].labels[index]
    if (0 == label.available) {
      label.available = 1
    } else {
      label.available = 0
    }
    that.setData({
      tempModel: tempModel,
    })
  },
  getInput: function (e) {
    var that = this
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name="",index=-1,tempModel = that.data.tempModel;
    switch (tag) {
      case 0:
        try {
          index = parseInt(e.currentTarget.dataset.index);
          index = isNaN(index) ? 0 : index;
        } catch (e) {}
        tempModel[0].labels[index].lblprice = value
        name = "tempModel"
        value = tempModel
        break;
      case 2:
        try {
          index = parseInt(e.currentTarget.dataset.index);
          index = isNaN(index) ? 0 : index;
        } catch (e) {}
        tempModel[0].labels[index].discounts_price = value
        name = "tempModel"
        value = tempModel
        break;
      case 1:
        name = "modelSort"
        break;
    }
    this.setData({
      [name]: value,
    })
  },
  //下拉选择饮品分类
  onchangeCatetype() {
    this.setData({
      catetype: !this.data.catetype
    })
  },
  onchangeType(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tempModel = that.data.tempModel
    tempModel[0].labels[index].type = !tempModel[0].labels[index].type
    this.setData({
      tempModel: tempModel,
    })
  },
  //事件：新增或变更规格
  onchangeCategory(e) {
    var that = this
    if (that.data.modelList.length == 0) {
      wx.showToast({
        title: "规格模板为空,请先去创建",
        icon: "none",
        duration: 2000,
      })
      return
    }
    that.setData({
      category: !that.data.category,
      isEdittModel: false,
      // addTempModel:[],
    })
    var tag = e.currentTarget.dataset.tag
    if (0 == tag) {
      //【1】新增规格
      that.addtempModel()
    } else if (1 == tag) {
      //【2】编辑规格
      var index = e.currentTarget.dataset.index
      var tempModel = []
      tempModel = tempModel.concat(that.data.models[index])

      var selectModelIndex = that.data.selectModelIndex
      var modelList = that.data.modelList
      for (let i = 0; i < modelList.length; i++) {
        const model = modelList[i];
        if (model.attributeOne == tempModel[0].attributeOne) {
          selectModelIndex = i;
          break
        }
      }

      // 单选多选
      var timeChoices = that.data.timeChoices
      if (tempModel[0].labels.length > 0) {
        for (let i = 0; i < timeChoices.length; i++) {
          const element = timeChoices[i];
          element.checked = false
          if (element.value == tempModel[0].labels[0].lblsingle) {
            element.checked = true
          }
        }
      }

      that.setData({
        editModelIndex: index,
        tempModel: tempModel,
        isEdittModel: true,
        modelSort: that.data.models[index].sort,
        timeChoices: timeChoices,
        selectModelIndex: selectModelIndex,
      })
    }
    console.log(that.data.tempModel)
  },

  /**
   * 添加临时默认数据
   */
  addtempModel() {
    var modelList = this.data.modelList
    if (modelList.length > 0) {

      // 选择分类的index
      const model = modelList[this.data.selectModelIndex];

      if (model.labels.length == 0) {
        wx.showToast({
          title: "该分类下的规格为空",
          icon: "none",
          duration: 1500,
        })
        return
      }
      var labels = [{
        lblname: model.labels[0].lblname,
        lblprice: model.labels[0].lblprice,
        discounts_price: model.labels[0].discounts_price,
        // 有货
        available: 1,
        // 单选
        lblsingle: 1,
        lblsort: 0,
        // 弹窗
        type: false,
      }]
      var mo = [{
        attributeOne: model.attributeOne,
        labels: labels,
      }]
      this.setData({
        tempModel: mo,
      })
    } else {
      wx.showToast({
        title: "规格模板为空",
        icon: "none",
        duration: 1500,
      })
    }
  },

  /**
   * 选择分类 规格
   */
  optionTaps(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tag = e.currentTarget.dataset.tag
    switch (parseInt(tag)) {
      case 0:
        if (that.data.selectModelIndex == index) {
          that.setData({
            catetype: false,
          })
          return
        }

        that.setData({
          selectModelIndex: index,
          catetype: false,
        })
        that.addtempModel()
        break;
      case 1:
        var tempModel = that.data.tempModel
        var itemindex = e.currentTarget.dataset.itemindex
        var label = that.data.modelList[that.data.selectModelIndex].labels[itemindex]
        tempModel[0].labels[index].type = !tempModel[0].labels[index].type
        tempModel[0].labels[index].lblname = label.lblname
        tempModel[0].labels[index].lblprice = label.lblprice
        that.setData({
          tempModel: tempModel,
        })
        break
    }
  },
  /**
   * 添加规格
   */
  drinkadd() {
    var that = this
    var tempModel = that.data.tempModel
    var selectModelIndex = that.data.selectModelIndex
    var modelList = that.data.modelList
    console.log(tempModel)

    const model = modelList[selectModelIndex];

    if (model.labels.length == 0) {
      wx.showToast({
        title: "该分类下的规格为空",
        icon: "none",
        duration: 1500,
      })
      return
    }
    var labels = [{
      lblname: model.labels[0].lblname,
      lblprice: model.labels[0].lblprice,
      discounts_price: model.labels[0].discounts_price,
      // 有货
      available: 1,
      // 单选
      lblsingle: 1,
      lblsort: 0,
      // 弹窗
      type: false,
    }]
    if (tempModel.length == 0) {
      var tmodel = {
        labels: labels,
      }
      tempModel.push(tmodel)
    } else {
      tempModel[0].labels = tempModel[0].labels.concat(labels)
    }

    that.setData({
      tempModel: tempModel,
    })
  },
  /**
   * 删除规格
   */
  drinkclear(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否删除该规格?',
      success(res) {
        if (res.confirm) {
          var tempModel = that.data.tempModel
          if (Utils.isNull(tempModel[0].labels[index].id)) {
            tempModel[0].labels.splice(index, 1)
            that.setData({
              tempModel: tempModel,
            })
          } else {
            var proDataInfo = that.data.proDataInfo
            var labels = [{
              id: tempModel[0].labels[index].id,
              delete: 1
            }]
            var detail = [{
              id: tempModel[0].id,
              labels: labels,
              delete: 2,
            }]
            var product = [{
              id: proDataInfo.productId,
              detail: detail,
            }]
            that.saveProducts(product, 1);
          }

        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 删除分类labels
   */
  drinkModelclear(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否删除该分类?',
      success(res) {
        if (res.confirm) {
          var models = that.data.models
          var model = models[index]
          if (Utils.isNull(model.id)) {
            models.splice(index, 1)
            that.setData({
              models: models,
            })
          } else {
            var proDataInfo = that.data.proDataInfo
            var detail = [{
              id: model.id,
              delete: 1,
            }]
            var product = [{
              id: proDataInfo.productId,
              detail: detail,
            }]
            that.saveProducts(product, 1);
          }

        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 确认选择模板
   */
  okmodel() {
    var that = this
    var tempModel = that.data.tempModel
    var labels = tempModel[0].labels
    if (labels.length == 0) {
      wx.showToast({
        title: "规格不能为空",
        icon: "none",
        duration: 1500,
      })
      return
    }

    var models = that.data.models
    console.log("要加的数据", tempModel)

    // 单选
    var lblsingle = 1
    var timeChoices = that.data.timeChoices
    for (let i = 0; i < timeChoices.length; i++) {
      const element = timeChoices[i];
      if (element.checked) {
        lblsingle = element.value
        break
      }
    }
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      label.lblsingle = lblsingle
    }
    // 分类排序
    tempModel[0].sort = that.data.modelSort

    // 兼容 老接口 我的上传商品显示价格
    // var prices = []
    // var price = {
    //   price: labels[0].lblprice,
    // }
    // prices = prices.concat(price)
    // tempModel[0].prices = prices

    // 新增
    if (!that.data.isEdittModel) {
      models = models.concat(tempModel)
    }
    // 编辑
    else {
      models[that.data.editModelIndex] = tempModel[0]
    }

    console.log(models)

    that.setData({
      models: models,
      tempModel: [],
      category: !that.data.category,
      isEdittModel: false,
    })
  },
  emptyType() {
    this.setData({
      category: false,
    })
  }
})
// pages/seltypeproductlist/seltypeproductlist.js
const app = getApp();

var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var SMURL = app.getUrlAndKey.smurl,
  URL = app.getUrlAndKey.url,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.mdataUrl,
  pageSize = 6,
  SMDataURL = app.getUrlAndKey.dataUrl,
  defaultItemImgSrc = SMDataURL + app.data.defaultImg;
var packSMPageUrl = "../../packageSMall/pages"
var appUserInfo = app.globalData.userInfo,sOptions = null,timeOutChrAlert = null,timeOutPrintImgList=null,timeOutGetFreeOrderRCItemList=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    isLoad: false, //是否已经加载

    ProductTypeId:0,
    synImgId:0,
    synImgUrl:"",
    synImgPrice:0.00,

    dataArray: [],
    // 临时缓存数组
    tempDataArray: [],
    //购物车数量
    shoppingCartCnt: 0,
    shoppingCartAmount: 0,
    // 购物车的商品列表
    shopCarList: [],
    // 是否刷新数据
    isReData: true,

    detailType:false,
    synCouponId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    
    that.dowithParam(options);
    //判断屏幕大小
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "ios") {
          that.setData({
            systemInfo: true,
          })
        } else if (res.platform == "devtools") {
          that.setData({
            systemInfo: true,
          })
        } else if (res.platform == "android") {
          that.setData({
            systemInfo: false,
          })
        }
      }
    })
    console.log(this.data.systemInfo)
    if (this.data.differenheight > 1350 && this.data.systemInfo) {
      this.setData({
        reptype: true
      })
    }
    
  },

  //方法：分析处理参数
  dowithParam: function (options) {
    let that = this, paramShareUId = 0, isScene = false, dOptions = null;
    console.log("加载源参数：");
    console.log(options);
    //判断是否为二维码分享
    if (options != null && options != undefined && options.scene != null && options.scene != undefined) {
      isScene = true;
      let strScene = decodeURIComponent(options.scene);
      dOptions = Utils.getToJson(strScene);
      console.log("二维码参数：" + strScene);
      console.log(dOptions);
    }
    //获取分享人ID
    if (isScene) {
      sOptions = dOptions;
      that.data.isQRScene = true;
    } else {
      sOptions = options;
    }
    try {
      if (sOptions.suid != null && sOptions.suid != undefined)
        paramShareUId = parseInt(sOptions.suid);
      paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
    } catch (e) { }
    that.data.paramShareUId = paramShareUId;

    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this, isQRScene = that.data.isQRScene;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;

      default:
        appUserInfo = app.globalData.userInfo;
        console.log('=========onload============');
        let ProductTypeId=0, synImgId=0,synImgUrl="",synImgPrice=0.00;
        if (Utils.isNotNull(sOptions.pid)) {
          try {
            ProductTypeId = parseInt(sOptions.pid);
            ProductTypeId = isNaN(ProductTypeId) ? 0 : ProductTypeId;
          } catch (e) {}
        }
        if (Utils.isNotNull(sOptions.spid)) {
          try {
            synImgId = parseInt(sOptions.spid);
            synImgId = isNaN(synImgId) ? 0 : synImgId;
          } catch (e) {}
        }
        if (Utils.isNotNull(sOptions.spprice)) {
          try {
            synImgPrice = parseInt(sOptions.spprice);
            synImgPrice = isNaN(synImgPrice) ? 0.00 : synImgPrice;
          } catch (e) {}
        }
        if (Utils.isNotNull(sOptions.spurl)) {
          try {
            synImgUrl = Utils.myTrim(decodeURIComponent(sOptions.spurl));
          } catch (e) {}
        }
        that.setData({
          ["ProductTypeId"]: ProductTypeId,
          ["synImgId"]: synImgId,
          ["synImgPrice"]: synImgPrice,
          ["synImgUrl"]: synImgUrl,
        })
        that.getShopCar();
        that.getShoppingCartData();
        that.loadInitData();
        break;
    }
  },
  //事件：取消注册
  cancelRegAuthorization: function (e) {
    var that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    var that = this;
    app.getAuthorizeUserInfo(that, e);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //方法：获取购物车信息
  getShoppingCartData: function () {
    console.log("获取购物车数量")
    var that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      that.getSyncShoppingCartData();
    } else {
      var otherParam = "&shopType=3&companyId=" + app.data.agentCompanyId
      app.getShoppingCartData(that, otherParam);
    }

  },
/**
   * 购物车列表
   */
  onChagejudgment() {
    this.setData({
      judgment: !this.data.judgment,
    })
    if (this.data.judgment) {
      this.getShopCar()
    }
  },
  /**
   * 加载第一页数据
   */
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: [],
    })
    // 获取第一页列表信息
    that.data.currentPage = 1
    that.queryProducts(pageSize, that.data.currentPage);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    that.data.currentPage = currentPage
    var tips = "加载第" + (currentPage) + "页";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.queryProducts(pageSize, currentPage);
  },

  /**
   * 获取饮品商品
   */
  queryProducts(pageSize, pageIndex) {
    var that = this;

    var companyId = app.data.agentCompanyId
    // companyId = 5919
    var otherParam = that.data.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + app.data.companyId;
    var typeId = ""
    var mold = "9,70,80,71,81,705,706,715,716,805,806,815,816"
    
    // 5是饮品 1不区分饮品
    otherParam = otherParam + "&status=0&typeflag=1&typeId=" + that.data.ProductTypeId + "&mold=" + mold + "&pSize=" + pageSize + "&prices=1&pIndex=" + pageIndex
    let signParam = 'cls=product_goodtype&action=QueryProducts';

    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "获取饮品商品")
  },

  /**
   * 加减购物车
   * @param {*} productDetailId 
   * @param {*} detailLabelId 
   * @param {*} carStatus 
   * @param {*} tag 1非购物车加 2非购物车减 3购物车加 4购物车减
   */
  addShopCar(detailLabelId, carStatus, tag) {
    var userId = appUserInfo.userId
    let signParam = 'cls=product_shopCar&action=addShopCar&userId=' + userId + "&productDetailId=0"
    //  carStatus  0 加 1減  （从商品处进行加减 用于餐馆/饮品）       非必填参数 默认为0
    //  1:餐馆 2:便利店 3饮品（不传值则为商城的购物车）     非必填参数   
    var otherParam = "&detailLabelId=" + detailLabelId + "&shopType=3&carStatus=" + carStatus + "&companyId=" + app.data.agentCompanyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, tag, "加减购物车")
  },

  /**
   * 用戶购物车列表
   */
  getShopCar() {
    let that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      return;
    } else {
      var userId = appUserInfo.userId
      let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId
      var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + app.data.agentCompanyId
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 5, "用戶购物车列表")
    }
  },

  /**
   * 移除购物车中的商品 
   */
  deleteShopCarProduct(ids) {
    let that = this;
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      that.setData({
        ["shoppingCartCnt"]: 0,
        ["shoppingCartAmount"]: 0,
        ["shopCarList"]: [],
      })
      that.dealData6();
    } else {
      var userId = appUserInfo.userId
      let signParam = 'cls=product_shopCar&action=deleteShopCarProduct&ids=' + ids + "&userId=" + userId
      app.doGetData(this, app.getUrlAndKey.smurl, signParam, "", 6, "移除购物车中的商品")
    }
  },

  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        var content = ""
        switch (tag) {
          case 0:
            that.data.isLoad = true;
            that.data.isGetTypeProduct = true
            this.setProductList(data)
            break
          case 1:
            content = "加入购物车成功"
            that.setData({
              chilType: false,
              dataArray: that.data.tempDataArray,
            })
            this.getShopCar();
            that.getShoppingCartData()
            break
          case 2:
            that.setData({
              dataArray: that.data.tempDataArray,
            })
            this.getShopCar();
            that.getShoppingCartData()
            break
          case 3:
            that.setData({
              dataArray: that.data.tempDataArray,
            })
            that.getShoppingCartData()
            that.getShopCar()
            break
          case 4:
            break
          case 5:
            that.dealData5(data)
            break
          case 6:
            content = "清空购物车成功"
            that.dealData6()
            break
        }
        if (!Utils.isNull(content)) {
          wx.showToast({
            title: content,
            icon: 'none',
            duration: 1500
          })
        }

        break;
      default:
        console.log(error)
        that.data.isGetTypeProduct = true
        break
    }
  },

  /**
   * 解析商品数据
   * @param {*} data 
   */
  setProductList(data) {
    let that = this;
    var currentPage = that.data.currentPage;
    if (data.length > 0) {
      // 购物车列表的数据
      var shopCarList = that.data.shopCarList
      
      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (Utils.isNull(element.photos)) {
          element.photo = defaultItemImgSrc
        } else {
          let photos = element.photos.split(",");
          element.photo = photos[0]
        }
        if (Utils.isNull(element.detailPhotos)) {
          var dPhotos = []
          dPhotos.push(defaultItemImgSrc)
          element.dPhotos = dPhotos
        } else {
          let dPhotos = element.detailPhotos.split(",");
          element.dPhotos = dPhotos
        }

        //显示的最低价
        element.minprice = 10000
        // 商品默认显示第一个规格的价格(不管是否有货)
        element.showprice = 0
        element.showSrcPrice = 0
        // 选择的数量
        element.num = 0
        // 弹窗显示选择的最终价格
        element.sumprice = 0
        // 显示选择了哪些规格
        element.showSelectLabels = ""
        var showSelectLabelList = []

        if (element.mold != 9) {
          // 老商品需要显示最低价格
          element.showprice = 9999
        }

        let details = element.detail
        for (let j = 0; j < details.length; j++) {
          const detail = details[j];
          // 老商品处理数据
          if (element.mold != 9) {
            //团购
            if (detail.groupmold == 8) {
              element.groupmold = 8
              if (element.showprice > detail.groupMoney) {
                element.showprice = detail.groupMoney
              }
            } else {
              if (element.showprice > detail.price) {
                element.showprice = detail.price
              }
            }
            continue
          }
          let labels = detail.labels

          // 是否默认选中了 单选默认选中 多选不需要
          let isSelect = false
          for (let k = 0; k < labels.length; k++) {
            const label = labels[k];
            label.discounts_price=Utils.isNotNull(label.discounts_price)?label.discounts_price:0.00;
            //sellPrice:正常售价——如果优惠价有效且小于正常价则取优惠价，否则取标签正常售价
            label.sellPrice=label.discounts_price>0 && label.discounts_price<label.lblprice?label.discounts_price:label.lblprice;  
            // 商品图片默认显示第一个规格的价格
            if (0 == k && j == 0) {
              element.showprice = label.sellPrice;
              element.showSrcPrice=label.lblprice;
            }
            if (label.sellPrice != 0 && element.minprice > label.sellPrice) {
              element.minprice = label.sellPrice
            }
            label.checked = false
            // 选择该规格的数量
            label.num = 0
            // 有货 单选默认选中
            if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
              label.checked = true
              element.sumprice = element.sumprice + label.sellPrice
              showSelectLabelList = showSelectLabelList.concat(label.lblname)
              isSelect = true
            }
            // 查询购物车中label选的数量
            for (let a = 0; a < shopCarList.length; a++) {
              const shopCar = shopCarList[a];
              var labList = shopCar.labList
              if (Utils.isNotNull(labList)) {
                for (let b = 0; b < labList.length; b++) {
                  const lab = labList[b];
                  if (lab.id == label.id) {
                    label.num = shopCar.num
                    break
                  }
                }
              }
            }
          }
        }
        // 查询购物车中product选的数量
        for (let a = 0; a < shopCarList.length; a++) {
          const shopCar = shopCarList[a];
          if (shopCar.productId == element.id) {
            element.num = element.num + shopCar.num
          }
          // 获取已加入购物车的图案
          element.synimage = shopCar.synimage
          element.synimage_price = shopCar.synimage_price
        }
        element.sumprice = element.sumprice.toFixed(2)
        element.showSelectLabels = showSelectLabelList.join("/")

        if(data[i].productName.indexOf("核销") >= 0)continue;
        if (data[i].productName.indexOf("按摩") >= 0 && app.data.isFilterCheirapsis) {
          //扫码按摩器后显示
          if (app.data.agentDeviceId > 0) {
            dataArray.push(data[i]);
          }
        } else {
          dataArray.push(data[i]);
        }
      }
      that.setData({
        dataArray: that.data.dataArray.concat(dataArray)
      })
      // that.setData({
      //   dataArray: that.data.dataArray.concat(data)
      // })
      console.log("解析后的商品", data)
    } else {
      if (1 == currentPage) {
        wx.showToast({
          title: "暂无商品！",
          icon: 'none',
          duration: 1500
        })
      } else {
        that.setData({
          currentPage: --currentPage
        })
        wx.showToast({
          title: "商品加载完毕！",
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  /**
   * 购物车列表数据
   * @param {*} data 
   */
  dealData5(data) {
    var that = this
    let shopCarList = data.shopCarList
    if (shopCarList.length > 0) {
      for (let i = 0; i < shopCarList.length; i++) {
        const shopCar = shopCarList[i];
        var showLabelList = []
        var labels = shopCar.labList
        for (let j = 0; j < labels.length; j++) {
          const label = labels[j];
          showLabelList = showLabelList.concat(label.lblname)
        }
        shopCar.showLabels = showLabelList.join("/")
        if (shopCar.synimage_price > 0) {
          shopCar.amount += (shopCar.synimage_price * shopCar.num)
        }
      }
      that.setData({
        shopCarList: shopCarList,
      })
    } else {
      // wx.showToast({
      //   title: "购物车里是空的",
      //   icon: 'none',
      //   duration: 1500
      // })
      that.setData({
        shopCarList: [],
      })
    }
  },
  /**
   * 清空购物车成功
   */
  dealData6() {
    var that = this

    if (that.data.gwNum == 0) {
      that.setProductNumData(that, 0)
    }


    that.setData({
      shopCarList: [],
      judgment: false,
    })
    that.getShoppingCartData()
  },

  /**
   * 设置商品显示所选的数量
   */
  setProductNumData(mainThis, num) {
    var that = mainThis
    var dataArray = that.data.dataArray

    // 把商品所显示的数量清空
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      data.num = num
      var details = data.detail
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        var labels = detail.labels
        for (let k = 0; k < labels.length; k++) {
          const label = labels[k];
          label.num = num
        }
      }
    }

    that.setData({
      dataArray: dataArray,
    })
  },

  /**
   * 选择商品规格
   * @param {*} e 
   */
  selectProductLabels(e) {
    var that = this
    var dataArray = that.data.dataArray
    var index = e.currentTarget.dataset.index
    var labelindex = e.currentTarget.dataset.labelindex
    var data = dataArray[that.data.selectProductIndex]
    var labels = data.detail[index].labels
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      // 0多选 1单选
      if (label.lblsingle == 1) {
        if (i == labelindex) {
          // 单选不能取消选中
          label.checked = true
        } else {
          label.checked = false
        }
      }
      // 多选 
      else {
        if (i == labelindex) {
          label.checked = !label.checked
          break
        }
      }
    }

    that.collectPrice()
  },

  /**
   * 汇总价格
   */
  collectPrice() {
    var that = this
    var dataArray = that.data.dataArray
    var data = dataArray[that.data.selectProductIndex]
    // 弹窗显示选择的最终价格
    var sumprice = 0
    // 显示选择了哪些规格
    var showSelectLabelList = []
    var details = data.detail,lblPrice=0.00;
    // 重新汇总所选择的商品规格
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.checked) {
          lblPrice=label.sellPrice;
          sumprice = sumprice + lblPrice
          showSelectLabelList = showSelectLabelList.concat(label.lblname)
        }
      }
    }

    // 判断是否是打印图案的商品
    if (that.data.synImgPrice>0.00) {
      sumprice = sumprice + that.data.synImgPrice;
    }

    data.sumprice = sumprice.toFixed(2)
    data.showSelectLabels = showSelectLabelList.join("/")

    that.setData({
      dataArray: dataArray,
    })
  },

  /**
   * 商品详情弹窗
   */
  onchangedetailType(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      detailType: !this.data.detailType,
      selectProductIndex: index,
    })
  },

  /**
   * 普通商品浏览商品详情
   */
  viewProductDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = that.data.dataArray[index].pid
    var companyId = that.data.dataArray[index].companyId
    var url = "";
    if (Utils.myTrim(id) != "") {
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + encodeURIComponent(id) + "&channelid=" + that.data.mallChannelId + "&companyid=" + companyId + "&newpage=0";
      console.log("viewProductDetail:" + url)
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无效商品！",
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 选好了
   */
  selectOK() {
    var that = this,shopCarList = that.data.shopCarList;
    //如果为组合劵选择商品购买（仅允许购买一种商品，一个数量）则不允许多选商品操作
    if (that.data.synCouponId > 0) {
      if (shopCarList.length > 0) {
        wx.showModal({
          title: '提示',
          content: '对不起，组合劵商品仅限选购一种！',
          showCancel: false,
          confirmText: "知道了",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
    }

    var dataArray = that.data.dataArray
    var data = dataArray[that.data.selectProductIndex]

    // 所选中的LabelId
    var labelIdList = []
    var showLabels = "",
      amount = 0.00;
    // var detailIdList = []

    var details = data.detail,lblPrice=0.00;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      var labels = detail.labels
      // 判断每个分类有没有选中一个的
      var isHaveSelect = false
      // 是否默认选中了 单选默认选中 多选不需要
      let isSelect = false
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.checked) {
          lblPrice=label.sellPrice;
          
          labelIdList = labelIdList.concat(label.id)
          showLabels += Utils.myTrim(showLabels) != "" ? "/" + label.lblname : label.lblname;
          // detailIdList = detailIdList.concat(label.detailId)
          isHaveSelect = true
          label.num++;
          amount += label.num * lblPrice;
        }
        // 多选可以不用选
        if (label.lblsingle == 0) {
          isHaveSelect = true
        }
        // 加入购物车后恢复默认选中 有货 单选默认选中
        if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
          label.checked = true
          isSelect = true
        } else {
          // 多选不需要默认选中
          label.checked = false
        }

      }
      if (!isHaveSelect) {
        wx.showToast({
          title: "商品规格存在缺货,请重新选择!",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }

    data.num++
    console.log("加入后购物车", dataArray)
    that.data.tempDataArray = dataArray
    var detailLabelId = labelIdList.join(",")
    // var productDetailId = detailIdList.join(",")

    // 判断是否是打印图案的商品
    let synimage = "",synimage_price = 0;
    if(that.data.synImgId>0) {
      synimage = that.data.synImgId+"|"+that.data.synImgUrl;
      synimage_price = that.data.synImgPrice;
      // 选中的图案
      data.synimage = synimage
      data.synimage_price = synimage_price
      if(that.data.synCouponId<=0){
        detailLabelId = detailLabelId + "&synimage=" + synimage + "&synimage_price=" + synimage_price
      } 
    }

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      let tmpShopCarList = that.data.shopCarList,
        shopCarListItem = null,
        isExist = false;
      let shoppingCartCnt = 0,
        shoppingCartAmount = 0;
      if (amount > 0.00) {
        amount = parseFloat((amount).toFixed(app.data.limitQPDecCnt));
      }

      shopCarListItem = {
        companyId: data.companyId,
        companyName: data.companyName,
        photos: [data.photo],
        productId: data.id,
        productName: data.productName,
        amount: amount,
        detailLabelId: detailLabelId,
        showLabels: showLabels,
        synimage:synimage,
        num: data.num
      }

      if (Utils.isNotNull(tmpShopCarList) && tmpShopCarList.length > 0) {
        for (let i = 0; i < tmpShopCarList.length; i++) {
          if (Utils.myTrim(tmpShopCarList[i].productId) == Utils.myTrim(data.id)) {
            tmpShopCarList[i] = shopCarListItem;
            shoppingCartCnt += shopCarListItem.num;
            shoppingCartAmount += shopCarListItem.amount;
            isExist = true;
          } else {
            shoppingCartCnt += tmpShopCarList[i].num;
            shoppingCartAmount += tmpShopCarList[i].amount;
          }
        }
      }
      if (!isExist) {
        tmpShopCarList.push(shopCarListItem);
        shoppingCartCnt += shopCarListItem.num;
        shoppingCartAmount += shopCarListItem.amount;
      }

      that.setData({
        ["shopCarList"]: tmpShopCarList,
        ["shoppingCartCnt"]: shoppingCartCnt,
        ["shoppingCartAmount"]: shoppingCartAmount,

        ["dataArray"]: that.data.tempDataArray,
        ["chilType"]: false,
      })
    } else {
      that.addShopCar(detailLabelId, 0, 1)
    }
  },

  /**
   * 商品处直接减少商品规格
   */
  changeCut(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var dataArray = that.data.dataArray
    var data = dataArray[index]

    // 所选中的LabelId
    var labelIdList = [];
    var showLabels = "",
      amount = 0.00;
    // var detailIdList = []
    // 判断是否可以直接减 多规格不支持直接减
    var isCanCut = false

    var details = data.detail
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      isCanCut = false
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.num > 0) {
          if (label.num == data.num) {
            isCanCut = true
            labelIdList = labelIdList.concat(label.id);
            showLabels += Utils.myTrim(showLabels) != "" ? "/" + label.lblname : label.lblname;
            // detailIdList = detailIdList.concat(label.detailId)
            label.num--;
            amount += label.num * label.sellPrice;
          } else {
            // 发现多种规格 不能直接减
            isCanCut = false
            break
          }
        }
      }

      var content = "多规格商品请去购物车删除哦"
      if (!isCanCut) {
        wx.showToast({
          title: content,
          icon: 'none',
          duration: 2500
        })
        that.setData({
          judgment: true,
          detailType: false,
        })
        return;
      }
    }
    data.num--
    var detailLabelId = labelIdList.join(",")
    // 判断选择的打印图案是否可以直接减
    if (data.photoType == 2) {
      detailLabelId = detailLabelId + "&synimage=" + data.synimage + "&synimage_price=" + data.synimage_price
    }

    // var productDetailId = detailIdList.join(",")
    that.data.tempDataArray = dataArray;

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      let shopCarList = that.data.shopCarList;
      if (amount > 0.00) {
        amount = parseFloat((amount).toFixed(app.data.limitQPDecCnt));
      }
      if (Utils.isNotNull(shopCarList) && shopCarList.length > 0) {
        let tmpShopCarList = [],
          shopCarListItem = null;
        let shoppingCartCnt = 0,
          shoppingCartAmount = 0;
        for (let i = 0; i < shopCarList.length; i++) {
          shopCarListItem = null;
          shopCarListItem = shopCarList[i];
          if (data.num > 0) {
            shopCarListItem.num = data.num;
            shopCarListItem.amount = amount;
            tmpShopCarList.push(shopCarListItem);
            shoppingCartCnt += shopCarListItem.num;
            shoppingCartAmount += shopCarListItem.amount;
          }
        }

        that.setData({
          ["shopCarList"]: tmpShopCarList,
          ["shoppingCartCnt"]: shoppingCartCnt,
          ["shoppingCartAmount"]: shoppingCartAmount,

          ["dataArray"]: that.data.tempDataArray,
        })
      }
    } else {
      that.addShopCar(detailLabelId, 1, 2)
    }

  },

  /**
   * 购物车中加减商品 0加 1减
   * @param {*} e 
   */
  changeDrinkNum(e) {
    var that = this
    let tag = e.currentTarget.dataset.tag
    var index = e.currentTarget.dataset.index
    var dataArray = that.data.dataArray
    var shopCarList = that.data.shopCarList[index]
    var labList = shopCarList.labList

    let shoppingCartCnt = that.data.shoppingCartCnt,
      shoppingCartAmount = that.data.shoppingCartAmount,
      price = 0.00;
    shoppingCartCnt -= shopCarList.num;
    shoppingCartAmount -= shopCarList.amount;
    price = shopCarList.amount / shopCarList.num;
    price = parseFloat((price).toFixed(app.data.limitQPDecCnt));
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      if (data.id == shopCarList.productId) {
        if (tag == 0) {
          data.num++
        } else {
          data.num--
        }
        shopCarList.num = data.num;
        shopCarList.amount = data.num * price;
      }

      var details = data.detail
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        var labels = detail.labels
        for (let k = 0; k < labels.length; k++) {
          const label = labels[k];
          for (let a = 0; a < labList.length; a++) {
            const lab = labList[a];
            if (lab.id == label.id) {
              if (tag == 0) {
                label.num++
              } else {
                label.num--
              }
              break
            }
          }
        }
      }
    }

    that.data.tempDataArray = dataArray

    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      shoppingCartCnt += shopCarList.num;
      shoppingCartAmount += shopCarList.amount;
      let setKey = "shopCarList[" + index + "]";

      that.setData({
        [setKey]: shopCarList,
        ["shoppingCartCnt"]: shoppingCartCnt,
        ["shoppingCartAmount"]: shoppingCartAmount,

        ["dataArray"]: that.data.tempDataArray,
      })
    } else {
      that.addShopCar(shopCarList.detailLabelId + "&synimage=" + shopCarList.synimage + "&synimage_price=" + shopCarList.synimage_price, tag, 3)
    }

  },

  /**
   * 清空购物车
   */
  clearShopCar() {
    var that = this
    var shopCarList = that.data.shopCarList
    if (shopCarList.length == 0) {
      // wx.showToast({
      //   title: "购物车是空的",
      //   icon: 'none',
      //   duration: 2000
      // })
      return
    }
    wx.showModal({
      title: '提示',
      confirmText: '确定',
      content: '确定清空购物车?',
      success(res) {
        if (res.confirm) {
          var shopCarId = []
          for (let i = 0; i < shopCarList.length; i++) {
            const shopCar = shopCarList[i];
            shopCarId = shopCarId.concat(shopCar.id)
          }
          that.deleteShopCarProduct(shopCarId.join(","))
        } else if (res.cancel) {}
      }
    })
  },

  /*隐藏所有弹窗*/
  emptyType() {
    if (this.data.isUploadImg) {
      this.setData({
        isUploadImg: false,
        imagerollX: 100, //图案位置X
        imagerollY: 30, //图案位置Y
        inputrollX: 50, //文字位置X
        inputrollY: 483, //文字位置Y
        money: "", //文字输入内容
        imagedddType: true
      })
    } else if (this.data.isPreviewImg) {
      this.setData({
        isPreviewImg: false
      })
    } else {
      this.setData({
        judgment: false,
        detailType: false,
        chilType: false,
        isUploadImg: false
      })
    }

  },
  //加饮品 出现弹窗
  addProcuctnum(e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    //如果为组合劵选择商品购买（仅允许购买一种商品，一个数量）则不允许增加数量操作
    var dataArray = that.data.dataArray;
    var data = dataArray[index];
    if (that.data.synCouponId > 0) {
      if (Utils.isNotNull(data) && data.num > 0) {
        wx.showModal({
          title: '提示',
          content: '对不起，组合劵商品仅限购买一份！',
          showCancel: false,
          confirmText: "知道了",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
    }

    this.setData({
      chilType: !this.data.chilType,
      selectProductIndex: index,
      detailType: false,
    })

    that.collectPrice();
  },

  changechilType(e) {
    this.setData({
      chilType: !this.data.chilType,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadInitData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreData()
  },
  /**
   * 去结算
   */
  gotoPage() {
    let that = this,
      url = "";
    //检查来源是否为组合劵选择商品购买
    if (that.data.synCouponId > 0) {
      if (Utils.isNotNull(that.data.shopCarList) && that.data.shopCarList.length > 0) {
        app.data.synShopCarList = that.data.shopCarList;
      } else {
        wx.showToast({
          title: "请选择商品！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }

    //app.data.synShopCarList
    url = that.data.synRecordId > 0 ? "/packageYK/pages/amited/amited?rid=" + that.data.synRecordId : "/packageYK/pages/amited/amited?pagetype=" + that.data.pagetype;
    wx.navigateTo({
      url: url
    });
  },
})
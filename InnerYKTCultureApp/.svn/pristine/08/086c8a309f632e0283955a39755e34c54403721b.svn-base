// pages/shopdetail/shopdetail.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.smurl, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl
var packSMPageUrl = "../../../packageSMall/pages";
var pageSize = 5, defaultItemImgSrc = DataURL + app.data.defaultImg;
var appUserInfo = app.globalData.userInfo, isDropDown=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,       //远程资源路径
    isLoad: false,          //是否已经加载
    isForbidRefresh: false, //是否禁止刷新
    type: 0,                 //进入用户类型  type = 1（店主）； 商场进入 type = 0（用户）
    isMaster: false,         //是否店主
    mallChannelId: 0, //渠道ID
    isHideTop:false,

    spstart: '',
    spend: '',
    isFilterDisabled: false, //筛选 确认禁用按钮
    
    shopData:{},//店铺资料
    shopType: [
      {
        productTypeName: '全部',
        selected: true
      }
    ], //店铺分类
    sOrder: 0, //价格排序 0：默认； asc ; desc ;
    movies: [
      { url: '../../images/bgstore.png' }
    ],
    indicatorDots: true,
    autoplay: true,
    isShowSearchPop: false,
    store: [
    ],

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录
  },

  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    that.setData({
      companyId: options.companyId,
      type: options.type        // 个人中心进入  type = 1（店主）； 商场进入 type = 0（用户）
    })
    that.getCompanyMainDataInfo(that.data.companyId);
  },
  onShow: function () {
    var that = this;
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null)
        return;
      else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
        }
        console.log("onShow ...")
      }
    }
    that.data.isForbidRefresh = false;
  },
  //方法：获取信息
  getCompanyMainDataInfo: function (companyId) {
    let that = this, otherParam = "&id=" + companyId;
    app.getCompanyMainDataInfo(that, otherParam);
  },
  //方法：获取公司信息结果处理函数
  dowithGetCompanyMainDataInfo: function (dataList, tag, errorInfo) {
    let that = this, noDataAlert = "暂无酒店详情信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        app.dowithCompanyMainDataInfo(that, dataList);
        that.loadInitData();
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无酒店详情！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },
  //方法：IntersectionObserver 对象懒加载图片
  lazyLoadImg: function () {
    let that = this;
    if (that.data.companyDataInfo != null && that.data.companyDataInfo != undefined && that.data.companyDataInfo.photoList != null && that.data.companyDataInfo.photoList != undefined && that.data.companyDataInfo.photoList.length > 0) {
      app.lazyLoadImgList(that, that.data.companyDataInfo.photoList, "tbannerimg", "companyDataInfo.photoList");
    }
  },
  //////////////////////////////////////////////////////////////////////
  //----商品列表---------------------------------------------------------
  bindDownLoad: function () {
    isDropDown=true;
    this.loadMoreData();
  },
  bindTopLoad: function () {
    isDropDown=false;
    this.loadInitData(false);
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
    that.getMainDataList(pageSize, 1);
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 获取第n页列表信息
    that.getMainDataList(pageSize, currentPage);
  },
  //获取商品列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this,noDataAlert = "";
    var urlParam = "",sign = "",otherParamCon = "";
    noDataAlert = "暂无商品信息！";
    
    otherParamCon = "&companyId=" + that.data.companyId;
    if (!Utils.isNull(that.data.searchGoods)) {
      otherParamCon += "&productName=" + encodeURIComponent(that.data.searchGoods);
    }
    if (!Utils.isNull(that.data.typeNames)) {
      otherParamCon += "&typeName=" + encodeURIComponent(that.data.typeNames);
    }
    var spstart = that.data.spstart;
    var spend = that.data.spend;
    if (!Utils.isNull(spstart) && !Utils.isNull(spend)) {
      spstart = parseInt(spstart);
      spend = parseInt(spend);
      if (spstart >= spend) {
        wx.showToast({
          title: '请输入正确价格区间',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          isFilterDisabled: false,
          spend: '',
          spstart: '',
        })
        return
      }
      otherParamCon += "&startPrice=" + spstart + "&endPrice=" + spend;
    }
    if (that.data.sOrder != 0) {
      otherParamCon += "&sField=minprice&sOrder=" + that.data.sOrder;
    }
    app.getSoftSrvProduct(that, otherParamCon, pageSize, pageIndex);
  },
  //方法：获取代理商品结果处理函数
  dowithGetSoftSrvProduct: function (dataList, tag, errorInfo, pageIndex) {
    let that = this, noDataAlert = "暂无商品信息！";
    that.data.isLoad = true;
    wx.hideLoading();
    switch (tag) {
      case 1:
        app.dowithProductList(that, dataList, pageIndex, noDataAlert);//isDropDown
        let setKey = "isHideTop", isHideTop=false;
        if (isDropDown && ((dataList != null && dataList != undefined && dataList.length > 0 && pageIndex<=1) || pageIndex>1)){
          isHideTop = true;
        }
        that.setData({
          [setKey]: isHideTop,
        })
        break;

      default:
        errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "暂无商品！";
        wx.showToast({
          title: errorInfo,
          icon: 'none',
          duration: 1500
        })
        break;
    }
    that.setData({
      isFilterDisabled: false,
      isShowSearchPop: false,
    })
  },

  //查询店铺信息
  queryShopDetail: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载中',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_goodtype&action=QueryProductTypes" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + that.data.companyId + "&pIndex=" + that.data.pIndex + "&pSize=" + that.data.pSize + "&sign=" + sign;
    if (!Utils.isNull(that.data.searchGoods)) {
      urlParam += "&productName=" + encodeURIComponent(that.data.searchGoods);
    }
    if (!Utils.isNull(that.data.typeNames)) {
      urlParam += "&typeName=" + encodeURIComponent(that.data.typeNames);
    }
    var spstart = that.data.spstart;
    var spend = that.data.spend;
    if (!Utils.isNull(spstart) && !Utils.isNull(spend)) {
      spstart = parseInt(spstart);
      spend = parseInt(spend);
      if (spstart >= spend) {
        wx.showToast({
          title: '请输入正确价格区间',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          isFilterDisabled: false,
          spend: '',
          spstart: '',
        })
        return
      }
      urlParam += "&startPrice=" + spstart + "&endPrice=" + spend;
    }
    // if (!Utils.isNull(spstart) || !Utils.isNull(spend)){
    //   urlParam += "&startPrice=" + spstart + "&endPrice=" + spend;
    // }
    if (that.data.sOrder != 0) {
      urlParam += "&sField=minprice&sOrder=" + that.data.sOrder;
    }
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        //启用下拉刷新状态
        that.setData({
          refreshStatus:false
        })
        wx.hideLoading();
        console.log('查询店铺信息', res);
        if (res.data.rspCode == 0) {
          if (!Utils.isNull(res.data.data) && res.data.data.length > 0) {
            var data = res.data.data;
            var store = that.data.store;
            if (that.data.pIndex > 1) {
              data = store.concat(data);
              that.setData({
                store: data,
              })
              return;
            }
            if (!Utils.isNull(data[0].companyPhotos)) {
              var companyPhotos = data[0].companyPhotos;
              var photosArr = companyPhotos.split(',');
              data[0].companyPhotos = photosArr;
            }
            that.setData({
              isFilterDisabled: false,
              isShowSearchPop: false,
              store: data,
              shopData: data[0]
            })
            console.log('store', data);
          } else {
              if (!Utils.isNull(res.data.company)){
                var company = res.data.company;
                if (!Utils.isNull(company.companyPhotos)) {
                  var companyPhotos = company.companyPhotos;
                  var photosArr = companyPhotos.split(',');
                  company.companyPhotos = photosArr;
                }
                that.setData({
                  shopData: company
                })
              }
            if (that.data.type == 1) {
              that.setData({
                isMaster:true
              })
            }
            if (that.data.pIndex > 1) {
              that.setData({
                pIndex: that.data.pIndex - 1,
                refreshStatus:true
              })
              console.log('没有更多数据 end')
              return;
            }
            that.setData({
              isFilterDisabled: false,
              isShowSearchPop: false,
              store: [],
            })
            //   wx.showToast({
            //     title: '店铺暂时没有上架商品',
            //     icon: 'none',
            //     duration: 1500
            //   })
            //  setTimeout(function(){
            //    wx.navigateBack({
            //      delta: 1
            //    })
            //  },1500)

          }
        } else {
          if (that.data.isFilterDisabled) {
            that.setData({
              isFilterDisabled: false
            })
          }
          app.setErrorMsg2(that, "查询店铺信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      },
      fail: function (err) {
        wx.hideLoading()
        if (this.data.isFilterDisabled) {
          that.setData({
            isFilterDisabled: false
          })
        }
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
  //查询店铺分类
  queryShopType: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=product_goodtype&action=QueryTypes" + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + that.data.companyId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询店铺分类', res);
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].selected = false;
            }
            data = that.data.shopType.concat(data);
            that.setData({
              shopType: data,
              isShowSearchPop: true
            })
            console.log('分类：', data)
          } else {
            that.setData({
              isShowSearchPop: true
            })
          }

        } else {
          app.setErrorMsg2(that, "查询店铺分类！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        console.log("接口失败：" + err)
      }
    })
  },
  selectShopType: function (e) {
    var index = e.currentTarget.dataset.index;
    var shopType = this.data.shopType;
    if (index != 0) {
      shopType[index].selected = !shopType[index].selected;
      shopType[0].selected = false;
      if (shopType[index].selected == false) { //如果取消选中类别
        for (let i = 1; i < shopType.length; i++) {
          if (shopType[i].selected) {
            break;
          }
          if (i == shopType.length - 1) { //全部取消 改为"全部"
            shopType[0].selected = true;
          }
        }
      }
    } else {
      for (let i = 0; i < shopType.length; i++) {
        if (i == 0) {
          shopType[i].selected = true;
        } else {
          shopType[i].selected = false;
        }
      }
    }
    this.setData({
      shopType: shopType
    })
  },
  choseText: function (e) {
    var vip = e.currentTarget.dataset.vip; //获取自定义的ID值
    this.setData({
      vip: vip
    })
  },
  choseText1: function (e) {
    var state = e.currentTarget.dataset.state; //获取自定义的ID值
    this.setData({
      state: state
    })
  },
  choseText2: function (e) {
    var pay = e.currentTarget.dataset.pay; //获取自定义的ID值
    this.setData({
      pay: pay
    })
  },
  showSearchPop: function () {
    if (this.data.shopType.length == 1) {
      this.queryShopType();
    } else {
      this.setData({
        isShowSearchPop: true
      })
    }
  },
  //价格输入获取
  changeValueMainData: function (e) {
    var cid = e.currentTarget.dataset.cid;
    var val = e.detail.value;
    this.setData({
      [cid]: val
    })
  },
  //价格排序选择
  chosePriceSortColor: function (e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      sOrder: value
    })
    console.log(this.data.sOrder)
  },

  //关闭类别筛选
  closeShowSearchPop: function () {
    this.setData({
      isShowSearchPop: false
    })
  },
  //进入商品详情
  viewProductDetail:function(e){
    var that = this, id = e.currentTarget.dataset.id, url = "";
    if (Utils.myTrim(id) != "") {
      that.data.isForbidRefresh = true;
      url = packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + encodeURIComponent(id) + "&channelid=" + that.data.mallChannelId;
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
  getInput: function (e) {
    var that = this;
    that.setData({
      searchGoods: e.detail.value
    })
    console.log(that.data.searchGoods)
  },
  submitSearchs:function(){
    this.closeSearchPop();//取消筛选条件
    this.setData({
      pIndex: 1,
    })
    this.queryShopDetail();
  },
  //筛选确认
  submitSearchPop: function () {
    var shopType = this.data.shopType;
    if (this.data.isFilterDisabled) {
      return;
    }
    this.setData({
      isFilterDisabled: true
    })
    var typeNames = '';
    for (let i = 1; i < shopType.length; i++) { //循环查询是否有选择类别
      if (shopType[i].selected) {
        typeNames += shopType[i].productTypeName + ',';

      }
    }
    if (typeNames != '') {
      typeNames = typeNames.substring(0, typeNames.length - 1);
    }
    this.setData({
      typeNames: typeNames,
      pIndex:1
    })
    this.queryShopDetail();
  },
  //重置
  closeSearchPop: function () {
    var shopType = this.data.shopType;
    for (let i = 0; i < shopType.length; i++) {
      if (i == 0 && !shopType[0].selected) {
        shopType[0].selected = true;
      } else if (i > 0 && shopType[i].selected) {
        shopType[i].selected = false;
      }
    }
    this.setData({
      spend: '',
      spstart: '',
      typeName: '',
      shopType: shopType,
      sOrder: 0
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
})
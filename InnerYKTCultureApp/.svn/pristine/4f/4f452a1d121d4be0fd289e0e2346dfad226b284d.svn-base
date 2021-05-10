// pages/shopcar/shopcar.js
const app = getApp()
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var URL = app.getUrlAndKey.smurl,
  KEY = app.getUrlAndKey.key,
  DataURL = app.getUrlAndKey.dataUrl,
  UploadURL = app.getUrlAndKey.uploadUrl;
var pageSize = app.data.pageSize,
  defaultItemImgSrc = DataURL + app.data.defaultImg,
  isDowithing = false,
  isFirstLoad = true,
  packOtherPageUrl = "../../packageOther/pages",
  packSMPageUrl = "../../packageSMall/pages";
var appUserInfo = app.globalData.userInfo;
Page({
  data: {
    DataURL: DataURL,
    isFromSApp: app.data.isFromSApp,
    isLoad: false, //是否已经加载
    isForbidRefresh: false, //是否禁止刷新

    totalDataCount: 0, //总数据条数
    currentPage: 0, //当前页码
    articles: [], //存放所有的页记录

    isHaveDataList: false, //列表是否有数据
    totalPrice: 0.00, //总价，初始为0
    totalOriginalPrice: 0.00, //原总价，初始为0
    discountAmount: 0.00, //优惠金额

    selectShoppingCartDataList: [], //选中的购物车记录集
    isSelAll: false, //是否全选

    randomNum: Math.random() / 9999,
    firstShopId: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null || appUserInfo == undefined) {
      console.log('开始登陆...')
      app.getLoginUserInfo(that);
    } else {
      console.log("加载：......");
      that.dowithAppRegLogin(9);
    }
  },
  ///////////////////////////////////////////////////////////////////////////
  //----授权注册--------------------------------------------------------------
  //方法：APP注册登录页面处理方法
  //参数：tag——0，显示授权弹窗；1，注册或登录完成处理事务
  dowithAppRegLogin: function (tag) {
    var that = this;
    switch (tag) {
      case 0:
        that.setData({
          isShowAuthor: true,
        })

        break;
      default:
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null) {
          wx.showToast({
            title: "获取用户失败，无法操作！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        console.log("加载：......");
        isFirstLoad = true;
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
  onShow() {
    var that = this;
    app.data.pageLayerTag = "../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) {
        console.log('开始登陆...')
        app.getLoginUserInfo(that);
      } else {
        //如果非禁止页面刷新
        if (!that.data.isForbidRefresh) {
          that.loadInitData();
          that.calculateSelShoppingCart();
          isDowithing = false;
          console.log("onShow ...")
        }
      }
    }
    that.data.isForbidRefresh = false;
  },
  bindDownLoad: function () {
    this.loadMoreData();
  },
  bindTopLoad: function () {
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
  //获取购物车列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this,
      noDataAlert = "";
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    noDataAlert = "暂无商品信息！";
    urlParam = "cls=product_shopCar&action=userShopCar&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            dataItem = null,
            listItem = null,
            detailListItem = null,
            detailList = [],
            articles = [],
            selectShoppingCartDataList = that.data.selectShoppingCartDataList;
          var shopId = 0,
            lastShopId = -1,
            shopLogo = DataURL + "/images/zz.png",
            shopType = "旗舰",
            shopName = "",
            productDetailId = "",
            productId = "",
            productName = "",
            productNo = "",
            photos = defaultItemImgSrc,
            photoType = 0,
            num = 1,
            price = 0.00,
            originalPrice = 0.00,
            amount = 0.00,
            remark = "",
            attributeTwo = "",
            attributeOne = "",
            isSel = false,
            startNo = 0,
            isShowShopInfo = false,
            firstShopId = that.data.firstShopId,
            pid = 0,
            giftId = "",
            distributorId = 0,
            priceflag = 0,
            stock = 0,
            isSuffStock = true,
            mold = 0,
            presellstatus = 0;
          for (var i = 0; i < data.shopCarList.length; i++) {
            dataItem = null;
            dataItem = data.shopCarList[i];
            isShowShopInfo = false;
            productDetailId = "";
            productId = "";
            productName = "";
            productNo = "";
            photos = defaultItemImgSrc;
            photoType = 0;
            num = 1;
            price = 0.00;
            originalPrice = 0.00;
            amount = 0.00;
            remark = "";
            attributeTwo = "";
            attributeOne = "";
            isSel = false;
            pid = 0;
            giftId = "";
            distributorId = 0;
            priceflag = 0;
            stock = 0;
            mold = 0;
            presellstatus = 0;
            if (dataItem.presellstatus != null && dataItem.presellstatus != undefined && Utils.myTrim(dataItem.presellstatus + "") != "") {
              try {
                presellstatus = parseInt(dataItem.presellstatus);
                presellstatus = isNaN(presellstatus) ? 0 : presellstatus;
              } catch (err) {}
            }
            if (dataItem.mold != null && dataItem.mold != undefined && Utils.myTrim(dataItem.mold + "") != "") {
              try {
                mold = parseInt(dataItem.mold);
                mold = isNaN(mold) ? 0 : mold;
              } catch (err) {}
            }
            mold = (mold >= 50 && mold < 60) ? 5 : ((mold >= 60 && mold < 70) ? 6 : mold);
            if (dataItem.priceflag != null && dataItem.priceflag != undefined && Utils.myTrim(dataItem.priceflag + "") != "null") {
              try {
                priceflag = parseInt(dataItem.priceflag);
                priceflag = isNaN(priceflag) ? 0 : priceflag;
              } catch (err) {}
            }
            if (dataItem.stock != null && dataItem.stock != undefined && Utils.myTrim(dataItem.stock + "") != "null") {
              try {
                stock = parseFloat(dataItem.stock);
                stock = isNaN(stock) ? 0 : stock;
              } catch (err) {}
            }
            //赠品信息
            if (dataItem.giftdetail != null && dataItem.giftdetail != undefined && Utils.myTrim(dataItem.giftdetail + "") != "null" && Utils.myTrim(dataItem.giftdetail + "") != "")
              giftId = dataItem.giftdetail;
            //分销商ID 
            if (dataItem.distributionUserId != null && dataItem.distributionUserId != undefined && Utils.myTrim(dataItem.distributionUserId + "") != "null") {
              try {
                distributorId = parseInt(dataItem.distributionUserId);
                distributorId = isNaN(distributorId) ? 0 : distributorId;
              } catch (err) {}
            }
            if (dataItem.pid != null && dataItem.pid != undefined && Utils.myTrim(dataItem.pid + "") != "null") {
              try {
                pid = parseInt(dataItem.pid);
                pid = isNaN(pid) ? 0 : pid;
              } catch (err) {}
            }
            if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "") {
              try {
                shopId = parseInt(dataItem.companyId);
                shopId = isNaN(shopId) ? 0 : shopId;
              } catch (err) {}
            }
            if (shopId != lastShopId) {
              lastShopId = shopId;
              shopLogo = DataURL + "/images/zz.png";
              shopType = "旗舰";
              shopName = "";
              isShowShopInfo = true;
              startNo = 0;
              firstShopId = i == 0 && pageIndex == 1 ? shopId : firstShopId;
              if (dataItem.companyLogo != null && dataItem.companyLogo != undefined && Utils.myTrim(dataItem.companyLogo + "") != "")
                shopLogo = dataItem.companyLogo;
              if (dataItem.companyLevel != null && dataItem.companyLevel != undefined && Utils.myTrim(dataItem.companyLevel + "") != "")
                shopType = dataItem.companyLevel;
              shopType = Utils.myTrim(shopType) != "" ? shopType.replace("店", "") : shopType;
              if (dataItem.companyName != null && dataItem.companyName != undefined && Utils.myTrim(dataItem.companyName + "") != "")
                shopName = dataItem.companyName;
            }

            if (dataItem.productName != null && dataItem.productName != undefined && Utils.myTrim(dataItem.productName + "") != "")
              productName = dataItem.productName;
            if (dataItem.address != null && dataItem.address != undefined && Utils.myTrim(dataItem.address + "") != "")
              productNo = dataItem.address;
            if (dataItem.attributeTwo != null && dataItem.attributeTwo != undefined && Utils.myTrim(dataItem.attributeTwo + "") != "")
              attributeTwo = dataItem.attributeTwo;
            if (dataItem.attributeOne != null && dataItem.attributeOne != undefined && Utils.myTrim(dataItem.attributeOne + "") != "")
              attributeOne = dataItem.attributeOne;
            if (dataItem.productDetailId != null && dataItem.productDetailId != undefined && Utils.myTrim(dataItem.productDetailId + "") != "")
              productDetailId = dataItem.productDetailId;
            if (dataItem.productId != null && dataItem.productId != undefined && Utils.myTrim(dataItem.productId + "") != "")
              productId = dataItem.productId;
            if (dataItem.detailPhotos != null && dataItem.detailPhotos != undefined && dataItem.detailPhotos.length > 0)
              photos = dataItem.detailPhotos[0];
            else if (dataItem.photos != null && dataItem.photos != undefined && dataItem.photos.length > 0)
              photos = dataItem.photos[0];

            if (dataItem.remark != null && dataItem.remark != undefined && Utils.myTrim(dataItem.remark + "") != "")
              remark = dataItem.remark;
            if (dataItem.price != null && dataItem.price != undefined && Utils.myTrim(dataItem.price + "") != "") {
              try {
                price = parseFloat(dataItem.price);
                price = isNaN(price) ? 0.00 : price;
              } catch (err) {}
            }
            originalPrice = price;
            if (dataItem.originalPrice != null && dataItem.originalPrice != undefined && Utils.myTrim(dataItem.originalPrice + "") != "") {
              try {
                originalPrice = parseFloat(dataItem.originalPrice);
                originalPrice = isNaN(originalPrice) ? 0.00 : originalPrice;
              } catch (err) {}
            }
            if (dataItem.amount != null && dataItem.amount != undefined && Utils.myTrim(dataItem.amount + "") != "") {
              try {
                amount = parseFloat(dataItem.amount);
                amount = isNaN(amount) ? 0.00 : amount;
              } catch (err) {}
            }
            if (dataItem.photoType != null && dataItem.photoType != undefined && Utils.myTrim(dataItem.photoType + "") != "") {
              try {
                photoType = parseInt(dataItem.photoType);
                photoType = isNaN(photoType) ? 0 : photoType;
              } catch (err) {}
            }
            if (dataItem.num != null && dataItem.num != undefined && Utils.myTrim(dataItem.num + "") != "") {
              try {
                num = parseInt(dataItem.num);
                num = isNaN(num) ? 0 : num;
              } catch (err) {}
            }
            //是否已选中
            if (selectShoppingCartDataList != null && selectShoppingCartDataList != undefined && selectShoppingCartDataList.length > 0) {
              for (var n = 0; n < selectShoppingCartDataList.length; n++) {
                if (selectShoppingCartDataList[n].id == dataItem.id) {
                  isSel = true;
                  break;
                }
              }
            }

            startNo++;
            listItem = {
              startNo: startNo,
              id: dataItem.id,
              productDetailId: productDetailId,
              productId: productId,
              productName: productName,
              productNo: productNo,
              photos: app.getSysImgUrl(photos),
              photoType: photoType,
              num: num,
              price: price,
              originalPrice: originalPrice,
              amount: amount,
              remark: remark,
              attributeTwo: attributeTwo,
              attributeOne: attributeOne,
              isHaveTwo: Utils.myTrim(attributeTwo) != "" ? true : false,
              isSel: isSel,
              isShowShopInfo: isShowShopInfo,
              shopId: shopId,
              shopName: shopName,
              shopLogo: app.getSysImgUrl(shopLogo),
              shopType: shopType,
              pid: pid,
              giftId: giftId,
              distributorId: distributorId,
              priceflag: priceflag,
              stock: stock,
              isSuffStock: stock >= num ? true : false,
              mold: mold,
              presellstatus: presellstatus,
            }
            // //首次加载则选中第一个店铺
            // if (isFirstLoad && firstShopId == shopId) {
            //   listItem.isSel = true;
            //   selectShoppingCartDataList.push(listItem)
            // }
            articles.push(listItem);
          }
          if (articles.length > 0) {
            console.log(articles)
            // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
            var totalDataCount = that.data.totalDataCount;
            totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
            console.log("totalDataCount:" + totalDataCount);
            // 直接将新一页的数据添加到数组里
            that.setData({
              ["dataArray[" + pageIndex + "]"]: articles,
              currentPage: pageIndex,
              totalDataCount: totalDataCount,
              isHaveDataList: true,

              firstShopId: firstShopId,
            })
            if (isFirstLoad) {
              isFirstLoad = false;
              that.selectAllShoppingCartItem();
            } else {
              that.calculateSelShoppingCart();
            }
          } else if (pageIndex == 1) {
            that.setData({
              isHaveDataList: false,
            })
            wx.showToast({
              title: noDataAlert,
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
          app.setErrorMsg2(that, "获取商品列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: "获取商品列表接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "获取商品列表：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：已选购物车记录按店铺排序
  sortSelSCartListByShopId: function (a, b) {
    return a.shopId - b.shopId
  },
  //方法：更改购物车记录数量
  changeShoppingCartNum: function (id, num) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_shopCar&action=updateShopCarProductNum&id=" + id + "&userId=" + appUserInfo.userId + "&num=" + num + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("购物车记录数量更改成功！")
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "购物车记录数量更改：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
        isDowithing = false;
      },
      fail: function (err) {
        isDowithing = false;
        wx.showToast({
          title: "购物车数量更改失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, "购物车记录数量更改接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：删除购物车记录
  delShoppingCartItems: function (idList, tag) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "",
      sign = "";
    urlParam = "cls=product_shopCar&action=deleteShopCarProduct&ids=" + idList + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          var selectShoppingCartDataList = that.data.selectShoppingCartDataList;
          console.log("购物车记录删除成功！")
          switch (tag) {
            case 0:
              that.setData({
                selectShoppingCartDataList: [],
              })
              // setTimeout(that.loadInitData, 1500);
              // wx.showToast({
              //   title: "购物车记录删除成功！",
              //   icon: 'none',
              //   duration: 1500
              // })
              that.loadInitData();
              break;
            case 1:
              if (selectShoppingCartDataList != null && selectShoppingCartDataList != undefined && selectShoppingCartDataList.length > 0) {
                var stridList = "," + idList + ","
                for (var i = 0; i < selectShoppingCartDataList.length; i++) {
                  if (stridList.indexOf("," + selectShoppingCartDataList[i].id + ",") >= 0) {
                    selectShoppingCartDataList.splice(i, 1);
                    break;
                  }
                }
              }
              that.setData({
                selectShoppingCartDataList: selectShoppingCartDataList,
              })
              // setTimeout(that.loadInitData, 1500);
              // wx.showToast({
              //   title: "购物车记录删除成功！",
              //   icon: 'none',
              //   duration: 1500
              // })
              that.loadInitData();
              break;
          }
        } else {
          if (tag == 0 || tag == 1) {
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 2000
            })
          }
          app.setErrorMsg2(that, "购物车记录删除：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false)
        }
        isDowithing = false;
      },
      fail: function (err) {
        if (tag == 0) {
          wx.showToast({
            title: "购物车记录删除失败！",
            icon: 'none',
            duration: 2000
          })
        }
        app.setErrorMsg2(that, "购物车记录删除接口调用：失败！错误信息：" + JSON.stringify(err), URL + urlParam, false)
      }
    })
  },
  //方法：新增订单
  addSMOrderInfo: function (itemList) {
    app.addSMOrderInfo(this, itemList);
  },
  //事件：购物车数量增减
  computeItemCount: function (e) {
    var that = this,
      dataArray = that.data.dataArray,
      dindex = 0,
      index = 0,
      tag = "",
      num = 0,
      oldNum = 0;
    if (dataArray == null || dataArray == undefined || dataArray.length <= 0) return;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中...",
        icon: 'none',
        duration: 2000
      })
    } else {
      isDowithing = true;
      try {
        dindex = parseInt(e.currentTarget.dataset.dindex);
        dindex = isNaN(dindex) ? 0 : dindex;
      } catch (err) {}
      try {
        index = parseInt(e.currentTarget.dataset.index);
        index = isNaN(index) ? 0 : index;
      } catch (err) {}
      try {
        tag = e.currentTarget.dataset.tag;
      } catch (err) {}
      if (dataArray[dindex] != null && dataArray[dindex] != undefined && dataArray[dindex].length > 0 && dataArray[dindex][index] != null && dataArray[dindex][index] != undefined) {
        num = dataArray[dindex][index].num;
        oldNum = num;
        switch (Utils.myTrim(tag)) {
          case "-":
            if (num <= 1) {
              wx.showModal({
                title: '系统消息',
                content: "数量为“0”将会从购物车移除此商品，您确定吗？",
                icon: 'none',
                duration: 1500,
                success: function (res) {
                  if (res.cancel) {
                    //点击取消,默认隐藏弹框
                    console.log("cancel more del")
                    isDowithing = false;
                    return;
                  } else {
                    //点击确定
                    console.log("sure more del")
                    that.delShoppingCartItems(dataArray[dindex][index].id, 1);
                  }
                },
              })
            } else {
              num--;
            }
            break;
          case "+":
            num++;
            break;
          default:
            try {
              num = parseInt(e.detail.value);
              num = isNaN(num) ? 0 : num;
            } catch (err) {}
            if (num <= 0) {
              num = oldNum;
              wx.showToast({
                title: "数量不能为0！",
                icon: 'none',
                duration: 2000
              })
              isDowithing = false;
              return;
            }
            break;
        }


        if (oldNum != num) {
          if (num > dataArray[dindex][index].stock && Utils.myTrim(tag) != '-') {
            wx.showToast({
              title: "购物车数量不能大于库存量！",
              icon: 'none',
              duration: 2000
            })
            isDowithing = false;
            return;
          }
          var selectShoppingCartDataList = that.data.selectShoppingCartDataList;
          dataArray[dindex][index].num = num;
          dataArray[dindex][index].amount = dataArray[dindex][index].price * num;
          if (selectShoppingCartDataList != null && selectShoppingCartDataList != undefined && selectShoppingCartDataList.length > 0) {
            for (var n = 0; n < selectShoppingCartDataList.length; n++) {
              if (selectShoppingCartDataList[n].id == dataArray[dindex][index].id) {
                selectShoppingCartDataList[n].num = dataArray[dindex][index].num;
                selectShoppingCartDataList[n].amount = dataArray[dindex][index].amount;
              }
            }
          }
          that.setData({
            dataArray: dataArray,
          })
          that.changeShoppingCartNum(dataArray[dindex][index].id, num);
          that.calculateSelShoppingCart();
        } else
          isDowithing = false;
      } else
        isDowithing = false;
    }
  },
  //事件：全选或全不选购物车记录
  selectAllShoppingCartItem: function (e) {
    var that = this,
      dataArray = that.data.dataArray,
      selectShoppingCartDataList = [],
      isSelAll = !that.data.isSelAll,
      pageRows = 0;
    if (isSelAll) {
      if (dataArray != null && dataArray != undefined && dataArray.length > 0) {
        for (var m = 0; m < dataArray.length; m++) {
          pageRows = 0;
          try {
            pageRows = dataArray[m].length != null && dataArray[m].length != undefined && dataArray[m].length > 0 ? dataArray[m].length : 0;
          } catch (err) {}
          if (pageRows > 0) {
            for (var n = 0; n < dataArray[m].length; n++) {
              //库存充足才能选择
              if (dataArray[m][n].isSuffStock) {
                dataArray[m][n].isSel = true;
                selectShoppingCartDataList.push(dataArray[m][n]);
              }
            }
          }
        }
      }
    } else {
      if (dataArray != null && dataArray != undefined && dataArray.length > 0) {
        for (var m = 0; m < dataArray.length; m++) {
          pageRows = 0;
          try {
            pageRows = dataArray[m].length != null && dataArray[m].length != undefined && dataArray[m].length > 0 ? dataArray[m].length : 0;
          } catch (err) {}
          if (pageRows > 0) {
            for (var n = 0; n < dataArray[m].length; n++) {
              for (var n = 0; n < dataArray[m].length; n++) {
                dataArray[m][n].isSel = false;
              }
            }
          }
        }
      }
    }
    that.setData({
      dataArray: dataArray,
      selectShoppingCartDataList: selectShoppingCartDataList,
      isSelAll: isSelAll,
    })
    that.calculateSelShoppingCart();
  },
  //事件：移除选中购物车记录
  delShoppingCartList: function (e) {
    var that = this,
      selectShoppingCartDataList = that.data.selectShoppingCartDataList,
      idList = "";
    if (selectShoppingCartDataList == null || selectShoppingCartDataList == undefined || selectShoppingCartDataList.length <= 0) {
      wx.showToast({
        title: "请选择需要移除记录！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    for (var i = 0; i < selectShoppingCartDataList.length; i++) {
      idList += Utils.myTrim(idList) != "" ? "," + selectShoppingCartDataList[i].id : selectShoppingCartDataList[i].id;
    }
    that.delShoppingCartItems(idList, 0);
  },
  //事件：选择或不选购物车记录
  selectShoppingCartItem: function (e) {
    var that = this,
      dataArray = that.data.dataArray,
      selectShoppingCartDataList = that.data.selectShoppingCartDataList,
      dindex = 0,
      index = 0;
    if (dataArray == null || dataArray == undefined || dataArray.length <= 0) return;
    try {
      dindex = parseInt(e.currentTarget.dataset.dindex);
      dindex = isNaN(dindex) ? 0 : dindex;
    } catch (err) {}
    try {
      index = parseInt(e.currentTarget.dataset.index);
      index = isNaN(index) ? 0 : index;
    } catch (err) {}
    if (dataArray[dindex] != null && dataArray[dindex] != undefined && dataArray[dindex].length > 0 && dataArray[dindex][index] != null && dataArray[dindex][index] != undefined) {
      var isSel = !dataArray[dindex][index].isSel;
      if (isSel) {
        if (dataArray[dindex][index].isSuffStock) selectShoppingCartDataList.push(dataArray[dindex][index]);
      } else {
        var oldSelectShoppingCartDataList = selectShoppingCartDataList,
          selectShoppingCartDataList = [];
        if (oldSelectShoppingCartDataList != null && oldSelectShoppingCartDataList != undefined && oldSelectShoppingCartDataList.length > 0) {
          for (var i = 0; i < oldSelectShoppingCartDataList.length; i++) {
            if (oldSelectShoppingCartDataList[i].id != dataArray[dindex][index].id) selectShoppingCartDataList.push(oldSelectShoppingCartDataList[i]);
          }
        }
      }
      dataArray[dindex][index].isSel = isSel;
      that.setData({
        dataArray: dataArray,
        selectShoppingCartDataList: selectShoppingCartDataList,
      })
      that.calculateSelShoppingCart();
    }
  },
  //方法：计算所选购物车记录总价
  calculateSelShoppingCart: function () {
    var that = this,
      selectShoppingCartDataList = that.data.selectShoppingCartDataList,
      totalPrice = 0.00,
      totalOriginalPrice = 0.00,
      discountAmount = 0.00;
    if (selectShoppingCartDataList != null && selectShoppingCartDataList != undefined && selectShoppingCartDataList.length > 0) {
      for (var i = 0; i < selectShoppingCartDataList.length; i++) {
        totalPrice += selectShoppingCartDataList[i].price * selectShoppingCartDataList[i].num;
        totalOriginalPrice += selectShoppingCartDataList[i].originalPrice * selectShoppingCartDataList[i].num;
      }
      totalPrice = parseFloat(totalPrice.toFixed(app.data.limitQPDecCnt));
      totalOriginalPrice = parseFloat(totalOriginalPrice.toFixed(app.data.limitQPDecCnt));
      discountAmount = totalOriginalPrice - totalPrice;
      discountAmount = discountAmount < 0.00 ? 0.00 : discountAmount;
      discountAmount = parseFloat(discountAmount.toFixed(app.data.limitQPDecCnt));
    }
    that.setData({
      totalPrice: totalPrice,
      totalOriginalPrice: totalOriginalPrice,
      discountAmount: discountAmount,
    })
  },

  //事件：立即购买按钮事件
  gotoPayItems: function (event) {
    var that = this,
      selectShoppingCartDataList = that.data.selectShoppingCartDataList;
    if (isDowithing) {
      wx.showToast({
        title: "操作进行中...",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (selectShoppingCartDataList == null || selectShoppingCartDataList == undefined || selectShoppingCartDataList.length <= 0) {
      wx.showToast({
        title: "请选择需要购买的商品记录！",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 检查饮品店内商品不能和普通收货地址一起下单
    // 普通商品
    var isSimple = false
    // 店内商品
    var isShop = false
    for (let index = 0; index < selectShoppingCartDataList.length; index++) {
      const element = selectShoppingCartDataList[index];
      var mold = element.mold + ""
      // 判断是否店内商品
      if (mold.indexOf("80") == 0 || mold.indexOf("81") == 0) {
        isShop = true
      } else {
        isSimple = true
      }
    }
    if (isShop && isSimple) {
      wx.showToast({
        title: "饮品店内商品不能和普通商品同时提交",
        icon: 'none',
        duration: 2500
      })
      return;
    }

    var isCustomizedProduct = false,
      itemList = [],
      listItem = null,
      detailList = [],
      detailListItem = null,
      companyId = app.data.agentCompanyId,
      userId = appUserInfo.userId,
      mobile = appUserInfo.userMobile,
      amount = 0.00,
      isSmoothly = true,
      // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
      linkNo = 0;

    for (var i = 0; i < selectShoppingCartDataList.length; i++) {
      if (selectShoppingCartDataList[i].mold == 5) {
        isCustomizedProduct = true;
        break;
      }
      if (selectShoppingCartDataList[i].num >= selectShoppingCartDataList[i].stock) {
        isSmoothly = false;
        break;
      }
      detailListItem = null;
      amount += selectShoppingCartDataList[i].amount;
      detailListItem = {
        product_id: selectShoppingCartDataList[i].productId,
        detail_id: selectShoppingCartDataList[i].productDetailId,
        number: selectShoppingCartDataList[i].num,
        price: selectShoppingCartDataList[i].price,
        priceflag: selectShoppingCartDataList[i].priceflag,
        amount: selectShoppingCartDataList[i].amount
      }
      detailList.push(detailListItem);
      linkNo = selectShoppingCartDataList[i].presellstatus == 1 ? 4 : (selectShoppingCartDataList[i].mold == 5 ? 5 : (selectShoppingCartDataList[i].mold == 6 ? 6 : 0));
      // 饮品店内商品
      if (isShop) {
        linkNo = "8"
        // 2个饮品商品合成一个订单
        if (itemList.length == 0 && i != selectShoppingCartDataList.length - 1) {
          continue
        }
      }
      listItem = {
        linkNo: linkNo,
        amount: amount,
        // 设备或来源id
        sourceId: app.data.agentDeviceId > 0 ? app.data.agentDeviceId : "",
        companyId: companyId,
        giftdetail: selectShoppingCartDataList[i].giftId,
        userId: userId,
        shareuserId: selectShoppingCartDataList[i].distributorId,
        mobile: mobile,
        deliveryId: 0,
        detail: detailList
      }
      itemList.push(listItem);
      detailList = [];
      amount = 0.00;
    }
    console.log("订单信息",itemList)
    if (isCustomizedProduct) {
      //如果包含定制商品
      that.getSrvOrderList();
    } else {
      //如果没包含定制商品
      if (!isSmoothly) {
        wx.showToast({
          title: "不能提交库存不足商品！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      //新增订单
      isDowithing = true;
      that.addSMOrderInfo(itemList);
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：跳转到我的订单列表页
  gotoMyOrder: function () {
    wx.navigateTo({
      url: packSMPageUrl + "/myorders/myorders"
    });
  },
  //方法：跳转订单详情页面
  gotoOrderDetailPage: function (orderId, tag) {
    var that = this,
      url = "";
    if (tag == 0) {
      url = packSMPageUrl + "/shoporders/shoporders?orderid=" + orderId + "&payno=";
      that.setData({
        selectShoppingCartDataList: [],
      })
      console.log("订单跳转：" + url);
      wx.navigateTo({
        url: url,
        fail: function (e) {
          isDowithing = false;
        }
      });
    } else if (tag == 1) {
      url = packSMPageUrl + "/shoporders/shoporders?orderid=&payno=" + orderId;
      that.setData({
        selectShoppingCartDataList: [],
      })
      console.log("订单跳转：" + url);
      wx.navigateTo({
        url: url,
        fail: function (e) {
          isDowithing = false;
        }
      });
    } else
      isDowithing = false;
  },
  //事件：跳转店铺详情
  viewShopDetail: function (e) {
    var that = this,
      shopId = 0;
    try {
      shopId = parseInt(e.currentTarget.dataset.shopid);
      shopId = isNaN(shopId) ? 0 : shopId;
    } catch (err) {}
    wx.navigateTo({
      url: packSMPageUrl + "/shopdetail/shopdetail?type=0&companyId=" + shopId
    });
  },
  //事件：浏览商品详情
  viewProductDetail: function (e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      did = e.currentTarget.dataset.did;
    if (Utils.myTrim(id) != "") {
      that.data.isForbidRefresh = true;
      wx.navigateTo({
        url: packSMPageUrl + "/storedetails/storedetails?isnv=1&pid=" + encodeURIComponent(id) + "&did=" + encodeURIComponent(did)
      });
    } else {
      wx.showToast({
        title: "无效商品！",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：立即下单
  gotoOrderQuickly: function () {
    var that = this,
      selectShoppingCartDataList = that.data.selectShoppingCartDataList;
    var itemList = [],
      listItem = null,
      detailList = [],
      detailListItem = null,
      companyId = app.data.agentCompanyId,
      userId = appUserInfo.userId,
      mobile = appUserInfo.userMobile,
      amount = 0.00,
      isSmoothly = true,
      linkNo = 0;

    for (var i = 0; i < selectShoppingCartDataList.length; i++) {
      if (selectShoppingCartDataList[i].num >= selectShoppingCartDataList[i].stock) {
        isSmoothly = false;
        break;
      }
      detailListItem = null;
      amount = 0.00;
      detailList = [];
      amount += selectShoppingCartDataList[i].amount;
      detailListItem = {
        product_id: selectShoppingCartDataList[i].productId,
        detail_id: selectShoppingCartDataList[i].productDetailId,
        number: selectShoppingCartDataList[i].num,
        price: selectShoppingCartDataList[i].price,
        priceflag: selectShoppingCartDataList[i].priceflag,
        amount: selectShoppingCartDataList[i].amount
      }
      detailList.push(detailListItem);
      linkNo = selectShoppingCartDataList[i].presellstatus == 1 ? 4 : (selectShoppingCartDataList[i].mold == 5 ? 5 : (selectShoppingCartDataList[i].mold == 6 ? 6 : 0));
      listItem = {
        linkNo: linkNo,
        amount: amount,
        companyId: companyId,
        giftdetail: selectShoppingCartDataList[i].giftId,
        userId: userId,
        shareuserId: selectShoppingCartDataList[i].distributorId,
        mobile: mobile,
        deliveryId: 0,
        detail: detailList
      }
      itemList.push(listItem);
    }
    if (!isSmoothly) {
      wx.showToast({
        title: "不能提交库存不足商品！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //新增订单
    isDowithing = true;
    that.addSMOrderInfo(itemList);
  },
  //方法：获取服务订单列表
  getSrvOrderList: function () {
    var that = this;
    wx.showLoading({
      title: "数据加载中...",
    })
    app.getCurSrvOrderId(that, appUserInfo.userId, "", "&status=1,2,3", 5);
  },
  //方法：获取订单号结果处理方法
  //dataItem：获取的订单数据实体
  //orderId：订单号
  //tag：调用结果：1成功，0失败
  dowithGetCurSrvOrderId: function (orderList, tag) {
    var that = this;
    wx.hideLoading();
    //1成功，0失败
    switch (tag) {
      case 1:
        if (orderList != null && orderList != undefined && orderList.length > 0) {
          wx.showModal({
            title: '提示',
            content: "尚有未完成定制订单，您确定再次购买吗？",
            cancelText: "查看订单",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.gotoOrderQuickly();
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: packOtherPageUrl + "/storeDLDD/storeDLDD?linkNo=5"
                });
              }
            }
          })
        } else {
          that.gotoOrderQuickly();
        }
        break;

      default:
        wx.showToast({
          title: "查询未完成订单失败！",
          icon: 'none',
          duration: 2000
        })
        that.data.isLoad = true;
        break;
    }
  },
  //方法：跳转微官网
  returnMicroSiteApp: function (e) {
    var that = this;
    app.returnSiteApp(that);
  },
})
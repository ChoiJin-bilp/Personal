// pages/Gammon/Gammon.js
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
    sysName: app.data.sysName,         //系统名称
    DataURL: DataURL,
    SMDataURL: SMDataURL,
    alltype: false,
    rbImgCnt: 0, //已有图片数量
    rbImgArray: [], //图片列表数值
    isAgree: false,
    proDataInfo: [],
    CompanydataList: [],
    selCompanydataIndex: 0,
    // 角色 2平台 4酒店
    user_roleId: app.data.user_roleId,
    //账户绑定用户ID
    accountBindUserId: app.data.accountBindUserId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    appUserInfo = app.globalData.userInfo
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    var proDataInfo = {
      id: 0,
      pid: 0,
      productHotelId: 0,
      productDetailId: "",
      // 商品类型
      productTypeId: 0,
      productName: '',
      secondProductName: '',
      // 商品编号
      paroductNo: '',
      companyId: app.data.companyId,
      shopId: app.data.companyId,
      photos: [],
      // Detail
      productDetailList: [],
      remark: '',
      // 0:上架  1:下架
      status: 0,
      // Status
      shelfStatus: 0,
      introductionImgs: [],
      mold: 0,
      videoList: [],
      sort: 0,
      createBy: userId,
      area: "",
      window: "",
      bed: "",
      wifi: "",
      cast: "",
      conveniences: "",
      bathroom: "",
      media: "",
      foodAndDrink: "",
      rulesOfuse: "",
      price: "",
    }
    that.setData({
      proDataInfo: proDataInfo,
      //账户绑定用户ID
      accountBindUserId: app.data.accountBindUserId,
    })
    var proId = options.pid
    that.getHotleCompany()
    if (proId > 0) {
      wx.setNavigationBarTitle({
        title: '房源编辑',
      })
      that.getMainDataList(proId);
    } else {
      // that.getProductTypeList()
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  //下架的状态
  onChangealltype() {
    var proDataInfo = this.data.proDataInfo
    proDataInfo.status = 1;
    this.setData({
      alltype: true,
      proDataInfo: proDataInfo,
    })
  },

  // 上架
  onChangealltypef() {
    var proDataInfo = this.data.proDataInfo
    proDataInfo.status = 0;
    this.setData({
      alltype: false,
      proDataInfo: proDataInfo,
    })
  },

  getInput: function (e) {
    var value = e.detail.value
    var tag = parseInt(e.currentTarget.dataset.tag)
    var name
    switch (tag) {
      case 0:
        name = "proDataInfo.productName"
        break
      case 1:
        name = "proDataInfo.sort"
        break
      case 2:
        name = "proDataInfo.area"
        break
      case 3:
        name = "proDataInfo.window"
        break
      case 4:
        name = "proDataInfo.bed"
        break
      case 5:
        name = "proDataInfo.wifi"
        break
      case 6:
        name = "proDataInfo.cast"
        break
      case 7:
        name = "proDataInfo.conveniences"
        break
      case 8:
        name = "proDataInfo.bathroom"
        break
      case 9:
        name = "proDataInfo.media"
        break
      case 10:
        name = "proDataInfo.foodAndDrink"
        break
      case 11:
        name = "proDataInfo.rulesOfuse"
        break
      case 12:
        name = "proDataInfo.price"
        break
    }
    this.setData({
      [name]: value,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //事件：图片上传事件
  uploadImg: function (e) {
    var proDataInfo = this.data.proDataInfo
    if (proDataInfo.photos.length == 6) {
      wx.showToast({
        title: '最多只能上传6张图片',
        icon: "none",
        duration: 1500
      })
      return
    }
    var that = this,
      sType = 0,
      maxOtherImgCnt = that.data.maxOtherImgCnt,
      rbImgCnt = that.data.rbImgCnt,
      maxReduceImgCnt = that.data.maxReduceImgCnt,
      reduceImgCnt = that.data.reduceImgCnt,
      enableOtherImgCnt = maxOtherImgCnt - rbImgCnt,
      enableReduceImgCnt = maxReduceImgCnt - reduceImgCnt;


    //sType:0 封面图片，1 其他图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) {}
    }
    //0封面单张图片，1多张相关图片，2多张介绍图片
    switch (sType) {
      //文章封面相关多图上传
      case 1:
        app.uploadImg(that, sType, rbImgCnt, maxOtherImgCnt)
        break;

        //介绍图片多图上传
      case 2:
        app.uploadImg(that, sType, reduceImgCnt, maxReduceImgCnt)
        break;

        //单图片上传
      default:
        app.uploadImg(that, sType, 0, 1)
        break;
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this;
    switch (sType) {
      case 0:
        var exhbitionData = that.data.exhbitionData;
        exhbitionData.coverImage = imgUrl;
        that.setData({
          exhbitionData: exhbitionData
        })
        break;
      case 1:
        var rbImgCnt = that.data.rbImgCnt
        var proDataInfo = that.data.proDataInfo;
        proDataInfo.photos.push(imgUrl);
        rbImgCnt = proDataInfo.photos.length;
        that.setData({
          rbImgCnt: rbImgCnt,
          proDataInfo: proDataInfo,
        })
        break;
      case 2:
        var reduceImgCnt = that.data.reduceImgCnt,
          reduceImgArray = that.data.reduceImgArray;
        reduceImgArray.push(imgUrl);
        reduceImgCnt = reduceImgArray.length;
        that.setData({
          reduceImgCnt: reduceImgCnt,
          reduceImgArray: reduceImgArray,
        })
        break;
    }
  },

  //事件：删除其他图片
  delrbImgList: function (e) {
    var that = this,
      tag = 0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (e) {}
    var index = e.currentTarget.dataset.index;
    //0招商图片，1招商介绍图片
    switch (tag) {

      default:
        var reduceImgArray = that.data.reduceImgArray,
          reduceImgCnt = 0;
        reduceImgArray.splice(index, 1);
        reduceImgCnt = reduceImgArray.length;

        that.setData({
          reduceImgCnt: reduceImgCnt, //已有图片数量
          reduceImgArray: reduceImgArray, //图片列表数值
        })
        break;

      case 1:
        var proDataInfo = that.data.proDataInfo,
          rbImgCnt = 0;
        proDataInfo.photos.splice(index, 1);
        rbImgCnt = proDataInfo.photos.length;

        that.setData({
          rbImgCnt: rbImgCnt, //已有图片数量
          proDataInfo: proDataInfo, //图片列表数值
        })
        break;
    }
  },

  clickCheckbox() {
    this.setData({
      isAgree: !this.data.isAgree,
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
   * 获取商品详情
   * @param {*} pid 
   */
  getMainDataList(id) {
    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId
    let signParam = 'cls=product_goodtype&action=QueryProductTypes'
    var otherParam = "&id=" + id + "&sDetail=price,updateDate&status=0,1&pSize=10&pIndex=1&userId=" + userId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 1, "获取商品详情")
  },
  /**
   * 获取商品类型
   */
  getProductTypeList() {
    let signParam = 'cls=product_goodtype&action=QueryTypes'
    var otherParam = "&sField=sort&sOrder=asc&typeId=2&companyId=" + app.data.companyId
    app.doGetData(this, app.getUrlAndKey.smurl, signParam, otherParam, 0, "获取商品类型")
  },
  getRuslt: function (data, code, error, tag) {
    let that = this;
    switch (code) {
      case 1:
        console.log(data)
        switch (tag) {
          case 0:
            if (data.length > 0) {
              var proDataInfo = that.data.proDataInfo
              proDataInfo.productTypeId = data[0].id
              proDataInfo.companyId = data[0].companyId
              that.data.proDataInfo = proDataInfo
            }
            break
          case 1:
            if (data.length > 0) {
              var proDataInfo = that.data.proDataInfo

              proDataInfo.productTypeId = data[0].productTypeId
              proDataInfo.companyId = data[0].companyId

              // 找出绑定的酒店
              var selCompanydataIndex = 0
              for (let i = 0; i < that.data.CompanydataList.length; i++) {
                var companydata = that.data.CompanydataList[i]
                if (companydata.id == proDataInfo.companyId) {
                  selCompanydataIndex = i
                }
              }
              proDataInfo.productName = data[0].productName
              proDataInfo.sort = data[0].sort
              proDataInfo.mold = data[0].mold
              proDataInfo.photos = data[0].photos.split(",")
              proDataInfo.area = data[0].area
              proDataInfo.window = data[0].window
              proDataInfo.bed = data[0].bed
              proDataInfo.wifi = data[0].wifi

              proDataInfo.cast = data[0].cast
              proDataInfo.conveniences = data[0].conveniences
              proDataInfo.bathroom = data[0].bathroom
              proDataInfo.media = data[0].media
              proDataInfo.foodAndDrink = data[0].foodAndDrink
              proDataInfo.rulesOfuse = data[0].rulesOfuse
              proDataInfo.price = data[0].price
              proDataInfo.status = data[0].status
              proDataInfo.id = data[0].id
              proDataInfo.pid = data[0].pid
              proDataInfo.productDetailId = data[0].detail[0].id
              proDataInfo.productHotelId = data[0].roomid

              var alltype = true
              // 上架
              if (proDataInfo.status == 0) {
                alltype = false
              }
              that.setData({
                proDataInfo: proDataInfo,
                alltype: alltype,
                selCompanydataIndex: selCompanydataIndex,
              })
            }
            break
          case 2:
            that.setData({
              CompanydataList: data.CompanydataList,
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
   * 选择酒店公司
   */
  bindPickerCompanyChange: function (e) {
    let index = e.detail.value
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selCompanydataIndex: index,
    })
  },

  commitSH() {
    let that = this
    var proDataInfo = that.data.proDataInfo

    if (!that.data.isAgree) {
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
    if (Utils.myTrim(proDataInfo.price) == "") {
      wx.showToast({
        title: "商品售价不能为空！",
        icon: 'none',
        duration: 1500
      })
      return;
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
    var companyId = that.data.CompanydataList[that.data.selCompanydataIndex].id

    var dlistItem = {
      id: proDataInfo.productDetailId,
      // productId: proDataInfo.productId,
      // attributeOne: item.attributeOne,
      // sn: item.sn,
      price: proDataInfo.price,
      // stock: item.stock,
      // photos: detailPhotoStr,
    }
    var productDetail = []
    productDetail.push(dlistItem);

    var productHotel = {
      id: proDataInfo.productHotelId,
      area: proDataInfo.area,
      window: proDataInfo.window,
      bed: proDataInfo.bed,
      wifi: proDataInfo.wifi,
      cast: proDataInfo.cast,
      conveniences: proDataInfo.conveniences,
      bathroom: proDataInfo.bathroom,
      media: proDataInfo.media,
      foodAndDrink: proDataInfo.foodAndDrink,
      rulesOfuse: proDataInfo.rulesOfuse,
      window: proDataInfo.window,
    }
    var productHotelInfo = []
    productHotelInfo.push(productHotel);

    var mold = proDataInfo.mold
    if (that.data.user_roleId == 2) {
      mold = 70
    } else if (that.data.user_roleId == 4) {
      mold = 71
    }

    var product = {
      // productId: proDataInfo.productId,
      pid: proDataInfo.pid,
      id: proDataInfo.id,
      // cardId: Utils.isNotNull(cardItem) ? cardItem.id : 0,
      companyId: companyId,
      // 房型
      // productTypeId: proDataInfo.productTypeId,
      productTypeId: 0,
      type: 2,
      productName: proDataInfo.productName,
      // address: proDataInfo.paroductNo,
      photos: proDataInfo.photos.join(","),
      status: proDataInfo.status,
      sort: proDataInfo.sort,
      mold: mold,
      remark: proDataInfo.remark,
      // detailPhotos: introductionImgsSrcValue,
      secondProductName: proDataInfo.secondProductName,
      productDetail: productDetail,
      productHotelInfo: productHotelInfo,
      delDetailIDList: "",
      // createBy: proDataInfo.createBy,
    }

    var userId = appUserInfo.userId
    userId = this.data.accountBindUserId

    var signParam = 'cls=main_mallProduct&action=saveMallProduct&userId=' + userId + "&xcxAppId=" + app.data.wxAppId
    app.doPostData(this, app.getUrlAndKey.url, signParam, "productjson", product, "", 0, "保存房间信息")

  },
  postRuslt: function (data, code, error, tag) {
    var that = this
    switch (code) {
      case 1:
        console.log(data)
        let msg = ""
        switch (tag) {
          case 0:
            msg = "提交成功！"
            //当前页面
            var pages = getCurrentPages();
            //上一页面
            var prevPage = pages[pages.length - 2];
            //直接给上一个页面赋值
            prevPage.setData({
              loadData: true
            });
            break
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          });
        }, 1600);
        break;
      default:
        console.log(error)
        break
    }
  },
  //隐藏协议
  onMyEvent(e) {
    this.setData({
      showModalserve: e.detail.myNum
    })
  },
  // 打开协议
  hideModalserve: function () {
    this.setData({
      showModalserve: true,
    })
  },
})
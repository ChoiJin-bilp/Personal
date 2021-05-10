const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;

var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
// index/gun/jsSwiper2/jsSwiper2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    createMode:0,//创建模式：0普通，1分享详情中创建
    userName: "",
    userJob: "",
    corporName: "",
    userPhone: "",
    userEmail: "",
    userMark: "",
    tel: "",
    userWechat: "",
    addr: "",
    personIntro: "",
    wxCodeImg: "",
    headerImg: "",
    productInfo: "",
    personalClass: "",
    personalTrade: "",
    school:"",
    hometown:"",
    userFile: [],
    userFileNum: 0,
    isShowSelselection: false,
    disabled: false,
    cardTemp: [],
    industrySort: ['智能家居', '数码', '时尚', '教育', '传媒', '金融', '艺术', '建筑', '制造', '健康', '互联网', '设计'], //所在行业选项
    objectArray: [
      {
        id: 0,
        name: '电子'
      },
      {
        id: 1,
        name: '零售'
      },
      {
        id: 2,
        name: '智能'
      },
      {
        id: 3,
        name: '服务'
      }
    ],
    index: 0,
    selectTemp: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if(options!=null && options!=undefined){
      var createMode=0;
      try{
        createMode=parseInt(options.mode);
        createMode = isNaN(createMode) ? 0 : createMode;
      }catch(e){}
      that.setData({
        createMode: createMode,
      })
    }
    this.queryCardTemp();
    this.getIndustryType();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!Utils.isNull(app.data.cardCompanyData)) {
      var companyData = app.data.cardCompanyData;
      that.setData({
        corporName: companyData.company,
        addr: companyData.addr
      })
      console.log("onshow:公司名", that.data.corporName)
    }
  },
  onUnload: function () {
    var that = this;
    console.log("卸载页面")
    app.data.cardCompanyData = "";
    app.data.cardCompanyDataStr = "";
  },
  selectTemplate: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      selectTemp: that.data.cardTemp[index]
    })
  },
  //保存创建信息
  saveCardInfo: function (e) {
    var that = this;
    if (that.data.disabled) {
      return;
    }
    that.setData({
      disabled: true
    })
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(that.data.userName) || that.data.userName == "") {
      wx.showToast({
        title: '请输入您的姓名！',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        disabled: false,
      })
      return;
    }
  if (that.data.userPhone.length > 0 && !myreg.test(that.data.userPhone)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000,
      })
      that.setData({
        disabled: false,
      })
      return;
    }

    that.insertCard();
  },
  //图片上传
  uploadDIY(filePaths, successUp, failUp, i, length, type) {
    var that = this;
    var userFileNum = 0;
    wx.showLoading({
      title: '正在上传图片中...',
      mask: true
    })
    if (type == 0) { //相册判断最多上传6张
      userFileNum = that.data.userFile.length + 1;
      console.log("准备上传第" + userFileNum + "张图片")
      if (userFileNum > 6) {
        wx.showToast({
          title: '名片相册最多上传6张照片！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
    wx.uploadFile({
      url: URL + urlParam,
      filePath: filePaths[i],
      name: 'file',
      formData: {

      },
      success: (res) => {
        console.log(URL + urlParam)
        console.log(res)
        successUp++;
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) { }
        if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          var imgUrl = "";
          if (data.data.fileName != null && data.data.fileName != undefined) {
            imgUrl = data.data.fileName;
            if (type == 1) { // 二维码
              var wxCodeImg = that.data.wxCodeImg;
              wxCodeImg = wxCodeImg.concat(imgUrl);
              that.setData({
                wxCodeImg: wxCodeImg,
                updateStatus: true,
                updateFileStatus: true,
              })
            }else if(type == 0){
              var userFile = that.data.userFile;
              userFile = userFile.concat(imgUrl);
              that.setData({
                userFile: userFile,
                userFileNum: userFileNum,
                updateStatus: true,
                updateFileStatus: true,
              })
              console.log("用户当前图片数量：", that.data.userFile)
            } else if (type == 2) {   //名片头像
              console.log(imgUrl)
              that.setData({
                headerImg: imgUrl,
                updateStatus: true,
                updateFileStatus: true,
              })
              console.log("用户当前图片：", that.data.imgUrl)
              console.log("用户当前图片：", that.data.headerImg)
            }
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          console.log("用户当前图片：", that.data.userFile)
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
          wx.hideLoading();
        } else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length, type);
        }
      },
    });
  },
  uploadImage: function (e) {
    var that = this, sType = 0;
    //sType:0 相册图片（多个），2 微信分享图片（单个）
    sType = parseInt(e.currentTarget.dataset.type);
    var count = 1;
    if (sType == 0) {
      var userFile = that.data.userFile;
      if (!Utils.isNull(userFile) && userFile.length > 0) {
        count = 6 - userFile.length;
      } else {
        count = 6;
      }
    }
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, sType);
      },
    });
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    app.viewImg(e);
  },
  //查询名片模板
  queryCardTemp: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_cardTemplate&action=cardTemplateList&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          that.setData({
            selectTemp: data[0],
            cardTemp: data
          })
        } else {
          app.setErrorMsg2(that, "查询名片模板失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询名片模板失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //创建卡片接口
  insertCard: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserInfo&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    var userFile = that.data.userFile;
    var userFileParam = "";
    if (userFile.length > 0) {
      userFileParam = userFile.join(",");
    }
    var personalTrade = that.data.personalTrade;
    var personalTradeStr = "";
    if (!Utils.isNull(personalTrade)){
      for (let i = 0; i < personalTrade.length; i++) {
        personalTradeStr += personalTrade[i] + "|";
      }
    }
    
    var Params = "&opertion=add&contact=" + encodeURIComponent(that.data.userName) + "&job=" + encodeURIComponent(that.data.userJob) + "&company=" + encodeURIComponent(that.data.corporName) + "&mobile=" + encodeURIComponent(that.data.userPhone) + "&email=" + encodeURIComponent(that.data.userEmail) + "&tel=" + that.data.tel + "&wxnumber=" + that.data.userWechat + "&addr=" + encodeURIComponent(that.data.addr) + "&personIntro=" + encodeURIComponent(that.data.personIntro) + "&companyId=" + app.globalData.userInfo.companyId + "&userFile=" + userFileParam + "&wxCodeImg=" + that.data.wxCodeImg + "&cardTemplateId=" + that.data.selectTemp.id + "&remark=" + encodeURIComponent(that.data.userMark) + "&productInfo=" + encodeURIComponent(that.data.productInfo) + "&personalClass=" + encodeURIComponent(that.data.personalClass) + "&headerImg=" + encodeURIComponent(that.data.headerImg) + "&school=" + encodeURIComponent(that.data.school) + "&hometown=" + encodeURIComponent(that.data.hometown) + "&personalTrade=" + encodeURIComponent(personalTradeStr);
    
    urlParam = urlParam + app.data.cardCompanyDataStr + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + Params;
    console.log("创建名片URL：",URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          app.data.cardCompanyDataStr = "";
          app.data.temporaryCompany = "";
          that.setData({
            disabled: false
          })
          if (that.data.createMode==1){
            wx.reLaunch({
              url: packComPageUrl + "/card/card?currentData=1"
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        } else {
          that.setData({
            disabled: false
          })
          app.setErrorMsg2(that, "创建名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        that.setData({
          disabled: false
        })
        app.setErrorMsg2(that, "创建名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //方法：获取注册行业角色类型
  getIndustryType: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=userBaseData&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log(urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取注册行业角色类型：", res.data)
        if (res.data.rspCode == 0) {
          var data = res.data.data;
          var tradeClass = data.tradeClass;
          var industrySort = tradeClass.split("|"); //所在行业。
          var industry2 = [];
          console.log('industrySort', industrySort)
          for (let i = 0; i < industrySort.length; i++){
            var array = {
              'name': industrySort[i],
              'checked': false
            }
            industry2 = industry2.concat(array)
          }
          that.setData({
            industrySort: industry2,
          })
          console.log('array', industry2)
        } else {
          app.setErrorMsg2(that, "获取注册行业角色类型：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: "获取信息失败！",
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取注册行业角色类型：失败！fail：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: "网络异常！",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //获取标注
  getUserMark: function (e) {
    var that = this;
    var val = e.detail.value;
    console.log(val)
    that.setData({
      userMark: val
    })
  },
  //获取姓名
  getUserName: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      userName: val
    })
  },  //获取职务
  getUserJob: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      userJob: val
    })
  },  //获取公司名称
  getCorporName: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      corporName: val
    })
  },  //获取手机号码
  getUserPhone: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      userPhone: val
    })
  },  //获取邮箱
  getUserEmail: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      userEmail: val
    })
  },  //获取电话号码
  getCorporTel: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      tel: val
    })
  },  //获取微信名称
  getUserWechat: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      userWechat: val
    })
  },  //获取地址
  getCorporAddr: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      addr: val
    })
  },
  //获取个人简介
  getPersonIntro: function (e) {
    var that = this;
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    that.setData({
      personIntro: val
    })
  },
  companyDetails: function () {
    var data = {
      company: this.data.corporName,
      addr: this.data.addr,
      companyWebSite: null,
      intro: null,
      legal: null,
      companyTel: null,
      companyEmail: null,
      companyLogo: null,
      companyFile: null,
      companyData: true
    }
    app.data.temporaryCompany = data;
    wx.navigateTo({
      url: packComPageUrl + "/perfect/perfect?scene=1"
    });
  },
  //删除照片
  showModaltip: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.index;
    var userFile = that.data.userFile;
    userFile.splice(val, 1);
    var userFileNum = that.data.userFileNum - 1;
    that.setData({
      userFile: userFile,
      userFileNum: userFileNum,
      updateStatus: true,
      updateFileStatus: true,
    })
  },
  //删除照片
  hideModalHeaderImg: function (e) {
    var that = this;
    that.setData({
      headerImg: "",
      updateStatus: true,
      updateFileStatus: true,
    })
  },
  nextBlur: function (e) {
    var num = Number(e.target.id) + 1;
    this.setData({
      blurId: num
    })
    if (num == 7) {
      this.setData({
        compStatus: false
      })
    }
  },
  hideWXQRcode: function (e) {
    var that = this;
    that.setData({
      wxCodeImg: '',
      updateStatus: true,
      updateFileStatus: true,
    })
  },

  bindPickerChange: function (e) {
    var index = e.detail.value;
    var field = e.currentTarget.dataset.value;
    this.setData({
      updateStatus: true,
      [field]: this.data.industrySort[index],
    })
  },
  //获取输入修改内容
  getInput: function (e) {
    var that = this;
    var val = e.detail.value;
    var field = e.currentTarget.dataset.value;
    that.setData({
      [field]: val
    })
  },
  clicks2: function (e) {
    if (this.data.compStatus) {
      return;
    }
    let index = e.currentTarget.dataset.index;
    var industrySort = this.data.industrySort;
    var personalTrade = this.data.personalTrade;
    if (Utils.isNull(personalTrade)){
      personalTrade=[];
    }
    personalTrade = personalTrade.slice(0);
    if (industrySort[index].checked == false) {
      industrySort[index].checked = true;
      personalTrade.push(industrySort[index].name);
    } else {
      industrySort[index].checked = false;
      for (let i = 0; i < personalTrade.length; i++) {
        if (industrySort[index].name == personalTrade[i]) {
          personalTrade.splice(i, 1);
        }
      }
    };
    var num = 0;
    if (industrySort[index].checked) {
      for (let i = 0; i < industrySort.length; i++) {
        if (industrySort[i].checked) {
          ++num;
          if (num > 5) {
            industrySort[index].checked = false;
            wx.showToast({
              title: "最多只能选择5个行业！",
              icon: 'none',
              duration: 1500
            })
            return
          }
        }
      }
    }
    this.setData({
      personalTrade: personalTrade,
      industrySort: industrySort,
    })

  },
  showisShowSel: function () {
    this.setData({
      isShowSelselection: true
    })
  },
  hideisShowSel: function () {
    this.setData({
      isShowSelselection: false
    })
  },
})

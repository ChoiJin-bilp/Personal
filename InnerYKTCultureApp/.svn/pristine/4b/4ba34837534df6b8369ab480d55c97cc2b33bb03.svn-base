// pages/groupdata/groupdata.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages",footFolderDir="../../../";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo
    //授权提示
    isShowAuthor: false,
    DataURL: DataURL,
    updateFileDisabled:false,
    updateFileStatus:false,
    updateIntroStat:false,
    isShowSelMyCard:false,
    sweepState:false,
    disabled:true,//保存按钮 禁用
    cardgroupList:{},
    userData:[],
    selectCardIndex:0,
    imgUrls: [
      '../../../images/banner1.png',
      '../../../images/banner2.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
    // options.scene = 't=1&id=676&uid=916';
    var str = "";
    if (!Utils.isNull(options.scene)) {
      str = decodeURIComponent(options.scene);
      str = Utils.getToJson(str);
      console.log("options=", str)

      if (!Utils.isNull(str.id)) {
        var paramShareUId=0;
        if (!Utils.isNull(str.uid)) { //分享进入
          paramShareUId =str.uid
        }
        that.setData({
          qrCodeId: str.id,
          paramShareUId: paramShareUId,
          sweepState: true,  //-扫名片群进入
          sysLogoUrl: app.data.sysLogoUrl,
        })
        wx.showLoading({
          title: '加载中',
        })
        
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        console.log('开始登陆...', timestamp)
        app.getLoginUserInfo(this);
      }
    }else{
      if (options.status == 1){ //名片群设置进入
        var identity = 0;
        if (app.globalData.userInfo.userId == app.data.cardgroupData.shareQunUserId) {
          identity = 1; // 群主
        } else if (app.globalData.userInfo.userId == app.data.cardgroupData.assistantUserId) {
          identity = 2; // 管理
        }
        console.log("名片群数据：", app.data.cardgroupData)
        this.setData({
          cardgroupList: app.data.cardgroupData,
          identity: identity, // 1群主，0成员
          sysLogoUrl: app.data.sysLogoUrl,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.data.cardGroupOnshowStat = true;
    console.log('页面卸载', app.data.cardGroupOnshowStat)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //修改群资料
  updateGroupData: function (e) {
    var that = this;
    wx.showLoading({
      title: '请稍候...',
    })
    var cardgroupList = that.data.cardgroupList;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(cardgroupList.name) || Utils.isNull(cardgroupList.name)) {
      wx.showToast({
        title: '请输入群名称',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var id = cardgroupList.id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=1&ids=" + id + "&sign=" + sign + "&xcxAppId=" + app.data.wxAppId;
      if (that.data.updateIntroStat){
        urlParam += '&intro=' + encodeURIComponent(cardgroupList.intro);
      }
    if (that.data.fileNameStat){
      urlParam += '&name=' + encodeURIComponent(cardgroupList.name);
      }
    if (that.data.updateFileStatus) {
      var imgArr = cardgroupList.img;
      var imgStr = '';
      if (!Utils.isNull(imgArr)){
        for (let i = 0; i < imgArr.length; i++) {
          imgStr += imgArr[i] + ",";
        }
        imgStr = imgStr.substring(0, imgStr.length - 1)
      }
      console.log("图片Str:", imgStr)
      urlParam += '&img=' + encodeURIComponent(imgStr);
    }
    console.log("修改群资料URL:", URL + urlParam)

    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("修改群资料：", res)
        if (res.data.rspCode == 0) {
          app.data.cardgroupUpData = res.data.data;
          app.data.cardGroupOnshowStat = true;
          that.setData({
            updateIntroStat:false,
            fileNameStat:false,
            updateFileStatus:false,
            disabled:true,
          })
          wx.showToast({
            title: '保存成功',
            duration: 1500
          })
          wx.navigateBack({
            delta:1
          })
        } else {
          app.setErrorMsg2(that, "修改群资料失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "修改群资料失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },complete:function(){
        wx.hideLoading();
      }
    })
  },
  //上传图片
    uploadImage: function (e) {
    var that = this;
      if (that.data.updateFileDisabled || that.data.disabled) {
      console.log('end')
      return;
    }
    that.setData({
      updateFileDisabled: true
    })
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
      var count = 1;
      var img = that.data.cardgroupList.img;
      if (!Utils.isNull(img) && img.length > 0) {
        count = 6 - img.length;
      } else {
        count = 6;
      }
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
              var successUp = 0; //成功个数
              var failUp = 0; //失败个数
              var length = res.tempFilePaths.length; //总共个数
              var i = 0; //第几个
              this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
        }
      }, fail: function (err) {
        that.setData({
          updateFileDisabled: false
        })
        wx.hideLoading()
      }
    });
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    app.viewImg(e);
  },
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.showLoading({
      title: '正在上传图片中...',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.uploadFile({
      url: URL + urlParam,
      filePath: filePaths[i],
      name: 'file',
      formData: {
        
      },
      success: (res) => {
        successUp++;
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) { }
        if (!Utils.isNull(data) && !Utils.isNull(data.rspCode) && data.rspCode == 0) {
          var imgUrl = data.data.fileName;
          var cardgroupList = that.data.cardgroupList;
          if (Utils.isNull(cardgroupList.img)){
            cardgroupList.img = [];
          }
          cardgroupList.img = cardgroupList.img.concat(imgUrl);
          console.log('上传图片成功:', cardgroupList.img)
          that.setData({
            updateFileStatus:true,
            cardgroupList: cardgroupList
        })
          console.log("cardgroupList", cardgroupList)
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
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
          that.setData({
            updateFileDisabled: false
          })
          wx.hideLoading();
        } else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  //查询群名片数据
  contactFolderDetail: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=contactFolderDetail&id=" + that.data.qrCodeId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log("/查询群名片数据URL：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("/查询群名片数据群数据：", res)
        if (res.data.rspCode == 0) {
          if (!Utils.isNull(res.data.data)){
            var data = res.data.data;
            if(!Utils.isNull(data.img)){
              data.img = data.img.split(',');
            }
            that.setData({
              cardgroupList: data,
              identity: 0
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '该名片群已被删除',
              showCancel:false,
              confirmText:'进入主页',
              success(res) {
                if (res.confirm) {
                  that.JumpPage();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
          
          console.log("/查询群名片数据群数据：", that.data.cardgroupList)
        } else {
          app.setErrorMsg2(that, "/查询群名片数据失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询二维码里的名片群数据失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },
  //获取名片
  getMainDataList: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=myContactList&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log('获取名片')
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('获取名片', res)
        if (res.data.rspCode == 0) {
          var data = res.data; // 接口相应的json数据
          var mydataList = data.data.mydataList;
          var cardTemplateList = data.data.cardTemplateList;
          app.data.cardTemplateList = cardTemplateList;
          if (mydataList.length > 0) {
            for (var i = 0; i < mydataList.length; i++) {
              if (!Utils.isNull(mydataList[i].userFile)) {
                var imgFile = mydataList[i].userFile.split(",");
                mydataList[i].userFile = imgFile;
              } else {
                mydataList[i].userFile = [];
              }
              for (var y = 0; y < cardTemplateList.length; y++) {
                if (mydataList[i].cardTemplateId == cardTemplateList[y].id) {
                  mydataList[i].cardTemp = cardTemplateList[y];
                }
              }
              if (!Utils.isNull(mydataList[i].companyInfo) && !Utils.isNull(mydataList[i].companyInfo.companyFile)) {
                var companyImgFile = mydataList[i].companyInfo.companyFile.split(",");
                mydataList[i].companyInfo.companyFile = companyImgFile;

              } else {
                // mydataList[i].companyInfo.companyFile = [];
              }

            }

          }
          console.log("名片数据：", mydataList)
          that.setData({
            userData: mydataList,
          })
          if (that.data.sweepState) {
            that.setData({
              isJoinBut:true
            })
          }
          wx.hideLoading();
        } else {
          wx.hideLoading();
          app.setErrorMsg2(that, "获取名片夹信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg2(that, "获取名片夹信息失败：fail！错误信息：" + err, URL + urlParam, false);
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
    var Params = "&companyId=" + app.globalData.userInfo.companyId + "&opertion=add&contact=" + encodeURIComponent(app.globalData.userInfo.userName) + "&headerImg=" + encodeURIComponent(app.globalData.userInfo.avatarUrl);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + app.data.cardCompanyDataStr + "&sign=" + sign + Params;
    console.log("自动创建名", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          var userData = [];
          var userMap = res.data.data.userMap;
          userMap.contactId = res.data.data.contactMap.contactId;
          userData.push(userMap);
          // var cardTemplateList = app.data.cardTemplateList;
          // for (let y = 0; y < cardTemplateList.length; y++) {
          //   if (userData[0].cardTemplateId == cardTemplateList[y].id) {
          //     userData[0].cardTemp = cardTemplateList[y];
          //   }
          // }

          that.setData({
            userData: userData,
          })
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            confirmText: '知道了',
            showCancel: false,
            content: '请完善名片资料，到＂我的名片＂去点开自己的名片，点击＂编辑＂按钮后完善名片资料。',
            success(res) {
              if (res.confirm) {
                that.sweepCodeGroup();
              } else if (res.cancel) {
              }
            }
          })
        } else {
          wx.hideLoading();
          app.setErrorMsg2(that, "自动创建名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showModal({
            title: '提示',
            content: '自动创建名片失败:' + res.data.rspMsg,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: packComPageUrl + "/newcard/newcard"
                });
              } else if (res.cancel) {
              }
            }
          })
          console.log("接口失败1：" + res)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg2(that, "自动创建名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //加群
  sweepCodeGroup: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=saveUserGXContact&contactId=" + that.data.userData[that.data.selectCardIndex].contactId + "&contactFolderId=" + that.data.qrCodeId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        that.setData({
          sweepState: false,
        })
        console.log('加入名片群', res)
        if (res.data.rspCode == 0) {
          that.setData({
            isShowSelMyCard: false,
          })
          var title = '加入成功';
          if (that.data.isNewCard) {
            title = '加入成功，请完善名片信息';
          }
          wx.showToast({
            title: title,
            duration: 1500
          })
        } else {
          that.setData({
            sweepState: false,
          })
          var title = '该名片已在此群';
          if(that.data.userData.length == 1){
            title = '已加入该群'
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        that.setData({
          sweepState: false,
        })
        app.setErrorMsg2(that, "扫码加名片群失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },
  //方法：登录用户信息获取
  getLoginUserInfo: function () {
    app.getLoginUserInfo(this);
  },
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
        that.setData({
          userInfo: app.globalData.userInfo
        })
        that.contactFolderDetail()

        if (that.data.sweepState) {
          that.getMainDataList();
        }
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
    app.getAuthorizeUserInfo(that,e);
  },
  //获取文件夹input输入
  onChangeName: function (e) {
    var that = this;
    var val = e.detail.value;
        val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;

      var cardgroupList = that.data.cardgroupList;
      cardgroupList.name = val;
      that.setData({
        cardgroupList: cardgroupList,
        fileNameStat: true,
        disabled: false,
      })
  },
  changeInpu: function (e) {
    var val = e.detail.value;
        val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    var str = 'cardgroupList.intro';
    this.setData({
      updateIntroStat:true,
      disabled: false,
      [str]: val
    })
  },
  hideModalHeaderImg: function (e) {
    var that = this;
    var userFileStr = "cardgroupList.img";
    that.setData({
      [userFileStr]: '',
      updateFileStatus: true,
      disabled: false,
    })
  },
  showSelMyCardPop: function () {
    console.log(this.data.userData)
    if (this.data.userData.length > 1) {
      this.setData({
        isShowSelMyCard: true,
      })
    } else if (this.data.userData.length == 1){
      this.sweepCodeGroup();
    } else if (this.data.userData.length == 0){
      this.insertCard();
    }
  },
  hideSelMyCardPop: function () {
    this.setData({
      isShowSelMyCard: false
    })
  },
  hidecardbeizhu:function(){
    this.setData({
      disabled:false
    })
  },
  selectVCard: function (e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    this.setData({
      selectCardIndex: index
    })
  },
  //返回主页
  JumpPage: function () {
    var that = this;
    wx.reLaunch({
      url: footFolderDir + app.data.sysMainPage
    })
  },
  showModaltip: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.index;
    var img = that.data.cardgroupList.img;
    img.splice(val, 1);
    var imgStr = "cardgroupList.img"
    that.setData({
      [imgStr]: img,
      updateFileStatus: true,
    })
  },
})
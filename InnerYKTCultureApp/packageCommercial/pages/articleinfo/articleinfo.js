// pages/articleinfo/articleinfo.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, isSaveing = false, packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages", footFolderDir = "../../../";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysName: app.data.sysName,         //系统名称
    sysLogoUrl: app.data.sysLogoUrl,   //系统Logo
    //授权提示
    isShowAuthor: false,
    disabled: true,  //不可编辑状态
    //文章信息
    max_filename:40,
    max_filecontent:1500,
    contents:'请输入文章标题20字以内',
    rbImgCnt: 0,             //已有图片数量
    rbImgArray: [],          //图片列表数值
    rbIndex:0,

    tmpContentData:{
      index: 0, imgSrc: DataURL + "/images/upload.png", content: "", isUploadSingle:false,
    },
    curRBImgUrl: '',          //单张图片相对URL
    curRBFName: '',           //当前文件名称
    curRBContent: '',         //当前文章内容

    curFileType: '0',              //文件类型
    curFileId: 0,
    curFolderId: 0,
    curFileUserId: 0,
    curFileCompanyId: 0,
    curCardId: 0,

    viewTag: 0,                //浏览类型：0文章浏览，1发送预览，2接收浏览
    sourcePage: "",    //上级页面

    showaddarticle: false,
    showModalsave:false,
    showMyArticleList:false,
    showSendImg:false,
    DataURL: DataURL,
    userData:{},
    scene:0,
    colleDisabled:false,
    redEnvelStat:false,
    showReceiveRedEnvel:false,//是否显示红包领取提示
    showRedEnvelPop:false,//红包弹窗
    successfulRedEnvel:false,//红包领取成功提示
    receivingRecords: false, //红包领取记录
    redEnvelReceiveStat: false, //红包是否领取
    shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
    shareTitle: "",
    recordnum: 0, //领取记录人数
    redInfoCode:0,//红包状态
    cardRedInfoId:'',
    shareBatch:'',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.scene == 1){ //分享进入
      that.setData({
        contactUserId: options.contactUserId,
        othersUserId: options.userId,
        paramShareUId: options.userId,
        scene: options.scene,
        articlesId: options.articlesId,
        shareBatch: options.batch,
        cardRedInfoId: options.cardRedInfoId,
        redEnvelStat: options.redEnvelStat,
        sysLogoUrl: app.data.sysLogoUrl, 
      })
      that.getLoginUserInfo();
      return
    } else if (options.scene == 2) { //已发记录查看
      that.setData({
        contactUserId: options.contactUserId,
        othersUserId: options.userId,
        scene: options.scene,
        articlesId: options.articlesId,
        cardRedInfoId: options.cardRedInfoId,
        redEnvelStat: options.redEnvelStat,
        userData: app.data.cardDetaData,
        sysLogoUrl: app.data.sysLogoUrl,
      })
      console.log('名片数据',app.data.cardDetaData)
      that.getVFArticleInfo(options.articlesId);
      that.requestQueryCardDetail();
      return
    }
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    var curFileId = 0, curFolderId=0, sourcePage = "";
    try {
      if (options.id != null && options.id != undefined)
        curFileId = parseInt(options.id);
      curFileId = isNaN(curFileId) ? 0 : curFileId;
    } catch (e) { }
    try {
      if (options.tFId != null && options.tFId != undefined)
        curFolderId = parseInt(options.tFId);
      curFolderId = isNaN(curFolderId) ? 0 : curFolderId;
    } catch (e) { }
    try {
      if (options.tag != null && options.tag != undefined)
        sourcePage = options.tag
    } catch (e) { }
    that.data.curFolderId = curFolderId;
    that.data.sourcePage = sourcePage;
    if (curFileId>0){
      that.setData({
        sysLogoUrl: app.data.sysLogoUrl,
      })
      that.getVFArticleInfo(curFileId);
    }else{
      that.setData({
        curFileType: '2',              //文件类型
        curFileId: 0,
        curFolderId: curFolderId,
        curFileUserId: appUserInfo.userId,
        curFileCompanyId: appUserInfo.companyId,
        disabled: false,
        sysLogoUrl: app.data.sysLogoUrl,
      })
    }
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
        that.getVFArticleInfo(that.data.articlesId);
        that.requestQueryCardDetail();
        break;
    }
  },

  //事件：取消注册
  cancelRegAuthorization: function(e) {
    var that = this;
    app.cancelRegAuthorization(that);
  },
  //事件：授权用户信息
  getAuthorizeUserInfo: function (e) {
    var that = this;
    app.getAuthorizeUserInfo(that, e);
  },
  /**
   * 用户点击右上角分享事件
   */
  onShareAppMessage: function (res) {
    let that = this;
    // 来自页面内转发按钮
    wx.hideToast();
    that.setData({
      showModalsave: false,
      remarkStatus: false
    })
    var articlesId = "";
    var path = "";
    var redEnvelStat = false;
    var cardRedInfoId = "";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (that.data.redEnvelPrice > 0) {
      var timestamp = Date.parse(new Date());
      cardRedInfoId = app.globalData.userInfo.userId + that.data.userData.id + timestamp;
      that.requestRedEnvel(cardRedInfoId);
      redEnvelStat = true;
    }
    if (!that.data.showSendImg && !Utils.isNull(that.data.selectedArticles)) { //分享带文章
      path = '/packageCommercial/pages/articleinfo/articleinfo?scene=1&contactUserId=' + that.data.userData.id + '&userId=' + app.globalData.userInfo.userId + "&articlesId=" + that.data.selectedArticles.id + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.userData.contactId
    } else {
      path = '/packageCommercial/pages/card/card?status=1&contactUserId=' + app.data.userCardDetaData.id + '&checked=' + that.data.checked + '&userId=' + app.globalData.userInfo.userId + "&redEnvelStat=" + redEnvelStat + "&cardRedInfoId=" + cardRedInfoId + "&batch=" + timestamp + "&contactId=" + that.data.userData.contactId
    }
    var shareWXImg = that.data.shareWXImg;
    var shareTitle = that.data.shareTitle;
    if (Utils.isNull(shareTitle)) {
      shareTitle = that.data.userData.contact + "的名片";
    }

    console.log("分享路径：", path)
    that.requestCardRecord(cardRedInfoId, timestamp);//记录发送名片
    return {
      title: shareTitle,
      path: path,
      imageUrl: shareWXImg,
      success: (res) => {    // 失效
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    app.viewImg(e);
  },
  //方法：获取文件信息
  getVFArticleInfo: function (id) {
    var that = this, alertContent = "文章信息获取";

    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=fileDispose_fileDispose&action=getFileContext&fileId=" + id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("文章数据：",res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          var rbImgCnt = 0, rbImgArray = [], curRBImgUrl = '', curRBFName = '', curRBContent = '', curFileType = '0', curFileId = 0, curFileUserId = 0, curFileCompanyId = 0, curCardId = 0, curFolderId = 0;
          if (res.data.data != null && res.data.data != undefined) {
            var dataItem = res.data.data;
            if (dataItem.id != null && dataItem.id != undefined && Utils.myTrim(dataItem.id + "") != "")
              curFileId = parseInt(dataItem.id);
            curFileId = isNaN(curFileId) ? 0 : curFileId;
            if (dataItem.folderId != null && dataItem.folderId != undefined && Utils.myTrim(dataItem.folderId + "") != "")
              curFolderId = parseInt(dataItem.folderId);
            curFolderId = isNaN(curFolderId) ? 0 : curFolderId;
            if (dataItem.userId != null && dataItem.userId != undefined && Utils.myTrim(dataItem.userId + "") != "")
              curFileUserId = parseInt(dataItem.userId);
            curFileUserId = isNaN(curFileUserId) ? 0 : curFileUserId;
            if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "")
              curFileCompanyId = parseInt(dataItem.companyId);
            curFileCompanyId = isNaN(curFileCompanyId) ? 0 : curFileCompanyId;
            if (dataItem.cardIds != null && dataItem.cardIds != undefined && Utils.myTrim(dataItem.cardIds + "") != "")
              curCardId = parseInt(dataItem.cardIds);
            curCardId = isNaN(curCardId) ? 0 : curCardId;
            if (dataItem.name != null && dataItem.name != undefined && Utils.myTrim(dataItem.name + "") != "")
              curRBFName = dataItem.name;
            if (dataItem.file != null && dataItem.file != undefined && Utils.myTrim(dataItem.file + "") != "")
              curRBImgUrl = dataItem.file;
            if (dataItem.content != null && dataItem.content != undefined && Utils.myTrim(dataItem.content + "") != "")
              curRBContent = dataItem.content;
            if (dataItem.fileType != null && dataItem.fileType != undefined && Utils.myTrim(dataItem.fileType + "") != "")
              curFileType = dataItem.fileType;

            if (Utils.myTrim(curRBContent) != "") {
              var recordArray = curRBContent.split("%|%"), filedArray = null, tmpContentData = null, index=0, imgSrc=DataURL + "/images/upload.png", content="", isUploadSingle=false;
              for (var i = 0; i < recordArray.length; i++) {
                if (Utils.myTrim(recordArray[i]) != ""){
                  filedArray = null; tmpContentData = null;
                  filedArray = recordArray[i].split("%@%");
                  if(filedArray.length>0){
                    imgSrc = DataURL + "/images/upload.png"; content = filedArray[0]; isUploadSingle = false;
                    if(filedArray.length>1){
                      imgSrc = app.getSysImgUrl(filedArray[1]);isUploadSingle=true;
                    }
                    tmpContentData = {
                      index: index, imgSrc: imgSrc, content: content, isUploadSingle: isUploadSingle,
    }
                    rbImgArray.push(tmpContentData);
                    index++;
                  }
                }
              }
            }
            //文章信息
            that.setData({
              rbImgCnt: rbImgArray.length,             //已有图片数量
              rbImgArray: rbImgArray,          //图片列表数值

              curRBImgUrl: curRBImgUrl,          //单张图片相对URL
              curRBFName: curRBFName,           //当前文件名称
              curRBContent: curRBContent,         //当前文章内容

              curFileType: curFileType,              //文件类型
              curFileId: curFileId,
              curFolderId: curFolderId,
              curFileUserId: curFileUserId,
              curFileCompanyId: curFileCompanyId,
              curCardId: curCardId,
            })
            console.log(rbImgArray);
          }else{
            that.setData({
              contents:"该文章已删除!"
            })
          }
          

        } else {
          that.setData({
            showDelFolder: false,
          })
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, alertContent + "失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        that.setData({
          showDelFolder: false,
        })
        wx.showToast({
          title: alertContent + "接口失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, alertContent + "接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //方法：保存本地图片
  saveLocalFileInfo: function (isAllSave) {
    var that = this, alertContent = Utils.myTrim(that.data.curFileType) == '2' ? "文章保存" : "图片保存";

    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var fileJson = {
      id: that.data.curFileId, file: that.data.curRBImgUrl, name: Utils.filterTitle(that.data.curRBFName), folderId: that.data.curFolderId, userId: that.data.curFileUserId, companyId: that.data.curFileCompanyId, fileType: that.data.curFileType, content: that.data.curRBContent, cardIds: '',
    }
    var urlParam = "cls=fileDispose_fileDispose&action=addfile&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(JSON.stringify(fileJson));
    wx.request({
      url: URL + urlParam,
      method: "POST",

      data: {
        fileJson: JSON.stringify(fileJson)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          var curFileId = that.data.curFileId;
          if (curFileId<=0){
            try {
              curFileId = res.data.data != null && res.data.data != undefined ? parseInt(res.data.data.fileId) : 0;
              curFileId = isNaN(curFileId) ? 0 : curFileId;
            } catch (err) { }
          }
          
          if (isAllSave){
            //普通新增文件
            that.setData({
              disabled: true,
            })
          }
          that.getVFArticleInfo(curFileId);
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, alertContent + "失败！出错信息：" + JSON.stringify(res), URL + urlParam, false);
        }
        isSaveing = false;
      },
      fail: function (err) {
        isSaveing = false;
        wx.hideLoading();
        wx.showToast({
          title: alertContent + "接口调用失败！",
          icon: 'none',
          duration: 2000
        })
        app.setErrorMsg2(that, alertContent + "接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
      }
    })
  },
  //事件：编辑本地文件内容
  changeSPFileDataInfo: function (e) {
    var that = this;
    console.log("changeSPFileDataInfo----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value; 
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid) {
      case "currbname":
        if (len <= that.data.max_filename) {
          that.setData({
            curRBFName: value
          })
        }else{
          wx.showToast({
            title: "内容超长！",
            icon: 'none',
            duration: 2000
          })
        }
        break;

      case "currbcontent":
        if (len <= that.data.max_filecontent){ 
          var tmpContentData = that.data.tmpContentData;
          tmpContentData.content = value;

          that.setData({
            tmpContentData: tmpContentData
          })
        }else{
          wx.showToast({
            title: "内容超长！",
            icon: 'none',
            duration: 2000
          })
        }
        break;
    }
  },
  //事件：新增段落
  showAddArticle: function () {
    var that = this, rbImgArray = that.data.rbImgArray, index = 0, curRBFName = that.data.curRBFName;
    if (Utils.myTrim(curRBFName) == "") {
      wx.showToast({
        title: "请输入文章标题！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(rbImgArray!=null && rbImgArray!=undefined){
      index=rbImgArray.length;
    }else{
      rbImgArray=[];
    }
    var tmpContentData = {
      index: index, imgSrc: DataURL + "/images/upload.png", content: "", isUploadSingle: false,
    }
    that.setData({
      rbImgArray: rbImgArray,
      tmpContentData:tmpContentData,
      showaddarticle: true,
    })
  },
  //事件：段落编辑
  editArticleContent:function(e){
    var that = this, rbImgArray = that.data.rbImgArray, index = 0, tmpContentData=null;
    index = e.currentTarget.dataset.index;
    if (rbImgArray != null && rbImgArray != undefined) {
      try{
        tmpContentData = {
          index: index, imgSrc: rbImgArray[index].imgSrc, content: rbImgArray[index].content, isUploadSingle: rbImgArray[index].isUploadSingle,
        }

        that.setData({
          tmpContentData: tmpContentData,
          showaddarticle: true,
        })
      }catch(err){}
    }
  },
  //事件：段落删除
  delArticleContent:function(e){
    var that = this, rbImgArray = that.data.rbImgArray, index = 0;
    index = e.currentTarget.dataset.index;
    if (rbImgArray != null && rbImgArray != undefined) {
      try {
        rbImgArray.splice(index, 1);

        that.setData({
          rbImgArray: rbImgArray,
        })
      } catch (err) { }
    }
  },
  //事件：取消新增文章
  cancelAddArticle: function (e) {
    var that = this;

    that.setData({
      showaddarticle: false,
    })
  },
  //事件：删除段落图片
  delrbImgList: function (e) {
    var that = this, tmpContentData = that.data.tmpContentData;

    tmpContentData.imgSrc = DataURL + "/images/upload.png";
    tmpContentData.isUploadSingle=false;
    that.setData({
      tmpContentData: tmpContentData
    })
  },
  //事件：确定新增本地文章
  sureAddArticle: function (e) {
    var that = this, rbImgArray = that.data.rbImgArray, index = 0, tmpContentData = that.data.tmpContentData;

    if (tmpContentData == null || tmpContentData==undefined){
      wx.showToast({
        title: "段落为空！",
        icon: 'none',
        duration: 2000
      })
      that.setData({
        showaddarticle: false,
      })
      return;
    }
    if (rbImgArray.length==tmpContentData.index) {
      rbImgArray.push(tmpContentData);
    } else {
      if ((Utils.myTrim(tmpContentData.imgSrc) == "" || Utils.myTrim(tmpContentData.imgSrc)== DataURL + "/images/upload.png") && Utils.myTrim(tmpContentData.content) == ""){
        try {
          rbImgArray.splice(tmpContentData.index, 1);
        } catch (err) { }
      }else{
        rbImgArray[tmpContentData.index] = tmpContentData;
      }
    }
    that.setData({
      rbImgArray: rbImgArray,
      showaddarticle: false,
    })

    that.submitPartArticleInfo();
  },
  //事件：编辑文章信息
  editArticleInfo:function(e){
    var that=this;

    that.setData({
      disabled: false,
    })
  },
  //事件：提交文章信息
  submitPartArticleInfo: function () {
    var that = this, curRBImgUrl = "", curRBFName = that.data.curRBFName, curRBContent = "", rbImgArray = that.data.rbImgArray;
    if (isSaveing) return;

    isSaveing = true;
    if (rbImgArray != null && rbImgArray != undefined && rbImgArray.length > 0) {
      var itemImgUrl = "";
      for (var i = 0; i < rbImgArray.length; i++) {
        itemImgUrl = ""; itemImgUrl = app.getPartSysImgUrl(rbImgArray[i].imgSrc);
        if (rbImgArray[i].isUploadSingle && itemImgUrl != "" && itemImgUrl != DataURL + "/images/upload.png") {
          if (Utils.myTrim(curRBImgUrl) == "") curRBImgUrl = itemImgUrl;
          curRBContent += Utils.myTrim(curRBContent) == "" ? rbImgArray[i].content + "%@%" + itemImgUrl : "%|%" + rbImgArray[i].content + "%@%" + itemImgUrl;
        } else {
          curRBContent += Utils.myTrim(curRBContent) == "" ? rbImgArray[i].content : "%|%" + rbImgArray[i].content;
        }
      }
      that.setData({
        curRBImgUrl: curRBImgUrl,
        curRBContent: curRBContent,
      })
    }

    that.saveLocalFileInfo(false);
  },
  //事件：提交文章信息
  submitArticleInfo:function(e){
    var that = this, curRBImgUrl = "", curRBFName = that.data.curRBFName, curRBContent = "", rbImgArray = that.data.rbImgArray;
    if (isSaveing)return;
    
    if (Utils.myTrim(curRBFName) == "") {
      wx.showToast({
        title: "请输入文章标题！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    isSaveing = true;
    if (rbImgArray != null && rbImgArray != undefined && rbImgArray.length > 0) {
      var itemImgUrl = "";
      for (var i = 0; i < rbImgArray.length; i++) {
        itemImgUrl = ""; itemImgUrl = app.getPartSysImgUrl(rbImgArray[i].imgSrc);
        if (rbImgArray[i].isUploadSingle && itemImgUrl != "" && itemImgUrl != DataURL + "/images/upload.png"){
          if (Utils.myTrim(curRBImgUrl) == "") curRBImgUrl = itemImgUrl;
          curRBContent += Utils.myTrim(curRBContent) == "" ? rbImgArray[i].content + "%@%" + itemImgUrl : "%|%" + rbImgArray[i].content + "%@%" + itemImgUrl;
        }else{
          curRBContent += Utils.myTrim(curRBContent) == "" ? rbImgArray[i].content: "%|%" + rbImgArray[i].content;
        }
      }
      that.setData({
        curRBImgUrl: curRBImgUrl,
        curRBContent: curRBContent,
      })
    }

    that.saveLocalFileInfo(true);
  },
  //事件：返回
  returnBack:function(e){
    wx.navigateBack({
      delta: 1
    })
  },

  ///////////////////////////////////////////////////////////////////////////
  //------------手机图片上传--------------------------------------------------
  //事件：图片上传事件
  uploadImg: function (e) {
    var that = this, sType = 0, limitCnt = 6 - that.data.rbImgCnt;

    //sType:0 单张本机图片，1 文章限定6张图片
    if (e != null && e != undefined && e.currentTarget.dataset.type != null && e.currentTarget.dataset.type != undefined) {
      try {
        sType = parseInt(e.currentTarget.dataset.type);
      } catch (err) { }
    }
    if (sType == 0) {
      if (that.data.productDisabled) return;
    }
    if (sType == 1) {
      app.uploadImg(that, sType, rbImgCnt, limitCnt)
    } else {
      app.uploadImg(that, sType, 0, 1)
    }
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this;
    switch (sType) {
      case 0:
        var tmpContentData = that.data.tmpContentData;
        tmpContentData.imgSrc = imgUrl;
        tmpContentData.isUploadSingle=true;
        that.setData({
          tmpContentData: tmpContentData,
        })
        break;
      case 1:
        var rbImgCnt = that.data.rbImgCnt, rbImgArray = that.data.rbImgArray;
        rbImgArray.push(imgUrl);
        rbImgCnt++;
        that.setData({
          rbImgCnt: rbImgCnt,
          rbImgArray: rbImgArray,
        })
        break;
    }
  },


  //方法：（注册/登录）登录用户信息获取
  // getLoginUserInfo: function (articlesId) {
  //   var that = this;
  //   // 登录
  //   wx.login({
  //     success: res => {
  //       if (res.code) {
  //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //         var timestamp = Date.parse(new Date());
  //         timestamp = timestamp / 1000;
  //         var urlParam = "cls=main_user&action=userLogin&js_code=" + res.code + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
  //         var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
  //         urlParam = urlParam + "&sign=" + sign;
  //         console.log(URL + urlParam)
  //         console.log('~~~~~~~~~~~~~~~~~~~')
  //         wx.request({
  //           url: URL + urlParam,
  //           success: function (res) {
  //             console.log("login查询个人数据")
  //             console.log(res)
  //             if (res.data.rspCode == 0) {
  //               var userInfo = res.data.data.userMap;
  //               app.globalData.userTotalInfo = userInfo;
  //               var userName = "", userTel = "", userMobile = "", userJobPosition = "", companyName = "", companyDescribe = "", companyLegal = "", companyTel = "", companyEmail = "", companyAddress = "", companyLogo = "", wxopenId = "";
  //               var mainData = res.data;
  //               if (mainData.data == null) return;

  //               if (mainData.data.userMap.wxopenId != null && mainData.data.userMap.wxopenId != undefined && Utils.myTrim(mainData.data.userMap.wxopenId + "") != "") wxopenId = mainData.data.userMap.wxopenId;
  //               if (mainData.data.userMap.contact != null && mainData.data.userMap.contact != undefined && Utils.myTrim(mainData.data.userMap.contact) != "") userName = mainData.data.userMap.contact;
  //               if (mainData.data.userMap.tel != null && mainData.data.userMap.tel != undefined && Utils.myTrim(mainData.data.userMap.tel) != "") userTel = mainData.data.userMap.tel;

  //               if (mainData.data.userMap.job != null && mainData.data.userMap.job != undefined && Utils.myTrim(mainData.data.userMap.job) != "") userJobPosition = mainData.data.userMap.job;
  //               if (mainData.data.userMap.mobile != null && mainData.data.userMap.mobile != undefined && Utils.myTrim(mainData.data.userMap.mobile) != "") userMobile = mainData.data.userMap.mobile;

  //               if (mainData.data.companyMap.company != null && mainData.data.companyMap.company != undefined && Utils.myTrim(mainData.data.companyMap.company) != "") companyName = mainData.data.companyMap.company;
  //               if (mainData.data.companyMap.intro != null && mainData.data.companyMap.intro != undefined && Utils.myTrim(mainData.data.companyMap.intro) != "") companyDescribe = mainData.data.companyMap.intro;
  //               if (mainData.data.companyMap.legal != null && mainData.data.companyMap.legal != undefined && Utils.myTrim(mainData.data.companyMap.legal) != "") companyLegal = mainData.data.companyMap.legal;
  //               if (mainData.data.companyMap.tel != null && mainData.data.companyMap.tel != undefined && Utils.myTrim(mainData.data.companyMap.tel) != "") companyTel = mainData.data.companyMap.tel;
  //               if (mainData.data.companyMap.email != null && mainData.data.companyMap.email != undefined && Utils.myTrim(mainData.data.companyMap.email) != "") companyEmail = mainData.data.companyMap.email;
  //               if (mainData.data.companyMap.addr != null && mainData.data.companyMap.addr != undefined && Utils.myTrim(mainData.data.companyMap.addr) != "") companyAddress = mainData.data.companyMap.addr;
  //               if (mainData.data.companyMap.logo != null && mainData.data.companyMap.logo != undefined && Utils.myTrim(mainData.data.companyMap.logo) != "") companyLogo = mainData.data.companyMap.logo;

  //               var userinfo = {
  //                 userId: mainData.data.userMap.id,
  //                 userName: userName,
  //                 wxopenId: wxopenId,
  //                 avatarUrl: "",
  //                 userJobPosition: userJobPosition,
  //                 userMobile: userMobile,
  //                 userPhone: userTel,

  //                 companyId: mainData.data.companyMap.id,
  //                 companyName: companyName,
  //                 companyAddress: companyAddress,
  //                 companyDescribe: companyDescribe,
  //                 companyLegal: companyLegal,
  //                 companyTel: companyTel,
  //                 companyEmail: companyEmail,
  //                 companyLogo: companyLogo,
  //               }
  //               app.globalData.userInfo = userinfo;
  //               that.getVFArticleInfo(articlesId);
  //               that.requestQueryCardDetail();
  //             } else {
  //               wx.showToast({
  //                 title: "数据获取失败",
  //                 icon: 'none',
  //                 duration: 1500
  //               })
  //               console.log("登录用户信息获取：失败！错误信息：" + res.data.rspMsg)
  //             }
  //           },
  //           fail: function (err) {
  //             wx.showToast({
  //               title: "网络错误",
  //               icon: 'none',
  //               duration: 1500
  //             })
  //             console.log("登录用户信息获取接口调用失败：出错：" + err)
  //           }
  //         })
  //       }
  //     }
  //   })

  // },
  //查询单个名片信息
  requestQueryCardDetail: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.setData({
      userId: app.globalData.userInfo.userId
    })
    var urlParam = "cls=main_user&action=contactDetail&userId=" + app.globalData.userInfo.userId + "&contactUserId=" + that.data.contactUserId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + that.data.shareBatch  + "&lookType=1&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1" + "&cardRedInfoId=" + that.data.cardRedInfoId;
    console.log(urlParam)
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询名片',res)
        if (res.data.rspCode == 0) {
          if (Utils.isNull(res.data.data.userInfo.id)) {
            wx.showModal({
              title: '提示',
              content: '对方名片已删除，请重新索要对方名片',
              showCancel: false,
              confirmText: "进入主页",
              success(res) {
                that.JumpPage();
              }
            })
            return;
          }
          if (that.data.othersUserId != app.globalData.userInfo.userId) {
            that.setData({
              myCardStat: false
            })
          }
          var status = res.data.data.status;
          var collectionStat = false;
          if (status == 1) {//未保存
            collectionStat = false;
            console.log("名片未保存")
          } else {//已保存
            collectionStat = true;
            console.log("名片已保存")
          }
          var userInfo = res.data.data.userInfo;
          var imgFile = [];
          if (!Utils.isNull(userInfo.userFile)) {
            imgFile = userInfo.userFile.split(",");
            userInfo.userFile = imgFile;
          } else {
            userInfo.userFile = [];
          }
          var imgComFile = [];
          if (!Utils.isNull(userInfo.companyFile)) {
            imgComFile = userInfo.companyFile.split(",");
            userInfo.companyFile = imgComFile;
          } else {
            userInfo.companyFile = [];
          }
          app.data.cardDetaData = userInfo;

          var str = "" + userInfo.id;
          var value = wx.getStorageSync(str)
          if (value == userInfo.id) {
            that.setData({
              returnChecked: false,
              checked: false,
              replyStatus: true
            })
          }
          if (that.data.returnChecked == "true") {
            that.setData({
              checked: true
            })
          } else if (that.data.returnChecked == "false") {
            that.setData({
              checked: false
            })
          }
          if (that.data.checked == true && collectionStat == false) {
            wx.showModal({
              title: '提示',
              content: '对方希望您回ta个名片',
              showCancel: false,
              confirmText: "好的",
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          var length = 0;
          var showReceiveRedEnvel = true;  //红包图片显示
          var successfulRedEnvel = false; //红包已领取和其他状态
          var showRedEnvelPop = false; //红包弹窗
          var redEnvelReceiveStat = false; //是否已经领取
          var cardRedInfo = [];
              cardRedInfo = res.data.data.cardRedInfo;
            if (that.data.scene == 1) { //分享进入
              showRedEnvelPop = true;
            }
            if (cardRedInfo.code == 0) { //有可领取红包
            } else if (cardRedInfo.code == 1) {//来晚了,红包被领完
            } else if (cardRedInfo.code == 2) { //您已经领取过此红包，不可再次领取!
              successfulRedEnvel = true;
              redEnvelReceiveStat = true;
            } else if (cardRedInfo.code == 3) { //此红包已过期，不可领取
            } else{
              showReceiveRedEnvel = false;
              showRedEnvelPop = false;
              console.log('没有红包，code：', cardRedInfo.code)
            }
            if (!Utils.isNull(cardRedInfo.data)) {
              length = cardRedInfo.data.length;
            }
      
          that.setData({
            userData: userInfo,
            collectionStat: collectionStat,
            showCollButt: 0,
            redInfoCode: cardRedInfo.code,
            showReceiveRedEnvel: showReceiveRedEnvel,
            successfulRedEnvel: successfulRedEnvel,
            showRedEnvelPop: showRedEnvelPop,
            redEnvelReceiveStat: redEnvelReceiveStat,
            cardRedInfo: cardRedInfo,
            recordnum: length
          })
          console.log('code:', that.data.userData)

        } else {
          app.setErrorMsg2(that, "查询单个名片信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询单个名片信息失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '查询单个名片失败！',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //保存名片
  requestCollection: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.setData({
      colleDisabled:true
    })
    var urlParam = "cls=main_user&action=saveUserContact&userId=" + app.globalData.userTotalInfo.id + "&contactUserId=" + that.data.contactUserId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1";
    console.log(urlParam)
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        that.setData({
          colleDisabled: false
        })
        if (res.data.rspCode == 0) {
          that.setData({
            collectionStat: true
          })
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "保存名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        that.setData({
          colleDisabled: false
        })
        app.setErrorMsg2(that, "保存名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '保存名片失败！',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //领取红包
  requestReceiveRedEnvel: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=acquireRedEnvelope_cardRedEnvelope&action=getCardRedEnvelope" + "&cardRedInfoId=" + that.data.cardRedInfoId + "&receivingUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("领取红包", res.data)
        if (res.data.rspCode == 0) {
            var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: true,
            redEnvelReceiveStat: true
          })
        } else if (res.data.rspCode == 1) {
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: false,
            redInfoCode:1 //红包已被领完了
          })
        } else if (res.data.rspCode == 2) { //已经领过红包
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: true,
            redEnvelReceiveStat: true
          })
        } else if (res.data.rspCode == 3) { //红包过期
          var cardRedInfo = res.data.data;
          that.setData({
            recordnum: cardRedInfo.data.length,
            cardRedInfo: cardRedInfo,
            successfulRedEnvel: false,
            redInfoCode: 3 //红包过期
          })
        } else {
          app.setErrorMsg2(that, "领取红包！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "领取红包失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '领取红包失败！',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  closesuccessfulRedEnvel:function(){
    this.setData({
      successfulRedEnvel:false
    })
  },
  checkCardDetil:function(){
    wx.navigateTo({
      url: packComPageUrl + "/carddetails/carddetails?status=0&othersUserId=" + this.data.othersUserId + "&cardRedInfoId=" + this.data.cardRedInfoId 
    })
  },
  //返回主页
  JumpPage: function () {
    var that = this;
    wx.reLaunch({
      url: footFolderDir + app.data.sysMainPage
    })
  },
  showReceivingRecords: function () {
    this.setData({
      receivingRecords: true
    })
  },
  clickReceivingRecords: function () {
    this.setData({
      receivingRecords: !this.data.receivingRecords
    })
  },
  clickReceivingTips: function () {
    this.setData({
      showRedEnvelPop: true
    })
  },
  closeReceiveRedEnvel: function () {
    this.setData({
      showRedEnvelPop: false,
      receivingRecords: false,
    })
    if (Utils.isNull(app.globalData.userTotalInfo.mobile)) {
      wx.showModal({
        content: '现金红包需要注册后才可提现。',
        confirmText: '注册',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: mainPackageDir + "/login/login"
            });
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  hidesave: function () {
    this.setData({
      showModalsave: false
    })
  },
  showsave: function () {
    this.queryArticleList();
  },
  choseText: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    var myArticleList = this.data.myArticleList;
    for (let i = 0; i < myArticleList.length; i++) {
      if (myArticleList[i].check == true) {
        myArticleList[i].check = false;
      }
    }
    myArticleList[index].check = true;
    this.setData({
      selectedArticles: myArticleList[index],
      myArticleList: myArticleList,
    })


    if (!that.data.paymentStatus) {
      this.setData({
        shareTitle: myArticleList[index].name
      })
      if (!Utils.isNull(myArticleList[index].file)) {
        this.setData({
          shareWXImg: DataURL + myArticleList[index].file
        })
      }
    } else {
      that.setData({
        shareTitle: "发红包了，您赶紧快抢吧！"
      })
      if (!Utils.isNull(myArticleList[index].file)) {
        var shareWXImg = myArticleList[index].file;
        //带文章 红包水印图
        shareWXImg = shareWXImg.substring(0, shareWXImg.lastIndexOf('/') + 1) + 'h_' + shareWXImg.substring(shareWXImg.lastIndexOf('/') + 1, shareWXImg.length);
        that.setData({
          shareWXImg: DataURL + shareWXImg
        })
      } else {
        that.setData({
          shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
        })
      }
    }
    console.log('图片：：：', that.data.shareWXImg)
  },
  radioChange: function () {
    this.setData({
      showSendImg: !this.data.showSendImg,
    })
    if (Utils.isNull(this.data.selectedArticles)) {
      this.setData({
        sharedisabled: false
      })
    }
    var shareWXImg = this.data.shareWXImg;
    if (this.data.showSendImg) {//--------------------发送图片
      if (this.data.paymentStatus) { //已支付选择发红包
        if (Utils.isNull(this.data.shareTitle)) {//没有自定义标题
          this.setData({
            shareTitle: "发红包了，您赶紧快抢吧！"
          })
        }
        if (shareWXImg.indexOf("/images/FXHB.png?") == -1) {
          this.setData({
            shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
          })
        }
      } else {  //未支付
        if (!Utils.isNull(this.data.selectedArticles)) {
          if (this.data.shareTitle == this.data.selectedArticles.name) {//没有自定义标题
            this.setData({
              shareTitle: ""
            })
          }
          if (shareWXImg.indexOf("/images/cardShare01.jpg?") == -1) {//更改为默认图片
            this.setData({
              shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
            })
          }
        }
      }
    } else {//--------------------发送文章
      if (this.data.paymentStatus) { //已支付选择发红包
        if (Utils.isNull(this.data.shareTitle || (!this.data.showSendImg && this.data.showMyArticleList && !Utils.isNull(this.data.selectedArticles) && this.data.selectedArticles.name == this.data.shareTitle))) {
          this.setData({
            shareTitle: "发红包了，您赶紧快抢吧！"
          })
        }
        if (this.data.shareWXImg.indexOf("/images/cardShare01.jpg?") != -1 || (!this.data.showSendImg && this.data.showMyArticleList && !Utils.isNull(this.data.selectedArticles) && this.data.shareWXImg.indexOf(this.data.selectedArticles.file) != -1)) {
          this.setData({
            shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
          })
        }
      } else {  //未支付选择发红包
        if (!Utils.isNull(this.data.selectedArticles)) {
          if (Utils.isNull(this.data.shareTitle && !Utils.isNull(this.data.selectedArticles.name))) {//没有自定义标题
            this.setData({
              shareTitle: this.data.selectedArticles.name
            })
          }
          if (!Utils.isNull(this.data.selectedArticles.file) && this.data.shareWXImg.indexOf("/images/cardShare01.jpg?") != -1) {
            this.setData({
              shareWXImg: DataURL + this.data.selectedArticles.file + "?" + (Math.random() / 9999)
            })
          }
        }
      }

      if (Utils.isNull(this.data.selectedArticles)) {
        this.setData({
          sharedisabled: true,
        })
      }
    }
    console.log('当前图片：', this.data.shareWXImg)
  },
  radioChange2: function () {
    this.setData({
      showReceiveType: !this.data.showReceiveType
    })
  },
  //事件：切换扩展选项显示/隐藏
  onChangeShowItemDetailState: function (e) {
    var that = this;
    if (!that.data.showSendImg && Utils.isNull(this.data.selectedArticles)) {
      return;
    }
    that.setData({
      showOtherItems: !that.data.showOtherItems
    })
  },
  uploadImage: function (e) {
    var that = this;
    if (that.data.updateFileDisabled) {
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
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          //1、多图上传
          console.log("开始上传。。。")
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
  //图片上传
  uploadDIY(filePaths, successUp, failUp, i, length, type) {
    var that = this;
    var userFileNum = 0;
    wx.showLoading({
      title: '正在上传图片中...',
      mask: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign;
      urlParam += "&hb=1";
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
          console.log('data:', data)
        } catch (e) { }
        if (!Utils.isNull(data) && !Utils.isNull(data.rspCode) && data.rspCode == 0) {
          var imgUrl = "";
          imgUrl = data.data.fileName;
            if (that.data.paymentStatus) {
              imgUrl = data.data.fileName_h;
            }
            that.setData({
              shareWXImg: imgUrl,
              shareWXImg_h: data.data.fileName_h,
              shareWXImg_old: data.data.fileName
            })
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
          that.uploadDIY(filePaths, successUp, failUp, i, length, type);
        }
      },
    });
  },
  //获取输入的红包金额
  getRedEnvelPrice: function (e) {
    var that = this;
    var redEnvelPrice = e.detail.value;
    if (/^(\d?)+(\.\d{0,2})?$/.test(redEnvelPrice)) { //正则验证，提现金额小数点后不能大于两位数字
      redEnvelPrice = redEnvelPrice;
    } else {
      redEnvelPrice = redEnvelPrice.substring(0, redEnvelPrice.length - 1);
    }
    that.setData({
      redEnvelPrice: redEnvelPrice,
      sharedisabled: true
    })
    if ((Utils.isNull(redEnvelPrice) || redEnvelPrice <= 0) && (Utils.isNull(that.data.redEnvelNum) || that.data.redEnvelNum <= 0)) {
      that.setData({
        sharedisabled: false
      })
    }
    if (that.data.redEnvelNum > 0 && redEnvelPrice > 0) {
      that.requestConfirmSend();
    } else {
      that.resetTitleAndImg();
    }
  },
  //过滤小数点后2位
  getRedEnvelPriceEnd: function () {
    var redEnvelPrice = this.data.redEnvelPrice;
    if (!Utils.isNull(redEnvelPrice) && redEnvelPrice > 0) {
      if (redEnvelPrice.indexOf(".") >= 0) {
        this.setData({
          redEnvelPrice: parseFloat(redEnvelPrice).toFixed(2)
        })
      }
    }
  },
  //获取输入的红包数量
  getRedEnvelNum: function (e) {
    var that = this;
    var redEnvelNum = e.detail.value;
    that.setData({
      redEnvelNum: redEnvelNum,
      sharedisabled: true
    })
    if ((Utils.isNull(redEnvelNum) || redEnvelNum <= 0) && (Utils.isNull(that.data.redEnvelPrice) || that.data.redEnvelPrice <= 0)) {
      that.setData({
        sharedisabled: false,
      })
    }
    if (redEnvelNum > 0 && that.data.redEnvelPrice > 0) { //红包金额和数量输入完毕 开始检查余额
      that.requestConfirmSend();
    } else {
      that.resetTitleAndImg();
    }

  },
  //查询可发红包金额；
  requestConfirmSend: function () {
    var that = this;
    if ((that.data.redEnvelPrice / that.data.redEnvelNum) < 0.01) {
      that.setData({
        priceLimitationTips: true,
        showRechargeTips: false
      })
      return
    } else {
      if (that.data.priceLimitationTips == true) {
        that.setData({
          priceLimitationTips: false
        })
      }
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var amtType = 1;
    if (!that.data.showReceiveType) {
      amtType = 2;
    }
    var urlParam = "cls=redEnvelope_changePurse&action=changePurseSurplus&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("查询可发红包金额", res.data)
        if (res.data.rspCode == 0) {
          var surplusMoney = res.data.data.surplusMoney;
          var sharedisabled = false;
          if (surplusMoney < that.data.redEnvelPrice) { //余额不够发红包
            var rechargeMoney = Utils.accSub(that.data.redEnvelPrice, surplusMoney);
            that.setData({
              showRechargeTips: true,
              rechargeMoney: rechargeMoney,
            })

          } else { //余额够发红包
            var shareWXImg = that.data.shareWXImg;
            if (that.data.showSendImg) { //图片
              console.log('发送图片', that.data.showSendImg)
              if (Utils.isNull(that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (!Utils.isNull(shareWXImg)) { //默认图片
                if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1) {
                  that.setData({
                    shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
                  })
                } else { //不是默认图
                  //带红包水印图
                  that.setData({
                    shareWXImg: that.data.shareWXImg_h
                  })
                }

              }
            } else {  //文章
              console.log('发送文章', that.data.showSendImg)
              if (Utils.isNull(that.data.shareTitle) || (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles) && that.data.selectedArticles.name == that.data.shareTitle)) {
                that.setData({
                  shareTitle: "发红包了，您赶紧快抢吧！"
                })
              }
              if (that.data.showMyArticleList && !Utils.isNull(that.data.selectedArticles.file) && !Utils.isNull(shareWXImg)) { //文章图片
                console.log("有文章图片，加水印")
                if (shareWXImg.indexOf(that.data.selectedArticles.file) != -1) {

                  //带文章 红包水印图
                  var shareWXImg = shareWXImg.substring(0, shareWXImg.lastIndexOf('/') + 1) + 'h_' + shareWXImg.substring(shareWXImg.lastIndexOf('/') + 1, shareWXImg.length);
                  that.setData({
                    shareWXImg: shareWXImg
                  })
                }

              }
              else if (!Utils.isNull(shareWXImg)) { //默认图
                if (shareWXImg.indexOf(DataURL + "/images/cardShare01.jpg?") != -1) {
                  console.log("默认图")
                  that.setData({
                    shareWXImg: DataURL + "/images/FXHB.png?" + (Math.random() / 9999)
                  })
                } else { //上传图片
                  //带红包水印图
                  that.setData({
                    shareWXImg: that.data.shareWXImg_h
                  })
                }
              }
              if (Utils.isNull(that.data.selectedArticles)) {
                sharedisabled = true;
              }
            }
            console.log('图片：：：', that.data.shareWXImg)
            that.setData({
              sharedisabled: sharedisabled,
              showRechargeTips: false,
              paymentStatus: true
            })
          }
        } else {
          app.setErrorMsg2(that, "查询可发红包金额！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询可发红包金额失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '查询可发红包金额失败!',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //取消红包金额或者数量后 回复图片和文字
  resetTitleAndImg: function () {
    var that = this;

    if (that.data.showRechargeTips) {
      that.setData({
        showRechargeTips: false
      })
    }
    // if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
    if (that.data.paymentStatus) {//选择过红包
      if (that.data.showSendImg) { //发送图片
        if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
          that.setData({
            shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999)
          })
        } else {
          that.setData({
            shareWXImg: that.data.shareWXImg_old
          })
        }

      } else {//发送文章
        if (!Utils.isNull(that.data.selectedArticles) && !Utils.isNull(that.data.selectedArticles.file)) {//如果有文章图片
          that.setData({
            shareWXImg: DataURL + that.data.selectedArticles.file + "?" + (Math.random() / 9999)
          })
        } else if (!Utils.isNull(that.data.shareWXImg)) {
          if (that.data.shareWXImg.indexOf('/images/FXHB.png?') != -1) {
            that.setData({
              shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999)
            })
          }
        } else {
          that.setData({
            shareTitle: '',
            shareWXImg: that.data.shareWXImg_old
          })
        }
      }
    }
    if (that.data.shareTitle.indexOf('发红包了') != -1) {
      if (that.data.showSendImg) { //发送图片
        that.setData({
          shareTitle: ''
        })
      } else {//发送文章
        if (!Utils.isNull(that.data.selectedArticles)) {//如果有文章
          that.setData({
            shareTitle: that.data.selectedArticles.name
          })
        } else {
          that.setData({
            shareTitle: ''
          })
        }
      }
    }
    if (that.data.paymentStatus) {
      that.setData({
        paymentStatus: false
      })
    }
  },
  //事件：红包充值
  payment: function () {
    var that = this, attach = "6_0_" + app.data.hotelId + "_3", otherParams = "&body=" + encodeURIComponent("天天上-充值") + "&detail=" + encodeURIComponent("天天上-充值");
    if (that.data.paymentdisabled == true) {
      return;
    }
    that.setData({
      paymentdisabled: true
    })
    app.getPrePayId2(that, attach, otherParams, that.data.rechargeMoney);
  },
  //方法：支付结束处理方法
  dowithPayment: function (tag, alertContent) {
    var that = this;
    that.setData({
      paymentdisabled: false
    })
    wx.hideLoading();
    //1支付成功，0支付失败
    switch (tag) {
      case 1:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值成功！" : alertContent;
        var shareTitle = that.data.shareTitle;
        that.requestConfirmSend();
        console.log("支付发起成功！")
        break;

      default:
        alertContent = Utils.myTrim(alertContent) == "" ? "充值失败！" : alertContent;
        wx.showToast({
          title: alertContent,
          icon: 'none',
          duration: 1500
        })
        break;
    }
  },

  //查询要发送的文章列表
  queryArticleList: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_document&action=documentList&folderId=-1&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam += "&pageSize=100&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("文章列表", res.data.data)
        if (res.data.rspCode == 0) {
          if (res.data.data.length == 0) {
            that.setData({
              showMyArticleList: false
            })
            return;
          }
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            if (that.data.articlesId == data[i].id) {
              data[i].check = true;
              that.setData({
                selectedArticles: data[i]
              })
              if (!Utils.isNull(data[i].file)){
                that.setData({
                  shareWXImg: DataURL + data[i].file + "?" + (Math.random() / 9999)
                })
              }
            } else {
              data[i].check = false;
            }
          }
          that.setData({
            myArticleList: data,
            showModalsave: true,
            showMyArticleList:true
          })
        } else {
          app.setErrorMsg2(that, "查询要发送的文章列表！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "查询要发送的文章列表失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '查询文章列表失败!',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //发送红包
  requestRedEnvel: function (cardRedInfoId) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var amtType = 1;
    if (!that.data.showReceiveType) {
      amtType = 2;
    }

    timestamp = timestamp / 1000;
    var urlParam = "cls=acquireRedEnvelope_cardRedEnvelope&action=setCardRedEnvelope" + "&cardId=" + that.data.userData.id + "&senderUserId=" + app.globalData.userInfo.userId + "&amtType=" + amtType + "&totalMoney=" + that.data.redEnvelPrice + "&totalNumber=" + that.data.redEnvelNum + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&cardRedInfoId=" + cardRedInfoId + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("发送红包", res.data)
        if (res.data.rspCode == 0) {
          console.log("发送成功")
        } else {
          app.setErrorMsg2(that, "发送红包！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发送红包失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
        wx.showToast({
          title: '发送红包失败!',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //发送名片记录
  requestCardRecord: function (cardRedInfoId, timestamp) {
    var that = this;
    var timest = Date.parse(new Date());
    timest = timest / 1000;
    var urlParam = "cls=main_user&action=sendUserContact" + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timest;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + timestamp + "&contactUserId=" + that.data.userData.id + "&cardRedInfoId=" + cardRedInfoId + "&sign=" + sign;
    if (!that.data.showSendImg && !Utils.isNull(that.data.selectedArticles)) { //分享带文章
      urlParam += '&documentIds=' + that.data.selectedArticles.id
    }
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        if (res.data.rspCode == 0) {
          console.log("名片记录成功")
        } else {
          app.setErrorMsg2(that, "发送名片记录！错误信息：" + JSON.stringify(res), URL + urlParam, false);
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发送名片记录失败：fail！错误信息：" + JSON.stringify(err), URL + urlParam, false);
      },
      complete: function (err) {
        that.setData({
          showModalsave: false,
          remarkStatus: false,
          showredbackokpop: false,//关闭分享确定弹窗
          showReceiveType: 1, // 1随机，2p平均
          showMyArticleList: true, //是否显示要发送的文章列表
          showOtherItems: false,
          userCardTemList: [],//模板列表
          shareWXImg: DataURL + "/images/cardShare01.jpg?" + (Math.random() / 9999),
          shareTitle: "",
          myArticleList: [],//分享时 文章列表
          redEnvelPrice: '',
          redEnvelNum: '',
          paymentStatus: false,
        })
      },
    })
  },
})
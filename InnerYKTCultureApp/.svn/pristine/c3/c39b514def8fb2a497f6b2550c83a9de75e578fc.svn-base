// pages/files/files.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, isSaveing = false;
var pageSize = app.data.pageSize, packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,     //标签页ID
    DataURL: DataURL,  //资源地址
    isForbidRefresh: false,     //是否禁止刷新

    //文件夹
    folderAlert:"",                     //提示文字
    defaultFolderName: "默认文件夹",     //默认文件夹名称
    defaultArticleFolderName:"我的文章", //我的文章文件夹名称
    isManageRole:true,         //是否可管理文件夹模块
    
    folderList: [],          //文件夹集合
    selFolderItem: null,     //当前文件夹信息
    selFolderIndex: -1,      //当前文件夹索引
    selFolderId: -999,          //当前文件夹ID
    selFolderName: "",       //当前文件夹名称

    isPFReadOnly: true,      //当前文件夹读写状态：true只读，false只写
    isPFShowList: false,     //是否显示文件夹列表内容
    max_folderName: 80,      //文件夹名称最多字数

    isFolderAllSel: false,   //是否为文件夹全选操作
    showDelFolder:false,     //是否显示删除文件夹弹窗
    selectedFolderIds: "", //已选文件夹记录ID序列
    selectedFolders: [],   //已选文件夹记录集合

    isShowFolderCList: false, //是否需要在获取文件夹列表后重新获取文件列表并显示

    //文档
    selectedArticleIds: "", //已选记录ID序列
    selectedArticles: [],   //已选产品记录集合
    totalDataCount: 0, //总数据条数
    currentPage: 0,    //当前页码
    articles: [],      //存放所有的页记录

    selFolderType: 0,   //0草稿，1已发，2已收

    isViewDoc:false,    //是否浏览文档

    //备注图片
    showaddimage: false,

    max_filename:30,
    max_filecontent:1000,

    rbImgCnt: 0,             //已有图片数量
    rbImgArray: [],          //图片列表数值

    isUploadSingle:false,    //是否已经上传单张图片
    curRBImgUrl:'',          //单张图片相对URL
    curRBFName:'',           //当前文件名称
    curRBContent:'',         //当前文章内容
    editFolderId:0,

    curFileType:'0',              //文件类型
    curFileId:0,
    curFileUserId:0,
    curFileCompanyId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    appUserInfo = app.globalData.userInfo;
    if (appUserInfo == null) return;
    var selFolderId = that.data.selFolderId, isShowFolderCList = that.data.isShowFolderCList;
    try{
      if (options.tFId != null && options.tFId != undefined) {
        selFolderId = parseInt(options.tFId);
        selFolderId = isNaN(selFolderId) ? -999 : selFolderId;

        isShowFolderCList = selFolderId>-2?true:false;
      }
    }catch(err){}
    //文件夹提示文字
    that.setData({
      selFolderId: selFolderId,
      isShowFolderCList: isShowFolderCList,
      folderAlert: app.data.folderAlert
    })
    that.getQPFolderList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!that.data.isLoad)
      that.data.isLoad = true;
    else {
      appUserInfo = app.globalData.userInfo;
      if (appUserInfo == null) {
        return;
      }
      //如果非禁止页面刷新
      if (!that.data.isForbidRefresh) {
        // 加载页面初始化时需要的数据
        that.getQPFolderList();
        console.log("onShow LoadFolderList...")
      }
    }
    that.data.isForbidRefresh = false;
    console.log("onShow ...")
  },
  ///////////////////////////////////////////////////////////////////////
  //-------文件夹列表操作-------------------------------------------------
  //方法：获取文件夹列表
  getQPFolderList: function () {
    var that = this;
    wx.showLoading({
      title: "加载中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date()), selFolderType = 0;
    // that.data.selFolderType 0草稿，1已发，2已收 ,文件夹：1草稿，2已发，3已收
    try {
      selFolderType = parseInt(that.data.selFolderType);
      selFolderType = isNaN(selFolderType) ? 0 : selFolderType;
    } catch (e) { }
    selFolderType = selFolderType + 1;
    timestamp = timestamp / 1000;
    //cls=main_folder&action=folderList&companyId=" + companyId+ "&appId=" + appId+ "&timestamp=" + timestamp

    var qIds = "";//Utils.myTrim(that.data.qIds);
    var qIdsCon = qIds == "" ? "" : "&ids=" + qIds;
    var urlParam = "cls=main_folder&action=folderList&companyId=0&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + qIdsCon + "&userId=" + appUserInfo.userId + "&pageSize=1000000&pageIndex=1&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        that.data.isLoad = true;
        if (res.data.rspCode == 0) {
          var data = res.data; // 接口相应的json数据
          var folderList = [], folderCntList = [], fCnt0 = 0,fCntA=0;
          if (data.data.documentCountList != null && data.data.documentCountList != undefined && data.data.documentCountList.length > 0) {
            for (var i = 0; i < data.data.documentCountList.length; i++) {
              if (data.data.documentCountList[i].folderId == 0) fCnt0 = data.data.documentCountList[i].count;
              if (data.data.documentCountList[i].folderId == -1) fCntA = data.data.documentCountList[i].count
              folderCntList.push(data.data.documentCountList[i]);
            }
          }
          var dataItem = null, listItem = null, defaultFolderName = that.data.defaultFolderName, defaultArticleFolderName = that.data.defaultArticleFolderName;
          //添加默认文件夹
          listItem = {
            folderId: 0, parentId: 0,
            userId: appUserInfo.userId,
            companyId: appUserInfo.companyId, sortOrder: 0, listCnt: fCnt0, folderName: defaultFolderName, folderName2: defaultFolderName, selected: false, isGetData: false, isShowList: false,
          }
          folderList.push(listItem);
          //添加我的文章文件夹
          listItem=null;
          listItem = {
            folderId: -1, parentId: 0,
            userId: appUserInfo.userId,
            companyId: appUserInfo.companyId, sortOrder: 0, listCnt: fCntA, folderName: defaultArticleFolderName, folderName2: defaultArticleFolderName, selected: false, isGetData: false, isShowList: false,
          }
          folderList.push(listItem);
          
          var folderId = 0, folderName = "", folderName2 = "", sortOrder = 0, addtime = "", companyId = 0, userId = 0, parentId = 0, selFolderIndex = 0, fCnt = 0, isShowFolderCList = that.data.isShowFolderCList;

          if (that.data.selFolderId != null && that.data.selFolderId != undefined && that.data.selFolderId == 0) selFolderIndex = 0;
          if (that.data.selFolderId != null && that.data.selFolderId != undefined && that.data.selFolderId == -1) selFolderIndex = 1;
          for (var i = 0; i < data.data.dataList.length; i++) {
            dataItem = null; dataItem = data.data.dataList[i];
            folderId = 0; folderName = ""; folderName2 = ""; sortOrder = 0; companyId = 0; userId = 0; parentId = 0; fCnt = 0;
            folderId = dataItem.id; parentId = dataItem.parentId; userId = dataItem.userId; companyId = dataItem.companyId; //sortOrder = dataItem.sortOrder;
            if (dataItem.name != null && dataItem.name != undefined && Utils.myTrim(dataItem.name + "") != "")
              folderName = dataItem.name;
            folderName2 = Utils.getStrLen(folderName, 16);
            if (that.data.selFolderId != null && that.data.selFolderId != undefined && that.data.selFolderId == folderId) selFolderIndex = i + 2;

            for (var j = 0; j < folderCntList.length; j++) {
              if (folderCntList[j].folderId == folderId) {
                fCnt = folderCntList[j].count;
                break;
              }
            }
            listItem = null;
            listItem = {
              folderId: dataItem.id, parentId: parentId,
              userId: userId,
              companyId: companyId, sortOrder: sortOrder, listCnt: fCnt, folderName: folderName, folderName2: folderName2, selected: false, isGetData: false, isShowList: false,
            }
            folderList.push(listItem);
          }
          if (fCntA>0){
            isShowFolderCList=true;
            selFolderIndex=1;
          }
          that.setData({
            folderList: folderList,
            selFolderIndex: selFolderIndex,
            selFolderId: folderList[selFolderIndex].folderId,
            selFolderName: folderList[selFolderIndex].folderName,
            isPFShowList: false,

            selectedFolderIds: "", //已选记录ID序列
            selectedFolders: [],   //已选产品记录集合

            selectedArticleIds: "", //已选记录ID序列
            selectedArticles: [],   //已选产品记录集合

            isShowFolderCList: false,
          })


          //如果需要展示文件夹列表
          if (isShowFolderCList) {
            that.changeShowFolderList(that.data.selFolderIndex);
          }
        } else {
          app.setErrorMsg(that, "获取文件夹列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg(that, "获取文件夹列表接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //方法：保存编辑文件名称
  saveFolderName:function(){
    var that = this, alertContent = "文件夹保存";
    
    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    console.log(that.data.selFolderName);
    var urlParam = "cls=fileDispose_fileDispose&action=editFolder&folderID=" + that.data.selFolderId + "&folderName=" + that.data.selFolderName + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          //普通新增文件夹
          that.setData({
            isPFReadOnly: true,      //当前文件夹读写状态：true只读，false只写
          })
          //加载数据列表
          that.getQPFolderList();
        } else {
          app.setErrorMsg2(that, alertContent + "失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg(that, alertContent + "接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //方法：删除文件夹
  delVFileFolder:function(){
    var that = this, alertContent = "文件夹删除";

    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=fileDispose_fileDispose&action=deleteFolder&folderIDs=" + that.data.selFolderId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          //普通新增文件夹
          that.setData({
            selFolderIndex: -1,      //当前文件夹索引
            selFolderId: 0,          //当前文件夹ID
            selFolderName: "",       //当前文件夹名称
            isPFReadOnly: true,      //当前文件夹读写状态：true只读，false只写

            showDelFolder: false,
          })
          //加载数据列表
          that.getQPFolderList();
        } else {
          that.setData({
            showDelFolder: false,
          })
          app.setErrorMsg(that, alertContent + "失败！出错信息：" + JSON.stringify(res), URL + urlParam);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        that.setData({
          showDelFolder: false,
        })
        app.setErrorMsg(that, alertContent + "接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //事件：文件夹名称变更
  changeValuePFData: function (e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    if (Utils.myTrim(value) != "") {
      // if (Utils.checkStrNoPunc(value)) {
      //   wx.showToast({
      //     title: "非法字符不能输入！",
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return;
      // }
      //最多字数限制
      if (len > that.data.max_folderName) return;
    }
    that.setData({
      selFolderName: value
    })
  },
  //事件：编辑文件夹
  onChangeFolderEdit: function (e) {
    var that = this, item = null, index = -1, selFolderId = -2, selFolderName = "";
    //权限判断
    if (!app.isPerfectPersonInfo()) return;

    item = e.currentTarget.dataset.item;
    index = e.currentTarget.dataset.index;
    if (item != null && item != undefined) {
      selFolderId = item.folderId;
      selFolderName = item.folderName;
    }

    that.setData({
      selFolderIndex: index,             //当前文件夹索引
      selFolderId: selFolderId,          //当前文件夹ID
      selFolderName: selFolderName,      //当前文件夹名称
      isPFReadOnly: false,      //当前文件夹读写状态：true只读，false只写
    })
  },
  //事件：保存文件夹名称
  onChangeFolderSave: function (e) {
    var that = this, folderType = that.data.selFolderType;
    //权限判断
    if (!app.isPerfectPersonInfo()) return;

    if (that.data.selFolderName == null || that.data.selFolderName == undefined || Utils.myTrim(that.data.selFolderName) == "") {
      wx.showToast({
        title: "文件夹名称不能为空！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (Utils.myTrim(that.data.selFolderName) == that.data.defaultFolderName) {
      wx.showToast({
        title: "不能跟默认文件夹重名！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isDuplicate=false;
    for (var i = 0; i < that.data.folderList.length; i++) {
      if (that.data.folderList[i].folderId != that.data.selFolderId &&
        Utils.myTrim(that.data.selFolderName) == Utils.myTrim(that.data.folderList[i].folderName)) {
        isDuplicate=true;
        break;
      }
    }
    if(isDuplicate){
      wx.showToast({
        title: "同名文件夹已经存在！",
        icon: 'none',
        duration: 2000
      })
      return;
    }

    that.saveFolderName();
  },
  //事件：删除文件夹
  onChangeFolderDel: function (e) {
    var that = this, item = null, index = -1, selFolderId = -2, selFolderName = "";
    item = e.currentTarget.dataset.item;
    index = e.currentTarget.dataset.index;
    if (item != null && item != undefined) {
      selFolderId = item.folderId;
      selFolderName = item.folderName;
    }
    if (selFolderId < -1) {
      wx.showToast({
        title: "请选择需要删除的文件夹！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (selFolderId == -1 || selFolderId ==0) {
      wx.showToast({
        title: "系统文件夹不能删除！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    var delFolderAlertMsg = "您确定要删除文件夹吗？";
    if (item != null && item.listCnt != null && item.listCnt > 0) {
      delFolderAlertMsg = "该文件夹里面有" + item.listCnt + "个文件，删除文件夹时文件信息也会被删除。您是否还要删除？";
    }
    that.setData({
      selFolderId: selFolderId,          //当前文件夹ID
      showDelFolder: true,
      delFolderAlertMsg: delFolderAlertMsg,
    })
  },
  //事件：隐藏删除文件夹弹窗
  hideDelFolder: function (e) {
    var that = this;
    that.setData({
      showDelFolder: false,
    })
  },
  //事件：删除文件夹
  delFolderfunction(e) {
    var that = this, folderType = that.data.selFolderType;
    that.delVFileFolder();
  },
  //事件：文件夹产品列表显示隐藏切换
  onChangeFolderDetailList: function (e) {
    var that = this, item = null, index = -1;
    item = e.currentTarget.dataset.item;
    index = e.currentTarget.dataset.index;

    that.changeShowFolderList(index);
  },
  //方法：切换文件夹内容显示
  changeShowFolderList: function (index) {
    var that = this, selFolderId = -2, selFolderName = "", isPFShowList = !that.data.isPFShowList, isPFReadOnly = that.data.isPFReadOnly;
    for (var i = 0; i < that.data.folderList.length; i++) {
      if (i == index) {
        selFolderId = that.data.folderList[i].folderId;
        selFolderName = that.data.folderList[i].folderName;

        isPFShowList = !that.data.folderList[i].isShowList;
        that.data.folderList[i].isShowList = isPFShowList;
      } else
        that.data.folderList[i].isShowList = false;
    }
    if (!isPFReadOnly && that.data.selFolderIndex != index) isPFReadOnly = true;
    if (!that.data.folderList[index].isGetData) {
      that.setData({
        selFolderIndex: index,             //当前文件夹索引
        selFolderId: selFolderId,          //当前文件夹ID
        selFolderName: selFolderName,      //当前文件夹名称
        isPFShowList: isPFShowList,      //是否显示文件夹列表内容
        isFolderAllSel: false,
        isPFReadOnly: isPFReadOnly,
      })
      // 加载页面初始化时需要的数据 
      that.loadInitData(true);
    } else {
      that.setData({
        selFolderIndex: index,             //当前文件夹索引
        selFolderId: selFolderId,          //当前文件夹ID
        selFolderName: selFolderName,      //当前文件夹名称
        isPFShowList: isPFShowList,      //是否显示文件夹列表内容
        isPFReadOnly: isPFReadOnly,
      })
    }
  },
  ///////////////////////////////////////////////////////////////////////
  //-------文件列表操作---------------------------------------------------
  //方法：列表项勾选操作
  operateSelItems: function (id, item, isSel) {
    var that = this;
    var selectedArticleIds = "," + Utils.myTrim(that.data.selectedArticleIds) + ",", selectedArticles = that.data.selectedArticles == null ? [] : that.data.selectedArticles, isExist = selectedArticleIds.indexOf("," + id + ",") < 0 ? false : true, folderList = that.data.folderList;

    if (isSel && !isExist) {
      //选择操作，且之前该项没被选过
      selectedArticleIds = Utils.myTrim(that.data.selectedArticleIds);
      selectedArticleIds += Utils.myTrim(selectedArticleIds) == "" ? id + "" : "," + id;
      selectedArticles.push(item);
    } else if (!isSel && isExist) {
      //取消选择操作
      selectedArticleIds = "," + Utils.myTrim(that.data.selectedArticleIds) + ",";
      selectedArticleIds = selectedArticleIds.replace("," + id + ",", ",");
      selectedArticleIds = selectedArticleIds.substr(0, selectedArticleIds.length - 1);
      selectedArticleIds = selectedArticleIds.substr(1);

      for (var i = 0; i < selectedArticles.length; i++) {
        if (selectedArticles[i].id == id) {
          selectedArticles.splice(i, 1); break;
        }
      }
    }

    that.setData({
      selectedArticleIds: selectedArticleIds,
      selectedArticles: selectedArticles,
      folderList: folderList,
    })
  },
  //事件：单选文件
  bindFileCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var that = this;
    var item = e.currentTarget.dataset.item;
    var index = parseInt(e.currentTarget.dataset.index), dataArrayIndex = parseInt(e.currentTarget.dataset.dataarrayindex);
    //原始的icon状态
    var articles = that.data.dataArray;
    var selected = that.data.dataArray[dataArrayIndex][index].selected ? false : true;
    articles[dataArrayIndex][index].selected = selected;

    //已选数据存data操作
    that.operateSelItems(that.data.dataArray[dataArrayIndex][index].id, that.data.dataArray[dataArrayIndex][index], that.data.dataArray[dataArrayIndex][index].selected);
    that.setData({
      dataArray: articles,
    })
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
  loadInitData: function (isInit) {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    //是否清空所有已选数据
    if (isInit) {
      this.setData({
        selectedArticleIds: "",
        selectedArticles: [],

        dataArray: [], 
      });
    } else {
      // 刷新时，清空dataArray，防止新数据与原数据冲突
      that.setData({
        dataArray: [],
      })
    }
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
  //获取报价列表
  getMainDataList: function (pageSize, pageIndex) {
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "", sign = "";
    //cls=main_document&action=documentList&folderId=" + folderId+ "&userId=" + userId+ "&appId=" + appId+ "&timestamp=" + timestamp

    urlParam = "cls=main_document&action=documentList&folderId=" + that.data.selFolderId + "&userId=" + appUserInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
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
        if (res.data.rspCode == 0) {
          var data = res.data; // 接口相应的json数据
          var articles = [];// data.data; // 接口中的data对应了一个数组，这里取名为 articles
          var dataItem = null;
          var startNo = 0, addtime = "", fileName = "", fileName2 = "", fileUrl = "", fileType="",fileContent="", folderId = 0, companyId = 0, userId=0, selected = false,fileExtendName="";
          startNo = (pageIndex - 1) * pageSize;
          for (var i = 0; i < data.data.length; i++) {
            dataItem = null; dataItem = data.data[i];
            addtime = ""; fileName = ""; fileName2 = ""; fileUrl = ""; fileType = ""; fileContent = "";folderId = 0; companyId = 0; userId = 0; selected = false;
            if (dataItem.folderId != null && dataItem.folderId != undefined && Utils.myTrim(dataItem.folderId + "") != "")
              folderId = parseInt(dataItem.folderId);
            folderId = isNaN(folderId) ? 0 : folderId;
            if (dataItem.companyId != null && dataItem.companyId != undefined && Utils.myTrim(dataItem.companyId + "") != "")
              companyId = parseInt(dataItem.companyId);
            companyId = isNaN(companyId) ? 0 : companyId;
            if (dataItem.userId != null && dataItem.userId != undefined && Utils.myTrim(dataItem.userId + "") != "")
              userId = parseInt(dataItem.userId);
            userId = isNaN(userId) ? 0 : userId;
            if (dataItem.name != null && dataItem.name != undefined && Utils.myTrim(dataItem.name + "") != "")
              fileName = dataItem.name;
            fileName2 = Utils.getStrLen(fileName, 30);
            if (dataItem.file != null && dataItem.file != undefined && Utils.myTrim(dataItem.file + "") != "")
              fileUrl = dataItem.file;
            if (dataItem.fileType != null && dataItem.fileType != undefined && Utils.myTrim(dataItem.fileType + "") != "")
              fileType = Utils.myTrim(dataItem.fileType);
            
            if (dataItem.content != null && dataItem.content != undefined && Utils.myTrim(dataItem.content + "") != "")
              fileContent = Utils.myTrim(dataItem.content);

            try {
              var dateTime = new Date(dataItem.addtime.replace(/\-/g, "/"));
              addtime = Utils.getDateTimeStr(dateTime,"-",true);
            } catch (e) { }
            if (that.data.selectedArticles != null && that.data.selectedArticles.length > 0) {
              if (Utils.myTrim(that.data.selectedArticleIds) != "" && ("," + that.data.selectedArticleIds + ",").indexOf("," + dataItem.id + ",") >= 0) {
                selected = true;
              }
            }
            if (fileType == "" || fileType == "0") {
              try{
                fileExtendName = fileUrl.substr(fileUrl.lastIndexOf(".")).toLowerCase();
              }catch(err){}
              switch (fileExtendName){
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                case ".bmp":
                  fileType="1";
              }
            }
            startNo++;
            var listItem = {
              id: dataItem.id, sortNo: startNo,
              addtime: addtime, fileName: fileName, fileName2: fileName2, fileUrl: app.getSysImgUrl(fileUrl), folderId: folderId, companyId: companyId, userId: userId, selected: selected, fileType: fileType, fileContent: fileContent,
            }
            articles.push(listItem);
          }
          if (articles.length>0){
            // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
            var totalDataCount = that.data.totalDataCount;
            totalDataCount = pageIndex == 1 ? articles.length : totalDataCount + articles.length;
            console.log("totalDataCount:" + totalDataCount);

            // 直接将新一页的数据添加到数组里
            that.setData({
              ["dataArray[" + pageIndex + "]"]: articles,
              currentPage: pageIndex,
              totalDataCount: totalDataCount
            })
          }
        } else {
          app.setErrorMsg(that, "获取文件列表：失败！错误信息：" + JSON.stringify(res), URL + urlParam);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg(that, "获取文件列表接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //事件：文件删除
  onVFileDel:function(e){
    var that = this, item = null, selFileIds = "";
    item = e.currentTarget.dataset.item;
    if (item != null && item != undefined) {
      selFileIds = item.id+"";
    }
    if (Utils.myTrim(selFileIds)=="") {
      wx.showToast({
        title: "请选择需要删除的文件！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showModal({
      title: '系统消息',
      content: "您确定要删该文件吗？",
      icon: 'none',
      duration: 1500,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          console.log("cancel del")
          return;
        } else {
          //点击确定
          console.log("sure del")
          that.delSelFiles(selFileIds);
        }
      },
    })
  },
  //方法：删除文件
  delSelFiles:function(selFileIds){
    var that = this, alertContent = "文件删除";

    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    console.log(that.data.selFolderName);
    var urlParam = "cls=fileDispose_fileDispose&action=deleteDocument&docmentIDs=" + selFileIds + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.rspCode == 0) {
          //普通新增文件夹
          that.setData({
            isPFReadOnly: true,      //当前文件夹读写状态：true只读，false只写
            isShowFolderCList: true,
          })
          //加载数据列表
          that.getQPFolderList();
        } else {
          app.setErrorMsg(that, alertContent + "失败！出错信息：" + JSON.stringify(res), URL + urlParam);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        app.setErrorMsg(that, alertContent + "接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    let that = this;
    that.data.isForbidRefresh = true;
    app.viewImg(e);
  },
  //方法：文档浏览
  viewAccessory: function (e) {
    var that = this, url = e.currentTarget.dataset.src;
    if (Utils.myTrim(url) != "") {
      try {
        url = app.getSysImgUrl(url);
        console.log("打开："+url)
        wx.showLoading({
          title: "文档加载中......",
        })
        that.data.isForbidRefresh = true;
        wx.downloadFile({
          url: url, //仅为测试接口，并非真实的
          success: function (res) {
            var filePath = res.tempFilePath
            console.log(filePath)

            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                wx.hideLoading();
                //isViewDoc
                that.setData({
                  isViewDoc: true,
                })
                console.log("打开文档成功")
                console.log(res);
              },
              fail: function (res) {
                wx.hideLoading();
                console.log("fail");
                console.log(res)
              },
              complete: function (res) {
                wx.hideLoading();
                console.log("complete");
                console.log(res)
              }
            })
          },
          fail: function (res) {
            wx.hideLoading();
            console.log('fail')
            console.log(res)
          },
          complete: function (res) {
            wx.hideLoading();
            console.log('complete')
            console.log(res)
          }
        })
      } catch (err) { }
    } else {
      wx.showToast({
        title: "无效文档",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //方法：文章浏览
  viewVFArticle:function(e){
    var that = this, id = 0;
    
    try{
      id = parseInt(e.currentTarget.dataset.id);
      id=isNaN(id)?0:id;
    }catch(err){}
    
    if (id>0) {
      that.data.isForbidRefresh = true;
      wx.navigateTo({
        url: packComPageUrl + "/articleinfo/articleinfo?id="+id+"&tag=files"
      });
    }
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
    wx.chooseImage({
      count: sType == 0 ? 1 : limitCnt,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log("select image")
        console.log(res)
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          if (sType == 1 && res.tempFilePaths.length > limitCnt) {
            wx.showLoading({
              title: "最多只能上传6张，图片处理中...",
            })
          } else {
            wx.showLoading({
              title: "图片处理中...",
            })
          }

          //多图片上传
          if (sType == 1) {
            that.recUpLoadMImg(res.tempFilePaths, 0, 0, 0, res.tempFilePaths.length, sType);
            return;
          }

          //单图片上传
          console.log(res.tempFilePaths[0])
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;

          var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
          var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
          console.log('sign:' + urlParam + "&key=" + KEY)
          urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
          console.log(URL + urlParam)
          console.log('~~~~~~~~~~~~~~~~~~~')
          wx.uploadFile({
            url: URL + urlParam, //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              wx.hideLoading();
              console.log("图片上传服务器结果。。。")
              var data = null;
              try {
                data = JSON.parse(res.data.replace(/\"/g, "\""));
              } catch (e) { }
              console.log(res)
              if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
                var imgUrl = "";
                if (data.data.fileName != null && data.data.fileName != undefined) {
                  imgUrl = app.getSysImgUrl(data.data.fileName);
                  that.dowithImg(imgUrl, sType);
                }
              } else {
                wx.showToast({
                  title: res.data.rspMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
              //do something
            },
            fail: function (e) {
              wx.hideLoading();
              app.setErrorMsg2(that, "上传图片：失败！错误信息：" + JSON.stringify(e), URL + urlParam, false)
            },
            complete: function (e) {
              wx.hideLoading();
            }
          })
        }
      }
    })
  },
  //方法：递归上传多图片
  recUpLoadMImg: function (imgData, index, sCnt, fCnt, aCnt, sType) {
    var that = this, sindex = index + 1;
    if (sType == 1 && that.data.rbImgCnt >= 6) {
      return;
    }
    wx.showLoading({
      title: "上传" + sindex + "/" + aCnt + "张...",
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var urlParam = "cls=main_UploadImg&action=uploadPicture&companyId=" + appUserInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    console.log('sign:' + urlParam + "&key=" + KEY)
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&userId=" + appUserInfo.userId + "&sign=" + sign;
    console.log(URL + urlParam)
    console.log('~~~~~~~~~~~~~~~~~~~')
    console.log(index + ":" + imgData[index]);
    wx.uploadFile({
      url: URL + urlParam, //仅为示例，非真实的接口地址
      filePath: imgData[index],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        console.log("图片上传服务器结果。。。")
        wx.hideLoading();
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) { }
        console.log(res)
        if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          var imgUrl = "";
          if (data.data.fileName != null && data.data.fileName != undefined) {
            sCnt++;
            imgUrl = app.getSysImgUrl(data.data.fileName);
            console.log(imgUrl);
            that.dowithImg(imgUrl, sType);
          }
        } else {
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 2000
          })
        }
        //do something
      },
      fail: function (e) {
        wx.hideLoading();
        app.setErrorMsg2(that, "上传图片：失败！错误信息：" + JSON.stringify(e), URL + urlParam, false)
        fCnt++;
      },
      complete: function (e) {
        wx.hideLoading();
        index++;
        if (index == aCnt || (sType == 3 && that.data.rbImgCnt >= 6)) {
          wx.hideLoading();
          if (fCnt > 0 || sCnt <= 0) {
            wx.showToast({
              title: '共' + sCnt + '张上传成功,' + fCnt + '张上传失败！',
              icon: 'none',
              duration: 2000
            })
          }
        }
        else {  //递归调用recUpLoadMImg函数
          that.recUpLoadMImg(imgData, index, sCnt, fCnt, aCnt, sType);
        }
      }
    })
  },
  //方法：上传图片后根据模板类型进行处理
  dowithImg: function (imgUrl, sType) {
    var that = this;
    switch (sType) {
      case 0:
        that.setData({
          curRBImgUrl: imgUrl,
          isUploadSingle:true,
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

  //方法：保存本地图片
  saveLocalFileInfo:function(){
    var that = this, alertContent = Utils.myTrim(that.data.curFileType)=='2'?"文章保存":"图片保存";

    wx.showLoading({
      title: alertContent + "中......",
    })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var fileJson = {
      id: that.data.curFileId, file: that.data.curRBImgUrl, name: that.data.curRBFName, folderId: that.data.editFolderId, userId: that.data.curFileUserId, companyId: that.data.curFileCompanyId, fileType: that.data.curFileType, content: that.data.curRBContent, cardIds:'',
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
          //普通新增文件夹
          that.setData({
            selFolderId:that.data.editFolderId,
            showaddimage: false,

            isPFReadOnly: true,      //当前文件夹读写状态：true只读，false只写
            isShowFolderCList:true,
          })
          //加载数据列表
          that.getQPFolderList();
        } else {
          app.setErrorMsg2(that, alertContent + "失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
        isSaveing=false;
        console.log("恢复保存标志：" + isSaveing)
      },
      fail: function (err) {
        isSaveing=false;
        console.log("恢复保存标志：" + isSaveing)
        wx.hideLoading();
        app.setErrorMsg(that, alertContent + "接口调用失败：出错：" + err, URL + urlParam);
      }
    })
  },
  
  //事件：新增本地文件
  addLocalFile:function(e){
    var that = this, item = null, index = -1, selFolderId = -2, selFolderName = "";
    item = e.currentTarget.dataset.item;
    index = e.currentTarget.dataset.index;
    if (item != null && item != undefined) {
      selFolderId = item.folderId;
      selFolderName = item.folderName;
    }
    if (selFolderId <= -2) {
      wx.showToast({
        title: "请选择文件夹！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    switch(selFolderId){
      //添加文章
      case -1:
        wx.navigateTo({
          url: packComPageUrl + "/articleinfo/articleinfo?id=0&tag=files&tFId=" + selFolderId
        });
        break;
      //添加本地图片
      default:
        that.setData({
          selFolderIndex: index,      //当前文件夹索引
          selFolderId: selFolderId,          //当前文件夹ID
          selFolderName: selFolderName,       //当前文件夹名称
          editFolderId: selFolderId,

          showaddimage: true,
          isUploadSingle: false,

          curFileId: 0,
          curFileUserId: appUserInfo.userId,
          curFileCompanyId: appUserInfo.companyId,
          curFileType: "1",
          curRBImgUrl: DataURL + "/images/upload.png",          //单张图片相对URL
          curRBFName: '',            //当前文件名称
          curRBContent: '',          //文章内容
        })
        break;
    }
  },
  
  //事件：编辑本地文件内容
  changeSPFileDataInfo:function(e){
    var that = this;
    console.log("changeSPFileDataInfo----------")
    var cid = e.currentTarget.dataset.cid;
    // 获取输入框的内容
    var value = e.detail.value;
    value = Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
    // 获取输入框内容的长度
    var len = Utils.getStrlengthB(value);
    switch (cid){
      case "currbname":
        if (len > that.data.max_filename) return;
        that.setData({
          curRBFName: value
        })
        break;

      case "currbcontent":
        //if (len > that.data.max_filecontent) return;
        that.setData({
          curRBContent: value
        })
        break;
    }
  },
  //方法：文章图片删除
  delrbImgList: function (e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    var rbImgArray = that.data.rbImgArray, rbImgCnt = 0;
    rbImgArray.splice(index, 1);
    rbImgCnt = rbImgArray.length;

    that.setData({
      rbImgCnt: rbImgCnt,             //已有图片数量
      rbImgArray: rbImgArray,          //图片列表数值
    })
  },
  
  //事件：取消新增本地图片
  cancelAddLocalImg:function(e){
    var that = this;

    that.setData({
      showaddimage: false,
    })
  },
  //事件：确定新增本地图片
  sureAddLocalImg:function(e){
    var that = this, curRBImgUrl = that.data.curRBImgUrl, curRBFName = that.data.curRBFName;
    console.log("检查是否正在保存："+isSaveing)
    if (isSaveing)return;
    if (Utils.myTrim(curRBImgUrl) == "" || Utils.myTrim(curRBImgUrl) == DataURL + "/images/upload.png") {
      wx.showToast({
        title: "请上传图片！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (Utils.myTrim(curRBFName) == "") {
      wx.showToast({
        title: "请输入图片名称！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    isSaveing=true;
    console.log("变更保存标志：" + isSaveing)
    that.setData({
      curRBImgUrl: app.getPartSysImgUrl(curRBImgUrl),
    })
    that.saveLocalFileInfo();
  },
  eventNone: function (e) {
    return;
  }
})
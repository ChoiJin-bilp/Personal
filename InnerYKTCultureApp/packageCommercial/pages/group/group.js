// pages/group/group.js
const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataURL: DataURL,
    userInfo: null,
    cardgroupData: null,
    crowdOperation:false,
    pageIndex:1,
    pageSize:20,
    cardList:[],
    crowddelete: false,
    crowdclear: false,
    delFolderCardIds: "",
    delFolderCardNames: "",
    transferId: "",
    transferName: "",
    //群交流：
    groupPageIndex: 1,
    groupPageSize: 20,
    showcheckmsg:false,
    msgData:[],
    sendImgMsgArr:[],
    message:null,
    msgQueryStat: false, //查询更多群消息，true：没有更多消息
    cardgroupViewSett: [
      { value: '允许', checked: false },
      { value: '不允许', checked: false },
    ],
    //分享
    showModalsave: false,
    saveimage: false,
    shareWXImg: DataURL + "/images/groupShare.jpg?" + (Math.random() / 9999),
    shareTitle: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: app.data.cardgroupData.name  //修改title
      })
    var identity = 0;//成员
    if (app.globalData.userInfo.userId == app.data.cardgroupData.shareQunUserId) {
      identity = 1; // 群主
    } else if (app.globalData.userInfo.userId == app.data.cardgroupData.assistantUserId) {
      identity = 2; // 管理
    }
    this.setData({
      identity: identity,
      cardgroupData: app.data.cardgroupData,
      userInfo: app.globalData.userInfo
    })
      this.getFolderCard();
  },
  //页面卸载
  onUnload: function () {
    this.setData({
      showcheckmsg: false
    })
    console.log("页面卸载、、、、、、、、、、、、、、、、、、、、、、、")
  },
  //页面不存在
  onPageNotFound: function () {
    this.setData({
      showcheckmsg: false
    })
    console.log("页面不存在、、、、、、、、、、、、、、、、、、、、、、、")
  },
  longTap: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log("长按")
    if (this.data.msgData[index].sendUserId == this.data.userInfo.userId){
      var createTime = this.data.msgData[index].createTime;
      createTime = Date.parse(new Date(createTime.replace(/\-/g, '/')));
      var timestamp = Date.parse(new Date());
      if (timestamp < createTime + (2 * 60 * 1000)) {
        this.setData({
          showWithdraw: true,
          cardgroupChatIndex: index
        })
      }
    }

  },
  hideLongTap:function(){
      this.setData({
        showWithdraw: false,
      })
  },
  onReachBottom: function () {
    // 页面触底时执行
    console.log('上拉触底')
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    var pageIndex = this.data.pageIndex;
    console.log("加载第" + pageIndex+"页")
    this.getFolderCard();
  },
  //分享事件
  onShareAppMessage: function (res) {
    let that = this;
    var scene = encodeURIComponent("id=" + that.data.cardgroupData.id + "&uid=" + app.globalData.userInfo.userId);
    // var path = '/pages/groupdata/groupdata?scene=' + scene; 
    var path = '/packageCommercial/pages/card/card?status=2&scene=' + scene;
    console.log("分享路径：", path)
    that.setData({
      crowdOperation: false,
      showModalsave: false,
    })
    return {
      title: that.data.shareTitle,
      path: path,
      imageUrl: that.data.shareWXImg,

      success: (res) => {    // 失效
        console.log("分享成功")
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  crowdOperation: function() {
    this.setData({
      crowdOperation: true
    })
  },
  hidecrowdOperation: function () {
    this.setData({
      crowdOperation: false
    })
  },
  /* 群通知 */
  queryGroupNotifi: function () {
    wx.navigateTo({
      url: packComPageUrl + "/groupinform/groupinform"
    });
  },
  groupInfoDeatil: function () {
    wx.navigateTo({
      url: packComPageUrl + "/groupdata/groupdata?status=1"
    });
    this.setData({
      crowdOperation: false,
    })
  },
  //获取收藏名片列表
  getFolderCard: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var cardgroupData = that.data.cardgroupData;
    var urlParam = "cls=main_user&action=myContactList&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=" + 1 + "&contactFolderId=" + cardgroupData.id + "&sign=" + sign + "&pageSize="+that.data.pageSize + "&pageIndex=" + that.data.pageIndex;
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(URL + urlParam)
        if (res.data.rspCode == 0) {
          console.log("名片列表：", res.data.data.dataList)
            var cardList = res.data.data.dataList;
            if (cardList.length > 0) {
              var cardTemplateList = res.data.data.cardTemplateList;
              for (var i = 0; i < cardList.length; i++) {
                //----------------------------------
                // cardList[i].checked = that.data.selectChick;
                cardList[i].checked = false;
                if (!Utils.isNull(cardList[i].userFile)) {
                  var imgFile = cardList[i].userFile.split(",");
                  cardList[i].userFile = imgFile;
                } else {
                  cardList[i].userFile = [];
                }
                for (var y = 0; y < cardTemplateList.length; y++) {
                  if (cardList[i].cardTemplateId == cardTemplateList[y].id) {
                    cardList[i].cardTemp = cardTemplateList[y];
                  }
                }
                if (!Utils.isNull(cardList[i].companyFile)) {
                  var companyImgFile = cardList[i].companyFile.split(",");
                  cardList[i].companyFile = companyImgFile;
                } else {
                  cardList[i].companyFile = [];
                }
                if (!Utils.isNull(cardList[i].personalTrade)) {
                  var personalTrade = cardList[i].personalTrade
                  personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                  personalTrade = personalTrade.split("|");
                  cardList[i].personalTrade = personalTrade;
                }
                cardList[i].checked = false;
              }
            } else {
              cardList = [];
            }
          if (that.data.pageIndex > 1){
            if (cardList.length > 0){
              cardList = that.data.cardList.concat(cardList);
              that.setData({
                cardList: cardList,
              })
              console.log('刷新完名片数据：', cardList)
            }else{
              that.setData({
                pageIndex: that.data.pageIndex - 1,
              })
            }
            return;
            }
          that.setData({
            cardList: cardList,
          })
        } else {
          app.setErrorMsg2(that, "获取收藏名片列表失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取收藏名片列表失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //查看群聊
  openCheckmsg: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var type = e.currentTarget.dataset.type;
    var cardgroupData = that.data.cardgroupData;
    var groupPageIndex = that.data.groupPageIndex;
    var groupPageSize = that.data.groupPageSize;
    if (type == 3 || type == 1) {
      groupPageIndex = 1;
      groupPageSize = 20
    }
    var urlParam = "cls=main_groupChat&action=groupChatList&contactFolderId=" + cardgroupData.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sendUserId=" + app.globalData.userInfo.userId + "&pageIndex=" + groupPageIndex + "&pageSize=" + groupPageSize + "&sign=" + sign;
    var msgData = that.data.msgData;
    if (type == 3 && !Utils.isNull(msgData)){
      urlParam += "&currentId=" + msgData[msgData.length - 1].id;
    }
    console.log('查询群聊URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询群聊', res)
        if (res.data.rspCode == 0) {
          var showcheckmsg = true;
          if (type == 3) {
            showcheckmsg = that.data.showcheckmsg;
          }
          if (!Utils.isNull(res.data.data.dataList)) {
            var dataList = res.data.data.dataList;
            if (type == 1 || type == 3) {
              msgData = msgData.concat(dataList);
              that.setData({
                showcheckmsg: showcheckmsg,
                msgData: msgData,
                heig: msgData.length * 100,
              })
            } else {
              dataList = dataList.concat(msgData);
              that.setData({
                showcheckmsg: showcheckmsg,
                msgData: dataList,
              })
            }

          } else {
            if (type == 2) {   // 上拉查看更多消息
              wx.showToast({
                title: '没有更多消息',
                icon: 'none',
                duration: 1500
              })
              that.setData({
                msgQueryStat: true
              })
            } else {
              that.setData({
                showcheckmsg: showcheckmsg,
              })
            }
          }

        } else {
          app.setErrorMsg2(that, "查看群聊失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        app.setErrorMsg2(that, "查看群聊失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }, complete: function () {
        if (that.data.showcheckmsg && (type == 1 || type == 3)) {
          setTimeout(function () {
            that.onMessage();
          }, 3000)
        } else {
          console.log("complete:结束")
        }
      }
    })

  },
  onMessage: function () {
    console.log("刷新消息")
    var that = this;
    if (!that.data.showcheckmsg) {
      console.log("结束0")
      return;
    }
    console.log("继续刷新")
    var e = {
      currentTarget: {
        dataset: {
          type: 3
        }
      }
    };
    that.openCheckmsg(e);
  },
  //群聊发送
  confirmmessage: function (e) {
    var that = this;
    if (Utils.isNull(that.data.message)) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log("内容：", that.data.message)
    var type = e.currentTarget.dataset.type;
    var cardgroupData = that.data.cardgroupData;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_groupChat&action=saveGroupChat&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&contactFolderId=" + cardgroupData.id + "&sign=" + sign;
    if (type == 1) {
      urlParam += "&message=" + that.data.message;
    } else if (type == 2) {
      var sendImgMsgArr = that.data.sendImgMsgArr;
      if (Utils.isNull(sendImgMsgArr)) {
        wx.showToast({
          title: '请先选择图片',
          icon: 'none',
          duration: 1500
        })
        return;
      }
      var str = "";
      for (let i = 0; i < sendImgMsgArr.length; i++) {
        str += sendImgMsgArr[i] + ',';
      }
      str = str.substring(0, str.length - 1);
      urlParam += "&userFile=" + str;
    }
    console.log('群聊发送URL:', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('群聊发送', res)
        if (res.data.rspCode == 0) {
          var msgData = that.data.msgData;
          msgData = msgData.concat(res.data.data);
          console.log("msgData:", msgData)
          that.setData({
            message: '',
            msgData: msgData,
            heig: msgData.length * 100,
          })
        } else {
          app.setErrorMsg2(that, "群聊发送失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        app.setErrorMsg2(that, "群聊发送失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }, complete: function () {
        wx.hideLoading()
      }
    })

  },
  hidecheckmsg: function () {
    this.setData({
      cardgroupChatIndex:null,
      showcheckmsg: false,
      msgQueryStat: false,
      msgData: [],
      groupPageIndex: 1,
      groupPageSize: 20,
    })
  },
  changeGetMsg: function (e) {
    var val = e.detail.value;
    val = Utils.myTrim(val) != "" ? Utils.filterEmoj(val) : val;
    this.setData({
      message: val
    })
  },
  threshold: function () {
    if (this.data.msgQueryStat) {
      console.log('没有更多消息')
      return;
    }
    this.setData({
      groupPageIndex: this.data.groupPageIndex + 1
    })
    var e = {
      currentTarget: {
        dataset: {
          type: 2
        }
      }
    };
    this.openCheckmsg(e);
  },
  hideModalsave: function () {
    this.setData({
      showModalsave: false,
    })
  },
  showModalsave: function () {
    this.setData({
      crowdOperation: false,
      showModalsave: true,
      shareTitle: "邀请您加入“" + this.data.cardgroupData.name + "”",
      shareWXImg: DataURL + "/images/groupShare.jpg?" + (Math.random() / 9999)
    })
  },
  changeWXSSAlert: function (e) {
    var that = this;
    // 获取输入框的内容
    var value = e.detail.value;
    that.setData({
      shareTitle: value,
    })
  },
  uploadImage: function (e) {
    var that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log('获取图片：', res)
        if (!Utils.isNull(res.tempFilePaths)) {
          that.setData({
            shareWXImg: res.tempFilePaths[0]
          })
        }
        // tempFilePath可以作为img标签的src属性显示图片
        wx.hideLoading()
        const tempFilePaths = res.tempFilePaths
      }, fail: function (err) {
        wx.hideLoading()
      }
    })
  },
  uploadSendImage: function (e) {
    var that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var count = 6;
    var sendImgMsgArr = that.data.sendImgMsgArr;
    if (sendImgMsgArr.length > 0) {
      count = count - sendImgMsgArr.length;
    }
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (!Utils.isNull(res.tempFilePaths)) {
          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          var length = res.tempFilePaths.length; //总共个数
          var i = 0; //第几个
          // that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);

          sendImgMsgArr = sendImgMsgArr.concat(res.tempFilePaths);
          console.log("选择的照片：", sendImgMsgArr)
          that.setData({
            sendImgMsgArr: sendImgMsgArr,
            saveimage: true,
          })
        }
        wx.hideLoading()
      }, fail: function (err) {
        wx.hideLoading()
      }
    })
  },
  //图片 上传+发送
  imageMsgSend: function () {
    var sendImgMsgArr = this.data.sendImgMsgArr;
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数
    var length = sendImgMsgArr.length; //总共个数
    var i = 0; //第几个
    this.uploadDIY(sendImgMsgArr, successUp, failUp, i, length);
  },
  //图片上传
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
    urlParam += "&userId=" + app.globalData.userInfo.userId + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    urlParam += "&uploadtype=1" + "&contactFolderId=" + that.data.cardgroupData.id;
    console.log(URL + urlParam)
    console.log('上传图片地址：', filePaths[i])
    wx.uploadFile({
      url: URL + urlParam,
      filePath: filePaths[i],
      name: 'file',
      formData: {

      },
      success: (res) => {
        successUp++;
        wx.hideLoading();
        var data = null;
        try {
          data = JSON.parse(res.data.replace(/\"/g, "\""));
        } catch (e) { }
        if (data.rspCode == 0) {
          console.log('上传+发送成功:', data)
          var msgData = that.data.msgData;
          console.log("原msgData：", msgData)
          var fileName = data.data;
          console.log("fileName", fileName)
          msgData = msgData.concat(fileName);
          console.log("处理后：", msgData)
          that.setData({
            saveimage: false,
            heig: msgData.length * 100,
            msgData: msgData
          })
          // var imgUrl = data.data.fileName;
          // var sendImgMsgArr = that.data.sendImgMsgArr;
          //     sendImgMsgArr = sendImgMsgArr.concat(imgUrl);
          //     that.setData({
          //       sendImgMsgArr: sendImgMsgArr
          //     })
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
  crowdAddGroupmembers: function () {
    var that = this;
    var arr = [];
    var arr1 = app.data.cardData;
    var arr2 = app.data.userData;
    console.log('arr1', arr1)
    console.log('arr1', arr2)
    for (let i = 0; i < arr2.length; i++) {
      if (arr2[i].contactId == that.data.cardgroupData.shareQunContactUserId) {
        arr2.splice(i, 1);
      }
    }
    if (arr1.length == 0 && arr2.length == 0) {
      wx.showToast({
        title: '没有可以加入名片群的名片！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (arr1.length > 0) {
      arr = arr.concat(arr1);
    }
    if (arr2.length > 0) {
      arr = arr.concat(arr2);
    }
    console.log("arr", arr)

    that.setData({
      crowdOperation:false,
      uncollectedCards: arr,
      addGroupmembers: true
    })
  },
  checkCard: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cardList = that.data.cardList;
    cardList[index].checked = !cardList[index].checked;
    that.setData({
      cardList: cardList
    })
  },
  //移出群
  crowdclear: function (e) {
    var cardList = this.data.cardList;
    var ids = "";
    var names = "";
    if (Utils.isNull(cardList)) {
      wx.showToast({
        title: '请选择需要移出的名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    for (var y = 0; y < cardList.length; y++) {
      if (cardList[y].checked) {
        if (cardList[y].contactId == this.data.cardgroupData.shareQunContactUserId) {
          wx.showToast({
            title: '不能移出自己的名片！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
        if (ids == "") {
          ids += cardList[y].contactId;
          names += cardList[y].contact;
        } else {
          ids += "," + cardList[y].contactId;
          names += "、" + cardList[y].contact;
        }
      }
    }
    if (ids == "") {
      wx.showToast({
        title: '请选择需要移出的名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      this.setData({
        crowdclear: true,
        delFolderCardIds: ids,
        delFolderCardNames: names,
      })
    }
  },
  hidecrowdclear: function () {
    this.setData({
      crowdclear: false,
      delFolderCardIds: '',
      delFolderCardNames: ''
    })
  },
  //删除文件夹内的名片
  requestDelFolderCard: function (e) {
    var that = this;
    console.log(e)
    var type = 0; //退出或删除；
    if (e.currentTarget.dataset.type != undefined) { //移出
      type = e.currentTarget.dataset.type;
      console.log("移出", type)
    }else{
      console.log("退出", type)
    }
    var ids = that.data.delFolderCardIds;
    var targetContactFolderId = 0;
    if (Utils.isNull(ids)) {
      targetContactFolderId = -1;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var contactFolderId = that.data.cardgroupData.id;
    var urlParam = "cls=main_contact&action=moveContact&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&contactFolderId=" + contactFolderId + "&folderType=1&targetContactFolderId=" + targetContactFolderId + "&ids=" + ids + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('移除或退出名片:', res)
        if (res.data.rspCode == 0) {
          var cardgroupIndex = that.data.cardgroupIndex;
          if (type == 0) { //退出或删除
            wx.navigateBack({
              delta: 1
            })
            return
          } else { //移出名片
            var idsArr = ids.split(',');
            var cardList = that.data.cardList;
            for (let i = 0; i < idsArr.length; i++) {
              for (let y = 0; y < cardList.length; y++) {
                if (idsArr[i] == cardList[y].contactId) {
                  cardList.splice(y, 1);
                }
              }
            }
            that.setData({
              cardList: cardList,
            })
          }
          that.setData({
            crowddelete: false
          })
          wx.showToast({
            title: '移除成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "删除文件夹失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "删除文件夹失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }, complete: function () {
        that.setData({
          crowdOperation: false,
          crowdclear: false,
          delFolderCardIds: '',
          delFolderCardNames: ''
        })
      }
    })
  },
  //删除文件夹
  requestDelFolder: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=1&opertion=del&ids=" + that.data.cardgroupData.id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            crowddelete: false,
            crowdOperation: false,
          })
          wx.navigateBack({
            delta: 1
          })
          return
        } else {
          app.setErrorMsg2(that, "删除文件夹失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "删除文件夹失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //撤回群消息
  saveGroupChat: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("index:",index)
    var urlParam = "cls=main_groupChat&action=saveGroupChat&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&&operation=del&id=" + that.data.msgData[index].id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('撤回群消息:', res)
        if (res.data.rspCode == 0) {
          var msgData = that.data.msgData;
              msgData.splice(index,1);
          that.setData({
            msgData: msgData,
            showWithdraw:false            
          })
        } else {
          app.setErrorMsg2(that, "撤回群消息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "撤回群消息：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },
  //设置管理员
  transferGroupOwner2: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&assistantUserId=" + that.data.transferId + "&assistantContactUserId=" + that.data.transfercontacId + "&ids=" + that.data.cardgroupData.id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('设置管理员:', res)
        if (res.data.rspCode == 0) {
          var cardgroupData = that.data.cardgroupData;
          cardgroupData.assistantUserId = that.data.transferId;
          cardgroupData.assistantContactUserId = that.data.transfercontacId;
          that.setData({
            cardgroupData: cardgroupData,
            crowdTransfer2: false,
          })
          wx.showToast({
            title: '设置成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "设置管理员失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "设置管理员失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },
  //转让群主
  transferGroupOwner: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=1&shareQunUserId=" + that.data.transferId + "&shareQunContactUserId=" + that.data.transfercontacId + "&ids=" + that.data.cardgroupData.id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('转让群主:', res)
        if (res.data.rspCode == 0) {
          var cardgroupData = that.data.cardgroupData;
          cardgroupData.shareQunUserId = that.data.transferId;
          cardgroupData.shareQunContactUserId = that.data.transfercontacId;
          that.setData({
            cardgroupData: cardgroupData,
            crowdTransfer: false,
            crowdOperation: false,
          })
          wx.showToast({
            title: '转让成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "转让群主失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "转让群主失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      },
    })
  },
  //转让群
  showTransferGroup: function () {
    var cardList = this.data.cardList;
    if (cardList.length < 2) {
      wx.showToast({
        title: '没有成员可以转让！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var id = "";
    var contacId = "";
    var name = "";
    var selectStat = false;
    for (var y = 0; y < cardList.length; y++) {
      if (cardList[y].checked) {
        if (cardList[y].contactId == this.data.cardgroupData.shareQunContactUserId) {
          wx.showToast({
            title: '请选择其他成员转让！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
        if (selectStat) {
          wx.showToast({
            title: '最多选择一个！',
            icon: 'none',
            duration: 1500
          })
          return;
        } else {
          if (id == "") {
            id = cardList[y].c_userId;
            contacId = cardList[y].contactId;
            name = cardList[y].contact;
            selectStat = true;
          }
        }
      }
    }
    // }
    if (id == "") {
      wx.showToast({
        title: '请选择要转让的群主！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      this.setData({
        crowdTransfer: true,
        transferId: id,
        transfercontacId: contacId,
        transferName: name,
      })
    }
  },
  //设置管理员
  adminSetting: function () {
    var that = this;
    if (that.data.cardgroupData.assistantContactUserId > 0){
      wx.showToast({
        title: '只能设置一个群助理！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var cardList = this.data.cardList;
    if (cardList.length < 2) {
      wx.showToast({
        title: '没有成员可以设置！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var id = "";
    var contacId = "";
    var name = "";
    var selectStat = false;
    for (var y = 0; y < cardList.length; y++) {
      if (cardList[y].checked) {
        if (cardList[y].contactId == this.data.cardgroupData.shareQunContactUserId) {
          wx.showToast({
            title: '请选择其他成员转让！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
        if (selectStat) {
          wx.showToast({
            title: '最多选择一个！',
            icon: 'none',
            duration: 1500
          })
          return;
        } else {
          if (id == "") {
            id = cardList[y].c_userId;
            contacId = cardList[y].contactId;
            name = cardList[y].contact;
            selectStat = true;
          }
        }
      }
    }
    // }
    if (id == "") {
      wx.showToast({
        title: '请选择要设置的成员！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      this.setData({
        crowdOperation: false,
        crowdTransfer2: true,
        transferId: id,
        transfercontacId: contacId,
        transferName: name,
      })
    }
  },
  hidecrowdTransfer: function () {
    this.setData({
      crowdTransfer: false
    })
  },
  hidecrowdTransfer2: function () {
    this.setData({
      crowdTransfer2: false
    })
  },
  //删除群
  exitGroup: function () {
    this.setData({
      showMenuOperation: false,
      crowddelete: true
    })
  },
  hideExitGroup: function () {
    this.setData({
      crowddelete: false
    })
  },
  hidecrowddelete: function () {
    this.setData({
      crowddelete: false
    })
  },
  //群设置
  crowdset: function () {
    var viewSettings = this.data.cardgroupViewSett;
    if (this.data.cardgroupData.lookContactDetail) {
      viewSettings[1].checked = true;
      viewSettings[0].checked = false;
    } else {
      viewSettings[0].checked = true;
      viewSettings[1].checked = false;
    }
    this.setData({
      cardgroupViewSett: viewSettings,
      crowdset: true,
      crowdOperation:false
    })
  },
  hidecrowdset: function () {
    this.setData({
      crowdset: false
    })
  },
  //共享群设置 是否允许成员查看名片
  updateShareLookCard: function (e) {
    var that = this;
    var cardgroupData = that.data.cardgroupData;
    var id = cardgroupData.id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var lookContactDetail = 1; //0允许，1不允许
    if (that.data.cardgroupViewSett[0].checked) {
      lookContactDetail = 0;
    }
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=1&lookContactDetail=" + lookContactDetail + "&ids=" + id + "&sign=" + sign;
    console.log("共享群设置URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("共享群设置：", res)
        if (res.data.rspCode == 0) {
          cardgroupData.lookContactDetail = lookContactDetail;
          that.setData({
            cardgroupData: cardgroupData,
            crowdOperation: false,
            crowdset: false,
            cardgroupIndex: null,
          })
          wx.showToast({
            title: '发布成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "发布群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "发布群通知失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  hidecrowdset: function () {
    this.setData({
      crowdset: false
    })
  },
  folderCarddetails: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var showCollButt = 1;
    if (type == 1) {
      var cardgroupList = that.data.cardgroupData;
      if (cardgroupList.lookContactDetail && cardgroupList.shareQunUserId != app.globalData.userInfo.userId) {
        wx.showToast({
          title: '您没有权限查看！',
          icon: 'none',
          duration: 1500
        })
        return;
      }
      showCollButt = 3;
      var cardDetaData = that.data.cardList[index];
      if (cardDetaData.c_userId == app.globalData.userInfo.userId) {
        app.data.userCardDetaData = cardDetaData;
        wx.navigateTo({
          url: packComPageUrl + "/mycard/mycard"
        });
        app.data.cardGroupOnshowStat = true;
        return;
      }
    } else if (type == 2 || type == 3) {
    
    }
    app.data.cardDetaData = cardDetaData;
    if (!Utils.isNull(cardDetaData.documentIds)) {
      app.data.cardGroupOnshowStat = true;
      wx.navigateTo({
        url: packComPageUrl + "/articleinfo/articleinfo?scene=2&contactUserId=" + cardDetaData.id + '&userId=' + app.globalData.userInfo.userId + "&articlesId=" + cardDetaData.documentIds + "&redEnvelStat=" + false + "&cardRedInfoId=" + cardDetaData.cardRedInfoId
      });
    } else {
      wx.navigateTo({
        url: packComPageUrl + "/carddetails/carddetails?showCollButt=" + showCollButt + "&showCollectionButton=" + false + "&cardGroupOnshowStat=" + true
      });
    }
  },
  showCrowinform: function (e) {
    this.setData({
      crowdOperation: false
    })
    wx.navigateTo({
      url: packComPageUrl + "/groupnotice/groupnotice?status=" + 2 + '&identity=' + this.data.identity
    })
  },
  showsaveimage: function () {
    this.setData({
      sendImgMsgArr: []
    })
    this.uploadSendImage();
  },
  hidesaveimage: function () {
    this.setData({
      saveimage: false
    })
  },
  hideaddmembers: function () {
    this.setData({
      addGroupmembers: false
    })
  },
  //加入收藏文件夹
  requestMoveFolderCard: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var ids = "";
    var cards = [];
    var addCards = [];
    var cardgroupIndex = that.data.cardgroupIndex;
      cards = that.data.uncollectedCards;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].checked) {
        ids += cards[i].contactId + ",";
        addCards.push(cards[i]);
      }
    }
    if (Utils.isNull(ids)) {
      wx.showToast({
        title: '请选择成员',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    ids = ids.substring(0, ids.length - 1);
    var urlParam = "cls=main_contact&action=moveContact" + "&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&ids=" + ids + "&targetContactFolderId=" + that.data.cardgroupData.id + "&sign=" + sign;
    console.log("---------")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('添加成功', res)
        if (res.data.rspCode == 0) {
          var cardList = that.data.cardList;
          console.log('添加的资料', addCards)
          for (let i = 0; i < addCards.length; i++) {
            addCards[i].checked = false;
          }
          if (Utils.isNull(cardList)) {
            that.getFolders();
            that.setData({
              addGroupmembers: false,
              crowdOperation: false
            })
            return;
          } else {
            cardList = cardList.concat(addCards);
          }
          that.setData({
            cardList: cardList,
            addGroupmembers: false,
          })
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "移动名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '该名片已在此群',
            icon: 'none',
            duration: 1500
          })
        }

      },
      fail: function (err) {
        app.setErrorMsg2(that, "移动名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  checkCardcardIds: function (e) {
    var index = e.currentTarget.dataset.index;
    var cards = [];
    var str = "";
      cards = this.data.uncollectedCards;
      str = "uncollectedCards";
    cards[index].checked = !cards[index].checked;
    this.setData({
      [str]: cards
    })
  },
})
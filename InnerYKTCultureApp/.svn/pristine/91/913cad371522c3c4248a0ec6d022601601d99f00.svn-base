const app = getApp()
var MD5JS = require('../../../utils/md5.js');
var Utils = require('../../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo, packOtherPageUrl = "../../../packageOther/pages", packComPageUrl = "../../../packageCommercial/pages", mainPackageDir = "../../../pages",isJumpOut=false;
Page({
  data: {
    sysName: app.data.sysName,         //系统名称
    //会员服务限制信息对象
    srvRightData: null,      //服务权限信息对象
    isPassSrvRight: false,   //是否服务权限是否通过
    showRmq: false, //是否显示人脉群
    selecBox: false,
    showMenuOperation: false,
    showNewFolder: false,
    newGroupMesgStat: false,
    showcheckmsg: false,
    receptionpop: false,//已发 接收人列表
    fileNameStat: false,//文件夹名修改
    currentData: 0,
    totalDataCount: 0, // 总数据条数
    collectNum: 0, //收藏名片数量
    currentPage: 0,
    showguidance: false,
    showcollect: false,
    articles: [], // 存放所有的文章
    msgData: [],//群聊列表数据
    DataURL: DataURL,
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'Z',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups: [],//收藏名片数据（处理过的数据,用于显示）
    cardData: [],//名片夹
    uncollectedCards: [],//添加群成员（所有未进入名片群的名片）
    sendLogDataList: [],//已发名片
    userData: [],//我的名片
    searchData: [],//搜索结果
    searchDataAdd: [],//搜索结果
    wdataList: [],//收到的回复名片数据
    showReplyCard: false,
    sweepState: false, //是否扫名片群进入
    isNewCard: false, //扫码进群后是否需要完善名片
    addcrowdnum: 5,
    cardgroupList: [],//名片群列表
    cardgroupNotif: "",//输入的名片群通知
    cardgroupIndex: null,//名片群设置的index
    shareWXImg: DataURL + "/images/groupShare.jpg?" + (Math.random() / 9999),

    folderListIndex: 0,
    cardgroupRemark: "",//输入的名片群名片备注
    cardgroupCardIndex: null,//名片群的名片设置的index
    addGroupmembers: false, //添加群成员
    folderIndex: 1,//文件夹
    folderSize: 20,//文件夹
    showModalsave: false,
    delFolderCardIds: "",
    delFolderCardNames: "",
    transferId: "",
    transferName: "",
    cardgroupViewSett: [
      { value: '允许', checked: false },
      { value: '不允许', checked: false },
    ],
    myArticleList: [
      { name: '允许' },
      { name: '不允许' }
    ],
    folderList: [],//收藏文件夹列表
    folderCardList: [],//收藏文件夹名片列表
    wdataListStatus: false,//收到的名片弹窗
    showSubmit: false,
    queryReplyCardStatus: false,
    showModel: 0,// 0：显示全部、1：显示搜索结果
    showModelAdd: 0,// 0：显示全部、1：显示搜索结果
    sourceType: 0,
    sourcePage: "",
    folderName: "",//新建文件夹名字
    showModalqrcard: false,//二维码
    folderType: 0,// 1名片群接口需要，2已发接口需要
    setWaitTime: 3000,
    mycardnum: 4,
    id: 0,
    num: 0,
    cardcrowdnum: 4,
    arraynum: 6,
    disabled: false, //按钮
    newcrowd: false,
    selectChick: false,
    joincrowd: false,
    crowdOperation: false,
    crowdqrcode: false,
    crowinform: false,
    crowdupdown: false,
    crowdclear: false,
    crowddelete: false,
    crowdset: false,
    cardbeizhu: false,
    showWithdraw: false,
    selectCardIndex: 0, //新建共享群 选中作为群主的名片index 默认0
    newGroupName: null, //新建群名称
    folderListSet: '',
    temFolderList: [],
    temCardgroupList: []
  },
  onShow: function (options) {
    var that = this;
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
    if (!isJumpOut){
      appUserInfo = app.globalData.userInfo;
      const res = wx.getSystemInfoSync(),
        letters = that.data.letters;
      // 设备信息
      that.data.windowHeight = res.windowHeight;
      that.data.windowWidth = res.windowWidth;
      that.data.pixelRatio = res.pixelRatio;
      // 第一个字母距离顶部高度，单位使用的是rpx,须除以pixelRatio，才能与touch事件中的数值相加减，css中定义nav高度为90%，所以 *0.90
      const navHeight = that.data.windowHeight * 0.84, // 
        eachLetterHeight = navHeight / 36,
        comTop = (that.data.windowHeight - navHeight) / 2,
        temp = [];

      that.data.eachLetterHeight = eachLetterHeight;

      // 求各字母距离设备左上角所处位置
      for (let i = 0, len = letters.length; i < len; i++) {
        const x = that.data.windowWidth - (10 + 50) / that.data.pixelRatio,
          y = comTop + (i * eachLetterHeight);
        temp.push([x, y]);
      }
      that.data.lettersPosition = temp;
      if (appUserInfo == null) {
        // that.getLoginUserInfo();
      } else {
        that.setData({
          userInfo: app.globalData.userInfo
        })
        if (that.data.currentData == 0 || that.data.currentData == 1) {
          that.getMainDataList();
        } else if (that.data.currentData == 2) {
          if (that.data.folderType != 2) {
            that.setData({
              folderType: 2
            })
          }
          that.setData({
            folderIndex: 1 //重置分页
          })
          that.getFolders();
        }
      }
    }else{
      isJumpOut=false;
    }
  },
  onLoad: function (options) {
    var that = this;
    app.setFunctionModuleInfo(this, 6);
    console.log('onLoad参数:', options)
    if (options.status == 1) {//名片
      app.data.cardGroupOnshowStat = true;
      isJumpOut=true;
      wx.navigateTo({
        url: packComPageUrl + '/carddetails/carddetails?status=' + options.status + '&contactUserId=' + options.contactUserId + '&checked=' + options.checked + '&userId=' + options.userId + '&redEnvelStat=' + options.redEnvelStat + '&cardRedInfoId=' + options.cardRedInfoId + '&batch=' + options.batch + '&contactId=' + options.contactId,
      })
      return;
    } else if (options.status == 2) {//群名片
      isJumpOut=true;
      app.data.cardGroupOnshowStat = true;
      wx.navigateTo({
        url: packComPageUrl + '/groupdata/groupdata?scene=' + options.scene
      })
      return;
    }
    var str = "";
    if (!Utils.isNull(options.scene)) {
      str = decodeURIComponent(options.scene);
      str = Utils.getToJson(str);
      console.log("str=", str)
      if (!Utils.isNull(str.id)) {
        that.setData({
          folderType: 1,
          currentData: str.t,
          qrCodeId: str.id,
          sweepState: true  //-扫名片群进入
        })
        if (!Utils.isNull(str.uid)) {
          that.setData({
            paramShareUId: str.uid
          })
        }
        console.log('开始登陆...')
        app.getLoginUserInfo(this);
      }
    } else {
      that.setData({
        userId: app.globalData.userInfo.userId
      })
      wx.getStorage({
        key: 'myCardTips',
        success(res) {
          if (res.data == true) {
            that.setData({
              showguidance: true
            })
          }
        }, fail(err) {
          that.setData({
            showguidance: true
          })
        }
      })
    }

    if (!Utils.isNull(options.currentData)) {
      that.setData({
        currentData: options.currentData
      })
    }


  },
  onPullDownRefresh: function () {
    console.log('下拉刷新')
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
  search: function (e) {
    var that = this;
    var val = e.detail.value;
    if (val == "") {
      that.setData({
        searchData: [],
        showModel: 0
      })
      return
    }
    var list = that.data.cardData;
    var arr = [];
    var reg = new RegExp(val);
    for (let i = 0; i < list.length; i++) {

      var stringName = list[i].contact.toString();
      var stringJob = list[i].job.toString();
      var stringCompany = list[i].company.toString();
      if (stringName.match(reg)) {
        arr.push(list[i]);
      } else if (stringJob.match(reg)) {
        arr.push(list[i]);
      } else if (stringCompany.match(reg)) {
        arr.push(list[i]);
      }
    }
    that.setData({
      searchData: arr,
      showModel: 1
    })
  },
  searchAddCard: function (e) {
    var that = this;
    var val = e.detail.value;
    if (val == "") {
      that.setData({
        searchDataAdd: [],
        showModelAdd: 0
      })
      return
    }
    var list = that.data.uncollectedCards;
    var arr = [];
    var reg = new RegExp(val);
    for (let i = 0; i < list.length; i++) {

      var stringName = list[i].contact.toString();
      var stringJob = list[i].job.toString();
      var stringCompany = list[i].company.toString();
      if (stringName.match(reg)) {
        arr.push(list[i]);
      } else if (stringJob.match(reg)) {
        arr.push(list[i]);
      } else if (stringCompany.match(reg)) {
        arr.push(list[i]);
      }
    }
    if (arr.length == 0) {
      wx.showToast({
        title: '找不到输入的名片',
        icon: 'none',
        duration: 1500
      })
      return
    }
    that.setData({
      searchDataAdd: arr,
      showModelAdd: 1
    })
  },
  //获取文件夹input输入
  onChangeName: function (e) {
    var that = this;
    var val = e.detail.value;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      var cardgroupList = that.data.cardgroupList;
      cardgroupList[index].name = val;
      that.setData({
        cardgroupList: cardgroupList,
        fileNameStat: true
      })
    } else if (type == 2) {
      var folderList = that.data.folderList;
      folderList[index].name = val;
      that.setData({
        folderList: folderList,
        fileNameStat: true
      })
    }

  },
  //获取新建文件夹名称
  changeValuePFData: function (e) {
    var that = this;
    var val = e.detail.value;
    that.setData({
      folderName: val
    })
  },
  //获取群通知输入
  changeInputNotif: function (e) {
    var val = e.detail.value;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        cardgroupNotifTitle: val
      })
    } else {
      this.setData({
        cardgroupNotif: val
      })
    }

  },
  //获取群备注输入
  changeInputRemark: function (e) {
    var val = e.detail.value;
    this.setData({
      cardgroupRemark: val
    })
    console.log('输入内容：', val)
  },
  //------字母排序------------------------------------------
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })

    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  touchend(e) {
    this.cleanAcitvedStatus();
  },
  //名片收藏（加星）
  cardCollection: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var ids = "";
    var star = "";
    that.setData({
      showMenuOperation: false
    })
    if (type == 0) {//标注多个名片
      var folderList = that.data.folderList;
      if (folderList != null && folderList != undefined && folderList.length > 0) {
        for (var i = 0; i < folderList.length; i++) {
          var cardList = folderList[i].cardList;
          if (cardList != null && cardList != undefined && cardList.length) {
            for (var y = 0; y < cardList.length; y++) {
              if (cardList[y].checked && cardList[y].star == false) {
                if (ids == "") {
                  ids += cardList[y].contactId;
                } else {
                  ids += "," + cardList[y].contactId;
                }
              }
            }
          }
        }
      }

      if (ids == "") {
        wx.showToast({
          title: '请选择需要标记的名片！',
          icon: 'none',
          duration: 1500
        })
        return;
      } else {
        wx.showModal({
          title: '提示',
          content: '确定要标记选中的名片吗？',
          success(res) {
            if (res.confirm) {
              star = true;
              that.requestCardCollection(type, ids, star, null, null);
            } else if (res.cancel) {
              return;
            }
          }
        })
      }
    } else {
      var index = e.currentTarget.dataset.index;
      var cardindex = e.currentTarget.dataset.cardindex;
      ids = e.currentTarget.dataset.ids;
      star = !e.currentTarget.dataset.star;
      that.requestCardCollection(type, ids, star, index, cardindex);
    }
  },
  requestCardCollection: function (type, ids, star, index, cardindex) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=starContact&ids=" + ids + "&userId=" + app.globalData.userInfo.userId + "&star=" + star + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          if (type == 1) {
            that.getMainDataList();
          } else if (type == 3) {
            var cardData = that.data.cardData;
            var searchData = that.data.searchData;
            cardData[index].star = star;
            searchData[index].star = star;
            that.setData({
              cardData: cardData,
              searchData: searchData
            })
          } else if (type == 2) {
            var folderList = that.data.folderList;
            var cardData = that.data.cardData;
            folderList[index].cardList[cardindex].star = star;
            for (let i = 0; i < cardData.length; i++) {
              if (cardData[i].id == folderList[index].cardList[cardindex].id) {
                cardData[i].star = star;
              }
            }
            that.setData({
              folderList: folderList,
              cardData: cardData,
            })
          } else if (type == 0) {
            that.getFolders();
            that.setData({
              showMenuOperation: false
            })
          }
        } else {
          app.setErrorMsg2(that, "名片加星失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "名片加星失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //修改文件夹名称
  updateFileName: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var cardList = [];
    var cardListStr = '';
    if (type == 1) {//名片群
      cardList = that.data.cardgroupList;
      cardListStr = 'cardgroupList';
    } else if (type == 2) {//收藏夹
      cardList = that.data.folderList;
      cardListStr = 'folderList';
    }
    var name = cardList[index].name;
    var id = cardList[index].id;
    if (!that.data.fileNameStat) {
      cardList[index].nameDisabled = false;
      that.setData({
        [cardListStr]: cardList
      })
      return
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=" + that.data.folderType + "&name=" + encodeURIComponent(name) + "&ids=" + id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          cardList[index].nameDisabled = false;
          that.setData({
            [cardListStr]: cardList,
            showMenuOperation: false
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
      }
    })
  },
  //发布群通知
  updateShareQunNews: function (e) {
    var that = this;
    if (Utils.isNull(that.data.cardgroupNotifTitle)) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (Utils.isNull(that.data.cardgroupNotif)) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var cardList = [];
    var cardListStr = '';
    cardList = that.data.cardgroupList;
    cardListStr = 'cardgroupList';
    var id = cardList[that.data.cardgroupIndex].id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_qunNotice&action=saveQunNotice&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&contactFolderId=" + id + "&message=" + encodeURIComponent(that.data.cardgroupNotif) + "&title=" + encodeURIComponent(that.data.cardgroupNotifTitle) + "&sign=" + sign;
    console.log("发布群通知URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        if (res.data.rspCode == 0) {
          var data = [];
          data = data.concat(res.data.data);
          data[0].checked = true;
          console.log('发布消息:', data)
          var cardgroupMsg = that.data.cardgroupMsg;
          data = data.concat(cardgroupMsg)
          // cardgroupMsg = cardgroupMsg.concat(data)
          that.setData({
            cardgroupMsgIndex: 0,
            cardgroupMsg: data,
            newGroupMesgStat: false,
            cardgroupNotif: null,
            cardgroupNotifTitle: null,
            // heig: cardgroupMsg.length * 100
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
  //群名片备注
  updateShareQunReamrk: function (e) {
    var that = this;
    var cardList = that.data.cardgroupList;
    var cardId = cardList[that.data.cardgroupIndex].cardList[that.data.cardgroupCardIndex].id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_user&action=saveUserContact" + "&userId=" + app.globalData.userInfo.userId + "&contactUserId=" + cardId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&qunRemark=" + encodeURIComponent(that.data.cardgroupRemark) + "&id=" + cardList[that.data.cardgroupIndex].cardList[that.data.cardgroupCardIndex].contactId + "&contactFolderId=" + cardList[that.data.cardgroupIndex].cardList[that.data.cardgroupCardIndex].contactFolderId + "&operation=modQunRemark&sign=" + sign;
    console.log("群名片备注URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("群名片备注：", res)
        if (res.data.rspCode == 0) {
          cardList[that.data.cardgroupIndex].cardList[that.data.cardgroupCardIndex].qunRemark = that.data.cardgroupRemark;
          console.log('cardListcardListcardListcardList', cardList)
          that.setData({
            cardgroupList: cardList,
            cardbeizhu: false,
            cardgroupRemark: null
          })
        } else {
          app.setErrorMsg2(that, "群名片备注失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "群名片备注失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //共享群设置 是否允许成员查看名片
  updateShareLookCard: function (e) {
    var that = this;
    var cardList = that.data.cardgroupList;
    var id = cardList[that.data.cardgroupIndex].id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var lookContactDetail = 1; //0允许，1不允许
    if (that.data.cardgroupViewSett[0].checked) {
      lookContactDetail = 0;
    }
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=" + that.data.folderType + "&lookContactDetail=" + lookContactDetail + "&ids=" + id + "&sign=" + sign;
    console.log("共享群设置URL:", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("共享群设置：", res)
        if (res.data.rspCode == 0) {
          cardList[that.data.cardgroupIndex].lookContactDetail = lookContactDetail;
          that.setData({
            cardgroupList: cardList,
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
  //请求移除文件夹内的名片
  delFolderCard: function () {
    var that = this;
    var folderList = that.data.folderList;
    var ids = "";
    that.setData({
      showMenuOperation: false
    })
    for (var i = 0; i < folderList.length; i++) {
      var cardList = folderList[i].cardList;
      for (var y = 0; y < cardList.length; y++) {
        if (cardList[y].checked) {
          if (ids == "") {
            ids += cardList[y].contactId;
          } else {
            ids += "," + cardList[y].contactId;
          }
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
      that.setData({
        delFolderCardIds: ids
      })
      wx.showModal({
        title: '提示',
        content: '确定要移出选中的名片吗？',
        success(res) {
          if (res.confirm) {
            that.requestDelFolderCard();
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  //删除文件夹内的名片
  requestDelFolderCard: function (e) {
    var that = this;
    console.log(e)
    var type = 0;
    if (e != undefined) {
      type = e.currentTarget.dataset.type;
    }
    var ids = that.data.delFolderCardIds;
    var targetContactFolderId = 0;
    if (Utils.isNull(ids)) {
      targetContactFolderId = -1;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var contactFolderId = 0;
    if (type == 0) {
      contactFolderId = that.data.cardgroupList[that.data.cardgroupIndex].id;
    } else {
      contactFolderId = that.data.folderList[that.data.cardgroupIndex].id;
    }
    var urlParam = "cls=main_contact&action=moveContact&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&contactFolderId=" + contactFolderId + "&folderType=" + that.data.folderType + "&targetContactFolderId=" + targetContactFolderId + "&ids=" + ids + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('移除名片:', res)
        if (res.data.rspCode == 0) {
          var cardTotal = that.data.cardTotal;
          var cardgroupIndex = that.data.cardgroupIndex;
          if (type == 0) {
            var cardgroupList = that.data.cardgroupList;
            cardTotal = cardTotal - cardgroupList[cardgroupIndex].cardNumber;
            cardgroupList.splice(cardgroupIndex, 1);
            that.setData({
              cardgroupList: cardgroupList,
              cardTotal: cardTotal,
            })
          } else {
            var cardgroupList = that.data.cardgroupList;
            var idsArr = ids.split(',');
            var cardList = cardgroupList[cardgroupIndex].cardList;
            for (let i = 0; i < idsArr.length; i++) {
              for (let y = 0; y < cardList.length; y++) {
                if (idsArr[i] == cardList[y].contactId) {
                  cardgroupList[cardgroupIndex].cardNumber = cardgroupList[cardgroupIndex].cardNumber - 1;
                  cardList.splice(y, 1);
                  cardTotal = cardTotal - 1;
                }
              }
            }
            cardgroupList[that.data.cardgroupIndex].cardList = cardList;
            that.setData({
              cardTotal: cardTotal,
              cardgroupList: cardgroupList,
            })
          }

          that.setData({
            showMenuOperation: false,
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
  //转让群主
  requstTransferGroupOwner: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=" + that.data.folderType + "&shareQunUserId=" + that.data.transferId + "&shareQunContactUserId=" + that.data.transfercontacId + "&ids=" + that.data.cardgroupList[that.data.cardgroupIndex].id + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('返回数据:', res)
        if (res.data.rspCode == 0) {
          // that.data.cardgroupList[that.data.cardgroupIndex].id
          var cardgroupList = that.data.cardgroupList;
          cardgroupList[that.data.cardgroupIndex].shareQunUserId = that.data.transferId;
          cardgroupList[that.data.cardgroupIndex].shareQunContactUserId = that.data.transfercontacId;
          that.setData({
            cardgroupList: cardgroupList,
            showMenuOperation: false,
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
  //扫码加名片群
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
        console.log('加入成功', res)
        if (res.data.rspCode == 0) {
          that.setData({
            joincrowd: false,
          })
          var title = '加入成功';
          if (that.data.isNewCard) {
            title = '加入成功，请完善名片信息';
          }
          wx.showToast({
            title: title,
            duration: 1500
          })
          that.getFolders();
        } else {
          app.setErrorMsg2(that, "扫码加名片群失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: '该名片已在此群',
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
  //回复索要名片
  confirmReplyCard: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=saveAskForContact&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&id=" + that.data.contactask.id + "&newContactUserId=" + that.data.userData[that.data.selectCardIndex].contactUserId + "&status=2&sign=" + sign;
    console.log('回复索要名片' + URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('回复索要名片', res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: '回复成功',
            duration: 1500
          })
          that.setData({
            showReplyCard: false
          })
        } else {
          app.setErrorMsg2(that, "回复索要名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
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
  //查询二维码里的名片群数据
  contactFolderDetail: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=contactFolderDetail&id=" + that.data.qrCodeId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log("查询二维码名片URL：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("查询二维码名片群数据：", res)
        if (res.data.rspCode == 0) {
          that.setData({
            qrCodeName: res.data.data.name
          })
        } else {
          app.setErrorMsg2(that, "查询二维码里的名片群数据失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
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
  //加入收藏文件夹
  requestMoveFolderCard: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var ids = "";
    var cards = [];
    var addCards = [];
    var cardgroupIndex = that.data.cardgroupIndex;
    if (that.data.showModelAdd == 0) {
      cards = that.data.uncollectedCards;
    } else {
      cards = that.data.searchDataAdd;
    }
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
    urlParam = urlParam + "&ids=" + ids + "&targetContactFolderId=" + that.data.cardgroupList[cardgroupIndex].id + "&sign=" + sign;
    console.log("---------")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('添加成功', res)
        if (res.data.rspCode == 0) {
          var cardgroupList = that.data.cardgroupList;
          var cardList = cardgroupList[cardgroupIndex].cardList;
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
          var cardTotal = that.data.cardTotal;
          cardgroupList[cardgroupIndex].cardList = cardList;
          cardgroupList[cardgroupIndex].cardNumber = cardgroupList[cardgroupIndex].cardNumber + addCards.length;
          cardTotal = cardTotal + addCards.length;
          console.log('c添加完后：', cardgroupList)
          that.setData({
            cardTotal: cardTotal,
            cardgroupList: cardgroupList,
            addGroupmembers: false,
            crowdOperation: false
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
  //移动收藏文件夹
  requestMoveInFolderCard: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var ids = "";
    var folderListIndex = that.data.folderListIndex;
    var cardList = that.data.folderList[folderListIndex].cardList;
    for (let i = 0; i < cardList.length; i++) {
      if (cardList[i].checked) {
        ids += cardList[i].contactId + ",";
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
    var urlParam = "cls=main_contact&action=moveContactToFoler&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&companyId=" + app.globalData.userInfo.companyId + "&ids=" + ids + "&targetContactFolderId=" + that.data.folderList[index].id + "&sign=" + sign;
    console.log("---------")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('移动成功', res)
        if (res.data.rspCode == 0) {
          that.setData({
            showModalfolder: false,
            folderIndex: 1 //重置分页
          })
          var status = 1;//不自动展开第一个文件夹
          that.getFolders(status);
          wx.showToast({
            title: '移动成功',
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
  //请求删除选择的文件夹
  delFolder: function () {
    var that = this;
    var folderList = that.data.folderList;
    var ids = "";
    that.setData({
      showMenuOperation: false
    })
    for (var i = 0; i < folderList.length; i++) {
      if (folderList[i].checked) {
        if (ids == "") {
          ids += folderList[i].id;
        } else {
          ids += "," + folderList[i].id;
        }
      }
    }
    if (ids == "") {
      wx.showToast({
        title: '请选择需要删除的文件夹！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定删除选中的文件夹吗？',
        success(res) {
          if (res.confirm) {
            that.requestDelFolder(ids);
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  //请求删除选择的已发名片
  delCardRecorded: function () {
    var that = this;
    var folderList = that.data.folderList;
    var ids = "";
    that.setData({
      showMenuOperation: false
    })
    console.log('folderList:', folderList)
    for (let i = 0; i < folderList.length; i++) {
      var cardList = folderList[i].cardList;
      if (!Utils.isNull(cardList)) {
        for (let y = 0; y < cardList.length; y++) {
          console.log("循环 y ", cardList.checked)
          if (cardList[y].checked) {
            if (ids == "") {
              ids += cardList[y].contactId;
            } else {
              ids += "," + cardList[y].contactId;
            }
          }
        }
      }
    }
    console.log('ids：：：：：：：：', ids)

    if (ids == "") {
      wx.showToast({
        title: '请选择需要删除的已发名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定删除选中的已发名片吗？',
        success(res) {
          if (res.confirm) {
            that.requestDelCardRecorded(ids);
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  //退出名片群
  confirmCrowddelete: function () {
    var cardList = this.data.cardgroupList[this.data.cardgroupIndex].cardList;
    // var ids = "";
    // for (let i = 0; i < cardList.length; i ++){
    //   if (cardList[i].c_userId == app.globalData.userInfo.userId){
    //     ids += cardList[i].contactId + ',';
    //   }
    // }
    // if(ids == ""){
    //   this.setData({
    //     crowddelete:false
    //   })
    //   wx.showToast({
    //     title: '退出失败.',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return
    // }
    // ids = ids.substring(0,ids.length-1);
    // this.setData({
    //   delFolderCardIds: ids
    // })
    this.requestDelFolderCard();
  },
  //退出名片群
  confirmCrowddelete2: function () {
    var ids = this.data.cardgroupList[this.data.cardgroupIndex].id;
    this.requestDelFolder(ids);
  },
  hidecrowddelete: function () {
    this.setData({
      crowddelete: false
    })
  },
  //直接删除当前文件夹
  delCurrentFolder: function (e) {
    var that = this;
    var ids = "";
    var index = e.currentTarget.dataset.index;
    ids = that.data.folderList[index].id;
    wx.showModal({
      title: '提示',
      content: '确定删除当前的文件夹吗？',
      success(res) {
        if (res.confirm) {
          that.requestDelFolder(ids);
        } else if (res.cancel) {
        }
      }
    })
  },
  //删除已发名片
  requestDelCardRecorded: function (ids) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=delSendedContact&ids=" + ids + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          // var idsArr = ids.split(",");
          that.getFolders();
          // var cardgroupList = that.data.cardgroupList;
          // cardgroupList.splice(that.data.cardgroupIndex,1);
          that.setData({
            showMenuOperation: false,
            crowddelete: false,
            crowdOperation: false,
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
      }
    })
  },
  //删除文件夹
  requestDelFolder: function (ids) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=" + that.data.folderType + "&opertion=del&ids=" + ids + "&sign=" + sign;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          // var idsArr = ids.split(",");
          that.getFolders();
          // var cardgroupList = that.data.cardgroupList;
          // cardgroupList.splice(that.data.cardgroupIndex,1);
          that.setData({
            showMenuOperation: false,
            crowddelete: false,
            crowdOperation: false,
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
      }
    })
  },
  //获取已发 接收人列表
  showreceptionpop: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cardindex = e.currentTarget.dataset.cardindex;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var data = that.data.folderList[index].cardList[cardindex];
    var urlParam = "cls=main_shareContact&action=recShareContactList&contactId=" + data.contactId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&batch=" + data.batch + "&contactUserId=" + data.contactUserId + "&sign=" + sign + "&pageSize=100&pageIndex=1";
    console.log("接收人列表", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("接收人列表：", res)
        if (res.data.rspCode == 0) {
          var cardgroupList = res.data.data.dataList;
          if (Utils.isNull(cardgroupList)) {
            wx.showToast({
              title: '暂时没有人查看您发送的名片资料',
              icon: 'none',
              duration: 1500
            })
          } else {
            that.setData({
              receptionpop: true,
              receiverData: cardgroupList
            })
          }


        } else {
          app.setErrorMsg2(that, "已发名片 接收人列表！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "已发名片 接收人列表：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //查询群通知
  queryGroupNotifi: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      cardgroupIndex: index
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_qunNotice&action=qunNoticeList&contactFolderId=" + that.data.cardgroupList[index].id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign + "&pageSize=100&pageIndex=1";
    console.log("获取群通知：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("获取群通知：", res)
        if (res.data.rspCode == 0) {
          var tips = '';
          var groupNotifDis = true;
          if (!Utils.isNull(res.data.data.dataList)) {
            var dataList = res.data.data.dataList;
            for (let i = 0; i < dataList.length; i++) {
              if (i == 0) {
                dataList[i].checked = true;
                that.setData({
                  cardgroupMsgIndex: i
                })
              } else {
                dataList[i].checked = false;
              }
            }
          } else {
            if (that.data.userInfo.userId == that.data.cardgroupList[index].shareQunUserId) {
              tips = '您还没有发送群消息，请点击新建发布群消息';
            } else {
              tips = '群主暂时未发布群消息';
            }
            dataList = [];
          }
          if ((that.data.userInfo.userId == that.data.cardgroupList[index].shareQunUserId)) {
            groupNotifDis = false;
          }
          that.setData({
            cardgroupMsg: dataList,
            crowinform: true,
            groupNotifDis: groupNotifDis,
            noMsgTips: tips
          })
          console.log("处理后群消息", dataList)
        } else {
          app.setErrorMsg2(that, "获取群通知失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取群通知失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //获取群名片/已发列表
  getFolders: function (type) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=contactFolderList&companyId=" + app.globalData.userInfo.companyId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=" + that.data.folderType + "&userId=" + app.globalData.userInfo.userId + "&sign=" + sign + "&pageSize=10000&pageIndex=1";
    console.log("收藏列表：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log("收藏列表：", res)
        if (res.data.rspCode == 0) {
          var cardgroupList = res.data.data.dataList;
          var cardTotal = 0;
          for (let i = 0; i < cardgroupList.length; i++) {
            cardgroupList[i].cardNumber = parseInt(cardgroupList[i].cardNumber);
            cardTotal = cardTotal + cardgroupList[i].cardNumber;
            cardgroupList[i].isShow = true;
          }
          // if (that.data.currentData == 1 && !Utils.isNull(cardgroupList)){
          //   for (let i = 0; i < cardgroupList.length; i++) {
          //     if (!Utils.isNull(cardgroupList[i].img)){
          //       cardgroupList[i].img = cardgroupList[i].img.split(',');
          //     }
          //   }
          // }
          that.setData({
            cardTotal: cardTotal,
            cardgroupList: cardgroupList,
            folderList: cardgroupList
          })
          if (that.data.currentData == 2 && cardgroupList.length > 0 && type != 1) {
            that.setData({
              folderListIndex: 0
            })
            that.getFolderCard(0);
          }
          console.log("处理完收藏列表：", cardgroupList)
        } else {
          app.setErrorMsg2(that, "获取收藏列表失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "获取收藏列表失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  // onReachBottom: function () {
  //  console.log("上拉触底")
  // },
  //获取收藏名片列表
  getFolderCard: function (index) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var cardgroupList = [];
    // if (that.data.currentData == 1) {
    //   var cardgroupList = that.data.cardgroupList;
    // } else 
    if (that.data.currentData == 2) {
      var cardgroupList = that.data.folderList;
    }
    var action = 'myContactList';
    if (that.data.currentData == 2) {
      action = 'sendLogDataList';
    }
    var urlParam = "cls=main_user&action=" + action + "&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&folderType=" + that.data.folderType + "&contactFolderId=" + cardgroupList[index].id + "&sign=" + sign + "&pageSize=" + that.data.folderSize + "&pageIndex=" + that.data.folderIndex;
    console.log(URL + urlParam)

    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(cardgroupList[index].name + '的名片', res.data)
        if (res.data.rspCode == 0) {
          var folderCardList = res.data.data.sendLogDataList;
          if (folderCardList.length > 0) {
            var cardTemplateList = res.data.data.cardTemplateList;
            for (var i = 0; i < folderCardList.length; i++) {
              folderCardList[i].checked = that.data.selectChick;
              if (!Utils.isNull(folderCardList[i].userFile)) {
                var imgFile = folderCardList[i].userFile.split(",");
                folderCardList[i].userFile = imgFile;
              } else {
                folderCardList[i].userFile = [];
              }
              for (var y = 0; y < cardTemplateList.length; y++) {
                if (folderCardList[i].cardTemplateId == cardTemplateList[y].id) {
                  folderCardList[i].cardTemp = cardTemplateList[y];
                }
              }
              if (!Utils.isNull(folderCardList[i].companyFile)) {
                var companyImgFile = folderCardList[i].companyFile.split(",");
                folderCardList[i].companyFile = companyImgFile;
              } else {
                folderCardList[i].companyFile = [];
              }
              if (!Utils.isNull(folderCardList[i].personalTrade)) {
                var personalTrade = folderCardList[i].personalTrade
                personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                personalTrade = personalTrade.split("|");
                folderCardList[i].personalTrade = personalTrade;
              }
            }
            if (that.data.folderIndex > 1) {//加载新数据 
              let cardList = cardgroupList[index].cardList;
              cardList = cardList.concat(folderCardList);
              cardgroupList[index].cardList = cardList;
              var str = 'folderList[' + index + ']'

              that.setData({
                [str]: cardgroupList[index],
              })
              return;
            } else {
              cardgroupList[index].cardList = folderCardList;
            }
          } else {
            console.log('folderIndex', that.data.folderIndex)
            if (that.data.folderIndex > 1) {
              that.setData({
                folderIndex: that.data.folderIndex - 1
              })
              console.log('没有更多数据 end')
              return;
            }

            cardgroupList[index].cardList = [];
            that.setData({
              folderList: cardgroupList
            })
            return;
          }
          cardgroupList[index].checked = that.data.selectChick;
          cardgroupList[index].nameDisabled = false;
          cardgroupList[index].cardDisabled = true;
          cardgroupList[index].isQuery = true;
          // if (that.data.currentData == 3 && index == 0) {
          //   cardgroupList[index].cardDisabled = true;
          // }
          // if (that.data.selectChick) {
          for (let i = 0; i < cardgroupList.length; i++) {
            if (i != index) {
              cardgroupList[i].isShow = false;
              if (!cardgroupList[index].cardDisabled) {//点击后 隐藏其他文件夹
                cardgroupList[i].isShow = true;
              } else {
                cardgroupList[i].isShow = false;
              }
            }
          }
          // }

          that.setData({
            selectChick: false,
            folderList: cardgroupList
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
  //新建文件夹
  submitNewFolder: function () {
    var that = this;
    if (that.data.folderName.length == 0 || that.data.folderName.length == '') {
      wx.showToast({
        title: '请输入文件夹名称！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (that.data.folderName.length > 0) {
      for (let i = 0; i < that.data.folderList.length; i++) {
        if (that.data.folderName == that.data.folderList[i].name) {
          wx.showToast({
            title: '文件夹名称已存在！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
      }
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&folderType=" + that.data.folderType + "&name=" + encodeURIComponent(that.data.folderName) + "&shareQun=0&sign=" + sign;
    console.log("新建文件夹：：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.getFolders();
          that.setData({
            showNewFolder: false
          })
          wx.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "新建文件夹失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "新建文件夹失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },

  //------数据列表------------------------------------------
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
          var wdataList = data.data.wdataList;
          var cardTemplateList = data.data.cardTemplateList;
          app.data.cardTemplateList = cardTemplateList;
          if (wdataList.length > 0) {
            for (var i = 0; i < wdataList.length; i++) {
              if (!Utils.isNull(wdataList[i].userFile)) {
                var imgFile = wdataList[i].userFile.split(",");
                wdataList[i].userFile = imgFile;
              } else {
                wdataList[i].userFile = [];
              }
              for (var y = 0; y < cardTemplateList.length; y++) {
                if (wdataList[i].cardTemplateId == cardTemplateList[y].id) {
                  wdataList[i].cardTemp = cardTemplateList[y];
                }
              }
              if (!Utils.isNull(wdataList[i].companyInfo)) {
                if (!Utils.isNull(wdataList[i].companyInfo.companyFile)) {
                  var companyImgFile = wdataList[i].companyInfo.companyFile.split(",");
                  wdataList[i].companyInfo.companyFile = companyImgFile;
                } else {
                  wdataList[i].companyInfo.companyFile = [];
                }
              }
              if (!Utils.isNull(wdataList[i].personalTrade)) {
                var personalTrade = wdataList[i].personalTrade
                personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                personalTrade = personalTrade.split("|");
                wdataList[i].personalTrade = personalTrade;
              }

            }
            that.setData({
              wdataList: wdataList,
              wdataListStatus: true
            })
          } else {
            that.setData({
              wdataList: [
              ],
              wdataListStatus: false
            })
          }
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
              if (!Utils.isNull(mydataList[i].personalTrade)) {
                var personalTrade = mydataList[i].personalTrade
                personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                personalTrade = personalTrade.split("|");
                mydataList[i].personalTrade = personalTrade;
              }

            }

          }
          var cardData = data.data.dataList;
          if (cardData.length > 0) {
            for (var i = 0; i < cardData.length; i++) {
              if (!Utils.isNull(cardData[i].userFile)) {
                var imgFile = cardData[i].userFile.split(",");
                cardData[i].userFile = imgFile;
              } else {
                cardData[i].userFile = [];
              }
              for (var y = 0; y < cardTemplateList.length; y++) {
                if (cardData[i].cardTemplateId == cardTemplateList[y].id) {
                  cardData[i].cardTemp = cardTemplateList[y];
                }
              }

              if (!Utils.isNull(cardData[i].companyInfo) && !Utils.isNull(cardData[i].companyInfo.companyFile)) {
                var companyImgFile = cardData[i].companyInfo.companyFile.split(",");
                cardData[i].companyInfo.companyFile = companyImgFile;
              } else {
                // cardData[i].companyInfo.companyFile = [];
              }
              if (!Utils.isNull(cardData[i].personalTrade)) {
                var personalTrade = cardData[i].personalTrade
                personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                personalTrade = personalTrade.split("|");
                cardData[i].personalTrade = personalTrade;
              }
            }
          }
          that.setData({
            cardNumStr: cardData.length,
            userData: mydataList,
            cardData: cardData,
          })
          if (that.data.sweepState) {
            if (that.data.userData.length > 0) {
              that.setData({
                joincrowd: true
              })
            } else {
              that.insertCard(1);
            }

            console.log('扫码进入', that.data.joincrowd)
          }
          that.getAskCardMsg();
        } else {
          app.setErrorMsg2(that, "获取名片夹信息失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
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
  //查询索要名片提示
  getAskCardMsg: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=getAskForContact&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sign=" + sign;
    console.log('查询索要名片提示', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log('查询索要名片提示', res)
        if (res.data.rspCode == 0 && !Utils.isNull(res.data.data)) {
          var data = res.data.data;
          if (data.contactask.status == 1) {
            var content = '';
            if (!Utils.isNull(data.recUserMap.company)) {
              content += data.recUserMap.company + '的';
            }
            content += data.recUserMap.contact;
            if (!Utils.isNull(data.recUserMap.job)) {
              content += '(' + data.recUserMap.job + ')';
            }
            wx.showModal({
              title: '提示',
              confirmText: '回ta名片',
              content: content + '向您索要名片。',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  if (that.data.userData.length > 0) {
                    that.setData({
                      showReplyCard: true,
                      contactask: data.contactask
                    })
                  } else {
                    that.insertCard(2);
                  }

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (data.contactask.status == 2) {
            if (!Utils.isNull(data.recUserMap)) {
              var wdataList = data.recUserMap;
              var cardTemplateList = app.data.cardTemplateList;
              for (var i = 0; i < wdataList.length; i++) {
                if (!Utils.isNull(wdataList[i].userFile)) {
                  var imgFile = wdataList[i].userFile.split(",");
                  wdataList[i].userFile = imgFile;
                } else {
                  wdataList[i].userFile = [];
                }
                if (!Utils.isNull(cardTemplateList)) {
                  for (var y = 0; y < cardTemplateList.length; y++) {
                    if (wdataList[i].cardTemplateId == cardTemplateList[y].id) {
                      wdataList[i].cardTemp = cardTemplateList[y];
                    }
                  }
                }
                if (!Utils.isNull(wdataList[i].companyInfo)) {
                  if (!Utils.isNull(wdataList[i].companyInfo.companyFile)) {
                    var companyImgFile = wdataList[i].companyInfo.companyFile.split(",");
                    wdataList[i].companyInfo.companyFile = companyImgFile;
                  } else {
                    wdataList[i].companyInfo.companyFile = [];
                  }
                }
                if (!Utils.isNull(wdataList[i].personalTrade)) {
                  var personalTrade = wdataList[i].personalTrade
                  personalTrade = personalTrade.substring(0, personalTrade.length - 1);
                  personalTrade = personalTrade.split("|");
                  wdataList[i].personalTrade = personalTrade;
                }

              }
              that.setData({
                recUserMap: wdataList,
                contactask: data.contactask,
                recUserMapStatus: true
              })
            } else {
              that.setData({
                recUserMap: [
                ],
                recUserMapStatus: false
              })
            }
          }

        } else {

        }
      },
      fail: function (err) {
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
  insertCard: function (type) {
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
          var cardTemplateList = app.data.cardTemplateList;
          for (let y = 0; y < cardTemplateList.length; y++) {
            if (userData[0].cardTemplateId == cardTemplateList[y].id) {
              userData[0].cardTemp = cardTemplateList[y];
            }
          }
          if (type == 1) {
            that.setData({
              isNewCard: true,
              userData: userData,
              joincrowd: true
            })
          } else if (type == 2) {//回复索要名片
            that.setData({
              showReplyCard: true,
              userData: userData,
            })
          }

          wx.showModal({
            title: '提示',
            confirmText: '知道了',
            showCancel: false,
            content: '请完善名片资料，到＂我的名片＂去点开自己的名片，点击＂编辑＂按钮后完善名片资料。',
            success(res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        } else {
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
  preservation: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    var index = e.currentTarget.dataset.index;
    that.requestCollection(val, index);
  },
  mySorterA: function (a, b) {
    if (/^\d /.test(a.cTag) ^ /^\D/.test(b.cTag)) return a.cTag > b.cTag ? 1 : (a.cTag == b.cTag ? 0 : -1);
    return a.cTag > b.cTag ? -1 : (a.cTag == b.cTag ? 0 : 1);
  },
  carddetails: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.showModel == 1) {
      app.data.cardDetaData = that.data.searchData[index];
    } else {
      app.data.cardDetaData = that.data.cardData[index];
    }
    wx.navigateTo({
      url: packComPageUrl + "/carddetails/carddetails?showCollButt=1"
    });
  },
  //事件：文件夹名片详情
  folderCarddetails: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var cardindex = e.currentTarget.dataset.cardindex;
    var showCollButt = 1;
    //【1】如果为我的名片
    if (type == 1) {
      var cardgroupList = that.data.cardgroupList[index];
      if (cardgroupList.lookContactDetail && cardgroupList.shareQunUserId != app.globalData.userInfo.userId) {
        wx.showToast({
          title: '您没有权限查看！',
          icon: 'none',
          duration: 1500
        })
        return;
      }
      showCollButt = 3;
      var cardDetaData = that.data.cardgroupList[index].cardList[cardindex];
      if (cardDetaData.c_userId == app.globalData.userInfo.userId) {
        app.data.userCardDetaData = cardDetaData;
        wx.navigateTo({
          url: packComPageUrl + "/mycard/mycard"
        });
        app.data.cardGroupOnshowStat = true;
        return;
      }
    } else if (type == 2 || type == 3) {
      var cardDetaData = that.data.folderList[index].cardList[cardindex];
      if (cardDetaData.c_userId == app.globalData.userInfo.userId && type == 2) {
        app.data.userCardDetaData = cardDetaData;
        wx.navigateTo({
          url: packComPageUrl + "/mycard/mycard"
        });
        app.data.cardGroupOnshowStat = true;
        return;
      }
    }
    //【2】如果是他人的名片
    app.data.cardDetaData = cardDetaData;
    if (!Utils.isNull(cardDetaData.documentIds) && !Utils.myTrim(cardDetaData.documentIds).toLowerCase() == 'null') {
      //（1)如果带文章
      app.data.cardGroupOnshowStat = true;
      wx.navigateTo({
        url: packComPageUrl + '/articleinfo/articleinfo?scene=2&contactUserId=' + cardDetaData.id + '&userId=' + app.globalData.userInfo.userId + "&articlesId=" + cardDetaData.documentIds + "&redEnvelStat=" + false + "&cardRedInfoId=" + cardDetaData.cardRedInfoId
      });
    } else {
      //(2)如果不带文章
      wx.navigateTo({
        url: packComPageUrl + "/carddetails/carddetails?showCollButt=" + showCollButt + "&showCollectionButton=" + false + "&cardGroupOnshowStat=" + true
      });
    }
  },
  //事件：跳转我的名片详情
  mycard: function (e) {
    var that = this;
    app.data.userCardDetaData = that.data.userData[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: packComPageUrl + "/mycard/mycard"
    });
  },
  newcard: function () {
    //是否启用会员服务权限检查
    if (app.data.isSrvRightCheck) {
      this.getMemberSrvRightData(app.globalData.userInfo.userId, 3, 1)
    } else {
      wx.navigateTo({
        url: packComPageUrl + "/newcard/newcard"
      });
    }
  },
  searchJump: function () {
    wx.navigateTo({
      url: packOtherPageUrl + "/search/search"
    });
  },
  //获取当前滑块的index
  bindchange: function (e) {
    console.log('bindchange')
    const that = this;
    // if (!app.isPerfectPersonInfo()) {
    //   wx.showToast({
    //     title: '请在"我的"注册后再继续使用！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return;
    // }
    that.setData({
      currentData: e.detail.current
    })
    if (e.detail.current == 0) {
      that.getMainDataList();
    }
    // else if (e.detail.current == 1) {
    //   if (!that.data.sweepState){
    //     wx.getStorage({
    //       key: 'collTips',
    //       success(res) {
    //         if (res.data == true) {
    //           that.setData({
    //             showcollect: true
    //           })
    //         }
    //       }, fail(err) {
    //         that.setData({
    //           showcollect: true
    //         })
    //       }
    //     })
    //   }

    //   if (that.data.folderType != 1){
    //     that.setData({
    //       folderType: 1
    //     })
    //   }
    //   if (!that.data.sweepState) {
    //     that.getFolders();
    //   }
    // } 
    else if (e.detail.current == 2) {
      if (that.data.folderType != 2) {
        that.setData({
          folderType: 2
        })
      }
      that.setData({
        folderIndex: 1 //重置分页
      })
      that.getFolders();
    }
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    console.log('checkCurrent')
    const that = this;
    that.setData({
      currentData: e.target.dataset.current
    })
    // if (e.target.dataset.current == 1){
    //   var cardgroupList = that.data.cardgroupList;
    //   if (!Utils.isNull(cardgroupList)){
    //     for (let i = 0; i < cardgroupList.length; i++){
    //       if (cardgroupList[i].cardDisabled){
    //         cardgroupList[i].cardDisabled = false;
    //       }
    //     }
    //     that.setData({
    //       cardgroupList: cardgroupList
    //     })
    //   }
    // } else
    if (e.target.dataset.current == 2) {//已发
      var folderList = that.data.folderList;
      for (let i = 0; i < folderList.length; i++) {
        folderList[i].isShow = true;
        folderList[i].cardDisabled = false;
      }
      that.setData({
        selectChick: false,
        folderList: folderList,
        folderListIndex: null
      })
      console.log('onChangeimage', folderList)
    }
  },
  //查看索要回复的名片详情
  queryRecCard: function (e) {
    var that = this;
    if (that.data.queryReplyCardStatus) {
      return;
    }
    that.setData({
      queryReplyCardStatus: true
    })
    app.data.cardDetaData = that.data.recUserMap;
    wx.navigateTo({
      url: packComPageUrl + "/carddetails/carddetails?showCollButt=2",
      success: function () {
        that.setData({
          queryReplyCardStatus: false
        })
      }
    });
  },
  //查看回复的名片详情
  queryReplyCard: function (e) {
    var that = this;
    if (that.data.queryReplyCardStatus) {
      return;
    }
    that.setData({
      queryReplyCardStatus: true
    })
    var index = e.currentTarget.dataset.index;
    app.data.cardDetaData = that.data.wdataList[index];
    wx.navigateTo({
      url: packComPageUrl + "/carddetails/carddetails?showCollButt=2",
      success: function () {
        that.setData({
          queryReplyCardStatus: false
        })
      }
    });
  },

  //保存索要回复的名片
  requestAskReplyCard: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=saveAskForContact&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&id=" + that.data.contactask.newContactUserId + "&status=3&sign=" + sign;
    console.log('保存', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          wx.showToast({
            title: '保存成功',
            duration: 1500
          })
          that.setData({
            recUserMapStatus: false
          })
        } else {
          app.setErrorMsg2(that, "保存索要回复的名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "保存索要回复的名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },

  //不保存索要回复的名片
  requestNoAskReplyCard: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contact&action=saveAskForContact&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&id=" + that.data.contactask.newContactUserId + "&status=4&sign=" + sign;
    console.log('不保存', URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            recUserMapStatus: false
          })
        } else {
          app.setErrorMsg2(that, "不保存索要回复的名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
          that.setData({
            recUserMapStatus: false
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "不保存索要回复的名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //保存给我回复的名片
  requestCollection: function (val, index) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var value = val;
    if (value == 0) {
      value = "&operation=del"
    } else {
      value = "&status=1" + "&operation=mod";
    }
    var urlParam = "cls=main_user&action=saveUserContact&userId=" + app.globalData.userInfo.userId + "&contactUserId=" + that.data.wdataList[index].id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign + "&pageSize=" + 10000 + "&pageIndex=1" + value;
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.getMainDataList();
        } else {
          app.setErrorMsg2(that, "保存给我回复的名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "保存给我回复的名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  //加入收藏文件夹
  submitCollection: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var index = e.currentTarget.dataset.index;
    var urlParam = "cls=main_contact&action=moveContact" + "&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&ids=" + that.data.cardIds + "&targetContactFolderId=" + that.data.folderList[index].id + "&sign=" + sign;
    console.log("---------")
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.setData({
            showModalfolder: false
          })
          wx.showToast({
            title: '收藏成功',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "保存名片失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }

      },
      fail: function (err) {
        app.setErrorMsg2(that, "保存名片失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })
  },
  hidestatus: function () {
    this.setData({
      wdataListStatus: false
    })
  },
  hideModalQRcard: function () {
    this.setData({
      showModalqrcard: false
    })
  },
  showModalQRcard: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在生成二维码中',
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var index = e.currentTarget.dataset.index;
    var cId = that.data.userData[index].id;
    var qrName = that.data.userData[index].contact;
    // var urlParam = "cls=qrCode_QRCodeContent&action=getWXACodeUnlimit&page=pages/carddetails/carddetails&status=3&cId=" + cId +"&uId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var urlParam = "cls=qrCode_QRCodeContent&action=getWXACodeUnlimit&page=" + app.data.sysMainPage +"&status=3&cId=" + cId + "&uId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&pagedata=sType=13|cId=" + cId + "|suid=" + app.globalData.userInfo.userId + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
    if (URL.indexOf("_a") >= 0) {
      console.log('包含此字符串')
      // urlParam += '&projectName=baojiayou_a';
      urlParam += '&projectName=baojiayou';
    } else {
      urlParam += '&projectName=baojiayou';
    }
    console.log(URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.rspCode == 0) {
          // that.setData({
          //   qrCodeImg: DataURL + "/"+ res.data.data.imageAddress,
          //   qrName: qrName,
          //   showModalqrcard: true
          // })
          var imag = DataURL + "/" + res.data.data.imageAddress;
          var urls = []
          console.log(imag)
          urls.push(imag);
          wx.previewImage({
            current: imag, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
          })
        } else {
          app.setErrorMsg2(that, "生成二维码失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        app.setErrorMsg2(that, "生成二维码失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }
    })

  },
  //新建名片群
  confirmNewCardgroup: function (e) {
    var that = this;
    if (Utils.isNull(that.data.newGroupName)) {
      wx.showToast({
        title: "请输入群名称！",
        icon: 'none',
      })
      return;
    } else if (that.data.newGroupName.match(/^\s+$/)) {
      wx.showToast({
        title: "群名称不能为空！",
        icon: 'none',
      })
      return;
    }
    that.setData({
      disabled: true
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_contactFolder&action=saveContactFolder&companyId=" + app.globalData.userInfo.companyId + "&userId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&shareQunContactUserId=" + that.data.userData[that.data.selectCardIndex].contactId + "&shareQunUserId=" + app.globalData.userInfo.userId + "&name=" + encodeURIComponent(that.data.newGroupName) + "&shareQun=1&sign=" + sign + "&xcxAppId=" + app.data.wxAppId;
    console.log("新建名片群：：", URL + urlParam)
    wx.request({
      url: URL + urlParam,
      success: function (res) {
        console.log(res)
        if (res.data.rspCode == 0) {
          that.getFolders();
          that.setData({
            newcrowd: false
          })
          wx.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          app.setErrorMsg2(that, "新建文件夹失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          wx.showToast({
            title: res.data.rspMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        app.setErrorMsg2(that, "新建文件夹失败：fail！错误信息：" + err, URL + urlParam, false);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1500
        })
        console.log("接口失败：" + err)
      }, complete: function () {
        that.setData({
          disabled: false
        })
        console.log('执行complete', that.data.disabled)
      }
    })
  },

  hideMenuOperationPop: function () {
    this.setData({
      showMenuOperation: false
    })
  },
  showMenuOperationPop: function () {
    this.setData({
      showMenuOperation: true
    })
  },
  hideNewFolder: function () {
    this.setData({
      showNewFolder: false
    })
  },
  showNewFolder: function () {
    this.setData({
      showMenuOperation: false,
      showNewFolder: true
    })
  },
  onChangeimage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    console.log('onChangeimage')
    if (type == 2) {
      var folderList = that.data.folderList;
      if (folderList[index].isQuery) {
        folderList[index].cardDisabled = !folderList[index].cardDisabled;
        // if (that.data.selectChick) {
        for (let i = 0; i < folderList.length; i++) {
          if (i != index) {
            folderList[i].isShow = false;
            if (!folderList[index].cardDisabled) {//点击后 隐藏其他文件夹
              folderList[i].isShow = true;
            } else {
              folderList[i].isShow = false;
            }
          }
        }
        // }
        if (!folderList[index].cardDisabled) {
          index = null;
        }
        console.log('index ', index)
        that.setData({
          selectChick: false,
          folderList: folderList,
          folderListIndex: index
        })
        console.log('onChangeimage', folderList)
      } else {
        console.log("开始获取群的名片列表、index=", index)
        that.getFolderCard(index);
      }

    } else if (type == 1) {
      var cardgroupList = that.data.cardgroupList;
      app.data.cardgroupData = cardgroupList[index];
      app.data.cardData = that.data.cardData;
      app.data.userData = that.data.userData;
      wx.navigateTo({
        url: packComPageUrl + "/group/group?id=" + cardgroupList[index].id
      });
    }

  },
  hideimage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var folderList = that.data.folderList;
    folderList[index].cardDisabled = false;
    that.setData({
      folderList: folderList
    })
  },
  onChangeShowState: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 2) {
      var folderList = that.data.folderList;
      folderList[index].nameDisabled = true;
      that.setData({
        folderList: folderList
      })
    } else if (type == 1) {
      var cardgroupList = that.data.cardgroupList;
      cardgroupList[index].nameDisabled = true;
      that.setData({
        cardgroupList: cardgroupList
      })
    }
  },
  checkCard: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cardindex = e.currentTarget.dataset.cardindex;
    var type = e.currentTarget.dataset.type;
    var folderList = null;
    var str = '';
    if (type == 1) {
      folderList = that.data.cardgroupList;
      str = 'cardgroupList';
    } else if (type == 3) {
      folderList = that.data.folderList;
      str = 'folderList';
      var folderListSet = that.data.folderListSet;
      if (folderListSet == '') {
        var folderListSet = index;
      } else {
        if (folderListSet != index) {
          wx.showToast({
            title: '只能对一个文件夹进行设置！',
            icon: 'none',
            duration: 1500
          })
          return;
        }
      }
    }
    folderList[index].cardList[cardindex].checked = !folderList[index].cardList[cardindex].checked;
    that.setData({
      [str]: folderList
    })
  },
  checkCardcardIds: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var cards = [];
    var str = "";
    if (type == 0) {
      cards = this.data.uncollectedCards;
      str = "uncollectedCards";
    } else {
      cards = this.data.searchDataAdd;
      str = "searchDataAdd";
    }
    cards[index].checked = !cards[index].checked;
    this.setData({
      [str]: cards
    })
  },
  bindSelectAll: function (e) {
    var that = this;
    console.log('全选', e)
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var folderList = null;
    var str = '';
    var title = '';
    if (type == 1) {
      folderList = that.data.cardgroupList;
      str = 'cardgroupList';
    } else if (type == 3) {
      folderList = that.data.folderList;
      str = 'folderList';
    }
    console.log("checked:::", !folderList[index].checked)
    if (!folderList[index].checked) {
      var folderListSet = that.data.folderListSet;
      if (Utils.isNull(folderListSet)) {
        folderListSet = index;
        that.setData({
          folderListSet: folderListSet
        })
        console.log('folderListSet', folderListSet)
      } else {
        // if (folderListSet != index) {
        //   wx.showToast({
        //     title: title,
        //     icon: 'none',
        //     duration: 1500
        //   })
        //   return;
        // }
      }
    } else {
      that.setData({
        folderListSet: ''
      })
    }
    folderList[index].checked = !folderList[index].checked;
    if (folderList[index].checked) {
      folderList[index].cardDisabled = true;
    }
    var cardList = folderList[index].cardList;
    if (!Utils.isNull(cardList)) {
      if (cardList.length > 0) {
        console.log('cardList', cardList)
        for (let i = 0; i < cardList.length; i++) {
          folderList[index].cardList[i].checked = folderList[index].checked;
        }
        for (let i = 0; i < folderList.length; i++) {
          if (folderList[index].checked) {
            if (i != index) {
              folderList[i].isShow = false;
            }
          }
          //   else{
          //     if (i != index && folderList[i].cardDisabled == true) {
          //       folderList[i].isShow = false;
          //     }
          // }
        }
      }
    } else {
      var e = {
        currentTarget: {
          dataset: {
            index: '',
            type: ''
          }
        }
      };
      e.currentTarget.dataset.index = index;
      e.currentTarget.dataset.type = type;
      that.setData({
        selectChick: true
      })
      that.onChangeimage(e)
    }

    that.setData({
      [str]: folderList
    })
    console.log("checked:", folderList[index].cardList)
  },
  //事件：隐藏操作向导
  hideguidance: function () {
    this.setData({
      showguidance: false
    })
  },

  //不再提示我的名片弹窗
  setNoGuidance: function () {
    wx.setStorage({
      key: 'myCardTips',
      data: false
    })
    this.setData({
      showguidance: false
    })
  },
  hidecollect: function () {
    this.setData({
      showcollect: false
    })
  },
  //不再提示收藏夹弹窗
  setNoGuidanceCollector: function () {
    wx.setStorage({
      key: 'collTips',
      data: false
    })
    this.setData({
      showcollect: false
    })
  },
  hideModalfolder: function () {
    this.setData({
      showModalfolder: false,
    })
  },
  //移动名片
  moveFolderCard: function () {
    var that = this;
    var folderList = that.data.folderList;
    var ids = "";
    that.setData({
      showMenuOperation: false
    })
    for (var i = 0; i < folderList.length; i++) {
      var cardList = folderList[i].cardList;
      if (!Utils.isNull(cardList)) {
        for (var y = 0; y < cardList.length; y++) {
          if (cardList[y].checked) {
            if (ids == "") {
              ids += cardList[y].contactId;
            } else {
              ids += "," + cardList[y].contactId;
            }
          }
        }
      }

    }
    if (ids == "") {
      wx.showToast({
        title: '请选择需要移动的名片！',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      that.setData({
        showModalfolder: true,
        ids: ids
      })
    }
  },

  //共享群

  radioChange: function (e) {
    var viewSettings = this.data.cardgroupViewSett;
    viewSettings[0].checked = !viewSettings[0].checked;
    viewSettings[1].checked = !viewSettings[1].checked;

    this.setData({
      cardgroupViewSett: viewSettings
    })
  },

  choseTxtColor: function (e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    this.setData({
      selectCardIndex: index
    })
  },
  //获取群名字
  onchangeGroupName: function (e) {
    var val = e.detail.value;
    this.setData({
      newGroupName: val
    })
  },
  //新建群
  newcardcrowd: function () {
    var that = this;
    if (that.data.userData.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先创建名片',
        confirmText: '创建',
        success(res) {
          if (res.confirm) {
            that.setData({
              showMenuOperation: false,
            })
            wx.navigateTo({
              url: packComPageUrl + "/newcard/newcard"
            });
          } else if (res.cancel) {
          }
        }
      })
    } else {
      that.setData({
        showMenuOperation: false,
        newcrowd: true
      })
    }

  },
  hidenewcardcrowd: function () {
    this.setData({
      newcrowd: false
    })
  },
  hideaddmembers: function () {
    this.setData({
      addGroupmembers: false
    })
  },
  //加入群
  hidejoincrowd: function () {
    this.setData({
      joincrowd: false,
      sweepState: false
    })
  },
  hideReplyCard: function () {
    this.setData({
      showReplyCard: false
    })
  },
  //群功能
  crowdOperation: function (e) {
    console.log('群设置/')
    var index = e.currentTarget.dataset.index;
    this.setData({
      cardgroupIndex: index,
      crowdOperation: true
    })
  },
  hidecrowdOperation: function () {
    this.setData({
      crowdOperation: false,
      cardgroupIndex: null
    })
  },
  //群二维码
  crowdqrcode: function () {
    var groupQRcode = this.data.DataURL + this.data.cardgroupList[this.data.cardgroupIndex].shareQunCode;
    this.setData({
      showMenuOperation: false,
      crowdqrcode: true,
      groupQRcode: groupQRcode
    })
    console.log('二维码：', groupQRcode)
  },
  //群二维码2
  crowdqrcode2: function (e) {
    var index = e.currentTarget.dataset.index;
    var groupQRcode = this.data.DataURL + this.data.cardgroupList[index].shareQunCode;
    this.setData({
      showMenuOperation: false,
      cardgroupIndex: index,
      crowdqrcode: true,
      groupQRcode: groupQRcode
    })
  },
  hidecrowdqrcode: function () {
    this.setData({
      crowdqrcode: false
    })
  },
  //群通知
  showCrowinform: function (e) {
    app.data.cardgroupData = this.data.cardgroupList[this.data.cardgroupIndex];
    var identity = 0;
    console.log('app.data.cardgroupData', app.data.cardgroupData)
    if (app.globalData.userInfo.userId == app.data.cardgroupData.shareQunUserId) {
      identity = 1; // 群主
    }
    this.setData({
      crowdOperation: false
    })
    wx.navigateTo({
      url: packComPageUrl + '/groupnotice/groupnotice?status=' + 2 + '&identity=' + identity
    })
  },
  //名片列表名片备注
  crowinform2: function (e) {
    var index = e.currentTarget.dataset.index;
    var cardindex = e.currentTarget.dataset.cardindex;
    var data = this.data;
    if (!Utils.isNull(index)) {
      if (app.globalData.userInfo.userId != this.data.cardgroupList[index].shareQunUserId) {
        return;
      }
      this.setData({
        cardgroupIndex: index,
        cardgroupCardIndex: cardindex
      })
    }
    var qunRemark = data.cardgroupList[index].cardList[cardindex].qunRemark;
    this.setData({
      cardbeizhu: true,
      cardgroupRemark: qunRemark

    })

  },
  hidecrowinform: function () {
    this.setData({
      crowinform: false,
      newGroupMesgStat: false,
      cardgroupMsg: []
    })
  },
  clearInput: function () {
    this.setData({
      cardgroupNotif: ''
    })
    console.log('111', this.data.cardgroupNotif)
  },
  //移出群
  crowdclear: function (e) {
    var folderList = this.data.cardgroupList;
    var ids = "";
    var names = "";
    this.setData({
      showMenuOperation: false
    })
    var index = this.data.cardgroupIndex;
    var cardList = folderList[index].cardList;
    console.log(cardList)
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
        if (cardList[y].contactId == folderList[index].shareQunContactUserId) {
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
  //转让群
  showTransferGroup: function () {
    var cardList = this.data.cardgroupList[this.data.cardgroupIndex].cardList;
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
    this.setData({
      showMenuOperation: false
    })
    var selectStat = false;
    // for (var i = 0; i < folderList.length; i++) {
    // var cardList = folderList[i].cardList;

    for (var y = 0; y < cardList.length; y++) {
      if (cardList[y].checked) {
        if (cardList[y].contactId == this.data.cardgroupList[this.data.cardgroupIndex].shareQunContactUserId) {
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
  hidecrowdTransfer: function () {
    this.setData({
      crowdTransfer: false
    })
  },
  //群设置
  crowdset: function () {
    var viewSettings = this.data.cardgroupViewSett;
    if (this.data.cardgroupList[this.data.cardgroupIndex].lookContactDetail) {
      viewSettings[1].checked = true;
      viewSettings[0].checked = false;
    } else {
      viewSettings[0].checked = true;
      viewSettings[1].checked = false;
    }
    this.setData({
      cardgroupViewSett: viewSettings,
      showMenuOperation: false,
      crowdOperation: false,
      crowdset: true
    })
  },
  hidecrowdset: function () {
    this.setData({
      crowdset: false
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
  //禁止查看名片详情
  crowdupdown: function () {
    this.setData({
      crowdupdown: true
    })
  },
  hidecrowdupdown: function () {
    this.setData({
      crowdupdown: false
    })
  },
  hidecardbeizhu: function () {
    this.setData({
      cardbeizhu: false
    })
  },
  crowdAddGroupmembers: function () {
    var that = this;
    var arr = [];
    var arr1 = that.data.cardData.slice(0);
    var arr2 = that.data.userData.slice(0);
    for (let i = 0; i < arr2.length; i++) {
      if (arr2[i].contactId == that.data.cardgroupList[that.data.cardgroupIndex].shareQunContactUserId) {
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
    that.setData({
      crowdOperation: false,
      uncollectedCards: arr,
      addGroupmembers: true
    })
  },
  //事件：图片查看事件
  viewImg: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    if (!Utils.isNull(index)) {
      src = that.data.DataURL + that.data.cardgroupList[index].shareQunCode.substring(11);
    }
    var urls = []
    if (Utils.myTrim(src) != "") {
      urls.push(src);
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    } else {
      wx.showToast({
        title: "无效图片",
        icon: 'none',
        duration: 1500
      })
    }
  },
  //分享事件
  onShareAppMessage: function (res) {
    let that = this;
    var scene = encodeURIComponent("id=" + that.data.cardgroupList[that.data.cardgroupIndex].id + "&uid=" + app.globalData.userInfo.userId);
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


  groupdata: function (e) {
    var index = e.currentTarget.dataset.index;
    try{
      app.data.cardgroupList = this.data.cardgroupList[index];
    }catch(e){}
    
    var identity = 1;
    console.log(this.data.cardgroupList)
    console.log(index)
    if (app.globalData.userInfo.userId == this.data.cardgroupList[index].shareQunUserId) {
      identity = 0; // 群主
    }
    wx.navigateTo({
      url: packComPageUrl + "/groupdata/groupdata?status=1&identity=" + identity
    });
    // app.data.cardGroupOnshowStat = true;
    this.setData({
      crowdOperation: false,
    })
  },
  //////////////////////////////////////////////////////////////////////////
  //--------获取会员服务权限数据--------------------------------------------
  //方法：获取会员服务权限数据信息
  //参数说明：
  //mainObj：当前页面
  //userId：当前用户ID
  //moduleId：模块ID——
  //          1: 剩余报价单个数,
  //          2: 剩余询价单个数,
  //          3: 剩余名片创建张数,
  //          4: 剩余产品创建个数,
  //          5: 剩余公司资料创建个数,
  //          6: 剩余发布供应信息个数,
  //          7: 剩余发布采购信息个数,
  //          8: 可查看的买家级别
  getMemberSrvRightData: function (userId, moduleId, tag) {
    var that = this;
    app.getMemberSrvRightData(that, userId, moduleId, tag);
  },
  //方法：检查会员权限后的操作
  exeSrvRightOperation: function (tag) {
    var that = this, isPassSrvRight = that.data.isPassSrvRight;
    switch (tag) {
      //报价（供应）信息
      case 1:
        if (!isPassSrvRight) {
          wx.showToast({
            title: "名片创建数量已达上限，不能再创建！",
            icon: 'none',
            duration: 2500
          })
          return;
        }
        wx.navigateTo({
          url: packComPageUrl + "/newcard/newcard"
        });
        break;
    }
  },
  hidereceptionpop: function () {
    this.setData({
      receptionpop: false
    })
  },
  // showreceptionpop: function (e) {
  //   var index = e.currentTarget.dataset.index;
  //   var cardindex = e.currentTarget.dataset.cardindex;
  //   if (Utils.isNull(this.data.folderList[index].cardList[cardindex].recLoggDataList)) {
  //     wx.showToast({
  //       title: '暂时没有人查看您发送的名片资料',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return;
  //   }
  //   this.setData({
  //     receptionpop: true,
  //     receiverData: this.data.folderList[index].cardList[cardindex].recLoggDataList
  //   })
  // },
  hideModalsave: function () {
    this.setData({
      showModalsave: false,
    })
  },
  showModalsave: function () {
    this.setData({
      crowdOperation: false,
      showModalsave: true,
      shareTitle: "邀请您加入“" + this.data.cardgroupList[this.data.cardgroupIndex].name + "”",
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
    var num = sendImgMsgArr.length;
    if (num > 0) {
      count = count - num;
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
    urlParam += "&uploadtype=1" + "&contactFolderId=" + that.data.cardgroupList[that.data.cardgroupIndex].id;
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
  showModaltip: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.index;
    var sendImgMsgArr = that.data.sendImgMsgArr;
    sendImgMsgArr.splice(val, 1);
    that.setData({
      sendImgMsgArr: sendImgMsgArr,
    })
  },
  onMessage: function () {
    console.log("刷新消息")
    var that = this;
    if (Utils.isNull(this.data.cardgroupIndex) || Utils.isNull(this.data.msgData)) {
      console.log("结束2")
      return;
    }
    console.log("继续刷新")
    var e = {
      currentTarget: {
        dataset: {
          index: this.data.cardgroupIndex,
          type: 3
        }
      }
    };
    that.showcheckmsg(e);
  },
  //查看群聊
  showcheckmsg: function (e) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    that.setData({
      cardgroupIndex: index,
    })
    var cardgroupList = this.data.cardgroupList[index];
    var pageIndex = that.data.pageIndex;
    var pageSize = that.data.pageSize;
    if (type == 3 || type == 1) {
      pageIndex = 1;
      pageSize = 20
    }
    var urlParam = "cls=main_groupChat&action=groupChatList&contactFolderId=" + cardgroupList.id + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&sendUserId=" + app.globalData.userInfo.userId + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&sign=" + sign;
    var msgData = that.data.msgData;
    if (type == 3) {
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
          console.log("结束")
        }
      }
    })

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
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var urlParam = "cls=main_groupChat&action=saveGroupChat&sendUserId=" + app.globalData.userInfo.userId + "&appId=" + app.data.appid + "&timestamp=" + timestamp;
    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
    urlParam = urlParam + "&xcxAppId=" + app.data.wxAppId + "&contactFolderId=" + that.data.cardgroupList[that.data.cardgroupIndex].id + "&sign=" + sign;
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
      showcheckmsg: false,
      msgQueryStat: false,
      msgData: [],
      pageIndex: 1,
      pageSize: 20
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
    console.log('pageIndex=', this.data.pageIndex + 1)
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    var e = {
      currentTarget: {
        dataset: {
          index: this.data.cardgroupIndex,
          type: 2
        }
      }
    };
    this.showcheckmsg(e);
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

  choseTxtColor1: function (e) {
    var id = e.currentTarget.dataset.id; //获取自定义的ID值
    this.setData({
      cardgroupMsgIndex: id
    })
  },
  newGroupMesg: function () {
    this.setData({
      newGroupMesgStat: true,
      cardgroupMsgIndex: null
    })
  },
  longTap: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log("长按")
    this.setData({
      showWithdraw: true,
      cardgroupChatIndex: index
    })
  },
  //下拉触底
  bindDownLoad: function () {
    console.log('上拉触底');
    this.setData({
      folderIndex: this.data.folderIndex + 1
    })
    var folderIndex = this.data.folderIndex;
    console.log("加载第" + folderIndex + "页")
    this.getFolderCard(this.data.folderListIndex);
  }
})
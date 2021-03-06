// components/selectCyCyPicture/selectCyCyPicture.js
var app = getApp();
var MD5JS = require('../../utils/md5.js');
var Utils = require('../../utils/util.js');
var URL = app.getUrlAndKey.url, KEY = app.getUrlAndKey.key, DataURL = app.getUrlAndKey.dataUrl;
var appUserInfo = app.globalData.userInfo,isTestPrice =false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    DataURL:DataURL,
    SDataType:0,          //0系统图库，1茶友图库，2我的图库，3茶友系统图库
    SDActTag:0,           //0无，1新增

    imgTypeList:[],
    selTypeIndex:0,
    selCurTypeId:-1,

    printImgList:[],
    selPImgIndex:-1,        //当前选中图片
    isEditMyImg:false,      //是否编辑我的图库
    isShowEditPop:false,    //是否显示编辑弹窗
    isShowDelPop:false,     //是否显示删除弹窗

    //编辑图片信息对象
    editImgObj:{ id: 0, name : "",path:"",serial:"",price:0.00,print_num:0,userId:0,open:0,image_type_id:-1,image_type_name:"",},      
    customizeImgPrice:0.00, //自定义图案价格(元)
    name_max:12,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //方法：初始化操作
    initLoadEvent:function(SDataType,SDActTag){
      let that=this;
      appUserInfo = app.globalData.userInfo;

      //如果为新增我的图片则设置空的编辑图片信息对象
      if(SDActTag==1){
        that.setEditImgObjInfo(null,0);
      }
      that.setData({
        ["SDataType"]: SDataType,
        ["SDActTag"]: SDActTag,

        ["selCurTypeId"]:0,
        ["selTypeIndex"]:1,
      })
      //获取图片分类
      app.getPrintImgTypeList(that);
      that.loadPImgDataList();
    },
    ///////////////////////////////////////////////////////////////
    //方法：设置编辑图片对象
    setEditImgObjInfo:function(item,tag){
      let that=this,editImgObj=null;
      switch(tag){
        case 0:
          let timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          editImgObj={ id: 0, name : "",path:"",serial:timestamp,price:that.data.customizeImgPrice,print_num:0,userId:appUserInfo.userId,open:0,image_type_id:0,image_type_name:""}
          break;
        case 1:
          editImgObj=item;
          let imgTypeList=that.data.imgTypeList;
          if(Utils.isNotNull(imgTypeList) && imgTypeList.length>0){
            for(let i=0;i<imgTypeList.length;i++){
              if(imgTypeList[i].id>0 && item.image_type_id==imgTypeList[i].id){
                item.image_type_name=imgTypeList[i].name;
              }
            }
          }
          break;
      }
      that.setData({
        ["editImgObj"]: editImgObj,
        ["isShowEditPop"]: true,
      })
    },
    //事件：隐藏弹窗半透明浮动层
    hideAllPop(){
      this.setData({
        isShowEditPop: false,
        isShowDelPop:false,
        isPreviewImg:false,
      })
    },
    //方法：获取打印图片分类结果处理函数
    dowithGetPrintImgTypeList: function (dataList, tag, errorInfo) {
      let that = this;
      switch (tag) {
        case 1:
          console.log("获取打印图片类型结果：");
          console.log(dataList);
          let imgTypeList = [],dataItem = null, listItem = null;
          listItem={id:-1,name:"我使用过的图案"}
          imgTypeList.push(listItem);
          listItem={id:0,name:"全部"}
          imgTypeList.push(listItem);
          if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            let data = dataList.dataList;
            let id = 0, name = "";
            for (var i = 0; i < data.length; i++) {
              id = 0; name = "";
              dataItem = null; listItem = null; dataItem = data[i];
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              listItem = {
                id: id, name : name,
              }
              imgTypeList.push(listItem);             
            }
          }
          that.setData({
            ["imgTypeList"]: imgTypeList,
          })
          break;
        default:
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取图片类型失败！";
          wx.showToast({
            title: errorInfo,
            icon: 'none',
            duration: 2000
          })
          break;
      }
    },
    //方法：获取打印图片结果处理函数
    dowithGetPrintImgList: function (dataList, tag, errorInfo) {
      let that = this;
      switch (tag) {
        case 1:
          console.log("获取打印图片结果：");
          console.log(dataList);
          let printImgList = [],SDataType=that.data.SDataType,selPImgIndex=-1,selPImgItem=null;
          if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            let data = dataList.dataList, dataItem = null, listItem = null;
            let id = 0, name = "",path="",serial = "",price=0.00,print_num=0,userId=0,open=0,image_type_id=0;
            for (var i = 0; i < data.length; i++) {
              id = 0; name = "";path="";serial = "";price=0.00;print_num=0;userId=0;open=0;image_type_id=0;
              dataItem = null; listItem = null; dataItem = data[i];
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.path)){
                path = dataItem.path;
                path = app.getSysImgUrl(path);
              }
              if (Utils.isDBNotNull(dataItem.serial)){
                serial = dataItem.serial;
              }
              if (Utils.isDBNotNull(dataItem.price)){
                try{
                  price = parseFloat(dataItem.price);
                  price = isNaN(price) ? 0.00 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt));
                }catch(e){}
              }   
              if (Utils.isDBNotNull(dataItem.print_num))
              {
                try{
                  print_num = parseInt(dataItem.print_num);
                  print_num = isNaN(print_num) ? 0 : print_num;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.userId))
              {
                try{
                  userId = parseInt(dataItem.userId);
                  userId = isNaN(userId) ? 0 : userId;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.open))
              {
                try{
                  open = parseInt(dataItem.open);
                  open = isNaN(open) ? 0 : open;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.image_type_id))
              {
                try{
                  image_type_id = parseInt(dataItem.image_type_id);
                  image_type_id = isNaN(image_type_id) ? 0 : image_type_id;
                }catch(e){}
              }
              
              listItem = {
                id: id, name : name,path:path,serial,price:price,print_num:print_num,userId:userId,open:open,image_type_id:image_type_id,image_type_name:"",
              }
              
              switch(SDataType){
                //系统图库
                case 0:
                  if(userId==0){
                    printImgList.push(listItem);
                  }
                  break;
                //茶友图库
                case 1:
                  if(userId!=0 && userId!=appUserInfo.userId && open==0){
                    printImgList.push(listItem);
                  }
                  break;
                //我的图库
                case 2:
                  if(userId==appUserInfo.userId){
                    printImgList.push(listItem);
                  }
                  break;
                //茶友图库
                case 3:
                  if(userId==0 || (userId>0 && userId!=appUserInfo.userId && open==0)){
                    printImgList.push(listItem);
                  }
                  break;
              }      
            }
            if(that.data.curOperateID>0){
              for(let j=0;j<printImgList.length;j++){
                if(that.data.curOperateID==printImgList[j].id){
                  selPImgIndex=i;
                  selPImgItem=listItem;
                }
              }
            }          
          }
          that.setData({
            ["printImgList"]: printImgList,
            ["selPImgIndex"]:selPImgIndex,
            ["selPImgItem"]:selPImgItem,
          })
          if(printImgList.length<=0){
            wx.showToast({
              title: "暂无图片！",
              icon: 'none',
              duration: 2000
            })
          }
          break;
        default:
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取拼团列表失败！";
          wx.showToast({
            title: errorInfo,
            icon: 'none',
            duration: 2000
          })
          break;
      }
    },
    //方法：获取我使用过的打印图片结果处理函数
    dowithGetMyUsedPrintImgInfo: function (dataList, tag, errorInfo) {
      let that = this;
      switch (tag) {
        case 1:
          console.log("获取打印图片结果：");
          console.log(dataList);
          let printImgList = [],SDataType=that.data.SDataType,selPImgIndex=-1,selPImgItem=null;
          if (Utils.isNotNull(dataList) && Utils.isNotNull(dataList.dataList) && dataList.dataList.length > 0) {
            let data = dataList.dataList, dataItem = null, listItem = null;
            let id = 0, name = "",path="",serial = "",price=0.00,print_num=0,userId=0,open=0,image_type_id=0;
            for (var i = 0; i < data.length; i++) {
              id = 0; name = "";path="";serial = "";price=0.00;print_num=0;userId=0;open=0;image_type_id=0;
              dataItem = null; listItem = null; dataItem = data[i];
              id = dataItem.id;
              if (Utils.isDBNotNull(dataItem.name)){
                name = dataItem.name;
              }
              if (Utils.isDBNotNull(dataItem.path)){
                path = dataItem.path;
                path = app.getSysImgUrl(path);
              }
              if (Utils.isDBNotNull(dataItem.serial)){
                serial = dataItem.serial;
              }
              if (Utils.isDBNotNull(dataItem.price)){
                try{
                  price = parseFloat(dataItem.price);
                  price = isNaN(price) ? 0.00 : price;
                  price = parseFloat(price.toFixed(app.data.limitQPDecCnt));
                }catch(e){}
              }   
              if (Utils.isDBNotNull(dataItem.print_num))
              {
                try{
                  print_num = parseInt(dataItem.print_num);
                  print_num = isNaN(print_num) ? 0 : print_num;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.userId))
              {
                try{
                  userId = parseInt(dataItem.userId);
                  userId = isNaN(userId) ? 0 : userId;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.open))
              {
                try{
                  open = parseInt(dataItem.open);
                  open = isNaN(open) ? 0 : open;
                }catch(e){}
              }
              if (Utils.isDBNotNull(dataItem.image_type_id))
              {
                try{
                  image_type_id = parseInt(dataItem.image_type_id);
                  image_type_id = isNaN(image_type_id) ? 0 : image_type_id;
                }catch(e){}
              }
              
              listItem = {
                id: id, name : name,path:path,serial,price:price,print_num:print_num,userId:userId,open:open,image_type_id:image_type_id,image_type_name:"",
              }
              
              printImgList.push(listItem);
            }
          }
          that.setData({
            ["printImgList"]: printImgList,
            ["selPImgIndex"]:selPImgIndex,
            ["selPImgItem"]:selPImgItem,
          })
          if(printImgList.length<=0){
            wx.showToast({
              title: "暂无图片！",
              icon: 'none',
              duration: 2000
            })
          }
          break;
        default:
          errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取打印列表失败！";
          wx.showToast({
            title: errorInfo,
            icon: 'none',
            duration: 2000
          })
          break;
      }
    },
    //方法：操作我的图库记录
    //tag：-1删除，0新增或编辑
    operateMyPImgDataInfo: function (tag,editImgObj) {
      let that = this,otherParams=tag==-1?"&operation=del":(editImgObj.id>0?"&operation=mod":"&operation=add"),alertContent=tag==-1?"删除操作":"保存操作";
      that.data.curOperateID=0;
      let timestamp = Date.parse(new Date()), urlParam = "", sign = "";
      timestamp = timestamp / 1000;
      if(tag!=-1){
        otherParams+="&image_type_id="+editImgObj.image_type_id+"&name="+encodeURIComponent(editImgObj.name)+"&path="+encodeURIComponent(editImgObj.path)+"&price="+editImgObj.price+"&serial="+editImgObj.serial+"&open="+editImgObj.open+"&type=1";
        otherParams+=editImgObj.id>0?"&id="+editImgObj.id:"";
      }else{
        otherParams+="&id="+editImgObj.id;
      }
      
      urlParam = "cls=main_gimage&action=saveUserGimage&userId=" + appUserInfo.userId + "&companyId=" + app.data.companyId+ "&appId=" + app.data.appid + "&timestamp=" + timestamp;
      
      sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      console.log('sign:' + urlParam + "&key=" + KEY)
      urlParam = urlParam + otherParams + "&sign=" + sign;
      console.log('保存自定义打印图片：'+URL + urlParam)
      console.log('~~~~~~~~~~~~~~~~~~~')
      wx.request({
        url: URL + urlParam,
        success: function (res) {
          console.log("保存自定义打印图片结果：")
          console.log(res.data)
          that.data.isDowithing=false;
          if (res.data.rspCode == 0) {
            that.hideAllPop();
            if(tag!=-1 && Utils.isNotNull(res.data.data)){
              let id = 0;
              if (Utils.isDBNotNull(res.data.data.id))
              {
                try{
                  id = parseInt(res.data.data.id);
                  id = isNaN(id) ? 0 : id;
                }catch(e){}
              }
              that.setData({
                ["curOperateID"]:id,
              })
            }
            wx.showToast({
              title: alertContent+"成功！",
              icon: 'none',
              duration: 2000
            })
            setTimeout(function(){
              that.loadPImgDataList();
            }, 2000);
          } else {
            wx.showToast({
              title: res.data.rspMsg,
              icon: 'none',
              duration: 2000
            })
            app.setErrorMsg2(that, "保存图片信息：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
          }
        },
        fail: function (err) {
          that.data.isDowithing = false;
          wx.showToast({
            title: alertContent+"失败！",
            icon: 'none',
            duration: 2000
          })
          app.setErrorMsg2(that, "保存图片信息接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
        }
      })
    },

    //事件：选择类型
    selectPImgType:function(e){
      let that=this,item=null,index=0;
      try {
        item = e.currentTarget.dataset.item;
      } catch (e) {}
      try {
        index = parseInt(e.currentTarget.dataset.index);
        index = isNaN(index) ? 0 : index;
      } catch (e) {}
      that.setData({
        ["selTypeIndex"]: index,
      })
      if(Utils.isNotNull(item)){
        that.data.selCurTypeId=item.id;
        that.loadPImgDataList();
      }
    },
    //方法：加载图库数据
    loadPImgDataList:function(){
      let that=this,selCurTypeId=that.data.selCurTypeId,otherParam="&xcxAppId=" + app.data.wxAppId;
      if(selCurTypeId<0){
        app.getMyUsedPrintImgInfo(that,otherParam);
      }else{
        otherParam+="&companyId=" + app.data.companyId;
        otherParam+=selCurTypeId>0?"&image_type_id="+selCurTypeId:"";
        app.getPrintImgList(that,otherParam);
      }
    },
    //事件：设置我的图库列表的“可编辑”状态
    setEditMyImgStatus:function(e){
      let that=this,isEditMyImg=that.data.isEditMyImg;
      that.setData({
        ["isEditMyImg"]: !isEditMyImg,
      })
    },
    //事件：新增我的图库新案例
    addMyImgObj:function(e){
      let that=this;
      that.data.curOperateID=0;
      that.setEditImgObjInfo(null,0);
    },
    //事件:选择我的图库项，根据tag标志判断是删除或编辑操作
    selectEditMyImgObj(e) {
      let that=this,item=null,tag=0;
      
      try {
        item = e.currentTarget.dataset.item;
      } catch (e) {}
      try {
        tag = parseInt(e.currentTarget.dataset.tag);
        tag = isNaN(tag) ? 0 : tag;
      } catch (e) {}

      if(Utils.isNotNull(item)){
        switch(tag){
          //编辑
          case 0:
            that.setEditImgObjInfo(item,1);
            break;
          //删除 
          case -1:
            that.setData({
              ["editImgObj"]: item,
              ["isShowDelPop"]:true,
            })
            break;
        }
        
      }else{
        wx.showToast({
          title: "该图片信息不存在！",
          icon: 'none',
          duration: 2000
        })
      }
    },
    //事件：隐藏编辑我的图片弹窗
    hideEditMyImgPop:function(e){
      let that=this;
      that.setData({
        ["isShowEditPop"]: false,
      })
    },
    //事件：显示【编辑弹窗】图片类型
    showEditPopSelImgTypeList(e){
      let that=this;
      that.setData({
        ["isShowEditPopSelImgTypeList"]:true,
      })
    },
    //事件：选择【编辑弹窗】图片类型
    selectEditImgType:function(e){
      let that=this,id=0,imgTypeList=that.data.imgTypeList,editImgObj=that.data.editImgObj;
      try {
        id = parseInt(e.currentTarget.dataset.id);
        id = isNaN(id) ? 0 : id;
      } catch (e) {}
      if(id>0 && Utils.isNotNull(editImgObj) && Utils.isNotNull(imgTypeList) && imgTypeList.length>0){
        for(let i=0;i<imgTypeList.length;i++){
          if(id==imgTypeList[i].id){
            editImgObj.image_type_id=imgTypeList[i].id;
            editImgObj.image_type_name=imgTypeList[i].name;
          }
        }
        that.setData({
          ["editImgObj.image_type_id"]: editImgObj.image_type_id,
          ["editImgObj.image_type_name"]: editImgObj.image_type_name,
          ["isShowEditPopSelImgTypeList"]:false,
        })
      }
    },
    //事件：页面控件值变更事件
    changeValueMainData: function (e) {
      let that = this;
      let cid = e.currentTarget.dataset.cid;
      // 获取输入框的内容
      let value = "", setKey = "",len=0;
      try{
        value = e.detail.value;
        value = Utils.isNotNull(value) && Utils.myTrim(value) != "" ? Utils.filterEmoj(value) : value;
        // 获取输入框内容的长度
        len = Utils.getStrlengthB(value);
      }catch(e){}
      
      switch (cid) {
        case "name":
          if (Utils.checkStrNoPunc(value)) {
            wx.showToast({
              title: "非法字符不能输入！",
              icon: 'none',
            })
            return;
          }
          //最多字数限制
          if (len > that.data.name_max) {
            wx.showToast({
              title: "内容超长（字数限制" + that.data.name_max + "）！",
              icon: 'none',
              duration: 1500
            })
            return;
          }
          setKey = "editImgObj.name";
          that.setData({
            [setKey]: value
          })
          break;
        case "open":
          let editImgObj=that.data.editImgObj;
          setKey = "editImgObj.open";
          that.setData({
            [setKey]: editImgObj.open==0?1:0
          })
          break;
      }
    },
    //事件：选择打印图片
    selectCustomizeImg(e) {
      let that = this,index=0,isprv=0;
      try {
        index = parseInt(e.currentTarget.dataset.index);
        index = isNaN(index) ? 0 : index;
      } catch (e) {}
      try {
        isprv = parseInt(e.currentTarget.dataset.isprv);
        isprv = isNaN(isprv) ? 0 : isprv;
      } catch (e) {}
      //如果选择同一个，且不为预览则为取消选择
      if (index == that.data.selPImgIndex && isprv==0) {
        that.setData({
          ["selPImgIndex"]: -1,
          ["selPImgItem"]:null,
        })
      }else{
        let printImgList=that.data.printImgList,selPImgItem=null;
        if(Utils.isNotNull(printImgList) && printImgList.length>0){
          try{
            selPImgItem=printImgList[index];
          }catch(e){}
        }
        
        that.setData({
          ["selPImgIndex"]: index,
          ["selPImgItem"]:selPImgItem,
          ["isPreviewImg"]:isprv==1?true:false,
        })
        //调起页面选中后处理事件
        that.dowithAfterSelect();
      }
    },
    //事件：图片上传事件
    uploadImg: function (e) {
      let that = this,sType = 0;
      //sType:0顶部图片，1介绍图片
      try {
        sType = parseInt(e.currentTarget.dataset.type);
        sType=isNaN(sType)?0:sType;
      } catch (err) {}
      
      app.uploadCompressImg(that, sType, 0, 1, "imgCompressCanvas")
    },
    //方法：上传图片后根据模板类型进行处理
    dowithImg: function (imgUrl, sType) {
      let that = this,setDataKey = "";
      //sType:0顶部图片，1介绍图片
      switch (sType) {
        case 0:
          setDataKey = "editImgObj.path"
          break;
      }
      that.setData({
        [setDataKey]: imgUrl,
      })
    },
    //事件：提交操作图片信息
    submitOperatePImgObj:function(e){
      let that=this,tag=0,editImgObj=that.data.editImgObj,imgTypeList=that.data.imgTypeList;
      try {
        tag = parseInt(e.currentTarget.dataset.tag);
        tag = isNaN(tag) ? 0 : tag;
      } catch (e) {}
      if(that.data.isDowithing){
        wx.showToast({
          title: "操作进行中......",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if(!Utils.isNotNull(editImgObj)){
        wx.showToast({
          title: "该图片信息不存在！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if(tag==0){
        if(Utils.myTrim(editImgObj.path)==""){
          wx.showToast({
            title: "请上传图片！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if(editImgObj.image_type_id<=0 && Utils.isNotNull(imgTypeList) && imgTypeList.length>2){
          wx.showToast({
            title: "请选择图片分类！",
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      
      that.data.isDowithing= true;
      that.operateMyPImgDataInfo(tag,editImgObj);
    },
    //方法：选择图片后处理方法
    dowithAfterSelect:function(){
      let that=this;
      
      that.triggerEvent('onDowithAfterSelect', { selPImgItem:that.data.selPImgItem});
    }
  },
  pageLifetimes: {
    show: function() {
      let that=this;
      if (!that.data.isLoad)
        that.data.isLoad = true;
      else {
        appUserInfo = app.globalData.userInfo;
        if (appUserInfo == null)
          return;
        else {
          that.loadPImgDataList();
          console.log("onShow ...")
        }
      }
      // 页面被展示
      console.log("components selectCyCyPicture is onShow ......"+appUserInfo.userId)
    },
  }
})

  import MD5JS from './md5.js';
  import axios from 'axios';
  import Utils from './util.js'
  import {deleteProduct} from '@/api/product.js';
  import store from '../store'
  import {Message} from 'element-ui';
  
  
  // var agentCompanyId = "746"
  var userId = store.getters.sidebar.userId;
  var CompanyId = store.getters.sidebar.CompanyId;
  var appid = 1;
  var srvDevTest = store.getters.sidebar.smurl; //域名
  var smallInterfacePart =store.getters.sidebar.smallInterfacePart;
  var interfacePart =store.getters.sidebar.interfacePart;
  var KEY = store.getters.sidebar.KEY;
  var PurappId = store.getters.sidebar.appId;
    /**
     * get请求
     * mainObj=this
     * URL 
     * signParam=签名的字段参数(appId、timestamp在最后可以不用写)
     * otherParam=其他不参与签名的字段
     * tag=多个post请求成功回调方法的区分
     * msg=get请求的日志信息
     * isHideLoading=是否隐藏加载框
     * isHideLoading=是否隐藏Toast
     * isAll 是否需要返回完整数据
     */
  export function doGetData(mainObj, URL, signParam, otherParam, tag, msg, isHideToast, isHideLoading, isAll) {
    var that = mainObj;
	      // keyOnLine: "amj_b5e9sdfd6ws325", 在线接口key
	      // keyDevTest: "amj_b5e9sdfd6ws325", 测试接口key
		  if (!isHideLoading) {
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var sign = signParam;
    if (sign.indexOf("appId") >= 0) {
      console.log('包含appId此字符串')
    } else {
      sign = sign + "&appId=" + appid + "&timestamp=" + timestamp
    }
    var signMD5 = MD5JS.hexMD5(sign + "&key=" + KEY);
    console.log(msg + 'sign:', sign)
    var urlParam = sign + "&sign=" + signMD5 + otherParam;

    console.log(msg, URL + urlParam)
	axios.get(URL + urlParam).then(res=>{
		console.log(res);
        if (res.data.rspCode == 0) {
          try {
            if (isAll) {
              that.getRuslt(res.data, 1, res.data.rspMsg, tag);
            } else {
              that.getRuslt(res.data.data, 1, res.data.rspMsg, tag);
            }
          } catch (e) {
            console.log(msg, e)
          }
        }else if(tag==4){
			that.getRuslt("", 1, "", tag);
		}else{
			console.log("连接失败！")
			}
	})
  }
  //获取二维码信息
  export function geterWeima(mainObj,orderId,amount){
	  var that = mainObj;
	  var timestamp = Date.parse(new Date());
	  timestamp = timestamp / 1000;
	  var sign = MD5JS.hexMD5("cls=main_WXQRCode&action=getWXQRCode&page=packageYK/pages/Myprize/Myprize&appId=1&timestamp="+timestamp+"&key=amj_b5e9sdfd6ws325");
	  let URL =srvDevTest+interfacePart;
	  let urlParam = 'cls=main_WXQRCode&action=getWXQRCode&page=packageYK/pages/Myprize/Myprize&userId='+userId+'&appId=1&xcxAppId=wxb17a155e297fe513&page=packageYK/pages/Myprize/Myprize&pagedata=oid='+ orderId +'&appId=1&timestamp='+timestamp+'&key=amj_b5e9sdfd6ws325&sign='+sign;
	  console.log("二维码数据接口:"+URL + urlParam)
	  axios.get(URL + urlParam).then(res=>{
		  console.log(res)
		  if (res.data.rspCode == 0) {
			  console.log(orderId,amount)
			  that.peomose(res.data.data.imageAddress,orderId,amount)
		  }
	  })
  }
  
  //根据顾客订单号生成二维码信息
  export function geterUserWeima(mainObj,orderId){
  	  var that = mainObj;
  	  var timestamp = Date.parse(new Date());
  	  timestamp = timestamp / 1000;
  	  var sign = MD5JS.hexMD5("cls=main_WXQRCode&action=getWXQRCode&page=packageVP/pages/orderPrintImg/orderPrintImg&appId=1&timestamp="+timestamp+"&key=amj_b5e9sdfd6ws325");
  	  let URL =srvDevTest+interfacePart;
	  //online 线上版本
	  var xcxAppId = 'wxb17a155e297fe513';
	  // devtest 开发测试版本 
  	  // var xcxAppId = 'wx879d6a40f4746d53';
	  var urlParam = 'cls=main_WXQRCode&action=getWXQRCode&page=packageVP/pages/orderPrintImg/orderPrintImg&userId='+userId+'&appId=1&xcxAppId='+xcxAppId+'&pagedata=oid='+ orderId +'&appId=1&timestamp='+timestamp+'&sign='+sign;
  	  console.log("顾客订单号生成二维码信息接口:"+URL + urlParam)
  	  axios.get(URL + urlParam).then(res=>{
  		  console.log(res)
  		  if (res.data.rspCode == 0) {
			  var url = that.$store.getters.sidebar.smurl + "/baojiayou" + res.data.data.imageAddress
			  that.motepryu(url)
			  Message({
			  	message: "生成图片成功",
			  	type:"success",
			  	duration:2000
			  })
  		  }
  	  }).catch(()=>{
		  Message({
		  	message: "网络错误！",
		  	type:"error",
		  	duration:2000
		  })
	  })
  }
  
  //获取交班信息
  export function signMessage(mainObj,userName){
	  var that = mainObj;
  	  var timestamp = Date.parse(new Date());
  	  timestamp = timestamp / 1000;
  	  var sign = MD5JS.hexMD5("cls=main_userloginhistory&action=saveUserloginhistory&userId=" + userId+ "&appId=" + PurappId + "&timestamp=" + timestamp+ "&key="+KEY );
  	  let URL =srvDevTest+interfacePart;
  	  let urlParam = 'cls=main_userloginhistory&action=saveUserloginhistory&userId='+userId+'&type=1&appId='+ PurappId +'&timestamp='+ timestamp +'&companyId='+ CompanyId +'&userName='+userName+'&sign='+sign;
  	  console.log("交班信息:"+URL + urlParam)
  	  axios.get(URL + urlParam).then(res=>{
  		  console.log(res)
  		  if (res.data.rspCode == 0) {
			  Message({
			  	message:'交班成功',
			  	type:"success",
			  	duration:2000
			  })
			  that.poryow = false;
			  that.xialatype = true
			  that.plrut = '';
  		  }else{
			  Message({
			  	message:res.data.rspMsg,
			  	type:"success",
			  	duration:2000
			  })
		  }
  	  })
  }
    //方法：获取购物车信息
    export function getShoppingCartData(mainObj, otherParam) {
      var that = mainObj,
        app = this;
		var interfacePart = that.$store.getters.sidebar.interfacePart,
		smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
      var URL = srvDevTest + smallInterfacePart;
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (Utils.isNull(otherParam)) {
        otherParam = ""
      }
      var urlParam = "",
        sign = "";
      urlParam = "cls=product_shopCar&action=userShopCarNum&userId=" + userId + "&appId=" + appid + "&timestamp=" + timestamp;
      sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      console.log('sign:' + urlParam + "&key=" + KEY)
      urlParam = urlParam + "&sign=" + sign + otherParam;
      console.log(URL + urlParam)
	  axios.get(URL + urlParam).then(res=>{
	  	console.log(res);
        if (res.data.rspCode == 0) {
          var data = res.data.data,
            shoppingCartCnt = 0;
          if (data.count != null && data.count != undefined && Utils.myTrim(data.count + "") != "") {
            try {
              shoppingCartCnt = parseInt(data.count);
              shoppingCartCnt = isNaN(shoppingCartCnt) ? 0 : shoppingCartCnt;
            } catch (err) {}
          }

          that.shoppingCartCnt=shoppingCartCnt;
            that.shoppingCartAmount=data.amount;
        }
	  })
	   }
	   
	   
	   
	   
    export function getProductTypeList(mainObj, otherParamsCon) {
      let that = mainObj,noDataAlert = "",URL = srvDevTest+smallInterfacePart;
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      let urlParam = "",
        sign = "",
        orderByParam = "&sField=sort&sOrder=asc";
      noDataAlert = "暂无商品分类信息！";
      urlParam = "cls=product_goodtype&action=QueryTypes&appId=" + appid + "&timestamp=" + timestamp;
      sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      console.log('sign:' + urlParam + "&key=" + KEY)
      urlParam = urlParam + otherParamsCon + orderByParam + "&sign=" + sign;
      console.log(URL + urlParam)
	  axios.get(URL + urlParam).then(res=>{
	  	console.log(res);
	    if (res.data.rspCode == 0 && res.data.data != null && res.data.data != undefined) {
	              try {
	                that.withGetProductTypeList(res.data.data, 1, "");
	              } catch (e) {}
	     }else {
          try {
            that.withGetProductTypeList(null, 0, res.data.rspMsg);
          } catch (e) {}
		  }
	  })
	   }
	   
	   
	   export function dowithGetProductTypeList(mainObj, dataList, tag, errInfo) {
	     let that = mainObj;
	     switch (tag) {
	       case 1:
	         if (dataList != null && dataList != undefined) {
	           console.log('获取商品分类信息返回结果：')
	           console.log(dataList)
	           let data = dataList,
	             dataItem = null,
	             listItem = null,
	             selProcuctTypeList = [];
	           let id = 0,
	             name = "",
	             selProductTypeIDParam = that.selProductTypeIDParam,
	             selProductTypeNameParam = that.selProductTypeNameParam;
	           listItem = {
	             id: 0,
	             name: "全部",
	           }
	           selProcuctTypeList.push(listItem);
	           for (let i = 0; i < data.length; i++) {
	             dataItem = null;
	             listItem = null;
	             dataItem = data[i];
	             id = 0;
	             name = "";
	             if (dataItem.productTypeName != null && dataItem.productTypeName != undefined && Utils.myTrim(dataItem.productTypeName + "") != "")
	               name = dataItem.productTypeName;
	             if (selProductTypeIDParam > 0 && selProductTypeIDParam == dataItem.id) selProductTypeNameParam = name;
	             listItem = {
	               id: dataItem.id,
	               name: name,
	             }
	             selProcuctTypeList.push(listItem);
	           }
	           if (Utils.isNull(selProductTypeIDParam)) {
	             selProductTypeIDParam = 0
	           }
	           if (Utils.isNull(selProductTypeNameParam)) {
	             selProductTypeNameParam = "默认"
	           }
	           if (selProcuctTypeList.length > 0) {
	             // 直接将新一页的数据添加到数组里
	               that.selProcuctTypeList=selProcuctTypeList;
	               that.selProductTypeIDParam=selProductTypeIDParam;
	               that.selProductTypeNameParam=selProductTypeNameParam;
	             
	           } else {
	             // wx.showToast({
	             //   title: noDataAlert,
	             //   icon: 'none',
	             //   duration: 2000
	             // })
	           }
	         }
	         break;
	       default:
	         errorInfo = Utils.myTrim(errorInfo) != "" ? errorInfo : "获取商品类型操作失败！";
	         break;
	     }
	   }
	   
	   
	   
	   //方法：新增订单
	     export function addSMOrderInfo(mainObj, itemList) {
	       var that = mainObj;
		   var URL = srvDevTest + smallInterfacePart;
	       // 发送 res.code 到后台换取 openId, sessionKey, unionId
	       var timestamp = Date.parse(new Date());
	       timestamp = timestamp / 1000;
	       var urlParam = "",
	         sign = "";
	       urlParam = "cls=product_order&action=SaveOrders&appId=" + appid + "&timestamp=" + timestamp;
	       sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
	       console.log('sign:' + urlParam + "&key=" + KEY)
	       urlParam = urlParam + "&sign=" + sign+ "&deliveryflag=1";
	       console.log(URL + urlParam)
	       console.log(JSON.stringify(itemList));
		   var data = JSON.stringify(itemList);
		   console.log(data)
	       console.log('~~~~~~~~~~~~~~~~~~~')
		   var params = new URLSearchParams();
		   params.append('data',data)
		   axios.post(URL+urlParam,params).then(res=>{
			       console.log(res.data)
				   if (res.data.rspCode == 0) {
					 console.log("新增订单成功！")
					 Message({
					 	message:'新增订单成功',
					 	type:"success",
					 	duration:3000
					 })
					 // that.openFullScreen2()
					 var ids = res.data.data.orderId,
					   payNo = res.data.data.payNo,
					   idsList = [];
					 console.log("订单ID：" + ids)
					 if (Utils.myTrim(ids) != "") {
					   idsList = ids.split(",");
					   if (idsList.length <= 1)
						 //单订单支付
						 try {
						   console.log(idsList[0])
						   that.gotoOrderDetailPage(idsList[0], 0, payNo);
						 } catch (err) {}
					   else if (idsList.length > 1)
						 //多订单支付
						 try {
						   console.log(idsList)
						   that.gotoOrderDetailPage(res.data.data.payNo, 1);
						 } catch (err) {}
					   else
						 try {
						   that.gotoMyOrder();
						 } catch (err) {}
					 }
				   }
		   })
	     }
		 
		 //方法：订单退款
		   export function backReimburse(mainObj, itemList,orderId) {
		     var that = mainObj;
		 		   var URL = srvDevTest + smallInterfacePart;
		     // 发送 res.code 到后台换取 openId, sessionKey, unionId
		     var timestamp = Date.parse(new Date());
		     timestamp = timestamp / 1000;
		     var urlParam = "",
		       sign = "";
		     urlParam = "cls=wxRefund_wxRefund&action=wxRefund&orderId="+ orderId + "&appId="+ PurappId + "&timestamp=" + timestamp;
		     sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
		     console.log('sign:' + urlParam + "&key=" + KEY)
		     urlParam = urlParam + "&sign=" + sign+ "&type=1";
			 var data = JSON.stringify(itemList);
			 console.log(data)
			 console.log('订单退款:' +URL+urlParam )
		     console.log('~~~~~~~~~~~~~~~~~~~')
		 		   var params = new URLSearchParams();
		 		   params.append('data',data)
		 		   axios.post(URL+urlParam,params).then(res=>{
		 			       console.log(res.data)
		 				   if (res.data.rspCode == 0) {
		 					 console.log("退款成功！")
							 if(res.data.rspMsg == 'SUCCESS-退款成功!'){
								that.posyu2()
								Message({
									message:'退款成功!',
									type:"success",
									duration:3000
								})
								return
							 }else{
								that.posyu()
							 }
		 				   }
				   })
		   }
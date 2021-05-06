import Utils from './util.js'
import store from '../store'
	
	
  const servicePort = {};
  //---发布所需设置部分信息------------------------------------------
  var currentVersionType = "B"; //接口版本类型：A A套接口；B B套接口
  if (Utils.myTrim(currentVersionType) == "A") {
	servicePort.interfacePart = "/baojiayou_a/webAPI.jsp?";
	servicePort.smallInterfacePart = "/baojiayou_a/mall.jsp?";
  } else {
	servicePort.interfacePart = "/baojiayou/webAPI.jsp?";
	servicePort.smallInterfacePart = "/baojiayou/mall.jsp?";
  }
  export default {
  	servicePort
  }
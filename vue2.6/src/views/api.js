// 通用接口
import { PortalApi, GxtApi } from "@/utils/mserver.js";
//import { Message } from 'element-ui';
import { getCookie } from '@/utils/cookie.js';
import $ from "jquery";

// 公共下载
export const downloadByName = async (url, param) => {
  let URL = url || "app/document/documentAction.action?method=downloadByName";
  let JSESSIONID = getCookie('seessionId') || '';
  let params = ''
  for (let key in param) {
    params += key + '=' + encodeURIComponent(param[key] || '') + '&'
  }
  let down = document.createElement('a');
  down.target = "_blank";
  let l = `${window.SYSTEM_CONFIG.gxtServer + '/' + URL}&JSESSIONID=${JSESSIONID}&${params}`
  console.log(l);
  down.href = l;
  $('body').append(down) //兼容firefox
  down.click();
  down.remove();

  // const res = await GxtApi({
  //   url: url || "app/document/documentAction.action?method=downloadByName",
  //   method: "post",
  //   params: { ...param },
  //   responseType: 'blob'
  // });
  // console.log(res);
  // if (res && res.type == 'application/x-msdownload') {
  //   const blob = new Blob([res], { type: "application/vnd.ms-excel", charset: 'UTF-8' })
  //   const url = window.URL.createObjectURL(blob);
  //   window.location.href = url;
  // } else {
  //   Message.error('文档未找到');
  // }
}
//公共下拉款
export function selectQurey (params) {
  return GxtApi({
    url: "framework/taglib/selectorNewAction.action?method=loadProplist",
    method: "post",
    params
  });
}

export function importExcel (params) {
  return GxtApi({
    url: "/app/cqm/els/publicityFeeAction.action?method=importExcel",
    method: "post",
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8'
    },
    params
  });
}

//银行名称下拉数据框
export function BankList () {
  return GxtApi({
    url: "/web/gridSelector/loadBank",
    method: "get",
  });
}
//币别下拉框
export function gridSelectorLoadCurrency () {
  return GxtApi({
    url: "/web/gridSelector/loadCurrency",
    method: "get",
  });
}
//币别下拉框
export function gridSelectorLoadShortSpillType () {
  return GxtApi({
    url: "/web/gridSelector/loadShortSpillType",
    method: "get",
  });
}
//获取所有分公司信息
export function orgLoadBranchCompany () {
  return PortalApi({
    url: "/web/portal/org/loadBranchCompany",
    method: "get",
  });
}
//银行账号放大镜
export function QueryAccount (data) {
  return GxtApi({
    url: "/web/gridSelector/loadAccountQueryByUser",
    method: "post",
    data,
  });
}
//关联营业厅放大镜
export function hallGetIfaceHall (data) {
  return GxtApi({
    url: "/config/hall/getIfaceHall",
    method: "post",
    data,
  });
}
//关联营业网点
export function hallGetLanPoint (data) {
  return GxtApi({
    url: "/config/hall/getLanPoint",
    method: "post",
    data,
  });
}
//关联银行
export function hallGetBankName () {
  return GxtApi({
    url: "/config/hall/getBankName",
    method: "get",
  });
}

// 门户接口 获取用户所属单位数据
export function QueryCompany (data) {
  return PortalApi({
    url: "/web/portal/user/loadCurrentUser",
    method: "post",
    data,
  });
}

// 门户接口 获取放大镜
export function QueryCompanyTree (params, url) {
  return GxtApi({
    url: url ? url : '/framework/taglib/selectorAction.action?method=loadTreeSelector',
    method: "post",
    params,
  });
}

// 门户接口 获取下拉框数据
export function QuerySelect (params) {
  return PortalApi({
    url: "/portal/propListValue/getByCode",
    method: "get",
    params,
  });
}

//校验
export function validateRequestOrder (params) {
  return GxtApi({
    url: "app/cqm/els/elsPayLedgerAction.action?method=validateRequestOrder",
    method: "post",
    params,
  });
}

export function validatePayState (params) {
  return GxtApi({
    url: "/app/cqm/els/elsPayLedgerAction.action?method=validatePayState",
    method: "post",
    params,
  });
}

export function validateIsChange (params) {
  return GxtApi({
    url: "/app/cqm/els/elsPayLedgerAction.action?method=validateIsChange",
    method: "post",
    params,
  });
}
//获取当前菜单button权限
export function loadUserButton (params) {
  return GxtApi({
    url: "framework/base/menuCustomizationAction.action?method=loadUserMenuFunctions",
    method: "post",
    params
  });
}
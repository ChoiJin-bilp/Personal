import { GxtApi } from '@/utils/mserver.js';

//获取登录接口
export function fetchLogin (params) {
  return GxtApi({
    url: "loginAction.action",
    method: "post",
    params: { 'method': 'login', ...params },
  });
}
export function ssoLogin (params) {
  return GxtApi({
    url: "loginAction.action?method=ssoLogin",
    method: "post",
    params,
  });
}

//登录接口
export function getloginInfo (params) {
  return GxtApi({
    url: "webapp/loginAction.action?method=getloginInfo",
    method: "post",
    params,
  });
}

//获取验证码接口
export function getCode (params) {
  return GxtApi({
    url: "loginAction.action?method=securityCodeImage",
    method: "post",
    params,
    responseType: 'arraybuffer'
  });
}

//获取验证码接口
export function updatePassword (params) {
  return GxtApi({
    url: "loginAction.action?method=updatePassword",
    method: "post",
    params,
  });
}
'use strict';

import axios from 'axios';

//引入 message
import { Message } from 'element-ui';
//引入 cookies
import { getCookie, setCookie } from '@/utils/cookie.js';
import Qs from 'qs'
import router from '../router';
import { Loading } from 'element-ui'
// let baseURL = ""; // 基础服务地址
// if (process.env.NODE_ENV === "development") {
//   baseURL = process.env.VUE_APP_BASE_URL || "";
// }
// axios.defaults.baseURL=process.env.baseURL||process.env.apiUrl||'';
// axios.defaults.headers.common['Authorization']=AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
let loadingInstance, loadingCount = 0 //申明loading
let status = true
axios.defaults.withCredentials = true;
class Ajax {
  constructor(baseURL, api) {
    // 创建一个新的axios实例，并设置默认请求地址和请求头
    this.$http = axios.create({
      withCredentials: true,
      baseURL: `${baseURL}/${api}`,
      TIMEOUT: 120000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //'JSESSIONID': getCookie('seessionId')
      },
    });
    this.$http.interceptors.request.use(
      (config) => {
        if (loadingCount == 0) {
          loadingInstance = Loading.service({
            lock: true,
            customClass: "z-index999",
            background: 'rgba(255, 255, 255, 0.1)',
          })
        }
        status = true
        loadingCount++
        let data = {
          'output-content-type': 'application/json',
          JSESSIONID: getCookie('seessionId') || '',
          ...config.params,
        }
        config.data = Qs.stringify(data);
        config.params = { method: config.data.method }
        // 在发送请求之前做些什么
        //token验证
        //config.headers['Content-Type'] = 'text/html;charset=UTF-8'
        if (getCookie('seessionId')) {
          //config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
          // config.headers.Authorization = getCookie('seessionId');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.$http.interceptors.response.use(
      (response) => {
        loadingCount--
        if (loadingInstance && loadingCount == 0) {
          loadingInstance.close()
        }
        //判断错误类型：400 401 402 403 405 301 302 304
        if (response.status !== 200) {
          //提示错误
          Message.error('请求失败');
          return Promise.reject(response);
        } else if (response.data.code == 204) {
          if (status) {
            status = false
            Message.error(response.data.message)
            router.push("/login");
            throw '登录超时';
          }
        } else {
          setCookie('sessionId', response.headers.sessionid || '', 0.1);
          return response.data
        }
      },
      (error) => {
        loadingCount--
        if (loadingInstance && loadingCount == 0) {
          loadingInstance.close()
        }
        Message.error('请求错误');
        return Promise.reject(error);
      }
    );
  }
}

const portalURL = window.SYSTEM_CONFIG.portalServer; // 基础服务地址
const gxtURL = window.SYSTEM_CONFIG.gxtServer; // 基础服务地址
const baseURL = window.SYSTEM_CONFIG.baseServer; // 登录相关服务地址

// 不同模块不同api
const PortalApi = new Ajax(portalURL, 'portal').$http; // 门户api
const GxtApi = new Ajax(gxtURL, '').$http; // 业务
const BaseApi = new Ajax(baseURL, '').$http; // 登录

export { PortalApi, GxtApi, BaseApi };

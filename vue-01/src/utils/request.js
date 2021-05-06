//对 axios 进行封装
import axios from 'axios';
//引入 message
import {Message} from 'element-ui';
// import {VUE_APP_API_URL} from '../../.env.production';
// console.log(process.env);
//创建 axios 的实例
//process.env.VUE_APP_API_URL 获取的是环境变量
const service = axios.create({
	// baseURL:'/api', //基础url路径  //process.env.VUE_APP_API_URL+'/index/Api/
	timeout:10000,//请求超时时间
	// Content-Type:'application/x-www-form-urlencoded'
});

//请求拦截
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
	//token验证   ，react项目有写
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  
  
//响应拦截
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
	const res = response.data;
	console.log(res.status);
	//判断错误类型：400 401 402 403 405 301 302 304 
	if(res.status !== 200){//提示错误
		console.log(res.msg);
		Message({
			message:res.msg,
			type:'error',
			duration:3000
		})
	}else{
		return res;
	}
   // return response;
}, function (error) {
	console.log(error);
	Message({
		message:error,
		type:'error',
		duration:3000
	})
    // 对响应错误做点什么
    return Promise.reject(error);
});

//输出
export default service;

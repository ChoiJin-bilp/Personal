//对cookie 封装
import Cookie from 'js-cookie';

//设置cookie的过期时间
//key cookie  key  ,
//value 值  ,
//expires 过期时间 )
export function setCookie(key,value,expires){
	console.log(key,value,expires);
	return Cookie.set(key,value,{expires:expires});
}

//获取
export function getCookie(key){
	return Cookie.get(key);
}

//删除
export function removeCookie(key){
	Cookie.remove(key);
}
//所有的商品的api获取都放到下面
/*后台需要的数据格式
get: params
post：data

*/
//1.引入 request 
import request from '@/utils/request';

//获取商品列表
export function fetchProductList(params){
	return request({
		url:'getPoiList',
		method:'get',
		params:params
	})
}

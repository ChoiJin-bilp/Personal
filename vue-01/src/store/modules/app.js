//写一些app的状态操作
import {setCookie,getCookie,removeCookie} from '@/utils/support.js';
import Utils from '@/utils/util.js'
import store from '../../store'

//1.菜单状态管理
const app = {
	state:{//状态初始值
		sidebar:{
			srvResOnLine: "https://bjy.51yunkeyi.com", //正式资源域名地址
			srvResDevTest: "https://e.amjhome.com", //测试资源域名地址
			opened:false, //默认左侧是关闭状态
			userId:getCookie('userId'),
			KEY:getCookie('key'),
			smurl:getCookie('smurl'),
			CompanyId:"-6",//测试"746" 正式 歇脚吧"5918" 云客茶语"-6"
			appId:"1",
			//详细域名
			interfacePart:'',
			smallInterfacePart:'',
			//收银机型号
			cashId:''
		},
	},
	mutations:{//修改状态值
		TOOGGLE_SIDEBAR:state=>{
			state.sidebar.opened = !state.sidebar.opened;
		},
		TOOGGLE_DUSK(state,value){
			state.sidebar.userId = value;
		},
		TOOGGLE_SMURL(state,value){
			if(value=="online"){
				var smurl = "https://bjy.51yunkeyi.com";
				var KEY ='amj_b5e9sdfd6ws325'
				state.sidebar.KEY = KEY;
				state.sidebar.smurl = smurl;
				setCookie('smurl',smurl,15);
				setCookie('key',KEY,15);
			}else if(value=="devtest"){
				var smurl = "https://e.amjhome.com";
				var KEY ='amj_b5e9sdfd6ws325'
				state.sidebar.KEY = KEY;
				state.sidebar.smurl = smurl;
				setCookie('smurl',smurl,15);
				setCookie('key',KEY,15);
				}else{
					state.sidebar.KEY = '';
					state.sidebar.smurl = '';
				}
		},
		TOOGGLE_TAO(state,value){
			if (Utils.myTrim(value) == "A") {
			  state.sidebar.interfacePart = "/baojiayou_a/webAPI.jsp?";
			  state.sidebar.smallInterfacePart = "/baojiayou_a/mall.jsp?";
			} else {
			  state.sidebar.interfacePart = "/baojiayou/webAPI.jsp?";
			  state.sidebar.smallInterfacePart = "/baojiayou/mall.jsp?";
			}
		},
		REMOVE_SMURL(state,value){
			state.sidebar.smurl = value;
			state.sidebar.KEY = value;
		},
		//收银机型号
		SHOUYIN(state,value){
			state.sidebar.cashId = value;
		}
	},
	actions:{//动作，可以调用 mutation
		toggleSidebar:({commit})=>{
			commit('TOOGGLE_SIDEBAR');
		},
		//登入
		toggleDusk:({commit},value)=>{
			console.log(value);
			setCookie('userId',value,15);
			commit('TOOGGLE_DUSK',value);
		},
		//正式/测试接口
		toggleSmurl:({commit},smurl)=>{
			console.log(smurl);
			commit('TOOGGLE_SMURL',smurl);
		},
		//A套口/B套口
		toggleTao:({commit},smurl)=>{
			commit('TOOGGLE_TAO',smurl);
		},
		//收银机型号
		ShouYin:({commit},value)=>{
			commit('SHOUYIN',value);
		},
		//登出
		Logout({commit}){
			return new Promise(resolve=>{
				// commit('TOOGGLE_DUSK','');
				// commit('REMOVE_SMURL','');
				//清除cookie
				removeCookie('userId');
				// removeCookie('smurl');
				removeCookie('accountPwd');
				removeCookie('accountName');
				// removeCookie('key');
				resolve();
			})
		}
	}
}
export default app;
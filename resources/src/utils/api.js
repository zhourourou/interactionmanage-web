import "es6-promise";
import Axios from 'axios'
import * as C from "../constants/api"
import cookies from './cookies'
import { Message } from 'element-ui'
import utils from './misc'
import queryString from 'query-string'

const METHODS = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete'
};
// Axios.interceptors.request.use(config => {
// 	let item = C.DELETE_MARKETER;
// 	if(config.url.indexOf(item)!=-1){
// 		config.headers.Authorization = '';
// 	}
// 	// config.url == C.QUERY_MARKETER_LIST |||| config.url == C.UPDATE_MARKETER
// 	if ( config.url == C.ADDMARKETER ) {
// 		config.headers.Authorization = '';
// 	}
// 	return config;
// });

Axios.defaults.headers.common['Authorization'] = decodeURIComponent(cookies.getCookie('Authorization'));

Axios.interceptors.response.use(response => {
	let { data: resp } = response;
	if (response.headers.authorization)
		cookies.setCookie('Authorization', response.headers.authorization)
	Axios.defaults.headers.common['Authorization'] = decodeURIComponent(cookies.getCookie('Authorization'));

	return new Promise((resolve, reject) => {
		const { errorCode } = resp;
		if (errorCode) {
			reject(resp);
			resp.errorMsg && Message.warning({ message: resp.errorMsg, showClose: true });
		} else {
			resolve(resp)
		}
	});

}, error => {
	const { response } = error
	let errorMsg = ''
	if (!response) {
		errorMsg = '网络错误，请检测网络是否正常!'
	} else {
		const { data } = response
		if (data.status && data.status === C.CODE_UNAUTHORIZED) {
			window.location.href = '#/login'
			window.location.reload()
			return
		}
		errorMsg = data && data.errorMsg ? data.errorMsg : '服务器发生异常，请联系管理员'
	}
	Message.warning({ message: errorMsg, showClose: true });
	return Promise.reject(error);
});

const request = (url, params = {}, headers = {}, method = METHODS.GET) => {

	let options = {
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json;charset=UTF-8',
			...headers,
		},
		method: method
	};

	if (method === METHODS.POST || method == METHODS.PUT) {
		if (options.headers['Content-Type'] === 'application/json;charset=UTF-8') {
			options.data = params
		} else {
			options.data = queryString.stringify(params);
		}
	} else if (method === METHODS.GET || method == METHODS.DELETE) {
		options.params = params;
	}
	return Axios({ url, ...options });
};

const post = (url, params, headers) => request(url, params, headers, METHODS.POST);

const del = (url, params) => request(url, params, {}, METHODS.DELETE);

const put = (url, params) => request(url, params, {}, METHODS.PUT);


export const createAction = (type, payloadCreator, metaCreator) => {
	const identity = (...args) => args[0];
	const isFunc = (fn) => typeof (fn) === 'function';
	const isPromise = obj => typeof (obj) === 'object' && isFunc(obj.then);
	const finalPayloadCreator = isFunc(payloadCreator) ? payloadCreator : identity;

	return ({ commit, dispatch }, ...args) => {

		const payload = finalPayloadCreator(...args);
		const action = { type, payload };

		if (isFunc(metaCreator)) {
			action.meta = metaCreator(...args);
		}

		if (isPromise(payload)) {
			return payload.then(result => {
				commit(type, Object.assign(action, { payload: result }));
				return result;
			}).catch(error => {
				dispatch('hidePageLoading');
				console.error(`请求 ${type}异常，请求结果为: ${JSON.stringify(error)}`);
				return Promise.reject(error);
			});
		}

		return commit(type, Object.assign(action, { payload }));
	};
};


export default {

	login: (url, params) => request(C.USER_LOGIN + url, params),

	isLogin: params => request(C.USER_TOKEN, params),
	//查询用户信息

	user: params => request(C.NEW_USER, params),
	//新增用户
	newUser: params => post(C.NEW_USER, params),
	//修改用户信息
	changeUser: params => put(C.NEW_USER, params),
	sendMsgCode: (url, params) => request(C.SEND_MSG_CODE + url, params),

	sendVerification: (url, params) => request(C.VERIFICATION + url, params),
	//修改密码
	updatePassword: (url, params) => put(C.UPDATE_PASSWORD + url, params),

	// ------------------------ 新增点赞次数 ----------------------------------
	addTimes: params => post(C.ADD_TIMES, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	queryList: params => post(C.QUERY_TIME_LIST, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	// ------------------------ 评论用户黑名单 ----------------------------------
	// blackUserList: params => request(C.COMMENT_BLACK_USER, params),
	//请求由get改成post
	blackUserList: params => post(C.COMMENT_SEARCH_BLACK_USER, params),

	blackUserAdd: params => post(C.COMMENT_BLACK_USER, params),

	blackUserDelete: params => del(C.COMMENT_BLACK_USER, params),

	// ------------------------ 评论节目黑名单 ----------------------------------
	// blackProgramList: params => request(C.COMMENT_BLACK_PROGRAM, params),
	//请求方式由get改为post
	blackProgramList: params => post(C.COMMENT_SEARCH_BLACK_PROGRAM, params),

	blackProgramAdd: params => post(C.COMMENT_BLACK_PROGRAM, params),

	blackProgramDelete: params => del(C.COMMENT_BLACK_PROGRAM, params),

	programList: params => request(C.PROGRAM_LIST_SEARCH, params),

	programDetail: (id, params) => request(C.PROGRAM_DETAIL_ONE + id, params),

	// ------------------------ 评论敏感词 --------------------------------------
	sensitiveWordList: params => request(C.COMMENT_SENSUTIVE_WORD, params),

	sensitiveWordAdd: params => post(C.COMMENT_SENSUTIVE_WORD, params),

	sensitiveWordDelete: params => del(C.COMMENT_SENSUTIVE_WORD, params),

	// ------------------------ 用户反馈列表 ----------------------------------
	feedBackList: params => post(C.USER_FEED_BACK, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//查询父评论的列表（首页展示）
	queryAnswerLists: params => post(C.QUERY_ANSWER_LISTS, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//根据评论ID删除父评论
	delAnswerOne: (url, params) => request(C.DEL_ANSWER_ONE + url, params),

	//根据评论ID置顶子/父评论
	makeAnswerTop: (url, params) => request(C.MAKE_ANSWER_TOP + url, params),

	//新增评论点赞数
	addStartNum: params => post(C.ADD_START_NUM, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//新增子评论
	addSonAnswer: params => post(C.ADD_SON_ANSWER, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//查询子评论列表
	querySonLists: params => post(C.QUERY_CHILD_ANSWERLISTS, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//根据评论ID取消评论置顶
	makeAnswerNo: (url, params) => request(C.MAKE_ANSWER_NO + url, params),

	//根据评论ID删除子评论
	delChildAnswer: (url, params) => request(C.DEL_CHILD_ANSWER + url, params),

	//查询子评论的列表
	queryChildList: params => post(C.QUERY_CHILD_LIST, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),

	//导入评论
	importExcel: (mobile, userId, userName, body, contentType, params) => post(C.IMPORT_EXCEL + `?mobile=${mobile}&userId=${userId}&userName=${userName}&body=${body}&contentType=${contentType}`, params, { __FILE__UPLOAD__: true }),

	//导出评论
	exportExcel: params => post(C.EXPORT_EXCEL, params,{ 'Content-Type': 'application/x-www-form-urlencoded' }),

	//导入父评论
	importFatherExcel: (mobile, userId, userName, body, contentType, params) => post(C.FATHER_IMPORT_EXCEL + `?mobile=${mobile}&userId=${userId}&userName=${userName}&body=${body}&contentType=${contentType}`, params, { __FILE__UPLOAD__: true }),

	//导出父评论
	exportFatherExcel: params => request(C.FATHER_EXPORT_EXCEL, params),
	// exportFatherExcel: params => post(C.FATHER_EXPORT_EXCEL, params,{ 'Content-Type': 'application/x-www-form-urlencoded' }),
	//重置app用户头像及昵称
	changeUserInfo: (url, params) => request(C.CHANGE_APP_USER + url, params),
	//获取app用户信息
	getAppUserInfo: (url, params) => request(C.APP_USER_INFO + url, params),

	//用户角色关系维护 绑定用户角色关系信息
	bindUserRole: params => put(C.USERROLE_BIND, params),
	//查询用户角色关系列表
	// queryUserRole: params => request(C.QUERY_USERROLE, params),
	//接口由get更改为post
	queryUserRole: params => post(C.QUERY_USERROLE, params),

	//新增角色信息
	addRole: params => post(C.ADDROLE, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),
	//删除角色信息
	deleteRole: params => del(C.DELETEROLE, params),
	//更新角色信息
	updateRole: params => put(C.UPDATEROLE, params),
	//查询角色信息
	// searchRole: params => request(C.SEARCHROLE, params),
	searchRole: params => post(C.SEARCHROLE, params,{ 'Content-Type': 'application/x-www-form-urlencoded' }),

	//绑定角色权限关系信息
	bindRolePermission: params => put(C.BIND_ROLE_PERMISSION, params),
	//查询角色权限关系列表
	queryRolePermission: params => request(C.SEARCH_ROLE_PERMISSION, params),

	//权限模块增删改查-------->新增权限信息
	addPermission: params => post(C.ADD_PERMISSION, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),
	//删除权限信息	
	deletePermission: params => del(C.DELETE_PERMISSION, params),
	//更新权限信息
	updatePermission: params => put(C.UPDATE_PERMISSION, params),
	//查询权限列表信息
	// searchPermission: params => request(C.SEARCH_PERMISSION, params),
	 searchPermission: params => post(C.SEARCH_PERMISSION, params,{ 'Content-Type': 'application/x-www-form-urlencoded' }),

	//营销白名单增删改查 -----评论用户
	addMarketer: params => post(C.ADDMARKETER, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),
	//查询营销白名单用户列表
	queryMarketerList: params => request(C.QUERY_MARKETER_LIST, params),
	//更新营销白名单用户
	updateMarketer: params => post(C.UPDATE_MARKETER, params, { 'Content-Type': 'application/x-www-form-urlencoded' }),
	//删除营销白名单用户
	deleteMarketer: (url, params) => request(C.DELETE_MARKETER + url, params)
};




// const getApi = (url) => `${window.config.context}/${url}.jhtml`;
const getApi = (url) => `${window.config.context}/interactionmanage/v2/${url}`;
const getLogin = (url) => `${window.config.context_1}/noms/api/${url}`;
const getGateway = (url) => `${window.config.context}/interaction/v2/${url}`

export const HOST_BASE = `${location.protocol}//${location.host}`;

export const CODE_STATUS_OK = 0;
export const CODE_UNAUTHORIZED = 401;


// 获取登录验证码
export const CODE_IMG = 'http://t.cn/R8MNl4Z'

//新增用户
export const NEW_USER = getApi('user/user')
// 用户登入
export const USER_LOGIN = getApi('user/login');
export const SEND_MSG_CODE = getApi('user/msg-send');

export const VERIFICATION = getApi('user/msg-code');

// 修改密码
export const UPDATE_PASSWORD = getApi('user/password');
//验证登陆有效性
export const USER_TOKEN = getLogin('v1/auth/validate-token');

//评论用户黑名单

export const COMMENT_BLACK_USER = getApi('comment/black-user');

//查询用户黑名单

export const COMMENT_SEARCH_BLACK_USER = getApi('comment/search-black-user');

//评论节目黑名单

export const COMMENT_BLACK_PROGRAM = getApi('comment/black-program');
//++++查询节目黑名单
export const COMMENT_SEARCH_BLACK_PROGRAM = getApi('comment/search-black-program');
//查询节目列表

export const PROGRAM_LIST_SEARCH = getApi('program');

//根据节目id获取名称

export const PROGRAM_DETAIL_ONE = getApi('program/get-name');

//评论敏感词

export const COMMENT_SENSUTIVE_WORD = getApi('comment/sensitive-word');

//新增点赞次数
export const ADD_TIMES = getApi('userLike/times');

//查询父评论的列表

export const QUERY_ANSWER_LISTS = getApi('base/queryParentList');

//根据评论ID删除父评论

export const DEL_ANSWER_ONE = getApi('base/deleteParentComment');

//根据评论ID置顶父/子评论

export const MAKE_ANSWER_TOP = getApi('base/topCommentYes');

//根据评论ID取消评论置顶
export const MAKE_ANSWER_NO = getApi('base/topCommentNo');

//新增评论点赞数

export const ADD_START_NUM = getApi('userLike/times');

//点赞列表查询

export const QUERY_TIME_LIST = getApi('userLike/queryList');

//新增子评论

export const ADD_SON_ANSWER = getApi('base/addChildInfo');

//查询子评论
export const QUERY_CHILD_ANSWERLISTS = getApi('base/queryChildList');

//根据评论ID删除评论子评论
export const DEL_CHILD_ANSWER = getApi('base/deleteChildComment');

//查询子评论列表
export const QUERY_CHILD_LIST = getApi("base/queryChildList");

//导入子评论
export const IMPORT_EXCEL = getApi('comment/import/0');

//导出子评论
export const EXPORT_EXCEL = getApi('comment/export/0');

//导入父评论
export const FATHER_IMPORT_EXCEL = getApi('comment/import/1');

//导出父评论
export const FATHER_EXPORT_EXCEL = getApi('comment/export/1');

//用户反馈列表
export const USER_FEED_BACK = getApi('feedback');

//获取app用户信息
export const APP_USER_INFO = getApi('user/userInfo');

//重置app用户头像及昵称
export const CHANGE_APP_USER = getApi('user/resetUserInfo');

//用户关系维护 ---->绑定用户角色信息
export const USERROLE_BIND = getApi('userRole/bind')
//查询用户信息关系列表
export const QUERY_USERROLE = getApi('userRole/search')

//新增角色信息
export const ADDROLE = getApi('role/addRole')
//删除角色信息
export const DELETEROLE = getApi('role/deleteRole')
//更新角色信息
export const UPDATEROLE = getApi('role/updateRole')
//查询角色列表信息
export const SEARCHROLE = getApi('role/searchRole')

//绑定角色权限关系信息
export const BIND_ROLE_PERMISSION = getApi('rolePermission/bind')
//查询角色权限关系列表
export const SEARCH_ROLE_PERMISSION = getApi('rolePermission/search')

//权限模块增删改查------>新增权限信息
export const ADD_PERMISSION = getApi('permission/addPermission')
//删除权限信息
export const DELETE_PERMISSION = getApi('permission/deletePermission')
//更新权限信息
export const UPDATE_PERMISSION = getApi('permission/updatePermission')
//查询权限列表信息
export const SEARCH_PERMISSION = getApi('permission/searchPermission')

//---------->营销白名单    新增营销白名单
export const ADDMARKETER = getApi('marketer/addMarketer')
// 查询营销白名单用户列表
export const QUERY_MARKETER_LIST = getApi('marketer/queryMarketerList')
//更新营销白名单用户
export const UPDATE_MARKETER = getApi('marketer/updateMarketer')
//删除营销白名单用户
export const DELETE_MARKETER = getApi('marketer/deleteMarketer')
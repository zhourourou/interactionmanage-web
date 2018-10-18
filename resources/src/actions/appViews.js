import * as C from "../constants/api"
import * as AC from '../constants/actions'
import Api, {createAction} from "../utils/api"

export default {

    // // 查询APP展现管理下的分类列表
    // queryPageCategory: createAction(C.PAGE_CATEGORY_QUERY, Api.queryPageCategory),

    // // 根据category查询页面
    // queryPageListByCategory: createAction(C.PAGE_LIST_QUERY_BY_CATEGORY, Api.queryPageListByCategory),

    // // 删除页面
    // removePage: createAction(C.PAGE_REMOVED, Api.removePage, params => params),

    // // 设置页面适用地区
    // setPageFitArea: createAction(AC.PAGE_FIT_AREA_SETTED, status => Promise.resolve(status))
}

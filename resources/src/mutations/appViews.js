import * as C from "../constants/api"
import utils from '../utils/misc'
import * as AC from '../constants/actions'
import {COMP_STEPS} from '../constants/constants'

const state = {

    // 子菜单
    pageCategories: [],

    // 页面列表
    pageList: {
        count: 0,
        pageNo:1,
        pageSize: 30,
        list: []
    },

    // 页面的使用地区
    pageFitArea: '',

};


const mutations = {

 //    // 查询子菜单
	// [C.PAGE_CATEGORY_QUERY](state, {payload}){
	// 	state.pageCategories = payload;
 //    },

 //    // 产需页面列表
	// [C.PAGE_LIST_QUERY_BY_CATEGORY](state, {payload}){
	// 	state.pageList = payload;
 //    },


 //    // 删除页面
 //    [C.PAGE_REMOVED](state, {meta:{id}}) {
 //        const index = utils.findIndex(state.pageList.list, item => {
 //            return item.id === id
 //        })
 //        if(index !== -1) {
 //            state.pageList.count--
 //            state.pageList.list.splice(index, 1)
 //        }
 //    },


 //    [AC.PAGE_FIT_AREA_SETTED](state, {payload}) {
 //        state.pageFitArea = payload
 //    }


};

export default{
	state,
	mutations
}

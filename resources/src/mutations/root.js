import * as AC from "../constants/actions"
import * as C from "../constants/api"

const state = {
    pageLoading: false,
    currentUser:  '',
    dictTypes: {}

};
const mutations = {


	[AC.SHOW_PAGE_LOADING](state){
		state.pageLoading = true;
	},

	[AC.HIDE_PAGE_LOADING](state){
		state.pageLoading = false;
    },

    [AC.CHANGE_CURRENT_USER](state, {payload}){
		state.currentUser = payload;
    },

    // [C.DICTS_LIST_QUERY_BY_TYPE](state, {payload}) {
    //     state.dictTypes = payload.entity
    // }


};

export default{
	state,
	mutations
}

import * as C from "../constants/api"
import utils from '../utils/misc'
import * as AC from '../constants/actions'
import {COMP_STEPS} from '../constants/constants'

const state = {

    // 页面列表
    pageList: {
        count: 0,
        pageNo:1,
        pageSize: 30,
        list: []
    }

};


const mutations = {


};

export default{
	state,
	mutations
}

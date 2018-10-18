import * as AC from "../constants/actions";
import * as C from "../constants/api";
import Api, {createAction} from "../utils/api";

export default {

    showPageLoading: createAction(AC.SHOW_PAGE_LOADING),

    hidePageLoading: createAction(AC.HIDE_PAGE_LOADING),

    changeCurrentUser: createAction(AC.CHANGE_CURRENT_USER, user => Promise.resolve(user)),

    // queryDictListByType: createAction(C.DICTS_LIST_QUERY_BY_TYPE, Api.queryDictListByType)

}





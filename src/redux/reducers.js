/*reducer 函数模块: 根据当前 state 和指定 action 返回一个新的 state */

import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from "./action-types";
import storageUtils from '../utils/storageUtils/storageUtils'
import { combineReducers } from 'redux'

/*管理 headTitle 状态数据的 reducer */
const initTitle=''
const headTitle = (state=initTitle,action) => {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}
/*管理 user 状态数据的 reducer */
const initUser = storageUtils.getUser() 
function user(state = initUser, action) {
    // console.log('user()', state, action)
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/*向外暴露合并后产生的总 reducer 函数 总的 state 的结构: 
{ 
    headerTitle: '',
    user: {} 
}*/
export default combineReducers({ 
    headTitle,
    user
})
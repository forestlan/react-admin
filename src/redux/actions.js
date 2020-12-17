/*包含 n 个用来创建 action 的工厂函数(action creator) */

import { message } from "antd";
import { reqLogin } from "../api";
import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from "./action-types";
import storageUtils from '../utils/storageUtils/storageUtils'

export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

/*接收用户的同步 action */
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })

/*退出登陆的同步 action */
export const logout = () => {
    storageUtils.removeUser()
    return { type: RESET_USER }
}

// 登录的异步action
export const login = (username,password) => {
    return async dispatch => {
        const res = await reqLogin(username, password)
        if (res.status === 0) {
            const user = res.data
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        } else {
            message.error('用户名或密码错误，请重新输入')
        }
    }
}

/*能发送 ajax 请求的函数模块 
包装 axios 函数的返回值是 promise 对象 
axios.get()/post()返回的就是 promise 对象  */


import axios from 'axios'
import { message } from 'antd'


export default function ajax(url, data = {}, method = 'GET') {
    return new Promise(function (resolve, reject) {
        let Promise
        if (method === 'GET') {
            // 执行异步 ajax 请求
            Promise = axios.get(url, { params: data })
        } else {
            Promise = axios.post(url, data)
        }
        Promise.then(response => {
            // 如果成功了, 调用 resolve(response.data)
            resolve(response.data)
        }).catch(error => {
            // 对所有 ajax 请求出错做统一处理, 外层就不用再处理错误了
             // 如果失败了, 提示请求后台出错
            message.error('请求错误' + error.message)
        })
    })


}

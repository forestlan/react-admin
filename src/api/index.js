/*包含 n 个接口请求函数的模块 每个函数返回 promise */

import ajax from './ajsx'
import jsonp from 'jsonp'
// 请求登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', parentId)
//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')
// 更改分类名称
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')
//获取商品信息列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })
//根据描述/商品名 搜索  
export const reqSearchProducts = ({ pageNum, pageSize, searchType, searchName }) => ajax('/manage/product/search',
    {
        pageNum,
        pageSize,
        [searchType]: searchName,

    })
// 根据ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId })
// 上架/下架
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')
// 删除图片
export const reqDelImg = (name) => ajax('/manage/img/delete', { name }, 'POST')
// 添加商品/修改商品信息
export const reqAddOrUpdate = (product) => ajax('/manage/product/' + (product._id?'update':'add'), product, 'POST')
// 获取角色列表
export const reqRole = () => ajax('/manage/role/list' )
// 设置角色权限
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list' )
// 删除角色
export const reqDelUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST' )
// 添加用户/修改用户
export const reqAddOrUpadateUser = (user) => ajax('/manage/user/'+(user._id?'update':'add'), user, 'POST' )
    
// jsonp请求天气
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, rejext) => {
        jsonp(url, { }, (error, response) => {
            if (!error && response.status === 'success') {
                const { dayPictureUrl, weather } = response.results[0].weather_data[0]
                // console.log(response.results[0] )
                resolve({ dayPictureUrl, weather })
            } else {
                alert('获取天气信息失败')
            }
        })
    })
}

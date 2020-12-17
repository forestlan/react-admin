import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'antd'


import { menuList } from '../../config/menuConfig'
import { setHeadTitle } from "../../redux/actions";

const { SubMenu } = Menu;



class LeftNav extends Component {
    /*
    判断当前用户是否有看到当前 item 对应菜单项的权限 
    */
    hasAuth = (item) => {
        const key = item.key
        const menus = this.props.user.role.menus || []
        /*
        1. 如果菜单项标识为公开 
        2. 如果当前用户是 admin 
        3. 如果菜单项的 key 在用户的 menus 中 
         */
        if (item.isPublic || this.props.user.username === 'admin' || menus.indexOf(key)!==-1) {
            return true
            // 4. 如果有子节点, 需要判断有没有一个 child 的 key 在 menus 中 
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
    }
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                const path = this.props.location.pathname
                // console.log(item.children);
                if (!item.children) {

                    // 一旦请求路径匹配上当前 item, 将 item 的 title 保存到 redux 
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    // 子菜单自动展开功能：如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 
                    // 将菜单的 key 保存为 openKey
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // console.log(cItem);
                    if (cItem) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {/* 递归调用 */}
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
            }
            )
     }
 /*在第一次 render()之前执行一次 一般可以在此同步为第一次 render()准备数据 */
     UNSAFE_componentWillMount = () => {
         this.menuNodes = this.getMenuNodes(menuList)
     }
     render() {
         let path = this.props.location.pathname
         if (path.indexOf('/product')===0) {
            //  表示当前请求的路径为/product或product的子路由
             path='/product'
         }
         const openKey = this.openKey
        return (
            
            <Menu theme="dark"
                selectedKeys={[path]}
                defaultOpenKeys={[openKey]}
                mode="inline">
                    {/* 调用函数，动态生成数据 */}
                {this.menuNodes}
            </Menu>
        )
    }
}

/*withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件,
 新组件会向被包装组件传递 history/location/match 属性 */
export default connect(
    state => ({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))  
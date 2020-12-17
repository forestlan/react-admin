/*后台管理主路由组件 */
import React, { Component } from 'react'
import { Redirect, Link, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout } from 'antd'


import logo from '../../assets/images/logo.png'
import Header from '../../components/header/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import LeftNav from '../../components/left-nav/left-nav'
import './admin.less'
import NotFound from '../not-found/not-found'


const { Content, Footer, Sider } = Layout;


class Admin extends Component {
    render() {
        const user = this.props.user
        if (!user || !user._id) {
            return <Redirect to='/login'></Redirect>
        }
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <Link to='/' className="logo" >
                        <img src={logo} alt="logo" />
                        <h2>硅谷后台</h2>
                    </Link>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout className="site-layout">
                    <Header></Header>
                    <Content style={{ margin: '20px', backgroundColor: '#fff' }}>
                            <Switch>
                            <Redirect exact from='/' to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Route component={NotFound} />

                            </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>推荐使用谷歌浏览器，以便获得更加好的体检</Footer>
                </Layout>
            </Layout>
            
        )

    }
}
export default connect(
    state => ({ user: state.user }),
    {  }
)(Admin) 
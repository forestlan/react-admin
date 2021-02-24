/*用户登陆的路由组件 */
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import { login } from "../../redux/actions";


class Login extends Component {

    onFinish = async (values) => {
        const { username, password } = values


        // 使用redux管理
        this.props.login(username, password)

    }

    render() {
        // console.log('123123');
        // debugger
        const user = this.props.user
        // 如果内存中有user._id，说明已经登录，跳转到主界面
        if (user && user._id) {
            return <Redirect to='/home'></Redirect>
        }
        return (
            <div className='login'>
                <div className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>后台管理系统</h1>
                </div>
                <div className="form-outer">
                    <h2>用户登录</h2>
                    <Form name="normal_login" className="login-form" onFinish={this.onFinish}>
                        <Form.Item name="username"
                            rules={[{ required: true, message: '请输入用户名！' },
                            { min: 4, message: '用户名最少4位' },
                            { max: 12, message: '用户名最多12位' },
                            { pattern: /^[0-9a-zA-Z_]+$/, message: '用户名必须为英文，数字，下划线组成' }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"
                                style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item name="password"
                            rules={[{ required: true, message: '请输入用密码！' },
                            { min: 4, message: '密码最少4位' },
                            { max: 12, message: '密码最多12位' },
                            { pattern: /^[0-9a-zA-Z_]+$/, message: '密码必须为英文，数字，下划线组成' }]}>
                            <Input prefix={<LockOutlined className="site-form-item-icon"
                                style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { login }
)(Login) 
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './header.less'
import { formateDate } from '../../utils/dateUtils/dateUtils'
import { reqWeather } from '../../api/index'
import { menuList } from '../../config/menuConfig'
import LinkButton from '../link-button'
import { logout } from '../../redux/actions';

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    // 时间实时变化
    getTime = () => {
        this.interval = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000);
    }
    // 发送异步请求获取天气
    getWeather = async () => {
        // const { dayPictureUrl, weather } = await reqWeather('上海')
        // console.log({ dayPictureUrl, weather });
        // this.setState({ dayPictureUrl, weather })
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        // 根据请求的 path 得到对应的标题
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                // 当有二级菜单时，遍历匹配路径
                const item2 = item.children.find(item2 => path.indexOf(item2.key) === 0)
                // 当匹配到有值时，才赋值给title
                if (item2) {
                    title = item2.title
                }
            }
        })
        return title
    }
    logOut = () => {
        Modal.confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                // 退出登录
                this.props.logout()
            }

        })
    }
    componentDidMount = () => {
        // 获取时间
        this.getTime()
        // 获取天气
        this.getWeather()
    }
    // 组件关闭时关闭定时器
    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    render() {
        const { dayPictureUrl, weather, currentTime } = this.state
        const username = this.props.user.username
        // 调用函数获取title
        // const title = this.getTitle()
        const title = this.props.headTitle
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="dayPictureUrl" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({ headTitle: state.headTitle, user: state.user }),
    { logout }
)(withRouter(Header)) 

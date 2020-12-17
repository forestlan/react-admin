import React, { Component } from 'react'
import { Card, Button, Table, Modal, Form, Input, message } from 'antd'
import { connect } from 'react-redux'
import { reqRole, reqUpdateRole, reqAddRole } from "../../api/index";
import AuthRole from "./auth-role";

import { formateDate } from "../../utils/dateUtils/dateUtils";
import { logout } from '../../redux/actions';


 class Role extends Component {
    state = {
        roles: [], //获取的所有的角色列表对象
        role: {},  // 当前选中的角色对象
        isShowAdd: false,
        isShowAuth: false
    }
    // constructor(props) {
    //     super(props)
    //     this.authRef = React.createRef()
    // }
    // 发送请求获取角色列表
    getRoles = async () => {
        const res = await reqRole()
        if (res.status === 0) {
            const roles = res.data
            this.setState({ roles })
        }
    }
    // 点击行选中
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({ role })
            }
        }
    }
    // 点击创建角色
    onFinish = async (value) => {
        const roleName = value.addRole
        const res = await reqAddRole(roleName)
        console.log(res);
        if (res.status === 0) {
            message.success('添加成功')
            const role = res.data
            // const roles = [...this.state.roles]
            // roles.push(role)
            this.setState(state => ({ // 更新 roles 状态: 基于原本状态数据更新
                roles: [...state.roles, role],
                isShowAdd: false
            })
            )
        } else {
            message.error('添加失败')
        }
     }
    //  通过回调函数获取子组件中的menus
     getKeys = (c) => {
          this.menus = c
        //  console.log(menus);
     }
    // 设置权限点击确认
    updateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        // const menus = this.authRef.current.getMenus() //通过ref获取子组件中的menus
        const { role } = this.state
        // console.log(this.menus);
        role.menus = this.menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        const res = await reqUpdateRole(role)
        if (res.status === 0) {
            if (role._id === this.props.user.role_id) {
                // 判断是否修改的为当前的账户角色，如果是，修改后需重新登录
                message.success('角色权限已修改，请重新登录')
                // memoryUtils.user = {}
                // storageUtils.removeUser()
                // this.props.history.replace('/login')
                this.props.logout()
            } else {
                message.success('设置角色权限成功')
                this.getRoles()
            }
           
        }
    }
    UNSAFE_componentWillMount() {
        this.columns =
            [
                {
                    title: '角色名称',
                    dataIndex: 'name',

                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    render: (create_time) => formateDate(create_time)

                },
                {
                    title: '授权时间',
                    dataIndex: 'auth_time',
                    render: (auth_time) => formateDate(auth_time)

                },
                {
                    title: '授权人',
                    dataIndex: 'auth_name',

                }
            ]
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role } = this.state
        const title = (
            <span>
                <Button type='primary' style={{ marginRight: 15 }} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: role => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    columns={this.columns}
                    dataSource={roles}
                    bordered
                    rowKey={'_id'}
                    pagination={{ defaultPageSize: 5 }}
                    onRow={this.onRow}
                />
                <Modal
                    // forceRender={true} //强制渲染
                    title="添加角色"
                    visible={this.state.isShowAdd}
                    footer={null}
                    closable={false}
                    destroyOnClose
                >
                    <Form onFinish={this.onFinish}
                    >
                        <Form.Item
                            name='addRole'
                            label='角色名称：'
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入角色名称"
                            />
                        </Form.Item>
                        <Form.Item >
                            <Button type='primary' htmlType="submit" style={{ marginLeft: '100px', marginRight: '150px' }}>确认</Button>
                            <Button onClick={() => this.setState({ isShowAdd: false })}>取消</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={this.state.isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => this.setState({ isShowAuth: false })}
                >
                    <AuthRole role={role}  getKeys={this.getKeys}></AuthRole>
                </Modal>
            </Card>

        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role)

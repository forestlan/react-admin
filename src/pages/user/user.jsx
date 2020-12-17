import React, { Component } from 'react'
import { Card, Button, Table, Modal, message, Form, Input, Select} from 'antd'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils/dateUtils'
import { reqUsers, reqDelUser, reqAddOrUpadateUser} from "../../api/index";


export default class User extends Component {
    state = {
        roles: [],
        users: [],
        isShow: false

    }
    constructor(props) {
        super(props)
        this.addRef = React.createRef()
    }
    /*根据角色的数组生成一个包含所有角色名的对象容器 */
    initRoleNames = (roles) => {
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // console.log(this.roleNames);
    }
    // 获取用户列表
    getUsers = async () => {
        const res = await reqUsers()
        if (res.status === 0) {
            const { users, roles } = res.data
            this.initRoleNames(roles)
            this.setState({ users,roles })
        }
    }
    // 添加用户
    addOrUpdateUser = async() => {
        // const { isShow } = this.state
        // 表单验证且获得表单的值
        this.addRef.current.validateFields()
        .then(async(values) => {
            // console.log(values);
            if (this.user) {
                values._id = this.user._id
            }
            // this.addRef.current.resetFields()
            const res = await reqAddOrUpadateUser(values)
            if (res.status===0) {
               this.getUsers()
            }
            this.setState({ isShow: false })
        }).catch(info => {
            console.log(info);
        })
       

    }
    showUpdate = (user) => {
        this.user = user
        this.setState({ isShow: true })
        // 初始显示
        this.addRef.current.setFieldsValue({
            username: user.username,
            phone: user.phone,
            email: user.email,
            role_id: user.role_id
        })
    }
   
    // modal关闭时重置表单值
    afterClose = () => {
        this.addRef.current.resetFields()
    }
    // 删除用户
    delUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async()=>{
                // console.log('OK');
                const res = await reqDelUser(user._id)
                if (res.status === 0) { }
                message.success('删除成功')
                // const users = res.data.users
                // this.setState({
                //     users
                // })
                this.getUsers()
            },
            onCancel() {
                // console.log('Cancel');
            },
           
        })

    }

    UNSAFE_componentWillMount() {
        this.columns =
            [
                {
                    title: '角色名',
                    dataIndex: 'username',

                },
                {
                    title: '邮箱',
                    dataIndex: 'email',

                },
                {
                    title: '电话',
                    dataIndex: 'phone',

                },
                {
                    title: '注册时间',
                    dataIndex: 'create_time',
                    render: formateDate

                },
                {
                    title: '所属角色',
                    dataIndex: 'role_id',
                    render: role_id => this.roleNames[role_id]

                },
                {
                    title: '操作',
                    render: (user) => (
                        <span>
                            <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                            <LinkButton onClick={() =>this.delUser(user)}>删除</LinkButton>
                        </span>
                    )

                }
            ]
    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { users, roles } = this.state
        const user=this.user || {}
        // console.log(users,roles);
        const title = (
            <Button type='primary' onClick={() => {
                this.user=null
                this.setState({ isShow: true })
            }}>创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    columns={this.columns}
                    dataSource={users}
                    bordered
                    rowKey={'_id'}
                    pagination={{ defaultPageSize: 5 }}
                />
                <Modal
                    forceRender={true} //强制渲染
                    title={user._id?'修改角色':"添加角色"}
                    visible={this.state.isShow}
                    // destroyOnClose
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        // this.addRef.current.resetFields()
                        this.setState({ isShow: false })
                    }}
                    afterClose={this.afterClose}
                >
                    {/* <UserForm roles={roles} ref={this.addRef}></UserForm> */}
                    <Form
                        // initialValues={{
                        //     username: user.username,
                        //     phone: user.phone,
                        //     email: user.email,
                        //     role_id: user.role_id
                        // }}
                        ref={this.addRef}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}>
                        <Form.Item
                            name='username'
                            label='用户名：'
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入用户名"
                            />
                        </Form.Item>
                        {
                            user._id ? null :
                            <Form.Item
                                name='password'
                                label='密码：'
                                rules={[{ required: true, message: '输入不合法' }]}>
                                <Input type='password' placeholder="请输入密码"
                                />
                            </Form.Item>
                        }
                        <Form.Item
                            name='phone'
                            label='手机号：'
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Form.Item
                            name='email'
                            label='邮箱：'
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入邮箱"
                            />
                        </Form.Item>
                        <Form.Item
                            name='role_id'
                            label='角色：'
                        >
                            <Select placeholder="请选择" >
                                {
                                    roles.map(role => (<Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>))
                                }

                            </Select>
                        </Form.Item>

                    </Form>
        
                </Modal>
            </Card>
        )
    }
}

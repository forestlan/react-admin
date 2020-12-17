import React, { Component } from 'react'
import { Card, Button, Table, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api/index'
const { Option } = Select




export default class Category extends Component {
    state = {
        loading: false,//loading的状态
        categorys: [],//一级列表的信息
        secCategorys: [],//二级列表的信息
        parentId: '0',//当前所在列表ID， 0：一级列表  其他则为二级列表
        parentName: '',//当前所在父分类的名称
        visible: 0,   //定义对话框的显示状态，0 都不显示 1显示添加 2显示修改

    }
    formRef = React.createRef(); //修改分类的ref
    formRef2 = React.createRef(); //添加分类的ref
    // 点击显示修改对话框
    showUpdate = (category) => {
        // 保存当前点击的category对象
        this.category = category
        // 更新状态
        this.setState({ visible: 2 })
        this.formRef.current.setFieldsValue({
            //点击时给ITEM赋初始值，但此方法需要ITEM提前渲染一次
            updateName: this.category.name
        })
    }

    // 点击显示添加对话框
    showAdd = () => {

        this.setState({ visible: 1 })
        // 二级分类点击添加时显示默认值
        this.formRef2.current.setFieldsValue({ firstCategory: this.state.parentId })

    }
    // 点击隐藏对话框
    handleCancel = () => {
        this.setState({ visible: 0 })
        // this.formRef.current.resetFields();
    }
    // 添加分类
    addCategory = async () => {
        // 获取form的值
        // const { inputCategory, firstCategory } = this.formRef2.current.getFieldsValue(['inputCategory', 'firstCategory'])
        // console.log(parentId, this.state.parentId);
        // 表单验证通过过在发送ajax请求
        this.formRef2.current.validateFields().then(async (values) => {
            const { inputCategory, firstCategory } = values
            const parentId = firstCategory
            const categoryName = inputCategory
            // console.log(parentId, categoryName);
            const result = await reqAddCategory(parentId, categoryName)
            if (result.status === 0) {
                /*添加一级分类 在当前分类列表下添加 */
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                } else if (parentId === '0') {
                    this.getCategorys(parentId)
                }
            }
            // 添加完成隐藏对话框
            this.setState({ visible: 0 })
        }).catch(err => {
            // console.log(err);
        })


    }
    // 修改分类
    updateCategory = async () => {
        // 获取当前分类所在id
        const categoryId = this.category._id
        // 获取当前输入的值
        // const categoryName = this.formRef.current.getFieldValue('updateName')
        // 表单验证通过过在发送ajax请求
        this.formRef.current.validateFields().then(async (values) => {
            const categoryName = values.updateName
            // console.log(values.updateName);
            const result = await reqUpdateCategory({ categoryId, categoryName })
            // 修改完成隐藏对话框
            this.setState({ visible: 0 })
            if (result.status === 0) {
                // 重新获取一级列表
                this.getCategorys()
            }
        }).catch(err => {
            // console.log(err);
        })
    }
    // 获取一级/二级列表
    getCategorys = async (parentId) => {
        // 发送请求前显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys({ parentId })
        // 请求结束后隐藏loading
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                // 显示一级列表
                this.setState({ categorys })
            } else {
                // 显示二级列表
                this.setState({ secCategorys: categorys })

            }
        } else {
            message.error('获取信息失败')
        }
    }
    // 点击查看二级列表
    getSecCategorys = (category) => {
        // console.log(category);
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 更新状态: state 中的数据是异步更新(不会立即更新 state 中的数据)
            // 获取二级列表
            this.getCategorys()
        })
    }
    // 点击返回一级列表
    returnCategorys = () => {
        this.setState({
            secCategorys: [],
            parentId: '0'
        })
    }
    // 为第一次渲染做准备，渲染table 的列项
    UNSAFE_componentWillMount = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name'

            },
            {
                title: '操作',
                key: 'action',
                width: 400,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ?
                            <LinkButton onClick={() =>
                                this.getSecCategorys(category)
                            }>查看子分类</LinkButton> : null}

                    </span>
                )
            }
        ];
    }
    // 第一次渲染之后发送ajax请求分类列表
    componentDidMount = () => {
        // 获取一级分类
        this.getCategorys()
    }

    render() {
        const { categorys, secCategorys, parentId, parentName, visible } = this.state
        const loading = this.state.loading
        // const categoryName = this.category || {}
        // console.log(parentId, parentName);  

        return (
            <Card title={parentId === '0' ? '一级分类列表' : (
                <span>
                    <LinkButton onClick={this.returnCategorys}>一级分类列表</LinkButton>
                    <ArrowRightOutlined style={{ marginRight: 10 }} />
                    {parentName}
                </span>)}
                extra={<Button type='primary'
                    icon={<PlusOutlined />} onClick={this.showAdd}>添加</Button>} >
                <Table
                    columns={this.columns}
                    dataSource={parentId === '0' ? categorys : secCategorys}
                    bordered
                    rowKey={'_id'}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    loading={loading}
                />

                <Modal
                    title="添加分类"
                    forceRender={true}
                    visible={visible === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    {/* 一级菜单点击添加时显示默认值为‘一级分类’ */}
                    <Form ref={this.formRef2} initialValues={{
                        firstCategory: this.state.parentId
                    }}>
                        <Form.Item name='firstCategory' label='所属分类' >
                            <Select key={parentId} >
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='inputCategory' label='分类名称'
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入添加的分类名称" />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    forceRender={true} //强制渲染
                    title="修改分类"
                    visible={visible === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <Form ref={this.formRef}>
                        <Form.Item
                            name="updateName"
                            rules={[{ required: true, message: '输入不合法' }]}>
                            <Input placeholder="请输入修改的分类名称"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

            </Card>



        )
    }
}

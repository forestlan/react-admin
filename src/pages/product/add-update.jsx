import React, { Component } from 'react'
import { Card, Form, Input, Button, message, Cascader } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import { reqCategorys, reqAddOrUpdate } from "../../api/index";
import PictureUpload from "./picture-upload";
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input;


export default class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.imgref = React.createRef();
        this.editorRef = React.createRef();
    }
    state = {
        options: [
            //用来显示级联列表的数组
        ]
    }
    onFinish = async(values) => {//表单验证成功后的回调函数
        message.success('提交成功');
        const imgs = this.imgref.current.getImgs()
        const detail = this.editorRef.current.getDetail()
        const { name, desc, price } = values
        const categoryIds = this.CascaderValue
        let pCategoryId = ''
        let categoryId = ''
        
        if (categoryIds.length === 1) { // 选择的是一级分类 
            categoryId = '0'
            pCategoryId = categoryIds[0]
        } else { // 选择的是二级分类 
            pCategoryId = categoryIds[1]
            categoryId = categoryIds[0]
        }
        // 封装成对象 
        const product = { name, desc, price, pCategoryId, categoryId, detail, imgs }
        // 如果是更新, 指定 product 的_id 属性值 
        if (this.isUpdate) {
            product._id = this.product._id
        }
        // 请求保存 
        const result = await reqAddOrUpdate(product)
        if (result.status === 0) {
            message.success('保存商品成功')
            this.props.history.goBack()
        } else {
            message.success('保存商品失败')
        }
    }
validatorPrice = (rule, value) => {// 自定义校验 价格输入
    if (value * 1 > 0) {
        return Promise.resolve()
    } else {
        return Promise.reject('商品价格必须大于0！')
    }
}
onChange = (value) => { //级联选择完成后的回调
    this.CascaderValue = value
}

// 显示一级列表下拉项
initOptions = async (categorys) => {
    const options = categorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: false
    }))
    // console.log(options);
    // 如果当前是更新, 且商品是一个二级分类的商品 
    const { product, isUpdate } = this
    if (isUpdate && product.pCategoryId !== '0') {
        // 异步获取 product.pCategoryId 的二级分类列表
        const subCategorys = await this.getCategorys(product.categoryId)
        // console.log(subCategorys);
        if (subCategorys && subCategorys.length > 0) {
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 获取级联二级默认的显示值
            const category2 = cOptions.find(item => item.value === product.pCategoryId)
            if (category2) {
                this.categoryShow2 = category2.label
            }
        }
    }
    // 获取级联一级默认的显示值
    const category1 = options.find(item => item.value === product.categoryId)
    if (category1) {
        this.categoryShow1 = category1.label
    }
    this.setState({ options })
}
// 请求获取一级列表项
getCategorys = async (parentId) => {
    const result = await reqCategorys({ parentId })
    // console.log(result);
    // debugger
    if (result.status === 0) {
        const categorys = result.data
        if (parentId === '0') {
            // 根据一级分类数组初始化生成 options 数组
            this.initOptions(categorys)
        } else {
            // 返回二级分类列表(作为 async 函数的 promise 对象的成功的 value 值)
            return categorys
            // console.log(categorys);

        }
    }
}
// 点击获取级联对应二级分类列表
loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    // console.log(targetOption.value);
    // 获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // console.log(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
        // 有子分类 // 生成一个二级的 options 
        const cOptions = subCategorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true,
        })) // 添加为对应的 option 的 children(子 options) 
        targetOption.children = cOptions
    } else { // 没有子分类 
        targetOption.isLeaf = true
    }
    this.setState({
        options: [...this.state.options]
    })
};
componentDidMount = () => {
    this.getCategorys('0') //获取一级列表项
}
UNSAFE_componentWillMount = () => {
    // 取出跳转传入的数据 
    const product = this.props.location.state
    // console.log(product);
    this.product = product || {}
    this.isUpdate = !!product // !!xxx 将一个数据强制转换成布尔类型
}
render() {
    // 表单布局
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 }, //768px 超小屏幕
            sm: { span: 2 },  //小屏幕 平板 (≥768px)
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
    };

    const { product, isUpdate, categoryShow1, categoryShow2 } = this
    const { categoryId, name, price, desc, imgs, detail } = product
    // console.log( imgs);
    // 准备用于级联列表显示的数组 
    const shows = []
    if (isUpdate) {
        if (categoryId === '0') {
            shows.push(categoryShow1)
        } else {
            shows.push(categoryShow1)
            shows.push(categoryShow2)
        }
    }
    return (
        <Card title={<span> <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>{isUpdate?'修改商品':'添加商品'}</span>}>
            <Form
                {...formItemLayout}
                onFinish={this.onFinish}
                initialValues={{ name: name, desc: desc, price: price }}
            >
                <Item
                    name='name'
                    label="商品名称"
                    rules={[{ required: true, message: '请输入商品名称！' }]}>
                    <Input placeholder="请输入商品名称"></Input>
                </Item>
                <Item
                    name='desc'
                    label="商品描述"
                    rules={[{ required: true, message: '请输入商品描述！' }]}>
                    <TextArea
                        placeholder="请输入商品描述"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                    ></TextArea>
                </Item>
                <Item
                    name='price'
                    label="商品价格"
                    rules={[
                        { required: true, message: '请输入商品价格！' },
                        { validator: this.validatorPrice }
                    ]}>
                    <Input type='number' suffix="RMB" placeholder="请输入商品价格"></Input>
                </Item>
                <Item
                    // name='cascader'
                    label="商品分类"
                >
                    <Cascader
                        options={this.state.options}
                        loadData={this.loadData}
                        onChange={this.onChange}
                        defaultValue={shows}
                        key={shows}


                    />
                </Item>
                <Item
                    label="上传图片">
                    <PictureUpload ref={this.imgref} imgs={imgs}></PictureUpload>
                </Item>
                <Item
                    wrapperCol={{ span: 20 }}
                    label="商品详情">
                    <RichTextEditor ref={this.editorRef} detail={detail} ></RichTextEditor>
                </Item>
                <Item >
                    <Button type='primary' htmlType="submit" >提交</Button>
                </Item>
            </Form>
        </Card>
    )
}
}

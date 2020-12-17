import React, { Component } from 'react'
import { Card, Button, Select, Input ,Table, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
 
import LinkButton from "../../components/link-button";
import { reqProducts,reqSearchProducts } from "../../api/index";
import { PAGE_SIZE } from "../../utils/pagesize/pagesize";
import { reqUpdateStatus } from "../../api/index";

const Option = Select.Option

export default class ProductHome extends Component {
    state = {
        
        products: [] ,//商品列表
        total: 0,
        searchName: '',
        searchType: 'productName' // 搜索类型 productName / productDesc
            
            
    } 
    getProducts = async (pageNum) => {
        this.pageNum = pageNum  //保存当前页码
        // console.log(this.pageNum);
        let result
        const { searchType, searchName } = this.state
        if (searchName) {//当searchName有值时，为搜索分页
             result = await reqSearchProducts({ pageNum, pageSize:PAGE_SIZE,searchType,searchName})
        } else {//没有值时，为总的一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        // console.log(result);
        const {list ,total}=result.data
        if (result.status===0) {
            this.setState({
                total: total,
                products: list
            })
        }
    }
    updateStatus =  async(_id, newStatus) => {
        const result = await reqUpdateStatus(_id, newStatus)
        if (result.status===0) {
            message.success('更新成功')
            this.getProducts(this.pageNum)
        }
    }
    componentDidMount = () => {
        this.getProducts(1)
    }
    // 初始化TABLE 的列项
    UNSAFE_componentWillMount = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',

            },
            {
                title: '商品描述',
                dataIndex: 'desc',

            },
            {
                title: '商品描述',
                dataIndex: 'price',
                render: (price) => '￥' + price

            },
            {
                title: '状态',
                width: 100,
                render: (products) => {
                    const { status, _id } = products //products为此时的商品信息
                    const newStatus = status===1?2:1
                    return (
                    <span>
                            <Button type='primary' onClick={() => this.updateStatus(_id, newStatus)}>
                                {status===1?'下架':'上架'}</Button>
                            < span >{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail', { product})}>详情</LinkButton>
                            <span><LinkButton onClick={() => this.props.history.push('/product/addupdate', product )}>修改</LinkButton></span>
                        </span>
                    )
                }
            }
        ];
    }
    render() {
        const { total, searchType } = this.state
        // console.log(searchType);

        const title = (
            <span>
                <Select defaultValue={searchType} style={{ width: 150 }}
                    onChange={value => this.setState({ searchType:value})}>
                <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
            </Select>
                <Input style={{ width: 150, margin: '0 15px' }}
                    onChange={e => this.setState({ searchName: e.target.value })}></Input>
                <Button type='primary'onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        return (
            <Card title={title} extra={<Button type='primary' icon={<PlusOutlined />}
                onClick={() => this.props.history.push('/product/addupdate')}>添加</Button>}>
                <Table
                    columns={this.columns}
                    dataSource={this.state.products}
                    bordered
                    rowKey={'_id'}
                    pagination={{
                        current:this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: (pageNum) => this.getProducts(pageNum, PAGE_SIZE)
                    }}
                    // loading={loading}
                />
            </Card>
        )
    }
}

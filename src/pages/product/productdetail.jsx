import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import { reqCategory } from "../../api/index";

const Item = List.Item

export default class ProductDetail extends Component {
    state = {
        cName1: '',//一级分类名称
        cName2:''  //二级分类名称
    }
    componentDidMount =  async() => {
        const { pCategoryId, categoryId } = this.props.location.state.product
        // console.log(pCategoryId, categoryId);
        // debugger
        if (categoryId === '0') {//此时为一级分类下的商品，获取对应一级分类的名称
            const result = await reqCategory(pCategoryId)
            // debugger
            const cName1 = result.data.name
            // console.log(cName1);
            this.setState({ cName1 })
        } else {
            // 此时为二级分类下的商品，获取一级和二级名称
            /*一次发多个请求, 等所有请求都返回后一起处理, 如果有一个请求出错了, 
            整个都会失败 
            Promise.all([promise1, promise2]) 返回值一个 promise 对象, 
            异步成功返回的是 [result1, result2] */
            const results = await Promise.all([reqCategory(categoryId), reqCategory(pCategoryId)])
            const result1 = results[0]
            const result2 = results[1]
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            this.setState({ cName1, cName2 })
        }
        }
    
    render() {
        const { name, price, desc, imgs, detail } = this.props.location.state.product
        // console.log(imgs);
        const { cName2, cName1 } = this.state

        // console.log(name, price, desc, imgs, detail);

        // let data = [
        //     {
        //         item: '商品名称:',
        //         data: [name]
        //     },
        //     {
        //         item: '商品描述: ',
        //         data: [desc]
        //     },
        //     {
        //         item: '商品价格:',
        //         data: '￥'+[price]
        //     },
        //     {
        //         item: '所属分类: ',
        //         data: '笔记本电脑'
        //     },
        //     {
        //         item: '商品图片:',
        //         data:
        //             [imgs].map(img => <img key={img} src={img} alt='img'></img>)
        //     },
        //     {
        //         item: '商品详情: ',
        //         data: <div dangerouslySetInnerHTML={{ __html: <h1>'123'</h1> }}></div>
        //     }
        // ]
        return (
            <Card title={<span> <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>商品详情</span>}>
                <List >
                    <Item className='product'>
                        <span className='product-left'>商品名称:</span>
                        {name}
                    </Item>
                    <Item className='product'>
                        <span className='product-left'>商品描述:</span>
                        {desc}
                    </Item>
                    <Item className='product'>
                        <span className='product-left'>商品价格:</span>
                        ￥{price}
                    </Item>
                    <Item className='product'>
                        <span className='product-left'>所属分类:</span>
                        {cName1}{ cName2?'>'+cName2:''}
                    </Item>
                    <Item className='product'>
                        <span className='product-left'>商品图片:</span>
                        <span>
                         {
                                imgs.map(img => <img className='product-img' key={img} src={'http://localhost:5000/upload/' + img} alt='img'></img>)
                        }
                        </span>
                            
                    </Item>
                    <Item className='product'>
                        <span className='product-left'>商品详情:</span>
                        <div dangerouslySetInnerHTML={{ __html: detail }}></div>
                    </Item>
                </List>
            </Card>


            // <List
            //     header={<span> <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>商品详情</span>}
            //     bordered
            //     dataSource={data}
            //     renderItem={item => <List.Item>
            //         <span className='product-left'>{item.item}</span>
            //         <span>{item.data}</span>
            //     </List.Item>}
            // />
        )
    }
}

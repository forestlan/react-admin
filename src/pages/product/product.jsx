import React, { Component } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'

import AddUpdate from './add-update'
import ProductDetail from './productdetail'
import ProductHome from './producthome'
import './product.less'


export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Route path='/product/addupdate' component={AddUpdate}></Route>
                <Redirect to='/product'></Redirect>
           </Switch>
        )
    }
}

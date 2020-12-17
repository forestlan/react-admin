import React, { Component } from 'react'
import { Tree, Form, Input } from 'antd'
import PropTypes from 'prop-types'
import { menuList2 } from "../../config/menuConfig";

export default class AuthRole extends Component {
    static propTypes = {
        role: PropTypes.object
    }
    constructor(props) {
        super(props)
        // 根据传入角色的 menus 生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    /*为父组件提交获取最新 menus 数据的方法 */
    getMenus = () => this.state.checkedKeys
    // 复选框选中回调
    onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys);
        this.setState({
            checkedKeys
        }, () => {
                // console.log(checkedKeys);
                this.props.getKeys(checkedKeys)
        })
    }
    // 根据新传入的 role 来更新 checkedKeys 状态 
    /*当组件接收到新的属性时自动调用 */
    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        this.setState({ checkedKeys: menus })
    }
    render() {
        const role = this.props.role
        return (
            <div>
                <Form.Item label='角色名称'>
                    <Input value={role.name} disabled></Input>
                </Form.Item>
                <Form.Item >
                    <Tree
                        checkable
                        defaultExpandAll
                        treeData={menuList2}
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onCheck}
                    >
                    </Tree>
                </Form.Item>

            </div>
        )
    }
}

import React, { Component } from 'react'
import { Card, Button } from 'antd'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
/*
后台管理的折线图路由组件 
*/
export default class Bar extends Component {
    state = {
        sales: [5, 20, 36, 10, 10, 20],
        inventorys: [15, 30, 46, 20, 20, 40]
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            inventorys: state.inventorys.map(inventory => inventory - 1)
        }))
    }
    componentDidMount() {
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }, {
                name: '库存',
                type: 'line',
                data: [15, 10, 5, 16, 10, 14]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='折线图一'>
                    <div id="main" style={{ width: 1000, height: 450 }}></div>
                </Card>
            </div>
        )
    }
}


// 将menu数据提取出来动态生成

import {
    HomeOutlined,
    AppstoreOutlined,
    AreaChartOutlined,
    UserOutlined,
    ClusterOutlined
} from '@ant-design/icons'

export const menuList = [
    {
        title: '首页',
        key: '/home',
        isPublic:true,
        icon: <HomeOutlined />
    },
    {
        title: '商品',
        key: '/sub1',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: <AppstoreOutlined />
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <AppstoreOutlined />
            }
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined />
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <ClusterOutlined />
    },
    {
        title: '图形图表',
        key: '/sub2',
        icon: <AreaChartOutlined />,
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: <AreaChartOutlined />
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <AreaChartOutlined />
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: <AreaChartOutlined />
            }
        ]
    }
]
export const menuList2 = [
    {
        title: '平台权限',
        key: '/all',
        children:[
        {
            title: '首页',
            key: '/home',
        },
        {
            title: '商品',
            key: '/sub1',
            children: [
                {
                    title: '品类管理',
                    key: '/category',
                },
                {
                    title: '商品管理',
                    key: '/product',
                }
            ]
        },
        {
            title: '用户管理',
            key: '/user',
        },
        {
            title: '角色管理',
            key: '/role',
        },
        {
            title: '图形图表',
            key: '/sub2',
            children: [
                {
                    title: '柱形图',
                    key: '/charts/bar',
                },
                {
                    title: '折线图',
                    key: '/charts/line',
                },
                {
                    title: '饼图',
                    key: '/charts/pie',
                }
            ]
        }
        ]
    }
    
]

    


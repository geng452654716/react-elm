import React from 'react'

import Login from '../../page/Login'
import Home from '../../page/Home'

import UserList from '../../page/Data/UserList'
import ShopList from '../../page/Data/ShopList'
import FoodList from '../../page/Data/FoodList'
import OrderList from '../../page/Data/OrderList'
import AdminList from '../../page/Data/AdminList'

import AddShop from '../../page/AddData/AddShop'
import AddGoods from '../../page/AddData/AddGoods'

import Chart from '../../page/Chart'
import Edit from '../../page/Edit'
import Settings from '../../page/Settings'
import Explain from '../../page/Explain'

export const MenuData = [
    {
        name:'首页',
        path:'/',
        key:'index',
        icon:'appstore',
        exact: true,
        render: (children) => <Home children={children}/>
    },
    {
        name:'数据管理',
        key:'data',
        icon:'file',
        children:[
            {
                name:'用户列表',
                path:'/data/userList',
                key:'userList',
                exact: false,
                render: () => <UserList/>
            },
            {
                name:'商家列表',
                path:'/data/shopList',
                key:'shopList',
                exact: false,
                render: () => <ShopList/>
            },
            {
                name:'食品列表',
                path:'/data/foodList',
                key:'foodList',
                exact: false,
                render: () => <FoodList/>
            },
            {
                name:'订单列表',
                path:'/data/orderList',
                key:'orderList',
                exact: false,
                render: () => <OrderList/>
            },
            {
                name:'管理员列表',
                path:'/data/adminList',
                key:'adminList',
                exact: false,
                render: () => <AdminList/>
            }
        ]
    },
    {
        name:'添加数据',
        key:'addData',
        icon:'plus',
        children:[
            {
                name:'添加商铺',
                path:'/addData/addShop',
                key:'addShop',
                exact: false,
                render: () => <AddShop/>
            },
            {
                name:'添加食品',
                path:'/addData/addGoods',
                key:'addGoods',
                exact: false,
                render: () => <AddGoods/>
            }
        ]
    },
    {
        name:'图表',
        key:'chart',
        icon:'dot-chart',
        children:[
            {
                name:'用户分布',
                path:'/chart/user',
                key:'user',
                exact: false,
                render: () => <Chart/>
            }
        ]
    },
    {
        name:'编辑',
        key:'edit',
        icon:'edit',
        children:[
            {
                name:'文本编辑',
                path:'/edit/text',
                key:'text',
                exact: false,
                render: () => <Edit/>
            }
        ]
    },
    {
        name:'设置',
        key:'settings',
        icon:'setting',
        children:[
            {
                name:'管理员设置',
                path:'/settings/adminSettings',
                key:'adminSettings',
                exact: false,
                render: () => <Settings/>
            }
        ]
    },
    {
        name:'说明',
        key:'explains',
        icon:'info-circle-o',
        children:[
            {
                name:'说明',
                path:'/explains/explain',
                key:'explain',
                exact: false,
                render: () => <Explain />
            }
        ]
    }
]

//登录前路由数据
export const loginData = [
    {
        path: '/',
        breadcrumbName: '登录',
        exact: true,
        render:()=> <Login />
    },
    {
        path: '*',
        breadcrumbName: '其他全部->登录',
        exact: false,
        render:()=> <Login />
    }
]

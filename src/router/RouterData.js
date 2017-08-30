import React from 'react'

import Login from '../page/Login'
import Home from '../page/Home'

import UserList from '../page/Data/UserList'
import ShopList from '../page/Data/ShopList'
import FoodList from '../page/Data/FoodList'
import OrderList from '../page/Data/OrderList'
import AdminList from '../page/Data/AdminList'

import AddShop from '../page/AddData/AddShop'
import AddGoods from '../page/AddData/AddGoods'

import Chart from '../page/Chart'
import Edit from '../page/Edit'
import Settings from '../page/Settings'
import Explain from '../page/Explain'


 //登录后路由数据
export const routerData = [
    {
        path: '/',
        breadcrumbName: '首页',
        exact: true,
        render: () => <Home/>
    },
    {
        path: '/data/userList',
        breadcrumbName: '数据管理/用户列表',
        exact: false,
        render: () => <UserList/>
    },
    {
        path: '/data/shopList',
        breadcrumbName: '数据管理/商家列表',
        exact: false,
        render: () => <ShopList/>
    },
    {
        path: '/data/foodList',
        breadcrumbName: '数据管理/食品列表',
        exact: false,
        render: () => <FoodList/>
    },
    {
        path: '/data/orderList',
        breadcrumbName: '数据管理/订单列表',
        exact: false,
        render: () => <OrderList/>
    },
    {
        path: '/data/adminList',
        breadcrumbName: '数据管理/管理员列表',
        exact: false,
        render: () => <AdminList/>
    },
    {
        path: '/addData/addShop',
        breadcrumbName: '添加数据/添加商铺',
        exact: false,
        render: () => <AddShop/>
    },
    {
        path: '/addData/addGoods',
        breadcrumbName: '添加数据/添加商品',
        exact: false,
        render: () => <AddGoods/>
    },
    {
        path: '/chart/user',
        breadcrumbName: '图表/用户分布',
        exact: false,
        render: () => <Chart/>
    },
    {
        path: '/settings/adminSettings',
        breadcrumbName: '设置/管理员设置',
        exact: false,
        render: () => <Settings/>
    },
    {
        path: '/explain',
        breadcrumbName: '说明',
        exact: false,
        render: () => <Explain/>
    },
    {
        path: '/edit/text',
        breadcrumbName: '编辑/文本编辑',
        exact: false,
        render: () => <Edit/>
    },
    {
        path: '*',
        breadcrumbName: '其他全部->首页',
        exact: false,
        render: () => <Home/>
    }
]
//登录前路由数据
export const loginData = [
    {
        path: '/',
        breadcrumbName: '登录',
        exact: true,
        render(){
            return <Login userlogin={this.props.userlogin} setUserLogin={this.setUserLogin} setUserInfo={this.setUserInfo}/>
        }
    },
    {
        path: '*',
        breadcrumbName: '其他全部->登录',
        exact: false,
        render(){
            return <Login userlogin={this.props.userlogin} setUserLogin={this.setUserLogin} setUserInfo={this.setUserInfo}/>
        }
    }
]

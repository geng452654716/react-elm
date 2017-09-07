import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout, Breadcrumb,message} from 'antd';
import * as userInfoActionsFromOtherFile from '../action/state'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Home from '../page/Home'

import Menu from '../components/Menu'
import {MenuData,loginData} from '../components/Menu/data'
import HeaderCom from '../components/Header'

const {Header,Sider} = Layout;

class RouterMap extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            collapsed: false, //菜单收起来还是展开
            breadcrumb:[], //面包屑
        }
    }
    //控制菜单展开收起
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    //判断localStorage以前是否登录过
    componentDidMount() {
        //本地有用户信息，存入redux
        if(localStorage.userInfo){
            this.props.userInfoAction.userInfo(JSON.parse(localStorage.userInfo))
            message.success('系统检测到您曾经登录过，已自动登录')
        }
        //本地有城市信息，存入redux
        if(localStorage.city){
            this.props.userInfoAction.city(JSON.parse(localStorage.city))
        }
        //本地有食品分类信息，存入redux
        if(localStorage.assortment){
            this.props.userInfoAction.shopAssortment(JSON.parse(localStorage.assortment))
        }
    }
    render() {
        //登陆后的路由控制
        let routers = MenuData.map((router, index) => {
            return (
                !router.children
                ?
                    router.path
                    ?
                        <Route key={router.key} path={router.path} exact={router.exact} render={router.render}/>
                    :null
                :
                    router.children.map((router,index) => {
                        return(
                            router.path
                            ?
                                <Route key={router.key} path={router.path} exact={router.exact} render={router.render}/>
                            :null
                        )
                    })
            )
        })

        //登录前的路由控制
        let logins = loginData.map((router, index) => {
            return <Route key={index} path={router.path} exact={router.exact} render={router.render.bind(this)}/>
        })

        //菜单属性
        let MenuAttr = {
            collapsed:this.state.collapsed
        }

        //头部属性
        let HeaderAttr = {
            breadcrumb:this.state.breadcrumb
        }


        return (
            <Router>
                <div style={{height:'100%'}}>
                    {this.props.userInfo
                        ? (
                            <Layout style={{height:'100%'}}>
                                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                                    <Menu {...MenuAttr}/>
                                </Sider>
                                <Layout>
                                    {/* 头部 */}
                                    <Header style={{
                                        background: '#fff',
                                        paddingLet: '20px',
                                    }}>
                                        <HeaderCom {...HeaderAttr}/>
                                    </Header>
                                    <Switch>
                                        {routers}
                                        <Route path='*' component={Home}/>
                                    </Switch>
                                </Layout>
                            </Layout>
                        )
                        : (
                            <Switch>
                                {logins}
                            </Switch>
                        )
                    }
                </div>
            </Router>
        )
    }
}


// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoAction:bindActionCreators(userInfoActionsFromOtherFile,dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RouterMap)

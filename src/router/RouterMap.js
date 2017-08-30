import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout, Breadcrumb,message} from 'antd';
import * as userInfoActionsFromOtherFile from '../action'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Menu from '../components/Menu'
import {routerData,loginData} from './RouterData'
import HeaderCom from '../components/Header'

const {Header,Sider} = Layout;

class RouterMap extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            collapsed: false, //菜单收起来还是展开
            breadcrumb:[],//面包屑
        }
    }
    //控制菜单展开收起
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    //获取菜单点击的是谁
    getbreadcrumb = (breadcrumb) => {
        this.setState({breadcrumb})
    }

    //修改redux登录状态
    setUserLogin = (login) => {
        if (login == null) {
            return
        }
        this.props.userInfoActions.userlogin(login)
    }

    //redux 记录用户信息
    setUserInfo = (userName,password) => {
        this.props.userInfoActions.userInfo({
            userName,
            password
        })
    }

    //判断localStorage以前是否登录过
    componentDidMount() {
        if(localStorage.username && localStorage.password){
            this.props.userInfoActions.userlogin(true)
            message.success('检测您曾经登录过，本次自动登录')
            this.props.userInfoActions.userInfo({
                userName:localStorage.username,
                password:localStorage.password
            })
        }
        this.setVip();
    }

    //判断用户是否VIP
    setVip = () => {
        if(localStorage.username === 'admin'){
            this.props.userInfoActions.VIP(true)
        }else{
            this.props.userInfoActions.VIP(false)
        }
    }
    render() {
        //登陆后的路由控制
        let routers = routerData.map((router, index) => {
            return <Route key={index} path={router.path} exact={router.exact} render={router.render}/>
        })

        //登录前的路由控制
        let logins = loginData.map((router, index) => {
            return <Route key={index} path={router.path} exact={router.exact} render={router.render.bind(this)}/>
        })


        let MenuAttr = {
            collapsed:this.state.collapsed,
            selected:this.state.selected,
            getbreadcrumb:this.getbreadcrumb
        }

        let HeaderAttr = {
            breadcrumb:this.state.breadcrumb,
            userloain:this.state.userloain,
            setUserLogin:this.setUserLogin,
            setUserInfo:this.setUserInfo
        }
        return (
            <Router>
                <div style={{height:'100%'}}>
                    {this.props.userlogin
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
    return {
        userlogin: state.userlogin,
        VIP:state.VIP,
        userName:state.userName
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RouterMap)

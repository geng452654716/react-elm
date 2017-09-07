import React from 'react'
import {Breadcrumb,Avatar,Menu,Dropdown,message,Spin} from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import * as userInfoActionsFromOtherFile from '../../action/state'
import {bindActionCreators} from 'redux'


import './style.css'

import * as fetch from '../../fetch'

class Header extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            spin:false, //等待框是否显示
        }
    }

    //头像下方菜单点击事件
    click = (e) => {
        let _this = this;
        if(e.key === '2'){
            _this.setState({spin:true})
            fetch.outLogin()
            .then(res=>res.json())
            .then((json) => {
                if(json.status === 1){
                    localStorage.clear();
                    _this.props.userInfoActions.userInfo(null);
                    message.success('退出成功');
                }else{
                    _this.setState({spin:false})
                    message.success('退出失败,稍后再试');
                }
            })
        }
    }

    componentWillUnmount(){
        this.setState({spin:false})
    }
    render() {
        let {breadcrumb,userInfo} = this.props;
        breadcrumb = breadcrumb.map((e,i) => {
            let style = {
                color:'#97a8be',
            }
            return <Breadcrumb.Item key={i} style={i===(breadcrumb.length-1)?style:{}}>{e}</Breadcrumb.Item>
        })
        let menu = (
            <Menu onClick={this.click}>
                <Menu.Item key='1'>
                    <Link to='/'>首页</Link>
                </Menu.Item>
                <Menu.Item key='2'>
                    <Link to='/'>退出</Link>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className='header clear'>
                <Breadcrumb style={{float:'left'}}>
                    <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
                    {breadcrumb}
                </Breadcrumb>
                <Dropdown overlay={menu}>
                    <Avatar shape="square" size="large" src={`http://ovi8yxbuf.bkt.clouddn.com/${userInfo.data.avatar}`} style={{float:'right',marginTop:'12px'}}
                        className='header-pic'
                    />
                </Dropdown>
                {
                    this.state.spin?
                    <Spin style={{position: 'fixed',left: '50%',top: '50%',zIndex: '99'}}/>
                    :null
                }
            </div>
        )
    }
}

/* ********************    react-redux 数据绑定    ******************************* */
function mapStateToProps(state) {
    return {
        breadcrumb:state.breadcrumb,
        userInfo:state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActions:bindActionCreators(userInfoActionsFromOtherFile,dispatch)
    }
}
export default Header =  connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

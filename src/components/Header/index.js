import React from 'react'
import {Breadcrumb,Avatar,Menu,Dropdown,message,Spin} from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router-dom'
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
    click = (e) => {
        this.setState({spin:true})
        let _this = this;
        if(e.key === '2'){
            fetch.outLogin(function(data){
                if(data.status === 1){
                    _this.props.setUserLogin(false);
                    _this.props.setUserInfo({
                        userName:null,
                        password:null,
                    })
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
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
        let {breadcrumb,userloain} = this.props;
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
                    退出
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
                    <Avatar shape="square" size="large" icon="user" style={{float:'right',marginTop:'12px'}}
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
export default Header

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

import {Input, Button, Form, Icon,message,Spin} from 'antd'
import * as fetch from '../../fetch'

import './style.css'

const FormItem = Form.Item;

class Login extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            spin:false, //等待框是否显示
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let fromData = this.props.form.getFieldsValue();
        this.setState({spin:true});
        let _this = this;
        //登录请求
        fetch.login(fromData.userName,fromData.password,function(data){
            //请求成功
            if(data.status === 1){
                localStorage.username = fromData.userName;
                localStorage.password = fromData.password;
                message.success('登录成功')
                _this.setState({spin:false})
                _this.props.form.setFields

                //更新redux
                _this.props.setUserLogin(true);
                //redux 记录用户信息
                _this.props.setUserInfo(fromData.userName,fromData.password)
                
            }else if(data.status === 0){
                message.error('密码错误')
                _this.setState({spin:false})
            }else{
                message.error('登录失败')
                _this.setState({spin:false})
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div id='login'>
                <div className='login-warp'>
                    <p>csm后台管理系统</p>
                    <div className='login-box'>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入用户名'
                                        }
                                    ]
                                })(
                                    <Input prefix={< Icon type = "user" style = {{ fontSize: 13 }}/>} placeholder="用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码'
                                        }
                                    ]
                                })(
                                    <Input prefix={< Icon type = "lock" style = {{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                        <p className='tip'>温馨提示：</p>
                        <p className='tip'>未登录过的新用户，自动注册</p>
                        <p className='tip'>注册过的用户可凭账号密码登录</p>
                        {
                            this.state.spin?
                            <Spin style={{position: 'fixed',left: '50%',top: '50%',zIndex: '99'}}/>
                            :null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Login = Form.create({})(Login);

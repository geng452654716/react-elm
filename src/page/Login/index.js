import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userInfoActionsFromOtherFile from '../../action/state'
import * as userInfoActionsFetchMiddle from '../../action/fetchMiddle'

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
        fetch.login(fromData.userName,fromData.password)
        .then(res=>res.json())
        .then((json) => {
            //请求成功
            if(json.status === 1){
                message.success('登录成功')
                _this.setState({spin:false})

                //更新redux用户信息
                _this.props.userInfoActionsFetchMiddle.setUserInfo();
                //更新城市信息
                _this.props.userInfoActionsFetchMiddle.getCity();
            }else{
                message.error(json.message)
                _this.setState({spin:false})
            }
        }).catch(()=>{
            message.error('网络超时，请检查网络后再试')
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


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
    }
}
Login =  connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)

export default  Form.create()(Login);

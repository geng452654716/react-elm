import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout} from 'antd';

//redux
import * as userInfoActionsMiddle from '../../action/middle'
import * as userInfoActionsFetchMiddle from '../../action/fetchMiddle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'

const {Content} = Layout;

class Explain extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)
    }
    render() {
        let style = {
            marginBottom:'10px'
        }
        return (
            <div>
                <Content style={{
                    marginTop: '10px'
                }}>
                    <div style={{
                        padding: 24,
                        background: '#fff',
                        minHeight: 360,
                        textAlign:'center',
                        fontSize:'20px',
                    }}>
                        <p style={style}>node-csm后台管理系统</p>
                        <p style={style}>第一次登录的用户自动注册成为普通管理员</p>
                        <p style={style}>普通管理员可以添加，修改信息</p>
                        <p style={style}>超级管理员可以删除信息</p>
                    </div>
                </Content>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        userInfo:state.userInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Explain)

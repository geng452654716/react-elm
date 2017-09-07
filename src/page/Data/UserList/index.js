import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,message,Table} from 'antd';

//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'
import {getUserList,getUserNumber} from '../../../fetch/index'

const {Content} = Layout;

class UserList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            userList : [],
            dataNumber:0,
            loading:true,
        }
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)

        //获取用户列表
        getUserList()
        .then(response=>response.json())
        .then((json) => {
            this.setState({userList:json,loading:false})
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })

        //获取用户总量
        getUserNumber()
        .then(response=>response.json())
        .then((json) => {
            if(json.status === 1){
                this.setState({dataNumber:json.count})
            }
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })
    }
    getData = () => {
        let {userList} = this.state;
        let data = [];
        userList.forEach((e,i) => {
            data.push({
                user_id:e.user_id,
                registe_time:e.registe_time,
                username:e.username,
                city:e.city,
                key:+new Date + Math.random(),
            })
        })
        return data;
    }
    pagination = (page) => {
        this.setState({loading:true})
        //获取用户列表
        getUserList(page)
        .then(response=>response.json())
        .then((json) => {
            this.setState({userList:json,loading:false})
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })
    }
    render(){
        let columns  = [
            { title: '用户id', dataIndex: 'user_id', key: 'user_id',width:'25%'},
            { title: '注册日期', dataIndex: 'registe_time', key: 'registe_time',width:'30%'},
            { title: '用户姓名', dataIndex: 'username', key: 'username',width:'20%' },
            { title: '注册地址', dataIndex: 'city', key: 'city',width:'20%' }
        ]
        let data = this.getData();
        return(
            <Content style={{
                marginTop:'10px'
            }}>
                <div style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360,
                }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={this.state.loading}
                    pagination={
                        {
                            showQuickJumper:true,
                            onChange:this.pagination,
                            total:this.state.dataNumber,
                        }
                    }
                    expandedRowRender={this.expandedRowRender}
                    onExpand = {this.onExpand}
                />
                </div>
            </Content>
        )
    }
}


// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle:bindActionCreators(userInfoActionsMiddle,dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList)

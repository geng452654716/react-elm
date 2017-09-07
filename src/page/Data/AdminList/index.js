import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,message,Table} from 'antd';

//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'
import {getAdminList,getAdminNumber} from '../../../fetch/index'

const {Content} = Layout;

class AdminList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            adminList : [],
            dataNumber:0,
            loading:true,
        }
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)

        //获取管理员列表
        getAdminList()
        .then(response=>response.json())
        .then((json) => {
            this.setState({adminList:json.data,loading:false})
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })

        //获取管理员总量
        getAdminNumber()
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
        let {adminList} = this.state;
        let data = [];
        adminList.forEach((e,i) => {
            data.push({
                id:e.id,
                create_time:e.create_time,
                user_name:e.user_name,
                city:e.city,
                admin:e.admin,
                key:+new Date + Math.random(),
            })
        })
        return data;
    }
    pagination = (page) => {
        this.setState({loading:true})
        //获取用户列表
        getAdminList(page)
        .then(response=>response.json())
        .then((json) => {
            this.setState({adminList:json.data,loading:false})
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })
    }
    render(){
        let columns  = [
            { title: '管理员ID', dataIndex: 'id', key: 'id'},
            { title: '姓名', dataIndex: 'user_name', key: 'user_name'},
            { title: '注册日期', dataIndex: 'create_time', key: 'create_time'},
            { title: '地址', dataIndex: 'city', key: 'city'},
            { title: '权限', dataIndex: 'admin', key: 'admin'}
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
)(AdminList)

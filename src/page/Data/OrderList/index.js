import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,message,Table} from 'antd';

//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'
import {getOrderList,getOrderNumber} from '../../../fetch/index'

const {Content} = Layout;

class OrderList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            orderList : [],
            dataNumber:0,
            loading:true,
        }
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)

        //获取订单列表
        getOrderList()
        .then(response=>response.json())
        .then((json) => {
            this.setState({orderList:json,loading:false})
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试')
        })

        //获取订单总量
        getOrderNumber()
        .then(response=>response.json())
        .then((json) => {
            if(json.status === 1){
                this.setState({dataNumber:json.count})
            }
        })
    }
    getData = () => {
        let {orderList} = this.state;
        let data = [];
        orderList.forEach((e,i) => {
            data.push({
                unique_id:e.unique_id, //订单ID
                total_amount:e.total_amount, //总价
                status_bar:e.status_bar.title, //订单状态
                key:+new Date + Math.random(),
                restaurant_id:e.restaurant_id, //餐馆ID
                user_id:e.user_id  //用户ID
            })
        })
        return data;
    }
    pagination = (page) => {
        this.setState({loading:true})
        //获取订单列表
        getOrderList(page)
        .then(response=>response.json())
        .then((json) => {
            this.setState({orderList:json,loading:true})
        })
    }
    render(){
        let columns  = [
            { title: '订单 ID', dataIndex: 'unique_id', key: 'unique_id'},
            { title: '总价格', dataIndex: 'total_amount', key: 'total_amount'},
            { title: '订单状态', dataIndex: 'status_bar', key: 'status_bar'}
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
)(OrderList)

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,Table,Button,message,Modal,Form,Select,Cascader,Upload,Icon,Spin,Input} from 'antd';
import * as fetch from '../../../fetch/index'
import {Redirect,Link} from 'react-router-dom'

//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import * as userInfoActionsFetchMiddle from '../../../action/fetchMiddle'
import * as userInfoActionsState from '../../../action/state'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'
import './style.css'
import EditShop from './editShop'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class ShopList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            loading:true,
            removeShop:{
                status:false,
                record:{},
            },
            dataNumber:0,
            editShop:{
                status:false,
                record:{},
            }
        }
    }
    componentDidMount() {

        let {city,shopPage,shopAllList} = this.props;
        //面包屑更新
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)

        //表单数据导入
        if(shopAllList == null){
            this.props.userInfoActionsFetchMiddle.getShopAllList(city.latitude,city.longitude,shopPage,() => {
                this.setState({loading:false})
            });
        }

        if(shopAllList){
            this.setState({loading:false})
        }
        fetch.getShopNumber()
        .then(response=>response.json())
        .then((json) => {
            if(json.status === 1){
                this.setState({dataNumber:json.count})
            }else{
                message.error(json.message);
            }
        }).catch(() => {
            message.error('获取数据总数失败，请检查网络再试')
        })
    }

    //获取表格数据
    getData = () => {
        let data = [];
        let {shopAllList} = this.props;
        if(shopAllList){
            shopAllList.forEach((e,i) => {
                data.push(
                    {
                        key: e.id,
                        name: e.name,
                        address: e.address,
                        introduce:e.description,
                        id:e.id,
                        phone:e.phone,
                        recent_order_num:e.recent_order_num,
                        category:e.category,
                        rating:e.rating,
                        image_path:e.image_path
                    }
                )
            })
        }
        return data;
    }

    //删除触发模态框
    removeShop = (record) => {
        let {userInfo} = this.props;
        if(userInfo.data.status === 2){
            this.setState({
                removeShop: {
                    status:true,
                    record,
                }
            });
        }else{
            message.error('权限不足，请联系管理员')
        }
    }
    //删除模态框确认
    removeOk = (e) => {
        let {city,shopPage,shopAllList}= this.props;

        fetch.removeShop(this.state.removeShop.record.id)
        .then(response =>response.json())
        .then(json=>{
            if(json.status === 1){
                this.setState({
                    removeShop: {
                        status:false,
                        record:{},
                    }
                });
                this.props.userInfoActionsFetchMiddle.getShopAllList(city.latitude,city.longitude);
                this.props.userInfoActionsState.changeShopPage(1);
                message.success('删除成功')
            }else{
                message.error(json.message);
            }
        }).catch(() => {
            message.error('删除失败，请检查网络再试')
        })
    }
    //删除模态框取消
    removeCancel = (e) => {
        let removeShop = {};
        Object.assign(removeShop,this.state.removeShop,{
            status:false
        })
        this.setState({removeShop});
        message.error('管理员取消删除')
    }
    //列表打开时触发详情
    expandedRowRender = (record) => {
        return (
            <div className='clear'>
                <div className='shopList-details'>
                    <span className='shopList-title'>店铺名称</span>
                    <span className='shopList-value'>{record.name}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>店铺地址</span>
                    <span className='shopList-value'>{record.address}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>店铺介绍</span>
                    <span className='shopList-value'>{record.introduce}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>店铺ID</span>
                    <span className='shopList-value'>{record.id}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>联系电话</span>
                    <span className='shopList-value'>{record.phone}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>评分</span>
                    <span className='shopList-value'>{record.rating}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>销量</span>
                    <span className='shopList-value'>{record.recent_order_num}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>分类</span>
                    <span className='shopList-value'>{record.category}</span>
                </div>
            </div>
        )
    }
    //页数跳转请求数据
    pagination = (page) => {
        let {city,shopAllList}= this.props;
        //修改redux店铺数据
        this.props.userInfoActionsFetchMiddle.getShopAllList(city.latitude,city.longitude,page);
        //修改redux店铺页码的数据
        this.props.userInfoActionsState.changeShopPage(page);
    }
    //编辑商铺触发模态框
    editShop = (record) => {
        this.setState({
            editShop:{
                record,
                status:true,
            }
        })
    }
    //关闭编辑模态框
    editOpen = (json) => {
        this.setState({editShop:json})
    }
    //跳转添加食品
    addGood = (record) => {
        console.log (record.id)
        return <Redirect to={`/addData/addGoods${record.id}`}/>

    }
    render(){
        let columns  = [
            { title: '店铺名称', dataIndex: 'name', key: 'name',width:'25%'},
            { title: '店铺地址', dataIndex: 'address', key: 'address',width:'30%'},
            { title: '店铺介绍', dataIndex: 'introduce', key: 'introduce',width:'20%' },
            {
                 title: '操作',
                 key: 'Action',
                 width:'25%',
                render: (text,record) =>{
                    return (
                        <div>
                            <Button type="danger" onClick={()=>{this.editShop(record)}} className='shopList-btn'>编辑</Button>
                        <Button type="danger" onClick={()=>{this.addGood(record)}} className='shopList-btn'><Link to={`/addData/addGoods/${record.id}`}>添加食品</Link></Button>
                            <Button type="danger" onClick={()=>{this.removeShop(record)}} className='shopList-btn shopList-red'>删除</Button>
                        </div>
                    )
                }
            }
        ]
        let data = this.getData();
        let {editShop} = this.state;
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
                            current:this.props.shopPage
                        }
                    }
                    expandedRowRender={this.expandedRowRender}
                    onRowClick={this.onRowClick}
                />
                </div>
                <Modal
                  visible={this.state.removeShop.status}
                  onOk={this.removeOk}
                  onCancel={this.removeCancel}
                >
                  <p>此操作是不可逆转的，确定删除吗？</p>
                </Modal>
                {
                    editShop.record.id
                    ?<EditShop editShop={editShop} editOpen={this.editOpen}/>
                    :null
                }
            </Content>
        )
    }
}


// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        shopAllList:state.shopAllList,
        shopPage:state.shopPage,
        city:state.city,
        userInfo:state.userInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle:bindActionCreators(userInfoActionsMiddle,dispatch),
        userInfoActionsFetchMiddle:bindActionCreators(userInfoActionsFetchMiddle,dispatch),
        userInfoActionsState:bindActionCreators(userInfoActionsState,dispatch),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShopList)

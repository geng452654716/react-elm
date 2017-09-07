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
import EditGoods from './editGoods'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class ShopList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            loading:true,
            removeGoods:{
                status:false,
                record:{},
            },
            dataNumber:0,
            editGoods:{
                status:false,
                record:{},
            },
            shopData:{},
            specsData:{},
        }
    }
    componentDidMount() {

        let {goodsPage,goodsAllList} = this.props;
        //面包屑更新
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)

        //表单数据导入
        if(goodsAllList == null){
            this.props.userInfoActionsFetchMiddle.getGoodsAllList(goodsPage,'',() => {
                this.setState({loading:false})
            });
        }

        if(goodsAllList){
            this.setState({loading:false})
        }
        fetch.getGoodsNumber()
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
        let {goodsAllList} = this.props;
        if(goodsAllList){
            goodsAllList.forEach((e,i) => {
                data.push(
                    {
                        key: e.item_id, //食品ID
                        name: e.name,
                        description:e.description,
                        rating:e.rating,  //评分
                        month_sales:e.month_sales, //月销量
                        restaurant_id:e.restaurant_id, //店铺ID
                        category_id:e.category_id, //食品分类ID
                        specfoods:e.specfoods,  //规格
                        image_path:e.image_path, //食品图片
                    }
                )
            })
        }
        return data;
    }

    //删除触发模态框
    removeGoods = (record) => {
        let {userInfo} = this.props;
        if(userInfo.data.status === 2){
            this.setState({
                removeGoods: {
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
        fetch.removeGoods(this.state.removeGoods.record.key)
        .then(response =>response.json())
        .then(json=>{
            if(json.status === 1){
                this.setState({
                    removeGoods: {
                        status:false,
                        record:{},
                    }
                });
                this.props.userInfoActionsFetchMiddle.getGoodsAllList();
                this.props.userInfoActionsState.changeGoodsPage(1);
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
        let removeGoods = {};
        Object.assign(removeGoods,this.state.removeGoods,{
            status:false
        })
        this.setState({removeGoods});
        message.error('管理员取消删除')
    }

    //列表展开时详情
    expandedRowRender = (record) => {
        let {shopData,specsData} = this.state;
        console.log (shopData,specsData)
        if(!shopData[record.key] || !specsData[record.key]){
            return <Spin style={{margin:'0 auto'}}/>
        }
        return (
            <div className='clear'>
                <div className='shopList-details'>
                    <span className='shopList-title'>食品名称</span>
                    <span className='shopList-value'>{record.name}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>餐馆名称</span>
                    <span className='shopList-value'>{shopData[record.key].name}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>食品 ID</span>
                    <span className='shopList-value'>{record.key}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'> 餐馆 ID</span>
                    <span className='shopList-value'>{record.restaurant_id}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>食品介绍</span>
                    <span className='shopList-value'>{record.description}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>餐馆地址</span>
                    <span className='shopList-value'>{shopData[record.key].address}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>评分</span>
                    <span className='shopList-value'>{record.rating}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>月销量</span>
                    <span className='shopList-value'>{record.month_sales}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>食品分类</span>
                    <span className='shopList-value'>{shopData[record.key].category}</span>
                </div>
                <div className='shopList-details'>
                    <span className='shopList-title'>餐馆分类</span>
                    <span className='shopList-value'>{specsData[record.key].name}</span>
                </div>
            </div>
        )
    }

    //点击展开按钮是请求店铺数据
    onExpand = (expanded, record) => {
        let {shopData,specsData} = this.state;

        if(!shopData[record.key]){
            fetch.fromIdToShopData(record.restaurant_id)
            .then(response=>response.json())
            .then((json) => {
                let newData = {};
                Object.assign(newData,shopData)
                newData[record.key] = json;
                this.setState({shopData:newData})
            })
        }

        if(!specsData[record.key]){
            fetch.fromIdToSpecsData(record.category_id)
            .then(response=>response.json())
            .then((json) => {
                let newData = {};
                Object.assign(newData,specsData)
                newData[record.key] = json;
                this.setState({specsData:newData})
            })
        }
    }

    //页数跳转请求数据
    pagination = (page) => {
        //修改redux店铺数据
        this.props.userInfoActionsFetchMiddle.getGoodsAllList(page);
        //修改redux店铺页码的数据
        this.props.userInfoActionsState.changeGoodsPage(page);
    }

    //编辑食品触发模态框
    editGoods = (record) => {
        this.setState({
            editGoods:{
                record,
                status:true,
            }
        })
    }

    //关闭编辑模态框
    editOpen = (json) => {
        this.setState({editGoods:json})
    }

    render(){
        let columns  = [
            { title: '食品名称', dataIndex: 'name', key: 'name',width:'25%'},
            { title: '食品介绍', dataIndex: 'description', key: 'description',width:'30%'},
            { title: '评分', dataIndex: 'rating', key: 'rating',width:'20%' },
            {
                 title: '操作',
                 key: 'Action',
                 width:'25%',
                render: (text,record) =>{
                    return (
                        <div>
                            <Button type="danger" onClick={()=>{this.editGoods(record)}} className='shopList-btn'>编辑</Button>
                            <Button type="danger" onClick={()=>{this.removeGoods(record)}} className='shopList-btn shopList-red'>删除</Button>
                        </div>
                    )
                }
            }
        ]
        let data = this.getData();
        let {editGoods} = this.state;
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
                            current:this.props.goodsPage
                        }
                    }
                    expandedRowRender={this.expandedRowRender}
                    onExpand = {this.onExpand}
                />
                </div>
                <Modal
                  visible={this.state.removeGoods.status}
                  onOk={this.removeOk}
                  onCancel={this.removeCancel}
                >
                  <p>此操作是不可逆转的，确定删除吗？</p>
                </Modal>
                {
                    editGoods.record.key
                    ?<EditGoods editGoods={editGoods} editOpen={this.editOpen}/>
                    :null
                }
            </Content>
        )
    }
}


// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        userInfo:state.userInfo,
        goodsAllList:state.goodsAllList,
        goodsPage:state.goodsPage
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

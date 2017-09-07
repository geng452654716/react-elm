import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
    Layout,
    Table,
    Button,
    message,
    Modal,
    Form,
    Select,
    Upload,
    Icon,
    Input,
    InputNumber
} from 'antd';
import * as fetch from '../../../../fetch/index'

//redux
import * as userInfoActionsMiddle from '../../../../action/middle'
import * as userInfoActionsFetchMiddle from '../../../../action/fetchMiddle'
import * as userInfoActionsState from '../../../../action/state'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../../components/Menu/data'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class EditShop extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            goodsAvater: '', //食品图片
            specsList:[],   //规格数据
            visible: false, //添加规格模态框
        }
    }

    componentDidMount() {
        let {editGoods,userInfoActionsFetchMiddle} = this.props;
        this.setState({goodsAvater: editGoods.record.image_path})
        //获取食品分类
        userInfoActionsFetchMiddle.getGoodsType(editGoods.record.restaurant_id)
        //设置规格
        let newList = [];
        editGoods.record.specfoods.forEach((e,i) => {
            newList.push({
                specs:e.specs_name,
                packing_fee:e.packing_fee,
                price:e.price,
                key:+new Date + Math.random(),
            })
        })
        this.setState({specsList:newList,goodsAvater:editGoods.record.image_path})
    }

    //上传成功后改变食品图片地址
    changeShopAvater = (info) => {
        if (info.file.status === 'done') {
            this.setState({goodsAvater: info.file.response.image_path})
        }
    }

    //修复下拉框定位问题
    getPopupContainer = (trigger) => {
        return trigger.parentNode;
    }

    //关闭模态框
    editCancel = () => {
        let {editGoods, editOpen} = this.props;
        let newJson = {};
        Object.assign(newJson, editGoods, {
            status: false,
            record: {}
        })
        editOpen(newJson)
    }

    //确定模态框，发布请求
    editOk = () => {
        let getFieldsValue = this.props.form.getFieldsValue();
        let {userInfoActionsFetchMiddle, goodsPage, editGoods,goodsType} = this.props;
        let goodsTypeId = 0;
        goodsType.category_list.forEach((e,i) => {
            if(getFieldsValue.category === e.name){
                goodsTypeId = e.id;
            }
        })
        fetch.changeGoodsInfo({
            item_id:editGoods.record.key,
            name:getFieldsValue.name,
            description:getFieldsValue.description,
            image_path:this.state.goodsAvater,
            restaurant_id:editGoods.record.restaurant_id,
            category_id:editGoods.record.category_id,
            specs:this.state.specsList,
            new_category_id:goodsTypeId,
        }).then(response => response.json()).then((json) => {
            if (json.status === 1) {
                userInfoActionsFetchMiddle.getGoodsAllList(goodsPage)
                message.success('修改店铺成功')
                let {editGoods, editOpen} = this.props;
                let newJson = {};
                Object.assign(newJson, editGoods, {
                    status: false,
                    record: {}
                })
                editOpen(newJson)
            } else {
                message.error(json.message)
            }
        }).catch(() => {
            message.error('网络超时，请稍后再试')
        })
    }

    //删除规格
    removeSpecs = (key) => {
        let {specsList} = this.state;
        let newList = [...specsList];
        newList.forEach((e,i) => {
            if(e.key === key){
                newList.splice(i,1)
            }
        })
        this.setState({specsList:newList})
    }

    //点击添加按钮
    addAttr = () => {
        this.setState({visible: true})
    }

    //点击确认，修改规格数组
    handleOk = () => {
        this.setState({visible: false})
        let getFieldsValue = this.props.form.getFieldsValue();
        let {specsList} = this.state;
        let newList = [...specsList];
        newList.push({
            specs:getFieldsValue.specs,
            packing_fee:getFieldsValue.addPacking_fee,
            price:getFieldsValue.addPrice,
            key:+new Date,
        })
        this.setState({specsList:newList})
        let {setFieldsValue} = this.props.form;
        setFieldsValue({
            specs:'',
            addPacking_fee:0,
            addPrice:20
        })
    }

    //点击取消模态框
    handleCancel = () => {
        this.setState({visible: false})
    }

    render() {
        let {goodsAvater,specsList} = this.state
        let {getFieldDecorator} = this.props.form
        let {editGoods,goodsType} = this.props;
        let props = {
            action: "http://localhost:8001/v1/addimg/food",
            showUploadList: false,
            name: 'file'
        }
        let options = null;
        let initType = '';
        if(goodsType){
            options = goodsType.category_list.map((e, i) => {
                if(e.id === editGoods.record.category_id){
                    initType = e.name;
                }
                return <Option value={e.name} key={e.id}>{e.name}</Option>
            })
        }
        let columns = [
            {
                title: '规格',
                dataIndex: 'specs',
                key: 'specs',
                width:'30%'
            }, {
                title: '包装费',
                dataIndex: 'packing_fee',
                key: 'packing_fee',
                width:'25%'
            }, {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                width:'25%'
            }, {
                title: '操作',
                key: 'action',
                width:'20%',
                render: (text, record) => {
                    return <Button type="danger" onClick={() => {
                        this.removeSpecs(record.key)
                    }}>删除</Button>
                }
            }
        ]
        return (
            <div>
                <Modal title='修改店铺信息' visible={editGoods.status} onOk={this.editOk} onCancel={this.editCancel}>
                    <Form>
                        <FormItem label="食品名称" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入食品名称！'
                                    }
                                ],
                                initialValue: editGoods.record.name
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label="食品介绍" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('description', {initialValue: editGoods.record.description})(<Input/>)}
                        </FormItem>
                        <FormItem label="食品分类" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('category',{initialValue:initType})(
                                <Select placeholder="选择食品分类">
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="上传店铺图片" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('goods-avatar', {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须上传店铺图片！'
                                    }
                                ]
                            })(
                                <Upload className="avatar-uploader" onChange={this.changeShopAvater} {...props}>
                                    {goodsAvater
                                        ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + goodsAvater} alt="" className="avatar"/>
                                        : <Icon type="plus" className="avatar-uploader-trigger"/>
                                    }
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem  wrapperCol={{
                            span: 24
                        }}>
                            {getFieldDecorator('specs')(
                                <Table dataSource={specsList} columns={columns} pagination={{pageSize:3}}></Table>
                            )}
                        </FormItem>
                        <Button type="primary" className='addgood-button' style={{
                            marginBottom: '20px'
                        }} onClick={this.addAttr}>添加规格</Button>
                        <Modal title="添加规格" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                            <FormItem label="规格" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 18
                            }}>
                                {getFieldDecorator('specs', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入规格名称！'
                                        }
                                    ]
                                })(<Input/>)}
                            </FormItem>
                            <FormItem label="包装费" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 6
                            }}>
                                {getFieldDecorator('addPacking_fee', {
                                    initialValue: 0,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写包装费！'
                                        }
                                    ]
                                })(<InputNumber min={0} max={100} />)}
                            </FormItem>
                            <FormItem label="价格" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 6
                            }}>
                                {getFieldDecorator('addPrice', {
                                    initialValue: 20,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写价格！'
                                        }
                                    ]
                                })(<InputNumber min={0} />)}
                            </FormItem>
                        </Modal>
                    </Form>
                </Modal>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        goodsType:state.goodsType,
        goodsAllList:state.goodsAllList,
        goodsPage:state.goodsPage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
        userInfoActionsState: bindActionCreators(userInfoActionsState, dispatch)
    }
}
EditShop = connect(mapStateToProps, mapDispatchToProps)(EditShop)

export default Form.create()(EditShop)

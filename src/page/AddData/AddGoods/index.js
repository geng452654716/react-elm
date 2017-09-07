import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
    Layout,
    Modal,
    Card,
    message,
    Form,
    Input,
    Upload,
    Icon,
    Select,
    Radio,
    Button
} from 'antd';
import {Link, Redirect} from 'react-router-dom'
//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import * as userInfoActionsFetchMiddle from '../../../action/fetchMiddle'
import * as userInfoActionsState from '../../../action/state'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'
import AddGoodsType from './AddGoodsType'
import './style.css'
import GoodsModel from './GoodsModel'
import * as fetch from '../../../fetch/index'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddGoods extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            prompt: false, //弹框是否出现，判断种类是否请求数据
            redirect: true, //是否重定向
            goodType: '', //当前选择的食品种类
            goodAvater: '', //食品头像地址
            specs: 'single', //规格   single:单   many:多
            specsList: [
                {
                    specs: '默认',
                    packing_fee: 0,
                    price: 20,
                    key :+ new Date
                }
            ], // 规格列表
            attributes: [], //食品特点
        }
    }
    componentWillMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)
        if (this.props.children.match.params.id === ':id') {
            this.setState({prompt: true})
        }
    }
    //修复下拉框定位问题
    getPopupContainer = (trigger) => {
        return trigger.parentNode;
    }
    //点击弹框确定后重定向跳转
    handleOk = () => {
        this.setState({prompt: false, redirect: false})
    }
    //取消弹框
    handleCancel = () => {
        this.setState({prompt: false})
    }
    //接受子级传回的食品种类,修改食品种类
    changeGoodType = (goodType) => {
        this.setState({goodType})
    }
    //上传成功后改变食品头像地址
    changeGoodAvater = (info) => {
        if (info.file.status === 'done') {
            this.setState({goodAvater: info.file.response.image_path})
        }
    }
    //改变产品规格
    changeSpecs = (e) => {
        let {specsList} = this.state;
        this.setState({specs: e.target.value});
        if (e.target.value === 'single' && specsList.length == 0) {
            this.setState({
                specsList: [
                    {
                        specs: '默认',
                        packing_fee: 0,
                        price: 20,
                        key :+ new Date
                    }
                ]
            })
        }
    }
    //修改食品特点
    changeGoodAttributes = (value) => {
        let newArr = [];
        value.forEach((e,i) => {
            if(e === 'new'){
                newArr[i] = '新'
            }
            if(e === 'sign'){
                newArr[i] = '招牌'
            }
        })
        console.log (newArr);
        this.setState({
            attributes: newArr
        })
    }
    //改变规格列表
    changeSpecsList = (newList) => {
        this.setState({specsList: newList})
    }
    //提交添加食品请求
    handleSubmit = (e) => {
        e.preventDefault();
        let {goodType, goodAvater, specsList, attributes} = this.state;
        let getFieldsValue = this.props.form.getFieldsValue();
        fetch.addGoods({
            restaurant_id: this.props.children.match.params.id,
            category_id: parseInt(goodType),
            name: getFieldsValue.name,
            image_path: goodAvater,
            specs: specsList,
            description: getFieldsValue.details,
            activity: getFieldsValue.activity,
            attributes: attributes
        }).then(response => response.json()).then(json => {
            if (json.status === 1) {
                this.props.userInfoActionsFetchMiddle.getGoodsAllList();
                this.props.userInfoActionsState.changeGoodsPage(1)
                message.success('添加食品成功')
            } else {
                message.error(json.message)
            }
        }).catch(() => {
            message.error('网络连接超时，请检查网络后再试')
        })
    }
    render() {
        let {children} = this.props;
        if (!this.state.redirect) {
            return <Redirect to='/data/shopList'/>
        }
        let {getFieldDecorator} = this.props.form;
        let {goodAvater, specs, specsList} = this.state;
        let props = {
            action: "http://localhost:8001/v1/addimg/food",
            showUploadList: false,
            name: 'file'
        }
        return (
            <Content style={{
                marginTop: '10px'
            }}>
                <div style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360
                }}>
                    <Modal title="提示" visible={this.state.prompt} onOk={this.handleOk} onCancel={this.handleCancel}>
                        <p>添加食品需要选择一个商铺，现在就去选择商铺吗？</p>
                    </Modal>
                    <AddGoodsType id={children.match.params.id} prompt={this.state.prompt} changeGoodType={this.changeGoodType}/>
                    <div className='addGoods-title'>添加食品</div>
                    <Card className='addgood-warp'>
                        <Form>
                            <FormItem label="食品名称" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 18
                            }}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入食品名称！'
                                        }
                                    ]
                                })(<Input/>)}
                            </FormItem>
                            <FormItem label="食品活动" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 18
                            }}>
                                {getFieldDecorator('activity')(<Input/>)}
                            </FormItem>
                            <FormItem label="食品详情" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 18
                            }}>
                                {getFieldDecorator('details')(<Input/>)}
                            </FormItem>

                            <FormItem label="上传食品图片" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 4
                            }}>
                                {getFieldDecorator('good-avatar', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '必须上传食品图片！'
                                        }
                                    ]
                                })(
                                    <Upload className="avatar-uploader" onChange={this.changeGoodAvater} {...props}>
                                        {goodAvater
                                            ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + goodAvater} alt="" className="avatar"/>
                                            : <Icon type="plus" className="avatar-uploader-trigger"/>
}
                                    </Upload>
                                )}
                            </FormItem>
                            <FormItem label="食品特点" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 6
                            }} className='addGoods'>
                                {getFieldDecorator('characteristic')(
                                    <Select placeholder="请选择食品特点" onChange={this.changeGoodAttributes} mode="multiple" getPopupContainer = {this.getPopupContainer}>
                                        <Option value="new">新品</Option>
                                        <Option value="sign">招牌</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="食品规格" labelCol={{
                                span: 4
                            }} wrapperCol={{
                                span: 6
                            }}>
                                {getFieldDecorator('specifications', {initialValue: specs})(
                                    <RadioGroup onChange={this.changeSpecs}>
                                        <Radio value='single'>单规格</Radio>
                                        <Radio value='many'>多规格</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Form>
                        <GoodsModel specs={specs} specsList={specsList} changeSpecsList={this.changeSpecsList}/>
                        <Button type="primary" className='addgood-button' onClick={this.handleSubmit}>添加食品</Button>
                    </Card>
                </div>
            </Content>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {goodsAllList: state.goodsAllList}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
        userInfoActionsState: bindActionCreators(userInfoActionsState, dispatch)
    }
}
AddGoods = connect(mapStateToProps, mapDispatchToProps)(AddGoods)

export default Form.create()(AddGoods);

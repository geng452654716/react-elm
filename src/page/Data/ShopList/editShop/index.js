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
    Cascader,
    Upload,
    Icon,
    Spin,
    Input
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
            addressValue: '请输入店铺地址！',
            address: [],
            shopAvater: ''
        }
    }
    componentDidMount() {
        let {editShop} = this.props;
        this.setState({shopAvater: editShop.record.image_path})
    }
    //店铺地址请求
    addressFetch = (value, callback) => {
        let timeout = null;
        let currentValue = null;
        let _this = this;
        let {city} = this.props;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        function fake() {
            if (!value) {
                _this.setState({address: []})
                return
            }
            fetch.shopAddress(value, city.id).then(response => response.json()).then((json) => {
                if (currentValue === value) {
                    if (json.push) {
                        _this.setState({address: json})
                    }
                }
            }).catch(() => {
                message.error('网络超时，请检查网络再试')
            })
        }

        timeout = setTimeout(fake, 300);
    }
    //店铺地址变化后更改value
    handleChange = (value) => {
        this.setState({addressValue: value});
        this.addressFetch(value);
    }
    //上传成功后改变地铺头像地址
    changeShopAvater = (info) => {
        if (info.file.status === 'done') {
            this.setState({shopAvater: info.file.response.image_path})
        }
    }
    //修复下拉框定位问题
    getPopupContainer = (trigger) => {
        return trigger.parentNode;
    }
    //关闭模态框
    editCancel = () => {
        let {editShop, editOpen} = this.props;
        let newJson = {};
        Object.assign(newJson, editShop, {
            status: false,
            record: {}
        })
        editOpen(newJson)
    }
    //确定模态框，发布请求
    editOk = () => {
        let getFieldsValue = this.props.form.getFieldsValue();
        let {city, userInfoActionsFetchMiddle, shopPage, editShop} = this.props;
        fetch.changeShopInfo({
            id: editShop.record.id,
            name: getFieldsValue.name,
            address: getFieldsValue.address,
            description: getFieldsValue.introduce,
            phone: getFieldsValue.phone,
            image_path: this.state.shopAvater,
            category: getFieldsValue.assortment.join('/')
        }).then(response => response.json()).then((json) => {
            if (json.status === 1) {
                userInfoActionsFetchMiddle.getShopAllList(city.latitude, city.longitude, shopPage)
                message.success('修改店铺成功')
                let {editShop, editOpen} = this.props;
                let newJson = {};
                console.log (editShop)
                console.log (getFieldsValue.assortment)
                Object.assign(newJson, editShop, {
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

    render() {
        let {address, shopAvater} = this.state
        let {getFieldDecorator} = this.props.form
        const options = address.map(e => <Option key={e.address}>{e.address}</Option>)
        let {editShop} = this.props;
        let props = {
            action: "http://localhost:8001/v1/addimg/avatar",
            showUploadList: false,
            name: 'file'
        }
        return (
            <div>
                <Modal title='修改店铺信息' visible={editShop.status} onOk={this.editOk} onCancel={this.editCancel}>
                    <Form>
                        <FormItem label="店铺名称" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入店铺名称！'
                                    }
                                ],
                                initialValue: editShop.record.name
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label="详细地址" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('address', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入店铺地址！'
                                    }
                                ],
                                initialValue: editShop.record.address
                            })(
                                <Select placeholder={this.state.addressValue} getPopupContainer={this.getPopupContainer} mode="combobox" showArrow={false} defaultActiveFirstOption={false} filterOption={false} onChange={this.handleChange}>
                                    {address.length
                                        ? options
                                        : <Option value="正在加载中" className='addshop-warp'><Spin className='addshop-login'/></Option>
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="店铺简介" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('introduce', {initialValue: editShop.record.introduce})(<Input/>)}
                        </FormItem>
                        <FormItem label="联系电话" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^1[34587]\d{9}$/,
                                        message: '联系电话输入不正确'
                                    }
                                ],
                                initialValue: editShop.record.phone
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label="店铺分类" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 17
                        }}>
                            {getFieldDecorator('assortment', {
                                initialValue: editShop.record.category.split('/'),
                                rules: [
                                    {
                                        type: 'array',
                                        required: true,
                                        message: '请填写食品分类'
                                    }
                                ]
                            })(<Cascader options={this.props.assortment} changeOnSelect placeholder='请选择' getPopupContainer={this.getPopupContainer}/>)}
                        </FormItem>
                        <FormItem label="上传店铺图片" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('shop-avatar', {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须上传店铺图片！'
                                    }
                                ]
                            })(
                                <Upload className="avatar-uploader" onChange={this.changeShopAvater} {...props}>
                                    {shopAvater
                                        ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + shopAvater} alt="" className="avatar"/>
                                        : <Icon type="plus" className="avatar-uploader-trigger"/>
}
                                </Upload>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {shopAllList: state.shopAllList, shopPage: state.shopPage, city: state.city, assortment: state.assortment}
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

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
    Layout,
    Form,
    Select,
    Input,
    Button,
    Spin,
    Cascader,
    Switch,
    InputNumber,
    TimePicker,
    Upload,
    Icon,
    Modal,
    Table,
    Popconfirm
} from 'antd';

import {MenuData} from '../../../components/Menu/data'
import * as fetch from '../../../fetch/index'

//redux
import * as userInfoActionsMiddle from '../../../action/middle'
import * as userInfoActionsFetchMiddle from '../../../action/fetchMiddle'
import * as userInfoActionsState from '../../../action/state'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import './style.css'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;

class AddShop extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            addressValue: '请输入店铺地址！', //地址默认
            address: [], //地址的数组
            shopAvater: '', //店铺的图片地址
            shopLicense: '', //店铺的营业执照
            shopPermit: '' ,//店铺的资格许可
            activity:false,  //控制活动弹框是否显示
            activityList:[], //优惠列表
        }
    }

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
                        _this.setState({address:json})
                    }
                }
            });
        }

        timeout = setTimeout(fake, 300);
    }

    //店铺地址变化后更改value
    handleChange = (value) => {
        this.setState({ addressValue:value });
        this.addressFetch(value);
    }

    //上传成功后改变地铺头像地址
    changeShopAvater = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                shopAvater: info.file.response.image_path
            })
        }
    }
    //上传成功后改变店铺营业执照地址
    changeShopLicense = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                shopLicense: info.file.response.image_path
            })
        }
    }
    //上传成功后的店铺资格许可
    changeShopPermit = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                shopPermit: info.file.response.image_path
            })
        }
    }

    componentDidMount() {
        //跟新redux分类列表
        if(!this.props.assortment.length){
            this.props.userInfoActionsFetchMiddle.getShopAssortment();
        }
        //更新面包屑
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)
    }

    //活动选中后
    activity = (value) => {
        this.setState({activity:true})
    }
    //关闭活动对话框
    modal_close = () => {
        this.setState({activity:false})
    }
    //活动确定添加
    modal_ok = () => {
        let obj = {}
        let {activityList} = this.state;
        let getFieldsValue = this.props.form.getFieldsValue();
        switch(getFieldsValue.activities){
            case 'reduce':
                obj.name = '满减优惠';
                obj.icon_name = '减';
                obj.description = getFieldsValue.activity;
                obj.key = +new Date;
            break;
            case 'bargain':
                obj.name = '优惠大酬宾';
                obj.icon_name = '特';
                obj.description = getFieldsValue.activity;
                obj.key = +new Date;
            break;
            case 'newUser':
                obj.name = '新用户立减';
                obj.icon_name = '新';
                obj.description = getFieldsValue.activity;
                obj.key = +new Date;
            break;
            case 'openInStore':
                obj.name = '进店领券';
                obj.icon_name = '券';
                obj.description = getFieldsValue.activity;
                obj.key = +new Date;
            break;
        }
        if(getFieldsValue.activity){
            activityList.push(obj)
        }
        this.setState({
            activity:false,
            activityList,
        })
        this.props.form.setFieldsValue({activity:''})
    }

    //活动删除
    removeActivity = (key) => {
        let {activityList} = this.state;
        let newArr = [];
        activityList.forEach((e,i) => {
            if(e.key === key){
                activityList.splice(i,1);
            }
        })
        Object.assign(newArr,activityList)
        this.setState({activityList:newArr})
    }

    //创建店铺，发送请求
    establish = (e) => {
        e.preventDefault();
        let getFieldsValue = this.props.form.getFieldsValue();
        let {city} = this.props;
        let {shopAvater,shopLicense,shopPermit,activityList} = this.state;
        fetch.Addshop({
            name:getFieldsValue.name,
            address:getFieldsValue.address,
            phone:getFieldsValue.phone,
            latitude:city.latitude,
            longitude:city.longitude,
            category:getFieldsValue.assortment.join('/'),
            image_path:shopAvater,
            float_delivery_fee:getFieldsValue.fee_number,
            float_minimum_order_amount :getFieldsValue.send_number,
            description:getFieldsValue.introduce,
            promotion_info:getFieldsValue.slogan,
            is_premium:getFieldsValue.brand,
            delivery_mode:getFieldsValue.bird,
            new:getFieldsValue.newShop,
            bao:getFieldsValue.bao,
            zhun:getFieldsValue.zhun,
            piao:getFieldsValue.piao,
            startTime:getFieldsValue.startTime,
            endTime:getFieldsValue.endTime,
            business_license_image:shopLicense,
            catering_service_license_image :shopPermit,
            activities:activityList
        }).then(response => response.json())
        .then(json=>{
            this.props.userInfoActionsFetchMiddle.getShopAllList(city.latitude,city.longitude);
            this.props.userInfoActionsState.changePage(0)
        })
    }

    //修复下拉框定位问题
    getPopupContainer = (trigger) => {
        console.log (trigger)
        return trigger.parentNode;
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {address, shopAvater, shopLicense, shopPermit,activityList} = this.state;
        let props = {
            action: "http://localhost:8001/v1/addimg/avatar",
            showUploadList: false,
            name: 'file'
        }
        const options = address.map(e =>
            <Option key={e.address}>{e.address}</Option>
        )
        let columns  = [
            {
              title: '活动标题',
              dataIndex: 'icon_name',
              key: 'icon_name'
          },
          {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
          title: '活动详情',
          dataIndex: 'description',
          key: 'description'
        },
          {
            title: '操作',
            key: 'action',
            render: (text,record) =>{
                return <Button type="danger" onClick={()=>{this.removeActivity(record.key)}}>删除</Button>
            }
          }
        ]
        return (
            <Content style={{
                marginTop: '10px'
            }}>
                <div style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360
                }}>
                    <Form onSubmit={this.establish}>
                        <FormItem label="店铺名称" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入店铺名称！'
                                    }
                                ]
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label="详细地址" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('address', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入店铺地址！'
                                    }
                                ],
                                value:this.state.addressValue
                            })(
                                <Select placeholder={this.state.addressValue} getPopupContainer={this.getPopupContainer} mode="combobox" showArrow={false} defaultActiveFirstOption={false} filterOption={false} onChange={this.handleChange}>
                                    {address.length
                                        ? options
                                        : <Option value="正在加载中" className='addshop-warp'><Spin className='addshop-login'/></Option>
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="联系电话" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^1[34587]\d{9}$/,
                                        message: '联系电话输入不正确'
                                    }
                                ]
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label="店铺简介" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('introduce')(<Input/>)}
                        </FormItem>
                        <FormItem label="店铺标语" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('slogan')(<Input/>)}
                        </FormItem>
                        <FormItem label="店铺分类" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 3
                        }}>
                            {getFieldDecorator('assortment', {
                                initialValue: [
                                    '快餐便当', '简餐'
                                ],
                                rules: [
                                    {
                                        type: 'array',
                                        required: true,
                                        message: '请填写食品分类'
                                    }
                                ]
                            })(<Cascader options={this.props.assortment} changeOnSelect placeholder='请选择' getPopupContainer={this.getPopupContainer}/>)}
                        </FormItem>
                        <FormItem label="店铺特点" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 13
                        }}>
                            {getFieldDecorator('switch')(
                                <div>
                                    <FormItem label="品牌保证" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('brand',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                    <FormItem label="蜂鸟专送" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('bird',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                    <FormItem label="新开店铺" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('newShop',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                    <FormItem label="外卖保" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('bao',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                    <FormItem label="准时达" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('zhun',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                    <FormItem label="开发票" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 2
                                    }} colon={false} className='addshop-switch'>
                                        {getFieldDecorator('piao',{initialValue:true})(<Switch defaultChecked={true}/>)}
                                    </FormItem>
                                </div>
                            )}
                        </FormItem>
                        <FormItem label="配送费" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('fee_number', {initialValue: 5,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写配送费！'
                                    }
                                ]
                            })(<InputNumber min={5} max={100}/> )}
                        </FormItem>
                        <FormItem label="起送价" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('send_number', {initialValue: 20,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写起送价！'
                                    }
                                ]
                            })(<InputNumber min={20} max={300}/>)}
                        </FormItem>
                        <FormItem label="营业时间" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 10
                        }}>
                            {getFieldDecorator('times')(
                                <div>
                                    <FormItem labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 4
                                    }} className='addshop-times'>
                                        {getFieldDecorator('startTime')(<TimePicker placeholder='起始时间' format='HH:mm' getPopupContainer={this.getPopupContainer} popupClassName='addshop-getTime'/>)}
                                    </FormItem>

                                    <FormItem labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 4
                                    }} className='addshop-times'>
                                        {getFieldDecorator('endTime')(<TimePicker placeholder='结束时间' format='HH:mm' getPopupContainer={this.getPopupContainer} popupClassName='addshop-getTime'/>)}
                                    </FormItem>
                                </div>
                            )}
                        </FormItem>
                        <FormItem label="上传店铺图片" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('shop-avatar',{
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
                        <FormItem label="上传营业执照" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('shop-license')(
                                <Upload className="avatar-uploader" onChange={this.changeShopLicense} {...props}>
                                    {shopLicense
                                        ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + shopLicense} alt="" className="avatar"/>
                                        : <Icon type="plus" className="avatar-uploader-trigger"/>
                                    }
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem label="上传餐饮服务许可证" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('shop-permit')(
                                <Upload className="avatar-uploader" onChange={this.changeShopPermit} {...props}>
                                    {shopPermit
                                        ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + shopPermit} alt="" className="avatar"/>
                                        : <Icon type="plus" className="avatar-uploader-trigger"/>
                                    }
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem label="优惠活动" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 4
                        }}>
                            {getFieldDecorator('activities')(
                                <Select placeholder="选择优惠活动" onSelect={this.activity}>
                                    <Option value="reduce">满减优惠</Option>
                                    <Option value="bargain">优惠大酬宾</Option>
                                    <Option value="newUser">新用户立减</Option>
                                    <Option value="openInStore">进店领券</Option>
                                </Select>
                            )}
                        </FormItem>
                        <Modal
                            title="提示"
                            visible={this.state.activity}
                            onOk={this.modal_ok}
                            onCancel={this.modal_close}
                        >
                            <p style={{marginBottom:'10px'}}>请输入活动详情</p>
                            <FormItem wrapperCol={{
                                span: 24
                            }}>
                                {getFieldDecorator('activity')(<Input/>)}
                            </FormItem>
                        </Modal>
                        <FormItem
                            label="活动详情"
                            labelCol={{
                                span: 6
                            }}
                             wrapperCol={{
                            span: 13
                        }}>
                            {getFieldDecorator('activity')(<Table dataSource={this.state.activityList} columns={columns} ></Table>)}
                        </FormItem>
                        <FormItem
                          wrapperCol={{ span: 12, offset: 6 }}
                        >
                            <Button type="primary" className='addshop-button' htmlType="submit">立即创建</Button>
                        </FormItem>
                    </Form>
                </div>
            </Content>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        city: state.city,
        assortment:state.assortment,
        shopAllList:state.shopAllList,
        page:state.page,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
        userInfoActionsState:bindActionCreators(userInfoActionsState, dispatch),
    }
}
AddShop = connect(mapStateToProps, mapDispatchToProps)(AddShop)

export default Form.create()(AddShop);

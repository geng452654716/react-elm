import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {InputNumber, Button, Form, Table, Modal,Input} from 'antd'
const FormItem = Form.Item;

class GoodsModel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            visible: false, //添加规格模态框
        }
    }
    //点击添加按钮
    addAttr = () => {
        this.setState({visible: true})
    }
    //点击确认，修改父级规格数组
    handleOk = () => {
        this.setState({visible: false})
        let getFieldsValue = this.props.form.getFieldsValue();
        let {specsList,changeSpecsList} = this.props;
        let newList = [...specsList];
        newList.push({
            specs:getFieldsValue.specs_name,
            packing_fee:getFieldsValue.addPacking_fee,
            price:getFieldsValue.addPrice,
            key:+new Date,
        })
        changeSpecsList(newList);
        let {setFieldsValue} = this.props.form;
        setFieldsValue({
            specs_name:'',
            addPacking_fee:0,
            addPrice:20
        })
    }
    //点击取消模态框
    handleCancel = () => {
        this.setState({visible: false})
    }
    //包装费
    changePacking_fee = (value) => {
        let {specsList,changeSpecsList} = this.props;
        let newList = [...specsList];
        newList[0].packing_fee = value;
        changeSpecsList(newList);
    }
    //价格改变
    changePrice = (value) => {
        let {specsList,changeSpecsList} = this.props;
        let newList = [...specsList];
        newList[0].price = value;
        changeSpecsList(newList);
    }
    //删除规格
    removeSpecs = (key) => {
        let {specsList,changeSpecsList} = this.props;
        let newList = [...specsList];
        newList.forEach((e,i) => {
            if(e.key === key){
                newList.splice(i,1)
            }
        })
        changeSpecsList(newList);
    }
    render() {
        let {specs, specsList} = this.props;
        const {getFieldDecorator} = this.props.form;
        let columns = [
            {
                title: '规格',
                dataIndex: 'specs',
                key: 'specs'
            }, {
                title: '包装费',
                dataIndex: 'packing_fee',
                key: 'packing_fee'
            }, {
                title: '价格',
                dataIndex: 'price',
                key: 'price'
            }, {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return <Button type="danger" onClick={() => {
                        this.removeSpecs(record.key)
                    }}>删除</Button>
                }
            }
        ]

        let speList = null;
        // 单规格，多规格判断
        if (specs === 'single') {
            speList = (
                <div>
                    <FormItem label="包装费" labelCol={{
                        span: 4
                    }} wrapperCol={{
                        span: 6
                    }}>
                        {getFieldDecorator('packing_fee', {
                            initialValue: specsList[0].packing_fee,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写包装费！'
                                }
                            ]
                        })(<InputNumber min={0} max={100} onChange={this.changePacking_fee}/>)}
                    </FormItem>
                    <FormItem label="价格" labelCol={{
                        span: 4
                    }} wrapperCol={{
                        span: 6
                    }}>
                        {getFieldDecorator('price', {
                            initialValue: specsList[0].price,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写价格！'
                                }
                            ]
                        })(<InputNumber min={0} onChange={this.changePrice}/>)}
                    </FormItem>
                </div>
            )
        } else {
            speList = (
                <div>
                    <Button type="primary" className='addgood-button' style={{
                        marginBottom: '20px'
                    }} onClick={this.addAttr}>添加规格</Button>
                    <FormItem label="规格详情" labelCol={{
                        span: 4
                    }} wrapperCol={{
                        span: 20
                    }}>
                        {getFieldDecorator('specs')(
                            <Table dataSource={specsList} columns={columns} pagination={false}></Table>
                        )}
                    </FormItem>
                </div>
            )
        }
        return (
            <Form>
                {speList}
                <Modal title="添加规格" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <FormItem label="规格" labelCol={{
                        span: 4
                    }} wrapperCol={{
                        span: 18
                    }}>
                        {getFieldDecorator('specs_name', {
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
        )
    }
}
export default Form.create()(GoodsModel);

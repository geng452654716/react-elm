import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    message,
    Collapse,
    Card
} from 'antd';
import {Link, Redirect} from 'react-router-dom'
//redux
import * as userInfoActionsFetchMiddle from '../../../../action/fetchMiddle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as fetch from '../../../../fetch/index'

import './style.css'

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class AddGoodsType extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {}
    }
    componentDidMount() {
        let {userInfoActionsFetchMiddle, id, prompt} = this.props;
        if (!prompt) {
            userInfoActionsFetchMiddle.getGoodsType(id)
        }
    }
    //点击提交添加食品种类
    addType = () => {
        let getFieldsValue = this.props.form.getFieldsValue();
        let {id, userInfoActionsFetchMiddle} = this.props;
        let {setFieldsValue} = this.props.form;
        fetch.addGoodsType({restaurant_id: id, name: getFieldsValue.name, description: getFieldsValue.description}).then(response => response.json()).then((json) => {
            if (json.status === 1) {
                userInfoActionsFetchMiddle.getGoodsType(id);
                message.success('添加食品种类成功');
                setFieldsValue({name: '', description: ''})
            } else {
                message.error(json.message)
            }
        }).catch(() => {
            message.error('网络链接失败，请检查网络后再试')
        })
    }
    goodsTpye = (value) => {
        let {changeGoodType} = this.props;
        changeGoodType(value);
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        let {goodsType} = this.props;
        let options = null;
        if (goodsType) {
            let typeList = goodsType.category_list;
            options = typeList.map((e, i) => {
                return <Option value={'' + e.id} key={e.id}>{e.name}</Option>
            })
        }
        return (
            <div>
                <Form>

                    <div className='addGoods-title'>选择食品种类</div>
                    <Card className='addGoodsTypeWorp'>
                        <FormItem label="食品分类" labelCol={{
                            span: 4
                        }} wrapperCol={{
                            span: 18
                        }}>
                            {getFieldDecorator('category')(
                                <Select placeholder="选择食品分类" onSelect={this.goodsTpye}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <Collapse className='addGoods-addtype'>
                            <Panel header="添加食品种类" key="1">
                                <FormItem label="食品分类" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 18
                                }}>
                                    {getFieldDecorator('name')(<Input/>)}
                                </FormItem>
                                <FormItem label="食品描述" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 18
                                }}>
                                    {getFieldDecorator('description')(<Input/>)}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('addTypeBtn')(
                                        <Button type="primary" className='addTypeBtn' onClick={this.addType}>提交</Button>
                                    )}
                                </FormItem>
                            </Panel>
                        </Collapse>
                    </Card>
                </Form>
            </div>
        )
    }
}
// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {goodsType: state.goodsType}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch)
    }
}
AddGoodsType = connect(mapStateToProps, mapDispatchToProps)(AddGoodsType)

export default Form.create()(AddGoodsType);

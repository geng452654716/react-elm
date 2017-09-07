import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,Card,Upload,Icon} from 'antd';


//redux
import * as userInfoActionsMiddle from '../../action/middle'
import * as userInfoActionsFetchMiddle from '../../action/fetchMiddle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'

const {Content} = Layout;

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            userAvatar:'',
        }
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)
        let {data} = this.props.userInfo;
        this.setState({userAvatar:data.avatar})
    }

    //上传成功后改变头像地址
    changeShopAvater = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                userAvatar: info.file.response.image_path
            })
            this.props.userInfoActionsFetchMiddle.setUserInfo()
        }
    }
    render() {
        let {data} = this.props.userInfo;
        let {userAvatar} = this.state;
        let props = {
            action: "http://localhost:8001/admin/update/avatar/" + data.id,
            showUploadList: false,
            name: 'file'
        }
        return (
            <div>
                <Content style={{
                    marginTop: '10px'
                }}>
                    <div style={{
                        padding: 24,
                        background: '#fff',
                        minHeight: 360
                    }}>
                        <div style={{textAlign:'center',fontSize:'20px',marginBottom:'20px'}}>管理员信息</div>
                        <Card style={{width:'60%',margin:'0 auto',backgroundColor:'#f9fafc'}}>
                            <ul style={{fontSize:'15px'}}>
                                <li style={{marginBottom:'20px'}}>
                                    <span style={{marginRight:'5px'}}>姓名:</span>
                                    <span>{data.user_name}</span>
                                </li>
                                <li style={{marginBottom:'25px'}}>
                                    <span style={{marginRight:'5px'}}>注册时间:</span>
                                    <span>{data.create_time}</span>
                                </li>
                                <li style={{marginBottom:'25px'}}>
                                    <span style={{marginRight:'5px'}}>管理员权限:</span>
                                    <span>{data.admin}</span>
                                </li>
                                <li style={{marginBottom:'25px'}}>
                                    <span style={{marginRight:'5px'}}>管理员ID:</span>
                                    <span>{data.id}</span>
                                </li>
                                <li style={{marginBottom:'25px'}}>
                                    <span style={{marginRight:'5px',marginBottom:'10px',display:'inline-block'}}>管理员头像:</span>
                                    <Upload className="avatar-uploader" onChange={this.changeShopAvater} {...props}>
                                        {userAvatar
                                            ? <img src={'http://ovi8yxbuf.bkt.clouddn.com/' + userAvatar} alt="" className="avatar"/>
                                            : <Icon type="plus" className="avatar-uploader-trigger"/>
                                        }
                                    </Upload>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </Content>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        userInfo:state.userInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddle: bindActionCreators(userInfoActionsFetchMiddle, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)

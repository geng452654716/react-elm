import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout} from 'antd';

//redux
import * as userInfoActionsFromOtherFile from '../../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../../components/Menu/data'

const {Content} = Layout;

class ShopList extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {

        }
    }
    componentDidMount() {
        this.props.userInfoAction.getBreadcrumb(MenuData)
    }
    render(){
        return(
            <Content style={{
                marginTop:'10px'
            }}>
                <div style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360,
                }}>
                    ShopList
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
        userInfoAction:bindActionCreators(userInfoActionsFromOtherFile,dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShopList)

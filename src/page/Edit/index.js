import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout} from 'antd';

import LzEditor from 'react-lz-editor'

//redux
import * as userInfoActionsMiddle from '../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'

const {Content} = Layout;

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            htmlContent: '<p>文本编辑</p>'
        }
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData)
    }
    render() {
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
                    <LzEditor
                      active={true}
                      importContent={this.state.htmlContent}
                      image={false}
                      video={false}
                      audio={false}
                      lang="en"/>
                    </div>
                </Content>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionsMiddle: bindActionCreators(userInfoActionsMiddle, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Edit)

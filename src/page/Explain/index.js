import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

//redux
import * as userInfoActionsFromOtherFile from '../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'

class Explain extends React.Component {
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
          <div>
              Explain
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
        userInfoAction:bindActionCreators(userInfoActionsFromOtherFile,dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explain)

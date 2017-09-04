import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import * as userInfoActionsMiddle from '../../action/middle'
import * as userInfoActionsFetchMiddle from '../../action/fetchMiddle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'

class Home extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
        //跟新redux面包屑
        this.props.userInfoActionMiddles.getBreadcrumb(MenuData)
        //更新redux城市信息
        if(this.props.city == null){
            this.props.userInfoActionsFetchMiddles.getCity();
        }
        //更新redux食品分类列表
        if(!this.props.assortment.length){
            this.props.userInfoActionsFetchMiddles.getShopAssortment();
        }
    }
    render(){
        return(
          <div>
              Home
          </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        city:state.city,
        assortment:state.assortment,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionMiddles:bindActionCreators(userInfoActionsMiddle,dispatch),
        userInfoActionsFetchMiddles:bindActionCreators(userInfoActionsFetchMiddle,dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)

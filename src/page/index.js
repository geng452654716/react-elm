import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout, Breadcrumb} from 'antd';
const {Header, Sider} = Layout;

import RouterMap from '../router/RouterMap'
import Meun from '../components/Menu'

class App extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (

        )
    }
}
export default App

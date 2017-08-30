import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout} from 'antd';
const {Content} = Layout;

class Home extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {

        }
    }
    render(){
        return(
            <Content style={{
                margin: '0 16px'
            }}>
                <div style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360
                }}>
                    AdminList
                </div>
            </Content>
        )
    }
}
export default Home

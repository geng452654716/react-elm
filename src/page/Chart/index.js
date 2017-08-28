import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Home extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {

        }
    }
    render(){
        return(
          <div>
              Chart
          </div>
        )
    }
}
export default Home

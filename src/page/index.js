import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class App extends React.Component {
    constructor(){
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {

        }
    }
    render(){
        return(
          <div>
              
          </div>
        )
    }
}
export default App
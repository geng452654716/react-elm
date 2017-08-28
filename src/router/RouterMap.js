import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Login from '../page/Login'
import Home from '../page/Home'
import Data from '../page/Data'
import AddData from '../page/AddData'
import Chart from '../page/Chart'
import Edit from '../page/Edit'
import Settings from '../page/Settings'
import Explain from '../page/Explain'
import Menu from '../components/Menu'

class RouterMap extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            userloain:true,
        }
    }
    render() {
        return (
            <Router>
                <div>
                    {this.state.userloain
                    ?<div>
                        <Menu></Menu>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/data' component={Data} />
                            <Route path='/addData' component={AddData} />
                            <Route path='/chart' component={Chart} />
                            <Route path='/edit' component={Edit} />
                            <Route path='/settings' component={Settings} />
                            <Route path='/explain' component={Explain} />
                            <Route path='*' component={Home} />
                        </Switch>
                    </div>
                    :<Route path='/login' component={Login}></Route>
                    }
                </div>
            </Router>
        )
    }
}
export default RouterMap

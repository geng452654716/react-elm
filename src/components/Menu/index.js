import React from 'react'
import {Menu, Icon, Button} from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './style.css'
import {MenuData} from './data'

const SubMenu = Menu.SubMenu;


class MenuSub extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let List = MenuData.map((e) => {
            return (
                !e.children
                ?
                    <Menu.Item key={e.key} className='Menu'><Link to={e.path}><Icon type={e.icon}/><span>{e.name}</span></Link></Menu.Item>
                :
                    <SubMenu className='Menu' key={e.key} title={<span><Icon type={e.icon}/>< span > {e.name} < /span></span>}>
                        {
                            e.children.map((e) => {
                                return <Menu.Item key={e.key} className='SubMenu' breadcrumbName={e.name}><Link to={e.path}>{e.name}</Link></Menu.Item>
                            })
                        }
                    </SubMenu>
            )
        })
        return (
            <div style={{
                width: 200
            }}>
                <Menu
                    defaultSelectedKeys={['index']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.props.collapsed}
                    onClick={this.click}
                >
                    {List}
                </Menu>
            </div>
        )
    }
}
export default MenuSub

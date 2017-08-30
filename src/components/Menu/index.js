import React from 'react'
import {Menu, Icon, Button} from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './style.css'
import {MenuData} from './data'

const SubMenu = Menu.SubMenu;

function getPathArr(arr,key){
    let breadcrumb = [];
    let path = '';
    fn(arr);
    function fn(arr){
        arr.forEach((e) => {
            if(e.key == key){
                path = e.path;
                return
            }else{
                if(e.children){
                    fn(e.children);
                }
            }
        })
    }
    breadcrumb = path.split('/');
    return breadcrumb;
}

function getBreadcrumb(arr,key){
    let breadcrumb = [];
    fn(arr);
    function fn(arr){
        for(let i=1;i<key.length;i++){
            arr.forEach((e) => {
                if(key[i] == e.key){
                    breadcrumb.push(e.name)
                }else{
                    if(e.children){
                        fn(e.children)
                    }
                }
            })
        }
    }
    return breadcrumb;
}

class MenuSub extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    click = (e) => {
        let path = getPathArr(MenuData,e.key);
        let breadcrumb = getBreadcrumb(MenuData,path);
        this.props.getbreadcrumb(breadcrumb);
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

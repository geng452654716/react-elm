import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout,message} from 'antd';

//redux
import * as userInfoActionsMiddle from '../../action/middle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'
import {userSource} from '../../fetch/index'

//echarts
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';


const {Content} = Layout;

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
        this.props.userInfoActionsMiddle.getBreadcrumb(MenuData);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.refs.Chart_warp);

        //获取用户分布信息
        userSource()
        .then(response=>response.json())
        .then(json=>{
            if(json.status === 1){
                console.log (json)
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '用户分布',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['北京', '上海', '深圳', '杭州', '其他']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: [
                                '50%', '60%'
                            ],
                            data: [
                                {
                                    value: json.user_city.beijing,
                                    name: '北京'
                                }, {
                                    value: json.user_city.shanghai,
                                    name: '上海'
                                }, {
                                    value: json.user_city.shenzhen,
                                    name: '深圳'
                                }, {
                                    value: json.user_city.shenzhen,
                                    name: '杭州'
                                }, {
                                    value: json.user_city.qita,
                                    name: '其他'
                                }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            }
        })
        .catch(()=>{
            message.error('网络连接超时，请检查网络后再试');
        })
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
                            <div id="Chart_warp" style={{
                                width:'100%',
                                height:600,
                                margin:'0 auto'
                            }} ref='Chart_warp'></div>
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
    export default connect(mapStateToProps, mapDispatchToProps)(Chart)

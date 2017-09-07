import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Layout, Spin, message, Row, Col} from 'antd';

import * as userInfoActionsMiddle from '../../action/middle'
import * as userInfoActionsFetchMiddle from '../../action/fetchMiddle'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {MenuData} from '../../components/Menu/data'
import * as fetch from '../../fetch/index'

//echarts
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';

import './style.css'
const {Content} = Layout;

class Home extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            newApi: [],
            newUser: [],
            newOrder: [],
            newAdmin: [],
            allApi: null,
            allUser: null,
            allOrder: null,
            allAdmin: null,
            newDate: [],
            chartWarp: null,
            toDayApi: null,
            toDayUser: null,
            toDayOrder: null,
            toDayAdmin: null,
            loging: true
        }
    }
    componentWillMount() {
        let {
            newApi,
            newUser,
            newOrder,
            newAdmin,
            allApi,
            allUser,
            allOrder,
            allAdmin,
            newDate
        } = this.state;
        let api = [],
            user = [],
            order = [],
            admin = [],
            date = [];
        let _this = this;
        //获取7天中的数据
        for (let i = 6; i >= 0; i--) {
            date.push(this.GetDateStr(-i))
            this.setState({newDate: date});
        }
        this.getNewApi();
        this.getNewUser();
        this.getNewOrder();
        this.getNewAdmin();
        this.getAllApi();
        this.getAllUser();
        this.getAllOrder();
        this.getAllAdmin();
    }

    componentDidMount() {
        let {
            newApi,
            newUser,
            newOrder,
            newAdmin,
            newDate,
            chartWarp,
            toDayApi,
            toDayUser,
            toDayOrder,
            toDayAdmin,
            allApi,
            allUser,
            allOrder,
            allAdmin
        } = this.state;
        //跟新redux面包屑
        this.props.userInfoActionMiddles.getBreadcrumb(MenuData)
        //更新redux城市信息
        if (this.props.city == null) {
            this.props.userInfoActionsFetchMiddles.getCity();
        }
        //更新redux食品分类列表
        if (!this.props.assortment.length) {
            this.props.userInfoActionsFetchMiddles.getShopAssortment();
        }

    }

    componentDidUpdate() {
        let {
            newApi,
            newUser,
            newOrder,
            newAdmin,
            newDate,
            chartWarp,
            toDayApi,
            toDayUser,
            toDayOrder,
            toDayAdmin,
            allApi,
            allUser,
            allOrder,
            allAdmin,
            loging
        } = this.state;
        if (newApi.length && newUser.length && newOrder.length && newAdmin.length && newDate.length && typeof(toDayApi) == 'number' && typeof(toDayUser) == 'number' && typeof(toDayOrder) == 'number' && typeof(toDayAdmin) == 'number' && allApi && allUser && allOrder && allAdmin) {
            this.setState({loging: false})
            if (!loging) {
                this.setState({
                    chartWarp: echarts.init(this.refs.Chart_warp)
                })
            }
        }
    }

    //获取API一周数据和当天数据
    getNewApi = () => {
        let n = 0;
        let api = [];
        let _this = this;
        fn();
        function fn() {
            fetch.getTodayApi(_this.GetDateStr(-n)).then(response => response.json()).then(json => {
                if (n == 0) {
                    _this.setState({toDayApi: json.count});
                }
                n++;
                api.push(json.count)
                if (n > 6) {
                    api.reverse();
                    _this.setState({newApi: api})
                } else {
                    fn();
                }
            }).catch(() => {
                message.error('网络连接失败，请检查网络后再试')
            })
        }
    }

    //获取用户一周数据和当天数据
    getNewUser = () => {
        let n = 0;
        let user = [];
        let _this = this;
        fn();
        function fn() {
            fetch.getTodayUser(_this.GetDateStr(-n)).then(response => response.json()).then(json => {
                if (n == 0) {
                    _this.setState({toDayUser: json.count});
                }
                n++;
                user.push(json.count)
                if (n > 6) {
                    user.reverse();
                    _this.setState({newUser: user})
                } else {
                    fn();
                }
            }).catch((error) => {
                message.error('网络连接失败，请检查网络后再试')
            })
        }
    }

    //获取订单一周数据和当天数据
    getNewOrder = () => {
        let n = 0;
        let order = [];
        let _this = this;
        fn();
        function fn() {
            fetch.getTodayOrder(_this.GetDateStr(-n)).then(response => response.json()).then(json => {
                if (n == 0) {
                    _this.setState({toDayOrder: json.count});
                }
                n++;
                order.push(json.count)
                if (n > 6) {
                    order.reverse()
                    _this.setState({newOrder: order})
                } else {
                    fn();
                }
            }).catch(() => {
                message.error('网络连接失败，请检查网络后再试')
            })
        }
    }

    //获取管理员一周数据和当天数据
    getNewAdmin = () => {
        let n = 0;
        let admin = [];
        let _this = this;
        fn();
        function fn() {
            fetch.getTodayAdmin(_this.GetDateStr(-n)).then(response => response.json()).then(json => {
                if (n == 0) {
                    _this.setState({toDayAdmin: json.count});
                }
                n++;
                admin.push(json.count)
                if (n > 6) {
                    admin.reverse();
                    _this.setState({newAdmin: admin})
                } else {
                    fn();
                }
            }).catch(() => {
                console.log(4)
                message.error('网络连接失败，请检查网络后再试')
            })
        }
    }

    //获取全部API
    getAllApi = () => {
        let _this = this;
        fetch.getAllApi().then(response => response.json()).then(json => {
            _this.setState({allApi: json.count})
        }).catch(() => {
            console.log(5)
            message.error('网络连接失败，请检查网络后再试')
        })
    }

    //获取全部用户数量
    getAllUser = () => {
        let _this = this;
        fetch.getAllUser().then(response => response.json()).then(json => {
            _this.setState({allUser: json.count})
        }).catch(() => {
            console.log(6)
            message.error('网络连接失败，请检查网络后再试')
        })
    }

    //获取全部订单数量
    getAllOrder = () => {
        let _this = this;
        fetch.getAllOrder().then(response => response.json()).then(json => {
            _this.setState({allOrder: json.count})
        }).catch(() => {
            console.log(7)
            message.error('网络连接失败，请检查网络后再试')
        })
    }

    //获取全部管理员数量
    getAllAdmin = () => {
        let _this = this;
        fetch.getAllAdmin().then(response => response.json()).then(json => {
            _this.setState({allAdmin: json.count})
        }).catch(() => {
            console.log(8)
            message.error('网络连接失败，请检查网络后再试')
        })
    }

    //获取日期函数
    GetDateStr = (AddDayCount) => {
        let date = new Date();
        date.setDate(date.getDate() + AddDayCount);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return y + "-" + this.toTwo(m) + "-" + this.toTwo(d);
    }

    //日期补零函数
    toTwo = (number) => {
        return number < 10
            ? '0' + number
            : number
    }

    render() {
        let {
            newDate,
            newApi,
            newUser,
            newAdmin,
            newOrder,
            loging,
            chartWarp,
            toDayApi,
            toDayAdmin,
            toDayUser,
            toDayOrder,
            allApi,
            allAdmin,
            allOrder,
            allUser
        } = this.state;

        if (chartWarp) {
            chartWarp.setOption({
                title: {
                    text: '走势图',
                    x: 'left'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    extraCssText: 'text-align:left'
                },
                legend: {
                    data: ['API请求量', '新注册用户', '新增订单', '新增管理员']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: newDate
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'API请求量',
                        position: 'left'
                    }, {
                        type: 'value',
                        name: '用户/订单',
                        position: 'right'
                    },
                    {
                       type: 'value',
                       name: '管理员',
                       position: 'right',
                       offset: 50,
                        axisLine: {
                            lineStyle: {
                                color: '#13ce66'
                            }
                        },
                   }
                ],
                series: [
                    {
                        name: 'API请求量',
                        type: 'bar',
                        data: newApi,
                        itemStyle: {
                            normal: {
                                color: '#d14a61'
                            }
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                }, {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        }
                    }, {
                        name: '新注册用户',
                        type: 'bar',
                        data: newUser,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#5793f3'
                            }
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                }, {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        }
                    }, {
                        name: '新增订单',
                        type: 'bar',
                        data: newOrder,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#675bba'
                            }
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                }, {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        }
                    }, {
                        name: '新增管理员',
                        type: 'bar',
                        data: newAdmin,
                        yAxisIndex: 2,
                        itemStyle: {
                            normal: {
                                color: '#13ce66'
                            }
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                }, {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        }
                    }
                ]
            })
        }

        if (loging) {
            return (
                <div>
                    <Content style={{
                        marginTop: '10px'
                    }}>
                        <div style={{
                            padding: 24,
                            background: '#fff',
                            minHeight: 400,
                            textAlign: 'center',
                            fontSize: '20px'
                        }}>
                            <Spin style={{
                                margin: '100px auto'
                            }}/>
                        </div>
                    </Content>
                </div>
            )
        }

        return (
            <div>
                <Content style={{
                    marginTop: '10px'
                }}>
                    <div style={{
                        padding: 24,
                        background: '#fff',
                        minHeight: 360,
                        fontSize: '20px'
                    }}>
                        <div className='home-title'>
                            <p className='home-title-text'>数据统计</p>
                        <Row className='home-row'>
                                <Col span={6} className='home-col home-yellow'>当日数据：</Col>
                                <Col span={1}></Col>
                                <Col span={5} className='home-col'>
                                    <span>{toDayApi}</span>API请求量</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{toDayUser}</span>新增用户</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{toDayOrder}</span>新增订单</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{toDayAdmin}</span>新增管理员</Col>
                            </Row>
                            <Row>
                                <Col span={6} className='home-col home-blue'>总数据：</Col>
                                <Col span={1}></Col>
                                <Col span={5} className='home-col'>
                                    <span>{allApi}</span>API请求量</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{allUser}</span>注册用户</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{allOrder}</span>订单</Col>
                                <Col span={1}></Col>
                                <Col span={3} className='home-col'>
                                    <span>{allAdmin}</span>管理员</Col>
                            </Row>
                        </div>
                        <div id='Chart_warp' style={{
                            width: '100%',
                            height: 600,
                            margin: '0 auto'
                        }} ref='Chart_warp'></div>
                    </div>
                </Content>
            </div>
        )
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {city: state.city, assortment: state.assortment}
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActionMiddles: bindActionCreators(userInfoActionsMiddle, dispatch),
        userInfoActionsFetchMiddles: bindActionCreators(userInfoActionsFetchMiddle, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)

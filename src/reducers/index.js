const initialState = {
    userInfo:null, //用户信息
    breadcrumb:[],  //面包屑
    city:null, //当前定位城市信息
    assortment:[], //商品分类
    shopAllList:null, //店铺列表
    shopPage:1, //当前店铺展示页数
    goodsType:null, //当前店铺食品分类列表
    goodsAllList:null,  //食品列表
    goodsPage:1, //当前食品展示页数
};

export default function Reducers(state = initialState,action) {
    switch (action.type) {
        //记录用户信息
        case "USER_INFO":
            return Object.assign({},state,{
                userInfo:action.data,
            })
        //记录面包屑导航
        case "BREADCRUMB":
            return Object.assign({},state,{
                breadcrumb:action.data,
            })
        case "GET_CITY":
            return Object.assign({},state,{
                city:action.data,
            })
        case "GET_SHOPASSORTMENT":
            return Object.assign({},state,{
                assortment:action.data,
            })
        case "SHOP_ALL_LIST":
            return Object.assign({},state,{
                shopAllList:action.data,
            })
        case "CHANGE_SHOPPAGE":
            return Object.assign({},state,{
                shopPage:action.data,
            })
        case "GOODS_TYPE":
            return Object.assign({},state,{
                goodsType:action.data,
            })
        case "GOODS_ALL_LIST":
            return Object.assign({},state,{
                goodsAllList:action.data,
            })
        case "CHANGE_GOODSPAGE":
            return Object.assign({},state,{
                goodsPage:action.data,
            })
        default:
            return state
    }
};

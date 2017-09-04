const initialState = {
    userInfo:null,
    breadcrumb:[],
    address:[],
    city:null,
    assortment:[],
    shopAllList:null,
    page:0,
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
        case "CHANGE_PAGE":
            return Object.assign({},state,{
                page:action.data,
            })
        default:
            return state
    }
};

//用户信息action
export function userInfo(data){
    return {
        type:'USER_INFO',
        data,
    }
}

//面包屑导航action
export function breadcrumb(data){
    return {
        type:'BREADCRUMB',
        data,
    }
}

//城市信息
export function city(data){
    return {
        type:'GET_CITY',
        data,
    }
}

//店铺食品分类信息
export function shopAssortment(data){
    return {
        type:'GET_SHOPASSORTMENT',
        data,
    }
}

//全部店铺列表
export function shopAllList(data){
    return {
        type:'SHOP_ALL_LIST',
        data,
    }
}

//改变店铺页码
export function changeShopPage(data){
    return {
        type:'CHANGE_SHOPPAGE',
        data,
    }
}

//当前店铺食品种类
export function goodsType(data){
    return {
        type:'GOODS_TYPE',
        data,
    }
}

//全部食品列表
export function goodsAllList(data){
    return {
        type:'GOODS_ALL_LIST',
        data,
    }
}

//改变食品页码
export function changeGoodsPage(data){
    return {
        type:'CHANGE_GOODSPAGE',
        data,
    }
}

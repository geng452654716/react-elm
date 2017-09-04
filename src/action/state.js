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

//改变页码
export function changePage(data){
    return {
        type:'CHANGE_PAGE',
        data,
    }
}

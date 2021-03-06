import * as userInfoActionsFromOtherFile from './state'
import {getFetch} from '../fetch/getFetch'
//用户信息中间键  使用AJAX获取用户信息
export function setUserInfo(){
    return function(dispatch,getStore){
        return getFetch('admin/info')
        .then(response => response.json())
        .then(json => {
            dispatch(userInfoActionsFromOtherFile.userInfo(json))
            localStorage.userInfo = JSON.stringify(json)
        })
    }
}

//获取定位城市中间键 AJAX请求
export function getCity(){
    return function(dispatch,getStore){
        return getFetch('v1/cities',{type:'guess'})
        .then(response => response.json())
        .then((json) => {
            dispatch(userInfoActionsFromOtherFile.city(json))
            localStorage.city = JSON.stringify(json)
        })
    }
}

//获取分类信息中间键  AJAX请求
export function getShopAssortment(){
    return function(dispatch,getStore){
        return getFetch('shopping/v2/restaurant/category')
        .then(response => response.json())
        .then((json) => {
            let arr = [];
            Object.assign(arr,json);
            function fn(arr){
                arr.map((e,i) => {
                    arr[i].value = e.name;
                    arr[i].label = e.name;
                    if(e.sub_categories){
                        arr[i].children = e.sub_categories;
                        fn(e.sub_categories);
                    }
                })
            }
            fn(arr)
            dispatch(userInfoActionsFromOtherFile.shopAssortment(arr))
            localStorage.assortment = JSON.stringify(arr)
        })
    }
}

//获取全部店铺列表
export function getShopAllList(latitude,longitude,page=1,callback=function(){}){
    return function(dispatch,getStore){
        return getFetch('shopping/restaurants',{
            latitude,
            longitude,
            offset:(page-1)*10,
            limit:10,
        })
        .then(response =>response.json())
        .then((json) => {
            dispatch(userInfoActionsFromOtherFile.shopAllList(json))
            callback();
        })
    }
}

//获取店铺食品分类
export function getGoodsType(id){
    return function(dispatch,getStore){
        return getFetch('shopping/getcategory/'+id)
        .then(response=>response.json())
        .then((json) => {
            if(json.status === 1){
                dispatch(userInfoActionsFromOtherFile.goodsType(json))
            }
        })
    }
}

//获取全部食品列表
export function getGoodsAllList(page=1,id,callback=function(){}){
    return function(dispatch,getStore){
        return getFetch(`shopping/v2/foods?offset=${(page-1)*10}&limit=10&restaurant_id=${id}`)
        .then(response=>response.json())
        .then((json) => {
            dispatch(userInfoActionsFromOtherFile.goodsAllList(json))
            callback();
        })
    }
}

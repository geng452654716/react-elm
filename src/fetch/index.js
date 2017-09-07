import {getFetch} from './getFetch'

//登录请求
export function login(user_name,password){
    return getFetch('admin/login',{user_name,password},'post')
}

//退出登录请求
export function outLogin(){
    return getFetch('admin/singout')
}

//店铺输入地址联想
export function shopAddress(value,cityId){
    return getFetch('v1/pois',{
        type:'search',
        city_id:cityId,
        keyword:value
    })
}

//获取定位城市
export function city(){
    return getFetch('/v1/cities',{type:'guess'})
}

//请求添加店铺
export function Addshop(init){
    return getFetch('shopping/addshop',{
        name:init.name,
        address:init.address,
        phone:init.phone,
        latitude:init.latitude,
        longitude:init.longitude,
        category:init.category,
        image_path:init.image_path,
        float_delivery_fee:init.float_delivery_fee,
        float_minimum_order_amount :init.float_minimum_order_amount,
        description:init.description,
        promotion_info:init.promotion_info,
        is_premium:init.is_premium,
        delivery_mode:init.delivery_mode,
        new:init.new,
        bao:init.bao,
        zhun:init.zhun,
        piao:init.piao,
        startTime:init.startTime,
        endTime:init.endTime,
        business_license_image:init.business_license_image,
        catering_service_license_image :init.catering_service_license_image,
        activities:init.activities
    },'post')
}

//删除店铺
export function removeShop(id){
    return getFetch('shopping/restaurant/' + id,{},'DELETE')
}

//获取店铺总数
export function getShopNumber(){
    return getFetch('shopping/restaurants/count')
}

//发起修改店铺请求
export function changeShopInfo(init){
    return getFetch('shopping/updateshop',{
        id:init.id,
        name:init.name,
        address:init.address,
        description:init.description,
        phone:init.phone,
        image_path:init.image_path,
        category:init.category
    },'post')
}

//添加店铺食品种类
export function addGoodsType(init){
    return getFetch('shopping/addcategory',{
        restaurant_id:init.restaurant_id,
        name:init.name,
        description:init.description,
    },'post')
}

//添加食品
export function addGoods(init){
    return getFetch('shopping/addfood',{
        restaurant_id:init.restaurant_id,
        category_id:init.category_id,
        name:init.name,
        image_path:init.image_path,
        specs:init.specs,
        description:init.description,
        activity:init.activity,
        attributes:init.attributes
    },'post')
}

//获取食品总数
export function getGoodsNumber(){
    return getFetch('shopping/v2/foods/count')
}

//根据餐馆ID获取餐馆数据
export function fromIdToShopData(id){
    return getFetch('shopping/restaurant/'+id)
}

//根据食品分类ID获取食品分类数据
export function fromIdToSpecsData(id){
    return getFetch('shopping/v2/menu/'+id)
}

//删除食品
export function removeGoods(id){
    return getFetch('shopping/v2/food/' + id,{},'DELETE')
}

//发起修改食品请求
export function changeGoodsInfo(init){
    return getFetch('shopping/v2/updatefood',{
        item_id:init.item_id,
        name:init.name,
        description:init.description,
        phone:init.phone,
        image_path:init.image_path,
        restaurant_id:init.restaurant_id,
        category_id:init.category_id,
        specs:init.specs,
        new_category_id:init.new_category_id,
    },'post')
}

//获取用户列表
export function getUserList(page=1){
    return getFetch(`v1/users/list?offset=${(page-1)*10}&limit=10`,{},'get','http://cangdu.org:8001/')
}

//获取用户总数
export function getUserNumber(){
    return getFetch(`v1/users/count`,{},'get','http://cangdu.org:8001/')
}

//获取订单列表
export function getOrderList(page=1){
    return getFetch(`bos/orders?offset=${(page-1)*10}&limit=10`,{},'get','http://cangdu.org:8001/')
}

//获取订单总数
export function getOrderNumber(){
    return getFetch(`bos/orders/count`,{},'get','http://cangdu.org:8001/')
}

//获取管理员列表
export function getAdminList(page=1){
    return getFetch(`admin/all?offset=${(page-1)*10}&limit=10`)
}

//获取管理员总数
export function getAdminNumber(){
    return getFetch(`admin/count`)
}

//获取用户分布信息
export function userSource(){
    return getFetch(`v1/user/city/count`,{},'get','http://cangdu.org:8001/')
}

//获取当天API请求量
export function getTodayApi(date){
    return getFetch(`statis/api/${date}/count`)
}

//获当天新增用户
export function getTodayUser(date){
    return getFetch(`statis/user/${date}/count`,{},'get','http://cangdu.org:8001/')
}

//获当天新增订单
export function getTodayOrder(date){
    return getFetch(`statis/order/${date}/count`,{},'get','http://cangdu.org:8001/')
}

//获当天新增管理员
export function getTodayAdmin(date){
    return getFetch(`statis/admin/${date}/count`)
}

//获取全部API请求量
export function getAllApi(){
    return getFetch(`statis/api/count`)
}

//获取全部用户
export function getAllUser(){
    return getFetch(`v1/users/count`,{},'get','http://cangdu.org:8001/')
}

//获取全部订单
export function getAllOrder(){
    return getFetch(`bos/orders/count`,{},'get','http://cangdu.org:8001/')
}

//获取全部管理员数量
export function getAllAdmin(){
    return getFetch(`admin/count`)
}

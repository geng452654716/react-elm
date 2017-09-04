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

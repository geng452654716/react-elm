export function userlogin(data){
    return {
        type:'USER_LOGIN',
        suc:data
    }
}

export function userInfo(data){
    return {
        type:'USER_INFO',
        data,
    }
}

export function VIP(data){
    return {
        type:'ADMIN_VIP',
        VIP:data,
    }
}

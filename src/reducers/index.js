const initialState = {
    userlogin:false,
    VIP:false
};

export default function Reducers(state = initialState,action) {
    switch (action.type) {
        case "USER_LOGIN":
            return Object.assign({},state,{
                userlogin:action.suc
            })
        case "USER_INFO":
            return Object.assign({},state,action.data)
        case"ADMIN_VIP":
            return Object.assign({},state,{
                VIP:action.VIP
            })
        default:
            return state
    }
};

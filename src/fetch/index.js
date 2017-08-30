export function login(user_name,password,callback){
    let Fetch = {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            user_name,
            password
        })
    }
    fetch('http://localhost:8001/admin/login',Fetch).then(res=>res.json()).then(json=>{callback(json)})
}

export function outLogin(callback){
    let Fetch = {
        method:'GET'
    }
    fetch('http://localhost:8001/admin/singout',Fetch).then(res=>res.json()).then(json=>{callback(json)})
}

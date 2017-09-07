export function getFetch(url='',data={},type='GET',service='http://localhost:8001/'){
	type = type.toUpperCase();
	if (type == 'GET' || type == 'DELETE') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	let requestConfig = {
		method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
	}

	if (type == 'POST') {
    	Object.assign(requestConfig, {
    		body: JSON.stringify(data)
    	})
    }
    return fetch(service + url,requestConfig)
}

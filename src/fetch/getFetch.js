export function getFetch(url='',data={},type='GET'){
	type = type.toUpperCase();
	if (type == 'GET') {
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
    return fetch(`http://localhost:8001/` + url,requestConfig)
}

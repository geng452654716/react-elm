import * as userInfoActionsFromOtherFile from './state'

//面包屑中间键  使用地址栏信息获取面包屑文字
export function getBreadcrumb(arr){
    return function(dispatch,getStore){
        let path = window.location.pathname;
        let breadcrumb = [];
        let pathArr = path.split('/');
        fn(arr);
        function fn(arr){
            for(let i=1;i<pathArr.length;i++){
                arr.forEach((e) => {
                    if(pathArr[pathArr.length-1] === e.key && !e.path){
                        return;
                    }
                    if(pathArr[i] == e.key){
                        breadcrumb.push(e.name)
                    }else{
                        if(e.children){
                            fn(e.children)
                        }
                    }
                })
            }
        }
        dispatch(userInfoActionsFromOtherFile.breadcrumb(breadcrumb))
    }
}

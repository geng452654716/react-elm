import * as userInfoActionsFromOtherFile from './state'

//面包屑中间键  使用地址栏信息获取面包屑文字
export function getBreadcrumb(arr){
    return function(dispatch,getStore){
        let path = window.location.pathname;
        let breadcrumb = [];
        let pathArr = path.split('/');
        for(let i=1;i<pathArr.length;i++){
            fn(arr,i);
        }
        function fn(arr,i){
            for(let j=0;j<arr.length;j++){
                if(pathArr[pathArr.length-1] == arr[j].key && !arr[j].path){
                    break;
                }
                if(pathArr[i] == arr[j].key){
                    breadcrumb.push(arr[j].name)
                }else{
                    if(arr[j].children){
                        fn(arr[j].children,i)
                    }
                }
            }
        }
        dispatch(userInfoActionsFromOtherFile.breadcrumb(breadcrumb))
    }
}

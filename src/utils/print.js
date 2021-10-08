import { message } from '@/utils/common'
import $Jq from '@/vendor/jquery'
$Jq(window)
function httpPrinterBarcode(printData, Copies = 1, Preview = 1) {
    let ip = '127.0.0.1'
    let port = '12345'
	jQuery.support.cors = true; 
    $.ajax({
        async : false, //循环打印时,　async 必须设置为 false，则所有的请求均为同步请求，在没有返回值之前，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        url : "http://"+ip+":"+port+"/",
        type : "POST",
        contentType: "application/x-www-form-urlencoded", //要这样设置  
        //contentType: "application/json", //错误方式
        dataType : "json", //设置为 json 格式
        //dataType : "text", //设置为 text 格式 也可以,但是返回的结果需要自己解析判断
        xhrFields: {withCredentials: false},
		crossDomain: true, 
        data: JSON.stringify({
			method: 'printreport',
			ReportType: 'gridreport',
			ReportName: 'barcode.grf',
			// ReportVersion: '1',
			// ReportUrl: '',
			Copies,
			Preview,
			Field: [
				{ type: 'ftString',name: 'rkd', size: 255, required: false },
				{ type: 'ftString',name: 'spaceCode', size: 255, required: false },
				{ type: 'ftString',name: 'no', size: 255, required: false },
				{ type: 'ftString',name: 'SKUName', size: 255, required: false }
			],
			Data: printData
		}),
		beforeSend: function (XMLHttpRequest) {
			 // beforeSend 函数里 不允许添加任何 东西	
             //XMLHttpRequest.setRequestHeader("token", 'abcd1234'); //不允许 使用jQuery发送AJAX请求时在header中添加Token
        },
        success: function(data){			
			if(data.status=="ok"){
				message('success', '打印成功')			
			}else{
				message('error', '打印出现异常')
			}
        },
        error: function(data){
            //console.log(status, response);
			console.log(JSON.stringify(data));
			message('error', '"连接HttpPrinter失败');
        }
    });
}
export default httpPrinterBarcode
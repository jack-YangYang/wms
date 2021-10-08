import { message } from '@/utils/common'
import $Jq from '@/vendor/jquery'
$Jq(window)
function httpPrintPdf(PdfUrl, Copies = 1, Preview = 0) {
    let ip = '127.0.0.1'
    let port = '12345'
    let msg = '{'
            +'"method":"' + 'pdfprint' +'"'  /*事件 打印pdf pdfprint  */
            +',"Preview":"' + '0' +'"'  /*可选。是否预览，和主界面设置的效果一样 为空默认不预览,   0：不预览，1：预览(弹出导出的pdf,jpg等文件)。*/
            +',"token":"' + 'aa' +'"' /*可选。只要token值在列表中 方可打印*/
            +',"taskId":"' + '1234567' +'"' /*可选。多个打印任务同时打印时，根据该id确定返回的是哪个打印任务。 */

            +',"PdfUrl":"' + PdfUrl +'"' /*必填 pdf地址 从该地址自动下载*/
            +',"PrinterName":""' /*可选。指定打印机，为空的话 使用默认打印机, 请在 控制面板 -> 设备和打印机 中查看您的打印机的名称 */
            
            +',"PaperSize":"' + "custom" +'"' /*可选,默认A4。 页面类型:   A3 A4 A5 B4 B5 custom    */ 
            +',"PaperLength":"' + "1000" +'"' /*自定义页面高度: 当 PaperSize =  custom 时,才有效*/ 
            +',"PaperWidth":"' + "1000" +'"' /*自定义页面宽度: 当 PaperSize =  custom 时,才有效   */ 
            +',"Copies":"' + '1' +'"' /*可选。打印份数:支持指定打印份数。默认1份*/
            
            +',"PrintQuality":"' + '1' +'"' /*可选。打印质量: 1 = 高, 2 = 中, 3 = 低, 4 = 草稿般的质量。 默认1 */
            +',"Color":"' + '1' +'"' /*可选。颜色: 1 = 单色, 2 = 彩色  默认1 */
            +',"Duplex":"' + '1' +'"' /*可选。双面打印:1 = 单面, 2 = 垂直双面 , 3 = 水平双面 。 默认 1*/
            +',"Collate":"' + '1' +'"' /*可选。指定在打印多份拷贝的时候是否使用校对 : 0 = 否, 1 = 是 。 默认 1 */
            +',"DefaultSource":"' + '0' +'"' /*保留,暂时不用。默认来源（纸盘/纸盒）: 。*/
            +',"MediaType":"' + '1' +'"' /*可选。打印介质类型(纸张类型) 1=标准，2=透明度，3=光泽 。默认 1*/
            +',"Orientation":"' + '1' +'"' /*可选。方向：1=纵向，2=横向  。默认 1*/

            +',"FromPage":"' + '1' +'"' /*可选。从第几页开始 */
            +',"ToPage":"' + '0' +'"' /*可选。至从第几页结束    0 代表最后一页*/
            +',"PageScaling":"' + '0' +'"' /*可选。默认 0 页面缩放 0=无(None)  1=适合纸张(Fit to paper) 2=缩小过大页面(Shrink large pages) */
            +',"AutoRotateCenter":"' + '1' +'"' /*可选 默认1 自动旋转居中 0=不自动旋转页面(Do not rotate pages automatically) 1=旋转页面以适合输出介质，并在页面上居中(Rotate pages to fit on the output medium, and center on the page) -1=旋转页面以适合输出介质，并在页面上居中 但改为逆时针旋转(Rotate pages to fit on the output medium, and center on the page but rotate anticlockwise instead) */
            +',"Title":"' + '' +'"' /*可选。文档的标题 */

            + '}';
				
	jQuery.support.cors = true;         //写到$.ajax $.get $.post 前面 解决 jQuery.Ajax IE8,9 无效（CORS跨域）									
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
        data : msg,
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
export default httpPrintPdf
/**
 * database64文件格式转换为2进制
 *
 * @param  {[String]} data dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
 * @param  {[String]} mime [description]
 * @return {[blob]}      [description]
 */
export default function(data, mime) {
    data = data.split(',')[1]
    data = window.atob(data)
    var ia = new Uint8Array(data.length)
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
    }
    // canvas.toDataURL 返回的默认格式就是 image/png
    return new Blob([ia], {
        type: mime
    })
}
function readFileFirefox(fileBrowser) {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    }
    catch (e) {
        alert('无法访问本地文件，由于浏览器安全设置。为了克服这一点，请按照下列步骤操作：(1)在地址栏输入"about:config";(2) 右键点击并选择 New->Boolean; (3) 输入"signed.applets.codebase_principal_support" （不含引号）作为一个新的首选项的名称;(4) 点击OK并试着重新加载文件');
        return;
    }
    var fileName=fileBrowser.value; //这一步就能得到客户端完整路径。下面的是否判断的太复杂，还有下面得到ie的也很复杂。
    var file = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
    try {
        // Back slashes for windows
        file.initWithPath( fileName.replace(/\//g, "\\\\") );
    }
    catch(e) {
        if (e.result!=Components.results.NS_ERROR_FILE_UNRECOGNIZED_PATH) throw e;
        alert("File '" + fileName + "' cannot be loaded: relative paths are not allowed. Please provide an absolute path to this file.");
        return;
    }
    if ( file.exists() == false ) {
        alert("File '" + fileName + "' not found.");
        return;
    }


    return file.path;
}
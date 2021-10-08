import {
    GetBasicEditingoption,
    supplierName,
    departName,
    catIdTwo,
    newInformation,
    getInformation,
    saveBaseInfo,
    styleList,
    createSkuList,
    productCopy,
    getContent,
    saveSkuList,
    skuListInfo,
    baseImageInfo,
    saveBaseImage,
    checkDeclareWords,
    checkTortWords,
    designImageInfo,
    saveDesignImage,
    skuBaseInfopool,
    saveBaseInfopool,
    getSkuInfo,
    saveSkuInfo,
    getStockItem

}
    from '@/api/devoptions'
export function GetBasicEditingoptions() { //下拉框
    return GetBasicEditingoption().then(res => {
        return res
    })
}
export function suppliername(key) { //默认供应商
    return supplierName(key).then(res => {
        return res
    })
}
export function departname(key) { //  开发人部门
    return departName(key).then(res => {
        return res
    })
}
export function catidtwo(key) { //二级品类
    return catIdTwo(key).then(res => {
        return res
    })
}
export function newinformation(key) { //新建
    return newInformation(key).then(res => {
        return res
    })
}
export function getinformation(key) { //获取
    return getInformation(key).then(res => {
        return res
    })
}
export function savebaseinfo(key) { //编辑保存
    return saveBaseInfo(key).then(res => {
        return res
    })
}
/------------------多款式信息---------------/

export function stylelist(spu) { //多款式信息(获取)下拉框
    return styleList(spu).then(res => {
        return res
    })
}
export function createskulist(data) { //生成多款式信息列表
    return createSkuList(data).then(res => {
        return res
    })
}
export function saveskulist(data) { //保存多款式信息
    return saveSkuList(data).then(res => {
        return res
    })
}
export function skulistinfo(data) { //获取多款式信息
    return skuListInfo(data).then(res => {
        return res
    })
}
/-------------------产品文案-------------------/
export function productcopy(data) { //产品文案保存
    return productCopy(data).then(res => {
        return res
    })
}

export function getcontent(data) { //产品文案获取
    return getContent(data).then(res => {
        return res
    })
}
export function checktortwords(data) { //是否存在侵权词
    return checkTortWords(data).then(res => {
        return res
    })
}
/=----------------------产品底图------------/
export function baseimageinfo(data) { //产品底图获取
    return baseImageInfo(data).then(res => {
        return res
    })
}
export function savebaseimage(data) { //产品底图保存
    return saveBaseImage(data).then(res => {
        return res
    })
}
/-----------中英文申报名审核-是否存在禁用词------------------------/
export function checkdeclarewords(data) { //产品底图保存
    return checkDeclareWords(data).then(res => {
        return res
    })
}
/----------------------设计作图---------------------------/ 
export function designimageinfo(data) { //获取
    return designImageInfo(data).then(res => {
        return res
    })
}
export function savedesignimage(data) { //保存
    return saveDesignImage(data).then(res => {
        return res
    })
}
/---------------产品池编辑------------/ 
export function skubaseinfopool(data) { //获取
    return skuBaseInfopool(data).then(res => {
        return res
    })
}
export function savebaseinfopool(data) { //保存
    return saveBaseInfopool(data).then(res => {
        return res
    })
}
export function getskuinfo(data) { //多款式获取
    return getSkuInfo(data).then(res => {
        return res
    })
}
export function saveskuinfo(data) { //多款式保存
    return saveSkuInfo(data).then(res => {
        return res
    })
}
/----------------------------产品池---------------/
export function getstockitem(data) { //产品池-获取spu对应仓库库存
    return getStockItem(data).then(res => {
        return res
    })
}

export let monthsoptions = [ //_月到_月热销
    { value: '1', label: '1月' },
    { value: '2', label: '2月' },
    { value: '3', label: '3月' },
    { value: '4', label: '4月' },
    { value: '5', label: '5月' },
    { value: '6', label: '6月' },
    { value: '7', label: '7月' },
    { value: '8', label: '8月' },
    { value: '9', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
]
export let setoptions = (date) => {
    return date.map(res => { //运输特性列表
        return {
            value: res.dic_name,
            label: res.dic_name
        }
    })
}
export let catoneoptions = (date) => {
    return date.map(res => { //一级品类列表
        return {
            value: res.id,
            label: res.category_name
        }
    })
}
export let platformsoptions = (date) => {
    return date.map(res => { //电商平台（推荐、禁止）
        return {
            value: res.dic_name,
            label: res.dic_name
        }
    })
}
export let alloptions = (date) => {
    return date.map(res => { //质检类型
        return {
            value: res.dic_id,
            label: res.dic_name
        }
    })
}
export let staffListoptions = (date) => {
    return date.map(res => { //开发负责人
        return {
            value: res.staff_id,
            label: res.staff_name
        }
    })
}
export let supplierName = (date) => {
    return date.map(res => { //开发负责人
        return {
            value: res.id,
            label: res.supplier_name,
            purchase_type: res.cooperation, //采购类型
            // province:res.shipping_province
            supplier_provinces: res.province, //供应商省份
            goods_cycle: res.lead_time, //交货周期天
        }
    })
}
export let departName = (date) => {
    return date.map(res => { //
        return {
            value: res.dept_id,
            label: res.dept_name
        }
    })
}
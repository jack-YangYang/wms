import {
    message,
    confirmMsg,
    dateFormat
} from '@/utils/common'
import {
    mapActions,
    mapMutations
} from 'vuex'
import ProcurementDocuments from '@/components/ProcurementDocuments'
export const common = {
    data() {
        return {
            bookType: 'xls',
            showModule: false,
            date: '',
            autoWidth: true,
        }
    },
    components: {
        ProcurementDocuments
    },
    methods: {
        ...mapActions('Outbound', ['getTypeList']),
        handleChangeModule(show) {
            this.showModule = show
        },
        printShowModule() {
            this.date = dateFormat(new Date())
            this.showModule = true
        },
        handleSelectionChange(val) {
            this.checkDataList = val
        },
        /* handleClick操作 */
        handleClick(flag) {
            switch (flag) {
                case 0:
                    /* 返回 */
                    this.$router.go(-1)
                    return
                case 1:
                    /* 审核 */
                    return
                case 2:
                    /* 保存 */
                    this.saveData()
                    return
                case 3:
                    /* 作废 */
                    return
                case 4:
                    /* 导出 */
                    this.exportData()
                    return
                case 5:
                    /* 下载模板 */
                    this.downloadTemplate()
                    return
            }
        },
        /* 导出 */
        exportData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有可以导出的数据')
                return
            }
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = this.tHeader
                // 设置要导出的属性
                const filterVal = this.filterVal
                // 获取当前展示的表格数据
                const list = this.detailItems;
                // 将要导出的数据进行一个过滤
                const data = this.formatJson(filterVal, list);
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data,
                    // 导出的文件名称
                    filename: this.filename,
                    // 导出的表格宽度是否自动
                    autoWidth: this.autoWidth,
                    // 导出文件的后缀类型
                    bookType: this.bookType
                });
            });
        },
        downloadTemplate() {
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['SKU', '入库数量']
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data: [],
                    // 导出的文件名称
                    filename: this.fileTemplate,
                    // 导出的表格宽度是否自动
                    autoWidth: this.autoWidth,
                    // 导出文件的后缀类型
                    bookType: 'xls'
                });
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        actionsSelFunc(num) {
            switch (num) {
                case 0:
                    /* 返回 */
                    this.$router.go(-1)
                    return
                case 1:
                    /* 审核 */
                    return
                case 2:
                    /* 保存 */
                    this.saveData()
                    return
                case 3:
                    /* 作废 */
                    return
                case 4:
                    /* 导出 */
                    this.exportData()
                    return
                case 5:
                    /* 下载模板 */
                    this.downloadTemplate()
                    return
            }
        },
    },
    mounted() {
        // this.getTypeList()
    }
}
export const otherIn = {
    data() {
        return {
            tHeader: ['产品图片', '库存SKU', '中文名称', '入库数量', '入库单价', '头程金额', '入库金额', '入库单号'],
            filterVal: ['skuImage', 'sku', 'skuName', 'skuCount', 'skuPrice', 'headAmount', 'skuAmount', 'ticketCode'],
            filename: '其他入库单明细.xls',
            fileTemplate: '其他入库单明细模板.xls',
            ticketCode: '',
            checkDataList: [],
        }
    },
    methods: {
        ...mapMutations('OtherIn', [
            'CLEAR_CONTENT',
            'CAHNGE_ITEMS',
            'APPORTION_FEE'
        ]),
        /* 导入成功 */
        uploadSuccess(response) {
            const {
                data: {
                    skuList = [],
                    failList = []
                }
            } = response
            if (!skuList.length) {
                let message = `导入全部失败，失败SKU：${failList.join()}`
                message('error', message)
                return
            }
            let {
                length
            } = failList
            let html = failList.map(item => {
                return `<span>${item}</span>&nbsp;`
            })
            let errorMessage = length ? `当前失败${length}条，失败SKU：<div style="word-break: break-word">${html}</div>` : '当前失败0条'
            const message = `${errorMessage},导出成功会将当前的数据覆盖，要执行此操作吗？`
            confirmMsg('warning', '提示', message, () => {
                this.CAHNGE_ITEMS(skuList)
                this.APPORTION_FEE()
            })
        },
    },
    beforeDestroy() {
        this.CLEAR_CONTENT()
    },
}
export const otherOut = {
    data() {
        return {
            tHeader: ['产品图片', '库存SKU', '中文名称', '出库数量', '出库单价', '出库金额', '出库单号'],
            filterVal: ['skuImage', 'sku', 'skuName', 'skuCount', 'skuPrice', 'skuAmount', 'ticketCode'],
            filename: '其他出库单明细.xls',
            fileTemplate: '其他出库单明细模板.xls',
            url: `${process.env.VUE_APP_ERP_JAVA_DOMAIN}/warehouseOutTicket/skuImport`,
            ticketCode: '',
            checkDataList: [],
        }
    },
    methods: {
        ...mapMutations('OtherOut', [
            'CLEAR_CONTENT',
            'CAHNGE_ITEMS',
            'DELETE_ITEMS'
        ]),
        /* 导入成功 */
        uploadSuccess(response) {
            const {
                data: {
                    skuList = [],
                    failList = []
                }
            } = response
            if (!skuList.length) {
                let message = `导入全部失败，失败SKU：${failList.join()}`
                message('error', message)
                return
            }
            let {
                length
            } = failList
            let html = failList.map(item => {
                return `<span>${item}</span>&nbsp;`
            })
            let errorMessage = length ? `当前失败${length}条，失败SKU：<div style="word-break: break-word">${html}</div>` : '当前失败0条'
            const message = `${errorMessage},导出成功会将当前的数据覆盖，要执行此操作吗？`
            confirmMsg('warning', '提示', message, () => {
                this.CAHNGE_ITEMS(skuList)
            })
        },
        deleteData(index) {
            this.DELETE_ITEMS(index)
        },
    },
    beforeDestroy() {
        this.CLEAR_CONTENT()
    },
}

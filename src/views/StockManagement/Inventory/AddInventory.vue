<template>
    <main>
        <detail-title title="新增盘点" />
        <detail-header>
            <span>新增盘点单</span>
            <span v-html="msg" class="warning"></span>
        </detail-header>
        <left-content :detail="detail" :show="true" />
        <search-sku @doFilterSku="doFilterSku" />
        <detail-table :tableData="detailItems" />
        <div class="action-remark">
            <div>
                <span>备注：</span>
                <el-input type="textarea" v-model="detail.remark" placeholder="请输入备注" />
            </div>
            <action-group @handleClick="handleClick" @uploadSuccess="uploadSuccess" :uploaddUrl="uploadAddress" :detail="detail" />
        </div>
    </main>    
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import leftContent from './components/detailHead'
import detailTable from './components/detailTable'
import searchSku from '@/components/SearchSku'
import actionGroup from '../components/Action'
import { mapState, mapActions, mapMutations } from 'vuex'
import { message, confirmMsg } from '@/utils/common'
export default {
    components: {
        detailTitle,
        leftContent,
        detailHeader,
        detailTable,
        actionGroup,
        searchSku
    },
    computed: {
        ...mapState('Inventory', ['detail', 'detailItems']),
        uploadAddress() {
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${this.detail.whouseId}/0/${true}`
        }
    },
    data() {
        return {
            msg: '切换仓库会导致下面SKU清空!',
            filename: '盘点单详情',
            bookType: 'xls',
            autoWidth: true,
        }
    },
    beforeDestroy() {
        this.CLEAR_CONTENT()
    },
    methods: {
        ...mapActions('Inventory', [
            'findSkuDetail',
            'addIninventory'
        ]),
        ...mapMutations('Inventory', ['CAHNGE_ITEMS', 'CLEAR_CONTENT']),
        ...mapActions(['getAllwarehouse']),
        doFilterSku(sku) {
            if (!this.detail.whouseId) {
                message('warning', '请先选择仓库')
                return
            }
            if (this.detailItems.find(item => item.sku === sku )) {
                message('warning', '当前的SKU已经存在')
                return
            }
            this.findSkuDetail({ whouseId: this.detail.whouseId, shopId: 0, sku })
        },
        /* 导出数据 */
        exportData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有可以导出的数据')
                return
            }
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['库存SKU', '中文名称', '盘点单价', '盘点数量', '库位']
                // 设置要导出的属性
                const filterVal = ['sku', 'skuName', 'skuPrice', 'skuCount', 'skuSpaces']
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
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        /* 保存 */
        saveData() {
            if (!this.detail.whouseId) {
                message('warning', '请先选择仓库')
                return
            }
            if (!this.detailItems.length) return
            if (!this.detailItems.every(item => item.skuPrice)) {
                message('warning', '调拨数量不允许为空并且只能为整数')
                return
            } 
            let data = {
                whouseId: this.detail.whouseId,
                remark: this.detail.remark,
                skuList: this.detailItems.map(item => {
                    return {
                        count: item.skuCount,
                        sku: item.sku,
                        price: item.skuPrice
                    }
                })
            }
            this.addIninventory({ data })
        },
        /* 导入成功 */
        uploadSuccess(response) {
            const { data: { skuList = [], failList = [] } } = response
            if (!skuList.length) {
                let message = `导入全部失败，失败SKU：${failList.join()}`
                message('error', message)
                return
            }
            let { length } = failList
            let html = failList.map(item => {
                return `<span>${item}</span>&nbsp;`
            })
            let errorMessage = length ? `当前失败${length}条，失败SKU：<div style="word-break: break-word">${html}</div>` : '当前失败0条'
            const message = `${errorMessage},导出成功会将当前的数据覆盖，要执行此操作吗？`
            confirmMsg('warning', '提示', message, () => {
                this.CAHNGE_ITEMS(skuList)
            })
        },
        downloadTemplate() {
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['SKU', '盘点库存']
                excel.export_json_to_excel({
                // 导出的头部
                header: tHeader,
                // 导出的内容
                data: [],
                // 导出的文件名称
                filename: '盘点单库存导入模板',
                // 导出的表格宽度是否自动
                autoWidth: this.autoWidth,
                // 导出文件的后缀类型
                bookType: 'xls'
                });
            });
        },
        handleClick(type) {
            switch (type) {
                case 0: /* 返回 */
                    this.$router.go(-1)
                return
                // case 1: /* 审核 */
                //     this.audit()
                // return
                case 2: /* 保存 */
                    this.saveData()
                return
                // case 3: /* 作废 */
                //     this.invalid()
                // return
                case 4: /* 导出 */
                    this.exportData()
                return
                case 5:
                    this.downloadTemplate()
            }
        },
    },
    mounted() {
        this.getAllwarehouse({type: 2})
    }
}
</script>
<style scoped lang="scss">
main {
    .warning {
        color:  #ff6b6b;
        padding-left: 10px;
    }
    .action-remark {
        display: flex;
        align-items: center;
        justify-content: space-between;
         & > div:nth-child(1) {
             display: flex;
             width: 60%;
              align-items: center;
              & > span {
                //   min-width: 66px;
                //   text-align: right;
              }
              .el-textarea {
                  width: 80%;
              }
         }
    }
}
</style>
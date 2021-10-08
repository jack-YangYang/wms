<template>
    <div>
        <transition name="fade-transform" mode="out-in">
            <product-barcode-components
                :date="date"
                @handleChangeModule="changeProductModuleType"
                @confirmPrint="printSure({ type: 1, ticketCode })"
                v-if="showProductModule"
                :showProductModule="showProductModule"
                :productBarcodeList="productBarcodeList"
            />
        </transition>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { message, dateFormat, confirmMsg } from '@/utils/common'
import ProductBarcodeComponents from '@/components/ProcurementDocuments/productBarcode'
export default {
    components: { ProductBarcodeComponents },
    data() {
        return {
            //打印商品标签相关参数
            ticketCode: '',
            date: '',
            showProductModule: false,
            productBarcodeList: [],
        }
    },
    methods: {
        ...mapActions('PutInStorageOrder', [
            'confirmPrint',
            'getSimpleOrderDetail',
        ]),
        changeProductModuleType(show) {
            this.showProductModule = show
        },
        createCode(list, label) {
            const codeList = []
            let sum = 0
            list.forEach((item) => (sum += Number(item[label])))
            console.log(sum, 'sum')
            if (sum === 0) {
                return false
            }
            if (sum >= 800) {
                list.forEach((item) => {
                    codeList.push({
                        sku: item.sku,
                        spaceCode: item.spaceCode,
                        skuName: item.skuName,
                    })
                })
                return {
                    flag: false,
                    codeList,
                }
            }
            list.forEach((item) => {
                for (let i = 0; i < item[label]; i++) {
                    codeList.push({
                        sku: item.sku,
                        spaceCode: item.spaceCode,
                        skuName: item.skuName,
                    })
                }
            })
            console.log(codeList, 999)
            return {
                flag: true,
                codeList,
            }
        },
        setModule({ ticketCode }) {
            this.ticketCode = ticketCode
            this.getSimpleOrderDetail(ticketCode).then(
                ({ detail: { state }, items }) => {
                    this.date = dateFormat(new Date())
                    const messages =
                        '当前的入库数量已超过自动打印的最大限制数量，需要去浏览器填入数量'
                    if (!this.createCode(items, 'planCount')) {
                        message('warning', '当前没有可以打印的商品标签')
                        return
                    }
                    const { flag, codeList } = this.createCode(items, 'planCount')
                    this.productBarcodeList = codeList
                    if (!flag) {
                        confirmMsg('warning', '提示', messages, () => {
                            this.showProductModule = true
                        })
                        return
                    }
                    this.showProductModule = true
                }
            )
        },
        printSure(arg) {
            this.$emit('printSure', arg)
        },
    },
}
</script>

<style>
</style>
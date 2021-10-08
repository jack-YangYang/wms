<template>
    <main>
        <detail-title title="入库单" />
        <detail-header>
            <span>入库单号: {{ ticketCode }}</span>
        </detail-header>
        <detail-content  :detail="detail" :type="type" :state="state" />
        <detail-table :detailItems="detailItems" :type="type" :state="state" :detail="detail" />
        <ul class="content-ul">
            <li>
                <router-link :to="{ name: 'PutInStorageOrder' }">
                    <el-button size="mini">返回</el-button>
                </router-link>           
            </li>  
            <li v-if="!type && state === 10">
                <el-button type="primary"  size="mini" @click="confirmPutinStorage(1)">确认质检</el-button>
            </li> 
            <li  v-if="!type && state === 70">
                <el-button type="primary" size="mini" @click="confirmPutinStorage(0)">保存</el-button>
            </li> 
            <!-- <li>
                <el-button type="primary" size="mini" @click="printShowModule">打印入库单</el-button>
            </li>
            <li>
                <el-button type="primary" size="mini" @click="printShowProductModule">打印商品标签</el-button>
            </li>  -->
            <li>
                <span>入库备注：</span>
                <el-input v-model="detail.remark" clearable placeholder="请输入" maxlength="300"  show-word-limit type="textarea" />
            </li>
        </ul>
        <div class="upload-picture" v-if="!type">
            <el-upload
                class="upload-demo"
                :on-exceed="handleExceed"
                :action="action"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-error="uplaodError"
                multiple
                :show-file-list="false"
                >
                <el-button size="mini" type="text" style="font-size: 14px">上传图片附件</el-button>
            </el-upload>
            <image-list @handleRemove="handleRemove" :list="fileList" />
        </div>
        <transition name="fade-transform" mode="out-in">
            <shop-info-module 
            :tableData="shopInfoTable" 
            :type="2"
            :showModule="showShopInfoModule" 
            @handleSubmit="GET_SHOP_INFO_DATA"
            v-if="showShopInfoModule" />
        </transition>
        <!-- <transition name="fade-transform" mode="out-in">
                <procurement-documents 
                @handleChangeModule="handleChangeModule"
                v-if="showModule" 
                @confirmPrint="confirmPrint({ type: 0, ticketCode })"
                :showModule="showModule" 
                :detail="detail" 
                :detailItems="detailItems" 
                :date="date" />
            </transition>
            <transition name="fade-transform" mode="out-in">
                <product-barcode-components
                :date="date"
                @handleChangeModule="changeProductModuleType"
                @confirmPrint="confirmPrint({ type: 1, ticketCode })"
                v-if="showProductModule"
                :showProductModule="showProductModule"
                :productBarcodeList="productBarcodeList" 
                />
            </transition> -->
    </main>
</template>
<script>
import shopInfoModule from '@/components/GetShopInfo'
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailContent'
import detailTable from './components/detailTable'
// import ProcurementDocuments from '@/components/ProcurementDocuments/PutInStorageOrderPrint'
// import ProductBarcodeComponents from '@/components/ProcurementDocuments/productBarcode'
import imageList from './components/imageList'
import { mapState, mapActions, mapMutations } from 'vuex'
import { dateFormat, message, confirmMsg } from '@/utils/common'
export default {
    components: {
        detailTitle,
        shopInfoModule,
        detailHeader,
        imageList,
        detailContent,
        detailTable,
        // ProcurementDocuments,
        // ProductBarcodeComponents
    },
    data() {
        return {
            whouseId: '',
            action: `${process.env.VUE_APP_FBA_API}/multipartFile/upload`,
            // action: 'http://172.16.50.105:8080/multipartFile/upload',
            fileList: [],
            type: 1,
            state: 1,
            showModule: false,
            showProductModule: false,
            productBarcodeList: [],
            date: '',
            ticketCode: '',
        }
    },
    computed: {
        ...mapState('PutInStorageOrder', [
            'detail',
            'shopInfoTable',
            'showShopInfoModule',
            'detailItems',
            'spaceList'
        ]),
        isDisabled() {
            return this.state === 3 ? true : false
        },
    },
    methods: {
        ...mapActions('PutInStorageOrder', [
            'confirmPrint',
            'purchaseInStockIn',
            'getPutInStorageOrderDetail'
        ]),
        ...mapMutations('PutInStorageOrder', ['GET_SHOP_INFO_DATA']),
        beforeUpload(file) {
            const types = ['image/png', 'image/jpg', 'image/jpeg']
            if (!types.includes(file.type)) {
                message('warning', '当前上传的文件类型错误')
                return false
            }
            if (this.fileList.length === 10) {
                message('warning', '当前已达到文件上传的最大数量')
                return false
            }
            // loading()
        },
        handleRemove(index) {
            this.fileList.splice(index, 1)
        },
        uploadSuccess(response) {
            // loadingClose()
            const { code, data } = response
            if (code === 0) {
                this.fileList.push(data[0])
            }
        },
        uplaodError(err) { 
            // loadingClose()
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // printShowModule() {
        //     this.date = dateFormat(new Date())
        //     this.showModule = true
        // },
        // createCode(list, label) {
        //     const codeList = []
        //     let sum = 0
        //     list.forEach(item => sum+=Number(item[label]))
        //     if (sum === 0) {
        //         return false
        //     }
        //     if (sum >= 800) {
        //         list.forEach(item => {
        //             codeList.push({
        //                 sku: item.sku,
        //                 spaceCode: item.spaceCode,
        //                 skuName: item.skuName
        //             })
        //         })
        //         return {
        //             flag: false,
        //             codeList
        //         }
        //     }
        //     list.forEach(item => {           
        //         for (let i = 0; i < item[label]; i++) {
        //             codeList.push({
        //                 sku: item.sku,
        //                 spaceCode: item.spaceCode,
        //                 skuName: item.skuName
        //             })
        //         }
        //     })
        //     console.log(codeList)
        //     return {
        //         flag:true,
        //         codeList
        //     }
        // },
        // printShowProductModule() {
        //     this.date = dateFormat(new Date())
        //     const messages = '当前的入库数量已超过自动打印的最大限制数量，需要去浏览器填入数量'
        //     if (!this.createCode(this.detailItems, 'qaCount')) {
        //         message('warning', '当前没有可以打印的商品标签')
        //         return
        //     }
        //     const { flag, codeList } = this.createCode(this.detailItems, 'qaCount')
        //     this.productBarcodeList = codeList
        //     if (!flag) {
        //         confirmMsg('warning', '提示', messages, () => {
        //             this.showProductModule = true
        //         })
        //         return
        //     }  
        //     this.showProductModule = true
        // },
        handleChangeModule(show) {
            this.showModule = show
        },
        changeProductModuleType(show) {
            this.showProductModule = show
        },
        confirmPutinStorage(type) {
            if (!this.detailItems.every(item => item.qaCount <= item.planCount && item.qaCount)) {
                message('warning', '入库数量只能小于或等于计划入库数量,必须填写入库数量')
                return
            }
            if (!this.detailItems.every(item => item.qaCount === item.planCount)) {
                    if (!this.detail.remark) {
                        message('warning', '质检存在差异，需要在备注里面填写清楚差异原因！')
                        return
                    }
                }
            let data = {
                remark: this.detail.remark,
                qaUserName: this.detail.qaUserName,
                fileList: this.fileList.map(item => item.url),
                skuList: this.detailItems.map(item => {
                    return {
                        count: item.qaCount,
                        sku: item.sku,
                    }
                })
            }
            this.purchaseInStockIn({data, state: this.state, ticketCode: this.ticketCode})
        },
    },
    async created() {
        let { ticketCode, type, state  } = this.$route.query
        this.ticketCode = ticketCode
        this.type = type * 1
        this.state = state * 1
        this.getPutInStorageOrderDetail({ ticketCode: this.ticketCode, state, type: this.type })
    }
}
</script>
<style scoped lang="scss">
main {
    ul {
        display: flex;
        list-style: none;
        align-items: center;
        flex-direction: row-reverse;
        background: #F5F7FA;
        margin: 0;
        padding: 10px 0;
        li:last-child {
            width: 30%;
            display: flex;
            align-items: center;
            span {
                color: #ccc;
                min-width: 100px;
                display: inline-block;
                text-align: right;
            }
        }
        li {
            margin-right: 15px;
        }
    }
}
</style>
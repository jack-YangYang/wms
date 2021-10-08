<template>
    <main>
        <header>
            <div>
                <span>入库单号:</span>
                <el-input placeholder="请扫描入库单号" v-model="search.ticketCode" />
            </div>
            <div>
                <span>SKU:</span>
                <el-input placeholder="请扫描SKU" v-model="search.sku" />
            </div>
            <div>
                <el-button type="primary" size="mini" @click="quaalityTicketInfo(0)" :disabled="isStarted">开始质检</el-button> 
            </div>
        </header>
        <title-info />
        <div class="info-content">
            <el-card>
                <left-info :skuDetail="ticketInInfo.skuDetail" :productDetail="ticketInInfo.productDetail" />
            </el-card>
            <el-card>
                <right-info :productDetail="ticketInInfo.productDetail" />
            </el-card>
        </div>
        <title-info title="质检信息" />
        <bottomInfo :detail="ticketInInfo.detail">
            <template slot="number">
                <el-input-number style="width:60%" v-model="info.count" :min="1" :controls="false" />
            </template>
            <template slot="reason">
                <el-input type="textarea" style="width:60%" v-model="info.remark" />
            </template>
        </bottomInfo>
        <div class="upload-picture">
            <upload-image 
            title="上传附件图片" 
            name="file"
            @handleImageSuccess="uplaodSuccess"
            :uploaddUrl="action"  />
            <image-list @handleRemove="handleRemove" :list="info.fileList" />
        </div>
        <div class="action-group">
            <el-button type="primary" size="mini" @click="quaalityTicketInfo">确认质检</el-button>
            <el-button type="primary" size="mini" @click="printStorage">打印入库单</el-button>
            <el-button type="primary" size="mini" @click="printSkuLabel">打印商品标签</el-button>      
        </div>
        <transition name="fade-transform" mode="out-in">
            <procurement-documents 
            @handleChangeModule="handleChangeModule"
            v-if="showModule" 
            :showModule="showModule" 
            :detail="detail" 
            :detailItems="detailItems" 
            :date="date" />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <product-barcode-components
                :date="date"
                @handleChangeModule="changeProductModuleType"
                v-if="showProductModule"
                :showProductModule="showProductModule"
                :productBarcodeList="productBarcodeList"
            >
            <span>123456789</span>
            </product-barcode-components>
        </transition>
    </main>
</template>
<script>
import titleInfo from './components/title'
import leftInfo from './components/leftInfo'
import rightInfo from './components/imageList'
import ProcurementDocuments from '@/components/ProcurementDocuments/PutInStorageOrderPrint'
import ProductBarcodeComponents from '@/components/ProcurementDocuments/productBarcode'
import bottomInfo from './components/bottomInfo'
import uploadImage from '@/components/Upload/uploadImage'
import imageList from './components/uploadImageList.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { debounce, dateFormat, message, clearObjValue } from '@/utils/common'
import { getPutInStorageOrderDetail, ticketIn, startInspection } from '@/api/PutInStorageOrder'
const ticketInInfo = {
    productDetail: {
        mainPics: [],
        otherPics: [],
        partPics: []
    },
    detail: {},
    skuDetail: {}
}
export default {
    name: 'Quality',
    components: {
        titleInfo,
        ProcurementDocuments,
        ProductBarcodeComponents,
        leftInfo,
        rightInfo,
        bottomInfo,
        uploadImage,
        imageList
    },
    computed: {
        ...mapState('PutInStorageOrder', ['ticketInInfo']),
        info: {
            get() {
                return this.$store.state.PutInStorageOrder.ticketInInfoFormat
            },
            set(val) {
                this.$store.state.PutInStorageOrder.ticketInInfoFormat = val
            }
        }
    },
    watch: {
        search: {
            handler(val) {
                const { ticketCode, sku } = val
                if (ticketCode && sku) {
                    debounce(() => {
                        this.getTicketInInfo(val)
                    }, 500)
                }
            },
            deep: true
        }
    },
    // beforeDestroy() {
    //     clearObjValue(this.search)
    //     this.GET_TICKET_INFO(ticketInInfo)
    //     this.CAHNGE_ticketInInfoFormat()
    // },
    methods: {
        ...mapActions('PutInStorageOrder', ['getTicketInInfo', 'ticketIn']),
        ...mapMutations('PutInStorageOrder', ['GET_TICKET_INFO', 'CAHNGE_ticketInInfoFormat']),
        handleRemove(index) {
            this.info.fileList.splice(index, 1)
        },
        uplaodSuccess(response) {
             const { code, data } = response
            if (code === 0) {
                this.info.fileList = this.info.fileList.concat(data)
            }
        },
        async quaalityTicketInfo(type = 1) {
            const { remark, count, fileList } = this.info
            const { ticketCode, sku } = this.search
            if (type === 0) {
                const { code } = await startInspection(ticketCode)
                if (code === 0) {
                    this.isStarted = false
                    message('success', '开始质检成功')
                }
                return
            }
            if (!ticketCode || !sku || !count) {
                message('warning', '请填写完整信息')
                return
            }   
            if ((count !== this.ticketInInfo.detail.planCount && !remark) || count > this.ticketInInfo.detail.planCount) {
                message('warning', '质检数量存在差异时备注必填并且质检数量要小于计划入库数量')
                return
            }
            let data = {
                remark,
                fileList: fileList.map(item => item.url),
                skuList: [
                    {
                        count,
                        sku
                    }
                ]
            }
            const { code } = await ticketIn({ ticketCode, data })
            if (code === 0) {
                message('success', '质检成功')
                clearObjValue(this.search)
                this.GET_TICKET_INFO(ticketInInfo)
                this.CAHNGE_ticketInInfoFormat()
            }
        },
        async printStorage() {
            if (JSON.stringify(this.ticketInInfo.skuDetail) === '{}') return
            if (!this.search.ticketCode) return
            const { data: { detail, items } } =  await getPutInStorageOrderDetail(this.search.ticketCode)
            this.detail = detail
            this.detailItems = items
            this.date = dateFormat(new Date())
            this.showModule = true
        },
        saveTicketInfo() {
            
        },
        changeProductModuleType() {
            this.showProductModule = false
        },
        handleChangeModule() {
            this.showModule = false
        },
        printSkuLabel() {
            if (JSON.stringify(this.ticketInInfo.skuDetail) === '{}') return
            this.date = dateFormat(new Date())
            const { skuDetail: { sku, skuName }, detail: { planCount } } = this.ticketInInfo
            this.productBarcodeList = Array.from({ length: planCount }, () => {
                return {
                    sku,
                    skuName
                }
            })
            // this.productBarcodeList = new Array(planCount).fill({
            //     sku,
            //     skuName
            // })
            this.showProductModule = true
        }
    },
    data() {
        return {
            action: `${process.env.VUE_APP_FBA_API}/multipartFile/upload`,
            productBarcodeList: [],
            isStarted: false,
            detailItems: [],
            detail: {},
            showModule:false,
            showProductModule: false,
            date: '',
            search: {
                ticketCode: '',
                sku: ''
            }
        }
    }
}
</script>
<style scoped lang="scss">
main {
    header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 5px 0;
        & > div {
            display: flex;
            align-items: center;
            margin-right: 25px;
            span {
                // font-weight: bold;
                font-size: 13px;
                color: #888888;
                min-width: 70px;
                text-align: right;
                padding-right: 10px;
            }
        }
    }
    .info-content {
        display: flex;
        flex-wrap: wrap;
        & > div {
            width: 50%;
        }
    }
    .action-group {
        display: flex;
        flex-direction: row-reverse;
    }
}
</style>
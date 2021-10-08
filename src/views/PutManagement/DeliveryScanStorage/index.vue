<template>
    <main>
        <header>
            
            <el-form>
                <el-input v-model.trim="search.searchWord" placeholder="请扫描需要查询的单号" style="width:350px">
                    <el-select v-model="search.searchKey" slot="prepend" style="width:120px">
                        <el-option label="采购单号" value="ticketCode" />
                        <el-option label="跟踪号" value="shipCode" />
                        <el-option label="1688单号" value="alibabaCode" />
                    </el-select>
                </el-input>
            </el-form>
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
        <title-info title="入库信息" />
        <bottomInfo :detail="ticketInInfo.skuDetail">
            <!-- <template slot="planCount">
                <el-input-number style="width:60%" v-model="info.planIncount" :min="1" :controls="false" />
            </template> -->
            <template slot="number">
                <el-input-number style="width:60%" v-model="info.count" :min="1" :controls="false" />
            </template>
            <template slot="reason">
                <el-input type="textarea" style="width:60%" v-model="info.remark" />
            </template>
        </bottomInfo>
        <div class="action-group">
            <el-button type="primary" size="mini" @click="quaalityTicketInfo">确认质检</el-button>
            <el-button type="primary" size="mini" @click="printSkuLabel">打印商品标签</el-button>      
        </div>
        <!-- <div class="upload-picture">
            <upload-image 
            title="上传附件图片" 
            name="file"
            @handleImageSuccess="uplaodSuccess"
            :uploaddUrl="action"  />
            <image-list @handleRemove="handleRemove" :list="info.fileList" />
        </div> -->
        <transition name="fade-transform" mode="out-in">
            <product-barcode-components
                :date="date"
                @handleChangeModule="changeProductModuleType"
                v-if="showProductModule"
                :showProductModule="showProductModule"
                :productBarcodeList="productBarcodeList"
            >
                <span>{{ rkdCode }}</span>
            </product-barcode-components>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <show-select-module v-if="showModule" />
        </transition>
        <print-module  ref="printModule" />
    </main>
</template>
<script>
import titleInfo from '../Quality/components/title'
import leftInfo from '../Quality/components/leftInfo'
import rightInfo from '../Quality/components/imageList'
import ProductBarcodeComponents from '@/components/ProcurementDocuments/productBarcode'
import bottomInfo from './components/bottomInfo'
import uploadImage from '@/components/Upload/uploadImage'
import imageList from '../Quality/components/uploadImageList'
import showSelectModule from './components/showModule'
import printModule from './components/printModule'
import httpPrinterBarcode from '@/utils/print'
import { mapActions, mapMutations, mapState } from 'vuex'
import { debounce, dateFormat, message, clearObjValue, loading, loadingClose } from '@/utils/common'
import { purchaseInStockIn } from '@/api/PutInStorageOrder'
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
        ProductBarcodeComponents,
        leftInfo,
        rightInfo,
        bottomInfo,
        uploadImage,
        imageList,
        showSelectModule,
        printModule
    },
    computed: {
        ...mapState('DeliveryScanStorage', ['ticketInInfo', 'showModule', 'ticketCode', 'rkdCode', 'sku', 'ticketInInfoFormat']),
        info: {
            get() {
                return this.$store.state.DeliveryScanStorage.ticketInInfoFormat
            },
            set(val) {
                this.$store.state.DeliveryScanStorage.ticketInInfoFormat = val
            }
        }
    },
    watch: {
        'search.searchWord': {
            handler(val) {
                if (!val) return
                debounce(() => {
                    this.GET_TICKET_INFO(ticketInInfo)
                    this.CAHNGE_ticketInInfoFormat()
                    this.getProcurementorder({
                        params: { 
                            [this.search.searchKey]: val
                        },
                        _that: this.$refs.printModule
                    })
                    // this.getTicketInInfo(val)
                }, 500)
            }
        },
        'search.searchKey': {
            handler() {
                this.search.searchWord = ''
                this.GET_TICKET_INFO(ticketInInfo)
                this.CAHNGE_ticketInInfoFormat()
            }
        }, 
        'info.planIncount': {
            handler(val) {
                this.$store.commit('DeliveryScanStorage/CAHNGE_IN_COUNT', val)
            }
        }
    },
    methods: {
        ...mapActions('DeliveryScanStorage', ['getTicketInInfo', 'ticketIn', 'getProcurementorder']),
        ...mapMutations('DeliveryScanStorage', ['GET_TICKET_INFO', 'CAHNGE_ticketInInfoFormat']),
        async quaalityTicketInfo() {
            const { remark, count, planIncount, fileList } = this.info
            // const { planIncount } = this.ticketInInfo.ticketInInfoFormat
            // const { taxPrice, price, expressPrice } = this.ticketInInfo.skuDetail
            const { rkdCode, sku,  } = this
            if (!rkdCode || !sku || !count) {
                message('warning', '请填写完整信息')
                return
            }   
            if ((count !== planIncount && !remark) || count > planIncount) {
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
            loading()
            try {
                const { code } = await purchaseInStockIn({ ticketCode: rkdCode, data, state: 20 })
                loadingClose()
                if (code === 0) {
                    message('success', '质检成功')
                    this.search.searchWord = ''
                    this.GET_TICKET_INFO(ticketInInfo)
                    this.CAHNGE_ticketInInfoFormat()
                }
            } catch(e) {
                loadingClose()
            }
        },
        uplaodSuccess(response) {
             const { code, data } = response
            if (code === 0) {
                this.info.fileList = this.info.fileList.concat(data)
            }
        },
        handleRemove(index) {
            this.info.fileList.splice(index, 1)
        },
        changeProductModuleType() {
            this.showProductModule = false
        },
        printSkuLabel() {
            if (JSON.stringify(this.ticketInInfo.skuDetail) === '{}') return
            if (!this.rkdCode) {
                message('warning', '没有入库单号禁止打印')
                return
            }
            this.date = dateFormat(new Date())
            const { skuDetail: { sku, skuName, spaceCode } } = this.ticketInInfo
            httpPrinterBarcode([
                { rkd: this.rkdCode, no: sku, SKUName: skuName, spaceCode }
            ], this.info.count, 0)
        }
    },
    data() {
        return {
            productBarcodeList: [],
            action: `${process.env.VUE_APP_FBA_API}/multipartFile/upload`,
            detailItems: [],
            detail: {},
            showProductModule: false,
            date: '',
            search: {
                searchKey: 'shipCode',
                searchWord: ''
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
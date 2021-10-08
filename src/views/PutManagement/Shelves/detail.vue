<template>
    <main>
        <detail-title title="入库单" />
        <detail-header>
            <span>入库单号: {{ ticketCode }}</span>
        </detail-header>
        <detail-content  :detail="detail" />
        <detail-table :detailItems="detailItems" :isDisabled="isDisabled" :spaceCodelist="spaceCodelist" />
        <ul class="content-ul">
            <li>
                <router-link :to="{ name: 'Shelves' }">
                    <el-button size="mini">返回</el-button>
                </router-link>           
            </li>  
            <li  v-if="isDisabled">
                <el-button type="primary" size="mini" @click="confirmPutinStorage">上架</el-button>
            </li> 
            <li>
                <span>入库备注：</span>
                <el-input v-model="detail.remark" :disabled="!isDisabled" clearable placeholder="请输入" maxlength="300"  show-word-limit type="textarea" />
            </li>
        </ul>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailContent'
import detailTable from './components/detailTable'
import { mapState, mapActions } from 'vuex'
import { dateFormat, message, confirmMsg } from '@/utils/common'
export default {
    components: {
        detailTitle,
        detailHeader,
        detailContent,
        detailTable,
    },
    data() {
        return {
            whouseId: '',
            action: `${process.env.VUE_APP_ERP_JAVA_DOMAIN}/multipartFile/upload`,
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
        ...mapState('Shelves', [
            'detail',
            'spaceCodelist',
            'detailItems',
            'spaceList'
        ]),
        isDisabled() {
           const { type } = this.$route.query
           return type === 'edit'
        },
    },
    methods: {
        ...mapActions('Shelves', [
            'shelvesActioon',
            'getPutInStorageOrderDetail'
        ]),
        confirmPutinStorage() {
            if (!this.detailItems.every(item => item.space)) {
                message('warning', 'SKU库位不能为空')
                return
            }
            let data = {
                ticketCode: this.ticketCode,
                skuList: this.detailItems.map(item => {
                    return {
                        sku: item.sku,
                        spaceCode: item.space,
                    }
                })
            }
            this.shelvesActioon(data)
        },
    },
    async created() {
        let { ticketCode, type } = this.$route.query
        this.ticketCode = ticketCode
        this.type = type * 1
        this.getPutInStorageOrderDetail({ ticketCode: this.ticketCode, type: this.type })
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
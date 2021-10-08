<template>
    <div class="main">
        <div class="abnormal-content">
            <Header>
                {{ title }}
            </Header>
            <detail-content 
            :detail="detail" 
            :isDisabled="isDisabled" 
            @changeTicketCode="changeTicketCode"
            :orderList="orderList" />
            <div class="item">
                <div>
                    <span>备注:</span>
                    <el-input type="textarea" placeholder="请输入备注" v-model="remark" :disabled="isDisabled" :maxLength="300" />
                </div>
            </div>
            <Header class="header">
                商品信息
            </Header>
            <fallback-content 
            :tableData="items" 
            @selectionChange="selectionChange"
            :isDisabled="isDisabled" />
            <div class="actions">
                <el-button type="primary" size="mini" @click="$router.go(-1)">返 回</el-button>
                <el-button type="primary" size="mini"  @click="confirm({ ticketCode, remark, checkList })" v-if="!isDisabled">保 存</el-button>
                <el-button type="primary" size="mini"  @click="exportData(isDisabled)">导 出</el-button>
            </div>
        </div>
        <transition name="fade-transform" mode="out-in">
            <shop-info-module 
            :tableData="shopInfoTable" 
            :type="3"
            :showModule="showShopInfoModule" 
            @handleSubmit="GET_SHOP_INFO_DATA"
            v-if="showShopInfoModule" />
        </transition>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { message } from '@/utils/common'
import shopInfoModule from '@/components/GetShopInfo'
import fallbackContent from './components/fallbackcontent-table'
import detailContent from './components/detailContent'
export default {
    components: {
        fallbackContent,
        shopInfoModule,
        detailContent
    },
    data() {
        return {
            status: 'add',
            checkList: [],
            title: '新增采购退回单',
        }
    },
    computed: {
        ...mapState('ProcurementFallback', ['orderList', 'shopInfoTable', 'showShopInfoModule', 'items', 'detail']),
        isDisabled() {
            return this.status === 'view'
        },
        ticketCode: {
            get() {
                return this.$store.state.ProcurementFallback.ticketCode
            },
            set(val) {
                this.$store.state.ProcurementFallback.ticketCode = val
            }
        },
        remark: {
            get() {
                return this.$store.state.ProcurementFallback.remark
            },
            set(val) {
                this.$store.state.ProcurementFallback.remark = val
            }
        }
    },
    methods: {
        ...mapActions('ProcurementFallback', ['getOrderList', 'getTicketInfo']),
        ...mapActions('ProcurementFallback', {
            changeTicketCode: 'getOrderInfo',
            confirm: 'addOrder',
        }),
        selectionChange(items) {
            this.checkList = items
        },
        ...mapMutations('ProcurementFallback', {
            exportData: 'EXPORT_DATA',
            GET_SHOP_INFO_DATA: 'GET_SHOP_INFO_DATA',
            clearInfo: 'CLEAR_DATA'
        }),
    },
    beforeDestroy() {
        this.clearInfo()
    },
    async mounted() {
        this.getOrderList()
        const { ticketCode, type } = this.$route.query
        this.status = type
        if (ticketCode) {
            this.getTicketInfo({ ticketCode, type: false })
            this.title = '采购退回单详情'
        }
    }
}
</script>
<style lang="scss" scoped>
.abnormal-content {
    width: 95%;
    margin: 0 auto;
    padding: 0px 0;
    border: 1px solid #dfe6ec;
    // height: calc(100vh - 140px);
    border-radius: 5px;
    header {
        font-size: 14px;
        padding: 15px 20px;
        font-weight: bold;
        color: #34495e;
        border-bottom: 1px solid #dfe6ec;
    }
    .header {
        font-size: 14px;
    }
    .item {
        min-height: 56px;
        border-bottom: 1px solid #dfe6ec;
        display: flex;
        align-items: center;
        flex-wrap: wrap ;
        padding: 5px 0;
        font-weight: bold;
        color: #34495e;
        & > div {
            flex: 1;
            display: flex;
            align-items: center;
            padding-left: 20px;
            & > span {
                display: inline-block;
            }
            & > span:nth-child(1) {
                min-width: 100px;
                text-align: right;
                padding-right: 10px;
            }
            & > span:nth-child(2) {
                width: 280px;
                padding-left: 10px;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                height: 36px;
                line-height: 36px;
                background-color: rgba(242, 242, 242, 1)
            }
        }
    }
    .actions {
        display: flex;
        flex-direction: row-reverse;
        padding: 10px 10px;
        .el-button {
            margin-left: 10px;
        }
    }
}
</style>
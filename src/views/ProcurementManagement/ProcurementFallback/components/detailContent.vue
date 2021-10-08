<template>
    <div>
        <div class="item">
            <div>
                <span>关联采购单号:</span>
                <el-input v-model="code" placeholder="请输入关联采购单号"  @keydown.enter.native="$emit('changeTicketCode', code)"  v-if="!isDisabled" />
                <!-- <el-select placeholder="请选择" v-model="code" filterable @change="$emit('changeTicketCode', code)" v-if="!isDisabled">
                    <el-option v-for="item in orderList" :label="item" :value="item" :key="item" />
                </el-select> -->
                <span v-else>{{ detail.ticketOrder }}</span>
            </div>
            <div></div>
            <div></div>
        </div>
        <div class="item">
            <div>
                <span>仓库:</span>
                <span>{{ detail.whouseName }}</span>
            </div>
            <div>
                <span>入库单号:</span>
                <el-select placeholder="请选择" v-model="ticketCode" v-if="!isDisabled">
                    <el-option v-for="item in ticketCodeList" :key="item.ticketCode" :label="item.ticketCode" :value="item.ticketCode" />
                </el-select>                   
                <span v-else>{{ detail.ticketIn }}</span>
            </div>
            <!-- <div>
                <span>店铺:</span>
                <span>{{ detail.shopName}}</span>
            </div> -->
        </div>
        <!-- <div class="item">
            <div>
                <span>快递单号:</span>
                <span>{{ detail.shipOrder }}</span>
            </div>
            <div>
                <span>1688单号:</span>
                <span>{{ detail.alibabaOrder }}</span>
            </div>
            <div></div>
        </div> -->
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    props: {
        detail: {
            type: Object,
            default: () => {}
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        orderList: {
            type: Array,
            default: () => []
        },
    },
    watch: {
        code(val) {
            this.ticketCode = ''
            this.SAVE_CODE(val)
            this.CHANGE_DETAILS()
        },
        ticketCode(val) {
            this.changeInCode(val)    
        },
    },
    computed: {
        ...mapState('ProcurementFallback', ['ticketCodeList'])
    },
    methods: {
        ...mapActions('ProcurementFallback', ['changeInCode']),
        ...mapMutations('ProcurementFallback', ['SAVE_CODE', 'CHANGE_DETAILS'])
    },
    data() {
        return {
            ticketCode: '',
            code: ''
        }
    },
}
</script>
<style scoped lang="scss">
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
</style>
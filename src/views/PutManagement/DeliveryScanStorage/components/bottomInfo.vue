<template>
    <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">采购单号:</span>
                <span>{{ ticketCode | formatValues(ticketCode) }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">入库单号:</span>
                <span>{{ rkdCode | formatValues(rkdCode) }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">采购数量:</span>
                <span>{{ detail.purchaseCount | formatValues(detail.purchaseCount) }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">差异数量:</span>
                <span>{{ differencesCount }}</span>
            </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">计划入库数量:</span>
                <slot name="planCount" />
            </div>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">入库数量:</span>
                <slot name="number" />
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="col-info">
            <div class="info">
                <span class="title">差异原因:</span>
               <slot name="reason" />
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { mapState } from "vuex"
export default {
    props: {
        detail: {
            type: Object
        }
    },
    computed: {
        ...mapState({
            rkdCode: state => state.DeliveryScanStorage.rkdCode,
            ticketCode: state => state.DeliveryScanStorage.ticketCode,
            planIncount: state => state.DeliveryScanStorage.ticketInInfoFormat.planIncount,
            count: state => state.DeliveryScanStorage.ticketInInfoFormat.count
        }),
        // count: {
        //     get() {
        //         return this.$store.state.DeliveryScanStorage.ticketInInfoFormat.count
        //     }
        // },
        differencesCount() {
            if (typeof this.count !== 'number' && !this.count) return '-'
            if (this.planIncount) return this.planIncount - this.count
            return '-'
        }
    },
    filters: {
        formatValues(val) {
            if (val) return val
            return '-'
        }
    }
}
</script>
<style scoped lang="scss">
.col-info {
    margin-bottom: 30px;
    .info {
        display: flex;
        align-items: center;
        .title {
            color: #888888;
            font-size: 13px;
            min-width: 100px;
            text-align: right;
            margin-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;  
            white-space: nowrap; 
        }
    } 
}
</style>
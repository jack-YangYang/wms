<template>
    <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检人:</span>
                <span>{{ detail.qaUserName | formatValues(detail.qaUserName) }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">计划入库数量:</span>
                <span>{{ detail.planCount | formatValues(detail.planCount) }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检差异数量:</span>
                <span>{{ differencesCount }}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检合格数量:</span>
                <slot name="number" />
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检差异原因:</span>
               <slot name="reason" />
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
    props: {
        detail: {
            type: Object
        }
    },
    computed: {
        count: {
            get() {
                return this.$store.state.PutInStorageOrder.ticketInInfoFormat.count
            }
        },
        differencesCount() {
            if (typeof this.count !== 'number' && !this.count) return '-'
            if (this.detail.planCount) return this.detail.planCount - this.count
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
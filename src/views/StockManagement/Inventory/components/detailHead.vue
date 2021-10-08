<template>
    <div class="left">
        <div v-if="showDateAndCode">
            <span>盘点单号:</span>
            <span>{{ detail.ticketCode }}</span>
        </div>
        <div v-if="showDateAndCode">
            <span>盘点日期:</span>
            <span>{{ detail.createDate }}</span>
        </div>
        <div>
            <span>主仓库:</span>
            <el-select v-if="show" v-model="detail.whouseId" placeholder="请选择仓库" @change="CAHNGE_ITEMS([])">
                <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <span v-else>{{ detail.whouseName }}</span>
        </div>
        <!-- <div>
            <span>备注:</span>
            <el-input type="textarea" :disabled="show" v-model="detail.remark" />
        </div> -->
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        showDateAndCode: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
       ...mapState({
           waehouseList: state => state.common.waehouseList,
       })
    },
    methods: {
        ...mapMutations('Inventory', ['CAHNGE_ITEMS'])
    }
}
</script>
<style scoped lang="scss">
div.left {
    border-right: 1px solid #dfe6ec;
    padding-left: 10px;
    // font-size: 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dfe6ec;
    & > div {
        display: flex;
        flex: 1;
        align-items: center;
        min-height: 48px;
        // border-bottom: 1px solid #dfe6ec;
        color: #34495e;
        & > span:nth-child(1) {
            margin-right: 10px;
            font-weight: 600;
        }
        .el-textarea {
            width: 80%;
            .el-textarea__inner {
                height: 80%;
            }
        }
    } 
    @media (max-width:1080px) {
        flex-wrap: wrap;
        border-bottom: none;
        & > div {
            flex: none;
            width: 100% ;
            border-bottom: 1px solid #dfe6ec;
            & > span:nth-child(1) {
                min-width: 60px;
                text-align: right;
            }
        }
    }
}
</style>
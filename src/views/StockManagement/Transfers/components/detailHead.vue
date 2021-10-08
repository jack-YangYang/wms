<template>
    <div class="left">
        <div>
            <span>调出仓库:</span>
            <el-select v-if="show" v-model="detail.sourceWhouseId" filterable @change="CAHNGE_ITEMS([])">
                <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <span v-else>{{ detail.sourceWhouseName }}</span>
        </div>
        <div>
            <span>调入仓库:</span>
            <el-select v-if="show" v-model="detail.distWhouseId" filterable @change="CAHNGE_ITEMS([])">
                <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <span v-else>{{ detail.distWhouseName }}</span>
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
            default: true
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
        ...mapMutations('Transfers', ['CAHNGE_ITEMS'])
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
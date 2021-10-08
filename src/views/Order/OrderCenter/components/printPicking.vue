<template>
    <el-dialog
        title="拣货单"
        :visible.sync="showPrintModule"
        @close="print(false)"
        width="50%"
        top="0"
        :close-on-click-modal="false"
    >
        <div  :class="{'scrollContent': pickInfo.list.length > 12}" >
            <div id="print-picking-order">
                <p>拣货单</p>
                <div class="print-head">
                    <div>
                        <p>制单人：{{ createName }}</p>
                    </div>
                    <div class="barcode">
                        <barcode 
                            :value="pickInfo.pick_batch_number" 
                            tag="img" 
                            :width="1.2" 
                            font="Arial"
                            :margin="0"
                            :height="50" 
                            :fontSize="16"
                            fontOptions="bold" 
                        />      
                    </div>
                    <div class="crate-date">
                        <span>制单时间: {{ date }}</span>
                    </div>
                </div>
                <picking-list :list="pickInfo.list"/>
            </div>
        </div>  
        <div slot="footer">
            <el-button size="mini" @click="print(false)">关闭</el-button>
            <el-button type="primary" v-print="printObj" size="mini" @click="print(true)">打印</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import VueBarcode from 'vue-barcode';
import { getStaffName } from '@/utils/auth'
import pickingList from './printList'
import { dateFormat, message } from '@/utils/common'
export default {
    computed: {
        ...mapState({
            showPrintModule: state => state.Order.showPrintModule,
            pickInfo: state => state.Order.pickInfo
        })
    },
    data() {
        return {
            date: dateFormat(new Date()),
            createName: getStaffName(),
            printObj: {
                id: "print-picking-order",
                popTitle: '拣货单',
                extraCss: 'www.nantang.erp.com',
                extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
            }
        }
    },
    components: {
        'barcode': VueBarcode,
        pickingList
    },
    methods: {
        ...mapMutations('Order', [
            'SHOW_PRINT_MODULE'
        ]),
        print(flag) {
            if (!flag) {
                this.SHOW_PRINT_MODULE({ flag: false, pick_batch_number: null });
                return
            }
            this.$emit('handleSubmitPrint')
        }
    }
    
}
</script>
<style scoped lang="scss">
#print-picking-order {
    margin: 0;
    padding: 0;
    padding-top: 3mm;
    color: #333333;
    p {
        margin: 3px 0;
    }
    & > p {
        text-align: center;
        font-size: 26px;
        margin: 0;
    }
    .print-head {
        display: flex;
        align-items: center;
        margin: 3mm 0;
        padding: 0 3mm;
        & > div {
            flex: 1;
            // text-align: center;
        }
        & > div.barcode {
            text-align: center;
        }
        & > div.crate-date {
            text-align: right;
        }
    }
}
.scrollContent {
    height: 680px;
    overflow-y: scroll;
}
</style>
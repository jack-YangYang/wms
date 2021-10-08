<template>
    <el-dialog
        title="打印拣货单"
        :visible.sync="showModule"
        class="print-module"
        @close="handleSubmit(false)"
        top="1%"
    >
        <div class="printF">
            <div>
                <picking-list
                    id="print"
                />
            </div>
        </div>
        <div slot="footer">
            <p style="text-align: center;font-weight: bold;font-size: 14px;">
                点击 <span style="color: red">打印</span>拣货单将标记为<span style="color: red">已打印</span>状态
            </p>
            <el-button size="small" @click="handleSubmit(false)">取消</el-button>
            <el-button size="small" type="primary" @click="confirmPrint" v-print="printObj">打印</el-button>
            <!-- <el-button size="small"  type="primary" @click="handleSubmit(false)">保存</el-button> -->
        </div>
    </el-dialog>
</template>
<script>
import { mapMutations } from 'vuex'
import pickingList from './pickling-table'

export default {
    components: {
        pickingList
    },
    data() {
        return {
            printObj: {
                id: 'print',
                popTitle: '拣货单',
                extraCss: 'www.nantang.erp.com',
                extraHead:
                    '<meta http-equiv="Content-Language"content="zh-cn"/>',
            }
        }
    },
    computed: {
        showModule: {
            get() {
                return this.$store.state.Transfers.showPrintModule
            },
            set(val) {
                this.$store.state.Transfers.showPrintModule = val
            }
        }
    },
    methods: {
        ...mapMutations('Transfers', {
            handleSubmit: 'CAHNGE_PRINT_MODULE'
        }),
        confirmPrint() {
            this.$emit('confirmPrint')
        }
    }
}
</script>
<style lang="scss">
.print-module .el-dialog__footer {
    padding: 5px 18px;
}

</style>
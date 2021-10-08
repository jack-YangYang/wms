<template>
    <el-dialog
        :title="dataInfo.title"
        :visible.sync="showModule"
        @close="handleSubmit(false)"
        width="50%"
        top="3%"
        :close-on-click-modal="false"
    >
        <div class="select-data">
            <el-select v-if="dataInfo.title === '采购单号选择'" v-model="ticketCode" filterable placeholder="请选择采购单号" @change="handleChangeTicketCode(ticketCode)">
                <el-option 
                v-for="item in dataInfo.ticketCodeList" 
                :label="item.ticketCode" 
                :value="item.ticketCode" 
                :key="item.ticketCode" />
            </el-select>
            <el-select v-else v-model="sku" placeholder="请选择SKU"  @change="handleChangeSku(sku)" filterable >
                <el-option v-for="item in dataInfo.skusList" :label="item.sku" :value="item.sku" :key="item.sku" />
            </el-select>
        </div>
    </el-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            dataInfo: state => {
                return {
                    title: state.DeliveryScanStorage.title,
                    ticketCodeList: state.DeliveryScanStorage.ticketCodeList,
                    skusList: state.DeliveryScanStorage.skusList,
                }
            }
        }),
        showModule: {
            get() {
                const { DeliveryScanStorage } = this.$store.state
                return DeliveryScanStorage.showModule
            },
            set(val) {
                this.$store.state.DeliveryScanStorage.showModule = val
            }
            
        },
        ticketCode: {
            get() {
                const { DeliveryScanStorage } = this.$store.state
                return DeliveryScanStorage.ticketCode
            },
            set(val) {
                this.$store.state.DeliveryScanStorage.ticketCode = val
            }
            
        },
        sku: {
            get() {
                const { DeliveryScanStorage } = this.$store.state
                return DeliveryScanStorage.sku
            },
            set(val) {
                this.$store.state.DeliveryScanStorage.sku = val
            }
            
        },
    },
    methods: {
        ...mapActions('DeliveryScanStorage', [
            'handleChangeTicketCode',
            'handleChangeSku'
        ]),
        handleSubmit(flag) {
            this.$emit('handleSubmit', flag)
        }
    }
}
</script>
<style scoped>
.select-data {
    display: flex;
    justify-content: center;
}
</style>
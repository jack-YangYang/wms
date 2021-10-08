<template>
    <main>
        <el-form :model="form" inline label-width="80px">
            <!-- <div> -->
            <el-form-item label="物流方式:">
                <el-select
                    placeholder="请选择物流方式"
                    v-model="form.logistics_mode_code"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(item, index) in shipList"
                        :value="item.mode_code"
                        :label="item.mode_name"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="物流公司:">
                <el-select
                    placeholder="请选择物流公司"
                    v-model="form.logistics_provider_code"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(item, index) in provideList"
                        :value="item.provider_code"
                        :label="item.provider_name"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="发货仓库:">
                <el-select
                    placeholder="请选择发货仓库"
                    v-model="form.warehouse_id"
                    filterable
                >
                    <el-option
                        v-for="(item, index) in deliveryWarehouseList"
                        :value="item.id"
                        :label="item.label"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="分区:">
                <el-select
                    placeholder="请选择分区"
                    no-data-text="请先选择发货仓库"
                    v-model="form.part_ids"
                    filterable
                    clearable
                    multiple
                    collapse-tags
                >
                    <el-option
                        v-for="(item, index) in partList"
                        :value="item.id"
                        :label="item.label"
                        :key="index"
                    />
                </el-select>
            </el-form-item>
            <!-- </div> -->
            <!-- <div> -->
            <el-form-item label="拣货类型:">
                <el-select
                    placeholder="请选择拣货类型"
                    v-model="form.pick_type"
                >
                    <el-option label="单SKU单数量" :value="0" />
                    <el-option label="单SKU多数量" :value="1" />
                    <el-option label="多SKU" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否大件:">
                <el-select placeholder="请选择" v-model="form.pack_size">
                    <el-option label="小件" :value="0" />
                    <el-option label="大件" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单数量:">
                <el-input-number
                    v-model.number="form.order_count"
                    :controls="false"
                    :min="0"
                    style="width: 178px"
                    :step-strictly="true"
                />
            </el-form-item>
            <!-- </div> -->
            <!-- <div> -->
            <el-form-item label="销售平台:">
                <el-select
                    placeholder="请选择销售平台"
                    v-model="form.platform"
                    clearable
                >
                    <el-option
                        v-for="(item, index) in platformList"
                        :key="index"
                        :value="item"
                        :label="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    @click="createPickingOrder(form)"
                    >生成分拣单</el-button
                >
                <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="printPicking(tableData)"
                    >打印拣货单</el-button
                > -->
            </el-form-item>
            <!-- </div> -->
        </el-form>
        <template v-if="tableData.length">
            <batch-picking-table
                :tableData="tableData"
                @selectionChange="selectionChange"
            />
        </template>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <print-picking-module v-if="showPrintModule" />
        </transition>
    </main>
</template>
<script>
import NoDataContent from '@/components/NoDataImages'
import batchPickingTable from './components/batchPickingTable'
import { mapActions, mapMutations, mapState } from 'vuex'
// import printPickingModule from './components/printPicking'
import { clearSearch } from '@/utils/common'
export default {
    components: {
        NoDataContent,
        batchPickingTable,
        // printPickingModule,
    },
    computed: {
        ...mapState('Order', {
            tableData: 'batchPickingTable',
            showPrintModule: 'showPrintModule',
        }),
        ...mapState({
            provideList: (state) => state.common.provideList,
            platformList: (state) => state.common.platformList,
            deliveryWarehouseList: (state) =>
                state.common.deliveryWarehouseList,
            shipList: (state) => state.common.shipList,
        }),
    },
    data() {
        return {
            partList: [],
            form: {
                platform: null,
                order_count: 100,
                pick_type: 0,
                pack_size: 0,
                logistics_mode_code: null,
                shop_ship_method: null,
                logistics_provider_code: null,
                warehouse_id: null,
                part_ids: null,
            },
            selectData: [],
        }
    },
    methods: {
        ...mapActions([
            'getAllProvideList',
            'getAllShipList',
            'getShopShipList',
            'getDeliveryWarehouseList',
            'getPlatform',
        ]),
        ...mapActions('Order', ['createPickingOrder']),
        ...mapMutations('Order', ['CREATE_PICKING_APPLY']),
        selectionChange(items) {
            this.selectData = items.map((item) => item.pick_batch_number)
        },
    },
    watch: {
        'form.warehouse_id': function (n) {
            this.form.part_ids = []
            this.partList = n
                ? this.deliveryWarehouseList.find((item) => item.id == n)
                      .partition
                : []
        },
    },
    beforeDestroy() {
        clearSearch(this.form)
        this.CREATE_PICKING_APPLY({ list: [] })
    },
    mounted() {
        this.getAllProvideList()
        this.getAllShipList()
        this.getDeliveryWarehouseList()
        this.getPlatform()
    },
}
</script>
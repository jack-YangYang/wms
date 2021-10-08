<template>
    <el-table
    :data="listTableData"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="name" label="仓库名" align="center">
            <template slot-scope="{row}">
                <router-link :to="`/warehousemanagement/warehouselist/warehousecontent/${row.id}`">
                    <el-button type="text">{{ row.name }}</el-button>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="仓库状态" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: stateColor[row.state] }">{{ row.state ? '启用' : '停用' }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="仓库类型" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: typeColor[row.type] }">{{getType(row.type) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="idle" label="空闲库位数" align="center" />
        <el-table-column prop="effective" label="有效库位数" align="center" />
        <el-table-column prop="total" label="总库位数" align="center" />
        <el-table-column prop="createDate" label="创建时间" align="center" />
        <el-table-column prop="skuCount" label="sku总库存" align="center" />
        <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
                <el-button icon="el-icon-edit" v-if="showButtons.edit" type="text" @click="CAHNGE_MODULE({ type: true, row })">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapMutations, mapState, Mutation } from 'vuex'
export default {
    props: {
        showButtons: {
            required: true
        }
    },
    computed: {
        ...mapState('Warehouse', [
            'listTableData',
            'stateColor',
            'typeColor'
        ]),
        getType() {
            return (type) => {
                const warehouseType = {
                    '1': '虚拟仓-海外',
                    '2': '中转仓',
                    '3': '直发仓',
                    '4': '虚拟仓-FBA',
                    '5': '虚拟仓-Lazada',
                    '6': '样品仓'
                }
                return type.map(item => warehouseType[item]).join()
            }
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 250
        }
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CAHNGE_MODULE'
        ])
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 250
        }
    }
}
</script>
<template>
    <el-form inline :moder="search">
        <el-form-item>
            <el-input placeholder="请输入订单编号" v-model="search.nt_order_id" clearable filterable />
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入店铺编号" v-model="search.shop_order_id" clearable filterable />
        </el-form-item>
        <el-form-item >
            <el-select placeholder="请选择物流方式" v-model="search.logistics_mode_code" clearable filterable>
                <el-option v-for="(item, index) in shipList" :value="item.mode_code" :label="item.mode_name" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="showbatchNunber ">
            <el-input placeholder="请输入批次号" v-model="search.pick_batch_number" clearable />
        </el-form-item>
        <el-form-item >
            <el-input placeholder="请输入跟踪号" v-model="search.track_num" clearable />
        </el-form-item>
        <el-form-item>
            <el-select placeholder="请选择物流公司" v-model="search.logistics_provider_code" filterable clearable>
                <el-option v-for="(item, index) in provideList" :value="item.provider_code" :label="item.provider_name" :key="index" />
            </el-select>
        </el-form-item>
        <slot name="search" />
        <el-form-item>
            <slot />
        </el-form-item>
    </el-form>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props: {
        search: {
            type: Object,
            required: true
        },
        showbatchNunber: {
            trpe: Boolean,
            default: true
        },
    },
    computed: {
        ...mapState({
            provideList: state => state.common.provideList,
            shipList: state => state.common.shipList
        })
    }
}
</script>
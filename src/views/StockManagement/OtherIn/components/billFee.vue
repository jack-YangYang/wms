<template>
    <div style="display: inline-block; width: 30%; margin-left: 100px">
        <span class="font">账单运费:</span>
        <el-input
            v-model.trim="billFee"
            :disabled="isDisabled"
            clearable
            placeholder="请输入账单运费"
            style="width: 30%"
            @input="billFeeChange"
        />
    </div>
</template>

<script>
//des:新增编辑时账单运费搜索框
import { mapState } from 'vuex'
export default {
    props: {
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            billFee: '',
        }
    },
    computed: {
        ...mapState({
            originFee: (state) => state.OtherIn.billFee,
        }),
    },
    watch: {
        //编辑时添加默认值
        originFee(n) {
            this.billFee = n
        },
    },
    methods: {
        billFeeChange(fee) {
            let value = fee ? fee.toString().match(/\d+\.?\d{0,2}/)[0] : ''
            this.$emit('billFeeChange', value)
        },
    },
    beforeDestroy() {
        this.$store.commit('OtherIn/SET_LIST', { label: 'billFee', value: '' })
    },
}
</script>

<style scoped>
.font {
    font-size: 14px;
    color: #34495e;
    font-weight: bold;
}
</style>
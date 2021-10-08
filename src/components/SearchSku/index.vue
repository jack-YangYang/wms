<template>
    <div class="search-sku">
        <el-input
            v-model.trim="sku"
            clearable
            placeholder="输入SKU回车即可搜索"
            :disabled="isDisabled"
            style="width: 30%"
            @keyup.enter.native="doFilterSku(sku)"
        >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <slot />
    </div>
</template>
<script>
import { message } from '@/utils/common'
export default {
    props: {
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            sku: '',
        }
    },
    methods: {
        doFilterSku(sku) {
            if (!sku) {
                message('warning', '请先输入SKU')
                return
            }
            this.$emit('doFilterSku', sku)
        },
    },
}
</script>
<style scoped>
.search-sku {
    padding: 15px 0;
    border-bottom: 1px solid #dfe6ec;
}
</style>
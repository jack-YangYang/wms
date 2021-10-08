<template>
    <router-link :to="to">
        <el-button :size="size" :type="type" :class="{ 'add': add }">{{ data }}</el-button>
    </router-link>
</template>
<script>
import router from '@/router'
export default {
    name: 'RouterLinkGo',
    props: {
        to: {
            required: true
        },
        type: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'small'
        },
        data: {
            type: String,
            default: '取消'
        },
        add: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss" scoped>
.add {
    margin-right: 10px;
    border-radius: 2px;
    padding: 9px 30px;
    font-size: 12px;
}
</style>
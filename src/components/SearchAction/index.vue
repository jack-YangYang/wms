<template>
    <div class="action">
        <el-button size="mini" type="primary" @click="filter" icon="el-icon-search">查 询</el-button>
        <el-button size="mini" type="primary" @click="reset" icon="el-icon-refresh">重 置</el-button>
        <slot>
            <!-- <el-button size="mini" type="primary" @click="reset" icon="el-icon-refresh">查看操作日志</el-button> -->
        </slot>
    </div>
</template>
<script>
export default {
    name: 'ActionGroup',
    methods: {
        filter() {
            this.$emit('doFilter')
        },
        reset() {
            this.$emit('doReset')
        },
        // doExport() {
        //     this.$emit('doExport')
        // }
    }
}
</script>
<style scoped>
.action {
    display: flex;
    align-items: center;
}
</style>
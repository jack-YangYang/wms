<template>
    <Header>
        <slot name="add" />
        <el-button size="small" type="primary" @click="edit">编 辑</el-button>
        <el-button size="small" type="danger" @click="del">删 除</el-button>
    </Header>
</template>
<script>
export default {
    methods: {
        add() {
            this.$emit('doAdd')
        },
        edit() {
            this.$emit('doEdit')
        },
        del() {
            this.$emit('doDel')
        }
    }
}
</script>
<style lang="scss" scoped>
Header {
    display: flex;
    padding: 15px 0;
    align-items: center;
    & > button {
        margin-right: 15px;
    }  
    .el-button--small {
        border-radius: 2px;
        padding: 9px 30px;
        font-size: 12px;
    }
}
</style>
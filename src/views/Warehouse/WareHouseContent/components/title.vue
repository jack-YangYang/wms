<template functional>
    <div>
        <span>{{ props.title }}</span>
        <el-divider></el-divider>
    </div>
</template>
<script>
export default {
    props: ['title']
}
</script>
<style scoped lang="scss">
div {
    span {
        font-weight: bold;
        font-size: 16px;
    }
    .el-divider {
        margin: 10px 0;
    }
}
</style>
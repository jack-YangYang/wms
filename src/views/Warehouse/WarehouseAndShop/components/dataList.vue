<template functional>
    <el-tag size="small" effect="plain" type="info">{{ props.whouseName }}</el-tag>
</template>
<script>
export default {
    props: ['whouseName']
}
</script>
<style scoped>
.cell .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
}
</style>
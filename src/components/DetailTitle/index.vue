<template functional>
    <p>
        {{ props.title }}
    </p>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '采购单入库'
        }
    }
}
</script>
<style scoped lang="scss">
p {
    font-weight: bold;
    margin: 0;
    font-size: 14px;
    color: #34495e;
    padding: 10px 0;
    border-bottom: 1px solid #dfe6ec;
}
</style>

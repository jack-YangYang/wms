<template functional>
    <span>{{ props.message }}</span>
</template>
<script>
export default {
    props: {
        message: {
            type: String,
            default: '请使用上述提供的字段变量，否则将造成无法弥补的损失!!!'
        }
    }
}
</script>
<style lang="scss" scoped>
    span {
        font-weight: 650;
        color: rgb(252, 146, 158);
    }
</style>
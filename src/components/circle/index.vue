<template>
    <span :style="{ background: color }"></span>
</template>
<script>
export default {
    props: {
        color: {
            type: String,
            default: 'green'
        }
    }
}
</script>
<style lang="scss" scoped>
span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 100%;
}
</style>
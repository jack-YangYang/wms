<template functional>
    <p>
        <span>{{ props.title }}</span>
    </p>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '头程物流配比'
        },
    }
}
</script>
<style lang="scss" scoped>
p {
    color: rgba(0, 0, 0, 0.847);
    font-weight: 650;
    font-size: 16px;
    padding: 0 10px;
    margin-bottom: 30px;
}
</style>
<template functional>
    <p>{{ props.title }}</p>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: 'SKU信息'
        }
    }
}
</script>
<style scoped>
p {
    font-size: 16px;
    font-weight: 600;
    padding: 15px 0;
    color: #333;
    margin: 0;
}
</style>
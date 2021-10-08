<template functional>
    <p :style="{ color: props.color, fontSize: props.fontSize, margin: props.margin }">{{ props.title }}</p>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '测量称重详情'
        },
        color: {
            type: String,
            default: '#333333'
        },
        fontSize: {
            type: String,
            default: '14px'
        },
        margin: {
            type: String,
            default: '10px 0'
        }
    }
}
</script>
<style scoped>
p {
    font-weight: 700;
}
p::before {
    width: 5px;
    height: 15px;
    background: #006eff;
    content: " ";
    display: inline-block;
    -webkit-transform: translateY(2px);
    transform: translateY(2px) translateX(-4px);
}
</style>

<template>
    <div>
        <p>
            <span>SKU数量:</span>
            <span>{{ item.total_num }}</span>
        </p>
        <p>
            <span>已核数量:</span>
            <span>{{ item.checked_num }}</span>
        </p>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped lang="scss">
div {
    display: flex;
    align-items: center;
    p {
        color: #333333;
        margin-right: 15px;
        line-height: 36px;
        span:nth-child(1) {
            font-weight: bold;
        }
        span:nth-child(2) {
            display: inline-block;
            min-width: 180px;
            text-align: center;
            height: 36px;
            border-radius: 5px;
            background-color: rgba(240, 240, 240, 1);
        }
    }
}
</style>
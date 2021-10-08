<template functional>
    <div class="order-info">
        <div>
            <p>订单编号</p>
            <span>{{ props.data.nt_order_id }}</span>
        </div>
        <div>
            <p>跟踪号</p>
            <span>{{ props.data.track_num }}</span>
        </div>
        <div>
            <p>物流方式</p>
            <span>{{ props.data.logistics_mode }}</span>
        </div>
        <div>
            <p>物流公司</p>
            <span>{{ props.data.logistics_provider }}</span>
        </div>
        <div>
            <p>包裹重量</p>
            <span>{{ props.data.order_weight }}</span>
        </div>
        <div>
            <p>运费</p>
            <span>{{ props.data.shipping_fee }}</span>
        </div>
        <div>
            <p>卖家简称</p>
            <span>{{ props.data.shop_name }}</span>
        </div>
        <div>
            <p>测量状态</p>
            <span>{{ props.data.weigh_status }}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            required: true,
        },
    },
}
</script>
<style scoped lang="scss">
.order-info {
    display: flex;
    & > div {
        flex: 1;
        text-align: center;
        font-size: 14px;
        p {
            font-weight: bold;
            font-size: 13px;
        }
    }
}
</style>
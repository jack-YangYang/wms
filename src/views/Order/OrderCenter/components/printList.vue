<template>
    <ul>
        <li class="list-header">
            <div>序号</div>
            <div>商品名称</div>
            <div>库位</div>
            <div>SKU码</div>
            <div>配货数量</div>
        </li>
        <div>
            <li class="list-body" v-for="(item, index) in list" :key="index">
                <div>{{ item.sort_num }}</div>
                <div class="product-name">
                    <span>{{ item.product_name_zh }}</span>
                </div>
                <div>
                    <span>{{ item.position }}</span>
                </div>
                <div>
                    <span>{{ item.sku }}</span>
                </div>
                <div>
                    <span>{{ item.quantity }}</span>
                </div>
            </li>
        </div>
        <li class="list-body" v-if="list.length">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div>
                <span>合计：{{ getTotal }}</span>
            </div>
        </li>
        <li v-else class="list-body no-data">
            <span>暂无数据</span>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        getTotal() {
            return this.list.reduce((total, item) => {
                return total + item.quantity
            }, 0)
        }
    }
}
</script>
<style scoped lang="scss">
ul {
    margin: 0;
    padding: 0 3mm;
    width: 100%;
    li {
        display: flex;
        align-items: center;
        padding: 3mm 0;
        div {
            text-align: center;
            p {
                margin: 0;
            }
        }
    }
    li.list-header {
        font-weight: bold;
        border-bottom: 2px solid #000000;
    }
    li.list-body {
        border-bottom: 2px dashed #333333;
        color: #333333;
        .product-name {
            text-align: left;
        }
    }
    li.no-data {
        justify-content: center;
        font-weight: bold;
        line-height: 26px;
    }
    li {
        & > div:nth-child(1) {
            width: 10%;
        }
        & > div:nth-child(2) {
            width: 30%;
        }
        & > div:nth-child(3) {
            width: 20%;
        }
        & > div:nth-child(4) {
            width: 20%;
        }
        & > div:nth-child(5) {
            width: 20%;
        }
    }
}
</style>
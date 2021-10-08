<template>
    <div>
        <!-- <vue-pdf :src="item.track_ticket" /> -->
        <p>
            <span>箱号:</span>
            <span>{{ item.box_num }}</span>
        </p>
        <p>
            <span>订单编号:</span>
            <span>{{ item.nt_order_id }}</span>
        </p>
        <p>
           <el-button @click="printExpress(item.track_ticket)" type="text" >打印面单</el-button>
        </p>
        <p>
            <span>核单状态:</span>
            <span class="status">{{ item.pack_status }}</span> 
        </p>
        <!-- <p>
            <span>测量状态:</span>
            <span class="status">{{ item.weigh_status }}</span> 
        </p>
        <p>
            <span>长度:</span>
            <span>{{ item.length }}</span> 
        </p>
        <p>
            <span>宽度:</span>
            <span>{{ item.width }}</span> 
        </p>
        <p>
            <span>高度:</span>
            <span>{{ item.height }}</span> 
        </p>
        <p>
            <span>重量:</span>
            <span>{{ item.weight }}</span> 
        </p> -->
    </div>
</template>
<script>
// import vuePdf from 'vue-pdf'
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    // components: {
    //     vuePdf
    // },
    methods: {
        printExpress(url) {
            window.open(url)
        }
    }
}
</script>
<style scoped lang="scss">
div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid #ecf0f1;
    p {
        flex: 1;
        margin: 5px 0;
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
        color: #333333;
        span:nth-child(1) {
            font-weight: bold;
        }
        .el-button {
            font-weight: bold;
        }
        span.status {
            font-weight: 400;
            color: #95F204;
        }
    }
    p:nth-child(2) {
        min-width: 224px;
    }
}
</style>
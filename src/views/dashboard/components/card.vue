<template>
    <router-link :to="`${item.path}`" class="card-link">
        <el-card shadow="hover" :style="getStyle(index)">
            <h3>{{ item.module }}</h3>
            <el-button type="text" size="small">{{ item.title }}</el-button>
            <p style="margin: 0">点击卡片即可快速访问页面</p>
        </el-card>
    </router-link>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number
        }
    },
    computed: {
        getStyle() {
            return index => {
                if (index < 4) return { background: '#16a085' }
                if (index >= 4 && index < 8) return { background: '#ff9ff3' }
                if (index >= 8 && index < 12) return { background: '#feca57' }
                if (index >= 12 && index < 16) return { background: '#48dbfb' }
                if (index >= 16 && index < 20) return { background: '#54a0ff' }
                if (index >= 20 && index < 24) return { background: '#40407a' }
                return { background: '#227093' }
            }
        }
    }
}
</script>
<style lang="scss">
.card-link {
    .el-card__body {
        padding: 15px 0;
        text-align: center;
        color:#ffffff;
        h3 {
            margin: 0;
            
        }
        .el-button--text {
            margin-right: 0 !important;
            color:#ffffff;
            font-weight:bold
        }
    }
}
</style>

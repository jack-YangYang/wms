<template>
    <div class="content">
        <p>
            <span>
                <i class="el-icon-warning"></i>
            </span>
            <span>已选择</span>
            <span class="select-number">{{ selectDatalength }}</span>
            <span>重新计算预计耗时：</span>
            <span class="select-min">{{ selectDataMin }}</span>
        </p>
        <p @click="clearSelect">清空选择</p>
    </div>
</template>
<script>
export default {
    name: 'SelectTableData',
    props: {
        selectDatalength: {
            type: Number,
            default: 2
        },
        selectDataMin: {
            type: String,
            default: '36 min'
        }
    },
    methods: {
        clearSelect() {
            this.$emit('clearSelect')
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    padding: 5px 10px;
    margin-bottom: 15px;
    height: 42px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.647);
    box-sizing: border-box;
    background-color:rgb(230, 247, 255);
    border-color: rgba(186, 231, 255, 1);
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    & > p:nth-child(1) {
        .select-number {
            color: rgb(24, 144, 255);
            padding: 0 5px;
        }
        .select-min {
            font-weight: bold;
        }
    }
    & > p:nth-child(2) {
        cursor: pointer;
        color:  rgb(24, 144, 255);
        margin-left: 10px;
    }
}
</style>
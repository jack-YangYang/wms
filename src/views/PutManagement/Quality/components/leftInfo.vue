<template>
    <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">SKU:</span>
                <p>{{ skuDetail.sku | formatValues(skuDetail.sku) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">产品名称:</span>
                <p>
                    <el-tooltip class="item" effect="dark" :content="skuDetail.skuName" placement="top-start">
                        <span>{{ skuDetail.skuName | formatValues(skuDetail.skuName) }}</span>
                    </el-tooltip>
                </p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">库位:</span>
                <p>{{ skuDetail.spaceCode | formatValues(skuDetail.spaceCode) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">颜色:</span>
                <p>{{ productDetail.color | formatValues(productDetail.color) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">尺寸:</span>
                <p>{{ productDetail.size | formatValues(productDetail.size) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">插头标准:</span>
                <p>{{ productDetail.plugStd | formatValues(productDetail.plugStd) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检标准:</span>
                <p>{{ skuDetail.qualityStd | formatValues(skuDetail.qualityStd) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">质检要求:</span>
                <p>{{ productDetail.qualityType | formatValues(productDetail.qualityType) }}</p>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="col-info">
            <div class="info">
                <span class="title">SKU属性:</span>
                <p>{{ productDetail.transAttr | formatValues(productDetail.transAttr) }}</p>
            </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="col-info">
            <div class="info">
                <span class="title">SKU</span>
                <span>-</span>
            </div>
        </el-col> -->
    </el-row>
</template>
<script>
export default {
    props: {
        skuDetail: {
            type: Object
        },
        productDetail: {
            type: Object
        }
    },
    filters: {
        formatValues(val) {
            if (val) return val
            return '-'
        }
    }
}
</script>
<style scoped lang="scss">
.col-info {
    margin-bottom: 30px;
    .info {
        display: flex;
        align-items: center;
        .title {
            color: #888888;
            font-size: 13px;
            min-width: 100px;
            text-align: right;
            margin-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;  
            white-space: nowrap; 
        }
        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    } 
}


</style>
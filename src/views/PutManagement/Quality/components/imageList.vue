<template>
    <div class="image-list">
        <image-item title="产品主图:" :list="productDetail.mainPics" />
        <image-item title="产品配件图:" :list="productDetail.partPics" />
        <image-item title="其他图片:" :list="productDetail.otherPics" />
    </div>
</template>
<script>
import imageItem from './imageItem.vue'
export default {
    components: {
        imageItem
    },
    props: {
        productDetail: {
            type: Object
        }
    }
}
</script>
<style scoped lang="scss">
.image-list {
    display: flex;
    flex-direction: column;
    // align-items: center;
}
</style>
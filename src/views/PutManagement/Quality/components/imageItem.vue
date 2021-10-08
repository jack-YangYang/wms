<template  >
    <div class="image-item">
        <span class="title">{{ title }}</span>
        <div v-if="list.length">
            <div v-for="item in list" :key="item">
                <popoverImage :skuImg="item" />
                <!-- <img :src="item" alt=""> -->
            </div>
        </div>
        <div v-else class="no-imgages"></div>
    </div>
</template>
<script>
import popoverImage from '@/components/popoverImage'
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    components: {
        popoverImage
    }
}
</script>
<style scoped lang="scss">
.image-item {
    display: flex;
    // flex-wrap: wrap;
    align-items: center;
    span {
        color: #888888;
        margin-right: 15px;
        font-size: 13px;
        min-width: 100px;
        text-align: right;
    }
    & > div {
        display: flex;
        flex-wrap: wrap;
        & > div {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            padding: 2px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-bottom: 10px;
            img {
                width: 100%;
            }
        }
        
    }
    .no-imgages {
        width: 80px;
        height: 80px;
    }
}
</style>
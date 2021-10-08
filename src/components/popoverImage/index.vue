<template functional>
     <el-popover placement="right" :width="props.popoverWidth" trigger="hover">
            <img :src="props.skuImg" alt style="width:100%;" />
            <div slot="reference" style="text-align: center">
                <img
                :src="props.skuImg"
                alt
                :style="{ height: props.height, width: props.width }"
                />
            </div>
        </el-popover>
</template>
<script>
export default {
    name: 'PopoverImage',
    props: {
        popoverWidth: {
            type: Number,
            default: 350
        },
        skuImg: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '67px'
        },
        width: {
            type: String | Number,
            default: '100%'
        }
    }
}
</script>
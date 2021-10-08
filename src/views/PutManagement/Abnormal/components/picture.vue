<template>
    <el-popover placement="right" width="350" trigger="hover">
        <img :src="src" alt style="width:100%;" />
        <div slot="reference" style="text-align: center">       
            <img :src="src" alt="" class="min-image"/>
        </div>
    </el-popover>
</template>
<script>
export default {
    props: {
        src: {
            type: String,
            default: ''
        }
    }
}
</script>
<style scoped>
.min-image {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    margin-right: 20px;
}
</style>
<template>
    <div>
        <img :src="img" alt="">
        <span>暂无数据</span>
    </div>
</template>
<script>
import NoData from '@/assets/Images/noData.png'
export default {
    data() {
        return {
            img: NoData
        }
    }
}
</script>
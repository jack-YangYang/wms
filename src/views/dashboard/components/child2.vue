<template>
    <div @click.stop="handleClick">
        123
    </div>
</template>
<script>
export default {
    methods: {
        handleClick() {
            this.$emit('handleClick', '我是从孙组件')
        }
    }
}
</script>
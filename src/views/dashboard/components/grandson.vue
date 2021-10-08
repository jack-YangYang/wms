<template>
    <div>
        {{ 111111 }}
        <son @handleClick="$emit('handleClick')" />
        <h2>{{ $attrs }}</h2>
    </div>
</template>
<script>
import son from './child2'
export default {
    // inheritAttrs: true,
    components: {
        son
    },
    methods: {
        // handleClick() {
        //     this.$emit('handleClick', '我是孙子组件')
        // }
    }
}
</script>
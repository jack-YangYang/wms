<template>
    <input v-model="child1"/>
    <!-- <div>
        <span>{{ child }}</span>
        <button @click="changeValue(111211)">点击</button>
    </div> -->
</template>
<script>
import grandson from './grandson'
export default {
    props: ['child'],
    inheritAttrs: false, // 禁止组件的根元素继承 attribute
    components: {
        grandson
    },
    // watch: {
    //     child1: {
    //         get() {
    //             return this.child
    //         },
    //         set(val) {
    //             this.$emit('update:child', val)
    //         }
    //     }
    // },
    computed: {
        child1: {
            get() {
                return this.child
            },
            set(val) {
                this.$emit('update:child', val)
            }
        }
    },
    methods: {
    //    changeValue(val) {
    //        this.$emit('update:child', val)
    //    }
    }
}
</script>
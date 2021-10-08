
<template functional>
    <div class="formula-content" :style="{margin: props.marginValue}">
        <span v-for="item in props.formulaList" :key="item.value" class="formula-list">
            {{item.value}}
            <span class="formula-family">({{item.name}})</span>
        </span>
    </div>
</template>
<script>
export default {
    name: 'formulaList',
    props: {
        formulaList: {
            type: Array,
            default: () => []
        },
        marginValue: {
            type: String,
            default: '0px'
        }
    }
}
</script>
<style lang="scss" scoped>
.formula-content {
    display: flex;
    flex-wrap: wrap;
    // max-width: 800px;
    font-weight: bold;
    padding: 10px 5px;
    color: #fff;
    background: rgb(40, 44, 52);
    border-radius: 5px;
    .formula-list {
        padding: 5px;
    }
    span {
        white-space: nowrap;
    }
    .formula-family {
        font-family: 'fangsong';
        color: rgb(252, 146, 158);
    }
}
</style>
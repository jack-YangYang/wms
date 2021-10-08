<template>
    <div class="select-country">
        <div class="trend-name" :class="{'is-right': isRight}">
            <span>{{ title }}:</span>
        </div>
        <div class="country-sel">
            <el-input  v-model.number="newValue" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :placeholder="placeholder"  />
        </div>
    </div>
</template>
<script>
export default {
    name: 'SelectNumberInput',
    props: {
        title: { /* span名称 */
            type: String,
            default: '趋势名称'
        },
        isRight: {
            type: Boolean,
            default: false
        },
        value: {
            default: ''
        },
        placeholder: { /* 为空时显示的提示字段 */
            type: String,
            default: '请输入'
        },
        clearable: { /* 是否可以清空 */
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            newValue: this.value
        }
    },
    watch: {
        newValue(val) {
            this.$emit('changeValue', val)
        }
    }
}
</script>
<style lang="scss" scoped>
.select-country {
    display: flex;
    align-items: center;
    color: #606266;
    font-weight: bold;
    padding: 15px 0;
    & > div:nth-child(1) {
        margin-right: 15px;
        // text-align: right;
        min-width: 108px;
        i {
            color: rgba(0, 0, 0, 0.847);
        }
            }
        .country-sel {
            flex: 1;
            & > div {
                width: 100%;
            }
        }
            .is-right {
                text-align: right;
            }
    }
</style>
<template>
    <div class="select-country">
        <div class="trend-name" :class="{'is-right': isRight}">
            <span>{{ title }}:</span>
        </div>
        <div class="country-sel">
            <el-input :type="type" :autosize="autosize" v-model="newValue" :placeholder="placeholder" v-if="isInput" />
            <el-select style="width: 100%" v-else :clearable="clearable" filterable  :placeholder="placeholder" v-model="newValue" :multiple="multiple">
                <el-option :label="item[label]" :value="item[val]" v-for="(item, index) in list" :key="index" ></el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SelectItem',
    props: {
        title: { /* span名称 */
            type: String,
            default: '趋势名称'
        },
        value: {
            default: ''
        },
        isRight: {
            type: Boolean,
            default: false
        },
        placeholder: { /* 为空时显示的提示字段 */
            type: String,
            default: '请输入'
        },
        type: { /* 当前是输入框还是文本域 */
            type: String,
            default: 'text'
        },
        autosize: {
            default: () => ({ minRows: 3, maxRows: 6 })
        },
        isInput: { /* 当前是输入框还是下拉框 */
            type: Boolean,
            default: true
        },
        clearable: { /* 是否可以清空 */
            type: Boolean,
            default: false
        },
        label: { /* 为下拉框时取的名称变量 */
            type: String,
            default: 'label'
        },
        val: {  /* 为下拉框时取的值变量 */
            type: String,
            default: 'id'
        },
        list: { /* 为下拉框时的下拉框内容 */
            type: Array,
            default: () => []
        },
        multiple: { /* 为下拉框时是否为多选 */
            type: Boolean,
            default: false
        }
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
<template>
    <div class="image-content">
        <ul class="upload-list">
            <li v-for="(item, index) in list" :key="item.url">
                <a :href="item.url" target="_blank">
                    <i class="el-icon-document"></i>
                    {{ item.name }}
                </a>
                <label>
                    <i class="el-icon-upload-success el-icon-circle-check"></i>
                    <i class="el-icon-close" @click="handleDel(index)"></i>
                </label>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleDel() {
            this.$emit('handleRemove')
        }
    }
}
</script>
<style lang="scss" scoped>
.upload-list {
    list-style: none;
    padding-left: 0;
    li {
        // margin-top: 10px;
        transition: all .5s cubic-bezier(.55,0,.1,1);
        font-size: 14px;
        color: #606266;
        line-height: 1.8;
        margin-top: 5px;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 4px;
        width: 100%;
        a {
            color: #606266;
            display: block;
            margin-right: 40px;
            overflow: hidden;
            padding-left: 4px;
            text-overflow: ellipsis;
            transition: color .3s;
            white-space: nowrap;
            i {
                height: 100%;
                margin-right: 7px;
                color: #909399;
                line-height: inherit;
            }
        }
        label {
            position: absolute;
            right: 5px;
            top: 0;
            line-height: inherit;
            .el-icon-upload-success {
                color: #67c23a;
                position: absolute;
                top: 5px;
                right: 5px;
            }
            .el-icon-close {
                display: none;
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
                opacity: .75;
                color: #606266;
            }
        }
    }
    li:hover {
        background-color: #f5f7fa;
        .el-icon-close {
            display: block;
        }
        .el-icon-upload-success {
            display: none;
        }
        a {
            color: #409eff;
        }
    }
}
</style>
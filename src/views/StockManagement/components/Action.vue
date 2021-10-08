<template>
    <div>
        <el-button @click="handleClick(0)" type="primary" size="mini">返回</el-button>
        <!-- <el-button class="btn_button_primary" type="primary" @click="handleClick(1)" v-if="state === 1 || state ===3">审核</el-button>  -->
        <el-button size="mini" type="primary" @click="handleClick(2)" v-if="show">保存</el-button>    
        <!-- <el-button size="small" @click="handleClick(3)" v-if="state === 1 || state ===3">作废</el-button> -->
        <el-button size="mini" type="primary" @click="handleClick(4)">导出</el-button>
        <el-button size="mini" type="primary" @click="handleClick(5)" v-if="show">下载导入模板</el-button>
        <upload-excel @handleImageSuccess="handleImageSuccess" :uploaddUrl="uploaddUrl" v-if="show && isUpload" :type="type" :detail="detail" />
    </div>
</template>
<script>
import UploadExcel from '@/components/Upload' 
export default {
    name: 'ActionsGroup',
    props: {
        uploaddUrl: {
            type: String,
            default: ''
        },
        isUpload: {
            type: Boolean,
            default: true
        },
        type: {
            type: Number,
            default: 0
        },
        show: {
            type: Boolean,
            default: true
        },
        detail: {
            type: Object,
            default: () => undefined
        }
    },
    components: {
        UploadExcel
    },
    methods: {
        handleClick(flag) {
            this.$emit('handleClick', flag)
        },
        handleImageSuccess(res) {
            this.$emit('uploadSuccess', res)
        }
    }
}
</script>
<style scoped lang="scss">
    div {
        display: flex;
        // margin-top: 25px;
        flex-direction: row-reverse;
        padding: 20px 0;
        align-items: center;
        button {
            margin-right: 5px;
        }
         div {
            display: flex;
            align-items: center;
         }
        .btn_button_primary {
            margin-right: 5px;
        }
    }
</style>
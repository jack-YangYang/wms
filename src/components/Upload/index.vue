<template>
    <el-upload
      :data="data"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      accept=".xlsx, .xls"
      :action="uploaddUrl"
    >
     <el-button size="mini" type="primary" style="margin-left: 15px">{{ title }}</el-button> 
    </el-upload>
</template>
<script>
import { loading, loadingClose, message } from '@/utils/common';
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        type: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: '导入'
        },
        detail: {
            type: Object,
            default: () => undefined
        },
        uploaddUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleImageSuccess(response) {
            console.log(response)
            loadingClose()
            if (response.code ===0) {
                this.$emit("handleImageSuccess", response);
                // message('success', '导入成功')
            } else {
                message('error', response.msg)
            } 
        },
        beforeUpload(file) {
            let type_arr = ["xls", "xlsx"];     
            let extension = file.name.substring(file.name.lastIndexOf('.') + 1);/* 获取文件名后缀 */
            if (!type_arr.includes(extension)) {
                message('warning', '上传文件格式错误')
                return false
            }
            if (this.type === 0) {
                if (this.detail && (!this.detail.whouseId && !this.detail.sourceWhouseId)) {           
                    message('warning', '请先选择仓库')
                    return false
                }
            } else if(this.type === 1) {
                if (this.detail && (!this.detail.sourceWhouseId && !this.detail.distWhouseId)) {           
                    message('warning', '请先选择仓库')
                    return false
                }
            } else {
                if (this.detail && (!this.detail.whouseId || !this.detail.shopId)) {
                    message('warning', '请选择店铺和仓库')
                    return
                }
            }
            
            loading()
        },
        handleError(err) {
            message('error', err.msg)
            loadingClose()
        }
     }
}
</script>
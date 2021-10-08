<template>
    <el-upload
      :data="data"
      :multiple="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :on-error="handleError"
      :headers="headers"
      :name="name"
      :before-upload="beforeUpload"
      :action="uploaddUrl"
    >
    <slot>
        <!-- <label for="avatar">Choose a profile picture:</label> -->

    
        <el-button size="mini" type="primary" style="margin-left: 15px">{{ title }}</el-button> 
    </slot>
    </el-upload>
    <!-- <div>
        <label for="avatar">Choose a profile picture:</label>

<input type="file"
       id="avatar" name="avatar"
       @change="selectFile"
       >
    </div> -->
</template>
<script>
import { loading, loadingClose, message } from '@/utils/common';
import { getToken } from '@/utils/auth'
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        name: {
            type: String,
            default: 'image'
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
    data() {
        return {
            file: null,
            headers: {
                Authorization: getToken()
            }
        }
    },
    methods: {
        handleImageSuccess(response) {
            console.log(response)
            loadingClose()
            if (response.code ===0) {
                this.$emit("handleImageSuccess", response);
            } else {
                message('error', response.msg)
            } 
        },
        selectFile(file, fileList) {
            console.log(file.target.files, fileList)
            // console.log(file.target.files.slice(0, 500))
        },
        beforeUpload(file) {
            let type_arr = ["image/jpeg", "image/png"];     
            if (!type_arr.includes(file.type)) {
                message('warning', '上传文件格式错误')
                return false
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
<style  lang="scss">
// .avatar-uploader {
//     width: 88px;
//     height: 88px;
// }
// .avatar-uploader .el-upload {
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .avatar-uploader .el-upload:hover {
//     border-color: #409EFF;
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 88px;
//     height: 88px;
//     line-height: 88px;
//     text-align: center;
//   }
//   .avatar {
//     width: 88px;
//     height: 88px;
//     display: block;
//   }
</style>
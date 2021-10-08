<template>
    <el-dialog title="库位标签" :visible.sync="dialogTableVisible" class="dialog-barcode" width="500px" :before-close="() => confirm(false)">
        <div :class="{'overflow-scroll': spaceCodeList.length > 1}">
            <div id="ProductDocuments">  
                <ul>
                    <!-- <li > -->
                        <li v-for="item in spaceCodeList" :key="item.sku">
                            <barcode 
                            :value="item" 
                            :height="50" 
                            font="Arial"
                            :width="1.5"
                            fontOptions="bold" 
                            /> 
                            <div class="page" />
                        </li> 
                    <!-- </li> -->
                </ul>     
        </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" v-print="printObj" @click="confirm(true)">确定</el-button>
            <el-button type="primary" size="small" @click="confirm(false)">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    components: {
        'barcode': VueBarcode,
    },
    props: {
        showspaceCodeModule: {
            type: Boolean,
            default: false
        },
        spaceCodeList: {
            type: Array,
            default:() => []
        }
    },
    data() {
        return {
            dialogTableVisible: this.showspaceCodeModule,
            printObj: {
              id: "ProductDocuments",
              popTitle: '库位标签',
              extraCss: 'www.nantang.erp.com',
              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
            },
            options: {
                format: 'barcode-format',
                height: 48,
                width: 2,
                textMargin: 25,
                textAlign: "left"
            },
        }
    },
    methods: {
        confirm(flag) {
            if (!flag) {
                this.dialogTableVisible = false
                this.$emit('handleChangeModule', flag)
            }
        }
    },
    mounted() {
    }
}
</script>
<style  lang="scss" scoped>
#ProductDocuments{
    // width: 360px;
    padding: 0;
    margin: 0;
    ul {
        list-style: none;
        padding-left: 0px;
        padding: 0;
        margin: 0;
        li {
            // padding-bottom: 5px;
            padding: 0;
            margin: 0;
            & > div {
                text-align: center;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            // min-height: 210px;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            // text-align: center;
            .page {
                page-break-after: always;
                page-break-before: always;
            }
        }
    }
}
.overflow-scroll{
        height: 500px;
        margin: 0;
        padding: 0;
        overflow-y: scroll;
    }
</style>
<style lang="scss">
// #ProductDocuments {
//     Header {
//         & > div {
//             & > div:nth-child(2) {
//                 width: 60%;
//                 svg {
//                     height: 100px;
//                     rect {
//                         height: 100;
//                         width: 800;
//                     }
//                 }
//                 #barcode {
                    
//                     width: 100%;
//                 }
//         }   
//         }
//     }
// }
.dialog-barcode {
    .el-dialog__body {
        display: flex;
        justify-content: center;
    }
}
</style>

<style media="ProductDocuments" scoped>
   
    /*去除页眉页脚*/
  html{
    background-color: #FFFFFF;
  }
 
  body{
    /* border: solid 1px blue ; */
    /* margin: 10mm 15mm 10mm 15mm;  */
  }
  #ProductDocuments{
      /* border: 1px solid #000; */
  }

</style>
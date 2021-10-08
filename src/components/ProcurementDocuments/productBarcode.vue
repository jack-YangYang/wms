<template>
    <el-dialog title="产品标签" :visible.sync="dialogTableVisible" class="dialog-barcode" width="500px" :before-close="() => confirm(false)">
        <div :class="{'overflow-scroll': productBarcodeList.length > 3}">
            <div id="ProductDocuments">  
                <!-- <ul> -->
                    <!-- <li> -->
                        <div  v-for="(item, index) in productBarcodeList" :key="index">
                            <div class="barcode-head">
                                <slot>
                                    <span class="date">{{ date }}</span>
                                </slot>
                                <span>{{ index + 1 }}/{{ productBarcodeList.length }}</span>
                            </div>
                            
                            
                            <barcode :value="item.sku" 
                            :options="options" tag="img" 
                            :fontSize="13" 
                            font="Arial"
                            :margin="0"
                            fontOptions="bold"  
                            :width="1.2" 
                            :height="40" /> 
                            <span class="sku-name">{{ item.skuName }}</span>  
                          <div class="page" />
                        </div> 
                          
                    <!-- </li> -->
                <!-- </ul>      -->
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
        showProductModule: {
            type: Boolean,
            default: false
        },
        productBarcodeList: {
            type: Array,
            default:() => []
        },
        date: {
            type: String,
            default: '2020-20-20'
        }
    },
    data() {
        return {
            dialogTableVisible: this.showProductModule,
            printObj: {
              id: "ProductDocuments",
              popTitle: '产品标签',
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
                return
            }
            this.$emit('confirmPrint')
        }
    },
    mounted() {
    }
}
</script>
<style  lang="scss" scoped>
#ProductDocuments{
    width: 60mm;
    padding: 0;
    margin: 0;
    // ul {
    //     list-style: none;
    //     padding-left: 0px;
    //     padding: 0;
    //     margin: 0;
    //     li {
    //         padding-bottom: 5px;
    //         padding: 0;
    //         margin: 0;
    //         height: 32mm;
    //         min-height: 210px;
    //         display: flex;
    //         padding-top: 2.5mm;
    //         align-items: center;
    //         justify-content: center;
    //         text-align: center;
    //         overflow: hidden;
    //         font-size: 14px;
            & > div {
                width: 60mm;
                text-align: center;
                // height: 27mm;
                float: left;
                // padding: 1mm 0;
                // padding: 2.5mm;
                overflow: hidden;
                .barcode-head {
                    
                    display: flex;
                    padding: 0 5mm;
                    justify-content: space-between;
                }
                .date {
                    margin-right: 5px;
                    text-align: left;
                }
                svg {
                    // height: 135px;
                    // width: 3000px;
                    // overflow: hidden;
                    rect {
                        height: 1000;
                        width: 800;
                    }
                    g {
                        rect {
                            height: 1080;
                        }
                        text {
                            font-weight: bold;
                        }
                    }
                }
                span {
                    overflow: hidden;
                    font-size: 12px;
                }
               
            }
            // .sku-name {
            //     display: inline-block;
            //     width: 58mm;
            //     font-size: 1mm;
            //     color: #333;
            //     overflow: hidden;
            //     text-overflow: ellipsis;
            //     white-space: nowrap;
            //     margin: 0;
            // }
        // }
    // }
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
.page {
    page-break-after: always;
    page-break-before: always;
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
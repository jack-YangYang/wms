<template>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="dialog-barcode" :before-close="() => confirm(false)" width="580px">
        <div id="ProcurementDocuments">
            <Header>
                <h2>{{ title }}</h2>
                <div>
                     <div class="new-width qaer">
                        <p>质检人:{{detail.qaUserName}}</p>
                    </div>
                    <div>
                        <barcode 
                        :value="detail.ticketCode" 
                        tag="img" 
                        :width="1.5" 
                        :height="40" 
                        :fontSize="14"
                         />         
                    </div>
                    <div class="new-width">
                        <p>解决人:{{ detail.resolvedUserName }}</p>
                        <p>{{ date }}</p>
                    </div>
                </div>
            </Header>
            <component :is="component" :tableData="detailItems" :state="detail.state" :detail="detail" />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" v-print="printObj" @click="confirm(true)">确定</el-button>
            <el-button type="primary" size="mini" @click="confirm(false)">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import VueBarcode from 'vue-barcode';
import AbnormalTable from './abnormalTable'
export default {
    components: {
        'barcode': VueBarcode,
        AbnormalTable,
    },
    props: {
        showModule: {
            type: Boolean,
            default: false
        },
        component: {
            // props: {
                type: String,
                default: 'BarcodeTable'
            // }
        },
        title: {
            // props: {
                type: String,
                default: '采购入库单'
            // }
        },
        date: {
            type: String,
            required: true
        },
        detail: {
            type: Object,
            required: true
        },
        detailItems: {
            type: Array,
            default:() => []
        },
        outputList: {
            type: Array,
            default: () => []
        }
    },
    computed:{
        bringupType() {
            console.log(this.outputList)
            if (JSON.stringify(this.outputList.find(item => item.val === this.detail.type)) !== '{}') {
                return this.outputList.find(item => item.val === this.detail.type).name
            }
        }
    },
    data() {
        return {
            dialogTableVisible: this.showModule,
            printObj: {
              id: "ProcurementDocuments",
              popTitle: '采购入库单标签',
              extraCss: 'www.nantang.erp.com',
              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
            },
            options: {
                format: 'barcode-format',
                height: 48,
                width: '1px',
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
<style scoped lang="scss">
#ProcurementDocuments{
    width: 550px;
    // margin: 0;
    padding: 0;
    // height: 96mm;
    font-size: 12px;
    border: 1px solid #000;
    margin: 0 auto;
    Header {
        h2 {
            font-family:"Microsoft YaHei",微软雅黑,"Microsoft JhengHei",华文细黑,STHeiti,MingLiu;
            text-align: center;
            font-size: 14px;
            margin: 0;
        }
        & > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // min-height: 48px;
            padding: 0 10px;
            p{
                margin: 0;
                // line-height: 26px;
                // text-align: center;
            }
            & > div {
                width: 27%;
                .remark {
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // white-space: nowrap;
                }
            }
            & > div.new-width {
                width: 20%;
                word-wrap:break-word;
                text-align: right;
word-break:normal; 
            }
            & > div.new-width.qaer {
                text-align: left;
            }
            & > div:nth-child(2) {
                flex: 1;
                // svg {
                //     height: 58px;
                //     rect {
                //         height: 58;
                //     }
                // }
                #barcode {
                    
                    width: 100%;
                }
            }   
        }
        
    }
}
</style>
<style lang="scss">
#ProcurementDocuments {
    Header {
        color: #000;
        font-weight: bold;
        & > div {
            & > div:nth-child(2) {
                width: 60%;
                display: flex;
                justify-content: center;
                // svg {
                //     height: 100px;
                //     width: 356px;
                //     rect {
                //         height: 100;
                //         width: 80;
                //     }
                // }
                #barcode {
                    
                    width: 100%;
                }
        }   
        }
    }
}
.dialog-barcode {
    .el-dialog__body {
        display: flex;
        justify-content: center;
    }
}
</style>

<style media="ProcurementDocuments" scoped>
   
    /*去除页眉页脚*/
  html{
    background-color: #FFFFFF;
    margin: 0;  /* this affects the margin on the html before sending to printer */
  }
 
  body{
    /* border: solid 1px blue ; */
    /* margin: 10mm 15mm 10mm 15mm;  */
  }
  #ProcurementDocuments{
    border: 2px solid #000;
    margin-left: 2mm;
    /* margin: 0; */
  }

</style>
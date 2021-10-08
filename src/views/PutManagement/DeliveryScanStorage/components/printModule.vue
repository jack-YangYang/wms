<template>
  <div>
    <div ref="imageWrapper" class="imageWrapper">
        <div id="barcode-head">
            <span class="date">{{ rkdCode }}</span>
            <!-- <span class="date">{{ date }}</span> -->
        </div>   
        <barcode
        :value="sku" 
        :fontSize="14" 
        :margin="0"
        fontOptions="bold"  
        lineColor="#000000"
        :width="1.2" 
        :height="50" /> 
        <span class="sku-name">{{ skuName }}</span>  
      <div class="page" />
    </div> 
    <!-- <div class="button">
      <el-button style="width: 70%;" type="success" size="small" @click="toImage">生成截图</el-button>
    </div> -->
  </div>
</template>

<script>
  import html2canvas from "html2canvas"
  import VueBarcode from 'vue-barcode';
  import httpPrinterBarcode from '@/utils/print'
  import { mapState } from 'vuex'
  import { dateFormat } from '@/utils/common'
  import { printDemo } from '@/api/PutInStorageOrder'
  function formatBlob(data) {
    data = data.split(',')[1]
    data = window.atob(data)
    var ia = new Uint8Array(data.length)
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
    }
    // canvas.toDataURL 返回的默认格式就是 image/png
    return new Blob([ia], {
        type: 'image/png'
    })
}
export default {
  name: 'Home',
  components: {
    'barcode': VueBarcode
  },
  data() {
    return {
        date: dateFormat(new Date(), 2)
    }
  },
  computed: {
    ...mapState('DeliveryScanStorage', ['rkdCode', 'sku', 'skuName', 'ticketInInfoFormat']),
    // ticketInInfoFormat: state => state.DeliveryScanStorage.ticketInInfoFormat
  },
  methods: {
    toImage(num, isPrivier) {
      html2canvas(this.$refs.imageWrapper).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
          console.log(dataURL)
          // return
          let form = new FormData()
          form.append('pdfUrl', dataURL.split(',')[1])
          printDemo(num, form)
          // setTimeout(() => {
          //   httpPrinterBarcode(dataURL.split(',')[1], num, isPrivier)
          // }, 1000)
        });
    }
  }
}
</script>

<style scoped>

.imageWrapper {
    
    display: flex;
    flex-direction: column;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -1000px;
    /* padding: 0 3mm; */
    width: 50mm;
  }
  #barcode-head {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 0 3px;
    font-weight: bold;
    color: #000000;
    /* font-weight: bold; */
  }
  .sku-name {
    font-weight: bold;
    color: #000000;
    line-height: 1;
  }
</style>
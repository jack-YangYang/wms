<template>
    <el-card class="top-card" :style="getStyle">
        <!-- <embed :src="list2[0]" />
        <embed :src="list2[1]" />
        <embed :src="list2[2]" /> -->
        <!-- <embed v-for="item in list2" :src="item" :key="item" style="width: 100%; height: 350px"/> -->
        <div class="card-content">
            <p>
                <span>分拣单号:</span>
                <span>{{ headInfo.batch_number }}</span>
            </p>
            <p>
                <span>总数量:</span>
                <span>{{ headInfo.total_num }}</span>
            </p>
            <p>
                <span>已核数量:</span>
                <span>{{ headInfo.checked_num }}</span>
            </p>
            <p>
                <span>未核数量:</span>
                <span>{{ headInfo.unchecked_num }}</span>
            </p>
            <p>
                <el-button @click="printAllExpress(headInfo.track_ticket)" type="text" >打印全部面单</el-button>
            </p>
        </div>
        <el-dialog
        :visible.sync="showModule"
        >
            <div id="print">
                <img :src="imgUrl" alt="" width="100%" height="auto">
	            <canvas id="the-canvas" style="display: none"></canvas>
                <!-- <iframe id="mypdf" v-for="item in list2" :src="item" :key="item" width="60%" style="height:10em"align="right"></iframe> -->
                <img type="application/pdf" v-for="item in list2" :src="item" :key="item" height="400px" width="300px" />
            </div>
            <el-button v-print="print"></el-button>
        </el-dialog>
        <!-- <div>
            <vue-pdf
            v-for="(item, index) in list"
            :key="index"
            :src="item" 
            >
            </vue-pdf>
        </div> -->
    </el-card>
</template>
<script>
import { message } from '@/utils/common'　
import { getLodop } from '@/vendor/LodopFuncs'
const list = [
                'https://label.cne.com/CnePrint?icID=10823&cNos=T00D7A0076781312&ptemp=label10x15_0&signature=866922c6fc7da1967ba52b14f88e5b54',
                'https://label.cne.com/CnePrint?icID=10823&cNos=T00D7A0076781728&ptemp=label10x15_0&signature=28adcd2e3941c83bd1263a11fcfee7a9',
                'https://label.cne.com/CnePrint?icID=10823&cNos=T00D7A0076781691&ptemp=label10x15_0&signature=f21d992f560f9e4b1aea1021ba2f3abd'
            ]
import vuePdf from 'vue-pdf'
export default {
    props: {
        headInfo: {
            type: Object,
            default: () => undefined
        }
    },
    components: {
        vuePdf
    },
    computed: {
        getStyle() {
            if ((this.scrollTop >= this.offsetTop) && this.scrollTop) {
                // console.log(this.scrollTop, this.offsetTop)
                return {
                    position: 'sticky',
                    height: '67px',
                    width: '100%',
                    marignBottom: '50px',
                    'z-index': 100,
                    top: '0'
                }
            }
            return {}
        },
    },
    methods: {
        printAllExpress(list) {
            console.log(this.showPdf(this.list2[0]))
            // this.showModule = true
            return
            var newWin = window.open(""); //
            // let div = document.createElement("div")
            // // let style = {
            // //     width: '100%'
            // //     height: '100%'
            // // }
            // // img.src = this.list2[0]
            // // newWin.document.body.appendChild(img)
            for (var i = 0; i < this.list2.length; i++) {
                let img = document.createElement("embed")
                img.src = this.list2[i]
                img.height = "575px"
                img.width = "387"
                // var imageToPrint = document.getElementById("printDiv" + i); //获取需要打印的内容
                newWin.document.body.appendChild(img)
                // newWin.document.write('abc'); //将需要打印的内容添加进新的窗口
                // <img :src="this.list2[i]" alt="" />
            }
            // newWin.print()
            // for (const item of this.list2) {
            //     this.printEveryItem(item)
            // }
            // const strURLorContent = strURL.map(item => window.atob(item))
            // LODOP = getLodop()
            // LODOP.PRINT_INIT('打印')
            // LODOP.SET_PRINT_PAGESIZE(3, 1000, 1500, '')
            // for (let j = 0; j < strURL.length; j++) {
            //     this.creatPdfRage(strURL[j])
            // }
            // LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, '')
            // if (LODOP.SET_PRINTER_INDEXA(1)) { LODOP.PREVIEW() } //上面的例子选择的打印机序号为0，这里为1，上面的直接打印，这里的是预览，可以根据需求选择
            // LODOP.PREVIEW()
            // let LODOP = getLodop()//调用getLodop获取LODOP对象
            // LODOP.PRINT_INIT("")
            // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "打印内容")
            // LODOP.PREVIEW()
            // window.open(this.list2.join())
            // if (!list || !list.length) {
            //     message('warning', '当前没有可以打印的数据')
            //     return
            // }
            // for (let item of list) {
            //     window.open(item)
            // }
        },
        printEveryItem(item) {
            // let LODOP = getLodop(); //调用getLodop获取LODOP对象
            // return new Promise(function (resolve) {
            //     setTimeout(() => {
            //     LODOP.PRINT_INIT("");
            //     let strStyleCSS = `<style type='text/css' rel='stylesheet'>.img1{display:block;margin:10px;width:360;height:360}</style>`
            //     let html = `<head>${strStyleCSS}</head><body><div class='print-card'>
            //             <img src=${item} class='img1' />
            //         </div><body>`
            //     LODOP.ADD_PRINT_HTM(0,0,380,380,html);
            //     LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"");   
            //     LODOP.PRINT();
            //     }, 1000);
            // });
        },
        creatPdfRage(pdf) {
            LODOP.NewPage()
            LODOP.ADD_PRINT_IMAGE(12, 12, '95%', '95%', pdf)
            // LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2)
        },
        //url参数是pdf地址，imgUrl是最后的base64格式图片
        showPdf(url) {
            let _this = this;
            let imgArr = [];
            pdfjsLib.workerSrc = 'pdf.worker.js';
            let loadingTask = pdfjsLib.getDocument(url);
            // PDFJS.workerSrc = 'pdf.worker.js';// pdfjsLib为undefined可以换成这行
            // let loadingTask = PDFJS.getDocument(url);// pdfjsLib为undefined可以换成这行
            loadingTask.promise.then(function(pdf) {
                console.log('PDF loaded');
                let pageNum = pdf.numPages;
                // console.log(pageNum);
                for (let i=1; i<=pageNum; i++) {
                    pdf.getPage(i).then(function(page) {
                        console.log('Page loaded');

                        let scale = 1;
                        let viewport = page.getViewport(scale);

                        // let canvas = document.getElementById('the-canvas');
                        let canvas = document.createElement("canvas");
                        let context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        let renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        let renderTask = page.render(renderContext);
                        renderTask.then(function () {
                            console.log('Page rendered');
                            let imgUrl = canvas.toDataURL('image/jpeg'); //转换为base64
                            if (imgUrl) {
                                imgArr[i-1] = imgUrl;
                            }
                            //pdf全部画完结束后操作
                            if (imgArr.length==pageNum&&!isEmpty(imgArr)) {
                                // let canvas2 = document.createElement("canvas");
                                let canvas2 = document.getElementById('the-canvas');
                                let context2 = canvas2.getContext('2d');
                                canvas2.height = viewport.height*pageNum;
                                canvas2.width = viewport.width;
                                let count = 0;
                                for (let j=0; j<imgArr.length; j++) {
                                    let IMG = new Image();
                                    IMG.src=imgArr[j];
                                    IMG.width = viewport.width;
                                    IMG.height = viewport.height;
                                    IMG.onload = function () {
                                        context2.drawImage(IMG,0,viewport.height*j);
                                        count++;//确保所有img渲染结束后操作
                                        if (count==pageNum) {
                                            let canvas = document.getElementById('the-canvas');
                                            //赋值给img
                                            _this.imgUrl = canvas.toDataURL('image/jpeg'); 
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            }, function (reason) {
                console.error(reason);
            });

            function isEmpty(arr) {
                for(let i=0;i<arr.length;i++) {
                    if(!arr[i])
                        return true;
                }
                return false;
            }
        }

    },
    data() {
        return {
            positionStyle: false,
            imgUrl: '', 
            showModule: false,
            print: {
                id: "print",
            },
            list2: list,
            offsetTop: 0,
            scrollTop: 0          
        }
    },
    mounted() {
        let card = document.querySelector('.top-card')
        let scrollview = document.querySelector('.router_view_box')
        let _this = this
        scrollview.addEventListener('scroll', () => {
            _this.offsetTop = card.offsetTop
            _this.scrollTop = scrollview.scrollTop
            // _this.getStyle(card.offsetTop, scrollview.scrollTop)
        }, true);
    }
}
</script>
<style  lang="scss">
.top-card {
    margin-bottom: 5px;
    padding: 0 5px;
    .el-card__body {
        padding: 0;
    }
    div.card-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        p {
            flex: 1;
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
            color: #333333;
            span:nth-child(1) {
                font-weight: bold;
            }
        }
        p:nth-child(1) {
            min-width: 280px;
        }
    }
}


</style>
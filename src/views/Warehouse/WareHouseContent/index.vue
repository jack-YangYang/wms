<template>
    <main>
        <div class="config">
            <section>
                <el-card>
                    <head-title title="区位" />
                    <el-button 
                    type="primary" 
                    size="mini" 
                    @click="CHANGE_PARTITION_MODAL({ type: true, title: '添加区位', whouseId })">
                    添加区位
                    </el-button>
                    <el-input 
                    v-model="name"
                    clearable 
                    placeholder="请输入区位名称回车进行搜索" 
                    style="width: 180px" 
                    @keyup.enter.native="getData" />
                    <partition-table @filterSpace="getList" />
                </el-card>        
            </section>
            <section>
                <el-card>
                    <div>
                        <head-title title="库位" />
                        <header class="aciton">
                            <el-button type="primary" size="mini" @click="downloadTemplate">下载模板</el-button>
                            <el-button type="primary" size="mini" @click="exportSpacecode(whouseId)">导出所有库位</el-button>
                            <upload 
                            :uploaddUrl="`${baseUrl}//warehouse/space/${whouseId}`" 
                            title="库位导入" 
                            @handleImageSuccess="handleImageSuccess" />
                            <el-button type="primary" size="mini" @click="printSpaceCode" :disabled="!spaceTableData.length">打印库位</el-button>
                        </header>
                        <div v-if="spaceTableData.length">
                            <space-table />
                            <page 
                            :page="{size: page.pageSize, 
                            page: page.pageNo}" 
                            style="position:inherit"
                            :total="spaceTotal"
                            left="12px"
                            marginTop=""
                            @handleCurrentChange="changePage" 
                            @handleSizeChange="changeSize" />
                        </div>
                        <no-data-content v-else />
                    </div>          
                </el-card> 
            </section>
        </div>
        <transition name="fade-transform" mode="out-in">
            <module-config v-if="showContentMdoal" :name="name" />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <space-code-barcode 
            :spaceCodeList="spaceCodeList" 
            v-if="showspaceCodeModule" 
            @handleChangeModule="handleChangeModule"
            :showspaceCodeModule="showspaceCodeModule"
             />
        </transition>
    </main>
</template>
<script>
import headTitle from './components/title'
import partitionTable from './components/partition-table'
import spaceCodeBarcode from '@/components/ProcurementDocuments/spaceCodeBarcode'
import moduleConfig from './components/modal'
import NoDataContent from "@/components/NoDataImages"
import spaceTable from './components/space-table'
import upload from '@/components/Upload'
import page from '@/components/page'
import { mapActions, mapState, mapMutations } from 'vuex'
import { promptMessage } from '@/utils/common'
export default {
    components: {
        headTitle,
        page,
        upload,
        spaceCodeBarcode,
        spaceTable,
        moduleConfig,
        NoDataContent,
        partitionTable
    },
    beforeDestroy() {
        this.GET_SPACE_DATA({ result: { data: [], total: 0 }, partitionId: null, whouseId: null})
    },
    provide() {
        return {
            params: this.page,  
        }
    },
    computed: {
        ...mapState('Warehouse', [
            'spaceTotal',
            'showContentMdoal',
            'spaceTableData',
        ])
    },
    data() {
        return {
            page: {
                pageNo: 1,
                pageSize: 20
            },
            spaceCodeList: [],
            showspaceCodeModule: false,
            baseUrl: process.env.VUE_APP_FBA_API,
            name: '',
            whouseId: null,
            partitionId: null,
        }
    },
    methods: {
        ...mapActions('Warehouse', [
            'partitionList',
            'downloadTemplate',
            'exportSpacecode',
            'getSpaceData'
        ]),
        handleImageSuccess(response) {
            promptMessage(response)
            if (response.success) {
                this.getData()
            }   
        },
        printSpaceCode() {
            this.spaceCodeList = this.spaceTableData.map(item => item.spaceCode)
            this.showspaceCodeModule = true
        },
        handleChangeModule(flag) {
            this.showspaceCodeModule = flag
        },
        getData() {
            this.partitionList({ whouseId: this.whouseId, name: this.name })
        },
        ...mapMutations('Warehouse', [
            'CHANGE_PARTITION_MODAL',
            'GET_SPACE_DATA'
        ]),
        getList(partitionId, whouseId) {
            console.log(whouseId)
            this.partitionId = partitionId
            this.getSpaceData({ params: this.page, partitionId, whouseId})
        },
        changePage(page) {
            this.page.pageNo = page
            this.getList(this.partitionId, this.whouseId)
        },
        changeSize(size) {
            this.page.pageSize = size
            this.page.pageNo = 1
            this.getList(this.partitionId, this.whouseId)
        }
    },
    mounted() {
        let { id } = this.$route.params
        if (id) {
            this.whouseId = id
            this.$store.commit('Warehouse/SAVE_WHOUSEID', id)
            this.getData()
        }
    }
}
</script>
<style lang="scss" scoped>
 main {
    & > div.config {
        display: flex;
        section:nth-child(1) {
            width: 35%;
        }
        section:nth-child(2) {
            width: 65%;
            position: relative;
            min-height: 350px;
            header.aciton {
                display: flex;
                align-items: center;
            }
        }
        section {
            padding: 5px 12px;
        }
    }
    @media screen and (max-width: 1080px) {
        & > div.config {
            flex-wrap: wrap;
            section:nth-child(1) {
                width: 100%;
            }
            section:nth-child(2) {
                width: 100%;
                position: inherit;
            }
        }
    }
 }
</style>
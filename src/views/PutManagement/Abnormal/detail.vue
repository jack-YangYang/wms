<template>
    <div class="main">
        <div class="abnormal-content">
            <Header>
                质检异常详情
            </Header>
            <abnormal-list :list="content.items" />
            <div class="reason">
                <span>异常原因:</span>
                <el-input type="textarea" style="height:100%" v-model="content.detail.reason" disabled />
            </div>
            <div class="reason attachment">
                <span>预览附件图片:</span>
                <div class="image-list">
                    <picture-image :src="src" v-for="src in content.files" :key="src" /> 
                </div>
            </div>
            <div class="reason button">
                <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
                <el-button @click="printAbnormalData" size="mini" type="primary">打印异常数据</el-button>
            </div>
        </div>
        <transition name="fade-transform" mode="out-in">
            <procurement-documents 
            @handleChangeModule="handleChangeModule"
            component="AbnormalTable"
            v-if="showModule" 
            title="质检异常单"
            :showModule="showModule" 
            :detail="content.detail" 
            :detailItems="content.items" 
            :date="date" />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <shop-info-module 
            :tableData="shopInfoTable" 
            :type="4"
            :showModule="showShopInfoModule" 
            @handleSubmit="GET_SHOP_INFO_DATA"
            v-if="showShopInfoModule" />
        </transition>
    </div>
</template>
<script>
import abnormalList from './components/abnormal-list'
import pictureImage from './components/picture'
import { dateFormat } from '@/utils/common'
import shopInfoModule from '@/components/GetShopInfo'
import ProcurementDocuments from '@/components/ProcurementDocuments/AbnormalBarcode'
import { mapMutations, mapState } from 'vuex'
export default {
    components: {
        abnormalList,
        pictureImage,
        shopInfoModule,
        ProcurementDocuments
    },
    computed: {
        ...mapState('Abnormal', ['content', 'shopInfoTable', 'showShopInfoModule'])
    },
    data() {
        return {
            showModule: false,
            date: ''
        }
    },
    methods: {
        printAbnormalData() {
            this.date = dateFormat(new Date())
            this.showModule=  true
        },
        ...mapMutations('Abnormal', ['GET_SHOP_INFO_DATA']),
        handleChangeModule(flag) {
            this.showModule=  flag
        }
    },
    mounted() {
        const { ticketCode } = this.$route.query
        this.$store.dispatch('Abnormal/getContent', ticketCode)
    }
}
</script>
<style lang="scss" scoped>
.abnormal-content {
    width: 90%;
    margin: 0 auto;
    padding: 0px 0;
    border: 1px solid #ccc;
    height: calc(100vh - 140px);
    border-radius: 5px;
    header {
        font-size: 14px;
        padding: 10px 20px;
        font-weight: bold;
        color: #34495e;
        border-bottom: 1px solid #ccc;
    }
    .reason {
        min-height: 56px;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        padding: 5px 0;
        & > span {
            display: inline-block;
            min-width: 280px;
            text-align: right;
            padding-right: 10px;
        }
        .el-textarea {
            width: 80%;
        }
    }
    .reason.button {
        flex-direction: row-reverse;
        padding-right: 10px;
        button {
            margin-left: 10px;
        }
    }
    .attachment {
        width: 100%;
            // flex-direction: column;
        color: #02A7F0;;
        .image-list {
            width: 80%;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
    }
}
</style>
<template>
    <main>
        <detail-title title="上架" />
        <detail-content :detail="detail" />
        <detail-table />
        <div class="actions-bottom">
            <div>
                <span>备注：</span>
                <el-input type="textarea" style="width: 350px" placeholder="请输入备注" />
            </div>
            <div>
                <el-button size="mini" type="primary">保存</el-button>
                <el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
            </div>
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailContent'
import detailTable from './components/detailTable'
import { mapState } from 'vuex'
export default {
    components: {
        detailTitle,
        detailHeader,
        detailContent,
        detailTable
    },
    computed: {
        ...mapState('Shelves', [
            'detail'
        ])
    }
}
</script>
<style scoped lang="scss">
main {
    .actions-bottom {
        display: flex;
        padding: 5px 0;
        justify-content: space-between;
        align-content: center;
        & > div {
            display: flex;
            align-items: center;
            color: #909399;
            span {
                min-width: 60px;
            }
        }
    }
}
</style>
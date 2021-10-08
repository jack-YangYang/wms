<template>
    <div class="main">
        <div class="table">
            <h3 style="text-align: center; margin: 0; margin-bottom: 5px">
                拣货单
            </h3>
            <table border="1" cellspacing="0" cellpadding="0" width="100%">
                <thead>
                    <tr>
                        <td colspan="7">
                            <p class="title">汇总拣货单</p>
                        </td>
                        
                    </tr>
                    <tr>
                        <td rowspan="2">
                            <p class="title">货件单号</p>
                        </td>
                        <td colspan="7">
                            {{ detail.ticketCode }}
                        </td>
                    </tr>
                    <tr>
                        <!-- <td></td> -->
                        <td colspan="2">
                            <div style="width: 100%">
                                <vue-barcode
                                    :value="detail.ticketCode"
                                    :width="1.5"
                                    :fontSize="16"
                                    :height="48"
                                />
                            </div>
                        </td>
                        <td>
                            <p class="title">调出仓库</p>
                        </td>
                        <td>{{ detail.sourceWhouseName }}</td>
                        <td>
                            <p class="title">调入仓库</p>
                        </td>
                        <td>
                            {{ detail.distWhouseName }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="title">创建人</p>
                        </td>
                        <td>{{ detail.createUser }}</td>
                        <td>
                            <p class="title">制单人</p>
                        </td>
                        <td>
                            {{ createUser }}
                        </td>
                        <td>
                            <p class="title">拣货人</p>
                        </td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td>
                            <p class="title">单据创建日期</p>
                        </td>
                        <td>
                            <p>
                                {{ detail.createDate }}
                            </p>
                        </td>
                        <td style>
                            <p class="title">制单时间</p>
                        </td>

                        <td>
                            {{ date }}
                        </td>
                        <td>
                            <p class="title">拣货时间</p>
                        </td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td>
                            <p class="title">打包人</p>
                        </td>
                        <td></td>
                        <td>
                            <p class="title">复核人</p>
                        </td>
                        <td></td>
                        <td>
                            <p class="title">计费重量</p>
                        </td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td>
                            <p class="title">打包时间</p>
                        </td>
                        <td></td>
                        <td>
                            <p class="title">复核时间</p>
                        </td>
                        <td></td>
                        <td>
                            <p class="title">计费体积</p>
                        </td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td>
                            <p class="title">备注：</p>
                        </td>
                        <td colspan="7">
                            <span>
                                {{ detail.remark }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <p
                                style="
                                    color: red;
                                    text-align: left;
                                    fontweight: bold;
                                    margin: 3px;
                                "
                            >
                                1.所有发往亚马逊的货件，单箱限重23KG，单边不超过63.5cm---硬性要求
                            </p>
                            <p
                                style="
                                    color: red;
                                    text-align: left;
                                    fontweight: bold;
                                    margin: 3px;
                                "
                            >
                                2.超过15KG需要贴对应国家语言的超重标签，套箱贴MADE
                                IN CHINA标签
                            </p>
                            <p
                                style="
                                    color: red;
                                    text-align: left;
                                    fontweight: bold;
                                    margin: 3px;
                                "
                            >
                                3.接单员需要复核产品SKU个数及数量
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <!-- <td style="width: 10%">
                            <p class="title">拼箱编码</p>
                        </td> -->
                        <td style="width: 20%">
                            <p class="title">产品中文品名</p>
                            <p class="title">（总的类别）</p>
                        </td>
                        <td style="width: 20%">
                            <p class="title">SKU</p>
                        </td>
                        <td style="width: 15%">
                            <p class="title">库位</p>
                        </td>
                        <td style="width: 10%">
                            <p class="title">FNSKU</p>
                        </td>
                        <td style="width: 15%">
                            <p class="title">产品属性</p>
                        </td>
                        <td style="width: 20%" colspan="2">
                            <p class="title">数量</p>
                        </td>
                        <!-- <td style="width: 15%">
                            <p class="title">备注</p>
                        </td> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, key) in detailItems" :key="key">
                        <!-- <td>
                            <el-input
                                v-if="isEditCode"
                                v-model="item.box_code"
                                :disabled="!isEditCode"
                                placeholder="请输入"
                            />
                            <p v-else>{{ item.box_code }}</p>
                        </td> -->
                        <td style="padding: 3px">{{ item.skuName }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.sourceSpaceCode }}</td>
                        <td>{{ item.fn_sku }}</td>
                        <td>{{ item.skuAttr }}</td>
                        <td colspan="2">{{ item.count }}</td>
                        <!-- <td>{{ detail.remark }}</td> -->
                    </tr>
                    <tr>
                        <!-- <td>
                            <p class="title">合计</p>
                        </td> -->
                        <td>
                            <p class="title">合计</p>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colspan="2">
                            <p>
                                {{ numberTotal }}
                            </p>
                        </td>
                        <!-- <td></td> -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import VueBarcode from 'vue-barcode';
export default {
    data() {
        return {
            mainData: '',
            content: [],
            tableData: {
                sku_list: []
            },
            time: '',
            nowTime: '',
        }
    },
    computed: {
        ...mapState({
            detail: state => state.Transfers.detail,
            date: state => state.Transfers.date,
            createUser: state => state.Transfers.createUser,
            detailItems: state => state.Transfers.detailItems,
        }),

        numberTotal: function () {
            let num = 0
            try {
                if (this.detailItems.length > 0) {
                    this.detailItems.forEach((item) => {
                        num += item.count * 1
                    })
                }
            } catch (error) {}

            return num
        },
    },
    // },
    methods: {
        
    },
    components: {
        VueBarcode
    },
}
</script>
<style scoped media="print">
@page {
    /* size: portrait; */
}
</style>

<style lang="scss" scoped>
.main {
    width: 100%;

    .table {
        padding: 10px;

        tr {
            td {
                width: 50px;
                height: 50px;
                text-align: center;
                font-size: 12px;
                .title {
                    font-weight: bold;
                    text-align: center;
                }
                padding: 0px 3px;
            }
        }
    }
}
</style>
<template>
    <div class="detail-content" id="content">
        <!-- <div>
            <div>
                <span>快递单号:</span>
                <span>111111111</span>
                <span>{{ detail.shipOrder }}</span>
            </div>
            <div>
                <span>1688单号:</span>
                <span>{{ detail.alibabaId }}</span>
            </div>
        </div> -->
        <div>
            <div>
                <span>入库单号:</span>
                <span>{{ detail.ticketCode }}</span>
            </div>
            <div>
                <span>关联单号:</span>
                <span>{{ detail.ticketOrder }}</span>
            </div>
        </div>
        <div>
            <div>
                <span>入库仓库:</span>
                <span>{{ detail.whouseName }}</span>
            </div>
            <div>
                <!-- <span>入库店铺:</span>
                <span>{{ detail.shopName }}</span> -->
            </div>
        </div>
        <!-- <div>
            <div>
                <span>审核人:</span>
                <span>{{ detail.checkUser }}</span>
            </div>
            <div>
                <span>审核时间:</span>
                <span>{{ detail.checkDate }}</span>
            </div>
        </div> -->
        <!-- <div>
            <div>
                <span>入库数量:</span>
                <span>{{ detail.inCount }}</span>
            </div>
            <div>
                <span>入库总金额:</span>
                <span>{{ detail.inTotalAmount }}</span>
            </div>
        </div> -->
        <div>
            <div>
                <span>制单人:</span>
                <span>{{ detail.createUserName}}</span>
            </div>
            <div>
                <span>制单时间:</span>
                <span>{{ detail.createDate}}</span>
            </div>
        </div>
        <div>
            <!-- <div>
                <span>质检人:</span>
                <el-input v-model="detail.qaUserName" placeholder="请输入质检人，多个请使用逗号隔开" v-if="showQaUser" />
                <span v-else>{{ detail.qaUserName}}</span>
            </div> -->
            <div>
                <span>质检时间:</span>
                <span>{{ detail.qaDate}}</span>
            </div>
            <div></div>
        </div>
        <!-- <div>
            <div>
                <span>质检人员:</span>
                <el-input v-if="type !==1 " v-model="detail.qaUserName" placeholder="请输入质检人员名称" />
                <span v-else>{{ detail.qaUserName }}</span>
            </div>
            <div>
                <span>质检时间:</span>
                <span>{{  detail.inspectionDate }}</span>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
    props: {
        detail: {
            type: Object,
            default: () => {}
        },
        type: {
            default: 1
        },
        state: {
            type: Number
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showQaUser() {
            return !this.type && this.state === 10
        }
    }
}
</script>
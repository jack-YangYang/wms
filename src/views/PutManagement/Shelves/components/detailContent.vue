<template>
    <div class="detail-content" id="content">
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
                <span>制单人:</span>
                <span>{{ detail.createUserName}}</span>
            </div>
                <!-- <span>入库店铺:</span>
                <span>{{ detail.shopName }}</span> -->
            <!-- </div> -->
        </div>
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
                <!-- <span>制单时间:</span>
                <span>{{ detail.createDate}}</span> -->
            </div>
        </div>
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
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<template>
    <div class="detail-content" id="content">
        <div>
            <div>
                <span>调出店铺:</span>
                <span>{{ detail.sourceShopName }}</span>
            </div>
            <div>
                <span>调入店铺:</span>
                <span>{{ detail.distShopName }}</span>
            </div>    
        </div>
        <div>
            <div>
                <span>调出仓库:</span>
                <span>{{ detail.sourceWhouseName }}</span>
            </div>
            <div>
                <span>调入仓库:</span>
                <span>{{ detail.distWhouseName }}</span>
            </div>
            
        </div>  
        <!-- <div>
            <div>
                <span>制单人:</span>
                <span>{{ createUserName }}</span>
            </div>
            <div>
                <span>审核人:</span>
                <span>{{  detail.checkUserName }}</span>
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
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
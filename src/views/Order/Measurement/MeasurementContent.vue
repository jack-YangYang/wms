<template>
    <main>
        <title-com fontSize="24px" />
        <el-form inline>
            <div style="display: flex; justify-content: space-between">
                <div>
                    <el-form-item>
                        <el-input
                            placeholder="请输入内容"
                            v-model.trim="search.searchWord"
                            clearable
                            ref="searchWord"
                        >
                            <template slot="prepend">
                                <el-select
                                    v-model="search.searchKey"
                                    placeholder="请选择"
                                    style="width: 120px"
                                >
                                    <el-option
                                        label="订单编号"
                                        value="order_id"
                                    />
                                    <el-option
                                        label="跟踪号"
                                        value="track_num"
                                    />
                                </el-select>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="重量:">
                        <el-input
                            v-model="weight"
                            placeholder="请输入重量"
                            ref="weight"
                        />
                    </el-form-item>
                </div>
                <div class="limit">
                    <el-form-item label="物流方式:">
                        <el-select
                            clearable
                            filterable
                            v-model="limit_value.mode_code"
                            @change="changeLogistics(limit_value, 1)"
                        >
                            <el-option
                                v-for="(item, key) in shipList"
                                :key="key"
                                :label="item.mode_name"
                                :value="item.mode_code"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流公司:">
                        <el-select
                            clearable
                            filterable
                            @change="changeLogistics(limit_value, 2)"
                            v-model="limit_value.provider_code"
                        >
                            <el-option
                                v-for="(item, key) in provideList"
                                :key="key"
                                :label="item.provider_name"
                                :value="item.provider_code"
                            />
                        </el-select>
                    </el-form-item>
                </div>
            </div>

            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    @click="
                        save({
                            weight,
                            nt_order_id: weightDetail.nt_order_id,
                            need_check: 0,
                        })
                    "
                    >确定</el-button
                >
            </el-form-item>
        </el-form>
        <title-com title="订单信息" />
        <order-info :data="weightDetail" />
        <title-com title="商品明细" />
        <table-data
            v-if="weightDetail.detail.length"
            :tableData="weightDetail.detail"
        />
        <no-data-content v-else />
    </main>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import floatNumber from '@/vendor/FloatNum'
console.log(floatNumber.subtract(1, 0))
// const { subtract, multiply, add } = floatNumber
import titleCom from '../components/title'
import NoDataContent from '@/components/NoDataImages'
import orderInfo from './components/orderInfo'
import tableData from './components/proTable'
import { voicePlay } from '@/utils/common'
import { getOrderCondition, saveOrderCondition } from '@/api/Order'
const demoData = {
    detail: [],
    logistics_mode: '',
    nt_order_id: '',
    shipping_fee: '',
    shop_name: '',
    track_num: '',
    weigh_status: '',
    weight: '',
}
import { debounce, message } from '@/utils/common'
export default {
    components: {
        titleCom,
        NoDataContent,
        orderInfo,
        tableData,
    },
    data() {
        return {
            limit_value: {
                provider_code: null,
                mode_code: null,
                way: null, // 物流方式名称
                company: null // 物流公司名称
            },
            timeout: null,
        }
    },
    computed: {
        ...mapState('Order', ['weightDetail', 'autofocus']),
        ...mapState({
            shipList: (state) => state.common.shipList,
            provideList: (state) => state.common.provideList,
        }),
        multipleValue() {
            return {
                weight: this.weight,
                searchWord: this.search.searchWord,
            }
        },
        search: {
            get() {
                return this.$store.state.Order.searchMeasurment
            },
            set(val) {
                this.$store.state.Order.searchMeasurment = val
            },
        },
        weight: {
            get() {
                return this.$store.state.Order.weightMeasurment
            },
            set(val) {
                this.$store.state.Order.weightMeasurment = val
            },
        },
    },
    watch: {
        search: {
            handler(val) {
                if (val.searchWord) {
                    this.weight = ''
                    let data = {
                        params: {
                            [val.searchKey]: val.searchWord,
                        },
                        _that: this,
                        type: 1,
                    }
                    debounce(() => {
                        this.getWeightDetail(data)
                    }, 1000)
                    return
                }
            },
            deep: true,
        },

        multipleValue: {
            handler({ weight, searchWord }) {
                //该监听函数会与 search监听函数同时出发 不能使用同一个防抖 所以使用了debounceOnce
                this.debounceOnce(() => {
                    if (
                        weight &&
                        searchWord &&
                        this.weightDetail.detail.length
                    ) {
                        const orderWeight = this.weightDetail.order_weight || 0
                        if (!orderWeight) {
                            voicePlay('测量失败,包裹重量不存在')
                            return
                        }
                        if (
                            (this.limit_value.mode_code &&
                                this.weightDetail.logistics_mode_code !=
                                    this.limit_value.mode_code) ||
                            (this.limit_value.provider_code &&
                                this.weightDetail.logistics_provider_code !=
                                    this.limit_value.provider_code)
                        ) {
                            voicePlay('测量失败')
                            message('error', '当前订单不符合订单限制因素')
                            return
                        }
                        const subtractWeight =
                            (weight * 1000 - orderWeight * 1000) / 1000
                        const multiplyWeight = (orderWeight * 3) / 10
                        if (subtractWeight > multiplyWeight) {
                            voicePlay('测量失败')
                            message('error', '重量不合格，请检查')
                            return
                        }

                        this.save({
                            weight,
                            nt_order_id: this.weightDetail.nt_order_id,
                        })
                    }
                }, 800)
            },
            deep: true,
        },
    },
    beforeDestroy() {
        this.GET_WEIGHTY_DETAIL({ data: demoData })
    },
    methods: {
        ...mapActions('Order', ['getWeightDetail', 'saveWeight']),
        ...mapActions(['getAllProvideList', 'getAllShipList']),
        save(data) {
            this.saveWeight({ data, _that: this })
        },
        async changeLogistics({ provider_code, mode_code }, type) {
            if (type === 1) {
                let way = this.shipList.find(ship => ship.mode_code === mode_code)
                this.limit_value.way = way ? way.mode_name : ''
            }
            if (type === 2) {
                let company = this.provideList.find(provide => provide.provider_code === provider_code)
                this.limit_value.company = company ? company.provider_name : ''
            }
            const { way, company} = this.limit_value
            const { code } = await saveOrderCondition({
                way,
                wayCode: mode_code,
                company,
                companyCode: provider_code
            })
            if (code === 0) {
                message('success', '存储成功')
            }
        },
        ...mapMutations('Order', ['GET_WEIGHTY_DETAIL']),
        debounceOnce(fn, wait) {
            if (this.timeout !== null) clearTimeout(this.timeout)
            this.timeout = setTimeout(fn, wait)
        },
    },
    async mounted() {
        this.$refs.searchWord.focus()
        await this.getAllShipList()
        await this.getAllProvideList()
        const { data: { company, companyCode, way, wayCode } } = await getOrderCondition()
        this.limit_value = {
            provider_code: companyCode,
            mode_code: wayCode,
            way,
            company
        }
    },
}
</script>
<style lang="scss" scoped>
main {
    Header {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        & > div {
            margin-right: 15px;
        }
    }
}
.limit::before {
    content: '订单限制因素:';
    display: inline-block;
    height: 16px;
    line-height: 16px;
    border-left: 2px solid red;
    padding-left: 5px;
    margin-right: 20px;
    margin-top: 8px;
    box-sizing: content-box;
    font-size: 12px;
    color: #606266;
    font-weight: bold;
}
</style>
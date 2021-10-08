import search from '@/views/FBA/components/search'
import LogModule from '@/views/FBA/components/log-module'
import tableContent from '@/views/FBA/components/table'
import changePage from '@/components/page'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    data() {
        return {
            show: true,
            ds_order_ids: [],
        }
    },
    computed: {
        ...mapState('FBA', ['showLogModule', 'logTableData'])
    },
    components: {
        search,
        LogModule,
        tableContent,
        changePage
    },
    beforeDestroy() {
        this.$store.commit('FBA/GET_LOG_DATA', [])
    },
    methods: {
        ...mapActions('FBA', [
            'getData', 
            'getLog',
            'handleAction',
        ]),
        ...mapMutations('FBA', ['CAHNGE_LOG_MODULE']),
        doReset() {
            for (let key in this.form) {
                if (key !== 'page_num' && key !== 'page_size' && key !== 'type') {
                    this.form[key] = ''
                }
            }
            this.form.operator_id = []
            this.form.merchant_id = []
            this.form.dept_id = []
        },
        doPackUp(show) {
            this.show = !show
        },
        selectionData(ds_order_ids) {
            this.ds_order_ids = ds_order_ids
        },
        changeSize(newsize) {
            this.form.page_size = newsize
            this.getList('arg')
        },
        changePage(newPage) {
            this.form.page_num = newPage
            this.getList()
        },
        getList(arg) {
            arg ? this.form.page_num = 1 : ''
            let params = JSON.parse(JSON.stringify(this.form))
            console.log(this.form.dept_id)
            params['dept_id'] = this.form.dept_id ? this.form.dept_id.join(',') : ''
            params['operator_id'] = this.form.dept_id ? this.form.operator_id.join(',') : ''
            params['merchant_id'] = this.form.dept_id ? this.form.merchant_id.join(',') : ''
            params['initiator_date_start'] = this.form.date ? this.form.date[0] : '',
            params['initiator_date_end'] = this.form.date ? this.form.date[1] : '',
            console.log(params)
            this.getData(params)
        }
    },
    mounted() {
        this.getList()
    }
}
/* 全局混入搜索 重置  翻页方法 */
import { clearSearch } from '@/utils/common.js'
import SearchBtnGroup from '@/components/SearchAction'
import NoDataContent from "@/components/NoDataImages";
import ChangePage from '@/components/page'
export const mixin = {
  components: {
    SearchBtnGroup,
    NoDataContent,
    ChangePage
  },
  methods: {
    /* 重置 */
    changePage(page) {
      this.search.pageNo = page
      this.getData()
    },
    changeSize(size) {
      
      if (this.tableData.length === this.total && (size > this.search.pageSize || size > this.total)) return
      this.search.pageSize = size
      this.getData('data')
    },
    doReset() {
      this.date = null
      this.searchWord = null
      clearSearch(this.search, ['pageNo', 'pageSize', 'type'])
    },
  }
}
export const orderMixin = {
  components: {
    SearchBtnGroup,
    NoDataContent,
    ChangePage
  },
  methods: {
    /* 重置 */
    changePage(page) {
      this.search.page_num = page
      this.getData()
    },
    changeSize(size) { 
      if (this.tableData.length === this.total && (size > this.search.page_size || size > this.total)) return
      this.search.page_size = size
      this.getData('data')
    },
    doReset() {
      clearSearch(this.search, ['page_num', 'page_size'])
      if (this.date) {
        this.date = ''
      }
    },
  }
}
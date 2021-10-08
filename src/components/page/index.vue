<template>
  <div class="change_page">
    <span :style="{marginLeft: left}">总共{{ total }}条记录 第{{ totalPages }}页</span>
    <el-pagination
      :current-page="page.page"
      :page-sizes="pageSizes"
      background
      :page-size="page.size"
      layout="sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: "ChangePage",
  props: {
    page: {
      type: Object,
      default: () => {},
    },
    left: {
      type: String,
      default: '0px'
    },
    total: {
      type: Number,
      default: () => 0,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
  },
  computed: {
    totalPages() {
      const pages = Math.ceil(this.total / this.page.size) || 1;
      return `${this.page.page}/${pages}`;
    },
  },
  methods: {
    handleSizeChange(nowsize) {
      this.$scrollTop();
      this.$emit("handleSizeChange", nowsize);
    },
    handleCurrentChange(nowpage) {
      this.$scrollTop();
      this.$emit("handleCurrentChange", nowpage);
    },
  },
};
</script>
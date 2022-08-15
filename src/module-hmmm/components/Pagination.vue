<template>
  <el-pagination
    class="pagination"
    background
    layout="prev, pager, next,sizes,jumper"
    :total="totals"
    :page-sizes="[5, 10, 20, 50]"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    v-if="isShow"
  >
  </el-pagination>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    totals: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 0,
    },
    pages: {
      type: Number,
      default: 0,
    },
    pagesize: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isShow() {
      if (this.page === 1 && this.totals <= this.pagesize) {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {},

  methods: {
    handleSizeChange(val) {
      this.$emit("update:pagesize", val);
    },
    handleCurrentChange(val) {
      this.$emit("update:page", val);
    },
  },
};
</script>

<style scoped lang="scss">
.pagination {
  float: right;
  margin: 20px 0;
  padding: 2px 5px;
}
</style>

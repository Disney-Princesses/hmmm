<template>
  <el-table
    ref="Table"
    :data="tableDate"
    highlight-current-row
    @current-change="handleCurrentChange"
    style="width: 100%"
    :header-cell-style="{ background: '#f3f6fb' }"
    empty-text="暂时没有数据了"
  >
    <!-- 序号列 -->
    <!-- <el-table-column type="index" :index="number" width="100" label="序号"> -->
    <!-- </el-table-column> -->
    <el-table-column
      :property="item.key"
      :label="item.label"
      v-for="(item, index) in TitleList"
      :key="index"
      :width="item.width"
    >
      <template slot-scope="scope">
        <div v-if="item.label === '题干'" v-html="scope.row.question"></div>
        <div v-else>{{ scope.row[item.key] }}</div>
        <!-- <div v-else v-html="formatter(scope.row,scope.column,scope.row[item.key])"></div> -->
        <!-- scope.row当前行的数据 -->
        <!-- scope.column当前列的数据 -->
        <!-- scope.row[item.key] ，对应这一行（对象）的【标题对应的属性值】-->
     
      </template>
    </el-table-column>

    <el-table-column label="操作" fixed="right" width="200px">
      <template slot-scope="scope">
        <!-- 自定义操作列的具名作用域插槽 -->
        <slot name="custom" :data="scope.row"></slot>
      </template>
      <slot> </slot>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    // 标头数数组
    TitleList: {
      type: Array,
      required: true,
    },
    tableDate: {
      type: Array,
      required: true,
    },
    // 当前页数
    pageIndex: {
      required: true,
    },
  },
  data() {
    return {
      currentRow: null,
    };
  },

  methods: {
    // 取消高亮
    setCurrent(row) {
      this.$refs.Table.setCurrentRow(row);
    },
    // 设置高亮
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 处理格式
    // formatter(row,column,cellValue) {

    // }
  },
  computed: {
    number() {
      return this.pageIndex * 10 - 9;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep.el-table--enable-row-transition .el-table__body td {
  border: 0;
}
::v-deep.el-table::before {
  height: 0 !important;
}
::v-deep.el-table th.is-leaf {
  border: 0 !important;
}
::v-deep .el-table__row .el-table_1_column_9 .cell {
  color: #000;
  cursor: pointer;
}
</style>

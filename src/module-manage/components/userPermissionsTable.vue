<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="200"> </el-table-column>
      <el-table-column label="用户名" prop="title"> </el-table-column>
      <el-table-column
        prop="create_date"
        label="日期"
        sortable
        :formatter="dataMatter"
      >
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            @click="revampFn(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            @click="removeFn(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-tool
      class="page-tool"
      :total="counts"
      :paginationPage="data.page"
      :paginationPagesize="data.pagesize"
      @pageChange="pageChange"
      @pageSizeChange="pageSizeChange"
    ></page-tool>
  </div>
</template>

<script>
import { list, remove } from "@/api/base/permissions";
import pageTool from "./page-tool.vue";
import dayjs from "dayjs";
export default {
  name: "Permissions",
  props: {
    keyWrods: {
      type: String,
    },
  },
  data() {
    return {
      tableData: [],
      data: { page: 1, pagesize: 10 },
      counts: 0,
    };
  },

  created() {
    this.getList();
  },

  methods: {
    // 获取数据
    async getList() {
      const res = await list({ ...this.data, title: this.keyWrods });
      this.tableData = res.data.list;
      this.counts = res.data.counts;
      this.$emit("getCounts", this.counts);
    },
    // 处理时间
    dataMatter(row) {
      return dayjs(row.create_date).format("YYYY-MM-DD");
    },
    // 进入某一页
    pageChange(pageNum) {
      this.data.page = pageNum;
      this.getList();
    },
    // 每页显示信息条数
    pageSizeChange(pageSize) {
      this.data.pagesize = pageSize;
      this.getList();
    },
    // 点击删除
    async removeFn(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.$message({
            type: "success",
            message: "成功删除了用户!",
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作!",
          });
        });
    },
    // 点击修改
    revampFn(row) {
      this.$emit("editFn", row.id);
    },
  },
  components: {
    pageTool,
  },
};
</script>

<style scoped lang="scss">
.el-button--medium {
  border-radius: 50%;
  padding: 10px !important;
}

.pages {
  display: flex;
  justify-content: flex-end;
}
::v-deep .cell {
  padding-left: 10px;
}
.page-tool {
  margin-top: 30px;
}
</style>

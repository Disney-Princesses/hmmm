<template>
  <el-table
    :data="tableData"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    default-expand-all
    :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
    :expand-on-click-node="false"
  >
    <el-table-column prop="title" label="标题" width="180">
      <template slot-scope="scope">
        <div @click="click(scope)" :class="scope.row.icon">
          <span> {{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="code" label="权限点代码"> </el-table-column>
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
</template>
<script>
import { list } from "@/api/base/menus";
export default {
  data() {
    return {
      tableData: [],
      hasChildren: false,
    };
  },

  created() {
    this.getList();
  },

  methods: {
    async getList() {
      const res = await list();
      console.log(res);
      res.data = JSON.parse(
        JSON.stringify(res.data).replace(/points/, "childs")
      );

      this.tableData = res.data;
      // res.data.forEach((item) => {
      //   console.log(item);
      //   if (item.childs) {
      //     item.forEach((child) => {
      //       console.log(child);
      //     });
      //   }
      // });
      this.ProcessData(this.tableData);
    },
    click(data) {
      console.log(data);
    },
    ProcessData(data) {
      data.forEach((item) => {
        if (item.is_point) {
          item.icon = "el-icon-view";
          return;
        }
        if (!item.childs) {
          item.icon = "el-icon-folder";
        }
        if (item.childs) {
          item.childs.forEach((child) => {
            if (child.is_point) {
              item.icon = "el-icon-folder";
              return;
            } else {
              item.icon = "el-icon-folder-opened";
            }
          });
          this.ProcessData(item.childs);
        }
      });
      console.log(data);
    },
  },
};
</script>

<style scoped lang="scss">
.el-button--medium {
  border-radius: 50%;
  padding: 10px !important;
}
::v-deep .el-table__row {
  .el-table__expand-icon--expanded {
    visibility: hidden;
  }
  // .el-table__indent {
  //   display: inline-block;
  //   width: 36px;
  // }
}
.el-table {
  margin-top: 20px;
}
</style>

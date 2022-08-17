<template>
  <div>
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
          <div :class="scope.row.icon">
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
    <!-- 弹框 -->
    <menusAdd
      v-if="dialogFormVisible"
      :dialogFormVisible.sync="dialogFormVisible"
      :text="text"
      @upDataes="getList"
      ref="menusAdd"
    />
  </div>
</template>
<script>
import { list, remove } from "@/api/base/menus";
import menusAdd from "./menu-add.vue";
export default {
  data() {
    return {
      tableData: [],
      hasChildren: false,
      dialogFormVisible: false,
      text: "创建菜单",
    };
  },

  created() {
    this.getList();
  },

  methods: {
    async getList() {
      const res = await list();
      res.data = JSON.parse(
        JSON.stringify(res.data).replace(/points/gi, "childs")
      );

      this.tableData = res.data;
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
          try {
            item.childs.forEach((child) => {
              if (child.is_point) {
                item.icon = "el-icon-folder";
                return;
              } else {
                item.icon = "el-icon-folder-opened";
                throw new Error();
              }
            });
          } catch (error) {
            // console.log(error);
          }
          this.ProcessData(item.childs);
        }
      });
      // console.log(this.tableData);
      // console.log(JSON.stringify(this.tableData).replace(/points/gi, "childs"));
    },
    removeFn(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.getList();
          this.$message({
            type: "success",
            message: "成功删除了用户！!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作！",
          });
        });
    },
    revampFn(row) {
      this.text = "修改菜单";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.menusAdd.hanldeEditForm(row.id, row.is_point);
      });
    },
  },
  components: {
    menusAdd,
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
    // visibility: hidden;
    display: none;
  }
  // .el-table__indent {
  //   display: inline-block;
  //   width: 36px;
  // }
  .el-table__placeholder {
    display: none;
  }
}
.el-table {
  margin-top: 20px;
}
</style>

<template>
  <el-card class="box-card">
    <!-- 头部搜索部分 -->
    <el-row :span="24">
      <el-col :span="22">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="keyWrods"
              placeholder="根据用户名搜索"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onClear" class="clearBtn"
              >清除</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="submitBtn"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button
          type="success"
          icon="el-icon-edit"
          class="addpermissBtn"
          @click="dialogFormVisible = true"
        >
          新增权限组
        </el-button>
      </el-col>
    </el-row>
    <!-- 警告 -->
    <el-alert
      :title="`共条${counts}记录`"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 列表部分 -->
    <userPermissionsTable
      @getCounts="getCounts"
      :keyWrods="keyWrods"
      ref="userPermissionsTable"
      @editFn="editFn"
    >
    </userPermissionsTable>
    <!-- 弹框 -->
    <permissionsAdd
      :dialogFormVisible.sync="dialogFormVisible"
      text="添加"
      :ruleInline="ruleInline"
      @newDataes="onSubmit"
      ref="permissionsAdd"
    />
  </el-card>
</template>

<script>
import permissionsAdd from "../components/permissions-add.vue";
import userPermissionsTable from "../components/userPermissionsTable.vue";
export default {
  data() {
    return {
      keyWrods: "",
      dialogFormVisible: false,
      ruleInline: {
        title: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
      },
      counts: 0,
    };
  },
  methods: {
    onSubmit() {
      this.$nextTick(() => {
        this.$refs.userPermissionsTable.data.page = "";
        this.$refs.userPermissionsTable.getList();
      });
    },
    // 清空
    onClear() {
      this.keyWrods = "";
    },
    // 获取总条数
    getCounts(counts) {
      this.counts = counts;
    },
    // 点击修改
    editFn(id) {
      this.dialogFormVisible = true;
      this.$refs.permissionsAdd.hanldeEditForm(id);
    },
  },

  created() {},

  components: {
    permissionsAdd,
    userPermissionsTable,
  },
};
</script>

<style scoped lang="scss">
.box-card {
  margin: 20px;
  ::v-deep .demo-form-inline {
    .el-input__inner {
      height: 32px;
    }
    .clearBtn {
      padding: 9px 15px;
      width: 56px;
      height: 32px;
      font-size: 12px;
      background-color: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
    }
    .submitBtn {
      padding: 9px 15px;
      width: 56px;
      height: 32px;
      font-size: 12px;
    }
    .el-input__inner {
      height: 32px !important;
    }
    .el-form-item__content {
      line-height: 30px !important;
    }
  }
  .el-col-2 {
    display: flex;
    justify-content: flex-end;
    .addpermissBtn {
      padding: 9px 13px;
      height: 32px;
    }
  }
}
</style>

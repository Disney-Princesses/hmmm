<template>
  <div>
    <el-card class="box-card">
      <div class="headerSearch">
        <el-button type="success" size="small" @click="addUser">
          <i class="el-icon-edit"></i>
          <span>新增用户</span>
        </el-button>
        <el-form ref="form" :model="form" :inline="true" size="small">
          <el-form-item>
            <el-input
              v-model="form.username"
              placeholder="根据用户名搜索"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="clearSearch"
              >清空</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchByName">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-alert type="info" show-icon :closable="false">
        <template #title> 共{{ total }}条记录 </template>
      </el-alert>
      <div class="userTable">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="序号"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="phone" label="联系电话"> </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="permission_group_title" label="权限组名称">
          </el-table-column>
          <el-table-column prop="role" label="角色"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editUserInfo(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next,sizes, jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
    <UserAdd
      :formBase="formBase"
      text="编辑用户"
      pageTitle=""
      ref="UserDetial"
      :ruleInline="rules"
      :PermissionGroupsList="permissionList"
      @handleCloseModal="handleCloseModal"
      @newDataes="newDataes"
    ></UserAdd>
  </div>
</template>

<script>
import {
  list as getUserListApi,
  detail as getUserDetailApi,
} from "@/api/base/users.js";
import { simple as getPermissionListApi } from "@/api/base/permissions.js";
import UserAdd from "../components/user-add.vue";
export default {
  data() {
    return {
      form: {
        username: "",
        page: 1,
        pagesize: 10,
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      formBase: {},
      permissionList: [],
    };
  },
  components: {
    UserAdd,
  },
  created() {
    this.getUserList();
  },

  methods: {
    handleSizeChange(val) {
      this.form.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getUserList();
    },
    async getUserList() {
      const { data } = await getUserListApi(this.form);
      this.total = data.counts;
      this.tableData = data.list;
    },
    searchByName() {
      this.getUserList();
    },
    clearSearch() {
      this.form.username = "";
      this.getUserList();
    },
    // 编辑用户信息
    editUserInfo(val) {
      this.$refs.UserDetial.dialogFormV();
      this.getUserDetail(val);
      this.getPermissionList();
    },
    // 根据用户id获取用户详情信息
    async getUserDetail(id) {
      const { data } = await getUserDetailApi(id);
      this.formBase = data;
    },
    // 获取权限名称列表
    async getPermissionList() {
      const { data } = await getPermissionListApi();
      this.permissionList = data;
    },
    // 取消对话框
    handleCloseModal() {
      this.$refs.UserDetial.dialogFormH();
    },
    // 获取新数据
    newDataes(data) {
      // console.log(data);
      // data = {};
      this.getUserList();
    },
    // 新增用户
    addUser() {
      this.formBase = { password: "", avatar: "" };
      this.getPermissionList();
      this.$refs.UserDetial.dialogFormV();
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  margin: 20px;
}
.headerSearch {
  button {
    width: 56px;
  }
  .el-button--success {
    width: 97px;
    float: right;
    span {
      margin-left: 5px;
    }
  }
}
.userTable {
  ::v-deep .el-table th.el-table__cell {
    text-align: center;
  }
  ::v-deep .el-table--medium .el-table__cell {
    text-align: center;
  }
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

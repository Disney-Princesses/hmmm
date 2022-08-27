<template>
  <div class="container">
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="12">
          <div class="demo-input-suffix">
            <span>学科名称</span>
            <el-input v-model="subjectName" class="input"> </el-input>
            <el-button size="mini" @click="subjectName = ''"> 清除</el-button>
            <el-button type="primary" size="mini" @click="searchClick"
              >搜索</el-button
            >
          </div>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="end">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="small"
              @click="dialogVisible = true"
              >新增学科</el-button
            >
          </el-row>
        </el-col>
      </el-row>

      <!-- 条数提示 -->
      <el-alert :closable="false" class="alert">
        <slot>
          <i class="el-icon-info"></i>
          数据一共{{ objData.counts }}条（关水珠）</slot
        >
      </el-alert>

      <!-- 表格 -->
      <el-table
        ref="Table"
        :data="tableDate"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
        :header-cell-style="{ background: '#f3f6fb' }"
        empty-text="暂时没有数据了"
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column
          :property="item.key"
          :label="item.label"
          v-for="(item, index) in TitleList"
          :key="index"
          :width="item.width"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <!-- 自定义操作列的具名作用域插槽 -->
            <el-button class="btn" @click="classClick(scope)"
              >学科分类</el-button
            >
            <el-button class="btn" @click="tagClick(scope)">学科标签</el-button>
            <el-button class="btn" @click="editClick(scope)">修改</el-button>
            <el-button class="btn" @click="delClick(scope)">删除</el-button>
          </template>
          <slot> </slot>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <gszPageTools
        @pageChange="onPageChange"
        @pageSizeChange="onPageSizeChange"
        :total="objData.counts"
        :paginationPage="page"
        :paginationPagesize="pagesize"
        :pageSizes="pageSizes"
      ></gszPageTools>
    </el-card>

    <!-- 弹框 -->
    <el-dialog
      title="新增学科"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="onClose"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rulesForm">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input
            v-model="form.subjectName"
            placeholder="请输入学科名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="form.isFrontDisplay"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入api
import {
  list as subjectListApi,
  add as addSubjectApi,
  update as updateSubjectApi,
  remove as removeSubjectApi,
} from "@/api/hmmm/subjects";
import gszPageTools from "../components/gsz-pageTools";

import dayjs from "dayjs";
export default {
  data() {
    return {
      form: {
        subjectName: "",
        isFrontDisplay: true,
      },
      dialogVisible: false,
      page: 1,
      pagesize: 10,
      pageSizes: [5, 10, 20, 50],
      subjectName: "",
      TitleList: [
        { label: "学科名称", key: "subjectName", width: "150px" },
        { label: "创建者", key: "username" },
        { label: "创建日期", key: "addTime", width: "200px" },
        { label: "前台是否显示", key: "isFrontDisplay" },
        { label: "二级目录", key: "twoLevelDirectory" },
        { label: "标签", key: "tags" },
        { label: "题目数量", key: "totals" },
      ],
      tableDate: [],
      objData: {},

      rulesForm: {
        subjectName: [
          { required: true, message: "请输入学科名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getsubjectListApi();
  },
  methods: {
    // 获取数据列表
    async getsubjectListApi() {
      const res = await subjectListApi({
        page: this.page,
        pagesize: this.pagesize,
        subjectName: this.subjectName,
      });
      // //console.log(res);
      this.tableDate = res.data.items;
      this.objData = res.data;
    },
    // 搜索按钮
    searchClick() {
      this.getsubjectListApi();
    },
    // 设置数据格式
    formatter(row, column, cellValue, index) {
      if (column.label === "前台是否显示") {
        return cellValue ? "是" : "否";
      }
      if (column.label == "创建日期") {
        return dayjs(row.addTime).format("YYYY-MM-DD HH:mm:ss");
      }
      return cellValue;
    },
    // 取消高亮
    setCurrent(row) {
      this.$refs.Table.setCurrentRow(row);
    },
    // 设置高亮
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 分页
    //进入某一页
    async onPageChange(val) {
      this.page = val;
      await this.getsubjectListApi();
    },
    // 每页显示信息条数
    async onPageSizeChange(val) {
      this.pagesize = val;
      await this.getsubjectListApi();
    },
    // 修改按钮
    editClick(scope) {
      this.dialogVisible = true;
      this.form = scope.row;
      this.form.isFrontDisplay = scope.row.isFrontDisplay == 1 ? true : false;
    },
    // 添加学科
    async addSubject() {
      await this.$refs.form.validate();

      try {
        if (this.form.id) {
          const obj = {
            true: 1,
            false: 0,
          };

          await updateSubjectApi({
            subjectName: this.form.subjectName,
            isFrontDisplay: obj[this.form.isFrontDisplay],
            id: this.form.id,
          });
          this.$message.success("修改成功");
          this.onClose();
        } else {
          // this.form.isFrontDisplay = this.form.isFrontDisplay ? 1 : 0;
          await addSubjectApi(this.form);
          this.$message.success("添加成功");
          this.onClose();
        }
      } catch (error) {}
    },
    // 关闭弹窗
    onClose() {
      this.dialogVisible = false;
      this.form = {
        subjectName: "",
        isFrontDisplay: true,
      };
      // this.$refs.form.resetFields();
    },
    async delClick(scope) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await removeSubjectApi(scope.row);
          this.getsubjectListApi();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转学科目录
    classClick(scope) {
      // //console.log(scope);
      this.$router.push({
        path: "/subjects/directorys",
        query: {
          id: scope.row.id,
          name: scope.row.subjectName,
        },
      });
    },
    tagClick(scope) {
      this.$router.push({
        path: "/subjects/tags",
        query: {
          id: scope.row.id,
          name: scope.row.subjectName,
        },
      });
    },
  },
  components: {
    gszPageTools,
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  .demo-input-suffix {
    display: flex;
    align-items: center;
    span {
      width: 80px;
    }
    .input {
      width: 154px;
      margin-right: 20px;
    }
  }
  .alert {
    margin-bottom: 15px;
    margin-top: 15px;
    font-size: 12px;
    .el-icon-info {
      font-size: 16px;
      margin-right: 5px;
    }
  }

  .btn {
    border: none;
    font-size: 12px;
    color: #409eff;
    padding: 0;
  }
}
</style>

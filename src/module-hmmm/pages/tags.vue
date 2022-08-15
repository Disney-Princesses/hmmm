<template>
  <el-card class="box-card">
    <!-- 头部搜索 -->
    <CommonHeader
      firstLabel="标签名称"
      @search="searchFn"
      @addEvent="dialogVisible = true"
    ></CommonHeader>
    <!-- 总消息条数提示 -->
    <TotalCount :totalCount="counts"></TotalCount>
    <!-- 表格部分 -->
    <el-table :data="tagsData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
      <el-table-column prop="tagName" label="标签名称"> </el-table-column>
      <el-table-column prop="username" label="创建者"> </el-table-column>
      <el-table-column prop="addDate" label="创建日期" :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          {{ row.state === 0 ? "已禁用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text">{{
            row.state === 0 ? "启用" : "禁用"
          }}</el-button>
          <el-button type="text" :disabled="row.state === 1">修改</el-button>
          <el-button type="text" :disabled="row.state === 1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <Pagination
      :totals="counts"
      :page.sync="page"
      :pages="pages"
      :pagesize.sync="pagesize"
    ></Pagination>

    <!-- 弹出框 -->
    <SubjectDialog
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      addLabel="标签名称"
      placeholder="请输入标签名称"
      @onSave="saveFn"
    ></SubjectDialog>
  </el-card>
</template>

<script>
import CommonHeader from "@/module-hmmm/components/CommonHeader";
import TotalCount from "@/module-hmmm/components/TotalCount";
import Pagination from "@/module-hmmm/components/Pagination";
import SubjectDialog from "@/module-hmmm/components/SubjectDialog";
import { list, add } from "@/api/hmmm/tags";
import dayjs from "dayjs";
export default {
  data() {
    return {
      tagsData: [],
      counts: 0,
      page: 1,
      pages: 0,
      pagesize: 10,
      dialogVisible: false,
    };
  },
  components: {
    CommonHeader,
    TotalCount,
    Pagination,
    SubjectDialog
  },
  created() {
    this.getTags();
  },
  // 监测当前页数和页面大小的变化
  watch: {
    page() {
      this.getTags();
    },
    pagesize() {
      this.getTags();
    },
  },
  methods: {
    // 获取学科目录数据
    async getTags() {
      const { data } = await list({ page: this.page, pagesize: this.pagesize });
      // console.log(data);
      this.tagsData = data.items;
      this.counts = data.counts;
    },
    dateFormat(row, column) {
      let date = row[column.property];
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 搜索
    async searchFn(val) {
      console.log(val);
      if (val.state === "") {
        const { data } = await list({
          tagName: val.name,
          page: 1,
          pagesize: 10,
        });
        this.tagsData = data.items;
        this.counts = data.counts;
        return;
      } else if (val.name === "" && val.state === "") {
        return this.getDirectorys();
      }
      const { data } = await list({
        tagName: val.name,
        state: val.state,
        page: 1,
        pagesize: 10,
      });
      this.tagsData = data.items;
      this.counts = data.counts;
    },
    // 确认新增
    async saveFn(val) {
      await add(val.subjectId, val.name);
      this.$message.success("添加成功");
      this.getTags();
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  margin: 10px;
}
</style>

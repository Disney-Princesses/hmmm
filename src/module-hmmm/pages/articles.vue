<template>
  <el-card class="box-card">
    <!-- 头部搜索 -->
    <CommonHeader
      firstLabel="关键字"
      placeholder="根据文章标题搜索"
      @search="searchFn"
    ></CommonHeader>
    <!-- 总消息条数提示 -->
    <TotalCount :totalCount="counts"></TotalCount>
    <!-- 表格部分 -->
    <el-table :data="articleData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="title" label="文章标题"> </el-table-column>
      <el-table-column prop="visits" label="阅读数"> </el-table-column>
      <el-table-column prop="username" label="录入人"> </el-table-column>
      <el-table-column
        prop="createdTime"
        label="录入时间"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          {{ row.state === 0 ? "已禁用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text">预览</el-button>
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
  </el-card>
</template>

<script>
import CommonHeader from "@/module-hmmm/components/CommonHeader";
import TotalCount from "@/module-hmmm/components/TotalCount";
import Pagination from "@/module-hmmm/components/Pagination";
import { list } from "@/api/hmmm/articles";
import dayjs from "dayjs";
export default {
  data() {
    return {
      articleData: [],
      counts: 0,
      page: 1,
      pages: 0,
      pagesize: 10,
    };
  },
  components: {
    CommonHeader,
    TotalCount,
    Pagination,
  },
  created() {
    this.getArticles();
  },
  // 监测当前页数和页面大小的变化
  watch: {
    page() {
      this.getArticles();
    },
    pagesize() {
      this.getArticles();
    },
  },
  methods: {
    // 获取学科目录数据
    async getArticles() {
      const { data } = await list({ page: this.page, pagesize: this.pagesize });
      console.log(data);
      this.articleData = data.items;
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
          keyword: val.name,
          page: 1,
          pagesize: 10,
        });
        this.articleData = data.items;
        this.counts = data.counts;
        return;
      } else if (val.name === "" && val.state === "") {
        return this.getDirectorys();
      }
      const { data } = await list({
        keyword: val.name,
        state: val.state,
        page: 1,
        pagesize: 10,
      });
      this.articleData = data.items;
      this.counts = data.counts;
    }
  },
};
</script>

<style scoped lang="less">
.box-card {
  margin: 10px;
}
</style>

<template>
  <el-card class="box-card">
    <!-- 头部搜索 -->
    <CommonHeader
      @search="searchFn"
      @addEvent="addFn"
      ref="head"
    ></CommonHeader>
    <!-- 总消息条数提示 -->
    <TotalCount :totalCount="counts"></TotalCount>
    <!-- 表格部分 -->
    <el-table :data="directoryData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
      <el-table-column prop="directoryName" label="目录名称"> </el-table-column>
      <el-table-column prop="username" label="创建者"> </el-table-column>
      <el-table-column prop="addDate" label="创建日期" :formatter="dateFormat">
      </el-table-column>
      <el-table-column prop="totals" label="面试题数量"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          {{ row.state === 0 ? "已禁用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="changeState(row)">{{
            row.state === 0 ? "启用" : "禁用"
          }}</el-button>
          <el-button
            type="text"
            :disabled="row.state === 1"
            @click="changeDirectory(row)"
            >修改</el-button
          >
          <el-button
            type="text"
            :disabled="row.state === 1"
            @click="deleteFn(row)"
            >删除</el-button
          >
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
    <DirectoryDialog
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :tochange="toChangeData"
    ></DirectoryDialog>
  </el-card>
</template>

<script>
import CommonHeader from "@/module-hmmm/components/CommonHeader";
import TotalCount from "@/module-hmmm/components/TotalCount";
import Pagination from "@/module-hmmm/components/Pagination";
import DirectoryDialog from "@/module-hmmm/components/DirectoryDialog";
import { list, changeState, remove } from "@/api/hmmm/directorys";
import dayjs from "dayjs";
export default {
  data() {
    return {
      directoryData: [],
      counts: 0,
      page: 1,
      pages: 0,
      pagesize: 10,
      dialogVisible: false,
      toChangeData: {},
    };
  },
  components: {
    CommonHeader,
    TotalCount,
    Pagination,
    DirectoryDialog,
  },
  created() {
    this.$nextTick(() => {
      // 判断是否有传参
      if (this.$route.query.id) {
        //有传参，从学科跳转过来的
        this.$refs.head.isFromSubject = true;
        this.fromSubject();
      } else {
        this.getDirectorys();
      }
    });
  },
  // 监测当前页数和页面大小的变化
  watch: {
    page(newval) {
      this.getDirectorys();
    },
    pagesize() {
      this.getDirectorys();
    },
  },
  methods: {
    // 获取学科目录数据
    async getDirectorys() {
      const { data } = await list({ page: this.page, pagesize: this.pagesize });
      this.directoryData = data.items;
      this.counts = data.counts;
    },
    // 时间数据格式化
    dateFormat(row, column) {
      let date = row[column.property];
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 搜索
    async searchFn(val) {
      console.log(val);
      if (val.state === "") {
        const { data } = await list({
          directoryName: val.name,
          page: this.page,
          pagesize: this.pagesize,
        });
        this.directoryData = data.items;
        this.counts = data.counts;
        return;
      } else if (val.name === "" && val.state === "") {
        return this.getDirectorys();
      }
      const { data } = await list({
        directoryName: val.name,
        state: val.state,
        page: this.page,
        pagesize: this.pagesize,
      });
      this.directoryData = data.items;
      this.counts = data.counts;
    },
    // 状态修改
    async changeState(row) {
      console.log(row);
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("目录状态修改成功");
    },
    // 目录修改
    async changeDirectory(row) {
      this.toChangeData = row;
      this.dialogVisible = true;
    },
    addFn() {
      this.dialogVisible = true;
      this.toChangeData = {};
    },
    // 删除
    async deleteFn(row) {
      await remove(row);
      this.$message.success("删除成功");
      this.getDirectorys();
    },
    // 由学科页面跳转
    async fromSubject() {
      const subjectID = this.$route.query.id;
      const { data } = await list({
        subjectID,
        page: this.page,
        pagesize: this.pagesize,
      });
      this.directoryData = data.items;
      this.counts = data.counts;
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  margin: 10px;
}
</style>

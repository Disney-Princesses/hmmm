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
          <el-button type="text" @click="changeState(row)">{{
            row.state === 0 ? "启用" : "禁用"
          }}</el-button>
          <el-button
            type="text"
            :disabled="row.state === 1"
            @click="changeTags(row)"
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
    <TagsDialog
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :tochange="toChangeData"
    ></TagsDialog>
  </el-card>
</template>

<script>
import CommonHeader from "@/module-hmmm/components/CommonHeader";
import TotalCount from "@/module-hmmm/components/TotalCount";
import Pagination from "@/module-hmmm/components/Pagination";
import TagsDialog from "@/module-hmmm/components/TagsDialog";
import { list, changeState, remove } from "@/api/hmmm/tags";
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
      toChangeData: {},
    };
  },
  components: {
    CommonHeader,
    TotalCount,
    Pagination,
    TagsDialog,
  },
  created() {
    this.$nextTick(() => {
      // 判断是否有传参
      if (this.$route.query.id) {
        //有传参，从学科跳转过来的
        this.$refs.head.isFromSubject = true;
        this.fromSubject();
      } else {
        this.getTags();
      }
    });
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
      this.tagsData = data.items;
      this.counts = data.counts;
    },
    dateFormat(row, column) {
      let date = row[column.property];
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 搜索
    async searchFn(val) {
      //console.log(val);
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
    // 状态修改
    async changeState(row) {
      //console.log(row);
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("标签状态修改成功");
    },
    // 标签修改
    async changeTags(row) {
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
      this.getTags();
    },
    // 由学科页面跳转
    async fromSubject() {
      const subjectID = this.$route.query.id;
      const { data } = await list({
        subjectID,
        page: this.page,
        pagesize: this.pagesize,
      });
      this.tagsData = data.items;
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

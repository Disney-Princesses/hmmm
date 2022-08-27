<template>
  <div>
    <el-card class="box-card">
      <!-- 头部搜索 -->
      <CommonHeader
        firstLabel="关键字"
        placeholder="根据文章标题搜索"
        @search="searchFn"
        @addEvent="addFn"
      ></CommonHeader>
      <!-- 总消息条数提示 -->
      <TotalCount :totalCount="counts"></TotalCount>
      <!-- 表格部分 -->
      <el-table :data="articleData" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="title" label="文章标题" width="350">
          <template slot-scope="{ row }">
            {{ row.title }}
            <span v-show="row.videoURL ? true : false"
              ><i class="el-icon-film" @click="showVideo(row.videoURL)"></i
            ></span>
          </template>
        </el-table-column>
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
            <el-button type="text" @click="previewFn(row)">预览</el-button>
            <!-- 预览弹窗组件 -->
            <PreviewDialog
              v-if="previewDialog"
              :previewDialog.sync="previewDialog"
              :currentRow="currentRow"
            ></PreviewDialog>
            <el-button type="text" @click="changeState(row)">{{
              row.state === 0 ? "启用" : "禁用"
            }}</el-button>
            <el-button
              type="text"
              :disabled="row.state === 1"
              @click="changeArticles(row)"
              >修改</el-button
            >
            <el-button
              type="text"
              :disabled="row.state === 1"
              @click="toDeleteFn(row)"
              >删除
            </el-button>
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

      <!-- 新增，修改 弹窗 -->
      <ArticleDialog
        v-if="dialogVisible"
        :dialogVisible.sync="dialogVisible"
        :tochange="toChangeData"
      ></ArticleDialog>
    </el-card>
    <!-- 视频遮罩层 -->
    <div class="mask" id="mask">
      <div class="video-close" @click="closeMask">
        <i class="el-icon-close"></i>
      </div>
      <div class="video-play">
        <video
          :src="videoUrl"
          controls="controls"
          autoplay
          width="100%"
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from "@/module-hmmm/components/CommonHeader";
import TotalCount from "@/module-hmmm/components/TotalCount";
import Pagination from "@/module-hmmm/components/Pagination";
import ArticleDialog from "@/module-hmmm/components/ArticleDialog";
import PreviewDialog from "@/module-hmmm/components/PreviewDialog";
import { list, changeState, remove } from "@/api/hmmm/articles";
import dayjs from "dayjs";
export default {
  data() {
    return {
      articleData: [],
      counts: 0,
      page: 1,
      pages: 0,
      pagesize: 10,
      dialogVisible: false,
      delDialogVisible: false,
      toChangeData: {},
      previewDialog: false,
      currentRow: {},
      videoUrl: "",
      // 测试地址：http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
    };
  },
  components: {
    CommonHeader,
    TotalCount,
    Pagination,
    ArticleDialog,
    PreviewDialog,
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
    // 获取文章列表数据
    async getArticles() {
      const { data } = await list({ page: this.page, pagesize: this.pagesize });
      // console.log(data);
      this.articleData = data.items;
      this.counts = data.counts;
    },
    // 时间格式化
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
    },
    // 状态修改
    async changeState(row) {
      // console.log(row);
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("目录状态修改成功");
    },
    // 点击确认，删除
    toDeleteFn(row) {
      // 删除提示框
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(row);
          console.log(row);
          this.$message.success("删除成功");
          this.delDialogVisible = false;
          this.getArticles();
        })
        .catch(() => {});
    },
    // 文章修改
    async changeArticles(row) {
      this.toChangeData = row;
      this.dialogVisible = true;
    },
    // 点击新增时的事件
    addFn() {
      this.dialogVisible = true;
      this.toChangeData = {};
    },
    // 点击图标显示视频
    showVideo(video) {
      console.log(video);
      const mask = document.getElementById("mask");
      mask.style.display = "block";
      this.videoUrl = video;
    },
    closeMask() {
      const mask = document.getElementById("mask");
      mask.style.display = "none";
    },
    // 点击预览
    previewFn(row) {
      // console.log(row);
      // const { data } = await detail(row);
      this.previewDialog = true;
      this.currentRow = row;
    },
  },
};
</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;
}
.el-icon-film {
  color: #1700f5;
  cursor: pointer;
}
::v-deep .el-icon-film:before {
  width: 18px;
  height: 18px;
}
// 遮罩层样式
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  overflow: hidden;
  display: none;
  .video-close {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%);
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #fff;
  }
  .video-play {
    width: 800px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // background-color: #fff;
  }
}
</style>

<template>
  <div class="container">
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="12">
          <div class="demo-input-suffix">
            <span>关键字</span>
            <el-input placeholder="根据编号搜索" v-model="input" class="input">
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="end">
            <el-button size="mini" @click="input = ''"> 清除</el-button>
            <el-button type="primary" size="mini" @click="searchClick"
              >搜索</el-button
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
        <el-table-column
          :property="item.key"
          :label="item.label"
          v-for="(item, index) in TitleList"
          :key="index"
          :width="item.width"
          :formatter="formatter"
        >
          <template slot-scope="scope">
            <div v-if="item.label == `题目编号`">
              <p
                v-for="(item, index) in scope.row.questionIDs"
                :key="index"
                class="questionIDs"
                @click="showDialog(item)"
              >
                {{ item.number }}
              </p>
            </div>
            <div v-else>{{ scope.row[item.key] }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <!-- 自定义操作列的具名作用域插槽 -->
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="delClick(scope)"
            ></el-button>
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

    <!-- 弹窗 -->
    <gszQuestionsPpreview
      :pvwVisible.sync="ispvwVisible"
      :detailInfo="detailInfo"
      v-if="ispvwVisible"
    ></gszQuestionsPpreview>
  </div>
</template>

<script>
// 引入api
import {
  randoms as randomsListApi,
  removeRandoms as removeRandomsApi,
  detail as detailApi,
} from "@/api/hmmm/questions";
// 引入组件
import gszPageTools from "../components/gsz-pageTools";
import gszQuestionsPpreview from "../components/gsz-questions-preview.vue";
import { questionType } from "@/api/hmmm/constants";
import dayjs from "dayjs";
export default {
  data() {
    return {
      input: "",
      TitleList: [
        { label: "编号", key: "id", width: "150px" },
        { label: "题型", key: "questionType" },
        { label: "题目编号", key: "questionIDs", width: "200px" },
        { label: "录入时间", key: "addTime" },
        { label: "答题时间", key: "totalSeconds" },
        { label: "正确率(%)", key: "accuracyRate" },
        { label: "录入人", key: "userName" },
      ],
      tableDate: [],
      objData: {},
      // 分页
      page: 1,
      pagesize: 20,
      pageSizes: [20, 50, 100, 200],
      // 详情弹窗
      ispvwVisible: false,
      detailInfo: {},
    };
  },
  methods: {
    // 取消高亮
    setCurrent(row) {
      this.$refs.Table.setCurrentRow(row);
    },
    // 设置高亮
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 获取题组列表
    async getRandomsListApi() {
      const res = await randomsListApi({
        page: this.page,
        pagesize: this.pagesize,
        keyword: this.input,
      });

      // console.log(res.data.items);
      this.objData = res.data;
      this.tableDate = res.data.items;
    },
    // 删除
    async delClick(scope) {
      // console.log(scope.row);
      await removeRandomsApi(scope.row);
      this.$message.success("删除成功");
      this.getRandomsListApi();
    },
    // 设置数据格式
    formatter(row, column, cellValue, index) {
      // console.log( cellValue);
      if (column.label === "题型") {
        // console.log(column);

        const findItem = questionType.find((item) => item.value == cellValue);
        return findItem.label;
      }
      if (column.label == "录入时间") {
        // console.log( row);

        return dayjs(row.addTime).format("YYYY-MM-DD HH:mm:ss");
      }
      return cellValue;
    },
    // 点击显示弹框
    async showDialog(item) {
      const res = await detailApi(item);
      this.detailInfo = res.data;
      console.log(res);
      this.ispvwVisible = true;
    },
    // 分页
    //进入某一页
    async onPageChange(val) {
      this.page = val;
      await this.getRandomsListApi();
    },
    // 每页显示信息条数
    async onPageSizeChange(val) {
      this.pagesize = val;
      await this.getRandomsListApi();
    },
    // 搜索按钮
    searchClick() {
      if (this.input.trim() == "") {
        return this.$message.success("请输入内容");
      }
      this.getRandomsListApi();
    },
  },
  created() {
    this.getRandomsListApi();
    console.log();
  },
  components: {
    gszPageTools,
    gszQuestionsPpreview,
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
  .questionIDs {
    color: #00b5ff;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
}
</style>

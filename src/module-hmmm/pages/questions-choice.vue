<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 说明部分 -->
      <el-row>
        <el-col :span="12">
          <span class="tips">说明：目前支持学科和关键字条件筛选(关水珠)</span>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="end">
            <el-button type="success" icon="el-icon-edit" size="small" @click="$router.push('/questions/new')"
              >新增试题</el-button
            >
          </el-row>
        </el-col>
      </el-row>
      <!-- 搜索表单 -->
      <el-form ref="form" :model="form" label-width="80px" class="inpForm">
        <!-- 一 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select
                v-model="form.subjectID"
                placeholder="请选择"
                @change="selectSubject"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in subjectList"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select v-model="form.catalogID" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in subjectSList"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="form.tags" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in labelList"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                v-model="form.keyword"
                placeholder="根据题干搜索"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 二 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select v-model="form.Questiontype" placeholder="请选择">
                <el-option
                  v-for="item in questionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select v-model="form.Difficulty" placeholder="请选择">
                <el-option
                  v-for="item in difficulty"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select v-model="form.Direction" placeholder="请选择">
                <el-option
                  v-for="item in direction"
                  :key="item.value"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select v-model="form.entry" placeholder="请选择">
                <el-option label="超级管理员" value="超级管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 三 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="form.note"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="form.shortname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-select
                style="width: 46%; margin-right: 10px"
                v-model="form.city"
                placeholder="请选择"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="item in cityList"
                  :key="item"
                ></el-option>
              </el-select>
              <el-select
                style="width: 45%"
                v-model="form.area"
                placeholder="请选择"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="item in areaList"
                  :key="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" @click="cleanAll">清除</el-button>
              <el-button type="primary" size="mini" @click="onSubmit"
                >搜索</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- tab标签栏 -->
      <el-tabs v-model="activeName" type="card" @tab-click="tabsClick">
        <el-tab-pane label="全部" name="5"></el-tab-pane>
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已审核" name="1"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
      </el-tabs>

      <!-- 条数提示 -->
      <el-alert :closable="false" class="alert">
        <slot>
          <i class="el-icon-info"></i>
          数据一共{{ dataObj.counts }}条</slot
        >
      </el-alert>

      <!-- 表格 -->
      <gszTable
        :TitleList="TitleList"
        :tableDate="tableDate"
        :pageIndex="pageIndex"
        class="gsz-table"
      >
        <template #custom="scope">
          <el-button @click="pvwClick(scope)" class="btn">预览</el-button>
          <el-button
            class="btn"
            @click="chkClick(scope)"
            :disabled="scope.data.chkState == '已审核'"
            :class="{ discolor: scope.data.chkState == '已审核' }"
            >审核</el-button
          >
          <el-button
            class="btn"
            :disabled="scope.data.publishState == '上架'"
            :class="{ discolor: scope.data.publishState == '上架' }"
            @click="editClick(scope)"
            >修改</el-button
          >
          <el-button class="btn" @click="changeStateClick(scope)">{{
            scope.data.publishState == "上架" ? "下架" : "上架"
          }}</el-button>
          <el-button
            :disabled="scope.data.publishState == '上架'"
            :class="{ discolor: scope.data.publishState == '上架' }"
            class="btn"
            @click="delClick(scope)"
            >删除</el-button
          >
        </template>
      </gszTable>

      <!-- 分页 -->
      <gszPageTools
        @pageChange="onPageChange"
        @pageSizeChange="onPageSizeChange"
        :total="dataObj.counts"
        :paginationPage="page"
        :paginationPagesize="pagesize"
        :pageSizes="pageSizes"
      ></gszPageTools>

      <!-- 预览弹窗 -->
      <gszQuestionsPpreview
        v-if="isPvwVisible"
        :pvwVisible.sync="isPvwVisible"
        :detailInfo="detailInfo"
      ></gszQuestionsPpreview>

      <!-- 审核弹窗 -->
      <gszQuestionsCheck
        v-if="ischkVisible"
        :chkVisible.sync="ischkVisible"
        :chkId="chkId"
        @getchoiceList="getchoiceList"
      ></gszQuestionsCheck>
    </el-card>
  </div>
</template>

<script>
import { questionType, difficulty, direction } from "@/api/hmmm/constants.js";
// 引入api
import { simple as subjectListApi } from "@/api/hmmm/subjects.js";
import { simple as labelListApi } from "@/api/hmmm/tags";
import { simple as subjectSListApi } from "@/api/hmmm/directorys";
import {
  choice as choiceListApi,
  detail as detailListApi,
  remove as removeQueueApi,
  choicePublish as choicePublishListApi,
} from "@/api/hmmm/questions";
// 引入地图
import { provinces, citys } from "@/api/hmmm/citys";
// 引入组件
import gszTable from "../components/gsz-table";
import gszQuestionsPpreview from "../components/gsz-questions-preview.vue";
import gszPageTools from "../components/gsz-pageTools";
import gszQuestionsCheck from "../components/gsz-questions-check .vue";

import dayjs from "dayjs";

export default {
  data() {
    return {
      activeName: "5",
      form: {
        subjectID: "",
        catalogID: "",
        tags: "",
        keyword: "",
        Questiontype: "",
        Difficulty: "",
        Direction: "",
        entry: "",
        note: "",
        shortname: "",
        ctiy: "",
        area: "",
      },
      // 表格
      TitleList: [
        { label: "试题编号", key: "number", width: "150px" },
        { label: "学科", key: "subject", width: "150px" },
        { label: "目录", key: "catalog", width: "150px" },
        { label: "题型", key: "questionType", width: "150px" },
        { label: "题干", key: "question", width: "150px" },
        { label: "录入时间", key: "addDate", width: "150px" },
        { label: "难度", key: "difficulty", width: "150px" },
        { label: "审核状态", key: "chkState", width: "150px" },
        { label: "审核意见", key: "chkRemarks", width: "150px" },
        { label: "审核人", key: "chkUser", width: "150px" },
        { label: "发布状态", key: "publishType", width: "150px" },
      ],

      tableDate: [],
      pageIndex: 1,
      // 引入
      questionType,
      difficulty,
      direction,
      // 发请求获取
      subjectList: [],
      labelList: [],
      subjectSList: [],
      cityList: [],
      dataObj: {},
      // 预览弹框
      isPvwVisible: false,
      detailInfo: {},
      // 审核弹窗
      ischkVisible: false,
      // isChkDisabled: true,
      chkId: "",
      // 分页
      pageSizes: [5, 10, 20, 50],
      pagesize: 5,
      page: 1,
    };
  },
  methods: {
    // tab切换
    async tabsClick() {
      if (this.activeName == 5) {
        this.getchoiceList();
      } else {
        this.getchoiceList({ chkState: this.activeName });
      }
    },
    // 获取学科列表
    async getSubjectList() {
      const res = await subjectListApi();
      // console.log(res);
      this.subjectList = res.data;
    },
    // 选择学科同时获取二级目录 标签
    async selectSubject() {
      console.log(this.form.subject);
      this.form.catalogID = "";
      this.form.tags = "";
      const res = await labelListApi({ subjectID: this.form.subject });
      // console.log(res);
      this.labelList = res.data;
      const res1 = await subjectSListApi({ subjectID: this.form.subject });
      // console.log(res1);
      this.subjectSList = res1.data;
    },
    // 清除按钮
    cleanAll() {
      // this.$refs.form.resetField();
      this.form = {
        subjectID: "",
        catalogID: "",
        tags: "",
        keyword: "",
        Questiontype: "",
        Difficulty: "",
        Direction: "",
        entry: "",
        note: "",
        shortname: "",
        ctiy: "",
        area: "",
      };
    },
    // 提交搜索
    onSubmit() {
      // this.form.keyword = encodeURI(this.form.keyword);
      this.getchoiceList();
    },
    // 获取题库列表
    async getchoiceList() {
      const form = {};
      for (let key in this.form) {
        if (this.form[key] !== "") {
          form[key] = this.form[key];
        }
      }
      const res = await choiceListApi({
        ...form,
        page: this.page,
        pagesize: this.pagesize,
      });
      this.dataObj = res.data;
      this.tableDate = res.data.items;
      // 处理数据

      this.tableDate.forEach((item) => {
        // // 发布状态
        if (item.chkState == 1 && item.publishState == 0) {
          item.publishType = "已下架";
        } else if (item.chkState == 1 && item.publishState == 1) {
          item.publishType = "已发布";
        } else {
          item.publishType = "待发布";
        }

        // 审核状态
        if (item.chkState == 0) {
          item.chkState = "待审核";
          this.isChkDisabled = true;
        } else if (item.chkState == 1) {
          item.chkState = "已审核";
        } else {
          item.chkState = "已拒绝";
        }
        // 上下架
        if (item.publishState == 1) {
          item.publishState = "上架";
        } else {
          item.publishState = "下架";
        }
        //  难度
        if (item.difficulty == 1) {
          item.difficulty = "简单";
        } else if (item.difficulty == 2) {
          item.difficulty = "一般";
        } else {
          item.difficulty = "困难";
        }
        // 时间
        item.addDate = dayjs(item.addDate).format("YYYY-MM-DD HH:mm:ss");
        // 题型
        if (item.questionType == 1) {
          item.questionType = "单选";
        } else if (item.questionType == 2) {
          item.questionType = "多选";
        } else {
          item.questionType = "简答";
        }
      });
    },
    // 分页
    //进入某一页
    async onPageChange(val) {
      this.page = val;
      await this.getchoiceList();
    },
    // 每页显示信息条数
    async onPageSizeChange(val) {
      this.pagesize = val;
      await this.getchoiceList();
    },
    // 预览弹窗
    async pvwClick(scope) {
      const res = await detailListApi(scope.data);
      // console.log(res);
      this.detailInfo = res.data;
      // 获取到数据后显示（重绘）
      this.isPvwVisible = true;
    },
    // 审核弹窗
    chkClick(scope) {
      this.ischkVisible = true;
      this.chkId = scope.data.id;
    },
    // 修改按钮
    editClick(scope) {
      console.log(scope);
      this.$router.push({
        path:'/questions/new',
        query:{id: scope.data.id}
      })
    },
    // 上下架
    async changeStateClick(scope) {
      const confirmRes = await this.$confirm(
        `您确定${
          scope.data.publishState == "上架" ? "下架" : "上架"
        }这道题目嘛?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => console.log(err));
      // 点击取消
      if ("cancel" === confirmRes) {
        return;
      }
      // 点击成功
      if ("confirm" === confirmRes) {
        const data = {
          publishState: scope.data.publishState == "上架" ? "0" : "1",
          id: scope.data.id,
        };
        await choicePublishListApi(data);
        this.$message.success("操作成功");
        this.getchoiceList();
      }
    },
    // 删除
    async delClick(scope) {
      const confirmRes = await this.$confirm(`您确定删除这道题目嘛?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => console.log(err));
      // 点击取消
      if ("cancel" === confirmRes) {
        return;
      }
      // 点击确定
      if ("confirm" === confirmRes) {
        await removeQueueApi(scope.data);
        this.$message.success("操作成功");
        this.getchoiceList();
      }
    },
  },
  created() {
    // 获取学科列表
    this.getSubjectList();
    // 地区列表
    this.cityList = provinces();
    // 题库列表
    this.getchoiceList();
  },
  computed: {
    // 地区列表
    areaList() {
      this.form.area = "";
      return citys(this.form.city);
    },
  },
  components: {
    gszTable,
    gszQuestionsPpreview,
    gszPageTools,
    gszQuestionsCheck,
  },
};
</script>

<style scoped lang="less">
.discolor {
  color: #ccc !important;
}
.container {
  padding: 20px;
  .tips {
    font-size: 12px;
    color: pink;
  }
  .inpForm {
    margin-top: 20px;
  }
  .gsz-table {
    .btn {
      border: none;
      font-size: 12px;
      color: #409eff;
      padding: 0;
    }
  }
  .alert {
    margin-bottom: 15px;
    font-size: 12px;
    .el-icon-info {
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>

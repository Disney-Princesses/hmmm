<template>
  <div class="container">
    <el-card class="box-card">
      <div class="btn-wrapper">
        <span class="tips">说明：目前支持学科和关键字条件筛选</span>
        <el-button type="success" size="small">
          <i class="el-icon-edit"></i>
          <span>新增试题</span>
        </el-button>
      </div>
      <div class="searchForm">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="学科">
                <el-select
                  v-model="form.subjectID"
                  placeholder="请选择"
                  size="small"
                  @change="getselectSubject"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in subjectList"
                    :key="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="二级目录">
                <el-select
                  v-model="form.catalogID"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in directoryList"
                    :key="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标签">
                <el-select
                  v-model="form.tags"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in tagsList"
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
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="试题类型">
                <el-select
                  v-model="form.questionType"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="item in questionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="难度">
                <el-select
                  v-model="form.difficulty"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="item in difficultyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="方向">
                <el-select
                  v-model="form.direction"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="(item, index) in directionList"
                    :key="index"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="录入人">
                <el-select
                  v-model="form.creatorID"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="item in creatorList"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="题目备注">
                <el-input v-model="form.remarks" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="企业简称">
                <el-input v-model="form.shortName" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="城市">
                <el-row>
                  <el-col :span="11">
                    <el-select
                      v-model="form.province"
                      placeholder="请选择"
                      size="small"
                      @change="getSelectProvince"
                    >
                      <el-option
                        v-for="(item, index) in provinceList"
                        :key="index"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select
                      v-model="form.city"
                      placeholder="请选择"
                      size="small"
                    >
                      <el-option
                        v-for="(item, index) in cityList"
                        :key="index"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="btn-search">
              <el-form-item label="">
                <el-button size="small" @click="clearForm">清除</el-button>
                <el-button type="primary" size="small" @click="getQuestionList"
                  >搜索</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-alert type="info" show-icon :closable="false">
        <template #title> 数据一共{{ total }}条 </template>
      </el-alert>
      <div class="basic-question-table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="number" label="试题编号" width="120">
          </el-table-column>
          <el-table-column prop="subjectID" label="学科" width="85">
          </el-table-column>
          <el-table-column prop="catalog" label="目录" width="85">
          </el-table-column>
          <el-table-column prop="questionType" label="题型" width="85">
          </el-table-column>
          <el-table-column label="题干">
            <template slot-scope="scope">
              <div v-html="scope.row.question"></div>
            </template>
          </el-table-column>
          <el-table-column prop="addDate" label="录入时间"> </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="85">
          </el-table-column>
          <el-table-column prop="creator" label="录入人" width="85">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 预览 -->
              <el-button
                type="primary"
                icon="el-icon-view"
                circle
                plain
              ></el-button>
              <!-- 编辑 -->
              <el-button
                type="success"
                icon="el-icon-edit"
                circle
                plain
                @click="editBtn(scope)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                @click="deleteQuestion(scope)"
              ></el-button>
              <!-- 加入精选 -->
              <el-button
                type="warning"
                icon="el-icon-check"
                circle
                plain
                @click="enterQuestion(scope)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next,sizes, jumper"
        :total="total"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="form.pagesize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
    <!-- 点击删除的对话框 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" width="30%">
      <i class="el-icon-info" v-if="delValue.choiceState"></i>
      <p v-if="delValue.choiceState">此操作将改题目加入精选，是否继续？</p>
      <i class="el-icon-warning" v-if="!delValue.choiceState"></i>
      <p v-if="!delValue.choiceState">此操作将永久删除该题目，是否继续？</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="onFirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { simple as getSubjectsListApi } from "@/api/hmmm/subjects.js";
import { simple as getDirectoryListApi } from "@/api/hmmm/directorys.js";
import { simple as getTagsListApi } from "@/api/hmmm/tags.js";
import { simple as getcreatorListApi } from "@/api/base/users.js";
import { provinces, citys } from "@/api/hmmm/citys.js";
import { questionType, difficulty, direction } from "@/api/hmmm/constants.js";
import {
  list as getQuestionListApi,
  remove as deleteQuestionApi,
  choiceAdd as enterQuestionApi,
} from "@/api/hmmm/questions.js";
export default {
  data() {
    return {
      form: {
        page: 1,
        pagesize: 5,
        // 学科Id
        subjectID: "",
        // 目录id
        catalogID: "",
        // 标签
        tags: "",
        // 关键字
        keyword: "",
        // 试题类型
        questionType: "",
        // 难度
        difficulty: "",
        // 方向
        direction: "",
        // 录入人
        creatorID: "",
        // 备注
        remarks: "",
        // 企业简称
        shortName: "",
        // 省份
        province: "",
        // 城市
        city: "",
      },
      // 学科列表
      subjectList: [],
      // 目录列表
      directoryList: [],
      // 标签列表
      tagsList: [],
      // 试题类型列表
      questionList: questionType,
      // 难度列表
      difficultyList: difficulty,
      // 方向列表
      directionList: direction,
      // 录入人列表
      creatorList: [],
      // 省份列表
      provinceList: [],
      // 城市列表
      cityList: [],
      total: 0,
      // 渲染表格数据
      tableData: [],
      // 当前所处页
      currentPage: 1,
      // 点击删除对话框
      deleteDialog: false,
      delValue: {},
    };
  },
  created() {
    this.getSubjectList();
    this.getcreatorList();
    this.getprovinceList();
    this.getQuestionList();
  },
  methods: {
    // 获取基础题库列表
    async getQuestionList() {
      let obj = {};
      for (let key in this.form) {
        if (this.form[key] !== "") {
          obj[key] = this.form[key];
        }
      }
      this.form = obj;
      const { data } = await getQuestionListApi(this.form);
      data.items.forEach((item) => {
        item.subjectID = this.handleSubject(item.subjectID);
        item.questionType = this.handleQuestionType(item.questionType);
        item.difficulty = this.handleDifficulty(item.difficulty);
        item.addDate = this.handleAddDate(item.addDate);
      });
      this.total = data.counts;
      this.tableData = data.items;
    },
    // 点击清除搜索
    clearForm() {
      this.form = {
        page: 1,
        pagesize: 5,
        // 学科Id
        subjectID: "",
        // 目录id
        catalogID: "",
        // 标签
        tags: "",
        // 关键字
        keyword: "",
        // 试题类型
        questionType: "",
        // 难度
        difficulty: "",
        // 方向
        direction: "",
        // 录入人
        creatorID: "",
        // 备注
        remarks: "",
        // 企业简称
        shortName: "",
        // 省份
        province: "",
        // 城市
        city: "",
      };
    },
    // 获取学科简单列表
    async getSubjectList() {
      const { data } = await getSubjectsListApi();
      this.subjectList = data;
    },
    // 处理获取回来的学科数据
    handleSubject(val) {
      return this.subjectList.find((item) => item.value === val).label;
    },
    // 处理获取回来的题型数据
    handleQuestionType(val) {
      return this.questionList.find((item) => item.value == val).label;
    },
    // 处理获取回来的难度数据
    handleDifficulty(val) {
      return this.difficultyList.find((item) => item.value == val).label;
    },
    // 处理返回回来的时间
    handleAddDate(val) {
      val = val.replace("T", " ");
      return val.replace(".000Z", "");
    },
    // 获取用户简单列表
    async getcreatorList() {
      const { data } = await getcreatorListApi();
      this.creatorList = data;
    },
    // 获取选中学科
    getselectSubject(val) {
      this.getDirectoryList({ subjectID: val });
      this.getTagsList({ subjectID: val });
    },
    // 获取二级目录简单列表
    async getDirectoryList(val) {
      const { data } = await getDirectoryListApi(val);
      this.directoryList = data;
    },
    // 获取标签简单列表
    async getTagsList(val) {
      const { data } = await getTagsListApi(val);
      this.tagsList = data;
    },
    // 获取省份列表
    getprovinceList() {
      this.provinceList = provinces();
    },
    // 获取选中的省份
    getSelectProvince(val) {
      this.getCityList(val);
    },
    // 获取城市列表
    getCityList(province) {
      this.cityList = citys(province);
    },
    // 每也页数改变
    handleSizeChange(val) {
      this.form.pagesize = val;
      this.getQuestionList();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.form.page = val;
      this.getQuestionList();
    },
    // 删除图库数据
    deleteQuestion({ row }) {
      this.delValue = row;
      this.deleteDialog = true;
    },
    // 点击确定
    async onFirm() {
      this.deleteDialog = false;
      if (this.delValue.choiceState) {
        await enterQuestionApi(this.delValue);
      } else {
        await deleteQuestionApi(this.delValue);
      }

      this.getQuestionList();
    },
    // 进入精选题库
    enterQuestion({ row }) {
      this.delValue = row;
      this.delValue.choiceState = 1;
      this.deleteDialog = true;
    },
    editBtn() {},
  },
};
</script>

<style scoped lang="less">
.box-card {
  margin: 10px;
  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .tips {
      font-size: 12px;
      color: pink;
    }
  }
  .searchForm {
    ::v-deep .el-form-item--medium {
      margin-bottom: 18px;
    }
    .btn-search {
      ::v-deep .el-form-item__content {
        text-align: right;
      }
    }
    .el-col-11 {
      width: 48%;
      margin-right: 2%;
    }
  }
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
::v-deep .el-dialog {
  border-radius: 4px;
  padding-bottom: 10px;
  .el-dialog__header {
    background-color: #fff;
    .el-dialog__title {
      font-size: 18px;
      line-height: 1;
      color: #303133;
    }
    padding: 15px 15px 10px;
  }
  .el-dialog__body {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    .el-icon-warning {
      color: #e6a23c;
      font-size: 24px;
    }
    p {
      margin-left: 12px;
    }
  }
  .el-dialog__footer {
    padding: 5px 15px 0;
    text-align: right;
  }
}
</style>

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
                <el-button size="small">清除</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="SearchQuestionList"
                  >搜索</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { simple as getSubjectsListApi } from "@/api/hmmm/subjects.js";
import { simple as getDirectoryListApi } from "@/api/hmmm/directorys.js";
import { simple as getTagsListApi } from "@/api/hmmm/tags.js";
import { simple as getcreatorListApi } from "@/api/base/users.js";
import { provinces, citys } from "@/api/hmmm/citys.js";
export default {
  data() {
    return {
      form: {
        name: "",
        subjectID: "",
        catalogID: "",
        tags: "",
        keyword: "",
        questionType: "",
        difficulty: "",
        direction: "",
        creatorID: "",
        remarks: "",
        shortName: "",
        province: "",
        city: "",
      },
      value: "",
      subjectList: [],
      directoryList: [],
      tagsList: [],
      questionList: [
        { label: "单选", value: 1 },
        { label: "多选", value: 2 },
        { label: "简答", value: 3 },
      ],
      difficultyList: [
        { label: "简单", value: 1 },
        { label: "一般", value: 2 },
        { label: "困难", value: 3 },
      ],
      directionList: [
        "o2o",
        "外包服务",
        "企业服务",
        "互联网金融",
        "企业咨询",
        "互联网",
        "电子商务",
        "其他",
      ],
      creatorList: [],
      // 省份列表
      provinceList: [],
      // 城市列表
      cityList: [],
    };
  },
  created() {
    this.getSubjectList();
    this.getcreatorList();
    this.getprovinceList();
  },
  methods: {
    // 获取学科简单列表
    async getSubjectList() {
      const { data } = await getSubjectsListApi();
      this.subjectList = data;
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
      console.log(val);
      this.getCityList(val);
    },
    // 获取城市列表
    getCityList(province) {
      this.cityList = citys(province);
      console.log(this.cityList);
    },
    // 点击搜索
    SearchQuestionList() {
      console.log(this.form);
    },
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
}
</style>

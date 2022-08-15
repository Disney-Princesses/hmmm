<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <div>
        <el-form
          ref="form"
          :model="formData"
          :rules="formDataRules"
          label-width="100px"
        >
          <!-- 学科 -->
          <el-form-item label="学科：" prop="subjectID">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.subjectID"
              @change="subjectChange"
            >
              <el-option
                v-for="item in simpleSubjectsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 目录 -->
          <el-form-item label="目录：" prop="cataloglD">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.cataloglD"
            >
              <el-option
                v-for="item in simpleDirectoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 企业 -->
          <el-form-item label="企业：" prop="enterpriselD">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.enterpriselD"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.shortName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 城市 -->
          <el-form-item label="城市：" prop="city">
            <el-select
              placeholder="请选择"
              style="width: 200px; margin-right: 10px"
              v-model="formData.province"
            >
              <el-option
                v-for="item in provincesList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              placeholder="请选择"
              style="width: 190px"
              v-model="formData.city"
            >
              <el-option
                v-for="item in citysList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 方向 -->
          <el-form-item label="方向：" prop="direction">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.direction"
            >
              <el-option
                v-for="item in direction"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 题型 -->
          <el-form-item label="题型：" prop="questionType">
            <el-radio-group v-model="formData.questionType">
              <el-radio
                v-for="item in questionType"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 难度 -->
          <el-form-item label="难度：" prop="difficulty">
            <el-radio-group v-model="formData.difficulty">
              <el-radio
                v-for="item in difficulty"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 题干 -->
          <el-form-item label="题干：" prop="question">
            <quill-editor
              v-model="formData.question"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
          </el-form-item>
          <!-- 选项 -->
          <el-form-item label="选项：" prop="options" style="margin-top: 50px">
            <el-radio-group v-model="radio">
              <div
                class="option_item"
                v-for="(item, index) in formData.options"
                :key="index"
              >
                <el-radio
                  :label="item.code"
                  @change="radioChange"
                  style="position: relative"
                >
                  {{ item.code + "：" }}
                  <el-input v-model="item.title" placeholder="请输入内容">
                  </el-input>
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    class="avatar-uploader"
                    :show-file-list="false"
                  >
                    <img v-if="item.img" :src="item.img" class="avatar" />
                    <span v-else>上传图片</span>
                    <i class="el-icon-circle-close close-icon"></i>
                  </el-upload>
                </el-radio>
              </div>
              <el-button type="danger" disabled>+增加选项与答案</el-button>
            </el-radio-group>
          </el-form-item>
          <!-- 解析视频 -->
          <el-form-item label="解析视频：" prop="videoURL">
            <el-input
              v-model="formData.videoURL"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <!-- 答案解析 -->
          <el-form-item label="答案解析：" prop="answer">
            <quill-editor
              v-model="formData.answer"
              ref="myQuillEditor2"
              :options="editorOption"
            >
            </quill-editor>
          </el-form-item>
          <!-- 题目备注 -->
          <el-form-item label="题目备注：" prop="remarks">
            <el-input type="textarea" v-model="formData.remarks"></el-input>
          </el-form-item>
          <!-- 试题标签 -->
          <el-form-item label="试题标签：" prop="tagsArr">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.tagsArr"
              multiple
              @change="tagsChange"
            >
              <el-option
                v-for="item in simpleTagsList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">确认提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { simple as simpleSubjects } from "@/api/hmmm/subjects.js";
import { simple as simpleDirectory } from "@/api/hmmm/directorys.js";
import { list as getCompanyListApi } from "@/api/hmmm/companys.js";
import { direction, questionType, difficulty } from "@/api/hmmm/constants.js";
import {
  provinces as getProvinces,
  citys as getCitys,
} from "@/api/hmmm/citys.js";
import { simple as simpleTags } from "@/api/hmmm/tags.js";
export default {
  data() {
    return {
      // 编辑器配置
      editorOption: {
        placeholder: "在这里输入内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //  加粗、倾斜、下划线、删除线
            [{ list: "ordered" }, { list: "bullet" }], // 列表
            ["blockquote", "code-block"], // 引用代码块
            ["image", "link"], // 上传图片、上传视频
          ],
        },
      },
      formData: {
        subjectID: "", // 学科
        cataloglD: "", // 目录
        enterpriselD: "", // 企业
        province: "", // 城市
        city: "", //地区
        direction: "", //方向
        questionType: 1, //题型
        difficulty: 1, //难度
        question: "", // 题干
        options: [
          { isRight: false, code: "A", title: "", img: "" },
          { isRight: false, code: "B", title: "", img: "" },
          { isRight: false, code: "C", title: "", img: "" },
          { isRight: false, code: "D", title: "", img: "" },
        ], //选项
        videoURL: "", // 视频解析
        answer: "", // 答案解析
        remarks: "", // 题目备注
        tags: "", // 试题标签
        tagsArr: "", // 试题标签数组
      },
      formDataRules: {
        subjectID: [
          { required: true, message: "请输入学科", trigger: "change" },
        ],
        cataloglD: [
          { required: true, message: "请输入目录", trigger: "change" },
        ],
        enterpriselD: [
          { required: true, message: "请输入企业", trigger: "change" },
        ],
        city: [{ required: true, message: "请选择地区", trigger: "change" }],
        direction: [
          { required: true, message: "请选择方向", trigger: "change" },
        ],
        questionType: [
          { required: true, message: "请选择题型", trigger: "change" },
        ],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" },
        ],
        question: [{ required: true, message: "请输入题干", trigger: "blur" }],
        answer: [
          { required: true, message: "请输入答案解析", trigger: "blur" },
        ],
      },
      simpleSubjectsList: [], // 简单学科列表
      simpleDirectoryList: [], // 简单目录列表
      companyList: [], // 企业列表
      provincesList: [], // 所有城市列表
      direction, //方向
      questionType, // 题型
      difficulty, //难度
      radio: "", // 单选值
      simpleTagsList: [], // 简单标签列表
    };
  },
  methods: {
    // 获取简单学科列表
    async getSimpleSubjectsList() {
      const { data } = await simpleSubjects();
      // console.log(data);
      this.simpleSubjectsList = data;
    },

    // 获取目录简单列表
    async getSimpleDirectoryList() {
      const { data } = await simpleDirectory({
        subjectID: this.formData.subjectID,
      });
      // console.log(data);
      this.simpleDirectoryList = data;
      this.formData.cataloglD = "";
    },
    // 获取企业列表
    async getCompanyList() {
      const { data } = await getCompanyListApi({
        pagesize: 10000,
      });
      console.log(data);
      this.companyList = data.items;
    },

    // 学科下拉列表选中时变化
    subjectChange() {
      this.getSimpleDirectoryList();
      this.getSimpleTags();
    },

    // 单选改变事件
    radioChange() {
      this.formData.options.forEach((item) => {
        if (item.code === this.radio) {
          item.isRight = true;
        } else {
          item.isRight = false;
        }
      });
    },

    // 获取简单标签列表
    async getSimpleTags() {
      const { data } = await simpleTags({
        page: 1,
        pagesize: 10000,
        subjectID: this.formData.subjectID,
      });
      // console.log(data);
      this.simpleTagsList = data;
    },

    // 试题标签选中发生变化时
    tagsChange() {
      this.formData.tags = this.formData.tagsArr.join(",");
    },
  },
  created() {
    this.getSimpleSubjectsList();
    this.getCompanyList();
    this.provincesList = getProvinces();
  },
  computed: {
    // 城市下地区列表
    citysList() {
      this.formData.city = "";
      return getCitys(this.formData.province);
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  box-sizing: border-box;
  ::v-deep .ql-container {
    height: 200px !important;
  }
  .option_item {
    margin-bottom: 50px;
  }
}

.avatar-uploader {
  position: absolute;
  right: -172px;
  top: -13px;
  width: 100px;
  border: 1px dashed #d9d9d9;
  height: 60px;
  border-radius: 5px;
  span {
    display: block;
    width: 100px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    border-color: #409eff;
  }

  .close-icon {
    position: absolute;
    top: -8px;
    right: -7px;
  }
}

.avatar {
}
</style>

<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入（臧炼鑫）</span>
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
          <el-form-item label="目录：" prop="catalogID">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.catalogID"
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
          <el-form-item label="企业：" prop="enterpriseID">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.enterpriseID"
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
                @change="questionTypesSelect(item.value)"
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
          <el-form-item
            label="选项："
            prop="options"
            style="margin-top: 50px"
            v-if="formData.questionType !== 3"
          >
            <!-- 单选 -->
            <el-radio-group v-model="radio" v-if="formData.questionType === 1">
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
                  <el-input
                    style="width: 240px"
                    v-model="item.title"
                    placeholder="请输入内容"
                  >
                  </el-input>
                  <el-upload
                    v-loading="imgLoading"
                    element-loading-text="上传中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    action="#"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :http-request="onRequest"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    @click.native="saveImgIndex(index)"
                  >
                    <img v-if="item.img" :src="item.img" class="avatar" />
                    <span v-else>上传图片</span>
                    <i class="el-icon-circle-close close-icon"></i>
                  </el-upload>
                </el-radio>
              </div>
              <el-button type="danger" disabled>+增加选项与答案</el-button>
            </el-radio-group>

            <!-- 多选 -->
            <template v-if="formData.questionType === 2">
              <div
                class="option_item"
                v-for="(item, index) in formData.options"
                :key="index"
              >
                <el-checkbox v-model="item.isRight" style="position: relative">
                  {{ item.code + "：" }}
                  <el-input
                    style="width: 240px"
                    v-model="item.title"
                    placeholder="请输入内容"
                  >
                  </el-input>
                  <el-upload
                    v-loading="imgLoading"
                    element-loading-text="上传中,请稍等"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    action="#"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :http-request="onRequest"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    @click.native="saveImgIndex(index)"
                  >
                    <img v-if="item.img" :src="item.img" class="avatar" />
                    <span v-else>上传图片</span>
                    <i class="el-icon-circle-close close-icon"></i>
                  </el-upload>
                </el-checkbox>
              </div>
              <el-button type="danger" @click="addSelect"
                >+增加选项与答案</el-button
              >
            </template>
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
          <el-form-item label="试题标签：" prop="tags">
            <el-select
              placeholder="请选择"
              style="width: 400px"
              v-model="formData.tags"
              multiple
              filterable
              default-first-option
              allow-create
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
            <el-button
              :type="$route.query.id ? 'success' : 'primary'"
              @click="onCommit"
              >{{ $route.query.id ? "确认修改" : "确认提交" }}</el-button
            >
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
// 代码块高亮
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import COS from "cos-js-sdk-v5";
var cos = new COS({
  SecretId: "AKIDnRt75qSqytZBdqmTuFRQClAML6ez66uU",
  SecretKey: "PbZKsDLGzTiiW7VgfQwFOK4bw4xa0CD2",
});
import { simple as simpleSubjects } from "@/api/hmmm/subjects.js";
import { simple as simpleDirectory } from "@/api/hmmm/directorys.js";
import { list as getCompanyListApi } from "@/api/hmmm/companys.js";
import { direction, questionType, difficulty } from "@/api/hmmm/constants.js";
import {
  provinces as getProvinces,
  citys as getCitys,
} from "@/api/hmmm/citys.js";
import { simple as simpleTags } from "@/api/hmmm/tags.js";
import {
  add as addQuestions,
  detail as topicDetailApi,
  update as editQuestionsApi,
} from "@/api/hmmm/questions.js";
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
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
            },
          },
        },
      },
      formData: {
        subjectID: "", // 学科
        catalogID: "", // 目录
        enterpriseID: "", // 企业
        province: "", // 城市
        city: "", //地区
        direction: "", //方向
        questionType: 1, //题型
        difficulty: 1, //难度
        question: "", // 题干
        options: [
          { code: "A", title: "", img: "", isRight: false },
          { code: "B", title: "", img: "", isRight: false },
          { code: "C", title: "", img: "", isRight: false },
          { code: "D", title: "", img: "", isRight: false },
        ], //选项
        videoURL: "", // 视频解析
        answer: "", // 答案解析
        remarks: "", // 题目备注
        tags: [], // 试题标签
      },
      formDataRules: {
        subjectID: [
          { required: true, message: "请输入学科", trigger: "change" },
        ],
        catalogID: [
          { required: true, message: "请输入目录", trigger: "change" },
        ],
        enterpriseID: [
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
        tags:[
          { required: true, message: "请选择", trigger: "blur" },
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
      imgIndex: "", // 选项图片索引
      imgLoading: false, // 上传图片加载
      multiSelectList: [
        { code: "A", title: "", img: "", isRight: false },
        { code: "B", title: "", img: "", isRight: false },
        { code: "C", title: "", img: "", isRight: false },
        { code: "D", title: "", img: "", isRight: false },
      ], //多选列表
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
      this.formData.catalogID = "";
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

    // 图片上传前处理
    beforeAvatarUpload(file) {
      console.log(file);
      const types = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!types.includes(file.type)) {
        this.$message.error("请上传" + types.join("或") + "类型的图片");
        return false;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("上传的图片不能大于2mb");
        return false;
      }
    },

    // 上传图片完成的处理
    handleAvatarSuccess(res, file) {
      console.log(file);
    },

    // 图片点击获取索引
    saveImgIndex(index) {
      if (this.imgLoading) return;
      this.imgIndex = index;
    },

    // 图片上传请求
    onRequest({ file }) {
      this.imgLoading = true;
      cos.putObject(
        {
          Bucket: "storage-person-1307444905" /* 必须 */,
          Region: "ap-shanghai" /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        (err, data) => {
          this.imgLoading = false;
          if (err || data.statusCode !== 200) {
            return this.$message.error("亲，上传失败，请重试");
          }
          // console.log('https://' + data.Location);
          this.formData.options.forEach((item, index) => {
            if (index === this.imgIndex) {
              item.img = "https://" + data.Location;
            }
          });
        }
      );
    },

    // 题型选择对应变化
    questionTypesSelect(val) {
      if (val === 1) {
        this.formData.options = [
          { code: "A", title: "", img: "", isRight: false },
          { code: "B", title: "", img: "", isRight: false },
          { code: "C", title: "", img: "", isRight: false },
          { code: "D", title: "", img: "", isRight: false },
        ];
      } else if (val === 2) {
        this.formData.options = [...this.multiSelectList];
      }
    },

    // 增加选项与答案
    addSelect() {
      let asc =
        this.multiSelectList[this.multiSelectList.length - 1].code.charCodeAt();
      asc++;
      let code = String.fromCharCode(asc);
      this.multiSelectList.push({
        code,
        title: "",
        img: "",
        isRight: false,
      });
      this.formData.options = [...this.multiSelectList];
    },
    // 确认提交
    async onCommit() {
      try {
        await this.$refs.form.validate();
        const formObj = { ...this.formData };
        formObj.questionType = String(formObj.questionType);
        formObj.difficulty = String(formObj.difficulty);
        formObj.tags = formObj.tags.join(",");
        if (this.$route.query.id) {
          await editQuestionsApi(formObj);
          this.$router.push("/questions/list");
          this.$message.success("修改成功");
        } else {
          await addQuestions(formObj);
          // console.log(res);
          this.$router.push("/questions/list");
          this.$message.success("添加成功");
          this.formData = {
            subjectID: "", // 学科
            catalogID: "", // 目录
            enterpriseID: "", // 企业
            province: "", // 城市
            city: "", //地区
            direction: "", //方向
            questionType: 1, //题型
            difficulty: 1, //难度
            question: "", // 题干
            options: [
              { code: "A", title: "", img: "", isRight: false },
              { code: "B", title: "", img: "", isRight: false },
              { code: "C", title: "", img: "", isRight: false },
              { code: "D", title: "", img: "", isRight: false },
            ], //选项
            videoURL: "", // 视频解析
            answer: "", // 答案解析
            remarks: "", // 题目备注
            tags: [], // 试题标签
          };
          this.$refs.form.resetFields();
        }
      } catch (error) {
        console.dir(error);
      }
    },

    // 获取题目详情
    async getTopicDetail() {
      if (this.$route.query.id) {
        const { data } = await topicDetailApi({ id: this.$route.query.id });
        console.log(data);
        data.difficulty = data.difficulty - 0;
        data.questionType = data.questionType - 0;
        data.tags = data.tags.split(",");
        data.options.forEach((item) => {
          item.isRight = item.isRight ? true : false;
        });
        if (data.questionType === 1) {
          data.options.forEach((item) => {
            if (item.isRight) {
              this.radio = item.code;
            }
          });
        }
        this.formData = { ...data };
        setTimeout(() => {
          this.formData.city = data.city;
        }, 1000);
      }
    },
  },
  created() {
    this.getSimpleSubjectsList();
    this.getCompanyList();
    this.provincesList = getProvinces();
    this.getTopicDetail();
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
  right: -112px;
  top: -13px;
  width: 100px;
  border: 1px dashed #d9d9d9;
  height: 60px;
  border-radius: 5px;
  .avatar {
    width: 98px;
    height: 58px;
  }
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
</style>

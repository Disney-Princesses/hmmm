<template>
  <el-dialog
    :title="titleName"
    :visible="dialogVisible"
    width="70%"
    @close="closeFn"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>
      <!-- 文章内容模块 -->
      <el-form-item label="内容" prop="title">
        <!-- 富文本编辑器 -->
        <VueEditor
          v-model="form.articleBody"
          :editorToolbar="customToolbar"
          useCustomImageHandler
          @image-added="handleImageAdded"
          ref="vueEditor"
        ></VueEditor>
      </el-form-item>
      <el-form-item label="视频地址" prop="videoURL">
        <el-input
          v-model.trim="form.videoURL"
          placeholder="请输入视频地址"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">取 消</el-button>
      <el-button type="primary" @click="onSave">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import VueEditor from "vue-word-editor";
// import "quill/dist/quill.snow.css";
// import hljs from "highlight.js";
import { VueEditor } from "vue2-editor";
import { add, update } from "@/api/hmmm/articles";
export default {
  data() {
    return {
      form: {
        title: "",
        articleBody: "",
        videoURL: "",
      },
      formRules: {
        title: [
          {
            required: true,
            message: `请选择所属学科`,
            trigger: "change",
          },
        ],
        articleBody: [
          {
            required: true,
            message: `请输入文章名称`,
            trigger: "blur",
          },
        ],
      },
      selectData: [],
      // 富文本框工具配置
      customToolbar: [
        ["bold", "italic", "underline", "strike"],

        [
          {
            list: "ordered",
          },
          {
            list: "bullet",
          },
        ],
        ["blockquote"], //引用
        ["code-block"], //代码块
        ["image"],
        ["link"],
      ],
      // syntax: {
      //   highlight: (text) => {
      //     return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
      //   },
      // },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    tochange: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    VueEditor,
  },
  computed: {
    titleName() {
      return this.tochange.id ? "修改文章" : "新增文章";
    },
  },
  created() {
    if (this.tochange.id) {
      this.form.title = this.tochange.title;
      this.form.articleBody = this.tochange.articleBody;
      this.form.videoURL = this.tochange.videoURL;
    }
  },

  methods: {
    // 上传图片的处理
    handleImageAdded: function (file, Editor, cursorLocation, reseter) {
      // //console.log(file);
      // //console.log('upload image');
      const formData = new FormData();
      formData.append("image", file.File);
      // //console.log(formData);
      //   $http
      //     .post(this.$common.baseUrl + "upload/image", formData)
      //     .then((res) => {
      //       let data = res.body;
      //       if (data.code == 200) {
      //         let url = data.data.url;
      //         Editor.insertEmbed(cursorLocation, "image", url);
      //         resetUploader();
      //       } else {
      //       }
      //     });
    },
    // 关闭时清空表单
    closeFn() {
      this.$emit("update:dialogVisible", false);
      this.$refs.form.resetFields();
      this.form = {
        title: "",
        articleBody: "",
        videoURL: "",
      };
    },
    // 确认
    async onSave() {
      await this.$refs.form.validate();
      if (this.tochange.id) {
        // 修改
        this.form.id = this.tochange.id;
        await update(this.form);
        this.closeFn();
        this.$message.success("修改文章成功");
      } else {
        // 新增
        await add(this.form);
        this.closeFn();
        this.$message.success("添加成功");
      }
      this.$parent.$options.parent.getArticles();
    },
  },
};
</script>

<style scoped></style>

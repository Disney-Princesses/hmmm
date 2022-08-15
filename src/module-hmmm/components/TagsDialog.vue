<template>
  <el-dialog
    :title="titleName"
    :visible="dialogVisible"
    width="30%"
    @close="$emit('update:dialogVisible', false)"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="所属学科" prop="subjectID">
        <el-select
          v-model="form.subjectID"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            :label="item.subjectName"
            :value="item.id"
            v-for="(item, index) in selectData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称" prop="tagName">
        <el-input
          v-model.trim="form.tagName"
          placeholder="请输入标签名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible', false)">取 消</el-button>
      <el-button type="primary" @click="onSave">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { list } from "@/api/hmmm/subjects";
import { add, update } from "@/api/hmmm/tags";
export default {
  data() {
    return {
      form: {
        subjectID: "",
        tagName: "",
      },
      formRules: {
        subjectID: [
          {
            required: true,
            message: `请选择所属学科`,
            trigger: "change",
          },
        ],
        tagName: [
          {
            required: true,
            message: `请输入标签名称`,
            trigger: "blur",
          },
        ],
      },
      selectData: [],
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
  computed: {
    titleName() {
      if (this.tochange.id) {
        return "修改标签";
      }
      return "新增标签";
    },
  },
  created() {
    this.getTagsList();
    if (this.tochange.id) {
      this.form.subjectID = this.tochange.subjectID;
      this.form.tagName = this.tochange.tagName;
      this.form.id = this.tochange.id;
    }
  },

  methods: {
    // 获取学科列表
    async getTagsList() {
      const { data } = await list();
      this.selectData = data.items;
    },
    // 确认
    async onSave() {
      await this.$refs.form.validate();
      if (this.tochange.id) {
        // 修改
        await update(this.form);
        this.$message.success("修改标签成功");
      } else {
        // 新增
        await add(this.form);
        this.$message.success("添加成功");
      }
      this.$emit("update:dialogVisible", false);
      this.$parent.$options.parent.getTags();
      // 表单清空
      this.$refs.form.resetField();
    },
  },
};
</script>

<style scoped></style>

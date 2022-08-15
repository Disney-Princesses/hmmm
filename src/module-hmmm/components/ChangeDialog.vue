<template>
  <el-dialog
    :title="titleName"
    :visible="changeVisible"
    width="30%"
    @close="$emit('update:changeVisible', false)"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="所属学科" prop="subjectId">
        <el-select
          v-model="form.subjectId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            :label="item.subjectName"
            :value="item.subjectID"
            v-for="(item, index) in selectData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="addLabel" prop="name">
        <el-input
          v-model.trim="form.name"
          :placeholder="placeholder"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:changeVisible', false)">取 消</el-button>
      <el-button type="primary" @click="changeSave">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { list } from "@/api/hmmm/directorys";
export default {
  data() {
    return {
      form: {
        subjectId: "",
        name: "",
        id:0
      },
      formRules: {
        subjectId: [
          {
            required: true,
            message: `请选择所属学科`,
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: `请输入${this.addLabel}`,
            trigger: "blur",
          },
        ],
      },
      selectData: [],
    };
  },
  props: {
    changeVisible: {
      type: Boolean,
      default: false,
    },
    titleName: {
      type: String,
      default: "修改目录",
    },
    addLabel: {
      type: String,
      default: "目录名称",
    },
    placeholder: {
      type: String,
      default: "请输入目录名称",
    },
    changedata: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.getSubjectList();
    this.form.subjectId = this.changedata.subjectID;
    this.form.name = this.changedata.directoryName;
    this.form.id = this.changedata.id
  },

  methods: {
    // 获取学科列表
    async getSubjectList() {
      const { data } = await list();
      this.selectData = data.items;
    },
    // 确认
    async changeSave() {
      await this.$refs.form.validate();
      this.$emit("changeSave", this.form);
      this.$emit("update:changeVisible", false);
    },
  },
};
</script>

<style scoped></style>

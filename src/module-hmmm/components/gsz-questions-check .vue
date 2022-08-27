<template>
  <el-dialog
    title="题目审核"
    :visible="chkVisible"
    width="30%"
    @close="onClose"
  >
    <el-form ref="form" :model="form" label-width="0px">
      <el-form-item>
        <el-radio-group v-model="form.chkState">
          <el-radio label="通过"></el-radio>
          <el-radio label="拒绝"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-input
          type="textarea"
          v-model="form.chkRemarks"
          placeholder="请输入审核意见"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { choiceCheck } from "@/api/hmmm/questions";
export default {
  data() {
    return {
      form: {
        chkState: "通过",
        chkRemarks: "",
        id: this.chkId,
      },
    };
  },
  props: {
    chkVisible: {
      type: Boolean,
      default: false,
    },
    chkId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit("update:chkVisible", false);
    },
    async onSubmit() {
      // //console.log(this.form);
      if (this.form.chkRemarks.trim().length === 0) {
        return this.$message.error("请输入审核意见");
      }
      this.form.chkState = this.form.chkState == "通过" ? 1 : 2;
      await choiceCheck(this.form);
      this.$message.success("操作成功");
      this.onClose();
      this.$emit("getchoiceList");
    },
  },
};
</script>

<style scoped lang="less"></style>

<template>
  <el-dialog
    @close="onClose"
    title="题目预览"
    :visible="pvwVisible"
    width="60%"
  >
    <el-row class="pvw-row">
      <el-col :span="6">【题型】：</el-col>
      <el-col :span="6">【编号】：</el-col>
      <el-col :span="6">【难度】：</el-col>
      <el-col :span="6">【标签】：</el-col>
      <el-col :span="6">【学科】：</el-col>
      <el-col :span="6">【目录】：</el-col>
      <el-col :span="6">【方向】：</el-col>
    </el-row>
    <hr>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    pvwVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit("update:pvwVisible", false);
    },
  },
};
</script>

<style scoped lang="less">
.pvw-row {
  .el-col {
    margin-bottom: 20px;
  }
}
</style>

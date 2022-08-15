<template>
  <div class="container">
    <div class="left">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="firstLabel">
          <el-input
            v-model.trim="formInline.name"
            :placeholder="placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item :label="sceondLabel">
          <el-select
            v-model.trim="formInline.state"
            placeholder="请选择"
            style="width: 208px"
          >
            <el-option
              :label="item.value"
              :value="item.state"
              v-for="item in selectData"
              :key="item.state"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="clearFn">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$emit('search',formInline)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <el-button type="success" @click="$emit('addEvent')">
        <i class="el-icon-edit"></i>
        新增目录</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonHeader",
  data() {
    return {
      formInline: {
        name: "",
        state: "",
      },
      selectData: [
        {
          value: "启用",
          state: 1,
        },
        {
          value: "禁用",
          state: 0,
        },
      ],
    };
  },

  props: {
    firstLabel: {
      type: String,
      default: "目录名称",
    },
    sceondLabel: {
      type: String,
      default: "状态",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },

  created() {},

  methods: {
    clearFn() {
      this.formInline={}
      this.$emit('clear',this.formInline)
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
}
.el-form-item--medium .el-form-item__content,
::v-deep.el-form-item--medium .el-form-item__label {
  width: 80px;
  height: 32px;
}
::v-deep.el-input--medium .el-input__inner {
  height: 32px;
}
.left .el-button {
  width: 56px;
  height: 32px;
  padding: 9px 15px;
  font-size: 12px;
}
.right .el-button {
  width: 97px;
  height: 32px;
  padding: 9px 15px;
  font-size: 12px;
}
::v-deep .el-form-item__content {
  .el-input__inner {
    height: 32px;
  }
}
</style>

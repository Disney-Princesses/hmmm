<template>
  <el-card class="box-card">
    <!-- 头部搜索 -->
    <el-row class="headerRow">
      <el-col class="headerCol">
        <el-col>吴开维</el-col>
        <el-button
          type="success"
          icon="el-icon-edit"
          class="addpermissBtn"
          @click="isShowMenus"
        >
          添加菜单
        </el-button>
      </el-col>
    </el-row>
    <!-- 表单渲染 -->
    <mentus-table ref="mentusTable"></mentus-table>
  </el-card>
</template>

<script>
import mentusTable from "../components/menusTable.vue";
export default {
  data() {
    return {};
  },

  created() {},

  methods: {
    isShowMenus() {
      this.$refs.mentusTable.text = "创建菜单";
      this.$refs.mentusTable.dialogFormVisible = true;
    },
  },

  components: {
    mentusTable,
  },
};
</script>

<style scoped lang="scss">
.box-card {
  margin: 20px;
  .headerRow {
    .headerCol {
      // flex-direction: column;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

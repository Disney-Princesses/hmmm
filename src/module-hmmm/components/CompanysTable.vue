<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    highlight-current-row
    :header-cell-style="{ background: '#fafafa' }"
    v-loading="loading"
  >
    <el-table-column prop="id" label="序号"></el-table-column>
    <el-table-column prop="number" label="企业编号"> </el-table-column>
    <el-table-column prop="shortName" label="企业简称"> </el-table-column>
    <el-table-column prop="tags" label="标签"> </el-table-column>
    <el-table-column prop="creatorID" label="创建者"> </el-table-column>
    <el-table-column prop="addDate" label="创建日期"> </el-table-column>
    <el-table-column prop="remarks" label="备注"> </el-table-column>
    <el-table-column prop="state" label="状态">
      <template slot-scope="scope">
        {{ scope.row.state ? "启用" : "禁用" }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          plain
          @click="editCompany(scope.row)"
        ></el-button>
        <el-button
          :type="scope.row.state ? 'warning' : 'success'"
          :icon="scope.row.state ? 'el-icon-close' : 'el-icon-check'"
          circle
          plain
          @click="isEnable(scope.row)"
        ></el-button>
        
        <el-button
          type="danger"
          icon="el-icon-delete-solid"
          circle
          plain
          @click="delCompany(scope.row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {};
  },

  created() {},

  methods: {
    editCompany(obj) {
      this.$emit("editCompany", obj);
    },
    isEnable(obj) {
      this.$emit("isEnable", obj)
    },
    delCompany(obj) {
      this.$emit("delCompany", obj)
    }
  },

  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>

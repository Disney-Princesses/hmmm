<template>
  <!-- 预览文章弹框 -->
  <el-dialog
    title="预览文章"
    :visible="previewDialog"
    width="65%"
      @close="$emit('update:previewDialog', false)"
  >
    <h3 style="margin: unset">{{ currentRow.title }}</h3>
    <div class="tags">
      <span>{{ previewTime }}</span>
      <span>{{ currentRow.username }}</span>
      <span><i class="el-icon-view"></i></span>
      <span>{{ currentRow.visits }}</span>
    </div>
    <!-- 文章详情 -->
    <div class="body" v-html="currentRow.articleBody"></div>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {};
  },
  computed: {
    previewTime() {
     return dayjs(this.currentRow.createTime).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  props: {
    previewDialog: {
      type: Boolean,
      default: false,
    },
    currentRow: {
      type: Object,
      default: () => {},
    },
  },

  created() {
  },

  methods: {},
};
</script>

<style scoped lang='scss'>
.tags {
  font-size: 14px;
  margin-top: 10px;
  span {
    margin-left: 10px;
  }
}
.body {
  background-color: #f5f5f5;
  padding: 10px;
  img {
    width: 100%;
  }
}
</style>

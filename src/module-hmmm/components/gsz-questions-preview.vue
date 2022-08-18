<template>
  <div class="container">
    <el-dialog
      title="题目预览"
      @close="onClose"
      :visible="pvwVisible"
      width="66%"
    >
      <el-row>
        <el-col :span="6">【题型】：{{ questionType }}题</el-col>
        <el-col :span="6">【编号】：{{ detailInfo.id }}</el-col>
        <el-col :span="6">【难度】：{{ difficulty }}</el-col>
        <el-col :span="6">【标签】：{{ detailInfo.tags }}</el-col>
        <el-col :span="6">【学科】：{{ detailInfo.subject }}</el-col>
        <el-col :span="6">【目录】：{{ detailInfo.catalogID }}</el-col>
        <el-col :span="6">【方向】：{{ detailInfo.direction }}</el-col>
      </el-row>
      <hr />

      <div>【题干】：</div>
      <div class="questionTitle" v-html="detailInfo.question"></div>
      <div class="answer" v-if="detailInfo.questionType !== 3">
        <div style="padding-bottom: 5px">
          <span>{{ detailInfo.questionType === 1 ? "单选题" : "多选题" }}</span>
          选项：（以下选中的选项为正确答案）
        </div>
        <div class="options">
          <!-- 单选 -->
          <div v-if="detailInfo.questionType == 1">
            <el-radio
              class="radio"
              v-model="radio"
              :label="item.isRight"
              v-for="item in detailInfo.options"
              :key="item.id"
              @change="onChange"
              >{{ item.title }}</el-radio
            >
          </div>

          <!-- 多选 -->
          <el-checkbox-group
            v-model="checkList"
            v-if="detailInfo.questionType == 2"
            class="checkbox"
          >
            <el-checkbox
              :label="item.title"
              v-for="item in detailInfo.options"
              :key="item.id"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <hr />

      <div>
        <span>【参考答案】：</span>
        <el-button type="danger" @click="onShowVideo(detailInfo.videoUR)"
          >视频答案预览</el-button
        >
        <br />
        <video
          controls
          width="400"
          height="300"
          :src="detailInfo.videoURL"
          v-if="isShowVideo"
          muted
          autoplay
        ></video>
      </div>
      <hr />

      <div class="analysis">
        <span>【答案解析】：</span
        ><span v-html="detailInfo.answer" class="analysisContext"></span>
      </div>
      <hr />

      <div class="notes">
        <span>【题目备注】：{{ detailInfo.remarks }}</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { difficulty, questionType } from "@/api/hmmm/constants";
export default {
  data() {
    return {
      radio: 1,
      isShowVideo: false,
    };
  },
  props: {
    // 是否显示弹框
    pvwVisible: {
      type: Boolean,
      default: false,
    },
    // 信息
    detailInfo: {
      type: Object,
    },
  },
  methods: {
    // 关闭
    onClose() {
      this.$emit("update:pvwVisible", false);
    },
    onShowVideo(url) {
      if (url) {
        this.isShowVideo = true;
      }
    },
    onChange() {
      this.radio = 1;
    },
  },
  created() {
    console.log(this.detailInfo);
  },
  mounted() {
    console.log(this.detailInfo);
  },
  computed: {
    questionType() {
      const findItem = questionType.find(
        (item) => item.value == this.detailInfo.questionType
      );
      return findItem.label;
    },

    difficulty() {
      const findItem = difficulty.find(
        (item) => item.value == this.detailInfo.questionType
      );
      return findItem.label;
    },
    checkList() {
      let checkList = [];
      this.detailInfo.options.filter((item) => {
        if (item.isRight == 1) {
          return checkList.push(item.title);
        }
        return false;
      });
      return checkList;
    },
  },
};
</script>

<style scoped lang="less">
.el-col-6 {
  padding: 10px 0;
}
.questionTitle {
  color: blue;
}
.radio {
  display: block;
  padding: 8px 0;
}
.checkbox {
  display: flex;
  flex-direction: column;
  .el-checkbox {
    padding: 8px 0;
  }
}
.analysisContext {
  display: inline-block;
}
</style>

<template>
  <div class="container">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标签名称" size="small">
              <el-input v-model="formData.tags" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" size="small">
              <el-select
                style="width: 100%"
                v-model="formData.province"
                placeholder="请选择"
                @change="provinceChange"
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区" size="small">
              <el-select v-model="formData.city" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in cityList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称" size="small">
              <el-input v-model="formData.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" size="small">
              <el-select v-model="formData.state" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="padding-left: 40px;">
            <el-button size="small">清除</el-button>
            <el-button size="small" type="primary">搜索</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button size="small" type="success"><i class="el-icon-edit"></i>新增用户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { provinces, citys } from "@/api/hmmm/citys";
import {status} from "@/api/hmmm/constants"
export default {
  data() {
    return {
      formData: {
        tags: "", // 标签名称
        province: "", //城市
        city: "", // 地区
        shortName: "", //企业简称
        state: "", // 状态
      },
      provinceList: [], //省份列表
      cityList: [], //地区列表
      status, // 状态映射
    };
  },

  created() {
    this.provinceList = provinces();
  },

  methods: {
    // 城市点击改变
    provinceChange() {
      this.cityList = citys(this.formData.province);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  box-sizing: border-box;
}
</style>

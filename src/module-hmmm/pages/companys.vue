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
              <el-select
                v-model="formData.city"
                placeholder="请选择"
                style="width: 100%"
              >
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
              <el-select
                v-model="formData.state"
                placeholder="请选择"
                style="width: 100%"
              >
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
          <el-col :span="6" style="padding-left: 40px">
            <el-button size="small" @click="clear">清除</el-button>
            <el-button size="small" type="primary" @click="search"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button size="small" type="success" @click="addFn"
              ><i class="el-icon-edit"></i>新增用户</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <el-alert
        :title="`共${count}条记录（臧炼鑫）`"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      >
      </el-alert>

      <CompanysTable
        @editCompany="editCompany"
        :tableData="tableData"
        :loading="loading"
        @isEnable="isEnable"
        @delCompany="delCompany"
      />
      <el-row style="text-align: right">
        <el-pagination
          style="margin-top: 20px"
          background
          layout="prev, pager, next, sizes, jumper"
          :total="count"
          :page-sizes="[10, 20, 30, 50]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <CompanysAdd
      :titleInfo="{ text: titleInfoText, pageTitle: '用户' }"
      ref="companysAdd"
    />
  </div>
</template>

<script>
import { provinces, citys } from "@/api/hmmm/citys";
import { status } from "@/api/hmmm/constants";
import CompanysTable from "../components/CompanysTable.vue";
import { list as getCompanyListApi, disabled,remove as delCompanyApi } from "@/api/hmmm/companys";
import CompanysAdd from "../components/companys-add.vue";
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
      page: 1, // 当前页数
      pagesize: 10, //页尺寸
      count: 0, //总条数
      tableData: [], // 表格数据
      loading: false, // 表格加载
      titleInfoText: "", //弹框标题

      provinceList: [], //省份列表
      cityList: [], //地区列表
      status, // 状态映射
    };
  },

  created() {
    this.provinceList = provinces();
    this.getCompanyList();
  },


  methods: {
    // 城市点击改变
    provinceChange() {
      this.formData.city = "";
      this.cityList = citys(this.formData.province);
    },

    // 获取企业列表
    async getCompanyList() {
      this.loading = true;
      let formObj = {};
      for (let key in this.formData) {
        if (this.formData[key] !== "") {
          formObj[key] = this.formData[key];
        }
      }
      // console.log(formObj);
      const { data } = await getCompanyListApi({
        page: this.page,
        pagesize: this.pagesize,
        ...formObj,
      });
      // console.log(data);
      this.count = data.counts;
      this.tableData = data.items;
      this.loading = false;
    },

    // 搜索
    search() {
      this.getCompanyList();
    },

    // 分页按钮
    handleCurrentChange(val) {
      this.page = val;
      this.getCompanyList();
    },

    // 页面size
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCompanyList();
    },

    // 清除
    clear() {
      this.formData = {
        tags: "", // 标签名称
        province: "", //城市
        city: "", // 地区
        shortName: "", //企业简称
        state: "", // 状态
      };
    },

    //新增按钮
    addFn() {
      this.titleInfoText = "创建";
      this.$refs.companysAdd.dialogFormV();
    },

    // 修改
    editCompany(val) {
      // console.log(val);
      this.titleInfoText = "编辑";
      this.$refs.companysAdd.dialogFormV();
      this.$refs.companysAdd.formBase = JSON.parse(JSON.stringify(val));
    },

    // 是否禁用
    isEnable(val) {
      let state = val.state;
      let id = val.id;
      this.$confirm(`已成功${state ? "禁用" : "启用"}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          if (state === 1) {
            state = 0;
            await disabled({ id, state });
          } else {
            state = 1;
            await disabled({ id, state });
          }
          this.$message({
            type: "success",
            message: `${state ? "禁用" : "启用"}成功!`,
          });
          this.getCompanyList()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // 删除公司
    async delCompany(val){
      let id = val.id
      
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await delCompanyApi({id})
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getCompanyList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  components: {
    CompanysTable,
    CompanysAdd,
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  box-sizing: border-box;
}
</style>

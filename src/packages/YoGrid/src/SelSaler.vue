<template>
  <!-- 用户选择 弹出框 -->
  <div>
    <el-dialog
      :visible="visible"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="45%"
      top="8vh"
    >
      <!-- 顶部标题 -->
      <div slot="title">
        <el-breadcrumb separator class="Breadcrumb-Item">
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 用户部门弹窗 查询条件部分 -->
      <el-form
        :model="memberForm"
        ref="memberForm"
        label-position="left"
        label-suffix="："
        size="medium"
        label-width="90px"
      >
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item prop="name" label="名称">
              <el-input v-model="memberForm.name" clearable placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="Phone" label="手机号">
              <el-input v-model="memberForm.Phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="false">
            <el-form-item prop="memberyype" label="用户类型">
              <el-select
                v-model="memberForm.memberyype"
                clearable
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option key="1" label="单位" value="1"></el-option>
                <el-option key="2" label="个人" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" style="text-align: right">
            <el-button @click="handleQueryClick" type="primary" size="medium">查询</el-button>
            <el-button @click="handleResetClick" type="infomation" size="medium">重置</el-button>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="40">

        </el-row>-->
      </el-form>
      <el-table
        v-loading="isLoading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
        @row-click="doubC"
        @current-change="handleCurrentChange"
        :highlight-current-row="!MultipleSelection"
        :data="dataList"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" v-if="MultipleSelection"></el-table-column>
        <!-- <el-table-column type="index" width="50" :index="((PageIndex-1)*PageSize+1)">
        </el-table-column>-->
        <el-table-column prop="Name" align="left" label="名称" min-width="240" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column prop="RegisterName" align="left" label="联系人" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Mobile" align="left" label="联系电话" width="150"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="departCurrentChange"
        :current-page.sync="PageIndex"
        :page-size="PageSize"
        layout="total, prev, pager, next"
        :total="TotalCount"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CancelClick('memberForm')">取 消</el-button>
        <el-button @click="YesClick('memberForm')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      getDepartlist: '',
      memberForm: {
        name: '',
        code: '',
        memberyype: '',
        state: 30,
        Phone: ''
      },
      isLoading: false,
      PageIndex: 1, // 分页控件
      PageSize: 10,
      TotalCount: 0,
      dataList: [],
      selectedObj: [] // 被选中的
    }
  },
  props: {
    // 所属机构
    TradingOrgId: {
      type: String,
      default: ''
    },
    // 会员类型
    MemberType: {
      type: [Number, String],
      default: ''
    },
    // 会员类型 1企业 2 个人 3 监管机构,默认 1,2
    MemberTypes: {
      type: [Number, Array, String],
      default: ''
    },
    // 是买方用户
    IsBuyer: {
      type: Boolean,
      default: false
    },
    // 是转让方用户
    IsSaler: {
      type: Boolean,
      default: false
    },
    // 弹出层标题
    title: {
      type: String,
      default: '选择用户'
    },
    // 是否显示
    visible: {
      default: false
    },
    // 是否多选
    MultipleSelection: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    MemberType: function (val) {
      this.memberForm.memberyype = val
    },
    visible: function (val) {
      if (val) {
        this.getQueryData()
      }
    }
  },
  methods: {
    beforeClose (done) {
      this.$emit('update:visible', false)
      if (done) {
        done()
      }
      this.dataList = []
      this.TotalCount = 0
      this.memberForm.code = ''
      this.memberForm.name = ''
      this.memberForm.memberyype = ''
    },

    // 处理部门改变事件，下拉框自动刷新
    changeDepart (val) {
      this.getQueryData()
    },

    // 获取数据
    getQueryData () {
      this.isLoading = true
      let that = this
      var postdata = {
        PageSize: this.PageSize,
        PageIndex: this.PageIndex,
        SortKey: 'Id',
        SortType: 0,
        State: 20,
        Name: this.memberForm.name,
        Code: this.memberForm.code,
        Mobile: this.memberForm.Phone,
        MemberType: this.memberForm.memberyype
      }
      this.$http
        .post('/api/Member/QuerySalerPage', postdata)
        .then(res => {
          that.dataList = res.Items
          that.TotalCount = res.TotalCount
          that.isLoading = false
        })
        .catch(() => {
          that.isLoading = false
        })
    },

    // 处理图标和查询点击事件
    handleQueryClick () {
      // ;
      this.PageIndex = 1
      this.PageSize = 10
      this.getQueryData()
    },
    handleResetClick: function () {
      this.memberForm.name = ''
      this.memberForm.code = ''
      this.memberForm.memberyype = ''
      this.memberForm.Phone = ''
      this.getQueryData()
    },
    handleCurrentChange: function (val) {
      if (!this.MultipleSelection) {
        // console.log("单选");
        // console.log(val);
        this.selectedObj = val
      }
    },
    // 处理选中事件
    handleSelectionChange (val) {
      console.log(val)
      if (this.MultipleSelection) {
        // console.log("多选");
        // console.log(val);
        this.selectedObj = val
      }
    },

    // 部门页面改变处理事件,分页
    departCurrentChange (page) {
      this.PageIndex = page
      this.getQueryData()
    },

    // 取消
    CancelClick () {
      this.beforeClose()
    },

    // 确定
    YesClick (formName) {
      if (this.selectedObj.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选中一行数据'
        })
      } else {
        this.$emit('OutterSelected', this.selectedObj)
        // 关闭对话框
        this.$emit('update:visible', false)
      }
    },
    doubC (row, column, event) {
      this.YesClick('memberForm')
    }
  },
  mounted () {
    // this.getQueryData()
  }
}
</script>
<style scoped>
</style>

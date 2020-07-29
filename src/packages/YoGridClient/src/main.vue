<template>
  <div class="form-box">
    <el-form
      :model="realData.params"
      ref="searchForm"
      label-width="0px"
      size="small"
      label-position="left"
    >
      <div class="search-form-box">
        <div class="search-form-left">
          <el-row :gutter="5">
            <el-col v-if="realData.IsNeedBusiness" :span="6">
              <el-form-item prop="BusinessTypeId">
                <el-select
                  placeholder="请选择标的类型"
                  v-model="realData.params.BusinessTypeId"
                  clearable
                  style="width:100%"
                  @clear="clearData('BusinessTypeId')"
                >
                  <el-option
                    v-for="item in BusinessTypeIds"
                    :key="item.BusinessTypeId"
                    :label="item.BusinessTypeName"
                    :value="item.BusinessTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-for="(item, index) in realData.formLabel" :key="index">
              <el-form-item>
                <yo-enum v-if="item.type==='enum'" :EnumName="item.enumName" size='small' :isNeedForm="false" :selValue.sync="realData.params[item.value]" :label="item.name" prop="none"></yo-enum>
                <el-input
                  class="user-input"
                  v-if="item.type == 'input'"
                  type="text"
                  clearable
                  :placeholder="'请输入' + item.name"
                  v-model.trim="realData.params[item.value]"
                ></el-input>
                <el-date-picker
                  v-if="item.type=='date'"
                  :format="item.format"
                  :value-format="item.format"
                  type="date"
                  :placeholder="'请选择' + item.name"
                  v-model="realData.params[item.value]"
                  style="width:100%"
                  clearable
                ></el-date-picker>
                <el-date-picker
                  v-if="item.type=='datetime'"
                  :format="item.format"
                  :value-format="item.format"
                  type="datetime"
                  :placeholder="'请选择' + item.name"
                  v-model="realData.params[item.value]"
                  style="width:100%"
                  clearable
                ></el-date-picker>
                <el-select
                  v-if="item.type =='select'"
                  :placeholder="'请选择' + item.name"
                  :disabled="item.disabled"
                  v-model="realData.params[item.value]"
                  clearable
                  style="width:100%"
                  @clear="clearData(item.value)"
                >
                  <el-option
                    v-for="li in item.options"
                    :key="li.Value"
                    :label="li.Description"
                    :value="li.Value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn-box">
          <el-form-item style="text-align: right" label-width="0">
            <yo-button
              type="primary"
              class="yo-iconfont project-main-btn main-btn"
              :loading="searchLoading"
              @click="searchData"
            >查询</yo-button>
            <yo-button
              class="yo-iconfont project-dft-btn default-btn"
              :loading="reLoading"
              @click="resetData"
            >重置</yo-button>
            <span class="el-button-drop pointer" v-if="showFold" @click="foldbtn">
              {{Expend ? '收起' : '展开'}}
              <i class="el-icon-arrow-up" v-if="Expend"></i>
              <i class="el-icon-arrow-down" v-if="!Expend"></i>
            </span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <slot name="btn-box"></slot>
    <ul class="flex-box flex-start annc-state-ul-box" v-if="realData.ViewStateKey">
      <!--  -->
      <li
        v-for="(item, index) in realData.ViewStateList"
        :key="item.Value"
        @click="choseViewState(index, item.Value)"
        :class="[ViewStateIndex === index ? 'active' : '']"
      >{{ item.Description }}</li>
    </ul>
    <div class="table-box" v-loading="loading">
      <slot></slot>
      <div class="page-ination" v-if="showPagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="requireData.PageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="requireData.PageSize"
          layout="prev, pager, next,total, jumper"
          :total="requireData.TotalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'YoGridClient',
  props: {
    showPagination: {
      type: Boolean,
      default: true,
      required: false
    }, // 是否显示分页
    gridData: {
      type: Object,
      default: function () {
        return {
          formLabel: []
        }
      },
      required: false
    },
    isReserveParam: {
      type: Object,
      default: function () {
        return {
          is: false,
          Params: []
        }
      },
      required: false
    }
  },
  data () {
    return {
      reLoading: false,
      searchLoading: false,
      loading: false,
      realData: this.gridData,
      ViewStateIndex: 0,
      AnncClientViewState: [
        { Value: 70, Description: '已审核' },
        { Value: 80, Description: '未审核' }
      ], // 视图状态
      Expend: false,
      showFold: false,
      title: '签约管理',
      States: [], // 状态枚举
      searchForm: {
        AnncCode: '',
        AnncName: '',
        BiddingName: '',
        BiddingCode: '',
        State: null,
        IsBuyer: false,
        IsSaler: false,
        PageIndex: 1,
        PageSize: 10
      },
      requireData: {
        PageIndex: 1,
        PageSize: 10,
        TotalCount: 0
      },
      BusinessTypeIds: [], // 标的类型
      RefoldList: []
    }
  },
  created () {
    if (
      this.realData.formLabel.length > 3 &&
      this.realData.IsNeedBusiness === true
    ) {
      this.showFold = true
      this.RefoldList = this.realData.formLabel.splice(
        3,
        this.realData.formLabel.length - 3
      )
    } else if (
      this.realData.formLabel.length > 4 &&
      this.realData.IsNeedBusiness !== true
    ) {
      this.showFold = true
      this.RefoldList = this.realData.formLabel.splice(
        4,
        this.realData.formLabel.length - 4
      )
    } else {
      this.showFold = false
    }
    if (this.realData.IsNeedBusiness) {
      this.getBusinessPT()
    }
    this.getList()
  },
  methods: {
    getBusinessPT () {
      let that = this
      that.$http
        .post(
          '/api/TradingOrgApi/QueryBusinessTypeList?tradingOrgId=' + this.OrgId
        )
        .then(res => {
          that.BusinessTypeIds = res
        })
    },
    foldbtn () {
      this.Expend = !this.Expend
      if (this.Expend) {
        this.realData.formLabel = this.realData.formLabel.concat(
          this.RefoldList
        )
      } else {
        if (this.realData.IsNeedBusiness === true) {
          this.realData.formLabel.splice(3, this.realData.formLabel.length - 3)
        } else {
          this.realData.formLabel.splice(4, this.realData.formLabel.length - 4)
        }
      }
    },
    // 选择视图状态时
    choseViewState (index, value) {
      this.ViewStateIndex = index
      this.realData.params.PageIndex = 1
      this.realData.params[this.realData.ViewStateKey] = value
      this.searchData()
    },
    searchData () {
      this.getList()
    },
    resetData () {
      this.reLoading = true
      for (var key in this.realData.params) {
        if (key === 'PageIndex') {
          this.realData.params[key] = 1
        } else if (key === 'PageSize') {
          this.realData.params[key] = 10
        } else {
          this.realData.params[key] = ''
        }
      }
      if (this.isReserveParam.is) {
        this.isReserveParam.Params.forEach(element => {
          this.realData.params[element.Name] = element.Value
          this.ViewStateIndex = 0
        })
      }
      this.getList()
    },
    clearData (data) {
      this.realData.params.data = null
    },
    handleSizeChange (val) {
      this.realData.params.PageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.realData.params.PageIndex = val
      this.getList()
    },
    // 获取合同列表数据
    getList () {
      var that = this
      that.loading = true
      let tempRes = {
        PageIndex: 1,
        PageSize: 10,
        TotalCount: 0,
        ExtData: null,
        Items: []
      }
      if (that.realData.api) {
        that.$http
          .post(that.realData.api, that.realData.params)
          .then(res => {
            that.loading = false
            that.reLoading = false
            that.searchLoading = false
            if (res) {
              tempRes = res
            }
            that.requireData = tempRes
            that.$emit('update:requireData', tempRes)
          })
          .catch(() => {
            that.loading = false
            that.reLoading = false
            that.searchLoading = false
            that.$emit('update:requireData', tempRes)
          })
      }
    }
  }
}
</script>
<style scoped>
.search-form-box {
  display: flex;
}
.search-form-left {
  width: calc(100% - 240px);
}
.search-btn-box {
  width: 240px;
}
</style>

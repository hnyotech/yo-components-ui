<template>
  <div class="my-grid" @keyup.enter="searchTableData" @submit.prevent>
    <div class="my-grid__header" v-if="defaultShowHidden && isSearch">
      <YoToolBar v-if="$slots.toolbar">
        <slot name="toolbar"></slot>
      </YoToolBar>
      <YoButton
        type="primary"
        size="medium"
        @click="handleCollapse"
        v-if="gridData.formLabel.length > 1"
        style="float: right;margin-left: 20px;margin-top: 6px;"
      >
        <i class="el-icon-arrow-down" style="font-size:10px;"></i>
        高级搜索
      </YoButton>
      <el-input
        :placeholder="quicksearchPlaceholder"
        size="medium"
        v-model="realData.params[quickSearch]"
        style="float:right;width:20%;margin-top: 6px;"
        @keyup.enter="handleQuickSearchFromInput"
        :clearable="true"
      >
        <YoButton slot="append" icon="el-icon-search" @click="handleQuickSearch"></YoButton>
      </el-input>
    </div>
    <div v-show="!defaultShowHidden && isShowQuick && isSearch" class="cos_hide_box">
      <span class="cos_hide" @click="handleCollapse">
        收起
        <i class="el-icon-arrow-up"></i>
      </span>
    </div>
    <div class="divider_cos"></div>
    <div v-show="!defaultShowHidden && isSearch" class="my-grid__moresearch">
      <el-form
        :model="realData.params"
        class="detail-form"
        ref="form"
        :label-width="labelWidth"
        :label-suffix="labelSuffix"
        size="medium"
        label-position="left"
      >
        <el-row :gutter="40">
          <el-col v-if="realData.IsNeedSubjectType" :span="8">
            <el-form-item label="业务类型" prop="BusinessTypeParentId">
              <el-select
                placeholder="请选择业务类型"
                v-model="realData.params.BusinessTypeParentId"
                @change="SubjectTypeIdsChange"
                clearable
                style="width:100%"
                @clear="clearData('BusinessTypeParentId')"
              >
                <el-option
                  v-for="item in SubjectTypeIds"
                  :key="item.BusinessTypeId"
                  :label="item.BusinessTypeName"
                  :value="item.BusinessTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="realData.IsNeedSubjectType" :span="8">
            <el-form-item label="标的类型" prop="BusinessTypeId">
              <el-select
                placeholder="请选择标的类型"
                v-model="realData.params.BusinessTypeId"
                clearable
                style="width:100%"
                @clear="clearData('BusinessTypeId')"
              >
                <el-option
                  v-for="item in SubjectTypeIdsBusinessTypeIds"
                  :key="item.BusinessTypeId"
                  :label="item.BusinessTypeName"
                  :value="item.BusinessTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="realData.IsNeedBusiness" :span="8">
            <el-form-item label="标的类型" prop="BusinessTypeId">
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

          <el-col v-for="(item,index) in realData.formLabel" :key="item.key" :span="item.span">
            <yo-enum v-if="item.type==='enum'" :EnumName="item.enumName" :selValue.sync="realData.params[item.value]"
                     :label="item.name" prop="none"></yo-enum>
            <el-form-item v-else :label="item.name" :prop="item.value">
              <el-input
                v-if="item.type == 'input'"
                class="user-input"
                type="text"
                :placeholder="'请输入' + item.name"
                v-model.trim="realData.params[item.value]"
                clearable
              ></el-input>
              <el-date-picker
                v-if="item.type=='date'"
                :format="item.format"
                :picker-options="item.pickerOptions"
                :value-format="item.format"
                type="date"
                placeholder="请选择日期"
                v-model="realData.params[item.value]"
                style="width:100%"
                clearable
              ></el-date-picker>
              <el-date-picker
                v-if="item.type=='datetime'"
                :format="item.format"
                :value-format="item.format"
                type="datetime"
                placeholder="请选择时间"
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
              <el-input
                v-if="item.type =='inputselect'"
                type="text"
                clearable
                :placeholder="'请输入' + item.name"
                v-model.trim="realData.params[item.value]"
                maxlength="300"
                @focus="chooseSaler(index)"
              ></el-input>
            </el-form-item>
          </el-col>
          <slot name="otherFormItem"></slot>
          <slot name="inputSel"></slot>
        </el-row>
      </el-form>
      <div style="padding:0 20px;text-align:right;">
        <YoButton
          icon="el-icon-setting"
          size="medium"
          class="my-query__reset"
          :loading="reLoading"
          @click="reset()"
        >重置
        </YoButton>
        <YoButton
          type="primary"
          size="medium"
          icon="el-icon-search"
          :loading="searchLoading"
          @click="searchTableData()"
        >搜索
        </YoButton>
      </div>
    </div>
    <div class="my-grid__body">
      <div>
        <div v-show="unitGroup" :style="{'text-align': unitAlign}">
          <slot name="buttonGroup"></slot>
        </div>
        <div v-show="needtabs" :style="{'text-align': tabsAlign}">
          <slot name="tabsBox"></slot>
        </div>
      </div>
      <div v-loading="loading">
        <slot></slot>
      </div>
    </div>
    <div class="my-grid__footer">
      <el-pagination
        v-if="showPagination"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
        :current-page="PageIndex"
        :page-size="PageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="TotalCount"
      ></el-pagination>
    </div>
    <select-saler
      :visible.sync="selectSalerDialog"
      ref="participantdialog"
      :IsSaler="true"
      title="选择转让方"
      :MultipleSelection="false"
      @OutterSelected="selectSalerMember"
    ></select-saler>
  </div>
</template>

<script>
  import YoButton from "../../YoButton/src/main.vue";
  import SelectSaler from "./SelSaler.vue";

  export default {
    name: "YoGrid",
    components: {
      YoButton,
      SelectSaler
    },
    data() {
      return {
        Formindex: null,
        selectSalerDialog: false, // 选择转让方
        reLoading: false,
        searchLoading: false,
        quickSearch: this.quickSearchVal,

        // showHidden: false,
        PageIndex: 1,
        PageSize: 10,
        defaultShowHidden: this.showQuick,
        layout: "total, sizes, prev, pager, next, jumper",
        pageSizes: [10, 20, 30, 40, 50, 100],
        requireData: {},
        realData: this.gridData,
        oldParams: {},
        TotalCount: 0,
        loading: false,
        BusinessTypeIds: [],// 标的类型
        SubjectTypeIds: [], // 业务类型
        SubjectTypeIdsBusinessTypeIds: [] // 业务类型
      };
    },
    beforeCreate() {
    },
    created: function () {
      this.oldParams = JSON.parse(JSON.stringify(this.realData.params))
    },
    mounted: function () {
      if (this.realData.IsNeedBusiness) {
        this.getBusinessPT()
      }
      if (this.realData.IsNeedSubjectType) {
        this.getSubjectTypeIds()
      }
      this.seesionParams()
      this.urlParams()
      if (this.realData.params.hasOwnProperty("YoGridCollapse")) {
        this.defaultShowHidden = this.realData.params.YoGridCollapse;
      } else {
        this.realData.params.YoGridCollapse = this.defaultShowHidden;
      }
      this.allowSearch("isPage");
    },
    computed: {},
    props: {
      labelSuffix: {
        type: String,
        default: '：',
        required: false
      },
      quicksearchPlaceholder: String,
      paginationCallBack: {
        type: Function,
        default: () => {
        },
        required: false
      },// 分页回调
      isSearch: {
        type: Boolean,
        default: true,
        required: false
      }, // 是否显示搜索
      showQuick: {
        type: Boolean,
        default: true,
        required: false
      }, // 是否显示快速搜索
      isShowQuick: {
        type: Boolean,
        default: true,
        required: false
      }, // 是否不显示快速搜索
      showPagination: {
        type: Boolean,
        default: true,
        required: false
      },
      unitGroup: {
        type: Boolean,
        default: false,
        required: false
      }, // 是否显示单位组合
      needtabs: {
        type: Boolean,
        default: false,
        required: false
      }, // 是否显示tabs
      IsNotNeedSaveParams: {
        type: Boolean,
        default: false,
        required: false
      },
      labelWidth: {
        type: String,
        default: '100px'
      },
      gridData: {
        type: Object,
        default: function () {
          return {
            formLabel: []
          };
        },
        required: false
      },
      tabsAlign: {
        type: String,
        default: "left",
        required: false
      }, // tabs所在的位置
      unitAlign: {
        type: String,
        default: "left",
        required: false
      }, // 单位所在的位置
      quickSearchVal: {
        type: String,
        default: "",
        required: false
      },
      isReserveParam: {
        type: Object,
        default: function () {
          return {
            is: false,
            Params: []
          };
        },
        required: false
      }
    },
    methods: {
      seesionParams() {
        let paramsList = this.$store.getters.paramsList;
        for (let i = 0; i < paramsList.length; i++) {
          if (paramsList[i][this.$route.name]) {
            for (let a in this.realData.params) {
              if (paramsList[i][this.$route.name][a]) {
                this.$set(this.realData.params, a, paramsList[i][this.$route.name][a])
              }
            }
          }
        }
      },
      urlParams() {
        let queryParams = this.$route.query
        if (queryParams) {
          for (let i in queryParams) {
            for (let a in this.realData.params) {
              if (i == a) {
                this.defaultShowHidden = false
                if (i === 'PageIndex' || a === 'PageIndex' || i === 'PageSize' || a === 'PageSize') {
                  this.$set(this.realData.params, a, Number(queryParams[i]) + 0)
                } else {
                  this.$set(this.realData.params, a, queryParams[i])
                }
              }
            }
          }
        }
      },
      getBusinessPT() {
        let that = this
        let tradingOrgId = that.$store.getters.user.TradingOrgId;
        that.$http
          .post(
            "/api/TradingOrg/QueryBusinessTypeList?tradingOrgId=" + tradingOrgId
          )
          .then(res => {
            that.BusinessTypeIds = res;
          });
      },
      SubjectTypeIdsChange(val) {
        this.SubjectTypeIdsBusinessTypeIds = []
        for (let a in this.SubjectTypeIds) {
          if (this.SubjectTypeIds[a].BusinessTypeId === val) {
            this.SubjectTypeIdsBusinessTypeIds = this.SubjectTypeIds[a].Children
            return false
          } else {
            this.SubjectTypeIdsBusinessTypeIds = []
            this.realData.params.BusinessTypeId = null
          }
        }
      },
      getSubjectTypeIds() {
        this.realData.params.BusinessTypeParentId = ''
        this.realData.params.BusinessTypeId = ''
        let that = this
        that.$http
          .post(
            "/api/TradingOrg/QueryAllBusinessTypeList"
          )
          .then(res => {
            this.SubjectTypeIds = []
            this.SubjectTypeIdsBusinessTypeIds = []
            if (res) {
              that.SubjectTypeIds = res;
            }
          });
      },
      chooseSaler(index) {
        this.selectSalerDialog = true;
        this.Formindex = index;
      },
      // 显示选择的转让方
      selectSalerMember(data) {
        if (data) {
          // Formindex
          this.realData.params[this.realData.formLabel[this.Formindex].value] =
            data.Name;
        } else {
          console.error("selectSalerMember is null");
        }
      },
      searchTableData() {
        // console.log(this.realData);
        this.searchLoading = true;
        this.search();
        this.$emit("search");
      },
      reset() {
        this.reLoading = true;
        for (var key in this.realData.params) {
          if (key === "PageIndex") {
            this.realData.params[key] = 1;
          } else if (key === "PageSize") {
            this.realData.params[key] = 10;
          } else {
            this.realData.params[key] = "";
          }
        }
        if (this.isReserveParam.is) {
          this.isReserveParam.Params.forEach(element => {
            this.realData.params[element.Name] = element.Value;
          });
        }
        this.$emit('reset', this.realData.params)

        this.search();
      },
      clearData(data) {
        if (data === 'BusinessTypeParentId') {
          this.realData.params.BusinessTypeId = null
        }
        this.realData.params.data = null;
      },
      // table数据搜索函数
      search(data) {
        let that = this;
        that.allowSearch(data)
      },
      allowSearch(data) {
        let that = this;
        that.oldParams = JSON.parse(JSON.stringify(that.realData.params))
        that.loading = true;
        let paramsList = that.$store.getters.paramsList;
        if (!data) {
          that.realData.params.PageIndex = 1;
        }
        if (that.realData.api) {
          that
            .$http({
              method: that.realData.methods,
              url: that.realData.api,
              data: that.realData.params
            })
            .then(res => {
              this.loading = false;
              if (res.TotalCount > 0 && that.realData.params.PageIndex > 1 && res.Items.length === 0) {
                that.realData.params.PageIndex = 1
                that.search('isPage')
                return
              }
              this.searchLoading = false;
              this.reLoading = false;
              if (!that.IsNotNeedSaveParams) {
                let key = that.$route.name;
                // console.log(key)
                let obj = {};
                obj[key] = that.realData.params;
                if (paramsList.length === 0) {
                  paramsList.push(obj);
                } else {
                  let flag = false;
                  for (let val in paramsList) {
                    if (paramsList[val].hasOwnProperty(key)) {
                      paramsList[val][key] = that.gridData.params;
                      flag = true;
                    }
                  }
                  if (!flag) {
                    paramsList.push(obj);
                  }
                }
              }
              that.PageIndex = that.realData.params.PageIndex;
              that.PageSize = that.realData.params.PageSize;
              that.TotalCount = res.TotalCount;
              that.requireData = res;
              // sessionStorage.setItem('paramsList',JSON.stringify(paramsList))
              if (!that.IsNotNeedSaveParams) {
                that.$store.commit("UPDATE_PARAMSlIST", paramsList);
              }
              // resolve(res);
              that.$emit("update:requireData", res);
              // this.loading = false;
            })
            .catch(() => {
              this.searchLoading = false;
              this.reLoading = false;
            });
        }
      },
      handleCollapse() {
        this.defaultShowHidden = !this.defaultShowHidden;
        this.realData.params.YoGridCollapse = this.defaultShowHidden;
      },
      handleQuickSearch() {
        let val = this.realData.params[this.quickSearch];
        for (var key in this.realData.params) {
          if (key === "PageIndex") {
            this.realData.params[key] = 1;
          } else if (key === "PageSize") {
            this.realData.params[key] = 10;
          } else {
            if (this.isReserveParam.is) {
              // 解决公告审核重置和快速搜索给公告状态赋值的问题。
              let keyName = this.isReserveParam.Params.find(
                item => item.Name === key
              );
              if (keyName) {
                this.realData.params[key] = keyName.Value;
              } else {
                this.realData.params[key] = "";
              }
            } else {
              this.realData.params[key] = "";
            }
          }
        }
        this.realData.params[this.quickSearch] = val;
        this.search();
      },
      handleQuickSearchFromInput() {
        this.search();
      },
      handleSizeChange(val) {
        this.realData.params.PageSize = val;
        this.search("isPage");
        this.paginationCallBack(this.realData.params)
      },
      handleIndexChange(val) {
        this.realData.params.PageIndex = val;
        this.search("isPage");
        this.paginationCallBack(this.realData.params)
      }
    }
  };
</script>

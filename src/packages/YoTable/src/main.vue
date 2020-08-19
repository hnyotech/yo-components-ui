<template>
  <el-table
    ref="multipleTable"
    :data="tableData.Items"
    :border="border"
    :show-summary="showSummary"
    :summary-method="summaryMethod"
    :row-key="rowKey"
    default-expand-all
    :tree-props="treeProps"
    @selection-change="handleSelectionChange"
    class="yo-table"
    :class="border ? 'yo-border-table' : ''"
    style="width: 100%;"
  >
    <el-table-column type="selection" key="selection" align="center" v-if="IsNeedSelect" width="50"></el-table-column>
    <el-table-column
      type="index"
      width="50"
      :index="((tableData.PageIndex-1)*tableData.PageSize+1)"
      align="center"
      label="序号"
    ></el-table-column>
    <el-table-column
      v-for="item in displayData"
      :key="item.key"
      :align="item.align"
      :prop="item.key"
      :label="item.label"
      :min-width="item.width"
      :show-overflow-tooltip="item.tooltip"
      :formatter="formatter"
    >
      <!-- :min-width="item.label.length*30" -->
      <template slot-scope="scope">
        <div v-if="item.type === 'multKey'" class="otw">
          <span v-for="(subitem,index) in item.keys" :key="index">
            {{scope.row[subitem]}}
            <span
              v-if="scope.row[subitem]!==null&&item.keys.length!==index+1"
            >{{item.separateSymbol}}</span>
          </span>
        </div>
        <div v-if="item.type === 'date'" class="otw">
          <span v-for="(subitem,index) in item.keys" :key="index">
            {{datefmt(scope.row[subitem], item.format)}}
            <span
              v-if="scope.row[subitem]!==null&&item.keys.length!==index+1"
            >{{item.separateSymbol}}</span>
          </span>
        </div>
        <div v-if="item.type === 'money'" class="otw">{{numberTurn(scope.row[item.key])}}</div>
        <div
          v-if="item.type === 'normal' || item.type === undefined"
          class="otw"
        >{{scope.row[item.key]}}</div>
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>
<script>
export default {
  name: "YoTable",
  props: {
    tableData: {
      type: Object,
      required: true,
      default: function () {
        return {
          PageIndex: 1,
          PageSize: 10,
          Items: [],
        };
      },
    },
    displayData: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    showSummary: {
      type: Boolean,
      required: false,
      default: false,
    },
    summaryMethod: {
      type: Function,
      required: false,
      default: () => {
        return [];
      },
    },
    formatter: {
      type: Function,
      required: false,
      default: () => {}
    },
    rowKey: {
      type: String,
      required: false,
      default: "",
    },
    treeProps: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    IsNeedSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    border: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isLoading2: false,
      // requireData: {
      //   Item: []
      // },
      // gridData: {
      //   table: [
      //     {
      //       key: 'BusinessTypeParentName',
      //       keys: ['BusinessTypeParentName', 'BusinessTypeName'],
      //       label: '标的类型',
      //       width: 90,
      //       align: 'center',
      //       tooltip: true,
      //       type: 'multKey',
      //       separateSymbol: ' - '
      //     },
      //     {
      //       key: 'AnncCode',
      //       label: '公告编号',
      //       width: 90,
      //       align: 'center',
      //       tooltip: true
      //     },
      //     {
      //       key: 'AnncName',
      //       label: '公告名称',
      //       width: 100,
      //       align: 'left',
      //       tooltip: true
      //     },
      //     {
      //       key: 'SalerName',
      //       label: '转让方',
      //       width: 100,
      //       align: 'left',
      //       tooltip: true
      //     },
      //     {
      //       key: 'PreDisclosureSituation_V',
      //       label: '预披露情况',
      //       width: 90,
      //       align: 'center',
      //       tooltip: true
      //     },
      //     {
      //       key: 'State_V',
      //       label: '公告状态',
      //       align: 'left',
      //       width: 80,
      //       tooltip: true
      //     },
      //     {
      //       key: 'PublishTime',
      //       keys: ['PublishTime', 'RegistDeadline'],
      //       label: '挂牌日期',
      //       width: 90,
      //       align: 'center',
      //       tooltip: true,
      //       type: 'date',
      //       separateSymbol: '/',
      //       format: 'YYYY-MM-DD'
      //     },
      //     {
      //       key: 'RegistDeadline',
      //       label: '报名截止日期',
      //       align: 'left',
      //       width: 80,
      //       tooltip: true
      //     },
      //     {
      //       key: 'DepositDeadline',
      //       label: '保证截止日期',
      //       align: 'center',
      //       width: 100,
      //       tooltip: true
      //     }
      //   ]
      // }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("selectChange", val);
    },

    numberTurn(num) {
      var result = [];
      var counter = 0;
      var arr;
      var arr2;
      if (
        num !== "undefined" &&
        num !== null &&
        num !== "" &&
        num !== undefined
      ) {
        if (num.toString().indexOf(".")) {
          arr = num.toString().split(".");
          arr2 = arr[1];
        }
        var arr1 = (arr[0] || 0).toString().split("");
        for (var i = arr1.length - 1; i >= 0; i--) {
          counter++;
          result.unshift(arr1[i]);
          if (!(counter % 3) && i !== 0) {
            result.unshift(",");
          }
        }
        if (arr2) {
          return result.join("") + "." + arr2;
        } else {
          return result.join("");
        }
      }
      if (num === 0) {
        return 0;
      }
    },
  },
};
</script>
<style scoped>
.otw {
  display: inline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* .yo-table.el-table--border td, .yo-table.el-table--border th, .yo-table >>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 0;
}
.yo-table {
  border: 0;
}
.yo-table.el-table--border::after, .yo-table.el-table--group::after {
  display: none
}
.yo-table /deep/ .el-table--border {
  border: none !important;
} */
</style>

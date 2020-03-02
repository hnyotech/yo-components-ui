<template>
  <el-table ref="multipleTable" :data="tableData" :show-summary="showSummary" :summary-method="summaryMethod" class="yo-table" style="width: 100%;">
    <el-table-column
      type="index"
      width="50"
      :index="((pageData.index-1)*pageData.size+1)"
      align="center"
      label="序号"
    ></el-table-column>
    <el-table-column
      v-for="item in displayData"
      :key="item.key"
      :align="item.align"
      :prop="item.key"
      :label="item.label"
      :min-width="item.label.length*30"
      :show-overflow-tooltip="item.tooltip"
    >
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
  name: 'YoTable',
  props: {
    tableData: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    displayData: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    pageData: {
      type: Object,
      required: true,
      default: function () {
        return {
          index: 1,
          size: 10
        }
      }
    },
    showSummary: {
      type: Boolean,
      required: false,
      default: false
    },
    summaryMethod: {
      type: Function,
      required: false,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      isLoading2: false
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
    }
  }
}
</script>
<style scoped>
.otw {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.yo-table.el-table--border td, .yo-table.el-table--border th, .yo-table >>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 0;
}
.yo-table {
  border: 0;
}
.yo-table.el-table--border::after, .yo-table.el-table--group::after {
  display: none
    /* top: 0;
    right: 0;
    width: 1px;
    height: 100%; */
}
.yo-table /deep/ .el-table--border {
  border: none !important;
}
</style>

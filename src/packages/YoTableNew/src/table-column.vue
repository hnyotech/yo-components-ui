<template>
    <el-table-column
            v-if="paramsStatus(tableColumnParams.key)"
            :prop="tableColumnParams.key"
            :label="tableColumnParams.label || tableColumnParams.key"
            :width="columnWidth(tableColumnParams.width)"
            :min-width="labelHead(tableColumnParams.label || tableColumnParams.key)"
            :fixed="paramsStatus(tableColumnParams.fixed)"
            :align="columnAlign(tableColumnParams.align)"
            :show-overflow-tooltip="paramsStatus(tableColumnParams.showOverflowTooltip)"
    >
        <template slot="header" slot-scope="scope">
            {{tableColumnParams.label || tableColumnParams.key}}
        </template>
        <template slot-scope="scope">
            <el-input v-if="paramsStatus(tableColumnParams.type)==='input'" v-model="scope.row[tableColumnParams.key]"></el-input>
            <span v-else-if="paramsStatus(tableColumnParams.formatter)" v-html="tableColumnParams.formatter(scope.row, scope.column, scope.row[tableColumnParams.key], scope.$index)"></span>
            <span v-else v-html="scope.row[tableColumnParams.key]"></span>
        </template>
        <yo-table-column v-for="(item,itemIndex) in tableColumnParams.children" :key="RandomUniqueValue()" :tableColumnParams="item"></yo-table-column>
    </el-table-column>
</template>
<script>
import YoTableColumn from './table-column'

export default {
  name: 'YoTableColumn',
  components: {YoTableColumn},
  props: {
    tableColumnParams: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  watch: {
    tableColumnParams(val, old) {
      this.$nextTick(function() {
        this.tableColumnParams = val
      })
    }
  },
  mounted() {

  },
  methods: {
    labelHead(label) {
      let l = label.length
      let f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      let minWidth = f * l + 40 // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      return minWidth
    },
    paramsStatus(val) {
      if (val === '' || val === null || val === undefined || val === false) {
        return false
      } else {
        return val
      }
    },
    defaultValue(val, defaultVal) {
      if (this.paramsStatus(val)) {
        return val
      } else {
        return defaultVal
      }
    },
    columnWidth(val) {
      return this.defaultValue(val, '')
    },
    columnAlign(val) {
      return this.defaultValue(val, 'left')
    }
  }
}
</script>


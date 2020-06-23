<template>
    <el-table
            :data="tableData.Items"
            :fit="true"
            :highlight-current-row="true"
            @selection-change="handleSelectionChange"
            style="width: 100%"
    >
        <el-table-column
                type="selection"
                key="selection"
                align="center"
                v-if="IsNeedSelect"
                width="50">
        </el-table-column>
        <el-table-column
                type="index"
                width="50"
                v-if="numShow"
                :index="((tableData.PageIndex-1)*tableData.PageSize+1)"
                align="center"
                label="序号"
        ></el-table-column>
        <slot name="tableBefore"></slot>
        <yo-table-column v-for="(item) in tableParams" :key="RandomUniqueValue()" :tableColumnParams="item"></yo-table-column>
        <slot name="tableAfter"></slot>
    </el-table>
</template>
<script>
import YoTableColumn from './table-column'

export default {
  name: 'YoTableNew',
  components: {
    YoTableColumn
  },
  props: {
    tableParams: {
      type: Array,
      default: []
    },
    tableData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    IsNeedSelect: {
      type: Boolean,
      default: false
    },
    numShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  watch: {
    tableParams(val, old) {
      this.$nextTick(function() {
        this.tableParams = val
        if (this.numShow && this.tableParams[0] && this.tableParams[0].label !== '序号') {
          this.tableParams.unshift({
            key: '---',
            label: '序号',
            align: 'center',
            formatter(row, column, cellValue, index) {
              return Number(index) + 1
            }
          })
        }
      })
    }
  },
  mounted() {

  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('selectChange', val)
    }
  }
}
</script>


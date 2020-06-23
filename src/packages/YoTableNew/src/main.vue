<template>
    <el-table
            :data="tableDataList.Items"
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
                :index="((tableDataList.PageIndex-1)*tableDataList.PageSize+1)"
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
      tableDataList:{}
    }
  },
  created() {

  },
  watch: {
    tableData:{
      handler(newval){
        this.tableDataList = newval
      },
      deep:true
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


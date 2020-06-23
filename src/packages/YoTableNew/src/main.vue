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
      :fixed="isHaveFixed?'left':false"
      v-if="isNeedSelect"
      width="50">
    </el-table-column>
    <el-table-column
      type="index"
      width="50"
      :key="RandomUniqueValue()"
      :fixed="isHaveFixed?'left':false"
      v-if="numShow"
      :index="((tableDataList.PageIndex-1)*tableDataList.PageSize+1)"
      align="center"
      label="序号"
    ></el-table-column>
    <slot name="tableBefore"></slot>
    <yo-table-column v-for="(item,index) in tableParamsArr" :key="RandomUniqueValue()"
                     :tableColumnParams="item"></yo-table-column>
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
      isHaveFixed: {
        type: Boolean,
        default: false
      },
      isNeedSelect: {
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
        tableDataList: {},
        tableParamsArr: []
      }
    },
    mounted() {
      this.tableDataList = this.tableData
      this.tableParamsArr = this.tableParams
    },
    watch: {
      tableData: {
        handler(newval) {
          this.tableDataList = newval
        },
        deep: true,
        immediate: true
      },
      tableParams: {
        handler(newval) {
          this.tableParamsArr = newval
        },
        deep: true,
        immediate: true
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


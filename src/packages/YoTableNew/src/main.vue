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
      v-show="IsNeedSelect"
      width="50">
    </el-table-column>
    <el-table-column
      type="index"
      width="50"
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
        tableDataList: {},
        tableParamsArr:[]
      }
    },
    created() {

    },
    watch: {
      tableData: {
        handler(newval) {
          this.tableDataList = newval
        },
        deep: true
      },
      tableParams: {
        handler(newval) {
          this.tableParamsArr = newval
          this.$nextTick(function () {
            if (this.numShow && this.tableParamsArr[0].label !== '序号') {
              this.tableParamsArr.unshift({
                key: '---',
                label: '序号',
                align: 'center',
                formatter(row, column, cellValue, index) {
                  return ((this.tableDataList.PageIndex - 1) * this.tableDataList.PageSize + 1) + Number(index) + 1
                }
              })
            }
          })
        },
        deep: true
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


<template>
    <el-dialog class="my-lookup-dialog" :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" @keyup.enter.native="handleSearch" @submit.native.prevent>
        <div>
            <el-form label-position="left">
                <el-form-item label="搜索" >
                    <el-input clearable="" v-model="filterValue" placeholder="搜索记录">
                        <el-button slot="append" icon="search" @click="handleSearch"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-table ref="lookupTable" height="450" style="width: 100%" highlight-current-row v-bind:data="tableData" stripe @current-change="handleCurrentChange" @row-dblclick="handleDBClick" @sort-change="handleSortChange" v-loading="loading">
            <!-- <el-table-column width="55">
                <template slot-scope="scope">
                    <i class="el-icon-check" v-if="selectedRows.indexOf(scope.row)>=0"></i>
                </template>
            </el-table-column> -->
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" v-for="display in displayFields"  :width="display.width" v-bind:key="display.name" :prop="display.name" :label="display.label" >
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleIndexChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="totalRecordCount">
        </el-pagination>
        <span slot="footer" class="dialog-footer" style="">
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "MyMultiEntitySelectDialog",
    props: {
        title: {
            type: String,
            default: "查找"
        },
        entity: {
            type: String,
            required: true
        },
        requestUrl: {
            type: String,
            default: function () {
                return "/api/mylookup/getdata";
            }
        },
        nameField: {
            type: String,
            default: function () {
                return "name";
            }
        },
        idField: {
            type: String,
            default: function () {
                return this.entity + "id";
            }
        },
        displayFields: {
            type: Array,
            default: function () {
                return [{ name: 'name', label: '名称' }, { name: "createdon", label: "创建日期", width: 180 }];
            }
        },
        orderbyFields: {
            type: String,
            default: function () {
                return "createdon desc";
            }
        },
        filterFields: {
            type: String,
            default: function () {
                return "name";
            }
        },
        conditionFields:{
          type:String,
          default:function(){
            return "";
          }
        },
        dialogCallback: Function,
        selectValues: Array,
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,

            filterValue: "",

            pageIndex: 1,
            pageSize: 20,
            layout: "total, sizes, prev, pager, next",
            pageSizes: [10, 20, 30, 40, 50],
            totalRecordCount: 0,

            tableData: [],
            currentRow: null,
            // selectRow: [],
            // selectedRows: Array
        }
    },
    computed: {
        selectString: {
            get() {
                //将idField、nameField、displayFields合并，并去掉重复的字段
                var selectFields = [];
                selectFields.push(this.nameField);
                selectFields.push(this.idField);
                for (var i in this.displayFields) {
                    var fieldName = this.displayFields[i].name;
                    if (selectFields.indexOf(fieldName) >= 0) {
                        continue;
                    }
                    selectFields.push(fieldName);
                }

                return selectFields.join(",");
            }
        },
        orderbyString: {
            get() {
                return this.orderbyFields;
            }
        },
        filterString: {
            get() {
                return this.filterFields;
            }
        },
        conditionString:{
          get(){
            return this.conditionFields;
          }
        }
    },
    mounted() {
        if (this.selectValues) {
            this.$refs.lookupTable.toggleRowSelection(this.selectValues);
        }
    },
    methods: {
        show() {
            this.dialogVisible = true;
            this.pageIndex = 1;
            this._fetchRecords();
        },
        handleSearch() {
            this.pageIndex = 1;
            this._fetchRecords();
        },
        handleCurrentChange(val) {
            // let index = this.selectedRows.indexOf(val);
            // if (index >= 0) {
            //     this.selectedRows.splice(index, 1);
            // }
            // else {
            //     this.selectedRows.push(val);
            //     this.currentRow = val;
            // }
        },
        handleSortChange() {
            alert("未实现");
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;

            this._fetchRecords();
        },
        handleIndexChange(pageIndex) {
            this.pageIndex = pageIndex;

            this._fetchRecords();
        },
        handleReset() {
            // this.$emit("data-selected", {
            //     id: null,
            //     logicalName: this.entity,
            //     name: null
            // });

            // this.dialogVisible = false;
            // if (this.dialogCallback) {
            //     this.dialogCallback(null);
            // }
        },
        //双击事件
        handleDBClick(row, event) {
            this.dialogVisible = false;
            if (this.dialogCallback) {
                this.dialogCallback([row]);
            }
        },
        handleConfirm() {
            var selectedRow = this.$refs.lookupTable.selection;
            if (selectedRow == null || selectedRow.length == 0) {
                astec.showErrorToast("请选择一条记录");
                return false;
            }
            else {
                //this.$emit("data-selected", selectedRow);
                this.dialogVisible = false;
                if (this.dialogCallback) {
                    this.dialogCallback(selectedRow);
                }
            }
        },
        //数据加载
        _fetchRecords() {
            this.loading = true;
            var requestStr = this.requestUrl + '?entityName=' + this.entity
                + '&page=' + this.pageIndex + '&count=' + this.pageSize
                + "&select=" + this.selectString
                + "&orderby=" + this.orderbyString
                + "&filter=" + this.filterString
                + "&filterValue=" + encodeURIComponent(this.filterValue || "")
                + "&condition=" + this.conditionString;

            this.$http.get(requestStr).then((res) => {
                this.tableData = res.Data;
                this.totalRecordCount = res.TotalRecordCount;
            }).catch((error) => {
                astec.showErrorToast(error);
            }).finally(() => {
                this.loading = false;
            });
        },
    }
}
</script>

<style>
.my-lookup-dialog {
}

.my-lookup-dialog .el-form-item .el-form-item__label {
	width: 120px;
}

.my-lookup-dialog .el-form-item .el-form-item__label:before {
	display: none;
}

.my-lookup-dialog .el-form-item .el-form-item__content {
	margin-left: 120px !important;
}

.my-lookup-dialog .el-table {
	margin-top: 15px;
}

.my-lookup-dialog .el-dialog__body {
	padding-bottom: 15px;
}

.my-lookup-dialog .el-dialog__footer {
	padding-top: 0;
}
</style>


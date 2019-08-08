<template>
    <div class="my-grid" @keyup.enter="handleSearch" @submit.native.prevent>
        <div class="my-grid__header">
            <my-toolbar v-if="$slots.toolbar">
                <slot name="toolbar"></slot>
            </my-toolbar>
            <el-button type="primary" size="small" @click="handleCollapse" v-if="$slots.more"
              style="float: right;margin-left: 20px;margin-top: 6px;">
              <i :class="iconClass" style="font-size:10px;"></i>
              高级搜索
            </el-button>
            <el-input :placeholder="quicksearchPlaceholder" v-if="showQuick" v-model="quickSearch" style="float:right;width:20%;margin-top: 6px;" @keyup.enter="handleQuickSearchFromInput" :clearable="true">
              <el-button slot="append" icon="el-icon-search" @click="handleQuickSearch"></el-button>
            </el-input>
        </div>
        <div class="my-grid__moresearch" v-show="$slots.more && defaultShowHidden">
            <slot name="more"></slot>
            <el-row :gutter="40" type="flex">
              <el-col v-bind:span="24" style="float:right;text-align:right;">
                  <el-button type="primary" icon="el-icon-setting"  @click="handleReset" class="my-query__reset">重置</el-button>
                  <el-button type="primary"  icon="el-icon-search" @click="handleSearch">搜索</el-button>
              </el-col>
            </el-row>
        </div>
        <div class="my-grid__body">
            <div v-show="unitGroup">
                <slot name="buttonGroup"></slot>  
            </div>
                 
            <slot></slot>
        </div>
        <div class="my-grid__footer">
            <el-pagination v-if="showPagination" @size-change="handleSizeChange" @current-change="handleIndexChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="totalRecord">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyGrid",
    data() {
        return {
            quickSearch: null,

            // showHidden: false,
            defaultShowHidden: this.showHidden,
            pageIndex: 1,
            pageSize: 10,
            layout: "total, sizes, prev, pager, next, jumper",
            pageSizes: [10, 20, 30, 40, 50,100]
        };
    },
    created:function(){
        console.log("created")
    },
        mounted:function(){
        console.log("mounted")
    },
    
    props: {
        quicksearchPlaceholder: String,
        showQuick: {
            type: Boolean,
            default: true,
            required: false
        },
        showPagination: {
            type: Boolean,
            default: true,
            required: false
        },
        totalRecord: {
            type: Number,
            required: false
        },
        defaultPageSize: {
            type: Number,
            required: false,
            default:10
        },
        showHidden: {
            type: Boolean,
            default: false,
            required: false
        },
        unitGroup: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    computed: {
        iconClass() {
            return this.defaultShowHidden ? "el-icon-arrow-up" : "el-icon-arrow-down";
        },
        // pageComputed(){
        //     this.pageSize
        // }
    },

    watch: {
        pageIndex: function (val, oldVal) {
            // console.log("pageIndex changed: val=" + val + "oldVal = " + oldVal);
            this.$emit("page-change", this.pageIndex, this.pageSize);
        },

        pageSize: function (val, oldVal) {
            console.log(this.pageSize)
            // console.log("pageSize changed: val=" + val + "oldVal = " + oldVal);
            this.$emit("page-change", this.pageIndex, this.pageSize);
        }
    },

    methods: {
        handleCollapse() {
            this.defaultShowHidden = !this.defaultShowHidden;
        },
        handleReset() {
            this.pageIndex = 1;
            this.$emit("reset");
        },
        handleSearch() {
            this.pageIndex = 1;
            this.$emit("search");
        },

        handleQuickSearch() {
            this.pageIndex = 1;
            this.$emit("quick-search");
        },

        handleQuickSearchFromInput() {
               console.warn("test-handleQuickSearchFromInput")
               this.pageIndex = 1;
            this.handleQuickSearch();
        },

        handleSizeChange(val) {
            console.log("handleSizeChange val=" + val);
            let needEmit = false;

            if (this.pageSize) {
                if (this.pageSize == val) {
                    needEmit = false;
                }
                else if (this.pageSize == 0 && val == 1) {
                    needEmit = false;
                } else {
                    needEmit = true;
                }
            } else if (val == 1 || val == 0) {
                needEmit = false;
            } else {
                needEmit = true;
            }

            console.log("handleSizeChange val=" + val + ", needEmit= " + needEmit);

            if (needEmit) {
                this.pageSize = val;
                //this.$emit("page-change", this.pageIndex, this.pageSize);
            }
        },
        handleIndexChange(val) {
            console.log("handleIndexChange val=" + val);
            let needEmit = false;
            if (this.pageIndex) {
                if (this.pageIndex == val) {
                    needEmit = false;
                } else if (this.pageIndex == 0 && val == 1) {
                    needEmit = false;
                } else {
                    needEmit = true;
                }
            } else if (val == 0 || val == 1) {
                needEmit = false;
            } else {
                needEmit = true;
            }

            // console.log("handleIndexChange val=" + val + ", needEmit= " + needEmit);
            if (needEmit) {
                this.pageIndex = val;
                // this.$emit("page-change", this.pageIndex, this.pageSize);
            }
        },
        setPageIndex(val) {
             this.pageIndex=val;
        },
        setPageSize(val) {
            // console.log(this.pageSize)
         this.pageSize=val;
        },
        getPageIndex() {
            return this.pageIndex;
        },
        getPageSize() {
            console.log(this.pageSize)
            return this.pageSize;
        },
        getSearchString() {
            return this.quickSearch;
        },
        setSearchString(quicksearch) {
            this.quickSearch = quicksearch;
        }
    }
};
</script>

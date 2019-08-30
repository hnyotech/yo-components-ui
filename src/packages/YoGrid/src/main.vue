<template>
    <div class="my-grid" @keyup.enter="handleSearch" @submit.native.prevent>
        <div class="my-grid__header" v-if="defaultShowHidden">
            <YoToolBar v-if="$slots.toolbar">
                <slot name="toolbar"></slot>
            </YoToolBar>
            <YoButton type="primary" size="medium" @click="handleCollapse"
              style="float: right;margin-left: 20px;margin-top: 6px;">
              <i class="el-icon-arrow-down" style="font-size:10px;"></i>
              高级搜索
            </YoButton>
            <el-input :placeholder="quicksearchPlaceholder" size="medium" v-model="realData.params[quickSearch]" style="float:right;width:20%;margin-top: 6px;" @keyup.enter="handleQuickSearchFromInput" :clearable="true">
              <YoButton slot="append" icon="el-icon-search" @click="handleQuickSearch"></YoButton>
            </el-input>
        </div>
        <div v-show="!defaultShowHidden" class="cos_hide_box"><span class="cos_hide" @click="handleCollapse">收起<i class="el-icon-arrow-up"></i></span></div>
        <div class="divider_cos"></div>
        <div v-show="!defaultShowHidden" class="my-grid__moresearch">
            <el-form :model="realData.params" class="detail-form" ref="form" label-width="100px" label-position="left">
                <el-row :gutter="40">
                    <el-col  v-for="item in realData.formLabel" :key="item.name" :span="item.span">
                        <el-form-item :label="item.name + ':'" :prop="item.value">
                            <el-input v-if="item.type == 'input'" class="user-input" type="text" :placeholder="'请输入' + item.name" v-model="realData.params[item.value]"></el-input>
                            <el-date-picker v-if="item.type=='date'" :format="item.format" :value-format="item.format" type="date" placeholder="请选择时间" size="large" v-model="realData.params[item.value]" style="width:100%"></el-date-picker>
                            <el-select v-if="item.type =='select'"  :placeholder="'请选择' + item.name" v-model="realData.params[item.value]" clearable style="width:100%">
                              <el-option v-for="li in item.options" :key="li.Value" :label="li.Description" :value="li.Value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="padding:0 20px;text-align:right;">
              <YoButton icon="el-icon-setting" size="medium" class="my-query__reset" @click="reset()">重置</YoButton>
              <YoButton type="primary" size="medium" icon="el-icon-search" @click="searchTableData()">搜索</YoButton>
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
            <el-pagination v-if="showPagination" @size-change="handleSizeChange" @current-change="handleIndexChange" :current-page="realData.params.PageIndex" :page-size="realData.params.PageSize" :page-sizes="pageSizes" :layout="layout" :total="TotalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import YoButton from '@/packages/YoButton/src/main.vue'
import YoToolBar from '@/packages/YoToolBar/src/main.vue'
export default {
    name: "YoGrid",
    components: {
        YoButton
    },
    data() {
        return {
            quickSearch: this.quickSearchVal,

            // showHidden: false,
            PageIndex: 1,
            PageSize: 10,
            defaultShowHidden: this.showQuick,
            layout: "total, sizes, prev, pager, next, jumper",
            pageSizes: [10, 20, 30, 40, 50,100],
            requireData: {},
            realData: this.gridData,
            TotalCount: 0,
            loading: false
        };
    },
    beforeCreate(){
        
    },
    created:function(){
       
    },
    mounted:function(){
        var paramsList = this.$store.getters.paramsList; 
        for(let i = 0;i<paramsList.length;i++){
            if(paramsList[i][this.$route.name]){
                this.realData.params = paramsList[i][this.$route.name]
            };
        };
         
        this.search()
    },
    
    props: {
        quicksearchPlaceholder: String,
        showQuick: {
            type: Boolean,
            default: true,
            required: false
        }, //是否显示快速搜索
        showPagination: {
            type: Boolean,
            default: true,
            required: false
        }, //是否显示分页
        // totalRecord: {
        //     type: Number,
        //     required: false
        // },
        // defaultPageSize: {
        //     type: Number,
        //     required: false,
        //     default:10
        // },
        unitGroup: {
            type: Boolean,
            default: false,
            required: false
        }, //是否显示单位组合
        needtabs: {
            type: Boolean,
            default: false,
            required: false
        },//是否显示tabs
        gridData: {
            type: Object,
            default: function(){
                return {}
            },
            required: false
        },
        tabsAlign:{
            type: String,
            default: 'left',
            required: false
        },//tabs所在的位置
        unitAlign:{
            type: String,
            default: 'left',
            required: false
        },//单位所在的位置
        quickSearchVal:{
            type: String,
            default: '',
            required: false
        }
    },
    computed: {
    },

    watch: {
        pageIndex: function (val, oldVal) {
            // console.log("pageIndex changed: val=" + val + "oldVal = " + oldVal);
            // this.$emit("page-change", this.pageIndex, this.pageSize);
        },

        pageSize: function (val, oldVal) {
            // console.log(this.pageSize)
            // console.log("pageSize changed: val=" + val + "oldVal = " + oldVal);
            // this.$emit("page-change", this.pageIndex, this.pageSize);
        }
    },

    methods: {
        resetParam(){
             for(var key in this.realData.params){
                if(key == 'PageIndex'){
                    this.realData.params[key] = 1;
                }else if(key == 'PageSize'){
                    this.realData.params[key] = 10;
                }else{
                    this.realData.params[key] = '';
                };
            };
        },
        searchTableData(){
            // console.log(this.realData);
            this.realData.params.pageSize = 10;
            this.realData.params.pageIndex = 1;
            this.search();
            this.$emit('search')
        },
        reset(){
           this.resetParam();
            this.search();
        },
        //table数据搜索函数
        search(){
            var that = this;
            this.loading = true;
            var paramsList = that.$store.getters.paramsList;
            // return new Promise(function(resolve,reject){
                // console.log(that.params)
                if(that.realData.api){
                    that.$http({
                        method: that.realData.methods,
                        url: that.realData.api,
                        data: that.realData.params
                    }).then(res=>{
                        var key = that.$route.name;
                        // console.log(key)
                        var obj = new Object;
                        obj[key] = that.realData.params;
                        if(paramsList.length === 0){
                            paramsList.push(obj);
                        }else{
                            var flag = false;
                            for(var val in paramsList){
                                if(paramsList[val].hasOwnProperty(key)){
                                    paramsList[val][key] = that.gridData.params;
                                    flag = true;
                                }
                            };
                            if(!flag){
                                paramsList.push(obj);
                            }
                            
                        };
                        that.TotalCount = res.TotalCount;
                        that.requireData = res;
                        // sessionStorage.setItem('paramsList',JSON.stringify(paramsList))
                        that.$store.commit("UPDATE_PARAMSlIST", paramsList);
                        // resolve(res);
                        that.$emit('update:requireData',res)
                        this.loading = false;
                    })
                }
            // })
            
        },
        handleCollapse() {
            this.defaultShowHidden = !this.defaultShowHidden;
        },
        // handleReset() {
        //     this.pageIndex = 1;
        //     this.$emit("reset");
        // },
        // handleSearch() {
        //     this.pageIndex = 1;
        //     this.$emit("search");
        // },

        handleQuickSearch() {
             var queickVal=this.realData.params[this.quickSearch];
             this.resetParam();
             this.realData.params[this.quickSearch]=queickVal;
             this.search();
        },

        handleQuickSearchFromInput() {
               this.search();
        },

        handleSizeChange(val) {
            this.realData.params.PageSize =val;
            this.search();
            // console.log("handleSizeChange val=" + val);
            // let needEmit = false;

            // if (this.pageSize) {
            //     if (this.pageSize == val) {
            //         needEmit = false;
            //     }
            //     else if (this.pageSize == 0 && val == 1) {
            //         needEmit = false;
            //     } else {
            //         needEmit = true;
            //     }
            // } else if (val == 1 || val == 0) {
            //     needEmit = false;
            // } else {
            //     needEmit = true;
            // }

            // console.log("handleSizeChange val=" + val + ", needEmit= " + needEmit);

            // if (needEmit) {
            //     this.pageSize = val;
            // }
        },
        handleIndexChange(val) {
            this.realData.params.PageIndex =val;
            this.search();
            // console.log("handleIndexChange val=" + val);
            // let needEmit = false;
            // if (this.pageIndex) {
            //     if (this.pageIndex == val) {
            //         needEmit = false;
            //     } else if (this.pageIndex == 0 && val == 1) {
            //         needEmit = false;
            //     } else {
            //         needEmit = true;
            //     }
            // } else if (val == 0 || val == 1) {
            //     needEmit = false;
            // } else {
            //     needEmit = true;
            // }
            // if (needEmit) {
            //     this.pageIndex = val;
            // }
        },
        // setPageIndex(val) {
        //      this.pageIndex=val;
        // },
        // setPageSize(val) {
        //  this.pageSize=val;
        // },
        // getPageIndex() {
        //     return this.pageIndex;
        // },
        // getPageSize() {
        //     console.log(this.pageSize)
        //     return this.pageSize;
        // },
        // getSearchString() {
        //     return this.quickSearch;
        // },
        // setSearchString(quicksearch) {
        //     this.quickSearch = quicksearch;
        // }
    }
};
</script>

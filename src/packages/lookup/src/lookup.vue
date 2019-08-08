<template>
    <div class="my-lookup">
        <!-- <el-input :disabled="disabled" icon="search" v-model="lookupValueName" :on-icon-click="showLookupDialog">
        </el-input> -->
        <!-- <ul v-if="valueList&& valueList.length>0">
            <li v-for="value in valueList" :key="value[idField]"
            @click='selectValue(value)'>{{value[nameField]}}</li>
        </ul> -->
        <el-autocomplete v-model="lookupValueName" :disabled="disabled" icon="search" :on-icon-click="showLookupDialog" :trigger-on-focus="false" :fetch-suggestions="findValueByApi" @select="selectValue" placeholder="" style="width:100%">
        </el-autocomplete>
        <my-lookup-dialog ref="lookupDialog" :entity="entity" :request-url="dialogRequestUrl" :name-field="nameField" :id-field="idField" :display-fields="dialogDisplayFields" :orderby-fields="dialogOrderbyFields" :filter-fields="dialogFilterFields" :condition-fields="dialogConditionFields" @data-selected="handleDataSelected" :dialogCallback="dialogCallback"></my-lookup-dialog>
    </div>
</template>

<script>

import MyEntitySelectDialog from './lookup-dialog';

export default {
    name: "MyEntityLookup",
    props: {
        value: {
            type: Object,
            required: false
        },
        disabled: Boolean,
        entity: {
            type: String,
            required: true
        }, requestUrl: {
            type: String,
            default: function () {
                return "/api/mylookup/getdata";
            }
        },
        nameField: String,
        idField: String,
        dialogRequestUrl: String,
        dialogDisplayFields: Array,
        dialogOrderbyFields: String,
        dialogFilterFields: String,
        dialogCallback: Function,
        dialogConditionFields:String
    },
    components: {
        'my-lookup-dialog': MyEntitySelectDialog
    },
    computed: {
        // lookupValueName:function(){
        //     return this.lookupValue.name;
        // }
    },
    data() {
        return {
            lookupValue: {
                name: null,
                id: null,
                logicalname: null
            },
            lookupValueName: null,//lookupValue.name
            //valueList: null,
            // index:0
        }
    },
    watch: {
        value(newValue) {
            if (!newValue) {
                newValue = {
                    name: null,
                    id: null,
                    logicalname: null
                };
            }
            this.lookupValue = newValue;
            this.lookupValueName = this.lookupValue.name;
        },
        // lookupValueName(newValue, oldValue) {
        //     if (newValue == this.lookupValue.name) {
        //         this.valueList = null; return
        //     }
        //     else {
        //         this.lookupValue = {
        //             name: null,
        //             id: null,
        //             logicalname: null
        //         };
        //         //  this.findValueByApi();
        //     }

        // }
    },
    methods: {
        showLookupDialog() {
            this.$refs.lookupDialog.show();
        },
        handleDataSelected(val) {
            if (!val) {
                val = {};
            }
            this.lookupValue = val;
            this.$emit("input", val);
        },
        //数据加载
        findValueByApi(queryString, callback) {
            if (queryString != null && queryString.length > 0) {
                //this.index++;
                let that = this;
                var requestStr = that.requestUrl + '?entityName=' + that.entity
                    + '&page=1&count=10'
                    + "&select=" + that.dialogFilterFields
                    + "&orderby=" + that.dialogOrderbyFields
                    + "&filter=" + that.nameField
                    + "&filterValue=" + encodeURIComponent(that.lookupValueName || "")
                    if(that.dialogConditionFields!=undefined)
                        requestStr+= "&condition=" + that.dialogConditionFields;
                    else
                        requestStr+= "&condition=" ;
                this.$http.get(requestStr)
                    .then((res) => {
                        // that.valueList = res.Data;
                        if (res == null || res.Data == null) return;
                        var list = [];
                        res.Data.forEach(element => {
                            element.value = element[that.nameField];
                            list.push(element);
                        });
                        callback(list);
                    }).catch((error) => {
                        astec.showErrorToast(error);
                        // that.valueList = null;
                    }).finally(() => {
                        this.loading = false;
                    });
            }
        },
        selectValue(value) {
            if (value) {
                this.lookupValue = {
                    name: value[this.nameField],
                    id: value[this.idField],
                    logicalname: this.entity
                };
                this.lookupValueName = this.lookupValue.name;
                //this.valueList = null;
                this.$emit("input", this.lookupValue);
                if (this.dialogCallback) {
                    this.dialogCallback(value);
                }
            }

        }
    }
}
</script>

<template>
    <div>
        <my-content title="审核记录">
            <el-table ref="multipleTable" :data="tableData" style="width: 100%">
                <el-table-column align="center" prop="approve_time" label="审核时间"></el-table-column>
                <el-table-column prop="approve_user_name" min-width="200" label="审核人" :show-overflow-tooltip=true></el-table-column>
                <el-table-column align="center" prop="approve_result" label="审核结果"></el-table-column>
                <el-table-column prop="approve_comment" label="审核意见" min-width="200" :show-overflow-tooltip=true></el-table-column>
            </el-table>
        </my-content>
    </div>
</template>
<script>
export default {
    name: 'CheckRecord',
    data(){
        return {
            tableData: []
        }
    },
    props: {
        processname: {
            type: String,
            default: '',
            required: true
        },
        objectIds: {
            type: Array,
            default: function(){
                return []
            },
            required: true
        }
    },
    created(){
        var that = this;
        this.$http.post('/api/ProcessInstances/GetApproveResult',{processname:this.processname,objectIds:this.objectIds}).then(res=>{
            that.tableData = res;
        })
    }
}
</script>
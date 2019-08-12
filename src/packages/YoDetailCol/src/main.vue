<template>
    <div>
        <el-row :gutter="40" v-for="(item,index) in rowData" :key="index">
            <el-col :span="8" v-for="li in item" :key="li.value">
                <div class="col_content_box">
                    <label class="detail_label" :style="{width: l_w}">{{li.title}}：</label>
                    <div class="value_w" :style="{'width': 'calc(100% - ' + l_w + ' )'}">&nbsp;{{li.value}}</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'YoDetailCol',
    data() {
        return{
            l_w: this.label_width + 'px'
        }
        
    },
    props: {
        rowData: {
            type: Array,
            default: function(){
                return []
            },
            required: true
        },
        label_width: {
            type: Number,
            default: 140,
            required: false
        }
    },
    computed:{
    },
    mounted(){
    },
    methods:{
    }
}
</script>
<style scoped>
    .col_content_box{
        display: flex;
    }
    .detail_label,.value_w{
        line-height: 40px;
        color: #666;
        font-size: 14px;
    }
    .value_w{
        color: #222;
        border-bottom: 1px solid #ccc;
    }
</style>

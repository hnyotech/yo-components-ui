<template>
    <div class="yo-detail-col">
        <el-row :gutter="40" v-for="(item,index) in rowData" :key="index">
            <el-col :span="8" v-for="(li,index) in item" :key="index">
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

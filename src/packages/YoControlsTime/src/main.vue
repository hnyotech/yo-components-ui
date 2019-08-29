<template>
<el-col :span='proteyValue.ColPer' >
    <i class="el-icon-error dynaattr"  @click.stop="closez" v-if="isedit"></i>
 <el-form-item :label="proteyValue.Name" :prop="itemsname + datakey + '.property.AttributeValue'"
       :rules="[{ required: proteyValue.Required, message: '不能为空',trigger: 'submit'}]" >
  
       <el-time-picker
   v-model="proteyValue.AttributeValue"
   class="user-input" style="width:100%;"
    placeholder="任意时间点">
  </el-time-picker>
  
 </el-form-item>
</el-col>
</template>

<script>

export default {
    name: "YoTime",
    props:{
      itemsname: {
      
        default:"items",
        required: false,
       },
        datakey: {
        type: Number,
        default:0,
        required: false,
       },
        proteyValue:
        {
            type:Object,
            required:false,
            default:null,
        },
         iscanedit:
        {
            type:Number,
            default:1,
            required:false,
        }
    },
    mounted(){
      console.log('add testinput');
    },
    data() {
      return {
        dk:this.datakey,
        newproteyValue:this.proteyValue,
      };
    },
    computed:{
         isedit(){
            if(this.iscanedit == undefined
            || this.iscanedit == null)
            {
                this.iscanedit=1;
            }
            return this.iscanedit==1;
        },
      
    },
   
    methods: {
       closez(){
         this.$emit("RemoveItem",this.datakey);
      },
    
    }
  }
</script>

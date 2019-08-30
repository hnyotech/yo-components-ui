<template>
<el-col :span='proteyValue.ColPer' >
   <i class="el-icon-error dynaattr"  @click.stop="closez" v-if="isedit"></i>
 <el-form-item :label="proteyValue.Name" :prop="proteyValue.AttributeValue"
       :rules="[{ required: proteyValue.Required, message: proteyValue.Name + '不能为空',trigger: 'submit'}]" >
   
   <el-select v-model="proteyValue.AttributeValue" clearable :placeholder="'请选择' + proteyValue.Name" @visible-change="visibleChange" style="width:100%">
      <el-option v-for="item in lstoptions" :key="item.value" :label="item.label" :value="item.value"   ></el-option>
    </el-select>

 </el-form-item>
</el-col>
</template>

<script>

export default {
    name: "YoLt",
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
       lstoptions(){
            let items=[];
            let options=this.newproteyValue.ListOption;
            if(options != undefined)
            {
              let arr=options.split(",");
           
              for(var i in arr){
                let str = arr[i];
                items.push({label:str,value:str});
              }
            }
            
            return items;            
      }
    },
   
    methods: {
       closez(){
         this.$emit("RemoveItem",this.datakey);
      },

    
    }
  }
</script>

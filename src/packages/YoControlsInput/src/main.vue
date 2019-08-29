<template>
<el-col :span='proteyValue.ColPer' >
     <i class="el-icon-error dynaattr"  @click.stop="closez" v-if="isedit"></i>
 <el-form-item :label="proteyValue.Name" :prop="itemsname + '.' + datakey + '.property.AttributeValue'"
       :rules="[{ required: proteyValue.Required, message: '参数名不能为空',trigger: 'submit'}
       ,{max: proteyValue.MaxLength, message: '字符超限制', trigger: 'submit'}
       ,{validator:validateRegex2,trigger:'submit'}]"
       >
 
  <el-input class="user-input" :type="proteyValue.AttributeType==1?'textarea':'text'" 
  placeholder="请输入内容" :rows="proteyValue.InputRowCount"  v-model="proteyValue.AttributeValue" ></el-input>
 </el-form-item>
</el-col>
</template>

<script>

export default {
    name: "YoInput",
    props:{
        itemsname: {//  
      
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
      console.log(this.datakey);
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
       validateRegex2(rule, value, callback) {
        if(!astec.isNullOrWhiteSpace(this.proteyValue.RegularText))
        {
          var regext=eval(this.proteyValue.RegularText);
          if(!astec.isNullOrWhiteSpace(this.proteyValue.AttributeValue))
          {
            if (!regext.test(value)) {
              callback(new Error("不正确"));
              return;
            }
          }
        }
        callback();
      },

    
    }
  }
</script>

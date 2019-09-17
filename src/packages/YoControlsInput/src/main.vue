<template>
<el-col :span='proteyValue.ColPer' >
     <i class="el-icon-error dynaattr"  @click.stop="closez" v-if="isedit"></i>
 <el-form-item :label="proteyValue.Name" :prop="itemsname + '.' + datakey + '.property.AttributeValue'"
       :rules="[{ required: proteyValue.Required, message: '请输入' + proteyValue.Name,trigger: 'blur'}
       ,{max: proteyValue.MaxLength, message: '字符超限制', trigger: 'blur'}
       ,{validator:validateRegex2,trigger:'blur'}]"
       >
 
  <el-input class="user-input" :type="proteyValue.AttributeType===1?'textarea':(proteyValue.AttributeType===0?'text':'number')" 
  :placeholder="'请输入' + proteyValue.Name" :rows="proteyValue.InputRowCount"  v-model="proteyValue.AttributeValue" ></el-input>
 </el-form-item>
</el-col>
</template>

<script>

export default {
    name: "YoInput",
    props:{
        itemsname: {
        default:"lstTempAttr",
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
      // console.log(this.datakey);
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

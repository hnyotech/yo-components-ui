<template>
  <div>
    <el-col :span="span">
      <div class="flex">
        <el-row :gutter="0">
          <el-col :span="7" class="label_box">
            <label>{{title}}：</label>
          </el-col>
          <el-col :span="17" class="detail_col_content">
            <div class="label_value">&nbsp;{{value}}</div>
          </el-col>
        </el-row>
        <!-- <label style="margin: 0 5px;float: left;display:inline-block;width:130px;font-size:14px;">{{title}}：</label>
        <div style="border-bottom: solid 1px #ccc;float: left;min-width: calc(100% - 150px);padding: 0px 10px;box-sizing: border-box;line-height:40px">
          <span class="label_value">{{value}}</span>
        </div> -->
      </div>
    </el-col>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "AsiasDetailCol",
  props: {

    span: {
      type: Number,
      required: true,
      default: 6
    },

    title: {
      type: String,
      required: true,
      default: ""
    },
   value:null,
  },
  data: function() {
    return {};
  },
};
</script>
<style scoped>
  label{
    line-height: 41px;
    color: #666;
  }
  .label_value {
    color: #222;
    font-size:14px;
  }
  /* .flex {
    display: flex;
  } */
</style>

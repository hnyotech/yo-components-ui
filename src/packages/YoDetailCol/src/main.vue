<template>
  <div class="yo-detail-col">
    <el-row :gutter="40" v-for="(item,index) in rowData" :key="index">
      <el-col v-for="(li,ind) in item" :span="li.span === undefined ? 8 : li.span" :key="ind">
        <div class="col_content_box" v-if="li.isVisiable === undefined || li.isVisiable === true">
          <label
            class="detail_label"
            v-show="li.title===''?false:true"
            :style="{width: li.labelW ? li.labelW : l_w, lineHeight: li.lineHeight ? li.lineHeight : '40px'}"
            v-html="li.title + labelSuffix"
          ></label>
          <div
            class="value_w"
            :style="{'width': 'calc(100% - ' + (li.labelW ? li.labelW : l_w) + ' )'}" v-html="((li.htmlVaule)?li.htmlVaule:li.value?li.value:'')"
          ></div>
<!--          <div-->
<!--            class="value_w"-->
<!--            :style="{'width': 'calc(100% - ' + (li.labelW ? li.labelW : l_w) + ' )'}" v-else-->
<!--          >&nbsp;{{li.value}}</div>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "YoDetailCol",
  data() {
    return {
      l_w: this.label_width + "px"
    };
  },
  props: {
    rowData: {
      type: Array,
      default: function() {
        return [];
      },
      required: true
    },
    label_width: {
      type: Number,
      default: 140,
      required: false
    },
    labelSuffix: {
      type: String,
      default: '：',
      required: false
    }
  }
};
</script>

<template>
  <el-row :gutter="gutter" :type="type" :justify="justify" :align="align" :tag="tag">
       <slot></slot>
  </el-row>
</template>
<script type="text/javascript">
export default {
  name: "YoButton",
  props: {
    gutter: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    justify: {
      type: String,
      default: ''
      // 可选值 start/end/center/space-around/space-between
    },
    align: {
      type: String,
      default: ''
      // 可选值 top/middle/bottom
    },
    tag: {
      type: String,
      default: 'div'
    }
  }
};
</script>

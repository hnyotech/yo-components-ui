<template>
  <el-row :span="span" :offset="offset" :push="push" :pull="pull" :xs="xs" :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl" :tag="tag">
       <slot></slot>
  </el-row>
</template>
<script type="text/javascript">
export default {
  name: "YoButton",
  props: {
    span: {
      type: Number,
      default: 24
    },
    offset: {
      type: Number,
      default: 0
    },
    push: {
      type: Number,
      default: 0
    },
    pull: {
      type: Number,
      default: 0
    },
    xs: {
      type: [String, Object],
      default: ''
    },
    sm: {
      type: [String, Object],
      default: ''
    },
    md: {
      type: [String, Object],
      default: ''
    },
    lg: {
      type: [String, Object],
      default: ''
    },
    xl: {
      type: [String, Object],
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    }
  }
};
</script>

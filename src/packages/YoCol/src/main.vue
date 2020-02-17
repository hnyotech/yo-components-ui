<template>
  <el-col :span="span" :offset="offset" :push="push" :pull="pull" :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl" :tag="tag">
       <slot></slot>
  </el-col>
</template>
<script type="text/javascript">
export default {
  name: "YoCol",
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
      type: [Number, Object]
    },
    sm: {
      type: [Number, Object]
    },
    md: {
      type: [Number, Object]
    },
    lg: {
      type: [Number, Object]
    },
    xl: {
      type: [Number, Object]
    },
    tag: {
      type: String,
      default: 'div'
    }
  }
};
</script>

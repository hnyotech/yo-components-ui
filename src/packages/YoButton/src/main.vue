<template>
  <el-button :type="type" :icon="icon" :size="size" :disabled="disabledComputed" :loading="loading" @click="clickHandler">
       <slot></slot>
  </el-button>
</template>
<script type="text/javascript">
export default {
  name: "YoButton",
  props: {
    type: {
      type: String,
      default: "default"
    },
    icon: {
      type: String,
    },
    size: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: null,
  },
  computed: {
    disabledComputed: function () {
      if (this.disabledValue != null) {
        return this.disabledValue;
      }
      else {
        return this.disabled;
      }

    },
  },
  data: function () {
    return {
      disabledValue: null,
    };
  },
  methods: {
    clickHandler: function () {
      // console.log("clickHandler");
       this.$emit('click')
    }
  }
};
</script>
<style scoped>

</style>

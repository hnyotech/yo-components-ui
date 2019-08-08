<template>
    <div class="my-toolbar">
        <slot></slot>
        <template v-if="showAutoback">
            <div class="my-divider"></div>            
            <el-button  icon="el-icon-back"  type="info"  size="small" @click="handleBackClick">返回</el-button>
        </template>
    </div>
</template>

<script>
export default {
  name: "MyToolbar",
  props: {
    showAutoback: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    handleBackClick() {
        console.log("返回");
      if (this.showAutoback) {
        this.$router.back();
      } else {
        this.$emit("goback");
      }
    }
  }
};
</script>

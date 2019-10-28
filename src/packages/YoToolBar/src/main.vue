<template>
    <div class="my-toolbar">
        <slot></slot>
        <template v-if="showAutoback">
            <div class="my-divider"></div>
            <yo-button  icon="el-icon-back"  type="default"  size="small" @click="handleBackClick">返回</yo-button>
        </template>
    </div>
</template>

<script>
import YoButton from '@/packages/YoButton/src/main.vue'
export default {
  name: "YoToolbar",
  components: {
    YoButton
  },
  props: {
    showAutoback: {
      type: Boolean,
      default: false,
      required: false
    },
    specifiedUrl: {
      type: String,
      required: false,
      default: ''
    },
    params: {
      type: Object,
      required: false
    }
  },
  methods: {
    handleBackClick() {
        console.log("返回");
      if (this.showAutoback) {
        if(this.specifiedUrl === ''){

        this.$router.back();
        }else {
          this.$router.push({name:this.specifiedUrl,query:this.params})
        }
      } else {
        this.$emit("goback");
      }
    }
  }
};
</script>

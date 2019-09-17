<template>
  <el-col :span="proteyValue.ColPer">
    <i class="el-icon-error dynaattr" @click.stop="closez" v-if="isedit"></i>
    <el-form-item :prop="itemsname + '.' + datakey + '.property.AttributeValue'">
      <el-checkbox
        v-model="proteyValue.AttributeValue"
        true-label="true"
        false-label="false"
      >{{proteyValue.Name}}</el-checkbox>
    </el-form-item>
  </el-col>
</template>

<script>
export default {
  name: "YoCheck",
  props: {
    itemsname: {
      default: "items",
      required: false
    },
    datakey: {
      type: Number,
      default: 0,
      required: false
    },

    proteyValue: {
      type: Object,
      required: false,
      default: null
    },
    iscanedit: {
      type: Number,
      default: 1,
      required: false
    }
  },
  mounted() {},
  data() {
    return {
      dk: this.datakey,
      newproteyValue: this.proteyValue
    };
  },
  computed: {
    isedit() {
      if (this.iscanedit == undefined || this.iscanedit == null) {
        this.iscanedit = 1;
      }
      return this.iscanedit == 1;
    }
  },

  methods: {
    closez() {
      this.$emit("RemoveItem", this.datakey);
    }
  }
};
</script>

<template>
  <el-col :span="proteyValue.ColPer">
    <i class="el-icon-error dynaattr" @click.stop="closez" v-if="isedit"></i>
    <el-form-item
      :label="proteyValue.Name"
      :prop="itemsname + '.' + datakey + '.property.AttributeValue'"
    >
      <el-radio-group v-model="proteyValue.AttributeValue" v-if="proteyValue.AttributeType===6">
        <el-radio
          v-for="item in lstoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
      <el-checkbox-group v-model="proteyValue.AttributeValue" v-else>
        <el-checkbox
          v-for="item in lstoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-checkbox>
      </el-checkbox-group>
      <!-- <el-checkbox
        v-model="proteyValue.AttributeValue"
        true-label="true"
        false-label="false"
      >{{proteyValue.Name}}</el-checkbox>-->
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
  created() {
    if(this.proteyValue.AttributeType===6 && this.proteyValue.AttributeValue === null){
      this.proteyValue.AttributeValue = ''
    } else {
      this.proteyValue.AttributeValue = []
    }
  },
  computed: {
    isedit() {
      if (this.iscanedit == undefined || this.iscanedit == null) {
        this.iscanedit = 1;
      }
      return this.iscanedit == 1;
    },
    lstoptions() {
      let items = [];
      let options = this.newproteyValue.ListOption;
      if (options != undefined) {
        let arr = options.split(",");

        for (var i in arr) {
          let str = arr[i];
          items.push({ label: str, value: str });
        }
      }

      return items;
    }
  },

  methods: {
    closez() {
      this.$emit("RemoveItem", this.datakey);
    }
  }
};
</script>

<template>
  <el-form-item :label="label" :prop="prop" v-if="isNeedForm">
      <el-select v-model="selectedValue" v-if="isDrop" :clearable="isClear" :disabled="disabled" :placeholder="'请选择' + label" @change="handleChange" @visible-change="visibleChange" style="width:100%">
          <el-option v-for="item in options" :key="item.Value" :label="item.Description" :value="item.Value">
          </el-option>
      </el-select>
      <el-radio-group v-else v-model="selectedValue" @change="handleChange">
        <el-radio v-for="item in options" :key="item.Value" :label="item.Value">{{item.Description}}</el-radio>
      </el-radio-group>
  </el-form-item>
  <el-select v-else v-model="selectedValue" :size="size" :clearable="isClear" :disabled="disabled" :placeholder="'请选择' + label" @change="handleChange" @visible-change="visibleChange" style="width:100%">
      <el-option v-for="item in options" :key="item.Value" :label="item.Description" :value="item.Value">
      </el-option>
  </el-select>
</template>

<script type="text/javascript">
export default {
  name: 'YoEnum',
  props: {
    isClear: {
      type: Boolean,
      required: false,
      default: true
    },
    selValue: {
      type: [String, Number],
      required: false,
      default: ''
    },
    EnumName: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    prop: {
      type: String,
      required: true
    },
    isDrop: {
      type: Boolean,
      required: false,
      default: true
    },
    isNeedForm: {
      type: Boolean,
      required: false,
      default: true
    },
    size: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      selectedValue: '',
      options: []
    }
  },
  created () {
    this.selectedValue = this.selValue
  },
  watch: {
    selValue: function (val) {
      this.selectedValue = val
    },
    EnumName: function (val) {
      this.bindEnumlist()
    }
  },
  methods: {
    bindEnumlist: function () {
      var self = this
      this.$http.get('api/Enum/GetEnumItems?fullname=' + this.EnumName)
        .then(function (res) {
          self.options = res
        })
    },
    handleChange (val) {
      this.$emit('update:selValue', val)
      this.$emit('selectChange', val)
    }
  },
  mounted: function () {
    this.bindEnumlist()
  }
}
</script>

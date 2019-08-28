<template>
<el-form-item :label="label" :prop="prop">
    <el-select v-model="selectedValue" clearable :disabled="disabled" :placeholder="'请选择' + label" @change="handleChange" @visible-change="visibleChange">
        <el-option v-for="item in options" :key="item.Value" :label="item.Description" :value="item.Value">
        </el-option>
    </el-select>
</el-form-item>
</template>

<script type="text/javascript">
export default {
  name: 'YoEnum',
  props: {
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
      this.$emit('selectChange', val)
    }
  },
  mounted: function () {
    this.bindEnumlist()
  }
}
</script>

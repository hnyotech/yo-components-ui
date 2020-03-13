<template>
<el-date-picker
      :id="id"
      v-if="DateTexts===true"
      v-model="EndTime"
      @change="selectDate"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="请选择截止日期"
      :picker-options="pickerOptionsEnd"
    ></el-date-picker>
    <el-input
      v-else
      prefix-icon="el-icon-date"
      type="text"
      clearable
      @mouseover.native="open()"
      @focus="Datefocus"
      placeholder="请选择截止日期"
      v-model.trim="DateText"
      maxlength="100"
    ></el-input>
</template>
<script>
export default {
  name: 'YoDateWithBtn',
  data () {
    var randonId = Math.random() * 1000000
    randonId = randonId.toFixed(0)
    randonId = 'datePicker' + randonId
    var displayText = this.displayText
    return {
      id: randonId,
      EndTime: null,
      pickerOptionsEnd: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '明天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          },
          {
            text: displayText,
            onClick (picker) {
              picker.$emit('pick', '')
            }
          }
        ]
      },
      DateText: null,
      DateTexts: true
    }
  },
  props: {
    date: {
      type: String,
      default: null
    },
    displayText: {
      type: String,
      default: ''
    }
  },
  watch: {
    date: function (val) {
      let that = this
      that.DateText = val
      this.DateTexts = true
      if (astec.isNullOrWhiteSpace(val)) {
        that.DateText = that.displayText
        that.DateTexts = false
      } else {
        that.EndTime = val
      }
      that.$emit('update:date', val)
    }
  },
  methods: {
    selectDate (val) {
      this.DateText = val
      if (val === '') {
        this.DateText = this.displayText
      }
      this.DateTexts = false
      this.$emit('update:date', val)
    },
    open () {
      this.DateTexts = true
      if (this.DateText === this.displayText) {
        this.DateTexts = false
      }
    },
    Datefocus () {
      this.DateText = null
      this.EndTime = null
      this.DateTexts = true
      this.$nextTick(() => {
        this.$el.querySelector('#' + this.id).focus()
      })
    }
  },
  created () {
    this.EndTime = this.date
    this.DateTexts = true
    if (astec.isNullOrWhiteSpace(this.date)) {
      this.DateText = this.displayText
      this.DateTexts = false
    } else {
      this.DateText = this.date
    }
  }
}
</script>

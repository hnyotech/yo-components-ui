<template>
    <el-select v-model="selectedValue" clearable :disabled="disabled" @change="handleChange" @visible-change="visibleChange">
        <el-option v-for="item in options" :key="item.Value" :label="item.Name" :value="item.Value">
            {{item.Name}}
        </el-option>
    </el-select>
</template>

<script type="text/javascript">
export default {
    name: "MyEnumSelector",
    props: {
        value: [String, Number],
        EnumName: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            selectedValue: null,
            options: [{
                Name:'张三',
                Value:2,
            }],
        }
    },
    watch: {
        value(newVal, oldVal) {
            this.selectedValue = newVal;
        }
    },
    methods: {
        bindEnumlist: function () {
            var self = this;
            this.$http.get("api/Enum/GetEnumItems?fullname=" + this.EnumName)
                .then(function (res) {
                    self.options = res;
                });
        },
        handleChange(val) {
            this.$emit("input", val);
        }
    },
    mounted: function () {
        this.bindEnumlist();
    }
}
</script>

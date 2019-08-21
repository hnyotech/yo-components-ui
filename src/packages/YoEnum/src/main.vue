<template>
<el-form-item :label="label" :prop="prop">
    <el-select v-model="selectedValue" clearable :disabled="disabled" @change="handleChange">
        <el-option v-for="item in options" :key="item.Value" :label="item.Description" :value="item.Value"></el-option>
    </el-select>
</el-form-item>
</template>

<script type="text/javascript">
export default {
    name: "YoEnum",
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

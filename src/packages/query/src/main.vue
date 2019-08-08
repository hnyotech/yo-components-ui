
<template>
    <div class="my-query">
        <div class="my-query__container">
            <slot></slot>
            <div class="my-query__collapse">
                <el-button :icon="icon" @click="handleCollapse" v-show="rows>2"  :title="hintMessage"></el-button>
            </div>
        </div>
        <el-row :gutter="40" type="flex">
            <el-col v-bind:span="24" style="float:right;text-align:right;">
                <el-button type="primary"  @click="handleReset" class="my-query__reset">重置</el-button>
                <el-button type="primary"  icon="search" @click="handleSearch">查询</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "MyQueryContainer",
    props: {
        rows: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            showHidden: true
        }
    },
    computed: {
        icon() {
            return this.showHidden ? "arrow-down" : "arrow-up";
        },
        hintMessage() {
            return this.showHidden ? "点击展开" : "点击收起";
        }
    },
    methods: {
        handleCollapse() {
            this.showHidden = !this.showHidden;
            this.$emit('collapse', this.showHidden);
        },
        handleReset() {
            this.$emit('reset');
        },
        handleSearch() {
            this.$emit('search');
        }
    }
}
</script>
<template>
    <div v-if="isShow" class="yo-tree">
        <div class="mask"></div>
        <div class="tree-box">
            <div class="tree-box-header">
                <span class="title">{{title}}</span>
                <span class="close-img"></span>
            </div>
            <div class="tree-box-content">
                <div class="tree-box-item" v-for="item in treeData" :key="RandomUniqueValue()">
                    <div class="title">
                        <div class="tree-item-title">
                            <el-checkbox @change="changeChecked(item,1)" :indeterminate="item.indeterminate"
                                         v-model="item.isChecked"></el-checkbox>
                            <span @click="changeChecked(item,2)" class="tree-title">{{item.Name}}</span>
                        </div>
                        <span class="tree-open"></span>
                    </div>
                    <div class="item-list">
                        <div class="tree-item-list" v-for="item2 in item.Children" :key="RandomUniqueValue()">
                            <span class="tree-line"></span>
                            <el-checkbox @change="changeChecked(item2,1)" v-model="item2.isChecked"></el-checkbox>
                            <span @click="changeChecked(item2,2)" class="tree-item-word">{{item2.Name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tree-box-footer">
                <div class="allcheck-box">
                    <el-checkbox @change="allCheckedChange(1)" v-model="allChecked" :indeterminate="allIndeterminate"></el-checkbox>
                    <span @click="allCheckedChange(2)">全选</span>
                </div>
                <div class="btn-box">
                    <el-button size="small" @click="closeTree()">取消</el-button>
                    <el-button size="small" type="primary" @click="submitTree()">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'YoTree',
  data() {
    return {
      allChecked: false,
      allIndeterminate: false,
      isShowTree: false
    }
  },
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeDataKey: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: '请选择需打包下载的附件'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    treeData: {
      handler(newval) {
        this.isShowTree = newval
      }
    },
    treeData: {
      handler(newval) {
        let status = ''
        newval.forEach(function(item) {
          if (item.isChecked) {
            status += 't'
          } else {
            status += 'f'
          }
          if (item.Children && typeof item.Children === 'object' && item.Children.length && item.Children.length > 0) {
            item.Children.forEach((item2) => {
              if (item2.isChecked) {
                status += 't'
              } else {
                status += 'f'
              }
            })
          }
        })
        if (status.indexOf('t') === -1 && status.indexOf('f') !== -1) {
          this.allIndeterminate = false
          this.allChecked = false
        } else if (status.indexOf('f') === -1 && status.indexOf('t') !== -1) {
          this.allIndeterminate = false
          this.allChecked = true
        } else if (status.indexOf('f') !== -1 && status.indexOf('t') !== -1) {
          this.allIndeterminate = true
          this.allChecked = false
        }
        this.$emit('update:treeData', newval)
      },
      deep: true
    }
  },
  methods: {
    closeTree() {
      this.isShowTree = false
      this.$emit('update:isShow', false)
    },
    submitTree() {
      this.isShowTree = false
      this.$emit('update:isShow', false)
      this.$emit('submitTree', this.treeData)
    },
    allCheckedChange(type) {
      let that = this
      if (type === 1) {

      } else if (type === 2) {
        that.allChecked = !(that.allChecked)
      }
      that.treeData.forEach(function(item) {
        that.$set(item, 'indeterminate', false)
        that.$set(item, 'isChecked', that.allChecked)
        item.Children.forEach(function(item2) {
          that.$set(item2, 'isChecked', that.allChecked)
        })
      })
    },
    getParent(data) {
      let arrRes = []
      this.treeData.forEach((item) => {
        if (item.Children && typeof item.Children === 'object' && item.Children.length && item.Children.length > 0) {
          item.Children.forEach((item2) => {
            if (item2.Name === data.Name && item2.Id === data.Id) {
              arrRes = item
            }
          })
        }
      })
      return arrRes
    },
    changeChecked(item, type) {
      this.$nextTick(function() {
        if (type === 1) {
          this.changeTreeData(item, type, item.isChecked)
        } else if (type === 2) {
          this.changeTreeData(item, type, !(item.isChecked))
        }
      })
    },
    changeTreeData(data, type, checked) {
      let that = this
      that.$nextTick(function() {
        if (data.Children && typeof data.Children === 'object' && data.Children.length && data.Children.length > 0) {
          that.$set(data, 'indeterminate', false)
          that.$set(data, 'isChecked', checked)
          data.Children.forEach(function(item2) {
            that.$set(item2, 'isChecked', checked)
          })
        } else {
          let item = that.getParent(data)
          let status = ''
          item.Children.forEach(function(item2) {
            if (item2.Name === data.Name && data.Id === item2.Id) {
              that.$set(item2, 'isChecked', checked)
            }
            if (item2.isChecked) {
              status += 't'
            } else {
              status += 'f'
            }
          })
          if (status.indexOf('t') === -1 && status.indexOf('f') !== -1) {
            that.$set(item, 'indeterminate', false)
            that.$set(item, 'isChecked', false)
          } else if (status.indexOf('f') === -1 && status.indexOf('t') !== -1) {
            that.$set(item, 'indeterminate', false)
            that.$set(item, 'isChecked', true)
          } else if (status.indexOf('f') !== -1 && status.indexOf('t') !== -1) {
            that.$set(item, 'indeterminate', true)
            that.$set(item, 'isChecked', false)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
    .yo-tree {
        position: relative;
    }

    .yo-tree .mask {
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        background-color: black;
        opacity: 0.3;
    }

    .yo-tree .tree-box {
        position: fixed;
        z-index: 999999;
        top: 50%;
        left: 50%;
        width: 500px;
        /*height: 600px;*/
        transform: translate(-50%, -50%);
        border-radius: 4px;
        padding: 0px 0px;
        background-color: #ffffff;
        font-size: 14px;
        color: #303133;
    }

    .yo-tree .tree-box >>> .el-checkbox {
        margin-right: 6px;
    }

    .tree-box-header {
        height: 62px;
        line-height: 62px;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-between;
        padding: 0 10px;
    }

    .tree-box-header .title{
        font-size: 18px;
        font-weight: 400;
    }

    .tree-box-content {
        max-height: 500px;
        /*height: 500px;*/
        /*min-height: 500px;*/
        overflow-y: auto;
        padding: 10px 0;
        border-top: solid 1px #E3E3E3;
        border-bottom: solid 1px #E3E3E3;
    }

    .tree-box-content .tree-box-item {
        padding: 0 20px;
    }

    .tree-box-content .tree-box-item .title {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 0px 10px;
        height: 40px;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: flex-start;
    }

    .tree-box-content .tree-box-item .item-list {
        margin: 0 0 10px 20px;
        padding: 10px 0 0 0;
        border-left: solid 1px #E3E3E3;
    }

    .tree-box-content .tree-box-item .item-list .tree-item-list {
        margin: 0 0 0px 0;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
    }

    .tree-box-content .tree-box-item .item-list .tree-item-list .tree-line {
        width: 10px;
        height: 1px;
        border-bottom: solid 1px #E3E3E3;
        margin-right: 6px;
    }

    .tree-box-footer {
        height: 62px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }

    .tree-box-footer .allcheck-box {
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        margin-left: 30px;
    }

    .tree-box-footer .btn-box {
        display: flex;
        justify-content: flex-end;
        align-content: center;
        align-items: center;
    }

    .tree-box-footer .btn-box >>> .el-button {
        margin: 0px 10px 0 0;
    }
</style>

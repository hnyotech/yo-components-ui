<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
  >
    <slot name="title"></slot>
  </el-drawer>
</template>
<script type="text/javascript">
export default {
  //抽屉 by Z.C 未实现
  //基于ElementUI的Drawer
  //主要实现可以控制打开的方向，大小
  //额外实现：最小化（贴边），拖拽改变大小
  name: "YoDrawer",
  props: {
    title: {
      type: String
    },
    direction: {
      type: String
    },
    //提供的关闭事件
    onClose: {
      type: Function,
      default: () => {}
    },
   
  },
  components: {},
  data: function() {
    return {
      drawer: false
    };
  },
  computed: {
    
  },
  methods: {   
    hide() {      
      this.onClose();
    },
  
  },
  created: function() {},
  mounted() {

  }
};
</script>
<style scoped>
.el-image-viewer__close {
  top: 50px;
  color: #fff;
}
</style>
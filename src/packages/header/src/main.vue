<template>
  <div>
    <div id="hide_show"></div>
    <div id="common_header" class="my-header">
      <h2>{{title}}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyHeader",
  props: {
    title: {
      type: String,
      default: "",
      required: true
    }
  },
  data: function() {
    return {
      showFloatHead: false //
    };
  },
  computed: {
    // headclass: function() {
    //   if (this.showFloatHead) {
    //     return "my-header my-header-float";
    //   } else {
    //     return "my-header";
    //   }
    // }
  },
  mounted: function() {
    // window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    // handleScroll: function() {
    //   var scrollTop =
    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop;
    //   if (scrollTop > 60) {
    //     this.showFloatHead = true;
    //   } else {
    //     this.showFloatHead = false;
    //   }
    // }
  }
};
</script>
<style scope>
.my-header-float {
  position: fixed;
  top: 60px;
  left: 250px;
  right: 0px;
  z-index: 997;
  /* box-shadow: 2px 2px 6px #f5f5f5; */
}
</style>


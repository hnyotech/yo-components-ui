<template>
  <div id="yoMenu">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :style="{width: width + 'px'}"
    >
      <div v-for="menu in menuList" :key="menu.MenuId">
        <el-menu-item
          v-if="menu.Items.length ==0"
          :index="menu.URL"
          :key="menu.MenuId"
          @click="routeClick(menu)"
        >{{ menu.MenuName }}</el-menu-item>
        <el-submenu v-else :index="menu.MenuId">
          <template slot="title">{{ menu.MenuName }}</template>
          <el-menu-item
            v-for="subMenu in menu.Items"
            @click="routeClick(subMenu)"
            :key="subMenu.MenuId"
            :index="subMenu.URL"
          >{{ subMenu.MenuName }}</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "yoMenu",
  props: {
    width: {
        type: Number,
        require: false,
        default: 250
    },
    menuList: {
        type: Array,
        require: false,
        default: function (){
            return [
            {
                MenuId: "1",
                MenuName: "我的工作台",
                URL: "/",
                OrderIndex: 1,
                MenuComment: null,
                Category: "astp",
                CategoryName: "平台",
                CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                Target: null,
                ClassName: null,
                State: 0,
                Items: []
            },
            {
                MenuId: "k194g91057ja00afb252coy",
                MenuName: "会员管理",
                URL: "",
                OrderIndex: 1,
                MenuComment: null,
                Category: "astp",
                CategoryName: "平台",
                CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                Target: null,
                ClassName: null,
                State: 0,
                Items: [
                {
                    MenuId: "k194g91140u500afb252c1m",
                    MenuName: "会员管理",
                    URL: "/member/Audit/query",
                    OrderIndex: 1,
                    MenuComment: null,
                    Category: "astp",
                    CategoryName: "平台",
                    CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                    Target: null,
                    ClassName: null,
                    State: 0,
                    Items: []
                },
                {
                    MenuId: "k194g91230pa00afb252cqx",
                    MenuName: "会员注册审核",
                    URL: "/member/Audit/list",
                    OrderIndex: 2,
                    MenuComment: null,
                    Category: "astp",
                    CategoryName: "平台",
                    CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                    Target: null,
                    ClassName: null,
                    State: 0,
                    Items: []
                },
                {
                    MenuId: "k1956h16368000afb1ac81u",
                    MenuName: "会员变更审核",
                    URL: "/member/Audit/AuditUpdate",
                    OrderIndex: 3,
                    MenuComment: null,
                    Category: "astp",
                    CategoryName: "平台",
                    CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                    Target: "",
                    ClassName: null,
                    State: 0,
                    Items: []
                },
                {
                    MenuId: "k1956h0835s300afb1ac8z9",
                    MenuName: "会员审核记录",
                    URL: "/member/Audit/AuditRecords",
                    OrderIndex: 4,
                    MenuComment: null,
                    Category: "astp",
                    CategoryName: "平台",
                    CategoryHost: "http://test.hnyotech.com.cn:10086/biz",
                    Target: "",
                    ClassName: null,
                    State: 0,
                    Items: []
                }
                ]
            }]
        }
    }
  },
  data () {
        return {
        }
  },
  created () {
  },
  mounted () {},
  computed: {
    pagehost: function () {
        //当前页面的host
        return window.location.origin + window.location.pathname
    },
    menuTree: function () {
        let that = this;
        if (that.menuList && that.menuList.length > 0) {
            //这里做下多系统的处理
            var obj = JSON.parse(JSON.stringify(that.menuList))
            //   console.log(obj)
            that.processMenu(obj)
            return obj
        }
        else {
            return that.menuList
        }
    }
  },
  methods: {
    routeClick(item){
        console.log(item)
        if(item.Target == "_blank"){
            let routeData = this.$router.resolve({ path: item.URL})
            window.open(routeData.href, '_blank')
        }else{
            this.$router.push({
                path: item.URL
            })
        }
    },
    processMenu: function (menuTree) {
      let that = this;
      if (menuTree && menuTree.length > 0) {
            // debugger;
        menuTree.forEach(m => {         
        // console.log("处理菜单:"+m.MenuName);
            let CategoryHost = m.CategoryHost;
            if (CategoryHost && CategoryHost.length > 0) {
                if (!CategoryHost.endWith('/')) {
                    CategoryHost+="/"
                // 去掉最后的/
                // CategoryHost = CategoryHost.substring(0, CategoryHost.length - 1);
                }
                if (process.env.NODE_ENV === "development") {
                    // console.log("开发模式,原值:"+CategoryHost)
                    // 开发模式 host 换 localhost
                    let host = CategoryHost.split('//')[1].split(':')[0]
                    let c1 = CategoryHost.split('://')[0]
                    let c2 = CategoryHost.split('://')[1]
                    let c3 = c2.split(':')[0]// host
                    let c4 = c2.split(':')[1]
                    CategoryHost=c1+"://"+"localhost:"+c4
                    // console.log("开发模式,替换成:"+CategoryHost)
                }
                if (CategoryHost != that.pagehost) {
                    // 非本系统菜单
                    m.Target = "_blank"
                    // 最终的url
                    let finallyUrl = CategoryHost + '#' + m.URL
                    m.URL = "/redirectsystem/" + encodeURIComponent(finallyUrl)
                }
            }
                // console.log("菜单Url:"+m.URL);
            that.processMenu(m.Items)
        });
      }
    },
  }
};
</script>
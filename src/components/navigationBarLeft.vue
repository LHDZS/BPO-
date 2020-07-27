<template>
  <div class="navigationBarLeft">
    <el-menu
      ref="menu"
      :default-active="$route.path"
      :router="true"
      class="el-menu-vertical-demo"
      @select="handleSelectLeft"
    >
      <el-submenu v-for="(item,key) in menuLeftArr" :key="key" :index="String(key)">
        <template slot="title">
          <i :class="item.icon"></i>&nbsp;
          <span>{{item.name}}</span>
        </template>
        <el-menu-item
          v-for="(list,index) in item.team"
          :key="index"
          :index="list.path"
          :indexpath="list.path"
        >
          {{list.name}}
          <!-- <router-link :to="list.path" style="display: inline-block;width:100%;height:100%">{{list.name}}</router-link> -->
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import api from '@/api/api.js'
import {get, post} from '@/api/index.js'

export default {
  name: "navigationBarLeft",
  data() {
    return {
      // menuLeftArr: [
      //   {
      //     name: "商户管理",
      //     icon: "iconfont icon-gth-gsshanghuzhongxin",
      //     team: [
      //       { name: "商户列表", path: "/" },
      //       { name: "商户签约", path: "/SignContract" },
      //       { name: "商户账号管理", path: "/account" }
      //     ]
      //   },
      //   {
      //     name: "渠道管理",
      //     icon: "iconfont icon-gth-gsgetihuzhongxin",
      //     team: [
      //       { name: "渠道列表", path: "/channelList" },
      //       { name: "主体列表", path: "/channelMain" }
      //     ]
      //   },
      //   {
      //     name: "订单管理",
      //     icon: "iconfont icon-gth-gsdingdanzhongxin",
      //     team: [
      //       { name: "注册订单", path: "/registered" }
      //     ]
      //   }
      // ]
    };
  },
  watch: {
    $route() {
      let i = this.$route.path;
      console.log(i, "路由");
      setTimeout(() => {
        //路由跳转
        this.$refs.menu.activeIndex = i;
      }, 100);
    }
  },
  props: {
    menuLeftArr:Array,
    activeIndex: String
  },
  created() {
    // console.log(this.activeIndex)
    
  },
  methods: {
    handleSelectLeft(key, keyPath) {
      // console.log(key, keyPath)
      // sessionStorage.setItem('activeIndex',key)
      // let arr = key.split("-")
      // let i = arr[0]
      // let k = arr[1]
      // console.log(this.menuLeftArr[i].team[k].path)
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.navigationBarLeft {
  float: left;
  width: 182px;
  height: calc(100% - 48px);
  background: #f5f5f5;
  a {
    text-decoration: none;
    out-line: none;
    color: #333333;
  }
  .el-menu-vertical-demo {
    height: 100%;
    overflow-y: scroll;
    white-space: nowrap;
    text-align: left;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
  // .el-menu-item.is-active {
  //   background-color: #1890ff !important;
  // }
}
</style>

<style>
.navigationBarLeft .el-submenu .el-menu-item {
  box-sizing: border-box;
  min-width: 100%;
  font-size: 13px;
}
.navigationBarLeft .el-menu {
  border-right: none;
}
/* .navigationBarLeft .el-menu-item.is-active a {
  color: #409EFF;
} */
/* .el-menu-item.is-active {
  background-color: #1890ff;
} */

</style>
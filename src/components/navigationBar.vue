<template>
  <div class="navigationBar">
    <div class="aliyun">
      <!-- <div>
        <svg t="1581130631788" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5237" width="35" height="28"><path d="M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z" p-id="5238" fill="#ffffff"></path><path d="M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z" p-id="5239" fill="#ffffff"></path><path d="M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z" p-id="5240" fill="#ffffff"></path></svg>
      </div> -->
      <img src="https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_wxapplet_1585032971702.jpg" alt="">
    </div>
    <div class="title">个体宝商户系统</div>
    <div class="menu">
      <el-menu :default-active="$route.fullPath" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="(item,key) in menuArr" :key="key" :index="item.path">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class="my">
      <el-dropdown @command="menuTrigger">
        <span class="el-dropdown-link">
          {{loginPhone}}<i class="el-icon-user el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="a">个人中心</el-dropdown-item> -->
          <el-dropdown-item command="/login">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js'
import {get, post} from '@/api/index.js'

export default {
  name: 'navigationBar',
  data () {
    return {
      activeKey: '/registered',
      // loginPhone: '',
      menuArr: [
        // {
        //   name: '首页',
        //   path: '/',
        //   submenu:[
        //     {
        //       name: "订单管理",
        //       icon: "iconfont icon-gth-gsdingdanzhongxin",
        //       team: [
        //         { name: "数据概览", path: "/" }
        //       ]
        //     }
        //   ] 
        // },
        {
          name: '订单中心',
          path: '/registered',
          submenu: [
            {
              name: "订单管理",
              icon: "iconfont icon-gth-gsdingdanzhongxin",
              team: [
                { name: "订单列表", path: "/registered" }
              ]
            }
          ]
        },
        {
          name: '交易中心',
          path: '/userAll',
          submenu: [
            // {
            //   name: "交易管理",
            //   icon: "iconfont icon-gth-gsdingdanzhongxin",
            //   team: [
            //     { name: "批量打款", path: "/batchMoney" },
            //     { name: "交易列表", path: "/transactionList" }
            //   ]
            // },
            {
              name: "用户管理",
              icon: "iconfont icon-gth-gsdingdanzhongxin",
              team: [
                { name: "个体户列表", path: "/userAll" }
              ]
            }
          ]
        },
        // {
        //   name: '财务中心',
        //   path: '/reportForms',
        //   submenu: [
        //     {
        //       name: "报表管理",
        //       icon: "iconfont icon-gth-gsdingdanzhongxin",
        //       team: [
        //         { name: "报表信息", path: "/reportForms" }
        //       ]
        //     },
        //     {
        //       name: "开票管理",
        //       icon: "iconfont icon-gth-gsdingdanzhongxin",
        //       team: [
        //         { name: "发票申请", path: "/invoiceApply" },
        //         { name: "申请列表", path: "/applyList" },
        //         { name: "发票列表", path: "/invoiceList" },
        //         { name: "开票信息", path: "/information" },
        //         { name: "邮寄地址", path: "/address" }
        //       ]
        //     }
        //   ]
        // }
      ]
    }
  },
  watch:{
    $route(val,wVal) {
      console.log(val,wVal,'++++++++++++++++++++++路由变化了吗')
      console.log(this.$route)
      for (let i = 0; i < this.menuArr.length; i++) {
        if (val.fullPath == this.menuArr[i].path) {
          this.$emit('handleSelect',val.fullPath,this.menuArr[i].submenu);
        }
      }
    }
  },
  computed: {
  // 我们使用计算属性来获取到当前点击的菜单的路由路径，然后设置default-active中的值
  // 使得菜单在载入时就能对应高亮
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      // 可以在路由配置文件中设置自定义的路由路径到meta.activeMenu属性中，来控制菜单自定义高亮显示
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  props:{
    loginPhone: String
    // menuArr:Array
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key,'菜单点击事件',this.activeIndex)
      this.$router.push({path: key})
    },
    menuTrigger(command) {
      // console.log('?????????',command)
      if (command == '/login') {
        sessionStorage.removeItem('loginPhone');
        sessionStorage.removeItem('xggsaamerchantsid');
        this.$router.push({path: '/login'})
      }
    }
  },
  created() {

  },
  mounted() {
    // this.loginPhone = sessionStorage.getItem('loginPhone');
    //   获取用户信息 
     this.$router.push({path: '/registered'})
  },
  created() {
    for (let i = 0; i < this.menuArr.length; i++) {
      if (this.$route.fullPath == this.menuArr[i].path) {
        this.$emit('handleSelect',this.$route.fullPath,this.menuArr[i].submenu);
        // sessionStorage.setItem('tabMenuArr', JSON.stringify(this.menuArr[i].submenu));
        
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.navigationBar {
  width: 100%;
  height:48px;
  // background-color: #002140;
  background:rgba(255,255,255,1);
  box-shadow:0px 2px 4px 0px rgba(223,223,223,0.5);
  .aliyun {
    // width: 160px;
    margin-left: 21px;
    height: 46px;
    float: left;
    div {
      float: left;
      width: 48px;
      height: 48px;
      line-height: 65px;
      background: none rgb(255, 106, 0);
    }
    img {
      margin: 0 auto;
      height: 80%;
      margin-top: 5px;
    }
  }
  .title {
    float: left;
    // width:200px;
    margin-left: 8px;
    // height:100%;
    line-height: 48px;
    text-align: center;
    // background:rgba(20,147,250,1);
    font-size:14px;
    font-family:PingFangSC;
    font-weight:400;
    color: #333;
    span {
      font-size: 16px;
    }
  }
  .menu {
    float: left;
    height: 100%;
    padding-left: 50px;
  }
  .my {
    float: right;
    height: 100%;
    line-height: 48px;
    margin-right: 50px;
    font-size:14px;
    font-family:PingFangSC;
    font-weight:400;
    color: #333;
    .el-dropdown {
      color: #333;
    }
  }
}
</style>

<style>
.navigationBar .el-menu--horizontal>.el-menu-item {
  width: 130px;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
}
.navigationBar .el-menu.el-menu--horizontal {
  border-bottom: none;
  height: 100%;
}
</style>

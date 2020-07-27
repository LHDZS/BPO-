<template>
  <div id="app" v-if="navigationBarType">
    <navigationBar :loginPhone="loginPhone" @handleSelect="handleSelect"></navigationBar>
    <navigationBarLeft :menuLeftArr="menuLeftArr" :activeIndex="activeIndex"></navigationBarLeft>
    <div class="main">
      <div class="view"><router-view /></div>
    </div>
  </div>
  <div id="appNo" v-else>
    <router-view />
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import navigationBarLeft from "@/components/navigationBarLeft";
import api from "@/api/api.js";
import { get, post } from "@/api/index.js";
export default {
  name: "App",
  data() {
    return {
      activeIndex: "/merchants/contractInformation",
      navigationBarType: true,
      navigationBarLeftType: true,
      navWhiteList: ["Login", "index", "OrderSource"],
      menuLeftArr: [
        {
          name: "订单管理",
          icon: "iconfont icon-gth-gsdingdanzhongxin",
          team: [
            { name: "订单列表", path: "/registered" }
          ]
        }
      ],
      menuArr: [],
      loginPhone: ''
    };
  },
  watch: {
    $route(to, from) {
      console.log(from.name);
      if (from.name == "Login") {
        // post(api.getMenu).then(
        //   d => {
        //     if (d.status == 0) {
        //       this.menuArr = d.data
        //       var path = '/' + this.$router.history.current.path.split('/')[1]
        //       for (let i = 0; i < d.data.length; i++) {
        //         if (path == d.data[i].path) {
        //           this.menuLeftArr = d.data[i].submenu
        //           sessionStorage.setItem('menuLeftArr',d.data[i].submenu)
        //         }
        //       }
        //     }
        //   },
        //   err => {}
        // );
        post(api.currentUser).then((d) => {
            if (d.status === 0) {
              console.log(d.data.ucname,'用户信息')
              this.loginPhone = d.data.saas_merchant_name
              sessionStorage.setItem('loginPhone', d.data.saas_merchant_name);
            }else {
              
            }
        }, (err) => {
              //error callback
        })
        post( api.getMenu ).then((d) => {
            console.log(d)
            if (d.status == 0) {
              this.menuLeftArr = d.data
            }
            //success callback
        }, (err) => {
            //error callback
        })
      }
      if (this.navWhiteList.indexOf(to.name) >= 0) {
        this.navigationBarType = false;
      } else {
        this.navigationBarType = true;
      }
    }
  },
  components: {
    navigationBar: navigationBar,
    navigationBarLeft: navigationBarLeft
  },
  mounted() {
    this.loginPhone = sessionStorage.getItem('loginPhone');
    // 导航菜单状态获取
    this.activeIndex = sessionStorage.getItem("activeIndex") || "0-0";
    // post( api.getMenu ).then((d) => {
    //     console.log(d)
    //     if (d.status == 0) {
    //       this.menuLeftArr = d.data
    //       sessionStorage.setItem('homePath', d.data[0].team[0].path)
    //     }
    //     //success callback
    // }, (err) => {
    //     //error callback
    // })
    // if (!sessionStorage.getItem("nameList")) {
    //   post(api.nameList).then(
    //     d => {
    //       if (d.status == 0) {
    //         var arr = [];
    //         for (let i = 0; i < d.data.length; i++) {
    //           var obj = {
    //             value: d.data[i].id,
    //             label: d.data[i].name
    //           };
    //           arr.push(obj);
    //         }
    //         console.log(arr);
    //         sessionStorage.setItem("nameList", JSON.stringify(arr));
    //       }
    //     },
    //     err => {}
    //   );
    // }
  },
  created() {
    // console.log(this.$route.path)
    if (this.navWhiteList.indexOf(this.$router.history.current.name) >= 0) {
      this.navigationBarType = false;
    } else {
      this.navigationBarType = true;
    }
    // if (sessionStorage.getItem('tabMenuArr')) {
    //   this.menuLeftArr = JSON.parse(sessionStorage.getItem('tabMenuArr'))
    // }
  },
  methods: {
    handleSelect(val,arr) {
      // console.log(val,arr,'首页点击事件')
      this.menuLeftArr = arr
      // // console.log(this.$router.history.current.path.indexOf(val) < 0)
      // if (val != '') {
      //   this.$router.push({path: val})
      // }
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .main {
    float: left;
    width: calc(100% - 182px);
    height: calc(100% - 48px);
    background: #f5f5f5;
    padding: 8px;
    box-sizing: border-box;
    .view {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      overflow-y: auto;
    }
  }
  .appMain {
    width: 100%;
    height: calc(100% - 48px);
    background: #f5f5f5;
    overflow-y: auto;
  }
}
#appNo {
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style>
.loading {
  display: inline-block;
  width: 54px;
  height: 56px;
  background: url(./assets/img/bars.svg);
  background-size: cover;
}
.el-dialog__header {
   /* background-color: #e0dcdc !important; */
   text-align-last: left !important;
}
.el-dialog__title {
   color: #101010 !important;
   font-weight: 600 !important;
   font-size: 22px !important;
}
.el-range-editor.el-input__inner {
  padding: 0px 10px !important;
}
.el-range-editor--small.el-input__inner {
  line-height: 20px !important;
}
.navigationBarLeft .el-menu-item.is-active {
  color: #333 !important;
  font-weight: 700 !important;
  background-color: #dedede !important;
}
.navigationBarLeft .el-menu-item:hover, .navigationBarLeft .el-menu-item:focus {
    outline: none !important;
    background-color: #dedede !important;
    font-weight: 700 !important;
    color: #333 !important;
}
.el-submenu .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  user-select: none !important;
  font-size: 13px !important;
}
.el-menu {
  border-right: none !important;
}
.el-input--suffix .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
.main .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
/* .el-select .el-input .el-select__caret {
  margin-top: 3px !important;
} */
.el-date-editor .el-range-input {
  height: 95% !important;
}
.el-date-editor--daterange.el-input__inner{
  width: 346px !important;
}
.el-select .el-input .el-select__caret{
  line-height: 34px !important;
}
</style>



<template>
  <div class="reportForms">
    <div class="main" v-if="detailsType">
      <div class="top-search">
        <div class="item">
          <span>个体户名称：</span>
          <div>
            <el-input v-model="saas_merchant_id" placeholder="请输入个体户名称"></el-input>
          </div>
        </div>
        <div class="item">
          <span>信用代码：</span>
          <div>
            <el-input v-model="legal_idno" placeholder="请输入统一社会信用代码"></el-input>
          </div>
        </div>
        <div class="item">
          <span style="width: 30px;"></span>
          <el-button type="primary" @click="merchantsSearch" size="small">搜索</el-button>
          <el-button type="primary" @click="merchantsReset" plain size="small">重置</el-button>
        </div>
      </div>
      <div class="bottom-table">
        <el-table
          ref="multipleTable"
          :data="tableData1"
          border
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'rgb(250, 250, 250)'}"
        >
          <el-table-column prop="name" label="个体户名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="credit_code" label="统一社会信用代码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div style="cursor: pointer;">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="查看详情">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="viewDetails(scope.row)"
                        plain
                      >查看报告</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagination>
    </div>
    <!-- 详情 -->
    <div class="main details" v-if="!detailsType">
      <div class="title">
        <div class="fanhui" @click="detailsType = true">
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <div class="qianyue">报表详情</div>
      </div>
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane :label="item.label" :name="item.name" v-for="(item,key) in tabNames" :key="key"></el-tab-pane> -->
            <el-tab-pane label="负债资产表" name="1">
              <reportBalance v-if="tabIndex == 0" :initPeriod="201010" :currentPeriod='202004' :reportData='reportData' @updateReportData="reportBalanceData"></reportBalance>
            </el-tab-pane>
            <el-tab-pane label="利润表" name="2">
              <profits v-if="tabIndex == 1" :initPeriod="201010" :currentPeriod='202004' :reportData='reportData' @updateReportData="profitsData"></profits>
            </el-tab-pane>
            <el-tab-pane label="现金流量表" name="3">
              <cashflow v-if="tabIndex == 2" :initPeriod="201010" :currentPeriod='202004' :reportData='reportData' @updateReportData="cashflowData"></cashflow>
            </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { get, post } from "@/api/index.js";
import pagination from "@/components/pagination";
export default {
  data() {
    return {
      tabIndex: 0,
      reportData: [],
      // 报表
      tabNames:[
        {
            label: '负债资产表',
            name: '1'
        },{
            label: '利润表',
            name: '2'
        },{
            label: '现金流量表',
            name: '3'
        }
      ],
      activeName: '1',
    //
      detailsType: true,
      sve_businessmen_customer_id: '',
      currentTime: '',
      orderListObj:{},
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [
        {

        }
      ],
      dialogInvoice: false,
      saas_merchant_id: "",
      legal_idno: '',
      createDate: ['',''],
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      // 阿里oss
      data: {
        d: {},
        action: ""
      }
    };
  },
  mounted() {
    var aData = new Date();
    console.log(aData) //Wed Aug 21 2019 10:00:58 GMT+0800 (中国标准时间)

    this.currentTime =
      aData.getFullYear() + '' + (aData.getMonth() + 1);
    console.log(this.currentTime) //2019-8-20

    this.businessmenPagePost();
    // oss
    this.getUploadConfig()
  },
  methods: {
    reportBalanceData(val) {
      let obj = {
        accountPeriod: val
      }
      console.log(obj,'负债资产表')
      console.log('请求月度')
      this.getReportDataPost(obj)
    },
    profitsData(val) {
      console.log(val,'利润表')
      if (val.type == "quarter") {
        console.log('请求季报')
        this.getReportDataQuarterPost(val)
      }else {
        console.log('请求月度')
        this.getReportDataPost(val)
      }
    },
    cashflowData(val) {
      console.log(val,'现金流量表')
      if (val.type == "quarter") {
        console.log('请求季报')
        this.getReportDataQuarterPost(val)
      }else {
        console.log('请求月度')
        this.getReportDataPost(val)
      }
    },
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      this.getReportDataPost()
      // console.log(tab, event);
    },
    // 阿里接口
    getUploadConfig() {
      var that = this;
      post(api.getOssConfig).then(
        d => {
          console.log(d, "阿里接口");

          that.data.d["Bucket"] = d.Bucket;
          that.data.d["OSSAccessKeyId"] = d.OSSAccessKeyId;
          that.data.d["signature"] = d.Signature;
          that.data.d["policy"] = d.policy;
          that.data.d["success_action_status"] = d.success_action_status;
          that.data.action = d.url;
        },
        err => {
          //error callback
        }
      );
    },
    // 查看详情
    viewDetails(row) {
      this.sve_businessmen_customer_id = row.customer_id;
      post(api.getCustomerById, {
        customer_id: row.customer_id
      }).then(
        d => {
          console.log(d)
          if (d.code === '000000') {
            console.log(d, "??????????????");
            this.orderListObj = d.data;
            this.detailsType = false
            this.getReportDataPost()
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 季度
    getReportDataQuarterPost(row) {
      const loading = this.$loading({
        lock: true,
        spinner: 'loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      post(api.getReportDataQuarter, {
        "companyId":this.orderListObj.companyId,
        "customerId": this.sve_businessmen_customer_id,//客户IDd
        "desc": "string",//描述  默认 string
        "startPeriod": row.startPeriod,//开始期限
        "endPeriod": row.endPeriod,//结束期限
        "reportType": this.activeName,//账期类型  默认2
        "signWithoutKey": "string"
      }).then(
        d => {
          console.log(d);
          loading.close();
          if (d.status === 0) {
            console.log(d, "??????????????");
            // this.total = d.data.count;
            this.reportData = d.data.data;
            console.log(JSON.stringify(d.data.data))
          }
        },
        err => {
          //error callback
        }
      );

    },
    // 月度
    getReportDataPost(row) {
      const loading = this.$loading({
        lock: true,
        spinner: 'loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      post(api.getReportData, {
        "accountPeriod": row ? row.accountPeriod : this.orderListObj.currentPeriod,
        "companyId": this.orderListObj.companyId,
        "customerId": this.sve_businessmen_customer_id,
        "desc": "string",
        "reportType": this.activeName,
        "signWithoutKey": "string",
      }).then(
        d => {
          console.log(d,'阅读');
           loading.close();
          if (d.status === 0) {
            console.log(d, "??????????????");
            // this.total = d.data.count;
            this.reportData = d.data.data.reportData;
            // console.log(JSON.stringify(d.data.data.reportData))
          }
        },
        err => {
          //error callback
        }
      );
    },
    businessmenPagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.businessmenPage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        sve_businessmen_name: this.saas_merchant_id,
        sve_businessmen_credit_code: this.legal_idno
      }).then(
        d => {
          console.log(d,'个体户列表');
          //  loading.close();
          if (d.status === 0) {
            console.log(d, "??????????????");
            this.total = d.data.count;
            this.tableData1 = d.data.rows;
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 重置
    merchantsReset() {
      this.createDate = ['',''];
      this.legal_idno = '';
      this.saas_merchant_id = "";
      this.businessmenPagePost();
    },
    merchantsSearch() {
      this.businessmenPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.businessmenPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.businessmenPagePost(val);
    }
  },
  components: {
    pagination: pagination
  }
};
</script>

<style lang="less" scoped>
.reportForms {
  width: 100%;
  .main {
    width: 100%;
    height: 100%;
    .top-search {
      width: 100%;
      overflow: hidden;
      .item {
        height: 46px;
        line-height: 46px;
        float: left;
        margin-bottom: 10px;
        span {
          display: inline-block;
          width: 110px;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: right;
          margin-right: 10px;
        }
        div {
          display: inline-block;
          min-width: 233px;
          height: 46px;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
    .middle-button {
      width: 100%;
      text-align: left;
      padding-top: 10px;
    }
    .bottom-table {
      width: 100%;
      margin-top: 20px;
    }
    .bottom-pag {
      width: 100%;
      margin-top: 20px;
    }
    .dialog-header {
      width: 100%;
      height: 49px;
      line-height: 49px;
      background: rgba(20, 147, 250, 0.1);
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: #333333;
      text-align: left;
      div {
        float: left;
        width: 116px;
        height: 49px;
        background: rgba(20, 147, 250, 1);
        color: #ffffff;
        text-align: center;
        margin-right: 28px;
      }
    }
    .dialong-content {
      width: 100%;
      height: 565px;
      background: rgba(216, 216, 216, 0.28);
      margin-top: 23px;
    }
  }
  .details {
    .title {
      width: 100%;
      height: 52px;
      line-height: 52px;
      .fanhui {
        float: left;
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        position: relative;
        cursor: pointer;
      }
      .fanhui:after {
        content: "";
        position: absolute;
        top: 20px;
        right: -16px;
        width: 1px;
        height: 16px;
        background-color: #979797;
      }
      .qianyue {
        float: left;
        margin-left: 24px;
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
    .content {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
      .date {
          width: 100%;
          text-align: left;
          line-height: 50px;
      }
      .name {
        width: 100%;
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        text-align: left;
        padding-left: 20px;
        box-sizing: border-box;
        position: relative;
      }
      .name:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 8px;
        width: 2px;
        height: 16px;
        background-color: #186bff;
      }
      .box {
        margin-top: 10px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        // background:rgba(250,250,250,1);
        border-radius: 6px;
        text-align: left;
        span {
          min-width: 20%;
          display: inline-block;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          // margin: 0px 55px;
          line-height: 36px;
        }
        .box_imgs {
          width: 100%;
          overflow: hidden;
          padding: 8px 0px;
          box-sizing: border-box;
          .box-item {
            min-width: 200px;
            margin-right: 10px;
            font-size: 14px;
            font-family: PingFangSC;
            font-weight: 400;
            color: #333333;
            div {
              margin-right: 10px;
            }
            .box_img {
              width: 200px;
              height: 120px;
              display: inline-block;
              background-color: #eee;
              margin-top: 8px;
              margin-right: 50px;
              .el-upload {
                width: 100% !important;
                height: 100% !important;
                img {
                  display: inline-block;
                  width: 200px;
                  height: 120px;
                }
              }
              img {
                cursor: pointer;
                display: block;
                height: 100%;
                margin: 0 auto;
              }
            }
          }
          div {
            float: left;
          }
        }
      }
      .box2 {
        margin-top: 10px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        overflow: hidden;
        span {
          min-width: 33.33%;
          float: left;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          // margin: 0px 55px;
          line-height: 36px;
        }
        .box_imgs {
          width: 100%;
          overflow: hidden;
          padding: 8px 0px;
          box-sizing: border-box;
          .box-item {
            min-width: 200px;
            margin-right: 10px;
            font-size: 14px;
            font-family: PingFangSC;
            font-weight: 400;
            color: #333333;
            div {
              margin-right: 10px;
            }
            .box_img {
              width: 200px;
              height: 120px;
              display: inline-block;
              background-color: #eee;
              margin-top: 8px;
              margin-right: 50px;
              .el-upload {
                width: 100% !important;
                height: 100% !important;
                img {
                  display: inline-block;
                  width: 200px;
                  height: 120px;
                }
              }
              img {
                cursor: pointer;
                display: inline-block;
                width: 100%;
                height: 100%;
              }
            }
          }
          div {
            float: left;
          }
        }
      }
      .box1 {
        margin-top: 10px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        overflow: hidden;
        .item {
          float: left;
          height: 93px;
          margin-right: 100px;
          margin-bottom: 20px;
          div {
            float: left;
            min-width: 55px;
            height: 93px;
          }
          .picture {
            width: 167px;
            height: 93px;
            background: rgba(246, 246, 246, 1);
            border-radius: 8px;
            border: 1px solid rgba(198, 198, 198, 1);
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

<style>
 .reportForms .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .reportForms .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .reportForms .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 104px;
    height: 104px;
    line-height: 104px;
    text-align: center;
  }
  .reportForms .avatar {
    width: 104px;
    height: 104px;
    display: block;
  }
  /* .reportForms .CheckAccept .el-form-item {
    margin-bottom: 0px;
  } */
</style>



<template>
  <div class="applyList">
    <div class="main">
      <div class="top-search">
        <div class="item">
          <span>发票申请编码：</span>
          <div>
            <el-input
              v-model="channelCode"
              placeholder="请输入商户名称"
            ></el-input>
          </div>
        </div>
        <div class="item">
          <span>申请时间：</span>
          <div>
            <el-date-picker
              v-model="channelTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </div>
        <div class="item">
          <span style="width: 30px;"></span>
          <el-button
            type="primary"
            @click="merchantsSearch"
            size="small"
          >搜索</el-button>
          <el-button
            type="primary"
            @click="merchantsReset"
            plain
            size="small"
          >重置</el-button>
        </div>
      </div>
      <div class="alert">
        <el-alert
          title="温馨提示："
          type="warning"
          description="您的发票申请，我公司会在1-7个工作日内受理并邮寄至贵公司。"
          :closable="false"
          show-icon
        ></el-alert>
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
          <el-table-column
            prop="apply_no"
            label="发票申请编号"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="invoice_type"
            label="发票类型"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.invoice_type == 10">增值税专用发票</div>
              <div v-if="scope.row.invoice_type == 20">增值税普通发票</div>
              <div v-if="scope.row.invoice_type == 30">普通发票</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoice_amount"
            label="计税合计总额（元）"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="created_at"
            label="申请时间"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="status_name"
            label="进度"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="to_name"
            label="发票抬头"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="from_name"
            label="开票方"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
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
                      >查看详情</el-button>
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
    <!-- 查看详情 -->
    <el-dialog
      :visible.sync="dialogDetails"
      width="1080px"
      :before-close="handleClose"
    >
      <div class="checkDetails">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="发票申请"
            name="first"
          >
            <div class="main">
              <div class="title">申请详情</div>
              <div class="content">
                <div class="list">
                  <span>发票申请编号：{{invoiceObj.apply_no}}</span>
                  <span>发票类型：{{invoiceObj.invoice_type_name}}</span>
                  <span style="margin-right: 0px;">申请时间：{{invoiceObj.created_at}}</span>
                </div>
                <div class="list">
                  <span>价税合计总额（元）：{{invoiceObj.invoice_amount}}</span>
                </div>
              </div>
            </div>
            <div class="main">
              <div class="title">发票抬头</div>
              <div class="content">
                <div class="list">
                  <span>商户名称：{{invoiceObj.to_name}}</span>
                  <span>纳税人识别号：{{invoiceObj.to_credit_code}}</span>
                  <span style="margin-right: 0px;">地址：{{invoiceObj.to_addr}}</span>
                </div>
                <div class="list">
                  <span>电话：{{invoiceObj.to_mobile}}</span>
                  <span>开户行：{{invoiceObj.to_bank}}</span>
                  <span>对公账户：{{invoiceObj.to_account}}</span>
                </div>
              </div>
            </div>
            <div class="main">
              <div class="title">发票交付</div>
              <div class="content">
                <div class="list">
                  <span>收件人姓名：{{invoiceObj.mail_to}}</span>
                  <span>联系电话：{{invoiceObj.mail_mobile}}</span>
                  <span style="margin-right: 0px;">详细地址：{{invoiceObj.mail_addr}}</span>
                </div>
              </div>
            </div>
            <div class="main">
              <div class="title">付款信息</div>
              <div class="content">
                <div class="list">
                  <span>个税：{{invoiceObj.personal_invoice_tax || 0}}</span>
                  <span>增值税：{{invoiceObj.value_added_tax || 0}}</span>
                  <span style="margin-right: 0px;">附加税：{{invoiceObj.additional_tax || 0}}</span>
                </div>
                <div class="list">
                  <span>服务费：{{invoiceObj.service_tax || 0}}</span>
                </div>
                <!-- <div class="list">
                  <span class="span">支付凭证：</span>
                  <div>
                    <img :src="invoiceObj.statements" alt />
                  </div>
                </div>-->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="账单"
            name="second"
          >
            <div
              class="main"
              v-if="invoiceObj.fee_type == '10' || invoiceObj.fee_type == '20'"
            >
              <el-table
                ref="multipleTable"
                :data="invoiceObj.tradOrder"
                border
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
              >
                <el-table-column
                  prop="trade_no"
                  label="资金流水号"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="acc_name"
                  label="收款户名"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="acc_no"
                  label="收款账号"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="amt"
                  label="实发金额（元）"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="credit_code"
                  label="信用代码"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="out_trade_no"
                  label="商户订单号"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </div>
            <div
              class="main"
              v-if="invoiceObj.fee_type == '00'"
            >
              <el-table
                ref="multipleTable"
                :data="invoiceObj.tradOrder"
                border
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
              >
                <el-table-column
                  prop="id"
                  label="订单编号"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="bminfo.legal_name"
                  label="法人名称"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="bminfo.legal_idno"
                  label="身份证号码"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="bminfo.legal_mobile"
                  label="联系电话"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="bminfo.company_names"
                  label="个体户名称"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="status_name"
                  label="订单状态"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="已开具发票"
            name="third"
          >
            <div class="main">
              <!-- <div class="title">发票照片</div> -->
              <div class="photo">
                <img
                  v-if="invoiceObj.saasInvoice"
                  :src="invoiceObj.saasInvoice.invoice_img"
                  alt
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { get, post } from "@/api/index.js";
import pagination from "@/components/pagination";
export default {
  data() {
    return {
      tableData2: [],
      mainIdOptions: [],
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [],
      channelCode: "",
      channelTime: ["", ""],
      dialogDetails: false,
      invoiceObj: {},
      activeName: "first"
    };
  },
  mounted() {
    this.merchantinvoiceapplyPagePost();

    // 商户
    post(api.merchantCtlDics).then(
      d => {
        console.log(d, "商户");
        if (d.status === 0) {
          this.mainIdOptions = d.data;
        }
      },
      err => {
        //error callback
      }
    );
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 查看详情
    viewDetails(row) {
      post(api.invoiceOrder, {
        id: row.id
      }).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.dialogDetails = true;
            this.invoiceObj = d.data;
          }
        },
        err => {
          //error callback
        }
      );
    },
    merchantinvoiceapplyPagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.merchantinvoiceapplyPage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        apply_no: this.channelCode,
        begin_time: this.channelTime[0],
        end_time: this.channelTime[1]
      }).then(
        d => {
          console.log(d.status);
          // loading.close();
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
      this.channelCode = "";
      this.channelTime = ["", ""];
      this.merchantinvoiceapplyPagePost();
    },
    merchantsSearch() {
      if (!this.channelTime.length) {
        this.channelTime = ["", ""];
      }
      this.merchantinvoiceapplyPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.merchantinvoiceapplyPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.merchantinvoiceapplyPagePost(val);
    },
    handleClose(done) {
      done();
    }
  },
  components: {
    pagination: pagination
  }
};
</script>

<style lang="less" scoped>
.applyList {
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
    .alert {
      width: 100%;
      margin: 20px 0px;
      text-align: left;
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
  .checkDetails {
    width: 100%;
    .main {
      width: 100%;
      height: auto;
      background: rgba(244, 244, 244, 0.78);
      border-radius: 6px;
      padding: 10px 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      .title {
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 34px;
      }
      .content {
        width: 100%;
        padding: 10px 18px;
        box-sizing: border-box;
        text-align: left;
        padding-bottom: 0px;
        .list {
          width: 100%;
          overflow: hidden;
          margin-bottom: 10px;
          span {
            margin-right: 70px;
            font-size: 14px;
            font-family: PingFangSC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
          .span {
            margin-right: 10px;
            float: left;
          }
          div {
            float: left;
            width: 139px;
            height: 50px;
            background: rgba(227, 227, 227, 1);
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .photo {
        width: 980px;
        height: 727px;
        margin: 20px auto;
        background: rgba(255, 255, 255, 1);
        // border-radius: 6px;
        // border: 1px solid rgba(220, 220, 220, 1);
        padding: 10px;
        box-sizing: border-box;
        img {
          display: inline-block;
          width: 100%;
          // height: 100%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>

<style>
/* 上传 */
.applyList .el-dialog__header {
  background-color: #fff !important;
}
.applyList .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.applyList .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.applyList .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 252px;
  height: 306px;
  line-height: 306px;
  text-align: center;
}
.applyList .avatar {
  width: 252px;
  height: 306px;
  display: block;
}
</style>


<template>
  <div class="invoiceList">
    <div class="main">
      <div class="top-search">
        <div class="item">
          <span>发票申请编码：</span>
          <div><el-input v-model="channelCode" placeholder="请输入发票申请编码"></el-input></div>
        </div>
        <div class="item">
            <span>开票时间：</span>
            <div>
                <el-date-picker
                  v-model="channelTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <div class="item">
          <span>发票代码：</span>
          <div><el-input v-model="channelOn" placeholder="请输入发票代码"></el-input></div>
        </div>
        <div class="item">
          <span>开票方：</span>
          <div><el-input v-model="channelName" placeholder="请输入开票方"></el-input></div>
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
          <el-table-column prop="invoice_type" label="发票类型" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div v-if="scope.row.invoice_type == 10">增值税专用发票</div>
                <div v-if="scope.row.invoice_type == 20">增值税普通发票</div>
                <div v-if="scope.row.invoice_type == 30">普通发票</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoice_no" label="发票代码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="invoice_number" label="发票号码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="invoice_time" label="开票日期" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="invoice_amount" label="价税总计（元）" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="merchant_bank" label="购买方" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <div>名称：{{scope.row.from_name}}</div>
                  <div>纳税人识别号：{{scope.row.from_credit_code}}</div>
                  <div>地址：{{scope.row.from_addr}}</div>
                  <div>电话：{{scope.row.from_mobile}}</div>
                  <div>开户行：{{scope.row.from_bank}}</div>
                  <div>账号：{{scope.row.from_account}}</div>
              </template>
          </el-table-column>
          <el-table-column prop="to_name" label="邮寄信息" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <div>收件人姓名：{{scope.row.to_name}}</div>
                  <div>联系电话：{{scope.row.to_mobile}}</div>
                  <div>详细地址：{{scope.row.to_addr}}</div>
              </template>
          </el-table-column>
          <el-table-column prop="apply_no" label="发票申请编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div style="cursor: pointer;">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="查看发票">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="viewDetails(scope.row)"
                        plain
                      >查看发票</el-button>
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
    <!-- 查看发票弹出层 -->
    <el-dialog
      title="查看发票"
      :visible.sync="dialogSubject"
      width="985px"
      :before-close="handleClose">
      <div class="CheckAccept">
        <img :src="invoiceImg" alt="">
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
      mainIdOptions: [],
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [],
      dialogSubject: false,
      channelName: "",
      channelCode: '',
      channelOn: '',
      channelTime: ['',''],
      invoiceImg: ''
    };
  },
  mounted() {
    this.invoicePagePost();

    // 商户
    post(api.merchantCtlDics).then(
      d => {
        console.log(d,'商户');
        if (d.status === 0) {
          this.mainIdOptions = d.data
        }
      },
      err => {
        //error callback
      }
    );
  },
  methods: {
    mainIdChange(val) {
        console.log(val)
        this.subjectForm.id = val
    },
    // 查看详情
    viewDetails(row) {
        if (!row.invoice_img) {
          return this.$message({
            message: '当前用户未上传发票图片',
            type: 'warning'
          });
        }
        this.dialogSubject = true;
        this.invoiceImg = row.invoice_img
    },
    invoicePagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.invoicePage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        apply_no: this.channelCode,
        invoice_no: this.channelOn,
        from_name: this.channelName,
        begin_time: this.channelTime[0],
        end_time: this.channelTime[1]
      }).then(
        d => {
          console.log(d);
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
      this.channelName = "";
      this.channelCode = "";
      this.channelOn = "";
      this.channelTime = ['',''];
      this.invoicePagePost();
    },
    merchantsSearch() {
      if (!this.channelTime.length) {
        this.channelTime = ['',''];
      }
      this.invoicePagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.invoicePagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.invoicePagePost(val);
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
.invoiceList {
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
        font-size: 14px;
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
        height: 13px;
        background-color: #979797;
      }
      .qianyue {
        float: left;
        margin-left: 24px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
    .content {
      width: 100%;
      .name {
        width: 100%;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        text-align: left;
        padding-left: 10px;
        box-sizing: border-box;
      }
      .box {
        margin-top: 10px;
        width: 100%;
        padding: 30px 10px;
        box-sizing: border-box;
        background: rgba(250, 250, 250, 1);
        border-radius: 6px;
        text-align: left;
        span {
          display: inline-block;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin: 0px 55px;
          line-height: 36px;
        }
      }
      .box1 {
        margin-top: 10px;
        width: 100%;
        padding: 30px 10px;
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
          }
        }
      }
    }
  }
  .CheckAccept {
      width: 96%; 
      margin: 0 auto; 
      text-align: left;
      img {
          width: 100%;
          // height: 100%;
          display: inline-block;
      }
      .title {
          width: 100%;
          margin-bottom: 8px;
          color: rgba(0, 12, 23, 1);
          font-size: 16px;
          text-align: left;
          span {
            font-size: 18px;
            font-weight: 600;
          }
          i {
              color: #E6A23C;
              font-size: 24px;
              margin-right: 8px;
          }
      }
      .main {
        width: 100%;
        .item {
          display: inline-block;
          width: 49%;
        }
      }
      .button {
        width: 100%;
        text-align: right;
      }
  }
}
</style>

<style>
/* 上传 */
.invoiceList .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.invoiceList .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.invoiceList .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 252px;
  height: 306px;
  line-height: 306px;
  text-align: center;
}
.invoiceList .avatar {
  width: 252px;
  height: 306px;
  display: block;
}
</style>
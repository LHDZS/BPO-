

<template>
  <div class="transactionList">
    <div class="main">
      <div class="top-search">
        <div class="item">
          <span>商户订单号：</span>
          <div>
            <el-input v-model="saas_merchant_id" placeholder="请输入商户订单号"></el-input>
          </div>
        </div>
        <div class="item">
          <span>收款户名：</span>
          <div>
            <el-input v-model="acc_name" placeholder="请输入收款户名"></el-input>
          </div>
        </div>
        <div class="item">
          <span>收款账户：</span>
          <div>
            <el-input v-model="acc_no" placeholder="请输入收款账户"></el-input>
          </div>
        </div>
        <div class="item">
          <span>信用代码：</span>
          <div>
            <el-input v-model="credit_code" placeholder="请输入个体户统一社会信用代码"></el-input>
          </div>
        </div>
        <div class="item">
          <span>创建时间：</span>
          <div>
            <el-date-picker
              v-model="createDate"
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
          <span>交易状态：</span>
          <div>
            <el-select v-model="trade_status" placeholder="请选择交易状态">
                <el-option
                v-for="item in tradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
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
          <el-table-column prop="trade_no" label="打款编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="acc_name" label="收款户名" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="acc_no" label="收款账号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="trade_status_name" label="交易状态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="trade_desc" label="交易描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actual_amt" label="实发金额(元)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="service_tax" label="服务费(元)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deduct_amt" label="总扣款金额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="credit_code" label="信用代码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="out_trade_no" label="商户订单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div style="cursor: pointer;">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="查看回执">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="redact(scope.row)"
                        plain
                      >查看回执</el-button>
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
    <!-- 打款弹出层 -->
    <el-dialog title="打款" width="610px" :visible.sync="dialogMoney" :before-close="handleClose">
      <div style="width:460px;">
        <el-form ref="moneyForm" :model="moneyForm" :rules="moneyRules" label-width="125px">
          <el-form-item label="打款模式：" prop="saas_merchant_id">
            <el-select v-model="moneyForm.saas_merchant_id" placeholder="请选择打款模式" style="width:100%">
              <el-option
                v-for="item in mainIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('moneyForm')">确定</el-button>
            <el-button @click="resetForm('moneyForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
         <!-- 查看回执弹出层 -->
    <el-dialog
      title="查看回执"
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
      tradeOptions: [{
        value: '00',
        label: '成功'
      },{
        value: '01',
        label: '待处理'
      },{
        value: '02',
        label: '失败'
      }],
      mainIdOptions: [],
       dialogSubject: false,
        invoiceImg: '',
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [],
      createDate: ['',''],
      saas_merchant_id: "",
      acc_name: '',
      acc_no: '',
      credit_code: '',
      trade_status: '',
      dialogMoney: false,
      moneyForm:{},
      moneyRules:{},
    };
  },
  mounted() {
    // this.restaurants = JSON.parse(localStorage.getItem("transactionList")) || [];
    this.itemPagePost();
    // 商户
    post(api.merchantCtlDics).then(
      d => {
        console.log(d);
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
      // 返回列表
    returnList() {
      this.contractType = true;
      this.signingObj = {
        id: '',
        main_id: "",
        begin_date: "",
        end_date: "",
        bm_reg_price: "",
        invoice_service_rate: "",
        trans_service_rate: ""
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          post(api.userSave, this.accountForm).then(
            d => {
              if (d.status === 0) {
                console.log(d, "??????????????");
                this.dialogInvoice = false
                this.itemPagePost()
              }
            },
            err => {
              //error callback
            }
          );
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogInvoice = false
    },
    // 增加账号
    addAccount() {
      this.accountForm = {
        id: '',
        saas_merchant_id: '',
        realName: '',
        ucname: '',
        mobile: '',
        password: '',
        isEnabled: 0
      }
      this.dialogInvoice = true
      this.dialogTitle = '增加账号'
    },
    // 编辑
    redact(row) {
      if (!row.trade_receipt) {
          return this.$message({
            message: '当前无回执',
            type: 'warning'
          });
        }
       this.dialogSubject = true;
       this.invoiceImg = row.trade_receipt
      // post(api.userInfo, {
      //   id: row.id
      // }).then(
      //   d => {
      //     if (d.status === 0) {
      //       console.log(d, "??????????????");
      //       this.accountForm = d.data.data;
      //       this.dialogInvoice = true
      //       this.dialogTitle = '编辑账号'
      //     }
      //   },
      //   err => {
      //     //error callback
      //   }
      // );
    },
    itemPagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.itemPage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        "out_trade_no": this.saas_merchant_id,             // 商户订单号
        "acc_name": this.acc_name,                 // 收款户名
        "acc_no": this.acc_no,                   // 收款账户
        "credit_code": this.credit_code,              // 信用代码
        "trade_status": this.trade_status,             // 交易状态 00成功 01待处理 02失败
        "createBegin": this.createDate[0],            // 创建时间-开始  可以只选开始，也可以只选结束，格式：2020-04-03
        "createEnd": this.createDate[1]              // 创建时间-结束
      }).then(
        d => {
          console.log(d.status);
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
      this.saas_merchant_id = "";
      this.createDate = ['',''];
      this.acc_name = '';
      this.acc_no = '';
      this.credit_code = '';
      this.trade_status = '';
      this.itemPagePost();
    },
    merchantsSearch() {
      this.itemPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.itemPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.itemPagePost(val);
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
.transactionList {
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
  .contractType {
    .title {
      width: 100%;
      height: 52px;
      line-height: 52px;
      .fanhui {
        float: left;
        font-size: 18px;
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
        height: 18px;
        background-color: #979797;
      }
      .qianyue {
        float: left;
        margin-left: 24px;
        font-size: 18px;
        font-family: PingFangSC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
    .box1 {
      width: 100%;
      min-height: 127px;
      overflow: hidden;
    //   background: rgba(250, 250, 250, 0.78);
      border-radius: 6px;
      padding: 30px 40px;
      box-sizing: border-box;
      .list {
        margin-top: 17px;
      }
      .item {
        width: 100%;
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 400;
        color: #717174;
        overflow: hidden;
        box-sizing: border-box;
        padding-left: 50px;
        .search-item {
          float: left;
          width: 30%;
          min-width: 295px;
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          overflow: hidden;
          margin-bottom: 30px;
          text-align: left;
          span {
            float: left;
            text-align: right;
          }
          div {
            float: left;
            // width: 233px;
            img {
                display: inline-block;
                width: 200px;
                height: 120px;
                background-color: #eee;
            }
          }
        }
      }
      .title {
        width: 100%;
        height: 45px;
        display:flex;
        display: -webkit-flex;
        align-items:center;
        .shu {
          width: 3px;
          height: 20px;
          display: inline-block;
          background-color: #186bff;
        }
        .name {
          display: inline-block;
          // width: 80px;
          color: rgba(16, 16, 16, 1);
          font-size: 18px;
          margin-left: 11px;
          font-weight: 600;
          white-space: nowrap;  
        }
        .heng {
          margin-left: 11px;
          display: inline-block;
          width: 100%;
          height: 1px;
          background-color: #bbb;
        }
      }
    }
    .remind {
      width: 100%;
      height: 61px;
      line-height: 61px;
      padding-left: 35px;
      margin-top: 20px;
      box-sizing: border-box;
      background: rgba(255, 250, 227, 1);
      border: 1px solid rgba(255, 166, 61, 1);
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text-align: left;
    }
  }
     .CheckAccept {
      width: 96%; 
      margin: 0 auto; 
      text-align: left;
      img {
          width: 100%;
          height: 100%;
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

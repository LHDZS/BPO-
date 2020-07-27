

<template>
  <div class="iInvoiceApply">
    <div class="main">
      <div class="top-search">
        <div class="item">
          <span>选择费用记录类型：</span>
          <div>
            <el-select v-model="costType" style="width:100%" placeholder="请选择费用类型" @change="costChange">
                <el-option
                v-for="item in CostOptions"
                :key="item.type"
                :label="item.name"
                :value="item.type">
                </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="top-search">
        <div class="left">本次申请开票{{data_ids.length}}张，共计开票金额：￥{{deduct_amt.toFixed(2)}}</div>
        <div class="right">
          <span style="width: 30px;"></span>
          <el-button @click="increasedBody" size="small">提交申请</el-button>
        </div>
      </div>
      <div class="alert">
        <el-alert
          title="温馨提示："
          type="warning"
          description="个体户注册订单收费和转账交易的发票开具是独立的。"
          :closable="false"
          show-icon>
        </el-alert>
      </div>
      <div class="top-search">
        <div class="item">
          <span>创建时间：</span>
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
        <div class="right">
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" v-if="tableArray.length"></el-table-column>
          <el-table-column v-for="(item,key) in tableArray" :key="key" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
      <pagination
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagination>
    </div>
    <!-- 发票申请弹出层 -->
    <el-dialog
      title="发票申请"
      :visible.sync="dialogSubject"
      width="1176px"
      :before-close="handleClose">
      <div class="CheckAccept" v-if="dialogKey == 1">
        <el-form ref="subjectForm" :model="subjectForm" :rules="subjectRules" label-width="180px">
          <div class="title">发票抬头信息</div>
          <div class="main">
            <div class="item">
              <el-form-item label="商户名称：">
                <el-input v-model="subjectTitleObj.merchant_name" placeholder="请输入统一社会信用代码" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="统一社会信用代码：">
                <el-input v-model="subjectTitleObj.merchant_credit_code" placeholder="请输入统一社会信用代码" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="地址：">
                <el-input v-model="subjectTitleObj.merchant_addr" placeholder="请输入地址" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="电话：">
                <el-input v-model="subjectTitleObj.merchant_mobile" placeholder="请输入电话" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="开户行：">
                <el-input v-model="subjectTitleObj.merchant_bank" placeholder="请输入开户行" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="账号：">
                <el-input v-model="subjectTitleObj.merchant_account" placeholder="请输入账号" :disabled="true"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="title">发票信息</div>
          <div class="main">
            <div class="item">
              <el-form-item label="发票类型：" prop="invoice_type">
                <el-select v-model="subjectForm.invoice_type" style="width:100%" placeholder="请选择商发票类型">
                    <el-option
                    v-for="item in invoiceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="title">交付信息</div>
          <div class="main">
            <div class="item">
              <el-form-item label="收件人：">
                <el-input v-model="subjectAddrObj.mail_to" placeholder="请输入收件人" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="联系电话：">
                <el-input v-model="subjectAddrObj.mail_mobile" placeholder="请输入联系电话" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="邮寄地址：">
                <el-input v-model="subjectAddrObj.mail_addr" placeholder="请输入邮寄地址" :disabled="true"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="button">
            <el-button v-if="costType == '20'" @click="nextStep()">下一步</el-button>
            <el-button v-if="costType != '20'" type="primary" @click="submitSubject('subjectForm')">确定</el-button>
            <el-button v-if="costType != '20'" @click="resetSubject('subjectForm')">取消</el-button>
          </div>
        </el-form>
      </div>
      <div class="CheckAccept" v-if="dialogKey == 2">
        <div class="title">确定个体户开票信息</div>
         <el-table
          ref="multipleTable"
          :data="tableData2"
          border
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'rgb(250, 250, 250)'}"
        >
          <el-table-column prop="name" label="个体户名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="credit_code" label="统一社会信用代码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="is_bank_name" label="银行开户状态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="invoice_amount" label="开票金额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="personal_invoice_tax" label="个税" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="value_added_tax" label="增值税" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="additional_tax" label="附加税" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="service_tax" label="服务费" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="unit" label="单位" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="created_at" label="发票内容" :show-overflow-tooltip="true"></el-table-column> -->
        </el-table>
        <div class="alert">
           <el-alert
              title="温馨提示："
              type="warning"
              description="已银行开户的个体户请保证开户账户资金大于所需扣除的费用"
              :closable="false"
              show-icon>
            </el-alert>
        </div>
        <div class="button">
          <el-button @click="dialogKey = 1">上一步</el-button>
          <el-button @click="dialogKey = 3">下一步</el-button>
        </div>
      </div>
      <div class="CheckAccept" v-if="dialogKey == 3">
        <div class="title">税款金额：</div>
        <div class="lists_span">
          <span>个税（元）：{{paymentTax.personal_invoice_tax_total}}</span>
          <span>增值税（元）：{{paymentTax.value_added_tax_total}}</span>
          <span>附加税（元）：{{paymentTax.additional_tax_total}}</span>
          <span>服务费（元）：{{paymentTax.service_tax_total}}</span>
        </div>
        <div class="title">付款金额：</div>
        <el-form ref="subjectForm" :model="subjectForm" :rules="subjectRules" label-width="103px">
          <div class="lists_div">
            <div class="list">总扣款金额（元）：{{paymentTax.pay_total}}</div>
            <div class="list">账户名称：{{paymentMain.bank_account}}</div>
            <div class="list">开户银行：{{paymentMain.bank_name}}</div>
            <div class="list">银行账户：{{paymentMain.bank_no}}</div>
            <el-form-item label="支付凭证：" prop="imageUrl">
              <el-upload
                class="avatar-uploader"
                :action="data.action"
                :data="data.d"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img style="display: inline-block;width: 200px;" v-if="subjectForm.imageUrl" :src="subjectForm.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </div>
            <div class="button">
              <el-button @click="dialogKey = 2">上一步</el-button>
              <el-button type="primary" @click="paymentSubmitted('subjectForm')">确定</el-button>
            </div>
        </el-form>
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
      dialogKey: 1,
      imageUrl: '',
      tableData2: [],
      paymentTax: {},
      paymentMain: {},
      invoiceOptions: [
        {
          value: '10',
          label: '增值税专用发票'
        },
        {
          value: '20',
          label: '增值税普通发票'
        },
        {
          value: '30',
          label: '普通发票'
        }
      ],
      subjectForm: {
        id: '',
        invoice_type: '',
        imageUrl: ''
      },
      subjectRules:{
        invoice_type:[
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ]
      },
      deduct_amt: 0,
      data_ids: [],
      subjectTitleObj: {},
      subjectAddrObj: {},
      //总条数
      CostOptions: [],
      tableArr:{
        '00': [
          {
            label: '订单编号',
            prop: 'id'
          },{
            label: '法人名称',
            prop: 'bminfo.legal_name'
          },{
            label: '身份证号码',
            prop: 'bminfo.legal_idno'
          },{
            label: '联系电话',
            prop: 'bminfo.legal_mobile'
          },{
            label: '个体户名称',
            prop: 'bminfo.company_names'
          },{
            label: '订单状态',
            prop: 'status_name'
          },{
            label: '创建时间',
            prop: 'created_at'
          }
        ],
        '10': [
          {
            label: '资金流水号',
            prop: 'trade_no'
          },{
            label: '收款户名',
            prop: 'acc_name'
          },{
            label: '收款账号',
            prop: 'acc_no'
          },{
            label: '总扣款金额（元）',
            prop: 'deduct_amt'
          },{
            label: '信用代码',
            prop: 'credit_code'
          },{
            label: '商户订单号',
            prop: 'out_trade_no'
          },{
            label: '创建时间',
            prop: 'created_at'
          }
        ],
        '20': [
          {
            label: '资金流水号',
            prop: 'trade_no'
          },{
            label: '收款户名',
            prop: 'acc_name'
          },{
            label: '收款账号',
            prop: 'acc_no'
          },{
            label: '总扣款金额（元）',
            prop: 'deduct_amt'
          },{
            label: '信用代码',
            prop: 'credit_code'
          },{
            label: '商户订单号',
            prop: 'out_trade_no'
          },{
            label: '创建时间',
            prop: 'created_at'
          }
        ]
      },
      tableArray:[],
      total: null,
      pageSize: 10,
      tableData1: [],
      dialogSubject: false,
      costType: "",
      channelTime: ['',''],
      // 阿里oss
      data: {
        d: {},
        action: ""
      }
    };
  },
  created() {
    this.costType = '';
    this.feeTypeDicPost();
    // oss
    this.getUploadConfig()
  },
  mounted() {

  },
  methods: {
    // 下一步
    nextStep() {
      if (this.subjectForm.invoice_type == '') {
        return this.$message({
          message: '请选择发票类型',
          type: 'warning'
        });
      }
      post(api.confirmInvoice,{
        fee_type: this.costType,
        invoice_type: this.subjectForm.invoice_type,
        data_ids: this.data_ids
      }).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.dialogKey = 2;
            this.tableData2 = d.data.invoiceList;
            this.paymentTax = d.data.tax;
            this.paymentMain = d.data.main;
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 选择费用类型
    costChange(val) {
      console.log(val);
      this.tableArray = this.tableArr[val];
      this.costType = val;
      this.platformPagePost();
    },
    // 请求费用类型
    feeTypeDicPost() {
      post(api.feeTypeDic).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.CostOptions = d.data
          }
        },
        err => {
          //error callback
        }
      );
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
    // 选择
    handleSelectionChange(val) {
      console.log(val);
      this.data_ids = [];
      this.deduct_amt = 0;
       for (let i = 0; i < val.length; i++) {
         if (val[i].deduct_amt) {
           this.deduct_amt += val[i].deduct_amt;
         }else {
           this.deduct_amt += val[i].price;
         }
         this.data_ids.push(val[i].id)
        }
    },
    mainIdChange(val) {
      console.log(val)
      this.subjectForm.id = val
    },
    platformPagePost(size) {
      if(!this.costType) {
        this.$message.error('请选择费用类型');
        return;
      }
      post(api.platformPage, {
        currentPage: size || 1,
        fee_type: this.costType,
        pageSize: this.pageSize,
        createBegin: this.channelTime[0],       //开始时间
        createEnd: this.channelTime[1],         //结束时间
      }).then(
        d => {
          console.log(d);
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
    paymentSubmitted(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          post(api.invoiceCtlApply, {
            fee_type: this.costType,
            invoice_type: this.subjectForm.invoice_type,
            pay_voucher: this.subjectForm.imageUrl,
            invoiceList: this.tableData2,
            data_ids: this.data_ids
          }).then(
            d => {
              console.log(d);
              if (d.status === 0) {
                this.dialogSubject = false;
                this.platformPagePost();
                this.$message({
                  message: '申请成功',
                  type: 'success'
                });
              }else {
                this.$message({
                  message: d.msg,
                  type: 'warning'
                });
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
    // 申请发票确认
    submitSubject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          post(api.invoiceCtlApply, {
            fee_type: this.costType,
            invoice_type: this.subjectForm.invoice_type,
            data_ids: this.data_ids
          }).then(
            d => {
              console.log(d);
              if (d.status === 0) {
                this.dialogSubject = false;
                this.platformPagePost();
                this.$message({
                  message: '申请成功',
                  type: 'success'
                });
              }else {
                this.$message({
                  message: d.msg,
                  type: 'warning'
                });
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
    // 申请取消
    resetSubject(formName) {
      this.$refs[formName].resetFields();
      this.dialogSubject = false
    },
    // 申请发票
    increasedBody() {
      if (!this.data_ids.length) {
        return  this.$message({
          message: '请选择发票',
          type: 'warning'
        });
      }
      this.dialogKey = 1;
      post(api.merchantCtlTitle).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.dialogSubject = true
            this.subjectTitleObj = d.data;
          }
        },
        err => {
          //error callback
        }
      );
      post(api.merchantCtlAddr).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.subjectAddrObj = d.data
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 重置
    merchantsReset() {
      this.costType = "";
      this.channelTime = ['',''];
      this.platformPagePost();
    },
    merchantsSearch() {
      if (!this.channelTime.length) {
        this.channelTime = ['',''];
      }
      this.platformPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.platformPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.platformPagePost(val);
    },
    handleAvatarSuccess(res, file) {
      var result = res.substring(
        res.indexOf("https://gsb-zc.oss-cn-beijing.aliyuncs.com"),
        res.indexOf("</Location>")
      );
      this.subjectForm.imageUrl = result;
      this.$forceUpdate()
    },
    beforeAvatarUpload(file) {
      this.data.d["key"] = "zc_wxapplet_" + new Date().getTime() + ".jpg";
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      return isJPG;
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
.iInvoiceApply {
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
      .right {
        float: right;
      }
      .left {
        float: left;
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
        text-align: left;
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
          height: 100%;
          display: inline-block;
      }
      .lists_span {
        width: 100%;
        overflow: hidden;
        margin-bottom: 20px;
        padding-left: 35px;
        box-sizing: border-box;
        span {
          float: left;
          width: 30%;
          height: 36px;
          line-height: 36px;
          color: rgba(16, 16, 16, 1);
          font-size: 16px;
          text-align: left;
        }
      }
      .lists_div {
        width: 100%;
        overflow: hidden;
        margin-bottom: 20px;
        padding-left: 35px;
        box-sizing: border-box;
        .list {
          width: 100%;
          height: 40px;
          line-height: 40px;
          color: rgba(16, 16, 16, 1);
          font-size: 16px;
          text-align: left;
        }
      }
      .title {
          width: 100%;
          margin-bottom: 30px;
          color: rgba(0, 12, 23, 1);
          font-size: 18px;
          text-align: left;
          font-weight: 600;
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
      .alert {
        width: 100%;
        margin: 30px 0px;
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
.iInvoiceApply .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.iInvoiceApply .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.iInvoiceApply .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 104px;
  text-align: center;
}
.iInvoiceApply .avatar {
  width: 104px;
  height: 104px;
  display: block;
}
.iInvoiceApply .el-form-item__label {
  color: #101010;
  font-size: 16px;
}
</style>
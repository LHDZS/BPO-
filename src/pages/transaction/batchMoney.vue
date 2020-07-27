

<template>
  <div class="batchMoney">
    <div class="main" v-if="contractType && moneyType">
      <div class="top-search">
        <div class="item">
          <span>商户订单号：</span>
          <div>
            <el-input v-model="out_trade_no" placeholder="请输入商户订单号"></el-input>
          </div>
        </div>
        <div class="item">
          <span>打款状态：</span>
          <div>
            <el-select v-model="trade_status" placeholder="请选择打款状态">
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
          <span>审核状态：</span>
          <div>
            <el-select v-model="check_status" placeholder="请选择审核状态">
                <el-option
                v-for="item in checkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
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
          <span style="width: 30px;"></span>
          <el-button type="primary" @click="merchantsSearch" size="small">搜索</el-button>
          <el-button type="primary" @click="merchantsReset" plain size="small">重置</el-button>
        </div>
      </div>
      <div class="top-search">
        <div class="item">
          <span style="width: 30px;"></span>
          <el-button type="primary" @click="onBatchMoney" size="small" v-if="typestatus == '10'">批量打款</el-button>
          <el-button type="primary" @click="addCommercial" size="small" v-if="typestatus == '20'">交易上传</el-button>
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
          <el-table-column prop="out_trade_no" label="商户订单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="item_count" label="打款记录(笔)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="amt" label="商户请求打款(元)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actual_amt" label="实发金额(元)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="service_tax" label="服务费(元)" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deduct_amt" label="总扣款金额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="check_status_name" label="审核状态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="trade_status_name" label="打款状态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="100">
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
                        @click="examine(scope.row)"
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
    <!-- 详情 -->
    <div class="main contractType" v-if="!contractType">
      <div class="title">
        <div class="fanhui" @click="returnList">
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <div class="qianyue">查看详情</div>
      </div>
      <div class="box1" style="padding: 20px">
        <div class="title">
            <div class="shu"></div><div class="name">交易详情</div><div class="heng"></div>
        </div>
        <div class="item">
          <div class="search-item">
               <span>商户ID：</span>
               <div>{{merchantsObj.id}}</div>
          </div>
          <div class="search-item">
               <span>商户名称：</span>
               <div>{{merchantsObj.merchant_name}}</div>
          </div>
          <div class="search-item">
               <span>创建时间：</span>
               <div>{{merchantsObj.created_at}}</div>
          </div>
          <div class="search-item">
               <span>打款类型：</span>
               <div>{{merchantsObj.trade_mode_name}}</div>
          </div>
          <div class="search-item">
               <span>打款笔数：</span>
               <div>{{merchantsObj.item_count}}</div>
          </div>
          <div class="search-item">
               <span>商户请求打款（元）：</span>
               <div>{{merchantsObj.amt}}</div>
          </div>
          <div class="search-item">
               <span>实发金额（元）：</span>
               <div>{{merchantsObj.actual_amt}}</div>
          </div>
          <div class="search-item">
               <span>服务费（元）：</span>
               <div>{{merchantsObj.service_tax}}</div>
          </div>
          <div class="search-item">
               <span>总扣款金额（元）：</span>
               <div>{{merchantsObj.deduct_amt}}</div>
          </div>
          <div class="search-item">
               <span>签约主体：</span>
               <div>{{merchantsObj.id}}</div>
          </div>
          <div class="search-item">
               <span>资金流水号：</span>
               <div>{{merchantsObj.id}}</div>
          </div>
          <div class="search-item">
               <span>支付凭证：</span>
               <div>
                 <img @click="detailsImage(merchantsObj.pay_voucher)"
               :src="merchantsObj.pay_voucher" alt=""></div>
          </div>
        </div>
        <div class="title">
            <div class="shu"></div><div class="name">打款详情</div><div class="heng"></div>
        </div>
        <div class="item">
            <div>
                <el-table
                ref="multipleTable"
                :data="itemPageData"
                border
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
                >
                <el-table-column prop="credit_code" label="个体户统一社会信用编码" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="acc_name" label="收款账户" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="acc_no" label="收款账号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amt" label="商户请求打款金额(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="actual_amt" label="实发金额(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="service_tax" label="服务费(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="deduct_amt" label="总扣款金额" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="trade_status_name" label="交易状态" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="trade_desc" label="交易描述" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </div>
            <!-- <pagination
                :total="total"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
            ></pagination> -->
        </div>
      </div>
    </div>
    <!-- 批量打款 -->
    <div class="main contractType2" v-if="!moneyType">
      <div class="title">
        <div class="fanhui" @click="returnList">
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <div class="qianyue">{{moneyTitle}}</div>
      </div>
      <el-steps :active="activeIndex" finish-status="success" simple style="margin-top: 20px">
        <el-step title="上传数据" ></el-step>
        <el-step title="锁定批次" ></el-step>
        <el-step title="付款申请"  v-if="order_type == '10'"></el-step>
      </el-steps>
      <div class="box1" style="padding: 20px;text-align: left;" v-if="activeIndex == 1">
        <div style="width:100%;height:34px"></div>
        <el-form :model="batchForm" :rules="batchRules" ref="batchForm" label-width="130px" class="demo-ruleForm">
          <div class="list">
          <el-form-item label="打款通道：" prop="acc_type">
            <el-select v-model="batchForm.acc_type" placeholder="请选择打款通道">
              <el-option label="银行" value="00"></el-option>
              <el-option label="支付宝" value="01"></el-option>
              <el-option label="微信" value="02"></el-option>
            </el-select>
          </el-form-item>
          </div>
          <div class="list">
          <el-form-item label="模板获取：" prop="delivery">
            <el-button type="primary" @click="acquire">模板获取</el-button>
            <!-- <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              :file-list="fileList">
              <el-button type="primary">模板获取</el-button>
            </el-upload> -->
          </el-form-item>
          </div>
          <div class="list">
          <el-form-item label="上传打款文件：" prop="fileUrl">
            <el-upload
              class="avatar-uploader"
              :action="data.action"
              :data="data.d"
              accept=".xls,.xlsx"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUploadXlsx">
              <img v-if="batchForm.fileUrl" :src="fileUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
            </el-upload>
          </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('batchForm',2)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box1" style="padding: 20px" v-if="activeIndex == 2">
        <el-alert
          title="温馨提示:锁定批次后，该批次内订单将不可修改，如需修改请撤销该批次重新上传"
          type="warning"
          :closable="false"
          show-icon>
        </el-alert>
        <div class="title">
            <div class="name">总计：{{batchObj.itemList.length || 0}}笔</div><div class="button"><el-button @click="submitForm('batchForm',3)" type="primary">锁定批次</el-button><el-button @click="activeIndex = 1">&emsp;撤销&emsp;</el-button></div>
        </div>
        <div class="item">
          <div class="left">
            <div class="top"><div class="dian"></div>预计付款金额</div>
            <div class="search-item">
                <span>实发金额（元）：</span>
                <div>{{batchObj.actual_amt.toFixed(2)}}</div>
            </div>
            <div class="search-item">
                <span>服务费（元）：</span>
                <div>{{batchObj.service_tax.toFixed(2)}}</div>
            </div>
            <div class="search-item">
                <span>总扣款金额（元）：</span>
                <div>{{batchObj.deduct_amt.toFixed(2)}}</div>
            </div>
          </div>
        </div>
        <div class="title">
            <div class="name">批次明细</div>
            <!-- <div class="button"><el-button>下载订单列表</el-button></div> -->
        </div>
        <div class="item">
            <div>
                <el-table
                ref="multipleTable"
                :data="batchObj.itemList"
                border
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
                >
                <el-table-column prop="credit_code" label="个体户统一社会信用编码" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="acc_name" label="收款账户" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="acc_no" label="收款账号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amt" label="商户请求打款金额(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="actual_amt" label="实发金额(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="service_tax" label="服务费(元)" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="deduct_amt" label="总扣款金额" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </div>
            <!-- <pagination
                :total="total"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
            ></pagination> -->
        </div>
        <!-- <div class="bottom"><el-button type="primary" @click="submitForm('batchForm',3)">下一步</el-button></div> -->
      </div>
      <div class="box1" style="padding: 20px" v-if="activeIndex == 3">
        <el-alert
          title="温馨提示:请在提交申请前将该批付款的金额线下支付到提供的账户，并提交对应的支付凭证。"
          type="warning"
          :closable="false"
          show-icon>
        </el-alert>
        <div class="header"><img src="https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_391415889900049412020910644941wenben.png" alt="">共计{{paymentObj.item_count}}笔交易，应付金额{{paymentObj.deduct_amt}}元</div>
        <el-form :model="batchForm" :rules="batchRules" ref="batchForm" label-width="100px" class="demo-ruleForm">
          <div class="list">
          <el-form-item label="账户名称：">
            {{paymentObj.pay_bank_account}}
          </el-form-item>
          </div>
          <div class="list">
          <el-form-item label="开户银行：">
             {{paymentObj.pay_bank_name}}
          </el-form-item>
          </div>
          <div class="list">
          <el-form-item label="银行账户：">
             {{paymentObj.pay_bank_no}}
          </el-form-item>
          </div>
          <div class="list">
          <el-form-item label="支付凭证：" prop="desc">
            <el-upload
              class="avatar-uploader"
              :action="data.action"
              :data="data.d"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('batchForm',4)">提交申请</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
       <!-- 图片查看 -->
    <el-dialog title="图片查看" :visible.sync="dialogImg" width="50%" :before-close="handleClose">
      <div>
        <img :src="imageDetails" width="100%" alt />
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
        imageDetails: "",
      dialogImg: false,
      activeIndex: 1,
      order_type: '',
      moneyTitle: '批量打款',
      // 
      // fileList: [{
      //   name: 'food.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      // }, {
      //   name: 'food2.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      // }],
      imageUrl: '',
      fileUrl: 'https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_wxapplet_1586855560325.jpg',
      // 结束
      batchForm:{},
      batchRules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
      },
      moneyType: true,
      tableDataObj:{},
      contractType: true,
      tradeOptions: [{
        value: '00',
        label: '成功'
      },{
        value: '01',
        label: '待处理'
      },{
        value: '02',
        label: '失败'
      },{
        value: '03',
        label: '部分成功'
      }],
      checkOptions: [{
        value: '00',
        label: '待处理'
      },{
        value: '01',
        label: '一审'
      },{
        value: '02',
        label: '一审失败'
      },{
        value: '03',
        label: '二审'
      },{
        value: '04',
        label: '二审失败'
      },{
        value: '05',
        label: '审核通过'
      }],
      createDate: ['',''],
      mainIdOptions: [],
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [],
      out_trade_no: "",
      trade_status: '',
      check_status: '',
      batchObj:{},
      paymentObj: {},
      merchantsObj: {},
      itemPageData: [],
      // 阿里oss
      data: {
        d: {},
        action: ""
      },
      typestatus:""
    };
  },
  mounted() {
    this.orderPagePost();
    // oss
    this.getUploadConfig()
    //批量打款 交易上传
     this.dakuanPage();
    // 商户
    // post(api.merchantCtlDics).then(
    //   d => {
    //     console.log(d);
    //     if (d.status === 0) {
    //       this.mainIdOptions = d.data
    //     }
    //   },
    //   err => {
    //     //error callback
    //   }
    // );
  },
  methods: {
    //批量打款 交易上传
     dakuanPage() {
      post(api.getFeeTypeWithCache).then(
        d => {
          console.log(d.status);
          //  loading.close();
          if (d.status === 0) {
            console.log(d.data.type, "打款状态");
            this.typestatus = d.data.type;
          }
        },
        err => {
          //error callback
        }
      );
    },
    detailsImage(src) {
      if (src) {
        this.imageDetails = src;
        this.dialogImg = true;
      }
    },
    acquire () {
      if (this.order_type == '10') {
        window.open('https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_4543158623816059020207134240590template.xlsx')
      }else {
        window.open('https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_41431587361166804202020133926804trade_template.xlsx')
      }
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
    // 交易上传
    addCommercial() {
      this.moneyType = false;
      this.activeIndex = 1;
      this.order_type = '20';
      this.moneyTitle = '交易上传'
    },
    // 批量打款
    onBatchMoney() {
      this.moneyType = false;
      this.activeIndex = 1;
      this.order_type = '10';
      this.moneyTitle = '批量打款'
    },
    // 查看
    examine(row) {
      post(api.orderInfo, {
        id: row.id
      }).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.contractType = false;
            this.merchantsObj = d.data
            this.itemPagePost(row.id)
          }
        },
        err => {
          //error callback
        }
      );
    },
    itemPagePost(id) {
      post(api.itemPage, {
        order_id: id
      }).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            this.itemPageData = d.data.rows
          }
        },
        err => {
          //error callback
        }
      );
    },
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
      this.moneyType = true
      
      
    },
    submitForm(formName,i) {
      if ( i == 3 ) {
        post(api.lockOrder, {
          order_type: this.order_type,
          acc_type: this.batchForm.acc_type,
          fileUrl: this.batchForm.fileUrl,
          itemList: this.batchObj.itemList
        }).then(
          d => {
            console.log(d,'锁定批次')
            if (d.status === 0) {
              // if (d.data.error) {
              //   return this.$message({
              //     message: '警告哦，上传信息错误',
              //     type: 'warning'
              //   });
              // }
              if (this.order_type == '10') {
                this.activeIndex = i;
                this.paymentObj = d.data;
              }else {
                this.moneyType = true;
                this.orderPagePost();
                this.batchForm.fileUrl = '';
                this.batchForm.acc_type = '';
                this.$message({
                  message: '交易上传成功',
                  type: 'success'
                });
              }
              
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
      }else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if ( i == 2 ) {
              post(api.parseItems, {
                order_type: this.order_type                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ,
                fileUrl: this.batchForm.fileUrl
              }).then(
                d => {
                  console.log(d,'上传数据')
                  if (d.status == 0) {
                    this.$message({
                        message: d.msg,
                       type: 'success'
                      });
                    // if (!d.data.error) {
                    //   return this.$message({
                    //     message: d.msg,
                    //     type: 'warning'
                    //   });
                    // }
                    console.log(i,'333333')
                    this.activeIndex = i;
                    this.batchObj = d.data;
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
            }else if ( i == 4 ) {
              post(api.offlinePay, {
                id: this.paymentObj.id,
                pay_voucher: this.imageUrl
              }).then(
                d => {
                  console.log(d,'申请付款')
                  if (d.status === 0) {
                    console.log('申请完毕 返回列表')
                    this.batchForm.fileUrl = '';
                    this.batchForm.acc_type = '';
                    this.moneyType = true;
                    this.orderPagePost()
                    this.$message({
                      message: '批量打款成功',
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
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
      
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogInvoice = false
    },
    // 增加账号
    addAccount() {
      this.accountForm = {
        id: '',
        out_trade_no: '',
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
      post(api.userInfo, {
        id: row.id
      }).then(
        d => {
          if (d.status === 0) {
            console.log(d, "??????????????");
            this.accountForm = d.data.data;
            this.dialogInvoice = true
            this.dialogTitle = '编辑账号'
          }
        },
        err => {
          //error callback
        }
      );
    },
    orderPagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.orderPage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        "out_trade_no": this.out_trade_no,             // 商户订单号
        "trade_status": this.trade_status,             // 交易状态 00成功 01待处理 02失败 03部分成功
        "check_status": this.check_status,             // 审核状态 00待处理 01一审  02一审失败 03二审 04二审失败 05审核通过
        "createBegin": this.createDate[0],              // 创建时间-开始  可以只选开始，也可以只选结束，格式：2020-04-03
        "createEnd": this.createDate[1]                 // 创建时间-结束
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
      this.out_trade_no = "";
      this.trade_status = "";
      this.check_status = "";
      this.createDate = ['','']
      this.orderPagePost();
    },
    merchantsSearch() {
      if (!this.createDate.length) {
        this.createDate = ['','']
      }
      this.orderPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.orderPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.orderPagePost(val);
    },
    handleClose(done) {
      done();
    },
    handleAvatarSuccess(res, file) {
      var result = res.substring(
        res.indexOf("https://gsb-zc.oss-cn-beijing.aliyuncs.com"),
        res.indexOf("</Location>")
      );
      this.batchForm.fileUrl = result;
      this.$forceUpdate()
    },
    handleAvatarSuccess1(res, file) {
      var result = res.substring(
        res.indexOf("https://gsb-zc.oss-cn-beijing.aliyuncs.com"),
        res.indexOf("</Location>")
      );
      this.imageUrl = result;
      this.$forceUpdate()
    },
    beforeAvatarUploadXlsx (file) {
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      this.data.d["key"] = "zc_wxapplet_" + new Date().getTime() + "." + testmsg;
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if(!extension && !extension2) {
        this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
        });
      }
    },
    beforeAvatarUpload(file) {
      this.data.d["key"] = "zc_wxapplet_" + new Date().getTime() + ".jpg";
      console.log(file.type)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      return isJPG;
    },
    // handleChange(file, fileList) {
    //   this.fileList = fileList.slice(-3);
    // }
  },
  components: {
    pagination: pagination
  }
};
</script>

<style lang="less" scoped>
.batchMoney {
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
        height: 60px;
        // display:flex;
        // display: -webkit-flex;
        // align-items:center;
        overflow: hidden;
        line-height: 60px;
        // .shu {
        //   width: 3px;
        //   height: 20px;
        //   float: left;
        //   background-color: #186bff;
        // }
        .name {
          // display: inline-block;
          float: left;
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
        .buttom {
          float: right;
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
  .contractType2 {
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
      border-radius: 6px;
      padding: 30px 40px;
      box-sizing: border-box;
      .list {
        text-align: left;
        padding-left: 50px;
        box-sizing: border-box;
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
        .left {
          width: 568px;
          height: 196px;
          line-height: 20px;
          text-align: center;
          border: 1px solid rgba(187, 187, 187, 1);
          padding: 26px;
          box-sizing: border-box;
          .top {
            width: 100%;
            text-align: left;
            color: rgba(16, 16, 16, 1);
            font-size: 20px;
            display:flex;
            display: -webkit-flex;
            align-items:center;
            margin-bottom: 30px;
            .dian {
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #67C23A;
              border-radius: 50%;
              margin-right: 15px;
            }
          }
          .search-item {
            display: inline-block;
            width: 30%;
            line-height: 40px;
            text-align: left;
          }
        }
      }
      .title {
        width: 100%;
        height: 60px;
        line-height: 60px;
        // display:flex;
        // display: -webkit-flex;
        margin-top: 15px;
        align-items:center;
        overflow: hidden;
        .shu {
          width: 3px;
          height: 20px;
          display: inline-block;
          background-color: #186bff;
        }
        .name {
          // display: inline-block;
          float: left;
          // width: 80px;
          color: rgba(16, 16, 16, 1);
          font-size: 18px;
          margin-left: 11px;
          font-weight: 600;
          white-space: nowrap;  
        }
        .button {
          float: right;
        }
        .heng {
          margin-left: 11px;
          display: inline-block;
          width: 100%;
          height: 1px;
          background-color: #bbb;
        }
      }
      .bottom {
        width: 100%;
        margin-top: 20px;
        // text-align: right;
      }
      .header {
        width: 100%;
        height: 73px;
        line-height: 73px;
        color: rgba(16, 16, 16, 1);
        font-size: 24px;
        text-align: left;
        font-family: SourceHanSansSC-bold;
        margin: 50px 0px;
        padding-left: 50px;
        box-sizing: border-box;
        img {
          float: left;
          width: 70px;
          height: 73px;
          // background-color: #E6A23C;
          // border-radius: 40%;
          margin-right: 15px;
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
}
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
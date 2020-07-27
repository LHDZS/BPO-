

<template>
  <div class="orderRegistered">
    <div
      class="main"
      v-if="detailsType"
    >
      <div class="top-search">
        <!-- <div class="item">
          <span>个体户名称：</span>
          <div>
            <el-input v-model="saas_merchant_id" placeholder="请输入个体户名称"></el-input>
          </div>
        </div> -->
        <div class="item">
          <span>订单状态：</span>
          <div>
            <el-select
              v-model="saas_merchant_id"
              placeholder="请选择打款状态"
            >
              <el-option
                v-for="item in tradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
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
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="item">
          <span>身份证号码：</span>
          <div>
            <el-input
              v-model="legal_idno"
              placeholder="请输入身份证号码"
            ></el-input>
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
        <div class="top-search">
          <div class="item">
            <span style="width: 30px;"></span>
            <!-- <el-button type="primary" @click="audit" size="small">支付</el-button> -->
            <el-button
              type="primary"
              @click="delivery"
              size="small"
            >&emsp;支付&emsp;</el-button>
          </div>
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
          <el-table-column
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="订单编号"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="bminfo.legal_name"
            label="经营者"
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
    <!-- 详情 -->
    <div class="mains details"  v-if="!detailsType" id="baowei">
      <div class="title">
        <div
          class="fanhui"
          @click="detailsType = true"
        >
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <div class="qianyue">查看详情</div>
      </div>
      <div class="content">
        <div
          class="xinxi"
          v-if="orderListObj.baseInfo.show == true"
        >
          <div class="names">
            <el-divider direction="vertical"></el-divider>基本信息
          </div>
          <div class="box4">
            <div style="display: inline-block;">
              <span>
                <span class="laber">订单编号：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.baseInfo.id"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">创建时间：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.baseInfo.created_at"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">订单金额：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.baseInfo.price"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div
          class="xinxi"
          v-if="orderListObj.regInfo.show == true"
        >
          <div class="names">
            <el-divider direction="vertical"></el-divider>注册申请信息
          </div>
          <div class="box4">
            <div style="display: inline-block;">
              <span>
                <span class="laber">经营者名称：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.regInfo.legal_name"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">经营者身份证：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.regInfo.legal_idno"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">经营者电话：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.regInfo.legal_mobile"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
            </div>
            <div>
              <span>
                <span class="laber">个体户名称：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.regInfo.company_names"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <div class="box_imgs">
                <div class="box-item">
                  <div>身份证正面：</div>
                  <div class="box_img">
                    <img
                      @click="detailsImage(orderListObj.regInfo.idcard_front)"
                      :src="orderListObj.regInfo.idcard_front"
                      alt
                    />
                  </div>
                </div>
                <div class="box-item">
                  <div>身份证反面：</div>
                  <div class="box_img">
                    <img
                      @click="detailsImage(orderListObj.regInfo.idcard_back)"
                      :src="orderListObj.regInfo.idcard_back"
                      alt
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div
          class="xinxi"
          v-if="orderListObj.merchantDeliverInfo.show == true"
        >
          <div class="names">
            <el-divider direction="vertical"></el-divider>交付信息
          </div>
          <div class="box4">
            <div style="display: inline-block;">
              <span>
                <span class="laber">联系人：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.merchantDeliverInfo.merchant_deliver_man"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">联系电话：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.merchantDeliverInfo.merchant_deliver_mobile"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">邮寄地址：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.merchantDeliverInfo.merchant_deliver_addr"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>

            </div>
          </div>
        </div>

        <div
          class="xinxi"
          v-if="orderListObj.payInfo.show == true"
        >
          <div class="names">
            <el-divider direction="vertical"></el-divider>支付信息
          </div>
          <div class="box4">
            <div style="display: inline-block;">
              <span>
                <span class="laber">付款金额：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.payInfo.amount"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">支付时间：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.payInfo.created_at"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
              <span>
                <span class="laber">资金流水号：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.payInfo.trade_no"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
            </div>
            <div>
              <div class="box_imgs">
                <div class="box-item">
                  <div>付款凭证：</div>
                  <div class="box_img">
                    <img
                      @click="detailsImage(orderListObj.payInfo.pay_voucher_img)"
                      :src="orderListObj.payInfo.pay_voucher_img"
                      alt
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div
          class="xinxi"
          v-if="orderListObj.deliverInfo.show == true"
        >
          <div class="names">
            <el-divider direction="vertical"></el-divider>订单支付信息
          </div>
         <div class="box4">
            <div style="display: inline-block;">
              <span>
                <span class="laber">快递单号：</span>
                <div style="width: 200px;display: inline-block;">
                  <el-input
                    v-model="orderListObj.deliverInfo.deliver_express_no"
                    size="mini"
                    :disabled="inputType"
                    placeholder="单行输入"
                  ></el-input>
                </div>
              </span>
            </div>
            <div>
                  <div class="box_imgs">
                <div class="box-item">
                  <div>交接单：</div>
                  <div class="box_img">
                    <img
                      @click="detailsImage(orderListObj.deliverInfo.deliver_express_img)"
                      :src="orderListObj.deliverInfo.deliver_express_img"
                      alt
                    />
                  </div>
                </div>
              </div>
            </div>
         
          </div>
        </div>

        <!-- <div>
              <el-button type="primary" @click="modification">修改</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>-->
      </div>

    </div>
    <!-- 支付弹出层 -->
    <el-dialog
      :visible.sync="dialogDelivery"
      width="891px"
      title="个体户注册订单付款"
      :center="true"
      :before-close="handleClose"
    >
      <div class="CheckAccept">
        <div class="title"><i class="el-icon-warning"></i><span>共计{{payObj.totalNum}}笔订单，应付金额{{payObj.totalPrice}}元</span><br>
          <div>请核对订单信息，如若无误，请支付到以下账户，并上传支付凭证</div>
        </div>
        <el-form
          ref="deliveryForm"
          :model="deliveryForm"
          :rules="deliveryRules"
          label-width="140px"
        >
          <div
            class="main"
            style="width:460px;margin: 40px 0px 40px 100px"
          >
            <div class="item">
              <el-form-item label="账号名称：">
                {{payObj.account_name}}
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="开户银行：">
                {{payObj.account_bank_name}}
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="银行账户：">
                {{payObj.account_bank_no}}
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="支付凭证："
                prop="pay_voucher_img"
              >
                <el-upload
                  class="avatar-uploader"
                  :action="data.action"
                  :data="data.d"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="deliveryForm.pay_voucher_img"
                    :src="deliveryForm.pay_voucher_img"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >只能上传jpg/png文件</div>
                </el-upload>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="交付联系人："
                prop="merchant_deliver_man"
              >
                <el-input
                  v-model="deliveryForm.merchant_deliver_man"
                  placeholder="请输入交付联系人"
                ></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="联系人电话："
                prop="merchant_deliver_mobile"
              >
                <el-input
                  v-model="deliveryForm.merchant_deliver_mobile"
                  placeholder="请输入联系人电话"
                ></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="邮寄地址："
                prop="merchant_deliver_addr"
              >
                <el-input
                  v-model="deliveryForm.merchant_deliver_addr"
                  placeholder="请输入邮寄地址"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="button">
            <el-button
              type="primary"
              @click="submitDelivery('deliveryForm')"
            >确定</el-button>
            <el-button @click="resetDelivery('deliveryForm')">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 图片查看 -->
    <el-dialog
      title="图片查看"
      :visible.sync="dialogImg"
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <img
          :src="imageDetails"
          width="100%"
          alt
        />
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
      tradeOptions: [
        {
          value: "1010",
          label: " 待付款"
        },
        {
          value: "2010",
          label: "待审核"
        },
        {
          value: "2030",
          label: "审核驳回"
        },
        {
          value: "3010",
          label: "业务办理中"
        },
        {
          value: "3020",
          label: "待交付"
        },
        {
          value: "3030",
          label: "已交付"
        }
      ],
      inputType: true,
      imageDetails: "",
      dialogImg: false,
      detailsType: true,
      orderListObj: {
        baseInfo: {},
        regInfo: {},
        merchantDeliverInfo: {},
        deliverInfo: {}
      },
      //总条数
      total: null,
      pageSize: 10,
      tableData1: [{}],
      dialogInvoice: false,
      saas_merchant_id: "",
      legal_idno: "",
      createDate: ["", ""],
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      // 交付
      dialogDelivery: false,
      deliveryForm: {
        name: "",
        merchant_deliver_man: "",
        merchant_deliver_addr: "",
        merchant_deliver_mobile: "",
        pay_voucher_img: ""
      },
      deliveryRules: {
        pay_voucher_img: [
          { required: true, message: "请上传付款凭证图", trigger: "blur" }
        ],
        merchant_deliver_man: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        merchant_deliver_mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        merchant_deliver_addr: [
          { required: true, message: "请输入邮寄地址", trigger: "blur" }
        ]
      },
      // 列表选中
      checkList: [],
      //
      payObj: {},
      // 阿里oss
      data: {
        d: {},
        action: ""
      }
    };
  },
  mounted() {
    this.orderCtlPagePost();
    // oss
    this.getUploadConfig();
    //审核信息
    this.deliverInfoes();
  },
  methods: {
    deliverInfoes() {
      post(api.delvierInfoes).then(
        d => {
          if (d.status === 0) {
            console.log(d, "交付联系人信息");
            this.deliveryForm["merchant_deliver_man"] = d.data.contact_man;
            this.deliveryForm["merchant_deliver_addr"] = d.data.contact_addr;
            this.deliveryForm["merchant_deliver_mobile"] =
              d.data.contact_mobile;
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
    // 勾选
    handleSelectionChange(arr) {
      console.log(arr);
      this.checkList = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].status == 1010) {
          console.log("可以支付");
          this.checkList.push(arr[i].id);
        }
      }
    },
    detailsImage(src) {
      if (src) {
        this.imageDetails = src;
        this.dialogImg = true;
      }
    },
    // 交付确认
    submitDelivery(formName) {
      this.deliveryForm.ids = this.checkList;
      this.$refs[formName].validate(valid => {
        if (valid) {
          post(api.orderCtlOfflinePay, this.deliveryForm).then(
            d => {
              if (d.status === 0) {
                console.log(d, "??????????????");
                this.dialogDelivery = false;
                this.$refs[formName].resetFields();
                this.orderCtlPagePost();
              }
            },
            err => {
              //error callback
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 交付取消
    resetDelivery(formName) {
      this.$refs[formName].resetFields();
      this.dialogDelivery = false;
    },
    // 交付
    delivery() {
      if (!this.checkList.length) {
        this.$refs.multipleTable.clearSelection();
        return this.$message({
          message: "没有可以支付的订单",
          type: "warning"
        });
      }
      post(api.checkPay, {
        ids: this.checkList
      }).then(
        d => {
          console.log(d);
          if (d.status === 0) {
            console.log(d, "支付验证??????????????");
            this.payObj = d.data;
            this.dialogDelivery = true;
          } else {
            this.$message({
              message: d.msg,
              type: "warning"
            });
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 查看详情
    viewDetails(row) {
      post(api.platformInfo, {
        id: row.id
      }).then(
        d => {
          if (d.status === 0) {
            console.log(d, "??????????????");
            this.orderListObj = d.data;
            this.detailsType = false;
          }
        },
        err => {
          //error callback
        }
      );
    },
    orderCtlPagePost(size) {
      //  const loading = this.$loading({
      //   lock: true,
      //   spinner: 'loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      post(api.orderCtlPage, {
        currentPage: size || 1,
        pageSize: this.pageSize,
        order_type: this.saas_merchant_id,
        createBegin: this.createDate[0],
        createEnd: this.createDate[1],
        legal_idno: this.legal_idno
      }).then(
        d => {
          console.log(d.status);
          //  loading.close();
          if (d.status === 0) {
            console.log(d, "??????????????");
            this.total = d.data.count;
            this.tableData1 = d.data.rows;
            if (this.tableData1 && this.tableData1.length) {
              for (let row of this.tableData1) {
                row.bminfo.company_names = (row.bminfo.company_names || "")
                  .split("#com#")
                  .join("、");
              }
            }
          }
        },
        err => {
          //error callback
        }
      );
    },
    // 重置
    merchantsReset() {
      this.createDate = ["", ""];
      this.legal_idno = "";
      this.saas_merchant_id = "";
      this.orderCtlPagePost();
    },
    merchantsSearch() {
      this.orderCtlPagePost();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条aaaaa`);
      this.pageSize = val;
      this.orderCtlPagePost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}aaaaaaaaaaaaaaaa`);
      this.orderCtlPagePost(val);
    },
    handleClose(done) {
      done();
    },
    handleAvatarSuccess(res, file) {
      var result = res.substring(
        res.indexOf("https://gsb-zc.oss-cn-beijing.aliyuncs.com"),
        res.indexOf("</Location>")
      );
      this.deliveryForm.pay_voucher_img = result;
      this.$forceUpdate();
    },
    beforeAvatarUpload(file) {
      this.data.d["key"] = "zc_wxapplet_" + new Date().getTime() + ".jpg";
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      return isJPG;
    }
  },
  components: {
    pagination: pagination
  }
};
</script>

<style lang="less" scoped>
.orderRegistered {
  width: 100%;
  min-height: 100%;
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
  .mains {
    width: 100%;
    min-height: 100%;
    // padding: 17px 24px;
    // background-color: #f5f5f5;
    box-sizing: border-box;
    .xinxi {
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
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
      .names {
        width: 100%;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 600;
        color: #1890ff;
        text-align: left;
        padding-left: 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #e9e9e9;
        line-height: 35px;
      }
      // 初版样式
      .box {
        margin-top: 10px;
        width: 100%;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        span {
          min-width: 30.33%;
          margin-bottom: 15px;
          display: inline-block;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: #333333;
          line-height: 36px;
          // text-align: right;
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
              background-color: #e4e7ed;
              margin-top: 8px;
              // margin-right: 50px;
              cursor: pointer;
              img {
                display: block;
                height: 100%;
                margin: 0 auto;
              }
            }
            .baoguo {
              background: url("https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_19711157587995142920199162551429wenjian.png")
                no-repeat;
              background-size: 100% 100%;
              width: 61px;
              height: 68px;
            }
            .box_imgd {
              width: 200px;
              height: 120px;
              display: inline-block;
              margin-top: 8px;
              margin-right: 50px;
              img {
                // cursor: pointer;
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
      .box4 {
        margin-top: 10px;
        width: 100%;
        padding: 30px 5px;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        overflow: hidden;
        span {
          float: left;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: #333333;
          margin-bottom: 15px;
          line-height: 36px;
          // margin-left: 20px;
          .laber {
            display: inline-block;
            width: 130px;
            text-align: right;
          }
        }
        .box_imgs {
          width: 100%;
          overflow: hidden;
          padding: 8px 0px;
          box-sizing: border-box;
          margin-bottom: 7px;
          .box-item {
            min-width: 200px;
            // margin-right: 10px;
            font-size: 14px;
            font-family: PingFangSC;
            font-weight: 400;
            margin-top: 10px;
            color: #333333;
            div {
              width: 130px;
              text-align: right;
              // margin-right: 10px;
            }
            .box_img {
              width: 200px;
              height: 120px;
              display: inline-block;
              background-color: #e4e7ed;
              // margin-right: 50px;
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
            .baoguo {
              background: url("https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_19711157587995142920199162551429wenjian.png")
                no-repeat;
              background-size: 100% 100%;
              width: 61px;
              height: 68px;
            }
            // .sel_btn {
            // color: #fff;
            // background-color: #1890ff;
            // border-color: #1890ff;
            // padding: 10px 20px;
            // border-radius: 4px;
            // display: inline-block;
            // text-decoration: none;
            // font-size: 14px;
            // outline: none;
            // font-weight: 500;
            // }
          }
          div {
            float: left;
          }
        }
      }
      // 第二版样式
      // .box2 {
      //   margin-top: 10px;
      //   width: 100%;
      //   padding: 30px 85px;
      //   box-sizing: border-box;
      //   border-radius: 6px;
      //   text-align: right;
      //   overflow: hidden;
      //   span {
      //     min-width: 30.33%;
      //     float: left;
      //     font-size: 14px;
      //     font-family: PingFangSC;
      //     font-weight: 400;
      //     color: rgba(51, 51, 51, 1);
      //     margin-bottom: 15px;
      //     line-height: 36px;
      //     .laber {
      //       display: inline-block;
      //       width: 130px;
      //     }
      //   }
      //   .box_imgs {
      //     width: 100%;
      //     overflow: hidden;
      //     padding: 8px 0px;
      //     box-sizing: border-box;
      //     margin-bottom: 7px;
      //     .box-item {
      //       min-width: 200px;
      //       // margin-right: 10px;
      //       font-size: 14px;
      //       font-family: PingFangSC;
      //       font-weight: 400;
      //       margin-top: 10px;
      //       color: #333333;
      //       div {
      //         // width: 130px;
      //         margin-right: 10px;
      //       }
      //       .box_img {
      //         width: 160px;
      //         height: 120px;
      //         display: inline-block;
      //         background-color: #e4e7ed;
      //         margin-right: 50px;
      //         .el-upload {
      //           width: 100% !important;
      //           height: 100% !important;
      //           img {
      //             display: inline-block;
      //             width: 200px;
      //             height: 120px;
      //           }
      //         }
      //         img {
      //           cursor: pointer;
      //           display: inline-block;
      //           width: 100%;
      //           height: 100%;
      //         }
      //       }
      //       .baoguo {
      //         background: url("https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_19711157587995142920199162551429wenjian.png")
      //           no-repeat;
      //         background-size: 100% 100%;
      //         width: 61px;
      //         height: 68px;
      //       }
      //       // .sel_btn {
      //       // color: #fff;
      //       // background-color: #1890ff;
      //       // border-color: #1890ff;
      //       // padding: 10px 20px;
      //       // border-radius: 4px;
      //       // display: inline-block;
      //       // text-decoration: none;
      //       // font-size: 14px;
      //       // outline: none;
      //       // font-weight: 500;
      //       // }
      //     }
      //     div {
      //       float: left;
      //     }
      //   }
      // }
      // 第一版样式
      // .box1 {
      //   margin-top: 10px;
      //   width: 100%;
      //   padding: 30px 10px;
      //   box-sizing: border-box;
      //   border-radius: 6px;
      //   text-align: left;
      //   overflow: hidden;
      //   .must {
      //     float: left;
      //     font-size: 14px;
      //     font-family: PingFangSC;
      //     font-weight: 400;
      //     color: rgba(51, 51, 51, 1);
      //     margin-left: 15px;
      //     margin-bottom: 15px;
      //     line-height: 36px;
      //     min-width: 300px;
      //     text-align: left;
      //     div {
      //       float: right;
      //     }
      //   }
      //   .must:before {
      //     content: "* ";
      //     color: red;
      //   }
      //   .list {
      //     float: left;
      //     margin-left: 22px;
      //     margin-bottom: 15px;
      //     .el-upload {
      //       display: block;
      //       text-align: left;
      //     }
      //     div {
      //       float: left;
      //       min-width: 55px;
      //     }
      //   }
      //   .item {
      //     float: left;
      //     height: 93px;
      //     margin-right: 100px;
      //     margin-bottom: 20px;
      //     div {
      //       float: left;
      //       min-width: 55px;
      //       height: 93px;
      //     }
      //     .picture {
      //       width: 167px;
      //       height: 93px;
      //       background: rgba(246, 246, 246, 1);
      //       border-radius: 8px;
      //       border: 1px solid rgba(198, 198, 198, 1);
      //       img {
      //         width: 100%;
      //         height: 100%;
      //       }
      //     }
      //   }
      // }
    }
  }
  .CheckAccept {
    width: 96%;
    margin: 0 auto;
    text-align: left;
    .title {
      width: 75%;
      margin: 0 auto;
      margin-bottom: 8px;
      color: rgba(0, 12, 23, 1);
      font-size: 16px;
      text-align: left;
      span {
        font-weight: 600;
        font-size: 18px;
      }
      div {
        margin-top: 18px;
      }
      i {
        color: #e6a23c;
        font-size: 24px;
        margin-right: 8px;
      }
    }
    .main {
      width: 535px;
      margin-left: 25px;
      .itrm {
        display: inline-block;
        width: 240px;
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
.orderRegistered .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.orderRegistered .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.orderRegistered .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 104px;
  text-align: center;
}
.orderRegistered .avatar {
  width: 104px;
  height: 104px;
  display: block;
}
/* .orderRegistered .CheckAccept .el-form-item {
    margin-bottom: 0px;
  } */
</style>

<template>
  <div class="userInformation">
    <div class="main" v-if="signingType && detailsType">
      <div class="top-search">
        <div class="item">
          <span>个体户名称：</span>
          <div>
            <el-input v-model="userName" placeholder="请输入个体户名称"></el-input>
          </div>
        </div>
        <div class="item">
          <span>信用代码：</span>
          <div>
            <el-input v-model="credit_code" placeholder="请输入信用代码"></el-input>
          </div>
        </div>
        <div class="item">
          <span>身份证号：</span>
          <div>
            <el-input v-model="legal_idcard" placeholder="请输入身份证号"></el-input>
          </div>
        </div>
        <div class="item">
          <span style="width: 50px;"></span>
          <el-button type="primary" @click="merchantsSearch" size="small">搜索</el-button>
          <el-button type="danger" @click="merchantsReset" size="small">重置</el-button>
        </div>
      </div>
      <!-- <div class="middle-button"><el-button type="primary" plain>下载列表</el-button></div> -->
      <div class="bottom-table">
        <el-table
          :data="userTableData"
          border
          :header-cell-style="{background:'rgb(250, 250, 250)'}"
          style="width: 100%"
        >
          <el-table-column prop="name" label="个体户名称" :show-overflow-tooltip="true"></el-table-column>
          <!-- <el-table-column prop="id" label="订单号" :show-overflow-tooltip="true"></el-table-column> -->
          <el-table-column prop="credit_code" label="统一社会信用代码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="legal_name" label="经营者" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="reg_date" label="注册日期" :show-overflow-tooltip="true">
              <!-- <template slot-scope="scope">
               {{moment(scope.row.reg_date).format('YYYY-MM-DD')}}
            </template> -->
          </el-table-column>
          <el-table-column prop="is_bank_name" label="银行开户状态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="address" label="操作" width="100">
            <template slot-scope="scope">
              <div style="cursor: pointer;">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button
                        @click="userDetails(scope.row)"
                        type="primary"
                        size="mini"
                        plain
                      >查看详情</el-button>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item v-if="scope.row.showSign  && !scope.row.is_create_account">
                      <el-button
                        @click="checkEvent(scope.row)"
                        type="primary"
                        size="mini"
                        plain
                      >&emsp;建账&emsp;</el-button>
                    </el-dropdown-item> -->
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
    <div class="mains details" v-if="!detailsType" id="baowei">
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
            <div class="xinxi">
              <div class="names">
                <el-divider direction="vertical"></el-divider>工商信息
              </div>
              <div class="box4">
               <div style="display: inline-block;">
                <span>
                  <span class="laber">企业名称：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input v-model="userListObj.name"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                
                <span>
                  <span class="laber">注册日期：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.reg_date"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                  <span>
                    <span class="laber">信用代码：</span>
                    <div style="width: 200px;display: inline-block;">
                      <el-input
                        v-model="userListObj.credit_code"
                        size="mini"
                        :disabled="inputType"
                        placeholder="单行输入"
                      ></el-input>
                    </div>
                  </span>
                  </div>
                <div>
                  <span>
                  <span class="laber">经营者：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.legal_name"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                <span>
                  <span class="laber">身份证号：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.legal_idcard"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                 <span>
                    <span class="laber">经营场所：</span>
                    <div style="width: 200px;display: inline-block;">
                      <el-input
                        v-model="userListObj.business_place"
                        size="mini"
                        :disabled="inputType"
                        placeholder="单行输入"
                      ></el-input>
                    </div>
                  </span>
                </div>
                <div>
                  <span>
                     <span class="laber">经营范围：</span>
                    <!-- <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="auditObj.business_scope"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                    </div>-->
                    <div style="width: 700px;display: inline-block;">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="单行输入"
                        :disabled="inputType"
                        v-model="userListObj.business_scope"
                      ></el-input>
                    </div>
                  </span>
                     <div class="box_imgs">
                  <div class="box-item">
                    <div>执照照片：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.business_img)"
                        :src="userListObj.business_img"
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
              style="margin-top: 10px;"
            >
              <div class="names">
                <el-divider direction="vertical"></el-divider>刻章信息
              </div>
              <div class="box4">
                <div class="box_imgs">
                  <div class="box-item">
                    <div>公章：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.gongzhang)"
                        :src="userListObj.gongzhang"
                        alt
                      />
                    </div>
                  </div>
                  <div class="box-item">
                    <div>发票章：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.fapiaozhang)"
                        :src="userListObj.fapiaozhang"
                        alt
                      />
                    </div>
                  </div>
                  <div class="box-item">
                    <div>法人章：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.farenzhang)"
                        :src="userListObj.farenzhang"
                        alt
                      />
                    </div>
                  </div>
                
                </div>
                 <div class="box_imgs">
                  <div class="box-item">
                    <div>财务章：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.caiwuzhang)"
                        :src="userListObj.caiwuzhang"
                        alt
                      />
                    </div>
                  </div>
                  <div class="box-item">
                    <div>合同章：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.hetongzhang)"
                        :src="userListObj.hetongzhang"
                        alt
                      />
                    </div>
                  </div>
                 </div>
              </div>
            </div>
            <div
              class="xinxi"
              style="margin-top: 10px;"
            >
              <div class="names">
                <el-divider direction="vertical"></el-divider>银行账户信息
              </div>
              <div class="box4">
                   <div style="display: inline-block;">
                <span>
                  <span class="laber">银行开户：</span>
                <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.is_bank_name"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                  <span>
                   <span class="laber">开户行：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.bank"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                <span>
                  <span class="laber">账号：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.bank_no"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                </div>
               <div>
                   <span>
                  <span class="laber">账户名称：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.bank_name"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                <div class="box_imgs">
                  <div class="box-item">
                    <div>账户照片：</div>
                    <div class="box_img">
                      <img
                        v-if="inputType"
                        @click="detailsImage(userListObj.bank_img)"
                        :src="userListObj.bank_img"
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
              style="margin-top: 10px;"
            >
              <div class="names">
                <el-divider direction="vertical"></el-divider>税务报道信息
              </div>
              <div class="box4">
                 <div style="display: inline-block;">
                <span>
                  <span class="laber">税务登记日：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="tax_regday"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                <span>
                  <span class="laber">税务机构名称：</span>
                  <div style="width: 200px;display: inline-block;">
                    <el-input
                      v-model="userListObj.tax_org"
                      size="mini"
                      :disabled="inputType"
                      placeholder="单行输入"
                    ></el-input>
                  </div>
                </span>
                  </div>
              </div>
            </div>
            <!-- <div>
              <el-button type="primary" @click="modification">修改</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>-->
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
      pageSzie: 10,
      userListObj: {},
      userName: "",
      credit_code: "",
      legal_idcard: "",
      signingType: true,
      detailsType: true,
      inputType: true,
      tax_regday:'',
      userTableData: [
        {
          order_id: 1
        }
      ],
      total: null,
    };
  },
  created() {

  },
  mounted() {
    this.businessmenListPost();
    // this.invoiceContentPost();
  },
  methods: {
    detailsImage(src) {
      if (src) {
        this.imageDetails = src;
        this.dialogImg = true;
      }
    },
    // 发票内容列表
    invoiceContentPost() {
      post(api.invoiceContentList, {
        currentPage: 1, //非必传
        pageSize: 1000 //非必传
      }).then(
        d => {
          console.log(d, "发票内容列表");
          this.detailsOptions = d.data;
          // this.detailsOptions = [];
          // for (let i = 0; i < d.rows.length; i++) {
          //   var obj = {
          //     id: d.rows[i].id,
          //     name: d.rows[i].name
          //   };
          //   this.detailsOptions.push(obj);
          // }
        },
        err => {
          // console.log(err.msg);
          //error callback
        }
      );
    },
    // 查看详情
    userDetails(row) {
      console.log(row);
       this.detailsType = false;
      this.userListObj = row;
      if(row.tax_reg_day){
       this.tax_regday = this.$moment(row.tax_reg_day).format('YYYY-MM-DD')
      }
      
      // post(api.sohoInfo, {
      //   id: row.id
      // }).then(
      //   d => {
      //     console.log(d.data, "测试2222222");
      //     if (d.status === 0) {
      //       console.log(d, "!!!!!!!!!!!!");
      //       this.detailsType = false;
      //       this.userListObj = d.data;
      //       // console.log(this.userListObj.credit_code, "测试详情数据对对对");
      //       // if (this.userListObj.is_bank == false) {
      //       //   this.userListObj.is_bank = "未开户";
      //       // } else {
      //       //   this.userListObj.is_bank = "开户";
      //       // }
      //     } else {
      //       this.detailsType = false;
      //       this.userListObj = row;
      //     }
      //   },
      //   err => {
      //     this.detailsType = false;
      //     this.userListObj = row;
      //     //error callback
      //   }
      // );
    },
    handleClose(done) {
      done();
    },
    handleSizeChange(val) {
      this.pageSzie = val;
      console.log(`每页 ${val} 条aaaaa`);
      this.businessmenListPost();
    },
    handleCurrentChange(size) {
      console.log(size);
      this.businessmenListPost(size);
    },
    // 重置
    merchantsReset() {
      this.userName = "";
      this.credit_code = "";
      this.legal_idcard = "";
      this.businessmenListPost();
    },
    // 搜索
    merchantsSearch() {
      this.businessmenListPost();
    },
    businessmenListPost(size) {
      const loading = this.$loading({
        lock: true,
        spinner: "loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      post(api.businessmenPage, {
        currentPage: size || 1,
        pageSize: this.pageSzie,
        name: this.userName,
        credit_code: this.credit_code,
        legal_idcard: this.legal_idcard
      }).then(
        d => {
          console.log(d.status);
          loading.close();
          if (d.status === 0) {
            console.log(d, "!!!!!!!!!!!!");
            this.total = d.data.count;
            this.userTableData = d.data.rows;
           for (let i = 0; i < d.data.rows.length; i++) {
             d.data.rows[i].reg_date = this.$moment(d.data.rows[i].reg_date).format('YYYY-MM-DD')
           
            }
          }
        },
        err => {
          //error callback
        }
      );
    }
  },
  components: {
    pagination: pagination
  }
};
</script>

<style lang="less" scoped>
.userInformation {
  width: 100%;
  min-height: 100%;
  // padding: 20px;
  // box-sizing: border-box;
  // overflow-y: auto;
  .main {
    width: 100%;
    height: 100%;
    background-color: #fff;
    // padding: 20px;
    box-sizing: border-box;
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
          width: 100px;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: right;
          margin-right: 10px;
        }
        div {
          display: inline-block;
          width: 233px;
          height: 46px;
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
  .signing {
    width: 100%;
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
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
    }
    .header {
      width: 100%;
      // height:75px;
      // background:rgba(242,242,242,0.8);
      border-radius: 6px;
      padding: 28px 27px;
      box-sizing: border-box;
      text-align: left;
      margin-top: 10px;
      .item {
        min-width: 30%;
        display: inline-block;
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        // margin-right: 55px;
        margin-bottom: 15px;
        div {
          display: inline-block;
        }
        span {
          float: left;
        }
      }
      .items {
        min-width: 100%;
        display: inline-block;
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        // margin-right: 55px;
        margin-bottom: 15px;
        div {
          display: inline-block;
        }
        span {
          float: left;
        }
      }
      // span {
      //   display: inline-block;
      //   font-size:14px;
      //   font-family:PingFangSC;
      //   font-weight:400;
      //   color:rgba(51,51,51,1);
      //   margin-right: 55px;
      // }
    }
    .subtitle {
      width: 100%;
      height: 53px;
      background: rgba(180, 220, 255, 0.3);
      border-radius: 4px;
      line-height: 53px;
      text-align: left;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-top: 20px;
      padding-left: 27px;
      box-sizing: border-box;
    }
    .box {
      margin-top: 20px;
      width: 100%;
      // min-height:361px;
      padding-bottom: 20px;
      border-radius: 6px;
      border: 1px solid rgba(195, 195, 195, 0.8);
      .title {
        width: 100%;
        height: 51px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 27px;
        box-sizing: border-box;
        line-height: 51px;
        text-align: left;
      }
      .content {
        width: 95%;
        height: auto;
        margin: 0 auto;
        margin-top: 20px;
        div {
          width: 100%;
          padding-right: 10px;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          .middle {
            width: 40%;
            height: 100%;
            float: left;
            span {
              display: inline-block;
              width: 210px;
              height: 100%;
              margin-right: 20px;
            }
          }
          .left {
            width: 20%;
            height: 100%;
            float: left;
          }
          .right {
            width: 20%;
            height: 100%;
            float: right;
            span {
              display: inline-block;
              // width:84px;
              height: 100%;
            }
            i:hover {
              color: #409eff;
            }
          }
          i {
            position: absolute;
            right: 10px;
            top: 18px;
            color: #c3c3c3;
            font-size: 18px;
            cursor: pointer;
          }
        }
        .ladder {
          width: 100%;
          height: 56px;
          line-height: 56px;
        }
        .top {
          width: 100%;
          height: 46px;
          line-height: 46px;
          background: rgba(240, 240, 240, 1);
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(70, 92, 109, 1);
        }
        .bottom {
          width: 100%;
          height: 46px;
          line-height: 46px;
          text-align: center;
          background: rgba(232, 244, 255, 1);
          border: 1px solid rgba(193, 225, 255, 1);
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(40, 152, 255, 1);
          cursor: pointer;
        }
      }
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
              margin-right: 50px;
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
      .box2 {
        margin-top: 10px;
        width: 100%;
        padding: 30px 85px;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        overflow: hidden;
        span {
          min-width: 30.33%;
          float: left;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 15px;
          line-height: 36px;
          .laber {
            display: inline-block;
            width: 130px;
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
              // width: 130px;
              margin-right: 10px;
            }
            .box_img {
              width: 160px;
              height: 120px;
              display: inline-block;
              background-color: #e4e7ed;
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
      .box1 {
        margin-top: 10px;
        width: 100%;
        padding: 30px 10px;
        box-sizing: border-box;
        border-radius: 6px;
        text-align: left;
        overflow: hidden;
        .must {
          float: left;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-left: 15px;
          margin-bottom: 15px;
          line-height: 36px;
          min-width: 300px;
          text-align: left;
          div {
            float: right;
          }
        }
        .must:before {
          content: "* ";
          color: red;
        }
        .list {
          float: left;
          margin-left: 22px;
          margin-bottom: 15px;
          .el-upload {
            display: block;
            text-align: left;
          }
          div {
            float: left;
            min-width: 55px;
          }
        }
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
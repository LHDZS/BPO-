<template>
  <div class="information">
      <div class="main">
        <div class="alert">
            <el-alert
            title="温馨提示："
            type="warning"
            description="如需修改开票信息，请联系客户经理。"
            :closable="false"
            show-icon>
            </el-alert>
        </div>
        <div class="list">
            <span class="name">企业名称：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_name" placeholder="请输入企业名称" :disabled="true"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">纳税人类型：</span>
            <div class="input">
                <el-radio v-model="subjectTitleObj.merchant_tax_type" label="00" disabled>一般纳税人</el-radio>
                <el-radio v-model="subjectTitleObj.merchant_tax_type" label="10" disabled>小规模纳税人</el-radio>
            </div>
        </div>
        <div class="list">
            <span class="name">纳税人识别号：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_credit_code" placeholder="请输入纳税人识别号" :disabled="true"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">单位注册地址：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_addr" placeholder="请输入单位注册地址" :disabled="true"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">电话：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_mobile" placeholder="请输入电话" :disabled="true"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">开户行：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_bank" placeholder="请输入开户行" :disabled="true"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">账号：</span>
            <div class="input">
               <el-input v-model="subjectTitleObj.merchant_account" placeholder="请输入账号" :disabled="true"></el-input>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { get, post } from "@/api/index.js";

export default {
    data() {
        return {
            subjectTitleObj: {}
        }
    },
    created() {
        this.merchantCtlTitlePost()
    },
    mounted() {

    },
    methods:{
        merchantCtlTitlePost() {
            post(api.merchantCtlTitle).then(
                d => {
                console.log(d);
                if (d.status === 0) {
                    this.subjectTitleObj = d.data;
                }
                },
                err => {
                //error callback
                }
            );
        }
    }
}
</script>

<style lang="less" scoped>
.information {
    width: 100%;
    .main {
        width: 100%;
        height: 100%;
        .alert {
            width: 100%;
            margin: 20px 0px;
            text-align: left;
        }
        .list {
            width: 100%;
            text-align-last: left;
            margin-bottom: 15px;
            .name {
                display: inline-block;
                width: 120px;
                height: 40px;
                line-height: 40px;
                text-align-last: right;
                font-size: 14px;
            }
            .input {
                display: inline-block;
                width: 706px;
            }
        }
    }
}
</style>
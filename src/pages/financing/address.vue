<template>
  <div class="address">
      <div class="main">
        <div class="alert">
            <el-alert
                title="温馨提示："
                type="warning"
                description="请及时维护最新的邮寄地址，以保证您能及时收到相应票据。"
                :closable="false"
                show-icon>
            </el-alert>
        </div>
        <div class="list">
            <span class="name">收件人：</span>
            <div class="input">
               <el-input v-model="subjectAddrObj.mail_to" placeholder="请输入收件人" :disabled="editorType"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">联系电话：</span>
            <div class="input">
                <el-input v-model="subjectAddrObj.mail_mobile" placeholder="请输入联系电话" :disabled="editorType"></el-input>
            </div>
        </div>
        <div class="list">
            <span class="name">邮寄地址：</span>
            <div class="input">
               <el-input v-model="subjectAddrObj.mail_addr" placeholder="请输入邮寄地址" :disabled="editorType"></el-input>
            </div>
        </div>
        <div class="button">
            <el-button v-if="editorType" type="primary" @click="editor" size="small">编辑</el-button>
            <el-button v-if="!editorType" type="primary" @click="save" size="small">保存</el-button>
            <el-button v-if="!editorType" @click="cancel" size="small">取消</el-button>
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
            editorType: true,
            subjectAddrObj: {}
        }
    },
    created() {
        this.merchantCtlAddrPost()
    },
    mounted() {

    },
    methods:{
        save() {
            post(api.saveAddr,this.subjectAddrObj).then(
                d => {
                    console.log(d);
                    if (d.status === 0) {
                        this.subjectAddrObj = d.data;
                        this.editorType = true;
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                },
                err => {
                //error callback
                }
            );
        },
        cancel() {
            this.editorType = true;
            this.$message('取消编辑');
        },
        editor() {
            this.editorType = false;
        },
        merchantCtlAddrPost() {
            post(api.merchantCtlAddr).then(
                d => {
                console.log(d);
                if (d.status === 0) {
                    this.subjectAddrObj = d.data;
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
.address {
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
        .button {
            display: block;
            margin-left: 420px;
            text-align: left;
        }
    }
}
</style>
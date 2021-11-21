<template>
  <NstcDialog title="修改密码"
              v-if='IsShowDialog'
              custom-class="nstc-dialog"
              :visible="IsShowDialog"
              @close="cancel()">
    <el-form ref="form"
             :model="ruleForm"
             :rules='rules'
             label-width="110px"
             label-position="left">
      <div class="nstc-form-row-flex">
        <el-form-item label="旧密码"
                      prop="oldPassword">
          <el-input show-password
                    :maxlength='500'
                    ref="oldPassword"
                    class="w100"
                    v-model="ruleForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="password">
          <el-input show-password
                    :maxlength='500'
                    ref="password"
                    class="w100"
                    v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码"
                      prop="repeatpassword">
          <el-input show-password
                    ref="repeatpassword"
                    :maxlength='500'
                    class="w100"
                    v-model="ruleForm.repeatpassword"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary"
                 @click="handleSubmit">保存</el-button>
    </div>
  </NstcDialog>
</template>

<script>
import { updatePassword } from "./api";
import _ from 'lodash'
export default {
  name: "Edit",
  data () {
    return {
      ruleForm: {},
      IsShowDialog: false,
      rules: {
        repeatpassword: [{ required: true, message: " ", trigger: "change" }],
        oldPassword: [{ required: true, message: " ", trigger: "blur" }],
        password: [{ required: true, message: " ", trigger: "blur" }],
      },
      userId: '',
      sessionId: ''
    };
  },
  mounted () {
    this.$on("open", (val, sessionId) => {
      this.IsShowDialog = true;
      this.userId = val
      this.sessionId = sessionId
    });
    this.$on("hide", () => {
      this.cancel();
    });
  },
  methods: {
    cancel () { this.IsShowDialog = false; },
    async handleSubmit () {
      this.$refs['form'].validate((valid, msg) => {
        if (valid) {
          updatePassword({ ...this.ruleForm, id: this.userId, JSESSIONID: this.sessionId }).then((res) => {
            if (res.success) {
              console.log(res)
              this.$message.success(res.message)
              this.cancel()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          let firstErr = _.entries(msg)[0];
          if (firstErr) {
            this.$refs[firstErr[0]].focus();
          }
          return false;
        }
      })
    },
  }
};
</script>

<style  lang="less" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>


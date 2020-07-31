<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="手机号" label-width="70px" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="70px" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="70px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update('form')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { wAlert, sAlert } from "../../../util/alert";
import { reqMemberUpdate, reqMemberDetail } from "../../../util/request";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  components: {},
  computed: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "长度在 11 个字符，必须是数字",
            trigger: "blur",
          },
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" },
        ],
      },
      form: {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      requestList: "member/requestList",
    }),
    cancel() {
      this.info.show = false;
    },
    getDetail(id) {
      reqMemberDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.form.password = "";
      });
    },

    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqMemberUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              this.cancel();
              this.requestList();
            } else {
              wAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.requestList();
  },
};
</script>
<style scoped>
</style>
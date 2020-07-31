<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="所属角色" label-width="80px" prop="roleid">
          <el-select v-model="form.roleid">
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update('form')" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqManageAdd,
  reqManageDetail,
  reqManageUpdate,
} from "../../../util/request";
import { sAlert, wAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      roleList: "role/list",
    }),
  },
  components: {},
  data() {
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
    return {
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2到 5 个字符", trigger: "blur" },
        ],
        roleid: [
          { required: true, message: "请选择所属角色", trigger: "change" },
        ],
        password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          
      },
      formLabelWidth: "80px",
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      requestRoleList: "role/requestList",
      requestManageList: "manage/requestList",
      requestTotal: "manage/requestTotal",
    }),
    //置空
    empty() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqManageAdd(this.form).then((res) => {
            // console.log(this.form, "1234567876");
            if (res.data.code == 200) {
              sAlert(res.data.msg);
              //清空
              this.empty();
              //弹窗消失
              this.cancel();
              //刷新重新获取管理员列表
              this.requestManageList();
              //重新获取总的数量
              this.requestTotal();
            } else {
              wAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取一条的数据
    getDetail(id) {
      // console.log(id);
      reqManageDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
    //修改数据
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqManageUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              //清空
              this.empty();
              //弹框消失
              this.cancel();
              //刷新重新获取管理员列表
              this.requestManageList();
            } else {
              wAlert(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    if (this.roleList.length === 0) {
      this.requestRoleList();
    }
  },
};
</script>
<style scoped>
</style>
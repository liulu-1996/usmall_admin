<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" label-width="80px" prop="rolename">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <!-- <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="defaultKey"
            :props="defaultProps"
            ref='tree'
          ></el-tree>-->

          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultKey"
            :props="defaultProps"
            ref="tree"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
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
import { mapGetters, mapActions } from "vuex";
import {
  requestRoleAdd,
  requestRoleDetail,
  requestRoleUpdate,
} from "../../../util/request";
import { sAlert, wAlert } from "../../../util/alert";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  data() {
    return {
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      form: {
        id: "",
        rolename: "",
        menus: "",
        status: 1,
      },
      defaultKey: [],
      formLabelWidth: "70px",
      //树形结构的数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  methods: {
    ...mapActions({
      requestMenuList: "menu/requestList",
      requestRoleList: "role/requestList",
    }),
    //重置
    empty() {
      this.form = {
        rolename: "",
        menus: "",
        status: 1,
      };
      //将树形结构的数据，选择的key值清空
      this.$refs.tree.setCheckedKeys([]);
    },

    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //添加角色数据
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //获取tree的key赋值给form.menus
          this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
          // console.log(this.form.menus, " 12435789");
          requestRoleAdd(this.form).then((res) => {
            console.log(res, "2345");
            if (res.data.code == 200) {
              sAlert(res.data.msg),
                //清空
                this.empty();
              //弹框消失
              this.cancel();
              //再次发送角色列表请求
              this.requestRoleList();
            } else {
              wAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取一条数据
    getDetail(id) {
      requestRoleDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.defaultKey = JSON.parse(res.data.list.menus);
      });
    },

    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //获取tree的key赋值给form.menus
          this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
          console.log(this.form.menus, "00000");
          requestRoleUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              this.empty();
              this.cancel();
              this.requestRoleList();
            } else {
              wAlert("res.data.msg");
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
    if (this.menuList.length === 0) {
      this.requestMenuList();
    }
  },
};
</script>
<style scoped>
</style>
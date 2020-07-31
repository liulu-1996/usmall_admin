<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="规格名称" label-width="80px" prop="specsname">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in attrArr" :key="index" label="规格属性" label-width="80px">
          <el-input v-model="item.value"></el-input>
          <el-button type="primary" v-if="index==0" @click="addAttr">新增规格属性</el-button>
          <el-button type="danger" v-else @click="delAttr(index)">删除</el-button>
        </el-form-item>

        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update('form')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  requestSpecAdd,
  requestSpecDetail,
  requestSpecUpdate,
} from "../../../util/request";
import { sAlert, wAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  components: {},

  data() {
    return {
       rules: {
          specsname: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
       }, 
      attrArr: [
        {
          value: "",
        },
      ],
      //提交给后端的数据
      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      requestList: "spec/requestList",
      requestTotal: "spec/requestTotal",
    }),
    //置空
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
      this.attrArr = [
        {
          value: "",
        },
      ];
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //新增规格属性
    addAttr() {
      this.attrArr.push({
        value: "",
      });
    },
    //删除规格属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.attrArr.some((item) => item.value == "")) {
            wAlert("属性规格均不能为空");
            return;
          }
          this.form.attrs = JSON.stringify(
            this.attrArr.map((item) => item.value)
          );
          // console.log(this.form.attrs, "1234567");
          requestSpecAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert(res.data.msg);
              //清空
              this.empty();
              //弹框消失
              this.cancel();
              //重新获取角色列表数据
              this.requestList();
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
    getDetail(id) {
      requestSpecDetail({ id: id }).then((res) => {
        this.form = res.data.list[0];

        this.attrArr = JSON.parse(res.data.list[0].attrs).map((item) => ({
          value: item,
        }));
      });
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.attrArr.some((item) => item.value == "")) {
            wAlert("属性规格均不能为空");
            return;
          }
          this.form.attrs = JSON.stringify(
            this.attrArr.map((item) => item.value)
          );

          requestSpecUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              //置空
              this.empty();
              //弹框消失
              this.cancel();
              //刷新列表
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
  mounted() {},
};
</script>
<style scoped lang='stylus'>
.add >>> .el-form-item__content {
  display: flex !important;
}

.add >>> .el-input {
  flex: 1;
}

.add >>> .el-button {
  width: auto;
}
</style>
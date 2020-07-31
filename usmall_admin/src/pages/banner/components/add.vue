<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="标题" label-width="70px" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="80px" v-if="form.id!==0">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="70px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update('form')" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { wAlert, sAlert } from "../../../util/alert";
import {
  reqBannerUpdate,
  reqBannerDetail,
  reqBannerAdd,
} from "../../../util/request";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapActions({
      list: "banner/list",
    }),
  },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      imageUrl: "",
      form: {
        title: "",
        img: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      requestList: "banner/requestList",
    }),
    //置空
    empty() {
      this.form = {
        title: "",
        img: "",
        status: 1,
      };
      this.imageUrl = "";
    },
    //修改了图片
    changeImg(e) {
      if (e.size > 2 * 1024 * 1024) {
        wAlert("上传的图片不能超过2M");
        return;
      }
      //上传的文件后缀必须是.png .jpg .gif .jpeg
      var extname = e.name.slice(e.name.lastIndexOf("."));
      var extArr = [".png", ".jpg", ".gif", ".jpeg"];
      if (!extArr.some((item) => item === extname)) {
        wAlert("上传文件必须是图片");
        return;
      }
      //file是上传的文件
      var file = e.raw;
      //生成一个URL地址，赋值给imageUrl,展示出来
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //添加
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqBannerAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert(res.data.msg);
              this.empty();
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
    //获取一条数据
    getDetail(id) {
      reqBannerDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.imageUrl = this.$imgPre + res.data.list.img;
      });
    },
    //修改
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqBannerUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              this.empty();
              this.cancel();
              this.requestList();
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
    // this.requestList();
  },
};
</script>
<style scoped lang="stylus">
// 穿透
.add >>> .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add >>> .el-upload:hover {
  border: 1px dashed #409eff !important;
}

.avatar-uploader-icon {
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

.box-img {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  position: relative;

  h3 {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100px;
  }

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  input {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
</style>
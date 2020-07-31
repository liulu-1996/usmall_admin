<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show" @opened="createEditor">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="一级分类" label-width="80px" prop="first_cateid">
          <el-select v-model="form.first_cateid" @change="firstCateId()">
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in catelist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="80px" prop="second_cateid">
          <el-select v-model="form.second_cateid">
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in createSecondId"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="80px" prop="goodsname">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="80px">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="80px">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="80px">
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
        <el-form-item label="商品规格" label-width="80px">
          <el-select v-model="form.specsid" @change="changeSpecId()">
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in speclist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品属性" label-width="80px">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in attrsArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="80px">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="80px">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" label-width="80px">
          <div id="desc"></div>
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
  requestGoodsAdd,
  requestGoodsDetail,
  requestGoodsUpdate,
} from "../../../util/request";
import { sAlert, wAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
import E from "wangeditor";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      //一级分类列表
      catelist: "cate/list",
      //二级分类列表
      speclist: "spec/list",
      goodslist: "goods/list",
    }),
  },
  components: {},

  data() {
    return {
      //输入框验证
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
      },
      editor: null,
      //二级分类
      createSecondId: [],
      //商品规格属性
      attrsArr: [],
      //图片地址
      imageUrl: "",
      //提交给后端的数据
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: 0,
        market_price: 0,
        img: null,
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
        description: "",
      },
    };
  },
  methods: {
    ...mapActions({
      reqSpecList: "spec/requestList",
      reqCateList: "cate/requestList",
      reqGoodsCount: "goods/requestTotal",
      reqGoodsList: "goods/requestList",
    }),
    //创建编辑器
    createEditor() {
      this.editor = new E("#desc");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
    //置空
    empty() {
      (this.editor = null),
        //二级分类
        (this.createSecondId = []),
        //商品规格属性
        (this.attrsArr = []),
        //图片地址
        (this.imageUrl = ""),
        (this.form = {
          first_cateid: "",
          second_cateid: "",
          goodsname: "",
          price: 0,
          market_price: 0,
          img: null,
          specsid: "",
          specsattr: [],
          isnew: 1,
          ishot: 1,
          status: 1,
          description: "",
        });
    },
    //修改了一级分类
    firstCateId(bool) {
      // console.log(this.catelist, "876543");
      let index = this.catelist.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      // console.log(index, "8765432");
      this.createSecondId = this.catelist[index].children;
      // console.log(this.createSecondId, "8765432");
      if (!bool) {
        this.form.second_cateid = "";
      }
    },
    changeImg(e) {
      let file = e.raw;
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    //改变商品规格时（Id发生改变）,商品属性的联动
    changeSpecId(bool) {
      let index = this.speclist.findIndex(
        (item) => item.id == this.form.specsid
      );
      this.attrsArr = this.speclist[index].attrs;
      if (!bool) {
        this.form.specsattr = [];
      }
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //添加数据
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.description = this.editor.txt.html();
          this.form.specsattr = JSON.stringify(this.form.specsattr);
          requestGoodsAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert(res.data.msg);
              //清空
              this.empty();
              //弹框消失
              this.cancel();
              //重新获取商品列表数据
              this.reqGoodsList();
              //重新获取总的数量
              this.reqGoodsCount();
            } else {
              wAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取一条商品数据
    getDetail(id) {
      requestGoodsDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.imageUrl = this.$imgPre + this.form.img;
        //根据一级分类计算出二级分类的数组
        this.firstCateId(true);
        //根据商品规格计算出商品属性
        this.changeSpecId(true);
        this.form.specsattr = JSON.parse(this.form.specsattr);
      });
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.description = this.editor.txt.html();

          this.form.specsattr = JSON.stringify(this.form.specsattr);
          requestGoodsUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert("修改成功");
              //置空
              this.empty();
              //弹框消失
              this.cancel();
              //刷新列表
              this.reqGoodsList();
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
    if (this.catelist.length == 0) {
      this.reqCateList();
    }
    this.reqSpecList(true);
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
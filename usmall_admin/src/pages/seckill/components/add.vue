<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="活动名称" label-width="80px" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="80px">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changetime"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="一级分类" label-width="80px">
          <el-select v-model="form.first_cateid" @change="changeFirstCateId">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="80px">
          <el-select v-model="form.second_cateid" @change="changeGoodsId">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in secondCateArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" label-width="80px">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update('form')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqSeckillAdd,
  reqSeckillDetail,
  reqSeckillUpdate,
  requestGoodsList,
} from "../../../util/request";
import { sAlert, wAlert } from "../../../util/alert";

import E from "wangeditor";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      //分类的一级列表
      cateList: "cate/list",
      //规格列表
      goodsList: "goods/list",
    }),
  },
  data() {
    return {
       rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
       },  
      //二级分类的数组
      secondCateArr: [],
      //商品属性值
      goodsArr: [],
      //提交给后端的数据
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      value1: [],
    };
  },
  mounted() {
    if (this.cateList.length == 0) {
      this.requestCateList();
    }
    this.requestList();
  },
  methods: {
    ...mapActions({
      //获取分类列表
      requestCateList: "cate/requestList",
      //获取商品列表
      requestList: "seckill/requestList",
    }),

    //change事件，用来获取时间，转换成时间戳，用函数Date.parse();
    changetime(e) {
      this.form.begintime = Date.parse(e[0]);
      this.form.endtime = Date.parse(e[1]);
    },
    //修改了一级分类
    changeFirstCateId(bool) {
      let index = this.cateList.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      this.secondCateArr = this.cateList[index].children;
      //传了true,second_cateid就不置空；没传就置空
      if (!bool) {
        this.form.second_cateid = "";
      }
    },

    //二级发生了改变
    changeGoodsId(bool) {
      requestGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        //根据Id获取数据，赋值给商品数组，做三级联动
        this.goodsArr = res.data.list;
      });
      if (!bool) {
        this.form.goodsArr = [];
      }
    },
    //置空
    empty() {
      //二级分类的数组
      this.secondCateArr = [];
      //商品规格属性值
      this.attrsArr = [];
      //提交给后端的数据
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.value1 = "";
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
          //发起添加请求
          reqSeckillAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              sAlert(res.data.msg);
              //清空
              this.empty();
              //弹框消失
              this.cancel();
              // //重新获取秒杀列表数据
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
      reqSeckillDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        //将时间戳解开，用New Date()，函数里面是数字，所有要用parseInt转成数字
        this.value1 = [
          new Date(parseInt(res.data.list.begintime)),
          new Date(parseInt(res.data.list.endtime)),
        ];
        this.form.id = id;
        //根据一级分类计算出二级分类的数组
        this.changeFirstCateId(true);
        this.changeGoodsId();
      });
    },
    //点击了修改
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reqSeckillUpdate(this.form).then((res) => {
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
          return false;
        }
      });
    },
  },
};
</script>
<style scoped >
</style>
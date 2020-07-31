<template>
      <div>
        <el-table :data="list1" style="width: 100%">
          <el-table-column prop="id" label="商品编号" ></el-table-column>
          <el-table-column prop="goodsname" label="商品名称" ></el-table-column>
          <el-table-column prop="price" label="商品价格"></el-table-column>
          <el-table-column prop="market_price" label="市场价格"></el-table-column>

          <el-table-column label="图片">
            <template slot-scope="scope">
              <img :src="$imgPre+scope.row.img" alt />
            </template>
          </el-table-column>
          <el-table-column label="是否新品">
            <template slot-scope="scope">
              <el-button type="primary" v-if="scope.row.isnew==1">是</el-button>
              <el-button type="info" v-else >否</el-button>
            </template>
          </el-table-column>
           <el-table-column label="是否热卖">
            <template slot-scope="scope">
              <el-button type="primary" v-if="scope.row.isnew==1">是</el-button>
              <el-button type="info" v-else >否</el-button>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
              <el-button type="info" v-else disabled>禁用</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" width='200px'>
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
              <del-button @confirm="del(scope.row.id)"></del-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="cPage"
          :page-size="size1"
          :total="total1"
        ></el-pagination>
      </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { requestGoodsDelete } from "../../../util/request";
import { wAlert, sAlert } from "../../../util/alert";
export default {
  components: {},
  computed: {
    ...mapGetters({
      list1: "goods/list",
      total1: "goods/total",
      size1: "goods/size",
    }),
  },
  data() {
    return {};
  },
  methods: {
    //   requestList
    ...mapActions({
      requestList: "goods/requestList",
      requestTotal: "goods/requestTotal",
      changePage: "goods/changePage",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      requestGoodsDelete({ id: id }).then((res) => {
        if (res.data.code == 200) {
          sAlert("删除成功");
          //刷新重新获取管理员列表
          this.requestList();
          //刷新显示条数
          this.requestTotal();
        } else {
          wAlert(res.data.msg);
        }
      });
    },
    //修改页码
    cPage(num) {
      this.changePage(num);
      this.requestList();
    },
  },
  mounted() {
    this.requestList();
    this.requestTotal();
  },
};
</script>

<style scoped>
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
img{
    width:80px;
    height:90px;
}
</style>
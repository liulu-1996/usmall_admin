<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="title" label="轮播图标题" width="180"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-button type="danger" @confirm="del(scope.row.id)">删除</del-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { sAlert, wAlert } from "../../../util/alert";
import { mapActions, mapGetters } from "vuex";
import {reqBannerDelete} from '../../../util/request'
export default {
  components: {},
  computed: {
    ...mapGetters({
      list:"banner/list",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      requestList:"banner/requestList",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    del(id){
        reqBannerDelete({id:id}).then((res)=>{
            if(res.data.code=200){
                sAlert('删除成功');
                this.requestList();
            }else{
                wAlert(res.data.msg)
            }
        })
    }
  },
  mounted() {
    this.requestList();
  },
};
</script>
<style scoped>
img{
    width:70px;
    height:80px;
}
</style>
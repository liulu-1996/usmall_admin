<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="分类编号" width="180"></el-table-column>
      <el-table-column prop="catename" label="分类名称" width="180"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
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
import { mapGetters, mapActions } from "vuex";
import { sAlert, wAlert } from "../../../util/alert";
import { requestCateDelate } from "../../../util/request";
export default {
  components: {},
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      requestList: "cate/requestList",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      requestCateDelate({id:id}).then((res) => {
        if (res.data.code == 200) {
          sAlert("删除成功");
          this.requestList();
        } else wAlert(res.data.msg);
      });
    },
  },
  mounted() {
    this.requestList();
  },
};
</script>
<style scoped>
img{
    width:100px;
    height:100px;
}
</style>
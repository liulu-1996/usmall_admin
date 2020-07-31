<template>
   <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="菜单编号" width="180"></el-table-column>
      <el-table-column prop="title" label="菜单名称" width="180"></el-table-column>
      <el-table-column label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单地址"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
          <del-button @confirm='del(scope.row.id)'>删除</del-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {requestMenuDelete} from '../../../util/request'
import {sAlert,wAlert} from '../../../util/alert'
export default {
 components: {},
 computed:{
     ...mapGetters({
         list:'menu/list'
     })
 },
 data() {
  return {};
 },
 methods: {
    ...mapActions({
      requestList: "menu/requestList",
    }),
     edit(id){
         this.$emit('edit',id)
     },
     //封装的删除
     del(id){
         
          requestMenuDelete({id:id}).then(res=>{
              if(res.data.code==200){
                  sAlert(res.data.msg)
                  this.requestList()
              }else{
                  wAlert(res.data.msg)
              }
          }) 
     }

 },
  mounted() {
      this.requestList();
  }
};
</script>
<style scoped>
</style>
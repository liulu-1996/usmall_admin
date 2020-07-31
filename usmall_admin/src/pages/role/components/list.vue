<template>
  <div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="角色编号" width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" width="180"></el-table-column>
      <el-table-column  label="状态">
         <template slot-scope="scope">
              <el-button type='primary' v-if='scope.row.status==1'>启用</el-button>
               <el-button type='primary' v-else>禁用</el-button>
         </template>
      </el-table-column>
       <el-table-column prop="address" label="操作">
           <template slot-scope="scope">
              <el-button type='primary'  @click='edit(scope.row.id)'>编辑</el-button>
               <el-button type='danger' @click='del(scope.row.id)'>删除</el-button>
         </template>
       </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import {requestRoleDelate} from '../../../util/request'
import {sAlert,wAlert} from '../../../util/alert'
export default {
  components: {},
  computed:{
      ...mapGetters({
          list:'role/list'
      })
  },
  data() {
    return {};
  },
  methods: {
      ...mapActions({
         requestList:'role/requestList'
      }),
      edit(id){
          this.$emit('edit',id);
      },
      //删除数据
      del(id){
          requestRoleDelate({id:id}).then((res)=>{
              if(res.data.code==200){
                  sAlert(res.data.msg);
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
</style>
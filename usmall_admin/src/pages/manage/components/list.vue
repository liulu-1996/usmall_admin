<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="rolename" label="所属角色"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type='primary' v-if='scope.row.status==1'>启用</el-button>
               <el-button type='info' v-else disabled>禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click='edit(scope.row.uid)'>编辑</el-button>
         <del-button @confirm='del(scope.row.uid)'></del-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" @current-change='cpage' :page-size='size' :total="total"></el-pagination>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import {reqManageDelate} from '../../../util/request'
import {wAlert,sAlert} from '../../../util/alert'
export default {
  components: {},
  computed:{
      ...mapGetters({
          list:'manage/list',
         
          total:'manage/total',
          size:'manage/size'
      })
  },
  data() {
    return {};
  },
  methods: {
    //   requestList
      ...mapActions({
          requestList:'role/requestList',
          requestTotal:'manage/requestTotal',
          changePage:'manage/changePage',
          requestList1:"manage/requestList"
      }),
      edit(id){
          this.$emit('edit',id);

      },
      del(id){
          reqManageDelate({uid:id}).then((res)=>{
              if(res.data.code==200){
                  sAlert('删除成功');
                  //刷新重新获取管理员列表
                  this.requestList1();
                  //刷新显示条数
                  this.requestTotal();
                
              }else{
                  wAlert(res.data.msg)
              }
          })
      },
      //修改页码
      cpage(num){
          this.changePage(num);
          this.requestList1();
      },

  },
  mounted() {
      this.requestList();
      this.requestTotal();
      this.requestList1();
    
  },
};
</script>
<style scoped>
.el-pagination{
    text-align:right;
    margin-top:20px;
}
</style>
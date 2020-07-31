<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="规格编号" width="180"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" width="180"></el-table-column>
      <el-table-column  label="规格属性">
          <template slot-scope="scope">
       
             <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type='primary' v-if='scope.row.status==1'>启用</el-button>
               <el-button type='info' v-else disabled>禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click='edit(scope.row.id)'>编辑</el-button>
         <del-button @confirm='del(scope.row.id)'></del-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" @current-change='cpage' :page-size='size' :total="total"></el-pagination>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import {requestSpecDelate} from '../../../util/request'
import {wAlert,sAlert} from '../../../util/alert'
export default {
  components: {},
  computed:{
      ...mapGetters({
          list:'spec/list',
         
          total:'spec/total',
          size:'spec/size'
      })
  },
  data() {
    return {};
  },
  methods: {
    //   requestList
      ...mapActions({
          requestList:'spec/requestList',
          requestTotal:'spec/requestTotal',
          changePage:'spec/changePage',
         
      }),
      edit(id){
          this.$emit('edit',id);

      },
      del(id){
          requestSpecDelate({id:id}).then((res)=>{
              if(res.data.code==200){
                  sAlert('删除成功');
                  //刷新重新获取管理员列表
                  this.requestList();
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
.el-pagination{
    text-align:right;
    margin-top:20px;
}
</style>
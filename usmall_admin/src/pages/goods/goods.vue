<template>
 <div>
   <el-button type='success' @click='add'>添加</el-button>
    <v-add :info='info' ref='add'></v-add>
    <v-list @edit="edit"></v-list>
 </div>
</template>
<script>
import vAdd from './components/add'
import vList from './components/list'
export default {
 components: {
   vAdd,
   vList
 },
 data() {
  return {
    info:{
      show:false,
      title:'商品添加',
      isAdd:true
    }
  };
 },
 methods: {
   add(){
     this.info.show=true,
     this.info.title='商品添加',
     this.info.isAdd=true
   },
   edit(id){
     this.info.show=true,
     this.info.title='商品修改',
     this.info.isAdd=false,
     this.$refs.add.getDetail(id)
   }
 },
  mounted() {}
};
</script>
<style scoped>
</style>
<template>
  <div>
       <v-add :info='info' ref='add'></v-add>
       <v-list @edit='edit'></v-list>
  </div>
</template>
<script>
import vList from './components/list'
import vAdd from './components/add'
export default {
  components: {
    vAdd,
    vList
  },
  data() {
    return {
      info:{
        show:false,
        title:'会员修改'
      }
    };
  },
  methods: {
    edit(id){
           this.info.show=true
           this.info.title='会员修改' 
           this.$refs.add.getDetail(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>
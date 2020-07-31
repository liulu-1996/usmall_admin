<template>
 <div class='login'>
      <div class='con'>
          <h3>登录</h3>
          <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
          <el-input placeholder="请输入密码" v-model="user.password"  show-password></el-input>
           <div>
              <el-button type='primary' @click='login'>登录</el-button>
          </div>
      </div>
 </div>
</template>
<script>

import {reqManageLogin}  from '../../util/request'
import {mapActions} from 'vuex'
import {sAlert,wAlert} from '../../util/alert'
export default {
 components: {
     
 },
  computed:{
      
  },
 data() {
  return { 
     user:{
         username:'',
         password:''
     }

  };
 },
 methods: {
     ...mapActions({
          changeUser:'changeUser'
      }),
     login(){
         reqManageLogin(this.user).then((res)=>{
            
            if(res.data.code==200){
                sAlert('登录成功')
                this.changeUser(res.data.list)
                this.$router.push('/home')
            }else{
                wAlert('登录失败')
            }
         })
        
     }
 },
  mounted() {}
};
</script>
<style scoped>
.login{
      width: 100vw;
      height:100vh;
      background:linear-gradient(to right,#563444,#303d60);
}
.con{
    width:400px;
    padding:20px;
    background:#fff;
    border-radius:20px;
    position:fixed;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%)
}
h3{
    line-height:60px;
    font-size:30px;
    text-align:center;
}
.el-input{
    margin-bottom:20px;
}
.con div{
    text-align:center;
}
</style>
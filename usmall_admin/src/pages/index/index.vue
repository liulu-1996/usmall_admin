<template>
  <div>
    <el-container class="left">
      <el-aside width="200px">
        <!-- 导航开始      -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :unique-opened="true"
        >
          <el-menu-item index="/home">
            <i class="el-icon-setting"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <!-- 有目录的循环 -->
          <!-- <el-submenu v-show='childMenu'  index="item.id" v-for='item in user.menus' >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item v-for='it in item.children' :key='it.title' :index="it.url">{{it.title}}</el-menu-item>           
          </el-submenu> -->
          <!-- 没有目录只有菜单 -->
            <!-- <el-menu-item v-show='!childMenu' v-for='it in user.menus' :key='it.title' :index="it.url">
              <span slot="title">{{it.title}}</span>
            </el-menu-item> -->
             <template v-for="(item) in user.menus">
               <el-submenu v-if="item.children" :index="item.id+''" :key="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="(i) in item.children" :key="i.title" :index="i.url">{{i.title}}</el-menu-item>
            </el-submenu>

            <el-menu-item v-if="!item.children" :key="item.id" :index="item.url">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
            </template>
        </el-menu>

        <!-- 导航结束 -->
      </el-aside>
      <el-container>
        <el-header>
          <div class="userN">
            <span>{{user.username}}</span>
            <el-button type="primary" @click="exit">退 出</el-button>
          </div>
        </el-header>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view class="cent"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  computed: {
    ...mapGetters({
      user: "user",
    }),
    //用来判断是否有目录
    childMenu() {
      return this.user.menus[0].children ? true : false;
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    exit() {
      this.changeUser(null);
      this.$router.push("/login");
    },
  },
  mounted() { },
};
</script>
<style scoped>
.left {
  height: 100vh;
}
.el-aside {
  background-color: #20222a;
}
.el-header {
  background-color: #b3c0d1;
  overflow: hidden;
}
.userN {
  float: right;
}
.userN span {
  line-height: 60px;
  color: #fff;
}
.cent {
  padding-top: 20px;
}
</style>
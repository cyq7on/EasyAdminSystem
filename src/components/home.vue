<template>
  <div >
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#66B1FF"
      text-color="#fff"
      active-text-color="#fff"
      :default-active="tab"
    >
      <el-menu-item index="1">
      <router-link to="/home/user">所有用户</router-link>
      </el-menu-item>
      <el-menu-item index="2">
      <router-link to="/home/setting">设置</router-link>
      </el-menu-item>
      </el-menu-item>
      <!-- <el-menu-item index="3">
        <a href="https://www.ele.me" target="_blank">关于我们</a>
      </el-menu-item> -->
    </el-menu>
    <router-view></router-view>
  </div>
  <!--导航条-->
</template>
<script>
  export default {
    created() {
      this.$router.push({path: "/home/user"});
    },
    data() {
      return {
        tab: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
a {
  text-decoration: none;
}
.el-menu{
  margin-bottom: 10px;
}
</style>
<template>
  <div>
    <div class="title-container">
      <h3 class="title">Easy后台管理系统</h3>
    </div>
    <div class="login-box" id="app">
      <el-row>
        <el-col :span="8">
          <el-input id="name" v-model="name" placeholder="请输入帐号/admin">
            <template slot="prepend">帐号</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-input id="password" v-model="password" type="password" placeholder="请输入密码/123456">
            <template slot="prepend">密码</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-button id="login" v-on:click="login" style="width:100%" type="primary">登录</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { isNull } from "../utils/validate";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      name: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      if (isNull(this.name)) {
        alert("请输入用户名！");
        return;
      }
      if (isNull(this.password)) {
        alert("请输入密码！");
        return;
      }
      let loading = Loading.service({
        target: "app",
        fullscreen: true,
        lock: true,
        text: "加载中..."
      });

      var body = { name: this.name, pwd: this.password };
      this.$http.post("login", body).then(
        result => {
          loading.close();
          // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
          var result = result.body;
          if (result.errorCode == 0) {
            // 成功了
            console.log(result.value);
            sessionStorage.setItem("STORAGE_TOKEN", result.value);
            this.$router.push({ path: "/home" });
          }
        },
        error => {
          loading.close();
        }
      );
    }
  }
};
</script>


<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.login-box {
  margin-top: 5%;
  margin-left: 40%;
}

.title-container {
  position: relative;
}
.title {
  margin-top: 10%;
  font-size: 26px;
  color: #909399;
  text-align: center;
  font-weight: bold;
}
</style>


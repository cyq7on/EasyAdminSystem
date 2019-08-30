<template>
  <div>
    <el-form label-position="left" ref="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="tel"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">新建用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      tel: "",
      age:""
    };
  },
  methods: {
    addUser() {
      var body = {
        userName: this.userName,
        tel: this.tel,
        age: this.age
      };
      this.$http.post("user/add", body).then(result => {
        // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
        var result = result.body;
        if (result.errorCode == 0) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.$router.back(-1);
        }
      });
    }
  }
};
</script>

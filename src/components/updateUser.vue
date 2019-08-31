<template>
  <div>
    <el-form label-position="left" ref="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="tel" type="tel"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="age" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUser">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userId: "",
      userName: "",
      tel: "",
      age:""
    };
  },
  created() {
    console.log(this.$route.params);
    this.userId = this.$route.params.userId;
    this.userName = this.$route.params.userName;
    this.tel = this.$route.params.tel;
    this.age = this.$route.params.age;
  },
  methods: {
    updateUser() {
      var body = {
        id: this.userId,
        userName: this.userName,
        tel: this.tel,
        age: this.age
      };
      this.$http.post("user/update", body).then(result => {
        // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
        var result = result.body;
        if (result.errorCode == 0) {
          this.$message({
            message: "更新成功！",
            type: "success"
          });
          this.$router.back(-1);
        }
      });
    }
  }
};
</script>

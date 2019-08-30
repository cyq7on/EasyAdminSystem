<template>
  <div>
    <el-form label-position="left" ref="form" label-width="80px">
      <el-form-item label="用户昵称">
        <el-input v-model="nickName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="phone"></el-input>
      </el-form-item>
      <el-form-item label="出生月">
        <el-input v-model="birthDay"></el-input>
      </el-form-item>
      <el-form-item label="出生日">
        <el-input v-model="birthMonth"></el-input>
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
      birthMonth: "",
      birthDay: "",
      nickName: "",
      phone: ""
    };
  },
  methods: {
    addUser() {
      var body = {
        birthMonth: this.birthMonth,
        birthDay: this.birthDay,
        nickName: this.nickName,
        phone: this.phone
      };
      this.$http.post("userAdmin", body).then(result => {
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

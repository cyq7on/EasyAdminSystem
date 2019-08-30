<template>
  <div>
    <el-form label-position="left" ref="form" label-width="80px">
      <el-form-item label="用户昵称">
        <el-input v-model="nickName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="phone"></el-input>
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
      nickName: "",
      phone: ""
    };
  },
  created() {
    console.log(this.$route.params);
    this.userId = this.$route.params.userId;
    this.nickName = this.$route.params.nickName;
    this.phone = this.$route.params.phone;
  },
  methods: {
    updateUser() {
      var body = {
        userId: this.userId,
        nickName: this.nickName,
        phone: this.phone
      };
      this.$http.post("userAdmin/update", body).then(result => {
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

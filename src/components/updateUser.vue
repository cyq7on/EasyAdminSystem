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
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          name="file"
          action="http://localhost:8080/user/upload"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatar" :src="avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUser">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
export default {
  data() {
    return {
      userId: "",
      userName: "",
      avatar: "",
      tel: "",
      age: "",
      headers: {
        Authorization: sessionStorage.getItem("STORAGE_TOKEN")
      }
    };
  },
  created() {
    console.log(this.$route.params);
    this.userId = this.$route.params.userId;
    this.userName = this.$route.params.userName;
    this.avatar = this.$route.params.avatar;
    this.tel = this.$route.params.tel;
    this.age = this.$route.params.age;
  },
  methods: {
    updateUser() {
      var body = {
        id: this.userId,
        userName: this.userName,
        avatar: this.avatar,
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
    },
    handleAvatarSuccess(response, file) {
      //这里response就是返回的数据
      console.log(response);
      if (response.errorCode == 0) {
        this.avatar = response.data;
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
      }
    },
    beforeAvatarUpload(file) {
      const limit = file.size / 1024 / 1024 < 5;

      if (!limit) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return limit;
    }
  }
};
</script>

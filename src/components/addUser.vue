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
      <el-form-item label="上传头像">
        <el-upload
          class="avatar-uploader"
          name="smfile"
          action="https://sm.ms/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">新建用户</el-button>
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
      userName: "",
      tel: "",
      age: "",
      imageUrl: ""
    };
  },
  methods: {
    addUser() {
      var body = {
        userName: this.userName,
        tel: this.tel,
        age: this.age,
        avatar: this.imageUrl
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
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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

<template>
  <div>
    <!--搜索框-->
    <el-row style="margin-bottom:10px">
      <el-col :span="4" class="grid">
        <el-input
          v-model="input"
          placeholder="输入手机号"
          size="mini"
          :clearable="true"
          type="tel"
        ></el-input>
      </el-col>
      <el-col :span="1" class="grid" style="margin-left:10px">
        <el-button type="success" icon="el-icon-search" size="mini" @click.prevent="getUser()">搜索</el-button>
      </el-col>
      <!--新增按钮-->
      <el-col :span="1" class="grid" style="margin-left:30px">
        <router-link to="/home/addUser">
          <el-button type="success" icon="el-icon-circle-plus-outline" size="mini">新增</el-button>
        </router-link>
      </el-col>
    </el-row>
    <br />
    <!--表格数据及操作-->
    <!-- 加载设置 -->
    <el-table
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      fit
      :data="list"
      border
      style="width: 100%"
      ref="multipleTable"
      tooltip-effect="dark"
    >
      <!--勾选框-->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <!--索引-->
      <!-- <el-table-column type="index" :index="indexMethod"></el-table-column> -->

      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" min-width="60" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" sortable></el-table-column>
      <el-table-column prop="tel" label="手机号"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column fixed="right" label="操作" width="260px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click.prevent="updateUser(scope.$index, scope.row)"
          >修改用户信息</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click.prevent="showDeleteDialog(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[pageSize, 2 * pageSize, 3 * pageSize, 4 * pageSize]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="确认删除？" :visible.sync="deleteDialogVisible">
      <span>用户名：{{selectRow.userName}}</span>
      <br/>
      <span style="display:inline-block;margin-top:10px">手机号：{{selectRow.tel}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.input = this.$route.params.phone;
    this.getUser();
  },
  data() {
    return {
      //查询输入框数据
      input: "",
      pageNo: 1,
      pageSize: 20,
      total: 0,
      list: [], // 存放列表数据
      deleteDialogVisible: false,
      // 被选中的一行
      selectRow: {}
    };
  },
  methods: {
    getUser() {
      // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
      var data = {
        params: {
          tel: this.input,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      };
      this.$http.get("user/list", data).then(result => {
        var result = result.body;
        if (result.errorCode == 0) {
          // 成功了
          this.list = result.data.list;
          this.total = result.data.total;
        }
      });
    },

    updateUser(index, row) {
      this.$router.push({
        name: "updateUser",
        params: {
          userName: row.userName,
          tel: row.tel,
          userId: row.id,
          age: row.age
        }
      });
    },
    showDeleteDialog(index, row) {
      this.deleteDialogVisible = true;
      this.selectRow = row;
    },
    deleteUser() {
      this.$http.delete("user/" + this.selectRow.id).then(result => {
        var result = result.body;
        if (result.errorCode == 0) {
          // 成功了
          this.deleteDialogVisible = false;
          this.getUser();
          this.$message({
            message: result.message,
            type: "success"
          });
        }
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getUser();
    },
    handleCurrentChange(page) {
      this.pageNo = page;
      this.getUser();
    }
  }
};
</script>
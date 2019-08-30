<template>
  <div>
    <!--搜索框-->
    <el-row style="margin-bottom:10px">
      <el-col :span="4" class="grid">
        <el-input v-model="input" placeholder="输入手机号" size="mini" clearable:true type="tel" clearable="true"></el-input>
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
            @click.prevent="deleteBlog(scope.$index, scope.row)"
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

    <el-dialog title="vip类型" :visible.sync="vipDialogVisible">
      <el-select v-model="vipType" placeholder="请选择">
        <el-option label="月会员" value="2"></el-option>
        <el-option label="学期会员" value="3"></el-option>
      </el-select>
      <el-button type="primary" @click.prevent="updateVip">开通会员</el-button>
    </el-dialog>
    <el-dialog title="代金券" :visible.sync="ticketDialogVisible">
      <el-row>
        <span v-if="!(ticket.hasBirthdayCoupon || ticket.hasVipCoupon)">没有可用的代金券</span>
      </el-row>
      <br />
      <template>
        <el-radio :disabled="!ticket.hasBirthdayCoupon" v-model="radio" label="1">生日代金券</el-radio>
        <el-radio :disabled="!ticket.hasVipCoupon" v-model="radio" label="2">vip代金券</el-radio>
      </template>
      <el-button
        v-if="ticket.hasBirthdayCoupon || ticket.hasVipCoupon"
        type="primary"
        @click.prevent="useTicket"
      >使用代金券</el-button>
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
      vipDialogVisible: false,
      ticketDialogVisible: false,
      vipType: "",
      ticketType: "",
      userId: "",
      radio: "",
      checked: false,      
      ticket: {
        hasBirthdayCoupon: false,
        hasVipCoupon: false
      }
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
          age:row.age
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
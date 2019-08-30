<template>
  <div>
    <!--搜索框-->
    <el-row style="margin-bottom:10px">
      <el-col :span="4" class="grid">
        <el-input v-model="input" placeholder="输入手机号" size="mini" clearable:true type="tel"></el-input>
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
    <el-checkbox @change="selectOnlyToday" style="margin-bottom:20px" v-model="checked">仅显示当日新增用户</el-checkbox>
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

      <el-table-column prop="avatarUrl" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl " min-width="60" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="微信昵称" sortable></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="birthMonth，birthDay" label="出生日期">
        <template slot-scope="scope">
          <span>{{scope.row.birthMonth}}月{{scope.row.birthDay}}日</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额"></el-table-column>
      <el-table-column prop="integral" label="积分"></el-table-column>
      <el-table-column prop="vipType" label="会员类型">
        <template slot-scope="scope">
          <span v-if="scope.row.vipType === 1">普通会员</span>
          <span v-if="scope.row.vipType === 2">月会员</span>
          <span v-if="scope.row.vipType === 3">学期会员</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="560px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click.prevent="updateBalance(scope.$index, scope.row)"
          >修改余额</el-button>
          <el-button
            type="primary"
            size="mini"
            @click.prevent="updateScore(scope.$index, scope.row)"
          >修改积分</el-button>
          <el-button
            type="primary"
            size="mini"
            @click.prevent="queryTicket(scope.$index, scope.row)"
          >使用代金券</el-button>
          <el-button
            type="primary"
            size="mini"
            @click.prevent="openVip(scope.$index, scope.row)"
          >开通会员</el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click.prevent="updateUser(scope.$index, scope.row)"
          >修改用户信息</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click.prevent="deleteBlog(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>-->
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
      registerDate:null,
      pageNo: 1,
      pageSize: 100,
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
          phone: this.input,
          registerDate: this.registerDate,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      };
      this.$http.get("userAdmin/list", data).then(result => {
        var result = result.body;
        if (result.errorCode == 0) {
          // 成功了
          this.list = result.value.list;
          this.total = result.value.total;
        }
      });
    },

    updateUser(index, row) {
      this.$router.push({
        name: "updateUser",
        params: {
          nickName: row.nickName,
          phone: row.phone,
          userId: row.userId
        }
      });
    },
    updateBalance(index, row) {
      this.$router.push({
        name: "updateBalance",
        params: {
          nickName: row.nickName,
          phone: row.phone,
          balance: row.balance,
          userId: row.userId
        }
      });
    },
    updateScore(index, row) {
      this.$router.push({
        name: "updateScore",
        params: {
          nickName: row.nickName,
          phone: row.phone,
          integral: row.integral,
          userId: row.userId
        }
      });
    },
    openVip(index, row) {
      this.vipDialogVisible = true;
      this.userId = row.userId;
    },
    updateVip() {
      var body = {
        userId: this.userId,
        vipType: this.vipType
      };
      this.$http.post("vip", body).then(result => {
        // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
        var result = result.body;
        if (result.errorCode == 0) {
          this.vipDialogVisible = false;
          this.getUser();
          this.$message({
            message: "开通会员成功！",
            type: "success"
          });
        }
      });
    },
    queryTicket(index, row) {
      this.userId = row.userId;
      var data = {
        params: {
          userId: this.userId
        }
      };
      this.$http.get("coupon/check", data).then(result => {
        // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
        var result = result.body;
        if (result.errorCode == 0) {
          this.ticketDialogVisible = true;
          this.ticket = result.value;
        }
      });
    },
    useTicket() {
      let type = this.radio;
      var body = {
        userId: this.userId,
        useBirthdayCoupon: this.radio == 1,
        useVipCoupon: this.radio == 2
      };
      if (this.radio == "") {
        this.$message({
          message: "请选择代金券类型",
          type: "warning"
        });
        return;
      }
      this.$http.post("coupon/use", body).then(result => {
        // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
        var result = result.body;
        if (result.errorCode == 0) {
          this.ticketDialogVisible = false;
          this.$message({
            message: result.value,
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
    },
    selectOnlyToday(){
      if(this.checked) {
        this.registerDate = this.$moment().format("YYYY-MM-DD");
      }else {
        this.registerDate = null;
      }
      this.getUser();
    }
  }
};
</script>
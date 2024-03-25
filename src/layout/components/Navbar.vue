<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-badge :is-dot="isDot">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
<!--            <i class="el-icon-caret-bottom"/>-->
          </el-badge>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="home">
            首页
          </el-dropdown-item>
          <el-dropdown-item command="personal">
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="message">
            消息
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            登出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-drawer title="消息" :visible.sync="drawer" :direction="direction" size="15%">
        <div class="app-container">
          <el-table ref="tableList" :data="tableData" :show-header="false" :stripe="true">
            <el-table-column label="消息内容" prop="contextText">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleClick(scope.$index, scope.row)">{{ scope.row[scope.column.property] }}</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { socket } from '@/layout/components/socket'
import { getMessage } from '@/api/config/message'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      isDot: false,
      tableData: []
    }
  },
  async created() {
    socket.initWebSocket('ws://127.0.0.1:30000/echo/dev/ws/' + this.$store.state.user.name)
    socket.websocket.onmessage = this.websocketMessage
  },
  methods: {
    handleClick(index, row) {
      this.$router.push({
        name: row.pageName,
        params: {
          id: row.businessId
        }
      })
    },
    websocketMessage(event) {
      const obj = JSON.parse(event.data)
      if (obj.type === 'count') {
        if (obj.data > 0) {
          this.isDot = true
        } else {
          this.idDot = false
        }
      }
      if (obj.type === 'message') {
        this.$modal.msgSuccess(obj.data)
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleCommand(command) {
      if (command === 'message') {
        // 消息中心
        getMessage(this.$store.state.user.name).then(res => {
          this.tableData = res.data
        })
        this.drawer = true
      }
      if (command === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

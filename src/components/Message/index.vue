<template>
  <div>
    <el-badge :value="messageCount" class="custom-badge">
      <svg-icon icon-class="message" @click="openMessage" />
    </el-badge>
    <el-drawer title="消息" :visible.sync="drawer" :direction="direction" size="15%">
      <div class="app-container">
        <el-table ref="tableList" :data="tableData" :show-header="false" :stripe="true">
          <el-table-column label="消息内容" prop="contextText">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleClickItem(scope.$index, scope.row)">
                {{ scope.row[scope.column.property] }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>
<script>

import { socket } from '@/layout/components/socket'
import { getMessage, getMessageCount } from '@/api/config/message'

export default {
  name: 'Message',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      tableData: [],
      messageCount: 0
    }
  },
  async created() {
    socket.initWebSocket('ws://127.0.0.1:30000/echo/dev/ws/' + this.$store.state.user.id)
    socket.websocket.onmessage = this.websocketMessage
  },
  methods: {
    openMessage() {
      // 消息中心
      getMessage(this.$store.state.user.name).then(res => {
        this.tableData = res.data
      })
      this.drawer = true
    },
    websocketMessage(event) {
      const obj = JSON.parse(event.data)
      if (obj.type === 'count') {
        this.messageCount = obj.data
      }
      if (obj.type === 'message') {
        // this.$notify.msgSuccess(obj.data)
        this.$notify({
          message: obj.data,
          type: 'success',
          position: 'bottom-right'
        })
        getMessageCount(this.$store.state.user.id).then(res => {
          this.messageCount = res.data
        })
      }
    },
    handleClickItem(index, row) {
      this.$router.push({
        name: row.pageName,
        params: {
          id: row.businessId
        }
      })
    }
  }
}

</script>

<style>
.custom-badge .el-badge__content {
  top: 10px;  /* 向上移动 */
  right: 10px;  /* 向右移动 */
}

</style>

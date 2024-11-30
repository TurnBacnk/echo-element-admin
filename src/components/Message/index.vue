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
import {getMessage, getMessageCount, read} from '@/api/config/message'

export default {
  name: 'Message',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      tableData: [],
      messageCount: 0,
      heartBeatTimer: null, // 心跳定时器
      reconnectTimer: null, // 重连定时器
      reconnectAttempts: 0, // 重连次数
      maxReconnectAttempts: 5 // 最大重连次数
    }
  },
  async created() {
    this.initWebSocketConnection()
  },
  methods: {
    // 初始化 WebSocket 连接
    initWebSocketConnection() {
      socket.initWebSocket('ws://127.0.0.1:30000/echo/dev/ws/' + this.$store.state.user.id)
      socket.websocket.onmessage = this.websocketMessage
      socket.websocket.onopen = this.onWebSocketOpen
      socket.websocket.onclose = this.onWebSocketClose
      socket.websocket.onerror = this.onWebSocketError
    },
    openMessage() {
      // 消息中心
      getMessage(this.$store.state.user.id).then(res => {
        this.tableData = res.data
        this.drawer = true
      })
    },
    // WebSocket 打开时的处理
    onWebSocketOpen() {
      console.log('WebSocket连接成功')
      this.startHeartbeat() // 开始心跳检测
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
      this.drawer = false
      // 跳转前更新为已读
      read(row.id).then(res => {
        const match = row.contextText.match(/\[(.*?)\]/)
        const code = match[1]
        this.$router.push({
          name: row.pageName,
          params: {
            code: code,
            instanceId: row.instanceId
          }
        })
      })
    },
    onWebSocketClose() {
      console.log('WebSocket连接关闭')
      this.stopHeartbeat() // 停止心跳检测
      this.reconnectWebSocket() // 尝试重连
    },

    // WebSocket 出错时的处理
    onWebSocketError() {
      console.log('WebSocket出错')
      this.reconnectWebSocket() // 出错时重连
    }, // 尝试重连 WebSocket
    reconnectWebSocket() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        console.log(`WebSocket重连尝试第 ${this.reconnectAttempts} 次`)
        this.reconnectTimer = setTimeout(() => {
          this.initWebSocketConnection()
        }, 2000) // 每次重连延迟 2 秒
      } else {
        console.log('WebSocket达到最大重连次数，停止重连')
      }
    },

    // 开始心跳检测
    startHeartbeat() {
      this.heartBeatTimer = setInterval(() => {
        if (socket.websocket.readyState === WebSocket.OPEN) {
          socket.websocket.send(JSON.stringify({ type: 'heartbeat' }))
          console.log('发送心跳包')
        } else {
          console.log('WebSocket连接已断开，无法发送心跳包')
          this.stopHeartbeat()
        }
      }, 5000) // 每 5 秒发送一次心跳包
    },

    // 停止心跳检测
    stopHeartbeat() {
      if (this.heartBeatTimer) {
        clearInterval(this.heartBeatTimer)
        this.heartBeatTimer = null
      }
    },
    beforeDestroy() {
      this.stopHeartbeat() // 组件销毁前停止心跳检测
      clearTimeout(this.reconnectTimer) // 清除重连定时器
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

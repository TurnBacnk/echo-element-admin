<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <div slot="header">
            <span><i class="el-icon-collection" /> 緩存列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              icon="el-icon-refresh-right"
              @click="refreshCacheNames"
            />
          </div>
          <el-table
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            style="width: 100%;"
            @row-click="getCacheKeys"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            />
            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            />

            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleClearCacheName(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <div slot="header">
            <span><i class="el-icon-key" /> 键名列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              icon="el-icon-refresh-right"
              @click="refreshCacheKeys()"
            />
          </div>
          <el-table
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            />
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            />
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleClearCacheKey(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :bordered="false" style="height: calc(100vh - 125px)">
          <div slot="header">
            <span><i class="el-icon-document"></i> 缓存内容</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              icon="el-icon-refresh-right"
              @click="handleClearCacheAll()"
            >清理全部</el-button
            >
          </div>
          <el-form :model="cacheForm">
            <el-row :gutter="32">
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存名称:" prop="cacheName">
                  <el-input v-model="cacheForm.cacheName" :readOnly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存键名:" prop="cacheKey">
                  <el-input v-model="cacheForm.cacheKey" :readOnly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存内容:" prop="cacheValue">
                  <el-input
                    v-model="cacheForm.cacheValue"
                    type="textarea"
                    :rows="8"
                    :readOnly="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { clearCacheAll, clearCacheKey, clearCacheName, getCacheValue, listCacheKeys, listCacheNames } from '@/api/config/cache'

export default {
  name: 'CacheList',
  data() {
    return {
      cacheNames: [],
      cacheKeys: [],
      cacheForm: {},
      loading: true,
      subLoading: false,
      nowCacheName: '',
      tableHeight: window.innerHeight
    }
  },
  created() {
    this.getCacheNames()
  },
  methods: {
    getCacheNames() {
      this.loading = true
      listCacheNames().then(res => {
        this.cacheNames = res.data
        this.loading = false
      })
    },
    refreshCacheNames() {
      this.getCacheNames()
      this.$modal.msgSuccess('刷新緩存列表成功')
    },
    getCacheKeys(row) {
      const cacheName = row !== undefined ? row.cacheName : this.nowCacheName
      if (cacheName === '') {
        return
      }
      this.subLoading = true
      listCacheKeys(cacheName).then(res => {
        this.cacheKeys = res.data
        this.subLoading = false
        this.nowCacheName = cacheName
      })
    },
    nameFormatter(row) {
      return row.cacheName.replace(':', '')
    },
    handleClearCacheName(row) {
      clearCacheName(row.cacheName).then(response => {
        this.$modal.msgSuccess('清理缓存名称[' + row.cacheName + ']成功')
        this.getCacheKeys()
      })
    },
    refreshCacheKeys() {
      this.getCacheKeys()
      this.$modal.msgSuccess('刷新缓存键列表成功')
    },
    handleCacheValue(cacheKey) {
      getCacheValue(this.nowCacheName, cacheKey).then(res => {
        this.cacheForm = res.data
      })
    },
    keyFormatter(cacheKey) {
      return cacheKey.replace(this.nowCacheName, '').replace(':', '')
    },
    handleClearCacheKey(cacheKey) {
      clearCacheKey(cacheKey).then(response => {
        this.$modal.msgSuccess('清理缓存键名[' + cacheKey + ']成功')
        this.getCacheKeys()
      })
    },
    handleClearCacheAll() {
      clearCacheAll().then(response => {
        this.$modal.msgSuccess('清理全部缓存成功')
      })
    }
  }
}

</script>

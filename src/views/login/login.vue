<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <el-form ref="loginForm" class="login-form" label-position="left" :model="loginForm" :rules="rules">
          <div class="title">hello !</div>
          <div class="title-tips">欢迎来到{{ title }}！</div>
          <el-form-item prop="username" style="margin-top: 40px">
            <span class="svg-container svg-container-admin">
              <svg-icon icon-class="user"/>
            </span>
            <el-input v-model.trim="loginForm.username" v-focus placeholder="请输入用户名" tabindex="1" type="text" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="loginForm.password"
              placeholder="请输入密码"
              tabindex="2"
              :type="passwordType"
              @keyup.enter.native="handleLogin"
            />
            <span v-if="passwordType === 'password'" class="show-password" @click="handlePassword">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="validCode"/>
              <template slot="suffix">
                <div class="login-code">
                  <img :src="captchaImg" alt="" class="login-code-img" @click="getCodeByClick"/>
                </div>
              </template>
            </el-input>

          </el-form-item>
          <el-button class="login-btn" :loading="loading" type="primary" @click="handleLogin">登录</el-button>
<!--          <router-link to="/register">-->
<!--            <div style="margin-top: 20px">注册</div>-->
<!--          </router-link>-->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { validUsername } from '@/utils/validate'
import { getCode } from '@/api/config/user'

export default {
  name: 'Login',
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      // TODO 修改校验规则
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      title: 'ECHO',
      loginForm: {
        username: '',
        password: '',
        code: '',
        userKey: undefined
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword,
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      timeOutID: null,
      captchaImg: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
      },
      immediate: true,
    },
  },
  created() {
    document.body.style.overflow = 'hidden'
    this.getCodeByClick()
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
    clearTimeout(this.timeOutID)
  },
  methods: {
    handlePassword() {
      this.passwordType === 'password' ? (this.passwordType = '') : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCodeByClick() {
      getCode().then(res => {
        let { code, data } = res
        this.captchaImg = 'data:image/gif;base64,' + data.captchaImg
        this.loginForm.userKey = data.userKey
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.getCodeByClick()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-code {
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-container {
  height: 100vh;
  background: url('~@/assets/images/background.jpg') center center fixed no-repeat;
  background-size: cover;

  .title {
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }

  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(14, 18, 26, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .login-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 425px) / 2) 10% 10%;
    overflow: hidden;

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }

  .tips {
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: #324157;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        line-height: 18px;
        color: #C03639;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 58px;
        padding-left: 45px;
        line-height: 58px;
        background: #f6f4fc;
        border: 0;
      }
    }
  }
}
</style>

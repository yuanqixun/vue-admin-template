<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">

      <header>欢迎登录商户管理平台</header>
      <el-form-item prop="username">
        <el-input ref="username" placeholder="请输入登陆账号" v-model="loginForm.username" size="normal">
          <template slot="prepend">账号</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input ref="password" :key="passwordType" :type="passwordType"
                  placeholder="请输输入密码" v-model="loginForm.password"
                  size="medium"
                  @keyup.enter.native="handleLogin">
          <template slot="prepend">密码</template>
        </el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <footer>
        <el-button :loading="loading" type="primary" size="normal"
                   @click.native.prevent="handleLogin">登 陆
        </el-button>
      </footer>
    </el-form>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        callback()
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
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
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>

  .login-container {

    width: 100%;
    height: 100%;
    /* background-image: url(../img/login-bg.c50c7e54.jpg); */
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #f8f8f8;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .login-form {
      width: 400px;
      height: auto;
      padding: 30px;
      background-color: hsla(0, 0%, 100%, .5);
      border: 1px solid #eee;
      border-radius: 6px;

      header {
        margin-bottom: 30px;
        font-size: 22px;
        color: #666;
        text-shadow: 0 1px 1px #fff;
        text-align: center;
      }

      .input-section-box{
        padding: 0;
      }

      footer {
        margin-top: 30px;
        text-align: center;

        .el-button {
          min-width: 180px;
        }
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #2b2f3a;
      cursor: pointer;
      user-select: none;
    }
  }
</style>

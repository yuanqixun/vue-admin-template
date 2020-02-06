<template>
  <el-menu class="navbar"
           background-color="#f5f7fa"
           text-color="#606266"
           active-text-color="#1682e6"
           mode="horizontal" router :default-active="$route.matched[0].path">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <template v-if="showTopNavBar">
      <el-menu-item v-for="route in topRoutes" :key="route.path" :index="route.path">
        <span>{{ route.meta.title }}</span>
      </el-menu-item>
    </template>
    <template v-else>
      <breadcrumb />
    </template>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <el-avatar size="small" style="vertical-align: middle" :src="avatar+'?imageView2/1/w/80/h/80'"></el-avatar>
          <span>{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              <i class="el-icon-setting" />
              <span>个人设置</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <i class="el-icon-s-fold" />
            <span>注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>
<style>
  /*.el-menu--horizontal>.el-menu-item {*/
  /*  border-bottom: none !important;*/
  /*}*/
  /*.el-menu--horizontal>.el-menu-item.is-active {*/
  /*  border-top: 2px solid #1890ff !important;*/
  /*  border-bottom: none !important;*/
  /*}*/
</style>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search
  },
  data() {
    return {
      showTopNavBar: this.$store.state.settings.showTopNavBar
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    topRoutes() {
      return this.$store.getters.permission_routes.filter(r => r.meta && r.meta.grade === 0)
    },
    userName() {
      return this.$store.getters.name
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 56px;
    line-height: 56px;
    .el-menu-item {
      height: 100%;
    }
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

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 55px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: middle;

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
        cursor: pointer;

        .avatar-wrapper {
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 30px;
            height: 30px;
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

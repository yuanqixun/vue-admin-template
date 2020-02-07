<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="多页签支持">
        <el-switch v-model="tagsView" class="drawer-switch" />
      </el-form-item>
      <el-form-item label="固定标签栏">
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </el-form-item>
      <el-form-item label="侧边栏LOGO">
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </el-form-item>
      <el-form-item label="顶部导航栏">
        <el-switch v-model="showTopNavBar" class="drawer-switch" />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* eslint-disable */
export default {
  name: 'system_config_UserProfile',
  components: { },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    showTopNavBar: {
      get() {
        return this.$store.state.settings.showTopNavBar
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showTopNavBar',
          value: val
        })
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

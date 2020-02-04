<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" :vname="key2" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    key2() {
      return this.$route.name
    }
  },
  watch: {
    cachedViews: function() {
      // 这个方法废弃，不需要销毁
      console.log(this.$store.state.tagsView.cachedViews)
      for (const c of this.$children) {
        console.log(c)
        const _vname = c.$vnode.data.attrs.vname
        const _index = this.$store.state.tagsView.cachedViews.indexOf(_vname)
        console.log(_vname + ':' + _index)
        if (_index < 0) {
          // c.$destroy()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>

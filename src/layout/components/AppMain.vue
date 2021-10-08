<template>
  <section class="app-main">
      <!-- <keep-alive :include="cachedViews"> -->
        <div class="router_view_box">
          <transition name="fade-transform" mode="out-in"> 
            <keep-alive :include="cachedViews">
              <router-view :key="key" class="router_view" />
            </keep-alive>
          </transition>
        </div>   
      <!-- </keep-alive> -->  
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
        }
    }
}
</script>

<style lang="scss" scoped>
// .app-main {
//   /* 50= navbar  50  */
//   min-height: calc(100vh - 50px);
//   width: 100%;
//   position: relative;
//   overflow: hidden;
//   background: #ccc;
// }
.app-main {
      background: #f8f7f7;
      padding: 5px 10px 0;
      position: relative;
      .router_view_box {
        width: 100%;
        position: relative;
        height: calc(100vh - 90px);
        overflow-y: auto;
        // background: #ffffff;
        // box-shadow: rgba(71, 51, 51, 0.18) 0px 4px 12px 0px;
        // border-radius: 8px 8px 0px 0px;
        .router_view {
          width: 100%;
          // min-height: calc(100vh - 124px);
          min-height: calc(100vh - 90px);
          padding: 2px;
          font-size: 14px;
        }
      }
    }
.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

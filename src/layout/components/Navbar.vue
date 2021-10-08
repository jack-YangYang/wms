<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <!-- <el-avatar :src="avatar+'?imageView2/1/w/60/h/60'"></el-avatar> -->
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="avatar-user">欢迎：{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="avatar-action">
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
export default {
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
    },
    data() {
        return {
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
    },
    computed: {
      ...mapState({
        name: state => state.common.username
      }),
        ...mapGetters([
            'sidebar',
            'device'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
           this.$store.dispatch('permission/logout')         
        }
    },
    mounted() {
      // console.log(this.$store.state.common.username)
    }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
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
        // margin-top: 5px;
        display: flex;
        align-items: center;
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
        .el-avatar {
          width: 24px;
          height: 24px;
        }
        .avatar-user {
          color: #5a5e66;
          font-size: 14px;
          font-weight: bold;
          margin-left: 10px;
        }
      }
    }
  }
}
.avatar-action {
  min-width: 150px;
  background-color:rgb(20, 20, 20) !important;
  box-shadow: 0 5px 15px -5px rgba(255,255,255,1);
  left: 30px;
  li {
    text-align: center;
    span {
      color: #fff;
    }
  }
  .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus {
    background-color:rgb(20, 20, 20) !important;
    color: #fff;
}
}
</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getToken, getStaffName, getMenus } from '@/utils/auth'
export default {
    name: 'App',
    created() {
        if (getToken()) {
          console.log(getStaffName())
            this.$store.commit('GET_STAFFNAME', getStaffName())
            let list = JSON.parse(getMenus())
            
            if (Array.isArray(list) && list.length) {
              this.$store.commit('permission/SET_ROUTES', list)
            }
            // this.$store.commit('permission/SET_MENU_ID', munuIdList)
        }
    },
}
</script>

<template>
    <el-row>
        <el-col v-for="(item ,index) in routerList" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="card-item">
                <card :item="item" :index="index" />
            </div>
        </el-col>     
    </el-row>
</template>
<script>
import card from './card'
import { mapState } from 'vuex'
import colorList from '@/mixins/colorList'
export default {
    components: {
        card
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState('permission', ['routes']),
        routerList() {
            if (this.routes) {
                const list = this.routes.filter(item => item.meta)
                let routerList = []
                list.forEach(item => {
                    item.children.forEach(ele => {
                        if (!ele.hidden) {
                            let router = {}   
                            router['module'] = item.meta.title
                            // let colorObj = colorList[Math.round(Math.random()*20)]
                            router.bgColor = '#16a085'
                            router['title'] = ele.meta.title      
                            router['path'] = ele.path
                            routerList.push(router)
                        }
                    })
                })
                console.log(routerList, 'routerList')
                return routerList
            }
            return []
        }
    },
}
</script>
<style scoped>
.card-item {
    padding: 0 15px;
    margin-bottom: 15px;
}
</style>
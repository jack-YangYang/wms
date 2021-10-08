import { getData, exportData, reqGetSalerDepartment, reqGetDepartmentSalers     } from '@/api/DeliveryAmount'
import { la, loading, loadingClose, downlaod } from '@/utils/common'
import { cosh } from 'core-js/core/number'
const state=  {
    tableData: [],
    department: [],
    departmentSalers: [],
    total: 0,
}
const mutations = {
    GET_DATA(state, data) {
        state.tableData = data.list
        state.total = data.total
    },
    SET_DEPARTMENT(state, data) {
      console.log(data)
        state.department = data
    },
    SET_DEPARTMENT_SALERS(state, data) {
        state.departmentSalers = data
    }
}
const actions = {
    async getData({ commit }, params) {
        loading()
        const { data } = await getData(params)
        commit('GET_DATA', data)
        loadingClose()
    },
    async exportData({}, params) {
        loading()
        const data = await exportData(params)
        downlaod(data, '发货金额报表.xls')
        loadingClose()
    },
    async getDepartment({ commit, dispatch, state }) {
        const { data } =  await reqGetSalerDepartment()
        commit('SET_DEPARTMENT', data)
        dispatch('getDepartmentSalers')
    },
    getDepartmentSalers({ commit, state }, arg) {
        loading()
        let dept_arr = []
        //当销售部门下拉选项为空时 为全选
        arg ?
          arg.forEach(item => {
            dept_arr.push(item[item.length - 1])
          }) :
          dept_arr = function (arg) {
            //递归
            function init_dept_list(arg) {
              if (arg.children && arg.children.length > 0) {
                arg.children.forEach(item => {
                  init_dept_list(item)
                })
              } else {
                arr.push(arg.dept_id)
              }
            }
            //
            let arr = []
            if (arg) {
              if (arg.length > 0) {
                arg.forEach(item => {
                  init_dept_list(item)
                })
              }
            }
            return arr
          }(state.department)
        //
        reqGetDepartmentSalers({ dept_list: dept_arr })
          .then(data => {
            loadingClose()
            data.code == 0 ? commit('SET_DEPARTMENT_SALERS', data.data) : ''
          })
          .catch(() => {
            loadingClose()
          })
      },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
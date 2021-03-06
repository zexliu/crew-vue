import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree
} from 'vuex'
import { RootState, IPermission } from '@/interfaces/store-interface'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */

function hasPermission(permission: any, route: any): boolean {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles:any[], route:any): boolean {
  if (route.meta && route.meta.roles) {
    let flag = false
    roles.forEach(role => {
      if (route.meta.roles.includes(role.roleCode)) {
        flag = true
      }
    })
    return flag
  } else {
    return true
  }
}

function filterAsyncRouter(routerMap: any, roles: any[]) {
  const accessedRouters = routerMap.filter((route: any) => {
    if (hasRole(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const mutations: MutationTree<IPermission> = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  }
}

const actions: ActionTree<IPermission, RootState> = {
  GenerateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const { roles } = data
      const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}

const getters: GetterTree<IPermission, RootState> = {
  addRouters: state => state.addRouters
}

const state: IPermission = {
  routers: constantRouterMap,
  addRouters: []
}

const permission: Module<IPermission, RootState> = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
}

export default permission

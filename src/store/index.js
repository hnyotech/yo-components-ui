import Vue from 'vue'
import Vuex from 'vuex'
// import { state } from './state'
// import * as getters from './getters'
// import * as actions from './actions'
// import * as mutations from './mutations'

const STORAGE_KEY = 'storage_busy_web_autheninfo'
Vue.use(Vuex)


let syncedData = {
    auth: {
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
    },
    user: {
        userId: null,
        userName: null,
        nickName: null,
        avatarUrl:null,
        departName: null,
        departId: null
    },
    timeplan: {},
    paramsList: []
}

// Sync with local storage.
if (localStorage.getItem(STORAGE_KEY)) {
    syncedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

// Merge data and export it.
const state = Object.assign(syncedData)


const localStoragePlugin = (store) => {
    store.subscribe((mutation, state) => {
        const syncedData = { auth: state.auth, user: state.user ,timeplan: state.timeplan, paramsList:state.paramsList}
        localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedData))
        if (mutation.type === 'CLEAR_AUTHEN_DATA') {
            localStorage.removeItem(STORAGE_KEY)
        }
    })
}

const store = new Vuex.Store({
    state: state,
    getters: {
      auth: (state) => {
        return state.auth
      },
      user: (state) => {
        return state.user
      },
      timeplan: () => {
        return state.timeplan
      },
      paramsList:(state)=>{
        return state.paramsList
      }
    },
    // actions: actions,
    mutations: {
      UPDATE_AUTH(state, auth){
        state.auth = auth
      },
      UPDATE_USER(state, user){
          state.user = user
      },
      UPDATE_TIMEPLAN(state,timeplan){
        state.timeplan = timeplan
      },
      UPDATE_USER_AVATAR(state, avatarUrl){
          state.user.avatarUrl = avatarUrl
      },
      CLEAR_AUTHEN_DATA(state){
          // Auth
          state.auth.isLoggedIn = false
          state.auth.accessToken = null
          state.auth.refreshToken = null

          // User
          state.user.userId = ''
          state.user.userName = ''
          state.user.nickName = ''
          state.user.departName = ''
          state.user.departId = ''
          state.user.avatarUrl = ''
      },
      CLEAR_TIMEPLAN_DATA(state){
        state.timeplan = {}
      },
      UPDATE_PARAMSlIST(state,paramsList){
        state.paramsList = paramsList;
      }
    },
    plugins:[
      localStoragePlugin
    ]
})
export default store

import Vue from 'vue'
// import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
// 重试次数 阀值是5
var _retryTimes = 0
// import privilege from './plugins/privilege'

// 刷新token的Api地址
const REFRESH_TOKEN_URL = process.env.sso + '/adfs/oauth2/token'

Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
Vue.use(Message)

// 认证插件
export default {
  /**
   * Install the Auth class.
   * Creates a axios http interceptor to handle automatically adding auth headers
   * and refreshing tokens. Then attaches this object to the global Vue (as Vue.auth).
   * @param {Object} Vue The global Vue.
   * @param {Object} options Any options we want to have in our plugin.
   * @return {void}
   */
  install (Vue, options) {
    var that = this
    // var loadingInstance;
    Vue.http.interceptors.request.use(function (config) {
      // loadingInstance = Loading.service({ text: '拼命加载中...', spinner: 'el-icon-loading' });
      config.headers['Cache-Control'] = 'no-cache, no-store' // 清除缓存
      config.headers['Pragma'] = 'no-cache' // 清除缓存
      const accessToken = store.state.auth.accessToken || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InFOcFdBQm90c3BGQ2RQd19jbHYzc2tXbl8xOCIsImtpZCI6InFOcFdBQm90c3BGQ2RQd19jbHYzc2tXbl8xOCJ9.eyJpc3MiOiJodHRwOi8vZGV2LmhueW90ZWNoLmNvbS5jbjoxMDEwL3Nzby9hZGZzIiwiYXVkIjoiaHR0cDovL2Rldi5obnlvdGVjaC5jb20uY246MTAxMC9hc3NldHNhcGkiLCJleHAiOjE1ODk3OTgyNjYsIm5iZiI6MTU4OTc5NDY2NiwiY2xpZW50X2lkIjoiYWJjZGVmZy1oaWprbG1uLTIyMjIyMiIsInN1YiI6ImhucHJlYyIsIm5hbWUiOiLmsrPljZfkuqfmnYPkuqTmmJPkuK3lv4MiLCJpZHAiOiJpZHNydiIsImF1dGhfdGltZSI6IjE1ODk3OTQ2NjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImhucHJlYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJobnByZWMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL2FjY2Vzc2NvbnRyb2xzZXJ2aWNlLzIwMTAvMDcvY2xhaW1zL2lkZW50aXR5cHJvdmlkZXIiOiJBU1AuTkVUIElkZW50aXR5IiwiQXN0ZWM6VXNlck5hbWUiOiLmsrPljZfkuqfmnYPkuqTmmJPkuK3lv4MiLCJBc3RlYzpMb2dpblR5cGUiOiJCZWFyZXIiLCJBc3RlYzpVc2VyVHlwZSI6IjIwIiwiQXN0ZWM6UHJvcGVydGllcyI6IntcIk1lbWJlclR5cGVcIjpcIlwiLFwiVXNlck1vYmlsZVwiOlwiMTM4MTIzNDU2NzhcIixcIk1lbWJlcklkXCI6bnVsbCxcIlRyYWRpbmdPcmdJZFwiOlwiaG5wcmVjXCJ9IiwicGhvbmVfbnVtYmVyIjoiMTM4MTIzNDU2NzgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiLmsrPljZfkuqfmnYPkuqTmmJPkuK3lv4MiLCJzY29wZSI6WyJvcGVuaWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicGFzc3dvcmQiXX0.uwhpLIOGQyUcYRbXSmfHp1xi3F1dH36VURvFK-v2nH1BZqaf6i8Wp1R3_FmvCJ-XGDP1WrY37dFB5igM-oRVVC7NkrMFDnXaZUxqUQgAzIibEKi19N6sVfTEIBxcn5OmFOEI2njdpG3P--hdR4WfDaRNsRFasZLqMfcVbA9x1K5QaSVOYZRxDRaNzRaPmMivIHgxms6k59LW5wEQTWDb1gsX0pUDAnruQSFqvsCx-fjxdhMWVU_rmksvbfRLLLNEDYVK25Bu7JT8pzsSD-6336LFaS685yHSjvnaP9LbgcqpK6rGTU0Yw2KCQzbfE2G4ZFBG0y1o8UXtTjVi_4ur0g'
      if (accessToken.length > 0) {
        config.headers.Authorization = 'Bearer ' + accessToken
      }
      return config
    }, function (error) {
      // loadingInstance.close();
      return Promise.reject(error)
    })

    Vue.http.interceptors.response.use(function (response) {
      // console.log(response)
      if (response.headers['x-response-wrapped'] === 'true') {
        if (response.data.ErrorCode === 0) {
          _retryTimes = 0// 重置掉次数
          return response.data.Data
        } else if (response.data && response.data.ErrorCode !== 0) {
          // throw response.data.Message
          console.log(response.data.Message)
          var errormsg = ''
          switch (response.data.ErrorCode) {
            case 1:
              errormsg = response.data.Message
              break
            case -1:// 服务器异常
              errormsg = '服务器异常'
              break
            case -10:
              errormsg = '用户名或密码错误'
              break
            case -11:
              errormsg = '用户禁用'
              break
            case -12:
              errormsg = '请输入验证码'
              break
            case -13:
              errormsg = '请输入验证码'
              break
            case 500:
              errormsg = '服务器异常:500'
              break
            case 401:
              // debugger
              return that._refreshToken(response.config)
            case 405:
              errormsg = '服务器异常:405'
              break
            default:
              errormsg = '服务器异常'
          }
          if (errormsg) {
            console.error(errormsg)
          }
          return Promise.reject(errormsg)
        }
      }
      return response
    }, function (error) {
      // debugger
      if (error && error.response) {
        if (that._isRefreshTokenReq(error.config)) {
          console.debug('请求token的时候异常了 直接退出登录吧')
          that.logout()
          return Promise.reject(new Error('登录已过期,请重新登录'))
        } else {
        // let message = error.response.data.Message
          if (error.response.status === 401) {
            // 401异常自动发起刷新token并尝试重新请求
            return that._refreshToken(error.config)
          } else {
            return Promise.reject(new Error('服务器异常:' + error.response.status))
          }
        }
      }
    })
    // 添加 $auth 插件到Vue的全局对象上
    Vue.prototype.$auth = Vue.auth = this
  },
  /**
   * 判断是否是刷新token的请求
   **/
  _isRefreshTokenReq: function (config) {
    return config.url.endWith('/token') && config.data.startWith('grant_type=refresh_token')
  },
  /**
   * 清除登录信息
   **/
  clearToken: function () {
    store.commit('CLEAR_AUTHEN_DATA')
  },
  /**
   * 退出系统 并且退出sso
   **/
  logout: function () {
    // debugger
    let idToken = null
    if (store && store.getters.auth) {
      idToken = store.getters.auth.id_token
    }
    console.log(idToken)
    if (idToken) {

    } else {
      idToken = sessionStorage.getItem('id_token')
      sessionStorage.setItem('id_token', null)
      sessionStorage.removeItem('id_token')
      // sessionStorage.clear();
    }

    store.commit('CLEAR_AUTHEN_DATA')
    let oauthServer = process.env.sso
    // let logouturl = "/adfs/logout";
    let logouturl = '/adfs/oauth2/endsession'
    if (idToken && idToken.length && idToken.length > 0) {
      logouturl += '?id_token_hint=' + idToken
    }
    window.location.href = oauthServer + logouturl
  },
  /**
   * 重试请求 在刷新token后执行 注意:如果API ErrorCode持续返回401会导致无限重试
   **/
  _retry (config) {
    _retryTimes += 1
    return Vue.http.request(config)
  },
  /**
   * 刷新token并重试请求
   **/
  _refreshToken (config) {
    // debugger
    var that = this
    if (_retryTimes >= 5) {
      console.log('重试次数上限,退出登录')
      _retryTimes = 0
      that.logout()
      return Promise.reject(new Error('登录已过期,请重新登录'))
    }

    var clientId = process.env.sso_cleint_id
    var postContent = 'grant_type=refresh_token'
    postContent += '&client_id=' + encodeURIComponent(clientId)
    postContent += '&refresh_token=' + store.state.auth.refreshToken
    postContent += '&resource=' + encodeURIComponent(process.env.API)
    return Vue.http.post(REFRESH_TOKEN_URL, postContent)
      .then((resp) => {
        // debugger
        that._storeSSOToken(resp)
        // 先单独存一个，后面退出的时候要用.
        sessionStorage.setItem('id_token', resp.data.id_token)
        return that._retry(config)
      })
      .catch((err) => {
        // debugger
        that.logout()
        console.error(err)
        return Promise.reject(new Error('登录已过期,请重新登录'))
      })
  },
  /**
   * 存储ssoToken到Store中
   **/
  _storeSSOToken (res) {
    const newAuthenInfo = {
      isLoggedIn: true,
      accessToken: res.data.access_token,
      id_token: res.data.id_token,
      refreshToken: res.data.refresh_token,
      expires_in: res.data.expires_in
    }
    store.commit('UPDATE_AUTH', newAuthenInfo)
  }
}

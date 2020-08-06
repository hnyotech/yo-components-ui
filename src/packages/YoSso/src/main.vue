<template>
  <div class="loginauto getcode">
    <div class="waitingLogin"></div>
    <p class="waiting-text">我跨出的一小步，是人类跨出的一大步</p>
  </div>
</template>
<script>
  import Crypto from 'crypto'
  import sha256 from 'js-sha256'
  import base64url from 'base64url'

  export default {
    name: 'YoSso',
    data() {
      return {
        Host: '',
        Redirect: '',

        api: process.env.API,
        sso: process.env.sso,
        clientId: process.env.sso_cleint_id,
        loginCallBack: process.env.sso_logincallback
      }
    },
    props: {
      type: {
        type: String,
        default: 'client'
      }
    },
    watch: {
      // $route: {
      //   handler: function (val) {
      //     if (val.path === '/login' && val.name === 'login') {
      //       this.loginInit()
      //     } else if (val.path === '/GetCode' && val.name === 'getcode') {
      //       this.getCodeInit()
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // }
    },
    created() {

    },
    mounted: function () {
      this.api = process.env.API
      this.sso = process.env.sso
      this.clientId = process.env.sso_cleint_id
      this.loginCallBack = process.env.sso_logincallback
      alert(this.api, this.sso, this.clientId, this.loginCallBack)
      let url = this.$route
      if (url.path === '/login' || url.name === 'login' || url.name === 'login2') {
        this.loginInit()
      } else if (url.path === '/GetCode' || url.name === 'getcode') {
        this.getCodeInit()
      }
    },
    methods: {
      loginInit() {
        this.Host = window.location.host
        this.Redirect = this.$route.query.redirect
        let redirectToHome = false
        const auth = this.$store.getters.auth
        const user = this.$store.getters.user
        if (this.$route.params && this.$route.params.status) {
          if (this.$route.params.status === 401) {
            redirectToHome = false
          }
        } else {
          redirectToHome = true
        }
        if (auth && auth.isLoggedIn && user && user.userId) {
          if (redirectToHome) {
            this.$router.push({path: '/'})
          }
        } else {
          this.authorize()
        }
      },
      authorize: function () {
        const state = base64url(this.Host + '|' + (this.Redirect || ''))
        const codeVerifier = Crypto.randomBytes(50).toString('hex')
        let codeChallenge = base64url(sha256(codeVerifier))
        const hash = sha256.create()
        hash.update(codeVerifier)
        codeChallenge = hash.array()
        codeChallenge = base64url(codeChallenge)

        window.localStorage.setItem('UPDATE_OAUTH2_CODE_VERIFIER', codeVerifier)
        window.localStorage.setItem('UPDATE_OAUTH2_STATE', state)

        this.$store.commit('UPDATE_OAUTH2_CODE_VERIFIER', codeVerifier)
        this.$store.commit('UPDATE_OAUTH2_STATE', state)

        window.location.href = `${this.sso}/adfs/oauth2/authorize?response_type=code&client_id=${this.clientId}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid%20offline_access&redirect_uri=${encodeURIComponent(window.location.href.split('#')[0] + this.loginCallBack)}&state=${encodeURIComponent(state)}`
      },
      getCodeInit() {
        const oauthServer = this.sso
        let codeVerifier = this.$store.getters.oauth2_code_verifier
        window.localStorage.setItem('temp_ie', new Date().getTime())
        if (window.ActiveXObject || 'ActiveXObject' in window) {
          codeVerifier = window.localStorage.getItem('UPDATE_OAUTH2_CODE_VERIFIER')
        }
        let originState = this.$store.getters.oauth2_state
        if (window.ActiveXObject || 'ActiveXObject' in window) {
          originState = window.localStorage.getItem('UPDATE_OAUTH2_STATE')
        }
        const {code, state, error} = this.$route.query
        const arr = [oauthServer, codeVerifier, originState, code, state]
        for (const a in arr) {
          if (arr[a] === undefined || arr[a] === null || arr[a] === '' || arr[a] === 'undefined' || arr[a] === 'null') {
            throw new Error('必传参数未传入：参数下标' + a)
          }
        }
        if (state !== originState) {
          throw new Error('state is not matcch.')
        }
        if (error) {
          if (error === 'access_denied') {
            console.error('拒绝授权')
            this.$router.push({
              path: '/home'
            })
          } else {
            throw new Error(error)
          }
        }
        // 解密state
        const stateDecode = base64url.decode(state)
        if (stateDecode) {
          this.Host = stateDecode.split('|')[0]
          this.Redirect = stateDecode.split('|')[1]
        }

        const sesstionState = this.$route.query.session_state
        const postContent = `grant_type=authorization_code&code_challenge_method=S256&scope=openid%20offline_access&client_id=${encodeURIComponent(this.clientId)}&code_verifier=${encodeURIComponent(codeVerifier)}&redirect_uri=${encodeURIComponent(window.location.href.split('#')[0] + this.loginCallBack)}&resource=${encodeURIComponent(this.api)}&code=${encodeURIComponent(code)}${sesstionState ? ('&session_state=' + encodeURIComponent(sesstionState)) : ''}`

        this.getCode(oauthServer + '/adfs/oauth2/token', postContent)
      },
      getCode(callbackurl, postContent) {
        this.$http.post(callbackurl, postContent).then(res => {
          this.$auth._storeSSOToken(res)
          localStorage.setItem('id_token', res.data.id_token)
          let getUserInfoUrl = '/api/User/GetUserInfo'
          if (this.type === 'client') {
            getUserInfoUrl = '/api/UserApi/GetUserInfo?webBusinessType=' + this.WebBusinessType
          }
          this.$http.post(getUserInfoUrl).then(res => {
            window.localStorage.removeItem('UPDATE_OAUTH2_CODE_VERIFIER')
            window.localStorage.removeItem('UPDATE_OAUTH2_STATE')
            window.localStorage.removeItem('temp_ie')
            if (window.astec.isNullOrWhiteSpace(res) || window.astec.isNullOrWhiteSpace(res.UserId)) {
              this.$store.commit('UPDATE_AUTH', {})
              this.$auth.logout()// 这里补一个退出登录，不能单纯用下面的清掉登录信息 因为sso那边记录这登录状态 2020-03-06
              throw new Error('登录失败.')
            }
            const user = {
              loginName: res.LoginName,
              userId: res.UserId,
              userName: res.UserName,
              Logo: res.Logo,
              SystemName: res.SystemName,
              nickName: res.NickName,
              departName: res.DeptName,
              departId: res.DepartmentId,
              TradingOrgId: res.TradingOrgId
            }
            // 缓存用户信息
            this.$store.commit('UPDATE_USER', user)
            if (res.DefaultPageHost && res.DefaultPageUrl) {
              window.location.href = res.DefaultPageHost + '#' + res.DefaultPageUrl
            } else {
              this.$router.push({
                path: this.Redirect || '/home'
              })
            }
          })
        })
      }
    }
  }
</script>

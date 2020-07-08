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
      Redirect: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'client'
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(function() {
      if (this.$route.name === 'Login' || this.$route.name === 'Login2') {
        this.Host = window.location.host
        this.Redirect = this.$route.query.redirect
        let redirectToHome = false
        let auth = this.$store.getters.auth
        if (this.$route.params && this.$route.params.status) {
          if (this.$route.params.status == 401) {
            redirectToHome = false
          }
        } else {
          redirectToHome = true
        }

        if (auth && auth.isLoggedIn) { // && user && user.userId
          if (redirectToHome) {
            if (this.type === 'client') {
              this.$router.push({name: 'userDetail'})
            } else {
              this.$router.push({path: '/home'})
            }
          }
        } else {
          this.authorize()
        }
      }
      if (this.$route.name === 'GetCode') {
        this.getCodeCreated()
      }
    })
  },
  methods: {
    authorize() {
      let state = base64url(this.Host + '|' + (this.Redirect || ''))
      let codeVerifier = Crypto.randomBytes(50).toString('hex')
      let codeChallenge = base64url(sha256(codeVerifier))
      let hash = sha256.create()
      hash.update(codeVerifier)
      codeChallenge = hash.array()
      codeChallenge = base64url(codeChallenge)
      this.$store.commit('UPDATE_OAUTH2_CODE_VERIFIER', codeVerifier)
      this.$store.commit('UPDATE_OAUTH2_STATE', state)
      window.sessionStorage.setItem('oauth2_code_verifier', codeVerifier)
      window.sessionStorage.setItem('oauth2_state', state)
      let redirectUri = window.location.origin
      if (
        redirectUri &&
              redirectUri.length &&
              redirectUri.length > 0
      ) {
        if (redirectUri[redirectUri.length - 1] !== '/') {
          redirectUri += '/'
        }
      }
      // let redirectUri = window.location.href.split('#')[0]

      redirectUri += env['sso_logincallback']

      window.location.href = env['sso'] + '/adfs/oauth2/authorize' +
          '?response_type=code' +
          '&client_id=' +
          env['sso_cleint_id'] +
          '&code_challenge=' +
          codeChallenge +
          '&code_challenge_method=S256' +
          '&scope=openid%20offline_access' +
          '&redirect_uri=' +
          encodeURIComponent(redirectUri) +
          '&state=' +
          encodeURIComponent(state)
    },
    getCodeCreated() {
      let oauthServer = env['sso']
      if (!oauthServer) {
        throw new Error('未指定oauth_server.')
      }
      let apiAddress = env['API']
      let callbackurl = oauthServer + '/adfs/oauth2/token'
      let codeVerifier = this.$store.getters.oauth2_code_verifier
      if (!codeVerifier) {
        codeVerifier = window.sessionStorage.getItem('oauth2_code_verifier')
        if (!codeVerifier) {
          throw new Error('未指定oauth2_code_verifier')
        }
      }
      let originState = this.$store.getters.oauth2_state
      if (!originState) {
        originState = window.sessionStorage.getItem('oauth2_state')
        if (!originState) {
          throw new Error('未指定oauth2_state')
        }
      }
      let code = this.$route.query.code
      let state = this.$route.query.state
      let error = this.$route.query.error
      if (error) {
        if (error === 'access_denied') {
          // console.error('拒绝授权')
          this.$router.push({
            path: '/home'
          })
          throw new Error('拒绝授权.')
        } else {
          throw new Error(JSON.stringify(error))
        }
      }
      if (!code) {
        throw new Error('未传入code.')
      }
      if (state && state.length && state.length > 0) {

      } else {
        throw Error('no state returned.')
      }
      if (state !== originState) {
        throw Error('state is not matcch.')
      }
      // 解密state
      let stateDecode = base64url.decode(state)
      if (stateDecode) {
        this.Host = stateDecode.split('|')[0]
        this.Redirect = stateDecode.split('|')[1]
      }
      let sesstionState = this.$route.query.session_state
      let redirectUri = window.location.origin
      if (
        redirectUri &&
              redirectUri.length &&
              redirectUri.length > 0
      ) {
        if (redirectUri[redirectUri.length - 1] !== '/') {
          redirectUri += '/'
        }
      }
      // let redirectUri = window.location.href.split('#')[0]
      redirectUri += env['sso_logincallback']
      let clientId = env['sso_cleint_id']
      let postContent = 'grant_type=authorization_code'
      postContent += '&client_id=' + encodeURIComponent(clientId)
      postContent += '&code_verifier=' + encodeURIComponent(codeVerifier)
      postContent += '&code_challenge_method=S256'
      postContent += '&scope=openid%20offline_access'
      postContent += '&redirect_uri=' + encodeURIComponent(redirectUri)
      if (code) {
        postContent += '&code=' + encodeURIComponent(code)
      }
      if (sesstionState) {
        postContent += '&session_state=' + encodeURIComponent(sesstionState)
      }
      postContent += '&resource=' + encodeURIComponent(apiAddress)
      sessionStorage.setItem('this.type', this.type)
      if (this.type === 'client') {
        this.getCodeClient(callbackurl, postContent)
      } else {
        this.getCodeAdmin(callbackurl, postContent)
      }
    },
    getCodeClient(callbackurl, postContent) {
      let that = this
      that.$api.oauth2Token(postContent).then(token => {
        // 到这里 就取到了token,保存toke
        that._storeSSOToken(token)
        // 先单独存一个，后面退出的时候要用.
        sessionStorage.setItem('id_token', token.data.id_token)
        that.$api.getUserInfo().then(res => {
          if (res === null || res === undefined || (!res.UserId)) {
            that.$store.commit('UPDATE_AUTH', {})
            that.logout() // 这里补一个退出登录，不能单纯用下面的清掉登录信息 因为sso那边记录这登录状态 2020-03-06
            throw new Error('登录失败.')
          }
          let user = {}
          user = res
          that.$store.commit('UPDATE_USER', user)
          if (that.Redirect && that.Redirect !== 'undefined') {
            that.$router.push({
              path: that.Redirect
            })
          } else if (res.MemberType) {
            // 客户端这里判断下跳转到用户中心了
            if (res.State <= 30) {
              this.$router.push({name: 'userUnAuth'})
            } else {
              this.$router.push({name: 'userDetail'})
            }
          } else {
            that.$router.push({
              name: 'contentPC'
            })
          }
        })
      })
    },
    getCodeAdmin(callbackurl, postContent) {
      let that = this
      this.$api.oauth2Token(postContent).then((res) => {
        // 到这里 就取到了token,保存toke
        this._storeSSOToken(res)
        // 先单独存一个，后面退出的时候要用.
        sessionStorage.setItem('id_token', res.data.id_token)
        // 然后获取用户信息
        this.$api.getUserInfo().then(res => {
          if (astec.isNull(res) || astec.isNullOrWhiteSpace(res.UserId)) {
            this.$store.commit('UPDATE_AUTH', {})
            throw new Error('登录失败.')
          }
          let user = {
            loginName: res.LoginName,
            userId: res.UserId,
            userName: res.UserName,
            Logo: res.Logo,
            SystemName: res.SystemName,
            nickName: res.NickName,
            // avatarUrl: res.AvatarUrl,
            departName: res.DeptName,
            departId: res.DepartmentId,
            TradingOrgId: res.TradingOrgId
          }
          // 缓存用户信息
          this.$store.commit('UPDATE_USER', user)
          // 跳转,这里原来有一个跳转到原来目录的 现在应该是空 会跳转到home
          this.$router.push({
            path: that.Redirect || '/home'
          })
        })
      })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>

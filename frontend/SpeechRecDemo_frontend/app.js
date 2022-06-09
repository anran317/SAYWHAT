//app.js

const utils = require('./utils/util.js')

App({
  onLaunch: function () {
    wx.getStorage({
      key: 'history',
      success: (res) => {
          this.globalData.history = res.data
      },
      fail: (res) => {
          console.log("get storage failed")
          console.log(res)
          this.globalData.history = []
      }
    })

  },
  // 权限询问
  getRecordAuth: function() {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                console.log("succ auth")
            }, fail() {
                console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
          console.log("fail")
          console.log(res)
      }
    })
  },
  onLaunch() {
    // 登录
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var jscode = res.code
        // console.log('jscode: ' + jscode)
        wx.request({
          url: that.globalData.api_domain + 'user/getOpenID',
          method: "POST",
          data: {
            jscode: jscode
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            // console.log(res.data)
            if(res.data.code == 0){
              that.globalData.uid = res.data.data.openid // 每个微信用户在该app上对应唯一的openid
            }  
            else{
              that.errorToast(res.data.msg)
            }
            // 回调函数，解决index页面onLoad先于app执行问题
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          },
          fail: res => {
            that.requestFailToast()
          }
        })
      }
    })
  },

  // 成功提示
  successToast(title){
    wx.showToast({
      title: title,
      duration: 1000
    })
  },

  // 错误提示
  errorToast(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  },

  // 网络请求失败的提示
  requestFailToast(){
    this.errorToast('请求失败')
  },

  // 用户ID合法性判定
  isvalidUid(){
    // console.log(this.globalData.uid);
    if(this.globalData.uid == ''){
      this.errorToast('无法获取用户ID')
      return false
    }
    return true
  },

  onHide: function () {
    wx.stopBackgroundAudio()
  },
  globalData: {
    root_domain: 'http://192.168.0.103:8765', // 后端根URL
    api_domain: 'http://192.168.0.103:8765/api/', // 后端API URL
    uid: '' // 用户ID
  }
})
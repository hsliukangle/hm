import updateManager from './common/updateManager';
import { getOpenid } from './services/common/common';
App({
  globalData: {
    openid: '',
    sessionKey: '',
  },
  onLaunch: function () {
    //检查登录是否过期没有过期就取本地存储里面的有就保存，没有就重新登录，过期直接重新登录
    this.checkLogin();
  },
  onShow: function () {
    updateManager();
  },
  //检查登录是否过期
  checkLogin() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: async () => {
          //如果没有openId就登录否则就检查是否登录
          const openid = wx.getStorageSync('openid');
          if (openid) {
            this.globalData.openid = wx.getStorageSync('openid');
            this.globalData.sessionKey = wx.getStorageSync('sessionKey');
            resolve({
              openid: this.globalData.openid,
              sessionKey: this.globalData.sessionKey,
            });
          } else {
            const rs = await this.userLogin();
            resolve(rs);
          }
          console.log('未过期');
        },
        fail: async () => {
          //登录态过期
          const rs = await this.userLogin();
          reject(rs);
          console.log('已过期重新登录');
        },
      });
    });
  },

  userLogin() {
    return new Promise((resolve, reject) => {
      //调用登录接口
      wx.login({
        success: async (res) => {
          if (res.code) {
            //发起网络请求
            const result = await getOpenid(res.code);
            if (result.code === 200 && result.msg === 'success') {
              const { openid, session_key } = result.data;
              this.globalData.openid = openid;
              this.globalData.sessionKey = session_key;
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('sessionKey', session_key);
              resolve({
                openid,
                sessionKey: session_key,
              });
            }
          } else {
            console.log(`登录失败！${res.errMsg}`);
          }
        },
        fail: (ex) => {
          reject(ex);
        },
      });
    });
  },
});

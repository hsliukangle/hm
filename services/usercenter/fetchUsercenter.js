import { config } from '../../config/index';
const { getRequest } = require('../../utils/util');
/** 获取个人中心信息（假） */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  console.log(genUsercenter());
  return;
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息（真） */
function realFetchUserCenter() {
  return new Promise((resolve, reject) => {
    const open_id = wx.getStorageSync('openid');
    if (open_id) {
      getRequest(`/api/me`, { open_id })
        .then((res) => {
          if (res.data.code == '200') {
            wx.setStorageSync('userInfo', res.data.data);
            resolve(res.data.data);
          } else {
            wx.setStorageSync('userInfo', null);
            /*wx.showModal({
            title: '提示',
            confirmText: '前往登录',
            cancelText: '取消',
            content: '你还未登录，是否前往登录'
          })*/
          }
        })
        .catch((err) => {
          reject('获取用户信息错误', err);
        });
    }
  });
}

/** 获取个人中心信息 */
export function fetchUserCenter() {
  if (config.useMock) {
    return mockFetchUserCenter();
  }
  return realFetchUserCenter();
}

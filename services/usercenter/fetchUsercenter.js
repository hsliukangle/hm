import {cdnBase, config} from '../../config/index';

/** 获取个人中心信息（假） */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  console.log(genUsercenter());return;
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息（真） */
function realFetchUserCenter(user_id){
  return new Promise((resolve, reject) => {
    // resolve({
    //   userInfo: {
    //     avatarUrl:
    //       'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
    //     nickName: '微信用户',
    //     phoneNumber: '13438358888',
    //     gender: 2,
    //   },
    //   customerServiceInfo: {
    //     servicePhone: '4006336868',
    //     serviceTimeDuration: '每周三至周五 9:00-12:00  13:00-15:00',
    //   }
    // })
    const {
      getRequest
    } = require('../../utils/util');
    return new Promise((resolve, reject) => {
      getRequest("/api/user_info",{user_id}).then(res => {
        if(res.data.code == '200'){
          wx.setStorageSync('user_info', res.data.data)
        }else{
          wx.setStorageSync('user_info', null)
          wx.showModal({
            title: '提示',
            confirmText: '前往登录',
            cancelText: '取消',
            content: '你还未登录，是否前往登录'
          })
        }
      }).catch(err => {
        reject('获取用户信息错误', err);
      });
    });
  })
}

/** 获取个人中心信息 */
export function fetchUserCenter(user_id) {
  if (config.useMock) {
    return mockFetchUserCenter();
  }
  return realFetchUserCenter(user_id);
}

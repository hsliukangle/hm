const { getRequest } = require('../../utils/util');
/** 获取openid */
export function getOpenid(code) {
  return new Promise((resolve, reject) => {
    getRequest(`/api/openid?code=${code}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject('获取openid错误', err);
      });
  });
}

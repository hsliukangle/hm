const { postRequest } = require('../../utils/util');
export const orderCancel = (order_no) => {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    return postRequest('/api/order_cancel', {
      member_id: userInfo.id,
      order_no
    });
  }
};

const { postRequest } = require('../../utils/util');

//绑定公司，工号
export const bindGroup = async (params) => {
  const res = await postRequest(`/api/bind_group`, params);
  if (res.data) {
    return res.data;
  }
};

//绑定邀请码
export const bindInviteCode = async (invite_code = '') => {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    const res = await postRequest(`/api/bind_invite_code`, {
      member_id: userInfo.id,
      invite_code
    });
    return res.data;
  }
};

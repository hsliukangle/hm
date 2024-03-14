import { bindInviteCode } from '../../../services/usercenter/usercenter';
import Message from 'tdesign-miniprogram/message/index';
import Toast from 'tdesign-miniprogram/toast/index';
Page({
  data: {
    codeValue: ''
  },
  onLoad() {
    /*const { name } = options;
    this.setData({
      nameValue: name
    });*/
  },
  onSubmit() {
    const that = this;
    if (this.data.codeValue) {
      bindInviteCode(this.data.codeValue).then((res) => {
        if (res.code === 200) {
          console.log(res.data);
          wx.setStorageSync('userInfo', res.data);
          Toast({
            context: that,
            selector: '#t-toast',
            message: '保存成功',
            theme: 'success',
            direction: 'column'
          });
          setTimeout(() => {
            wx.navigateBack({ backRefresh: true });
          }, 2000);
        } else {
          Message.error({
            context: that,
            offset: [20, 32],
            duration: 2000,
            content: res.msg
          });
        }
      });
    }
  },
  clearContent() {
    this.setData({
      nameValue: ''
    });
  }
});

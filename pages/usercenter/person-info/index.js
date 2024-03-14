//import Message from 'tdesign-miniprogram/message/index';
import Toast from 'tdesign-miniprogram/toast/index';
import Message from 'tdesign-miniprogram/message/index';
import { bindGroup } from '../../../services/usercenter/usercenter';
import {fetchUserCenter} from "../../../services/usercenter/fetchUsercenter";
Page({
  data: {
    personInfo: {},
    nickname: '',
    group_name: '',
    job_num: '',
    member_id: '',
    invite_code: '',
    showUnbindConfirm: false,
    pickerOptions: [
      {
        name: '男',
        code: '1'
      },
      {
        name: '女',
        code: '2'
      }
    ],
    typeVisible: false,
    genderMap: ['', '男', '女']
  },
  async onLoad() {
    await fetchUserCenter()
    this.init()
  },
  onShow(){
    this.init()
  },
  init() {
    const personInfo = wx.getStorageSync('userInfo');
    if (personInfo) {
      this.setData({
        personInfo,
        group_name:personInfo.status===20?"审核中": personInfo.group_name,
        job_num:personInfo.status===20?"审核中": personInfo.job_num,
        member_id: personInfo.id,
        nickname: personInfo.nickname,
        invite_code: personInfo.invite_code
      });
    }
  },
  /* fetchData() {
    fetchPerson().then((personInfo) => {
      this.setData({
        personInfo,
        'personInfo.phoneNumber': personInfo.phoneNumber ? phoneEncryption(personInfo.phoneNumber) : ''
      });
    });
  },*/
  onSubmit() {
    const that = this;
    const { group_name = '', job_num = '', member_id } = this.data;
    if(group_name){
      bindGroup({ group_name, job_num, member_id }).then((res) => {
        if (res.code === 200) {
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
        }
      });
    }else{
      Message.warning({
        context: that,
        offset: [20, 32],
        duration: 2000,
        content: "公司名称不能为空！"
      });
    }

    /*if(group_name){
      if(job_num){

      }else{
        Message.warning({
          context: this,
          offset: [20, 32],
          duration: 1500,
          content: '公司名称不能为空'
        });
      }

    }else{
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 5000,
        content: '这是一条需要用户关注到的警示通知'
      });
    }*/
  },

  onClickCell() {
    if(this.data.personInfo.status===20){
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 5000,
        content: '审核中不能绑定新的邀请码！'
      });
    }else if(this.data.personInfo.status===30){
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 5000,
        content: '已绑定公司不能绑定新的邀请码！'
      });;
    }else if(!this.data.invite_code){
      wx.navigateTo({
        url: `/pages/usercenter/code-edit/index`
      });
    }

  },
  onClose() {
    this.setData({
      typeVisible: false
    });
  },
  onConfirm(e) {
    const { value } = e.detail;
    this.setData(
      {
        typeVisible: false,
        'personInfo.gender': value
      },
      () => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置成功',
          theme: 'success'
        });
      }
    );
  },
  async toModifyAvatar() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const { path, size } = res.tempFiles[0];
            if (size <= 10485760) {
              resolve(path);
            } else {
              reject({ errMsg: '图片大小超出限制，请重新上传' });
            }
          },
          fail: (err) => reject(err)
        });
      });
      const tempUrlArr = tempFilePath.split('/');
      const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFileName}`,
        theme: 'success'
      });
    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel') return;
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error'
      });
    }
  }
});

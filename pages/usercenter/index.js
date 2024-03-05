import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';
/*import {fetchOrders} from "../../services/order/orderList";*/

const menuData = [
  [
    // {
    //   title: '收货地址',
    //   tit: '',
    //   url: '',
    //   type: 'address',
    // },
    // {
    //   title: '优惠券',
    //   tit: '',
    //   url: '',
    //   type: 'coupon',
    // },
    // {
    //   title: '积分',
    //   tit: '',
    //   url: '',
    //   type: 'point',
    // },
  ],
  [
    {
      title: '帮助中心',
      tit: '',
      url: '',
      type: 'help-center'
    },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service'
    }
  ]
];

const orderTagInfos = [
  {
    title: '待支付',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 10,
    status: 10
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 50,
    status: 50
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 60
  }
];

Page({
  data: {
    showMakePhone: false,
    userInfo: {},
    menuData,
    orderTagInfos,
    customerServiceInfo: {},
    currAuthStep: 1,
    showKefu: true,
    versionNo: ''
  },

  onLoad() {
    this.getVersionInfo();
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        currAuthStep: 2
      });
      /*this.getMyOrder({
        member_id:userInfo.id,
        status:-1
      })*/
    }
  },

  onShow() {
    this.getTabBar().init();
    /*this.init();*/
  },

  /*  getMyOrder: async (params)=>{
    const res=await fetchOrders(params);
    console.log(res)
  },*/
  /* onPullDownRefresh() {
      this.init();
    },

    init() {
      this.fetUseriInfoHandle();
    },*/

  fetUseriInfoHandle() {
    wx.showModal({
      title: '温馨提示',
      content: '正在请求您的个人信息',
      success: async (res) => {
        if (res.confirm) {
          const userInfo = await fetchUserCenter();
          if (userInfo) {
            console.log(userInfo);
            this.setData({
              userInfo,
              //menuData,
              // orderTagInfos: info,
              //customerServiceInfo,
              currAuthStep: 2
            });
            wx.stopPullDownRefresh();
          }
        } else if (res.cancel) {
          //拒绝授权 showErrorModal是自定义的提示
        }
      }
    });
    /*let user_id = wx.getStorageSync('user_id')
        fetchUserCenter(user_id).then(
          ({
            userInfo,
            // countsData,
            // orderTagInfos: orderInfo,
            customerServiceInfo,
          }) => {
            // eslint-disable-next-line no-unused-expressions
            // menuData?.[0].forEach((v) => {
            //   countsData.forEach((counts) => {
            //     if (counts.type === v.type) {
            //       // eslint-disable-next-line no-param-reassign
            //       v.tit = counts.num;
            //     }
            //   });
            // });
            // const info = orderTagInfos.map((v, index) => ({
            //   ...v,
            //   ...orderInfo[index],
            // }));
            this.setData({
              userInfo,
              menuData,
              // orderTagInfos: info,
              customerServiceInfo,
              currAuthStep: 2,
            });
            wx.stopPullDownRefresh();
          },
        );*/
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({
          url: '/pages/usercenter/address/list/index'
        });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({
          url: '/pages/coupon/coupon-list/index'
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;
    console.log(status);
    if (status === 0) {
      wx.navigateTo({
        url: '/pages/order/after-service-list/index'
      });
    } else {
      wx.navigateTo({
        url: `/pages/order/order-list/index?status=${status}`
      });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({
      url: '/pages/order/order-list/index'
    });
  },

  openMakePhone() {
    this.setData({
      showMakePhone: true
    });
  },

  closeMakePhone() {
    this.setData({
      showMakePhone: false
    });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone
    });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({
        url: '/pages/usercenter/person-info/index'
      });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion
    });
  }
});

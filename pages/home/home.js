import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },
    goodListPagination: {
      index: 0,
      num: 20,
      total: 0
    }
  },

  privateData: {
    tabIndex: 1
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true
    });
    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail.value + 1;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    this.setData({
      goodsListLoadStatus: 1
    });
    const pageSize = this.data.goodListPagination.num;
    let pageIndex = this.data.goodListPagination.index + 1;
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0
      });
      pageIndex = 1;
    } else {
      if (
        this.data.goodListPagination.index != 0 &&
        this.data.goodListPagination.num * this.data.goodListPagination.index >= this.data.goodListPagination.total
      ) {
        this.setData({
          goodsListLoadStatus: 2
        });
        return false;
      }
    }

    try {
      const cate = this.privateData.tabIndex;
      const nextList = await fetchGoodsList(cate, pageIndex, pageSize);
      const goodListPagination = {
        total: nextList.total,
        index: pageIndex,
        num: pageSize
      };
      this.setData({
        goodsList: fresh ? nextList.data : this.data.goodsList.concat(nextList.data),
        goodsListLoadStatus: 0,
        goodListPagination: goodListPagination
      });
    } catch (err) {
      this.setData({
        goodsListLoadStatus: 3
      });
    }
  },

  goodListClickHandle(e) {
    const { id } = e.detail.goods;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuid=${id}`
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车'
    });
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`
    });
  }
});

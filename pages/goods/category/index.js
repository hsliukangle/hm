import {
  getCategoryList
} from '../../../services/good/fetchCategoryList';
Page({
  data: {
    list: [],
  },
  async init() {
    try {
      const result = await getCategoryList();
      this.setData({
        list: result,
      });
    } catch (error) {
      console.error('err:', error);
    }
  },

  onShow() {
    this.getTabBar().init();
  },
  onChange(e) {
    let cate = e.detail.item.id;
    wx.navigateTo({
      url: '/pages/goods/list/index?shop=' + cate,
    });
  },
  onLoad() {
    this.init(true);
  },
});
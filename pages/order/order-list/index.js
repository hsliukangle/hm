import { OrderStatus } from '../config';
import { fetchOrders, fetchOrdersCount } from '../../../services/order/orderList';
import { cosThumb } from '../../../utils/util';

Page({
  page: {
    size: 5,
    num: 1
  },

  data: {
    tabs: [
      {
        key: -1,
        text: '全部'
      },
      {
        key: OrderStatus.PENDING_PAYMENT,
        text: '待支付',
        info: ''
      },
      {
        key: OrderStatus.PENDING_USE,
        text: '待使用',
        info: ''
      },
      {
        key: OrderStatus.COMPLETE,
        text: '已完成',
        info: ''
      }
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    emptyImg: 'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png',
    backRefresh: false,
    status: -1
  },

  onLoad(query) {
    let status = parseInt(query.status);
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    // this.getTabBar().init();
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({
      backRefresh: false
    });
  },

  onReachBottom() {
    /*if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }*/
  },

  onPageScroll(e) {
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },
  onPullDownRefresh_() {
    //const { callback } = e.detail;
    this.setData({
      pullDownRefreshing: true
    });
    this.refreshList(this.data.curTab)
      .then(() => {
        this.setData({
          pullDownRefreshing: false
        });
        //callback && callback();
      })
      .catch((err) => {
        this.setData({
          pullDownRefreshing: false
        });
        Promise.reject(err);
      });
  },

  init(status) {
    status = status !== undefined ? status : this.data.curTab;
    this.setData({
      status
    });
    this.refreshList(status);
  },

  getOrderList(statusCode = -1, reset = false) {
    /* const params = {
      parameter: {
        pageSize: this.page.size,
        pageNum: this.page.num,
        orderStatus: statusCode
      }
    };*/
    this.setData({
      listLoading: 1
    });
    return fetchOrders(statusCode)
      .then((res) => {
        this.page.num++;
        let orderList = [];
        if (res && res.data && res.data) {
          orderList = (res.data || []).map((order) => {
            return {
              id: order.id,
              orderNo: order.order_no,
              parentOrderNo: order.order_no,
              status: order.status,
              statusDesc: order.status_name,
              amount: order.price_cent,
              totalAmount: order.price_cent,
              createTime: order.created_at,
              goodsList: (order.related_service || []).map((goods) => ({
                id: goods.id,
                thumb: cosThumb(goods.main_image, 70),
                title: goods.name,
                price: goods.current_price_cent
              })),
              buttons: order.button || []
            };
          });
        }
        return new Promise((resolve) => {
          if (reset) {
            this.setData(
              {
                orderList: []
              },
              () => resolve()
            );
          } else resolve();
        }).then(() => {
          this.setData({
            orderList: this.data.orderList.concat(orderList),
            listLoading: orderList.length > 0 ? 0 : 2
          });
        });
      })
      .catch((err) => {
        this.setData({
          listLoading: 3
        });
        return Promise.reject(err);
      });
  },

  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const { value } = e.detail;
    this.setData({
      status: value
    });
    this.refreshList(value);
  },

  getOrdersCount() {
    return fetchOrdersCount().then((res) => {
      const tabsCount = res.data || [];
      const { tabs } = this.data;
      tabs.forEach((tab) => {
        const tabCount = tabsCount.find((c) => c.tabType === tab.key);
        if (tabCount) {
          tab.info = tabCount.orderNum;
        }
      });
      this.setData({
        tabs
      });
    });
  },
  refreshList(status = -1) {
    this.page = {
      size: this.page.size,
      num: 1
    };
    this.setData({
      curTab: status,
      orderList: []
    });

    return Promise.all([this.getOrderList(status, true), this.getOrdersCount()]);
  },

  onRefresh() {
    this.refreshList(this.data.curTab);
  },

  onOrderCardTap(e) {
    const { order } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/order-detail/index?orderNo=${order.orderNo}`
    });
  }
});

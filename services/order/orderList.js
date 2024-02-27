import { config } from '../../config/index';
const { postRequest } = require('../../utils/util');
/** 获取订单列表数据（假） */
function mockFetchOrders(params) {
  const { delay } = require('../_utils/delay');
  const { genOrders } = require('../../model/order/orderList');
  return delay(200).then(() => genOrders(params));
}

/** 获取订单列表数据（真） */
function realFetchOrders(status) {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    return new Promise((resolve, reject) => {
      postRequest(`/api/order_list`, { member_id: userInfo.id, status: status })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject('获取分类错误', err);
        });
    });
  }
}

/** 获取订单列表数据 */
export function fetchOrders(status) {
  if (config.useMock) {
    return mockFetchOrders(status);
  }
  return realFetchOrders(status);
}

/** 获取订单列表mock数据 */
function mockFetchOrdersCount(params) {
  const { delay } = require('../_utils/delay');
  const { genOrdersCount } = require('../../model/order/orderList');

  return delay().then(() => genOrdersCount(params));
}

/** 获取订单列表统计 */
export function fetchOrdersCount(params) {
  if (config.useMock) {
    return mockFetchOrdersCount(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

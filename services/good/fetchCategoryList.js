import {
  config
} from '../../config/index';

/** 获取商品列表（假） */
function mockFetchGoodCategory() {
  const {
    delay
  } = require('../_utils/delay');
  const {
    getCategoryList
  } = require('../../model/category');
  return delay().then(() => getCategoryList());
}

/** 获取商品列表（真） */
function realFetchGoodCategory() {
  const {
    getRequest
  } = require('../../utils/util');
  return new Promise((resolve, reject) => {
    getRequest("/api/shop_cate").then(res => {
      resolve(res.data.data);
    }).catch(err => {
      reject('获取分类错误', err);
    });
  });
}

/** 获取商品列表 */
export function getCategoryList() {
  if (config.useMock) {
    return mockFetchGoodCategory();
  }
  return realFetchGoodCategory();
}
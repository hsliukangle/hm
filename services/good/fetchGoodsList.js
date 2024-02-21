/* eslint-disable no-param-reassign */
import {
  config
} from '../../config/index';

/** 获取商品列表（假） */
function mockFetchGoodsList(params) {
  const {
    delay
  } = require('../_utils/delay');
  const {
    getSearchResult
  } = require('../../model/search');

  const data = getSearchResult(params);
  console.trace(data)

  if (data.spuList.length) {
    data.spuList.forEach((item) => {
      item.spuId = item.spuId;
      item.thumb = item.primaryImage;
      item.title = item.title;
      item.price = item.minSalePrice;
      item.originPrice = item.maxLinePrice;
      item.desc = '';
      // if (item.spuTagList) {
      //   item.tags = item.spuTagList.map((tag) => tag.title);
      // } else {
      //   item.tags = [];
      // }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 获取商品列表（真） */
function realFetchGoodsList(params) {
  const {
    getRequest
  } = require('../../utils/util');
  return new Promise((resolve, reject) => {
    getRequest("/api/shop_services/" + params.shop).then(res => {
      resolve({
        pageNum: 1,
        pageSize: 30,
        totalCount: 1,
        spuList: res.data.data.data
      });
    }).catch(err => {
      reject('获取服务错误', err);
    });
  });
}

/** 获取商品列表 */
export function fetchGoodsList(params) {
  if (config.useMock) {
    return mockFetchGoodsList(params);
  }
  return realFetchGoodsList(params);
}
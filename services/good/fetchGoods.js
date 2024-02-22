import { config } from '../../config/index';

/** 获取商品列表（假） */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表（真） */
function realFetchGoodsList(cate = 0, pageIndex = 1, pageSize = 20) {
  const { getRequest } = require('../../utils/util');
  return new Promise((resolve, reject) => {
    getRequest(`/api/star_services/${cate}?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then((res) => {
        resolve(res.data.data.related_service);
      })
      .catch((err) => {
        reject('获取服务错误', err);
      });
  });
}

/** 获取商品列表 */
export function fetchGoodsList(cate = 0, pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchGoodsList(cate, pageIndex, pageSize);
  }
  return realFetchGoodsList(cate, pageIndex, pageSize);
}

import {
  config
} from '../../config/index';

/** 获取商品列表（假） */
function mockFetchGood(ID = 0) {
  const {
    delay
  } = require('../_utils/delay');
  const {
    genGood
  } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品列表（真） */
function realFetchGood(ID = 0){
  return new Promise((resolve, reject) => {
    resolve({
      'desc':  ["https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09c.png", "https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09d.png"],
      'etitle': "",
      'images':  ["https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png", "https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png"],
      'isPutOnSale': 1,
      'limitInfo': [], 
      'maxLinePrice': 40000,
      'maxSalePrice': 29800,
      'minLinePrice': 29800,
      'minSalePrice': 29800,
      'primaryImage': "https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png",
      'skuList': [],
      'soldNum': 1020,
      'specList': [],
      'spuId': "0",
      'spuStockQuantity': 510,
      'spuTagList': [],
      'storeId': "1000",
      'title': "白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙"
    });
  });
}

/** 获取商品列表 */
export function fetchGood(ID = 0) {
  if (config.useMock) {
    return mockFetchGood(ID);
  }
  return realFetchGood(ID);
}
import {
  config
} from '../../config/index';
const { getRequest } = require('../../utils/util');
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
const realFetchGood=async (ID = 0)=>{
  const res=await getRequest(`/api/service/${ID}`)
  if(res.data){
    return res.data
  }
}

/** 获取商品列表 */
export function fetchGood(ID = 0) {
  if (config.useMock) {
    return mockFetchGood(ID);
  }
  return realFetchGood(ID);
}
const { getRequest } = require('../../utils/util');
/** 获取openid */
export async function  getOpenid(code) {

  const res=await getRequest(`/api/openid`,{code})
  if(res.data){
    return res.data
  }
}

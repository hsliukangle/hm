import {
  config,
  cdnBase
} from '../../config/index';


/** 获取首页数据（假） */
function mockFetchHome() {
  const {
    delay
  } = require('../_utils/delay');
  const {
    genSwiperImageList
  } = require('../../model/swiper');

  return delay().then(() => {
    return {
      swiper: genSwiperImageList(),
      tabList: [{
          name: '健身·运动',
          id: 0,
        },
        {
          name: '儿童运动',
          id: 1,
        },
        {
          name: '按摩·足疗',
          id: 2,
        },
        {
          name: '美容·美发·足疗',
          id: 3,
        },
        {
          name: '牙科·眼科',
          id: 4,
        }
      ],
      activityImg: `${cdnBase}/activity/banner.png`,
    };
  });
}

/** 获取首页数据（真） */
function realFetchHome() {
  const {
    getRequest
  } = require('../../utils/util');
  const {
    genSwiperImageList
  } = require('../../model/swiper');
  return new Promise((resolve, reject) => {
    getRequest("/api/star_services_category/1").then(res => {
      resolve({
        swiper: genSwiperImageList(),
        tabList: res.data.data,
        activityImg: `${cdnBase}/activity/banner.png`,
      });
    }).catch(err => {
      reject('获取分类错误', err);
    });
  });
}

/** 获取首页数据 */
export function fetchHome() {
  if (config.useMock) {
    return mockFetchHome();
  }
  return realFetchHome();
}
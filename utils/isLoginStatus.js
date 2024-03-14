import Message from 'tdesign-miniprogram/message/index';
export function isLoginStatus(page){
  const personInfo = wx.getStorageSync('userInfo');
  if (personInfo) {
    return true
  }
  Message.warning({
    context: this,
    offset: [20, 32],
    duration: 2000,
    content: "您还没有登录，请先登录！"
  });
  if(getCurrentPageUrl(page)!=="pages/usercenter/index"){
    setTimeout(()=>{
      wx.switchTab({
        url:"/pages/usercenter/index"
      })
    },2000)
  }
}

function getCurrentPageUrl(pages){  //此方法不带参数
  const currentPage = pages[pages.length-1]    //获取当前页面的对象
  return currentPage.route
}

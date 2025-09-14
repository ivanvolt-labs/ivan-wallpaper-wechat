// pages/privacy/privacy.ts
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图标路径配置
    icons: {
      linkRemake: app.globalData.baseIconPath + 'link_remake_icon.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  // 分享给好友或群 
  onShareAppMessage() {
    return {
      title: app.globalData.shareTitle,
      imageUrl: `${app.globalData.baseURL}/files/icon/link_remake_icon.png`,
      path: '/pages/home/home'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: app.globalData.shareTitle,
      imageUrl: `${app.globalData.baseURL}/files/icon/link_remake_icon.png`,
      path: '/pages/home/home'
    };
  }
})
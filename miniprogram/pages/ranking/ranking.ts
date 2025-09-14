var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {'name': '日榜', 'value': 0},
      {'name': '月榜', 'value': 1},
      {'name': '年榜', 'value': 2},
      {'name': '总榜', 'value': 3},
    ],
    images: [] as any[],
    currentTab: 0,
    sleft: 0,
    autoplay: false,
    loaded: false,
    lueAvatar: app.globalData.baseIconPath + 'lue_avatar_icon.png',
    // 图标路径配置
    icons: {
      rank1: app.globalData.baseIconPath + '1.png',
      rank2: app.globalData.baseIconPath + '2.png',
      rank3: app.globalData.baseIconPath + '3.png',
      more: app.globalData.baseIconPath + 'more.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad() {
  //   this.selectRankList()
  // },

  onShow(){
    //弹框
    this.setData({
      loaded: true
    })

    this.selectRankList()
  },

  // 处理菜单切换
  handleTabChange(e:any) {
    // 从 data-current 获取当前点击的 tab index
    let { current } = e.currentTarget.dataset;
    
    // 防止 undefined 错误和重复点击
    if (this.data.currentTab === current || current === undefined) return;

    // 设置当前 tab 背景图平滑移动逻辑
    this.setData({
      currentTab: current,
    });
  },

  // 处理 swiper 滑动切换
  handleSwiperChange: function (e:any) {
    const current = e.detail.current
    this.setData({
      currentTab: current
    });
  },

  // 排行榜数据
  selectRankList: function(){
    wx.request({
      url: `${app.globalData.baseURL}/manager/api/wallpapers/ranking`,
      method: 'POST',
      data: {
        num: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        // console.log('data: ' + JSON.stringify(data));

        if (res.statusCode === 200) {
          let allRankImages = data.data || [];

          // 遍历每个 rankItem
          allRankImages = allRankImages.map((rankItem: any) => {
            // 构造全路径
            rankItem = app.generateFullFilePaths(rankItem);

            // 遍历 rankItem 数组中的每一个对象
            // if (Array.isArray(rankItem) && rankItem.length) {
            //   rankItem.forEach(item => {
            //     item.avatarList = item.avatarList || [];

            //     if (item.avatarList.length < item.downloading) {
            //       item.avatarList.push(this.data.lueAvatar);
            //     }
            //   });
            // }

          return rankItem;
        });

          // console.log('allRankImages: ' + JSON.stringify(allRankImages));
          
          this.setData({
            images: allRankImages
          })
        } else {
          console.error('Failed to fetch data:', res);
        }
        wx.hideLoading();
      },
      fail: err => {
        console.error('Request failed:', err);
        wx.hideLoading();
      },
      complete: () => {
        // 关闭底部加载提示
        this.setData({
          isLoading: false
        });
      }
    });
  },

  //预览图片(可切换模式)
  previewImageHandler: function(e:any) {
    const currentIndex = e.currentTarget.dataset.index;
    const images = e.currentTarget.dataset.images;
  
    wx.navigateTo({
      url: `/pages/preview_images/preview_images?currentIndex=${currentIndex}&images=${JSON.stringify(images)}&isDownload=0`
    });
  },

  // 分享给好友或群
  onShareAppMessage() {
    return {
      title: '青柠客壁纸', // 分享标题
      path: '/pages/home/home'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '青柠客壁纸', // 分享标题
      path: '/pages/home/home'
    }
  }
})
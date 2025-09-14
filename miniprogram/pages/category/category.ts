var app = getApp()

Page({
  data: {
    // 图标路径配置
    icons: {
      search: app.globalData.baseIconPath + 'search_icon.png',
      clear: app.globalData.baseIconPath + 'clear_icon.png'
    },
    categories: [
      {
        'value': '手机壁纸', 
        'englishName': 'Mobile Wallpaper',
        'background': app.globalData.baseBackgroudPath + 'category_backgroud_1.jpg'
      },
      {
        'value': '电脑平板', 
        'englishName': 'Tablet Computer',
        'background': app.globalData.baseBackgroudPath + 'category_backgroud_2.jpg'
      },
      {
        'value': '头像', 
        'englishName': 'Avatar',
        'background': app.globalData.baseBackgroudPath + 'category_backgroud_3.jpg'
      },
      {
        'value': '创意摄影', 
        'englishName': 'Creative Photography',
        'background': app.globalData.baseBackgroudPath + 'category_backgroud_4.jpg'
      }
    ],
    colors: [
      [
        {'color': '#fd042f', 'value': '红'},
        {'color': '#f7e709', 'value': '黄'},
        {'color': '#f142c4', 'value': '粉'}
      ],
      [
        {'color': '#00c1ff', 'value': '蓝'},
        {'color': '#19B01D', 'value': '绿'},
        {'color': '#6B22AF', 'value': '紫'}
      ],
      [
        {'color': '#000000', 'value': '黑'},
        {'color': '#ffffff', 'value': '白'},
        {'color': '#817e84', 'value': '灰'}
      ]
    ],
    tags: [
      {
        'name': '自然风光',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '31134303711b4039b02d3c3de792f125.jpg', 
        'value': '风景'
      },
      {
        'name': '简约时尚',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + 'e53969f578b3477e99ac14b244e8330b.jpg', 
        'value': '极简'
      },
      {
        'name': '视觉震撼',
        'background': app.globalData.baseImagePath + '654d222bd2ef626653bf3e575b0e8ef5.jpg', 
        'value': '视觉'
      },
      {
        'name': '唯美插画',
        'background': app.globalData.baseImagePath + '654d222bd2ef626653bf3e575b0e8ef4.jpg', 
        'value': '插画'
      },
      {
        'name': '原生经典',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '779fa6d8ccf24e26a875b2ffd2465f76.jpg', 
        'value': '原生'
      },
      {
        'name': '抽象轮廓',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '2583ccf0c0124e939e58d880071cfdd5.jpg', 
        'value': '抽象'
      },
      {
        'name': '丽人佳影',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '7269ec72806f4895894a947be3bbfd84.jpg', 
        'value': '美女'
      },
      {
        'name': '次元动漫',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '9c1ff791009940e3af00601e69a80dc1.jpg', 
        'value': '卡通'
      },
      
      {
        'name': '创意灵感',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + '45928cf330c54cf4850e91d1e46f0fd4.jpg', 
        'value': '创意'
      },
      {
        'name': '城市光影',
        'background': app.globalData.baseImagePath + app.globalData.thumbnailType + 'fb9e71db69ed4bcf9210466c69df8c20.jpg', 
        'value': '城市'
      }
    ]
  },

  onLoad() {
    
  },

  // 搜索
  search: function(){
    wx.navigateTo({
      url: '/search_pages/search/search'
    });
  },

  // 携带类型请求图片列表
  fetchTypeRequest(e:any) {
    const type = e.currentTarget.dataset.type;
    
    wx.navigateTo({
      url: `/search_pages/images/images?type=${encodeURIComponent(type)}`
    });
  },

  // 携带颜色请求图片列表
  fetchColorRequest(e:any) {
    const color = e.currentTarget.dataset.color;
    
    wx.navigateTo({
      url: `/search_pages/images/images?color=${encodeURIComponent(color)}`
    });
  },

  // 携带标签请求图片列表 
  fetchTagRequest(e:any) {
    const tag = e.currentTarget.dataset.tag;
    
    wx.navigateTo({
      url: `/search_pages/images/images?tags=${encodeURIComponent(tag)}`
    });
  },

  // 分享给好友或群
  onShareAppMessage() {
    const swiperImages = wx.getStorageSync('swiperImages')
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)];

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const swiperImages = wx.getStorageSync('swiperImages')
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)];

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    };
  }

});
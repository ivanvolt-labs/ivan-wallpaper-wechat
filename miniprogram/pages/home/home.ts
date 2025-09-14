// 定义全局对象
var app = getApp();

// 初始化为 null，并声明类型
let throttleTimer: number | null = null;

// 防抖函数定义
function throttle(this: any, fn: Function, delay: number) {
  let lastCall = 0; // 记录上次调用的时间
  return (...args: any[]) => {
    const now = Date.now(); // 当前时间
    if (now - lastCall >= delay) { // 检查是否已超时
      fn.apply(this, args);  // 调用目标函数
      lastCall = now; // 更新调用时间
    }
  };
}

Page({
  data: {
    selectFlag: 2,// 综合查询(1=推荐, 2=最新, 3=最热)
    pageImages: [] as any[],
    phoneImages: [] as any[],
    swiperImages: [] as any[],
    scrollAvatars: [] as any[],
    autoplay: false,
    page: 1,
    limit: 12,
    showTopImage: true,
    showTopTitle: false,
    showImageBottom: true,
    scrollTop: 0,
    isLoading: false,
    noMoreData: false,
    timeout: 500,
    currentIndex: 0,
    leadShow: true,
    countdown: 8,
    hasInit: false,
    // 图标路径配置
    icons: {
      search: app.globalData.baseIconPath + 'search_icon.png',
      topClose: app.globalData.baseIconPath + 'top_close_icon.png',
      imageDownload: app.globalData.baseIconPath + 'image_download_icon.png',
      imageCollect: app.globalData.baseIconPath + 'image_collect_icon.png'
    },
    // 背景图片路径
    headersBgImage: app.globalData.baseImagePath + 'thumbnail_19217602328b49debfdc60b00f4299b8.jpg'
  },

  onLoad() {
    // 请求聚合数据
    this.fetchIndex()

    // 倒计时引导栏
    this.startCountdown()
  },
  
  // 引导栏
  startCountdown(){
    // 设置倒计时，每秒更新一次
    const interval = setInterval(() => {
      let newCountdown = this.data.countdown - 1;
      this.setData({
        countdown: newCountdown
      });

      // 倒计时结束，隐藏引导栏，并清除定时器
      if (newCountdown <= 0) {
        clearInterval(interval);
        this.setData({
          leadShow: false
        });
      }
    }, 1000); // 每 1 秒执行一次
  },

  // 关闭引导框
  closeLead(){
    this.setData({
      leadShow: false
    })
  },

  // 切换轮播图
  onSwiperChange: function(e: any) {
    let {current, source} = e.detail
    if (source === 'autoplay' || source === 'touch') {
      this.setData({
        currentIndex: current
      })
    }
  },

  // 上拉加载
  onReachBottom: function() {
    if (!this.data.noMoreData) {
      this.setData({
        isLoading: true, 
        noMoreData: false
      });
      
      //加载更多，这里做下延时加载
      setTimeout(() => {
        this.selectWallpaperPage(this.data.selectFlag);
      }, this.data.timeout)
    }
  },

  // 聚合数据
  fetchIndex: function(){
    const phoneImages = wx.getStorageSync('phoneImages')
    const swiperImages = wx.getStorageSync('swiperImages')
    const scrollAvatars = wx.getStorageSync('scrollAvatars')
    if(phoneImages && swiperImages && scrollAvatars){
      this.setData({
        phoneImages: phoneImages,
        swiperImages: swiperImages,
        scrollAvatars: scrollAvatars
      });
    } else {
      wx.request({
        url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/index`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          const data = res.data as Record<string, any>;
          var phoneImages = data.data.phoneImages
          var swiperImages = data.data.swiperImages
          var scrollAvatars = data.data.scrollAvatars
  
          // 构造图片全地址
          phoneImages = app.generateFullFilePaths(phoneImages);
          swiperImages = app.generateFullFilePaths(swiperImages);
          scrollAvatars = app.generateFullFilePaths(scrollAvatars);
  
          //缓存数据
          wx.setStorageSync('phoneImages', phoneImages)
          wx.setStorageSync('swiperImages', swiperImages)
          wx.setStorageSync('scrollAvatars', scrollAvatars)
  
          if (res.statusCode === 200) {
            this.setData({
              phoneImages: phoneImages,
              swiperImages: swiperImages,
              scrollAvatars: scrollAvatars
            });
          } else {
            console.error('Failed to fetch data:', res);
          }
        },
        fail: err => {
          console.error('Request failed:', err);
        }
      });
    }
  },

  // 分页数据(热门)
  selectWallpaperPage: function(selectFlag: number) {
    let that = this
    let page = that.data.page

    // 初次加载
    if (page == 1) {
      this.setData({
        isLoading: true, 
        noMoreData: false
      })
    }    

    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/page`,
      method: 'POST',
      data: {
        page: page,
        limit: this.data.limit,
        selectFlag: selectFlag,
        type: '手机壁纸'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        // console.log('json: ' + JSON.stringify(data));
        
        if (data.code === 0) {
          if(data.data.records.length === 0){
            that.setData({
              isLoading: false, 
              noMoreData: true
            });
          } else {
            page++

            // 构造全路径
            var pageImages = data.data.records
            pageImages = app.generateFullFilePaths(pageImages);

            // 追加数据
            pageImages = that.data.pageImages.concat(pageImages)

            this.setData({
              pageImages: pageImages,
              page: page,
              noMoreData: false
            });

            if (data.data.records.length < that.data.limit) {
              that.setData({
                isLoading: false,
                noMoreData: true
              });
            }
          }
        }
      },
      fail() {
        that.setData({
          isLoading: false,
          noMoreData: false
        });
      }
    });
  },

  // 搜索 
  search: function(){
    wx.navigateTo({
      url: '/search_pages/search/search'
    });
  },

  // 跳转推荐图片
  goImagesForFlag: function(){
    wx.navigateTo({
      url: `/search_pages/images/images?selectFlag=3`
    });
  },

  // 跳转更多图片
  goImages: function(e:any){
    wx.navigateTo({
      url: `/search_pages/images/images?type=${encodeURIComponent(e.currentTarget.dataset.type)}`
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

  // 顶部滑动切换 && 回到顶部
  onPageScroll(e: any) {
    const scrollTop = e.scrollTop;
    const { showTopImage, showTopTitle } = this.data;
  
    // 使用本地变量记录状态，避免频繁调用 setData
    let newShowTopImage = showTopImage;
    let newShowTopTitle = showTopTitle;
  
    // 仅在状态发生变化时才更新数据
    if (scrollTop > 50 && showTopImage) {
      newShowTopImage = false;
      newShowTopTitle = true;
    } else if (scrollTop <= 50 && !showTopImage) {
      newShowTopImage = true;
      newShowTopTitle = false;
    }
  
    // 如果状态有变化，则统一更新
    if (newShowTopImage !== showTopImage || newShowTopTitle !== showTopTitle) {
      this.setData({
        showTopImage: newShowTopImage,
        showTopTitle: newShowTopTitle
      });
    }
  
    // 回到顶部
    throttle(() => {
      this.selectComponent('#backToTop').onPageScroll(e);
    }, 300)();
  },

  // 分享给好友或群
  onShareAppMessage() {
    const { swiperImages } = this.data;
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)];

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { swiperImages } = this.data;
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)];

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    };
  }

});
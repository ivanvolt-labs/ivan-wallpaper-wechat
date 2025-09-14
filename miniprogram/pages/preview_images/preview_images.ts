var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [] as any, // 用于存储图片 URL 的数组
    currentIndex: 0, // 当前显示的图片索引
    currentImage: '',
    url: '',
    autoplay: false,
    indicatorDots: false,
    userInfo: null as any,
    isCollect: false as any,
    currentTime: '',
    currentDate: '',
    showBottom: true,
    animationClass: 'show',
    showTime: false,
    showHuaweiLogo: false,
    isDownload: "0",
    imageOpacity: 1,
    isDownloadShow: false,
    // 图标路径配置
    icons: {
      collectSelected: app.globalData.baseIconPath + 'collect_selected_icon.png',
      collect: app.globalData.baseIconPath + 'collect_icon.png',
      download: app.globalData.baseIconPath + 'download_icon.png',
      share: app.globalData.baseIconPath + 'share_icon.png',
      type: app.globalData.baseIconPath + 'type_icon.png',
      dimensions: app.globalData.baseIconPath + 'dimensions_icon.png',
      source: app.globalData.baseIconPath + 'source_icon.png',
      time: app.globalData.baseIconPath + 'time_icon.png'
    }
  },

  timer: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    // console.log(JSON.stringify(options));
    // 解析传递的图片列表和当前索引
    let images = JSON.parse(options.images || '[]');
    if(images.length > 0){
      // 构造图片全地址
      images = app.generateFullFilePaths(images);
    }
    
    const currentIndex = parseInt(options.currentIndex, 10) || 0;
    const isDownload = options.isDownload || '0';
    const userInfo = wx.getStorageSync('userInfo')// 从缓存获取用户信息
    // console.log('获取用户信息: ' + JSON.stringify(userInfo));

    //读取收藏状态
    this.isInit(userInfo, images, currentIndex, isDownload)
  },

  // 每次进到页面都读取
  onShow(){
    const userInfo = wx.getStorageSync('userInfo')

    this.setData({
      userInfo: userInfo
    })
  },

  onUnload() { 
    // 清理定时器
    clearInterval(this.timer);
  },

  // 处理滑动事件来切换图片
  bindchange(e: any) {
    const currentIndex = e.detail.current
    const currentImage = this.data.images[currentIndex];
    const images = this.data.images
    const isCollect = images[currentIndex].isCollect
    // console.log('下标: ' + JSON.stringify(currentIndex));
    // console.log('images: ' + JSON.stringify(images));
    // console.log('isCollect: ' + JSON.stringify(isCollect));

    this.setData({
      currentIndex,
      isCollect,
      currentImage
    });

    // 加载当前图片的高清图
    // this.loadHighResImage(currentIndex);
  },

  // 加载完成
  onImageLoad(e:any){
    // console.log('onImageLoad: ' + JSON.stringify(e));
    const images = this.data.images
    const currentIndex = e.target.dataset.index
    images[currentIndex].loaded = true;
    this.setData({ images });
  },
  // 加载失败
  onImageError() {
    console.log('图片加载失败');
  },

  // 更新时间
  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const date = now.toDateString(); // 获取日期，格式如 Mon Sep 30 2024

    this.setData({
      currentTime: `${hours}:${minutes}`,
      currentDate: date
    });
  },

  // 切换视图形式
  changeShow: function(e:any){
    const item = e.currentTarget.dataset.item;
    // console.log('e: ' + JSON.stringify(item));

    // 如果是下载界面, 不显示效果
    if(this.data.isDownload == '1'){
      this.setData({
        showTime: false,
        showHuaweiLogo: false,
        showBottom: false,
        animationClass: 'hide'
      })
    } else {
      // console.log('壁纸类型: ' + item.type);
      // 根据图片类型控制是否显示时间
      const type = item.type
      const animationClass = this.data.showBottom ? 'hide' : 'show';
      if(type === '手机壁纸'){
        this.updateTime()
        this.setData({
          showTime: !this.data.showTime,
          showBottom: !this.data.showBottom,
          animationClass: animationClass
        })
      } else if(type === '创意摄影'){
        this.setData({
          showHuaweiLogo: !this.data.showHuaweiLogo,
          showBottom: !this.data.showBottom,
          animationClass: animationClass
        })
      } else {
        this.setData({
          showBottom: !this.data.showBottom,
          animationClass: animationClass
        })
      }
    }
  },

  // 返回到上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1 
    });
  },

  // 数据初始化
  isInit: function(userinfo:any, images:any, currentIndex:number, isDownload:string) {
    const wallpapersIds = images.map((image: any) => image.wallpapersId);
    // const currentIndex = this.data.currentIndex
    // console.log('wallpapersIds:' + JSON.stringify(wallpapersIds));
    
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/collect/state`,
      method: 'POST',
      data: {
        type: '1',
        uid: userinfo.id,
        wallpapersIds: wallpapersIds
      },
      header: {
        'content-type': 'application/json',
        'Authorization': userinfo.accessToken
      },
      success: async (res: any) => {
        // 🔧 正确的类型处理
        let data: any;
        try {
          data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        } catch (e) {
          console.error('Failed to parse response data:', e);
          return;
        }
        
        if (data?.code === 0) {
          // console.log('请求响应: ' + JSON.stringify(res.data));
          
          const collectStatus = data.data;
          // const images = this.data.images;

          // 遍历图片列表，并检查每张图片是否被收藏
          const updatedImages = images.map((image: any) => {
            const isCollect = collectStatus.some((item: any) => item.wallpapersId === image.wallpapersId); // 比对收藏状态
            const type = image.type;
            const modeType = type === '电脑平板' || type === '头像' ? 'aspectFit' : 'aspectFill';
            const loaded = false
            return {
              ...image,
              modeType: modeType,
              loaded: loaded,
              isCollect: isCollect
            };
          });

          // console.log('对比收藏状态后的images: ' + JSON.stringify(images));

          // 更新图片状态
          this.setData({
            images: updatedImages,
            currentIndex: currentIndex,
            currentImage: updatedImages[currentIndex],
            isDownload: isDownload,
            animationClass: isDownload === '1' ? 'hide' : 'show',
            isCollect: updatedImages[currentIndex].isCollect
          });

          // 如果不是下载界面，启动定时更新
          if (isDownload === '0') {
            this.timer = setInterval(this.updateTime.bind(this), 60000);
          }
        } else {
          // console.error('Failed to fetch data:', res);
          if(data?.code == 401){
            console.log('没有权限...');
            const today = new Date().toLocaleDateString(); // 当前日期
            try {
              await getApp().login(today); // 重新登录获取 token
              // 登录成功后，重新发起请求
              const userinfo = wx.getStorageSync('userInfo')
              await this.isInit(userinfo, images, currentIndex, isDownload);
            } catch (loginError) {
              console.error('重新登录失败:', loginError);
            }
          }
        }
      },
      fail: (err: any) => {
        console.error('Request failed:', err);
      }
    });
  },

  // 收藏逻辑
  onFavorite: function() {
    // 使用缓存中的用户信息
    const userInfo = this.data.userInfo
    const currentIndex = this.data.currentIndex
    const images = this.data.images
    const wallpapersId = images[currentIndex].wallpapersId
    const isCollect = images[currentIndex].isCollect
    if(isCollect){//取消收藏
      wx.showLoading({
        title: '取消中...'
      });

      wx.request({
        url: `${app.globalData.baseURL}/manager/serviceAccountAction/delete`,
        method: 'DELETE',
        data: {
          type: '1',
          uid: userInfo.id,
          wallpapersId: wallpapersId
        },
        header: {
          'content-type': 'application/json',
          'Authorization': this.data.userInfo.accessToken
        },
        success: (res: any) => {
          // 🔧 正确的类型处理
          let data: any;
          try {
            data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          } catch (e) {
            console.error('Failed to parse response data:', e);
            return;
          }
          
          // console.log('取消收藏: ' + JSON.stringify(res.data));
          if (data?.code === 0) {
            // 更新本地状态
            images[currentIndex].isCollect = false
            this.setData({
              images: images,
              isCollect: false
            });
          } else {
            wx.showToast({
              title: data?.msg || '取消收藏失败',
              icon: 'error',
              duration: 2000
            })
          }
        },
        fail: (err: any) => {
          console.error('Request failed:', err);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } else {//添加收藏
      wx.showLoading({
        title: '收藏中...'
      });

      wx.request({
        url: `${app.globalData.baseURL}/manager/serviceAccountAction/add`,
        method: 'POST',
        data: {
          type: '1',
          uid: userInfo.id,
          wallpapersId: wallpapersId
        },
        header: {
          'content-type': 'application/json',
          'Authorization': this.data.userInfo.accessToken
        },
        success: (res: any) => {
          // 🔧 正确的类型处理
          let data: any;
          try {
            data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          } catch (e) {
            console.error('Failed to parse response data:', e);
            return;
          }
          
          if (data?.code === 0) {
            // 更新本地状态
            images[currentIndex].isCollect = true
            this.setData({
              images: images,
              isCollect: true
            });
          } else {
            wx.showToast({
              title: data?.msg || '添加收藏失败',
              icon: 'error',
              duration: 2000
            })
          }
        },
        fail: (err: any) => {
          console.error('Request failed:', err);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    }
  },

  // 显示下载框
  onDownload: function(){
    this.setData({
      isDownloadShow: true
    })
  },

  // 关闭下载框
  closeDownloadBox: function(){
    this.setData({
      isDownloadShow: false
    })
  },

  // 缩略图下载
  onThumbnailDownload: function(){
    const userInfo = this.data.userInfo
    // console.log(JSON.stringify(userInfo));

    const that = this;

    // 1. 检查是否已授权保存到相册
    wx.getSetting({
      success(res: any) {
        // 如果没有授权，提示用户授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {// 授权成功
              // 用户同意授权，执行会员和积分判断逻辑
              that.saveImage(userInfo, 'thumbnail')
            },
            fail() {
              // 用户拒绝授权，给出提示
              wx.showModal({
                title: '提示',
                content: '请开启保存到相册的权限',
                showCancel: false,
                success: function (modalRes: any) {
                  if (modalRes.confirm) {
                    wx.openSetting(); // 打开设置页面
                  }
                }
              });
            }
          });
        } else {
          that.saveImage(userInfo, 'thumbnail')
        }
      }
    });
  },

  // 原图下载
  onPreviewDownload: function() {
    const userInfo = this.data.userInfo
    // console.log(JSON.stringify(userInfo));

    const that = this;

    // 1. 检查是否已授权保存到相册
    wx.getSetting({
      success(res: any) {
        // 如果没有授权，提示用户授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {// 授权成功
              // 用户同意授权，执行会员和积分判断逻辑
              that.decideBill(userInfo)
            },
            fail() {
              // 用户拒绝授权，给出提示
              wx.showModal({
                title: '提示',
                content: '请开启保存到相册的权限',
                showCancel: false,
                success: function (modalRes: any) {
                  if (modalRes.confirm) {
                    wx.openSetting(); // 打开设置页面
                  }
                }
              });
            }
          });
        } else {
          that.decideBill(userInfo)
        }
      }
    });
  },

  // 判断是否会员
  decideBill(userInfo:any) {
    if(userInfo.isVip != '2'){
      // 查看是否有积分
      if(userInfo.points <= 0){
        console.log("积分不足, 请前往获取");

        wx.showModal({
          title: '积分不足, 请前往获取',
          showCancel: false
        })
        return;
      } else {
        // 扣积分
        console.log("请求扣除积分, 成功后下载图片");
        this.saveImage(userInfo, 'preview');
      }
    } else {
      // 如果是会员直接下载
      console.log("不用看广告");
      this.saveImage(userInfo, 'preview');
    }
  },

  // 下载并保存图片的函数
  saveImage(userInfo:any, fileType:string) {
    wx.showLoading({
      title: '下载中...',
    });

    const that = this;
    const filePath =  fileType == 'thumbnail' ? this.data.images[this.data.currentIndex].thumbnailFilePath : this.data.images[this.data.currentIndex].filePath

    // 2. 下载图片到本地
    wx.downloadFile({
      url: filePath,
      success(res: any) {
        if (res.statusCode === 200) {
          // 3. 保存图片到相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              // 扣除积分
              that.deductedPoints(userInfo)

              // 弹窗提示
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      },
      complete() {
        that.setData({
          isDownloadShow: false
        })
        wx.hideLoading();
      }
    });
  },

  // 扣除积分
  deductedPoints: function(userInfo:any) {
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/points`,
      method: 'POST',
      data: {
        uid: userInfo.id,
        type: '2'
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: (res: any) => {
        // 🔧 正确的类型处理
        let data: any;
        try {
          // 如果res.data是string类型，需要解析为JSON
          data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        } catch (e) {
          console.error('Failed to parse response data:', e);
          wx.showModal({
            title: '数据解析失败',
            content: '服务器响应格式异常',
            showCancel: false
          });
          return;
        }
        
        if (res.statusCode === 200 && data?.code === 0) {
          // 扣费成功
          wx.setStorageSync('userInfo', data.data);
          
          this.setData({
            userInfo: data.data
          });
        } else {
          // 扣费失败，显示错误信息
          wx.showModal({
            title: '下载失败',
            content: data?.msg || data?.message || '积分扣除失败',
            showCancel: false
          });
        }
      },
      fail: (err: any) => {
        console.error('Request failed:', err);
        wx.showModal({
          title: '网络异常',
          content: '网络连接失败，请重试',
          showCancel: false
        });
      }
    });
  },

  // 前往获取积分
  goMine(){
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  },
  
  // 分享给好友或群
  onShareAppMessage() {
    const { images, currentIndex, currentImage } = this.data;

    return {
      title: app.globalData.shareTitle,
      imageUrl: currentImage,
      path: `/pages/preview_images/preview_images?currentIndex=${currentIndex}&images=${JSON.stringify(images)}&isDownload=0`
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { images, currentIndex, currentImage } = this.data;

    return {
      title: app.globalData.shareTitle,
      imageUrl: currentImage,
      path: `/pages/preview_images/preview_images?currentIndex=${currentIndex}&images=${JSON.stringify(images)}&isDownload=0`
    };
  }

})
// 定义全局对象
var app = getApp();

// 声明激励广告对象
var videoAd = null as any

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {} as any,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    animationData: {}, //公告动画
    announcementText: "为了提升加载效率，所展示图片均使用缩略图，下载时将自动为您转换超清原图，请放心下载。",
    noticeShow: true,
    restartAnimation: null as any | null,
    copyText: '',
    // collectSum: 0,
    // downloadSum: 0,
    arrows: app.globalData.baseIconPath + 'arrows_icon.png',
    qqGroup: '461368670',
    // daysElapsed: 1,
    showPopup: false,
    accountTitle: {},
    currentAccountColor: '#eeeeee',
    remainingDays: 1,
    version: app.globalData.version,
    isSignIn: false, //是否签到
    // 图标路径配置
    icons: {
      notice: app.globalData.baseIconPath + 'notice_icon.png',
      close: app.globalData.baseIconPath + 'close_icon.png',
      qq: app.globalData.baseIconPath + 'qq_icon.png',
      collect: app.globalData.baseIconPath + 'image_collect_icon.png',
      commonProblems: app.globalData.baseIconPath + 'common_problems_icon.png',
      contact: app.globalData.baseIconPath + 'contact_icon.png',
      clearCache: app.globalData.baseIconPath + 'clear_cache_icon.png',
      link: app.globalData.baseIconPath + 'link_icon.png',
      about: app.globalData.baseIconPath + 'about_icon.png',
      question: app.globalData.baseIconPath + 'question_icon.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    // console.log('用户信息: ' + JSON.stringify(userInfo));
    
    this.setData({
      userInfo: userInfo,
      currentAccountColor: userInfo.color
    });

    // 创建激励广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-fe8f45d39a035cca',
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err: any) => {
        console.error('激励视频光告加载失败', err)
      })
    }

    // 初始化动画
    // this.initAnimation(this.data.announcementText);

    // 获取下级称号
    // this.getMembershipTitle(this.data.daysElapsed)
  },

  // 清除定时器，销毁动画循环
  onUnload: function() {
    const restartAnimation = this.data.restartAnimation;
    if (restartAnimation !== null) {
        clearInterval(restartAnimation);
        this.setData({
            restartAnimation: null // 将变量置为空，防止重复销毁
        });
    }
  },

  // 公告栏
  initAnimation: function(announcementText: any) {
    var that = this;
  
    // 根据字体大小和字符长度估算文字宽度
    var textLength = announcementText.length * 26 * 0.55; // 每个字符大约14.3rpx宽
    var screenWidth = 255; // 屏幕宽度
    var initialPosition = screenWidth + 100; // 让文字从屏幕右侧外部开始（偏移100rpx）
  
    // 初始化动画
    var animation = wx.createAnimation({
      duration: 0, // 初始为0，确保动画开始时不会有延迟
      timingFunction: 'linear'
    });
  
    // 将文字定位到初始位置（屏幕右侧外）
    animation.translate(initialPosition, 0).step();
    that.setData({
      animationData: animation.export()
    });
  
    // 动态计算动画持续时间，稍微调慢速度
    var duration = (textLength + screenWidth) * 12; // 增加系数以调慢速度
  
    // 启动动画
    setTimeout(function() {
      animation.translate(-textLength, 0).step({
        duration: duration // 动态设置动画持续时间
      });
      that.setData({
        animationData: animation.export()
      });
    }, 50); // 确保动画在页面加载后立即开始
  
    // 动画循环
    setInterval(function() {
      // 重置动画到初始位置（屏幕外）
      animation.translate(initialPosition, 0).step({
        duration: 0 // 瞬间回到起始位置
      });
      that.setData({
        animationData: animation.export()
      });
  
      // 延迟后再启动动画，确保平滑进入
      setTimeout(function() {
        animation.translate(-textLength, 0).step({
          duration: duration // 动态设置动画持续时间
        });
        that.setData({
          animationData: animation.export()
        });
      }, 100); // 延迟少量时间，避免闪烁
    }, duration + 100); // 持续时间与动画时间一致，加上少量延迟
  },

  // 关闭公告栏
  closeNotice(){
    const restartAnimation = this.data.restartAnimation
    if(restartAnimation != null){
      clearInterval(restartAnimation)
    }

    this.setData({
      noticeShow: false,
      restartAnimation: null
    })
  },

  // 处理头像选择
  onChooseAvatar(e:any) {
    const avatar = e.detail.avatarUrl;

    // 上传头像到服务器
    wx.uploadFile({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/avatar`, // 修改为头像上传的接口
      filePath: avatar, // 上传文件的路径
      name: 'file', // 上传文件的字段名
      formData: {
        uid: this.data.userInfo.id // 可以传递用户ID等附加数据
      },
      header: {
        'Authorization': this.data.userInfo.accessToken
      },
      success: (uploadRes) => {
        const resData = JSON.parse(uploadRes.data);
        console.log('res:' + JSON.stringify(uploadRes.data));
        
        if (resData.code === 0) {
          // 请求成功，更新用户信息
          const userInfo = resData.data;
          this.setData({
            userInfo: userInfo
          });

          // 更新缓存中的用户信息
          wx.setStorageSync('userInfo', userInfo);
        } else {
          console.error('Failed to upload avatar:', resData);
        }
      },
      fail: (err) => {
        console.error('Upload failed:', err);
      }
    });
  },

  // 处理昵称输入
  onInputChange(e:any) {
    const nickname = e.detail.value
    if(nickname == null || nickname == ''){
      wx.showModal({
        title: '昵称还没设置哦'
      })
    }

    // 请求替换昵称
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/nickname`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        nickname: nickname
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        if (data.code === 0) {
          const userInfo = data.data;
          this.setData({
            userInfo: userInfo
          });
      
          // 更新缓存
          wx.setStorageSync('userInfo', userInfo);
        } else {
          console.error('Failed to fetch data:', data);
        }
      },
      fail: err => {
        console.error('Request failed:', err);
      }
    });
  },

  // 称号清单弹出窗口
  togglePopup: function () {
    this.setData({
      showPopup: true
    });
  },
  hidePopup: function () {
    this.setData({
      showPopup: false
    });
  },
  preventPopupClose: function (e:any) {
    // 阻止弹框内点击事件冒泡
    e.stopPropagation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    const isSignIn = wx.getStorageSync('isSignIn')
    // console.log('获取用户信息: ' + JSON.stringify(userInfo));
    
    if (userInfo != null) {
      this.setData({
        userInfo: userInfo,
        isSignIn: isSignIn
      })

      //获取下载和收藏数量
      // this.selectActionCount(userInfo.id)
    }
  },

  // 获取下载和收藏数量 (已移除)
  /*
  selectActionCount: function(uid:string) {
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/action/count`,
      method: 'POST',
      data: {
        uid: uid
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        if (res.statusCode === 200) {
          this.setData({
            collectSum: data.data.collectSum,
            downloadSum: data.data.downloadSum
          });
        } else {
          console.error('Failed to fetch data:', data);
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('Request failed:', err);
      }
    });
  },
  */

  // 签到
  onSignIn: function(e:any) {
    if(this.data.isSignIn){
      wx.showModal({
        title: '今天已经签到过了',
        showCancel: false
      })
      return;
    }

    const uid = e.currentTarget.dataset.uid;
    const operation = e.currentTarget.dataset.operation;
    
    //增加积分
    this.addPoints(uid, operation)
  },

  // 分享
  // onShareAppMessage: function (res) {
  //   console.log(res);  // 分享来源的参数

  //   return {
  //     title: '分享奖励',  // 分享的标题
  //     path: '/pages/index/index',  // 分享的路径
  //     imageUrl: '',  // 分享的图片，可以选择一个图片URL
  //     success: (shareRes) => {
  //       console.log('分享成功');
  //       // 调用增加积分的函数
  //       this.addPoints(this.data.userInfo.uid, '2', 2);  // 分享奖励2积分
  //     },
  //     fail: (err) => {
  //       console.error('分享失败', err);
  //     }
  //   };
  // },

  // 播放广告获取积分
  onMorePoints(e:any){
    const uid = e.currentTarget.dataset.uid;
    const operation = e.currentTarget.dataset.operation;

    wx.showModal({
      title: '即将播放广告获取青豆',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了确定, 播放广告
          this.applyVideoAd(uid, operation);
        } else if (res.cancel) {
          // 用户点击了取消
          wx.showToast({
            title: '操作已取消',
            icon: 'none'
          });
        }
      }
    })
  },

  // 观看广告
  applyVideoAd(uid:string, operation:string){
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch((err: any) => {
            console.error('激励视频 广告显示失败', err)
          })
      }),
  
      // 监听是否观看完视频
      videoAd.onClose((res: any) => {
        // 移除广告的监听器，防止重复触发
        videoAd.offClose();
  
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          console.log('播放完成，可以获取青豆');
          // 正常播放结束，可以下发积分
          this.addPoints(uid, operation);
        } else {
          // 播放中途退出，不下发游戏奖励
          console.log('播放中途退出，不能获取青豆');
        }
      })
    }
  },

  // 增加积分
  addPoints(uid:string, operation:string){
    wx.showLoading({
      title: '处理中'
    });
    
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/points`,
      method: 'POST',
      data: {
        uid: uid,
        type: '1',
        operation: operation
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        if (res.statusCode === 200 && data.code === 0) {
          // 成功逻辑
          wx.setStorageSync('userInfo', data.data);
          if(operation == '1'){
            wx.setStorageSync('isSignIn', true);
          }

          this.setData({
            userInfo: data.data,
            isSignIn: operation == '1' ? true : this.data.isSignIn
          });
          
          // 显示成功提示
          let successMsg = '操作成功';
          if(operation == '1') successMsg = '签到成功，获得1积分';
          else if(operation == '2') successMsg = '分享成功，获得2积分';
          else if(operation == '3') successMsg = '观看广告成功，获得3积分';
          
          wx.showToast({
            title: successMsg,
            icon: 'success'
          });
        } else {
          // 服务端返回的错误信息
          const errorMsg = (typeof data === 'object' && data !== null) 
            ? (data.msg || data.message || '操作失败')
            : '操作失败';
            
          wx.showModal({
            title: '提示',
            content: errorMsg,
            showCancel: false
          });
        }
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading();
        console.error('Request failed:', err);
        wx.showModal({
          title: '网络异常',
          content: '请检查网络连接后重试',
          showCancel: false
        });
      }
    });
  },

  // 复制UID
  copyUid() {
    wx.setClipboardData({
      data: this.data.userInfo.id,
      success() {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 2000
        });
      },
      fail() {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 复制qq群号
  copyQQGroup() {
    wx.setClipboardData({
      data: this.data.qqGroup,
      success() {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 2000
        });
      },
      fail() {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 前往积分明细
  goRecords(){
    wx.navigateTo({
      url: `/mine_pages/records/records`
    });
  },

  // 前往收藏
  goCollect(){
    wx.navigateTo({
      url: `/mine_pages/collect/collect?uid=${this.data.userInfo.id}`
    });
  },

  // 前往下载
  goDownload(){
    wx.navigateTo({
      url: `/mine_pages/download/download?uid=${this.data.userInfo.id}`
    });
  },

  // todo 清除缓存
  showClearCacheModal() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了确定
          this.clearCache();
          wx.showToast({
            title: '请点击右上角"···"重新进入小程序。',
            icon: 'none'
          });
        } else if (res.cancel) {
          // 用户点击了取消
          wx.showToast({
            title: '操作已取消',
            icon: 'none'
          });
        }
      }
    });
  },
  clearCache() {
    wx.clearStorageSync(); // 或者 wx.clearStorage()
    wx.showToast({
      title: '缓存已清除',
      icon: 'success'
    });
  },

  // 意见反馈
  openFeedbackTab(){
    wx.navigateTo({
      url: `/mine_pages/feedback/feedback?uid=${this.data.userInfo.id}`
    });
  },

  // 常见问题
  openCommonProblemsTab(){
    wx.navigateTo({
      url: `/mine_pages/common_problems/common_problems`
    });
  },

  // 关联青柠客
  openLinkRemake(){
    wx.navigateTo({
      url: `/mine_pages/link_remake/link_remake`
    });
  },

  // 关于我们
  openAboutTab(){
    wx.navigateTo({
      url: `/mine_pages/about/about`
    });
  },

  // 分享给好友或群
  onShareAppMessage() {
    // 添加定时器来模拟分享成功后的奖励
    setTimeout(() => {
      this.handleShareReward();
    }, 3000); // 3秒延时，用户通常会在这段时间内完成分享操作

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
    // 添加定时器来模拟分享成功后的奖励
    setTimeout(() => {
      this.handleShareReward();
    }, 3000); // 3秒延时，用户通常会在这段时间内完成分享操作

    const swiperImages = wx.getStorageSync('swiperImages')
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)];
    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    };
  },

  // 处理分享奖励逻辑
  handleShareReward() {
    const todayDate = new Date().toISOString().split('T')[0];
    const lastShareRewardDate = wx.getStorageSync('lastShareRewardDate') || '';
    let userInfo = this.data.userInfo;

    if (lastShareRewardDate !== todayDate) {
      // 如果日期不是今天，给予奖励并更新缓存
      this.addPoints(userInfo.id, '2')
      wx.setStorageSync('lastShareRewardDate', todayDate);
    }
  }
})
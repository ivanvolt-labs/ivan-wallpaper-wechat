App({
  globalData: {
    baseURL: 'https://manager.putablecloth.com/',
    // baseURL: 'http://127.0.0.1:8889',
    shareTitle: '青柠客壁纸｜手机换装必备，让颜值天花板触手可及',
    get baseIconPath() {
      return `${this.baseURL}/files/icon/`;
    },
    get baseBackgroudPath() {
      return `${this.baseURL}/files/backgroud/`;
    },
    get baseImagePath() {
      return `${this.baseURL}/files/wallpapers/`;
    },
    thumbnailType: 'thumbnail_',
    previewType: 'preview_',
    version: 'v3.5.6'
  },

  onShow: function () {
    this.handleUserLogin();
  },

  // 用户登录
  handleUserLogin: function () {
    const today = new Date().toLocaleDateString(); // 当前日期
    const storedUserInfo = wx.getStorageSync('userInfo');
    let storedLastVisitDate = wx.getStorageSync('lastVisitDate');

    // 如果缓存中没有用户信息或日期不是今天，则重新登录
    if (!storedUserInfo || !storedLastVisitDate || storedLastVisitDate !== today) {
      // 清除缓存
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('isSignIn');
      wx.removeStorageSync('lastShareRewardDate');
      wx.removeStorageSync('phoneImages');
      wx.removeStorageSync('swiperImages');
      wx.removeStorageSync('scrollAvatars');

      // 登录流程
      this.login(today)
    }
  },

  // 登录
  login(today: string): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res: WechatMiniprogram.LoginSuccessCallbackResult) => {
          if (res.code) {
            // 调用后端接口，判断用户是否已注册，并获取用户信息
            wx.request({
              url: `${this.globalData.baseURL}/manager/v2/wallpaper/wechat/login`,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (response: WechatMiniprogram.RequestSuccessCallbackResult) => {
                const data = response.data as { code: number, data: any };

                if (data.code === 0 && data.data != null) {
                  // 成功获取用户信息后，将用户信息存储到 StorageSync
                  wx.setStorageSync('userInfo', data.data);
                  wx.setStorageSync('lastVisitDate', today); // 更新最后访问日期
                  resolve(); // 登录成功，解析 Promise
                } else {
                  reject(new Error('登录失败，获取用户信息失败'));
                }
              },
              fail: (err: WechatMiniprogram.GeneralCallbackResult) => {
                console.error('请求失败:', err);
                reject(err); // 请求失败，拒绝 Promise
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg);
            reject(new Error('wx.login失败'));
          }
        },
        fail: (err: WechatMiniprogram.GeneralCallbackResult) => {
          console.error('wx.login失败:', err);
          reject(err); // 登录失败，拒绝 Promise
        }
      });
    });
  },

  // 封装的函数，用于生成完整的文件路径
  generateFullFilePaths(imageArray: any[]) {
    const baseImagePath = this.globalData.baseImagePath;
    const thumbnailType = this.globalData.thumbnailType;
    const previewType = this.globalData.previewType;

    return imageArray.map(item => ({
      ...item, // 保留原有字段
      thumbnailFilePath: `${baseImagePath}${thumbnailType}${item.fileName.replace(/\.[^/.]+$/, '.jpg')}`,
      previewFilePath: `${baseImagePath}${previewType}${item.fileName.replace(/\.[^/.]+$/, '.jpg')}`,
      filePath: `${baseImagePath}${item.fileName}`
    }));
  },

});
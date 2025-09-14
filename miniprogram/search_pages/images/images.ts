var app = getApp();

Page({
  data: {
    items: [] as any[],
    isLoading: false,
    noMoreData: false,
    timeout: 500,
    page: 1,
    limit: 20,
    total: 0,
    isSearch: false,
    searchValue: '',
    type: '',
    color: '',
    tags: '',
    selectFlag: '' as any,
    imageConut: 3,
    ifClear: false,
    tagShow: true,
    // 图标路径配置
    icons: {
      search: app.globalData.baseIconPath + 'search_icon.png',
      clear: app.globalData.baseIconPath + 'clear_icon.png',
      preview: app.globalData.baseIconPath + 'preview_icon1.png'
    }
  },

  onLoad(options: any) {
    if(options){
      // 处理可能传递的多个参数
      // const query = options.query ? decodeURIComponent(options.query) : '';
      const tags = options.tags ? decodeURIComponent(options.tags) : '';
      const type = options.type ? decodeURIComponent(options.type) : '手机壁纸';
      const color = options.color ? decodeURIComponent(options.color) : '';
      const selectFlag = options.selectFlag ? decodeURIComponent(options.selectFlag) : null;

      // const imageConut = type == '电脑平板' || type == '头像' ? 2 : 3
      let imageConut;
      if(type == '电脑平板'){
        imageConut = 1
      } else if(type == '头像'){
        imageConut = 2
      } else {
        imageConut = 3
      }
      // const tagShow = type == '电脑平板' || type == '头像' ? true : false
      this.setData({
        isLoading: true,
        imageConut: imageConut,
        // tagShow: tagShow
      })

      // 根据传递的参数进行数据请求
      setTimeout(() => {
        this.fetchResults(tags, type, color, selectFlag);
      }, this.data.timeout)
    }
  },

  // 监听搜索框输入
  // onInput(e: any) {
  //   const searchValue = e.detail.value;
  //   this.setData({
  //     searchValue: searchValue
  //   });
  // },

  // 键盘提交搜索请求
  // onSearchConfirm() {
  //   this.setData({
  //     items: [],
  //     page: 1,
  //     nodataValue: this.data.searchValue
  //   })
  //   this.fetchResults(this.data.searchValue.trim(), '', this.data.type.trim(), this.data.color.trim(), this.data.selectFlag);
  // },

  // 点击搜索按钮时触发
  // onSearchTap() {
  //   if(this.data.searchValue.trim() == ''){
  //     return;
  //   }

  //   this.setData({
  //     page: 1
  //   })

  //   setTimeout(() => {
  //     this.fetchResults(this.data.searchValue.trim(), '', this.data.type.trim(), this.data.color.trim(), this.data.selectFlag);
  //   }, this.data.timeout)
  // },
  
  // 上拉加载
  onReachBottom: function() {
    if (!this.data.noMoreData) {
      this.setData({
        isLoading: true, 
        noMoreData: false
      });

      //加载更多，这里做下延时加载
      setTimeout(() => {
        this.fetchResults(this.data.tags, this.data.type, this.data.color, this.data.selectFlag);
      }, this.data.timeout)
    }
  },

  // 请求
  fetchResults: function(tags:string, type:string, color:string, selectFlag:any) {
    let that = this
    let page = that.data.page
    // query = query != '' ? query : tags;

    // console.log('page: ' + JSON.stringify(page));
    // console.log('tags: ' + JSON.stringify(tags));
    // console.log('type: ' + JSON.stringify(type));
    // console.log('color: ' + JSON.stringify(color));
    // console.log('selectFlag: ' + JSON.stringify(selectFlag));
      
    // 初次加载
    // if (page == 1) {
    //   this.setData({
    //     isLoading: true, 
    //     noMoreData: false,
    //     items: []
    //   })
    // }  
    
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/page`,
      method: 'POST',
      data: {
        page: page,
        limit: this.data.limit,
        tags: tags,
        type: type,
        color: color,
        selectFlag: selectFlag
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        // console.log('data', data);
        
        if (data.code == 0) {
          if(data.data.records.length === 0){
            that.setData({
              isLoading: false, 
              noMoreData: true,
              total: data.data.total,
              nodataValue: that.data.searchValue
            });
          } else {
            page++

            var newItems = data.data.records
            // 构造图片全地址
            newItems = app.generateFullFilePaths(newItems);

            // 避免重复拼接数据
            const items = page === 1 ? newItems : that.data.items.concat(newItems);
    
            that.setData({
              items: items,
              page: page,
              total: data.data.total,
              searchValue: tags,
              tags: tags,
              type: type,
              color: color,
              noMoreData: false
            });
  
            if (data.data.records.length < that.data.limit || data.data.records.length == data.data.total) {
              that.setData({
                isLoading: false,
                noMoreData: true,
                nodataValue: that.data.searchValue,
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

  // 预览图片
  previewImageHandler: function(e:any) {
    const currentIndex = e.currentTarget.dataset.index;
    const images = e.currentTarget.dataset.images;
  
    wx.navigateTo({
      url: `/pages/preview_images/preview_images?currentIndex=${currentIndex}&images=${JSON.stringify(images)}&isDownload=0`
    });
  },

  // 回到顶部
  onPageScroll(e:any) { 
    this.selectComponent('#backToTop').onPageScroll(e);
  },

  // 清除搜索框内容
  // clearSearchValue: function() {
  //   this.setData({
  //     searchValue: ''
  //   });
  // }

});
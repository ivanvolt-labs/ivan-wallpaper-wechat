
Page({
  data: {
    searchValue: '',
    ifClear: false,
    searchHistory: [] as string[],
    searchTags: ['视觉','抽象','创意','风景','自然','极简','生活','插画','美女','原生'],
    showRefreshIndicator: false,
    refreshText: '下拉刷新',
    loadingMore: false,
    loadingText: '加载中...',
    // 图标路径配置
    icons: {
      search: getApp().globalData.baseIconPath + 'search_icon.png',
      clear: getApp().globalData.baseIconPath + 'clear_icon.png',
      delete: getApp().globalData.baseIconPath + 'delete_icon.png'
    }
  },

  onLoad() {
    // 从缓存中读取搜索历史
    const history = wx.getStorageSync('searchHistory') || [];
    // console.log("缓存中标签: " + history);
    
    this.setData({
      searchHistory: history
    });
  },

  // 监听搜索框输入
  onInput(e: any) {
    const query = e.detail.value.trim();
    
    this.setData({
      searchValue: query
    });
  },
  onSearchConfirm() {
    const query = this.data.searchValue.trim();
    if (query !== '') {
      this.updateSearchHistory(query);
      this.searchRequest(query);
    }
  },

  // 点击搜索按钮时触发
  onSearchTap() {
    const query = this.data.searchValue.trim();
    if (query !== '') {
      this.updateSearchHistory(query);
      this.searchRequest(query);
    }
  },

  // 携带搜索内容请求图片列表
  searchRequest(query: string) {
    wx.navigateTo({
      url: `/search_pages/images/images?tags=${encodeURIComponent(query)}`
    });
  },

  // 清除搜索框内容
  clearSearchValue: function() {
    this.setData({
      searchValue: ''
    });
  },

  // 清空搜索历史
  clearSearchHistory(){
    this.setData({
      searchHistory: []
    })
    wx.setStorageSync('searchHistory', null);
  },

  // 更新搜索历史
  updateSearchHistory(query: string) {
    let history: string[] = this.data.searchHistory;
    let isIncluded = this.data.searchTags.includes(query); // 判断是否在数组中
    //searchTags
    if (!isIncluded && !history.includes(query)) {
      history.unshift(query); // 添加到数组头部
      if (history.length > 10) {
        history.pop(); // 只保留最近10条记录
      }
      this.setData({ searchHistory: history });
      wx.setStorageSync('searchHistory', history); // 保存到本地缓存
    }
  },
  onTagTap(e: any) {
    const query = e.currentTarget.dataset.item;
    this.setData({
      searchValue: query
    });
    this.searchRequest(query);
  }
})
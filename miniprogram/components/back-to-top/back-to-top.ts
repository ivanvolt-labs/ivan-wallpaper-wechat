Component({
  properties: {
    showBackToTopClass: {
      type: String,
      value: 'slide-out'
    },
    showBackToTop: {
      type: Boolean,
      value: false
    }
  },
  data: {
    icons: {
      backToTop: getApp().globalData.baseIconPath + 'back_to_top_icon.png'
    }
  },
  methods: {
    // 回到顶部
    onPageScroll(e:any) {
      if (e.scrollTop > 400 && !this.data.showBackToTop) {
        this.setData({
          showBackToTop: true,
          showBackToTopClass: 'slide-in'
        });
      } else if (e.scrollTop <= 400 && this.data.showBackToTop) {
        this.setData({
          showBackToTopClass: 'slide-out'
        });
        
        // 延迟移除元素，确保动画执行完毕
        setTimeout(() => {
          this.setData({
            showBackToTop: false
          });
        }, 500); // 500ms 与动画持续时间匹配
      }
    },
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500 // 500ms 的滚动动画
      });
    },
  }
});
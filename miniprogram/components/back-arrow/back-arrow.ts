Component({
  properties: {
    iconSrc: {
      type: String,
      value: '../../images/preview/back_icon.png'
    }
  },
  data: {
    icons: {
      back: getApp().globalData.baseIconPath + 'back_icon.png',
      home: getApp().globalData.baseIconPath + 'home_image_icon.png'
    }
  },
  methods: {
    goHome: function() {
      wx.switchTab({
        url: '/pages/home/home'
      });
    },

    goBack: function() {
      wx.navigateBack({
        delta: 1 
      });
    }
  }
});
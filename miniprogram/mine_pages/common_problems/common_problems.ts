Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图标路径配置
    icons: {
      back: getApp().globalData.baseIconPath + 'back_icon.png',
      bottom: getApp().globalData.baseIconPath + 'bottom_icon.png'
    },
    faqList: [
      // {
      //   question: '青柠客壁纸是什么？',
      //   answer: '青柠客壁纸是一款极致关注用户体验的微信小程序。我们以对待艺术品的标准精挑细选每一张壁纸，致力于提供高品质的视觉享受。我们的目标不是数量，而是每一张壁纸都能带给您惊喜与灵感。',
      //   isOpen: true
      // },
      {
        question: '广告的必要性说明？',
        answer: '插入广告是为了帮助我们抵消部分开发和维护成本，同时保持小程序的持续运营。实际上我们一直非常重视用户的使用体验，尽量减少广告带来的干扰，您也可以通过赞助的方式直接获取青豆(下载壁纸需消耗的道具)，详情请联系我们。',
        isOpen: true
      },
      {
        question: '壁纸更新频率如何？',
        answer: '我们会定期更新壁纸库，确保您始终能找到最新、最热门的壁纸。您可以点击小程序右上角“···”，选择“添加到我的小程序”随时找到我们，感谢您的持续关注。',
        isOpen: false
      },
      {
        question: '如何设置壁纸？',
        answer: '设置壁纸非常简单。选择您喜欢的壁纸，点击下载按钮，然后根据手机的操作系统进行设置。在大多数手机上，您可以通过“设置” - “壁纸” - “选择壁纸”来完成设置过程。',
        isOpen: false
      },
      {
        question: '如何收藏喜欢的壁纸？',
        answer: '在浏览壁纸时，点击壁纸页面中“☆”图标。这样，您就可以方便地在“我的收藏”中找到这些壁纸，随时查看和下载。',
        isOpen: false
      },
      {
        question: '如何联系我们？',
        answer: '如果您在使用过程中遇到任何问题，可以通过小程序的"联系客服"向我们提意见。您也可以通过微信公众号【青柠客】找到我们。',
        isOpen: false
      }
    ],
    isOpen: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  // 展开或隐藏第一个
  isOpenFirstQuestion(){
    this.setData({
      isOpen: !this.data.isOpen
    })
  },

  // 切换问题答案的显示状态
  toggleAnswer(e: any) {
    const index = e.currentTarget.dataset.index;
    const faqList = this.data.faqList.map((item, i) => {
      if (i === index) {
        item.isOpen = !item.isOpen; // 切换展开和收起状态
      }
      return item;
    });
    this.setData({ faqList });
  }
})
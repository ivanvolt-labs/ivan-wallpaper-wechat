Component({
  properties: {
    nodataValue: {
      type: String,
      value: ''
    }
  },
  data: {
    icons: {
      nodata: getApp().globalData.baseIconPath + 'nodata_icon.png'
    }
  }
})
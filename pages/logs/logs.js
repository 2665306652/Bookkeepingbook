// pages/wateruser/wateruser.js
const url = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  // 数据请求
  gitData:function(){
    wx:wx.request({
      url: url.uploadtemp,
      data: {
        submit_name:this.data.src[0],
        old_name:'',
      },
      header: {},
      method: 'POST',
      success: function(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 上传图片
  uploadPicture: function() {
    var _this = this
    wx.chooseImage({
      count: 2, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          src: res.tempFilePaths[0]
        })

      wx:wx.uploadFile({
        url: url.uploadtemp,
        filePath: tempFilePaths[0],
        name:'submit_name',
        formData: {
          submit_name: tempFilePaths[0],
          old_name: '',
        },
        success: function(res) {
          // var data=res.data
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      }
    })
  },
  // submitData:function(){
  //   this.gitData()
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
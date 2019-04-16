/**
 * todo 用户授权界面
 */
const app = getApp();
let middle = require("../../utils/middle.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    resolve: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    this.data.resolve = options.resolve;

  },
  /**
   * TODO: 获取用户信息，然后执行登录的方法，同步用户信息
   * @param {*} e 
   */
  getUserInfo: function (e) {
    // console.log(121212121212)
    let _self = this;
    app.globalData.userInfo = e.detail.userInfo;

    app.getOpenId(app.globalData.userInfo).then((e, v) => {
        wx.redirectTo({
          url: '../login/login',
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });

    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
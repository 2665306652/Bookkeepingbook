// pages/projectList/projectList.js
const app = getApp();
const url = require("../../utils/url.js");
let middle = require("../../utils/middle.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectList: {},
    role_id: "", //用户id
    urlValue: null,
    checkedIndex:null
  },

  itemOne: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      checkedIndex: id
    });
    app.globalData.organizeId = this.data.checkedIndex
    app.setProject({
      organizationname: e.currentTarget.dataset.name,
      id: id
    })
    if (this.data.urlValue == 'water') {
      wx.reLaunch({
        url: "../water/water"
      });
      this.setData({
        urlValue: ''
      })
    } else {
      wx.reLaunch({
        url: "../index/index"
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _self = this

    middle('../projectList/projectList', function(e, v) {
      _self.setData({
        userInfo: app.globalData.userInfo
      })
      _self.getProjectList();
      console.log(options.water, "项目列表")
      if (options.water) {
        _self.setData({
          urlValue: options.water
        })
      }
    })

  },
  //获取所有组织信息，项目列表
  getProjectList() {
    let _self = this;
    wx.request({
      url: url.getorganizationall,
      data: {
        role_id: app.globalData.userInfo.id
      },
      method: 'POST',
      success: function(res) {
        var data = res.data.data;
        _self.setData({
          userInfo: app.globalData.userInfo,
          checkedIndex: app.globalData.organizeId,
          projectList: data
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
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
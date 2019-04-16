// pages/createProject/createProject.js
const app = getApp();
const url = require("../../utils/url.js");
let Middle = require("../../utils/middle.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    determineCreateType:true,//点击提交，避免多次提交
    newUserType:false,//判断是否为新用户
    organizationname: '',
    role_id: null,
    isIphoneX: app.globalData.isIphoneX
  },
  // 获取新增组织
  organizationnameInput: function(e) {
    var addObjectValue = e.detail.value.replace(/\s+/g, '')
    this.setData({
      organizationname: addObjectValue
    });
  },
  // 确认创建一个新的项目
  determineCreate: function(e) {
    if (this.data.determineCreateType){
      let _self = this;
      if (this.data.organizationname == '') {
        wx.showToast({
          title: '项目名称不能为空！',
          image: '../../images/jinggao.png',
          duration: 1000,
          mask: true
        })
      } else {
        _self.setData({
          determineCreateType: false
        })
        wx.request({
          url: url.saveorganization,
          data: {
            organizationname: this.data.organizationname,
            role_id: app.globalData.userInfo.id
          },
          method: "POST",
          success: function (res) {
            wx.showToast({
              title: "成功",
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
              icon: "success", //图标，支持"success"、"loading"
              success: function () {
                app.setProject({
                  organizationname: _self.data.organizationname,
                  id: res.data.data
                });
                if (_self.data.newUserType) {
                  _self.setData({
                    newUserType: false
                  })
                  wx.reLaunch({
                    url: "../index/index"
                  });
                } else {
                  wx.reLaunch({
                    url: "../trueIndex/trueIndex"
                  });
                }

              },
              fail: function () { }
            });
          }
        });
      }
    }else {
      // console.log("不可重复提交")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _self = this;
    Middle("/pages/createProject/createProject", function(e, v) {
      if (options.project=='0'){
        _self.setData({
          newUserType:true
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});

// pages/admin/admin.js
//获取应用实例
const app = getApp()
const url = require('../../utils/url.js')
let Middle = require('../../utils/middle.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true, //修改项目名称
    amendId: null, //修改的项目Id
    addValue: null, //获取修改项目的最新值
    state: null,
    presentCheck: '../../images/presentObject1.png',
    noneCheck: '../../images/presentObject.png',
    objectType: true, //一级展开控制
    // hasUserInfo: false,
    presentObjectId: '', //当前项目id（标记）
    valueType: true,
    userInfo: null,
    listData: [],
  },
  // 数据请求
  getData: function() {
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    const self = this
    wx: wx.request({
      url: url.getorganizationall,
      method: 'POST',
      data: {
        'role_id': app.globalData.userInfo.id
      },
      success: function(res) {
        if(res.data.data!=''){
          let data = res.data.data;
          let id = data[0].id
          // 全局变量赋值
          app.globalData.organizeInformation = data
          app.globalData.organizeId = app.globalData.organizeId ? app.globalData.organizeId:id
          self.setData({
            listData: data,
            state: app.globalData.organizeId,
            // state: app.globalData.projectObj.id,
            objectType: '',

          })
        }
      },
      fail: function(res) {},
      complete: function (res) { wx.hideLoading()},
    })
  },

  // 选中项目
  switchPresent: function(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      state: id
    });
    app.globalData.organizeId = this.data.state
    app.setProject({
      organizationname : e.currentTarget.dataset.name,
      id : id
    })
  },
  // 项目详情：邀请/邀请/人员
  projectObject: function(e) {
    const id = e.currentTarget.id;
    const newdataId = this.data.objectType;
    if (id == newdataId) {
      this.setData({
        objectType: 'null'
      })
      return
    }
    let objectType = id
    this.setData({
      objectType
    })
  },
  // 项目账单详细
  projectWater: function(e) {
    wx.redirectTo({
      url: '../water/water',
    })
    this.switchPresent(e)
  },
  // 项目邀请
  projectJion: function() {
    console.log("项目邀请")
  },
  // 项目人员
  projectCrew: function(e) {
    let valueType = !this.data.valueType
    this.setData({
      valueType
    })
  },
  // 新增项目
  addObject: function() {
    // console.log("跳转")
    wx.navigateTo({
      url: "../createProject/createProject"
    });
  },

  // 修改项目名称
  // modle层的函数 取消
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
      addchValue: ''
    })
  },
  // modle层的函数 确认
  confirmM: function() {
    const self = this;
    wx.request({
      url: url.saveorganization,
      data: {
        role_id: app.globalData.userInfo.id,
        organizationname: self.data.addValue,
        id: self.data.amendId
      },
      method: 'POST',
      success: function(res) {
        let showToastTitle=res.data.msg+''
        // console.log(res.data.msg,11)
        wx.showToast({
          title: showToastTitle,
          duration: 2000, //显示时长
          mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
          icon: 'success', //图标，支持"success"、"loading"  
          success: function() {
            wx.request({
              url: url.getorganizationall,
              data: {
                role_id: app.globalData.userInfo.id
              },
              method: 'POST',
              success: function(res) {
                app.globalData.organizeInformation = res.data.data
                app.globalData.organizeId = self.data.state
                self.setData({
                  listData: res.data.data,
                  addValue: ''
                })
              },
            })
          },
          fail: function() {}
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    self.setData({
      hiddenmodalput: true,
      addValue: ''
    })

  },
  amendProject: function(e) {
    const id = e.currentTarget.id
    this.setData({
      hiddenmodalput: false,
      amendId: id
    })
  },
  // input获取最新值
  verification: function(e) {
    var name = e.detail.value.replace(/\s+/g, '')
    this.setData({
      addValue: name
    })
  },


  // 退出当前项目
  quitProject: function(e) {
    const _self = this
    const id = e.currentTarget.id
    const dataList = this.data.listData
    let organizationname
    let valueData
    if (this.data.listData.length>1){
      wx: wx.request({
        url: url.delorganization,
        data: {
          organizationname: organizationname,
          id: id,
          role_id: app.globalData.userInfo.id,
        },
        method: 'POST',
        success: function (res) {
          wx.showToast({
            title: '成功',
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            icon: 'success', //图标，支持"success"、"loading"  
            success: function () {
              wx.request({
                url: url.getorganizationall,
                data: {
                  role_id: app.globalData.userInfo.id,
                },
                method: 'POST',
                success: function (res) {

                  _self.setData({
                    listData: res.data.data,
                    state: app.globalData.projectObj.id
                  })
                },
              })
            },
            fail: function () { }
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else {
      wx.showToast({
        title: '至少存在一个项目',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function () {
          _self.setData({
            objectType: 'null'
          });
        },
        fail: function () {}
      })
    }
    if (_self.data.state == parseInt(id) && this.data.listData.length >1) {
        for (let i = 0, len = dataList.length; i < len; ++i) {
          if (dataList[i].id == parseInt(id)) {
            valueData = i
          }
        }
        organizationname = dataList.splice(valueData, 1)
        app.setProject({
          id: _self.data.listData[0].id,
          organizationname: _self.data.listData[0].organizationname
        })
        app.globalData.projectObj.organizeInformation = _self.data.listData
        app.globalData.projectObj.id = _self.data.listData[0].id
      // }
    }
  },


  onLoad: function () {
    let _self = this
    Middle('/pages/trueIndex/trueIndex', function(e, v) {
    
      _self.setData({
        userInfo: app.globalData.userInfo
      })
      // 数据请求
      _self.getData()
      // 2/9微信小程序
      wx.showShareMenu({
        // 要求小程序返回分享目标信息
        withShareTicket: true
      });
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  project: function() {
    wx: wx.switchTab({
      url: '../water/water',
    })
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
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '记账簿', //默认是小程序的名称(可以写slogan等)
        path: `pages/index/index?organization_id=${app.globalData.organizeId}&role_id=${app.globalData.userInfo.id}`,
        images: 'http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg',
        success: function(res) {
          // 转发成功
          // console.log("转发成功:" + JSON.stringify(res));
          var shareTickets = res.shareTickets;
          // if (shareTickets.length == 0) {
          //   return false;
          // }
          // //可以获取群组信息
          // wx.getShareInfo({
          //   shareTicket: shareTickets[0],
          //   success: function (res) {
          //     console.log(res)
          //   }
          // })
        },
        fail: function(res) {
          // 转发失败
          // console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }

  }
})
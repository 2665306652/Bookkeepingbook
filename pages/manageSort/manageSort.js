// pages/manageSort/manageSort.js
const url = require('../../utils/url.js')
let middle = require("../../utils/middle.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateType: false,
    shadowType: true,
    array: [],
    addValue: '', //新增value
    modificationvalue: '', //修改value
    hiddenmodalput: true,
    modleType: false,
    compileId: '',
    isIphoneX: app.globalData.isIphoneX
  },

  getData: function() {
    const self = this
    wx: wx.request({
      url: url.manageSort,
      data: {
        'organization_id': app.globalData.projectObj.id,
        'nature': self.data.shadowType?1:2
      },
      method: 'POST',
      success: function(res) {
        // 请求数据的处理
        var data_ = res.data.data
        app.globalData.manageSort.names = data_;
        self.setData({
          array: data_
        })
      },
      fail: function() {}
    })
  },
  //支出
  expenditure: function() {
    if (!this.data.shadowType) {
      // 数据请求
      this.setData({
        shadowType: true,
        // array: app.globalData.manageSort.names
      },
        () => this.getData())
    }
  },
  //收入
  income: function() {
    if (this.data.shadowType) {
      this.setData({
        shadowType: false,
        // array: app.globalData.manageSort.names
      },
      () => this.getData()
      )
    }
  },

  //管理类别数据的修改和删除
  manageSortoperation: function(e) {
    const id = e.currentTarget.id;
    const newdataId = this.data.stateType;
    if (id == newdataId) {
      this.setData({
        stateType: 'null'
      })
      return
    }
    let stateType = id
    this.setData({
      stateType
    })
  },
  // 编辑修改
  compileData: function(e) {
    var id = parseInt(e.currentTarget.id)
    var newData
    const array = this.data.array;
    for (let i = 0, len = array.length; i < len; ++i) {
      if (array[i].id === id) {
        newData = array[i].names
      }
    }
    this.setData({
      modleType: false,
      modificationvalue: newData,
      hiddenmodalput: false,
      compileId: id
    })
    // this.getData()
  },
  // 编辑删除
  deletData: function(e) {
    var id = parseInt(e.currentTarget.id)
    const array = this.data.array
    const self = this
    wx.showModal({
      title: '删除管理类别',
      content: '引用该类别的账单记录会被同时删除,确定是否删除?',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.request({
            url: url.delfategorybyid,
            data: {
              'id': id
            },
            method: 'POST',
            success: function (res) {
              let msgData = res.data.msg + ''
              wx.showToast({
                title: msgData,
                duration: 2000
              })
              self.getData()
            },
            fail: function () {
              wx.showToast({
                title: res.data.msg,
                duration: 2000
              })
            }
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _self = this
    middle('/pages/trueIndex/trueIndex', function (e, v) {
      _self.getData()
      if (options.a=='1'){
        _self.addData()
      }
    })
   
  },
  // 新增管理类别
  addData: function() {
    this.setData({
      hiddenmodalput: false,
      modleType: true
    })
  },


  // modle层的函数
  // 取消
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
      addchValue: ''
    })
  },
  // 确认增加
  confirmM: function() {
    const self = this;
    if (this.data.modleType) {
      if (this.data.addValue == '') {
        wx.showToast({
          title: '请输入类别名称？',
          image: '../../images/jinggao.png',
          duration: 1000,
          mask: true
        })
      } else {
        // 调用接口
        wx: wx.request({
          url: url.savefategory,
          data: {
            "names": this.data.addValue,
            "nature": self.data.shadowType ? 1 : 2,
            "organization_id": app.globalData.projectObj.id,
            "role_id": app.globalData.userInfo.id,
          },
          method: 'POST',
          success: function(res) {
            let msgData = res.data.msg + ''
            wx.showToast({
              title: msgData,
              duration: 2000
            })
            self.getData()
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    } else {
      // 调用接口
      wx: wx.request({
        url: url.savefategory,
        data: {
          "names": this.data.modificationvalue,
          "nature": self.data.shadowType ? 1 : 2,
          "organization_id": app.globalData.projectObj.id,
          "role_id": app.globalData.userInfo.id,
          "id": this.data.compileId
        },
        method: 'POST',
        success: function(res) {
           let msgData = res.data.msg+''
                    wx.showToast({
                      title: msgData,
                      duration: 2000
                    })
          self.getData()
          self.setData({
            hiddenmodalput: true,
            addValue: ''
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    this.setData({
      hiddenmodalput: true,
      addValue: ''
    })

  },
  verification: function(e) {
    var name = e.detail.value.replace(/\s+/g, '')
    if (this.data.modleType) {
      this.setData({
        addValue: name
      })
    } else {
      this.setData({
        modificationvalue: name
      })
    }
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
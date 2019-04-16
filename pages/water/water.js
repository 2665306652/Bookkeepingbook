// pages/water/water.js
const util = require('../../utils/util.js')
const url = require('../../utils/url.js')
let middle = require("../../utils/middle.js");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    focus:false,//点击搜索唤醒键盘
    stateType: true,
    hiddenmodalput: true,
    searchValue: '',
    date: '',
    date2: '',
    switchoverType: '',
    moneyNumber: 0,
    statistics: [],
    expenditureData: [],
    incomeData: [],
  },
  // 项目切换图标
  projectSwitcher: function() {
    wx.navigateTo({
      url: "../projectList/projectList?water=water"
    });
  },
  // 支出
  expenditureWay: function() {
    if (!this.data.switchoverType) {
      this.setData({
        switchoverType: true,
        statistics: this.data.expenditureData
      })
      app.globalData.manageSort.nature = 1
      this.gitSum()
    }
  },
  // 收入
  incomeWay: function() {
    if (this.data.switchoverType) {
      this.setData({
        switchoverType: false,
        statistics: this.data.incomeData
      })
      app.globalData.manageSort.nature = 2
      this.gitSum()
    }
  },
  // 对后台数据进行处理
  dataDispose: function(allData) {
      let self = this
      let expenditureData = [];
      let incomeData = [];
      if(allData){
        for (let i = 0, allLength = allData.length; i < allLength; ++i) {
          if (allData[i].flowingimg != null) {
            allData[i].flowingimg = allData[i].flowingimg.slice(3)
          }
          if (allData[i].nature === "1") {
            expenditureData.push(allData[i])
          } else {
            incomeData.push(allData[i])
          }
        }
      }
     
      self.setData({
        expenditureData,
        incomeData,
        statistics: getApp().globalData.manageSort.nature == 1 ? expenditureData : incomeData,
      })
  },
  // 获取合计数据
  gitSum: function() {
    let gitnumber = 0;
    let allData = this.data.statistics;
    let numberExamine=0//判断数据是否有小数点（需要处理）
    let sumMultiple='1'//总倍数

    let multipleLength
    let newallData=[]//避免数据霍乱，将数据的数据放置新数组计算
    let maxMultiple=[] 
    // 判断是否需要处理数据
    for (let i = 0, len = allData.length; i < len; ++i) {
      if (allData[i].money.split('.')[1]){
        numberExamine += parseInt(allData[i].money.split('.')[1].length)
        maxMultiple.push(allData[i].money.split('.')[1].length)
      }else {
      }
    }

    for (var i = 0; i < maxMultiple.length; i++) {
      multipleLength =maxMultiple[0];
      for (var i = 0; i < maxMultiple.length; i++) {
        if (multipleLength < maxMultiple[i]) {
          multipleLength = maxMultiple[i]
        }
      }
    }
    for (let i = 0, len = multipleLength; i < len; ++i) {
      sumMultiple+='0'
    }
    sumMultiple = sumMultiple*1
    if (numberExamine>0){
      // console.log('需要处理点数')
      // 全部变整
      for (let i = 0, len = allData.length; i < len; ++i) {
        newallData.push(allData[i].money * 1 * sumMultiple)
      }
      for (let i = 0, len = newallData.length; i < len; ++i) {
        gitnumber += newallData[i]
      }
      this.setData({
        moneyNumber: gitnumber / sumMultiple
      })
      // console.log(this.data.moneyNumber, '总数', newallData, '消除浮点数组', gitnumber, '消除浮点总数', sumMultiple, '倍数',maxMultiple,'浮点最大长度')   
    }else {
      // console.log('不需要处理点数')
      for (let i = 0, len = allData.length; i < len; ++i) {
        gitnumber += allData[i].money*1
      }
      this.setData({
        moneyNumber: gitnumber
      })
    }
  },
  // 数据请求 
  dataRequest: function() {
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    let self = this
    wx.request({
      url: url.water,
      data: {
        'role_id': app.globalData.userInfo.id,
        's_time': this.data.date.replace(/-/g, '/'),
        'e_time': this.data.date2.replace(/-/g, '/'),
        'organization_id': app.globalData.projectObj?app.globalData.projectObj.id:'默认项目'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data<1){
          return false
        }else {
          self.dataDispose(res.data.data)
        }
        self.gitSum()
      },
      fail: function(res) {
        wx.showToast({
          title: '网络请求失败',
          content: '',
          showCancel: true,
        })
      },
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },
  // 日期选择
  bindDateChange(e) {
    this.setData({
      date: e.detail.value.replace(/-/g, '/')
    })
    this.dataRequest()
  },
  bindDateChange2(e) {
    this.setData({
      date2: e.detail.value.replace(/-/g, '/')
    })
    this.dataRequest()
  },
  // 增加一个新的项目
  addUItems: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  // 搜索
  searchData: function() {
    this.setData({
      hiddenmodalput: false,
      focus:true
    })
  },
  // 搜索值
  verification: function (e) {
    var name = e.detail.value.replace(/\s+/g, '')
    this.setData({
      searchValue: name
    })
  },
  // 键盘完成/搜索事件
  bindconfirmsearch:function(){
    const self = this
    // wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    if (this.data.searchValue == '') {
      wx.showToast({
        title: '关键字为空？',
        image: '../../images/jinggao.png',
        duration: 1000,
        mask: true
      })
    } else {
      // 调用接口
      wx.request({
        url: url.water,
        data: {
          "role_id": app.globalData.userInfo.id,
          "s_time": this.data.date,
          "e_time": this.data.date2,
          'keywordsearch': this.data.searchValue,
          'organization_id': app.globalData.projectObj ? app.globalData.projectObj.id : '默认项目'
        },
        method: 'POST',
        success: function (res) {
          if(res.data.code==200){
            if (res.data.data){
              const showTitle = res.data.msg + ''
              wx.showToast({
                title: showTitle,
                icon: 'success',
                duration: 2000,
                
              })
            }else {
              wx.showToast({
                title: '没有符合数据',
                icon: 'none',
                duration: 2000
              })
            }
          }
          self.dataDispose(res.data.data)
        },
        fail: function (res) { },
        complete: function (res) { 
          // wx.hideLoading()
          },
      })
    }
  },
  // 取消搜索
  cancelSearch:function(){
    this.setData({
      focus: false,
      searchValue:''
    })
    this.dataRequest();
  },
  // 清空搜索内容
  cancelValue:function(){
    this.setData({
      searchValue:'',
      focus: true
    })
  },
  // 对数据的修改/删除
  kindToggle: function(e) {
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
  // 修改
  allinformationModification: function(e) {
    const id = e.currentTarget.id;
    app.globalData.activeIndex = id

    wx.redirectTo({
      url:`../index/index?id=${id}`,
    })
    this.setData({
      stateType: true,
    })
  },
  // 删除
  allinformationDelete: function(e) {
    const id = e.currentTarget.id;
    const self = this
    app.globalData.id = id
    const statistics = this.data.statistics
    let titleValue = ''
    for (let i = 0, len = statistics.length; i < len; ++i) {
      if (statistics[i].id === parseInt(id)) {
        titleValue = statistics[i].title
      }
    }
    wx.showModal({
      title: '提示',
      content: '确定删除' + titleValue + '吗？',
      // 调用数据
      success: function(res) {
        if (res.confirm) {
         wx.request({
            url: url.waterDelete,
            data: {
              'role_id': app.globalData.userInfo.id,
              'id': id
            },
            method: 'POST',
            success: function(res) {
              let showTitle = res.data.msg + ''//wx.showToast需要的是一个字符串，会引起报错
              
              if(res.data.code==200){
                wx.showToast({
                  title: showTitle,
                  icon: 'success',
                  duration: 2000,
                  success: () => {
                    self.dataRequest()
                  }
                })
              }else {
                wx.showToast({
                  title: showTitle,
                  icon: 'success',
                  duration: 2000
                })
              }
             
            },
            fail: function() {}
          })
        }
      }

    })
  },

  // 修改NavigationBarTitle名称
  recomposeTitle: function(userId, userArray) {
    let navigationTitle = "";
    for (let i = 0, allLength = userArray.length; i < allLength; ++i) {
      if (userArray[i].id == parseInt(userId)) {
        navigationTitle = userArray[i].organizationname;
      }
    }
    wx.setNavigationBarTitle({
      title: navigationTitle ? navigationTitle : '默认项目'
    });
   
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let _self = this

    var TIME = util.formatTime(new Date()).replace(/-/g, '/');
    _self.setData({
      date: (TIME + '-01').replace(/-/g, '/'),
      date2: (TIME + '-30').replace(/-/g, '/'),
      // switchoverType: getApp().globalData.manageSort.nature == 1 ? true : false
    });
    middle('/pages/trueIndex/trueIndex', function (e, v) {
     _self.dataRequest();
      _self.recomposeTitle(
        app.globalData.organizeId,
        app.globalData.organizeInformation
      );
      _self.setData({
        switchoverType: getApp().globalData.manageSort.nature == 1 ? true : false
      });

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
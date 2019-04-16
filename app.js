//app.js
const app = getApp();
const url = require("utils/url");
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    //本地储存

    // wx.setStorage({
    //   key: 'id', //自己去的key名，必须有，因为调用时会用到
    //   data: ''
    // });
    // //本地调用
    // wx.getStorage({
    //   key: 'id', //对应存储的key名
    //   success: function(res) {
    //     //成功之后的操作，建议还是先打印res找到需要的东西
    //   }
    // });
    // this.storAge()
  },

  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },
  //本地储存
  setProject(project) {
    let _self = this;
    project.organizationname = project.organizationname ?  project.organizationname : '默认项目'
    _self.globalData.projectObj = project;
    wx.setStorageSync("projectObj",project);
    // console.log('当前组织id:',project)
  },
  //本地调用
  getProject: function () {
    return wx.getStorageSync("projectObj");
  },
  getSetting: function() {
    let _self = this;
    return new Promise(function(resolve, reject) {
      if (_self.globalData.userInfo) {
        resolve({
          status: true,
          projectId : true,
          data: _self.globalData.userInfo
        });
      } else {
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting["scope.userInfo"]) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  _self.globalData.userInfo = res.userInfo;
                  _self.getOpenId(res.userInfo).then((e, v) => {
                    // console.log(e,1111111)
                    if (!e.projectId) {
                      resolve({
                        status : true,
                        projectId : false
                      });
                    } else {
                      if (_self.userInfoReadyCallback) {
                        _self.userInfoReadyCallback(res);
                      }
                      resolve({
                        status: true,
                        projectId : true,
                        data: e.data
                      });
                    }
                  });
                  // // console.log(res, 123);
                  // // 可以将 res 发送给后台解码出 unionId

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                }
              });
            } else {
              resolve({
                status: false,
                data: null
              });
            }
          }
        });
      }
    });
  },

  getOpenId: function(userInfo) {
    let _self = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: ref => {
          // console.log('login:', userInfo);
          // Api._ajax({

          // })
          wx.request({
            url: url.index,
            data: {
              // appid: _self.globalData.appid,
              // secret: _self.globalData.secret,
              code: ref.code,
              nickname: userInfo.nickName,
              avatar: userInfo.avatarUrl
              // grant_type: 'authorization_code'
            },
            // method: 'GET',
            success: function(res) {
              var obj = {};
              // obj.openid = res.data.data;
              // _self.globalData.userInfo = Object.assign({},_self.globalData.userInfo,res.data.data)
              _self.globalData.userInfo = Object.assign(
                {},
                _self.globalData.userInfo,
                res.data.data
              );

              if (!_self.globalData.projectObj.id) {
                var project = _self.getProject();

                if (!project.id) {
                  if (_self.globalData.userInfo.organization_id) {
                    // _self.globalData.projectId = _self.globalData.userInfo.organization_id
                    _self.setProject(
                      {
                        organizationname : '默认项目',
                        id : _self.globalData.userInfo.organization_id
                      }
                      
                    );
                  } else {
                    resolve({
                      projectId: false
                    });
                  }
                }else{

                  _self.globalData.projectObj = project;
                }
              }

              // _self.globalData.userInfoToo = res.data.data; //这条数据是后面用轮询
              wx.setStorageSync("user", _self.globalData.userInfo); //存储openid
              // wx.setStorageSync("id", _self.globalData.organization_id);//存储项目id
              resolve({
                projectId : true,
                data : _self.globalData.userInfo
              });
            }
          });
        }
      });
    });
  },

  globalData: {
    isIphoneX:false,
    organization_id: null,
    userInfo: null,
    openid: "",
    code: null,
    avatar: null,
    // activeIndex: null,
    // 管理类别的数据
    // 用户Id(测试)
    userId: "1",
    manageSort: {
      nature: 1,
      names: [],
      pickerData: [],
      newdata: ""
    },
    // 项目名称，定义全局，项目切换/navigationBarTitleText的设置-->时机获取（需要考虑）
    organizeInformation: [],
    organizeId: null, //当前选中的组织ID，有一个默认值,
    projectId: null,
    projectObj : {}
  }
});

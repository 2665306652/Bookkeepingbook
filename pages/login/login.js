//index.js
//获取应用实例
const app = getApp()
const url = require('../../utils/url.js')
let middle = require("../../utils/middle.js")


Page({
  data: {
    getCodeTypr: true,
    timegetTypr:true,
    isHide: true,
    motto: 'Hello World',
    userInfo: app.globalData.userInfo,
    code: "",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 姓名
    nameNum: "",
    //电话号码
    phoneNum: '',
    //职务
    postNUm: "",
    //验证码
    codeNum: '',
    id: "",
    //秘钥
    decryptcode: "",
    //权限
    jurisdiction: '',
    //账户审核状态
    approvalstatus: "",
    //获取验证码文本
    getCodeTxt: "获取验证码",
    //倒计时
    wait: 60,
    //是否点击获取验证码
    getCodeState: false,
  },
  nameNumChange(e) { //取到姓名
    this.setData({
      nameNum: e.detail.value
    })
  },
  phoneNumChange(e) { //取到电话号码
    this.setData({
      phoneNum: e.detail.value
    });
  },
  postNumChange(e) {
    this.setData({
      postNUm: e.detail.value
    })
  },
  codeNumChange(e) { //取到验证码
    this.setData({
      codeNum: e.detail.value
    });
  },
  getCode() {
    //点击获取验证码接口
    if (/^\s+$/.test(this.data.phoneNum) || this.data.phoneNum === "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      });

      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(this.data.phoneNum))) {
      wx.showToast({
        title: '手机号输入错误',
        icon: 'none'
      });
      return false;
    }
    if (this.data.timegetTypr){
      let _self = this
      wx.request({
        url: url.phone,
        data: {
          phone: _self.data.phoneNum,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          _self.setData({
            //存接口返回值
            decryptcode: res.data.data,
            getCodeTypr: false,
            timegetTypr:false
          })
          // console.log(res.data, 3333)
        }
      })

      let {
        phoneNum,
        wait
      } = this.data;
      if (wait !== 60) {
        return false;
      };
      let bstop = this.phoneNum;
      this.setData({
        getCodeState: true
      });
      this.countDown();
      wx.showToast({
        title: '验证码发送成功！',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '请稍后重新获取验证码',
        icon: 'none'
      })
    }

  },
  countDown() { //倒计时
    const self = this;
    let {
      wait
    } = this.data;

    if (wait === 0) {
      this.setData({
        getCodeTxt: "获取验证码",
        getCodeState: false,
        wait: 60,
        timegetTypr:true,
        getCodeTypr: true
      });
      return false;
    } else {
      wait--;
      this.setData({
        getCodeTxt: `${wait}s后重新获取`,
        getCodeTypr:false,
        timegetTypr:false,
        wait
      });
      setTimeout(function() {
        self.countDown();
      }, 1000)
    }
  },
  
  primary() { //注册
    const self = this;
    const {
      nameNum,
      phoneNum,
      postNUm,
      codeNum,
      getCodeTypr
    } = self.data;

    // const nameNum=new RegExp('[0-9]','g');//判断用户输入的是否为数字
    // const rsNum=nameNum.exec(e.detail.value);
    // console.log(nameNum,1111)
    if (/^\s+$/.test(nameNum) || nameNum === "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      });
      return false;
    }
    // else if(nameNum){
    //   wx.showToast({
    //     title: '不能输入数字',
    //     icon: 'none'
    //   });
    // }
    if (/^\s+$/.test(postNUm) || postNUm === "") {
      wx.showToast({
        title: '请输入职务',
        icon: 'none'
      });
      return false;
    }
    if (/^\s+$/.test(phoneNum) || phoneNum === "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      });

      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号输入错误',
        icon: 'none'
      });
      return true;
    }


    if (getCodeTypr) {
      wx.showToast({
        title: '请先获取验证码',
        icon: 'none'
      });
    } else if (/^\s+$/.test(codeNum) || codeNum === "") {
      wx.showToast({
        title: '请先输入验证码',
        icon: 'none'
      });
      return false;
    } else if (codeNum.toString().length < 6 ) {
      wx.showToast({
        title: '请输入正确的六位验证码',
        icon: 'none'
      });
      return false;
    } else {
      //完善用户信息
      wx.request({
        url: url.login,
        data: {
          username: nameNum,
          phone: phoneNum,
          id: this.data.userInfo.id,
          position: postNUm,
          code: codeNum,
          //调取接口值
          decryptcode: this.data.decryptcode,

        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 200) {
            // app.globalData.userInfo = app.globalData.userInfo ? res.data.data : app.globalData.userInfo
            app.globalData.userInfo=res.data.data
            console.log(res.data.data,app.globalData.userInfo,88888)
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              success: function () {
                // app.globalData.userInfo = res.data.data
                wx.redirectTo({
                  url: "../index/index"
                });
              }
            });
          } else {
            let titleMsg = res.data.msg + ''
            wx.showToast({
              title: titleMsg,
              icon: 'none'
            });
          }

        },
      })
    }


  


  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    const _self = this
    _self.setData({
      userInfo: app.globalData.userInfo,

    }, () => {

    })




  },
  onShow() {
    // middle('../login/login',function(e,v){
    //   console.log(app.globalData.userInfo)
    //   _self.setData({
    //     userInfo: app.globalData.userInfo
    //   })


    // })
  },
  // getUserInfo: function(e) {

  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
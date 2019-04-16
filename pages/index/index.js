//获取应用实例
const app = getApp();
const util = require("../../utils/day.js");
const url = require("../../utils/url.js");
let middle = require("../../utils/middle.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:'',
    pickerValue:null,
    returnSort:'',
    hasImg: false,
    primaryType: true, //避免多次出发事件
    mydata: {},
    requestImg: '',
    updataImg: '', //创建新数据（图片路径直接冲本地获取）
    title: "添加成功啦~~",
    activeIndex: null,
    //组织id
    organization_id: 1,
    open: false,
    id: "",
    //用户id
    role_id: "",
    //类别id
    fategory_id: "",
    moneyNum: "",
    titleNum: "",
    textarea: "",
    date: "",
    tempFilePaths: [],
    tempFiles: [],
    nature: null,
    //tab切换
    shadowType: true,
    array: [],
    result: "",
    projectObj: null,
    indexType: false, //监测是否为修改数据，index的取值
    amendImg: null
  },

  //获取标题
  //获取金额
  titleNumChange(e) {
    this.setData({
      titleNum: e.detail.value
    });
  },
  textareaChange(e) {
    this.setData({
      textarea: e.detail.value
    });
  },
  //获取金额
  moneyNumChange(e) {
    let moneyValue = e.detail.value
    let re = moneyValue.split(".");

    if (re.length > 2) {
      let stateSting = re[0]
      let allSting = moneyValue.replace(/\./g, "");
      let newvalue = allSting.replace(stateSting, stateSting + '.')
      this.setData({
        moneyNum: newvalue
      })
    } else {
      if (moneyValue.indexOf(".") == 0) {
        this.setData({
          moneyNum: '0' + moneyValue
        })
      } else {
        this.setData({
          moneyNum: moneyValue
        })
      }
    }
  },

  // 类别选择器
  bindPickerChange(e) {
    let _self = this;
    let item = _self.data.projectObj[e.detail.value];
    this.setData({
      pickerValue: false,
      index: e.detail.value,
      fategory_id:item.id
    });
  },

  //日期选择器
  bindDateChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value.replace(/-/g, '/'),
      pickerValue:false
    });
  },

  // 数据请求(wpf)
  getData: function(callback) {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    if (app.globalData.projectObj.id) {
      const self = this;
      let nature = app.globalData.manageSort.nature
      wx.request({
        url: url.manageSort,
        data: {
          'organization_id': app.globalData.projectObj.id,
          'nature': nature
        },
        method: "POST",
        success: function(res) {
          if (res.data.data != '' && res.data.data != undefined) {
            // 请求数据的处理
            var data_ = res.data.data;
            var newData_ = [];
            for (let i = 0, len = data_.length; i < len; ++i) {
              newData_.push(data_[i].names);
            }
            app.globalData.manageSort.names = res.data.data;
            app.globalData.manageSort.pickerData = newData_;
            self.setData({
                array: newData_,
                projectObj: data_,
                fategory_id: self.data.fategory_id ? self.data.fategory_id : data_[0]["id"],
                nature: app.globalData.manageSort.nature,
                shadowType: app.globalData.manageSort.nature == 1 ? true : false,
                index: self.data.indexType ? self.data.index : 0,
              // returnSort: self.data.returnSort ? self.data.returnSort:'选择类别'
              },
            
              () => {
                callback && callback();
              }
            )
            ;
          } else {
            console.log('No')
          }
        },
        fail: function(res) {},
        complete: function(res) {
          wx.hideLoading()
        },
      });
    } else {

    }

  },

  //支出
  expenditure: function() {
    if (!this.data.shadowType) {
      app.globalData.manageSort.nature = 1;
      this.setData({
          shadowType: true,
          index: 0
        },
        () => {
          // 数据请求
          this.getData();
        }
      );
    }
  },

  //收入
  income: function() {
    if (this.data.shadowType) {
      app.globalData.manageSort.nature = 2;
      this.setData({
          shadowType: false,
          index: 0
        },
        () => {
          this.getData();
        }
      );
    }
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

  // 根据ID获取信息
  getIdData:function(){
    let self = this
    wx.request({
      url: url.getfinancialinfobyid,
      data: {
        id: self.data.activeIndex //流水id
      },
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      success: function (res) {
        var typeIndex = null;
        var itemID = res.data.data.names+''
        let array = app.globalData.manageSort.names
        let arrayObject = app.globalData.manageSort.pickerData
        let fategory_id=null
        if (array.length > 0) {
          for (var i = 0, len = array.length; i < len; i++) {
            if (itemID == array[i].names) {
              typeIndex = i;
              fategory_id = array[i].id
            }else{
              fategory_id = ''
            }
          }
        }
        
        if (res.data.data.flowingimg) {
          self.setData({
            hasImg: true
          })
        }
        console.log(itemID, array,arrayObject,fategory_id,'当前类型Id')
        self.setData({
          returnSort: res.data.data.names,
          textarea: res.data.data.remark,
          titleNum: res.data.data.title,
          title: "修改成功啦~~",
          moneyNum: res.data.data.money,
          date: res.data.data.fdate.replace(/-/g, '/'),
          // index: typeIndex,
          indexType: true,
          fategory_id:fategory_id,
          updataImg: res.data.data.flowingimg?'http://192.168.3.213/financialcenter/web/' + res.data.data.flowingimg.slice(3):'',
          amendImg: res.data.data.flowingimg,
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date()).replace(/-/g, '/');
    self.setData({
      date: time
    });
    middle("../index/index", function(e, v) {
      self.getData()
      // if()
      // 需要判断是否有项目存在
      wx.request({
        url: url.getorganizationall,
        method: 'POST',
        data: {
          'role_id': app.globalData.userInfo.id
        },
        success: function(res) {
          if (res.data.data == '') {
            wx.redirectTo({
              url: "../createProject/createProject?project=0"
            });
          } else {
            let data = res.data.data;
            let id = data[0].id
            // 全局变量赋值
            app.globalData.organizeInformation = data
            app.globalData.organizeId = app.globalData.organizeId ? app.globalData.organizeId : id
            self.recomposeTitle(
              app.globalData.organizeId,
              app.globalData.organizeInformation
            );
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })

      self.setData({
        date: time,
        userInfo: app.globalData.userInfo,
        shadowType: app.globalData.manageSort.nature == 1 ? true : false,
        nature: app.globalData.manageSort.nature
      });

      // wpf 判断是否邀请好友进来（待测试）
      if (options.organization_id) {
        wx.request({
          url: url.inviteaddorganization,
          data: {
            organization_id: options.organization_id,
            role_id: options.role_id
          },
          method: "POST",
          dataType: "json",
          success: function(res) {
            var data = res.data;
            if (data.res === "您已加入了该项目") {
              wx.showToast({
                title: data.msg,
                icon: 'null',
                duration: 1000 //持续的时间
              })

            } else {
              wx.showModal({
                title: "项目邀请",
                content: data.msg, //内容为后台返回的msg数据
                success: function(res) {
                  if (res.cancel) {
                    // 取消
                  } else {
                    wx.request({
                      url: url.addorganizationuser,
                      data: {
                        organization_id: options.organization_id,
                        role_id: options.role_id
                      },
                      method: "POST",
                      success: function(res) {
                        // 请求成功
                        wx.showToast({
                          title: "成功", //提示文字
                          duration: 2000, //显示时长
                          mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
                          icon: "success"
                        });
                      },
                      fail: function(res) {},
                      complete: function(res) {}
                    });
                  }
                },
                fail: function(res) {},
                complete: function(res) {}
              });
            }
          },
          fail: function(res) {},
          complete: function(res) {}
        });
      } else {
        // console.log(options, "当前为空");
      }
      // 判断是否是修改的数据
      if (options.id) {
        self.setData({
          activeIndex: options.id,
          pickerValue:true
        });
        self.getIdData()
      } else {
        self.setData({
          pickerValue: false
        })
      }
      // self.getData()
    });
  },

  primary() {
    //确定
    // 金额处理
    const moneyNumnew = this.data.moneyNum
    if (moneyNumnew.charAt(moneyNumnew.length - 1) == '.') {
      let newmonerValue = moneyNumnew.split('.')[0]
      this.setData({
        moneyNum: newmonerValue
      })
    } else if (moneyNumnew*1== 0) {
      this.setData({
        moneyNum: ''
      })
    }

    if (this.data.primaryType) {
      const self = this;
      const {
        moneyNum,
        titleNum,
        primaryType
      } = self.data;

      if (/^\s+$/.test(titleNum) || titleNum === "") {
        wx.showToast({
          title: "标题不能为空",
          icon: "none"
        });
        return false;
      }

      if (/^\s+$/.test(moneyNum) || moneyNum === "") {
        wx.showToast({
          title: "金额不能为空",
          icon: "none"
        });
        return false;
      }
      self.setData({
        primaryType: false
      })
      //保存财务信息
      wx.request({
        url: url.savefinancial,
        data: {
          title: titleNum,
          nature: self.data.shadowType ? 1 : 2, //1.支出，2 收入
          money: moneyNum,
          fdate: self.data.date.replace(/-/g, '/'),
          organization_id: app.globalData.projectObj.id,
          fategory_id: self.data.fategory_id,    //dssad
          role_id: app.globalData.userInfo.id,
          remark: self.data.textarea,
          id: self.data.activeIndex,
          flowingimg: self.data.requestImg ? self.data.requestImg : self.data.amendImg
          // flowingimg: self.data.hasImg ? self.data.amendImg : self.data.requestImg
        },
        // header: {
        //   "content-type": "application/json"
        // },
        method: "post",
        success: function(res) {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000,
            mask: true
          });
          self.setData({
            titleNum: "",
            nature: null,
            moneyNum: "",
            textarea: "",
            fdate: "",
            role_id: "",
            updataImg: '',
            amendImg: '',
            fategory_id:'',
            primaryType: true
          }, );

          setTimeout(function() {
            wx.reLaunch({
              url: '../water/water',
            })
          }, 500)
        },
        fail: function(res) {},
        complete: function(res) {},

      });
    }

    // 数据清空
    // app.globalData.activeIndex = null
  },

  chooseImage: function() {
    //上传图片
    let self = this
    wx.chooseImage({
      count: 1,//限制上传图片数量
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: url.photo,
          filePath: tempFilePaths[0],
          name: "submit_name",
          formData: {
            old_name: "test"
          },
          success(res) {

            let requestImg = JSON.parse(res.data).data
            wx.showToast({
              title: "上传成功",
              icon: "none"
            });
            self.setData({
              updataImg: tempFilePaths[0],
              requestImg
            })
            // do something
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  // // 管理类别
  manageSort: function() {
    this.setData({
      indexType: false
    })
    wx.navigateTo({
      url: "../manageSort/manageSort"
    });
  },
  //项目列表
  projectList: function() {
    wx.navigateTo({
      url: "../projectList/projectList?a=1",
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this
    self.setData({
      nature: app.globalData.manageSort.nature,
    });
    self.getData()
    if (self.data.activeIndex){
      self.getIdData()
    }
  },

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
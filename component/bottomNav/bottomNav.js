// component/bottomNav/bottomNav.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checkedIndex: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null   // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    
  },

  data: {
    wantSell: '',
    skipCenter: '',
    isIphoneX: app.globalData.isIphoneX
  },

  ready() {
    const self = this;
    self.loop.call(self, self.getOpenid);
  },

  methods: {
    wantSell() {
      let self = this;
      wx.reLaunch({
        url: self.data.wantSell
      })
    },
    loop(cb) {
      const self = this;
      let i = 200;
      let timer = setInterval(() => {
        i--;
        cb && cb.call(self, timer);
        if (!i) {
          clearInterval(timer);
          console.log('stop loop');
        }
      }, 50);
    },
    getOpenid(timer) {
      const self = this;
        clearInterval(timer);
        self.setData({
          wantSell: '../../pages/water/water',
          skipCenter: '../../pages/trueIndex/trueIndex'
        });
      
    },
    onSkipCenter() {
      let self = this;
      wx.reLaunch({

        url: self.data.skipCenter
      })
    }
  }
})

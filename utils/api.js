var Api = {
    /**
     * todo ajax请求的二次封装
     * @param {*} config 
     */
    _ajax: function (config) {
        //   let header = {
        //     'token': 'kkk000',
        //     'content-type': 'application/x-www-form-urlencoded',
        //   };
        //   header = config.header ? {...header, ...config.header} : header;
        wx.request({
            url: config.url,
            data: config.data,
            header: config.header ? config.header : {
                'content-type': 'application/json'
            },
            method: config.type ? config.type : 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                config.success(result.data)
            },
            fail: () => {
                console.log(config.url + '接口异常')
            },
            complete: () => {}
        });
    },
}
module.exports = Api;
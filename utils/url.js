let local = 'http://192.168.3.213/financialcenter/web/';
// let local = 'http://2kf1951144.51mypc.cn:14432/';//吕凯本地接口
let url = {
  'index' : local + 'userlogin',//第一次登陆
  "login": local + 'saveroleinfo',//完善用户信息
  'photo':local + 'uploadtemp',//上传图片接口
  'savefinancial': local +'savefinancial',//保存财务信息
  'savefategory': local +'savefategory',//保存财务类别
  'getorganizationall': local +'getorganizationall',//获取所有组织信息
  'manageSort':local+ 'getfategorybyorganizationid',// 获取财务类别信息
  'getfinancialinfobyid':local+'getfinancialinfobyid',//跳转修改保存
  "water": local +'getfinancialbybasiccondition',//获取流水信息
  "waterDelete": local + 'delfinancialbyid',//删除流水信息
  'phone':local + "sendmessage",//验证码
  "login": local + 'saveroleinfo',//完善用户信息
  "uploadtemp": local + 'uploadtemp',//上传图片
  "manageSort": local + 'getfategorybyorganizationid',//管理类别
  "savefategory": local + 'savefategory',//保存类别（增加一个类别）
  "delfategorybyid": local + 'delfategorybyid',//删除类别(第二步)
  "getorganizationall": local + 'getorganizationall',//获取组织信息
  "getbyidfinanciallist": local + 'getbyidfinanciallist',//删除类别(第一步)
  "saveorganization": local + 'saveorganization',//创建项目
  "inviteaddorganization": local + 'inviteaddorganization',//邀请加入项目
  "addorganizationuser": local + 'addorganizationuser',//确定加入项目
  "saveorganization": local + 'saveorganization',//创建项目
  "delorganization": local + 'delorganization',//删除项目
   "getroleinfo": local + 'getroleinfo',//判断用户是否已经登录
};

module.exports = url;
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
db = cloud.database()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const method = event.method
  const item = event.item
  if(!method){
    return {code: 500, info:"缺少参数"}
  }
  if(!openId){
    return {code: 500, info:"openid获取失败"}
  }
  if(!item){
    return {code: 500, info:"请求数据丢失"}
  }
  if(method == "add"){
    await db.collection("sos")
    .add({
      data: {
        openId: openId, // 失主
        codename: item.codename,
        name: item.name,
        codename: item.codename,
        phone: item.phone,
        qq: item.qq,
        wx: item.wx,
        content: item.content,
        createTime: new Date().getTime(),
        editTime: new Date().getTime(),
        is_delete: false // 表示失物是否找回
      }
    })
    return {
      code: 200,
      info: "提交成功"
    }
  }

}
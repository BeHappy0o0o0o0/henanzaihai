import {
  throttle,
  debounce,
} from "../../tools/tools"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    codename: "",
    phone: "",
    qq: "",
    wx: "",
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  sosCancel: debounce(function () {
    Dialog.confirm({
        title: '是否取消',
        message: '帮助登记未提交，离开后未提交内容将丢失，是否离开',
      })
      .then(() => {
                // 返回上一级页面。
                wx.navigateBack({
                  delta: 1,
                })
      })
      .catch(() => {
      });
  }, 200),
  fieldChange:function(event) {
    const name = event.currentTarget.dataset.name
    this.setData({
      [`${name}`]: event.detail
    })
  },
  submit: throttle(function(event){
    if(!this.data.phone && !this.data.qq && !this.data.wx){
      Toast.fail("请提供至少一种联系方式！")
    }
    let item = {}
    item.name = this.data.name
    item.codename = this.data.codename
    item.phone = this.data.phone
    item.qq = this.data.qq
    item.wx = this.data.wx
    item.content = this.data.content
    wx.cloud.callFunction({
      name: 'sos',
      data: {
        method: "add",
        item
      }
    }).then(
      res => {
        if(res.result.code == 200){
          Toast.success(res.result.info)
          wx.navigateBack({
            delta: 1,
          })
        }else{
          Toast.fail(res.result.info)
        }
      },
      err => {
        Toast.fail("提交失败，请稍后重试")
      }
    )
  }, 3000),
     // 编辑器
  // 富文本编辑器
  ready: function () {
    const that = this
    const query = wx.createSelectorQuery()
    query.select('#editora').context((res) => {
      that.editorCtx = res.context
      that.editorCtx.setContents({
        html: that.data.content
      })
    }).exec()
  },
  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  sosEditorFieldChange: debounce(function (e) {
    this.setData({
      content: e.detail.html,
    })
  }, 200),
  // 编辑器结束
})
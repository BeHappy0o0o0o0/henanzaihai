// 函数节流，在gapTime时间内，函数只执行一次
export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

// 函数防抖，调用函数后，延迟interval时间，执行，若在interval时间内，再次调用，清除旧的计时器，再次延迟interval时间执行。
export function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, gapTime);
  };
}

export function generateUUID() {
  var s = [];
  var hexDigits = "0123456789ABCDEFghijklmnopqrsduvwxyzabcdefJHIGKLMNOPQRSDUVWXYZ";
  for (var i = 0; i < 20; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[4] = s[9] = s[14] = "-";

  var uuid = s.join("");
  return uuid
}

// 消息订阅
export function subscription(template_id_list) {
  wx.requestSubscribeMessage({
    tmplIds: template_id_list, // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
    success(res) {
      console.log('已授权接收订阅消息')
      return res
    },
    fail(err){
      console.log(err)
      return err
    }
  })
}

// 多图/文件上传
export function uploadImgs(tempFilePaths, type) {
  var promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
    if (tempFilePath.url.substring(0, 4) != "cloud") {
      return new Promise(function (resolve, reject) {
        const url = tempFilePath.url
        const path = type + "/" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000)
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: url,
          success: function (res) {
            tempFilePath.url = res.fileID
            resolve(tempFilePath);
          },
          fail: function (err) {
            console.log(err)
            reject(new Error('failed to upload file'));
          }
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        resolve(tempFilePath);
      });
    }
  }));
  return promise
}
// 时间戳转时间 年月日+周几
export function formatDate(inputTime, type) {
  let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  var date = new Date(inputTime);
  var w = week[date.getDay()]
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  if (type == "detailed") {
    return y + '年' + m + '月' + d + '日(周' + w + ') ' + h + '时' + minute + '分';
  }
  if (type=="time"){
    return  d + '日' + h + '时' + minute + '分' +second+"秒";
  }
  return y + '年' + m + '月' + d + '日(周' + w + ')'
};

// 云存储图片保存到手机相册
export function saveNetworkImg(url) {
  wx.cloud.downloadFile({
    fileID: url,
    success: res => {
      console.log(res)
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000,
          })
        },
        fail: err => {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: true, //是否显示取消按钮
            cancelText: '否', //默认是“取消”
            confirmText: '是', //默认是“确定”
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                wx.openSetting({
                  success(settingdata) {
                    console.log('settingdata', settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      showMessage('获取权限成功,再次点击保存二维码')
                    } else {
                      showMessage('获取权限失败，将无法保存到相册哦')
                    }
                  },
                })
              }
            },
          })

          // wx.showModal({

          //   title: '提示',

          //   content: '需要您授权保存相册',

          //   showCancel: false,

          //   success: (modalSuccess) => {},

          // })

        },

      })

    },

    complete(res) {

      wx.hideLoading()

    },

  })
};

// 检查用户是否登录 判断openId
export function isLog() {
  const app = getApp()
  if(app.globalData.openId){
    return true
  }else{
    return false
  }
}

// 对字典数组进行排序
export function compare(propertyName) {
  return function (object1, object2) {
    var value1 = object1[propertyName]
    var value2 = object2[propertyName]
    if (value2 < value1) {
      return 1
    } else if (value2 > value1) {
      return -1
    } else {
      return 0
    }
  }
}

export function interval(faultDate,completeTime){
	var stime = Date.parse(new Date(faultDate));
	var etime = Date.parse(new Date(completeTime));
	var usedTime = etime - stime;  //两个时间戳相差的毫秒数
	var days=Math.floor(usedTime/(24*3600*1000));
	//计算出小时数
	var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000));
  // 计算相差的秒数
  var leave3 = leave2%(60*1000);
  var sce = Math.floor(leave3/1000)
	var time = days + "天"+hours+"时"+minutes+"分"+sce+"秒";
	return time;
}
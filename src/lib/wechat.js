import axios from 'axios';

const wexinAppId = WEIXIN_APPID;

// 获取签名
let getSignPromises = {};
exports.getSign = function(appId=wexinAppId) {
  if (getSignPromises[appId]) {
    return getSignPromises[appId];
  } 

  let promise = axios.get(
    'https://wechat-api.luoxin.com/weChat/getJsConfig', 
    {
      params: {
        appId: appId,
        url: window.location.href
      }
    }
  )
  .then((res) => {
    let data = res.data;

    if(!data || data.error != null){
      return Promise.reject(data.error);
    }

    return res.data.result;
  })
  .catch(res => {
    console.log(res);
    return Promise.reject(res);
  });

  getSignPromises[appId] = promise;

  return getSignPromises[appId];
}

// wx.config
let configPromises = {};
exports.config = function (url=window.location.href, appId) {
  if (configPromises[url]) return configPromises[url];
  
  let promise = exports.getSign(appId)
  .then((config) => {
    
    return new Promise((resolve, reject) => {
      wx.config({
        debug: false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'getLocation'
        ]
      });

      wx.ready(() => {
        resolve();
      });

      wx.error(res => {
        console.log('wx error:', res);
      });
    });
  });

  configPromises[url] = promise;

  return configPromises[url];
}

// sahre config
exports.share = function(info={}) {
  return exports.config()
  .then(() => {
    console.log(222);
    wx.onMenuShareTimeline({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl, // 分享图标
      success: function () {
        console.log('share success');
      }
    });

    wx.onMenuShareAppMessage({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl, // 分享图标
      success: function () {
        console.log('share success');
      }
    });
  });
}

// getLocation
exports.getLocation = function() {
  return exports.config()
  .then(() => {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度
          resolve(res);
        },
        fail(res) {
          reject({
            code: null,
            message: res.errMsg || 'getLocation fail'
          })
        }
      });
    }); 
  });
}


export function webviewWxReady() {
  return new Promise((resolve, reject) => {
    wx.miniProgram.getEnv(function(res) {
      if (!res.miniprogram) {
        reject({
          message: 'not in miniprogram'
        });
        return;
      }

      if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
        document.addEventListener('WeixinJSBridgeReady', resolve, false)
      } else {
        resolve()
      }
    });
  });
}
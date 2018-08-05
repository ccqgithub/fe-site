// 获取谷歌地图覆盖物
export function getGMapMarker() {
  if (typeof google != 'object' || !google.maps) {
    console.log('google map is not install');
    return null;
  }

  /*
    new CustomMarker(
      map, 
      {lng: xxx, lat: xxx}, 
      {...someArgs}
    ) 
  */
  function CustomMarker(map, latlng, args={}) {
    this.latlng = latlng;
    this.args = {
      ...args
    };
    this.setMap(map);
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function() {
    let self = this;
    let div = this._div;
    
    if (!div) {
      let panes = this.getPanes();

      div = this._div = document.createElement("div");      
      panes.overlayImage.appendChild(div);
    }

    let point = this.getProjection().fromLatLngToDivPixel(this.latlng);

    if (point) {
      div.style.left = point.x + 'px';
      div.style.top = point.y + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    if (this._div) {
      this._div.parentNode.removeChild(this._div);
      this._div = null;
    }
  };

  CustomMarker.prototype.getPosition = function() {
    return this.latlng;
  };

  CustomMarker.prototype.getDiv = function() {
    return this._div;
  };

  return CustomMarker;
}

// 获取百度地图覆盖物
export function getBMapMarker() {
  if (typeof BMap != 'object') {
    console.log('baidu map is not install');
    return null;
  }

  /*
    new CustomMarker(
      map, 
      {lng: xxx, lat: xxx}, 
      {...someArgs}
    ) 
  */
  function CustomMarker(map, latlng, args={}) {
    this.latlng = latlng;
    this.args = {
      ...args
    };
    this._div = document.createElement("div");
  }

  CustomMarker.prototype = new BMap.Overlay();
  CustomMarker.prototype.initialize = function(map) {
    let div = this._div;

    this._map = map;
    map.getPanes().labelPane.appendChild(div);

    return div;
  }

  CustomMarker.prototype.update = function(latlng) {
    this.latlng = latlng;
    this.draw();
  }

  CustomMarker.prototype.remove = function() {
    let map = this._map;
    let div = this._div;

    this._div = null;
    map.getPanes().labelPane.removeChild(div);
  }

  CustomMarker.prototype.draw = function() {
    let map = this._map;
    let point = new BMap.Point(this.latlng.lng, this.latlng.lat);
    let pixel = map.pointToOverlayPixel(point);

    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
  }

  CustomMarker.prototype.getDiv = function() {
    return this._div;
  };

  return CustomMarker;
}

// 动态加载谷歌地图
export function loadGMap(callback) {
  let callbacks = [];
  let key = GOOGLE_MAP_AK;

  // 已经加载
  if (typeof google == 'object' && google.maps) {
    return callback();
  }

  callbacks.push(callback);

  // 正则加载
  if (callbacks.length > 1) return;

  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `//maps.google.cn/maps/api/js?key=${key}`;
  document.body.appendChild(script);

  script.onload = script.onreadystatechange = function() {
   if (
     !this.readyState ||
     this.readyState === "loaded" ||
     this.readyState === "complete"
   ) {
      // callbacks
      while(callbacks.length) {
        callbacks.shift()();
      }

      // unbind
      script.onload = script.onreadystatechange = null;
   }
  };
}

// 动态加载百度地图
export function loadBMap(callback){
  let callbacks = [];
  let key = BAIDU_MAP_AK;

  // 已经加载
  if (typeof BMap == 'object') {
    return callback();
  }

  callbacks.push(callback);

  // 正则加载
  if (callbacks.length > 1) return;

  window.baidu_map_load_back = () => {
    while(callbacks.length) {
      callbacks.shift()();
    }
  }

  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://api.map.baidu.com/api?v=2.0&s=1&ak=${key}&callback=baidu_map_load_back`;
  document.body.appendChild(script);
}

/**
 * 通过百度地图api，批量转换经纬度
 * 每一批转换完调用一次callback
 * http://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
 * @param  {[type]} latlngs   [description]
 * @param  {[type]} cllback   [description]
 * @param  {Object} [args={}] [description]
 * @return {[type]}           [description]
 * 
 * convertBMapLatLng(
 *  [{lng: xxx, lat: xxx}],
 *  (result, offset) => {
 *    
 *  },
 *  5
 * )
 */
export function convertBMapLatLng(latlngs, callback, args={}) {
  let opts = {
    sliceLenth: 5, // 5个一批进行转换
    from: 1, // GPS设备获取的角度坐标，wgs84坐标;
    to: 5, // bd09ll(百度经纬度坐标),
    ...args
  }

  // 加载地图API js
  loadBMap(() => {
    let convertor = new BMap.Convertor()

    // translate
    function translate(points, offset) {
      let pointsArr = points.map(item => {
        return new BMap.Point(item.lng, item.lat);
      });

      convertor.translate(pointsArr, opts.from, opts.to, (data) => {
        if (data.status != 0) {
          console.log('坐标转换失败');
          return;
        }
        callback(data.points, offset);
      });
    }

    let arr = [];
    let findLength = 0;
    while (findLength < latlngs.length) {
      arr = latlngs.slice(findLength, findLength + opts.sliceLenth);
      translate(arr, findLength);
      findLength += opts.sliceLenth;
    }
  });
}

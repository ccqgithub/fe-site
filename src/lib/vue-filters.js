import Vue from 'vue';
import moment from 'moment';

// datetime时间格式化
Vue.filter('dateTime', function dateTime(
  value,
  format = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!value) return '';
  return moment(value).format(format);
});

// ellipsis
Vue.filter('ellipsis', function ellipsis(value, length = 100, fill = '...') {
  if (!value) return '';
  if (String(value).length <= length) return value;
  return String(value).substr(0, length) + fill;
});

// date时间格式化
Vue.filter('date', function date(value, format = 'YYYY-MM-DD') {
  if (!value) return '';
  return moment(value).format(format);
});

// 距离
Vue.filter('distance', function distance(value) {
  let val = Number(value);

  if (Number.isNaN(val)) return '0 m';
  if (val < 1000) return `${val} m`;

  val = (val / 1000).toFixed(1);

  if (String(val).split('.')[1] === '0') val = Math.floor(val);
  return `${val} km`;
});

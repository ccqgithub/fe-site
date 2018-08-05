/**
* superagent promise intercept plugin
* use to intercept superagent promise's `then` or `catch`

let beforePromise = superagentPromise(
  (res) => { 
    console.log(res);
    return res;
  },
  (err) => { 
    console.log(err);
    return Promise.reject(err);
  }
);

request
  // use plugin
  .use(beforePromise)
  .then(res => {})
  .catch(err => {});
*/
export default function superagentPromise(thenFn, catchFn) {
  return function(request) {
    request.originThen = request.then;
    request.then = function(resolveFn, rejectFn) {
      if (!thenFn && !catchFn) return request.originThen(resolveFn, rejectFn);
      return request
        .originThen(thenFn, catchFn)
        .then(resolveFn, rejectFn);
    }
  }
}
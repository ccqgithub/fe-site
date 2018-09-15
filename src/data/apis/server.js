import superagent from 'superagent';

const baseURL = API_BASEURL;

// agent
const api = superagent
  .agent()
  // intercept request
  .use((request) => {
    // set baseurl
    if (!/^https?:\/\//.test(request.url)) {
      let url = request.url.replace(/^\//, '');
      request.url = baseURL.replace(/\/$/, '') + url;
    }

    // set headers
    // headers
    // let token = 'xxx';
    // let locale = 'zh-CN'
    // request.set('Token', token);
    // request.set('Locale', locale);

    // type
    request.accept('json');

    return request;
  })
  // parse result
  .use((request) => {
    request.originThen = request.then;
    request.then = function then(resolveFn, rejectFn) {
      return request
        .originThen(
          (res) => {
            // if (res.body && res.body.code !== 200) {
            //   res.status = res.body.code;
            //   res.message = res.body.message;
            //   return Promise.reject(res);
            // }

            return res;
          },
          (err) => {
            // if (err.response.body) {
            //   return Promise.resolve(err.response.body);
            // }

            return Promise.reject(err);
          },
        )
        .then(resolveFn, rejectFn);
    };

    return request;
  });

export default api;

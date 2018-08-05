import superagent from 'superagent';
import superagentPromise from '../../lib/superagent-promise';

// agent
const agent = superagent.agent();

// before
const before = (request) => {
  // set baseurl
  const baseURL = GITHUB_API_BASEURL;
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
}

// before promise
const beforePromise = superagentPromise(
  (res) => {
    // if (res.code != 200) {
    //   res.status = res.code;
    //   res.message = res.message;
    //   return Promise.reject(res);
    // }
    return res;
  },
  (err) => {
    let res = err.response;
    res.message = err.message;
    return Promise.reject(res)
  }
);


// get
agent.apiGet = function(url, query={}, opts={}) {
  return this.get(url)
    .use(before)
    .use(beforePromise)
    .accept('json')
    .query(query);
}

// form
agent.apiForm = function(url, data={}, opts={}) {
  return this.post(url)
    .use(before)
    .use(beforePromise)
    .accept('json')
    .type('form')
    .send(data);
}

// form
agent.apiJson = function(url, data={}, opts={}) {
  return this.get(url)
    .use(before)
    .use(beforePromise)
    .accept('json')
    .type('json')
    .send(data);
}

export default agent;
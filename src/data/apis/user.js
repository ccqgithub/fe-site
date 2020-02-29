// user login
export function login({ username, password }) {
  let promise = new Promise((resolve, reject) => {
    // set a timeout, make it like a api
    setTimeout(() => {
      if (!username || !password) {
        return reject(new Error('请输入用户名密码'));
      }

      resolve({
        username,
        id: Date.now(),
      });
    }, 1000);
  });

  return promise;
}

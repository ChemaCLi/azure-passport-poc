import axios from 'axios'

const helpers = {
  isLogin (url, cb, errorCb) {
    axios(url, { method: 'GET', withCredentials: true }, cb, errorCb)
      .then(response => {
        console.log('islogin', response?.data);
        cb(response?.data);
      })
      .catch(error => {
        console.error(error);
        errorCb(error?.response?.data?.Result);
      });
  },
  getUser (url, cb, errorCb) {
    axios(url, { method: 'GET', withCredentials: true }, cb, errorCb)
      .then(response => {
        console.log('getUser', response?.data);
        cb(response?.data);
      })
      .catch(error => {
        console.error(error);
        errorCb(error?.response?.data?.Result);
      });
  }
}

export default helpers

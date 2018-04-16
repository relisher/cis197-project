export default function authenticatedRequest(type, url, body) {
  // what's going on
  // set the config  for our fetch requests to have a method equal to the type
  // headers with a single property 'auth-token' equal to the token we have stored
  // in localStorage
  //
  // if type === 'POST' then add another header 'Content-Type' equal to 'application/json'
  // additionall set the body of the config object equal to the JSON.stringified version of
  // the body passed in
  //
  // then return a promise of the fetch function called with url and config (note that
  // fetch is promisified. .then when a response comes through, if the response status
  // is not 200 then reject the promise (go to the next  .catch) else resolve it (continue
  // to next then in chain)
  let config = {
    method: type,
    headers: {
      'auth-token': localStorage.getItem('token'),
    }, // this line is important, if this content-type is not set it wont work
  };
  if (type === 'POST') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body ? body : {});
  }

  return fetch(url, config)
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    });
}

import request from 'superagent';

function extract(error) {
  if (error.response && error.response.body) {
    return error.response.body;
  } else if (error.response) {
    return error.response;
  } else { // eslint-disable-line no-else-return
    return error;
  }
}

export default function postWebReport({
  token,
  baseUrl,
  url,
  branch,
  report,
  result,
  }) {
  return new Promise((resolve, reject) =>
    request
    .post(`${baseUrl.replace(/\/+$/, '')}${url}`)
    .accept('json')
    .send({
      token,
      branch,
      report,
      result,
    })
    .end(error => error
      ? reject(extract(error))
      : resolve(result)));
}

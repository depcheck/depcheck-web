import request from 'superagent';

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
    .end(err => err ? reject(err.response.body) : resolve(result)));
}

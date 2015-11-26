import request from 'request';

export default function postWebReport({
  token,
  baseUrl,
  url,
  branch,
  report,
  result,
  }) {
  return new Promise((resolve, reject) =>
    request({
      baseUrl,
      url,
      method: 'POST',
      json: true,
      body: {
        token,
        branch,
        report,
        result,
      },
    }, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject(body);
      }

      resolve(result);
    }));
}

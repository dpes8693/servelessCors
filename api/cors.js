export default async function handler(request, response) {
  const https = require('https');

  // new
  const { headers } = request;
  
  // 檢查請求來源是否為本地主機（localhost）
  const origin = headers.origin || '';
  if (origin.includes('localhost')) {
    // 允許來自本地主機的跨域請求
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  // 
  
  let query = Object.entries(request.query);
  query.shift();
  let url = request.query.url;
  query.forEach(entry => {
    url += '&' + entry[0] + '=' + entry[1];
  });
  
  const { status, data } = await getRequest(url);
  
  response.status(status).send(data);

  function getRequest(url) {
    return new Promise(resolve => {
      const req = https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve({
            status: resp.statusCode,
            data: data
          });
        });
      });
    });
  }
}

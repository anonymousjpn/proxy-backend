const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT||3001;
app.use(cors({
  origin:'https://anonymousjpn.github.io'
})); 
app.use(express.json()); // JSONリクエストボディを解析
app.post('/proxy',(request, response) => {
  const { url, method} = request.body; // リクエストの内容を取得

  // fetchで外部APIにリクエスト
  fetch(url, {
    method: method,
    headers: {
      'User-Agent': 'Mozilla/5.0', 
    }
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .then(data => {
      // 外部APIからのレスポンスをクライアントに返す
      response.json(data);
    })
    .catch(error => {
      response.status(error.status || 500).json({
        error: error.message,
        details: error.data || null
      });
    });
});
app.listen(port, () => {
console.log(`Proxy server running on port ${port}`);
});

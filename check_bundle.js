const https = require('https');

https.get('https://hacktho.vercel.app/assets/index-BKopVHs7.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('JO=T.lazy(');
    console.log('Snippet around JO:', data.substring(idx - 50, idx + 200));
  });
});

const http = require('http');

http.get('http://localhost:3001/dashboard', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // try to scrape the error message out of the nuxt error HTML page
    const match = data.match(/"message":\s*"([^"]+)"/);
    const stack = data.match(/"stack":\s*"([^"]+)"/);
    console.log("Status Object:", res.statusCode);
    if(match) console.log("Message:", match[1]);
    if(stack) console.log("Stack:", stack[1].replace(/\\n/g, '\n'));
    console.log("Raw excerpt:", data.substring(0, 500));
  });
}).on("error", (err) => {
  console.log("Error:", err.message);
});

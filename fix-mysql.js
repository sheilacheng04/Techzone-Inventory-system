const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');
content = content.replace(
    "process.env.MYSQL_PASSWORD || 'Password'",
    "process.env.MYSQL_PASSWORD ?? ''"
);
fs.writeFileSync('server.js', content);
console.log('Done! MySQL password fallback fixed.');

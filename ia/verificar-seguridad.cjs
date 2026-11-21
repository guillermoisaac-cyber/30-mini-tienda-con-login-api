const { execFileSync } = require('node:child_process');
const files = execFileSync('git', ['ls-files', '--cached', '-z'], { cwd: process.cwd() }).toString().split('\0').filter(Boolean);
const bad = files.filter(f => /(^|\/)\.env($|\.)|\.(pem|p12|p8|jks|keystore)$|serviceAccountKey\.json/i.test(f) && !f.endsWith('.env.example'));
if (bad.length) { console.error('Secretos preparados para Git:', bad); process.exit(1); }
console.log('PASS: no hay archivos secretos preparados para Git');

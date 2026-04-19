const fs = require('fs');
const path = require('path');
const https = require('https');

const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
const token = JSON.parse(fs.readFileSync('./token.json', 'utf-8'));

const localDir = '../docs_strategy';
const folderId = '1hHURHdb3Q0i_mTImonbxT-FDONotiL2i';

function uploadFile(filePath, folderId) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);
    const boundary = '-------' + Date.now();
    
    const body = Buffer.from([
      `--${boundary}`,
      `Content-Disposition: form-data; name="metadata"; filename="metadata"`,
      'Content-Type: application/json',
      '',
      JSON.stringify({ name: fileName, parents: [folderId] }),
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
      'Content-Type: text/plain',
      '',
      fileContent.toString(),
      `--${boundary}--`
    ].join('\r\n'));

    const options = {
      hostname: 'www.googleapis.com',
      path: `/upload/drive/v3/files?uploadType=multipart`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
        'Content-Length': body.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) reject(new Error(json.error.message));
          else { console.log(`✓ ${fileName}`); resolve(json); }
        } catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const files = fs.readdirSync(localDir).filter(f => !f.startsWith('.'));
  files.sort();
  console.log(`Uploading ${files.length} files...\n`);
  
  for (const file of files) {
    try {
      await uploadFile(path.join(localDir, file), folderId);
    } catch (e) {
      console.error(`✗ ${file}: ${e.message}`);
    }
  }
  console.log('\n✓ Sync complete');
}

main();
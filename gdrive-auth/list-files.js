const fs = require('fs');
const { google } = require('googleapis');

const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
const token = JSON.parse(fs.readFileSync('./token.json', 'utf-8'));

const creds = credentials.installed;
const oauth2Client = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  'http://localhost'
);

oauth2Client.setCredentials(token);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

drive.files.list({
  q: "name contains 'docs_strategy' or name contains 'strategy'",
  pageSize: 50,
  fields: 'files(id, name, mimeType)'
}, (err, res) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Files:');
  res.data.files.forEach(f => console.log(`- ${f.name} (${f.mimeType})`));
});
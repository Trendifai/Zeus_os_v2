const fs = require('fs');
const { google } = require('googleapis');

const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
const creds = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  creds.redirect_uris[0]
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.readonly'],
});

console.log('Authorize this app by visiting this url:', authUrl);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('\nEnter the code from the authorization page: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error getting token:', err);
      process.exit(1);
    }
    fs.writeFileSync('./token.json', JSON.stringify(token, null, 2));
    console.log('Token stored in token.json - copy this to your code folder');
    readline.close();
  });
});
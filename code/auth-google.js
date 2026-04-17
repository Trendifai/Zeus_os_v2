const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const credentials = require('./credentials.json');

const oauth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.readonly'],
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nEnter the code from the authorization page: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error getting token:', err);
      process.exit(1);
    }
    fs.writeFileSync('./token.json', JSON.stringify(token, null, 2));
    console.log('Token stored in token.json');
    rl.close();
  });
});
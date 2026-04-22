const { spawn } = require('child_process');
const child = spawn('node', ['./node_modules/next/dist/bin/next', 'start', '-p', '3000'], {
  cwd: 'C:/Users/probook/Desktop/ZEUS_AGENTIA_V2',
  stdio: 'inherit',
  detached: true
});
child.on('error', console.error);
console.log('Started server with PID:', child.pid);
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

const PORT = 5432;

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function ensurePostgres() {
  const isOpen = await isPortOpen(PORT);
  if (isOpen) {
    console.log('[PostgreSQL Engine] ✓ Port 5432 is already active & accepting connections.');
    return;
  }

  console.log('[PostgreSQL Engine] ⚡ Starting local PostgreSQL cluster on port 5432...');
  const dbServerScript = path.resolve(__dirname, 'db-server.js');

  const child = spawn(process.execPath, [dbServerScript, 'start', '--daemon'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  // Poll port 5432 until ready
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isPortOpen(PORT)) {
      console.log('[PostgreSQL Engine] ✓ PostgreSQL started successfully on port 5432.');
      return;
    }
  }

  throw new Error('Timed out waiting for PostgreSQL to start on port 5432.');
}

async function main() {
  console.log('\n========================================================================');
  console.log('   NESTURE JOURNAL — FULL-STACK UNIFIED DEVELOPMENT ENVIRONMENT        ');
  console.log('========================================================================');
  console.log(' [1/3] Database Engine  : PostgreSQL 19 (Port 5432, Local)');
  console.log(' [2/3] Backend Core     : Next.js Route Handlers & Internal REST APIs');
  console.log(' [3/3] Frontend Portal  : Next.js App Router (React, Tailwind CSS, Lucide)');
  console.log('========================================================================\n');

  try {
    await ensurePostgres();
  } catch (err) {
    console.error('[Startup Error] Failed to start PostgreSQL:', err.message);
    process.exit(1);
  }

  console.log('\n[Full-Stack] Launching Next.js Server (Frontend + Backend APIs)...');
  console.log('[Full-Stack] Local URL -> http://localhost:3000\n');

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const nextDev = spawn(npxCmd, ['next', 'dev'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: process.env,
    shell: true,
  });

  const cleanup = () => {
    if (nextDev && !nextDev.killed) {
      nextDev.kill('SIGINT');
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  nextDev.on('close', (code) => {
    process.exit(code || 0);
  });
}

main();

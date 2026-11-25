const fs = require('fs');
const path = require('path');
const net = require('net');
const EmbeddedPostgres = require('embedded-postgres').default;

const DATA_DIR = path.resolve(__dirname, '..', '.pg_data');
const PID_FILE = path.resolve(DATA_DIR, 'pg_server.pid');
const PORT = 5432;
const USER = 'postgres';
const PASSWORD = 'postgres';
const DB_NAME = 'nesture_journal';

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

async function startServer() {
  const running = await isPortOpen(PORT);
  if (running) {
    console.log(`[PostgreSQL] Port ${PORT} is already accepting connections. PostgreSQL is up.`);
    return;
  }

  console.log(`[PostgreSQL] Initializing and starting local PostgreSQL on port ${PORT}...`);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    port: PORT,
    user: USER,
    password: PASSWORD,
    persistent: true,
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
  });

  const initialized = fs.existsSync(path.resolve(DATA_DIR, 'PG_VERSION'));
  if (!initialized) {
    console.log('[PostgreSQL] Initializing new database cluster in', DATA_DIR);
    await pg.initialise();
  }

  console.log('[PostgreSQL] Starting engine...');
  await pg.start();
  console.log(`[PostgreSQL] Server started on port ${PORT}.`);

  // Ensure nesture_journal database exists
  try {
    const client = pg.getPgClient();
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (res.rowCount === 0) {
      console.log(`[PostgreSQL] Creating database "${DB_NAME}" with UTF-8...`);
      await client.query(`CREATE DATABASE "${DB_NAME}" WITH ENCODING 'UTF8'`);
      console.log(`[PostgreSQL] Database "${DB_NAME}" created successfully.`);
    }
    await client.end();
  } catch (err) {
    console.warn('[PostgreSQL] Note on DB check:', err.message);
  }

  // Keep alive if run directly as daemon
  if (process.argv.includes('--daemon')) {
    console.log('[PostgreSQL] Running daemon mode. Press Ctrl+C to terminate.');
    process.on('SIGINT', async () => {
      console.log('[PostgreSQL] Stopping...');
      await pg.stop();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await pg.stop();
      process.exit(0);
    });
    // Wait forever
    await new Promise(() => {});
  }
}

async function stopServer() {
  console.log('[PostgreSQL] Stopping local database server...');
  const { execSync } = require('child_process');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM postgres.exe', { stdio: 'ignore' });
    } else {
      execSync('pkill postgres', { stdio: 'ignore' });
    }
    console.log('[PostgreSQL] Stopped.');
  } catch {
    console.log('[PostgreSQL] No running postgres process found.');
  }
}

async function checkStatus() {
  const open = await isPortOpen(PORT);
  if (open) {
    console.log(`[PostgreSQL] HEALTHY - Local PostgreSQL is running and accepting connections on port ${PORT}.`);
    process.exit(0);
  } else {
    console.log(`[PostgreSQL] INACTIVE - Port ${PORT} is not responding.`);
    process.exit(1);
  }
}

const command = process.argv[2] || 'start';
if (command === 'start') {
  startServer().catch((e) => {
    console.error('[PostgreSQL] Start error:', e);
    process.exit(1);
  });
} else if (command === 'stop') {
  stopServer().catch((e) => {
    console.error('[PostgreSQL] Stop error:', e);
    process.exit(1);
  });
} else if (command === 'status') {
  checkStatus().catch((e) => {
    console.error('[PostgreSQL] Status error:', e);
    process.exit(1);
  });
} else {
  console.log('Usage: node scripts/db-server.js [start|stop|status] [--daemon]');
}

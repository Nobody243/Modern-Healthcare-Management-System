import oracledb from 'oracledb';
import fs from 'fs';
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';

// Configure Oracle to fetch CLOBs as strings
oracledb.fetchAsString = [oracledb.CLOB];

// Global type declaration for hot-reloading singleton in development / serverless
declare global {
  // eslint-disable-next-line no-var
  var _oraclePool: oracledb.Pool | undefined;
  // eslint-disable-next-line no-var
  var _oracleWalletDir: string | undefined;
}

/**
 * Prepares the Oracle Cloud Autonomous Database wallet files from the Base64 environment variable.
 * Extracts into an ephemeral directory in /tmp (or os.tmpdir() across platforms).
 */
function prepareWallet(): string | null {
  const base64Wallet = process.env.ORACLE_WALLET_BASE64;
  if (!base64Wallet) {
    return null;
  }

  // Use /tmp/oracle_wallet on POSIX/Vercel, or os.tmpdir() fallback
  const tempBase = process.platform === 'win32' ? os.tmpdir() : '/tmp';
  const walletDir = path.join(tempBase, 'oracle_wallet');
  const zipPath = path.join(tempBase, 'wallet.zip');

  if (globalThis._oracleWalletDir && fs.existsSync(globalThis._oracleWalletDir)) {
    return globalThis._oracleWalletDir;
  }

  try {
    if (!fs.existsSync(walletDir)) {
      fs.mkdirSync(walletDir, { recursive: true });
    }

    // Check if wallet files already extracted
    const existingFiles = fs.readdirSync(walletDir);
    if (existingFiles.length === 0 || !fs.existsSync(path.join(walletDir, 'tnsnames.ora'))) {
      const cleanBase64 = base64Wallet.replace(/\s+/g, '');
      const walletBuffer = Buffer.from(cleanBase64, 'base64');

      // Write zip file to temp directory
      fs.writeFileSync(zipPath, walletBuffer);

      // Extract using AdmZip
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(walletDir, true);

      // Secure cleanup of the zip archive
      try {
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
        }
      } catch {
        // Ignore unlinking issues
      }
    }

    globalThis._oracleWalletDir = walletDir;
    return walletDir;
  } catch (error) {
    console.error('[Oracle DB] Error preparing ephemeral wallet:', error);
    throw new Error(`Failed to extract Oracle Wallet: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Returns or creates the singleton Oracle Connection Pool.
 */
export async function getPool(): Promise<oracledb.Pool> {
  if (globalThis._oraclePool) {
    return globalThis._oraclePool;
  }

  const user = process.env.ORACLE_USER || process.env.DB_USER;
  const password = process.env.ORACLE_PASSWORD || process.env.DB_PASSWORD;
  const connectString = process.env.ORACLE_TNS_NAME || process.env.DB_CONNECTION_STRING;
  const walletPassword = process.env.ORACLE_WALLET_PASSWORD;

  if (!user || !password || !connectString) {
    throw new Error(
      'Missing required Oracle credentials. Please provide ORACLE_USER, ORACLE_PASSWORD, and ORACLE_TNS_NAME (or DB_USER, DB_PASSWORD, DB_CONNECTION_STRING).'
    );
  }

  const walletDir = prepareWallet();

  const poolConfig: oracledb.PoolAttributes = {
    user,
    password,
    connectString,
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1,
    poolTimeout: 60,
  };

  if (walletDir) {
    poolConfig.configDir = walletDir;
    poolConfig.walletLocation = walletDir;
    if (walletPassword) {
      poolConfig.walletPassword = walletPassword;
    }
  }

  try {
    const pool = await oracledb.createPool(poolConfig);
    globalThis._oraclePool = pool;
    return pool;
  } catch (error) {
    console.error('[Oracle DB] Failed to create connection pool:', error);
    throw error;
  }
}

/**
 * Executes a query or DML/DDL statement with safe connection lifecycle management.
 * Returns the raw oracledb.Result object with OUT_FORMAT_OBJECT.
 */
export async function execute<T = any>(
  sql: string,
  params: oracledb.BindParameters = [],
  options: oracledb.ExecuteOptions = {}
): Promise<oracledb.Result<T>> {
  let connection: oracledb.Connection | null = null;
  try {
    const pool = await getPool();
    connection = await pool.getConnection();

    const result = await connection.execute<T>(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: options.autoCommit !== false,
      ...options,
    });

    return result;
  } catch (error) {
    console.error('[Oracle DB] Execution error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('[Oracle DB] Error releasing connection:', closeErr);
      }
    }
  }
}

/**
 * Executes a SELECT query and returns the rows array directly.
 */
export async function query<T = any>(
  sql: string,
  params: oracledb.BindParameters = [],
  options: oracledb.ExecuteOptions = {}
): Promise<T[]> {
  const result = await execute<T>(sql, params, options);
  return (result.rows as T[]) || [];
}

/**
 * Executes a SELECT query and returns a single row or null.
 */
export async function queryOne<T = any>(
  sql: string,
  params: oracledb.BindParameters = [],
  options: oracledb.ExecuteOptions = {}
): Promise<T | null> {
  const rows = await query<T>(sql, params, options);
  return rows && rows.length > 0 ? rows[0] : null;
}

/**
 * Gracefully closes the connection pool.
 */
export async function closePool(): Promise<void> {
  if (globalThis._oraclePool) {
    try {
      await globalThis._oraclePool.close(10);
    } catch (err) {
      console.error('[Oracle DB] Error closing pool:', err);
    } finally {
      globalThis._oraclePool = undefined;
    }
  }
}
